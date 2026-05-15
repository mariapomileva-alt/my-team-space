"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "mts_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = localStorage.getItem(KEY);
    if (!v) setVisible(true);
  }, []);

  function choose(value: "accept" | "decline") {
    localStorage.setItem(KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-black/[0.06] bg-white/95 p-4 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:px-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-neutral-600">
          We use cookies to improve your experience and platform performance.{" "}
          <Link href="/cookies" className="font-medium text-[#6C5CE7] underline underline-offset-2">
            Learn more
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => choose("decline")}
            className="min-h-10 rounded-full border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => choose("accept")}
            className="min-h-10 rounded-full bg-[#6C5CE7] px-5 text-sm font-semibold text-white transition hover:bg-[#5b4bd6]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
