# Hammond's Fight Lab

A blazing-fast, mobile-first MMA training platform built with Next.js 14, TypeScript, Tailwind CSS, Supabase, and Revolut Pay.

## Features

- 🎥 **Course Marketplace** - Browse and purchase one-time courses
- 📚 **Customer Dashboard** - Track progress, access courses, view community
- 💬 **Direct Messaging** - Real-time messaging with Lee Hammond and team
- 👥 **Community Feed** - Patreon-style feed with posts, upvotes, and comments
- 🎬 **Custom Video Player** - Speed control, picture-in-picture, offline downloads
- 🔐 **Passwordless Auth** - Magic link, Google, and Apple sign-in
- 💳 **Revolut Pay Integration** - Exclusive payment processor
- ⚡ **Admin Panel** - Create and manage courses in <60 seconds

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui + Radix UI
- **Database**: Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Payments**: Revolut Business Merchant API
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Revolut Business account with API access
- Resend account (for emails)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd lee_hammond
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Fill in your environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Revolut Business API
REVOLUT_API_KEY=your-revolut-api-key
REVOLUT_MERCHANT_ID=your-merchant-id
REVOLUT_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_REVOLUT_PUBLIC_KEY=your-revolut-public-key

# Resend
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@hammondsfightlab.com

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Admin (optional)
ADMIN_EMAIL=admin@example.com
```

4. Set up Supabase:

   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
   - Enable Google and Apple OAuth providers in Supabase Auth settings
   - Set up storage buckets for course videos and thumbnails

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course marketplace
│   ├── course/            # Individual course sales pages
│   ├── dashboard/         # Customer dashboard
│   ├── admin/             # Admin panel
│   └── api/               # API routes (checkout, webhooks)
├── components/            # React components
│   ├── ui/                # Shadcn/ui components
│   ├── auth/              # Auth components
│   ├── courses/           # Course-related components
│   ├── dashboard/         # Dashboard components
│   ├── video/             # Video player
│   └── payments/          # Payment components
├── lib/                   # Utility functions
│   └── supabase/          # Supabase client setup
└── types/                 # TypeScript types
```

## Key Features Implementation

### Authentication
- Magic link email authentication
- Google OAuth
- Apple OAuth
- Automatic profile creation on signup

### Course Management
- Admin can create courses via admin panel
- Course lessons with video URLs
- Progress tracking per lesson
- Purchase history and receipts

### Payments
- Revolut Pay button integration
- Webhook handling for payment confirmation
- Automatic course unlock on successful payment
- Order tracking with Revolut order IDs

### Video Player
- Custom controls with speed adjustment
- Picture-in-picture support
- Fullscreen mode
- Progress tracking
- Offline download toggle (UI ready)

### Community
- Real-time posts with Supabase Realtime
- Upvote system
- Comments and replies
- Media uploads (images/videos)

### Direct Messaging
- Real-time messaging with Supabase Realtime
- Thread-based conversations
- Unread message indicators
- Media support

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy!

### Supabase Setup

1. Run the SQL schema in your Supabase project
2. Configure OAuth providers
3. Set up storage buckets
4. Configure webhook endpoints

### Revolut Webhook Setup

1. In Revolut Business dashboard, add webhook URL:
   `https://yourdomain.com/api/webhooks/revolut`
2. Set webhook secret in environment variables
3. Test webhook in Revolut sandbox mode first

## Development

### Adding a New Course

1. Sign in as admin
2. Go to `/admin`
3. Click "Create Course"
4. Fill in course details
5. Add lessons via course edit page

### Testing Payments

Use Revolut sandbox mode for testing:
- Test card numbers available in Revolut dashboard
- Webhook testing via Revolut webhook simulator

## Roadmap

- [ ] Certificate generation system
- [ ] Advanced analytics dashboard
- [ ] Subscription plans
- [ ] Mobile app (React Native)
- [ ] Live streaming integration
- [ ] AI-powered technique analysis

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.

---

Built with ❤️ for Hammond's Fight Lab
