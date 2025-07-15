-- Create test data for existing users with valid shift types
-- Create a test store first
INSERT INTO public.stores (name, location, is_active)
SELECT 'Test Restaurant', 'Test Location', true
WHERE NOT EXISTS (SELECT 1 FROM public.stores LIMIT 1);

-- Create profile for existing auth users  
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

-- Create sample shifts using valid shift types
INSERT INTO public.shifts (store_id, date, shift_type, start_time, end_time)
SELECT 
  s.id,
  CURRENT_DATE,
  'opening',
  '06:00:00',
  '11:00:00'
FROM public.stores s
WHERE NOT EXISTS (SELECT 1 FROM public.shifts WHERE store_id = s.id AND date = CURRENT_DATE);

INSERT INTO public.shifts (store_id, date, shift_type, start_time, end_time)
SELECT 
  s.id,
  CURRENT_DATE,
  'lunch', 
  '10:00:00',
  '15:00:00'
FROM public.stores s
WHERE NOT EXISTS (SELECT 1 FROM public.shifts WHERE store_id = s.id AND shift_type = 'lunch');