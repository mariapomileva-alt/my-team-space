import type { ThemeId } from "@/lib/types";
import { getTheme } from "@/lib/themes";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  themeId: ThemeId;
  children: ReactNode;
  className?: string;
};

export function TeamShell({ themeId, children, className }: Props) {
  const theme = getTheme(themeId);
  const style = theme.cssVars as CSSProperties;

  return (
    <div className={`mts-shell min-h-screen ${className ?? ""}`} style={style}>
      {children}
    </div>
  );
}
