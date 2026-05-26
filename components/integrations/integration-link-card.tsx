"use client";

import { SmartIntegrationCard } from "@/components/integrations/smart-integration-card";
import { enrichIntegrationLink } from "@/lib/integrations/build-preview";
import type { IntegrationLink } from "@/lib/integrations/types";

export type { IntegrationLink };

export function IntegrationLinkCard({
  link,
  compact,
  index = 0,
  total = 1,
}: {
  link: IntegrationLink;
  compact?: boolean;
  index?: number;
  total?: number;
}) {
  const url = link.url?.trim();
  if (!url) return null;
  const enriched = enrichIntegrationLink(link, index, total);
  return (
    <SmartIntegrationCard
      url={enriched.url}
      provider={enriched.provider}
      title={enriched.label!}
      description={enriched.description!}
      cta={enriched.cta}
      preview={enriched.preview}
      variant={compact ? "compact" : enriched.variant}
    />
  );
}
