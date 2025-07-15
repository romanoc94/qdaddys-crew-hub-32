-- Insert sample checklist templates for testing
INSERT INTO checklist_templates (id, name, description, checklist_type, store_id, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Morning Opening Checklist', 'Essential tasks to open the restaurant for the day', 'opening', 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true),
('550e8400-e29b-41d4-a716-446655440002', 'Evening Closing Checklist', 'Tasks to safely close the restaurant', 'closing', 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true),
('550e8400-e29b-41d4-a716-446655440003', 'BBQ Prep Checklist', 'Daily meat preparation and smoking setup', 'prep', 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true);

-- Insert template tasks for opening checklist
INSERT INTO checklist_template_tasks (id, template_id, title, description, estimated_minutes, is_critical, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440101', '550e8400-e29b-41d4-a716-446655440001', 'Unlock doors and disarm security', 'Safely open the restaurant and disable alarm system', 5, true, 1),
('550e8400-e29b-41d4-a716-446655440102', '550e8400-e29b-41d4-a716-446655440001', 'Turn on lights and equipment', 'Power up all kitchen equipment and dining area lights', 10, true, 2),
('550e8400-e29b-41d4-a716-446655440103', '550e8400-e29b-41d4-a716-446655440001', 'Check smoker temperature', 'Verify smoker is at proper temperature (225-250°F)', 5, true, 3),
('550e8400-e29b-41d4-a716-446655440104', '550e8400-e29b-41d4-a716-446655440001', 'Stock front of house supplies', 'Ensure napkins, utensils, and condiments are fully stocked', 15, false, 4),
('550e8400-e29b-41d4-a716-446655440105', '550e8400-e29b-41d4-a716-446655440001', 'Count register and verify cash', 'Count starting cash and verify against deposit sheet', 10, true, 5);

-- Create sample checklists for today's date
INSERT INTO checklists (id, template_id, store_id, date, status) VALUES
('550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440001', 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', CURRENT_DATE, 'pending'),
('550e8400-e29b-41d4-a716-446655450002', '550e8400-e29b-41d4-a716-446655440002', 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', CURRENT_DATE, 'pending'),
('550e8400-e29b-41d4-a716-446655450003', '550e8400-e29b-41d4-a716-446655440003', 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', CURRENT_DATE, 'in_progress');

-- Create actual checklist tasks from templates for opening checklist (without completed_by to avoid foreign key error)
INSERT INTO checklist_tasks (id, checklist_id, template_task_id, title, description, estimated_minutes, is_critical, order_index, status) VALUES
('550e8400-e29b-41d4-a716-446655451001', '550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440101', 'Unlock doors and disarm security', 'Safely open the restaurant and disable alarm system', 5, true, 1, 'completed'),
('550e8400-e29b-41d4-a716-446655451002', '550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440102', 'Turn on lights and equipment', 'Power up all kitchen equipment and dining area lights', 10, true, 2, 'completed'),
('550e8400-e29b-41d4-a716-446655451003', '550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440103', 'Check smoker temperature', 'Verify smoker is at proper temperature (225-250°F)', 5, true, 3, 'in_progress'),
('550e8400-e29b-41d4-a716-446655451004', '550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440104', 'Stock front of house supplies', 'Ensure napkins, utensils, and condiments are fully stocked', 15, false, 4, 'pending'),
('550e8400-e29b-41d4-a716-446655451005', '550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440105', 'Count register and verify cash', 'Count starting cash and verify against deposit sheet', 10, true, 5, 'pending');

-- Add sample task comments
INSERT INTO task_comments (id, task_id, profile_id, comment, comment_type) VALUES
('550e8400-e29b-41d4-a716-446655460001', '550e8400-e29b-41d4-a716-446655451001', '2fef2f35-70e2-4a33-9146-54a6bb27c422', 'Doors unlocked at 6:30 AM, security system disarmed successfully.', 'note'),
('550e8400-e29b-41d4-a716-446655460002', '550e8400-e29b-41d4-a716-446655451002', '2fef2f35-70e2-4a33-9146-54a6bb27c422', 'All equipment powered up and ready for service.', 'note');