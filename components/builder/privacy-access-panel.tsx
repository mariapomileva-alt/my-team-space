"use client";

import { BUILDER_PANEL_SURFACE } from "@/lib/builder/layout";
import { magicInviteUrl } from "@/lib/team-access";
import type { TeamSpace, TeamVisibility } from "@/lib/types";

function genToken() {
  return Math.random().toString(36).slice(2, 10);
}

export function PrivacyAccessPanel({
  team,
  siteUrl,
  onPatchTeam,
}: {
  team: TeamSpace;
  siteUrl: string;
  onPatchTeam: (patch: Partial<TeamSpace>) => void;
}) {
  const visibility = team.pageVisibility ?? "public";
  const settings = team.pageSettings ?? {};
  const invite = team.inviteToken ?? "";
  const inviteLink = invite ? magicInviteUrl(siteUrl, team.slug, invite) : "";

  function setVisibility(v: TeamVisibility) {
    onPatchTeam({ pageVisibility: v });
  }

  function patchSettings(patch: Partial<typeof settings>) {
    onPatchTeam({ pageSettings: { ...settings, ...patch } });
  }

  return (
    <section className={BUILDER_PANEL_SURFACE}>
      <h2 className="text-sm font-bold tracking-tight text-zinc-900">Privacy & access</h2>
      <p className="mt-1 text-sm text-zinc-500">
        No parent passwords. Use a team code or magic link — like a private clubhouse door.
      </p>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {(
          [
            { id: "public" as const, label: "Public", hint: "Anyone with the link" },
            { id: "private" as const, label: "Private", hint: "Code or invite only" },
            { id: "mixed" as const, label: "Mixed", hint: "Some blocks stay public" },
          ] as const
        ).map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setVisibility(opt.id)}
            className={`rounded-2xl border p-3 text-left text-sm transition ${
              visibility === opt.id ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-100" : "border-zinc-200"
            }`}
          >
            <span className="font-semibold">{opt.label}</span>
            <span className="mt-0.5 block text-xs text-zinc-500">{opt.hint}</span>
          </button>
        ))}
      </div>

      {visibility !== "public" ? (
        <div className="mt-4 space-y-3 rounded-2xl bg-zinc-50 p-4">
          <label className="block text-xs font-semibold text-zinc-500">Team access code</label>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 font-mono text-sm"
            placeholder="e.g. stars2026"
            value={team.accessCode ?? ""}
            onChange={(e) => onPatchTeam({ accessCode: e.target.value })}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white"
              onClick={() => onPatchTeam({ inviteToken: genToken() })}
            >
              Generate magic link
            </button>
            {inviteLink ? (
              <button
                type="button"
                className="text-xs font-semibold text-indigo-700 underline"
                onClick={() => void navigator.clipboard.writeText(inviteLink)}
              >
                Copy invite link
              </button>
            ) : null}
          </div>
          {inviteLink ? (
            <p className="break-all text-xs text-zinc-500">{inviteLink}</p>
          ) : null}
          {visibility === "mixed" ? (
            <p className="text-xs text-zinc-500">
              In each block editor, choose Public or Members only. Gallery, documents, and attendance default to
              members only.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 border-t border-zinc-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Child photos (GDPR)</p>
        <label className="mt-2 flex items-start gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            className="mt-1 rounded"
            checked={Boolean(settings.parentConsent)}
            onChange={(e) => patchSettings({ parentConsent: e.target.checked })}
          />
          I confirm I have parental consent for uploaded child photos.
        </label>
        <label className="mt-2 flex items-start gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            className="mt-1 rounded"
            checked={Boolean(settings.hideChildNames)}
            onChange={(e) => patchSettings({ hideChildNames: e.target.checked })}
          />
          Hide child names on the public page (show initials only where possible).
        </label>
      </div>
    </section>
  );
}
