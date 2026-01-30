import { requireAuth } from "@/lib/clerk";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/landing/Header";
import { JobCard } from "@/components/jobs/JobCard";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Briefcase, Building2 } from "lucide-react";
import Link from "next/link";
import type { Job, Restaurant, Review } from "@/lib/types";

export const metadata = {
  title: "My Profile",
  description: "View your saved jobs, reviews, and profile on ShiftCrew",
};

async function getSavedJobs(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job:jobs(*, restaurant:restaurants(*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data || []).map((item) => item.job).filter(Boolean) as (Job & {
    restaurant: Restaurant;
  })[];
}

async function getUserReviews(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select("*, restaurant:restaurants(name, neighborhood)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return (data || []) as (Review & { restaurant: Restaurant })[];
}

export default async function ProfilePage() {
  const user = await requireAuth();

  const savedJobs = await getSavedJobs(user.id);
  const reviews = await getUserReviews(user.id);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <div className="mx-auto w-full max-w-5xl px-6 py-12 md:px-8">
        {/* Profile Header */}
        <div className="mb-8 rounded-lg border border-neutral-200 bg-white p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-heading text-3xl font-bold text-neutral-900">
                  {user.name || "Your Profile"}
                </h1>
                {user.role && (
                  <Badge
                    variant="secondary"
                    className={
                      user.role === "employer"
                        ? "bg-orange-100 text-orange-800 border-orange-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }
                  >
                    {user.role === "employer" ? (
                      <>
                        <Building2 className="mr-1 h-3 w-3" />
                        Employer
                      </>
                    ) : (
                      <>
                        <Briefcase className="mr-1 h-3 w-3" />
                        Crew Finder
                      </>
                    )}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-neutral-600">{user.email}</p>
              {user.position && (
                <p className="mt-2 text-sm text-neutral-500">
                  Position: {user.position}
                </p>
              )}
              {user.role === "employer" && user.job_title && (
                <p className="mt-2 text-sm text-neutral-500">
                  Role: {user.job_title}
                </p>
              )}
            </div>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="saved" className="w-full">
          <TabsList>
            <TabsTrigger value="saved">
              Saved Jobs ({savedJobs.length})
            </TabsTrigger>
            <TabsTrigger value="reviews">
              My Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="mt-6">
            {savedJobs.length === 0 ? (
              <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
                <p className="text-lg text-neutral-600">
                  You haven't saved any jobs yet.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/browse">Browse Jobs</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {reviews.length === 0 ? (
              <div className="rounded-lg border border-neutral-200 bg-white p-12 text-center">
                <p className="text-lg text-neutral-600">
                  You haven't written any reviews yet.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/review/new">Leave a Review</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id}>
                    <div className="mb-2 text-sm font-medium text-neutral-700">
                      {review.restaurant.name}
                      {review.restaurant.neighborhood &&
                        ` - ${review.restaurant.neighborhood}`}
                    </div>
                    <ReviewCard review={review as Review & { user: { name: string | null } }} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
