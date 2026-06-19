-- Store Lemon Squeezy billing period end (renews_at / ends_at) on coach subscriptions.

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

revoke all on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz) from public;
grant execute on function public.upsert_coach_subscription_from_lemon(uuid, text, text, text, text, text, integer, timestamptz) to service_role;
