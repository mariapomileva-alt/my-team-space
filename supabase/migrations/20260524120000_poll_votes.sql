-- Poll votes from parents (no accounts) + coach read access

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

create policy poll_votes_select_coach on public.poll_votes
  for select to authenticated
  using (exists (
    select 1 from public.team_members m
    where m.team_id = poll_votes.team_id and m.user_id = auth.uid()
  ));

-- Inserts only via RPC (anon cannot write directly)
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

  insert into public.poll_votes (team_id, block_id, voter_name, choice)
  values (t.id, left(trim(p_block_id), 64), nm, ch)
  returning id into vid;

  return jsonb_build_object(
    'vote_id', vid,
    'team_id', t.id,
    'team_name', t.name,
    'coach_phone', coalesce(t.page_settings->>'coachWhatsapp', '')
  );
end;
$$;

revoke all on function public.record_poll_vote(text, text, text, text) from public;
grant execute on function public.record_poll_vote(text, text, text, text) to anon, authenticated;
