import Image from "next/image";
import Link from "next/link";

type Props = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  href?: string;
  className?: string;
};

const sizes = {
  sm: { mark: 28, text: "text-base", tagline: "text-[11px]" },
  md: { mark: 36, text: "text-lg", tagline: "text-xs" },
  lg: { mark: 48, text: "text-xl sm:text-2xl", tagline: "text-sm" },
};

export function BrandLogo({ size = "md", showTagline = false, href, className = "" }: Props) {
  const s = sizes[size];
  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image
        src="/brand/logo-mark.svg"
        alt=""
        width={s.mark}
        height={s.mark}
        className="shrink-0"
        priority
      />
      <span className="flex flex-col items-start leading-none">
        <span className={`font-[family-name:var(--font-brand)] font-bold tracking-tight text-[#1A1C23] ${s.text}`}>
          MyTeamSpace
        </span>
        {showTagline ? (
          <span className={`mt-1 font-normal text-neutral-500 ${s.tagline}`}>
            Everything your team needs. In one space.
          </span>
        ) : null}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="transition opacity-100 hover:opacity-90">
        {inner}
      </Link>
    );
  }
  return inner;
}
