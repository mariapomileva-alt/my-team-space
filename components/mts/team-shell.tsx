import type { TeamSpace, ThemeId } from "@/lib/types";
import { getTheme } from "@/lib/themes";
import {
  designStyleClassName,
  designStyleCssVars,
  resolveDesignStyle,
} from "@/lib/team-page-styles";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  themeId: ThemeId;
  children: ReactNode;
  className?: string;
  /** Builder live preview — no full-viewport min height */
  preview?: boolean;
  /** Applies stored constructor palette and page style on top of the theme preset. */
  team?: Pick<TeamSpace, "primaryColor" | "secondaryColor" | "pageSettings">;
};

export function TeamShell({ themeId, children, className, preview, team }: Props) {
  const theme = getTheme(themeId);
  const designStyle = resolveDesignStyle(team?.pageSettings);
  const style = {
    ...theme.cssVars,
    ...designStyleCssVars(designStyle),
    ...(team?.primaryColor?.trim() ? { "--mts-primary": team.primaryColor.trim() } : {}),
    ...(team?.secondaryColor?.trim() ? { "--mts-accent": team.secondaryColor.trim() } : {}),
  } as CSSProperties;

  return (
    <div
      className={`mts-shell ${designStyleClassName(designStyle)} ${preview ? "mts-shell--preview" : "min-h-screen"} ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
