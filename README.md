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

Hosna Kachooee
