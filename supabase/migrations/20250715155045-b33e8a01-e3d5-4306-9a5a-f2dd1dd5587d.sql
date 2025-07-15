-- Check what's in the training_templates table currently
SELECT id, name, level FROM training_templates LIMIT 10;

-- Delete the problematic row that keeps failing
DELETE FROM training_templates WHERE id = 'af32e044-57c4-4523-93cb-7602e49c7176';

-- Update any remaining rows to use valid level values
UPDATE training_templates 
SET level = 'beginner' 
WHERE level NOT IN ('beginner', 'intermediate', 'advanced');

-- Drop existing constraint
ALTER TABLE training_templates DROP CONSTRAINT IF EXISTS training_templates_level_check;

-- Add the new constraint
ALTER TABLE training_templates ADD CONSTRAINT training_templates_level_check 
CHECK (level IN ('beginner', 'intermediate', 'advanced'));

-- Insert the 8 new training templates
INSERT INTO training_templates (id, name, description, level, category, estimated_duration_hours, role_requirements, certification_required, store_id, is_active, quiz_questions) VALUES
('aa000000-1111-2222-3333-444444444401', 'Kitchen Operations', 'Essential kitchen duties and safety procedures for BBQ restaurant operations', 'beginner', 'operations', 4, ARRAY['prep_cook', 'pitmaster'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[{"question": "What temperature should the smoker be maintained at?", "options": ["200-220°F", "225-250°F", "275-300°F", "325-350°F"], "correct": 1}]'::jsonb),
('aa000000-1111-2222-3333-444444444402', 'Prep Work Fundamentals', 'Ingredient preparation and mise en place for BBQ service', 'beginner', 'operations', 3, ARRAY['prep_cook'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[{"question": "How far in advance should vegetables be prepped?", "options": ["Day before", "Same day", "Week before", "Immediately before service"], "correct": 1}]'::jsonb),
('aa000000-1111-2222-3333-444444444403', 'Working the Line', 'Assembly line operations and order fulfillment efficiency', 'beginner', 'service', 3, ARRAY['line_cook', 'front_of_house'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[{"question": "What is the most important aspect of line work?", "options": ["Speed", "Accuracy", "Both speed and accuracy", "Appearance"], "correct": 2}]'::jsonb),
('aa000000-1111-2222-3333-444444444404', 'Register & Customer Service', 'POS operations and customer interaction excellence', 'beginner', 'service', 2, ARRAY['cashier', 'front_of_house'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[{"question": "How should you greet customers?", "options": ["Silently", "With a smile and welcome", "Only when they speak first", "Quickly without eye contact"], "correct": 1}]'::jsonb),
('aa000000-1111-2222-3333-444444444405', 'Entering Leadership', 'Foundation skills for supervisory roles and team guidance', 'intermediate', 'leadership', 6, ARRAY['team_member', 'shift_leader'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[{"question": "What is the key to effective delegation?", "options": ["Doing it yourself", "Clear instructions and follow-up", "Hoping for the best", "Micromanaging"], "correct": 1}]'::jsonb),
('aa000000-1111-2222-3333-444444444406', 'Shift Management', 'Running efficient shifts and managing team performance', 'intermediate', 'leadership', 8, ARRAY['shift_leader'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[{"question": "How should you plan daily assignments?", "options": ["Randomly", "Based on availability and skills", "By seniority", "Always the same"], "correct": 1}]'::jsonb),
('aa000000-1111-2222-3333-444444444407', 'Team Development', 'Advanced coaching and employee development strategies', 'advanced', 'leadership', 12, ARRAY['manager', 'shift_leader'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[{"question": "What is the goal of employee coaching?", "options": ["Finding faults", "Improvement and growth", "Punishment", "Compliance"], "correct": 1}]'::jsonb),
('aa000000-1111-2222-3333-444444444408', 'General Manager Training', 'Comprehensive store operations and strategic management', 'advanced', 'leadership', 16, ARRAY['manager', 'operator'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[{"question": "What is the GM''s primary responsibility?", "options": ["Working the line", "Overall store success", "Inventory only", "Customer service"], "correct": 1}]'::jsonb);

-- Add sample training instances with some progress
INSERT INTO training_instances (id, template_id, profile_id, status, progress_percentage, assigned_by, assigned_at, started_at, expires_at) VALUES
('cc000000-1111-2222-3333-444444444001', 'aa000000-1111-2222-3333-444444444401', '2fef2f35-70e2-4a33-9146-54a6bb27c422', 'in_progress', 40, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '5 days', now() - interval '4 days', now() + interval '85 days'),
('cc000000-1111-2222-3333-444444444002', 'aa000000-1111-2222-3333-444444444402', '2fef2f35-70e2-4a33-9146-54a6bb27c422', 'completed', 100, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '10 days', now() - interval '9 days', now() + interval '80 days'),
('cc000000-1111-2222-3333-444444444003', 'aa000000-1111-2222-3333-444444444403', '3abc789d-e456-f789-0123-456789abcdef', 'assigned', 0, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '1 day', null, now() + interval '89 days'),
('cc000000-1111-2222-3333-444444444004', 'aa000000-1111-2222-3333-444444444404', '3abc789d-e456-f789-0123-456789abcdef', 'in_progress', 60, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '7 days', now() - interval '6 days', now() + interval '83 days'),
('cc000000-1111-2222-3333-444444444005', 'aa000000-1111-2222-3333-444444444405', '4def123e-f567-8901-2345-6789abcdef01', 'approved', 100, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '15 days', now() - interval '14 days', now() + interval '75 days'),
('cc000000-1111-2222-3333-444444444006', 'aa000000-1111-2222-3333-444444444406', '4def123e-f567-8901-2345-6789abcdef01', 'in_progress', 25, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '3 days', now() - interval '2 days', now() + interval '87 days'),
('cc000000-1111-2222-3333-444444444007', 'aa000000-1111-2222-3333-444444444407', '5ghi456f-0789-1234-5678-90abcdef1234', 'in_progress', 80, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '12 days', now() - interval '11 days', now() + interval '78 days'),
('cc000000-1111-2222-3333-444444444008', 'aa000000-1111-2222-3333-444444444408', '6jkl789g-1234-5678-9012-3456789abcde', 'in_progress', 10, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '2 days', now() - interval '1 day', now() + interval '88 days');