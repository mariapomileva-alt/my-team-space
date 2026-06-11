import { ensureCoachTeamEditAccess } from "@/lib/billing/ensure-team-access";
import { loadCoachEntitlements } from "@/lib/billing/coach-subscription";
import type { SupabaseClient } from "@supabase/supabase-js";

export type CoachCanEditResult = {
  allowed: boolean;
  reason?: "not_coach" | "rpc_error" | "plan_locked" | "subscription_inactive";
  rpcMissing?: boolean;
};

/** Whether this coach may edit this team (DB RPC + safe fallbacks). */
export async function resolveCoachCanEditTeam(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
): Promise<CoachCanEditResult> {
  const { data: membership } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", userId)
    .eq("team_id", teamId)
    .eq("role", "coach")
    .maybeSingle();

  if (!membership) {
    return { allowed: false, reason: "not_coach" };
  }

  const ent = await loadCoachEntitlements(supabase, userId);

  if (ent.teamsUsed <= 1) {
    return { allowed: true };
  }

  const { data, error } = await supabase.rpc("coach_subscription_allows_edit", {
    p_user_id: userId,
    p_team_id: teamId,
  });

  if (error) {
    const msg = error.message ?? "";
    const rpcMissing =
      msg.includes("coach_subscription_allows_edit") ||
      msg.includes("coach_subscriptions") ||
      error.code === "42883" ||
      error.code === "42P01";

    if (rpcMissing) {
      return ent.teamsUsed <= 1 ? { allowed: true, rpcMissing: true } : { allowed: false, reason: "rpc_error", rpcMissing: true };
    }

    console.error("[resolveCoachCanEditTeam]", msg);
    return { allowed: false, reason: "rpc_error" };
  }

  if (data) {
    return { allowed: true };
  }

  if (!ent.billingActive) {
    return { allowed: false, reason: "subscription_inactive" };
  }

  return { allowed: false, reason: "plan_locked" };
}

export async function assertTeamEditable(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
): Promise<void> {
  await ensureCoachTeamEditAccess(supabase, teamId);
  await assertCoachCanEditTeam(supabase, userId, teamId);
}

export async function assertCoachCanEditTeam(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
): Promise<void> {
  const result = await resolveCoachCanEditTeam(supabase, userId, teamId);

  if (result.allowed) return;

  switch (result.reason) {
    case "not_coach":
      throw new Error("Forbidden");
    case "subscription_inactive":
      throw new Error(
        "Your subscription is not active. Update billing in the dashboard to save changes.",
      );
    case "plan_locked":
      throw new Error(
        "This team is not your active page on the Team Plan. Open the dashboard and choose “Make this my active team”, or edit from the team you opened in the builder.",
      );
    default:
      throw new Error(
        "Could not verify edit access. Run supabase/RUN_COACH_SUBSCRIPTIONS.sql in Supabase, then refresh.",
      );
  }
}
