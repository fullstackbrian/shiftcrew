import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/clerk";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    if (user.role !== "employer" || !user.restaurant_id) {
      return NextResponse.json({ user }, { status: 200 });
    }

    const supabase = await createClient();

    // Fetch restaurant
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id, name")
      .eq("id", user.restaurant_id)
      .single();

    // Fetch stats
    const [activeJobsResult, filledJobsResult] = await Promise.all([
      supabase
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("restaurant_id", user.restaurant_id)
        .eq("status", "active"),
      supabase
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("restaurant_id", user.restaurant_id)
        .eq("status", "filled"),
    ]);

    // For now, return placeholder stats since applications table doesn't exist yet
    const stats = {
      activeJobs: activeJobsResult.count || 0,
      newApplications: 0, // Will be populated after applications table is created
      jobsFilled: filledJobsResult.count || 0,
      totalApplicants: 0, // Will be populated after applications table is created
    };

    return NextResponse.json({
      user: {
        name: user.name,
        restaurant_id: user.restaurant_id,
        job_title: user.job_title,
        role: user.role,
      },
      restaurant,
      stats,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
