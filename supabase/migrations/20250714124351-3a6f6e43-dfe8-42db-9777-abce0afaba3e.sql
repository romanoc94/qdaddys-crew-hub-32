-- Create checklist templates table
CREATE TABLE public.checklist_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  checklist_type TEXT NOT NULL CHECK (checklist_type IN ('opening', 'closing', 'prep', 'catering', 'maintenance', 'cleaning')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create checklist template tasks
CREATE TABLE public.checklist_template_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.checklist_templates(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  estimated_minutes INTEGER DEFAULT 5,
  required_role TEXT, -- Which role should typically do this task
  order_index INTEGER NOT NULL DEFAULT 0,
  is_critical BOOLEAN NOT NULL DEFAULT false, -- Must be completed before shift can end
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily checklists (instances of templates)
CREATE TABLE public.checklists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID NOT NULL REFERENCES public.checklist_templates(id) ON DELETE CASCADE,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  shift_id UUID REFERENCES public.shifts(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create checklist tasks (instances of template tasks)
CREATE TABLE public.checklist_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_id UUID NOT NULL REFERENCES public.checklists(id) ON DELETE CASCADE,
  template_task_id UUID REFERENCES public.checklist_template_tasks(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  performance_rating TEXT CHECK (performance_rating IN ('below_expectations', 'met_expectations', 'exceeded_expectations')),
  estimated_minutes INTEGER DEFAULT 5,
  actual_minutes INTEGER,
  is_critical BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task comments for feedback and notes
CREATE TABLE public.task_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.checklist_tasks(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  comment_type TEXT NOT NULL DEFAULT 'note' CHECK (comment_type IN ('note', 'issue', 'feedback', 'instruction')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_template_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;

-- Policies for checklist templates
CREATE POLICY "Users can view templates in their store" 
ON public.checklist_templates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.store_id = checklist_templates.store_id
  )
);

CREATE POLICY "Managers can manage templates" 
ON public.checklist_templates 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('manager', 'operator')
    AND profiles.store_id = checklist_templates.store_id
  )
);

-- Policies for template tasks
CREATE POLICY "Users can view template tasks in their store" 
ON public.checklist_template_tasks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.checklist_templates 
    JOIN public.profiles ON profiles.store_id = checklist_templates.store_id
    WHERE checklist_templates.id = checklist_template_tasks.template_id
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Managers can manage template tasks" 
ON public.checklist_template_tasks 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.checklist_templates 
    JOIN public.profiles ON profiles.store_id = checklist_templates.store_id
    WHERE checklist_templates.id = checklist_template_tasks.template_id
    AND profiles.user_id = auth.uid()
    AND profiles.role IN ('manager', 'operator')
  )
);

-- Policies for checklists
CREATE POLICY "Users can view checklists in their store" 
ON public.checklists 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.store_id = checklists.store_id
  )
);

CREATE POLICY "Users can create checklists in their store" 
ON public.checklists 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.store_id = checklists.store_id
  )
);

CREATE POLICY "Users can update checklists in their store" 
ON public.checklists 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.store_id = checklists.store_id
  )
);

-- Policies for checklist tasks
CREATE POLICY "Users can view tasks in their store" 
ON public.checklist_tasks 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.checklists 
    JOIN public.profiles ON profiles.store_id = checklists.store_id
    WHERE checklists.id = checklist_tasks.checklist_id
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update tasks in their store" 
ON public.checklist_tasks 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.checklists 
    JOIN public.profiles ON profiles.store_id = checklists.store_id
    WHERE checklists.id = checklist_tasks.checklist_id
    AND profiles.user_id = auth.uid()
  )
);

-- Policies for task comments
CREATE POLICY "Users can view comments in their store" 
ON public.task_comments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.checklist_tasks 
    JOIN public.checklists ON checklists.id = checklist_tasks.checklist_id
    JOIN public.profiles ON profiles.store_id = checklists.store_id
    WHERE checklist_tasks.id = task_comments.task_id
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create comments in their store" 
ON public.task_comments 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.checklist_tasks 
    JOIN public.checklists ON checklists.id = checklist_tasks.checklist_id
    JOIN public.profiles ON profiles.store_id = checklists.store_id
    WHERE checklist_tasks.id = task_comments.task_id
    AND profiles.user_id = auth.uid()
    AND profiles.id = task_comments.profile_id
  )
);

-- Add triggers for timestamp updates
CREATE TRIGGER update_checklist_templates_updated_at
  BEFORE UPDATE ON public.checklist_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_checklists_updated_at
  BEFORE UPDATE ON public.checklists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_checklist_tasks_updated_at
  BEFORE UPDATE ON public.checklist_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample checklist templates
INSERT INTO public.checklist_templates (store_id, name, description, checklist_type) 
SELECT 
  stores.id,
  'Opening Checklist',
  'Daily opening procedures for BBQ restaurant',
  'opening'
FROM public.stores 
WHERE stores.name = 'Qdaddy''s BBQ Mansfield'
LIMIT 1;

INSERT INTO public.checklist_templates (store_id, name, description, checklist_type) 
SELECT 
  stores.id,
  'Closing Checklist',
  'End of day closing procedures',
  'closing'
FROM public.stores 
WHERE stores.name = 'Qdaddy''s BBQ Mansfield'
LIMIT 1;

-- Insert sample template tasks for opening checklist
INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, required_role, order_index, is_critical)
SELECT 
  templates.id,
  'Fire up the pits',
  'Light the smokers and bring temperature to 225°F',
  30,
  'pitmaster',
  1,
  true
FROM public.checklist_templates templates
WHERE templates.name = 'Opening Checklist'
LIMIT 1;

INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, required_role, order_index, is_critical)
SELECT 
  templates.id,
  'Restock sauce bottles',
  'Fill all sauce dispensers and check expiration dates',
  15,
  'prep_cook',
  2,
  false
FROM public.checklist_templates templates
WHERE templates.name = 'Opening Checklist'
LIMIT 1;

INSERT INTO public.checklist_template_tasks (template_id, title, description, estimated_minutes, required_role, order_index, is_critical)
SELECT 
  templates.id,
  'Setup POS system',
  'Turn on register, test card reader, load receipt paper',
  10,
  'cashier',
  3,
  true
FROM public.checklist_templates templates
WHERE templates.name = 'Opening Checklist'
LIMIT 1;