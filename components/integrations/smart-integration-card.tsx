"use client";

import type { IntegrationProvider } from "@/lib/integrations/providers";
import type { IntegrationCardVariant, IntegrationPreview } from "@/lib/integrations/types";
import { motion } from "framer-motion";
import Image from "next/image";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

export type SmartIntegrationCardProps = {
  url: string;
  provider: IntegrationProvider;
  title: string;
  description: string;
  cta: string;
  preview?: IntegrationPreview;
  variant?: IntegrationCardVariant;
};

const cardMotion = {
  whileHover: { y: -2, transition: { duration: 0.2 } },
  whileTap: { scale: 0.99 },
};

function ProviderIcon({ provider, size = "md" }: { provider: IntegrationProvider; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-9 w-9 text-lg" : "h-11 w-11 text-xl";
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 ring-black/5 ${provider.tileClass} ${dim}`}
      aria-hidden
    >
      {provider.emoji}
    </div>
  );
}

function PreviewStats({ stats }: { stats: NonNullable<IntegrationPreview["stats"]> }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
      {stats.map((s) => (
        <motion.div
          key={s.label}
          className="rounded-xl bg-white/15 px-2 py-2 text-center backdrop-blur-sm"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-[10px] font-medium uppercase tracking-wide text-white/70">{s.label}</p>
          <p className="mt-0.5 text-sm font-bold text-white">{s.value}</p>
        </motion.div>
      ))}
    </div>
  );
}

function PostGrid({ swatches }: { swatches: string[] }) {
  return (
    <motion.div
      className="mt-3 grid grid-cols-2 gap-1.5 min-[420px]:grid-cols-3"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
    >
      {swatches.slice(0, 6).map((color, i) => (
        <motion.div
          key={i}
          className="aspect-square rounded-lg ring-1 ring-black/10"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
          variants={{ hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } }}
          transition={{ delay: i * 0.04 }}
        />
      ))}
    </motion.div>
  );
}

function CtaButton({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${
        dark
          ? "bg-white text-zinc-900 shadow-sm hover:bg-white/95"
          : "bg-zinc-900 text-white shadow-sm hover:bg-zinc-800"
      }`}
    >
      {label}
      <ArrowIcon className="h-3.5 w-3.5" />
    </span>
  );
}

export function SmartIntegrationCard({
  url,
  provider,
  title,
  description,
  cta,
  preview,
  variant = "tile",
}: SmartIntegrationCardProps) {
  const href = url.trim();
  if (!href) return null;

  if (variant === "compact") {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="integration-card integration-card--compact group flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm transition hover:border-zinc-300 hover:shadow-md"
        {...cardMotion}
      >
        <ProviderIcon provider={provider} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-zinc-900">{title}</p>
          <p className="truncate text-xs text-zinc-500">{description}</p>
        </div>
        <CtaButton label={cta} />
      </motion.a>
    );
  }

  if (variant === "featured") {
    const hasThumb = Boolean(preview?.thumbnailUrl);
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="integration-card integration-card--featured group relative block overflow-hidden rounded-3xl border border-white/20 shadow-lg shadow-zinc-900/10"
        {...cardMotion}
      >
        <div className={`relative bg-gradient-to-br ${provider.cardClass} p-5 text-white sm:p-6`}>
          {hasThumb && (
            <div className="absolute inset-0 opacity-30">
              <Image
                src={preview!.thumbnailUrl!}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 480px"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            </div>
          )}
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-3">
              <ProviderIcon provider={provider} />
              {preview?.duration && (
                <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm">
                  {preview.duration}
                </span>
              )}
            </div>
            <p className="mt-4 text-lg font-bold tracking-tight sm:text-xl">{title}</p>
            <p className="mt-1 text-sm text-white/85">{description}</p>
            {preview?.subline && !preview.stats && (
              <p className="mt-2 text-xs font-medium text-white/70">{preview.subline}</p>
            )}
            {preview?.stats && <PreviewStats stats={preview.stats} />}
            {preview?.postSwatches && <PostGrid swatches={preview.postSwatches} />}
            {preview?.chips && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {preview.chips.map((c) => (
                  <span key={c} className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-white/70">{provider.name}</span>
              <CtaButton label={cta} dark />
            </div>
          </div>
        </div>
        {hasThumb && (
          <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 sm:block">
            <div className="relative h-20 w-32 overflow-hidden rounded-xl ring-2 ring-white/30 shadow-xl">
              <Image src={preview!.thumbnailUrl!} alt="" fill className="object-cover" sizes="128px" unoptimized />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <PlayIcon className="h-8 w-8 text-white drop-shadow" />
              </div>
            </div>
          </div>
        )}
      </motion.a>
    );
  }

  /* tile */
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="integration-card integration-card--tile group flex h-full min-w-[240px] max-w-[280px] flex-col rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow-md sm:min-w-0 sm:max-w-none"
      {...cardMotion}
    >
      {preview?.thumbnailUrl ? (
        <div className="relative mb-3 aspect-video overflow-hidden rounded-xl bg-zinc-100">
          <Image
            src={preview.thumbnailUrl}
            alt=""
            fill
            className="object-cover transition group-hover:scale-[1.02]"
            sizes="280px"
            unoptimized
          />
          {preview.duration && (
            <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {preview.duration}
            </span>
          )}
        </div>
      ) : (
        <div className={`mb-3 flex h-20 items-center justify-center rounded-xl bg-gradient-to-br ${provider.cardClass} text-3xl shadow-inner`}>
          {provider.emoji}
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold text-zinc-900">{provider.name}</p>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-zinc-500">{description}</p>
        {preview?.stats && (
          <div className="mt-3 flex gap-2">
            {preview.stats.slice(0, 2).map((s) => (
              <div key={s.label} className="rounded-lg bg-zinc-50 px-2 py-1 text-center ring-1 ring-zinc-100">
                <p className="text-[9px] font-medium uppercase text-zinc-400">{s.label}</p>
                <p className="text-xs font-bold text-zinc-800">{s.value}</p>
              </div>
            ))}
          </div>
        )}
        <div className="mt-auto pt-3">
          <CtaButton label={cta} />
        </div>
      </div>
    </motion.a>
  );
}
