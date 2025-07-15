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

-- Insert template tasks for closing checklist  
INSERT INTO checklist_template_tasks (id, template_id, title, description, estimated_minutes, is_critical, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', 'Clean and sanitize all surfaces', 'Deep clean kitchen counters, prep areas, and dining tables', 30, true, 1),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440002', 'Secure smoker for overnight', 'Bank coals and ensure proper ventilation for overnight cooking', 15, true, 2),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440002', 'Count register and prepare deposit', 'Final cash count and bank deposit preparation', 20, true, 3),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440002', 'Lock doors and set security', 'Secure all entrances and activate alarm system', 5, true, 4);

-- Insert template tasks for BBQ prep checklist
INSERT INTO checklist_template_tasks (id, template_id, title, description, estimated_minutes, is_critical, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440003', 'Season brisket and pork shoulder', 'Apply dry rub to meats 24 hours before smoking', 45, true, 1),
('550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440003', 'Prepare wood chips and charcoal', 'Soak wood chips and prepare charcoal for 12-hour smoke', 20, true, 2),
('550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440003', 'Prep sides and sauces', 'Prepare coleslaw, beans, and signature BBQ sauces', 60, false, 3),
('550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440003', 'Stock serving containers', 'Ensure adequate containers for meat service', 10, false, 4);

-- Create sample checklists for today's date
INSERT INTO checklists (id, template_id, store_id, date, status) VALUES
('550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440001', 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', CURRENT_DATE, 'pending'),
('550e8400-e29b-41d4-a716-446655450002', '550e8400-e29b-41d4-a716-446655440002', 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', CURRENT_DATE, 'pending'),
('550e8400-e29b-41d4-a716-446655450003', '550e8400-e29b-41d4-a716-446655440003', 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', CURRENT_DATE, 'in_progress');

-- Create actual checklist tasks from templates for opening checklist
INSERT INTO checklist_tasks (id, checklist_id, template_task_id, title, description, estimated_minutes, is_critical, order_index, status) VALUES
('550e8400-e29b-41d4-a716-446655451001', '550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440101', 'Unlock doors and disarm security', 'Safely open the restaurant and disable alarm system', 5, true, 1, 'completed'),
('550e8400-e29b-41d4-a716-446655451002', '550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440102', 'Turn on lights and equipment', 'Power up all kitchen equipment and dining area lights', 10, true, 2, 'completed'),
('550e8400-e29b-41d4-a716-446655451003', '550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440103', 'Check smoker temperature', 'Verify smoker is at proper temperature (225-250°F)', 5, true, 3, 'in_progress'),
('550e8400-e29b-41d4-a716-446655451004', '550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440104', 'Stock front of house supplies', 'Ensure napkins, utensils, and condiments are fully stocked', 15, false, 4, 'pending'),
('550e8400-e29b-41d4-a716-446655451005', '550e8400-e29b-41d4-a716-446655450001', '550e8400-e29b-41d4-a716-446655440105', 'Count register and verify cash', 'Count starting cash and verify against deposit sheet', 10, true, 5, 'pending');

-- Create actual checklist tasks for BBQ prep checklist  
INSERT INTO checklist_tasks (id, checklist_id, template_task_id, title, description, estimated_minutes, is_critical, order_index, status, assigned_to, completed_by, completed_at, performance_rating) VALUES
('550e8400-e29b-41d4-a716-446655451101', '550e8400-e29b-41d4-a716-446655450003', '550e8400-e29b-41d4-a716-446655440301', 'Season brisket and pork shoulder', 'Apply dry rub to meats 24 hours before smoking', 45, true, 1, 'completed', '2fef2f35-70e2-4a33-9146-54a6bb27c422', '2fef2f35-70e2-4a33-9146-54a6bb27c422', NOW() - INTERVAL '2 hours', 'exceeded_expectations'),
('550e8400-e29b-41d4-a716-446655451102', '550e8400-e29b-41d4-a716-446655450003', '550e8400-e29b-41d4-a716-446655440302', 'Prepare wood chips and charcoal', 'Soak wood chips and prepare charcoal for 12-hour smoke', 20, true, 2, 'completed', '2fef2f35-70e2-4a33-9146-54a6bb27c422', '2fef2f35-70e2-4a33-9146-54a6bb27c422', NOW() - INTERVAL '1 hour', 'met_expectations'),
('550e8400-e29b-41d4-a716-446655451103', '550e8400-e29b-41d4-a716-446655450003', '550e8400-e29b-41d4-a716-446655440303', 'Prep sides and sauces', 'Prepare coleslaw, beans, and signature BBQ sauces', 60, false, 3, 'in_progress', '2fef2f35-70e2-4a33-9146-54a6bb27c422', NULL, NULL, NULL),
('550e8400-e29b-41d4-a716-446655451104', '550e8400-e29b-41d4-a716-446655450003', '550e8400-e29b-41d4-a716-446655440304', 'Stock serving containers', 'Ensure adequate containers for meat service', 10, false, 4, 'pending', NULL, NULL, NULL, NULL);

-- Add sample task comments
INSERT INTO task_comments (id, task_id, profile_id, comment, comment_type) VALUES
('550e8400-e29b-41d4-a716-446655460001', '550e8400-e29b-41d4-a716-446655451101', '2fef2f35-70e2-4a33-9146-54a6bb27c422', 'Brisket looks great today - nice marbling. Used our signature rub blend.', 'note'),
('550e8400-e29b-41d4-a716-446655460002', '550e8400-e29b-41d4-a716-446655451102', '2fef2f35-70e2-4a33-9146-54a6bb27c422', 'Hickory and oak wood mix ready. Charcoal banked properly for long smoke.', 'note');