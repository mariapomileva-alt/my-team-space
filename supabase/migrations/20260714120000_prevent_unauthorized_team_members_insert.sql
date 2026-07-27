-- P0-01: Deny direct client INSERT into team_members.
-- Legitimate membership creation paths (SECURITY DEFINER, bypass RLS):
--   - public.create_team
--   - public.accept_team_admin_invite
-- Rollback: recreate team_members_insert_own (see docs/pre-launch-audit.md).

drop policy if exists team_members_insert_own on public.team_members;

comment on table public.team_members is
  'Membership rows are created only via SECURITY DEFINER RPCs (create_team, accept_team_admin_invite).';
