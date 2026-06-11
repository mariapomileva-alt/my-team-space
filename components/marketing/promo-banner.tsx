import { isPromoBannerEnabled, PROMO_BANNER } from "@/lib/marketing/promo-banner";

export function PromoBanner() {
  if (!isPromoBannerEnabled()) return null;

  return (
    <div
      className="border-b border-[#6C5CE7]/15 bg-gradient-to-r from-[#6C5CE7]/10 via-white to-[#FF6B9D]/8"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-6 py-3 text-center sm:flex-row sm:justify-center sm:gap-2 sm:px-8 sm:text-left">
        <p className="text-sm font-semibold text-[#1A1C23]">
          <span aria-hidden className="mr-1.5">
            {PROMO_BANNER.emoji}
          </span>
          {PROMO_BANNER.title}
        </p>
        <span className="hidden text-neutral-300 sm:inline" aria-hidden>
          ·
        </span>
        <p className="text-sm text-neutral-600">
          Use promo code{" "}
          <span className="mx-0.5 inline-flex rounded-md bg-white/80 px-2 py-0.5 font-mono text-xs font-semibold tracking-wide text-[#6C5CE7] ring-1 ring-[#6C5CE7]/20">
            {PROMO_BANNER.promoCode}
          </span>{" "}
          {PROMO_BANNER.messageAfterCode}
        </p>
      </div>
    </div>
  );
}
