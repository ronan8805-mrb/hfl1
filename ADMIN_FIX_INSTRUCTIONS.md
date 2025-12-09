# Fix Admin Dashboard - Show All Courses

## The Problem
The Row Level Security (RLS) policy on the courses table is blocking admins from seeing all courses. It only allows:
- Published courses (visible to everyone)
- Courses where you're the instructor

## The Solution
Run this SQL in your Supabase SQL Editor:

```sql
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
```

## Steps:
1. Go to: https://supabase.com/dashboard/project/xwdyfveyewveksruelzw/editor
2. Open SQL Editor
3. Paste the SQL above
4. Click "Run"
5. Refresh your admin dashboard

After running this, admins will be able to see ALL courses in the database, not just published ones or their own.

