import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/landing/Header";
import { PreviewBanner } from "@/components/PreviewBanner";
import { Footer } from "@/components/landing/Footer";
import { CultureInsights } from "@/components/shared/CultureInsights";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { JobCard } from "@/components/jobs/JobCard";
import { LeaveReviewButton } from "@/components/reviews/LeaveReviewButton";
import { MapPin } from "lucide-react";
import Link from "next/link";
import type { Restaurant, Review, Job } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();

  if (!restaurant) {
    return {
      title: "Restaurant Not Found",
    };
  }

  const location = restaurant.neighborhood ? ` in ${restaurant.neighborhood}, Los Angeles` : " in Los Angeles";
  const ratingInfo = restaurant.rating_pay ? ` Rated ${restaurant.rating_pay}/5 for pay.` : "";
  
  return {
    title: `${restaurant.name}${location} - Reviews & Jobs`,
    description: `See verified pay, culture reviews, and job openings at ${restaurant.name}${location}.${ratingInfo} Real reviews from workers who've worked there.`,
    keywords: [
      `${restaurant.name} reviews`,
      `${restaurant.name} jobs`,
      `restaurant reviews ${restaurant.neighborhood || "Los Angeles"}`,
      "restaurant culture",
      "verified pay",
    ],
  };
}

async function getRestaurant(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Restaurant;
}

async function getRestaurantReviews(restaurantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*, user:users(name)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  // Handle cases where user might be null (deleted user, etc.)
  return (data || []).map((review: any) => ({
    ...review,
    user: review.user || { name: null },
  })) as (Review & { user?: { name: string | null } })[];
}

async function getRestaurantJobs(restaurantId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("jobs")
    .select("*, restaurant:restaurants(*)")
    .eq("restaurant_id", restaurantId)
    .eq("status", "active")
    .order("posted_date", { ascending: false });

  if (error) {
    return [];
  }

  return (data || []) as (Job & { restaurant: Restaurant })[];
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await getRestaurant(id);

  if (!restaurant) {
    notFound();
  }

  const reviews = await getRestaurantReviews(id);
  const jobs = await getRestaurantJobs(id);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <PreviewBanner />
      <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-8">
        {/* Restaurant Header */}
        <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
            {restaurant.name}
          </h1>
          {restaurant.neighborhood && (
            <div className="mt-2 flex items-center gap-2 text-neutral-600">
              <MapPin className="h-4 w-4" />
              <span>{restaurant.neighborhood}</span>
            </div>
          )}
          {restaurant.address && (
            <p className="mt-1 text-neutral-600">{restaurant.address}</p>
          )}
          {restaurant.cuisine_type && (
            <p className="mt-2 text-sm text-neutral-500">
              {restaurant.cuisine_type}
            </p>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Jobs Section */}
            {jobs.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 font-heading text-2xl font-bold text-neutral-900">
                  Open Positions ({jobs.length})
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {jobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-heading text-2xl font-bold text-neutral-900">
                  Reviews ({reviews.length})
                </h2>
                <LeaveReviewButton restaurantId={restaurant.id} />
              </div>

              {reviews.length === 0 ? (
                <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
                  <p className="text-lg text-neutral-600">
                    No reviews yet. Be the first to review!
                  </p>
                  <LeaveReviewButton restaurantId={restaurant.id} className="mt-4" />
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border border-neutral-200 bg-white p-6">
              <CultureInsights
                ratingPay={restaurant.rating_pay}
                ratingCulture={restaurant.rating_culture}
                ratingManagement={restaurant.rating_management}
                ratingWorklife={restaurant.rating_worklife}
                reviewCount={restaurant.review_count}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
