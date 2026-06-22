"use client";

import { TeamShareBar } from "@/components/builder/team-share-bar";
import { TeamLogoProgressRing } from "@/components/builder/team-logo-progress-ring";
import { builderCompletionPercent } from "@/lib/builder/page-completion";
import {
  pageLiveStatus,
  pageStatusHelperText,
  pageStatusPrimaryLabel,
  pageStatusSecondaryLabel,
} from "@/lib/builder/page-status";
import type { TeamSpace } from "@/lib/types";
import type { ReactNode } from "react";
import { BUILDER_TOOLBAR_SURFACE } from "@/lib/builder/layout";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { useState } from "react";

export function BuilderToolbar({
  team,
  saveState,
  saveError,
  pending,
  publicUrl,
  parentShareUrl,
  progress,
  billingStatus,
  editLocked = false,
  canPublish = true,
  publishBlockedByBilling = false,
  readinessCanPublish = true,
  compact = false,
  onPublish,
  onPreview,
  onShare,
}: {
  team: TeamSpace;
  saveLabel?: string;
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
  publishBlockedByBilling?: boolean;
  readinessCanPublish?: boolean;
  compact?: boolean;
  onPublish: () => void;
  onPreview: () => void;
  onShare: () => void;
}) {
  const [shareOpen, setShareOpen] = useState(false);
  const percent = builderCompletionPercent(team);
  const logoSize = compact ? 44 : 52;
  const isLive = pageLiveStatus(team) === "live";
  const statusPrimary = pageStatusPrimaryLabel(team);
  const statusSecondary = pageStatusSecondaryLabel(saveState);
  const statusHelper = pageLiveStatus(team) === "not_live"
    ? "Parents cannot see this until you publish."
    : pageStatusHelperText(team);

  const statusLine = saveError
    ? saveError.length > 72
      ? `${saveError.slice(0, 69)}…`
      : saveError
    : `${statusPrimary} · ${statusSecondary}`;

  return (
    <header className={cn("sticky z-40 w-full", compact ? "top-1.5 mb-2 lg:top-2" : "top-2 mb-3 lg:top-3")}>
      <div
        className={cn(
          BUILDER_TOOLBAR_SURFACE,
          "flex-col !items-stretch !gap-0",
          compact ? "!px-4 !py-2 sm:!px-5" : "!px-5 !py-3 sm:!px-6",
        )}
      >
        <div className="flex w-full flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <TeamLogoProgressRing logoUrl={team.logoUrl} percent={percent} size={logoSize} />
            <div className="min-w-0">
              <h1
                className={cn(
                  "truncate font-bold tracking-tight text-zinc-900",
                  compact ? "text-sm sm:text-[15px]" : "text-base sm:text-lg",
                )}
              >
                {team.name || "Your team"}
              </h1>
              {!compact ? (
                <p className="mt-0.5 text-[12px] font-semibold text-violet-700">{percent}% ready</p>
              ) : null}
              <p
                className={cn(
                  "min-h-[0.875rem] font-semibold leading-snug",
                  compact ? "mt-0 text-[10px]" : "mt-0.5 text-[11px]",
                  saveError ? "text-red-600" : isLive ? "text-emerald-700" : "text-zinc-600",
                )}
                title={saveError ?? undefined}
              >
                {statusLine}
              </p>
              <p className={cn("text-zinc-500", compact ? "text-[10px]" : "text-[11px]")}>{statusHelper}</p>
              {!saveError && saveState !== "error" ? (
                <p className={cn("text-zinc-400", compact ? "text-[9px]" : "text-[10px]")}>
                  Changes are saved automatically.
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {isLive ? (
              <>
                <Link
                  href={publicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "rounded-full border border-zinc-200/70 bg-white font-medium text-zinc-700 transition hover:bg-zinc-50",
                    compact ? "px-3 py-1.5 text-[11px]" : "px-3.5 py-2 text-xs",
                  )}
                >
                  View live page
                </Link>
                <button
                  type="button"
                  onClick={onShare}
                  className={cn(
                    "rounded-full bg-violet-600 font-semibold text-white shadow-[0_4px_16px_-6px_rgba(124,58,237,0.45)] transition hover:bg-violet-700 active:scale-[0.98]",
                    compact ? "px-3.5 py-1.5 text-[11px]" : "px-4 py-2 text-xs",
                  )}
                >
                  Share with parents
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onPreview}
                  className={cn(
                    "rounded-full border border-zinc-200/70 bg-white font-medium text-zinc-700 transition hover:bg-zinc-50 active:scale-[0.98]",
                    compact ? "px-3 py-1.5 text-[11px]" : "px-3.5 py-2 text-xs",
                  )}
                >
                  Preview
                </button>
                {canPublish ? (
                  <button
                    type="button"
                    disabled={pending || !readinessCanPublish || publishBlockedByBilling}
                    title={
                      publishBlockedByBilling
                        ? "Subscribe to publish for parents"
                        : !readinessCanPublish
                          ? "Add team name and logo first"
                          : undefined
                    }
                    onClick={onPublish}
                    className={cn(
                      "rounded-full bg-violet-600 font-semibold text-white shadow-[0_4px_16px_-6px_rgba(124,58,237,0.45)] transition hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
                      compact ? "px-3.5 py-1.5 text-[11px]" : "px-4 py-2 text-xs",
                    )}
                  >
                    {pending ? "Publishing…" : "Publish page"}
                  </button>
                ) : null}
              </>
            )}
          </div>
        </div>

        {progress ? (
          <div className={cn("w-full border-t border-zinc-100/80", compact ? "mt-2 pt-2" : "mt-3 pt-3")}>
            {progress}
          </div>
        ) : null}

        {isLive && !compact ? (
          <div className="mt-3 w-full border-t border-zinc-100/80 pt-3">
            <TeamShareBar
              url={parentShareUrl}
              hint="Parents do not need an account."
            />
          </div>
        ) : null}

        {compact && isLive ? (
          shareOpen ? (
            <div className="mt-2 w-full border-t border-zinc-100/80 pt-2">
              <TeamShareBar url={parentShareUrl} hint="Parents do not need an account." />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="mt-2 self-start text-[11px] font-semibold text-violet-700"
            >
              Show share link
            </button>
          )
        ) : null}

        {billingStatus ? (
          <div className={cn("w-full border-t border-zinc-100/60", compact ? "mt-2 pt-2" : "mt-3 pt-3")}>
            {billingStatus}
          </div>
        ) : null}
      </div>
    </header>
  );
}
