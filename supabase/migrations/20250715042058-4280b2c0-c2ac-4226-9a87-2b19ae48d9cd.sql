-- Add more sample profiles for better demo
INSERT INTO public.profiles (user_id, store_id, first_name, last_name, role, employee_id, phone, is_active)
SELECT 
  gen_random_uuid(), -- Generate random UUID for user_id (for demo purposes)
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
  gen_random_uuid(),
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
  gen_random_uuid(),
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
  gen_random_uuid(),
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

INSERT INTO public.profiles (user_id, store_id, first_name, last_name, role, employee_id, phone, is_active)
SELECT 
  gen_random_uuid(),
  s.id,
  'Jordan',
  'Lee',
  'team_member',
  'EMP006',
  '555-0106',
  true
FROM public.stores s
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.store_id = s.id AND p.first_name = 'Jordan' AND p.last_name = 'Lee'
);

INSERT INTO public.profiles (user_id, store_id, first_name, last_name, role, employee_id, phone, is_active)
SELECT 
  gen_random_uuid(),
  s.id,
  'Alex',
  'Rodriguez',
  'team_member',
  'EMP007',
  '555-0107',
  true
FROM public.stores s
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.store_id = s.id AND p.first_name = 'Alex' AND p.last_name = 'Rodriguez'
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

UPDATE public.checklist_tasks 
SET assigned_to = (
  SELECT p.id FROM public.profiles p 
  WHERE p.first_name = 'Mike' AND p.last_name = 'Torres' 
  LIMIT 1
)
WHERE title = 'Count register and deposit' 
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

-- Add some sample task comments
INSERT INTO public.task_comments (task_id, profile_id, comment, comment_type)
SELECT 
  ct.id,
  p.id,
  'Smokers fired up successfully, all running at 225°F. Hickory wood loaded.',
  'note'
FROM public.checklist_tasks ct
JOIN public.profiles p ON p.first_name = 'Marcus' AND p.last_name = 'Johnson'
WHERE ct.title = 'Fire up the smokers'
AND NOT EXISTS (
  SELECT 1 FROM public.task_comments tc 
  WHERE tc.task_id = ct.id AND tc.profile_id = p.id
);

INSERT INTO public.task_comments (task_id, profile_id, comment, comment_type)
SELECT 
  ct.id,
  p.id,
  'Running low on brisket - only 15 lbs left. Need to order more for tomorrow.',
  'issue'
FROM public.checklist_tasks ct
JOIN public.profiles p ON p.first_name = 'Sarah' AND p.last_name = 'Chen'
WHERE ct.title = 'Check meat inventory'
AND NOT EXISTS (
  SELECT 1 FROM public.task_comments tc 
  WHERE tc.task_id = ct.id AND tc.profile_id = p.id
);