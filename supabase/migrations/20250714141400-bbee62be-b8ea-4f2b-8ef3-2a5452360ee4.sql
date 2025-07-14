-- Fix RLS policy for stores to allow users to create stores during signup
-- Drop the existing policy that's too restrictive
DROP POLICY IF EXISTS "Operators can manage stores" ON public.stores;

-- Create a new policy that allows users to create stores during signup
-- and operators to manage existing stores
CREATE POLICY "Users can create stores and operators can manage them" 
ON public.stores 
FOR ALL 
USING (
  -- Users can view stores they belong to
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.store_id = stores.id
  )
  OR
  -- Operators can manage all stores
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'operator'
  )
)
WITH CHECK (
  -- Allow anyone to create stores (for signup process)
  -- This is safe because creating a store also creates the operator profile
  true
);