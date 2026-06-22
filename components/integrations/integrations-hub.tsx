"use client";

import { IntegrationPillsRail } from "@/components/integrations/integration-pill";
import { SmartIntegrationCard } from "@/components/integrations/smart-integration-card";
import { enrichIntegrationLink } from "@/lib/integrations/build-preview";
import type { IntegrationLink } from "@/lib/integrations/types";

export function IntegrationsHub({
  links,
  sectionTitle = "Smart integrations",
  subtitle,
}: {
  links: IntegrationLink[];
  sectionTitle?: string;
  subtitle?: string;
}) {
  const valid = links.filter((l) => l.url?.trim());
  if (!valid.length) return null;

  const enriched = valid.map((l, i) => enrichIntegrationLink(l, i, valid.length));
  const providers = [...new Map(enriched.map((e) => [e.provider.id, e.provider])).values()];
  const featured =
    enriched.find((e) => e.featured || e.variant === "featured") ?? enriched[0]!;
  const rest = enriched.filter((e) => e.id !== featured.id);

  return (
    <section className="integrations-hub space-y-4">
      <header>
        <h2 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">{sectionTitle}</h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </header>

      <IntegrationPillsRail providers={providers} />

      <SmartIntegrationCard
        url={featured.url}
        provider={featured.provider}
        title={featured.label!}
        description={featured.description!}
        cta={featured.cta}
        preview={featured.preview}
        variant="featured"
      />

      {rest.length > 0 && (
        <div className="integrations-scroll-rail -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-3">
          {rest.map((item) => (
            <SmartIntegrationCard
              key={item.id}
              url={item.url}
              provider={item.provider}
              title={item.label!}
              description={item.description!}
              cta={item.cta}
              preview={item.preview}
              variant={item.variant === "featured" ? "tile" : item.variant}
            />
          ))}
        </div>
      )}
    </section>
  );
}
