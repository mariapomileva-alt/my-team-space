"use client";

import { TeamShareBar } from "@/components/builder/team-share-bar";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function PublishShareModal({
  open,
  onClose,
  shareUrl,
  publicUrl,
}: {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
  publicUrl: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="publish-share-title"
            className={cn(
              "fixed inset-x-4 top-[12%] z-[210] mx-auto max-w-md rounded-3xl border border-zinc-200/80 bg-white p-6 shadow-2xl",
              "sm:inset-x-auto sm:left-1/2 sm:w-full sm:-translate-x-1/2",
            )}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
          >
            <h2 id="publish-share-title" className="text-xl font-bold tracking-tight text-zinc-900">
              Your team page is live 🎉
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Parents can now view your page. No login required for parents.
            </p>
            <div className="mt-5">
              <TeamShareBar url={shareUrl} hint="This is your public team link." />
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
              >
                View live page
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Keep editing
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
