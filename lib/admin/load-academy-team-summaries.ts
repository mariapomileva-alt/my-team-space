import { builderCompletionPercent } from "@/lib/builder/page-completion";
import { getUpcomingScheduleEventsFromTeam } from "@/lib/schedule/block-schedule-events";
import { mapTeamRowToTeamSpace, type TeamDbRow } from "@/lib/teams/map-row";
import type { SupabaseClient } from "@supabase/supabase-js";

export type AcademyTeamSummary = {
  memberCount: number;
  upcomingEventCount: number;
  achievementCount: number;
  completionPercent: number;
};

export async function loadAcademyTeamSummaries(
  supabase: SupabaseClient,
  teamIds: string[],
): Promise<Map<string, AcademyTeamSummary>> {
  const summaries = new Map<string, AcademyTeamSummary>();
  if (!teamIds.length) return summaries;

  const [{ data: members }, { data: teams }, { data: achievements }] = await Promise.all([
    supabase.from("team_members").select("team_id").in("team_id", teamIds),
    supabase.from("teams").select("id, blocks").in("id", teamIds),
    supabase.from("achievements").select("team_id").in("team_id", teamIds),
  ]);

  const memberCountByTeam = new Map<string, number>();
  for (const row of members ?? []) {
    const id = row.team_id as string;
    memberCountByTeam.set(id, (memberCountByTeam.get(id) ?? 0) + 1);
  }

  const achievementCountByTeam = new Map<string, number>();
  for (const row of achievements ?? []) {
    const id = row.team_id as string;
    achievementCountByTeam.set(id, (achievementCountByTeam.get(id) ?? 0) + 1);
  }

  for (const row of teams ?? []) {
    const id = row.id as string;
    const team = mapTeamRowToTeamSpace({ id, blocks: row.blocks } as TeamDbRow);
    summaries.set(id, {
      memberCount: memberCountByTeam.get(id) ?? 0,
      upcomingEventCount: getUpcomingScheduleEventsFromTeam(team, { limit: 99 }).length,
      achievementCount: achievementCountByTeam.get(id) ?? 0,
      completionPercent: builderCompletionPercent(team),
    });
  }

  for (const id of teamIds) {
    if (!summaries.has(id)) {
      summaries.set(id, {
        memberCount: memberCountByTeam.get(id) ?? 0,
        upcomingEventCount: 0,
        achievementCount: achievementCountByTeam.get(id) ?? 0,
        completionPercent: 0,
      });
    }
  }

  return summaries;
}
