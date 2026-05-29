import type { SupabaseClient } from "@supabase/supabase-js";

export type CoachTeamListItem = {
  id: string;
  slug: string;
  name: string;
  subscription_status: string;
  team_id: string;
  role: string;
};

export async function loadCoachTeams(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ list: CoachTeamListItem[]; error: string | null }> {
  const { data: memberships, error: memError } = await supabase
    .from("team_members")
    .select("team_id, role")
    .eq("user_id", userId);

  if (memError) {
    return { list: [], error: memError.message };
  }

  if (!memberships?.length) {
    return { list: [], error: null };
  }

  const teamIds = memberships.map((m) => m.team_id as string);
  const roleByTeam = new Map(memberships.map((m) => [m.team_id as string, (m.role as string) ?? "coach"]));

  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("id, slug, name, subscription_status")
    .in("id", teamIds);

  if (teamsError) {
    return { list: [], error: teamsError.message };
  }

  const list: CoachTeamListItem[] = (teams ?? []).map((t) => ({
    id: t.id as string,
    slug: t.slug as string,
    name: t.name as string,
    subscription_status: (t.subscription_status as string) ?? "inactive",
    team_id: t.id as string,
    role: roleByTeam.get(t.id as string) ?? "coach",
  }));

  return { list, error: null };
}
