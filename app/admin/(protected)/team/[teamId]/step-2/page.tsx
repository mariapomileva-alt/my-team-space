import { TeamStep2Client } from "../team-step2-client";
import { loadBuilderBillingContext, type BuilderBillingContext } from "@/lib/billing/builder-context";
import { requireAuth } from "@/lib/auth/require-auth";
import { mapTeamRowToTeamSpace, publicLogoUrlFromPath, type TeamDbRow } from "@/lib/teams/map-row";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ teamId: string }> };

export const dynamic = "force-dynamic";

export default async function TeamStep2Page({ params }: Props) {
  const { teamId } = await params;
  const { supabase, user } = await requireAuth();

  const { data: mem } = await supabase
    .from("team_members")
    .select("team_id, role")
    .eq("team_id", teamId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!mem) notFound();
  const memberRole = (mem.role === "assistant" ? "assistant" : "coach") as "coach" | "assistant";

  const { data: teamRow } = await supabase.from("teams").select("*").eq("id", teamId).single();
  if (!teamRow) notFound();

  const team = teamRow as TeamDbRow;
  const teamSpace = mapTeamRowToTeamSpace(team, publicLogoUrlFromPath(team.logo_path));

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const publicUrl = `${proto}://${host}/team/${team.slug}`;

  let billing: BuilderBillingContext | null = null;
  if (memberRole === "coach") {
    try {
      billing = await loadBuilderBillingContext(supabase, user.id, teamId, team);
    } catch (e) {
      console.error("[TeamStep2Page] billing:", e);
      billing = {
        planLabel: "Single Team Plan",
        teamsUsed: 1,
        teamLimit: 1,
        billingActive: true,
        hasLemonSubscription: false,
        canEdit: true,
        lockReason: "none" as const,
        showUpgradeCta: false,
        publishStatus: (team.publish_status === "published" ? "published" : "draft") as
          | "draft"
          | "published",
      };
    }
  }

  return (
    <TeamStep2Client
      teamId={teamId}
      initialTeam={teamSpace}
      publicUrl={publicUrl}
      memberRole={memberRole}
      billing={billing}
    />
  );
}
