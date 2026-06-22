"use client";

import { pageLiveStatus } from "@/lib/builder/page-status";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export function BuilderMobileActionBar({
  team,
  pending,
  publishBlockedByBilling,
  readinessCanPublish,
  canPublish,
  onPreview,
  onPublish,
  onShare,
  onViewLive,
}: {
  team: TeamSpace;
  pending: boolean;
  publishBlockedByBilling: boolean;
  readinessCanPublish: boolean;
  canPublish: boolean;
  onPreview: () => void;
  onPublish: () => void;
  onShare: () => void;
  onViewLive: () => void;
}) {
  const isLive = pageLiveStatus(team) === "live";

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200/80 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-lg gap-2">
        {isLive ? (
          <>
            <button
              type="button"
              onClick={onViewLive}
              className="flex-1 rounded-full border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-800"
            >
              View live page
            </button>
            <button
              type="button"
              onClick={onShare}
              className="flex-1 rounded-full bg-violet-600 py-3 text-sm font-semibold text-white shadow-sm"
            >
              Share with parents
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onPreview}
              className="flex-1 rounded-full border border-zinc-200 bg-white py-3 text-sm font-semibold text-zinc-800"
            >
              Preview
            </button>
            {canPublish ? (
              <button
                type="button"
                disabled={pending || !readinessCanPublish || publishBlockedByBilling}
                onClick={onPublish}
                className={cn(
                  "flex-1 rounded-full bg-violet-600 py-3 text-sm font-semibold text-white shadow-sm",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                {pending ? "Publishing…" : "Publish page"}
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
