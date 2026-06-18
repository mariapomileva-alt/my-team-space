"use client";

import { whatsappShareUrl } from "@/lib/whatsapp-link";
import { cn } from "@/lib/utils/cn";

export function WhatsAppShareButton({
  message,
  onShare,
  label = "Share in WhatsApp",
  disabled,
  disabledReason,
  className,
  size = "default",
  loading = false,
}: {
  message?: string | null;
  onShare?: () => Promise<string | null>;
  label?: string;
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
  size?: "default" | "compact";
  loading?: boolean;
}) {
  const isDisabled = disabled || loading || (!message && !onShare);

  async function handleClick() {
    if (loading || isDisabled) return;
    const text = onShare ? await onShare() : message;
    if (!text) return;
    window.open(whatsappShareUrl(text), "_blank", "noopener,noreferrer");
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => void handleClick()}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition",
          "border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/15",
          "disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-zinc-50 disabled:text-zinc-400",
          size === "compact" ? "px-3 py-1.5 text-[11px]" : "px-4 py-2.5 text-sm",
        )}
      >
        <span aria-hidden>💬</span>
        {loading ? "Loading…" : label}
      </button>
      {disabledReason ? (
        <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500">{disabledReason}</p>
      ) : null}
    </div>
  );
}
