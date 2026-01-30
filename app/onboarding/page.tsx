import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { OnboardingClient } from "./OnboardingClient";

export default async function OnboardingPage() {
  const { userId } = await auth();
  
  // If not authenticated, redirect to sign-in
  if (!userId) {
    redirect("/sign-in");
  }
  
  // Check if user already has role
  const supabase = await createClient();
  const { data: user, error } = await supabase
    .from("users")
    .select("role, restaurant_id")
    .eq("clerk_user_id", userId)
    .single();
  
  // If error fetching user or user doesn't exist, show loading
  // (getCurrentUser will create them, but we'll handle that in middleware)
  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user in onboarding:", error);
  }
  
  // Already has role - redirect appropriately
  if (user?.role === "worker") {
    redirect("/browse");
  }
  
  if (user?.role === "employer") {
    if (user.restaurant_id) {
      redirect("/employer/dashboard");
    } else {
      redirect("/employer/onboarding");
    }
  }
  
  // No role - show role selection
  return <OnboardingClient />;
}
