-- Allow authenticated users to insert restaurants
DROP POLICY IF EXISTS "Authenticated users can create restaurants" ON restaurants;
create policy "Authenticated users can create restaurants" on restaurants
  for insert 
  with check (true); -- Will be validated by Clerk auth in application
