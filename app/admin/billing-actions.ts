"use server";

import { assertTeamEditable } from "@/lib/billing/coach-subscription";
import { requireAuth } from "@/lib/auth/require-auth";
import { publicTeamCacheTag } from "@/lib/teams/public";
import { revalidatePath, revalidateTag } from "next/cache";

export async function setPrimaryTeamAction(teamId: string) {
  const { supabase, user } = await requireAuth();
  const { error } = await supabase.rpc("set_primary_team", { p_team_id: teamId });
  if (error) throw new Error(error.message);

  const { data: team } = await supabase.from("teams").select("slug").eq("id", teamId).single();
  if (team?.slug) {
    revalidatePath(`/team/${team.slug}`);
    revalidateTag(publicTeamCacheTag(team.slug as string), "default");
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/team/${teamId}/step-2`);
}

export async function assertCanEditTeam(teamId: string) {
  const { supabase, user } = await requireAuth();
  await assertTeamEditable(supabase, user.id, teamId);
}
