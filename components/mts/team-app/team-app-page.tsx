"use client";

import { renderBlock } from "@/components/blocks/registry";
import { TeamAppDetailSheet } from "@/components/mts/team-app/team-app-detail-sheet";
import { TeamAppHeader } from "@/components/mts/team-app/team-app-header";
import { TeamAppModuleGrid } from "@/components/mts/team-app/team-app-module-grid";
import { APP_CHROME_BLOCK_TYPES } from "@/lib/blocks/block-app-meta";
import { filterBlocksForPublicDisplay } from "@/lib/blocks/public-block-visibility";
import { resolveResultsBoardSettings } from "@/lib/blocks/results-board";
import { filterBlocksForViewer } from "@/lib/team-access";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { motion } from "framer-motion";
import { useMemo, useState, type ReactNode } from "react";

function sortBlocks(blocks: BlockInstance[]) {
  return [...blocks].sort((a, b) => a.order - b.order);
}

export function TeamAppPage({
  team,
  hasAccess = true,
  saasExtras,
  previewBlockId: _previewBlockId,
}: {
  team: TeamSpace;
  hasAccess?: boolean;
  saasExtras?: ReactNode;
  /** Builder: highlight this block in live preview */
  previewBlockId?: string | null;
}) {
  const hideNames = Boolean(team.pageSettings?.hideChildNames) && !hasAccess;
  const [openBlockId, setOpenBlockId] = useState<string | null>(null);

  const enabled = useMemo(
    () =>
      sortBlocks(
        filterBlocksForPublicDisplay(
          team,
          filterBlocksForViewer(team, team.blocks, hasAccess).filter((b) => b.enabled),
        ),
      ),
    [team, hasAccess],
  );

  const chrome = enabled.filter((b) => APP_CHROME_BLOCK_TYPES.has(b.type));
  const gridBlocks = enabled.filter((b) => !APP_CHROME_BLOCK_TYPES.has(b.type));
  const hasHero = chrome.some((b) => b.type === "hero");
  const openBlock = gridBlocks.find((b) => b.id === openBlockId) ?? null;

  const detailMeta =
    openBlock?.type === "results"
      ? {
          title:
            resolveResultsBoardSettings(openBlock).blockTitle?.trim() || "Results board",
        }
      : undefined;

  return (
    <motion.div className="team-app-page" initial={false}>
      {!hasHero ? (
        <div className="mb-4">
          <TeamAppHeader team={team} />
        </div>
      ) : null}

      <motion.div className="team-app-chrome-stack w-full min-w-0 space-y-3">
        {chrome.map((block) => (
          <div
            key={block.id}
            className="team-app-chrome"
            data-preview-block-id={block.id}
          >
            {renderBlock(team, block, { hideChildNames: hideNames })}
          </div>
        ))}
      </motion.div>

      {gridBlocks.length > 0 ? (
        <TeamAppModuleGrid
          team={team}
          blocks={gridBlocks}
          onOpenDetail={setOpenBlockId}
        />
      ) : null}

      {saasExtras ? <div className="mt-1">{saasExtras}</div> : null}

      <TeamAppDetailSheet
        block={openBlock}
        open={Boolean(openBlock)}
        onClose={() => setOpenBlockId(null)}
        metaOverride={detailMeta}
      >
        {openBlock
          ? renderBlock(team, openBlock, { hideChildNames: hideNames, embedded: true })
          : null}
      </TeamAppDetailSheet>
    </motion.div>
  );
}
