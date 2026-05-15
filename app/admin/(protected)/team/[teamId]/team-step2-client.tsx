"use client";

import { TeamPageBuilder } from "@/components/builder/team-page-builder";
import type { TeamSpace } from "@/lib/types";

export function TeamStep2Client({
  teamId,
  initialTeam,
  publicUrl,
}: {
  teamId: string;
  initialTeam: TeamSpace;
  publicUrl: string;
}) {
  return <TeamPageBuilder teamId={teamId} initialTeam={initialTeam} publicUrl={publicUrl} />;
}
