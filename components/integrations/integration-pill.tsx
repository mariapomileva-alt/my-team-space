"use client";

import type { IntegrationProvider } from "@/lib/integrations/providers";
export function IntegrationPill({
  provider,
  active,
  onClick,
}: {
  provider: IntegrationProvider;
  active?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-tight ring-1 transition ${
        provider.pillClass
      } ${active ? "ring-2 ring-indigo-400/60 shadow-sm" : ""} ${onClick ? "hover:scale-[1.02] active:scale-[0.98]" : ""}`}
    >
      <span aria-hidden>{provider.emoji}</span>
      {provider.name}
    </Tag>
  );
}

export function IntegrationPillsRail({ providers }: { providers: IntegrationProvider[] }) {
  if (!providers.length) return null;
  return (
    <div className="integrations-pills-rail -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {providers.map((p) => (
        <IntegrationPill key={p.id} provider={p} />
      ))}
    </div>
  );
}
