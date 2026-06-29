import { TeamResultsClient } from "@/components/admin/team-results-client";
import { loadTeamAdminContext } from "@/lib/admin/load-team-admin-context";

type Props = { params: Promise<{ teamId: string }> };

export const dynamic = "force-dynamic";

export default async function TeamResultsPage({ params }: Props) {
  const { teamId } = await params;
  const ctx = await loadTeamAdminContext(teamId);
  return (
    <TeamResultsClient
      teamId={ctx.teamId}
      team={ctx.team}
      publicUrl={ctx.publicUrl}
      achievementCount={ctx.stats.achievementCount}
      showAcademyHub={ctx.showAcademyHub}
    />
  );
}
