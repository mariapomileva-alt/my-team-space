import { createPublicSupabase } from "@/lib/supabase/public-client";
import { mapTeamRowToTeamSpace, type TeamDbRow } from "@/lib/teams/map-row";
import { legacyTeamPath, publicTeamPath } from "@/lib/teams/public-url";
import { revalidatePath, unstable_cache } from "next/cache";
import { cache } from "react";

export type PublicTeamBundle = {
  team: TeamDbRow;
  schedule: { id: string; title: string; starts_at: string; location: string | null }[];
  updates: { id: string; title: string; body: string; published_at: string }[];
  achievements: { id: string; title: string; body: string; icon: string | null; created_at: string }[];
};

/** Invalidate with `revalidateTag(publicTeamCacheTag(slug), "default")` (Next.js 16) after coach edits or billing changes. */
export function publicTeamCacheTag(slug: string): string {
  return `public-team:${slug.trim().toLowerCase()}`;
}

/** Revalidate canonical /{slug} and legacy /team/{slug} redirect. */
export function revalidatePublicTeamPaths(slug: string) {
  const normalized = slug.trim().toLowerCase();
  revalidatePath(publicTeamPath(normalized));
  revalidatePath(legacyTeamPath(normalized));
}

async function loadPublicTeamBySlugImpl(normalizedSlug: string): Promise<PublicTeamBundle | null> {
  const supabase = createPublicSupabase();
  const { data: teamRows, error } = await supabase.rpc("get_public_team_by_slug", { p_slug: normalizedSlug });
  if (error || !teamRows?.length) return null;
  const team = teamRows[0] as TeamDbRow;

  const [{ data: schedule }, { data: updates }, { data: achievements }] = await Promise.all([
    supabase
      .from("schedule_events")
      .select("id, title, starts_at, location")
      .eq("team_id", team.id)
      .order("starts_at", { ascending: true })
      .limit(8),
    supabase
      .from("team_updates")
      .select("id, title, body, published_at")
      .eq("team_id", team.id)
      .order("published_at", { ascending: false })
      .limit(6),
    supabase
      .from("achievements")
      .select("id, title, body, icon, created_at")
      .eq("team_id", team.id)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  return {
    team,
    schedule: schedule ?? [],
    updates: updates ?? [],
    achievements: achievements ?? [],
  };
}

/**
 * Cached public bundle (one Supabase project, many teams via `team_id`).
 * `react/cache` dedupes metadata + page in one request; `unstable_cache` + tags scale to many readers.
 */
export const loadPublicTeamBySlug = cache((slug: string) => {
  const normalized = slug.trim().toLowerCase();
  return unstable_cache(
    async () => loadPublicTeamBySlugImpl(normalized),
    ["public-team-bundle", normalized],
    { revalidate: 15, tags: [publicTeamCacheTag(normalized)] }
  )();
});

export function bundleToTeamSpace(bundle: PublicTeamBundle) {
  return mapTeamRowToTeamSpace(bundle.team);
}
