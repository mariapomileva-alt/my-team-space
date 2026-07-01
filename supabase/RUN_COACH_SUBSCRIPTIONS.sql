-- =============================================================================
-- MyTeamSpace — Coach subscriptions (Single Team / Academy)
-- Run this ENTIRE file once in Supabase → SQL Editor → Run
-- (Replaces RUN_FIX_SINGLE_TEAM_EDIT.sql when coach_subscriptions does not exist)
-- =============================================================================

-- Helper: updated_at trigger (safe if already exists)
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.coach_subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  lemon_customer_id text,
  lemon_subscription_id text unique,
  lemon_variant_id text,
  plan_type text check (plan_type is null or plan_type in ('single_team', 'academy')),
  subscription_status text not null default 'inactive'
    check (
      subscription_status in (
        'active',
        'trialing',
        'past_due',
        'cancelled',
        'expired',
        'unpaid',
        'inactive'
      )
    ),
  team_limit integer,
  current_team_count integer not null default 0,
  primary_team_id uuid references public.teams (id) on delete set null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists coach_subscriptions_lemon_customer_idx
  on public.coach_subscriptions (lemon_customer_id);
create index if not exists coach_subscriptions_lemon_subscription_idx
  on public.coach_subscriptions (lemon_subscription_id);

drop trigger if exists coach_subscriptions_set_updated_at on public.coach_subscriptions;
create trigger coach_subscriptions_set_updated_at
  before update on public.coach_subscriptions
  for each row execute function public.set_updated_at();

alter table public.coach_subscriptions enable row level security;

drop policy if exists coach_subscriptions_select_own on public.coach_subscriptions;
create policy coach_subscriptions_select_own on public.coach_subscriptions
  for select to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Team columns
-- ---------------------------------------------------------------------------
alter table public.teams
  add column if not exists publish_status text not null default 'draft';

alter table public.teams
  add column if not exists is_plan_primary boolean not null default false;

alter table public.teams
  add column if not exists plan_edit_locked boolean not null default false;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'teams_publish_status_check'
  ) then
    alter table public.teams
      add constraint teams_publish_status_check
      check (publish_status in ('draft', 'published'));
  end if;
exception
  when others then
    null;
end $$;

-- ---------------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------------
create or replace function public.coach_owned_team_count(p_user_id uuid)
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::integer
  from public.team_members tm
  where tm.user_id = p_user_id and tm.role = 'coach';
$$;

