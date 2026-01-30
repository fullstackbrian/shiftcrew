"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const value = i + 1;
        const filled = value <= Math.round(rating);

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(value)}
            disabled={!interactive}
            className={cn(
              "transition-colors",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
            aria-label={`${value} star${value !== 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? "fill-green-500 text-green-500"
                  : "fill-neutral-200 text-neutral-200"
              )}
            />
          </button>
        );
      })}
      {!interactive && (
        <span className="ml-2 text-sm font-medium text-neutral-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
