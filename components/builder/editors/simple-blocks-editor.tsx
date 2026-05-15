"use client";

import type { BlockInstance, BlockType } from "@/lib/types";
import {
  getBlockSettings,
  newCampItem,
  newContactItem,
  newDocumentItem,
  newFeedPost,
  newResultItem,
  newSponsorItem,
  type CountdownSettings,
  type PollSettings,
  type WeatherSettings,
} from "@/lib/blocks/settings";
import { ListItemsEditor } from "./list-items-editor";

export function SimpleBlocksEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  switch (block.type) {
    case "results":
      return (
        <ListItemsEditor
          block={block}
          onPatchBlock={onPatchBlock}
          fields={[
            { key: "emoji", label: "Medal", placeholder: "🥇", className: "max-w-[4rem]" },
            { key: "name", label: "Name", placeholder: "Athlete" },
            { key: "subtitle", label: "Place", placeholder: "Gold" },
          ]}
          addLabel="+ Add result"
          emptyHint="Podium cards — only what you add appears on the page."
          makeItem={newResultItem}
        />
      );
    case "contacts":
      return (
        <ListItemsEditor
          block={block}
          onPatchBlock={onPatchBlock}
          fields={[
            { key: "name", label: "Name", placeholder: "Coach Anna" },
            { key: "role", label: "Role", placeholder: "Head coach" },
            { key: "url", label: "Phone / link", placeholder: "tel:+371..." },
          ]}
          addLabel="+ Add contact"
          emptyHint="Parents only see contacts you list here."
          makeItem={newContactItem}
        />
      );
    case "documents":
      return (
        <ListItemsEditor
          block={block}
          onPatchBlock={onPatchBlock}
          fields={[
            { key: "title", label: "Document", placeholder: "Team rules PDF" },
            { key: "url", label: "Link", placeholder: "https://..." },
          ]}
          addLabel="+ Add document"
          emptyHint="Link to PDFs or Google Drive files."
          makeItem={newDocumentItem}
        />
      );
    case "team_feed":
      return (
        <ListItemsEditor
          block={block}
          onPatchBlock={onPatchBlock}
          fields={[
            { key: "title", label: "Post title", placeholder: "Great practice today" },
            { key: "body", label: "Details", placeholder: "Optional note for parents" },
          ]}
          addLabel="+ Add post"
          emptyHint="Short updates — like a mini news feed."
          makeItem={newFeedPost}
        />
      );
    case "camp_trip":
      return (
        <ListItemsEditor
          block={block}
          onPatchBlock={onPatchBlock}
          fields={[
            { key: "title", label: "Title", placeholder: "Bus seats" },
            { key: "body", label: "Info", placeholder: "12 / 15 confirmed" },
          ]}
          addLabel="+ Add trip detail"
          emptyHint="Camp, bus, packing list — anything families need."
          makeItem={newCampItem}
        />
      );
    case "sponsors":
      return (
        <ListItemsEditor
          block={block}
          onPatchBlock={onPatchBlock}
          fields={[
            { key: "name", label: "Partner", placeholder: "Local shop" },
            { key: "url", label: "Website", placeholder: "https://..." },
          ]}
          addLabel="+ Add partner"
          emptyHint="Thank sponsors — name only if no link."
          makeItem={newSponsorItem}
        />
      );
    case "polls":
      return <PollEditor block={block} onPatchBlock={onPatchBlock} />;
    case "countdown":
      return <CountdownEditor block={block} onPatchBlock={onPatchBlock} />;
    case "weather":
      return <WeatherEditor block={block} onPatchBlock={onPatchBlock} />;
    default:
      return null;
  }
}

function PollEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<PollSettings>(block);
  const set = (patch: Partial<PollSettings>) => onPatchBlock(block.id, { settings: { ...s, ...patch } });
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-zinc-500">Question</label>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        value={s.question}
        onChange={(e) => set({ question: e.target.value })}
        placeholder="Who is coming Saturday?"
      />
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        value={s.optionYes}
        onChange={(e) => set({ optionYes: e.target.value })}
        placeholder="Yes button"
      />
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        value={s.optionNo}
        onChange={(e) => set({ optionNo: e.target.value })}
        placeholder="No button"
      />
    </div>
  );
}

function CountdownEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<CountdownSettings>(block);
  const set = (patch: Partial<CountdownSettings>) => onPatchBlock(block.id, { settings: { ...s, ...patch } });
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-zinc-500">Event name</label>
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        value={s.label}
        onChange={(e) => set({ label: e.target.value })}
      />
      <label className="block text-xs font-semibold text-zinc-500">Date</label>
      <input
        type="date"
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        value={s.targetDate}
        onChange={(e) => set({ targetDate: e.target.value })}
      />
    </div>
  );
}

function WeatherEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, patch: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<WeatherSettings>(block);
  const set = (patch: Partial<WeatherSettings>) => onPatchBlock(block.id, { settings: { ...s, ...patch } });
  return (
    <div className="space-y-2">
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        placeholder="Temperature, e.g. 18°"
        value={s.temp}
        onChange={(e) => set({ temp: e.target.value })}
      />
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        placeholder="Location"
        value={s.location}
        onChange={(e) => set({ location: e.target.value })}
      />
      <input
        className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
        placeholder="Note, e.g. Light wind"
        value={s.note}
        onChange={(e) => set({ note: e.target.value })}
      />
    </div>
  );
}
