"use client";

import {
  hasPublicBlockContent,
} from "@/components/mts/team-app/public-block-preview";
import { TeamModuleCard } from "@/components/mts/team-app/team-module-card";
import {
  publicCardGridItemClass,
  resolveCompactDensity,
} from "@/lib/blocks/public-card-layout";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { useMemo } from "react";

export function TeamAppModuleGrid({
  team,
  blocks,
  onOpenDetail,
}: {
  team: TeamSpace;
  blocks: BlockInstance[];
  onOpenDetail?: (blockId: string) => void;
}) {
  const visibleBlocks = useMemo(
    () => blocks.filter((block) => hasPublicBlockContent(team, block)),
    [team, blocks],
  );

  if (visibleBlocks.length === 0) return null;

  const density = resolveCompactDensity(team.pageSettings);

  return (
    <div
      className={cn(
        "team-module-grid mt-7 md:mt-9",
        density === "double" && "team-module-grid--double",
      )}
    >
      {visibleBlocks.map((block, i) => (
        <div
          key={block.id}
          className={cn("team-module-grid__item", publicCardGridItemClass(block, density))}
        >
          <TeamModuleCard
            team={team}
            block={block}
            index={i}
            onOpenDetail={onOpenDetail}
          />
        </div>
      ))}
    </div>
  );
}
