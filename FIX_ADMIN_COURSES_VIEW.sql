-- Fix RLS policies so admins can see all courses in admin dashboard

-- Drop existing policies
DROP POLICY IF EXISTS "Published courses are viewable by everyone" ON public.courses;
DROP POLICY IF EXISTS "Only instructors can create courses" ON public.courses;
DROP POLICY IF EXISTS "Only instructors can update their courses" ON public.courses;

-- Create new policies that allow admins to see all courses
CREATE POLICY "Published courses are viewable by everyone" ON public.courses
  FOR SELECT 
  USING (
    is_published = true 
    OR instructor_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Allow instructors to create courses
CREATE POLICY "Instructors and admins can create courses" ON public.courses
  FOR INSERT 
  WITH CHECK (
    auth.uid() = instructor_id
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Allow instructors and admins to update courses
CREATE POLICY "Instructors and admins can update courses" ON public.courses
  FOR UPDATE 
  USING (
    auth.uid() = instructor_id
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Allow admins to delete any course, instructors to delete their own
CREATE POLICY "Instructors and admins can delete courses" ON public.courses
  FOR DELETE 
  USING (
    auth.uid() = instructor_id
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

