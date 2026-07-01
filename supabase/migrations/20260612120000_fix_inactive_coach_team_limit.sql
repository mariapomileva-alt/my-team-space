-- Inactive coaches with zero teams were blocked from creating their first team:
-- effective_team_limit returned current_team_count (0), so owned >= lim on the first create_team call.

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
