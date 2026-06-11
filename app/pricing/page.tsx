import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { PricingPage } from "@/components/marketing/pricing-page";

export const metadata = {
  title: "Pricing — MyTeamSpace",
  description: "Team Plan €29/month. Academy Plan €199/month. Simple, stable pricing for teams and clubs.",
};

export default function PricingRoute() {
  return (
    <MarketingLayout>
      <PricingPage />
    </MarketingLayout>
  );
}
