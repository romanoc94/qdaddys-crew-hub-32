-- Insert sample training templates for BBQ restaurant training
INSERT INTO public.training_templates (name, description, level, category, role_requirements, estimated_duration_hours, quiz_questions, certification_required, store_id, created_by)
SELECT 
  template_data.name,
  template_data.description,
  template_data.level,
  template_data.category,
  template_data.role_requirements,
  template_data.estimated_duration_hours,
  template_data.quiz_questions::jsonb,
  template_data.certification_required,
  stores.id,
  profiles.id
FROM 
  public.stores
  CROSS JOIN public.profiles
  CROSS JOIN (VALUES
    ('Smoking Fundamentals', 'Master the art of low and slow BBQ smoking techniques with hands-on training covering wood selection, temperature control, and meat preparation.', 'Beginner', 'Technical Skills', ARRAY['pitmaster', 'team_member'], 8, '[
      {"question": "What is the ideal temperature range for smoking brisket?", "options": ["200-225°F", "225-250°F", "250-275°F", "275-300°F"], "correct": 1},
      {"question": "Which wood provides the strongest smoke flavor?", "options": ["Apple", "Cherry", "Hickory", "Oak"], "correct": 2},
      {"question": "How long should a 12lb brisket smoke at 225°F?", "options": ["8-10 hours", "12-14 hours", "16-18 hours", "20-22 hours"], "correct": 1},
      {"question": "What internal temperature indicates a properly cooked brisket?", "options": ["185°F", "195°F", "205°F", "215°F"], "correct": 2}
    ]', true),
    
    ('Customer Service Excellence', 'Deliver exceptional customer service in a BBQ restaurant environment, handling orders, complaints, and creating memorable dining experiences.', 'Beginner', 'Customer Service', ARRAY['team_member', 'cashier'], 6, '[
      {"question": "What is the first thing you should say when greeting a customer?", "options": ["Welcome to Qdaddys!", "How can I help you?", "Are you ready to order?", "Would you like our special?"], "correct": 0},
      {"question": "How should you handle a complaint about overcooked meat?", "options": ["Blame the kitchen", "Offer to remake it immediately", "Give a discount", "Explain its supposed to be that way"], "correct": 1},
      {"question": "What information should you gather for catering orders?", "options": ["Just the food items", "Date, time, guest count, food preferences", "Only the total cost", "When they want to pay"], "correct": 1}
    ]', true),
    
    ('Team Leadership Basics', 'Essential leadership skills for progression from team member to shift leader, covering team management, conflict resolution, and operational oversight.', 'Intermediate', 'Leadership', ARRAY['team_member', 'shift_leader'], 12, '[
      {"question": "What is the most important quality of a good leader?", "options": ["Being the smartest", "Clear communication", "Working the hardest", "Knowing everything"], "correct": 1},
      {"question": "How should you handle a team member who consistently arrives late?", "options": ["Ignore it", "Document and address privately first", "Call them out publicly", "Fire them immediately"], "correct": 1},
      {"question": "When delegating tasks, you should:", "options": ["Give clear instructions and deadlines", "Let them figure it out", "Do it yourself to be sure", "Only delegate easy tasks"], "correct": 0}
    ]', true),
    
    ('Food Safety & HACCP', 'Critical food safety protocols and HACCP principles for handling, storing, and serving BBQ meats safely in compliance with health regulations.', 'Beginner', 'Safety & Compliance', ARRAY['team_member', 'pitmaster', 'prep_cook'], 4, '[
      {"question": "What is the danger zone temperature range for food?", "options": ["32-40°F", "40-140°F", "140-160°F", "160-212°F"], "correct": 1},
      {"question": "How often should you wash your hands during food prep?", "options": ["Once per hour", "Every 30 minutes", "Between each task", "Only when visibly dirty"], "correct": 2},
      {"question": "What temperature should the walk-in cooler maintain?", "options": ["32°F or below", "38°F or below", "45°F or below", "50°F or below"], "correct": 1},
      {"question": "How long can cooked brisket be held hot for service?", "options": ["2 hours", "4 hours", "6 hours", "8 hours"], "correct": 1}
    ]'::text, true)
  ) AS template_data(name, description, level, category, role_requirements, estimated_duration_hours, quiz_questions, certification_required)
WHERE stores.is_active = true 
  AND profiles.role IN ('manager', 'operator')
LIMIT 1;

-- Insert sample training template tasks
INSERT INTO public.training_template_tasks (template_id, title, description, estimated_minutes, is_required, order_index, task_type, task_data)
SELECT 
  templates.id,
  task_data.title,
  task_data.description,
  task_data.estimated_minutes,
  task_data.is_required,
  task_data.order_index,
  task_data.task_type,
  task_data.task_data::jsonb
