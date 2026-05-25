-- Biweekly check-in: sprout status, leaf color, pests

alter table public.growth_reports
  add column if not exists has_sprouted boolean not null default false,
  add column if not exists leaf_color text check (leaf_color in ('green', 'yellow', 'brown')),
  add column if not exists pests text check (pests in ('yes', 'no', 'other')),
  add column if not exists pests_other text;
