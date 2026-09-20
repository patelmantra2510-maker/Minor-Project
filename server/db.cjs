const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const dbDir = path.resolve(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'edvora.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for high-concurrency read/write
db.pragma('journal_mode = WAL');

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS scholarships (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    provider TEXT NOT NULL,
    state TEXT NOT NULL,
    type TEXT NOT NULL,
    education_levels TEXT NOT NULL,
    courses TEXT NOT NULL,
    categories TEXT NOT NULL,
    gender_eligibility TEXT NOT NULL,
    income_limit REAL,
    minimum_percentage REAL,
    year_eligibility TEXT NOT NULL,
    special_conditions TEXT,
    benefits TEXT NOT NULL,
    application_start TEXT NOT NULL,
    application_deadline TEXT NOT NULL,
    status TEXT NOT NULL,
    documents TEXT NOT NULL,
    description TEXT NOT NULL,
    who_can_apply TEXT NOT NULL,
    how_to_apply_steps TEXT NOT NULL,
    official_website TEXT NOT NULL,
    application_website TEXT NOT NULL,
    last_updated TEXT NOT NULL,
    tags TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_scholarships_slug ON scholarships(slug);
  CREATE INDEX IF NOT EXISTS idx_scholarships_state ON scholarships(state);
  CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
`);

// Safe migrations: Check and add is_verified and is_featured columns if not present
try {
  const tableInfo = db.prepare('PRAGMA table_info(scholarships)').all();
  const columnNames = tableInfo.map((c) => c.name);

  if (!columnNames.includes('is_verified')) {
    db.exec('ALTER TABLE scholarships ADD COLUMN is_verified INTEGER DEFAULT 1;');
  }
  if (!columnNames.includes('is_featured')) {
    db.exec('ALTER TABLE scholarships ADD COLUMN is_featured INTEGER DEFAULT 0;');
  }
} catch (e) {
  console.warn('[SQLite Migration Warning]:', e.message);
}

// Activity logs table for full admin auditing
db.exec(`
  CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_activity_created ON admin_activity_logs(created_at);
`);

// Set default featured scholarships on first run if none marked yet
try {
  const featuredCountRow = db.prepare('SELECT COUNT(*) as count FROM scholarships WHERE is_featured = 1').get();
  if (featuredCountRow.count === 0) {
    const defaultFeatured = ['mysy-gujarat', 'aicte-pragati-scholarship', 'pm-usp-csss-national', 'kotak-kanya-scholarship'];
    const updateStmt = db.prepare('UPDATE scholarships SET is_featured = 1 WHERE id = ?');
    for (const fid of defaultFeatured) {
      updateStmt.run(fid);
    }
  }
} catch (e) {}

// Simple and secure token authentication for admin actions
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'edvora_admin_secure_salt_key_2026';
const ADMIN_DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

function generateAdminToken() {
  return crypto.createHmac('sha256', ADMIN_SECRET).update(`admin_session_${new Date().toDateString()}`).digest('hex');
}

function verifyAdminPassword(password) {
  return password === ADMIN_DEFAULT_PASSWORD;
}

function verifyAdminToken(token) {
  if (!token) return false;
  const expected = generateAdminToken();
  return token === expected;
}

function logActivity(action, entityType, entityId, details) {
  try {
    const stmt = db.prepare(`
      INSERT INTO admin_activity_logs (action, entity_type, entity_id, details)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(action, entityType, entityId || '', details || '');
  } catch (err) {
    console.warn('[Activity Log Error]:', err.message);
  }
}

function parseRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    provider: row.provider,
    state: row.state,
    type: row.type,
    educationLevels: JSON.parse(row.education_levels || '[]'),
    courses: JSON.parse(row.courses || '[]'),
    categories: JSON.parse(row.categories || '[]'),
    genderEligibility: row.gender_eligibility,
    incomeLimit: row.income_limit !== null && row.income_limit !== undefined ? Number(row.income_limit) : null,
    minimumPercentage: row.minimum_percentage !== null && row.minimum_percentage !== undefined ? Number(row.minimum_percentage) : null,
    yearEligibility: JSON.parse(row.year_eligibility || '[]'),
    specialConditions: JSON.parse(row.special_conditions || '{}'),
    benefits: JSON.parse(row.benefits || '{}'),
    applicationStart: row.application_start,
    applicationDeadline: row.application_deadline,
    status: row.status,
    documents: JSON.parse(row.documents || '[]'),
    description: row.description,
    whoCanApply: JSON.parse(row.who_can_apply || '[]'),
    howToApplySteps: JSON.parse(row.how_to_apply_steps || '[]'),
    officialWebsite: row.official_website,
    applicationWebsite: row.application_website,
    lastUpdated: row.last_updated,
    tags: JSON.parse(row.tags || '[]'),
    isVerified: row.is_verified === 1 || row.is_verified === null || row.is_verified === undefined,
    isFeatured: row.is_featured === 1,
    createdAt: row.created_at,
  };
}

