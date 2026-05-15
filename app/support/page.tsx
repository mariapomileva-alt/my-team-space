import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { SupportPage } from "@/components/marketing/support-page";

export const metadata = {
  title: "Support — MyTeamSpace",
  description: "Get help with MyTeamSpace. Email support@myteamspace.app",
};

export default function SupportRoute() {
  return (
    <MarketingLayout>
      <SupportPage />
    </MarketingLayout>
  );
}
