import { SocialIcon } from "@/components/social/social-icons";
import type { SocialKey } from "@/lib/blocks/settings";
import {
  SOCIAL_ICON_CLASS,
  SOCIAL_LABELS,
  normalizeSocialUrl,
  type SocialNetwork,
} from "@/lib/social/links";
import { cn } from "@/lib/utils/cn";

export type SocialLinkItem = {
  network: SocialNetwork | "link";
  href: string;
  label: string;
};

export function SocialLinkButtons({
  links,
  size = "md",
  tone = "default",
  className,
}: {
  links: SocialLinkItem[];
  size?: "sm" | "md";
  tone?: "default" | "hero";
  className?: string;
}) {
  if (links.length === 0) return null;

  const btn =
    tone === "hero"
      ? "h-9 w-9 rounded-[10px]"
      : size === "sm"
        ? "h-10 w-10 rounded-xl"
        : "h-11 w-11 rounded-2xl";

  const shell =
    tone === "hero"
      ? "border border-[color-mix(in_srgb,var(--mts-card-border)_70%,transparent)] bg-[var(--mts-card,#fff)] shadow-[0_1px_3px_rgba(15,23,42,0.06)] hover:border-[color-mix(in_srgb,var(--mts-ring)_30%,var(--mts-card-border))]"
      : "border border-neutral-200/90 bg-white shadow-[0_2px_12px_-6px_rgba(15,23,42,0.18)] ring-1 ring-neutral-100/80 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-10px_rgba(15,23,42,0.22)]";

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {links.map((link) => {
        const iconClass =
          link.network === "link" || link.network === "website" || link.network === "phone"
            ? "text-[color:var(--mts-primary)]"
            : SOCIAL_ICON_CLASS[link.network as SocialKey];

        return (
          <a
            key={`${link.network}-${link.href}`}
            href={link.href}
            target={link.network === "phone" ? undefined : "_blank"}
            rel={link.network === "phone" ? undefined : "noopener noreferrer"}
            aria-label={link.label}
            title={link.label}
            className={cn(
              "inline-flex items-center justify-center transition active:scale-[0.96]",
              shell,
              btn,
            )}
          >
            <SocialIcon network={link.network} className={cn("h-4 w-4", iconClass)} />
          </a>
        );
      })}
    </div>
  );
}

export function heroSocialLinks(social: Partial<Record<SocialKey, string>>): SocialLinkItem[] {
  return (Object.keys(SOCIAL_LABELS) as SocialKey[])
    .map((key) => {
      const raw = social[key]?.trim();
      if (!raw) return null;
      return {
        network: key,
        href: normalizeSocialUrl(key, raw),
        label: SOCIAL_LABELS[key],
      };
    })
    .filter(Boolean) as SocialLinkItem[];
}
