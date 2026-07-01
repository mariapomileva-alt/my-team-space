import { TeamExamplesPage } from "@/components/marketing/team-examples-page";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

export const metadata = {
  title: "Team page examples — MyTeamSpace",
  description:
    "Three portfolio-level team pages — premium academy, playful kids studio, and competitive sports club. Scroll live previews built with MyTeamSpace.",
};

export default function ExamplesRoute() {
  return (
    <MarketingLayout>
      <TeamExamplesPage />
    </MarketingLayout>
  );
}
