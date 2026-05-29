"use client";

import { PrivacyAccessContent } from "@/components/builder/privacy-access-panel";
import { BuilderCollapsiblePanel } from "@/components/builder/builder-collapsible-panel";
import { BUILDER_PANEL_SURFACE } from "@/lib/builder/layout";
import type { TeamMemberRole } from "@/lib/team-admin";
import type { TeamSpace, TeamVisibility } from "@/lib/types";

const VISIBILITY_LABELS: Record<TeamVisibility, string> = {
  public: "Public",
  private: "Private",
  mixed: "Mixed",
};

export function AdvancedSettingsPanel({
  team,
  teamId,
  siteUrl,
  memberRole,
  onPatchTeam,
}: {
  team: TeamSpace;
  teamId: string;
  siteUrl: string;
  memberRole: TeamMemberRole;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
}) {
  const visibility = team.pageVisibility ?? "public";

  return (
    <BuilderCollapsiblePanel
      className={`${BUILDER_PANEL_SURFACE} border-zinc-200/70 bg-zinc-50/50`}
      title="Advanced settings"
      description="Privacy, admins, GDPR & access — most coaches never need this."
      summary={
        <span className="rounded-full bg-zinc-200/80 px-2 py-0.5 text-[11px] font-semibold text-zinc-600">
          {VISIBILITY_LABELS[visibility]}
        </span>
      }
      defaultExpanded={false}
    >
      <PrivacyAccessContent
        team={team}
        teamId={teamId}
        siteUrl={siteUrl}
        memberRole={memberRole}
        onPatchTeam={onPatchTeam}
      />
    </BuilderCollapsiblePanel>
  );
}
