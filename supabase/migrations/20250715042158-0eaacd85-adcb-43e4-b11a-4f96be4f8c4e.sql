-- Remove unique constraint on user_id to allow multiple profiles for demo
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;

-- Now add sample profiles
INSERT INTO public.profiles (user_id, store_id, first_name, last_name, role, employee_id, phone, is_active)
SELECT 
  (SELECT user_id FROM public.profiles LIMIT 1),
  s.id,
  'Marcus',
  'Johnson',
  'team_member',
  'EMP002',
  '555-0102',
  true
FROM public.stores s
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.store_id = s.id AND p.first_name = 'Marcus' AND p.last_name = 'Johnson'
);

INSERT INTO public.profiles (user_id, store_id, first_name, last_name, role, employee_id, phone, is_active)
SELECT 
  (SELECT user_id FROM public.profiles LIMIT 1),
  s.id,
  'Sarah',
  'Chen',
  'prep_cook',
  'EMP003',
  '555-0103',
  true
FROM public.stores s
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.store_id = s.id AND p.first_name = 'Sarah' AND p.last_name = 'Chen'
);

INSERT INTO public.profiles (user_id, store_id, first_name, last_name, role, employee_id, phone, is_active)
SELECT 
  (SELECT user_id FROM public.profiles LIMIT 1),
  s.id,
  'Mike',
  'Torres',
  'shift_leader',
  'EMP004',
  '555-0104',
  true
FROM public.stores s
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.store_id = s.id AND p.first_name = 'Mike' AND p.last_name = 'Torres'
);

INSERT INTO public.profiles (user_id, store_id, first_name, last_name, role, employee_id, phone, is_active)
SELECT 
  (SELECT user_id FROM public.profiles LIMIT 1),
  s.id,
  'Emily',
  'Davis',
  'team_member',
  'EMP005',
  '555-0105',
  true
FROM public.stores s
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.store_id = s.id AND p.first_name = 'Emily' AND p.last_name = 'Davis'
);