-- Add sample data for demo purposes
-- This creates a demo store with sample profiles, checklists, and shifts

-- First, create sample checklist templates for the existing stores
INSERT INTO public.checklist_templates (
  name, description, checklist_type, store_id, is_active, created_at
) SELECT 
  template_data.name,
  template_data.description,
  template_data.checklist_type,
  stores.id,
  true,
  now()
FROM 
  public.stores,
  (VALUES
    ('Opening Checklist', 'Essential tasks to open the restaurant', 'opening'),
    ('Closing Checklist', 'End-of-day cleanup and prep for tomorrow', 'closing'),
    ('BBQ Prep Checklist', 'Daily meat preparation and smoking tasks', 'prep')
  ) AS template_data(name, description, checklist_type)
WHERE stores.is_active = true
ON CONFLICT DO NOTHING;

-- Add sample template tasks for the checklist templates
WITH template_tasks AS (
  SELECT 
    template_id,
    task_data.title,
    task_data.description,
    task_data.estimated_minutes,
    task_data.is_critical,
    task_data.order_index
  FROM 
    public.checklist_templates,
    (VALUES
      ('opening', 'Turn on smokers and check temperature', 'Ensure all smokers are at proper temp (225-250°F)', 15, true, 1),
      ('opening', 'Check meat inventory', 'Verify brisket, ribs, and pork availability', 10, true, 2),
      ('opening', 'Prep sides and sauces', 'Prepare daily sides and check sauce levels', 20, false, 3),
      ('opening', 'Set up front counter', 'Arrange displays and check register', 10, false, 4),
      ('closing', 'Clean and sanitize surfaces', 'Deep clean all prep and service areas', 30, true, 1),
      ('closing', 'Secure smokers for overnight', 'Bank coals and set overnight temperature', 15, true, 2),
      ('closing', 'Count register and deposit', 'Complete daily sales reconciliation', 20, true, 3),
      ('closing', 'Stock prep areas for tomorrow', 'Ensure all stations are ready for next day', 15, false, 4),
      ('prep', 'Season briskets for tomorrow', 'Apply dry rub to briskets for overnight cook', 45, true, 1),
      ('prep', 'Trim ribs and apply rub', 'Prepare rib racks for next service', 30, false, 2),
      ('prep', 'Check wood supply', 'Ensure adequate hickory and oak for smoking', 10, false, 3),
      ('prep', 'Prepare pulled pork', 'Start pork shoulders for next day service', 20, false, 4)
    ) AS task_data(checklist_type, title, description, estimated_minutes, is_critical, order_index)
  WHERE checklist_templates.checklist_type = task_data.checklist_type
)
INSERT INTO public.checklist_template_tasks (
  template_id, title, description, estimated_minutes, is_critical, order_index, created_at
)
SELECT template_id, title, description, estimated_minutes, is_critical, order_index, now()
FROM template_tasks
ON CONFLICT DO NOTHING;

-- Create sample shifts for today if they don't exist
INSERT INTO public.shifts (
  store_id, date, shift_type, start_time, end_time, 
  notes, daily_specials, catering_notes, created_at
)
SELECT 
  stores.id,
  CURRENT_DATE,
  shift_data.shift_type,
  shift_data.start_time::time,
  shift_data.end_time::time,
  shift_data.notes,
  shift_data.daily_specials,
  shift_data.catering_notes,
  now()
FROM 
  public.stores,
  (VALUES
    ('opening', '06:00', '11:00', 'Early morning prep and opening tasks', 'Breakfast brisket tacos, morning specials', ''),
    ('lunch', '10:00', '15:00', 'Peak lunch service', 'BBQ combo plates, pulled pork sandwiches', 'Corporate lunch order: 50 sandwiches at 12:30'),
    ('dinner', '15:00', '22:00', 'Evening service and dinner rush', 'Full rack specials, family platters', 'Wedding catering pickup at 5 PM')
  ) AS shift_data(shift_type, start_time, end_time, notes, daily_specials, catering_notes)
WHERE stores.is_active = true
AND NOT EXISTS (
  SELECT 1 FROM public.shifts 
  WHERE shifts.store_id = stores.id 
  AND shifts.date = CURRENT_DATE 
  AND shifts.shift_type = shift_data.shift_type
);

-- Create sample checklists for today using the templates
INSERT INTO public.checklists (
  template_id, store_id, date, status, created_at
)
SELECT 
  checklist_templates.id,
  checklist_templates.store_id,
  CURRENT_DATE,
  'pending',
  now()
FROM public.checklist_templates
WHERE checklist_templates.is_active = true
AND NOT EXISTS (
  SELECT 1 FROM public.checklists 
  WHERE checklists.template_id = checklist_templates.id 
  AND checklists.date = CURRENT_DATE
);

-- Create tasks from templates for today's checklists
INSERT INTO public.checklist_tasks (
  checklist_id, template_task_id, title, description, 
  estimated_minutes, is_critical, order_index, status, created_at
)
SELECT 
  checklists.id,
  template_tasks.id,
  template_tasks.title,
  template_tasks.description,
  template_tasks.estimated_minutes,
  template_tasks.is_critical,
  template_tasks.order_index,
  'pending',
  now()
FROM public.checklists
JOIN public.checklist_templates ON checklist_templates.id = checklists.template_id
JOIN public.checklist_template_tasks template_tasks ON template_tasks.template_id = checklist_templates.id
WHERE checklists.date = CURRENT_DATE
AND NOT EXISTS (
  SELECT 1 FROM public.checklist_tasks 
  WHERE checklist_tasks.checklist_id = checklists.id 
  AND checklist_tasks.template_task_id = template_tasks.id
);