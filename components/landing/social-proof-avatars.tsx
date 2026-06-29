/** Curated Unsplash portraits for landing social proof (faces crop). */
const face = (id: string) =>
  `https://images.unsplash.com/${id}?w=80&h=80&fit=crop&crop=faces&auto=format&q=80`;

export type SocialProofVariant = "coaches" | "parents" | "kids" | "mixed";

const FACES: Record<SocialProofVariant, readonly string[]> = {
  coaches: [
    face("photo-1573496359142-b8d87734a5a2"),
    face("photo-1560250097-0b93528c311a"),
    face("photo-1519085360753-af0119f7cbe7"),
    face("photo-1580489944761-15a19d654956"),
  ],
  parents: [
    face("photo-1524504388940-b1c1722653e1"),
    face("photo-1507003211169-0a1dd7228f2d"),
    face("photo-1438761681033-6461ffad8d80"),
    face("photo-1500648767791-00dcc994a43e"),
  ],
  kids: [
    face("photo-1521572163474-6864f9cf17ab"),
    face("photo-1503454537195-1dcabb73ffb9"),
    face("photo-1544776193-352d25ca82cd"),
    face("photo-1504609773096-104ff2c73ba4"),
  ],
  mixed: [
    face("photo-1573496359142-b8d87734a5a2"),
    face("photo-1524504388940-b1c1722653e1"),
    face("photo-1521572163474-6864f9cf17ab"),
    face("photo-1500648767791-00dcc994a43e"),
  ],
};

const LABELS: Record<SocialProofVariant, string> = {
  coaches: "Coaches across football, dance & swim",
  parents: "One link parents actually open",
  kids: "Kids show off badges & trophies",
  mixed: "Loved by coaches & families",
};

export function SocialProofAvatars({
  variant = "mixed",
  className = "",
  label,
  hideLabel = false,
  size = "md",
}: {
  variant?: SocialProofVariant;
  className?: string;
  /** Override default variant label */
  label?: string;
  hideLabel?: boolean;
  size?: "sm" | "md";
}) {
  const faces = FACES[variant];
  const caption = label ?? LABELS[variant];
  const avatarClass =
    size === "sm"
      ? "h-5 w-5 shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
      : "h-8 w-8 shadow-[0_1px_4px_rgba(0,0,0,0.12)]";
  const dim = size === "sm" ? 20 : 32;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className={`flex shrink-0 ${size === "sm" ? "-space-x-1.5" : "-space-x-2"}`} aria-hidden>
        {faces.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element -- external Unsplash avatars
          <img
            key={src}
            src={src}
            alt=""
            width={dim}
            height={dim}
            loading="lazy"
            decoding="async"
            className={`inline-block rounded-full object-cover ring-2 ring-white ${avatarClass}`}
            style={{ zIndex: faces.length - i }}
          />
        ))}
      </span>
      {!hideLabel ? (
        <span className="text-[11px] font-medium leading-snug text-neutral-500">{caption}</span>
      ) : null}
    </div>
  );
}
