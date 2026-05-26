"use client";

import type { ResourceItem } from "@/lib/blocks/settings";
import { motion } from "framer-motion";

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const KIND_META: Record<
  ResourceItem["kind"],
  { emoji: string; label: string; gradient: string; pill: string }
> = {
  pdf: {
    emoji: "📄",
    label: "PDF",
    gradient: "from-rose-400 to-orange-500",
    pill: "bg-rose-100 text-rose-800 ring-rose-200/80",
  },
  link: {
    emoji: "🔗",
    label: "Link",
    gradient: "from-indigo-400 to-violet-600",
    pill: "bg-indigo-100 text-indigo-800 ring-indigo-200/80",
  },
  audio: {
    emoji: "🎵",
    label: "Music",
    gradient: "from-emerald-400 to-teal-600",
    pill: "bg-emerald-100 text-emerald-800 ring-emerald-200/80",
  },
  video: {
    emoji: "🎬",
    label: "Video",
    gradient: "from-cyan-400 to-blue-600",
    pill: "bg-cyan-100 text-cyan-800 ring-cyan-200/80",
  },
  image: {
    emoji: "🖼️",
    label: "Gallery",
    gradient: "from-amber-400 to-pink-500",
    pill: "bg-amber-100 text-amber-900 ring-amber-200/80",
  },
  plan: {
    emoji: "✈️",
    label: "Travel",
    gradient: "from-sky-400 to-indigo-600",
    pill: "bg-sky-100 text-sky-800 ring-sky-200/80",
  },
  nutrition: {
    emoji: "🥗",
    label: "Nutrition",
    gradient: "from-lime-400 to-green-600",
    pill: "bg-lime-100 text-lime-900 ring-lime-200/80",
  },
  choreography: {
    emoji: "💃",
    label: "Choreo",
    gradient: "from-fuchsia-400 to-purple-600",
    pill: "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200/80",
  },
  other: {
    emoji: "📦",
    label: "Resource",
    gradient: "from-zinc-400 to-zinc-600",
    pill: "bg-zinc-200 text-zinc-800 ring-zinc-300/80",
  },
};

function resourceCta(kind: ResourceItem["kind"]): string {
  switch (kind) {
    case "pdf":
      return "Open PDF";
    case "audio":
      return "Listen";
    case "video":
      return "Watch";
    case "plan":
      return "View plan";
    case "nutrition":
      return "View guide";
    case "choreography":
      return "Open reference";
    case "image":
      return "View gallery";
    default:
      return "Open";
  }
}

function resourceHref(item: ResourceItem): string | null {
  const href = (item.fileUrl || item.url)?.trim();
  return href || null;
}

export function ResourceCard({ item, variant = "tile" }: { item: ResourceItem; variant?: "compact" | "tile" }) {
  const meta = KIND_META[item.kind] ?? KIND_META.other;
  const href = resourceHref(item);
  if (!href) return null;
  const cta = resourceCta(item.kind);

  if (variant === "compact") {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="resource-card resource-card--compact flex items-center gap-3 rounded-2xl border border-zinc-200/80 bg-white p-3 shadow-sm hover:shadow-md"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-lg text-white shadow-sm`}>
          {meta.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-zinc-900">{item.title}</p>
          {item.description && <p className="truncate text-xs text-zinc-500">{item.description}</p>}
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-900 px-2.5 py-1.5 text-[10px] font-bold text-white">
          {cta}
          <ArrowIcon className="h-3 w-3" />
        </span>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="resource-card resource-card--tile flex h-full min-w-[220px] max-w-[260px] flex-col rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow-md sm:min-w-0 sm:max-w-none"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className={`flex h-24 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-4xl shadow-inner`}>
        {meta.emoji}
      </div>
      <span className={`mt-3 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${meta.pill}`}>
        {meta.label}
      </span>
      <p className="mt-2 text-sm font-bold text-zinc-900">{item.title}</p>
      {item.description && <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{item.description}</p>}
      <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-bold text-indigo-600">
        {cta}
        <ArrowIcon className="h-3.5 w-3.5" />
      </span>
    </motion.a>
  );
}

export function ResourcesHub({
  items,
  sectionTitle = "Team resources",
  subtitle,
  compact,
}: {
  items: ResourceItem[];
  sectionTitle?: string;
  subtitle?: string;
  compact?: boolean;
}) {
  const valid = items.filter((i) => resourceHref(i) && i.title?.trim());
  if (!valid.length) return null;

  if (compact) {
    return (
      <section className="resources-hub space-y-3">
        {sectionTitle ? (
          <h2 className="text-base font-bold tracking-tight text-[color:var(--mts-text)]">{sectionTitle}</h2>
        ) : null}
        <div className="space-y-2">
          {valid.map((item) => (
            <ResourceCard key={item.id} item={item} variant="compact" />
          ))}
        </div>
      </section>
    );
  }

  const featured = valid[0]!;
  const rest = valid.slice(1);

  return (
    <section className="resources-hub space-y-4">
      <header>
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">{sectionTitle}</h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </header>
      <ResourceCard item={featured} variant="tile" />
      {rest.length > 0 && (
        <div className="integrations-scroll-rail -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
          {rest.map((item) => (
            <ResourceCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
