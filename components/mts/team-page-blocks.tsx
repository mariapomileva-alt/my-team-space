import { blockLayoutClass } from "@/lib/blocks/layout-classes";
import { filterBlocksForViewer } from "@/lib/team-access";
import type { TeamSpace } from "@/lib/types";
import { renderBlock } from "@/components/blocks/registry";

export function TeamPageBlocks({
  team,
  hasAccess = true,
}: {
  team: TeamSpace;
  /** When false, mixed/private blocks are hidden */
  hasAccess?: boolean;
}) {
  const sorted = filterBlocksForViewer(team, team.blocks, hasAccess).sort((a, b) => a.order - b.order);
  const hideNames = Boolean(team.pageSettings?.hideChildNames) && !hasAccess;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 pb-24 pt-6 sm:px-6">
      {sorted.map((block) => (
        <div key={block.id} className={blockLayoutClass(block.layout)}>
          {renderBlock(team, block, { hideChildNames: hideNames })}
        </div>
      ))}
    </div>
  );
}
