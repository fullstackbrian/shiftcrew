# Database Migration Guide 🗄️

This guide explains how to run database migrations in Supabase for ShiftCrew.

## Option 1: Combined Migration File (Easiest) ⭐

### Step 1: Generate Combined Migration

Run the script to combine all migrations:

```bash
# Using Node.js (recommended)
node scripts/combine-migrations.js

# OR using bash
chmod +x scripts/run-migrations.sh
./scripts/run-migrations.sh
```

This creates `supabase/combined-migration.sql` with all migrations in order.

### Step 2: Run in Supabase Dashboard

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**
5. Open `supabase/combined-migration.sql` and copy all contents
6. Paste into the SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)

✅ Done! All tables, policies, and functions are created.

---

## Option 2: Supabase CLI (Automated) 🚀

### Setup Supabase CLI (One-time)

```bash
# Install Supabase CLI
npm install -g supabase

# OR using Homebrew (Mac)
brew install supabase/tap/supabase

# Login to Supabase
supabase login
```

### Link Your Project

```bash
# Link to your project (get project ref from Supabase dashboard URL)
supabase link --project-ref your-project-ref

# Example:
# supabase link --project-ref abcdefghijklmnop
```

### Run Migrations

```bash
# Push all migrations to production
supabase db push

# OR push to a specific database
supabase db push --db-url "postgresql://postgres:[password]@[host]:5432/postgres"
```

**Benefits:**
- ✅ Automatic migration tracking
- ✅ Can rollback if needed
- ✅ Works with CI/CD
- ✅ No copy/paste needed

---

## Option 3: Manual (One-by-One) 📋

If you prefer to run migrations individually:

1. Go to Supabase Dashboard → SQL Editor
2. For each file in `supabase/migrations/`, in order:
   - Open the file
   - Copy contents
   - Paste into SQL Editor
   - Run
   - Verify success

**Migration Order:**
1. `001_waitlist.sql`
2. `002_add_role_column.sql`
3. `002_waitlist_role.sql`
4. `003_mvp_schema.sql` ⭐ (Main schema)
5. `004_add_user_insert_policy.sql`
6. `005_add_anonymous_reviews.sql`
7. `006_add_employer_fields.sql`
8. `007_add_restaurant_insert_policy.sql`
9. `008_fix_restaurant_insert_policy.sql`
10. `20260130_employer_schema.sql`

---

## Verification ✅

After running migrations, verify everything is set up:

### Check Tables

Run this in SQL Editor:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should see:
-- jobs
-- restaurants
-- reviews
-- saved_jobs
-- users
-- waitlist
```

### Check RLS Policies

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Test Insert (Optional)

```sql
-- Test user creation (will be created automatically by Clerk)
-- Test restaurant creation
INSERT INTO restaurants (name, neighborhood) 
VALUES ('Test Restaurant', 'West Hollywood') 
RETURNING *;

-- Test job creation
INSERT INTO jobs (restaurant_id, title, pay_range, status) 
VALUES (
  (SELECT id FROM restaurants WHERE name = 'Test Restaurant'),
  'Server',
  '$20-25/hr',
  'active'
) 
RETURNING *;
```

---

## Troubleshooting 🔧

### Error: "relation already exists"

This means the table already exists. You can:
- Skip that migration (if it's idempotent with `IF NOT EXISTS`)
- Drop the table first: `DROP TABLE IF EXISTS table_name CASCADE;`
- Use `CREATE TABLE IF NOT EXISTS` (already in migrations)

### Error: "permission denied"

Make sure you're running as the postgres user or have proper permissions:
- In SQL Editor, you're automatically the postgres user ✅
- If using CLI, check your connection string has admin access

### Error: "policy already exists"

Similar to tables, policies might already exist. The migrations use `CREATE POLICY IF NOT EXISTS` where possible, but if you get this error:
- Drop the policy: `DROP POLICY IF EXISTS policy_name ON table_name;`
- Re-run the migration

### Migration Failed Midway

If a migration fails partway through:
1. Check the error message
2. Fix the issue (usually a syntax error or missing dependency)
3. Re-run from the failed migration onward
4. Or drop affected tables and re-run all migrations

---

## Production vs Development 🏭

### Development (Local)

If you're using Supabase CLI with local development:

```bash
# Start local Supabase
supabase start

# Run migrations locally
supabase db reset  # Resets and runs all migrations
```

### Production

**Always test migrations in a staging environment first!**

1. Create a staging Supabase project
2. Run migrations there first
3. Verify everything works
4. Then run in production

---

## Migration Best Practices 📚

1. **Always backup** before running migrations in production
2. **Test first** in a staging/dev environment
3. **Run in order** - migrations depend on each other
4. **Verify after** - check tables and policies were created
5. **Document changes** - note what each migration does

---

## Quick Reference 🚀

```bash
# Generate combined migration
node scripts/combine-migrations.js

# View combined migration
cat supabase/combined-migration.sql

# Run with Supabase CLI (if set up)
supabase db push
```

---

## Need Help? 💬

- Supabase Docs: https://supabase.com/docs/guides/database
- Supabase CLI Docs: https://supabase.com/docs/reference/cli
- SQL Editor: Dashboard → SQL Editor
