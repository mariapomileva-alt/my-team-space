import { TeamCalendarClient } from "@/components/admin/team-calendar-client";
import { loadTeamAdminContext } from "@/lib/admin/load-team-admin-context";

type Props = { params: Promise<{ teamId: string }> };

export const dynamic = "force-dynamic";

export default async function TeamCalendarPage({ params }: Props) {
  const { teamId } = await params;
  const ctx = await loadTeamAdminContext(teamId);
  return (
    <TeamCalendarClient teamId={ctx.teamId} team={ctx.team} events={ctx.stats.upcomingEvents} showAcademyHub={ctx.showAcademyHub} />
  );
}
