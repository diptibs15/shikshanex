-- Create function to check if user is employer
CREATE OR REPLACE FUNCTION public.is_employer()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'employer'
  )
$$;

-- Create function to get employer_id for current user
CREATE OR REPLACE FUNCTION public.get_employer_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.employers WHERE user_id = auth.uid() LIMIT 1
$$;