-- Add Tests to Courses - SQL Migration
-- Run this in your Supabase SQL Editor

-- Course tests table
CREATE TABLE IF NOT EXISTS public.course_tests (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id uuid REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  passing_grade integer DEFAULT 70 NOT NULL,
  "order" integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Test questions table
CREATE TABLE IF NOT EXISTS public.test_questions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  test_id uuid REFERENCES public.course_tests(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  "order" integer NOT NULL,
  points integer DEFAULT 1 NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Test question options (for multiple choice)
CREATE TABLE IF NOT EXISTS public.test_question_options (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id uuid REFERENCES public.test_questions(id) ON DELETE CASCADE NOT NULL,
  option_text text NOT NULL,
  is_correct boolean DEFAULT false NOT NULL,
  "order" integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Test question answers (for short answer questions)
CREATE TABLE IF NOT EXISTS public.test_question_answers (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  question_id uuid REFERENCES public.test_questions(id) ON DELETE CASCADE NOT NULL,
  answer_text text NOT NULL,
  is_case_sensitive boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User test attempts
CREATE TABLE IF NOT EXISTS public.user_test_attempts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) NOT NULL,
  test_id uuid REFERENCES public.course_tests(id) ON DELETE CASCADE NOT NULL,
  score integer NOT NULL,
  total_points integer NOT NULL,
  percentage integer NOT NULL,
  passed boolean NOT NULL,
  answers jsonb NOT NULL,
  started_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.course_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_question_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_test_attempts ENABLE ROW LEVEL SECURITY;

-- Course tests policies
DROP POLICY IF EXISTS "Tests viewable if course is published or user has purchased" ON public.course_tests;
CREATE POLICY "Tests viewable if course is published or user has purchased" ON public.course_tests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_tests.course_id
      AND (courses.is_published = true OR courses.instructor_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Instructors and admins can manage tests" ON public.course_tests;
CREATE POLICY "Instructors and admins can manage tests" ON public.course_tests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = course_tests.course_id
      AND (courses.instructor_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      ))
    )
  );

-- Test questions policies
DROP POLICY IF EXISTS "Questions viewable if test is accessible" ON public.test_questions;
CREATE POLICY "Questions viewable if test is accessible" ON public.test_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_tests
      JOIN public.courses ON courses.id = course_tests.course_id
      WHERE course_tests.id = test_questions.test_id
      AND (courses.is_published = true OR courses.instructor_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Instructors and admins can manage questions" ON public.test_questions;
CREATE POLICY "Instructors and admins can manage questions" ON public.test_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.course_tests
      JOIN public.courses ON courses.id = course_tests.course_id
      WHERE course_tests.id = test_questions.test_id
      AND (courses.instructor_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      ))
    )
  );

-- Test question options policies
DROP POLICY IF EXISTS "Options viewable if question is accessible" ON public.test_question_options;
CREATE POLICY "Options viewable if question is accessible" ON public.test_question_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.test_questions
      JOIN public.course_tests ON course_tests.id = test_questions.test_id
      JOIN public.courses ON courses.id = course_tests.course_id
      WHERE test_questions.id = test_question_options.question_id
      AND (courses.is_published = true OR courses.instructor_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Instructors and admins can manage options" ON public.test_question_options;
CREATE POLICY "Instructors and admins can manage options" ON public.test_question_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.test_questions
      JOIN public.course_tests ON course_tests.id = test_questions.test_id
      JOIN public.courses ON courses.id = course_tests.course_id
      WHERE test_questions.id = test_question_options.question_id
      AND (courses.instructor_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      ))
    )
  );

-- Test question answers policies
DROP POLICY IF EXISTS "Answers viewable if question is accessible" ON public.test_question_answers;
CREATE POLICY "Answers viewable if question is accessible" ON public.test_question_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.test_questions
      JOIN public.course_tests ON course_tests.id = test_questions.test_id
      JOIN public.courses ON courses.id = course_tests.course_id
      WHERE test_questions.id = test_question_answers.question_id
      AND (courses.is_published = true OR courses.instructor_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Instructors and admins can manage answers" ON public.test_question_answers;
CREATE POLICY "Instructors and admins can manage answers" ON public.test_question_answers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.test_questions
      JOIN public.course_tests ON course_tests.id = test_questions.test_id
      JOIN public.courses ON courses.id = course_tests.course_id
      WHERE test_questions.id = test_question_answers.question_id
      AND (courses.instructor_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      ))
    )
  );

-- User test attempts policies
DROP POLICY IF EXISTS "Users can view their own test attempts" ON public.user_test_attempts;
CREATE POLICY "Users can view their own test attempts" ON public.user_test_attempts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own test attempts" ON public.user_test_attempts;
CREATE POLICY "Users can create their own test attempts" ON public.user_test_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own test attempts" ON public.user_test_attempts;
CREATE POLICY "Users can update their own test attempts" ON public.user_test_attempts
  FOR UPDATE USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS course_tests_course_idx ON public.course_tests(course_id);
CREATE INDEX IF NOT EXISTS test_questions_test_idx ON public.test_questions(test_id);
CREATE INDEX IF NOT EXISTS test_question_options_question_idx ON public.test_question_options(question_id);
CREATE INDEX IF NOT EXISTS test_question_answers_question_idx ON public.test_question_answers(question_id);
CREATE INDEX IF NOT EXISTS user_test_attempts_user_idx ON public.user_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS user_test_attempts_test_idx ON public.user_test_attempts(test_id);

-- Add triggers (only if handle_updated_at function exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'handle_updated_at') THEN
    DROP TRIGGER IF EXISTS handle_updated_at ON public.course_tests;
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.course_tests
      FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

    DROP TRIGGER IF EXISTS handle_updated_at ON public.test_questions;
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.test_questions
      FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

    DROP TRIGGER IF EXISTS handle_updated_at ON public.user_test_attempts;
    CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_test_attempts
      FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
  END IF;
END $$;

