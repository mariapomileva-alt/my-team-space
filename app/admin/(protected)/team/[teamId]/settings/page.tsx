import { TeamSettingsClient } from "@/components/admin/team-settings-client";
import { loadTeamAdminContext } from "@/lib/admin/load-team-admin-context";

type Props = { params: Promise<{ teamId: string }> };

export const dynamic = "force-dynamic";

export default async function TeamSettingsPage({ params }: Props) {
  const { teamId } = await params;
  const ctx = await loadTeamAdminContext(teamId);
  return (
    <TeamSettingsClient teamId={ctx.teamId} team={ctx.team} publicUrl={ctx.publicUrl} />
  );
}
