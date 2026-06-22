"use client";

import { AdvancedSettingsPanel } from "@/components/builder/advanced-settings-panel";
import { TeamAdminShell } from "@/components/admin/team-admin-shell";
import { saveTeamContent } from "@/app/admin/(protected)/team/[teamId]/server-actions";
import { ADMIN_CARD, ADMIN_CARD_PAD, ADMIN_SECTION_GAP, ADMIN_SUBTITLE, ADMIN_TITLE } from "@/lib/admin/admin-layout";
import { siteOriginFromPublicTeamUrl } from "@/lib/teams/public-url";
import type { TeamMemberRole } from "@/lib/team-admin";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useCallback, useEffect, useRef, useState } from "react";

export function TeamSettingsClient({
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
  const [team, setTeam] = useState(initialTeam);
  const dirtyRef = useRef(false);
  const siteUrl = siteOriginFromPublicTeamUrl(publicUrl);
  const visibility = team.pageVisibility ?? "public";

  const patchTeam = useCallback((patch: Partial<TeamSpace>) => {
    dirtyRef.current = true;
    setTeam((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (!dirtyRef.current) return;
    const t = window.setTimeout(() => {
      void saveTeamContent(teamId, team).then(() => {
        dirtyRef.current = false;
      });
    }, 2000);
    return () => window.clearTimeout(t);
  }, [team, teamId]);

  return (
    <TeamAdminShell teamId={teamId} team={team} activeNav="settings">
      <div className={ADMIN_SECTION_GAP}>
        <header>
          <h1 className={ADMIN_TITLE}>Settings</h1>
          <p className={ADMIN_SUBTITLE}>Privacy, access and how families reach your team page.</p>
        </header>

        <section className={cn(ADMIN_CARD, ADMIN_CARD_PAD, "space-y-6")}>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Page link</p>
            <p className="mt-1 text-[11px] text-zinc-500">This is the link you will send to parents.</p>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block truncate font-mono text-sm text-violet-700 underline-offset-2 hover:underline"
            >
              {publicUrl}
            </a>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Visibility</p>
            <p className="mt-2 text-sm font-medium capitalize text-zinc-800">{visibility}</p>
          </div>
        </section>

        <AdvancedSettingsPanel
          team={team}
          teamId={teamId}
          siteUrl={siteUrl}
          memberRole={memberRole}
          onPatchTeam={patchTeam}
        />
      </div>
    </TeamAdminShell>
  );
}
