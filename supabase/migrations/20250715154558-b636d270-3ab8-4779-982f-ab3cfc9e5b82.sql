-- Check current level values in training_templates
SELECT DISTINCT level, COUNT(*) as count 
FROM training_templates 
GROUP BY level;

-- Update existing rows to use proper level values
UPDATE training_templates 
SET level = CASE 
  WHEN level = 'entry' THEN 'beginner'
  WHEN level = 'basic' THEN 'beginner'
  WHEN level = 'intro' THEN 'beginner'
  WHEN level = 'mid' THEN 'intermediate'
  WHEN level = 'advanced' THEN 'advanced'
  ELSE 'beginner' -- default fallback
END;

-- Drop the existing constraint if it exists
ALTER TABLE training_templates DROP CONSTRAINT IF EXISTS training_templates_level_check;

-- Add the new constraint that allows the correct values
ALTER TABLE training_templates ADD CONSTRAINT training_templates_level_check 
CHECK (level IN ('beginner', 'intermediate', 'advanced'));

-- Now insert the 8 new comprehensive training templates
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