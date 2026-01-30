-- Waitlist table for landing page email capture.
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New query.

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  user_type text CHECK (user_type IN ('worker', 'employer')),
  created_at timestamptz DEFAULT now()
);

-- Index for listing by signup date
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);

-- Allow anonymous inserts (no auth required for waitlist signup).
-- Option A: Enable RLS and allow insert for anon:
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on waitlist" ON waitlist;
CREATE POLICY "Allow public insert on waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Option B: If you prefer to disable RLS for this table (simpler, less secure):
-- ALTER TABLE waitlist DISABLE ROW LEVEL SECURITY;
