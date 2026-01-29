-- Add role column to waitlist table
-- Run this in Supabase SQL Editor if you haven't already

ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS role text;
