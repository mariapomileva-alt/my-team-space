import type { BuilderSection } from "@/lib/blocks/meta";
import type { BlockInstance, BlockType } from "@/lib/types";
import { BLOCK_META } from "@/lib/blocks/meta";

export const BUILDER_SECTION_STYLES: Record<
  BuilderSection,
  { gradient: string; border: string; badge: string; emoji: string }
> = {
  essential: {
    gradient: "from-violet-500/[0.06] via-violet-400/[0.03] to-white",
    border: "border-violet-200/50",
    badge: "bg-violet-100 text-violet-800 ring-violet-200/60",
    emoji: "✨",
  },
  engagement: {
    gradient: "from-rose-400/[0.07] via-pink-300/[0.04] to-orange-50/20",
    border: "border-rose-200/50",
    badge: "bg-rose-100 text-rose-800 ring-rose-200/60",
    emoji: "💫",
  },
  advanced: {
    gradient: "from-emerald-400/[0.07] via-teal-300/[0.04] to-white",
    border: "border-emerald-200/50",
    badge: "bg-emerald-100 text-emerald-800 ring-emerald-200/60",
    emoji: "👨‍👩‍👧",
  },
};

/** Masonry-style spans inside section grid */
export function builderCardGridClass(block: BlockInstance): string {
  const layout = block.layout ?? BLOCK_META[block.type]?.defaultLayout ?? "full";
  const type = block.type;

  if (type === "gallery" || type === "hero" || type === "camp_trip") {
    return "sm:col-span-2";
  }
  if (layout === "featured" || layout === "full") {
    return "sm:col-span-2";
  }
  if (layout === "half" || layout === "card") {
    return "sm:col-span-1";
  }
  return "sm:col-span-1";
}

export function builderCardSizeClass(type: BlockType): string {
  if (type === "gallery") return "min-h-[132px]";
  if (type === "hero" || type === "camp_trip") return "min-h-[120px]";
  if (type === "announcement_bar") return "min-h-[100px]";
  return "min-h-[108px]";
}
