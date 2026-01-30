"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink, MapPin, Phone, Globe, Star, Building2 } from "lucide-react";
import { getEmployerRestaurant } from "@/app/actions/restaurants";
import { Restaurant } from "@/lib/types";

export default function RestaurantPage() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurant() {
      setLoading(true);
      try {
        const data = await getEmployerRestaurant();
        if (!data) {
          router.replace("/employer/onboarding");
          return;
        }
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#16A34A]" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load restaurant information</p>
      </div>
    );
  }

  const ratings = [
    { label: "Pay", value: restaurant.rating_pay, icon: "💰" },
    { label: "Culture", value: restaurant.rating_culture, icon: "👥" },
    { label: "Management", value: restaurant.rating_management, icon: "📊" },
    { label: "Work-Life Balance", value: restaurant.rating_worklife, icon: "⚖️" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Information</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant profile</p>
        </div>
        <Link href={`/restaurants/${restaurant.id}`}>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            View Public Profile
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#16A34A]" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="text-gray-900 mt-1">{restaurant.name}</p>
            </div>
            {restaurant.address && (
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </label>
                <p className="text-gray-900 mt-1">{restaurant.address}</p>
                {restaurant.city && (
                  <p className="text-sm text-gray-600 mt-1">{restaurant.city}</p>
                )}
              </div>
            )}
            {restaurant.neighborhood && (
              <div>
                <label className="text-sm font-medium text-gray-700">Neighborhood</label>
                <p className="text-gray-900 mt-1">{restaurant.neighborhood}</p>
              </div>
            )}
            {restaurant.cuisine_type && (
              <div>
                <label className="text-sm font-medium text-gray-700">Cuisine Type</label>
                <Badge variant="secondary" className="mt-1">
                  {restaurant.cuisine_type}
                </Badge>
              </div>
            )}
            {restaurant.phone && (
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </label>
                <p className="text-gray-900 mt-1">{restaurant.phone}</p>
              </div>
            )}
            {restaurant.website && (
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website
                </label>
                <a
                  href={restaurant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#16A34A] hover:underline mt-1 block"
                >
                  {restaurant.website}
                </a>
              </div>
            )}
            {restaurant.description && (
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-gray-900 mt-1">{restaurant.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ratings & Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-[#16A34A]" />
              Ratings & Reviews
            </CardTitle>
            <CardDescription>
              Aggregate ratings from worker reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            {restaurant.review_count === 0 ? (
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-2">No reviews yet</p>
                <p className="text-sm text-gray-400">
                  Reviews will appear here once workers submit them
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{rating.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{rating.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {rating.value ? (
                        <>
                          <span className="text-lg font-semibold text-gray-900">
                            {rating.value.toFixed(1)}
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.round(rating.value!)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">No rating</span>
                      )}
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Reviews</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {restaurant.review_count}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
