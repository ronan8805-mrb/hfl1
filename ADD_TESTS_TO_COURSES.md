# Adding Tests to Courses

## Database Schema Updates

**IMPORTANT:** Run the SQL file `add-tests-schema.sql` in your Supabase SQL Editor. Do NOT copy from this markdown file.

The SQL file contains all the necessary statements to:
- Create test tables
- Set up RLS policies
- Add indexes
- Create triggers

For reference, here's what the SQL includes:

```sql
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

-- Add RLS policies (see supabase-schema.sql for full policies)
-- Add indexes
CREATE INDEX IF NOT EXISTS course_tests_course_idx ON public.course_tests(course_id);
CREATE INDEX IF NOT EXISTS test_questions_test_idx ON public.test_questions(test_id);
CREATE INDEX IF NOT EXISTS test_question_options_question_idx ON public.test_question_options(question_id);
CREATE INDEX IF NOT EXISTS test_question_answers_question_idx ON public.test_question_answers(question_id);
CREATE INDEX IF NOT EXISTS user_test_attempts_user_idx ON public.user_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS user_test_attempts_test_idx ON public.user_test_attempts(test_id);

-- Add triggers
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.course_tests
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.test_questions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.user_test_attempts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
```

## Features Added

1. **Test System**
   - Multiple choice questions
   - True/False questions
   - Short answer questions
   - Configurable passing grade (default 70%)
   - Test attempts tracking
   - Score calculation and results display

2. **Course View Updates**
   - Tests appear alongside lessons in the sidebar
   - Tests are marked with a blue badge
   - Shows pass/fail status and scores
   - Clicking a test takes you to the test page

3. **Test Taking**
   - Full test interface with all question types
   - Immediate feedback after submission
   - Shows correct/incorrect answers
   - Displays score and pass/fail status
   - Retake option

## Next Steps

1. Run the SQL schema updates in Supabase
2. Create tests via admin panel (coming next)
3. Students can take tests after watching lessons
4. Tests must be passed with high grades to complete course

