"use client";

import { TeamAdminShell } from "@/components/admin/team-admin-shell";
import { TeamPageBuilder } from "@/components/builder/team-page-builder";
import type { BuilderBillingContext } from "@/lib/billing/builder-context-types";
import type { TeamMemberRole } from "@/lib/team-admin";
import type { TeamSpace } from "@/lib/types";

export function TeamStep2Client({
  teamId,
  initialTeam,
  publicUrl,
  memberRole,
  billing,
  embedded = false,
  showAcademyHub = false,
}: {
  teamId: string;
  initialTeam: TeamSpace;
  publicUrl: string;
  memberRole: TeamMemberRole;
  billing: BuilderBillingContext | null;
  embedded?: boolean;
  showAcademyHub?: boolean;
}) {
  const builder = (
    <TeamPageBuilder
      teamId={teamId}
      initialTeam={initialTeam}
      publicUrl={publicUrl}
      memberRole={memberRole}
      billing={billing}
      embedded={embedded}
      showAcademyHub={showAcademyHub}
    />
  );

  if (embedded) {
    return (
      <TeamAdminShell
        teamId={teamId}
        team={initialTeam}
        activeNav="build"
        hideSidebar
        showAcademyHub={showAcademyHub}
      >
        {builder}
      </TeamAdminShell>
    );
  }

  return builder;
}
