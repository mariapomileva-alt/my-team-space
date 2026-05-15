"use client";

import type { BlockPreviewShape } from "@/lib/blocks/meta";

/** Tiny layout hint so coaches see block shape before expanding */
export function BlockShapePreview({ shape }: { shape: BlockPreviewShape }) {
  return (
    <div
      className="flex h-11 w-14 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-gradient-to-br from-white to-indigo-50/80 p-1"
      aria-hidden
    >
      <ShapeInner shape={shape} />
    </div>
  );
}

function ShapeInner({ shape }: { shape: BlockPreviewShape }) {
  switch (shape) {
    case "bar":
      return <div className="h-2 w-full rounded-full bg-indigo-300/80" />;
    case "hero":
      return (
        <div className="flex w-full flex-col gap-0.5">
          <div className="mx-auto h-3 w-3 rounded-full bg-indigo-400" />
          <div className="h-1.5 w-full rounded bg-indigo-200" />
          <div className="h-4 w-full rounded-sm bg-indigo-100" />
        </div>
      );
    case "grid":
      return (
        <div className="grid w-full grid-cols-2 gap-0.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-sm bg-indigo-200/90" />
          ))}
        </div>
      );
    case "list":
      return (
        <div className="flex w-full flex-col gap-0.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-1.5 w-full rounded-full bg-indigo-200" />
          ))}
        </div>
      );
    case "stat":
      return (
        <div className="flex w-full flex-col items-center gap-0.5">
          <div className="text-[10px] font-bold text-indigo-500">92</div>
          <div className="h-1 w-8 rounded-full bg-indigo-200" />
        </div>
      );
    case "links":
      return (
        <div className="grid w-full grid-cols-2 gap-0.5">
          <div className="h-2 rounded-sm bg-indigo-300" />
          <div className="h-2 rounded-sm bg-indigo-200" />
          <div className="col-span-2 h-2 rounded-sm bg-indigo-200" />
        </div>
      );
    case "card":
    default:
      return <div className="h-7 w-full rounded-md border border-indigo-200 bg-white shadow-sm" />;
  }
}
