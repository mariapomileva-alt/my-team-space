"use client";

import { TeamShareBar } from "@/components/builder/team-share-bar";
import { TeamLogoProgressRing } from "@/components/builder/team-logo-progress-ring";
import { builderCompletionPercent } from "@/lib/builder/page-completion";
import type { TeamSpace } from "@/lib/types";
import type { ReactNode } from "react";
import { BUILDER_TOOLBAR_SURFACE } from "@/lib/builder/layout";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { useState } from "react";

export function BuilderToolbar({
  team,
  saveLabel,
  saveState,
  saveError,
  pending,
  publicUrl,
  parentShareUrl,
  shareHint,
  progress,
  billingStatus,
  editLocked = false,
  canPublish = true,
  compact = false,
  onPublish,
  onPreview,
}: {
  team: TeamSpace;
  saveLabel: string;
  saveState: "idle" | "saving" | "saved" | "error";
  saveError?: string | null;
  pending: boolean;
  publicUrl: string;
  parentShareUrl: string;
  shareHint?: string;
  progress?: ReactNode;
  billingStatus?: ReactNode;
  editLocked?: boolean;
  canPublish?: boolean;
  /** Slim toolbar — progress strip only, share tucked away */
  compact?: boolean;
  onPublish: () => void;
  onPreview: () => void;
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const percent = builderCompletionPercent(team);
  const publishLabel = team.publishStatus === "published" ? "Published" : "Draft";
  const autosaveLabel =
    saveState === "saving" ? "Saving…" : saveState === "error" ? "Save issue" : "Autosaved";
  const statusLine = saveError
    ? saveError.length > 72
      ? `${saveError.slice(0, 69)}…`
      : saveError
    : `${publishLabel} · ${autosaveLabel}`;

  return (
    <header className="sticky top-2 z-40 mb-3 w-full lg:top-3">
      <div
        className={cn(
          BUILDER_TOOLBAR_SURFACE,
          "flex-col !items-stretch !gap-0 sm:!px-6",
          compact ? "!py-3" : "!py-4",
        )}
      >
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-3.5">
            <TeamLogoProgressRing logoUrl={team.logoUrl} percent={percent} size={56} />
            <div className="min-w-0">
              <h1 className="truncate text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
                {team.name || "Your team"}
              </h1>
              {!compact ? (
                <p className="mt-0.5 text-[13px] font-semibold text-violet-700">{percent}% Ready</p>
              ) : null}
              <p
                className={cn(
                  "mt-0.5 min-h-[1rem] text-[11px] leading-snug",
                  saveError ? "text-red-600" : "text-zinc-500",
                )}
                title={saveError ?? undefined}
              >
                {statusLine}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onPreview}
              className="rounded-full border border-zinc-200/70 bg-white px-3.5 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.98]"
            >
              Preview
            </button>
            {compact ? (
              <button
                type="button"
                onClick={() => setShareOpen((v) => !v)}
                className="rounded-full border border-zinc-200/70 bg-white px-3.5 py-2 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50"
              >
                Share
              </button>
            ) : (
              <Link
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-full border border-zinc-200/70 bg-white px-3.5 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50 sm:inline-flex"
              >
                Open page
              </Link>
            )}
            {canPublish ? (
              <button
                type="button"
                disabled={pending || editLocked}
                title={
                  editLocked
                    ? "Update billing or choose your active team to publish"
                    : saveLabel.includes("Publishing locked") || saveLabel.includes("required")
                      ? saveLabel
                      : undefined
                }
                onClick={onPublish}
                className="rounded-full bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_4px_16px_-6px_rgba(124,58,237,0.45)] transition hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending ? "Publishing…" : editLocked ? "Locked" : "Publish"}
              </button>
            ) : null}
          </div>
        </div>

        {progress ? (
          <div className={cn("w-full border-t border-zinc-100/80", compact ? "mt-3 pt-3" : "mt-4 pt-4")}>
            {progress}
          </div>
        ) : null}
        {compact ? (
          shareOpen ? (
            <div className="mt-3 w-full border-t border-zinc-100/80 pt-3">
              <TeamShareBar url={parentShareUrl} hint={shareHint} />
            </div>
          ) : null
        ) : (
          <div className="mt-4 w-full border-t border-zinc-100/80 pt-4">
            <TeamShareBar url={parentShareUrl} hint={shareHint} />
          </div>
        )}
        {billingStatus ? (
          <div className="mt-3 w-full border-t border-zinc-100/60 pt-3">{billingStatus}</div>
        ) : null}
      </div>
    </header>
  );
}
