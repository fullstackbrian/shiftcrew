-- ShiftCrew MVP Database Schema
-- Run this in Supabase SQL Editor

-- Users table (synced from Clerk)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  email text not null,
  name text,
  role text check (role in ('worker', 'employer')),
  position text, -- 'server', 'cook', 'bartender', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Restaurants table
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text default 'Los Angeles',
  neighborhood text, -- 'West Hollywood', 'Downtown', 'Santa Monica'
  cuisine_type text,
  rating_pay numeric(3,2), -- average pay rating 1-5
  rating_culture numeric(3,2), -- average culture rating 1-5
  rating_management numeric(3,2), -- average management rating 1-5
  rating_worklife numeric(3,2), -- average work-life balance rating 1-5
  review_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Jobs table (seeded from Indeed or manual)
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid references restaurants(id) on delete cascade,
  title text not null, -- 'Server', 'Line Cook', 'Bartender'
  description text,
  pay_range text, -- '$18-25/hr' or '$50k-60k/year'
  pay_min numeric,
  pay_max numeric,
  pay_type text check (pay_type in ('hourly', 'salary', 'tips', 'hourly+tips')),
  source text default 'indeed', -- 'indeed', 'craigslist', 'direct'
  source_url text, -- external apply link
  status text default 'active' check (status in ('active', 'filled', 'expired')),
  posted_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reviews table
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  restaurant_id uuid references restaurants(id) on delete cascade,
  position text not null, -- role they worked
  rating_pay integer check (rating_pay >= 1 and rating_pay <= 5),
  rating_culture integer check (rating_culture >= 1 and rating_culture <= 5),
  rating_management integer check (rating_management >= 1 and rating_management <= 5),
  rating_worklife integer check (rating_worklife >= 1 and rating_worklife <= 5),
  pros text,
  cons text,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, restaurant_id) -- one review per user per restaurant
);

-- Saved jobs table (bookmarks)
create table if not exists public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, job_id)
);

-- Indexes for performance
create index if not exists idx_jobs_restaurant_id on jobs(restaurant_id);
create index if not exists idx_jobs_status on jobs(status);
create index if not exists idx_reviews_restaurant_id on reviews(restaurant_id);
create index if not exists idx_reviews_user_id on reviews(user_id);
create index if not exists idx_saved_jobs_user_id on saved_jobs(user_id);
create index if not exists idx_saved_jobs_job_id on saved_jobs(job_id);
create index if not exists idx_users_clerk_id on users(clerk_user_id);

-- Enable RLS
alter table public.users enable row level security;
alter table public.restaurants enable row level security;
alter table public.jobs enable row level security;
alter table public.reviews enable row level security;
alter table public.saved_jobs enable row level security;

-- RLS Policies

-- Users: Users can read their own data, update their own data, insert new users
DROP POLICY IF EXISTS "Users can read their own data" ON users;
create policy "Users can read their own data" on users
  for select using (true); -- Allow public read for now (can restrict later)

DROP POLICY IF EXISTS "Users can insert their own data" ON users;
create policy "Users can insert their own data" on users
  for insert with check (true); -- Allow inserts (will be validated by Clerk in application)

DROP POLICY IF EXISTS "Users can update their own data" ON users;
create policy "Users can update their own data" on users
  for update using (true); -- Will be restricted by Clerk user_id check in application

-- Restaurants: Public read access
DROP POLICY IF EXISTS "Public can read restaurants" ON restaurants;
create policy "Public can read restaurants" on restaurants
  for select using (true);

-- Jobs: Public read access
DROP POLICY IF EXISTS "Public can read jobs" ON jobs;
create policy "Public can read jobs" on jobs
  for select using (true);

-- Reviews: Public read, authenticated users can insert
DROP POLICY IF EXISTS "Public can read reviews" ON reviews;
create policy "Public can read reviews" on reviews
  for select using (true);

DROP POLICY IF EXISTS "Users can insert reviews" ON reviews;
create policy "Users can insert reviews" on reviews
  for insert with check (true); -- Will be validated by Clerk auth in application

DROP POLICY IF EXISTS "Users can update their own reviews" ON reviews;
create policy "Users can update their own reviews" on reviews
  for update using (true); -- Will be validated by user_id check in application

DROP POLICY IF EXISTS "Users can delete their own reviews" ON reviews;
create policy "Users can delete their own reviews" on reviews
  for delete using (true); -- Will be validated by user_id check in application

-- Saved jobs: Users can only access their own saved jobs
DROP POLICY IF EXISTS "Users can read their own saved jobs" ON saved_jobs;
create policy "Users can read their own saved jobs" on saved_jobs
  for select using (true); -- Will be filtered by user_id in application

DROP POLICY IF EXISTS "Users can insert their own saved jobs" ON saved_jobs;
create policy "Users can insert their own saved jobs" on saved_jobs
  for insert with check (true); -- Will be validated by user_id in application

DROP POLICY IF EXISTS "Users can delete their own saved jobs" ON saved_jobs;
create policy "Users can delete their own saved jobs" on saved_jobs
  for delete using (true); -- Will be validated by user_id in application

-- Function to update restaurant ratings when reviews change
create or replace function update_restaurant_ratings()
returns trigger as $$
begin
  update restaurants
  set
    rating_pay = (
      select round(avg(rating_pay)::numeric, 2)
      from reviews
      where restaurant_id = new.restaurant_id and rating_pay is not null
    ),
    rating_culture = (
      select round(avg(rating_culture)::numeric, 2)
      from reviews
      where restaurant_id = new.restaurant_id and rating_culture is not null
    ),
    rating_management = (
      select round(avg(rating_management)::numeric, 2)
      from reviews
      where restaurant_id = new.restaurant_id and rating_management is not null
    ),
    rating_worklife = (
      select round(avg(rating_worklife)::numeric, 2)
      from reviews
      where restaurant_id = new.restaurant_id and rating_worklife is not null
    ),
    review_count = (
      select count(*)
      from reviews
      where restaurant_id = new.restaurant_id
    ),
    updated_at = now()
  where id = new.restaurant_id;
  return new;
end;
$$ language plpgsql;

-- Trigger to update ratings when review is inserted/updated/deleted
DROP TRIGGER IF EXISTS update_restaurant_ratings_on_review ON reviews;
create trigger update_restaurant_ratings_on_review
  after insert or update or delete on reviews
  for each row
  execute function update_restaurant_ratings();
