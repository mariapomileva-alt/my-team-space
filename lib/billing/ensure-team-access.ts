import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Single Team plan: sync primary team + unlock flags for the page the coach is editing.
 * Safe to call on every builder load (idempotent). Never throws.
 */
export async function ensureCoachTeamEditAccess(
  supabase: SupabaseClient,
  teamId: string,
): Promise<void> {
  try {
    const { error } = await supabase.rpc("set_primary_team", { p_team_id: teamId });
    if (error) {
      const msg = error.message ?? "";
      if (
        msg.includes("set_primary_team") ||
        msg.includes("coach_subscriptions") ||
        error.code === "42883" ||
        error.code === "42P01"
      ) {
        return;
      }
      console.error("[ensureCoachTeamEditAccess] set_primary_team:", msg);
    }
  } catch (e) {
    console.error("[ensureCoachTeamEditAccess]", e);
  }
}
