"use server";

import { assertTeamEditable } from "@/lib/billing/coach-can-edit";
import { requireAuth } from "@/lib/auth/require-auth";
import { getTeamMembership } from "@/lib/team-member-access";
import { publicTeamCacheTag, revalidatePublicTeamPaths } from "@/lib/teams/public";
import { revalidatePath, revalidateTag } from "next/cache";

export async function setPrimaryTeamAction(teamId: string) {
  const { supabase, user } = await requireAuth();
  const membership = await getTeamMembership(supabase, user.id, teamId);
  if (!membership || membership.role !== "coach") {
    throw new Error("Only the team owner can set the active team.");
  }
  const { error } = await supabase.rpc("set_primary_team", { p_team_id: teamId });
  if (error) throw new Error(error.message);

  const { data: team } = await supabase.from("teams").select("slug").eq("id", teamId).single();
  if (team?.slug) {
    revalidatePublicTeamPaths(team.slug as string);
    revalidateTag(publicTeamCacheTag(team.slug as string), "default");
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/team/${teamId}/step-2`);
}

/** Form-friendly wrapper (hidden input `teamId`). */
export async function setPrimaryTeamFormAction(formData: FormData) {
  const teamId = String(formData.get("teamId") ?? "").trim();
  if (!teamId) throw new Error("Missing team");
  await setPrimaryTeamAction(teamId);
}

export async function assertCanEditTeam(teamId: string) {
  const { supabase, user } = await requireAuth();
  await assertTeamEditable(supabase, user.id, teamId);
}
