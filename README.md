# Plantify

A Next.js platform for commercial growers to register seed codes, submit biweekly growth forms with photos, track progress on a dashboard, and receive in-app notifications when forms are missed.

## Stack

- **Next.js 16** (App Router, Server Actions)
- **Supabase** — Auth, Postgres, Storage
- **Tailwind CSS**

## Features

- Email/password sign up and sign in, plus **forgot password** (email reset link)
- Register seed codes (unique per grower)
- Biweekly growth forms: height, notes, photo upload
- Dashboard with per-seed status (on track / due soon / overdue)
- Notifications when a biweekly form is overdue (synced on dashboard & notifications page)
- **Admin panel** (`/admin`) — all seeds, inline status updates, full check-in reports per seed
- **Seed library** (`/admin/library`) — admin-only species catalogue; grower seed codes auto-link by prefix for buyback estimates

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

Then run `supabase/migrations/002_checkin_fields.sql` for sprout, leaf color, and pests fields on check-ins.

Then run `supabase/migrations/003_admin.sql` for admin roles and seed pipeline status.

Then run `supabase/migrations/004_seed_species.sql` for the admin-only species library (linked from grower seed codes by prefix) and estimated buyback value on the dashboard.

### Admin access

After migration 003, promote a user to admin in the SQL Editor:

```sql
update public.profiles set role = 'admin' where email = 'your@email.com';
```

Open `/admin` while signed in as that user. Non-admins are redirected to the grower dashboard.

### Super admin account (`admin@plantify.me`)

Supabase sign-in uses **email**, not a separate username. The bootstrap account is:

- **Email:** `admin@plantify.me`
- **Password:** `Plantify11!`

Create or reset this user from your machine (needs the **service role** key — never expose it in the browser or commit it):

1. In Supabase → **Project Settings → API**, copy the **service_role** secret.
2. Add to `.env.local`: `SUPABASE_SERVICE_ROLE_KEY=...`
3. From the project root: `npm run seed:admin`

That creates the user if missing, sets the password, confirms email, and sets `profiles.role` to `admin`.

**Manual alternative:** Authentication → **Users** → Add user → email `admin@plantify.me`, password `Plantify11!`, confirm email. Then run:

```sql
update public.profiles set role = 'admin', full_name = 'Super Admin'
where email = 'admin@plantify.me';
```

### Forgot password

The sign-in page links to **Forgot password**. Add every URL Supabase may redirect to after a reset email:

- **Redirect URLs:** `https://plantify.me/auth/callback`, `https://www.plantify.me/auth/callback` (and localhost for dev).

If sign-in fails with “Email not confirmed”, either confirm the address from the inbox or disable **Confirm email** under Authentication → Providers → Email for testing.

**If `/admin` sends you to login:** you are not signed in on that exact hostname (see www below), or the session cookie is missing.

**If you sign in but land on `/dashboard` instead of admin:** your account does not have `role = 'admin'` in `public.profiles`.

**`www` vs apex (`plantify.me`):** Auth cookies are tied to the host you used when you signed in. If you signed in on `https://plantify.me` but open `https://www.plantify.me/admin`, the browser may not send the session cookie and you will look logged out. Fix by picking one canonical URL in Vercel (redirect `www` → apex or the reverse) and use the same host in Supabase **Authentication → URL Configuration** (Site URL and Redirect URLs for both hosts if you keep both).

### 3. Configure auth (optional for local dev)

In **Authentication → URL Configuration**, add:

- Site URL: `http://localhost:3000` (and your production URL, e.g. `https://plantify.me`)
- Redirect URLs: `http://localhost:3000/auth/callback`, `https://plantify.me/auth/callback`, `https://www.plantify.me/auth/callback`

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
    (admin)/admin/   # Admin-only: seed registry, species library, reports
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

Hosna Kachooee
