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
      const [{ data: sub }, { data: memberships }] = await Promise.all([
        supabase.from("coach_subscriptions").select("primary_team_id").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("team_members")
          .select("team_id")
          .eq("user_id", user.id)
          .eq("role", "coach")
          .order("team_id", { ascending: true }),
      ]);

      const primaryId = sub?.primary_team_id as string | undefined;
      const ownedIds = (memberships ?? []).map((m) => m.team_id as string);
      const existingTeamId =
        (primaryId && ownedIds.includes(primaryId) ? primaryId : undefined) ?? ownedIds[0];

      if (existingTeamId) {
        redirect(`/admin/team/${existingTeamId}/build`);
      }
      redirect("/admin?upgrade=academy");
    }
    if (error.message.includes("duplicate key") || error.message.includes("teams_slug")) {
      throw new Error("This page link is already taken. Pick a different one.");
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

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: string }).digest ?? "").startsWith("NEXT_REDIRECT")
  );
}

export type CreateTeamFormState = { error?: string } | null;

/** First team after signup — full setup form (supports inline errors). */
export async function createFirstTeamAction(
  _prev: CreateTeamFormState,
  formData: FormData,
): Promise<CreateTeamFormState> {
  try {
    await createTeamAndRedirect(formData, { sport: true, city: true });
    return null;
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    return {
      error: error instanceof Error ? error.message : "Could not create your team page. Please try again.",
    };
  }
}

/** Additional team (Academy) — name + page link only. */
export async function createTeamAction(formData: FormData) {
  await createTeamAndRedirect(formData, {});
}
