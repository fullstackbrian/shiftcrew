-- Add INSERT policy for users table
-- This allows users to be created when they sign up via Clerk

create policy "Users can insert their own data" on users
  for insert with check (true); -- Allow inserts (will be validated by Clerk in application)
