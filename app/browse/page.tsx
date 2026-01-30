import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { JobCard } from "@/components/jobs/JobCard";
import { FilterForm } from "./FilterForm";
import { BrowseTabs } from "./BrowseTabs";
import { Header } from "@/components/landing/Header";
import { Button } from "@/components/ui/button";
import { getSavedJobIds } from "@/app/actions/jobs";
import { getCurrentUser } from "@/lib/clerk";
import type { Job, Restaurant } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 30; // Revalidate every 30 seconds (good balance for job listings)

export const metadata = {
  title: "Browse Restaurant Jobs - ShiftCrew",
  description: "Browse 30+ LA restaurant jobs with verified pay ranges and culture reviews. See what workers really make before you apply. Find server, bartender, cook, and dishwasher jobs.",
  keywords: [
    "restaurant jobs Los Angeles",
    "LA restaurant jobs",
    "server jobs",
    "bartender jobs",
    "cook jobs",
    "verified pay",
    "restaurant culture reviews",
    "hospitality jobs LA",
  ],
};

// Cache key for memoization (in production, you'd use React Query or similar)
async function getJobs(filters: {
  search?: string;
  position?: string; // comma-separated positions
  neighborhood?: string;
  restaurant?: string;
}) {
  // Note: Supabase queries are fast and cached at the database level
  // For future optimization with Indeed/Glassdoor scraping:
  // - Use React Query with stale-while-revalidate
  // - Cache job listings for 5-10 minutes
  // - Invalidate cache when new jobs are added
  // Parse positions (comma-separated)
  const parsePositions = (positionParam?: string): string[] => {
    if (!positionParam || positionParam === "all") return [];
    return positionParam.split(",").map((p) => p.trim()).filter(Boolean);
  };
  
  const positions = parsePositions(filters.position);
  
  // Filter out "all" values and empty strings
  const actualFilters = {
    search: filters.search?.trim() || undefined,
    positions: positions.length > 0 ? positions : undefined,
    neighborhood: filters.neighborhood && filters.neighborhood !== "all" ? filters.neighborhood.trim() : undefined,
    restaurant: filters.restaurant?.trim() || undefined,
  };
  
  try {
    const supabase = await createClient();

    // Build restaurant filter query
    let restaurantIds: string[] | null = null;
    if (actualFilters.neighborhood || actualFilters.restaurant) {
      let restaurantQuery = supabase.from("restaurants").select("id, name");
      
      if (actualFilters.neighborhood) {
        restaurantQuery = restaurantQuery.eq("neighborhood", actualFilters.neighborhood);
      }
      
      if (actualFilters.restaurant) {
        // Exact match first, then partial match
        restaurantQuery = restaurantQuery.or(
          `name.ilike.%${actualFilters.restaurant}%,name.eq.${actualFilters.restaurant}`
        );
      }
      
      const { data: restaurants, error: restaurantError } = await restaurantQuery;
      
      if (restaurantError) {
        console.error("Error fetching restaurants:", restaurantError);
        return [];
      }
      
      restaurantIds = restaurants?.map((r) => r.id) || null;
      if (restaurantIds && restaurantIds.length === 0) {
        return []; // No restaurants matching filters
      }
    }

    // Build jobs query
    let query = supabase
      .from("jobs")
      .select("*, restaurant:restaurants(*)")
      .eq("status", "active");

    // Apply restaurant filter
    if (restaurantIds) {
      query = query.in("restaurant_id", restaurantIds);
    }

    // Apply position filters - multiple positions with OR logic
    // This will match "Line Cook", "Line Cook - Full Time", "Cook", etc.
    if (actualFilters.positions && actualFilters.positions.length > 0) {
      // Build OR condition for multiple positions
      const positionConditions = actualFilters.positions.map((pos) => {
        const escapedPosition = pos.replace(/[%_]/g, "\\$&");
        return `title.ilike.%${escapedPosition}%`;
      });
      query = query.or(positionConditions.join(","));
    }

    // Note: Search filter is applied in post-processing to handle restaurant names
    // and to properly combine with position filters (AND logic)

    query = query.order("posted_date", { ascending: false, nullsFirst: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching jobs:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return [];
    }

    // Post-process filtering for restaurant name search and to combine search + position filters
    let filteredData = (data || []) as (Job & { restaurant?: Restaurant })[];
    
    // Apply search filter in post-processing (handles restaurant name and combines with position filters)
    if (actualFilters.search) {
      const searchLower = actualFilters.search.toLowerCase().trim();
      
      if (searchLower) {
        filteredData = filteredData.filter((job) => {
          const restaurant = job.restaurant;
          const titleMatch = job.title?.toLowerCase().includes(searchLower) || false;
          const descMatch = job.description?.toLowerCase().includes(searchLower) || false;
          const restaurantMatch = restaurant?.name?.toLowerCase().includes(searchLower) || false;
          const matchesSearch = titleMatch || descMatch || restaurantMatch;
          
          // If position filters exist, job must match BOTH search AND position (AND logic)
          if (actualFilters.positions && actualFilters.positions.length > 0) {
            const matchesPosition = actualFilters.positions.some((pos) => {
              const posLower = pos.toLowerCase();
              return job.title?.toLowerCase().includes(posLower);
            });
            return matchesSearch && matchesPosition;
          }
          
          return matchesSearch;
        });
      }
    } else if (actualFilters.positions && actualFilters.positions.length > 0) {
      // If only position filters (no search), ensure they're applied correctly
      // This is a safety check - positions should already be filtered in SQL
      const positionLower = actualFilters.positions.map((p) => p.toLowerCase());
      filteredData = filteredData.filter((job) => {
        const jobTitleLower = job.title?.toLowerCase() || "";
        return positionLower.some((pos) => jobTitleLower.includes(pos));
      });
    }
    
    // Additional filter: if restaurant filter is set, ensure match
    if (actualFilters.restaurant && filteredData.length > 0) {
      const restaurantLower = actualFilters.restaurant.toLowerCase();
      filteredData = filteredData.filter((job) => {
        const restaurant = job.restaurant;
        return restaurant?.name?.toLowerCase().includes(restaurantLower);
      });
    }
    
    // Remove duplicates (in case OR query returns same job multiple times)
    const seenIds = new Set<string>();
    filteredData = filteredData.filter((job) => {
      if (seenIds.has(job.id)) {
        return false;
      }
      seenIds.add(job.id);
      return true;
    });

    return filteredData as (Job & { restaurant: Restaurant })[];
  } catch (err) {
    console.error("Unexpected error in getJobs:", err);
    return [];
  }
}

async function getNeighborhoods() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("restaurants")
      .select("neighborhood")
      .not("neighborhood", "is", null);

    if (error) {
      console.error("Error fetching neighborhoods:", error);
      return [];
    }

    const neighborhoods = new Set(
      data?.map((r) => r.neighborhood).filter(Boolean) || []
    );
    return Array.from(neighborhoods).sort();
  } catch (err) {
    console.error("Unexpected error in getNeighborhoods:", err);
    return [];
  }
}

