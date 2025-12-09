# Quick Admin Setup - Step by Step

## If you get "relation already exists" error:

The table exists, you just need to:
1. Add the role column (if missing)
2. Update your user to admin

## Run this SQL in Supabase SQL Editor:

```sql
-- Step 1: Add role column (safe - won't error if it exists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text default 'user';

-- Step 2: Add constraint (safe - won't error if it exists)
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

-- Step 3: Set YOUR email as admin (REPLACE the email below!)
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'YOUR-EMAIL-HERE@example.com';
```

## Or make the first user admin automatically:

```sql
-- Add role column if needed
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text default 'user';

-- Make first user admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 1);
```

## After running the SQL:

1. Refresh your browser
2. Go to: `http://localhost:3000/admin`
3. You should now have access!

