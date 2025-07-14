-- Create audit trails table for tracking role and permission changes
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES profiles(id),
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reason TEXT
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for audit logs
CREATE POLICY "Users can view audit logs in their store" 
ON public.audit_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles p1
    JOIN profiles p2 ON p1.store_id = p2.store_id
    WHERE p1.user_id = auth.uid() 
    AND p2.id = audit_logs.record_id
  )
);

CREATE POLICY "Managers can create audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('manager', 'operator')
    AND id = audit_logs.changed_by
  )
);

-- Create employee invitations table
CREATE TABLE public.employee_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id),
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'team_member',
  employee_id TEXT,
  phone TEXT,
  invited_by UUID REFERENCES profiles(id),
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending' -- 'pending', 'accepted', 'expired'
);

-- Enable RLS
ALTER TABLE public.employee_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for employee invitations
CREATE POLICY "Managers can manage invitations in their store" 
ON public.employee_invitations 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('manager', 'operator') 
    AND store_id = employee_invitations.store_id
  )
);

-- Create onboarding status table
CREATE TABLE public.store_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES stores(id) UNIQUE,
  step TEXT NOT NULL DEFAULT 'store_setup', -- 'store_setup', 'employee_import', 'completed'
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.store_onboarding ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding
CREATE POLICY "Users can manage onboarding for their store" 
ON public.store_onboarding 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('manager', 'operator') 
    AND store_id = store_onboarding.store_id
  )
);

-- Create trigger for updating updated_at
CREATE TRIGGER update_store_onboarding_updated_at
  BEFORE UPDATE ON public.store_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updating employee_invitations updated_at (if we add it)
ALTER TABLE public.employee_invitations ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now();

CREATE TRIGGER update_employee_invitations_updated_at
  BEFORE UPDATE ON public.employee_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();