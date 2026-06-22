"use client";

import { renderBlock } from "@/components/blocks/registry";
import { getResultsBoardSettings } from "@/lib/blocks/results-board";
import { TeamAppDetailSheet } from "@/components/mts/team-app/team-app-detail-sheet";
import { TeamAppHeader } from "@/components/mts/team-app/team-app-header";
import { TeamAppDashboard } from "@/components/mts/team-app/team-app-dashboard";
import { APP_CHROME_BLOCK_TYPES } from "@/lib/blocks/block-app-meta";
import { filterBlocksForPublicDisplay } from "@/lib/blocks/public-block-visibility";
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
  previewBlockId,
}: {
  team: TeamSpace;
  hasAccess?: boolean;
  saasExtras?: ReactNode;
  previewBlockId?: string | null;
}) {
  const [openBlockId, setOpenBlockId] = useState<string | null>(null);
  const hideNames = Boolean(team.pageSettings?.hideChildNames) && !hasAccess;

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
  const openResultsSettings =
    openBlock?.type === "results" ? getResultsBoardSettings(openBlock) : null;
  const detailMeta = openResultsSettings
    ? {
        title: openResultsSettings.blockTitle?.trim() || "Results",
        subtitle: openResultsSettings.seasonName || "Season rankings & memories",
      }
    : undefined;

  return (
    <motion.div
      className="team-app-page mx-auto w-full max-w-lg px-4 pb-28 pt-3 sm:max-w-2xl md:max-w-3xl md:px-6 md:pt-5"
      initial={false}
    >
      {!hasHero ? (
        <div className="mb-4">
          <TeamAppHeader team={team} />
        </div>
      ) : null}

      <motion.div className="space-y-3">
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
        <TeamAppDashboard
          team={team}
          blocks={gridBlocks}
          onOpenBlock={setOpenBlockId}
          previewBlockId={previewBlockId}
        />
      ) : null}

      {saasExtras ? <div className="mt-1">{saasExtras}</div> : null}

      <TeamAppDetailSheet
        block={openBlock}
        open={Boolean(openBlock)}
        onClose={() => setOpenBlockId(null)}
        metaOverride={detailMeta}
      >
        {openBlock ? renderBlock(team, openBlock, { hideChildNames: hideNames, embedded: true }) : null}
      </TeamAppDetailSheet>
    </motion.div>
  );
}
