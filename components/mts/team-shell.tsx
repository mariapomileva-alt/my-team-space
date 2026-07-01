import type { TeamSpace, ThemeId } from "@/lib/types";
import { getTheme } from "@/lib/themes";
import { resolvePaletteThemeId } from "@/lib/team-color-palettes";
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
  /** Palette (themeId) + personality tokens on the public shell. */
  team?: Pick<TeamSpace, "primaryColor" | "secondaryColor" | "pageSettings" | "themeId">;
};

export function TeamShell({ themeId, children, className, preview, team }: Props) {
  const paletteId = resolvePaletteThemeId(team?.themeId ?? themeId);
  const designStyle = resolveDesignStyle(team?.pageSettings, paletteId);
  const theme = getTheme(paletteId);
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
