import { cn } from "@/lib/utils/cn";
import type { ReactNode } from "react";

type FrameProps = {
  src?: string | null;
  alt?: string;
  role: "logo" | "cover" | "gallery" | "shop" | "avatar";
  className?: string;
  imgClassName?: string;
  fallback?: ReactNode;
};

const ROLE_FRAME: Record<FrameProps["role"], string> = {
  logo: "mts-media-frame mts-media-frame--logo",
  cover: "mts-media-frame mts-media-frame--cover",
  gallery: "mts-media-frame mts-media-frame--gallery",
  shop: "mts-media-frame mts-media-frame--shop",
  avatar: "mts-media-frame mts-media-frame--avatar",
};

const ROLE_IMG: Record<FrameProps["role"], string> = {
  logo: "mts-media-frame__img mts-media-frame__img--contain",
  cover: "mts-media-frame__img mts-media-frame__img--cover",
  gallery: "mts-media-frame__img mts-media-frame__img--cover",
  shop: "mts-media-frame__img mts-media-frame__img--cover",
  avatar: "mts-media-frame__img mts-media-frame__img--cover",
};

export function MtsMediaFrame({ src, alt = "", role, className, imgClassName, fallback }: FrameProps) {
  const url = src?.trim();
  return (
    <div className={cn(ROLE_FRAME[role], className)}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} className={cn(ROLE_IMG[role], imgClassName)} loading="lazy" />
      ) : (
        fallback
      )}
    </div>
  );
}

export function MtsTeamLogo({
  src,
  teamName,
  className,
  bordered = true,
}: {
  src?: string | null;
  teamName: string;
  className?: string;
  bordered?: boolean;
}) {
  const initial = teamName.slice(0, 1).toUpperCase() || "?";
  return (
    <MtsMediaFrame
      src={src}
      role="logo"
      className={cn(
        bordered && "mts-media-frame--logo-bordered",
        className,
      )}
      fallback={
        <span className="mts-media-frame__logo-fallback" aria-hidden>
          {initial}
        </span>
      }
    />
  );
}

export function MtsCoverBanner({
  src,
  className,
  fallbackClassName,
}: {
  src?: string | null;
  className?: string;
  fallbackClassName?: string;
}) {
  const url = src?.trim();
  if (!url) {
    return <div className={cn("mts-media-frame mts-media-frame--cover mts-media-frame--cover-fallback", fallbackClassName, className)} aria-hidden />;
  }
  return <MtsMediaFrame src={url} role="cover" className={className} />;
}

export function MtsGalleryPhoto({
  src,
  alt = "",
  className,
}: {
  src: string;
  alt?: string;
  className?: string;
}) {
  return <MtsMediaFrame src={src} alt={alt} role="gallery" className={className} />;
}

export function MtsShopPhoto({
  src,
  alt = "",
  className,
  fallback,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
  fallback?: ReactNode;
}) {
  return <MtsMediaFrame src={src} alt={alt} role="shop" className={className} fallback={fallback} />;
}
