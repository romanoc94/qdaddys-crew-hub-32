-- Fix the completed_by foreign key relationship in checklist_tasks
ALTER TABLE public.checklist_tasks 
ADD CONSTRAINT checklist_tasks_completed_by_fkey 
FOREIGN KEY (completed_by) 
REFERENCES public.profiles(id);

-- Also add the assigned_to foreign key if missing
ALTER TABLE public.checklist_tasks 
ADD CONSTRAINT checklist_tasks_assigned_to_fkey 
FOREIGN KEY (assigned_to) 
REFERENCES public.profiles(id);