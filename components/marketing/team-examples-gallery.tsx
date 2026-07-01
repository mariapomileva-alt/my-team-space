"use client";

import { ShowcaseDayGallery } from "@/components/showcase/showcase-day-gallery";
import type { ShowcaseTeamCard } from "@/lib/showcase/demo-teams";

export function TeamExamplesGallery({ teams }: { teams: ShowcaseTeamCard[] }) {
  return (
    <section className="pb-16 pt-2">
      <ShowcaseDayGallery teams={teams} locale="en" />
    </section>
  );
}
