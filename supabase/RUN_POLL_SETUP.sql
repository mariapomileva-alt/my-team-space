-- Run this entire file once in Supabase → SQL Editor → Run
-- Fixes poll voting + adds missing team columns (page_settings, logo_url, privacy)

-- 1) Team columns (safe if already applied)
alter table public.teams add column if not exists page_visibility text not null default 'public';
alter table public.teams add column if not exists access_code text;
alter table public.teams add column if not exists invite_token text;
alter table public.teams add column if not exists page_settings jsonb not null default '{}'::jsonb;
alter table public.teams add column if not exists logo_url text;

-- 2) Poll votes table
create table if not exists public.poll_votes (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams (id) on delete cascade,
  block_id text not null,
  voter_name text not null default '',
  choice text not null check (choice in ('yes', 'no')),
  created_at timestamptz not null default now()
);

create index if not exists poll_votes_team_block_idx
  on public.poll_votes (team_id, block_id, created_at desc);

alter table public.poll_votes enable row level security;

drop policy if exists poll_votes_select_coach on public.poll_votes;
create policy poll_votes_select_coach on public.poll_votes
  for select to authenticated
  using (exists (
    select 1 from public.team_members m
    where m.team_id = poll_votes.team_id and m.user_id = auth.uid()
  ));

-- 3) Vote RPC (does not require page_settings on teams row type)
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
  v_team_id uuid;
  v_team_name text;
  v_status text;
  v_coach_phone text := '';
  vid uuid;
  nm text := left(trim(coalesce(p_voter_name, '')), 80);
  ch text := lower(trim(p_choice));
begin
  if ch not in ('yes', 'no') then
    raise exception 'invalid choice';
  end if;
  if length(nm) < 1 then
    raise exception 'name required';
  end if;

  select id, name, subscription_status
  into v_team_id, v_team_name, v_status
  from public.teams
  where slug = lower(trim(p_slug))
  limit 1;

  if v_team_id is null then
    raise exception 'team not found';
  end if;

  if v_status not in ('active', 'trialing') then
    raise exception 'team not available';
  end if;

  select coalesce(page_settings->>'coachWhatsapp', '')
  into v_coach_phone
  from public.teams
  where id = v_team_id;

  insert into public.poll_votes (team_id, block_id, voter_name, choice)
  values (v_team_id, left(trim(p_block_id), 64), nm, ch)
  returning id into vid;

  return jsonb_build_object(
    'vote_id', vid,
    'team_id', v_team_id,
    'team_name', v_team_name,
    'coach_phone', v_coach_phone
  );
end;
$$;

revoke all on function public.record_poll_vote(text, text, text, text) from public;
grant execute on function public.record_poll_vote(text, text, text, text) to anon, authenticated;
