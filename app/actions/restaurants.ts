"use server";

import { requireAuth } from "@/lib/clerk";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface RestaurantSearchResult {
  id: string;
  name: string;
  neighborhood: string | null;
}

/**
 * Search restaurants by name
 */
export async function searchRestaurants(
  query: string
): Promise<RestaurantSearchResult[]> {
  if (!query || query.length < 2) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("restaurants")
    .select("id, name, neighborhood")
    .ilike("name", `%${query}%`)
    .limit(10);

  if (error) {
    console.error("Error searching restaurants:", error);
    return [];
  }

  return data || [];
}

export interface CreateRestaurantData {
  name: string;
  address: string;
  neighborhood: string;
  cuisine_type: string;
}

/**
 * Create a new restaurant
 */
export async function createRestaurant(data: CreateRestaurantData) {
  const user = await requireAuth();

  const supabase = await createClient();

  // Extract city from address (simple parsing - assumes format like "123 Main St, Los Angeles, CA 90001")
  const addressParts = data.address.split(",");
  const city = addressParts.length >= 2 ? addressParts[1].trim() : "Los Angeles";

  const { data: restaurant, error } = await supabase
    .from("restaurants")
    .insert({
      name: data.name,
      address: data.address,
      city: city,
      neighborhood: data.neighborhood || null,
      cuisine_type: data.cuisine_type || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating restaurant:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    throw new Error(`Failed to create restaurant: ${error.message}`);
  }

  return restaurant;
}

export interface CompleteOnboardingData {
  restaurant_id: string;
  job_title: string;
}

/**
 * Complete employer onboarding by associating user with restaurant
 */
export async function completeEmployerOnboarding(data: CompleteOnboardingData) {
  const user = await requireAuth();

  const supabase = await createClient();

  // Update user with restaurant_id and job_title
  const { error } = await supabase
    .from("users")
    .update({
      restaurant_id: data.restaurant_id,
      job_title: data.job_title,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error completing onboarding:", error);
    throw new Error("Failed to complete onboarding");
  }

  revalidatePath("/employer/dashboard");
  return { success: true };
}

/**
 * Get employer's restaurant details
 */
export async function getEmployerRestaurant() {
  const user = await requireAuth();

  if (!user.restaurant_id) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", user.restaurant_id)
    .single();

  if (error) {
    console.error("Error fetching restaurant:", error);
    return null;
  }

  return data;
}
