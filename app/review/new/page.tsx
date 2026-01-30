import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/clerk";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/landing/Header";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import type { Restaurant } from "@/lib/types";

export const metadata = {
  title: "Leave a Restaurant Review",
  description: "Share your honest experience working at a restaurant. Rate pay, culture, management, and work-life balance to help other workers.",
};

async function getRestaurants() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("restaurants")
    .select("id, name, neighborhood")
    .order("name");

  if (error) {
    return [];
  }

  return (data || []) as Restaurant[];
}

export default async function NewReviewPage({
  searchParams,
}: {
  searchParams: { restaurant?: string };
}) {
  await requireAuth(); // Ensure user is authenticated

  const restaurants = await getRestaurants();
  const preselectedRestaurant = searchParams.restaurant || null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="mx-auto w-full max-w-3xl px-6 py-12 md:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-neutral-900 md:text-5xl">
            Leave a Review
          </h1>
          <p className="mt-2 text-lg text-neutral-600">
            Help other workers by sharing your experience
          </p>
        </div>

        <ReviewForm
          restaurants={restaurants}
          preselectedRestaurantId={preselectedRestaurant}
        />
      </div>
    </div>
  );
}
