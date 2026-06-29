import { redirect } from "next/navigation";
import { teamBuildPath } from "@/lib/admin/admin-nav";

type Props = { params: Promise<{ teamId: string }> };

export const dynamic = "force-dynamic";

/** Per-team dashboard removed — build-first for all coaches and assistants. */
export default async function TeamDashboardPage({ params }: Props) {
  const { teamId } = await params;
  redirect(teamBuildPath(teamId));
}
