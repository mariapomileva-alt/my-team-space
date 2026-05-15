"use client";

import type { PollSettings } from "@/lib/blocks/settings";
import { useEffect, useState } from "react";

const NAME_KEY = "mts_voter_name";

export function PollVote({
  teamSlug,
  blockId,
  settings,
}: {
  teamSlug: string;
  blockId: string;
  settings: PollSettings;
}) {
  const q = settings.question?.trim();
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [choiceLabel, setChoiceLabel] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [autoNotified, setAutoNotified] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(NAME_KEY);
    if (saved) setName(saved);
    const voted = localStorage.getItem(`mts_poll_${blockId}`);
    if (voted) {
      setStatus("done");
      setChoiceLabel(voted);
    }
  }, [blockId]);

  async function vote(choice: "yes" | "no", label: string) {
    const voterName = name.trim();
    if (!voterName) {
      setHint("Введите имя — тренеру будет понятно, кто голосовал.");
      return;
    }
    setHint(null);
    setStatus("loading");
    localStorage.setItem(NAME_KEY, voterName);

    try {
      const res = await fetch(`/api/teams/${encodeURIComponent(teamSlug)}/poll-vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockId,
          voterName,
          choice,
          question: q,
          optionLabel: label,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        notified?: boolean;
        whatsappUrl?: string | null;
      };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setHint(data.error ?? "Не удалось отправить. Попробуйте ещё раз.");
        return;
      }
      localStorage.setItem(`mts_poll_${blockId}`, label);
      setChoiceLabel(label);
      setAutoNotified(Boolean(data.notified));
      setWhatsappUrl(data.whatsappUrl ?? null);
      setStatus("done");

      if (!data.notified && data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      setStatus("error");
      setHint("Нет сети. Проверьте интернет и попробуйте снова.");
    }
  }

  if (!q) return null;

  if (status === "done") {
    return (
      <div className="space-y-3 rounded-2xl bg-emerald-50 px-4 py-3 text-center">
        <p className="text-sm font-semibold text-emerald-800">Спасибо, {name.trim()}!</p>
        <p className="text-xs text-emerald-700">
          Ваш ответ: <strong>{choiceLabel}</strong>
        </p>
        {autoNotified ? (
          <p className="text-xs text-emerald-700">Тренер получил SMS/WhatsApp.</p>
        ) : whatsappUrl ? (
          <>
            <p className="text-xs text-emerald-800">
              Голос сохранён. Нажмите «Отправить» в WhatsApp — это бесплатно.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#25D366] px-5 text-sm font-semibold text-white"
            >
              Написать тренеру в WhatsApp
            </a>
          </>
        ) : (
          <p className="text-xs text-emerald-700">Голос сохранён — тренер увидит ответ в админке.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-[color:var(--mts-muted)]">{q}</p>
      <label className="block text-xs font-semibold text-[color:var(--mts-muted)]">Ваше имя</label>
      <input
        className="w-full rounded-xl border border-[color:var(--mts-card-border)] px-3 py-2.5 text-sm"
        placeholder="например, мама Эммы"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={status === "loading"}
      />
      {hint ? <p className="text-xs text-amber-700">{hint}</p> : null}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={status === "loading"}
          onClick={() => vote("yes", settings.optionYes || "I'm in")}
          className="min-h-11 flex-1 rounded-2xl bg-[var(--mts-primary)] font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
        >
          {status === "loading" ? "…" : settings.optionYes || "I'm in"}
        </button>
        <button
          type="button"
          disabled={status === "loading"}
          onClick={() => vote("no", settings.optionNo || "Can't make it")}
          className="min-h-11 flex-1 rounded-2xl border-2 border-[color:var(--mts-card-border)] font-semibold transition active:scale-[0.98] disabled:opacity-50"
        >
          {settings.optionNo || "Can't make it"}
        </button>
      </div>
    </div>
  );
}
