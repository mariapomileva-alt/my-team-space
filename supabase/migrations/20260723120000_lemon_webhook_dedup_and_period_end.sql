-- P0-08: Lemon webhook idempotency + subscription updated_at for out-of-order protection.
-- Does not modify teams.blocks, billing amounts, or Lemon variant IDs.
-- Rollback:
--   drop table if exists public.lemon_webhook_events;
--   alter table public.coach_subscriptions drop column if exists lemon_updated_at;
--   restore upsert_coach_subscription_from_lemon from 20260610120000_coach_subscriptions_period_end.sql

create table if not exists public.lemon_webhook_events (
  event_key text primary key,
  event_name text,
  subscription_id text,
  processed_at timestamptz not null default now()
);

create index if not exists lemon_webhook_events_processed_idx
  on public.lemon_webhook_events (processed_at desc);

alter table public.lemon_webhook_events enable row level security;

-- No client policies: only service_role (bypasses RLS) writes via webhook handler.
drop policy if exists lemon_webhook_events_deny_all on public.lemon_webhook_events;
create policy lemon_webhook_events_deny_all on public.lemon_webhook_events
  for all to authenticated
  using (false)
  with check (false);

alter table public.coach_subscriptions
  add column if not exists lemon_updated_at timestamptz;

create or replace function public.claim_lemon_webhook_event(
  p_event_key text,
  p_event_name text default null,
  p_subscription_id text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_event_key is null or length(trim(p_event_key)) = 0 then
    raise exception 'event_key required';
  end if;

  insert into public.lemon_webhook_events (event_key, event_name, subscription_id)
  values (trim(p_event_key), p_event_name, p_subscription_id)
  on conflict (event_key) do nothing;

  return found;
end;
$$;

revoke all on function public.claim_lemon_webhook_event(text, text, text) from public;
revoke all on function public.claim_lemon_webhook_event(text, text, text) from anon;
revoke all on function public.claim_lemon_webhook_event(text, text, text) from authenticated;
grant execute on function public.claim_lemon_webhook_event(text, text, text) to service_role;

create or replace function public.upsert_coach_subscription_from_lemon(
  p_user_id uuid,
  p_customer_id text,
  p_subscription_id text,
  p_variant_id text,
  p_plan_type text,
  p_subscription_status text,
  p_team_limit integer,
  p_current_period_end timestamptz default null,
  p_lemon_updated_at timestamptz default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_updated timestamptz;
begin
  select lemon_updated_at into v_existing_updated
  from public.coach_subscriptions
  where user_id = p_user_id;

  -- Out-of-order: keep current billing row when Lemon updated_at is older.
  if v_existing_updated is not null
    and p_lemon_updated_at is not null
    and p_lemon_updated_at < v_existing_updated then
    return;
  end if;

  insert into public.coach_subscriptions (
    user_id,
    lemon_customer_id,
    lemon_subscription_id,
    lemon_variant_id,
    plan_type,
    subscription_status,
    team_limit,
    current_period_end,
    lemon_updated_at
  )
  values (
    p_user_id,
    p_customer_id,
    p_subscription_id,
    p_variant_id,
    p_plan_type,
    p_subscription_status,
    p_team_limit,
    p_current_period_end,
    p_lemon_updated_at
  )
  on conflict (user_id) do update set
    lemon_customer_id = coalesce(excluded.lemon_customer_id, coach_subscriptions.lemon_customer_id),
    lemon_subscription_id = coalesce(excluded.lemon_subscription_id, coach_subscriptions.lemon_subscription_id),
    lemon_variant_id = coalesce(excluded.lemon_variant_id, coach_subscriptions.lemon_variant_id),
    plan_type = coalesce(excluded.plan_type, coach_subscriptions.plan_type),
    subscription_status = excluded.subscription_status,
    team_limit = coalesce(excluded.team_limit, coach_subscriptions.team_limit),
    current_period_end = coalesce(excluded.current_period_end, coach_subscriptions.current_period_end),
    lemon_updated_at = coalesce(excluded.lemon_updated_at, coach_subscriptions.lemon_updated_at),
    updated_at = now();

  perform public.refresh_coach_team_count(p_user_id);
  perform public.sync_coach_team_subscriptions(p_user_id);
end;
$$;

revoke all on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz, timestamptz) from public;
grant execute on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz, timestamptz) to service_role;

-- Keep 8-arg overload callable during rolling deploys (forwards with null lemon_updated_at).
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
  perform public.upsert_coach_subscription_from_lemon(
    p_user_id,
    p_customer_id,
    p_subscription_id,
    p_variant_id,
    p_plan_type,
    p_subscription_status,
    p_team_limit,
    p_current_period_end,
    null::timestamptz
  );
end;
$$;

revoke all on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz) from public;
grant execute on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz) to service_role;
