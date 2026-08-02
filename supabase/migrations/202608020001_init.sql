create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'agent',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.timelines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_address text,
  contract_title text,
  page_count integer default 0,
  entries jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists timelines_user_id_idx on public.timelines(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists timelines_set_updated_at on public.timelines;
create trigger timelines_set_updated_at
before update on public.timelines
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.timelines enable row level security;

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "timelines_select_own"
on public.timelines
for select
using (auth.uid() = user_id);

create policy "timelines_insert_own"
on public.timelines
for insert
with check (auth.uid() = user_id);

create policy "timelines_update_own"
on public.timelines
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
