-- Create comprehensive sample data for demo (fixed)
-- Insert checklist templates with BBQ-specific tasks
INSERT INTO public.checklist_templates (store_id, name, description, checklist_type, is_active) 
SELECT 
  s.id, 
  'Opening Checklist', 
  'Essential tasks to prepare for the day', 
  'opening',
  true
FROM public.stores s
WHERE NOT EXISTS (
  SELECT 1 FROM public.checklist_templates ct 
  WHERE ct.store_id = s.id AND ct.checklist_type = 'opening'
);

INSERT INTO public.checklist_templates (store_id, name, description, checklist_type, is_active) 
SELECT 
  s.id, 
  'Closing Checklist', 
  'End-of-day cleanup and securing tasks', 
  'closing',
  true
FROM public.stores s
WHERE NOT EXISTS (
  SELECT 1 FROM public.checklist_templates ct 
  WHERE ct.store_id = s.id AND ct.checklist_type = 'closing'
);

INSERT INTO public.checklist_templates (store_id, name, description, checklist_type, is_active) 
SELECT 
  s.id, 
  'Prep Checklist', 
  'Food preparation and sauce batch tasks', 
  'prep',
  true
FROM public.stores s
WHERE NOT EXISTS (
  SELECT 1 FROM public.checklist_templates ct 
  WHERE ct.store_id = s.id AND ct.checklist_type = 'prep'
);

-- Insert template tasks for opening checklist
INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, is_critical, order_index, required_role)
SELECT 
  ct.id,
  'Fire up the smokers',
  'Start all smokers and bring to 225°F operating temperature',
  30,
  true,
  1,
  'team_member'
FROM public.checklist_templates ct
WHERE ct.checklist_type = 'opening'
AND NOT EXISTS (
  SELECT 1 FROM public.checklist_template_tasks ctt 
  WHERE ctt.template_id = ct.id AND ctt.title = 'Fire up the smokers'
);

INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, is_critical, order_index, required_role)
SELECT 
  ct.id,
  'Check meat inventory',
  'Verify brisket, ribs, pulled pork quantities and quality',
  15,
  true,
  2,
  'team_member'
FROM public.checklist_templates ct
WHERE ct.checklist_type = 'opening'
AND NOT EXISTS (
  SELECT 1 FROM public.checklist_template_tasks ctt 
  WHERE ctt.template_id = ct.id AND ctt.title = 'Check meat inventory'
);

INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, is_critical, order_index, required_role)
SELECT 
  ct.id,
  'Test POS system',
  'Verify Toast POS is functioning properly and connected',
  10,
  true,
  3,
  'team_member'
FROM public.checklist_templates ct
WHERE ct.checklist_type = 'opening'
AND NOT EXISTS (
  SELECT 1 FROM public.checklist_template_tasks ctt 
  WHERE ctt.template_id = ct.id AND ctt.title = 'Test POS system'
);

INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, is_critical, order_index, required_role)
SELECT 
  ct.id,
  'Set up sauces and sides',
  'Fill sauce bottles, prepare coleslaw, beans, and mac cheese',
  25,
  false,
  4,
  'team_member'
FROM public.checklist_templates ct
WHERE ct.checklist_type = 'opening'
AND NOT EXISTS (
  SELECT 1 FROM public.checklist_template_tasks ctt 
  WHERE ctt.template_id = ct.id AND ctt.title = 'Set up sauces and sides'
);

-- Insert template tasks for prep checklist
INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, is_critical, order_index, required_role)
SELECT 
  ct.id,
  'Season briskets for tomorrow',
  'Apply dry rub to all briskets for next day smoking',
  45,
  true,
  1,
  'team_member'
FROM public.checklist_templates ct
WHERE ct.checklist_type = 'prep'
AND NOT EXISTS (
  SELECT 1 FROM public.checklist_template_tasks ctt 
  WHERE ctt.template_id = ct.id AND ctt.title = 'Season briskets for tomorrow'
);

INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, is_critical, order_index, required_role)
SELECT 
  ct.id,
  'Make sauce batches',
  'Prepare BBQ sauce, hot sauce, and vinegar sauce',
  60,
  false,
  2,
  'team_member'
FROM public.checklist_templates ct
WHERE ct.checklist_type = 'prep'
AND NOT EXISTS (
  SELECT 1 FROM public.checklist_template_tasks ctt 
  WHERE ctt.template_id = ct.id AND ctt.title = 'Make sauce batches'
);

-- Insert template tasks for closing checklist  
INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, is_critical, order_index, required_role)
SELECT 
  ct.id,
  'Bank smoker fires',
  'Reduce smoker temperatures and secure for overnight',
  20,
  true,
  1,
  'team_member'
FROM public.checklist_templates ct
WHERE ct.checklist_type = 'closing'
AND NOT EXISTS (
  SELECT 1 FROM public.checklist_template_tasks ctt 
  WHERE ctt.template_id = ct.id AND ctt.title = 'Bank smoker fires'
);

INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, is_critical, order_index, required_role)
SELECT 
  ct.id,
  'Clean all prep surfaces',
  'Sanitize cutting boards, knives, and prep tables',
  30,
  true,
  2,
  'team_member'
FROM public.checklist_templates ct
WHERE ct.checklist_type = 'closing'
AND NOT EXISTS (
  SELECT 1 FROM public.checklist_template_tasks ctt 
  WHERE ctt.template_id = ct.id AND ctt.title = 'Clean all prep surfaces'
);

INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, is_critical, order_index, required_role)
SELECT 
  ct.id,
  'Count register and deposit',
  'Complete daily cash count and prepare bank deposit',
  25,
  true,
  3,
  'shift_leader'
FROM public.checklist_templates ct
WHERE ct.checklist_type = 'closing'
AND NOT EXISTS (
  SELECT 1 FROM public.checklist_template_tasks ctt 
  WHERE ctt.template_id = ct.id AND ctt.title = 'Count register and deposit'
);

-- Create daily checklists for today
INSERT INTO public.checklists (template_id, store_id, date, status)
SELECT 
  ct.id,
  ct.store_id,
  CURRENT_DATE,
  'pending'
FROM public.checklist_templates ct
WHERE NOT EXISTS (
  SELECT 1 FROM public.checklists c 
  WHERE c.template_id = ct.id AND c.date = CURRENT_DATE
);

-- Create checklist tasks from templates for today
INSERT INTO public.checklist_tasks (checklist_id, template_task_id, title, description, estimated_minutes, is_critical, order_index, status)
SELECT 
  c.id,
  ctt.id,
  ctt.title,
  ctt.description,
  ctt.estimated_minutes,
  ctt.is_critical,
  ctt.order_index,
  'pending'
FROM public.checklists c
JOIN public.checklist_template_tasks ctt ON ctt.template_id = c.template_id
WHERE c.date = CURRENT_DATE
AND NOT EXISTS (
  SELECT 1 FROM public.checklist_tasks ct 
  WHERE ct.checklist_id = c.id AND ct.template_task_id = ctt.id
);