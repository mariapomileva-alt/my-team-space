-- team_members had a self-referential FOR ALL policy (EXISTS subquery on team_members),
-- which can trigger infinite RLS recursion and break /admin (PostgREST 500).
-- Replace with row-scoped policies: each coach sees and edits only their own membership rows.
-- Idempotent: safe to re-run after partial applies.

drop policy if exists team_members_select_own on public.team_members;
drop policy if exists team_members_insert_own on public.team_members;
drop policy if exists team_members_update_own on public.team_members;
drop policy if exists team_members_delete_own on public.team_members;
drop policy if exists team_members_all_for_coach_team on public.team_members;

create policy team_members_select_own on public.team_members
  for select to authenticated
  using (user_id = auth.uid());

create policy team_members_insert_own on public.team_members
  for insert to authenticated
  with check (user_id = auth.uid());

create policy team_members_update_own on public.team_members
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy team_members_delete_own on public.team_members
  for delete to authenticated
  using (user_id = auth.uid());
