# Setup Guide - Hammond's Fight Lab

## Quick Start Checklist

### 1. Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and anon key

2. **Run Database Schema**
   - Open SQL Editor in Supabase dashboard
   - Copy contents of `supabase-schema.sql`
   - Run the SQL script
   - Verify all tables are created

3. **Configure Authentication**
   - Go to Authentication > Providers
   - Enable Email (magic link)
   - Enable Google OAuth
   - Enable Apple OAuth
   - Add redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://yourdomain.com/auth/callback`

4. **Set Up Storage**
   - Go to Storage
   - Create bucket: `course-videos` (public)
   - Create bucket: `course-thumbnails` (public)
   - Create bucket: `user-uploads` (private)

### 2. Revolut Business Setup

1. **Get API Credentials**
   - Log into Revolut Business dashboard
   - Go to Developers > API
   - Create new API key
   - Note: Merchant ID, API Key, Public Key

2. **Configure Webhooks**
   - Go to Webhooks section
   - Add webhook URL: `https://yourdomain.com/api/webhooks/revolut`
   - Set webhook secret
   - Enable events: `ORDER_COMPLETED`, `ORDER_FAILED`

3. **Test Mode**
   - Use sandbox mode for testing
   - Test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVC

### 3. Resend Setup

1. **Create Account**
   - Go to [resend.com](https://resend.com)
   - Create account
   - Verify domain (or use default)
   - Get API key

2. **Configure Email**
   - Set `RESEND_FROM_EMAIL` to verified domain
   - Example: `noreply@hammondsfightlab.com`

### 4. Environment Variables

Create `.env.local` with:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Revolut
REVOLUT_API_KEY=sk_live_xxxxx
REVOLUT_MERCHANT_ID=merchant_xxxxx
REVOLUT_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_REVOLUT_PUBLIC_KEY=pk_live_xxxxx

# Resend
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@hammondsfightlab.com

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin (optional)
ADMIN_EMAIL=lee@hammondsfightlab.com
```

### 5. First Admin User

1. Sign up via `/auth/sign-in`
2. Note your user ID from Supabase Auth
3. Manually set yourself as instructor in database:
   ```sql
   -- Update a course to have your user_id as instructor_id
   -- Or create a course via admin panel (will auto-set instructor_id)
   ```

### 6. Test the Flow

1. **Create First Course**
   - Sign in as admin
   - Go to `/admin`
   - Create a test course
   - Add at least one lesson

2. **Test Purchase**
   - Sign out
   - Browse to course page
   - Click "Buy with Revolut Pay"
   - Use test card in sandbox mode
   - Verify course unlocks in dashboard

3. **Test Dashboard**
   - Go to `/dashboard`
   - Verify course appears
   - Click "Continue" to watch video
   - Check progress tracking

## Common Issues

### "Revolut API not configured"
- Check all Revolut env vars are set
- Verify API key has correct permissions
- Test in sandbox mode first

### "Webhook signature invalid"
- Verify `REVOLUT_WEBHOOK_SECRET` matches Revolut dashboard
- Check webhook URL is correct

### "Course not unlocking after purchase"
- Check webhook is receiving events
- Verify purchase status in Supabase
- Check RLS policies allow user to see course

### "OAuth not working"
- Verify redirect URLs in Supabase
- Check OAuth providers are enabled
- Ensure callback URL matches exactly

## Production Deployment

1. **Vercel**
   - Connect GitHub repo
   - Add all environment variables
   - Deploy

2. **Update Supabase**
   - Add production redirect URLs
   - Update webhook URLs in Revolut
   - Switch to live Revolut API keys

3. **Domain Setup**
   - Add custom domain in Vercel
   - Update `NEXT_PUBLIC_SITE_URL`
   - Update all redirect URLs

## Next Steps

- [ ] Add hero video to `/public/videos/hero.mp4`
- [ ] Upload course thumbnails
- [ ] Create first 3 courses
- [ ] Test all payment flows
- [ ] Set up email templates in Resend
- [ ] Configure analytics
- [ ] Set up monitoring

