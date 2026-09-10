const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

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
    incomeLimit: row.income_limit !== null ? Number(row.income_limit) : null,
    minimumPercentage: row.minimum_percentage !== null ? Number(row.minimum_percentage) : null,
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

function insertOrUpdateScholarship(s) {
  const stmt = db.prepare(`
    INSERT INTO scholarships (
      id, slug, name, short_name, provider, state, type,
      education_levels, courses, categories, gender_eligibility,
      income_limit, minimum_percentage, year_eligibility,
      special_conditions, benefits, application_start, application_deadline,
      status, documents, description, who_can_apply, how_to_apply_steps,
      official_website, application_website, last_updated, tags
    ) VALUES (
      @id, @slug, @name, @shortName, @provider, @state, @type,
      @educationLevels, @courses, @categories, @genderEligibility,
      @incomeLimit, @minimumPercentage, @yearEligibility,
      @specialConditions, @benefits, @applicationStart, @applicationDeadline,
      @status, @documents, @description, @whoCanApply, @howToApplySteps,
      @officialWebsite, @applicationWebsite, @lastUpdated, @tags
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
      tags = excluded.tags
  `);

  stmt.run({
    id: s.id,
    slug: s.slug || s.id,
    name: s.name,
    shortName: s.shortName,
    provider: s.provider,
    state: s.state,
    type: s.type,
    educationLevels: JSON.stringify(s.educationLevels || []),
    courses: JSON.stringify(s.courses || []),
    categories: JSON.stringify(s.categories || []),
    genderEligibility: s.genderEligibility || 'All',
    incomeLimit: s.incomeLimit !== undefined && s.incomeLimit !== null ? Number(s.incomeLimit) : null,
    minimumPercentage: s.minimumPercentage !== undefined && s.minimumPercentage !== null ? Number(s.minimumPercentage) : null,
    yearEligibility: JSON.stringify(s.yearEligibility || []),
    specialConditions: JSON.stringify(s.specialConditions || {}),
    benefits: JSON.stringify(s.benefits || {}),
    applicationStart: s.applicationStart || '',
    applicationDeadline: s.applicationDeadline || '',
    status: s.status || 'Open',
    documents: JSON.stringify(s.documents || []),
    description: s.description || '',
    whoCanApply: JSON.stringify(s.whoCanApply || []),
    howToApplySteps: JSON.stringify(s.howToApplySteps || []),
    officialWebsite: s.officialWebsite || '',
    applicationWebsite: s.applicationWebsite || '',
    lastUpdated: s.lastUpdated || '',
    tags: JSON.stringify(s.tags || []),
  });
}

function getDatabaseStats() {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM scholarships').get();
  return {
    engine: 'SQLite',
    databaseFile: dbPath,
    totalScholarships: countRow.count,
    status: 'online',
  };
}

module.exports = {
  db,
  dbPath,
  getAllScholarships,
  getScholarshipByIdOrSlug,
  insertOrUpdateScholarship,
  getDatabaseStats,
};
