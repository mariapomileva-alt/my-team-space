import { FaqPage } from "@/components/marketing/faq-page";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

export const metadata = {
  title: "FAQ — MyTeamSpace",
  description: "Frequently asked questions about MyTeamSpace.",
};

export default function FaqRoute() {
  return (
    <MarketingLayout>
      <FaqPage />
    </MarketingLayout>
  );
}
