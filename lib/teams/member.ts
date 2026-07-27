import { createServerSupabase } from "@/lib/supabase/server";
import type { TeamDbRow } from "@/lib/teams/map-row";
import { loadTeamBundleExtras, type PublicTeamBundle } from "@/lib/teams/public";

/** Authenticated member load for coach draft preview (not cached for anon). */
export async function loadMemberTeamBySlug(slug: string): Promise<PublicTeamBundle | null> {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const normalized = slug.trim().toLowerCase();
  const { data: teamRows, error } = await supabase.rpc("get_member_team_by_slug", {
    p_slug: normalized,
  });
  if (error || !teamRows?.length) return null;

  const team = teamRows[0] as TeamDbRow;
  const extras = await loadTeamBundleExtras(supabase, team.id);
  return { team, ...extras };
}
