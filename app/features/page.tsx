import { FeaturesPage } from "@/components/landing/features-page";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

export const metadata = {
  title: "Features — MyTeamSpace",
  description:
    "The modern home for your sports team. Schedule, photos, wins, contacts, and updates — one beautiful page your whole team comes back to.",
};

export default function FeaturesRoute() {
  return (
    <MarketingLayout>
      <FeaturesPage />
    </MarketingLayout>
  );
}
