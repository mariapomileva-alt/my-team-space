-- Run this ONLY if RUN_COACH_SUBSCRIPTIONS.sql failed at the bootstrap step with min(uuid).
-- (Tables and functions should already exist.)

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

select 'coach_subscriptions ready' as status,
       count(*)::integer as coach_rows
from public.coach_subscriptions;
