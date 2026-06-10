-- Buyer inquiries from the public homepage form

create table public.buyer_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  order_details text not null,
  status text not null default 'new'
    check (status in ('new', 'in_review', 'contacted')),
  created_at timestamptz not null default now()
);

create index buyer_inquiries_created_at_idx on public.buyer_inquiries (created_at desc);
create index buyer_inquiries_status_idx on public.buyer_inquiries (status);

alter table public.buyer_inquiries enable row level security;

-- Anyone (including anonymous site visitors) can submit an inquiry
drop policy if exists "Public insert buyer inquiries" on public.buyer_inquiries;
create policy "Public insert buyer inquiries"
  on public.buyer_inquiries for insert
  to anon, authenticated
  with check (true);

-- Admins list and update inquiries
drop policy if exists "Admins read buyer inquiries" on public.buyer_inquiries;
create policy "Admins read buyer inquiries"
  on public.buyer_inquiries for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins update buyer inquiries" on public.buyer_inquiries;
create policy "Admins update buyer inquiries"
  on public.buyer_inquiries for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
