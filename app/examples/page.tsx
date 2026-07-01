import { TeamExamplesPage } from "@/components/marketing/team-examples-page";
import { MarketingLayout } from "@/components/marketing/marketing-layout";

export const metadata = {
  title: "Team page examples — MyTeamSpace",
  description:
    "See six real sports team pages — dance, basketball, hockey, swim, ballet, and tennis. Scroll live previews before you sign up.",
};

export default function ExamplesRoute() {
  return (
    <MarketingLayout>
      <TeamExamplesPage />
    </MarketingLayout>
  );
}
