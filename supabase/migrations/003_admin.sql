-- Admin role on profiles and buyback status on seeds

alter table public.profiles
  add column if not exists role text not null default 'grower'
    check (role in ('grower', 'admin')),
  add column if not exists email text;

alter table public.seeds
  add column if not exists admin_status text not null default 'active'
    check (admin_status in ('active', 'mature', 'approved_for_buyback'));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$;

-- Backfill emails for existing profiles
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;

-- Enables seeds → profiles embed in Supabase queries
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'seeds_user_id_profiles_fkey'
  ) then
    alter table public.seeds
      add constraint seeds_user_id_profiles_fkey
      foreign key (user_id) references public.profiles (id) on delete cascade;
  end if;
end $$;

-- Admin can read all profiles
create policy "Admins read all profiles"
  on public.profiles for select
  using (public.is_admin());

-- Admin can read/update all seeds
create policy "Admins read all seeds"
  on public.seeds for select
  using (public.is_admin());

create policy "Admins update all seeds"
  on public.seeds for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admin can read all growth reports
create policy "Admins read all growth reports"
  on public.growth_reports for select
  using (public.is_admin());
