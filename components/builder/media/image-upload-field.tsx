"use client";

import { processImageFile } from "@/lib/media/compress-image";
import {
  displayRoleForUpload,
  presetForUpload,
  uploadHintForPreset,
} from "@/lib/media/image-presets";
import { MtsMediaFrame } from "@/components/mts/media/mts-media";
import { cn } from "@/lib/utils/cn";
import { useCallback, useRef, useState } from "react";

type Props = {
  teamId: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  aspect?: "square" | "wide" | "portrait" | "auto";
  hint?: string;
};

const PREVIEW_FRAME: Record<ReturnType<typeof displayRoleForUpload>, string> = {
  logo: "max-w-[140px]",
  cover: "w-full",
  gallery: "max-w-[180px]",
  shop: "max-w-[140px]",
  avatar: "max-w-[88px]",
};

export function ImageUploadField({
  teamId,
  label,
  value,
  onChange,
  folder = "media",
  aspect = "auto",
  hint,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  const preset = presetForUpload(folder, aspect);
  const displayRole = displayRoleForUpload(folder, aspect);
  const autoHint = uploadHintForPreset(preset, folder);
  const previewClass = PREVIEW_FRAME[displayRole];

  const uploadFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);
      try {
        const { blob, mime, extension } = await processImageFile(file, preset);
        const out = new File([blob], `upload.${extension}`, { type: mime });
        const body = new FormData();
        body.append("file", out);
        body.append("folder", folder);
        const res = await fetch(`/api/admin/teams/${teamId}/upload`, { method: "POST", body });
        const data = (await res.json()) as { url?: string; error?: string };
        if (!res.ok || !data.url) throw new Error(data.error ?? "Upload failed");
        onChange(data.url);
        setUrlDraft("");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange, preset, teamId],
  );

  async function onPick(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    await uploadFile(file);
  }

  function applyUrl() {
    const u = urlDraft.trim();
    if (u) onChange(u);
  }

  return (
    <div className="space-y-2">
      <span className="block text-xs font-semibold text-zinc-500">{label}</span>
      {hint ? <p className="text-[11px] leading-snug text-zinc-400">{hint}</p> : null}
      <p className="text-[11px] leading-snug text-zinc-400">{autoHint}</p>

      {value?.trim() ? (
        <div className={cn("relative", previewClass)}>
          <MtsMediaFrame src={value} role={displayRole} className="rounded-2xl border border-zinc-200/90 shadow-sm" />
          <div className="absolute inset-x-0 bottom-0 flex gap-1 rounded-b-2xl bg-gradient-to-t from-black/50 to-transparent p-2">
            <button
              type="button"
              className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-zinc-800"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </button>
            <button
              type="button"
              className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-red-700"
              onClick={() => onChange("")}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void onPick(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
            dragOver
              ? "border-indigo-400 bg-indigo-50/80"
              : "border-zinc-200 bg-zinc-50/50 hover:border-indigo-300 hover:bg-indigo-50/40"
          }`}
        >
          <span className="text-2xl" aria-hidden>
            📤
          </span>
          <span className="mt-2 text-xs font-bold text-zinc-700">
            {uploading ? "Uploading…" : "Upload from device"}
          </span>
          <span className="mt-1 text-[11px] text-zinc-500">or drag & drop</span>
        </div>
      )}

      <div className="flex gap-2">
        <input
          className="min-w-0 flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="Or paste image URL"
          value={urlDraft}
          onChange={(e) => setUrlDraft(e.target.value)}
          onBlur={() => {
            if (urlDraft.trim()) applyUrl();
          }}
        />
        <button
          type="button"
          onClick={applyUrl}
          className="shrink-0 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold text-indigo-700"
        >
          Use URL
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => void onPick(e.target.files)}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
