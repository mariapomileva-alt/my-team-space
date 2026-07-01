"use client";

import { BuilderSectionIcon } from "@/components/builder/builder-section-icon";
import { BLOCK_APP_META } from "@/lib/blocks/block-app-meta";
import {
  iconPresentationForStyle,
  resolveBlockTileClass,
  resolveDesignStyle,
  type TeamPageDesignStyle,
} from "@/lib/team-page-styles";
import type { BlockType, TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function BlockIconTile({
  blockType,
  team,
  style: styleOverride,
  className,
}: {
  blockType: BlockType;
  team?: Pick<TeamSpace, "pageSettings" | "themeId">;
  style?: TeamPageDesignStyle;
  className?: string;
}) {
  const meta = BLOCK_APP_META[blockType];
  const style = styleOverride ?? resolveDesignStyle(team?.pageSettings, team?.themeId);
  const presentation = iconPresentationForStyle(style);
  const tileClass = resolveBlockTileClass(blockType, style);

  return (
    <span className={cn("team-module-card__icon", tileClass, className)} aria-hidden>
      {presentation === "svg" ? (
        <BuilderSectionIcon
          blockType={blockType}
          size="md"
          className={cn(
            "team-module-card__icon-svg",
            style === "premium" && "team-module-card__icon-svg--premium",
            style === "performance" && "team-module-card__icon-svg--performance",
          )}
        />
      ) : (
        <span className="team-module-card__icon-glyph">{meta.emoji}</span>
      )}
    </span>
  );
}
