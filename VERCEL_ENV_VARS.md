# Vercel Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

## Required Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://xwdyfveyewveksruelzw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZHlmdmV5ZXd2ZWtzcnVlbHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMDM4MjMsImV4cCI6MjA4MDc3OTgyM30.bxCa5Iwc-Z3uJFLUCPyve2rc-ETKua5j1o0ijmrBhps
```

## Optional (if you're using these features):

```
RESEND_API_KEY=your_resend_key
REVOLUT_API_KEY=your_revolut_key
REVOLUT_WEBHOOK_SECRET=your_webhook_secret
```

## How to Add:

1. Go to https://vercel.com
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable for Production, Preview, and Development
5. Redeploy after adding variables

