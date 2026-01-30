# Pre-Launch Checklist 🚀

## 🔐 Environment & Configuration

### Environment Variables
- [ ] `.env.local` file created with all required variables:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - [ ] `CLERK_SECRET_KEY`
  - [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
  - [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
  - [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding`
  - [ ] `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding`

### Database Setup
- [ ] All migrations run successfully in Supabase
- [ ] RLS policies enabled and tested
- [ ] Test data seeded (optional but helpful)
- [ ] Database backups configured

### Clerk Setup
- [ ] Clerk application created
- [ ] Sign-in/Sign-up URLs configured in Clerk dashboard
- [ ] Webhook endpoint configured (`/api/webhooks/clerk`)
- [ ] Email templates customized (optional)

## 🧪 Core Functionality Tests

### Authentication Flow
- [ ] **New User Signup:**
  - [ ] Can sign up with email
  - [ ] Redirects to `/onboarding` after signup
  - [ ] Role selection page displays correctly
  - [ ] Selecting "Worker" redirects to `/browse`
  - [ ] Selecting "Employer" redirects to `/employer/onboarding`
  - [ ] User created in Supabase with `role: null` initially

- [ ] **Existing User Sign In:**
  - [ ] Can sign in with existing account
  - [ ] Redirects appropriately based on role
  - [ ] No redirect to onboarding if role already set

- [ ] **Onboarding Protection:**
  - [ ] Users without role redirected to `/onboarding` by middleware
  - [ ] Users with role redirected away from `/onboarding`

### Public Browsing (No Auth Required)
- [ ] **Browse Page (`/browse`):**
  - [ ] Loads without authentication
  - [ ] Shows all jobs
  - [ ] Filters work (search, position, neighborhood)
  - [ ] "Saved Jobs" tab shows signup prompt when not logged in
  - [ ] "Saved Jobs" tab shows saved jobs when logged in

- [ ] **Job Detail Page (`/jobs/[id]`):**
  - [ ] Loads without authentication
  - [ ] Shows full job details
  - [ ] Shows reviews
  - [ ] Shows culture insights
  - [ ] "Save Job" button shows signup modal when not authenticated
  - [ ] "Apply" button shows signup modal when not authenticated
  - [ ] Both buttons work normally when authenticated

- [ ] **Restaurant Page (`/restaurants/[id]`):**
  - [ ] Loads without authentication
  - [ ] Shows restaurant details
  - [ ] Shows all reviews
  - [ ] Shows open positions
  - [ ] "Leave a Review" button shows signup modal when not authenticated

### Authenticated Features
- [ ] **Job Saving:**
  - [ ] Can save jobs when logged in
  - [ ] Can unsave jobs
  - [ ] Saved jobs appear in "Saved Jobs" tab
  - [ ] Save status persists across page refreshes

- [ ] **Job Application:**
  - [ ] "Apply" button opens external link when authenticated
  - [ ] Opens in new tab with proper security (`noopener noreferrer`)

- [ ] **Review Submission:**
  - [ ] Can submit reviews when authenticated
  - [ ] Reviews appear on restaurant page
  - [ ] Reviews appear on job detail page

- [ ] **Profile Page:**
  - [ ] Accessible when authenticated
  - [ ] Shows user information
  - [ ] Redirects to sign-up if not authenticated

### Employer Features
- [ ] **Employer Dashboard:**
  - [ ] Accessible only to users with `role: "employer"`
  - [ ] Shows restaurant information
  - [ ] Shows job listings
  - [ ] Shows applications

- [ ] **Employer Onboarding:**
  - [ ] Can complete restaurant setup
  - [ ] Can post jobs after onboarding

## 🎨 UI/UX Checks

### Responsive Design
- [ ] **Mobile (< 768px):**
  - [ ] Header navigation works
  - [ ] Browse page filters stack correctly
  - [ ] Job cards display properly
  - [ ] Forms are usable
  - [ ] Modals display correctly

- [ ] **Tablet (768px - 1024px):**
  - [ ] Layout adapts appropriately
  - [ ] Grid layouts work

- [ ] **Desktop (> 1024px):**
  - [ ] Full layout displays correctly
  - [ ] Hover states work

### Visual Consistency
- [ ] Maroon color theme (`#A52A2A`) used consistently
- [ ] Burnt orange accents (`#D6895A`) used appropriately
- [ ] Text logo displays correctly (Playfair Display font)
- [ ] Slogan displays correctly
- [ ] Role badge appears in UserButton dropdown
- [ ] No green colors remaining from old theme

### Interactive Elements
- [ ] Hover states work on buttons, links, cards
- [ ] Loading states display during async operations
- [ ] Error messages display appropriately
- [ ] Success feedback works (e.g., job saved)
- [ ] Form validation works
- [ ] Modals open/close correctly

### Navigation
- [ ] Header links work correctly
- [ ] "Browse Jobs" visible for all users
- [ ] Sign In/Sign Up buttons visible when not authenticated
- [ ] UserButton visible when authenticated
- [ ] Role badge visible in dropdown when authenticated
- [ ] No broken links

## 🐛 Error Handling

### User-Facing Errors
- [ ] 404 page for non-existent jobs/restaurants
- [ ] Error messages for failed API calls
- [ ] Graceful handling of missing data
- [ ] Network error handling

### Developer Errors
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Server logs are clean

## ⚡ Performance

### Build & Deploy
- [ ] `npm run build` succeeds without errors
- [ ] No build warnings
- [ ] Production build works locally
- [ ] Deploy to Vercel/similar succeeds

### Runtime Performance
- [ ] Pages load quickly (< 2s initial load)
- [ ] Images optimized (if any)
- [ ] Database queries optimized
- [ ] No unnecessary re-renders
- [ ] Smooth transitions/animations

## 🔒 Security

### Authentication
- [ ] Protected routes require authentication
- [ ] Public routes accessible without auth
- [ ] Middleware correctly enforces auth
- [ ] Role-based access control works

### Data Security
- [ ] RLS policies prevent unauthorized access
- [ ] User can only see/modify their own data
- [ ] No sensitive data exposed in client-side code
- [ ] API routes properly secured

## 📱 Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## 🧹 Code Quality

- [ ] No unused imports
- [ ] No console.log statements (except for errors)
- [ ] Code follows project conventions
- [ ] Comments added where needed
- [ ] TypeScript types are correct

## 📋 Content & Copy

- [ ] All text is correct and professional
- [ ] No placeholder text remaining
- [ ] Error messages are user-friendly
- [ ] Button labels are clear
- [ ] Form labels are descriptive

## 🚨 Critical Paths to Test

### Happy Paths
1. **New User Journey:**
   - Sign up → Onboarding → Browse → Save job → Apply

2. **Returning User Journey:**
   - Sign in → Browse → View job → Save → Apply

3. **Employer Journey:**
   - Sign up → Onboarding → Select Employer → Complete setup → Post job

### Edge Cases
- [ ] User closes browser during signup
- [ ] User tries to access protected route without auth
- [ ] User tries to save job without auth (should show modal)
- [ ] User tries to apply without auth (should show modal)
- [ ] User with no role tries to browse (should redirect to onboarding)
- [ ] User tries to access employer routes as worker (should redirect)

## 📊 Analytics & Monitoring (Optional but Recommended)

- [ ] Analytics tool configured (e.g., Vercel Analytics, Google Analytics)
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Performance monitoring set up
- [ ] User behavior tracking (optional)

## ✅ Final Checks

- [ ] All tests pass (if you have tests)
- [ ] README.md updated with setup instructions
- [ ] .env.example file is up to date
- [ ] No sensitive data in git history
- [ ] Git commits are clean and organized
- [ ] Ready to push to production

---

## 🎯 Quick Smoke Test (5 minutes)

Run through these quickly before deploying:

1. Sign up as new user → Should redirect to onboarding
2. Select "Worker" role → Should redirect to browse
3. Browse jobs → Should see job listings
4. Click a job → Should see job details
5. Try to save job (not logged in) → Should see signup modal
6. Sign in → Should work
7. Save a job → Should work
8. Check "Saved Jobs" tab → Should see saved job

If all of these work, you're in good shape! 🎉
