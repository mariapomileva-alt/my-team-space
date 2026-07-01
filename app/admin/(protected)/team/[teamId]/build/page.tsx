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
          showAcademyHub={ctx.showAcademyHub}
        />
      </Suspense>
    );
  } catch (e) {
    const digest =
      e && typeof e === "object" && "digest" in e
        ? String((e as { digest?: string }).digest ?? "")
        : "";
    if (digest.startsWith("NEXT_REDIRECT")) throw e;
    console.error("[TeamBuildPage]", e);
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f8] px-6 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Could not load builder</h1>
        <p className="mt-2 max-w-sm text-sm text-zinc-600">
          {digest.startsWith("NEXT_NOT_FOUND")
            ? "This team page was not found or you no longer have access."
            : "Try again from your dashboard."}
        </p>
        <Link
          href="/admin?hub=1"
          className="mt-6 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }
}
