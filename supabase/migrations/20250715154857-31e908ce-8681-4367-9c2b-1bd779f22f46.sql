-- First, let's see what level values currently exist 
SELECT level, COUNT(*) as count FROM training_templates GROUP BY level;

-- Update all existing rows to use 'beginner' as a safe default
UPDATE training_templates SET level = 'beginner' WHERE level IS NOT NULL;

-- Drop any existing constraint
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

-- Add tasks for each template
INSERT INTO training_template_tasks (id, template_id, title, description, task_type, estimated_minutes, is_required, order_index, task_data) VALUES
-- Kitchen Operations tasks
('bb000000-1111-2222-3333-444444444101', 'aa000000-1111-2222-3333-444444444401', 'Sanitize Workstations', 'Properly clean and sanitize all work surfaces using approved chemicals', 'checklist', 15, true, 1, '{"safety_critical": true}'::jsonb),
('bb000000-1111-2222-3333-444444444102', 'aa000000-1111-2222-3333-444444444401', 'Handle Meat Thawing Safely', 'Follow proper thawing procedures to prevent contamination', 'checklist', 30, true, 2, '{"safety_critical": true}'::jsonb),
('bb000000-1111-2222-3333-444444444103', 'aa000000-1111-2222-3333-444444444401', 'Operate Grills and Smokers', 'Safely operate cooking equipment and maintain proper temperatures', 'checklist', 45, true, 3, '{"safety_critical": true}'::jsonb),
('bb000000-1111-2222-3333-444444444104', 'aa000000-1111-2222-3333-444444444401', 'Kitchen Safety Quiz', 'Test knowledge of kitchen safety procedures and protocols', 'quiz', 20, true, 4, '{"passing_score": 80}'::jsonb),
('bb000000-1111-2222-3333-444444444105', 'aa000000-1111-2222-3333-444444444401', 'Equipment Maintenance Check', 'Perform daily equipment checks and basic maintenance', 'checklist', 25, true, 5, '{}'::jsonb),
-- Prep Work tasks
('bb000000-1111-2222-3333-444444444201', 'aa000000-1111-2222-3333-444444444402', 'Chop Vegetables for Sides', 'Properly prepare vegetables for coleslaw, beans, and other sides', 'checklist', 30, true, 1, '{"knife_skills": true}'::jsonb),
('bb000000-1111-2222-3333-444444444202', 'aa000000-1111-2222-3333-444444444402', 'Mix BBQ Sauces', 'Prepare signature sauces according to recipes and standards', 'checklist', 20, true, 2, '{"recipe_accuracy": true}'::jsonb),
('bb000000-1111-2222-3333-444444444203', 'aa000000-1111-2222-3333-444444444402', 'Portion Meats for Smoking', 'Cut and portion meats for optimal smoking results', 'checklist', 40, true, 3, '{"weight_accuracy": true}'::jsonb),
('bb000000-1111-2222-3333-444444444204', 'aa000000-1111-2222-3333-444444444402', 'Prep Work Assessment', 'Demonstrate proper prep techniques and time management', 'quiz', 25, true, 4, '{"practical_test": true}'::jsonb),
('bb000000-1111-2222-3333-444444444205', 'aa000000-1111-2222-3333-444444444402', 'Inventory Management', 'Track ingredient usage and maintain proper stock levels', 'checklist', 15, true, 5, '{"tracking_required": true}'::jsonb),
-- Working the Line tasks
('bb000000-1111-2222-3333-444444444301', 'aa000000-1111-2222-3333-444444444403', 'Assemble Orders Efficiently', 'Learn proper order assembly sequence and timing', 'checklist', 25, true, 1, '{"speed_target": "90 seconds"}'::jsonb),
('bb000000-1111-2222-3333-444444444302', 'aa000000-1111-2222-3333-444444444403', 'Maintain Line Cleanliness', 'Keep work area clean and organized during service', 'checklist', 10, true, 2, '{"continuous_cleaning": true}'::jsonb),
('bb000000-1111-2222-3333-444444444303', 'aa000000-1111-2222-3333-444444444403', 'Coordinate with Kitchen', 'Effective communication with kitchen staff for order flow', 'checklist', 20, true, 3, '{"communication_protocols": true}'::jsonb),
('bb000000-1111-2222-3333-444444444304', 'aa000000-1111-2222-3333-444444444403', 'Rush Period Simulation', 'Handle high-volume periods with accuracy and speed', 'quiz', 30, true, 4, '{"simulation_test": true}'::jsonb),
('bb000000-1111-2222-3333-444444444305', 'aa000000-1111-2222-3333-444444444403', 'Quality Control Check', 'Ensure all orders meet quality standards before serving', 'checklist', 15, true, 5, '{"visual_inspection": true}'::jsonb),
-- Register/Cashier tasks
('bb000000-1111-2222-3333-444444444401', 'aa000000-1111-2222-3333-444444444404', 'Process Payments Accurately', 'Handle cash, card, and digital payments correctly', 'checklist', 20, true, 1, '{"accuracy_required": "100%"}'::jsonb),
('bb000000-1111-2222-3333-444444444402', 'aa000000-1111-2222-3333-444444444404', 'Upsell Specials and Sauces', 'Promote additional items and signature products', 'checklist', 15, true, 2, '{"upsell_target": "25%"}'::jsonb),
('bb000000-1111-2222-3333-444444444403', 'aa000000-1111-2222-3333-444444444404', 'Handle Cash Reconciliation', 'Balance register and process end-of-shift procedures', 'checklist', 30, true, 3, '{"accuracy_required": "100%"}'::jsonb),
('bb000000-1111-2222-3333-444444444404', 'aa000000-1111-2222-3333-444444444404', 'Customer Service Excellence', 'Demonstrate exceptional customer interaction skills', 'quiz', 25, true, 4, '{"role_play": true}'::jsonb),
('bb000000-1111-2222-3333-444444444405', 'aa000000-1111-2222-3333-444444444404', 'POS System Mastery', 'Complete proficiency with point-of-sale system', 'checklist', 35, true, 5, '{"system_navigation": true}'::jsonb),
-- Entering Leadership tasks
('bb000000-1111-2222-3333-444444444501', 'aa000000-1111-2222-3333-444444444405', 'Observe Shift Operations', 'Shadow experienced leaders to understand operations', 'checklist', 60, true, 1, '{"observation_log": true}'::jsonb),
('bb000000-1111-2222-3333-444444444502', 'aa000000-1111-2222-3333-444444444405', 'Learn Delegation Basics', 'Understand how to assign tasks effectively', 'checklist', 30, true, 2, '{"delegation_practice": true}'::jsonb),
('bb000000-1111-2222-3333-444444444503', 'aa000000-1111-2222-3333-444444444405', 'Review Team Feedback', 'Learn to give constructive feedback to team members', 'checklist', 25, true, 3, '{"feedback_techniques": true}'::jsonb),
('bb000000-1111-2222-3333-444444444504', 'aa000000-1111-2222-3333-444444444405', 'Leadership Scenarios', 'Practice handling common leadership situations', 'quiz', 40, true, 4, '{"scenario_based": true}'::jsonb),
('bb000000-1111-2222-3333-444444444505', 'aa000000-1111-2222-3333-444444444405', 'Communication Skills', 'Develop effective communication with team and customers', 'checklist', 45, true, 5, '{"active_listening": true}'::jsonb),
-- Shift Management tasks
('bb000000-1111-2222-3333-444444444601', 'aa000000-1111-2222-3333-444444444406', 'Plan Daily Assignments', 'Create efficient staff schedules and task assignments', 'checklist', 30, true, 1, '{"scheduling_software": true}'::jsonb),
('bb000000-1111-2222-3333-444444444602', 'aa000000-1111-2222-3333-444444444406', 'Monitor Performance', 'Track team performance and provide guidance', 'checklist', 45, true, 2, '{"performance_metrics": true}'::jsonb),
('bb000000-1111-2222-3333-444444444603', 'aa000000-1111-2222-3333-444444444406', 'Resolve Conflicts', 'Handle interpersonal issues and workplace conflicts', 'checklist', 35, true, 3, '{"mediation_skills": true}'::jsonb),
('bb000000-1111-2222-3333-444444444604', 'aa000000-1111-2222-3333-444444444406', 'Crisis Management', 'Handle emergencies and unexpected situations', 'quiz', 40, true, 4, '{"emergency_procedures": true}'::jsonb),
('bb000000-1111-2222-3333-444444444605', 'aa000000-1111-2222-3333-444444444406', 'Shift Reporting', 'Complete end-of-shift reports and handovers', 'checklist', 20, true, 5, '{"reporting_accuracy": true}'::jsonb),
-- Team Development tasks
('bb000000-1111-2222-3333-444444444701', 'aa000000-1111-2222-3333-444444444407', 'Conduct Training Sessions', 'Design and deliver effective training programs', 'checklist', 60, true, 1, '{"training_design": true}'::jsonb),
('bb000000-1111-2222-3333-444444444702', 'aa000000-1111-2222-3333-444444444407', 'Evaluate Employee Progress', 'Assess team member development and provide feedback', 'checklist', 40, true, 2, '{"assessment_tools": true}'::jsonb),
('bb000000-1111-2222-3333-444444444703', 'aa000000-1111-2222-3333-444444444407', 'Implement Rewards System', 'Recognize and reward exceptional performance', 'checklist', 25, true, 3, '{"recognition_programs": true}'::jsonb),
('bb000000-1111-2222-3333-444444444704', 'aa000000-1111-2222-3333-444444444407', 'Coaching Case Studies', 'Apply coaching techniques to real workplace scenarios', 'quiz', 50, true, 4, '{"case_study_analysis": true}'::jsonb),
('bb000000-1111-2222-3333-444444444705', 'aa000000-1111-2222-3333-444444444407', 'Performance Improvement', 'Develop strategies for underperforming team members', 'checklist', 45, true, 5, '{"improvement_plans": true}'::jsonb),
-- General Manager Training tasks
('bb000000-1111-2222-3333-444444444801', 'aa000000-1111-2222-3333-444444444408', 'Oversee Store Operations', 'Manage all aspects of daily store operations', 'checklist', 90, true, 1, '{"operations_oversight": true}'::jsonb),
('bb000000-1111-2222-3333-444444444802', 'aa000000-1111-2222-3333-444444444408', 'Manage Budgets and Inventory', 'Control costs and maintain optimal inventory levels', 'checklist', 60, true, 2, '{"budget_management": true}'::jsonb),
('bb000000-1111-2222-3333-444444444803', 'aa000000-1111-2222-3333-444444444408', 'Lead Catering Events', 'Plan and execute successful catering operations', 'checklist', 75, true, 3, '{"event_planning": true}'::jsonb),
('bb000000-1111-2222-3333-444444444804', 'aa000000-1111-2222-3333-444444444408', 'Strategic Planning', 'Develop long-term strategies for store success', 'quiz', 45, true, 4, '{"strategic_thinking": true}'::jsonb),
('bb000000-1111-2222-3333-444444444805', 'aa000000-1111-2222-3333-444444444408', 'Leadership Excellence', 'Demonstrate exceptional leadership and management skills', 'checklist', 80, true, 5, '{"leadership_assessment": true}'::jsonb);