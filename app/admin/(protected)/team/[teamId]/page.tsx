import { TeamDashboardClient } from "@/components/admin/team-dashboard-client";
import { loadTeamAdminContext } from "@/lib/admin/load-team-admin-context";
import Link from "next/link";

type Props = { params: Promise<{ teamId: string }> };

export const dynamic = "force-dynamic";

export default async function TeamDashboardPage({ params }: Props) {
  const { teamId } = await params;

  try {
    const ctx = await loadTeamAdminContext(teamId);
    return (
      <TeamDashboardClient
        teamId={ctx.teamId}
        team={ctx.team}
        publicUrl={ctx.publicUrl}
        stats={ctx.stats}
      />
    );
  } catch (e) {
    console.error("[TeamDashboardPage]", e);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f8] px-6 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Could not load dashboard</h1>
        <Link href="/admin" className="mt-6 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white">
          Back to teams
        </Link>
      </div>
    );
  }
}
