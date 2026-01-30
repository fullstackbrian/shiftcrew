"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "@/components/shared/StarRating";
import { Card, CardContent } from "@/components/ui/card";
import { submitReview } from "@/app/actions/reviews";
import type { Restaurant } from "@/lib/types";

const reviewSchema = z.object({
  restaurant_id: z.string().min(1, "Please select a restaurant"),
  position: z.string().min(1, "Please enter your position"),
  rating_pay: z.number().min(1).max(5),
  rating_culture: z.number().min(1).max(5),
  rating_management: z.number().min(1).max(5),
  rating_worklife: z.number().min(1).max(5),
  pros: z.string().optional(),
  cons: z.string().optional(),
  is_anonymous: z.boolean().default(false),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  restaurants: Restaurant[];
  preselectedRestaurantId?: string | null;
}

export function ReviewForm({ restaurants, preselectedRestaurantId }: ReviewFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      restaurant_id: preselectedRestaurantId || "",
      rating_pay: 3,
      rating_culture: 3,
      rating_management: 3,
      rating_worklife: 3,
      is_anonymous: false,
    },
  });

  const watchedRatings = {
    pay: watch("rating_pay"),
    culture: watch("rating_culture"),
    management: watch("rating_management"),
    worklife: watch("rating_worklife"),
  };

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitReview(data);
      if (result.success) {
        router.push(`/restaurants/${data.restaurant_id}`);
      } else {
        setError(result.message || "Failed to submit review");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Restaurant Selection */}
          <div>
            <Label htmlFor="restaurant_id">Restaurant *</Label>
            <Select
              defaultValue={preselectedRestaurantId || ""}
              onValueChange={(value) => setValue("restaurant_id", value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a restaurant" />
              </SelectTrigger>
              <SelectContent>
                {restaurants.map((restaurant) => (
                  <SelectItem key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                    {restaurant.neighborhood && ` - ${restaurant.neighborhood}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.restaurant_id && (
              <p className="mt-1 text-sm text-red-600">
                {errors.restaurant_id.message}
              </p>
            )}
          </div>

          {/* Position */}
          <div>
            <Label htmlFor="position">Position Worked *</Label>
            <Input
              id="position"
              {...register("position")}
              placeholder="e.g., Server, Line Cook, Bartender"
              className="mt-2"
            />
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">
                {errors.position.message}
              </p>
            )}
          </div>

          {/* Ratings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Ratings *</h3>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Pay Satisfaction</Label>
                <StarRating
                  rating={watchedRatings.pay}
                  interactive
                  onChange={(rating) => setValue("rating_pay", rating)}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Culture</Label>
                <StarRating
                  rating={watchedRatings.culture}
                  interactive
                  onChange={(rating) => setValue("rating_culture", rating)}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Management</Label>
                <StarRating
                  rating={watchedRatings.management}
                  interactive
                  onChange={(rating) => setValue("rating_management", rating)}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label>Work-Life Balance</Label>
                <StarRating
                  rating={watchedRatings.worklife}
                  interactive
                  onChange={(rating) => setValue("rating_worklife", rating)}
                />
              </div>
            </div>
          </div>

          {/* Pros */}
          <div>
            <Label htmlFor="pros">Pros</Label>
            <Textarea
              id="pros"
              {...register("pros")}
              placeholder="What did you like about working here?"
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Cons */}
          <div>
            <Label htmlFor="cons">Cons</Label>
            <Textarea
              id="cons"
              {...register("cons")}
              placeholder="What could be improved?"
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_anonymous"
              {...register("is_anonymous")}
              className="h-4 w-4 rounded border-neutral-300 text-green-600 focus:ring-green-500"
            />
            <Label htmlFor="is_anonymous" className="cursor-pointer text-sm text-neutral-700">
              Post this review anonymously
            </Label>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting} size="lg">
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
