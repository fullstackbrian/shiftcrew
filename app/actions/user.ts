"use server";

import { requireAuth } from "@/lib/clerk";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Update user role to 'worker' or 'employer'
 */
export async function updateUserRole(role: "worker" | "employer") {
  const user = await requireAuth();

  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({ role })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }

  revalidatePath("/onboarding");
  return { success: true };
}

/**
 * Get current user with all details
 */
export async function getCurrentUserDetails() {
  const user = await requireAuth();
  return user;
}