function getAllScholarships() {
  const rows = db.prepare('SELECT * FROM scholarships ORDER BY name ASC').all();
  return rows.map(parseRow);
}

function getScholarshipByIdOrSlug(idOrSlug) {
  const row = db
    .prepare('SELECT * FROM scholarships WHERE id = ? OR slug = ?')
    .get(idOrSlug, idOrSlug);
  return parseRow(row);
}

function insertOrUpdateScholarship(s, source = 'system') {
  const isExisting = db.prepare('SELECT id FROM scholarships WHERE id = ?').get(s.id);

  const isVerifiedVal = s.isVerified === false ? 0 : 1;
  const isFeaturedVal = s.isFeatured ? 1 : 0;

  const stmt = db.prepare(`
    INSERT INTO scholarships (
      id, slug, name, short_name, provider, state, type,
      education_levels, courses, categories, gender_eligibility,
      income_limit, minimum_percentage, year_eligibility,
      special_conditions, benefits, application_start, application_deadline,
      status, documents, description, who_can_apply, how_to_apply_steps,
      official_website, application_website, last_updated, tags,
      is_verified, is_featured
    ) VALUES (
      @id, @slug, @name, @shortName, @provider, @state, @type,
      @educationLevels, @courses, @categories, @genderEligibility,
      @incomeLimit, @minimumPercentage, @yearEligibility,
      @specialConditions, @benefits, @applicationStart, @applicationDeadline,
      @status, @documents, @description, @whoCanApply, @howToApplySteps,
      @officialWebsite, @applicationWebsite, @lastUpdated, @tags,
      @isVerified, @isFeatured
    )
    ON CONFLICT(id) DO UPDATE SET
      slug = excluded.slug,
      name = excluded.name,
      short_name = excluded.short_name,
      provider = excluded.provider,
      state = excluded.state,
      type = excluded.type,
      education_levels = excluded.education_levels,
      courses = excluded.courses,
      categories = excluded.categories,
      gender_eligibility = excluded.gender_eligibility,
      income_limit = excluded.income_limit,
      minimum_percentage = excluded.minimum_percentage,
      year_eligibility = excluded.year_eligibility,
      special_conditions = excluded.special_conditions,
      benefits = excluded.benefits,
      application_start = excluded.application_start,
      application_deadline = excluded.application_deadline,
      status = excluded.status,
      documents = excluded.documents,
      description = excluded.description,
      who_can_apply = excluded.who_can_apply,
      how_to_apply_steps = excluded.how_to_apply_steps,
      official_website = excluded.official_website,
      application_website = excluded.application_website,
      last_updated = excluded.last_updated,
      tags = excluded.tags,
      is_verified = excluded.is_verified,
      is_featured = excluded.is_featured
  `);

  stmt.run({
    id: s.id,
    slug: s.slug || s.id,
    name: s.name,
    shortName: s.shortName || s.name,
    provider: s.provider,
    state: s.state || 'All India',
    type: s.type || 'Government',
    educationLevels: JSON.stringify(s.educationLevels || []),
    courses: JSON.stringify(s.courses || ['All']),
    categories: JSON.stringify(s.categories || ['All']),
    genderEligibility: s.genderEligibility || 'All',
    incomeLimit: s.incomeLimit !== undefined && s.incomeLimit !== null ? Number(s.incomeLimit) : null,
    minimumPercentage: s.minimumPercentage !== undefined && s.minimumPercentage !== null ? Number(s.minimumPercentage) : null,
    yearEligibility: JSON.stringify(s.yearEligibility || ['All']),
    specialConditions: JSON.stringify(s.specialConditions || {}),
    benefits: JSON.stringify(s.benefits || { amountDescription: '' }),
    applicationStart: s.applicationStart || '',
    applicationDeadline: s.applicationDeadline || '',
    status: s.status || 'Open',
    documents: JSON.stringify(s.documents || []),
    description: s.description || '',
    whoCanApply: JSON.stringify(s.whoCanApply || []),
    howToApplySteps: JSON.stringify(s.howToApplySteps || []),
    officialWebsite: s.officialWebsite || '',
    applicationWebsite: s.applicationWebsite || '',
    lastUpdated: s.lastUpdated || new Date().toISOString().slice(0, 10),
    tags: JSON.stringify(s.tags || []),
    isVerified: isVerifiedVal,
    isFeatured: isFeaturedVal,
  });

  if (isExisting) {
    logActivity('UPDATE', 'scholarship', s.id, `Updated scholarship "${s.name}" (${source})`);
  } else {
    logActivity('CREATE', 'scholarship', s.id, `Added new scholarship "${s.name}" (${source})`);
  }
}

