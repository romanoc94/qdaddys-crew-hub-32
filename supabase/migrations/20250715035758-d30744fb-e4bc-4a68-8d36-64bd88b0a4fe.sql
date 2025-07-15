-- Create test data for existing users who don't have profiles/stores yet
-- First, create a test store for any existing authenticated user
INSERT INTO public.stores (id, name, location, address, phone, is_active)
SELECT 
  gen_random_uuid(),
  'Test Restaurant',
  'Test Location', 
  '123 Test Street',
  '555-0123',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.stores LIMIT 1);

-- Get the store ID for profile creation
DO $$
DECLARE
  test_store_id uuid;
  auth_user_id uuid;
BEGIN
  -- Get the first store (our test store)
  SELECT id INTO test_store_id FROM public.stores LIMIT 1;
  
  -- Get user ID from auth.users if any exist
  SELECT id INTO auth_user_id FROM auth.users LIMIT 1;
  
  -- Create profile for existing user if they don't have one
  IF auth_user_id IS NOT NULL AND test_store_id IS NOT NULL THEN
    INSERT INTO public.profiles (user_id, store_id, first_name, last_name, role, is_active)
    SELECT 
      auth_user_id,
      test_store_id,
      'Test',
      'User',
      'operator',
      true
    WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE user_id = auth_user_id
    );
    
    -- Create onboarding record
    INSERT INTO public.store_onboarding (store_id, step)
    SELECT test_store_id, 'store_setup'
    WHERE NOT EXISTS (
      SELECT 1 FROM public.store_onboarding WHERE store_id = test_store_id
    );
    
    -- Create sample shifts for today and tomorrow
    INSERT INTO public.shifts (store_id, date, shift_type, start_time, end_time, notes)
    SELECT 
      test_store_id,
      CURRENT_DATE,
      'morning',
      '08:00:00',
      '16:00:00',
      'Morning shift'
    WHERE NOT EXISTS (
      SELECT 1 FROM public.shifts WHERE store_id = test_store_id AND date = CURRENT_DATE
    );
    
    INSERT INTO public.shifts (store_id, date, shift_type, start_time, end_time, notes)
    SELECT 
      test_store_id,
      CURRENT_DATE + INTERVAL '1 day',
      'evening',
      '16:00:00',
      '00:00:00',
      'Evening shift'
    WHERE NOT EXISTS (
      SELECT 1 FROM public.shifts WHERE store_id = test_store_id AND date = CURRENT_DATE + INTERVAL '1 day'
    );
  END IF;
END $$;