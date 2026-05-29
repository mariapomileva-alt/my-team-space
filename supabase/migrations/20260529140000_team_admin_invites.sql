-- Delegated page admins: coach invites assistants by email + magic accept link.

create table if not exists public.team_admin_invites (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  email text not null,
  token text not null unique,
  role text not null default 'assistant' check (role in ('assistant')),
  invited_by uuid not null references auth.users (id) on delete cascade,
  accepted_at timestamptz,
  accepted_by uuid references auth.users (id) on delete set null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '14 days')
);

create index if not exists team_admin_invites_team_idx on public.team_admin_invites (team_id);
create index if not exists team_admin_invites_token_idx on public.team_admin_invites (token) where revoked_at is null;
create unique index if not exists team_admin_invites_pending_email_idx
  on public.team_admin_invites (team_id, lower(email))
  where accepted_at is null and revoked_at is null;

alter table public.team_admin_invites enable row level security;

-- No direct client access — use RPCs only.
create policy team_admin_invites_deny_all on public.team_admin_invites
  for all to authenticated using (false);

create or replace function public.is_team_coach(p_team_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members m
    where m.team_id = p_team_id
      and m.user_id = auth.uid()
      and m.role = 'coach'
  );
$$;

revoke all on function public.is_team_coach(uuid) from public;
grant execute on function public.is_team_coach(uuid) to authenticated;

create or replace function public.is_team_member(p_team_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.team_members m
    where m.team_id = p_team_id and m.user_id = auth.uid()
  );
$$;

revoke all on function public.is_team_member(uuid) from public;
grant execute on function public.is_team_member(uuid) to authenticated;

create or replace function public.create_team_admin_invite(p_team_id uuid, p_email text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
  v_token text;
  v_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if not public.is_team_coach(p_team_id) then
    raise exception 'forbidden';
  end if;
  if v_email !~ '^[^@]+@[^@]+\.[^@]+$' then
    raise exception 'invalid email';
  end if;

  update public.team_admin_invites
  set revoked_at = now()
  where team_id = p_team_id
    and lower(email) = v_email
    and accepted_at is null
    and revoked_at is null;

  v_token := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');

  insert into public.team_admin_invites (team_id, email, token, invited_by)
  values (p_team_id, v_email, v_token, auth.uid())
  returning id into v_id;

  return jsonb_build_object('id', v_id, 'token', v_token, 'email', v_email);
end;
$$;

revoke all on function public.create_team_admin_invite(uuid, text) from public;
grant execute on function public.create_team_admin_invite(uuid, text) to authenticated;

create or replace function public.revoke_team_admin_invite(p_invite_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  select team_id into v_team_id
  from public.team_admin_invites
  where id = p_invite_id;

  if v_team_id is null then
    raise exception 'invite not found';
  end if;
  if not public.is_team_coach(v_team_id) then
    raise exception 'forbidden';
  end if;

  update public.team_admin_invites
  set revoked_at = now()
  where id = p_invite_id and revoked_at is null;
end;
$$;

revoke all on function public.revoke_team_admin_invite(uuid) from public;
grant execute on function public.revoke_team_admin_invite(uuid) to authenticated;

create or replace function public.list_team_staff(p_team_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if not public.is_team_coach(p_team_id) then
    raise exception 'forbidden';
  end if;

  return jsonb_build_object(
    'members',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'user_id', m.user_id,
            'role', m.role,
            'email', u.email,
            'created_at', m.created_at
          )
          order by m.created_at
        )
        from public.team_members m
        join auth.users u on u.id = m.user_id
        where m.team_id = p_team_id
      ),
      '[]'::jsonb
    ),
    'pending_invites',
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', i.id,
            'email', i.email,
            'token', i.token,
            'created_at', i.created_at,
            'expires_at', i.expires_at
          )
          order by i.created_at desc
        )
        from public.team_admin_invites i
        where i.team_id = p_team_id
          and i.accepted_at is null
          and i.revoked_at is null
          and i.expires_at > now()
      ),
      '[]'::jsonb
    )
  );
end;
$$;

revoke all on function public.list_team_staff(uuid) from public;
grant execute on function public.list_team_staff(uuid) to authenticated;

create or replace function public.remove_team_staff(p_team_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  if not public.is_team_coach(p_team_id) then
    raise exception 'forbidden';
  end if;
  if p_user_id = auth.uid() then
    raise exception 'cannot remove yourself';
  end if;

  select role into v_role
  from public.team_members
  where team_id = p_team_id and user_id = p_user_id;

  if v_role is null then
    raise exception 'member not found';
  end if;
  if v_role = 'coach' then
    raise exception 'cannot remove team owner';
  end if;

  delete from public.team_members
  where team_id = p_team_id and user_id = p_user_id and role = 'assistant';
end;
$$;

revoke all on function public.remove_team_staff(uuid, uuid) from public;
grant execute on function public.remove_team_staff(uuid, uuid) to authenticated;

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
  on conflict (team_id, user_id) do update set role = excluded.role;

  update public.team_admin_invites
  set accepted_at = now(), accepted_by = auth.uid()
  where id = v_invite.id;

  return jsonb_build_object('team_id', v_invite.team_id, 'already_accepted', false);
end;
$$;

revoke all on function public.accept_team_admin_invite(text) from public;
grant execute on function public.accept_team_admin_invite(text) to authenticated;
