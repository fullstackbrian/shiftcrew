import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/clerk";
import { getSavedJobIds } from "@/app/actions/jobs";
import { Header } from "@/components/landing/Header";
import { PreviewBanner } from "@/components/PreviewBanner";
import { CultureInsights } from "@/components/shared/CultureInsights";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { SaveJobButton } from "@/components/jobs/SaveJobButton";
import { JobDetailActions } from "@/components/jobs/JobDetailActions";
import { LeaveReviewButton } from "@/components/reviews/LeaveReviewButton";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import type { Job, Restaurant, Review } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: job } = await supabase
    .from("jobs")
    .select("*, restaurant:restaurants(*)")
    .eq("id", id)
    .single();

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  const restaurant = job.restaurant as Restaurant | null;
  const payInfo = job.pay_range ? ` Pay: ${job.pay_range}.` : "";
  const location = restaurant?.neighborhood ? ` in ${restaurant.neighborhood}, LA` : " in Los Angeles";
  const restaurantName = restaurant?.name || "Restaurant";
  
  return {
    title: `${job.title} at ${restaurantName}${location}`,
    description: `${job.title} position at ${restaurantName}${location}.${payInfo} See verified pay, culture reviews, and what workers really make. Apply now.`,
    keywords: [
      `${job.title} jobs`,
      `${restaurantName} jobs`,
      `restaurant jobs ${restaurant?.neighborhood || "Los Angeles"}`,
      "verified pay",
      "restaurant culture reviews",
    ],
  };
}

async function getJob(id: string) {
  try {
    const supabase = await createClient();

    // Fetch job and restaurant separately to avoid relation query issues
    const { data: jobData, error: jobError } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .single();
      
    if (jobError) {
      console.error("Error fetching job:", {
        message: jobError.message,
        code: jobError.code,
        details: jobError.details,
        hint: jobError.hint,
        jobId: id,
      });
      return null;
    }
    
    if (!jobData) {
      console.error("No job found for id:", id);
      return null;
    }
    
    // Fetch restaurant separately
    if (!jobData.restaurant_id) {
      console.error("Job missing restaurant_id:", jobData);
      return null;
    }
    
    const { data: restaurantData, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", jobData.restaurant_id)
      .single();
      
    if (restaurantError) {
      console.error("Error fetching restaurant:", {
        message: restaurantError.message,
        code: restaurantError.code,
        details: restaurantError.details,
        hint: restaurantError.hint,
        restaurantId: jobData.restaurant_id,
      });
      return null;
    }
    
    if (!restaurantData) {
      console.error("No restaurant found for id:", jobData.restaurant_id);
      return null;
    }
    
    return { ...jobData, restaurant: restaurantData } as Job & { restaurant: Restaurant };
  } catch (err) {
    console.error("Unexpected error in getJob:", {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
      jobId: id,
    });
    return null;
  }
}

async function getReviews(restaurantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*, user:users(name)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    return [];
  }

  // Handle cases where user might be null (deleted user, etc.)
  return (data || []).map((review: any) => ({
    ...review,
    user: review.user || { name: null },
  })) as (Review & { user?: { name: string | null } })[];
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    console.error("Invalid job ID format:", id);
    notFound();
  }
  
  const job = await getJob(id);

  if (!job) {
    notFound();
  }

  const reviews = await getReviews(job.restaurant_id);
  
  // Try to get user, but don't fail if Clerk isn't set up
  let user = null;
  let savedJobIds: string[] = [];
  let isSaved = false;
  
  try {
    user = await getCurrentUser();
    if (user) {
      try {
        savedJobIds = await getSavedJobIds(user.id);
        isSaved = savedJobIds.includes(job.id);
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
        // Continue without saved job info
      }
    }
  } catch (error) {
    // Clerk not configured or user not logged in - that's OK
    // Only log if it's an unexpected error
    if (error instanceof Error && !error.message.includes("publishableKey")) {
      console.error("Unexpected error getting user:", error);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <PreviewBanner />
      <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-8">
        {/* Job Header */}
        <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
                {job.title}
              </h1>
              <p className="mt-2 text-xl font-medium text-neutral-700">
                {job.restaurant.name}
              </p>
            </div>
            <SaveJobButton jobId={job.id} initiallySaved={isSaved} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {job.pay_range && (
              <div className="flex items-center gap-2 text-neutral-600">
                <span className="font-semibold">Pay:</span>
                <span>{job.pay_range}</span>
              </div>
            )}
            {job.restaurant.neighborhood && (
              <div className="flex items-center gap-2 text-neutral-600">
                <MapPin className="h-4 w-4" />
                <span>{job.restaurant.neighborhood}</span>
              </div>
            )}
            {job.posted_date && (
              <div className="flex items-center gap-2 text-neutral-600">
                <Calendar className="h-4 w-4" />
                <span>Posted {new Date(job.posted_date).toLocaleDateString()}</span>
              </div>
            )}
            {job.restaurant.address && (
              <div className="flex items-center gap-2 text-neutral-600">
                <MapPin className="h-4 w-4" />
                <span>{job.restaurant.address}</span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <JobDetailActions job={job} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {job.description && (
              <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-8">
                <h2 className="mb-4 font-heading text-xl font-bold text-neutral-900">
                  Job Description
                </h2>
                <div className="prose prose-sm max-w-none text-neutral-700">
                  <p className="whitespace-pre-wrap">{job.description}</p>
                </div>
              </div>
            )}

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div>
                <h2 className="mb-4 font-heading text-xl font-bold text-neutral-900">
                  Recent Reviews
                </h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
                <div className="mt-6">
                  <Button asChild variant="outline">
                    <Link href={`/restaurants/${job.restaurant_id}`}>
                      View All Reviews
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border border-neutral-200 bg-white p-6">
              <CultureInsights
                ratingPay={job.restaurant.rating_pay}
                ratingCulture={job.restaurant.rating_culture}
                ratingManagement={job.restaurant.rating_management}
                ratingWorklife={job.restaurant.rating_worklife}
                reviewCount={job.restaurant.review_count}
              />
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <LeaveReviewButton 
                  restaurantId={job.restaurant_id} 
                  variant="outline"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
