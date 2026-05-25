-- Plantify: growers, seeds, biweekly growth reports, notifications

create extension if not exists "pgcrypto";

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Registered seed codes
create table public.seeds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  seed_code text not null,
  plant_name text not null,
  registered_at timestamptz not null default now(),
  next_due_at timestamptz not null,
  constraint seeds_user_code_unique unique (user_id, seed_code)
);

create index seeds_user_id_idx on public.seeds (user_id);

-- Biweekly growth form submissions
create table public.growth_reports (
  id uuid primary key default gen_random_uuid(),
  seed_id uuid not null references public.seeds (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  height_cm numeric(6, 2),
  notes text,
  photo_path text,
  submitted_at timestamptz not null default now(),
  period_start timestamptz not null,
  period_end timestamptz not null
);

create index growth_reports_seed_id_idx on public.growth_reports (seed_id);

-- In-app notifications (e.g. missed biweekly form)
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  seed_id uuid references public.seeds (id) on delete cascade,
  type text not null check (type in ('missed_form', 'form_due_soon', 'info')),
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications (user_id);
create unique index notifications_missed_unique
  on public.notifications (user_id, seed_id, type)
  where type = 'missed_form' and read = false;

-- Storage bucket for growth photos (create in dashboard or via API)
insert into storage.buckets (id, name, public)
values ('growth-photos', 'growth-photos', true)
on conflict (id) do nothing;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.seeds enable row level security;
alter table public.growth_reports enable row level security;
alter table public.notifications enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users manage own seeds"
  on public.seeds for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own growth reports"
  on public.growth_reports for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own notifications"
  on public.notifications for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Storage policies
create policy "Users upload own growth photos"
  on storage.objects for insert
  with check (
    bucket_id = 'growth-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Anyone can view growth photos"
  on storage.objects for select
  using (bucket_id = 'growth-photos');

create policy "Users delete own growth photos"
  on storage.objects for delete
  using (
    bucket_id = 'growth-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
