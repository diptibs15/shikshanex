-- Create wallet system for HR internship earnings
CREATE TABLE public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_earned DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_withdrawn DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Wallet transactions table
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('earning', 'withdrawal', 'bonus')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
  reference_id UUID,
  reference_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- HR Internship tasks with earning model
CREATE TABLE public.hr_internship_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  task_type VARCHAR(50) NOT NULL,
  target_count INTEGER NOT NULL DEFAULT 1,
  payout_per_unit DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_payout DECIMAL(10,2),
  duration_days INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User task progress tracking
CREATE TABLE public.hr_task_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID NOT NULL REFERENCES public.hr_internship_tasks(id) ON DELETE CASCADE,
  completed_count INTEGER NOT NULL DEFAULT 0,
  earnings DECIMAL(10,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'expired')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, task_id)
);

-- Job postings table for Apna-style careers page
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  company_name VARCHAR(255),
  location VARCHAR(255),
  job_type VARCHAR(50) NOT NULL DEFAULT 'full-time',
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  experience_min INTEGER DEFAULT 0,
  experience_max INTEGER,
  description TEXT,
  requirements TEXT,
  skills JSONB,
  is_active BOOLEAN DEFAULT true,
  posted_by UUID,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_internship_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_task_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- Wallet policies - users can view their own wallet
CREATE POLICY "Users can view their own wallet" ON public.wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create wallets" ON public.wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Wallet transactions policies
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- HR tasks policies - everyone can view active tasks
CREATE POLICY "Anyone can view active HR tasks" ON public.hr_internship_tasks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage HR tasks" ON public.hr_internship_tasks
  FOR ALL USING (public.is_admin());

-- HR task progress policies
CREATE POLICY "Users can view their own progress" ON public.hr_task_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" ON public.hr_task_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" ON public.hr_task_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- Job postings policies - everyone can view active jobs
CREATE POLICY "Anyone can view active job postings" ON public.job_postings
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage job postings" ON public.job_postings
  FOR ALL USING (public.is_admin());

-- Add triggers for updated_at
CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default HR internship tasks
INSERT INTO public.hr_internship_tasks (title, description, task_type, target_count, payout_per_unit, max_payout, duration_days) VALUES
('Software Developer Hiring', 'Recruit and onboard software developers. Earn ₹1,000 per successful joining.', 'hiring', 2, 1000.00, 2000.00, 30),
('Intern Hiring', 'Recruit interns for various departments. Build your team.', 'intern_hiring', 10, 500.00, 5000.00, 30),
('Team Handling', 'Lead a team of HR interns to hire 10 Software Developers. Earn ₹1,000 per developer hired by your team.', 'team_lead', 10, 1000.00, 10000.00, 30);

