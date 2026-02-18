-- =============================================
-- PLACEMENT PORTAL TABLES
-- =============================================

-- Employers/Companies table
CREATE TABLE public.employers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  company_email TEXT NOT NULL,
  company_phone TEXT,
  company_website TEXT,
  company_logo TEXT,
  industry TEXT,
  company_size TEXT,
  description TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  is_verified BOOLEAN DEFAULT false,
  documents_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);


CREATE TABLE public.interview_fee_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending / success / failed
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  skills JSONB DEFAULT '[]',
  experience_min INTEGER DEFAULT 0,
  experience_max INTEGER,
  salary_min INTEGER,
  salary_max INTEGER,
  location TEXT,
  job_type TEXT DEFAULT 'full-time',
  is_active BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  posted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job Applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'applied',
  interview_date TIMESTAMP WITH TIME ZONE,
  interview_notes TEXT,
  employer_notes TEXT,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Skill Matches table (for profile-job matching)
CREATE TABLE public.skill_matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  match_score INTEGER DEFAULT 0,
  matched_skills JSONB DEFAULT '[]',
  is_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- INTERNSHIP SYSTEM UPDATES
-- =============================================

-- Internship Tasks table
CREATE TABLE public.internship_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  week_number INTEGER NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Internship Submissions table
CREATE TABLE public.internship_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.internship_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  submission_url TEXT,
  notes TEXT,
  mentor_feedback TEXT,
  grade TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- =============================================
-- ENABLE RLS ON ALL NEW TABLES
-- =============================================

ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internship_submissions ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES FOR EMPLOYERS
-- =============================================

CREATE POLICY "Employers can view their own company"
ON public.employers FOR SELECT
USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Employers can insert their own company"
ON public.employers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employers can update their own company"
ON public.employers FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all employers"
ON public.employers FOR ALL
USING (is_admin());

CREATE POLICY "Anyone can view verified employers"
ON public.employers FOR SELECT
USING (is_verified = true);

-- =============================================
-- RLS POLICIES FOR JOBS
-- =============================================

CREATE POLICY "Employers can manage their own jobs"
ON public.jobs FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.employers 
  WHERE employers.id = jobs.employer_id 
  AND employers.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all jobs"
ON public.jobs FOR ALL
USING (is_admin());

CREATE POLICY "Anyone can view approved active jobs"
ON public.jobs FOR SELECT
USING (is_active = true AND is_approved = true);

-- =============================================
-- RLS POLICIES FOR JOB APPLICATIONS
-- =============================================

CREATE POLICY "Users can view their own applications"
ON public.job_applications FOR SELECT
USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can insert their own applications"
ON public.job_applications FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
ON public.job_applications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Employers can view applications for their jobs"
ON public.job_applications FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.jobs j
  JOIN public.employers e ON e.id = j.employer_id
  WHERE j.id = job_applications.job_id
  AND e.user_id = auth.uid()
));

CREATE POLICY "Employers can update applications for their jobs"
ON public.job_applications FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.jobs j
  JOIN public.employers e ON e.id = j.employer_id
  WHERE j.id = job_applications.job_id
  AND e.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all applications"
ON public.job_applications FOR ALL
USING (is_admin());

-- =============================================
-- RLS POLICIES FOR SKILL MATCHES
-- =============================================

CREATE POLICY "Users can view their own matches"
ON public.skill_matches FOR SELECT
USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can manage all matches"
ON public.skill_matches FOR ALL
USING (is_admin());

-- =============================================
-- RLS POLICIES FOR INTERNSHIP TASKS
-- =============================================

CREATE POLICY "Users can view their internship tasks"
ON public.internship_tasks FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.internships
  WHERE internships.id = internship_tasks.internship_id
  AND internships.user_id = auth.uid()
) OR is_admin());

CREATE POLICY "Admins can manage all tasks"
ON public.internship_tasks FOR ALL
USING (is_admin());

-- =============================================
-- RLS POLICIES FOR INTERNSHIP SUBMISSIONS
-- =============================================

CREATE POLICY "Users can view their own submissions"
ON public.internship_submissions FOR SELECT
USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can insert their own submissions"
ON public.internship_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
ON public.internship_submissions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all submissions"
ON public.internship_submissions FOR ALL
USING (is_admin());

-- =============================================
-- UPDATE TRIGGERS
-- =============================================

CREATE TRIGGER update_employers_updated_at
BEFORE UPDATE ON public.employers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
BEFORE UPDATE ON public.job_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();