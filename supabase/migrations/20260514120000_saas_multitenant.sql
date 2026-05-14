-- MyTeamSpace: multi-tenant core. All tenant content keyed by team_id.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- teams (no payment secrets here — only a denormalized status for public RLS)
-- ---------------------------------------------------------------------------
create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  logo_path text,
  primary_color text not null default '#0c4a6e',
  secondary_color text not null default '#0ea5e9',
  theme_id text not null default 'sharky_aqua',
  tagline text,
  blocks jsonb not null default '[]'::jsonb,
  subscription_status text not null default 'inactive'
    check (subscription_status in ('active', 'trialing', 'past_due', 'canceled', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists teams_slug_idx on public.teams (slug);
create index if not exists teams_subscription_idx on public.teams (subscription_status);

-- ---------------------------------------------------------------------------
-- team_members (coach ↔ team). One coach can belong to multiple teams later.
-- ---------------------------------------------------------------------------
create table if not exists public.team_members (
  team_id uuid not null references public.teams (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'coach' check (role in ('coach', 'assistant')),
  created_at timestamptz not null default now(),
  primary key (team_id, user_id)
);

create index if not exists team_members_user_idx on public.team_members (user_id);

-- ---------------------------------------------------------------------------
-- Billing (Lemon Squeezy) — coach-only via RLS; never exposed to anonymous public API
-- ---------------------------------------------------------------------------
create table if not exists public.team_billing (
  team_id uuid primary key references public.teams (id) on delete cascade,
  lemon_customer_id text,
  lemon_subscription_id text,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Content tables (all include team_id)
-- ---------------------------------------------------------------------------
create table if not exists public.schedule_events (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  created_at timestamptz not null default now()
);

create index if not exists schedule_events_team_idx on public.schedule_events (team_id);
create index if not exists schedule_events_starts_idx on public.schedule_events (team_id, starts_at);

create table if not exists public.team_updates (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  title text not null,
  body text not null default '',
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists team_updates_team_idx on public.team_updates (team_id, published_at desc);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  title text not null,
  body text not null default '',
  icon text,
  created_at timestamptz not null default now()
);

create index if not exists achievements_team_idx on public.achievements (team_id, created_at desc);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists teams_set_updated_at on public.teams;
create trigger teams_set_updated_at
  before update on public.teams
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- RPC: create team + membership (SECURITY DEFINER)
-- ---------------------------------------------------------------------------
create or replace function public.create_team(p_slug text, p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  tid uuid;
  s text := lower(trim(p_slug));
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if s !~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$' then
    raise exception 'invalid slug';
  end if;
  insert into public.teams (slug, name, subscription_status)
  values (s, left(trim(p_name), 200), 'inactive')
  returning id into tid;
  insert into public.team_members (team_id, user_id, role)
  values (tid, auth.uid(), 'coach');
  return tid;
end;
$$;

revoke all on function public.create_team(text, text) from public;
grant execute on function public.create_team(text, text) to authenticated;

-- Public read by slug only (no listing all teams). PostgREST: .rpc('get_public_team_by_slug', { p_slug })
create or replace function public.get_public_team_by_slug(p_slug text)
returns setof public.teams
language sql
security definer
stable
set search_path = public
as $$
  select * from public.teams where slug = lower(trim(p_slug)) limit 1;
$$;

revoke all on function public.get_public_team_by_slug(text) from public;
grant execute on function public.get_public_team_by_slug(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.team_billing enable row level security;
alter table public.schedule_events enable row level security;
alter table public.team_updates enable row level security;
alter table public.achievements enable row level security;

-- teams: coaches see only their teams; no direct anon SELECT on table
create policy teams_select_member on public.teams
  for select to authenticated
  using (exists (
    select 1 from public.team_members m
    where m.team_id = teams.id and m.user_id = auth.uid()
  ));

create policy teams_update_member on public.teams
  for update to authenticated
  using (exists (
    select 1 from public.team_members m
    where m.team_id = teams.id and m.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.team_members m
    where m.team_id = teams.id and m.user_id = auth.uid()
  ));

-- team_members: coaches manage rows for their teams (insert via create_team RPC only for new team)
create policy team_members_all_for_coach_team on public.team_members
  for all to authenticated
  using (exists (
    select 1 from public.team_members m
    where m.team_id = team_members.team_id and m.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.team_members m
    where m.team_id = team_members.team_id and m.user_id = auth.uid()
  ));

-- team_billing: coaches of that team only
create policy team_billing_member on public.team_billing
  for all to authenticated
  using (exists (
    select 1 from public.team_members m
    where m.team_id = team_billing.team_id and m.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.team_members m
    where m.team_id = team_billing.team_id and m.user_id = auth.uid()
  ));

-- Service role (Lemon Squeezy webhook) bypasses RLS — use SUPABASE_SERVICE_ROLE_KEY in API route.

-- schedule_events: coaches full CRUD; anon read only for active subscription teams
create policy schedule_events_coach_all on public.schedule_events
  for all to authenticated
  using (exists (
    select 1 from public.team_members m
    join public.teams t on t.id = m.team_id
    where m.user_id = auth.uid() and m.team_id = schedule_events.team_id
  ))
  with check (exists (
    select 1 from public.team_members m
    where m.user_id = auth.uid() and m.team_id = schedule_events.team_id
  ));

create policy schedule_events_public_read on public.schedule_events
  for select
  using (exists (
    select 1 from public.teams t
    where t.id = schedule_events.team_id
      and t.subscription_status in ('active', 'trialing')
  ));

create policy team_updates_coach_all on public.team_updates
  for all to authenticated
  using (exists (
    select 1 from public.team_members m
    where m.user_id = auth.uid() and m.team_id = team_updates.team_id
  ))
  with check (exists (
    select 1 from public.team_members m
    where m.user_id = auth.uid() and m.team_id = team_updates.team_id
  ));

create policy team_updates_public_read on public.team_updates
  for select
  using (exists (
    select 1 from public.teams t
    where t.id = team_updates.team_id
      and t.subscription_status in ('active', 'trialing')
  ));

create policy achievements_coach_all on public.achievements
  for all to authenticated
  using (exists (
    select 1 from public.team_members m
    where m.user_id = auth.uid() and m.team_id = achievements.team_id
  ))
  with check (exists (
    select 1 from public.team_members m
    where m.user_id = auth.uid() and m.team_id = achievements.team_id
  ));

create policy achievements_public_read on public.achievements
  for select
  using (exists (
    select 1 from public.teams t
    where t.id = achievements.team_id
      and t.subscription_status in ('active', 'trialing')
  ));

-- Storage bucket + RLS: see migration 20260515120000_storage_scale.sql
comment on table public.teams is 'Tenant root; public slug routes; subscription_status mirrored from Lemon Squeezy webhooks.';
