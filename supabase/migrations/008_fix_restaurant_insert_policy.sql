-- Drop the existing policy if it exists and recreate it to allow anonymous inserts
-- Since we're using Clerk for auth, Supabase sees requests as anonymous
drop policy if exists "Authenticated users can create restaurants" on restaurants;

-- Allow anonymous inserts (Clerk handles authentication in the app layer)
DROP POLICY IF EXISTS "Allow restaurant creation" ON restaurants;
create policy "Allow restaurant creation" on restaurants
  for insert 
  to anon, authenticated
  with check (true);
