"use client";

import { BuilderFullPreviewModal } from "@/components/builder/builder-full-preview-modal";
import { BuilderPreviewSegment } from "@/components/builder/builder-preview-segment";
import { BuilderPreviewViewport } from "@/components/builder/builder-preview-viewport";
import {
  readStoredPreviewMode,
  storePreviewMode,
  type BuilderPreviewMode,
} from "@/lib/builder/preview";
import type { TeamSpace } from "@/lib/types";
import { useEffect, useState } from "react";

export function BuilderLivePreview({
  team,
  focusBlockId,
  onOpenInTab,
}: {
  team: TeamSpace;
  focusBlockId?: string | null;
  onOpenInTab?: () => void;
}) {
  const [mode, setMode] = useState<BuilderPreviewMode>("mobile");
  const [fullOpen, setFullOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setMode(readStoredPreviewMode());
    setHydrated(true);
  }, []);

  function changeMode(next: BuilderPreviewMode) {
    setMode(next);
    storePreviewMode(next);
  }

  return (
    <div className="builder-live-preview flex w-full flex-col">
      <div className="mb-2.5 w-full">
        <BuilderPreviewSegment mode={mode} onChange={changeMode} />
      </div>

      <div
        className="min-h-[200px] w-full transition-opacity duration-200"
        style={{ opacity: hydrated ? 1 : 0.6 }}
      >
        <BuilderPreviewViewport team={team} mode={mode} focusBlockId={focusBlockId} />
      </div>

      {onOpenInTab ? (
        <button
          type="button"
          onClick={() => setFullOpen(true)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-200/90 bg-white py-2 text-[11px] font-semibold text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900"
        >
          <span aria-hidden>🔍</span>
          Open full preview
        </button>
      ) : null}

      {onOpenInTab ? (
        <BuilderFullPreviewModal
          open={fullOpen}
          onClose={() => setFullOpen(false)}
          team={team}
          mode={mode}
          onModeChange={changeMode}
          focusBlockId={focusBlockId}
          onOpenInTab={onOpenInTab}
        />
      ) : null}
    </div>
  );
}
