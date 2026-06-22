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
  index = 0,
  onOpenDetail,
}: {
  team: TeamSpace;
  block: BlockInstance;
  index?: number;
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.18), duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("team-module-card", moduleLevelClass(level))}
      data-preview-block-id={block.id}
    >
      <header className="team-module-card__head">
        <span className="team-module-card__icon" aria-hidden>
          {meta.emoji}
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
