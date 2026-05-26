"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function BuilderToolbar({
  teamName,
  saveLabel,
  saveState,
  pending,
  publicUrl,
  onPublish,
  onPreview,
}: {
  teamName: string;
  saveLabel: string;
  saveState: "idle" | "saving" | "saved" | "error";
  pending: boolean;
  publicUrl: string;
  onPublish: () => void;
  onPreview: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-3 z-50 mb-6 w-full"
    >
      <motion.div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-white/60 bg-white/75 px-4 py-3 shadow-[0_8px_40px_-12px_rgba(99,102,241,0.25),0_0_0_1px_rgba(255,255,255,0.8)_inset] backdrop-blur-xl sm:px-5">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-600">Building your team app</p>
          <h1 className="truncate text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">{teamName}</h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-500">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                saveState === "saving"
                  ? "animate-pulse bg-amber-400"
                  : saveState === "error"
                    ? "bg-red-500"
                    : "bg-emerald-500"
              }`}
              aria-hidden
            />
            {saveLabel}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPreview}
            className="rounded-full border border-zinc-200/90 bg-white/90 px-3.5 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:scale-[0.98]"
          >
            Preview
          </button>
          <Link
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full border border-zinc-200/90 bg-white/90 px-3.5 py-2 text-xs font-semibold text-zinc-600 sm:inline-flex"
          >
            Open page
          </Link>
          <button
            type="button"
            disabled={pending}
            onClick={onPublish}
            className="rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-[0_6px_24px_-6px_rgba(99,102,241,0.55)] transition hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? "Publishing…" : "Publish ✦"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
