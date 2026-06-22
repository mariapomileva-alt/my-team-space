"use client";

import { BUILDER_FIELD_INPUT } from "@/lib/builder/layout";
import type { BlockInstance } from "@/lib/types";
import {
  DAY_LABELS,
  getBlockSettings,
  newManualScheduleEvent,
  type ManualScheduleEvent,
} from "@/lib/blocks/settings";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

type S = { mode: "manual" | "external"; events: ManualScheduleEvent[]; externalUrl: string };

export function ScheduleEditor({
  block,
  onPatchBlock,
}: {
  block: BlockInstance;
  onPatchBlock: (id: string, p: Partial<BlockInstance>) => void;
}) {
  const s = getBlockSettings<S>(block);
  const set = (patch: Partial<S>) => onPatchBlock(block.id, { settings: { ...s, ...patch } });
  const events = s.events ?? [];
  const [advancedOpen, setAdvancedOpen] = useState(
    () => s.mode === "external" || events.some((e) => e.repeat !== "weekly" || e.eventType !== "training"),
  );

  function updateEvent(id: string, patch: Partial<ManualScheduleEvent>) {
    set({ events: events.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  }

  function addQuickEvent() {
    set({ events: [...events, newManualScheduleEvent()], mode: "manual" });
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-zinc-500">
        Add when and where families should show up. One session is enough to publish.
      </p>

      {!advancedOpen ? (
        <div className="space-y-3">
          {events.length === 0 ? (
            <QuickSessionForm
              onSave={(dayOfWeek, time, location) => {
                const ev = newManualScheduleEvent();
                set({
                  mode: "manual",
                  events: [{ ...ev, dayOfWeek, time, location, title: "Training", repeat: "weekly" }],
                });
              }}
            />
          ) : (
            <>
              {events.map((ev) => (
                <QuickSessionRow key={ev.id} event={ev} onChange={(patch) => updateEvent(ev.id, patch)} onRemove={() => set({ events: events.filter((x) => x.id !== ev.id) })} />
              ))}
              <button
                type="button"
                className="w-full rounded-full border border-dashed border-indigo-300 px-4 py-2.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50/60"
                onClick={addQuickEvent}
              >
                + Add another session
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(["manual", "external"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => set({ mode })}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${s.mode === mode ? "bg-indigo-600 text-white" : "border border-zinc-200"}`}
              >
                {mode === "manual" ? "Manual schedule" : "Google / iCal link"}
              </button>
            ))}
          </div>
          {s.mode === "external" ? (
            <input
              className={cn(BUILDER_FIELD_INPUT, "text-sm")}
              placeholder="https://calendar.google.com/..."
              value={s.externalUrl}
              onChange={(e) => set({ externalUrl: e.target.value })}
            />
          ) : (
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="space-y-2 rounded-2xl border border-zinc-200 bg-white p-3">
                  <input
                    className="w-full rounded-lg border border-zinc-100 px-2 py-1.5 text-sm font-semibold"
                    value={ev.title}
                    onChange={(e) => updateEvent(ev.id, { title: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="rounded-lg border border-zinc-100 px-2 py-1.5 text-xs"
                      value={ev.eventType}
                      onChange={(e) =>
                        updateEvent(ev.id, { eventType: e.target.value as ManualScheduleEvent["eventType"] })
                      }
                    >
                      <option value="training">Training</option>
                      <option value="competition">Competition</option>
                      <option value="camp">Camp</option>
                      <option value="meeting">Meeting</option>
                    </select>
                    <select
                      className="rounded-lg border border-zinc-100 px-2 py-1.5 text-xs"
                      value={ev.dayOfWeek}
                      onChange={(e) => updateEvent(ev.id, { dayOfWeek: Number(e.target.value) })}
                    >
                      {DAY_LABELS.map((d, i) => (
                        <option key={d} value={i}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <input
                      className="rounded-lg border border-zinc-100 px-2 py-1.5 text-xs"
                      value={ev.time}
                      onChange={(e) => updateEvent(ev.id, { time: e.target.value })}
                    />
                    <input
                      className="rounded-lg border border-zinc-100 px-2 py-1.5 text-xs"
                      placeholder="Location"
                      value={ev.location}
                      onChange={(e) => updateEvent(ev.id, { location: e.target.value })}
                    />
                  </div>
                  <select
                    className="w-full rounded-lg border border-zinc-100 px-2 py-1.5 text-xs"
                    value={ev.repeat}
                    onChange={(e) => updateEvent(ev.id, { repeat: e.target.value as ManualScheduleEvent["repeat"] })}
                  >
                    <option value="none">Does not repeat</option>
                    <option value="weekly">Every week</option>
                    <option value="biweekly">Every 2 weeks</option>
                    <option value="monthly">Every month</option>
                  </select>
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => set({ events: events.filter((x) => x.id !== ev.id) })}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="rounded-full border border-dashed border-indigo-300 px-4 py-2 text-xs font-semibold text-indigo-700"
                onClick={addQuickEvent}
              >
                + Add recurring event
              </button>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setAdvancedOpen((v) => !v)}
        className="text-[11px] font-semibold text-zinc-500 transition hover:text-violet-700"
      >
        {advancedOpen ? "← Back to quick schedule" : "Advanced options (Google Calendar, event types, repeats)"}
      </button>
    </div>
  );
}

function QuickSessionForm({
  onSave,
}: {
  onSave: (dayOfWeek: number, time: string, location: string) => void;
}) {
  const [dayOfWeek, setDayOfWeek] = useState(2);
  const [time, setTime] = useState("18:00");
  const [location, setLocation] = useState("");

  return (
    <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/30 p-4 space-y-3">
      <p className="text-sm font-semibold text-zinc-900">First training session</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-zinc-500">Day</span>
          <select
            className={cn(BUILDER_FIELD_INPUT, "text-sm")}
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(Number(e.target.value))}
          >
            {DAY_LABELS.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-zinc-500">Time</span>
          <input
            className={cn(BUILDER_FIELD_INPUT, "text-sm")}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <label className="block sm:col-span-1">
          <span className="mb-1 block text-[11px] font-semibold text-zinc-500">Location</span>
          <input
            className={cn(BUILDER_FIELD_INPUT, "text-sm")}
            placeholder="Main hall"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
      </div>
      <button
        type="button"
        onClick={() => onSave(dayOfWeek, time, location)}
        className="w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
      >
        Save session
      </button>
    </div>
  );
}

function QuickSessionRow({
  event,
  onChange,
  onRemove,
}: {
  event: ManualScheduleEvent;
  onChange: (patch: Partial<ManualScheduleEvent>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-3 sm:grid-cols-[1fr_1fr_1.2fr_auto] sm:items-end">
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold text-zinc-500">Day</span>
        <select
          className={cn(BUILDER_FIELD_INPUT, "text-sm")}
          value={event.dayOfWeek}
          onChange={(e) => onChange({ dayOfWeek: Number(e.target.value) })}
        >
          {DAY_LABELS.map((d, i) => (
            <option key={d} value={i}>
              {d}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold text-zinc-500">Time</span>
        <input
          className={cn(BUILDER_FIELD_INPUT, "text-sm")}
          value={event.time}
          onChange={(e) => onChange({ time: e.target.value })}
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-[11px] font-semibold text-zinc-500">Location</span>
        <input
          className={cn(BUILDER_FIELD_INPUT, "text-sm")}
          placeholder="Main hall"
          value={event.location}
          onChange={(e) => onChange({ location: e.target.value })}
        />
      </label>
      <button type="button" onClick={onRemove} className="pb-2 text-xs font-medium text-red-600 sm:pb-2.5">
        Remove
      </button>
    </div>
  );
}
