"use client";

import { toExternalHref } from "@/lib/external-url";
import { mtsTypeBody, mtsTypeBodySm, mtsTypePlaceholder, mtsTypeTitleLg, mtsTypeTitleSm } from "@/lib/typography";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

export type PaymentLinkCardProps = {
  title: string;
  description?: string;
  buttonLabel: string;
  paymentUrl: string;
  variant?: "full" | "compact" | "featured";
  className?: string;
};

export function PaymentLinkCard({
  title,
  description,
  buttonLabel,
  paymentUrl,
  variant = "full",
  className,
}: PaymentLinkCardProps) {
  const href = toExternalHref(paymentUrl);
  const displayTitle = title.trim() || "Payment";
  const cta = buttonLabel.trim() || "Pay now";
  const desc = description?.trim();

  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "@container relative overflow-hidden rounded-[1.35rem] border border-neutral-200/90 bg-white shadow-[0_8px_32px_-16px_rgba(15,23,42,0.18)] ring-1 ring-neutral-100/90",
        isFeatured && "rounded-[1.5rem] p-5 sm:p-6",
        isCompact && "p-4",
        !isFeatured && !isCompact && "p-5 sm:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-sky-100/80 to-indigo-50/40 blur-2xl" aria-hidden />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/25",
              isCompact ? "h-10 w-10 text-lg" : "h-12 w-12 text-xl",
            )}
            aria-hidden
          >
            💳
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                isFeatured ? mtsTypeTitleLg : isCompact ? mtsTypeTitleSm : mtsTypeTitleLg,
              )}
            >
              {displayTitle}
            </h3>
            {desc ? (
              <p className={cn("mt-1", isCompact ? cn(mtsTypeBodySm, "line-clamp-2") : mtsTypeBody)}>
                {desc}
              </p>
            ) : null}
          </div>
        </div>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex w-full items-center justify-center rounded-2xl bg-neutral-900 px-5 font-sans font-semibold tracking-normal text-white shadow-lg shadow-neutral-900/20 transition hover:bg-neutral-800 active:scale-[0.99]",
              isFeatured ? "min-h-[52px] text-[16px]" : "min-h-[48px] text-[15px]",
            )}
          >
            {cta}
          </a>
        ) : (
          <p className={cn("rounded-2xl bg-neutral-50 px-4 py-3 text-center", mtsTypePlaceholder)}>
            Add a payment link in the builder to enable this button.
          </p>
        )}
      </div>
    </motion.div>
  );
}
