"use client";

import { TeamPageBuilder } from "@/components/builder/team-page-builder";
import type { BuilderBillingContext } from "@/lib/billing/builder-context";
import type { TeamMemberRole } from "@/lib/team-admin";
import type { TeamSpace } from "@/lib/types";

export function TeamStep2Client({
  teamId,
  initialTeam,
  publicUrl,
  memberRole,
  billing,
}: {
  teamId: string;
  initialTeam: TeamSpace;
  publicUrl: string;
  memberRole: TeamMemberRole;
  billing: BuilderBillingContext | null;
}) {
  return (
    <TeamPageBuilder
      teamId={teamId}
      initialTeam={initialTeam}
      publicUrl={publicUrl}
      memberRole={memberRole}
      billing={billing}
    />
  );
}
