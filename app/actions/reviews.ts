"use server";

import { requireAuth } from "@/lib/clerk";
import { createClient } from "@/lib/supabase/server";

export async function submitReview(data: {
  restaurant_id: string;
  position: string;
  rating_pay: number;
  rating_culture: number;
  rating_management: number;
  rating_worklife: number;
  pros?: string;
  cons?: string;
  is_anonymous?: boolean;
}) {
  const user = await requireAuth();

  const supabase = await createClient();

  // Check if user already reviewed this restaurant
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("restaurant_id", data.restaurant_id)
    .single();

  if (existingReview) {
    // Update existing review
      const { error } = await supabase
        .from("reviews")
        .update({
          position: data.position,
          rating_pay: data.rating_pay,
          rating_culture: data.rating_culture,
          rating_management: data.rating_management,
          rating_worklife: data.rating_worklife,
          pros: data.pros || null,
          cons: data.cons || null,
          is_anonymous: data.is_anonymous || false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingReview.id);

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true };
  }

  // Create new review
  const { error } = await supabase.from("reviews").insert({
    user_id: user.id,
    restaurant_id: data.restaurant_id,
    position: data.position,
    rating_pay: data.rating_pay,
    rating_culture: data.rating_culture,
    rating_management: data.rating_management,
    rating_worklife: data.rating_worklife,
    pros: data.pros || null,
    cons: data.cons || null,
    is_anonymous: data.is_anonymous || false,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true };
}