FROM 
  public.training_templates templates
  CROSS JOIN (VALUES
    -- Smoking Fundamentals tasks
    ('Smoking Fundamentals', 'Learn Wood Types and Flavors', 'Study different wood types (hickory, oak, apple, cherry) and their flavor profiles. Complete wood identification quiz.', 30, true, 1, 'checklist', '{"resources": ["Wood flavor guide", "Identification chart"]}'),
    ('Smoking Fundamentals', 'Practice Temperature Control', 'Demonstrate ability to maintain steady smoker temperature between 225-250°F for 2 hours using dampers and fuel management.', 120, true, 2, 'checklist', '{"target_temp": "225-250F", "duration_minutes": 120}'),
    ('Smoking Fundamentals', 'Meat Preparation Basics', 'Learn proper trimming techniques for brisket, ribs, and pork shoulder. Practice knife skills and fat cap management.', 45, true, 3, 'checklist', '{"cuts": ["brisket", "ribs", "pork_shoulder"]}'),
    ('Smoking Fundamentals', 'Smoke a Test Brisket', 'Complete supervised brisket smoke from start to finish. Monitor temperatures, manage fire, and achieve proper doneness.', 480, true, 4, 'checklist', '{"meat_type": "brisket", "target_internal_temp": "205F"}'),
    ('Smoking Fundamentals', 'Wood Types Quiz', 'Complete quiz on wood selection and flavor pairing with different meats.', 15, true, 5, 'quiz', '{"passing_score": 80}'),
    ('Smoking Fundamentals', 'Temperature Management Assessment', 'Demonstrate temperature control skills with pit master observation and sign-off.', 60, true, 6, 'checklist', '{"requires_signoff": true}'),
    
    -- Customer Service Excellence tasks  
    ('Customer Service Excellence', 'Learn Qdaddys Greeting Script', 'Memorize and practice the standard customer greeting: "Welcome to Qdaddys! Home of the best BBQ in town. How can we smoke up something delicious for you today?"', 20, true, 1, 'checklist', '{"script": "Welcome to Qdaddys! Home of the best BBQ in town. How can we smoke up something delicious for you today?"}'),
    ('Customer Service Excellence', 'Menu Knowledge Training', 'Study complete menu including meat cuts, cooking times, sides, sauces, and pricing. Pass menu knowledge test.', 45, true, 2, 'checklist', '{"includes": ["meats", "sides", "sauces", "pricing"]}'),
    ('Customer Service Excellence', 'Handle Order Accuracy', 'Practice taking complex orders including special requests, dietary restrictions, and modifications. Achieve 95% accuracy rate.', 60, true, 3, 'roleplay', '{"accuracy_target": 95}'),
    ('Customer Service Excellence', 'Complaint Resolution Role-Play', 'Practice handling common complaints (overcooked meat, long wait times, incorrect orders) using HEART method.', 40, true, 4, 'roleplay', '{"method": "HEART", "scenarios": ["overcooked_meat", "long_wait", "wrong_order"]}'),
    ('Customer Service Excellence', 'Service Quality Assessment', 'Demonstrate excellent customer service during live shift with manager observation and customer feedback.', 120, true, 5, 'checklist', '{"requires_signoff": true, "min_rating": 4.5}'),
    
    -- Team Leadership Basics tasks
    ('Team Leadership Basics', 'Lead a Shift Meeting', 'Conduct a pre-shift meeting covering daily specials, assignments, and goals. Practice clear communication and team engagement.', 30, true, 1, 'checklist', '{"meeting_elements": ["specials", "assignments", "goals", "safety"]}'),
    ('Team Leadership Basics', 'Task Assignment Practice', 'Use proper delegation techniques to assign daily tasks to team members. Ensure clear expectations and follow-up.', 45, true, 2, 'checklist', '{"delegation_steps": ["clear_instructions", "deadlines", "resources", "follow_up"]}'),
    ('Team Leadership Basics', 'Handle Team Infractions', 'Learn progressive discipline process and practice addressing attendance, performance, and behavior issues professionally.', 60, true, 3, 'roleplay', '{"infractions": ["tardiness", "poor_performance", "attitude"]}'),
    ('Team Leadership Basics', 'Recognition and Rewards', 'Implement team recognition programs and practice giving constructive feedback and celebrating achievements.', 30, true, 4, 'checklist', '{"recognition_types": ["verbal_praise", "written_feedback", "rewards"]}'),
    ('Team Leadership Basics', 'Conflict Resolution', 'Practice mediating conflicts between team members using active listening and problem-solving techniques.', 45, true, 5, 'roleplay', '{"techniques": ["active_listening", "neutral_mediation", "solution_focus"]}'),
    ('Team Leadership Basics', 'Leadership Assessment', 'Demonstrate leadership skills during actual shift with senior manager evaluation and 360-degree feedback.', 240, true, 6, 'checklist', '{"requires_signoff": true, "360_feedback": true}'),
    
    -- Food Safety & HACCP tasks
    ('Food Safety & HACCP', 'HACCP Principles Training', 'Complete online HACCP training module covering the 7 principles of food safety management.', 60, true, 1, 'video', '{"video_url": "haccp_training_module", "completion_required": true}'),
    ('Food Safety & HACCP', 'Temperature Log Practice', 'Practice taking and recording temperatures for coolers, hot holding, and cooking equipment using proper procedures.', 30, true, 2, 'checklist', '{"equipment": ["coolers", "hot_holding", "cooking", "cleaning"]}'),
    ('Food Safety & HACCP', 'Proper Meat Storage', 'Demonstrate correct storage procedures for raw and cooked meats including labeling, dating, and temperature control.', 45, true, 3, 'checklist', '{"storage_types": ["raw_meat", "cooked_meat", "leftovers"]}'),
    ('Food Safety & HACCP', 'Sanitation Procedures', 'Complete daily sanitation checklist and demonstrate proper cleaning and sanitizing of equipment and surfaces.', 60, true, 4, 'checklist', '{"areas": ["prep_surfaces", "equipment", "utensils", "floors"]}'),
    ('Food Safety & HACCP', 'Food Safety Quiz', 'Pass comprehensive food safety quiz covering temperatures, storage, cross-contamination, and personal hygiene.', 20, true, 5, 'quiz', '{"passing_score": 90, "retakes_allowed": 2}'),
    ('Food Safety & HACCP', 'Safety Certification', 'Demonstrate mastery of all food safety procedures with health department standards compliance check.', 30, true, 6, 'checklist', '{"requires_signoff": true, "compliance_check": true}')
  ) AS task_data(template_name, title, description, estimated_minutes, is_required, order_index, task_type, task_data)
