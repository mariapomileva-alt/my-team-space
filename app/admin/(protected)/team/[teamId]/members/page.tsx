import { TeamMembersClient } from "@/components/admin/team-members-client";
import { loadTeamAdminContext } from "@/lib/admin/load-team-admin-context";

type Props = { params: Promise<{ teamId: string }> };

export const dynamic = "force-dynamic";

export default async function TeamMembersPage({ params }: Props) {
  const { teamId } = await params;
  const ctx = await loadTeamAdminContext(teamId);
  return <TeamMembersClient teamId={ctx.teamId} team={ctx.team} memberCount={ctx.stats.memberCount} showAcademyHub={ctx.showAcademyHub} />;
}
