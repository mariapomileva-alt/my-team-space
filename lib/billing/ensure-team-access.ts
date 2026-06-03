import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Single Team plan: sync primary team + unlock flags for the page the coach is editing.
 * Safe to call on every builder load (idempotent).
 */
export async function ensureCoachTeamEditAccess(
  supabase: SupabaseClient,
  teamId: string,
): Promise<void> {
  const { error } = await supabase.rpc("set_primary_team", { p_team_id: teamId });
  if (error) {
    console.error("[ensureCoachTeamEditAccess] set_primary_team:", error.message);
  }
}