function deleteScholarship(idOrSlug) {
  const existing = getScholarshipByIdOrSlug(idOrSlug);
  if (!existing) return false;

  db.prepare('DELETE FROM scholarships WHERE id = ? OR slug = ?').run(idOrSlug, idOrSlug);
  logActivity('DELETE', 'scholarship', existing.id, `Deleted scholarship "${existing.name}"`);
  return true;
}

function toggleScholarshipFeature(idOrSlug, isFeatured) {
  const existing = getScholarshipByIdOrSlug(idOrSlug);
  if (!existing) return null;

  const val = isFeatured ? 1 : 0;
  db.prepare('UPDATE scholarships SET is_featured = ? WHERE id = ? OR slug = ?').run(val, idOrSlug, idOrSlug);
  logActivity('FEATURE_TOGGLE', 'scholarship', existing.id, `${isFeatured ? 'Featured' : 'Unfeatured'} "${existing.shortName}"`);
  return getScholarshipByIdOrSlug(idOrSlug);
}

function toggleScholarshipVerify(idOrSlug, isVerified) {
  const existing = getScholarshipByIdOrSlug(idOrSlug);
  if (!existing) return null;

  const val = isVerified ? 1 : 0;
  db.prepare('UPDATE scholarships SET is_verified = ? WHERE id = ? OR slug = ?').run(val, idOrSlug, idOrSlug);
  logActivity('VERIFY_TOGGLE', 'scholarship', existing.id, `${isVerified ? 'Verified' : 'Unverified'} "${existing.shortName}"`);
  return getScholarshipByIdOrSlug(idOrSlug);
}

function getActivityLogs(limit = 25) {
  return db.prepare('SELECT * FROM admin_activity_logs ORDER BY created_at DESC LIMIT ?').all(limit);
}

function getCategoriesWithCount() {
  const all = getAllScholarships();
  const categoryCounts = {};
  const educationCounts = {};
  const typeCounts = {};

  all.forEach((s) => {
    // Categories
    (s.categories || []).forEach((c) => {
      categoryCounts[c] = (categoryCounts[c] || 0) + 1;
    });
    // Education levels
    (s.educationLevels || []).forEach((e) => {
      educationCounts[e] = (educationCounts[e] || 0) + 1;
    });
    // Types
    if (s.type) {
      typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
    }
  });

  return {
    socialCategories: categoryCounts,
    educationLevels: educationCounts,
    scholarshipTypes: typeCounts,
    totalDistinctCategories: Object.keys(categoryCounts).length,
  };
}

function getDatabaseStats() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM scholarships').get();
  const verifiedRow = db.prepare('SELECT COUNT(*) as count FROM scholarships WHERE is_verified = 1 OR is_verified IS NULL').get();
  const unverifiedRow = db.prepare('SELECT COUNT(*) as count FROM scholarships WHERE is_verified = 0').get();
  const featuredRow = db.prepare('SELECT COUNT(*) as count FROM scholarships WHERE is_featured = 1').get();
  const openRow = db.prepare("SELECT COUNT(*) as count FROM scholarships WHERE status = 'Open'").get();
  const gujaratRow = db.prepare("SELECT COUNT(*) as count FROM scholarships WHERE state = 'Gujarat'").get();
  const allIndiaRow = db.prepare("SELECT COUNT(*) as count FROM scholarships WHERE state = 'All India'").get();

  let dbSizeBytes = 0;
  try {
    const stat = fs.statSync(dbPath);
    dbSizeBytes = stat.size;
  } catch (e) {}

  return {
    engine: 'SQLite',
    databaseFile: dbPath,
    databaseSizeBytes: dbSizeBytes,
    databaseSizeFormatted: `${(dbSizeBytes / 1024).toFixed(1)} KB`,
    totalScholarships: countRow.count,
    verifiedCount: verifiedRow.count,
    unverifiedCount: unverifiedRow.count,
    featuredCount: featuredRow.count,
    openCount: openRow.count,
    stateDistribution: {
      gujarat: gujaratRow.count,
      allIndia: allIndiaRow.count,
    },
    status: 'online',
  };
}

function getAdminDashboardStats() {
  const stats = getDatabaseStats();
  const categories = getCategoriesWithCount();
  const recentUpdated = db.prepare('SELECT * FROM scholarships ORDER BY last_updated DESC, created_at DESC LIMIT 5').all().map(parseRow);
  const recentActivity = getActivityLogs(10);

  return {
    ...stats,
    categories,
    recentUpdated,
    recentActivity,
  };
}

module.exports = {
  db,
  dbPath,
  getAllScholarships,
  getScholarshipByIdOrSlug,
  insertOrUpdateScholarship,
  deleteScholarship,
  toggleScholarshipFeature,
  toggleScholarshipVerify,
  getDatabaseStats,
  getAdminDashboardStats,
  getActivityLogs,
  getCategoriesWithCount,
  verifyAdminPassword,
  verifyAdminToken,
  generateAdminToken,
  logActivity,
};
