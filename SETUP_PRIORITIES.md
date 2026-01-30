# ShiftCrew MVP Setup - Priority Order

## 🎯 Priority 1: Database Setup (REQUIRED - Do This First)

**Why:** Without the database tables, nothing will work.

### Steps:
1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy the migration file:**
   - Open `supabase/migrations/003_mvp_schema.sql`
   - Copy ALL the SQL code
3. **Paste and Run** in Supabase SQL Editor
4. **Verify tables created:**
   - Check that you see: `users`, `restaurants`, `jobs`, `reviews`, `saved_jobs`
   - You can verify in Supabase Dashboard → Table Editor

**Time:** ~2 minutes  
**Blocks:** Everything else

---

## 🎯 Priority 2: Environment Variables (REQUIRED)

**Why:** App needs Supabase connection to work.

### Steps:
1. **Get Supabase keys:**
   - Go to Supabase Dashboard → Settings → API
   - Copy:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (for seeding)

2. **Add to `.env.local`:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. **Restart dev server** (if running)

**Time:** ~3 minutes  
**Blocks:** Database queries

---

## 🎯 Priority 3: Seed Database (RECOMMENDED - For Testing)

**Why:** You need data to see the app working.

### Steps:
1. **Make sure Priority 1 & 2 are done**
2. **Run seed script:**
   ```bash
   npm run seed
   ```
3. **Verify data:**
   - Check Supabase Table Editor
   - Should see ~10 restaurants, ~25-30 jobs, ~40-50 reviews

**Time:** ~1 minute  
**Blocks:** Seeing actual content

---

## 🎯 Priority 4: Test Basic Features (No Auth Needed)

**Why:** Verify core functionality works before adding auth.

### Test These Pages:
1. ✅ **Landing page** (`/`) - Should work immediately
2. ✅ **Browse jobs** (`/browse`) - Should show jobs after seeding
3. ✅ **Job detail** (`/jobs/[id]`) - Click any job card
4. ✅ **Restaurant page** (`/restaurants/[id]`) - View restaurant details

**What works without Clerk:**
- ✅ Viewing jobs
- ✅ Viewing restaurants
- ✅ Viewing reviews
- ✅ Culture insights

**What requires Clerk:**
- ❌ Sign up / Sign in
- ❌ Save jobs (bookmark)
- ❌ Leave reviews
- ❌ View profile

**Time:** ~5 minutes  
**Blocks:** Nothing (can test immediately)

---

## 🎯 Priority 5: Clerk Setup (For Auth Features)

**Why:** Enables user accounts, saving jobs, leaving reviews.

### Steps:
1. **Create Clerk account:**
   - Go to https://clerk.com
   - Sign up (free tier is fine)
   - Create a new application

2. **Get Clerk keys:**
   - Dashboard → API Keys
   - Copy:
     - `Publishable key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
     - `Secret key` → `CLERK_SECRET_KEY`

3. **Add to `.env.local`:**
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

4. **Set up Clerk Webhook:**
   - Clerk Dashboard → Webhooks → Add Endpoint
   - URL: `https://your-domain.com/api/webhooks/clerk` (or use ngrok for local: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`)
   - Events: `user.created`, `user.updated`
   - Copy webhook secret → `WEBHOOK_SECRET` in `.env.local`

5. **Restart dev server**

**Time:** ~10 minutes  
**Blocks:** Auth features only

---

## 🎯 Priority 6: Test Auth Features

**After Clerk is set up:**
1. ✅ Sign up at `/sign-up`
2. ✅ Sign in at `/sign-in`
3. ✅ Save jobs (bookmark button)
4. ✅ Leave reviews at `/review/new`
5. ✅ View profile at `/profile`

**Time:** ~5 minutes

---

## 📋 Quick Checklist

- [ ] **Priority 1:** Run database migration (`003_mvp_schema.sql`)
- [ ] **Priority 2:** Add Supabase env vars to `.env.local`
- [ ] **Priority 3:** Run `npm run seed`
- [ ] **Priority 4:** Test `/browse` page (should show jobs)
- [ ] **Priority 5:** Set up Clerk (optional for now)
- [ ] **Priority 6:** Test auth features (after Clerk setup)

---

## 🚨 If Something Breaks

**Error: "relation does not exist"**
→ Priority 1 not done (run migration)

**Error: "Missing publishableKey"**
→ Priority 5 not done (Clerk keys missing - OK for browsing)

**Error: "No jobs found"**
→ Priority 3 not done (run seed script)

**Error: "permission denied"**
→ Check RLS policies in Supabase (migration should have set these correctly)

---

## ⚡ Fastest Path to Working App

**Minimum to see it working:**
1. Run migration (Priority 1) - 2 min
2. Add Supabase keys (Priority 2) - 3 min
3. Seed database (Priority 3) - 1 min
4. Visit `/browse` - Should work! ✅

**Total: ~6 minutes**

**For full MVP:**
+ Add Clerk setup (Priority 5) - 10 min
+ Test auth features (Priority 6) - 5 min

**Total: ~21 minutes**

---

## 🎯 Recommended Order

**Today:**
1. ✅ Priority 1 (Database)
2. ✅ Priority 2 (Env vars)
3. ✅ Priority 3 (Seed)
4. ✅ Priority 4 (Test browse)

**Tomorrow/When ready:**
5. Priority 5 (Clerk)
6. Priority 6 (Test auth)

This way you can see the core app working immediately, then add auth when you're ready!
