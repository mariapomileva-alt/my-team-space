"use client";
import type { BlockInstance } from "@/lib/types";
import { DAY_LABELS, getBlockSettings, newManualScheduleEvent, type ManualScheduleEvent } from "@/lib/blocks/settings";

type S = { mode: "manual" | "external"; events: ManualScheduleEvent[]; externalUrl: string };

export function ScheduleEditor({ block, onPatchBlock }: { block: BlockInstance; onPatchBlock: (id: string, p: Partial<BlockInstance>) => void }) {
  const s = getBlockSettings<S>(block);
  const set = (patch: Partial<S>) => onPatchBlock(block.id, { settings: { ...s, ...patch } });
  const events = s.events ?? [];

  function updateEvent(id: string, patch: Partial<ManualScheduleEvent>) {
    set({ events: events.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["manual", "external"] as const).map((mode) => (
          <button key={mode} type="button" onClick={() => set({ mode })} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${s.mode === mode ? "bg-indigo-600 text-white" : "border border-zinc-200"}`}>
            {mode === "manual" ? "Manual schedule" : "Google / iCal link"}
          </button>
        ))}
      </div>
      {s.mode === "external" ? (
        <input className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm" placeholder="https://calendar.google.com/..." value={s.externalUrl} onChange={(e) => set({ externalUrl: e.target.value })} />
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="rounded-2xl border border-zinc-200 bg-white p-3 space-y-2">
              <input className="w-full rounded-lg border border-zinc-100 px-2 py-1.5 text-sm font-semibold" value={ev.title} onChange={(e) => updateEvent(ev.id, { title: e.target.value })} />
              <div className="grid grid-cols-2 gap-2">
                <select className="rounded-lg border border-zinc-100 px-2 py-1.5 text-xs" value={ev.eventType} onChange={(e) => updateEvent(ev.id, { eventType: e.target.value as ManualScheduleEvent["eventType"] })}>
                  <option value="training">Training</option>
                  <option value="competition">Competition</option>
                  <option value="camp">Camp</option>
                  <option value="meeting">Meeting</option>
                </select>
                <select className="rounded-lg border border-zinc-100 px-2 py-1.5 text-xs" value={ev.dayOfWeek} onChange={(e) => updateEvent(ev.id, { dayOfWeek: Number(e.target.value) })}>
                  {DAY_LABELS.map((d, i) => (<option key={d} value={i}>{d}</option>))}
                </select>
                <input className="rounded-lg border border-zinc-100 px-2 py-1.5 text-xs" value={ev.time} onChange={(e) => updateEvent(ev.id, { time: e.target.value })} />
                <input className="rounded-lg border border-zinc-100 px-2 py-1.5 text-xs" placeholder="Location" value={ev.location} onChange={(e) => updateEvent(ev.id, { location: e.target.value })} />
              </div>
              <select className="w-full rounded-lg border border-zinc-100 px-2 py-1.5 text-xs" value={ev.repeat} onChange={(e) => updateEvent(ev.id, { repeat: e.target.value as ManualScheduleEvent["repeat"] })}>
                <option value="none">Does not repeat</option>
                <option value="weekly">Every week</option>
                <option value="biweekly">Every 2 weeks</option>
                <option value="monthly">Every month</option>
              </select>
              <button type="button" className="text-xs text-red-600" onClick={() => set({ events: events.filter((x) => x.id !== ev.id) })}>Remove</button>
            </div>
          ))}
          <button type="button" className="rounded-full border border-dashed border-indigo-300 px-4 py-2 text-xs font-semibold text-indigo-700" onClick={() => set({ events: [...events, newManualScheduleEvent()] })}>+ Add recurring event</button>
        </div>
      )}
    </div>
  );
}
