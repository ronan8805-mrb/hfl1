# Supabase Setup Instructions

## Step 1: Run Database Schema

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/xwdyfveyewveksruelzw
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `supabase-schema.sql` file
5. Paste it into the SQL editor
6. Click "Run" (or press Ctrl+Enter)
7. You should see "Success. No rows returned"

## Step 2: Enable OAuth Providers (Optional for now)

1. Go to Authentication > Providers
2. Enable "Email" (should be enabled by default)
3. For Google OAuth: Click "Google" and follow setup instructions
4. For Apple OAuth: Click "Apple" and follow setup instructions

## Step 3: Set Up Storage Buckets

1. Go to Storage in the left sidebar
2. Create a new bucket called `course-videos` (public)
3. Create a new bucket called `course-thumbnails` (public)
4. Create a new bucket called `user-uploads` (private)

## Step 4: Restart Dev Server

The dev server needs to be restarted to pick up the new environment variables.

