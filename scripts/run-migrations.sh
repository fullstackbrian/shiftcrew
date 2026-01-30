#!/bin/bash

# ShiftCrew Database Migration Runner
# This script combines all migration files in order and outputs a single SQL file
# You can then run this in Supabase SQL Editor or use Supabase CLI

set -e

MIGRATIONS_DIR="supabase/migrations"
OUTPUT_FILE="supabase/combined-migration.sql"

echo "🔄 Combining migrations..."

# Start with a header
cat > "$OUTPUT_FILE" << 'EOF'
-- ShiftCrew Combined Database Migration
-- Generated: $(date)
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

EOF

# Add each migration file in order
for migration in \
  "001_waitlist.sql" \
  "002_add_role_column.sql" \
  "002_waitlist_role.sql" \
  "003_mvp_schema.sql" \
  "004_add_user_insert_policy.sql" \
  "005_add_anonymous_reviews.sql" \
  "006_add_employer_fields.sql" \
  "007_add_restaurant_insert_policy.sql" \
  "008_fix_restaurant_insert_policy.sql" \
  "20260130_employer_schema.sql"
do
  if [ -f "$MIGRATIONS_DIR/$migration" ]; then
    echo "" >> "$OUTPUT_FILE"
    echo "-- ========================================" >> "$OUTPUT_FILE"
    echo "-- Migration: $migration" >> "$OUTPUT_FILE"
    echo "-- ========================================" >> "$OUTPUT_FILE"
    echo "" >> "$OUTPUT_FILE"
    cat "$MIGRATIONS_DIR/$migration" >> "$OUTPUT_FILE"
    echo "✅ Added $migration"
  else
    echo "⚠️  Warning: $migration not found, skipping"
  fi
done

echo ""
echo "✅ Combined migration file created: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "1. Review the file: cat $OUTPUT_FILE"
echo "2. Run in Supabase SQL Editor (see instructions in file)"
echo "   OR use Supabase CLI: supabase db push"
