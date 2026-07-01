"use client";

import { PremiumExamplesShowcase } from "@/components/marketing/premium-examples-showcase";
import { PRODUCT_EXAMPLES } from "@/lib/showcase/example-teams";

export function TeamExamplesGallery() {
  return <PremiumExamplesShowcase examples={PRODUCT_EXAMPLES} />;
}
