"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin, DollarSign, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StarRating } from "@/components/shared/StarRating";
import { SaveJobButton } from "./SaveJobButton";
import type { Job, Restaurant } from "@/lib/types";

// Type guard to ensure restaurant exists
function hasRestaurant(
  job: Job | (Job & { restaurant?: Restaurant })
): job is Job & { restaurant: Restaurant } {
  return "restaurant" in job && job.restaurant !== undefined;
}

interface JobCardProps {
  job: Job & { restaurant?: Restaurant };
  isSaved?: boolean;
  restaurantJobCount?: number; // Total number of jobs for this restaurant
}

// Extract position keywords from job title for better filtering
function extractPositionKeyword(title: string): string {
  const titleLower = title.toLowerCase();
  
  // Common position keywords
  const positions = [
    "line cook",
    "cook",
    "server",
    "bartender",
    "host",
    "hostess",
    "chef",
    "manager",
    "dishwasher",
    "busser",
    "barista",
    "sous chef",
    "prep cook",
  ];
  
  // Find the first matching position keyword
  for (const pos of positions) {
    if (titleLower.includes(pos)) {
      return pos.charAt(0).toUpperCase() + pos.slice(1); // Capitalize first letter
    }
  }
  
  // If no match, return the title as-is (will use partial match)
  return title;
}

export function JobCard({ job, isSaved = false, restaurantJobCount }: JobCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  if (!hasRestaurant(job)) {
    return null;
  }

  const restaurant = job.restaurant;
  const hasMultipleJobs = restaurantJobCount !== undefined && restaurantJobCount > 1;
  
  return (
    <Link href={`/jobs/${job.id}`} className="block h-full group">
      <Card className="h-full transition-all duration-200 hover:shadow-xl hover:border-[#A52A2A] hover:-translate-y-1 hover:bg-red-50/30 cursor-pointer border-2">
        <CardContent className={`p-4 sm:p-6 ${hasMultipleJobs ? 'pb-4 sm:pb-4' : ''}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-neutral-900 group-hover:text-[#A52A2A] transition-colors">
                {job.title}
              </h3>
              <p className="mt-1 text-sm sm:text-base font-medium text-neutral-700 group-hover:text-[#A52A2A] transition-colors truncate">
                {restaurant.name}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {restaurant.rating_pay && (
                <div className="flex items-center">
                  <StarRating rating={restaurant.rating_pay} size="sm" />
                </div>
              )}
              <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <SaveJobButton jobId={job.id} initiallySaved={isSaved} size="sm" />
              </div>
            </div>
          </div>

        <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-neutral-600">
          {job.pay_range && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="font-medium">{job.pay_range}</span>
            </div>
          )}
          {restaurant.neighborhood && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{restaurant.neighborhood}</span>
            </div>
          )}
        </div>

        {restaurant.review_count > 0 && (
          <div className="mt-2 sm:mt-3 flex items-center gap-2 text-xs text-neutral-500">
            <span>
              {restaurant.review_count}{" "}
              {restaurant.review_count === 1 ? "review" : "reviews"}
            </span>
            {restaurant.rating_culture && (
              <>
                <span>•</span>
                <span>Culture: {restaurant.rating_culture.toFixed(1)}</span>
              </>
            )}
          </div>
        )}

        {hasMultipleJobs && (
          <div className="mt-3 pt-3 -mb-4 sm:-mb-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/restaurants/${restaurant.id}`);
              }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm font-medium text-[#A52A2A] hover:text-[#8B0000] hover:bg-red-50/50 transition-all group/link border border-transparent hover:border-red-100 focus:outline-none focus:ring-2 focus:ring-[#A52A2A] focus:ring-offset-2"
              aria-label={`View ${restaurantJobCount} ${restaurantJobCount === 1 ? 'job' : 'jobs'} at ${restaurant.name}`}
            >
              <span>View {restaurantJobCount} {restaurantJobCount === 1 ? 'job' : 'jobs'} at {restaurant.name}</span>
              <ArrowRight className="h-4 w-4 flex-shrink-0 transition-transform group-hover/link:translate-x-0.5" aria-hidden="true" />
            </button>
          </div>
        )}
      </CardContent>
    </Card>
    </Link>
  );
}
