import { StarRating } from "./StarRating";

interface CultureInsightsProps {
  ratingPay: number | null;
  ratingCulture: number | null;
  ratingManagement: number | null;
  ratingWorklife: number | null;
  reviewCount: number;
  className?: string;
}

export function CultureInsights({
  ratingPay,
  ratingCulture,
  ratingManagement,
  ratingWorklife,
  reviewCount,
  className,
}: CultureInsightsProps) {
  const insights = [
    {
      label: "Pay Satisfaction",
      rating: ratingPay,
      color: "text-green-600",
    },
    {
      label: "Culture",
      rating: ratingCulture,
      color: "text-blue-600",
    },
    {
      label: "Management",
      rating: ratingManagement,
      color: "text-orange-600",
    },
    {
      label: "Work-Life Balance",
      rating: ratingWorklife,
      color: "text-purple-600",
    },
  ];

  return (
    <div className={className}>
      <h3 className="mb-4 font-heading text-xl font-bold text-neutral-900">
        Culture Insights
      </h3>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.label} className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">
              {insight.label}
            </span>
            {insight.rating ? (
              <StarRating rating={insight.rating} size="sm" />
            ) : (
              <span className="text-sm text-neutral-400">No reviews yet</span>
            )}
          </div>
        ))}
      </div>
      {reviewCount > 0 && (
        <p className="mt-4 text-sm text-neutral-500">
          Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </p>
      )}
    </div>
  );
}
