import { blockLayoutClass } from "@/lib/blocks/layout-classes";
import type { TeamSpace } from "@/lib/types";
import { renderBlock } from "@/components/blocks/registry";

export function TeamPageBlocks({ team }: { team: TeamSpace }) {
  const sorted = [...team.blocks].filter((b) => b.enabled).sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 pb-24 pt-6 sm:px-6">
      {sorted.map((block) => (
        <div key={block.id} className={blockLayoutClass(block.layout)}>
          {renderBlock(team, block)}
        </div>
      ))}
    </div>
  );
}
