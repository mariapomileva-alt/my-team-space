"use client";

import { ImageUploadField } from "@/components/builder/media/image-upload-field";
import type { BlockInstance } from "@/lib/types";
import { getBlockSettings, newGalleryImage, type GalleryImage } from "@/lib/blocks/settings";

type S = { mode: "manual" | "external"; images: GalleryImage[]; externalUrl: string };

export function GalleryEditor({
  block,
  teamId,
  onPatchBlock,
}: {
  block: BlockInstance;
  teamId: string;
  onPatchBlock: (id: string, p: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<S>(block);
  const set = (patch: Partial<S>) => onPatchBlock(block.id, { settings: { ...s, ...patch } });
  const images = s.images ?? [];

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["manual", "external"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => set({ mode })}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${s.mode === mode ? "bg-indigo-600 text-white" : "border border-zinc-200"}`}
          >
            {mode === "manual" ? "Upload photos" : "External album"}
          </button>
        ))}
      </div>
      {s.mode === "external" ? (
        <input
          className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          placeholder="Google Photos / Drive shared link"
          value={s.externalUrl}
          onChange={(e) => set({ externalUrl: e.target.value })}
        />
      ) : (
        <>
          {images.map((img) => (
            <div key={img.id} className="space-y-2 rounded-xl border border-zinc-100 bg-white p-3">
              <ImageUploadField
                teamId={teamId}
                label="Photo"
                folder="gallery"
                value={img.url}
                onChange={(url) =>
                  set({ images: images.map((x) => (x.id === img.id ? { ...x, url } : x)) })
                }
              />
              <input
                className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
                placeholder="Caption (optional)"
                value={img.caption ?? ""}
                onChange={(e) =>
                  set({ images: images.map((x) => (x.id === img.id ? { ...x, caption: e.target.value } : x)) })
                }
              />
              <button
                type="button"
                className="text-xs text-red-600"
                onClick={() => set({ images: images.filter((x) => x.id !== img.id) })}
              >
                Remove photo
              </button>
            </div>
          ))}
          <button
            type="button"
            className="text-xs font-semibold text-indigo-700"
            onClick={() => set({ images: [...images, newGalleryImage()] })}
          >
            + Add photo
          </button>
        </>
      )}
    </div>
  );
}
