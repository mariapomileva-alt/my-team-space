"use client";

import {
  HERO_LAYOUT_VARIANTS,
  HERO_VARIANT_META,
  type HeroLayoutVariant,
} from "@/lib/blocks/hero-layout";
import { cn } from "@/lib/utils/cn";

function Bars({ align = "left", onDark = false }: { align?: "left" | "center"; onDark?: boolean }) {
  const tone = onDark ? "bg-white" : "bg-current";
  return (
    <div className={cn("flex flex-col gap-[3px]", align === "center" ? "items-center" : "items-start")}>
      <div className={cn("h-[5px] w-10 rounded-full", tone, onDark ? "opacity-95" : "opacity-80")} />
      <div className={cn("h-[3px] w-7 rounded-full", tone, onDark ? "opacity-75" : "opacity-50")} />
      <div className={cn("h-[3px] w-5 rounded-full", tone, onDark ? "opacity-60" : "opacity-40")} />
    </div>
  );
}

function Logo({
  active,
  className,
  square = false,
  frosted = false,
}: {
  active: boolean;
  className?: string;
  square?: boolean;
  frosted?: boolean;
}) {
  return (
    <div
      className={cn(
        "h-5 w-5 border-2 border-white shadow-sm",
        square ? "rounded-md" : "rounded-full",
        frosted ? "bg-white/25 backdrop-blur-sm" : active ? "bg-gradient-to-br from-indigo-400 to-violet-500" : "bg-gradient-to-br from-zinc-400 to-zinc-500",
        className,
      )}
      aria-hidden
    />
  );
}

function LiveDot() {
  return (
    <div className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 ring-2 ring-white/70" aria-hidden />
  );
}

/** Schematic mini-preview — Header Variants reference. */
function HeroVariantThumb({ variant, active }: { variant: HeroLayoutVariant; active: boolean }) {
  const frame = cn(
    "relative h-[74px] w-full overflow-hidden rounded-lg border",
    active ? "border-indigo-300" : "border-zinc-200",
  );
  const cover = active
    ? "bg-gradient-to-br from-indigo-200 to-violet-200"
    : "bg-gradient-to-br from-zinc-200 to-zinc-300";
  const text = active ? "text-indigo-500" : "text-zinc-400";

  if (variant === "inside_header") {
    return (
      <div className={cn(frame, "bg-white")}>
        <div className={cn("absolute inset-x-0 top-0 h-[55%]", cover)} aria-hidden />
        <div className="absolute inset-x-0 top-[30%] h-[30%] bg-gradient-to-t from-black/50 to-transparent" aria-hidden />
        <LiveDot />
        <Logo active={active} className="absolute bottom-[38%] left-2" />
        <div className="absolute bottom-[40%] left-[34px]">
          <Bars onDark />
        </div>
        <div className={cn("absolute bottom-2 left-2", text)}>
          <div className="h-[3px] w-6 rounded-full bg-current opacity-40" />
        </div>
      </div>
    );
  }

  if (variant === "circle_on_header") {
    return (
      <div className={cn(frame, "bg-white")}>
        <div className={cn("absolute inset-x-0 top-0 h-[55%]", cover)} aria-hidden />
        <div className="absolute inset-x-0 top-[30%] h-[30%] bg-gradient-to-t from-black/50 to-transparent" aria-hidden />
        <LiveDot />
        <Logo active={active} frosted className="absolute bottom-[38%] left-2" />
        <div className="absolute bottom-[40%] left-[34px]">
          <Bars onDark />
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn(frame, "bg-white")}>
        <div
          className={cn(
            "absolute inset-0",
            active ? "bg-gradient-to-br from-indigo-300 to-violet-400" : "bg-gradient-to-br from-zinc-300 to-zinc-400",
          )}
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 to-transparent" aria-hidden />
        <LiveDot />
        <div className="absolute bottom-2 left-2">
          <Bars onDark />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(frame, "bg-white")}>
      <div className={cn("h-[42%] w-full", cover)} aria-hidden />
      <LiveDot />
      {variant === "overlap_large" ? (
        <>
          <Logo active={active} className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2" />
          <div className={cn("absolute left-1/2 top-[58%] mt-1 -translate-x-1/2", text)}>
            <Bars align="center" />
          </div>
        </>
      ) : null}
      {variant === "inline" ? (
        <>
          <Logo active={active} className="absolute left-2 top-[42%] -translate-y-1/2" />
          <div className={cn("absolute left-[34px] top-[46%]", text)}>
            <Bars />
          </div>
          <div className={cn("absolute bottom-2 left-[34px]", text)}>
            <Bars />
          </div>
        </>
      ) : null}
      {variant === "square" ? (
        <>
          <Logo active={active} square className="absolute left-2 top-[42%] -translate-y-1/2" />
          <div className={cn("absolute left-1/2 top-[52%] -translate-x-1/2", text)}>
            <Bars align="center" />
          </div>
          <div className={cn("absolute bottom-2 left-1/2 -translate-x-1/2", text)}>
            <Bars align="center" />
          </div>
        </>
      ) : null}
    </div>
  );
}

export function HeroLayoutPicker({
  value,
  onChange,
}: {
  value: HeroLayoutVariant;
  onChange: (variant: HeroLayoutVariant) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-500">Header layout</label>
      <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-400">
        Same content — pick how the logo and name sit together. The preview updates instantly.
      </p>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {HERO_LAYOUT_VARIANTS.map((variant) => {
          const active = value === variant;
          const meta = HERO_VARIANT_META[variant];
          return (
            <button
              key={variant}
              type="button"
              onClick={() => onChange(variant)}
              aria-pressed={active}
              title={`${meta.label} — ${meta.hint}`}
              className={cn(
                "rounded-xl border p-2 text-left transition",
                active
                  ? "border-indigo-400 bg-indigo-50/50 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]"
                  : "border-zinc-200 bg-white hover:border-indigo-200 hover:shadow-sm",
              )}
            >
              <HeroVariantThumb variant={variant} active={active} />
              <div className="mt-1.5 flex items-center gap-1.5">
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold",
                    active ? "bg-indigo-500 text-white" : "bg-zinc-200 text-zinc-500",
                  )}
                  aria-hidden
                >
                  {meta.number}
                </span>
                <span className="truncate text-[11px] font-semibold text-zinc-800">{meta.label}</span>
              </div>
            </button>
          );
        })}
      </div>
      <p className="mt-1.5 text-[11px] font-medium text-indigo-700/90">{HERO_VARIANT_META[value].hint}</p>
    </div>
  );
}
