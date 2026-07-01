import { FeaturesSellingSection } from "@/components/landing/landing-feature-groups";
import { MarketingTeamPagePreview } from "@/components/landing/marketing-team-preview";
import { PageHero } from "@/components/marketing/page-hero";

export function FeaturesPage() {
  return (
    <>
      <PageHero
        title="One home for your entire team."
        subtitle="Not a website builder. Not a link-in-bio. The modern team page where schedule, wins, photos, and contacts live together."
      />
      <div className="mx-auto max-w-6xl px-6 pb-4 pt-10 sm:px-8 sm:pt-12">
        <MarketingTeamPagePreview />
      </div>
      <FeaturesSellingSection variant="page" />
    </>
  );
}
