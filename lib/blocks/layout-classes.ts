import type { BlockLayout } from "@/lib/types";

/** Tailwind wrapper for public page block width / emphasis */
export function blockLayoutClass(layout: BlockLayout | undefined): string {
  switch (layout) {
    case "half":
      return "sm:max-w-[min(100%,28rem)]";
    case "card":
      return "";
    case "featured":
      return "sm:scale-[1.01]";
    case "full":
    default:
      return "w-full";
  }
}
