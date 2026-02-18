-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    mobile TEXT,
    qualification TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create course_categories table
CREATE TABLE public.course_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;

-- Create courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.course_categories(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    duration TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    eligibility TEXT,
    tools_covered TEXT[],
    has_internship BOOLEAN DEFAULT true,
    has_placement BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;



CREATE TABLE public.interview_fee_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending', -- pending / success / failed
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.interview_fee_payments ENABLE ROW LEVEL SECURITY;

-- Create interview_attempts table
CREATE TABLE public.interview_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    round TEXT NOT NULL CHECK (round IN ('mcq', 'coding', 'hr')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'disqualified')),
    score INTEGER,
    max_score INTEGER,
    passed BOOLEAN,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    proctoring_violations INTEGER DEFAULT 0,
    video_url TEXT,
    ai_evaluation JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.interview_attempts ENABLE ROW LEVEL SECURITY;

-- Create interview_questions table
CREATE TABLE public.interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.course_categories(id) ON DELETE CASCADE,
    round TEXT NOT NULL CHECK (round IN ('mcq', 'coding', 'hr')),
    question_text TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT,
    difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
    time_limit INTEGER DEFAULT 60,
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.interview_questions ENABLE ROW LEVEL SECURITY;

-- Create interview_answers table
CREATE TABLE public.interview_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID REFERENCES public.interview_attempts(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.interview_questions(id) ON DELETE CASCADE NOT NULL,
    user_answer TEXT,
    is_correct BOOLEAN,
    time_taken INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.interview_answers ENABLE ROW LEVEL SECURITY;

-- Create enrollments table
CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'dropped')),
    progress INTEGER DEFAULT 0,
    current_module INTEGER DEFAULT 1,
    enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, course_id)
);
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Create course_payments table
CREATE TABLE public.course_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    enrollment_id UUID REFERENCES public.enrollments(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    invoice_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.course_payments ENABLE ROW LEVEL SECURITY;

-- Create course_modules table
CREATE TABLE public.course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    video_url TEXT,
    notes_url TEXT,
    duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- Create module_exams table
CREATE TABLE public.module_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    pass_percentage INTEGER DEFAULT 60,
    time_limit_minutes INTEGER DEFAULT 30,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.module_exams ENABLE ROW LEVEL SECURITY;

-- Create exam_questions table
CREATE TABLE public.exam_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES public.module_exams(id) ON DELETE CASCADE NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    order_index INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;

-- Create exam_attempts table
CREATE TABLE public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    exam_id UUID REFERENCES public.module_exams(id) ON DELETE CASCADE NOT NULL,
    score INTEGER,
    max_score INTEGER,
    passed BOOLEAN,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    answers JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- Create certificates table
CREATE TABLE public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    certificate_type TEXT NOT NULL CHECK (certificate_type IN ('completion', 'internship')),
    certificate_id TEXT NOT NULL UNIQUE,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    certificate_url TEXT,
    qr_code_url TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create internships table
CREATE TABLE public.internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
    start_date DATE,
    end_date DATE,
    mentor_name TEXT,
    tasks JSONB,
    submissions JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

-- Create live_projects table
CREATE TABLE public.live_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.course_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL DEFAULT 5000,
    project_type TEXT CHECK (project_type IN ('live', 'college', 'mini', 'major')),
    tech_stack TEXT[],
    includes JSONB,
    preview_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.live_projects ENABLE ROW LEVEL SECURITY;

-- Create project_purchases table
CREATE TABLE public.project_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    project_id UUID REFERENCES public.live_projects(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
    download_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, project_id)
);
ALTER TABLE public.project_purchases ENABLE ROW LEVEL SECURITY;

-- Create resume_data table
CREATE TABLE public.resume_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    personal_info JSONB,
    education JSONB,
    experience JSONB,
    skills JSONB,
    projects JSONB,
    certifications JSONB,
    template TEXT DEFAULT 'modern',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.resume_data ENABLE ROW LEVEL SECURITY;

-- Create portfolios table
CREATE TABLE public.portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    bio TEXT,
    projects JSONB,
    skills JSONB,
    social_links JSONB,
    theme TEXT DEFAULT 'default',
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER FUNCTIONS
-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- Check if user is enrolled in a course
CREATE OR REPLACE FUNCTION public.is_enrolled_in_course(_course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enrollments
    WHERE user_id = auth.uid() AND course_id = _course_id AND status IN ('active', 'completed')
  )
$$;

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_resume_data_updated_at BEFORE UPDATE ON public.resume_data FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS POLICIES

-- user_roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.is_admin());

-- profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- course_categories policies
CREATE POLICY "Anyone can view categories" ON public.course_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.course_categories FOR ALL USING (public.is_admin());

-- courses policies
CREATE POLICY "Anyone can view active courses" ON public.courses FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (public.is_admin());

