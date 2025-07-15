-- Add 8 new comprehensive training templates for different roles and skill levels
INSERT INTO training_templates (id, name, description, level, category, estimated_duration_hours, role_requirements, certification_required, store_id, is_active, quiz_questions) VALUES
-- 1. Kitchen Operations (Beginner)
('aa000000-1111-2222-3333-444444444401', 'Kitchen Operations', 'Essential kitchen duties and safety procedures for BBQ restaurant operations', 'beginner', 'operations', 4, ARRAY['prep_cook', 'pitmaster'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[
  {"question": "What temperature should the smoker be maintained at?", "options": ["200-220°F", "225-250°F", "275-300°F", "325-350°F"], "correct": 1},
  {"question": "How often should workstations be sanitized?", "options": ["Once per shift", "Every 2 hours", "Every 4 hours", "Only when visibly dirty"], "correct": 1},
  {"question": "What is the proper way to handle raw meat?", "options": ["With bare hands", "With gloves and frequent changes", "With tongs only", "Any way is fine"], "correct": 1}
]'::jsonb),

-- 2. Prep Work (Beginner)
('aa000000-1111-2222-3333-444444444402', 'Prep Work Fundamentals', 'Ingredient preparation and mise en place for BBQ service', 'beginner', 'operations', 3, ARRAY['prep_cook'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[
  {"question": "How far in advance should vegetables be prepped?", "options": ["Day before", "Same day", "Week before", "Immediately before service"], "correct": 1},
  {"question": "What is the proper storage temperature for prepared sauces?", "options": ["Room temperature", "Below 40°F", "Above 140°F", "Frozen"], "correct": 1},
  {"question": "How should meat portions be organized?", "options": ["By size", "By cooking time", "By type and weight", "Random order"], "correct": 2}
]'::jsonb),

-- 3. Working the Line (Beginner)
('aa000000-1111-2222-3333-444444444403', 'Working the Line', 'Assembly line operations and order fulfillment efficiency', 'beginner', 'service', 3, ARRAY['line_cook', 'front_of_house'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[
  {"question": "What is the most important aspect of line work?", "options": ["Speed", "Accuracy", "Both speed and accuracy", "Appearance"], "correct": 2},
  {"question": "How should orders be prioritized?", "options": ["Largest first", "Smallest first", "First in, first out", "VIP customers first"], "correct": 2},
  {"question": "When should you communicate with the kitchen?", "options": ["Only when problems occur", "Constantly", "At regular intervals", "Never"], "correct": 1}
]'::jsonb),

-- 4. Register/Cashier (Beginner)
('aa000000-1111-2222-3333-444444444404', 'Register & Customer Service', 'POS operations and customer interaction excellence', 'beginner', 'service', 2, ARRAY['cashier', 'front_of_house'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[
  {"question": "How should you greet customers?", "options": ["Silently", "With a smile and welcome", "Only when they speak first", "Quickly without eye contact"], "correct": 1},
  {"question": "What should you do if a payment is declined?", "options": ["Announce it loudly", "Discreetly ask for another method", "Refuse service", "Call the manager"], "correct": 1},
  {"question": "How often should the register be balanced?", "options": ["Once a week", "End of each shift", "Once a month", "Only when requested"], "correct": 1}
]'::jsonb),

-- 5. Entering Leadership (Intermediate)
('aa000000-1111-2222-3333-444444444405', 'Entering Leadership', 'Foundation skills for supervisory roles and team guidance', 'intermediate', 'leadership', 6, ARRAY['team_member', 'shift_leader'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[
  {"question": "What is the key to effective delegation?", "options": ["Doing it yourself", "Clear instructions and follow-up", "Hoping for the best", "Micromanaging"], "correct": 1},
  {"question": "How should you handle team conflicts?", "options": ["Ignore them", "Take sides", "Address promptly and fairly", "Let them resolve themselves"], "correct": 2},
  {"question": "What makes a good leader?", "options": ["Being the boss", "Leading by example", "Being the loudest", "Having authority"], "correct": 1}
]'::jsonb),

-- 6. Shift Management (Intermediate)
('aa000000-1111-2222-3333-444444444406', 'Shift Management', 'Running efficient shifts and managing team performance', 'intermediate', 'leadership', 8, ARRAY['shift_leader'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[
  {"question": "How should you plan daily assignments?", "options": ["Randomly", "Based on availability and skills", "By seniority", "Always the same"], "correct": 1},
  {"question": "What is the first priority during a rush?", "options": ["Speed over quality", "Maintaining standards", "Cutting corners", "Panic"], "correct": 1},
  {"question": "How should performance issues be addressed?", "options": ["Publicly", "Privately and constructively", "Ignored", "With punishment"], "correct": 1}
]'::jsonb),

-- 7. Team Development (Advanced)
('aa000000-1111-2222-3333-444444444407', 'Team Development', 'Advanced coaching and employee development strategies', 'advanced', 'leadership', 12, ARRAY['manager', 'shift_leader'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[
  {"question": "What is the goal of employee coaching?", "options": ["Finding faults", "Improvement and growth", "Punishment", "Compliance"], "correct": 1},
  {"question": "How should you recognize good performance?", "options": ["Never", "Privately only", "Publicly and regularly", "Only with money"], "correct": 2},
  {"question": "What is progressive discipline?", "options": ["Random punishment", "Structured improvement process", "Immediate termination", "Ignoring issues"], "correct": 1}
]'::jsonb),

-- 8. General Manager Training (Advanced)
('aa000000-1111-2222-3333-444444444408', 'General Manager Training', 'Comprehensive store operations and strategic management', 'advanced', 'leadership', 16, ARRAY['manager', 'operator'], true, 'c74151e0-38c8-49e2-93d2-ed45c8de1e58', true, '[
  {"question": "What is the GM''s primary responsibility?", "options": ["Working the line", "Overall store success", "Inventory only", "Customer service"], "correct": 1},
  {"question": "How should budgets be managed?", "options": ["Ignore them", "Review weekly", "Only at month end", "Delegate completely"], "correct": 1},
  {"question": "What is key to successful catering?", "options": ["Luck", "Planning and execution", "Lowest prices", "Largest portions"], "correct": 1}
]'::jsonb);

-- Add template tasks for Kitchen Operations
INSERT INTO training_template_tasks (id, template_id, title, description, task_type, estimated_minutes, is_required, order_index, task_data) VALUES
('bb000000-1111-2222-3333-444444444101', 'aa000000-1111-2222-3333-444444444401', 'Sanitize Workstations', 'Properly clean and sanitize all work surfaces using approved chemicals', 'checklist', 15, true, 1, '{"safety_critical": true, "requires_supervisor": false}'::jsonb),
('bb000000-1111-2222-3333-444444444102', 'aa000000-1111-2222-3333-444444444401', 'Handle Meat Thawing Safely', 'Follow proper thawing procedures to prevent contamination', 'checklist', 30, true, 2, '{"safety_critical": true, "requires_supervisor": true}'::jsonb),
('bb000000-1111-2222-3333-444444444103', 'aa000000-1111-2222-3333-444444444401', 'Operate Grills and Smokers', 'Safely operate cooking equipment and maintain proper temperatures', 'checklist', 45, true, 3, '{"safety_critical": true, "requires_supervisor": true}'::jsonb),
('bb000000-1111-2222-3333-444444444104', 'aa000000-1111-2222-3333-444444444401', 'Kitchen Safety Quiz', 'Test knowledge of kitchen safety procedures and protocols', 'quiz', 20, true, 4, '{"passing_score": 80, "max_attempts": 3}'::jsonb),
('bb000000-1111-2222-3333-444444444105', 'aa000000-1111-2222-3333-444444444401', 'Equipment Maintenance Check', 'Perform daily equipment checks and basic maintenance', 'checklist', 25, true, 5, '{"safety_critical": false, "requires_supervisor": false}'::jsonb);

-- Add template tasks for Prep Work
INSERT INTO training_template_tasks (id, template_id, title, description, task_type, estimated_minutes, is_required, order_index, task_data) VALUES
('bb000000-1111-2222-3333-444444444201', 'aa000000-1111-2222-3333-444444444402', 'Chop Vegetables for Sides', 'Properly prepare vegetables for coleslaw, beans, and other sides', 'checklist', 30, true, 1, '{"knife_skills": true, "portion_control": true}'::jsonb),
('bb000000-1111-2222-3333-444444444202', 'aa000000-1111-2222-3333-444444444402', 'Mix BBQ Sauces', 'Prepare signature sauces according to recipes and standards', 'checklist', 20, true, 2, '{"recipe_accuracy": true, "batch_size": "1 gallon"}'::jsonb),
('bb000000-1111-2222-3333-444444444203', 'aa000000-1111-2222-3333-444444444402', 'Portion Meats for Smoking', 'Cut and portion meats for optimal smoking results', 'checklist', 40, true, 3, '{"weight_accuracy": true, "cut_consistency": true}'::jsonb),
('bb000000-1111-2222-3333-444444444204', 'aa000000-1111-2222-3333-444444444402', 'Prep Work Assessment', 'Demonstrate proper prep techniques and time management', 'quiz', 25, true, 4, '{"practical_test": true, "time_limit": 60}'::jsonb),
('bb000000-1111-2222-3333-444444444205', 'aa000000-1111-2222-3333-444444444402', 'Inventory Management', 'Track ingredient usage and maintain proper stock levels', 'checklist', 15, true, 5, '{"tracking_required": true, "waste_monitoring": true}'::jsonb);

-- Add template tasks for Working the Line
INSERT INTO training_template_tasks (id, template_id, title, description, task_type, estimated_minutes, is_required, order_index, task_data) VALUES
('bb000000-1111-2222-3333-444444444301', 'aa000000-1111-2222-3333-444444444403', 'Assemble Orders Efficiently', 'Learn proper order assembly sequence and timing', 'checklist', 25, true, 1, '{"speed_target": "90 seconds", "accuracy_required": "98%"}'::jsonb),
('bb000000-1111-2222-3333-444444444302', 'aa000000-1111-2222-3333-444444444403', 'Maintain Line Cleanliness', 'Keep work area clean and organized during service', 'checklist', 10, true, 2, '{"continuous_cleaning": true, "organization_standards": true}'::jsonb),
('bb000000-1111-2222-3333-444444444303', 'aa000000-1111-2222-3333-444444444403', 'Coordinate with Kitchen', 'Effective communication with kitchen staff for order flow', 'checklist', 20, true, 3, '{"communication_protocols": true, "timing_coordination": true}'::jsonb),
('bb000000-1111-2222-3333-444444444304', 'aa000000-1111-2222-3333-444444444403', 'Rush Period Simulation', 'Handle high-volume periods with accuracy and speed', 'quiz', 30, true, 4, '{"simulation_test": true, "stress_handling": true}'::jsonb),
('bb000000-1111-2222-3333-444444444305', 'aa000000-1111-2222-3333-444444444403', 'Quality Control Check', 'Ensure all orders meet quality standards before serving', 'checklist', 15, true, 5, '{"visual_inspection": true, "temperature_check": true}'::jsonb);

-- Add template tasks for Register/Cashier
INSERT INTO training_template_tasks (id, template_id, title, description, task_type, estimated_minutes, is_required, order_index, task_data) VALUES
('bb000000-1111-2222-3333-444444444401', 'aa000000-1111-2222-3333-444444444404', 'Process Payments Accurately', 'Handle cash, card, and digital payments correctly', 'checklist', 20, true, 1, '{"accuracy_required": "100%", "speed_target": "60 seconds"}'::jsonb),
('bb000000-1111-2222-3333-444444444402', 'aa000000-1111-2222-3333-444444444404', 'Upsell Specials and Sauces', 'Promote additional items and signature products', 'checklist', 15, true, 2, '{"upsell_target": "25%", "product_knowledge": true}'::jsonb),
('bb000000-1111-2222-3333-444444444403', 'aa000000-1111-2222-3333-444444444404', 'Handle Cash Reconciliation', 'Balance register and process end-of-shift procedures', 'checklist', 30, true, 3, '{"accuracy_required": "100%", "documentation_required": true}'::jsonb),
('bb000000-1111-2222-3333-444444444404', 'aa000000-1111-2222-3333-444444444404', 'Customer Service Excellence', 'Demonstrate exceptional customer interaction skills', 'quiz', 25, true, 4, '{"role_play": true, "conflict_resolution": true}'::jsonb),
('bb000000-1111-2222-3333-444444444405', 'aa000000-1111-2222-3333-444444444404', 'POS System Mastery', 'Complete proficiency with point-of-sale system', 'checklist', 35, true, 5, '{"system_navigation": true, "troubleshooting": true}'::jsonb);

-- Add template tasks for Entering Leadership
INSERT INTO training_template_tasks (id, template_id, title, description, task_type, estimated_minutes, is_required, order_index, task_data) VALUES
('bb000000-1111-2222-3333-444444444501', 'aa000000-1111-2222-3333-444444444405', 'Observe Shift Operations', 'Shadow experienced leaders to understand operations', 'checklist', 60, true, 1, '{"observation_log": true, "mentor_required": true}'::jsonb),
('bb000000-1111-2222-3333-444444444502', 'aa000000-1111-2222-3333-444444444405', 'Learn Delegation Basics', 'Understand how to assign tasks effectively', 'checklist', 30, true, 2, '{"delegation_practice": true, "follow_up_required": true}'::jsonb),
('bb000000-1111-2222-3333-444444444503', 'aa000000-1111-2222-3333-444444444405', 'Review Team Feedback', 'Learn to give constructive feedback to team members', 'checklist', 25, true, 3, '{"feedback_techniques": true, "documentation": true}'::jsonb),
('bb000000-1111-2222-3333-444444444504', 'aa000000-1111-2222-3333-444444444405', 'Leadership Scenarios', 'Practice handling common leadership situations', 'quiz', 40, true, 4, '{"scenario_based": true, "decision_making": true}'::jsonb),
('bb000000-1111-2222-3333-444444444505', 'aa000000-1111-2222-3333-444444444405', 'Communication Skills', 'Develop effective communication with team and customers', 'checklist', 45, true, 5, '{"active_listening": true, "conflict_resolution": true}'::jsonb);

-- Add template tasks for Shift Management
INSERT INTO training_template_tasks (id, template_id, title, description, task_type, estimated_minutes, is_required, order_index, task_data) VALUES
('bb000000-1111-2222-3333-444444444601', 'aa000000-1111-2222-3333-444444444406', 'Plan Daily Assignments', 'Create efficient staff schedules and task assignments', 'checklist', 30, true, 1, '{"scheduling_software": true, "skill_matching": true}'::jsonb),
('bb000000-1111-2222-3333-444444444602', 'aa000000-1111-2222-3333-444444444406', 'Monitor Performance', 'Track team performance and provide guidance', 'checklist', 45, true, 2, '{"performance_metrics": true, "coaching_required": true}'::jsonb),
('bb000000-1111-2222-3333-444444444603', 'aa000000-1111-2222-3333-444444444406', 'Resolve Conflicts', 'Handle interpersonal issues and workplace conflicts', 'checklist', 35, true, 3, '{"mediation_skills": true, "documentation_required": true}'::jsonb),
('bb000000-1111-2222-3333-444444444604', 'aa000000-1111-2222-3333-444444444406', 'Crisis Management', 'Handle emergencies and unexpected situations', 'quiz', 40, true, 4, '{"emergency_procedures": true, "decision_under_pressure": true}'::jsonb),
('bb000000-1111-2222-3333-444444444605', 'aa000000-1111-2222-3333-444444444406', 'Shift Reporting', 'Complete end-of-shift reports and handovers', 'checklist', 20, true, 5, '{"reporting_accuracy": true, "handover_quality": true}'::jsonb);

-- Add template tasks for Team Development
INSERT INTO training_template_tasks (id, template_id, title, description, task_type, estimated_minutes, is_required, order_index, task_data) VALUES
('bb000000-1111-2222-3333-444444444701', 'aa000000-1111-2222-3333-444444444407', 'Conduct Training Sessions', 'Design and deliver effective training programs', 'checklist', 60, true, 1, '{"training_design": true, "delivery_skills": true}'::jsonb),
('bb000000-1111-2222-3333-444444444702', 'aa000000-1111-2222-3333-444444444407', 'Evaluate Employee Progress', 'Assess team member development and provide feedback', 'checklist', 40, true, 2, '{"assessment_tools": true, "development_plans": true}'::jsonb),
('bb000000-1111-2222-3333-444444444703', 'aa000000-1111-2222-3333-444444444407', 'Implement Rewards System', 'Recognize and reward exceptional performance', 'checklist', 25, true, 3, '{"recognition_programs": true, "motivation_techniques": true}'::jsonb),
('bb000000-1111-2222-3333-444444444704', 'aa000000-1111-2222-3333-444444444407', 'Coaching Case Studies', 'Apply coaching techniques to real workplace scenarios', 'quiz', 50, true, 4, '{"case_study_analysis": true, "coaching_application": true}'::jsonb),
('bb000000-1111-2222-3333-444444444705', 'aa000000-1111-2222-3333-444444444407', 'Performance Improvement', 'Develop strategies for underperforming team members', 'checklist', 45, true, 5, '{"improvement_plans": true, "progressive_discipline": true}'::jsonb);

-- Add template tasks for General Manager Training
INSERT INTO training_template_tasks (id, template_id, title, description, task_type, estimated_minutes, is_required, order_index, task_data) VALUES
('bb000000-1111-2222-3333-444444444801', 'aa000000-1111-2222-3333-444444444408', 'Oversee Store Operations', 'Manage all aspects of daily store operations', 'checklist', 90, true, 1, '{"operations_oversight": true, "kpi_monitoring": true}'::jsonb),
('bb000000-1111-2222-3333-444444444802', 'aa000000-1111-2222-3333-444444444408', 'Manage Budgets and Inventory', 'Control costs and maintain optimal inventory levels', 'checklist', 60, true, 2, '{"budget_management": true, "inventory_control": true}'::jsonb),
('bb000000-1111-2222-3333-444444444803', 'aa000000-1111-2222-3333-444444444408', 'Lead Catering Events', 'Plan and execute successful catering operations', 'checklist', 75, true, 3, '{"event_planning": true, "execution_management": true}'::jsonb),
('bb000000-1111-2222-3333-444444444804', 'aa000000-1111-2222-3333-444444444408', 'Strategic Planning', 'Develop long-term strategies for store success', 'quiz', 45, true, 4, '{"strategic_thinking": true, "market_analysis": true}'::jsonb),
('bb000000-1111-2222-3333-444444444805', 'aa000000-1111-2222-3333-444444444408', 'Leadership Excellence', 'Demonstrate exceptional leadership and management skills', 'checklist', 80, true, 5, '{"leadership_assessment": true, "360_feedback": true}'::jsonb);

-- Create sample training instances for different users and progress levels
INSERT INTO training_instances (id, template_id, profile_id, status, progress_percentage, assigned_by, assigned_at, started_at, expires_at) VALUES
-- User 1: Kitchen Operations - In Progress
('cc000000-1111-2222-3333-444444444001', 'aa000000-1111-2222-3333-444444444401', '2fef2f35-70e2-4a33-9146-54a6bb27c422', 'in_progress', 40, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '5 days', now() - interval '4 days', now() + interval '85 days'),
-- User 1: Prep Work - Completed, pending approval
('cc000000-1111-2222-3333-444444444002', 'aa000000-1111-2222-3333-444444444402', '2fef2f35-70e2-4a33-9146-54a6bb27c422', 'completed', 100, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '10 days', now() - interval '9 days', now() + interval '80 days'),
-- User 2: Working the Line - Just assigned
('cc000000-1111-2222-3333-444444444003', 'aa000000-1111-2222-3333-444444444403', '3abc789d-e456-f789-0123-456789abcdef', 'assigned', 0, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '1 day', null, now() + interval '89 days'),
-- User 2: Register/Cashier - In Progress
('cc000000-1111-2222-3333-444444444004', 'aa000000-1111-2222-3333-444444444404', '3abc789d-e456-f789-0123-456789abcdef', 'in_progress', 60, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '7 days', now() - interval '6 days', now() + interval '83 days'),
-- User 3: Entering Leadership - Completed and approved
('cc000000-1111-2222-3333-444444444005', 'aa000000-1111-2222-3333-444444444405', '4def123e-f567-8901-2345-6789abcdef01', 'approved', 100, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '15 days', now() - interval '14 days', now() + interval '75 days'),
-- User 3: Shift Management - In Progress
('cc000000-1111-2222-3333-444444444006', 'aa000000-1111-2222-3333-444444444406', '4def123e-f567-8901-2345-6789abcdef01', 'in_progress', 25, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '3 days', now() - interval '2 days', now() + interval '87 days'),
-- User 4: Team Development - In Progress
('cc000000-1111-2222-3333-444444444007', 'aa000000-1111-2222-3333-444444444407', '5ghi456f-0789-1234-5678-90abcdef1234', 'in_progress', 80, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '12 days', now() - interval '11 days', now() + interval '78 days'),
-- User 5: General Manager Training - Just started
('cc000000-1111-2222-3333-444444444008', 'aa000000-1111-2222-3333-444444444408', '6jkl789g-1234-5678-9012-3456789abcde', 'in_progress', 10, 'f123456a-b234-c345-d456-e567890abcde', now() - interval '2 days', now() - interval '1 day', now() + interval '88 days');

-- Create sample training instance tasks for some instances to show progress
-- Kitchen Operations instance - 2 completed, 1 in progress, 2 pending
INSERT INTO training_instance_tasks (id, instance_id, template_task_id, status, time_spent_minutes, completed_at, score, notes) VALUES
('dd000000-1111-2222-3333-444444444001', 'cc000000-1111-2222-3333-444444444001', 'bb000000-1111-2222-3333-444444444101', 'completed', 15, now() - interval '3 days', 95, 'Excellent attention to detail'),
('dd000000-1111-2222-3333-444444444002', 'cc000000-1111-2222-3333-444444444001', 'bb000000-1111-2222-3333-444444444102', 'completed', 28, now() - interval '2 days', 88, 'Good understanding of safety protocols'),
('dd000000-1111-2222-3333-444444444003', 'cc000000-1111-2222-3333-444444444001', 'bb000000-1111-2222-3333-444444444103', 'in_progress', 20, null, null, 'Working on temperature control techniques'),
('dd000000-1111-2222-3333-444444444004', 'cc000000-1111-2222-3333-444444444001', 'bb000000-1111-2222-3333-444444444104', 'pending', 0, null, null, null),
('dd000000-1111-2222-3333-444444444005', 'cc000000-1111-2222-3333-444444444001', 'bb000000-1111-2222-3333-444444444105', 'pending', 0, null, null, null);

-- Prep Work instance - All completed (ready for approval)
INSERT INTO training_instance_tasks (id, instance_id, template_task_id, status, time_spent_minutes, completed_at, score, notes) VALUES
('dd000000-1111-2222-3333-444444444101', 'cc000000-1111-2222-3333-444444444002', 'bb000000-1111-2222-3333-444444444201', 'completed', 30, now() - interval '8 days', 92, 'Excellent knife skills and consistency'),
('dd000000-1111-2222-3333-444444444102', 'cc000000-1111-2222-3333-444444444002', 'bb000000-1111-2222-3333-444444444202', 'completed', 18, now() - interval '7 days', 90, 'Perfect sauce consistency'),
('dd000000-1111-2222-3333-444444444103', 'cc000000-1111-2222-3333-444444444002', 'bb000000-1111-2222-3333-444444444203', 'completed', 38, now() - interval '6 days', 95, 'Outstanding portion control'),
('dd000000-1111-2222-3333-444444444104', 'cc000000-1111-2222-3333-444444444002', 'bb000000-1111-2222-3333-444444444204', 'completed', 22, now() - interval '5 days', 85, 'Good practical demonstration'),
('dd000000-1111-2222-3333-444444444105', 'cc000000-1111-2222-3333-444444444002', 'bb000000-1111-2222-3333-444444444205', 'completed', 14, now() - interval '4 days', 88, 'Accurate inventory tracking');

-- Register/Cashier instance - 3 completed, 2 pending
INSERT INTO training_instance_tasks (id, instance_id, template_task_id, status, time_spent_minutes, completed_at, score, notes) VALUES
('dd000000-1111-2222-3333-444444444201', 'cc000000-1111-2222-3333-444444444004', 'bb000000-1111-2222-3333-444444444401', 'completed', 20, now() - interval '5 days', 98, 'Perfect payment accuracy'),
('dd000000-1111-2222-3333-444444444202', 'cc000000-1111-2222-3333-444444444004', 'bb000000-1111-2222-3333-444444444402', 'completed', 15, now() - interval '4 days', 85, 'Good upselling techniques'),
('dd000000-1111-2222-3333-444444444203', 'cc000000-1111-2222-3333-444444444004', 'bb000000-1111-2222-3333-444444444403', 'completed', 30, now() - interval '3 days', 92, 'Excellent cash handling'),
('dd000000-1111-2222-3333-444444444204', 'cc000000-1111-2222-3333-444444444004', 'bb000000-1111-2222-3333-444444444404', 'pending', 0, null, null, null),
('dd000000-1111-2222-3333-444444444205', 'cc000000-1111-2222-3333-444444444004', 'bb000000-1111-2222-3333-444444444405', 'pending', 0, null, null, null);