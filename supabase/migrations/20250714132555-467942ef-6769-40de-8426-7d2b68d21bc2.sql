-- Create security definer functions to avoid infinite recursion in profiles RLS policies

-- Function to check if current user can manage profiles in a store
CREATE OR REPLACE FUNCTION public.can_manage_profiles_in_store(target_store_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE user_id = auth.uid() 
    AND role IN ('manager', 'operator') 
    AND store_id = target_store_id
  );
$$;

-- Function to check if current user belongs to a store
CREATE OR REPLACE FUNCTION public.belongs_to_store(target_store_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE user_id = auth.uid() 
    AND store_id = target_store_id
  );
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Managers can update profiles in their store" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles in their store" ON public.profiles;

-- Recreate policies using security definer functions
CREATE POLICY "Managers can update profiles in their store" 
ON public.profiles 
FOR UPDATE 
USING (public.can_manage_profiles_in_store(store_id));

CREATE POLICY "Users can view profiles in their store" 
ON public.profiles 
FOR SELECT 
USING (public.belongs_to_store(store_id));