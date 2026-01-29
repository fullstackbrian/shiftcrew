# ShiftCrew - Project Status

**Last Updated:** January 28, 2026  
**Current Phase:** Landing Page Complete  
**Next Phase:** Authentication (Week 2)

## Quick Summary
ShiftCrew is a LinkedIn + Glassdoor for restaurant workers. Workers see verified pay, read location-specific culture reviews, build professional profiles. Built by crew, for crew.

## What Works Now
✅ Landing page with email capture  
✅ Supabase integration configured  
✅ Waitlist table and server action  
✅ Green/Orange color scheme  
✅ Roboto + Roboto Mono fonts  

## What's Next
⏳ Auth (signup/login for workers & employers)  
⏳ Worker profile creation flow  
⏳ Job browse & detail pages  
⏳ Employer dashboard  

## Important Context
- **Founder:** Ex-server for 10 years, knows the pain
- **Target:** West Hollywood launch first
- **MVP Goal:** 500 workers, 30 employers, 20 hires in 3 months
- **Differentiation:** Verified pay transparency + location-specific reviews
- **NOT building:** Social feed, AI features (Phase 2+)

## File Structure
See CHANGELOG.md for detailed file structure.

## Environment Setup
Need: Supabase project with .env.local containing:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

## Database
Current tables: waitlist
Pending tables (in PRD): profiles, work_experience, skills, certifications, employers, jobs, applications, employer_reviews, worker_ratings

## Design System
- Primary: Green #22c55e
- Secondary: Orange #f97316
- Fonts: Roboto (text), Roboto Mono (numbers)
- Mobile-first, Shadcn UI components

---
