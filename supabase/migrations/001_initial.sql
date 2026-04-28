-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Links table
create table if not exists public.links (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  slug        text not null unique,
  ios_url     text,
  android_url text,
  web_url     text not null,
  is_active   boolean not null default true,
  expires_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Clicks table
create table if not exists public.clicks (
  id        uuid primary key default uuid_generate_v4(),
  link_id   uuid not null references public.links(id) on delete cascade,
  timestamp timestamptz not null default now(),
  device    text,
  country   text,
  referrer  text,
  ip        text
);

-- Indexes
create index if not exists links_user_id_idx   on public.links(user_id);
create index if not exists links_slug_idx      on public.links(slug);
create index if not exists clicks_link_id_idx  on public.clicks(link_id);
create index if not exists clicks_timestamp_idx on public.clicks(timestamp);

-- Row Level Security
alter table public.links  enable row level security;
alter table public.clicks enable row level security;

-- Links policies
create policy "Users can view own links"
  on public.links for select
  using (auth.uid() = user_id);

create policy "Users can insert own links"
  on public.links for insert
  with check (auth.uid() = user_id);

create policy "Users can update own links"
  on public.links for update
  using (auth.uid() = user_id);

create policy "Users can delete own links"
  on public.links for delete
  using (auth.uid() = user_id);

-- Allow reading links by slug (for redirect — public)
create policy "Public can read active links by slug"
  on public.links for select
  using (is_active = true);

-- Clicks policies
create policy "Users can view clicks for own links"
  on public.clicks for select
  using (
    exists (
      select 1 from public.links
      where links.id = clicks.link_id
        and links.user_id = auth.uid()
    )
  );

-- Allow anon inserts for click tracking
create policy "Anyone can insert clicks"
  on public.clicks for insert
  with check (true);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger links_updated_at
  before update on public.links
  for each row execute function public.set_updated_at();
