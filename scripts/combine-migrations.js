#!/usr/bin/env node

/**
 * Combine all migration files into a single SQL file
 * Usage: node scripts/combine-migrations.js
 */

const fs = require('fs');
const path = require('path');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');
const OUTPUT_FILE = path.join(__dirname, '..', 'supabase', 'combined-migration.sql');

// Migration files in order
const migrations = [
  '001_waitlist.sql',
  '002_add_role_column.sql',
  '002_waitlist_role.sql',
  '003_mvp_schema.sql',
  '004_add_user_insert_policy.sql',
  '005_add_anonymous_reviews.sql',
  '006_add_employer_fields.sql',
  '007_add_restaurant_insert_policy.sql',
  '008_fix_restaurant_insert_policy.sql',
  '20260130_employer_schema.sql',
];

console.log('🔄 Combining migrations...\n');

let combined = `-- ShiftCrew Combined Database Migration
-- Generated: ${new Date().toISOString()}
-- 
-- Run this in Supabase SQL Editor:
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Click "New query"
-- 4. Paste this entire file
-- 5. Click "Run"
--
-- Or use Supabase CLI:
-- supabase db push

`;

for (const migration of migrations) {
  const filePath = path.join(MIGRATIONS_DIR, migration);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    combined += `\n-- ========================================\n`;
    combined += `-- Migration: ${migration}\n`;
    combined += `-- ========================================\n\n`;
    combined += content;
    combined += '\n\n';
    console.log(`✅ Added ${migration}`);
  } else {
    console.log(`⚠️  Warning: ${migration} not found, skipping`);
  }
}

fs.writeFileSync(OUTPUT_FILE, combined, 'utf8');

console.log(`\n✅ Combined migration file created: ${OUTPUT_FILE}`);
console.log('\nNext steps:');
console.log('1. Review the file');
console.log('2. Run in Supabase SQL Editor (see instructions in file)');
console.log('   OR use Supabase CLI: supabase db push');
