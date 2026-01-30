"use server";

import { requireAuth } from "@/lib/clerk";
import { createClient } from "@/lib/supabase/server";

export async function saveJob(jobId: string) {
  const user = await requireAuth();

  const supabase = await createClient();

  const { error } = await supabase.from("saved_jobs").insert({
    user_id: user.id,
    job_id: jobId,
  });

  if (error) {
    if (error.code === "23505") {
      // Already saved
      return { success: true };
    }
    throw new Error(error.message);
  }

  return { success: true };
}

export async function unsaveJob(jobId: string) {
  const user = await requireAuth();

  const supabase = await createClient();

  const { error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("user_id", user.id)
    .eq("job_id", jobId);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}

export async function getSavedJobIds(userId: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", userId);

  if (error) {
    return [];
  }

  return data.map((item) => item.job_id);
}
