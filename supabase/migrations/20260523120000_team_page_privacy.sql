-- Team page privacy, invite links, and coach-only settings (payments tracker, etc.)

alter table public.teams
  add column if not exists page_visibility text not null default 'public'
    check (page_visibility in ('public', 'private', 'mixed'));

alter table public.teams
  add column if not exists access_code text;

alter table public.teams
  add column if not exists invite_token text;

alter table public.teams
  add column if not exists page_settings jsonb not null default '{}'::jsonb;

create index if not exists teams_invite_token_idx on public.teams (invite_token)
  where invite_token is not null;

comment on column public.teams.page_visibility is 'public | private (access code) | mixed (per-block audience)';
comment on column public.teams.access_code is 'Short code parents enter — no accounts';
comment on column public.teams.invite_token is 'Magic link token (?invite=) — grants access without typing code';
comment on column public.teams.page_settings is 'Coach-only JSON: consent, payments tracker, WhatsApp notify prefs';
