"use server";

import { requireAuth } from "@/lib/auth/require-auth";
import { createDefaultBlocks } from "@/lib/default-blocks";
import { isReservedTeamSlug, normalizeTeamSlug } from "@/lib/teams/public-url";
import {
  isValidPageLink,
  pageLinkFromName,
  sanitizePageLinkInput,
} from "@/lib/teams/page-link";
import { publicTeamCacheTag, revalidatePublicTeamPaths } from "@/lib/teams/public";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

function readPageLink(formData: FormData, name: string): string {
  const raw = String(formData.get("pageLink") ?? "").trim();
  const link = sanitizePageLinkInput(raw || pageLinkFromName(name));
  if (!link || !isValidPageLink(link)) {
    throw new Error("Pick a valid page link — letters, numbers, and hyphens only.");
  }
  return link;
}

async function createTeamAndRedirect(formData: FormData, options: { sport?: boolean; city?: boolean }) {
  const { supabase, user } = await requireAuth();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Team name is required");

  const pageLink = readPageLink(formData, name);
  const normalized = normalizeTeamSlug(pageLink);
  if (isReservedTeamSlug(normalized)) {
    throw new Error("This page link is reserved. Pick a different one.");
  }

  const sport = options.sport ? String(formData.get("sport") ?? "").trim() : "";
  const city = options.city ? String(formData.get("city") ?? "").trim() : "";

  const { data, error } = await supabase.rpc("create_team", {
    p_slug: pageLink,
    p_name: name,
  });

  if (error) {
    if (error.message.includes("team_limit_reached")) {
      redirect("/admin?upgrade=academy");
    }
    throw new Error(error.message);
  }

  const teamId = data as string;
  const blocks = createDefaultBlocks({ city: city || undefined });

  const patch: Record<string, unknown> = { blocks };
  if (sport) patch.tagline = sport;

  const { error: updateError } = await supabase.from("teams").update(patch).eq("id", teamId);
  if (updateError) {
    console.error("[createTeam] post-create update:", updateError.message);
  }

  revalidatePublicTeamPaths(normalized);
  revalidateTag(publicTeamCacheTag(normalized), "default");
  revalidatePath("/admin");
  redirect(`/admin/team/${teamId}/build`);
}

/** First team after signup — full setup form. */
export async function createFirstTeamAction(formData: FormData) {
  await createTeamAndRedirect(formData, { sport: true, city: true });
}

/** Additional team (Academy) — name + page link only. */
export async function createTeamAction(formData: FormData) {
  await createTeamAndRedirect(formData, {});
}
