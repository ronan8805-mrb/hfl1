# Setting Up Your First Admin User

## Option 1: Set Admin Email in Environment (Quick)

1. Open `.env.local` file
2. Add this line:
   ```
   ADMIN_EMAIL=your-admin-email@example.com
   ```
3. Sign up with that email address
4. Then run the SQL below to set them as admin

## Option 2: Set Admin Role via SQL (Recommended)

After you've created your first user account:

1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/xwdyfveyewveksruelzw/editor
2. Open SQL Editor
3. Run this SQL (replace 'your-email@example.com' with your actual email):

```sql
-- First, add the role column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text default 'user' check (role in ('user', 'instructor', 'admin'));

-- Set your user as admin (replace with your email)
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Option 3: Make First User Admin Automatically

Run this SQL to automatically make the first user an admin:

```sql
-- Add role column if needed
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text default 'user' check (role in ('user', 'instructor', 'admin'));

-- Make the first user (oldest account) an admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM public.profiles ORDER BY created_at ASC LIMIT 1);
```

## Access Admin Dashboard

Once you're set as admin:
1. Sign in at: `http://localhost:3000/auth/sign-in`
2. Go to: `http://localhost:3000/admin`

## Admin Roles

- **admin**: Full access to admin dashboard, can manage everything
- **instructor**: Can create and manage their own courses
- **user**: Regular user, can only purchase and view courses

