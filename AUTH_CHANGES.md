# Authentication Changes

## What Changed

1. **Removed OAuth Providers** - No more Google/Apple sign-in
2. **Added Email/Password Authentication** - Traditional username/password login
3. **Created Sign-Up Page** - Separate sign-up page at `/auth/sign-up`
4. **Enhanced Sign-Up Form** - Requires:
   - Full Name
   - Username (unique, min 3 characters)
   - Email
   - Password (min 8 characters)
   - Password confirmation

## Database Updates Needed

Run this SQL in your Supabase SQL Editor to add the username field:

```sql
-- Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username text unique;

-- Create index for username
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- Update the trigger function to include username
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Supabase Auth Settings

1. Go to Authentication > Settings
2. Make sure "Enable Email Signup" is ON
3. Disable OAuth providers (Google, Apple) if you don't want them
4. Set "Confirm email" to your preference (recommended: ON for production)

## Pages

- `/auth/sign-in` - Sign in with email/password
- `/auth/sign-up` - Create new account with full details

## Features

- Username validation (letters, numbers, underscores only)
- Password strength (minimum 8 characters)
- Password confirmation matching
- Automatic profile creation on sign-up
- Redirect to dashboard after successful sign-up/sign-in

