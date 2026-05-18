export type BuilderSaveState = "idle" | "saving" | "saved" | "error";

export function formatBuilderSaveLabel(
  saveState: BuilderSaveState,
  lastSaved: Date | null,
  now = new Date(),
): string {
  if (saveState === "saving") return "Saving…";
  if (saveState === "error") return "Couldn't save — try again";
  if (!lastSaved) return "Draft — changes autosave";
  const sec = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
  if (sec < 8) return "Saved just now";
  if (sec < 60) return `Saved ${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `Saved ${min}m ago`;
  return `Last saved ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}
