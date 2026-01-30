"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ChevronLeft, CheckCircle } from "lucide-react";
import { createJob } from "@/app/actions/employer";

const JOB_TITLES = [
  "Server",
  "Bartender",
  "Line Cook",
  "Prep Cook",
  "Sous Chef",
  "Executive Chef",
  "Host/Hostess",
  "Busser",
  "Dishwasher",
  "Barback",
  "Food Runner",
  "Other",
];

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract"];

const PAY_STRUCTURES = [
  { value: "hourly", label: "Hourly rate" },
  { value: "salary", label: "Annual salary" },
  { value: "hourly_tips", label: "Hourly + tips" },
] as const;

const BENEFITS_OPTIONS = [
  "Health Insurance",
  "Dental Insurance",
  "Vision Insurance",
  "Paid Time Off (PTO)",
  "Sick Leave",
  "Crew Meals",
  "Employee Discounts",
  "Flexible Schedule",
  "Tips",
  "401(k)",
  "Professional Development",
  "Other",
];

const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  customTitle: z.string().optional(),
  employment_type: z.string().min(1, "Employment type is required"),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(2000, "Description must not exceed 2000 characters"),
  requirements: z.string().max(1000, "Requirements must not exceed 1000 characters").optional(),
  pay_structure: z.enum(["hourly", "salary", "hourly_tips"]),
  pay_min: z.number().positive("Must be a positive number").optional(),
  pay_max: z.number().positive("Must be a positive number").optional(),
  base_hourly: z.number().positive("Must be a positive number").optional(),
  estimated_tips: z.number().positive("Must be a positive number").optional(),
  schedule_details: z.string().max(500, "Schedule details must not exceed 500 characters").optional(),
  benefits: z.array(z.string()).optional(),
  application_type: z.enum(["internal", "external"]),
  source_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
}).refine(
  (data) => {
    if (data.pay_structure === "hourly" || data.pay_structure === "salary") {
      return data.pay_min && data.pay_max && data.pay_min < data.pay_max;
    }
    if (data.pay_structure === "hourly_tips") {
      return data.base_hourly && data.base_hourly > 0;
    }
    return true;
  },
  {
    message: "Pay range is invalid",
    path: ["pay_min"],
  }
).refine(
  (data) => {
    if (data.application_type === "external") {
      return data.source_url && data.source_url.length > 0;
    }
    return true;
  },
  {
    message: "External application URL is required",
    path: ["source_url"],
  }
);

type JobFormData = z.infer<typeof jobSchema>;

