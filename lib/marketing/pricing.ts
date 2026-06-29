import { getPlanSpec, PLAN_CATALOG } from "@/lib/billing/plan-catalog";

/** Public marketing pricing — copy aligned with {@link PLAN_CATALOG}. */

export type MarketingPlanId = "single_team" | "academy";

export type MarketingPlan = {
  id: MarketingPlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  badge: string | null;
  featured: boolean;
  cta: string;
  href: string;
  features: string[];
};

export const TEAM_PLAN_PRICE = getPlanSpec("single_team").displayPrice;
export const ACADEMY_PLAN_PRICE = getPlanSpec("academy").displayPrice;
export const TEAM_PLAN_LABEL = getPlanSpec("single_team").label;
export const ACADEMY_PLAN_LABEL = getPlanSpec("academy").label;

export const MARKETING_PLANS: MarketingPlan[] = [
  {
    id: "single_team",
    name: TEAM_PLAN_LABEL,
    price: TEAM_PLAN_PRICE,
    period: "/month",
    description: "Everything you need for one team.",
    badge: null,
    featured: false,
    cta: "Start Team Plan",
    href: "/admin?startPlan=single_team",
    features: [
      "1 team space",
      "schedules & announcements",
      "rankings & results",
      "media gallery",
      "attendance",
      "mobile-friendly page",
      "custom team colors",
      "parent access",
      "easy setup",
    ],
  },
  {
    id: "academy",
    name: ACADEMY_PLAN_LABEL,
    price: ACADEMY_PLAN_PRICE,
    period: "/month",
    description: "For clubs and academies managing multiple teams.",
    badge: "For clubs & academies",
    featured: true,
    cta: "Start Academy Plan",
    href: "/admin?startPlan=academy",
    features: [
      "up to 20 teams",
      "academy dashboard",
      "multiple coaches",
      "centralized management",
      "academy-wide announcements",
      "shared branding",
      "premium support",
      "all premium features",
    ],
  },
];

export const PRICING_FAQ = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. You can cancel your subscription at any time from your account.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrade to Academy when you grow, or switch plans anytime from your dashboard.",
  },
  {
    q: "Do you run promotions?",
    a: "We occasionally share seasonal offers with a promo code. When a campaign is live, you'll see it in the site banner and on the Pricing page.",
  },
  {
    q: "Do parents need accounts?",
    a: "No. Team pages can be shared with parents directly — one link in any browser.",
  },
  {
    q: "Do you support mobile devices?",
    a: "Yes. MyTeamSpace is designed mobile-first.",
  },
] as const;
