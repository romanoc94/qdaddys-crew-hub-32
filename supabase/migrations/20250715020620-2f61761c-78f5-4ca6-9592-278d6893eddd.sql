-- Fix RLS policy for stores to allow authenticated users to create stores during signup
-- Drop the existing policy that's causing issues
DROP POLICY IF EXISTS "Users can create stores and operators can manage them" ON public.stores;

-- Create separate policies for different operations for better control
-- Policy for SELECT operations
CREATE POLICY "Users can view stores they belong to" 
ON public.stores 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.store_id = stores.id
  )
  OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'operator'
  )
);

-- Policy for INSERT operations - allows authenticated users to create stores
CREATE POLICY "Authenticated users can create stores" 
ON public.stores 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Policy for UPDATE operations
CREATE POLICY "Users can update stores they belong to" 
ON public.stores 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.store_id = stores.id
    AND profiles.role IN ('manager', 'operator')
  )
);

-- Policy for DELETE operations
CREATE POLICY "Operators can delete stores" 
ON public.stores 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'operator'
  )
);