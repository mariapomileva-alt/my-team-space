-- Single Team: one coach team is always editable; fix invalid primary_team_id.

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

  -- Single Team onboarding: one team page is always editable for its coach.
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

grant execute on function public.coach_subscription_allows_edit(uuid, uuid) to authenticated;
