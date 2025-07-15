-- Create training templates and instances system

-- Training templates table
CREATE TABLE public.training_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  level text NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  category text NOT NULL,
  role_requirements text[] DEFAULT '{}',
  estimated_duration_hours integer DEFAULT 8,
  quiz_questions jsonb DEFAULT '[]',
  certification_required boolean DEFAULT true,
  is_active boolean DEFAULT true,
  store_id uuid NOT NULL,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Training template tasks (checklist items)
CREATE TABLE public.training_template_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  estimated_minutes integer DEFAULT 15,
  is_required boolean DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  task_type text DEFAULT 'checklist' CHECK (task_type IN ('checklist', 'quiz', 'video', 'roleplay')),
  task_data jsonb DEFAULT '{}', -- For quiz questions, video URLs, etc.
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- User training instances (assigned training with personal progress)
CREATE TABLE public.training_instances (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid NOT NULL,
  profile_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'approved', 'expired')),
  assigned_by uuid,
  assigned_at timestamp with time zone NOT NULL DEFAULT now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  approved_at timestamp with time zone,
  approved_by uuid,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  notes text,
  score integer,
  certification_earned boolean DEFAULT false,
  expires_at timestamp with time zone DEFAULT (now() + interval '90 days'),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(template_id, profile_id, assigned_at) -- Prevent duplicate active assignments
);

-- Individual task progress for each user
CREATE TABLE public.training_instance_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instance_id uuid NOT NULL,
  template_task_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  completed_at timestamp with time zone,
  time_spent_minutes integer DEFAULT 0,
  score integer, -- For quiz tasks
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(instance_id, template_task_id)
);

-- Enable RLS on all training tables
ALTER TABLE public.training_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_template_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_instance_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for training_templates
CREATE POLICY "Users can view templates in their store" 
ON public.training_templates FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.store_id = training_templates.store_id
));

CREATE POLICY "Leaders can manage templates" 
ON public.training_templates FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IN ('shift_leader', 'manager', 'operator') 
  AND profiles.store_id = training_templates.store_id
));

-- RLS Policies for training_template_tasks
CREATE POLICY "Users can view template tasks in their store" 
ON public.training_template_tasks FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM training_templates t
  JOIN profiles p ON p.store_id = t.store_id
  WHERE t.id = training_template_tasks.template_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Leaders can manage template tasks" 
ON public.training_template_tasks FOR ALL 
USING (EXISTS (
  SELECT 1 FROM training_templates t
  JOIN profiles p ON p.store_id = t.store_id
  WHERE t.id = training_template_tasks.template_id 
  AND p.user_id = auth.uid()
  AND p.role IN ('shift_leader', 'manager', 'operator')
));

-- RLS Policies for training_instances
CREATE POLICY "Users can view their own training instances" 
ON public.training_instances FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = training_instances.profile_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Users can view instances in their store" 
ON public.training_instances FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles p1
  JOIN profiles p2 ON p1.store_id = p2.store_id
  WHERE p1.user_id = auth.uid() 
  AND p2.id = training_instances.profile_id
));

CREATE POLICY "Users can update their own training progress" 
ON public.training_instances FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = training_instances.profile_id 
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Leaders can manage training instances" 
ON public.training_instances FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles p1
  JOIN profiles p2 ON p1.store_id = p2.store_id
  WHERE p1.user_id = auth.uid() 
  AND p1.role IN ('shift_leader', 'manager', 'operator')
  AND p2.id = training_instances.profile_id
));

-- RLS Policies for training_instance_tasks
CREATE POLICY "Users can view their own task progress" 
ON public.training_instance_tasks FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM training_instances ti
  JOIN profiles p ON p.id = ti.profile_id
  WHERE ti.id = training_instance_tasks.instance_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Users can update their own task progress" 
ON public.training_instance_tasks FOR ALL 
USING (EXISTS (
  SELECT 1 FROM training_instances ti
  JOIN profiles p ON p.id = ti.profile_id
  WHERE ti.id = training_instance_tasks.instance_id 
  AND p.user_id = auth.uid()
));

CREATE POLICY "Leaders can view task progress in their store" 
ON public.training_instance_tasks FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM training_instances ti
  JOIN profiles p1 ON p1.id = ti.profile_id
  JOIN profiles p2 ON p2.store_id = p1.store_id
  WHERE ti.id = training_instance_tasks.instance_id 
  AND p2.user_id = auth.uid()
  AND p2.role IN ('shift_leader', 'manager', 'operator')
));

-- Function to update training instance progress
CREATE OR REPLACE FUNCTION public.update_training_progress()
RETURNS trigger AS $$
BEGIN
  -- Update instance progress when task status changes
  UPDATE public.training_instances
  SET 
    progress_percentage = (
      SELECT COALESCE(
        ROUND(
          (COUNT(*) FILTER (WHERE status = 'completed')::decimal / COUNT(*)) * 100
        ), 0
      )
      FROM public.training_instance_tasks
      WHERE instance_id = NEW.instance_id
    ),
    updated_at = now(),
    status = CASE 
      WHEN (
        SELECT COUNT(*) FILTER (WHERE status = 'completed')
        FROM public.training_instance_tasks
        WHERE instance_id = NEW.instance_id
      ) = (
        SELECT COUNT(*)
        FROM public.training_instance_tasks
        WHERE instance_id = NEW.instance_id
      ) THEN 'completed'
      WHEN OLD.status = 'assigned' AND NEW.status IN ('in_progress', 'completed') THEN 'in_progress'
      ELSE status
    END,
    completed_at = CASE 
      WHEN (
        SELECT COUNT(*) FILTER (WHERE status = 'completed')
        FROM public.training_instance_tasks
        WHERE instance_id = NEW.instance_id
      ) = (
        SELECT COUNT(*)
        FROM public.training_instance_tasks
        WHERE instance_id = NEW.instance_id
      ) THEN now()
      ELSE completed_at
    END
  WHERE id = NEW.instance_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update progress
CREATE TRIGGER update_training_instance_progress
  AFTER UPDATE ON public.training_instance_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_training_progress();

-- Trigger for updated_at timestamps
CREATE TRIGGER update_training_templates_updated_at
  BEFORE UPDATE ON public.training_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_instances_updated_at
  BEFORE UPDATE ON public.training_instances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_instance_tasks_updated_at
  BEFORE UPDATE ON public.training_instance_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();