WHERE templates.name = task_data.template_name;

-- Create sample training instances for existing profiles
INSERT INTO public.training_instances (template_id, profile_id, status, assigned_by, progress_percentage, notes, assigned_at)
SELECT 
  templates.id,
  profiles.id,
  CASE 
    WHEN random() < 0.3 THEN 'completed'
    WHEN random() < 0.6 THEN 'in_progress' 
    ELSE 'assigned'
  END,
  manager_profiles.id,
  CASE 
    WHEN random() < 0.3 THEN 100
    WHEN random() < 0.6 THEN floor(random() * 80 + 20)::integer
    ELSE 0
  END,
  'Sample training assignment for demo purposes',
  now() - (random() * interval '30 days')
FROM 
  public.training_templates templates
  CROSS JOIN public.profiles
  CROSS JOIN (
    SELECT id FROM public.profiles WHERE role IN ('manager', 'operator') LIMIT 1
  ) manager_profiles
WHERE profiles.role = 'team_member'
  AND templates.name IN ('Smoking Fundamentals', 'Customer Service Excellence', 'Food Safety & HACCP')
LIMIT 6;

-- Create sample task progress for the training instances
INSERT INTO public.training_instance_tasks (instance_id, template_task_id, status, completed_at, time_spent_minutes, notes)
SELECT 
  instances.id,
  tasks.id,
  CASE 
    WHEN instances.status = 'completed' THEN 'completed'
    WHEN instances.status = 'in_progress' AND random() < 0.7 THEN 'completed'
    WHEN instances.status = 'in_progress' AND random() < 0.9 THEN 'in_progress'
    ELSE 'pending'
  END,
  CASE 
    WHEN instances.status = 'completed' OR (instances.status = 'in_progress' AND random() < 0.7) 
    THEN now() - (random() * interval '15 days')
    ELSE null
  END,
  CASE 
    WHEN instances.status = 'completed' OR (instances.status = 'in_progress' AND random() < 0.7)
    THEN (tasks.estimated_minutes * (0.8 + random() * 0.4))::integer
    ELSE 0
  END,
  'Progress notes for demo'
FROM 
  public.training_instances instances
  JOIN public.training_template_tasks tasks ON tasks.template_id = instances.template_id
WHERE instances.template_id IN (
  SELECT id FROM public.training_templates 
  WHERE name IN ('Smoking Fundamentals', 'Customer Service Excellence', 'Food Safety & HACCP')
);