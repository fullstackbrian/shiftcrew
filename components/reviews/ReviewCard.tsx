import { StarRating } from "@/components/shared/StarRating";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Review } from "@/lib/types";

interface ReviewCardProps {
  review: Review & { user?: { name: string | null } };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const displayName = review.is_anonymous 
    ? "Anonymous" 
    : (review.user?.name || "Anonymous");

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-semibold text-neutral-900">
              {displayName}
            </p>
            <p className="text-sm text-neutral-500">
              {review.position} • {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!review.verified && (
              <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
                Sample Data
              </Badge>
            )}
            {review.verified && (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {review.rating_pay && (
            <div>
              <p className="text-xs text-neutral-500">Pay</p>
              <StarRating rating={review.rating_pay} size="sm" />
            </div>
          )}
          {review.rating_culture && (
            <div>
              <p className="text-xs text-neutral-500">Culture</p>
              <StarRating rating={review.rating_culture} size="sm" />
            </div>
          )}
          {review.rating_management && (
            <div>
              <p className="text-xs text-neutral-500">Management</p>
              <StarRating rating={review.rating_management} size="sm" />
            </div>
          )}
          {review.rating_worklife && (
            <div>
              <p className="text-xs text-neutral-500">Work-Life</p>
              <StarRating rating={review.rating_worklife} size="sm" />
            </div>
          )}
        </div>

        {review.pros && (
          <div className="mb-3">
            <p className="mb-1 text-sm font-semibold text-green-700">Pros:</p>
            <p className="text-sm text-neutral-700">{review.pros}</p>
          </div>
        )}

        {review.cons && (
          <div>
            <p className="mb-1 text-sm font-semibold text-red-700">Cons:</p>
            <p className="text-sm text-neutral-700">{review.cons}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