export default function NewJobPage() {
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCustomTitle, setShowCustomTitle] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      application_type: "internal",
      benefits: [],
      pay_structure: "hourly",
    },
  });

  const watchPayStructure = watch("pay_structure");
  const watchApplicationType = watch("application_type");
  const watchDescription = watch("description", "");
  const watchRequirements = watch("requirements", "");
  const watchSchedule = watch("schedule_details", "");
  const watchTitle = watch("title");
  const watchBenefits = watch("benefits", []);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const response = await fetch("/api/employer/dashboard");
        const data = await response.json();
        
        if (!data.user || data.user.role !== "employer") {
          router.replace("/onboarding");
          return;
        }
        
        if (!data.user.restaurant_id) {
          router.replace("/employer/onboarding");
          return;
        }

        setRestaurantName(data.restaurant?.name || "your restaurant");
      } catch (error) {
        console.error("Error fetching restaurant:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurant();
  }, [router]);

  useEffect(() => {
    setShowCustomTitle(watchTitle === "Other");
  }, [watchTitle]);

  const onSubmit = async (formData: JobFormData) => {
    setSubmitting(true);
    try {
      const jobData = {
        title: formData.title === "Other" && formData.customTitle ? formData.customTitle : formData.title,
        employment_type: formData.employment_type,
        description: formData.description,
        requirements: formData.requirements,
        pay_structure: formData.pay_structure,
        pay_min: formData.pay_min,
        pay_max: formData.pay_max,
        base_hourly: formData.base_hourly,
        estimated_tips: formData.estimated_tips,
        schedule_details: formData.schedule_details,
        benefits: formData.benefits,
        application_type: formData.application_type,
        source_url: formData.source_url,
      };

      await createJob(jobData);
      router.push("/employer/dashboard/jobs?success=true");
    } catch (error) {
      console.error("Error creating job:", error);
      alert(error instanceof Error ? error.message : "Failed to create job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleBenefit = (benefit: string) => {
    const current = watchBenefits || [];
    if (current.includes(benefit)) {
      setValue("benefits", current.filter((b) => b !== benefit));
    } else {
      setValue("benefits", [...current, benefit]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#A52A2A]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
          aria-label="Go back to jobs page"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Post New Job</h1>
        <p className="text-gray-600 mt-2">
          Fill in the details below to post a job at {restaurantName}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Job Title <span className="text-red-600">*</span>
              </Label>
              <Select
                value={watchTitle}
                onValueChange={(value) => setValue("title", value)}
              >
                <SelectTrigger id="title">
                  <SelectValue placeholder="Select a position..." />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TITLES.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.title && (
                <p className="text-xs text-red-600">{errors.title.message}</p>
              )}
            </div>

            {showCustomTitle && (
              <div className="space-y-2">
                <Label htmlFor="customTitle">
                  Custom Job Title <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="customTitle"
                  {...register("customTitle")}
                  placeholder="Enter custom job title"
                />
                {errors.customTitle && (
                  <p className="text-xs text-red-600">{errors.customTitle.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>
                Employment Type <span className="text-red-600">*</span>
              </Label>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                {EMPLOYMENT_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      {...register("employment_type")}
                      value={type}
                      className="h-4 w-4 text-[#A52A2A] focus:ring-[#A52A2A]"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
              {errors.employment_type && (
                <p className="text-xs text-red-600">{errors.employment_type.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Job Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">
                Description <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                rows={5}
                placeholder="Describe the role, day-to-day responsibilities, and what makes your restaurant a great place to work..."
                className="resize-none"
              />
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Minimum 50 characters</span>
                <span className={watchDescription.length > 2000 ? "text-red-600" : "text-gray-500"}>
                  {watchDescription.length} / 2000
                </span>
              </div>
              {errors.description && (
                <p className="text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements (optional)</Label>
              <Textarea
                id="requirements"
                {...register("requirements")}
                rows={4}
                placeholder="Experience required, skills, certifications, availability expectations..."
                className="resize-none"
              />
              <div className="flex justify-end text-xs">
                <span className={(watchRequirements?.length || 0) > 1000 ? "text-red-600" : "text-gray-500"}>
                  {watchRequirements?.length || 0} / 1000
                </span>
              </div>
              {errors.requirements && (
                <p className="text-xs text-red-600">{errors.requirements.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Compensation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compensation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Pay Structure <span className="text-red-600">*</span>
              </Label>
              <div className="flex flex-col gap-3">
                {PAY_STRUCTURES.map((structure) => (
                  <label key={structure.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      {...register("pay_structure")}
                      value={structure.value}
                      className="h-4 w-4 text-[#A52A2A] focus:ring-[#A52A2A]"
                    />
                    <span className="text-sm">{structure.label}</span>
                  </label>
                ))}
              </div>
              {errors.pay_structure && (
                <p className="text-xs text-red-600">{errors.pay_structure.message}</p>
              )}
            </div>

            {/* Hourly Pay Range */}
            {watchPayStructure === "hourly" && (
              <div className="space-y-2">
                <Label>
                  Hourly Pay Range <span className="text-red-600">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pay_min" className="text-xs text-gray-500">
                      Min ($/hr)
                    </Label>
                    <Input
                      id="pay_min"
                      type="number"
                      step="0.01"
                      placeholder="18"
                      {...register("pay_min", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pay_max" className="text-xs text-gray-500">
                      Max ($/hr)
                    </Label>
                    <Input
                      id="pay_max"
                      type="number"
                      step="0.01"
                      placeholder="25"
                      {...register("pay_max", { valueAsNumber: true })}
                    />
                  </div>
                </div>
                {errors.pay_min && (
                  <p className="text-xs text-red-600">{errors.pay_min.message}</p>
                )}
                {errors.pay_max && (
                  <p className="text-xs text-red-600">{errors.pay_max.message}</p>
                )}
              </div>
            )}

            {/* Annual Salary Range */}
            {watchPayStructure === "salary" && (
              <div className="space-y-2">
                <Label>
                  Annual Salary Range <span className="text-red-600">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pay_min_salary" className="text-xs text-gray-500">
                      Min ($)
                    </Label>
                    <Input
                      id="pay_min_salary"
                      type="number"
                      step="1000"
                      placeholder="45000"
                      {...register("pay_min", { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pay_max_salary" className="text-xs text-gray-500">
                      Max ($)
                    </Label>
                    <Input
                      id="pay_max_salary"
                      type="number"
                      step="1000"
                      placeholder="60000"
                      {...register("pay_max", { valueAsNumber: true })}
                    />
                  </div>
                </div>
                {errors.pay_min && (
                  <p className="text-xs text-red-600">{errors.pay_min.message}</p>
                )}
                {errors.pay_max && (
                  <p className="text-xs text-red-600">{errors.pay_max.message}</p>
                )}
              </div>
            )}

            {/* Hourly + Tips */}
            {watchPayStructure === "hourly_tips" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="base_hourly">
                    Base Hourly Rate <span className="text-red-600">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="base_hourly"
                      type="number"
                      step="0.01"
                      placeholder="15"
                      className="pl-7"
                      {...register("base_hourly", { valueAsNumber: true })}
                    />
                  </div>
                  {errors.base_hourly && (
                    <p className="text-xs text-red-600">{errors.base_hourly.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_tips">Estimated Tips per Hour (optional)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      id="estimated_tips"
                      type="number"
                      step="0.01"
                      placeholder="20"
                      className="pl-7"
                      {...register("estimated_tips", { valueAsNumber: true })}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Estimated tips based on your typical shifts
                  </p>
                  {errors.estimated_tips && (
                    <p className="text-xs text-red-600">{errors.estimated_tips.message}</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 4: Schedule & Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule & Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="schedule_details">Schedule Details (optional)</Label>
              <Textarea
                id="schedule_details"
                {...register("schedule_details")}
                rows={3}
                placeholder="Evening shifts, weekends required, flexible scheduling available..."
                className="resize-none"
              />
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Shift times, days required, flexibility options</span>
                <span className={(watchSchedule?.length || 0) > 500 ? "text-red-600" : "text-gray-500"}>
                  {watchSchedule?.length || 0} / 500
                </span>
              </div>
              {errors.schedule_details && (
                <p className="text-xs text-red-600">{errors.schedule_details.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Benefits (optional)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {BENEFITS_OPTIONS.map((benefit) => (
                  <label key={benefit} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={watchBenefits?.includes(benefit)}
                      onChange={() => toggleBenefit(benefit)}
                      className="h-4 w-4 rounded border-gray-300 text-[#A52A2A] focus:ring-[#A52A2A]"
                    />
                    <span className="text-sm">{benefit}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 5: Application Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Application Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>
                How should workers apply? <span className="text-red-600">*</span>
              </Label>
              
              <label className="flex items-start gap-3 cursor-pointer rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[#A52A2A] has-[:checked]:border-[#A52A2A] has-[:checked]:bg-orange-50/50">
                <input
                  type="radio"
                  {...register("application_type")}
                  value="internal"
                  className="mt-1 h-4 w-4 text-[#A52A2A] focus:ring-[#A52A2A]"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Accept applications on ShiftCrew</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Receive applications directly and manage hiring on ShiftCrew (recommended)
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer rounded-lg border-2 border-gray-200 p-4 transition-all hover:border-[#A52A2A] has-[:checked]:border-[#A52A2A] has-[:checked]:bg-orange-50/50">
                <input
                  type="radio"
                  {...register("application_type")}
                  value="external"
                  className="mt-1 h-4 w-4 text-[#A52A2A] focus:ring-[#A52A2A]"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">External application link</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Workers will be redirected to your site to apply
                  </div>
                </div>
              </label>

              {errors.application_type && (
                <p className="text-xs text-red-600">{errors.application_type.message}</p>
              )}
            </div>

            {watchApplicationType === "external" && (
              <div className="space-y-2 ml-7 pt-2">
                <Label htmlFor="source_url">
                  Application URL <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="source_url"
                  type="url"
                  {...register("source_url")}
                  placeholder="https://yourrestaurant.com/careers/apply"
                />
                <p className="text-xs text-gray-500">
                  Workers will be redirected to this URL to apply
                </p>
                {errors.source_url && (
                  <p className="text-xs text-red-600">{errors.source_url.message}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-4 justify-end pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-[#A52A2A] hover:bg-[#8B0000]"
            aria-label="Post job"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting job...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Post Job
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
