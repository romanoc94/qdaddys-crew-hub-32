-- Add more sample profiles using existing user
INSERT INTO public.profiles (user_id, store_id, first_name, last_name, role, employee_id, phone, is_active)
SELECT 
  (SELECT user_id FROM public.profiles LIMIT 1), -- Use existing user_id
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

-- Assign some staff to existing checklist tasks
UPDATE public.checklist_tasks 
SET assigned_to = (
  SELECT p.id FROM public.profiles p 
  WHERE p.first_name = 'Marcus' AND p.last_name = 'Johnson' 
  LIMIT 1
)
WHERE title = 'Fire up the smokers' 
AND assigned_to IS NULL;

UPDATE public.checklist_tasks 
SET assigned_to = (
  SELECT p.id FROM public.profiles p 
  WHERE p.first_name = 'Sarah' AND p.last_name = 'Chen' 
  LIMIT 1
)
WHERE title = 'Season briskets for tomorrow' 
AND assigned_to IS NULL;

-- Update some tasks to show progress
UPDATE public.checklist_tasks 
SET status = 'completed', 
    completed_at = NOW() - INTERVAL '2 hours',
    completed_by = assigned_to,
    performance_rating = 'met_expectations',
    actual_minutes = 25
WHERE title = 'Fire up the smokers';

UPDATE public.checklist_tasks 
SET status = 'in_progress', 
    started_at = NOW() - INTERVAL '30 minutes'
WHERE title = 'Check meat inventory';