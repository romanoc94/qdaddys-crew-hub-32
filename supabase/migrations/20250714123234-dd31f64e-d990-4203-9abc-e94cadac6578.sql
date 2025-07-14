-- Create shifts table
CREATE TABLE public.shifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  shift_type TEXT NOT NULL CHECK (shift_type IN ('opening', 'lunch', 'dinner', 'closing', 'all_day')),
  start_time TIME,
  end_time TIME,
  notes TEXT,
  daily_specials TEXT,
  catering_notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shift assignments table
CREATE TABLE public.shift_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shift_id UUID NOT NULL REFERENCES public.shifts(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  primary_role TEXT NOT NULL CHECK (primary_role IN ('pitmaster', 'cashier', 'prep_cook', 'catering_lead', 'front_of_house', 'manager')),
  secondary_roles TEXT[] DEFAULT '{}',
  bbq_buddy_id UUID REFERENCES public.profiles(id), -- For BBQ Buddies pairing
  is_scheduled BOOLEAN NOT NULL DEFAULT true, -- false for unscheduled staff added to shift
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(shift_id, profile_id)
);

-- Create Q-Cash transactions table (for rewards system)
CREATE TABLE public.qcash_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Amount in Q-Cash points
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('reward', 'transfer', 'deduction', 'redemption')),
  source_profile_id UUID REFERENCES public.profiles(id), -- For transfers
  description TEXT NOT NULL,
  shift_id UUID REFERENCES public.shifts(id), -- If related to a shift
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qcash_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for shifts
CREATE POLICY "Users can view shifts in their store" 
ON public.shifts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.store_id = shifts.store_id
  )
);

CREATE POLICY "Shift leaders and managers can create shifts" 
ON public.shifts 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('shift_leader', 'manager', 'operator')
    AND profiles.store_id = shifts.store_id
  )
);

CREATE POLICY "Shift leaders and managers can update shifts" 
ON public.shifts 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('shift_leader', 'manager', 'operator')
    AND profiles.store_id = shifts.store_id
  )
);

-- Policies for shift assignments
CREATE POLICY "Users can view shift assignments in their store" 
ON public.shift_assignments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.shifts 
    JOIN public.profiles ON profiles.store_id = shifts.store_id
    WHERE shifts.id = shift_assignments.shift_id
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Shift leaders and managers can manage assignments" 
ON public.shift_assignments 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.shifts 
    JOIN public.profiles ON profiles.store_id = shifts.store_id
    WHERE shifts.id = shift_assignments.shift_id
    AND profiles.user_id = auth.uid()
    AND profiles.role IN ('shift_leader', 'manager', 'operator')
  )
);

-- Policies for Q-Cash transactions
CREATE POLICY "Users can view their own Q-Cash transactions" 
ON public.qcash_transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = qcash_transactions.profile_id
    AND profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view Q-Cash transactions in their store" 
ON public.qcash_transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p1
    JOIN public.profiles p2 ON p1.store_id = p2.store_id
    WHERE p1.user_id = auth.uid()
    AND p2.id = qcash_transactions.profile_id
  )
);

CREATE POLICY "Shift leaders and managers can create Q-Cash transactions" 
ON public.qcash_transactions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p1
    JOIN public.profiles p2 ON p1.store_id = p2.store_id
    WHERE p1.user_id = auth.uid()
    AND p1.role IN ('shift_leader', 'manager', 'operator')
    AND p2.id = qcash_transactions.profile_id
  )
);

-- Add triggers for timestamp updates
CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON public.shifts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shift_assignments_updated_at
  BEFORE UPDATE ON public.shift_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.shifts (store_id, date, shift_type, start_time, end_time, notes) 
SELECT 
  stores.id,
  CURRENT_DATE,
  'lunch',
  '10:00'::time,
  '15:00'::time,
  'Lunch shift - BBQ lunch special: Brisket sandwich combo'
FROM public.stores 
WHERE stores.name = 'Qdaddy''s BBQ Mansfield'
LIMIT 1;

INSERT INTO public.shifts (store_id, date, shift_type, start_time, end_time, notes) 
SELECT 
  stores.id,
  CURRENT_DATE,
  'dinner',
  '15:00'::time,
  '22:00'::time,
  'Dinner shift - Weekend BBQ platter special'
FROM public.stores 
WHERE stores.name = 'Qdaddy''s BBQ Mansfield'
LIMIT 1;