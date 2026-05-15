-- New teams start on trial so coaches can preview /team/[slug] before billing is wired.
-- Existing inactive teams are upgraded so current pages (e.g. /team/stars) are not stuck paused.

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
  values (s, left(trim(p_name), 200), 'trialing')
  returning id into tid;
  insert into public.team_members (team_id, user_id, role)
  values (tid, auth.uid(), 'coach');
  return tid;
end;
$$;

update public.teams
set subscription_status = 'trialing', updated_at = now()
where subscription_status = 'inactive';
