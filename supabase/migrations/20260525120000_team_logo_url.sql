-- Public team logo URL (shown on /team/[slug]). Separate from coach-only page_settings.

alter table public.teams
  add column if not exists logo_url text;

comment on column public.teams.logo_url is 'HTTPS logo URL for the public team page (avatar in hero block)';
