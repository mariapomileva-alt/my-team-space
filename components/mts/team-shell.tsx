import type { TeamSpace, ThemeId } from "@/lib/types";
import { getTheme } from "@/lib/themes";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  themeId: ThemeId;
  children: ReactNode;
  className?: string;
  /** Builder live preview — no full-viewport min height */
  preview?: boolean;
  /** Applies stored constructor palette on top of the theme preset. */
  team?: Pick<TeamSpace, "primaryColor" | "secondaryColor">;
};

export function TeamShell({ themeId, children, className, preview, team }: Props) {
  const theme = getTheme(themeId);
  const style = {
    ...theme.cssVars,
    ...(team?.primaryColor?.trim() ? { "--mts-primary": team.primaryColor.trim() } : {}),
    ...(team?.secondaryColor?.trim() ? { "--mts-accent": team.secondaryColor.trim() } : {}),
  } as CSSProperties;

  return (
    <div
      className={`mts-shell ${preview ? "mts-shell--preview" : "min-h-screen"} ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
