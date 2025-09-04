-- Create profiles table for Nagoya University users
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  university text NOT NULL DEFAULT '名古屋大学' CHECK (university = '名古屋大学'),
  faculty text NOT NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach trigger to profiles table
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to prevent university updates
CREATE OR REPLACE FUNCTION public.prevent_university_update()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.university IS DISTINCT FROM NEW.university THEN
    RAISE EXCEPTION 'University cannot be changed';
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach trigger
CREATE TRIGGER prevent_profiles_university_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_university_update();

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own profile (but not university due to trigger)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile only with 名古屋大学
CREATE POLICY "Users can insert own profile with Nagoya University"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id AND 
    university = '名古屋大学'
  );

-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Add RLS to existing tables to ensure Nagoya University only
-- Update past_exams table
ALTER TABLE public.past_exams ADD COLUMN IF NOT EXISTS 
  university text DEFAULT '名古屋大学' CHECK (university = '名古屋大学');

-- Update RLS for past_exams
DROP POLICY IF EXISTS "past_exams_insert_policy" ON public.past_exams;
CREATE POLICY "past_exams_insert_policy"
  ON public.past_exams
  FOR INSERT
  WITH CHECK (
    auth.uid() = uploaded_by AND
    university = '名古屋大学'
  );

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_faculty ON public.profiles(faculty);