"use client";

import { BrandLogo } from "@/components/brand/brand-logo";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.04] bg-[#F2F4F7]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <BrandLogo href="/" size="md" />
        <nav className="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-2 text-[13px] font-medium transition ${
                pathname === item.href
                  ? "bg-white text-[#6C5CE7] shadow-sm"
                  : "text-neutral-600 hover:bg-white/60 hover:text-[#1A1C23]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/admin/login"
            className="rounded-full px-3 py-2 text-[13px] font-medium text-neutral-600 transition hover:text-[#6C5CE7]"
          >
            Sign in
          </Link>
          <Link
            href="/admin/signup"
            className="rounded-full bg-[#6C5CE7] px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#5b4bd6]"
          >
            Create Your Team Space
          </Link>
        </nav>
      </div>
    </header>
  );
}
