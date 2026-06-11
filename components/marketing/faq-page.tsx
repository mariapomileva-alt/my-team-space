import Link from "next/link";

const FAQ_ITEMS = [
  {
    q: "What is MyTeamSpace?",
    a: "MyTeamSpace is a simple platform that helps teams, academies, and communities share schedules, updates, media, and results in one beautiful page.",
  },
  {
    q: "Who is MyTeamSpace for?",
    a: "Sports teams, dance schools, swimming clubs, camps, and any youth community that needs one clear place for coaches, parents, and kids.",
  },
  {
    q: "Do parents need to download an app?",
    a: "No. Parents open one link in any browser — no app download required.",
  },
  {
    q: "How long does setup take?",
    a: "Most teams are live in about five minutes. Pick blocks, colors, and your logo, then share the link.",
  },
  {
    q: "Can I customize my team page?",
    a: "Yes. You can choose blocks, team colors, logo, and content — each team space looks unique.",
  },
  {
    q: "Is MyTeamSpace mobile-friendly?",
    a: "Yes. Every team page is designed mobile-first so parents can check updates on the go.",
  },
  {
    q: "Can multiple coaches manage one team?",
    a: "Yes. Team admins can invite coaches to help manage schedules and content.",
  },
  {
    q: "How does billing work?",
    a: "Subscriptions renew monthly unless cancelled. You can upgrade, downgrade, or cancel anytime from your account.",
  },
  {
    q: "How much does MyTeamSpace cost?",
    a: "Team Plan is €29/month for one team. Academy Plan is €199/month for clubs managing up to 20 teams. See Pricing for full details.",
  },
  {
    q: "Do you offer promotions?",
    a: "We occasionally run seasonal campaigns with a promo code at checkout. When an offer is live, you'll see it in the site banner and on the Pricing page.",
  },
  {
    q: "How do I get support?",
    a: "Email us at support@myteamspace.app or visit the Support page.",
  },
];

export function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-14 pt-10 sm:px-8 sm:pb-16 sm:pt-12">
      <header className="text-center">
        <h1 className="font-[family-name:var(--font-brand)] text-3xl font-bold tracking-tight text-[#1A1C23] sm:text-4xl">
          Frequently asked questions
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-neutral-500">Quick answers about MyTeamSpace.</p>
      </header>
      <dl className="mt-8 space-y-4">
        {FAQ_ITEMS.map((item) => (
          <div key={item.q} className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm">
            <dt className="font-semibold text-[#1A1C23]">{item.q}</dt>
            <dd className="mt-2 text-[15px] leading-relaxed text-neutral-600">{item.a}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-10 text-center text-sm text-neutral-500">
        Still have questions?{" "}
        <Link href="/support" className="font-medium text-[#6C5CE7] hover:underline">
          Contact support
        </Link>
      </p>
    </section>
  );
}
