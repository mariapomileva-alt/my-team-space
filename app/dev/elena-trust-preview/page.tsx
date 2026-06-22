import { TeamPublicPage } from "@/components/mts/team-public-page";
import { createDefaultBlocks } from "@/lib/default-blocks";
import type { BlockInstance, TeamSpace } from "@/lib/types";
import { notFound } from "next/navigation";

function patchHero(blocks: BlockInstance[], patch: Record<string, unknown>) {
  return blocks.map((b) =>
    b.type === "hero" ? { ...b, settings: { ...b.settings, ...patch } } : b,
  );
}

function elenaFixture(scenario: "minimal" | "schedule"): TeamSpace {
  const LOGO = "https://images.unsplash.com/photo-1517649763962-0c62306601b7?w=200&h=200&fit=crop";
  const COVER = "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=400&fit=crop";

  let blocks = patchHero(createDefaultBlocks(), {
    coverImageUrl: COVER,
    teamPhotoUrl: LOGO,
    social: scenario === "schedule" ? { whatsapp: "+37129123456" } : {},
  });

  if (scenario === "schedule") {
    blocks = blocks.map((b) =>
      b.type === "schedule"
        ? {
            ...b,
            settings: {
              mode: "manual",
              externalUrl: "",
              events: [
                {
                  id: "evt_elena",
                  title: "Training",
                  eventType: "training",
                  dayOfWeek: 2,
                  time: "18:00",
                  location: "Main hall",
                  repeat: "weekly",
                  ends: "never",
                },
              ],
            },
          }
        : b,
    );
  }

  return {
    id: "dev_elena_trust",
    slug: "elena-trust-preview",
    name: "Elena Trust FC",
    logoUrl: LOGO,
    primaryColor: "#0c4a6e",
    secondaryColor: "#0ea5e9",
    themeId: "ocean_aqua",
    plan: "pro",
    publishStatus: "published",
    pageVisibility: "public",
    blocks,
  };
}

type Props = { searchParams: Promise<{ scenario?: string }> };

/** Dev-only anonymous parent preview for Elena trust checks. */
export default async function ElenaTrustPreviewPage({ searchParams }: Props) {
  if (process.env.NODE_ENV === "production") notFound();

  const { scenario: raw } = await searchParams;
  const scenario = raw === "schedule" ? "schedule" : "minimal";
  const team = elenaFixture(scenario);

  return <TeamPublicPage initialTeam={team} enableLocalPreview={false} />;
}
