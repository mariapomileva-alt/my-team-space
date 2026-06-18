import { TeamStep2Client } from "../team-step2-client";
import { loadTeamAdminContext } from "@/lib/admin/load-team-admin-context";
import Link from "next/link";
import { Suspense } from "react";

type Props = { params: Promise<{ teamId: string }> };

export const dynamic = "force-dynamic";

export default async function TeamBuildPage({ params }: Props) {
  const { teamId } = await params;

  try {
    const ctx = await loadTeamAdminContext(teamId);
    return (
      <Suspense fallback={<div className="p-8 text-sm text-zinc-500">Loading builder…</div>}>
        <TeamStep2Client
          teamId={ctx.teamId}
          initialTeam={ctx.team}
          publicUrl={ctx.publicUrl}
          memberRole={ctx.memberRole}
          billing={ctx.billing}
          embedded
        />
      </Suspense>
    );
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e) throw e;
    console.error("[TeamBuildPage]", e);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f8] px-6 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Could not load builder</h1>
        <Link
          href={`/admin/team/${teamId}`}
          className="mt-6 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }
}
