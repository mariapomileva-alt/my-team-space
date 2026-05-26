import { TeamAppPage } from "@/components/mts/team-app/team-app-page";
import type { TeamSpace } from "@/lib/types";
import type { ReactNode } from "react";

export function TeamPageBlocks({
  team,
  hasAccess = true,
  saasExtras,
  previewBlockId,
}: {
  team: TeamSpace;
  hasAccess?: boolean;
  saasExtras?: ReactNode;
  /** Builder: highlight this block in live preview */
  previewBlockId?: string | null;
}) {
  return (
    <TeamAppPage team={team} hasAccess={hasAccess} saasExtras={saasExtras} previewBlockId={previewBlockId} />
  );
}
