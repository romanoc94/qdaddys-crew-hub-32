-- Create a test store and profile for the current authenticated user
INSERT INTO public.stores (id, name, location, address, phone, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Test BBQ Store',
  'Downtown',
  '123 Main St',
  '555-0123',
  true
) ON CONFLICT (id) DO NOTHING;

-- Create a test profile for any existing authenticated user
-- This will help resolve the loading issue
INSERT INTO public.profiles (
  id,
  user_id,
  store_id,
  first_name,
  last_name,
  role,
  employee_id,
  phone,
  pin,
  permissions,
  is_active
)
SELECT 
  gen_random_uuid(),
  auth.uid(),
  '00000000-0000-0000-0000-000000000001',
  'Test',
  'User',
  'manager',
  'EMP001',
  '555-0123',
  '1234',
  ARRAY['shifts:manage', 'checklists:manage', 'team:manage'],
  true
WHERE auth.uid() IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM profiles WHERE user_id = auth.uid()
);