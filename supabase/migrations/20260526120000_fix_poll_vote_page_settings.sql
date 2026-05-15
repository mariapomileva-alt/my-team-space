-- Fix poll vote RPC when teams.page_settings was not migrated yet.

alter table public.teams
  add column if not exists page_visibility text not null default 'public';

alter table public.teams
  add column if not exists access_code text;

alter table public.teams
  add column if not exists invite_token text;

alter table public.teams
  add column if not exists page_settings jsonb not null default '{}'::jsonb;

alter table public.teams
  add column if not exists logo_url text;

create or replace function public.record_poll_vote(
  p_slug text,
  p_block_id text,
  p_voter_name text,
  p_choice text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  t public.teams%rowtype;
  vid uuid;
  nm text := left(trim(coalesce(p_voter_name, '')), 80);
  ch text := lower(trim(p_choice));
  coach_phone text := '';
begin
  if ch not in ('yes', 'no') then
    raise exception 'invalid choice';
  end if;
  if length(nm) < 1 then
    raise exception 'name required';
  end if;

  select * into t from public.teams
  where slug = lower(trim(p_slug))
  limit 1;

  if t.id is null then
    raise exception 'team not found';
  end if;

  if t.subscription_status not in ('active', 'trialing') then
    raise exception 'team not available';
  end if;

  coach_phone := coalesce(t.page_settings->>'coachWhatsapp', '');

  insert into public.poll_votes (team_id, block_id, voter_name, choice)
  values (t.id, left(trim(p_block_id), 64), nm, ch)
  returning id into vid;

  return jsonb_build_object(
    'vote_id', vid,
    'team_id', t.id,
    'team_name', t.name,
    'coach_phone', coach_phone
  );
end;
$$;

revoke all on function public.record_poll_vote(text, text, text, text) from public;
grant execute on function public.record_poll_vote(text, text, text, text) to anon, authenticated;
