-- Add is_anonymous column to reviews table
alter table public.reviews
add column if not exists is_anonymous boolean default false;
