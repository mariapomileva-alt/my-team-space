"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

export function TeamShareBar({
  url,
  hint,
}: {
  url: string;
  hint?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!qrOpen) return;
    function onPointerDown(e: MouseEvent) {
      if (qrRef.current && !qrRef.current.contains(e.target as Node)) {
        setQrOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [qrOpen]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* fallback: select from readonly input */
    }
  }

  return (
    <div className="w-full border-t border-zinc-100/80 pt-2.5">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 shrink-0 lg:max-w-[11rem]">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Share with parents</p>
          <p className="mt-0.5 hidden text-[10px] leading-snug text-zinc-500 sm:block">Copy link or QR code.</p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row sm:items-center">
          <label className="sr-only" htmlFor="team-parent-link">
            Parent page link
          </label>
          <input
            id="team-parent-link"
            readOnly
            value={url}
            onFocus={(e) => e.target.select()}
            className="min-w-0 flex-1 rounded-xl border border-zinc-200/90 bg-zinc-50/80 px-3 py-2 font-mono text-[11px] text-zinc-700 outline-none ring-indigo-200 focus:bg-white focus:ring-2 sm:text-xs"
          />
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => void copyLink()}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition active:scale-[0.98] ${
                copied
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-violet-600 text-white shadow-[0_4px_14px_-4px_rgba(124,58,237,0.35)] hover:bg-violet-700"
              }`}
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
            <div className="relative" ref={qrRef}>
              <button
                type="button"
                onClick={() => setQrOpen((v) => !v)}
                aria-expanded={qrOpen}
                className="rounded-full border border-zinc-200/90 bg-white px-4 py-2 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 active:scale-[0.98]"
              >
                QR code
              </button>
              {qrOpen ? (
                <div className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,240px)] rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-[0_16px_48px_-12px_rgba(15,23,42,0.2)] ring-1 ring-zinc-100">
                  <p className="mb-3 text-center text-[11px] font-semibold text-zinc-600">Scan to open team page</p>
                  <div className="mx-auto flex w-fit rounded-xl bg-white p-2 ring-1 ring-zinc-100">
                    <QRCode value={url} size={168} level="M" />
                  </div>
                  <p className="mt-3 line-clamp-2 break-all text-center text-[10px] text-zinc-400">{url}</p>
                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl bg-zinc-100 py-2 text-[11px] font-semibold text-zinc-700"
                    onClick={() => void copyLink()}
                  >
                    {copied ? "Link copied" : "Copy link"}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {hint ? <p className="mt-2 text-[11px] leading-snug text-amber-800/90">{hint}</p> : null}
    </div>
  );
}
