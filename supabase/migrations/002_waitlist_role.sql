-- Optional role field for waitlist (helps understand audience: server, cook, etc.)
-- Run in Supabase SQL Editor if you already ran 001_waitlist.sql.

ALTER TABLE waitlist
ADD COLUMN IF NOT EXISTS role text;

COMMENT ON COLUMN waitlist.role IS 'Optional: server, bartender, cook, dishwasher, host, other';
