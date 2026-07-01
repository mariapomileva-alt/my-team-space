import { TeamGuideClient } from "@/components/builder/team-guide-client";
import { loadTeamAdminContext } from "@/lib/admin/load-team-admin-context";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ teamId: string }> };

export default async function TeamGuidePage({ params }: Props) {
  const { teamId } = await params;

  try {
    const ctx = await loadTeamAdminContext(teamId);
    return (
      <TeamGuideClient
        teamId={ctx.teamId}
        teamName={ctx.team.name}
        showAcademyHub={ctx.showAcademyHub}
      />
    );
  } catch (e) {
    const digest =
      e && typeof e === "object" && "digest" in e
        ? String((e as { digest?: string }).digest ?? "")
        : "";
    if (digest.startsWith("NEXT_REDIRECT")) throw e;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-xl font-bold text-zinc-900">Could not load guide</h1>
        <Link href="/admin?hub=1" className="mt-6 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white">
          Go to dashboard
        </Link>
      </div>
    );
  }
}
