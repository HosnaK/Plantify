-- Seed species library (admin-managed catalogue linked to grower seeds)

create table public.seed_species (
  id uuid primary key default gen_random_uuid(),
  plant_name text not null,
  code_prefix text not null,
  buyback_period_weeks numeric not null check (buyback_period_weeks > 0),
  seed_price numeric(12, 2) not null check (seed_price >= 0),
  full_buyback_price numeric(12, 2) not null check (full_buyback_price >= 0),
  difficulty_level text not null check (difficulty_level in ('Easy', 'Medium', 'Hard')),
  environment_preferences text not null default '',
  created_at timestamptz not null default now(),
  constraint seed_species_code_prefix_unique unique (code_prefix)
);

create index seed_species_code_prefix_lower_idx on public.seed_species (lower(code_prefix));

alter table public.seeds
  add column if not exists species_id uuid references public.seed_species (id) on delete set null;

create index if not exists seeds_species_id_idx on public.seeds (species_id);

alter table public.seed_species enable row level security;

-- Growers (and admins) need read access for dashboard valuation joins
drop policy if exists "Authenticated read seed_species" on public.seed_species;
create policy "Authenticated read seed_species"
  on public.seed_species for select
  to authenticated
  using (true);

drop policy if exists "Admins manage seed_species" on public.seed_species;
create policy "Admins manage seed_species"
  on public.seed_species for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Optional demo species (safe to re-run)
insert into public.seed_species (
  plant_name, code_prefix, buyback_period_weeks, seed_price, full_buyback_price,
  difficulty_level, environment_preferences
)
values (
  'Oak Tree',
  'OAK',
  52,
  3.00,
  45.00,
  'Medium',
  'Full sun, water twice a week, indoor temperature 65–75°F'
)
on conflict (code_prefix) do nothing;
