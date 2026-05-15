import { AboutPage } from "@/components/marketing/about-page";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

export const metadata = {
  title: "About — MyTeamSpace",
  description: "Built for teams that care. Learn about MyTeamSpace.",
};

export default function AboutRoute() {
  return (
    <MarketingLayout>
      <AboutPage />
    </MarketingLayout>
  );
}
