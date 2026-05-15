import { createServerSupabase } from "@/lib/supabase/server";

/** True when the current session user is a member (coach) of the team. */
export async function isCurrentUserTeamCoach(teamId: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("team_id", teamId)
      .eq("user_id", user.id)
      .maybeSingle();

    return !error && !!data;
  } catch {
    return false;
  }
}
