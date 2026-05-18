import { TeamAppPage } from "@/components/mts/team-app/team-app-page";
import type { TeamSpace } from "@/lib/types";
import type { ReactNode } from "react";

export function TeamPageBlocks({
  team,
  hasAccess = true,
  saasExtras,
}: {
  team: TeamSpace;
  hasAccess?: boolean;
  saasExtras?: ReactNode;
}) {
  return <TeamAppPage team={team} hasAccess={hasAccess} saasExtras={saasExtras} />;
}
