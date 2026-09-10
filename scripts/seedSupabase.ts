/**
 * EDVORA - SUPABASE SEEDING SCRIPT
 * Usage:
 *   npx tsx scripts/seedSupabase.ts
 *
 * This script reads all scholarships from `src/data/scholarships.ts`
 * and upserts them into your Supabase `scholarships` table.
 */

import { createClient } from '@supabase/supabase-js';
import { SCHOLARSHIPS_DATA } from '../src/data/scholarships';
import { mapScholarshipToRow } from '../src/services/scholarshipService';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
  console.error('\n❌ ERROR: Supabase credentials not found in .env file!');
  console.error('Please add your credentials to .env:');
  console.error('VITE_SUPABASE_URL=https://<your-project>.supabase.co');
  console.error('VITE_SUPABASE_ANON_KEY=<your-anon-key>\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log(`\n🚀 Starting Supabase Database Seeding for Edvora...`);
  console.log(`📡 Connecting to: ${supabaseUrl}`);
  console.log(`📦 Found ${SCHOLARSHIPS_DATA.length} scholarships to upload.\n`);

  const rows = SCHOLARSHIPS_DATA.map(mapScholarshipToRow);

  let successCount = 0;
  let failCount = 0;

  for (const row of rows) {
    process.stdout.write(`  ⏳ Uploading: "${row.name.slice(0, 40)}..." `);
    const { error } = await supabase.from('scholarships').upsert(row, { onConflict: 'id' });

    if (error) {
      console.log(`❌ Failed: ${error.message}`);
      failCount++;
    } else {
      console.log(`✅ Success`);
      successCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`🎉 Seeding complete!`);
  console.log(`   Uploaded: ${successCount}`);
  if (failCount > 0) {
    console.log(`   Failed:   ${failCount}`);
  }
  console.log(`========================================\n`);
}

seedDatabase().catch((err) => {
  console.error('Unexpected seeding error:', err);
  process.exit(1);
});
