# Deploy to Vercel

## Quick Deployment Steps

### Option 1: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - It will ask if you want to link to an existing project or create a new one
   - Choose your settings

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub + Vercel Dashboard (Recommended)

1. **Push to GitHub**:
   ```bash
   # Create a new repository on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

## Environment Variables

You need to add these in Vercel Dashboard → Project Settings → Environment Variables:

### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional (if using):
```
RESEND_API_KEY=your_resend_key
REVOLUT_API_KEY=your_revolut_key
REVOLUT_WEBHOOK_SECRET=your_webhook_secret
```

## After Deployment

1. Your site will be live at: `https://your-project.vercel.app`
2. You can set up a custom domain in Vercel settings
3. Every push to main branch will auto-deploy

## Troubleshooting

- If build fails, check the build logs in Vercel dashboard
- Make sure all environment variables are set
- Check that Supabase RLS policies allow public access where needed

