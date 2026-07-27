-- P0-02: Public team RPC returns an explicit column allowlist — never SELECT * / teams rowtype.
-- Rollback: restore get_public_team_by_slug from 20260514120000_saas_multitenant.sql.

create or replace function public.filter_public_page_settings(p_settings jsonb)
returns jsonb
language sql
immutable
set search_path = public
as $$
  select coalesce(p_settings, '{}'::jsonb)
    - 'coachWhatsapp'
    - 'payments'
    - 'parentConsent'
    - 'hideChildNames'
    - 'pollNotifications';
$$;

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
  limit 1;
$$;

revoke all on function public.get_public_team_by_slug(text) from public;
grant execute on function public.get_public_team_by_slug(text) to anon, authenticated;

comment on function public.get_public_team_by_slug(text) is
  'Public team DTO by slug — explicit columns only; secrets (access_code, invite_token) excluded.';
