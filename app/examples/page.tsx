import { TeamExamplesPage } from "@/components/marketing/team-examples-page";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

export const metadata = {
  title: "Team page examples — MyTeamSpace",
  description:
    "Six team structures across one day — morning swim squads, city clubs, studios, and academies. Scroll live previews before you sign up.",
};

export default function ExamplesRoute() {
  return (
    <MarketingLayout>
      <TeamExamplesPage />
    </MarketingLayout>
  );
}