-- interview_fee_payments policies
CREATE POLICY "Users can view their own interview payments" ON public.interview_fee_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own interview payments" ON public.interview_fee_payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all interview payments" ON public.interview_fee_payments FOR ALL USING (public.is_admin());

-- interview_attempts policies
CREATE POLICY "Users can view their own attempts" ON public.interview_attempts FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert their own attempts" ON public.interview_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own attempts" ON public.interview_attempts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all attempts" ON public.interview_attempts FOR ALL USING (public.is_admin());

-- interview_questions policies
CREATE POLICY "Authenticated users can view questions" ON public.interview_questions FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can manage questions" ON public.interview_questions FOR ALL USING (public.is_admin());

-- interview_answers policies
CREATE POLICY "Users can view their own answers" ON public.interview_answers FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.interview_attempts WHERE id = attempt_id AND user_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Users can insert their own answers" ON public.interview_answers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.interview_attempts WHERE id = attempt_id AND user_id = auth.uid())
);
CREATE POLICY "Admins can manage all answers" ON public.interview_answers FOR ALL USING (public.is_admin());

-- enrollments policies
CREATE POLICY "Users can view their own enrollments" ON public.enrollments FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert their own enrollments" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all enrollments" ON public.enrollments FOR ALL USING (public.is_admin());

-- course_payments policies
CREATE POLICY "Users can view their own payments" ON public.course_payments FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert their own payments" ON public.course_payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all payments" ON public.course_payments FOR ALL USING (public.is_admin());

-- course_modules policies
CREATE POLICY "Enrolled users can view modules" ON public.course_modules FOR SELECT USING (
  public.is_enrolled_in_course(course_id) OR public.is_admin()
);
CREATE POLICY "Admins can manage modules" ON public.course_modules FOR ALL USING (public.is_admin());

-- module_exams policies
CREATE POLICY "Enrolled users can view exams" ON public.module_exams FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.course_modules cm WHERE cm.id = module_id AND public.is_enrolled_in_course(cm.course_id)) OR public.is_admin()
);
CREATE POLICY "Admins can manage exams" ON public.module_exams FOR ALL USING (public.is_admin());

-- exam_questions policies
CREATE POLICY "Enrolled users can view exam questions" ON public.exam_questions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.module_exams me 
    JOIN public.course_modules cm ON cm.id = me.module_id 
    WHERE me.id = exam_id AND public.is_enrolled_in_course(cm.course_id)
  ) OR public.is_admin()
);
CREATE POLICY "Admins can manage exam questions" ON public.exam_questions FOR ALL USING (public.is_admin());

-- exam_attempts policies
CREATE POLICY "Users can view their own exam attempts" ON public.exam_attempts FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert their own exam attempts" ON public.exam_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own exam attempts" ON public.exam_attempts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all exam attempts" ON public.exam_attempts FOR ALL USING (public.is_admin());

-- certificates policies
CREATE POLICY "Users can view their own certificates" ON public.certificates FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can manage all certificates" ON public.certificates FOR ALL USING (public.is_admin());

-- internships policies
CREATE POLICY "Users can view their own internships" ON public.internships FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can manage all internships" ON public.internships FOR ALL USING (public.is_admin());

-- live_projects policies
CREATE POLICY "Anyone can view active projects" ON public.live_projects FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "Admins can manage projects" ON public.live_projects FOR ALL USING (public.is_admin());

-- project_purchases policies
CREATE POLICY "Users can view their own purchases" ON public.project_purchases FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert their own purchases" ON public.project_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all purchases" ON public.project_purchases FOR ALL USING (public.is_admin());

-- resume_data policies
CREATE POLICY "Users can view their own resume" ON public.resume_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own resume" ON public.resume_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own resume" ON public.resume_data FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all resumes" ON public.resume_data FOR ALL USING (public.is_admin());

-- portfolios policies
CREATE POLICY "Anyone can view public portfolios" ON public.portfolios FOR SELECT USING (is_public = true OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert their own portfolio" ON public.portfolios FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own portfolio" ON public.portfolios FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all portfolios" ON public.portfolios FOR ALL USING (public.is_admin());

-- Insert default course categories
INSERT INTO public.course_categories (name, slug, description, icon, color) VALUES
('IT Training', 'it', 'Java, Python, AI/ML, Cloud & more', 'Monitor', 'blue'),
('HR Training', 'hr', 'HR Generalist, Recruiter, Payroll', 'Users', 'green'),
('Digital Marketing', 'digital-marketing', 'SEO, SMM, Google Ads, Analytics', 'TrendingUp', 'orange'),
('Graphic Design', 'graphic-design', 'Photoshop, Illustrator, UI/UX', 'Palette', 'purple'),
('Nursing Training', 'nursing', 'Clinical Training, ICU, Emergency Care', 'Heart', 'red');