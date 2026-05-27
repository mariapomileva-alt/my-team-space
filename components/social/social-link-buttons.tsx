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
  className,
}: {
  links: SocialLinkItem[];
  size?: "sm" | "md";
  className?: string;
}) {
  if (links.length === 0) return null;

  const btn =
    size === "sm"
      ? "h-10 w-10 rounded-xl"
      : "h-11 w-11 rounded-2xl";

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
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
              "inline-flex items-center justify-center border border-neutral-200/90 bg-white shadow-[0_2px_12px_-6px_rgba(15,23,42,0.18)] ring-1 ring-neutral-100/80 transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_-10px_rgba(15,23,42,0.22)] active:scale-[0.96]",
              btn,
            )}
          >
            <SocialIcon network={link.network} className={cn("h-5 w-5", iconClass)} />
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
