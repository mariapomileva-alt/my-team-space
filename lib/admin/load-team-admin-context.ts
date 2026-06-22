import { loadBuilderBillingContext } from "@/lib/billing/load-builder-billing";
import type { BuilderBillingContext } from "@/lib/billing/builder-context-types";
import { requireAuth } from "@/lib/auth/require-auth";
import { getUpcomingScheduleEventsFromTeam } from "@/lib/schedule/block-schedule-events";
import { mapTeamRowToTeamSpace, type TeamDbRow } from "@/lib/teams/map-row";
import { publicTeamUrl } from "@/lib/teams/public-url";
import type { TeamSpace } from "@/lib/types";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export type TeamAdminStats = {
  memberCount: number;
  upcomingEvents: { id: string; title: string; starts_at: string; location: string | null }[];
  recentUpdates: { id: string; title: string; published_at: string }[];
  achievementCount: number;
};

export type TeamAdminContext = {
  teamId: string;
  team: TeamSpace;
  teamRow: TeamDbRow;
  publicUrl: string;
  memberRole: "coach" | "assistant";
  billing: BuilderBillingContext | null;
  stats: TeamAdminStats;
};

export async function loadTeamAdminContext(teamId: string): Promise<TeamAdminContext> {
  const { supabase, user } = await requireAuth();

  const { data: mem, error: memErr } = await supabase
    .from("team_members")
    .select("team_id, role")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (memErr) throw new Error(memErr.message);
  if (!mem) notFound();

  const memberRole = (mem.role === "assistant" ? "assistant" : "coach") as "coach" | "assistant";

  const { data: teamRow, error: teamErr } = await supabase.from("teams").select("*").eq("id", teamId).single();
  if (teamErr?.code === "PGRST116" || !teamRow) notFound();
  if (teamErr) throw new Error(teamErr.message);

  const team = mapTeamRowToTeamSpace(teamRow as TeamDbRow);

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const publicUrl = publicTeamUrl(`${proto}://${host}`, team.slug);

  let billing: BuilderBillingContext | null = null;
  if (memberRole === "coach") {
    billing = await loadBuilderBillingContext(supabase, user.id, teamId, teamRow as TeamDbRow);
  }

  const upcomingEvents = getUpcomingScheduleEventsFromTeam(team, { limit: 4 });

  const [{ count: memberCount }, { data: recentUpdates }, { count: achievementCount }] = await Promise.all([
    supabase.from("team_members").select("user_id", { count: "exact", head: true }).eq("team_id", teamId),
    supabase
      .from("team_updates")
      .select("id, title, published_at")
      .eq("team_id", teamId)
      .order("published_at", { ascending: false })
      .limit(4),
    supabase.from("achievements").select("id", { count: "exact", head: true }).eq("team_id", teamId),
  ]);

  return {
    teamId,
    team,
    teamRow: teamRow as TeamDbRow,
    publicUrl,
    memberRole,
    billing,
    stats: {
      memberCount: memberCount ?? 1,
      upcomingEvents: upcomingEvents ?? [],
      recentUpdates: recentUpdates ?? [],
      achievementCount: achievementCount ?? 0,
    },
  };
}