async function getSavedJobs(userId: string) {
  try {
    const supabase = await createClient();
    
    const { data: savedJobs, error } = await supabase
      .from("saved_jobs")
      .select("job_id")
      .eq("user_id", userId);
    
    if (error || !savedJobs) {
      return [];
    }
    
    const jobIds = savedJobs.map((sj) => sj.job_id);
    if (jobIds.length === 0) {
      return [];
    }
    
    const { data: jobs, error: jobsError } = await supabase
      .from("jobs")
      .select("*, restaurant:restaurants(*)")
      .in("id", jobIds)
      .eq("status", "active")
      .order("posted_date", { ascending: false, nullsFirst: false });
    
    if (jobsError || !jobs) {
      return [];
    }
    
    return jobs as (Job & { restaurant: Restaurant })[];
  } catch (err) {
    console.error("Error fetching saved jobs:", err);
    return [];
  }
}

async function getRestaurantJobCounts(restaurantIds: string[]) {
  try {
    if (restaurantIds.length === 0) {
      return new Map<string, number>();
    }
    
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("jobs")
      .select("restaurant_id")
      .in("restaurant_id", restaurantIds)
      .eq("status", "active");
    
    if (error || !data) {
      return new Map<string, number>();
    }
    
    const counts = new Map<string, number>();
    data.forEach((job) => {
      const currentCount = counts.get(job.restaurant_id) || 0;
      counts.set(job.restaurant_id, currentCount + 1);
    });
    
    return counts;
  } catch (err) {
    console.error("Error fetching restaurant job counts:", err);
    return new Map<string, number>();
  }
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; position?: string; neighborhood?: string; restaurant?: string; tab?: string }>;
}) {
  // Try to get user, but don't require auth
  let user = null;
  try {
    const { getCurrentUser } = await import("@/lib/clerk");
    user = await getCurrentUser();
    
    // Redirect employers to their dashboard (they manage jobs, not browse them)
    if (user?.role === "employer") {
      redirect("/employer/dashboard");
    }
  } catch (error) {
    // User not authenticated - that's OK, allow public browsing
  }
  
  // Await searchParams (Next.js 15+ requirement)
  const params = await searchParams;
  
  const activeTab = params.tab || "all";
  const neighborhoods = await getNeighborhoods();
  
  // Fetch jobs based on active tab
  const allJobs = activeTab === "saved" ? [] : await getJobs(params);
  const savedJobs = activeTab === "saved" && user ? await getSavedJobs(user.id) : [];
  
  // Get saved job IDs for the current user (to show saved status on cards)
  const savedJobIds = user && activeTab !== "saved" ? await getSavedJobIds(user.id) : [];
  
  const jobs = activeTab === "saved" ? savedJobs : allJobs;

  // Get unique restaurant IDs from all jobs
  const restaurantIds = Array.from(
    new Set(jobs.map((job) => job.restaurant?.id).filter(Boolean) as string[])
  );
  
  // Fetch actual job counts per restaurant from database
  const restaurantJobCounts = await getRestaurantJobCounts(restaurantIds);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-neutral-900 md:text-5xl">
            Browse Jobs
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            Find restaurant jobs with real transparency
          </p>
        </div>

        {/* Tabs */}
        <BrowseTabs hasUser={!!user}>
          {{
            all: (
              <>
                {/* Filters - only show on All Jobs tab */}
                <Suspense fallback={<div className="mb-8 h-32 animate-pulse rounded bg-neutral-200" />}>
                  <FilterForm 
                    neighborhoods={neighborhoods}
                    initialRestaurant={params.restaurant}
                  />
                </Suspense>

                {/* Job Listings */}
                <Suspense fallback={<div className="text-center py-12">Loading jobs...</div>}>
                  {jobs.length === 0 ? (
                    <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
                      <p className="text-lg text-neutral-600">No jobs found matching your criteria.</p>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {jobs.map((job) => (
                        <JobCard 
                          key={job.id} 
                          job={job} 
                          isSaved={savedJobIds.includes(job.id)}
                          restaurantJobCount={job.restaurant?.id ? restaurantJobCounts.get(job.restaurant.id) : undefined}
                        />
                      ))}
                    </div>
                  )}
                </Suspense>
              </>
            ),
            saved: (
              <>
                {!user ? (
                  <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
                    <p className="text-lg font-semibold text-neutral-900">Sign up to save jobs</p>
                    <p className="mt-2 text-sm text-neutral-600">
                      Create a free account to save jobs and track your applications.
                    </p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                      <Button asChild size="lg">
                        <Link href="/sign-up">Sign Up Free</Link>
                      </Button>
                      <Button asChild variant="outline" size="lg">
                        <Link href="/sign-in">Sign In</Link>
                      </Button>
                    </div>
                  </div>
                ) : jobs.length === 0 ? (
                  <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
                    <p className="text-lg text-neutral-600">You haven't saved any jobs yet.</p>
                    <p className="mt-2 text-sm text-neutral-500">
                      Browse jobs and click the bookmark icon to save them.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                      <JobCard 
                        key={job.id} 
                        job={job} 
                        isSaved={true} // All jobs in saved tab are saved
                        restaurantJobCount={job.restaurant?.id ? restaurantJobCounts.get(job.restaurant.id) : undefined}
                      />
                    ))}
                  </div>
                )}
              </>
            ),
          }}
        </BrowseTabs>
      </div>
    </div>
  );
}
