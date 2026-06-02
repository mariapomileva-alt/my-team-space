"use server";

import { requireAuth } from "@/lib/auth/require-auth";
import { publicTeamCacheTag } from "@/lib/teams/public";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createTeamAction(formData: FormData) {
  const { supabase } = await requireAuth();
  const slug = String(formData.get("slug") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!slug || !name) throw new Error("Slug and name required");
  const { data, error } = await supabase.rpc("create_team", { p_slug: slug, p_name: name });
  if (error) {
    if (error.message.includes("team_limit_reached")) {
      redirect("/admin?upgrade=academy");
    }
    throw new Error(error.message);
  }
  const normalized = slug.trim().toLowerCase();
  revalidatePath(`/team/${normalized}`);
  revalidateTag(publicTeamCacheTag(normalized), "default");
  redirect(`/admin/team/${data as string}/step-1`);
}
