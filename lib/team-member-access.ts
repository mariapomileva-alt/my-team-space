import type { TeamMemberRole } from "@/lib/team-admin";
import type { SupabaseClient } from "@supabase/supabase-js";

export type TeamMembership = {
  teamId: string;
  role: TeamMemberRole;
};

export async function getTeamMembership(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
): Promise<TeamMembership | null> {
  const { data, error } = await supabase
    .from("team_members")
    .select("team_id, role")
    .eq("team_id", teamId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  const role = data.role === "assistant" ? "assistant" : "coach";
  return { teamId: data.team_id as string, role };
}

export async function assertTeamMember(
  supabase: SupabaseClient,
  userId: string,
  teamId: string,
): Promise<TeamMembership> {
  const membership = await getTeamMembership(supabase, userId, teamId);
  if (!membership) throw new Error("Forbidden");
  return membership;
}

/** Coach-owned teams only — for billing / create team limits. */
export function isCoachOwnedTeam(role: string): boolean {
  return role === "coach";
}
