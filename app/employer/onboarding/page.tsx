"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Loader2, Search, ChevronLeft, ChevronRight, Check, Building2 } from "lucide-react";
import { searchRestaurants, createRestaurant, completeEmployerOnboarding } from "@/app/actions/restaurants";
import Link from "next/link";

const NEIGHBORHOODS = [
  "West Hollywood",
  "Downtown LA",
  "Santa Monica",
  "Venice",
  "Hollywood",
  "Silver Lake",
  "Echo Park",
  "Arts District",
  "Beverly Hills",
  "Culver City",
  "Koreatown",
  "Other",
];

const CUISINE_TYPES = [
  "American",
  "Italian",
  "Mexican",
  "Japanese",
  "Chinese",
  "Thai",
  "Korean",
  "French",
  "Mediterranean",
  "Seafood",
  "Steakhouse",
  "Bar & Grill",
  "Fast Casual",
  "Other",
];

const JOB_TITLES = [
  "Owner",
  "General Manager",
  "Assistant Manager",
  "Kitchen Manager",
  "Bar Manager",
  "HR Manager",
  "Other",
];

interface RestaurantSearchResult {
  id: string;
  name: string;
  neighborhood: string | null;
}

export default function EmployerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  // Step 1: Find Restaurant
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<RestaurantSearchResult[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<RestaurantSearchResult | null>(null);
  const [searching, setSearching] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Step 2: Restaurant Details (for new restaurants)
  const [restaurantData, setRestaurantData] = useState({
    name: "",
    address: "",
    neighborhood: "",
    cuisine_type: "",
  });
  const [restaurantErrors, setRestaurantErrors] = useState<Record<string, string>>({});

  // Step 3: Verify Role
  const [jobTitle, setJobTitle] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [confirmAuthorized, setConfirmAuthorized] = useState(false);
  const [roleErrors, setRoleErrors] = useState<Record<string, string>>({});

  // Check if user already completed onboarding
  useEffect(() => {
    async function checkOnboarding() {
      try {
        const response = await fetch("/api/user/current");
        const data = await response.json();

        if (data.user?.role !== "employer") {
          router.replace("/onboarding");
          return;
        }
        if (data.user?.restaurant_id) {
          router.replace("/employer/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking onboarding:", error);
      } finally {
        setCheckingOnboarding(false);
      }
    }
    checkOnboarding();
  }, [router]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setSearching(true);
        const results = await searchRestaurants(searchQuery);
        setSearchResults(results);
        setSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectRestaurant = (restaurant: RestaurantSearchResult) => {
    setSelectedRestaurant(restaurant);
    setSearchQuery(restaurant.name);
    setSearchResults([]);
    setIsCreatingNew(false);
  };

  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setSelectedRestaurant(null);
    setRestaurantData((prev) => ({ ...prev, name: searchQuery }));
    setStep(2);
  };

  const validateRestaurantForm = () => {
    const errors: Record<string, string> = {};
    if (!restaurantData.name || restaurantData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }
    if (!restaurantData.address || restaurantData.address.length < 10) {
      errors.address = "Please enter a complete address";
    }
    if (!restaurantData.neighborhood) {
      errors.neighborhood = "Please select a neighborhood";
    }
    if (!restaurantData.cuisine_type) {
      errors.cuisine_type = "Please select a cuisine type";
    }
    setRestaurantErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRoleForm = () => {
    const errors: Record<string, string> = {};
    if (!jobTitle) {
      errors.jobTitle = "Please select your job title";
    }
    if (!confirmAuthorized) {
      errors.confirmAuthorized = "Please confirm you are authorized to post jobs";
    }
    setRoleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (step === 1) {
      if (selectedRestaurant) {
        // Skip to step 3 if restaurant was selected from search
        setStep(3);
      } else if (!isCreatingNew) {
        // Shouldn't happen, but handle it
        return;
      }
    } else if (step === 2) {
      if (validateRestaurantForm()) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setIsCreatingNew(false);
    } else if (step === 3) {
      if (isCreatingNew) {
        setStep(2);
      } else {
        setStep(1);
        setSelectedRestaurant(null);
        setSearchQuery("");
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateRoleForm()) return;

    setLoading(true);
    try {
      let restaurantId = selectedRestaurant?.id;

      // Create restaurant if new
      if (isCreatingNew) {
        const newRestaurant = await createRestaurant(restaurantData);
        restaurantId = newRestaurant.id;
      }

      if (!restaurantId) {
        throw new Error("No restaurant selected");
      }

      // Complete onboarding
      await completeEmployerOnboarding({
        restaurant_id: restaurantId,
        job_title: jobTitle,
      });

      router.push("/employer/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setLoading(false);
    }
  };

  if (checkingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const restaurantName = selectedRestaurant?.name || restaurantData.name || "your restaurant";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#16A34A]">ShiftCrew</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-xl w-full">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Step {step} of 3</span>
              <span className="text-sm text-gray-600">
                {step === 1 && "Find Restaurant"}
                {step === 2 && "Restaurant Details"}
                {step === 3 && "Verify Role"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#16A34A] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <Card>
            {/* Step 1: Find Restaurant */}
            {step === 1 && (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#16A34A]" />
                    Let&apos;s find your restaurant
                  </CardTitle>
                  <CardDescription>
                    Search for your restaurant or create a new listing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Restaurant name</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search for your restaurant..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSelectedRestaurant(null);
                        }}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Search Results */}
                  {searching && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching...
                    </div>
                  )}

                  {!searching && searchResults.length > 0 && (
                    <div className="border rounded-md divide-y max-h-60 overflow-auto">
                      {searchResults.map((restaurant) => (
                        <button
                          key={restaurant.id}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                            selectedRestaurant?.id === restaurant.id ? "bg-green-50" : ""
                          }`}
                          onClick={() => handleSelectRestaurant(restaurant)}
                        >
                          <div className="font-medium">{restaurant.name}</div>
                          {restaurant.neighborhood && (
                            <div className="text-sm text-gray-500">{restaurant.neighborhood}</div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Selected Restaurant */}
                  {selectedRestaurant && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">{selectedRestaurant.name}</div>
                        {selectedRestaurant.neighborhood && (
                          <div className="text-sm text-gray-600">{selectedRestaurant.neighborhood}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Create New Button */}
                  {searchQuery.length >= 2 && !selectedRestaurant && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleCreateNew}
                    >
                      Can&apos;t find your restaurant? Create new
                    </Button>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={handleNext}
                      disabled={!selectedRestaurant && !isCreatingNew}
                      className="bg-[#16A34A] hover:bg-[#15803d]"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 2: Restaurant Details */}
            {step === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Tell us about your restaurant</CardTitle>
                  <CardDescription>
                    Fill in the details for your restaurant listing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={restaurantData.name}
                      onChange={(e) =>
                        setRestaurantData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Restaurant name"
                    />
                    {restaurantErrors.name && (
                      <p className="text-sm text-red-600">{restaurantErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={restaurantData.address}
                      onChange={(e) =>
                        setRestaurantData((prev) => ({ ...prev, address: e.target.value }))
                      }
                      placeholder="123 Main St, Los Angeles, CA 90001"
                    />
                    {restaurantErrors.address && (
                      <p className="text-sm text-red-600">{restaurantErrors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Neighborhood *</Label>
                      <Select
                        value={restaurantData.neighborhood}
                        onValueChange={(value) =>
                          setRestaurantData((prev) => ({ ...prev, neighborhood: value }))
                        }
                      >
                        <SelectTrigger id="neighborhood">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {NEIGHBORHOODS.map((n) => (
                            <SelectItem key={n} value={n}>
                              {n}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {restaurantErrors.neighborhood && (
                        <p className="text-sm text-red-600">{restaurantErrors.neighborhood}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cuisine_type">Cuisine Type *</Label>
                      <Select
                        value={restaurantData.cuisine_type}
                        onValueChange={(value) =>
                          setRestaurantData((prev) => ({ ...prev, cuisine_type: value }))
                        }
                      >
                        <SelectTrigger id="cuisine_type">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                          {CUISINE_TYPES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {restaurantErrors.cuisine_type && (
                        <p className="text-sm text-red-600">{restaurantErrors.cuisine_type}</p>
                      )}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handleBack}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="bg-[#16A34A] hover:bg-[#15803d]"
                    >
                      Continue
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {/* Step 3: Verify Role */}
            {step === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Verify your role at {restaurantName}</CardTitle>
                  <CardDescription>
                    This helps us ensure job postings are legitimate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Your job title *</Label>
                    <Select value={jobTitle} onValueChange={setJobTitle}>
                      <SelectTrigger id="jobTitle">
                        <SelectValue placeholder="Select your role..." />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TITLES.map((title) => (
                          <SelectItem key={title} value={title}>
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {roleErrors.jobTitle && (
                      <p className="text-sm text-red-600">{roleErrors.jobTitle}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workEmail">Work email (optional)</Label>
                    <Input
                      id="workEmail"
                      type="email"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      placeholder="your.name@restaurantname.com"
                    />
                    <p className="text-sm text-gray-500">
                      Optional - helps verify your affiliation
                    </p>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="confirmAuthorized"
                      checked={confirmAuthorized}
                      onChange={(e) => setConfirmAuthorized(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-[#16A34A] focus:ring-[#16A34A]"
                    />
                    <Label htmlFor="confirmAuthorized" className="text-sm font-normal cursor-pointer">
                      I confirm I am authorized to post jobs for this restaurant
                    </Label>
                  </div>
                  {roleErrors.confirmAuthorized && (
                    <p className="text-sm text-red-600">{roleErrors.confirmAuthorized}</p>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={handleBack}>
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-[#16A34A] hover:bg-[#15803d]"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Setting up...
                        </>
                      ) : (
                        "Complete Setup"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
