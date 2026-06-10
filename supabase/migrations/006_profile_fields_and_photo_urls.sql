-- Grower profile fields + multiple public photo URLs per check-in

alter table public.profiles
  add column if not exists age integer check (age is null or age >= 18),
  add column if not exists occupation text,
  add column if not exists growing_experience text
    check (
      growing_experience is null
      or growing_experience in ('Total Beginner', 'Intermediate', 'Expert')
    ),
  add column if not exists growing_space text
    check (
      growing_space is null
      or growing_space in ('Balcony', 'Indoor windowsill', 'Garden', 'Greenhouse', 'Other')
    );

comment on column public.profiles.age is 'Grower age; required on new signups (min 18)';
comment on column public.profiles.growing_experience is 'Self-reported growing skill level';

alter table public.growth_reports
  add column if not exists photo_urls text[];

comment on column public.growth_reports.photo_urls is '1–3 public storage URLs for check-in photos; legacy rows may only have photo_path';

-- New users: copy signup metadata from auth.users into profiles (works when email confirmation yields no client session)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_age int;
  v_exp text;
  v_space text;
begin
  v_age := nullif(new.raw_user_meta_data->>'age', '')::int;
  if v_age is not null and v_age < 18 then
    v_age := null;
  end if;

  v_exp := nullif(trim(new.raw_user_meta_data->>'growing_experience'), '');
  if v_exp is not null and v_exp not in ('Total Beginner', 'Intermediate', 'Expert') then
    v_exp := null;
  end if;

  v_space := nullif(trim(new.raw_user_meta_data->>'growing_space'), '');
  if v_space is not null and v_space not in ('Balcony', 'Indoor windowsill', 'Garden', 'Greenhouse', 'Other') then
    v_space := null;
  end if;

  insert into public.profiles (id, full_name, age, occupation, growing_experience, growing_space)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    v_age,
    nullif(trim(new.raw_user_meta_data->>'occupation'), ''),
    v_exp,
    v_space
  );
  return new;
end;
$$;
