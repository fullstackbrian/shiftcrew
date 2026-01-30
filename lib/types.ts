export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  name: string | null;
  role: "worker" | "employer" | null;
  position: string | null;
  restaurant_id: string | null;
  job_title: string | null;
  created_at: string;
  updated_at: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string | null;
  city: string;
  neighborhood: string | null;
  cuisine_type: string | null;
  phone: string | null;
  website: string | null;
  description: string | null;
  created_by: string | null;
  rating_pay: number | null;
  rating_culture: number | null;
  rating_management: number | null;
  rating_worklife: number | null;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  restaurant_id: string;
  title: string;
  description: string | null;
  pay_range: string | null;
  pay_min: number | null;
  pay_max: number | null;
  pay_type: "hourly" | "salary" | "tips" | "hourly+tips" | null;
  source: string;
  source_url: string | null;
  status: "active" | "paused" | "filled" | "expired";
  posted_date: string | null;
  employment_type: string | null;
  requirements: string | null;
  benefits: string[] | null;
  schedule_details: string | null;
  application_type: "internal" | "external";
  posted_by: string | null;
  created_at: string;
  updated_at: string;
  restaurant?: Restaurant;
}

export interface Review {
  id: string;
  user_id: string;
  restaurant_id: string;
  position: string;
  rating_pay: number | null;
  rating_culture: number | null;
  rating_management: number | null;
  rating_worklife: number | null;
  pros: string | null;
  cons: string | null;
  verified: boolean;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  restaurant?: Restaurant;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  created_at: string;
  job?: Job;
}
