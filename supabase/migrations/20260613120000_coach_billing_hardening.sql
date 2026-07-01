-- Reconcile billing RPCs with RUN_COACH_SUBSCRIPTIONS.sql:
-- - plan_type IS NULL treated as single_team (not academy)
-- - first create_team bootstraps plan_type
-- - advisory lock prevents concurrent create_team races
-- - coach_subscription_allows_edit: one owned team is always editable

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

  if (sub.plan_type = 'single_team' or sub.plan_type is null) and sub.primary_team_id is not null then
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

  perform pg_advisory_xact_lock(hashtext('create_team:' || uid::text));

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
    set primary_team_id = tid,
        plan_type = coalesce(plan_type, 'single_team'),
        updated_at = now()
    where user_id = uid and primary_team_id is null;
    update public.teams
    set is_plan_primary = true, plan_edit_locked = false
    where id = tid;
  end if;

  perform public.sync_coach_team_subscriptions(uid);
  return tid;
end;
$$;

grant execute on function public.coach_subscription_allows_edit(uuid, uuid) to authenticated;
