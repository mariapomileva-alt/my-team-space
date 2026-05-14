type ScheduleRow = { id: string; title: string; starts_at: string; location: string | null };
type UpdateRow = { id: string; title: string; body: string; published_at: string };
type AchRow = { id: string; title: string; body: string; icon: string | null; created_at: string };

export function TeamSaaSExtras({
  schedule,
  updates,
  achievements,
}: {
  schedule: ScheduleRow[];
  updates: UpdateRow[];
  achievements: AchRow[];
}) {
  const hasAny = schedule.length || updates.length || achievements.length;
  if (!hasAny) return null;

  return (
    <div className="mx-auto mt-2 flex max-w-3xl flex-col gap-8 px-4 pb-16 sm:px-6">
      {schedule.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--mts-muted)]">Schedule</h2>
          <ul className="mt-3 space-y-2">
            {schedule.map((s) => (
              <li
                key={s.id}
                className="rounded-2xl border border-[color:var(--mts-card-border)] bg-[color:var(--mts-card)] px-4 py-3 shadow-sm"
              >
                <p className="font-semibold text-[color:var(--mts-text)]">{s.title}</p>
                <p className="text-sm text-[color:var(--mts-muted)]">
                  {new Date(s.starts_at).toLocaleString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {s.location ? ` · ${s.location}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
      {updates.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--mts-muted)]">Updates</h2>
          <ul className="mt-3 space-y-3">
            {updates.map((u) => (
              <li
                key={u.id}
                className="rounded-2xl border border-[color:var(--mts-card-border)] bg-[color:var(--mts-card)] px-4 py-3 shadow-sm"
              >
                <p className="font-semibold text-[color:var(--mts-text)]">{u.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[color:var(--mts-muted)]">{u.body}</p>
                <p className="mt-2 text-xs text-[color:var(--mts-muted)]">
                  {new Date(u.published_at).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
      {achievements.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--mts-muted)]">Achievements</h2>
          <ul className="mt-3 space-y-2">
            {achievements.map((a) => (
              <li
                key={a.id}
                className="flex gap-3 rounded-2xl border border-[color:var(--mts-card-border)] bg-[color:var(--mts-card)] px-4 py-3 shadow-sm"
              >
                {a.icon ? <span className="text-xl">{a.icon}</span> : null}
                <div>
                  <p className="font-semibold text-[color:var(--mts-text)]">{a.title}</p>
                  {a.body ? <p className="text-sm text-[color:var(--mts-muted)]">{a.body}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
