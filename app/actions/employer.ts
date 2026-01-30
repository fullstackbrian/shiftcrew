"use server";

import { requireAuth } from "@/lib/clerk";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Job } from "@/lib/types";

/**
 * Get all jobs for the employer's restaurant
 */
export async function getEmployerJobs(status?: "active" | "paused" | "filled" | "expired") {
  const user = await requireAuth();

  if (!user.restaurant_id) {
    return [];
  }

  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select("*")
    .eq("restaurant_id", user.restaurant_id)
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }

  return (data || []) as Job[];
}

/**
 * Update job status
 */
export async function updateJobStatus(jobId: string, status: "active" | "paused" | "filled" | "expired") {
  const user = await requireAuth();

  const supabase = await createClient();

  // Verify job belongs to user's restaurant
  const { data: job } = await supabase
    .from("jobs")
    .select("restaurant_id")
    .eq("id", jobId)
    .single();

  if (!job || job.restaurant_id !== user.restaurant_id) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("jobs")
    .update({ status })
    .eq("id", jobId);

  if (error) {
    console.error("Error updating job status:", error);
    throw new Error("Failed to update job status");
  }

  revalidatePath("/employer/dashboard/jobs");
  return { success: true };
}

/**
 * Delete a job
 */
export async function deleteJob(jobId: string) {
  const user = await requireAuth();

  const supabase = await createClient();

  // Verify job belongs to user's restaurant
  const { data: job } = await supabase
    .from("jobs")
    .select("restaurant_id")
    .eq("id", jobId)
    .single();

  if (!job || job.restaurant_id !== user.restaurant_id) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", jobId);

  if (error) {
    console.error("Error deleting job:", error);
    throw new Error("Failed to delete job");
  }

  revalidatePath("/employer/dashboard/jobs");
  return { success: true };
}
