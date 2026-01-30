-- Add employer-related fields to users table
alter table public.users
add column if not exists restaurant_id uuid references restaurants(id) on delete set null,
add column if not exists job_title text;

-- Add employer-related fields to restaurants table (if they don't exist)
alter table public.restaurants
add column if not exists phone text,
add column if not exists website text,
add column if not exists description text,
add column if not exists created_by uuid references users(id) on delete set null;
