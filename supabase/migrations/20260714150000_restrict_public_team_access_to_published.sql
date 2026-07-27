-- P0-05: Anonymous public reads only for published, active/trialing teams.
-- Coaches preview drafts via get_member_team_by_slug (authenticated members).
-- Rollback: remove publish_status filter from get_public_team_by_slug WHERE clause;
-- drop get_member_team_by_slug; restore content public_read policies from 20260514120000.

drop function if exists public.get_public_team_by_slug(text);

create or replace function public.get_public_team_by_slug(p_slug text)
returns table (
  id uuid,
  slug text,
  name text,
  logo_path text,
  logo_url text,
  primary_color text,
  secondary_color text,
  theme_id text,
  tagline text,
  blocks jsonb,
  subscription_status text,
  publish_status text,
  page_visibility text,
  is_plan_primary boolean,
  plan_edit_locked boolean,
  page_settings jsonb,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.id,
    t.slug,
    t.name,
    t.logo_path,
    t.logo_url,
    t.primary_color,
    t.secondary_color,
    t.theme_id,
    t.tagline,
    t.blocks,
    t.subscription_status,
    t.publish_status,
    t.page_visibility,
    t.is_plan_primary,
    t.plan_edit_locked,
    public.filter_public_page_settings(t.page_settings),
    t.updated_at
  from public.teams t
  where t.slug = lower(trim(p_slug))
    and t.publish_status = 'published'
    and t.subscription_status in ('active', 'trialing')
  limit 1;
$$;

revoke all on function public.get_public_team_by_slug(text) from public;
grant execute on function public.get_public_team_by_slug(text) to anon, authenticated;

create or replace function public.get_member_team_by_slug(p_slug text)
returns table (
  id uuid,
  slug text,
  name text,
  logo_path text,
  logo_url text,
  primary_color text,
  secondary_color text,
  theme_id text,
  tagline text,
  blocks jsonb,
  subscription_status text,
  publish_status text,
  page_visibility text,
  is_plan_primary boolean,
  plan_edit_locked boolean,
  page_settings jsonb,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.id,
    t.slug,
    t.name,
    t.logo_path,
    t.logo_url,
    t.primary_color,
    t.secondary_color,
    t.theme_id,
    t.tagline,
    t.blocks,
    t.subscription_status,
    t.publish_status,
    t.page_visibility,
    t.is_plan_primary,
    t.plan_edit_locked,
    public.filter_public_page_settings(t.page_settings),
    t.updated_at
  from public.teams t
  where t.slug = lower(trim(p_slug))
    and exists (
      select 1
      from public.team_members m
      where m.team_id = t.id
        and m.user_id = auth.uid()
    )
  limit 1;
$$;

revoke all on function public.get_member_team_by_slug(text) from public;
grant execute on function public.get_member_team_by_slug(text) to authenticated;

-- Access codes apply only to live published pages (no draft/unpublished enumeration).
create or replace function public.verify_team_access(p_slug text, p_code text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_access text;
  v_invite text;
  norm text := lower(regexp_replace(trim(coalesce(p_code, '')), '\s+', '', 'g'));
begin
  if norm = '' then
    return false;
  end if;

  select t.access_code, t.invite_token
  into v_access, v_invite
  from public.teams t
  where t.slug = lower(trim(p_slug))
    and t.publish_status = 'published'
    and t.subscription_status in ('active', 'trialing')
  limit 1;

  if not found then
    return false;
  end if;

  if v_access is not null
    and lower(regexp_replace(trim(v_access), '\s+', '', 'g')) = norm then
    return true;
  end if;

  if v_invite is not null
    and lower(regexp_replace(trim(v_invite), '\s+', '', 'g')) = norm then
    return true;
  end if;

  return false;
end;
$$;

revoke all on function public.verify_team_access(text, text) from public;
grant execute on function public.verify_team_access(text, text) to anon, authenticated;

drop policy if exists schedule_events_public_read on public.schedule_events;
create policy schedule_events_public_read on public.schedule_events
  for select
  using (exists (
    select 1 from public.teams t
    where t.id = schedule_events.team_id
      and t.publish_status = 'published'
      and t.subscription_status in ('active', 'trialing')
  ));

drop policy if exists team_updates_public_read on public.team_updates;
create policy team_updates_public_read on public.team_updates
  for select
  using (exists (
    select 1 from public.teams t
    where t.id = team_updates.team_id
      and t.publish_status = 'published'
      and t.subscription_status in ('active', 'trialing')
  ));

drop policy if exists achievements_public_read on public.achievements;
create policy achievements_public_read on public.achievements
  for select
  using (exists (
    select 1 from public.teams t
    where t.id = achievements.team_id
      and t.publish_status = 'published'
      and t.subscription_status in ('active', 'trialing')
  ));
