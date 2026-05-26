import type { ThemeId } from "@/lib/types";
import { getTheme } from "@/lib/themes";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  themeId: ThemeId;
  children: ReactNode;
  className?: string;
  /** Builder live preview — no full-viewport min height */
  preview?: boolean;
};

export function TeamShell({ themeId, children, className, preview }: Props) {
  const theme = getTheme(themeId);
  const style = theme.cssVars as CSSProperties;

  return (
    <div
      className={`mts-shell ${preview ? "mts-shell--preview" : "min-h-screen"} ${className ?? ""}`}
      style={style}
    >
      {children}
    </div>
  );
}
