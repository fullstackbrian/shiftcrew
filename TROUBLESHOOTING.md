# Troubleshooting Guide

## Error: "Error fetching jobs: {}"

This error occurs when the database tables don't exist yet. Here's how to fix it:

### Step 1: Run Database Migration

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/003_mvp_schema.sql`
4. Paste and run it
5. Verify tables are created:
   - `users`
   - `restaurants`
   - `jobs`
   - `reviews`
   - `saved_jobs`

### Step 2: Seed the Database

After running the migration, seed the database with test data:

```bash
npm run seed
```

This requires `SUPABASE_SERVICE_ROLE_KEY` in your `.env.local`.

### Step 3: Verify Environment Variables

Make sure you have these in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Needed for seeding
```

### Common Issues

**Issue: Empty error object `{}`**
- **Cause**: Tables don't exist or RLS policies blocking access
- **Fix**: Run the migration SQL script

**Issue: "relation does not exist"**
- **Cause**: Migration hasn't been run
- **Fix**: Run `003_mvp_schema.sql` in Supabase SQL Editor

**Issue: "permission denied"**
- **Cause**: RLS policies too restrictive
- **Fix**: Check that RLS policies allow public read access for restaurants and jobs

**Issue: Clerk errors**
- **Cause**: Missing Clerk keys
- **Fix**: Add Clerk keys to `.env.local` (optional for browsing jobs, required for auth features)

### Testing Without Clerk

You can test the browse page without Clerk by:
1. Running the migration
2. Seeding the database
3. Visiting `/browse` - should work without auth

Auth is only required for:
- `/profile`
- `/review/new`
- Saving jobs
