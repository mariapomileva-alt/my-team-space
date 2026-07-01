import Link from "next/link";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/city-juniors", label: "Templates" },
      { href: "/city-juniors", label: "Team Spaces" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/support", label: "Support" },
      { href: "mailto:support@myteamspace.app", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/cookies", label: "Cookies" },
    ],
  },
  {
    title: "Social",
    links: [{ href: "https://instagram.com", label: "Instagram", external: true }],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-black/[0.06] bg-white/50">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-neutral-600 transition hover:text-[#6C5CE7]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-sm text-neutral-600 transition hover:text-[#6C5CE7]">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-12 border-t border-neutral-100 pt-8 text-center text-sm text-neutral-500">
          Made with care for teams and communities.
        </p>
        <p className="mt-2 text-center text-xs text-neutral-400">© {new Date().getFullYear()} MyTeamSpace</p>
      </div>
    </footer>
  );
}
