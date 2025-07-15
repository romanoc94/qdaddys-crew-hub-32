-- Fix RLS policy for profile creation during signup
-- The current policy is blocking signup users from creating their initial profile
-- We need to allow users to create their own profile during signup

-- Drop existing restrictive INSERT policy for profiles
DROP POLICY IF EXISTS "Managers can create profiles in their store" ON public.profiles;

-- Create new policy that allows users to create their own profile during signup
CREATE POLICY "Users can create their own profile during signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Also allow managers to create profiles for their store (as before)
CREATE POLICY "Managers can create profiles in their store" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  -- Either user is creating their own profile
  auth.uid() = user_id 
  OR 
  -- Or manager is creating profile for their store
  EXISTS (
    SELECT 1 
    FROM public.profiles manager_profile
    WHERE manager_profile.user_id = auth.uid() 
    AND manager_profile.role IN ('manager', 'operator') 
    AND manager_profile.store_id = profiles.store_id
  )
);

-- Ensure the create_store_during_signup function exists and works properly
CREATE OR REPLACE FUNCTION public.create_store_during_signup(
  p_name text, 
  p_location text, 
  p_address text DEFAULT NULL, 
  p_phone text DEFAULT NULL, 
  p_toast_pos_id text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_store_id uuid;
BEGIN
  -- Ensure caller is authenticated (post-signup)
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Must be authenticated to create a store';
  END IF;

  -- Prevent duplicates if user already has a profile/store
  IF EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'User already has a profile and store';
  END IF;

  -- Insert the store and return its ID
  INSERT INTO public.stores (
    name, location, address, phone, toast_pos_id, is_active
  ) VALUES (
    p_name, p_location, p_address, p_phone, p_toast_pos_id, true
  ) RETURNING id INTO new_store_id;

  RETURN new_store_id;
END;
$$;