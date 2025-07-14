-- Fix infinite recursion in profiles RLS policies
DROP POLICY IF EXISTS "Managers can create profiles in their store" ON public.profiles;

-- Create corrected policy for managers creating profiles
CREATE POLICY "Managers can create profiles in their store" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM profiles manager_profile 
    WHERE manager_profile.user_id = auth.uid() 
    AND manager_profile.role IN ('manager', 'operator') 
    AND manager_profile.store_id = profiles.store_id
  )
);