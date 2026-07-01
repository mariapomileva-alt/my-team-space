"use client";

import { createContext, useContext } from "react";

type BuilderSaveApi = {
  /** Persist current builder state immediately (e.g. right after media upload). */
  flushSave: () => void;
};

const BuilderSaveContext = createContext<BuilderSaveApi | null>(null);

export function BuilderSaveProvider({
  flushSave,
  children,
}: {
  flushSave: () => void;
  children: React.ReactNode;
}) {
  return <BuilderSaveContext.Provider value={{ flushSave }}>{children}</BuilderSaveContext.Provider>;
}

export function useBuilderFlushSave(): BuilderSaveApi | null {
  return useContext(BuilderSaveContext);
}
