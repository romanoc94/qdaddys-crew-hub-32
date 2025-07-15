-- Create test data for existing users
-- Create a test store first
INSERT INTO public.stores (name, location, is_active)
SELECT 'Test Restaurant', 'Test Location', true
WHERE NOT EXISTS (SELECT 1 FROM public.stores LIMIT 1);

-- Create profile and shift data for existing auth users
INSERT INTO public.profiles (user_id, store_id, first_name, last_name, role, is_active)
SELECT 
  u.id,
  s.id,
  'Test',
  'User', 
  'operator',
  true
FROM auth.users u
CROSS JOIN (SELECT id FROM public.stores LIMIT 1) s
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = u.id);

-- Create sample shifts using valid shift types from the app
INSERT INTO public.shifts (store_id, date, shift_type, start_time, end_time)
SELECT 
  s.id,
  CURRENT_DATE,
  'open',
  '08:00:00',
  '16:00:00'
FROM public.stores s
WHERE NOT EXISTS (SELECT 1 FROM public.shifts WHERE store_id = s.id);