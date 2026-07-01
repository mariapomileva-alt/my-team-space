"use client";

import { BuilderPreviewViewport } from "@/components/builder/builder-preview-viewport";
import { EXAMPLES_PHONE_H } from "@/lib/builder/preview";
import type { ProductExample } from "@/lib/showcase/example-teams";
import { getTheme } from "@/lib/themes";
import type { TeamSpace } from "@/lib/types";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

function ExamplePhonePreview({ team }: { team: TeamSpace }) {
  return (
    <BuilderPreviewViewport
      team={team}
      mode="mobile"
      phoneHeight={EXAMPLES_PHONE_H}
      phoneClassName="lg:scale-105"
    />
  );
}

function ExamplePhotoMosaic({ photos, teamName }: { photos: readonly string[]; teamName: string }) {
  if (photos.length < 3) return null;
  const [hero, left, right] = photos;
  return (
    <div className="mt-8 space-y-2">
      <div className="overflow-hidden rounded-2xl shadow-[0_12px_40px_-20px_rgba(15,23,42,0.28)] ring-1 ring-black/[0.04]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero}
          alt={`${teamName} — highlight`}
          className="aspect-[16/10] w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[left, right].map((src, i) => (
          <div
            key={src}
            className="overflow-hidden rounded-xl shadow-sm ring-1 ring-black/[0.04]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${teamName} — gallery ${i + 2}`}
              className="aspect-[4/3] w-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function personalityAccent(personality: ProductExample["personality"]) {
  if (personality === "premium") return { bg: "#f5f5f5", ring: "#0a0a0a", text: "#0a0a0a" };
  if (personality === "playful") return { bg: "#faf5ff", ring: "#8b5cf6", text: "#6d28d9" };
  return { bg: "#fff7ed", ring: "#ea580c", text: "#c2410c" };
}

function ExampleShowcaseSection({
  example,
  index,
}: {
  example: ProductExample;
  index: number;
}) {
  const accent = personalityAccent(example.personality);
  const palette = getTheme(example.team.themeId);
  const primary = (palette.cssVars as Record<string, string>)["--mts-primary"] ?? accent.ring;
  const reversed = index % 2 === 1;

  return (
    <section
      className={cn(
        "relative overflow-hidden border-t border-black/[0.04]",
        index === 0 ? "border-t-0" : "",
        reversed ? "bg-[#fafafa]" : "bg-white",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background: `radial-gradient(ellipse 70% 50% at ${reversed ? "15%" : "85%"} 20%, color-mix(in srgb, ${primary} 10%, transparent), transparent)`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-center lg:gap-14 lg:py-24">
        <div className={cn(reversed && "lg:order-2")}>
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em]"
            style={{ background: accent.bg, color: accent.text }}
          >
            {example.label}
          </div>

          <h2 className="mt-5 font-[family-name:var(--font-brand)] text-3xl font-bold tracking-tight text-[#1A1C23] sm:text-4xl lg:text-[2.35rem] lg:leading-[1.12]">
            {example.headline}
          </h2>

          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-neutral-600">{example.story}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[12px] font-medium text-neutral-700">
              {example.audience}
            </span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[12px] font-medium text-neutral-700">
              {example.personalityLabel}
            </span>
            <span className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[12px] font-medium text-neutral-700">
              {example.paletteLabel}
            </span>
          </div>

          <ul className="mt-8 space-y-3">
            {example.highlights.map((item) => (
              <li key={item} className="flex gap-3 text-[14px] leading-snug text-neutral-700">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: primary }}
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>

          <ExamplePhotoMosaic photos={example.spotlightPhotos} teamName={example.team.name} />

          <p className="mt-8 text-[13px] font-semibold text-neutral-400">
            {example.team.name} · scroll inside the preview
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className={cn("flex justify-center", reversed && "lg:order-1")}
        >
          <div
            className="relative"
            style={{
              width: 320,
              filter: `drop-shadow(0 28px 56px color-mix(in srgb, ${primary} 18%, transparent))`,
            }}
          >
            <div
              className="pointer-events-none absolute -inset-4 rounded-[2.5rem] opacity-40 blur-2xl"
              style={{ background: `color-mix(in srgb, ${primary} 25%, transparent)` }}
              aria-hidden
            />
            <ExamplePhonePreview team={example.team} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function PremiumExamplesShowcase({ examples }: { examples: ProductExample[] }) {
  return (
    <div>
      {examples.map((example, index) => (
        <ExampleShowcaseSection key={example.id} example={example} index={index} />
      ))}
    </div>
  );
}
