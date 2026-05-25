# Plantify

A Next.js platform for commercial growers to register seed codes, submit biweekly growth forms with photos, track progress on a dashboard, and receive in-app notifications when forms are missed.

## Stack

- **Next.js 16** (App Router, Server Actions)
- **Supabase** — Auth, Postgres, Storage
- **Tailwind CSS**

## Features

- Email/password sign up and sign in
- Register seed codes (unique per grower)
- Biweekly growth forms: height, notes, photo upload
- Dashboard with per-seed status (on track / due soon / overdue)
- Notifications when a biweekly form is overdue (synced on dashboard & notifications page)

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy the **Project URL** and **anon public** key.

### 2. Run the database migration

In the Supabase **SQL Editor**, paste and run the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates tables, RLS policies, the `growth-photos` storage bucket, and a profile trigger for new users.

### 3. Configure auth (optional for local dev)

In **Authentication → URL Configuration**, add:

- Site URL: `http://localhost:3000`
- Redirect URLs: `http://localhost:3000/auth/callback`

For email confirmation off during development: **Authentication → Providers → Email** → disable “Confirm email”.

### 4. Environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

### 5. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
  app/
    (auth)/          # Login & signup
    (app)/           # Protected: dashboard, seeds, notifications
    auth/callback/   # Supabase OAuth/email callback
  components/        # UI components
  lib/
    actions.ts       # Server actions (seeds, forms, notifications)
    biweekly.ts      # 14-day scheduling helpers
    notifications.ts # Missed-form detection
    supabase/        # Browser, server, middleware clients
supabase/migrations/ # SQL schema
```

## Biweekly schedule

- When a seed is registered, the first form is due **14 days** later.
- Each submitted form sets the next due date to **14 days** after submission.
- If the due date passes without a report for that period, a **missed_form** notification is created.

## License

MIT
