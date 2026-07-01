"use client";

import {
  PublicBlockPreview,
  hasPublicBlockContent,
  usePublicPreviewStats,
} from "@/components/mts/team-app/public-block-preview";
import { BLOCK_APP_META } from "@/lib/blocks/block-app-meta";
import { contentLevelForInstance } from "@/lib/blocks/content-hierarchy";
import {
  moduleLevelClass,
  publicCardFooterLabel,
  publicCardNeedsDetail,
} from "@/lib/blocks/public-card-layout";
import { resolveResultsBoardSettings } from "@/lib/blocks/results-board";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

function cardTitle(block: BlockInstance): string {
  if (block.type === "results") {
    return resolveResultsBoardSettings(block).blockTitle?.trim() || BLOCK_APP_META.results.title;
  }
  return BLOCK_APP_META[block.type].title;
}

export function TeamModuleCard({
  team,
  block,
  onOpenDetail,
}: {
  team: TeamSpace;
  block: BlockInstance;
  onOpenDetail?: (blockId: string) => void;
}) {
  const meta = BLOCK_APP_META[block.type];
  const level = contentLevelForInstance(block);
  const stats = usePublicPreviewStats(team, block);
  const hasContent = hasPublicBlockContent(team, block);
  const showDetail = publicCardNeedsDetail(block, stats) && Boolean(onOpenDetail);

  if (!hasContent) return null;

  return (
    <motion.article
      initial={false}
      className={cn("team-module-card w-full min-w-0", moduleLevelClass(level))}
      data-preview-block-id={block.id}
    >
      <header className="team-module-card__head">
        <span className={cn("team-module-card__icon", meta.tileClass)} aria-hidden>
          <span className="team-module-card__icon-glyph">{meta.emoji}</span>
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="team-module-card__title">{cardTitle(block)}</h2>
          <p className="team-module-card__subtitle">{meta.subtitle}</p>
        </div>
      </header>
      <div className="team-module-card__body">
        <PublicBlockPreview team={team} block={block} />
      </div>
      {showDetail ? (
        <footer className="team-module-card__foot">
          <button
            type="button"
            className="team-module-card__footer-link"
            onClick={() => onOpenDetail?.(block.id)}
          >
            {publicCardFooterLabel(block.type)}
          </button>
        </footer>
      ) : null}
    </motion.article>
  );
}
