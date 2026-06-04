import { createServerSupabase } from "@/lib/supabase/server";

/** True when the current session user is any member of the team (coach or page admin). */
export async function isCurrentUserTeamMember(teamId: string): Promise<boolean> {
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

/** @deprecated Use isCurrentUserTeamMember */
export const isCurrentUserTeamCoach = isCurrentUserTeamMember;
