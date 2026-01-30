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

export interface CreateJobData {
  title: string;
  employment_type: string;
  description: string;
  requirements?: string;
  pay_structure: "hourly" | "salary" | "hourly_tips";
  pay_min?: number;
  pay_max?: number;
  base_hourly?: number;
  estimated_tips?: number;
  schedule_details?: string;
  benefits?: string[];
  application_type: "internal" | "external";
  source_url?: string;
}

/**
 * Create a new job posting
 */
export async function createJob(data: CreateJobData) {
  const user = await requireAuth();

  if (user.role !== "employer" || !user.restaurant_id) {
    throw new Error("Not authorized to post jobs");
  }

  const supabase = await createClient();

  // Build pay_range string
  let pay_range: string;
  let pay_min: number | null = null;
  let pay_max: number | null = null;

  if (data.pay_structure === "hourly") {
    pay_range = `$${data.pay_min}-${data.pay_max}/hr`;
    pay_min = data.pay_min!;
    pay_max = data.pay_max!;
  } else if (data.pay_structure === "salary") {
    pay_range = `$${data.pay_min!.toLocaleString()}-${data.pay_max!.toLocaleString()}/year`;
    pay_min = data.pay_min!;
    pay_max = data.pay_max!;
  } else {
    // hourly_tips
    const tipsText = data.estimated_tips ? ` (avg $${data.estimated_tips}/hr in tips)` : "";
    pay_range = `$${data.base_hourly}/hr + tips${tipsText}`;
    pay_min = data.base_hourly!;
  }

  // Insert job
  const { data: job, error } = await supabase
    .from("jobs")
    .insert({
      restaurant_id: user.restaurant_id,
      posted_by: user.id,
      title: data.title,
      employment_type: data.employment_type,
      description: data.description,
      requirements: data.requirements || null,
      pay_range: pay_range,
      pay_min: pay_min,
      pay_max: pay_max,
      pay_type: data.pay_structure,
      schedule_details: data.schedule_details || null,
      benefits: data.benefits || [],
      application_type: data.application_type,
      source_url: data.source_url || null,
      status: "active",
      posted_date: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating job:", error);
    throw new Error("Failed to create job");
  }

  revalidatePath("/employer/dashboard/jobs");
  revalidatePath("/browse");
  return { success: true, job };
}
