-- Phase 1: Database Schema Updates for Employer Side

-- Add new columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS restaurant_id uuid REFERENCES restaurants(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS job_title text;

-- Add new columns to restaurants table
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES users(id);

-- Add new columns to jobs table
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employment_type text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS requirements text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS benefits text[];
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS schedule_details text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS application_type text DEFAULT 'external';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS posted_by uuid REFERENCES users(id);

-- Add 'paused' to the status check constraint (if it exists)
-- First, drop the existing constraint and recreate it
DO $$
BEGIN
    -- Try to alter the check constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'jobs_status_check'
        AND table_name = 'jobs'
    ) THEN
        ALTER TABLE jobs DROP CONSTRAINT jobs_status_check;
    END IF;
END $$;

-- Add the new constraint with paused status
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'jobs_status_check'
        AND table_name = 'jobs'
    ) THEN
        ALTER TABLE jobs ADD CONSTRAINT jobs_status_check
        CHECK (status IN ('active', 'paused', 'filled', 'expired'));
    END IF;
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;

-- RLS Policies for employers to manage their restaurant's data

-- Allow employers to read their own restaurant
DROP POLICY IF EXISTS "Employers can read their restaurant" ON restaurants;
CREATE POLICY "Employers can read their restaurant" ON restaurants
    FOR SELECT
    USING (
        id IN (
            SELECT restaurant_id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
        OR created_by IN (
            SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Allow employers to update their own restaurant
DROP POLICY IF EXISTS "Employers can update their restaurant" ON restaurants;
CREATE POLICY "Employers can update their restaurant" ON restaurants
    FOR UPDATE
    USING (
        created_by IN (
            SELECT id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Allow employers to insert new restaurants
DROP POLICY IF EXISTS "Employers can create restaurants" ON restaurants;
CREATE POLICY "Employers can create restaurants" ON restaurants
    FOR INSERT
    WITH CHECK (true);

-- Allow employers to manage their jobs
DROP POLICY IF EXISTS "Employers can manage their jobs" ON jobs;
CREATE POLICY "Employers can manage their jobs" ON jobs
    FOR ALL
    USING (
        restaurant_id IN (
            SELECT restaurant_id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );

-- Allow employers to insert jobs for their restaurant
DROP POLICY IF EXISTS "Employers can create jobs" ON jobs;
CREATE POLICY "Employers can create jobs" ON jobs
    FOR INSERT
    WITH CHECK (
        restaurant_id IN (
            SELECT restaurant_id FROM users WHERE clerk_user_id = auth.jwt() ->> 'sub'
        )
    );
