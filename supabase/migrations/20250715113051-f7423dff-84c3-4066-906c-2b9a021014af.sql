-- Insert sample checklist templates and tasks
DO $$
DECLARE
    sample_store_id uuid;
    template_opening_id uuid;
    template_closing_id uuid;
BEGIN
    -- Get the first store to use for sample data
    SELECT id INTO sample_store_id FROM public.stores LIMIT 1;
    
    IF sample_store_id IS NOT NULL THEN
        -- Insert opening checklist template
        INSERT INTO public.checklist_templates (id, name, description, checklist_type, store_id, is_active)
        VALUES (gen_random_uuid(), 'Daily Opening Checklist', 'Essential tasks to open the BBQ restaurant', 'opening', sample_store_id, true)
        ON CONFLICT DO NOTHING
        RETURNING id INTO template_opening_id;
        
        -- Get the opening template ID if it already exists
        IF template_opening_id IS NULL THEN
            SELECT id INTO template_opening_id 
            FROM public.checklist_templates 
            WHERE name = 'Daily Opening Checklist' AND store_id = sample_store_id LIMIT 1;
        END IF;
        
        -- Insert opening template tasks
        INSERT INTO public.checklist_template_tasks (template_id, title, description, order_index, estimated_minutes, is_critical, required_role)
        VALUES 
            (template_opening_id, 'Fire up the smokers', 'Start smokers and check temperature controls', 1, 30, true, 'pitmaster'),
            (template_opening_id, 'Check meat inventory', 'Verify all meats are fresh and properly stored', 2, 15, true, 'prep_cook'),
            (template_opening_id, 'Prep sauces and sides', 'Prepare BBQ sauces and side dishes for the day', 3, 45, false, 'prep_cook'),
            (template_opening_id, 'Set up front counter', 'Arrange display cases and check POS system', 4, 20, false, 'cashier'),
            (template_opening_id, 'Clean dining area', 'Wipe tables, sweep floors, and stock napkins', 5, 25, false, 'front_of_house')
        ON CONFLICT DO NOTHING;
        
        -- Insert closing checklist template
        INSERT INTO public.checklist_templates (id, name, description, checklist_type, store_id, is_active)
        VALUES (gen_random_uuid(), 'Daily Closing Checklist', 'End of day cleanup and shutdown procedures', 'closing', sample_store_id, true)
        ON CONFLICT DO NOTHING
        RETURNING id INTO template_closing_id;
        
        -- Get the closing template ID if it already exists
        IF template_closing_id IS NULL THEN
            SELECT id INTO template_closing_id 
            FROM public.checklist_templates 
            WHERE name = 'Daily Closing Checklist' AND store_id = sample_store_id LIMIT 1;
        END IF;
        
        -- Insert closing template tasks
        INSERT INTO public.checklist_template_tasks (template_id, title, description, order_index, estimated_minutes, is_critical, required_role)
        VALUES 
            (template_closing_id, 'Clean and shutdown smokers', 'Properly clean and shut down all cooking equipment', 1, 45, true, 'pitmaster'),
            (template_closing_id, 'Count register', 'Count cash drawer and prepare deposit', 2, 20, true, 'cashier'),
            (template_closing_id, 'Deep clean kitchen', 'Sanitize all cooking surfaces and equipment', 3, 60, true, 'prep_cook'),
            (template_closing_id, 'Lock up building', 'Secure all doors and set alarm system', 4, 10, true, 'manager'),
            (template_closing_id, 'Store leftover food', 'Properly wrap and refrigerate remaining food', 5, 30, false, 'prep_cook')
        ON CONFLICT DO NOTHING;
        
        -- Insert sample shifts for today
        INSERT INTO public.shifts (store_id, date, shift_type, start_time, end_time, notes, daily_specials, catering_notes)
        VALUES 
            (sample_store_id, CURRENT_DATE, 'opening', '06:00', '14:00', 'Morning prep and lunch rush', 'Smoked brisket special with cornbread', 'Corporate lunch order for 50 people at 12:30'),
            (sample_store_id, CURRENT_DATE, 'dinner', '14:00', '22:00', 'Afternoon and dinner service', 'Ribs and pulled pork combo deals', 'Birthday party setup for 8 people at 6 PM')
        ON CONFLICT (store_id, date, shift_type) DO NOTHING;
        
        -- Create sample checklists for today
        INSERT INTO public.checklists (template_id, store_id, date, status)
        SELECT template_opening_id, sample_store_id, CURRENT_DATE, 'pending'
        WHERE NOT EXISTS (
            SELECT 1 FROM public.checklists 
            WHERE template_id = template_opening_id AND date = CURRENT_DATE
        );
        
        INSERT INTO public.checklists (template_id, store_id, date, status)
        SELECT template_closing_id, sample_store_id, CURRENT_DATE, 'pending'
        WHERE NOT EXISTS (
            SELECT 1 FROM public.checklists 
            WHERE template_id = template_closing_id AND date = CURRENT_DATE
        );
        
    END IF;
END $$;