-- Insert sample job postings for all departments
INSERT INTO public.job_postings (title, department, company_name, location, job_type, salary_min, salary_max, experience_min, experience_max, description, skills) VALUES
-- IT Jobs
('Java Full Stack Developer', 'IT', 'TechCorp Solutions', 'Bangalore', 'full-time', 800000, 1500000, 2, 5, 'Looking for skilled Java Full Stack developers with Spring Boot and React experience.', '["Java", "Spring Boot", "React", "MySQL", "REST APIs"]'),
('Python Data Engineer', 'IT', 'DataFlow Analytics', 'Hyderabad', 'full-time', 1000000, 2000000, 3, 7, 'Build data pipelines and analytics solutions using Python and cloud technologies.', '["Python", "AWS", "Spark", "SQL", "Airflow"]'),
('Cloud DevOps Engineer', 'IT', 'CloudNex Systems', 'Pune', 'full-time', 1200000, 2500000, 4, 8, 'Manage cloud infrastructure and implement CI/CD pipelines.', '["AWS", "Kubernetes", "Docker", "Jenkins", "Terraform"]'),
('AI/ML Engineer', 'IT', 'AI Innovations', 'Bangalore', 'full-time', 1500000, 3500000, 3, 6, 'Develop and deploy machine learning models for production systems.', '["Python", "TensorFlow", "PyTorch", "MLOps", "NLP"]'),
('Cyber Security Analyst', 'IT', 'SecureNet Corp', 'Mumbai', 'full-time', 900000, 1800000, 2, 5, 'Monitor and protect organizational systems from security threats.', '["SIEM", "Penetration Testing", "Network Security", "ISO 27001"]'),
-- HR Jobs
('HR Generalist', 'HR', 'PeopleFirst HR', 'Bangalore', 'full-time', 400000, 800000, 1, 4, 'Handle end-to-end HR operations including recruitment, onboarding, and compliance.', '["Recruitment", "Payroll", "Employee Relations", "HRIS"]'),
('Talent Acquisition Specialist', 'HR', 'TalentHub', 'Chennai', 'full-time', 500000, 1000000, 2, 5, 'Lead recruitment efforts for tech and non-tech roles.', '["Sourcing", "ATS", "Interview Coordination", "Employer Branding"]'),
('Payroll & Compliance Manager', 'HR', 'PayRight Services', 'Delhi', 'full-time', 600000, 1200000, 3, 6, 'Manage payroll processing and statutory compliance (PF, ESI, PT).', '["Payroll", "PF", "ESI", "Compliance", "SAP HR"]'),
-- Digital Marketing Jobs
('SEO Specialist', 'Digital Marketing', 'GrowthMarketing Co', 'Bangalore', 'full-time', 400000, 900000, 1, 4, 'Optimize website rankings and drive organic traffic growth.', '["SEO", "Google Analytics", "Ahrefs", "Content Strategy"]'),
('Social Media Manager', 'Digital Marketing', 'BrandViral Agency', 'Mumbai', 'full-time', 500000, 1000000, 2, 5, 'Manage social media presence and create engaging content.', '["Social Media", "Content Creation", "Meta Ads", "Analytics"]'),
('Google Ads Specialist', 'Digital Marketing', 'ClickBoost Digital', 'Hyderabad', 'full-time', 600000, 1200000, 2, 5, 'Manage PPC campaigns and optimize ad spend for maximum ROI.', '["Google Ads", "PPC", "Analytics", "A/B Testing"]'),
-- Graphic Design Jobs
('UI/UX Designer', 'Graphic Design', 'DesignStudio Pro', 'Bangalore', 'full-time', 600000, 1400000, 2, 5, 'Create intuitive user interfaces and seamless user experiences.', '["Figma", "Adobe XD", "User Research", "Prototyping"]'),
('Brand Designer', 'Graphic Design', 'CreativeBrands', 'Mumbai', 'full-time', 500000, 1000000, 2, 4, 'Develop brand identities and visual design systems.', '["Illustrator", "Photoshop", "Brand Strategy", "Typography"]'),
('Motion Graphics Designer', 'Graphic Design', 'AnimateNow Studios', 'Pune', 'full-time', 600000, 1200000, 2, 5, 'Create engaging motion graphics and video content.', '["After Effects", "Premiere Pro", "Cinema 4D", "Animation"]'),
-- Nursing Jobs
('ICU Nurse', 'Nursing', 'Apollo Hospitals', 'Chennai', 'full-time', 400000, 700000, 2, 5, 'Provide critical care to patients in the Intensive Care Unit.', '["Critical Care", "Patient Monitoring", "Emergency Response", "Documentation"]'),
('Staff Nurse', 'Nursing', 'Manipal Hospital', 'Bangalore', 'full-time', 350000, 600000, 1, 4, 'Provide quality patient care in hospital wards.', '["Patient Care", "Medication Administration", "Vital Signs", "Documentation"]'),
('Emergency Room Nurse', 'Nursing', 'Fortis Healthcare', 'Delhi', 'full-time', 450000, 800000, 2, 5, 'Handle emergency cases and provide immediate care.', '["Emergency Care", "Triage", "Life Support", "Trauma Care"]'),
('Home Care Nurse', 'Nursing', 'CareAtHome Services', 'Multiple Cities', 'full-time', 300000, 500000, 1, 3, 'Provide nursing care to patients in home settings.', '["Home Care", "Patient Assessment", "Medication Management", "Documentation"]');