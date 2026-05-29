"use client";

import { TeamPageBuilder } from "@/components/builder/team-page-builder";
import type { TeamMemberRole } from "@/lib/team-admin";
import type { TeamSpace } from "@/lib/types";

export function TeamStep2Client({
  teamId,
  initialTeam,
  publicUrl,
  memberRole,
}: {
  teamId: string;
  initialTeam: TeamSpace;
  publicUrl: string;
  memberRole: TeamMemberRole;
}) {
  return (
    <TeamPageBuilder
      teamId={teamId}
      initialTeam={initialTeam}
      publicUrl={publicUrl}
      memberRole={memberRole}
    />
  );
}
