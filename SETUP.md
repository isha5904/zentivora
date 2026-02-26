# Zentivora - Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Choose your organization, name it `zentivora`, set a database password
4. Wait for the project to be created (~1 minute)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings → API**
2. Copy:
   - **Project URL** (e.g. `https://xxxxxxxxxxxx.supabase.co`)
   - **anon/public key**

## Step 3: Configure Environment Variables

Open `.env.local` in the `zentivora` folder and replace:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

## Step 4: Run the Database Schema

1. In Supabase, go to **SQL Editor**
2. Open the file `supabase-schema.sql` from this project
3. Copy all content and paste into the SQL Editor
4. Click **"Run"**

This creates:
- `profiles` table (user data)
- `services` table (grooming packages)
- `groomers` table (groomer profiles)
- `appointments` table (bookings)
- Auto-trigger to create profile on signup
- Sample data for services and groomers

## Step 5: Configure Auth Settings (Optional)

In Supabase → **Authentication → Settings**:
- Disable "Email Confirmation" for instant login after signup (recommended for dev)
- Or keep it enabled for production

## Step 6: Run the Development Server

```bash
cd zentivora
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Features

| Feature | Description |
|---------|-------------|
| 🏠 Landing Page | Hero, Services, How It Works, Groomers, Reviews, FAQ |
| 🔐 Authentication | Register, Login, Auto-redirect to dashboard |
| 📊 Dashboard | Appointment stats, upcoming/past bookings |
| 📅 Booking | Book appointments with service/groomer/time selection |
| ❌ Cancel | Cancel pending/confirmed appointments |
| 👤 Profile | View account details and booking history |
| 📱 Mobile | Fully responsive with mobile bottom nav |

## Project Structure

```
zentivora/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/page.tsx        # Login page
│   ├── register/page.tsx     # Register page
│   └── dashboard/            # User dashboard
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── HowItWorks.tsx
│   ├── Groomers.tsx
│   ├── Reviews.tsx
│   ├── FAQ.tsx
│   └── Footer.tsx
├── lib/supabase/
│   ├── client.ts             # Browser Supabase client
│   └── server.ts             # Server Supabase client
├── proxy.ts                  # Auth route protection
├── supabase-schema.sql       # Database schema to run
└── .env.local                # Your Supabase credentials
```