create or replace function public.refresh_coach_team_count(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  c integer;
begin
  c := public.coach_owned_team_count(p_user_id);
  insert into public.coach_subscriptions (user_id, current_team_count)
  values (p_user_id, c)
  on conflict (user_id) do update
    set current_team_count = excluded.current_team_count,
        updated_at = now();
end;
$$;

create or replace function public.effective_team_limit(p_user_id uuid)
returns integer
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  sub public.coach_subscriptions%rowtype;
begin
  select * into sub from public.coach_subscriptions where user_id = p_user_id;
  if not found then
    return 1;
  end if;
  if sub.subscription_status not in ('active', 'trialing') then
    return greatest(sub.current_team_count, 1);
  end if;
  if sub.plan_type = 'academy' then
    return coalesce(sub.team_limit, 20);
  end if;
  if sub.plan_type = 'single_team' then
    return 1;
  end if;
  return 1;
end;
$$;

-- FIXED: one coach team is always editable
create or replace function public.coach_subscription_allows_edit(p_user_id uuid, p_team_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  sub public.coach_subscriptions%rowtype;
  t public.teams%rowtype;
  is_coach boolean;
  owned_count integer;
  primary_valid boolean;
begin
  select exists (
    select 1 from public.team_members tm
    where tm.team_id = p_team_id and tm.user_id = p_user_id and tm.role = 'coach'
  ) into is_coach;
  if not is_coach then
    return false;
  end if;

  select * into t from public.teams where id = p_team_id;
  if not found then
    return false;
  end if;

  owned_count := public.coach_owned_team_count(p_user_id);

  if owned_count = 1 then
    return true;
  end if;

  if t.plan_edit_locked then
    return false;
  end if;

  select * into sub from public.coach_subscriptions where user_id = p_user_id;
  if not found then
    return true;
  end if;

  if sub.subscription_status not in ('active', 'trialing') then
    return false;
  end if;

  if sub.plan_type = 'single_team' and sub.primary_team_id is not null then
    select exists (
      select 1 from public.team_members tm
      where tm.team_id = sub.primary_team_id
        and tm.user_id = p_user_id
        and tm.role = 'coach'
    ) into primary_valid;

    if not primary_valid then
      return true;
    end if;

    if sub.primary_team_id <> p_team_id then
      return false;
    end if;
  end if;

  return true;
end;
$$;

create or replace function public.sync_coach_team_subscriptions(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  sub public.coach_subscriptions%rowtype;
  mapped text;
  tid uuid;
  primary_id uuid;
begin
  select * into sub from public.coach_subscriptions where user_id = p_user_id;
  if not found then
    return;
  end if;

  if sub.subscription_status in ('active', 'trialing') then
    mapped := case sub.subscription_status
      when 'active' then 'active'
      when 'trialing' then 'trialing'
      else 'inactive'
    end;
  else
    mapped := case sub.subscription_status
      when 'past_due' then 'past_due'
      when 'cancelled' then 'canceled'
      when 'expired' then 'canceled'
      else 'inactive'
    end;
  end if;

  primary_id := sub.primary_team_id;

  if sub.plan_type = 'single_team' or sub.plan_type is null then
    if primary_id is null then
      select tm.team_id into primary_id
      from public.team_members tm
      where tm.user_id = p_user_id and tm.role = 'coach'
      order by tm.team_id asc
      limit 1;
      if primary_id is not null then
        update public.coach_subscriptions
        set primary_team_id = primary_id,
            plan_type = coalesce(plan_type, 'single_team'),
            updated_at = now()
        where user_id = p_user_id;
      end if;
    end if;

    for tid in
      select tm.team_id
      from public.team_members tm
      where tm.user_id = p_user_id and tm.role = 'coach'
    loop
      if primary_id is not null and tid = primary_id then
        update public.teams
        set subscription_status = mapped,
            is_plan_primary = true,
            plan_edit_locked = false,
            updated_at = now()
        where id = tid;
      else
        update public.teams
        set subscription_status = 'inactive',
            is_plan_primary = false,
            plan_edit_locked = true,
            updated_at = now()
        where id = tid;
      end if;
    end loop;
    return;
  end if;

  for tid in
    select tm.team_id
    from public.team_members tm
    where tm.user_id = p_user_id and tm.role = 'coach'
  loop
    update public.teams
    set subscription_status = mapped,
        is_plan_primary = false,
        plan_edit_locked = false,
        updated_at = now()
    where id = tid;
  end loop;
end;
$$;

create or replace function public.set_primary_team(p_team_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  if not exists (
    select 1 from public.team_members
    where team_id = p_team_id and user_id = uid and role = 'coach'
  ) then
    raise exception 'forbidden';
  end if;

  insert into public.coach_subscriptions (user_id)
  values (uid)
  on conflict (user_id) do nothing;

  update public.coach_subscriptions
  set primary_team_id = p_team_id,
      plan_type = coalesce(plan_type, 'single_team'),
      updated_at = now()
  where user_id = uid;

  perform public.sync_coach_team_subscriptions(uid);
end;
$$;

alter table public.coach_subscriptions
  add column if not exists current_period_end timestamptz;

create or replace function public.upsert_coach_subscription_from_lemon(
  p_user_id uuid,
  p_customer_id text,
  p_subscription_id text,
  p_variant_id text,
  p_plan_type text,
  p_subscription_status text,
  p_team_limit integer,
  p_current_period_end timestamptz default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.coach_subscriptions (
    user_id,
    lemon_customer_id,
    lemon_subscription_id,
    lemon_variant_id,
    plan_type,
    subscription_status,
    team_limit,
    current_period_end
  )
  values (
    p_user_id,
    p_customer_id,
    p_subscription_id,
    p_variant_id,
    p_plan_type,
    p_subscription_status,
    p_team_limit,
    p_current_period_end
  )
  on conflict (user_id) do update set
    lemon_customer_id = coalesce(excluded.lemon_customer_id, coach_subscriptions.lemon_customer_id),
    lemon_subscription_id = coalesce(excluded.lemon_subscription_id, coach_subscriptions.lemon_subscription_id),
    lemon_variant_id = coalesce(excluded.lemon_variant_id, coach_subscriptions.lemon_variant_id),
    plan_type = coalesce(excluded.plan_type, coach_subscriptions.plan_type),
    subscription_status = excluded.subscription_status,
    team_limit = coalesce(excluded.team_limit, coach_subscriptions.team_limit),
    current_period_end = coalesce(excluded.current_period_end, coach_subscriptions.current_period_end),
    updated_at = now();

  perform public.refresh_coach_team_count(p_user_id);
  perform public.sync_coach_team_subscriptions(p_user_id);
end;
$$;

-- create_team: only replace if you already use RPC create_team (optional — skip errors)
create or replace function public.create_team(p_slug text, p_name text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  tid uuid;
  s text := lower(trim(p_slug));
  uid uuid := auth.uid();
  owned integer;
  lim integer;
begin
  if uid is null then
    raise exception 'not authenticated';
  end if;
  if s !~ '^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$' then
    raise exception 'invalid slug';
  end if;

  perform public.refresh_coach_team_count(uid);
  owned := public.coach_owned_team_count(uid);
  lim := public.effective_team_limit(uid);

  if owned >= lim then
    raise exception 'team_limit_reached';
  end if;

  insert into public.teams (slug, name, subscription_status, publish_status)
  values (s, left(trim(p_name), 200), 'trialing', 'draft')
  returning id into tid;

  insert into public.team_members (team_id, user_id, role)
  values (tid, uid, 'coach');

  insert into public.coach_subscriptions (user_id)
  values (uid)
  on conflict (user_id) do nothing;

  perform public.refresh_coach_team_count(uid);

  if owned = 0 then
    update public.coach_subscriptions
    set primary_team_id = tid, plan_type = coalesce(plan_type, 'single_team'), updated_at = now()
    where user_id = uid and primary_team_id is null;
    update public.teams set is_plan_primary = true, plan_edit_locked = false where id = tid;
  end if;

  perform public.sync_coach_team_subscriptions(uid);
  return tid;
end;
$$;

grant execute on function public.set_primary_team(uuid) to authenticated;
grant execute on function public.coach_subscription_allows_edit(uuid, uuid) to authenticated;
revoke all on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz) from public;
grant execute on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz) to service_role;

-- ---------------------------------------------------------------------------
-- Bootstrap all existing coaches (unlock single-team pages)
-- ---------------------------------------------------------------------------
do $$
declare
  rec record;
begin
  for rec in
    select
      tm.user_id,
      (array_agg(tm.team_id order by tm.team_id))[1] as first_team_id,
      count(*)::integer as team_cnt
    from public.team_members tm
    where tm.role = 'coach'
    group by tm.user_id
  loop
    perform public.refresh_coach_team_count(rec.user_id);

    update public.coach_subscriptions
    set
      primary_team_id = coalesce(primary_team_id, rec.first_team_id),
      plan_type = coalesce(plan_type, 'single_team'),
      updated_at = now()
    where user_id = rec.user_id;

    perform public.sync_coach_team_subscriptions(rec.user_id);

    if rec.team_cnt = 1 and rec.first_team_id is not null then
      update public.teams
      set is_plan_primary = true, plan_edit_locked = false
      where id = rec.first_team_id;
    end if;
  end loop;
end $$;

-- Success check (should return 1 row: coach_subscriptions exists)
select 'coach_subscriptions ready' as status,
       count(*)::integer as coach_rows
from public.coach_subscriptions;
