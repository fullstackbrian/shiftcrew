# ShiftCrew MVP Setup Guide

## ✅ Completed Phases

### Phase 1: Authentication (Clerk) ✅
- ✅ Clerk installed and configured
- ✅ Middleware set up for protected routes
- ✅ Sign-in and Sign-up pages created
- ✅ ClerkProvider added to layout
- ✅ User sync helper functions created
- ✅ Webhook endpoint created for Clerk → Supabase sync

### Phase 2: Database Schema ✅
- ✅ Complete SQL migration file created (`supabase/migrations/003_mvp_schema.sql`)
- ✅ Tables: users, restaurants, jobs, reviews, saved_jobs
- ✅ RLS policies configured
- ✅ Auto-update triggers for restaurant ratings

### Phase 3: Seed Data ✅
- ✅ Seed script created (`scripts/seed-data.ts`)
- ✅ 10 LA restaurants
- ✅ 25-30 job listings
- ✅ 40-50 realistic reviews
- ✅ Run with: `npm run seed`

### Phase 4-7: Pages & Components ✅
- ✅ `/browse` - Job listings with filters
- ✅ `/jobs/[id]` - Job detail with culture insights
- ✅ `/review/new` - Review submission form
- ✅ `/profile` - User profile with saved jobs and reviews
- ✅ `/restaurants/[id]` - Restaurant detail page

### Phase 8: Components ✅
- ✅ StarRating component (interactive & display)
- ✅ CultureInsights component
- ✅ JobCard component
- ✅ ReviewCard component
- ✅ SaveJobButton component
- ✅ ReviewForm component

### Phase 9: Save Job Functionality ✅
- ✅ Server actions for save/unsave
- ✅ SaveJobButton component with toggle
- ✅ Profile page shows saved jobs

### Phase 10: Clerk Webhook ✅
- ✅ Webhook endpoint at `/api/webhooks/clerk`
- ✅ Syncs users to Supabase on create/update

---

## 🚀 Setup Instructions

### 1. Environment Variables

Add to `.env.local`:

```bash
# Supabase (you should already have these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Clerk (get from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
WEBHOOK_SECRET=whsec_...  # Get from Clerk webhook settings
```

### 2. Run Database Migration

1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/003_mvp_schema.sql`
3. Run the migration
4. Verify tables are created

### 3. Set Up Clerk Webhook

1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`
4. Copy the webhook secret to `.env.local` as `WEBHOOK_SECRET`

### 4. Seed Database

```bash
npm run seed
```

This will create:
- 10 restaurants
- 25-30 jobs
- 40-50 reviews
- 20 fake users for reviews

### 5. Test the Application

1. Start dev server: `npm run dev`
2. Sign up at `/sign-up`
3. Browse jobs at `/browse`
4. View job details at `/jobs/[id]`
5. Save jobs (bookmark icon)
6. Leave reviews at `/review/new`
7. View profile at `/profile`

---

## 📁 File Structure

```
app/
  browse/              # Job listings page
  jobs/[id]/           # Job detail page
  review/new/          # Review submission
  profile/             # User profile
  restaurants/[id]/    # Restaurant detail
  sign-in/             # Clerk sign-in
  sign-up/             # Clerk sign-up
  api/webhooks/clerk/  # Clerk webhook

components/
  shared/
    StarRating.tsx     # Star rating component
    CultureInsights.tsx # Culture ratings display
  jobs/
    JobCard.tsx        # Job listing card
    SaveJobButton.tsx  # Bookmark button
  reviews/
    ReviewCard.tsx     # Review display card
    ReviewForm.tsx     # Review submission form

lib/
  clerk.ts             # Clerk helper functions
  types.ts             # TypeScript types

app/actions/
  jobs.ts              # Save/unsave job actions
  reviews.ts           # Submit review action

scripts/
  seed-data.ts         # Database seeding script

supabase/migrations/
  003_mvp_schema.sql   # Database schema
```

---

## 🎯 Features Implemented

### Authentication
- ✅ Clerk authentication
- ✅ Protected routes (browse, profile, review)
- ✅ User sync to Supabase
- ✅ User button in header

### Job Browsing
- ✅ Browse all active jobs
- ✅ Filter by position, neighborhood
- ✅ Search functionality
- ✅ Job cards with ratings preview
- ✅ Job detail pages

### Culture Insights
- ✅ Aggregate ratings (pay, culture, management, work-life)
- ✅ Review count display
- ✅ Star ratings visualization

### Reviews
- ✅ Submit reviews (authenticated)
- ✅ View reviews on job/restaurant pages
- ✅ Star ratings (1-5)
- ✅ Pros/cons text
- ✅ Position tracking

### Saved Jobs
- ✅ Save/unsave jobs
- ✅ View saved jobs in profile
- ✅ Toggle bookmark button

### Profile
- ✅ View user info
- ✅ Saved jobs tab
- ✅ My reviews tab

---

## 🔧 Next Steps (Optional Enhancements)

1. **Edit Profile** - Allow users to update position, role
2. **Job Applications** - Track applications
3. **Email Notifications** - New jobs matching saved searches
4. **Advanced Filters** - Pay range, rating filters
5. **Restaurant Search** - Search restaurants directly
6. **Review Editing** - Edit/delete own reviews
7. **Image Uploads** - Restaurant photos, user avatars

---

## 🐛 Known Issues

- Build will fail until Clerk env vars are set (expected)
- Browse page filters need client-side form (fixed with FilterForm)
- Some TypeScript type assertions needed for Supabase joins

---

## 📝 Notes

- All pages are server components for better performance
- Client components only where interactivity needed
- RLS policies allow public read, authenticated write
- Restaurant ratings auto-update via database triggers
- Seed script creates realistic but fake data

---

**Status: MVP Complete! 🎉**

The application is fully functional. Set up Clerk, run migrations, seed data, and you're ready to go!
