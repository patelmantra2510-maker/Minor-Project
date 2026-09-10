const fs = require('fs');
const path = require('path');
const { insertOrUpdateScholarship, getDatabaseStats } = require('../server/db.cjs');

async function seed() {
  console.log('🌱 Seeding SQLite database from scholarships.ts...');
  const filePath = path.resolve(__dirname, '../src/data/scholarships.ts');
  let content = fs.readFileSync(filePath, 'utf8');

  // Strip TypeScript export and imports
  content = content.replace(/import\s+type\s+[^;]+;/g, '');
  content = content.replace(/export\s+const\s+SCHOLARSHIPS_DATA\s*:\s*Scholarship\[\]\s*=\s*/, 'module.exports = ');

  const tempFile = path.resolve(__dirname, 'temp_scholarships.cjs');
  fs.writeFileSync(tempFile, content);

  const data = require(tempFile);
  console.log(`📦 Loaded ${data.length} scholarships to insert.`);

  let count = 0;
  for (const s of data) {
    insertOrUpdateScholarship(s);
    count++;
  }

  try {
    fs.unlinkSync(tempFile);
  } catch {}

  const stats = getDatabaseStats();
  console.log('✅ SQLite seeding complete!');
  console.log('Database Stats:', stats);
}

seed().catch(console.error);
