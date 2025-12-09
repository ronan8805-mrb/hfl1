-- Just add the role column if it doesn't exist (safe to run multiple times)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text default 'user';

-- Add the check constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_role_check'
    ) THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_role_check 
        CHECK (role IN ('user', 'instructor', 'admin'));
    END IF;
END $$;

-- Set yourself as admin (REPLACE 'your-email@example.com' with your actual email)
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verify it worked (optional - check your role)
SELECT email, role, full_name 
FROM public.profiles 
WHERE role = 'admin';

