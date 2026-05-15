import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { PricingPage } from "@/components/marketing/pricing-page";

export const metadata = {
  title: "Pricing — MyTeamSpace",
  description: "Simple pricing for modern teams. Team Space, Founding Teams, and Academy Space plans.",
};

export default function PricingRoute() {
  return (
    <MarketingLayout>
      <PricingPage />
    </MarketingLayout>
  );
}
