import { TeamStep1Client } from "../team-step1-client";
import { requireAuth } from "@/lib/auth/require-auth";
import { mapTeamRowToTeamSpace, publicLogoUrlFromPath, type TeamDbRow } from "@/lib/teams/map-row";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ teamId: string }> };

export const dynamic = "force-dynamic";

export default async function TeamStep1Page({ params }: Props) {
  const { teamId } = await params;
  const { supabase, user } = await requireAuth();

  const { data: mem } = await supabase
    .from("team_members")
    .select("team_id")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!mem) notFound();

  const { data: teamRow } = await supabase.from("teams").select("*").eq("id", teamId).single();
  if (!teamRow) notFound();

  const teamSpace = mapTeamRowToTeamSpace(teamRow as TeamDbRow, publicLogoUrlFromPath((teamRow as TeamDbRow).logo_path));

  return <TeamStep1Client teamId={teamId} initialTeam={teamSpace} />;
}
