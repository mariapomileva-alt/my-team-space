import { MarketingLayout } from "@/components/marketing/marketing-layout";
import { PricingPage } from "@/components/marketing/pricing-page";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata = {
  title: "Pricing — MyTeamSpace",
  description: "Team Plan €29/month. Academy Plan €199/month. Simple, stable pricing for teams and clubs.",
};

export default async function PricingRoute() {
  let isAuthenticated = false;
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    isAuthenticated = Boolean(data.user);
  } catch {
    isAuthenticated = false;
  }

  return (
    <MarketingLayout>
      <PricingPage isAuthenticated={isAuthenticated} />
    </MarketingLayout>
  );
}
