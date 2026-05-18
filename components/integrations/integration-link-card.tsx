"use client";

import {
  detectIntegrationProvider,
  hostnameLabel,
  vimeoVideoId,
  youtubeVideoId,
  type IntegrationProvider,
} from "@/lib/integrations/providers";

export type IntegrationLink = {
  id: string;
  url: string;
  label?: string;
  providerId?: string;
};

export function IntegrationLinkCard({ link, compact }: { link: IntegrationLink; compact?: boolean }) {
  const url = link.url?.trim();
  if (!url) return null;
  const provider = detectIntegrationProvider(url);
  const title = link.label?.trim() || provider.name;
  const yt = youtubeVideoId(url);
  const vimeo = vimeoVideoId(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block overflow-hidden rounded-2xl border border-[color:var(--mts-card-border)] bg-white shadow-[0_4px_24px_-12px_rgba(15,23,42,0.12)] transition hover:-translate-y-0.5 hover:shadow-lg ${
        compact ? "" : ""
      }`}
    >
      {yt ? (
        <div className="relative aspect-video w-full bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://img.youtube.com/vi/${yt}/hqdefault.jpg`}
            alt=""
            className="h-full w-full object-cover opacity-90"
          />
          <span className="absolute inset-0 flex items-center justify-center text-4xl text-white drop-shadow-lg">
            ▶
          </span>
        </div>
      ) : vimeo ? (
        <div className={`bg-gradient-to-br ${provider.cardClass} px-4 py-6 text-white`}>
          <ProviderBadge provider={provider} light />
          <p className="mt-2 text-sm font-semibold opacity-90">Tap to watch on Vimeo</p>
        </div>
      ) : (
        <div className={`bg-gradient-to-br ${provider.cardClass} px-4 ${compact ? "py-4" : "py-6"} text-white`}>
          <ProviderBadge provider={provider} light />
          <p className="mt-2 text-base font-bold leading-snug">{title}</p>
          <p className="mt-1 text-xs font-medium opacity-80">{hostnameLabel(url)}</p>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <span className="text-sm font-semibold text-[color:var(--mts-text)]">{title}</span>
        <span className="rounded-full bg-[var(--mts-accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[color:var(--mts-primary-bright)]">
          Open
        </span>
      </div>
    </a>
  );
}

function ProviderBadge({ provider, light }: { provider: IntegrationProvider; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        light ? "bg-white/20 text-white ring-1 ring-white/30" : "bg-zinc-100 text-zinc-700"
      }`}
    >
      <span aria-hidden>{provider.emoji}</span>
      {provider.name}
    </span>
  );
}
