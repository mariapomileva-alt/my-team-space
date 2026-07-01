"use client";

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
      {presentation === "mark" || presentation === "mixed" ? (
        <span className="team-module-card__icon-mark">{meta.mark}</span>
      ) : null}
      {presentation === "emoji" || presentation === "mixed" ? (
        <span className="team-module-card__icon-glyph">{meta.emoji}</span>
      ) : null}
    </span>
  );
}
