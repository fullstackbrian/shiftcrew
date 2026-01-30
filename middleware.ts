import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Define protected routes (require authentication)
const isProtectedRoute = createRouteMatcher([
  "/profile(.*)",
  "/review(.*)",
  "/employer(.*)",
  "/onboarding(.*)",
]);

// Routes that require employer role
const isEmployerRoute = createRouteMatcher(["/employer(.*)"]);

// Public routes (no auth required)
const isPublicRoute = createRouteMatcher([
  "/",
  "/browse(.*)",
  "/jobs(.*)",
  "/restaurants(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // If user is logged in, check if they have a role
  if (userId) {
    const pathname = req.nextUrl.pathname;
    
    // Skip role check if already on onboarding pages or public routes
    const isOnboardingPath = pathname.startsWith('/onboarding') || 
                            pathname.startsWith('/employer/onboarding');
    
    if (!isOnboardingPath && !isPublicRoute(req)) {
      try {
        // Create Supabase client for middleware (using request cookies)
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              getAll() {
                return req.cookies.getAll();
              },
              setAll(cookiesToSet) {
                // In middleware, we can't set cookies directly
                // But we don't need to for read-only queries
              },
            },
          }
        );
        
        const { data: user } = await supabase
          .from('users')
          .select('role, restaurant_id')
          .eq('clerk_user_id', userId)
          .single();
        
        // No role set - redirect to onboarding
        if (!user?.role) {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
        
        // Has employer role but trying to access worker routes (or vice versa)
        // Allow access to employer routes only if role is employer
        if (pathname.startsWith('/employer') && user.role !== 'employer') {
          return NextResponse.redirect(new URL('/browse', req.url));
        }
      } catch (error) {
        // If error fetching user, allow through (will be handled by page)
        console.error("Error checking user role in middleware:", error);
      }
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - static assets (svg, png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
