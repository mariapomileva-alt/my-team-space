"use server";

import { requireAuth } from "@/lib/auth/require-auth";
import { isReservedTeamSlug, normalizeTeamSlug } from "@/lib/teams/public-url";
import { publicTeamCacheTag, revalidatePublicTeamPaths } from "@/lib/teams/public";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createTeamAction(formData: FormData) {
  const { supabase, user } = await requireAuth();

  const { data: coachRow } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("user_id", user.id)
    .eq("role", "coach")
    .limit(1)
    .maybeSingle();
  if (!coachRow) {
    throw new Error("Only team owners can create new teams. Open a team you admin from the dashboard.");
  }

  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!slug || !name) throw new Error("Slug and name required");
  const normalized = normalizeTeamSlug(slug);
  if (isReservedTeamSlug(normalized)) {
    throw new Error("This URL is reserved. Pick a different slug.");
  }
  const { data, error } = await supabase.rpc("create_team", { p_slug: slug, p_name: name });
  if (error) {
    if (error.message.includes("team_limit_reached")) {
      redirect("/admin?upgrade=academy");
    }
    throw new Error(error.message);
  }
  revalidatePublicTeamPaths(normalized);
  revalidateTag(publicTeamCacheTag(normalized), "default");
  redirect(`/admin/team/${data as string}`);
}
