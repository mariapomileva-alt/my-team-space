-- P0-04: Block direct team_members role changes and last-owner removal.
-- Authorized role changes go through SECURITY DEFINER RPCs with a session flag.
-- Rollback: drop trigger/function; restore accept_team_admin_invite ON CONFLICT DO UPDATE.

create or replace function public.team_members_guard()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  coach_count integer;
begin
  if tg_op = 'UPDATE' then
    if old.team_id is distinct from new.team_id or old.user_id is distinct from new.user_id then
      raise exception 'team_member_identity_change_forbidden' using errcode = '42501';
    end if;
    if old.role is distinct from new.role then
      if current_setting('mts.allow_team_member_role_change', true) is distinct from 'true' then
        raise exception 'team_member_role_change_forbidden' using errcode = '42501';
      end if;
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    if old.role = 'coach' then
      select count(*)::integer into coach_count
      from public.team_members
      where team_id = old.team_id and role = 'coach';
      if coach_count <= 1 then
        raise exception 'cannot_remove_last_team_owner' using errcode = '42501';
      end if;
    end if;
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists team_members_guard on public.team_members;
create trigger team_members_guard
  before update or delete on public.team_members
  for each row execute function public.team_members_guard();

-- Invite accept: never upsert role on conflict (prevents assistant→coach replay).
create or replace function public.accept_team_admin_invite(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.team_admin_invites%rowtype;
  v_email text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select * into v_invite
  from public.team_admin_invites
  where token = trim(p_token)
  limit 1;

  if v_invite.id is null then
    raise exception 'invite not found';
  end if;
  if v_invite.revoked_at is not null then
    raise exception 'invite revoked';
  end if;
  if v_invite.accepted_at is not null then
    return jsonb_build_object('team_id', v_invite.team_id, 'already_accepted', true);
  end if;
  if v_invite.expires_at < now() then
    raise exception 'invite expired';
  end if;

  select lower(email) into v_email from auth.users where id = auth.uid();
  if v_email is null or v_email <> lower(v_invite.email) then
    raise exception 'email mismatch — sign in with %', v_invite.email;
  end if;

  insert into public.team_members (team_id, user_id, role)
  values (v_invite.team_id, auth.uid(), v_invite.role)
  on conflict (team_id, user_id) do nothing;

  update public.team_admin_invites
  set accepted_at = now(), accepted_by = auth.uid()
  where id = v_invite.id;

  return jsonb_build_object('team_id', v_invite.team_id, 'already_accepted', false);
end;
$$;

revoke all on function public.accept_team_admin_invite(text) from public;
grant execute on function public.accept_team_admin_invite(text) to authenticated;

-- Coach-only role assignment (assistant only; never promote to coach).
create or replace function public.update_team_staff_role(
  p_team_id uuid,
  p_user_id uuid,
  p_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_role text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if not public.is_team_coach(p_team_id) then
    raise exception 'forbidden';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'cannot change own role';
  end if;
  if p_role <> 'assistant' then
    raise exception 'invalid role';
  end if;

  select role into v_current_role
  from public.team_members
  where team_id = p_team_id and user_id = p_user_id;

  if v_current_role is null then
    raise exception 'member not found';
  end if;
  if v_current_role = 'coach' then
    raise exception 'cannot change team owner role';
  end if;

  perform set_config('mts.allow_team_member_role_change', 'true', true);
  update public.team_members
  set role = p_role
  where team_id = p_team_id and user_id = p_user_id;
end;
$$;

revoke all on function public.update_team_staff_role(uuid, uuid, text) from public;
grant execute on function public.update_team_staff_role(uuid, uuid, text) to authenticated;
