# P0-06 Recovery drill (isolated)

**Status:** ✅ Drill complete — integrity PASS on fork `vdjleqiuxovskirqzjcg` (24 Jul backup restore)  
**Rule:** Never restore **in-place** onto production `yundypamrubdrbmnilgi`.  
**Allowed restore:** Supabase **Restore to a New Project** (independent fork) only.

---

## 1. Production identity (read-only)

| Field | Value |
|-------|--------|
| Production site | https://www.myteamspace.cc |
| Supabase project ref | `yundypamrubdrbmnilgi` |
| Org slug | `eplxktbjpuddusmlpeek` |
| App health at baseline | `status=ok`, commit `ab2f72f`, env `production` |
| Baseline captured (UTC) | `2026-07-23T23:23:29Z` |

### Recovery point (logical)

Use this as the drill restore target unless a newer backup is preferred:

```
Recovery point label: P0-06-drill-baseline
Preferred restore mode: Restore to a New Project (from scheduled PHYSICAL backup)
Preferred backup: latest scheduled — 2026-07-24 03:37:33 UTC
  (PITR not enabled — second-level restore unavailable until add-on is purchased)
Note: RPO without PITR ≈ up to ~24h (time since last daily backup)
```

### Public integrity baseline (safe fields only)

Team slug `stars` via `get_public_team_by_slug`:

| Field | Expected |
|-------|----------|
| `id` | `e73021ee-df96-40f0-9ca0-ba191d490c67` |
| `slug` | `stars` |
| `name` | `Dance Is` |
| `publish_status` | `published` |
| Public page | https://www.myteamspace.cc/stars contains `Dance Is` |
| Logo path prefix | `…/storage/v1/object/public/team-assets/e73021ee-…/logos/` |

> Storage objects are **not** copied by Restore-to-New-Project. DB rows and logo URL strings should restore; fetching the logo file from the **fork** may 404 — that is expected. Verify logo URL string in DB, not binary presence on the fork.

---

## 2. Backup / PITR gate (Owner)

**Confirmed from Dashboard (24 Jul 2026):**

| Check | Value |
|-------|--------|
| Project | `my team space` · PRODUCTION · `yundypamrubdrbmnilgi` |
| Physical daily backups | ✅ yes — listed 17–24 Jul 2026 |
| Latest scheduled backup | **24 Jul 2026, 03:37:33 UTC** (PHYSICAL) |
| Older backups visible | 23→17 Jul daily ~03:35–03:40 UTC (~7 days) |
| Storage in DB backup | ❌ objects not included (metadata only) — expected |
| Restore to a New Project tab | ✅ visible `(BETA)` |
| **PITR** | ❌ **not enabled** (add-on prompt only — do not enable for this drill unless you accept extra cost) |

Pages:

| Page | URL |
|------|-----|
| Scheduled | https://supabase.com/dashboard/project/yundypamrubdrbmnilgi/database/backups/scheduled |
| PITR | https://supabase.com/dashboard/project/yundypamrubdrbmnilgi/database/backups/pitr |
| Restore to a New Project | https://supabase.com/dashboard/project/yundypamrubdrbmnilgi/database/backups/restore-to-new-project |

**Do not** press **Restore** on the Scheduled list (in-place / production risk).  
**Do not** click **Enable add-on** for PITR unless you explicitly want the paid add-on (~$100+/mo for 7-day window).  

P0-06 drill uses **Restore to a New Project** from a **scheduled physical backup** (granularity ≈ daily, not seconds).

---

## 3. Isolated restore procedure (Owner click — costs money)

Supabase creates a **new** project billed like the source compute. Confirm cost in the wizard before continuing. Delete the drill project when done.

1. Source project → **Database → Backups → Restore to a New Project**  
   https://supabase.com/dashboard/project/yundypamrubdrbmnilgi/database/backups/restore-to-new-project  
   (not `/database/backups` alone — that 404s)
2. Choose the **latest scheduled PHYSICAL backup** (e.g. 24 Jul 2026 03:37:33 UTC). PITR timestamp picker will not apply while PITR add-on is off.
3. Confirm cost → start restore.
4. Name / note project as `my-team-space-p0-06-drill` (or similar).
5. Wait until project status is healthy.
6. Copy from the **new** project:
   - project ref
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Put them in local **gitignored** file `.env.recovery` (never commit):

```bash
RECOVERY_SUPABASE_URL=https://<new-ref>.supabase.co
RECOVERY_SUPABASE_ANON_KEY=...
```

8. Run integrity script:

```bash
node scripts/recovery-integrity-check.mjs
```

9. After PASS: pause or **delete** the drill project to stop charges.  
   **Do not** point Vercel production env at the drill project.

### Forbidden

- In-place PITR / Restore on `yundypamrubdrbmnilgi`
- Changing production Vercel env to the fork
- Deleting production data “to test restore”
- Mass Storage deletes

---

## 4. Integrity checks (automated)

Script: `scripts/recovery-integrity-check.mjs`

Against the **fork** (and optionally re-check production for drift):

1. RPC `get_public_team_by_slug('stars')` returns expected `id`, `slug`, `name`, `publish_status`
2. RPC with nonsense slug returns empty / non-error
3. Anon cannot read service-only tables (expect permission denied / empty)
4. Production health still `ok` (unchanged) after drill

---

## 5. Drill log

| Step | Result | UTC |
|------|--------|-----|
| Baseline captured | ✅ | 2026-07-23T23:23:29Z |
| Backup/PITR fields recorded | ✅ Physical daily 17–24 Jul; latest 24 Jul 03:37:33 UTC; Restore-to-new-project yes; **PITR off** (add-on not purchased) | 2026-07-24 |
| Restore to new project | ✅ COMPLETED 24 Jul 2026 09:19 UTC → fork ref `vdjleqiuxovskirqzjcg` | 2026-07-24 |
| Integrity script PASS | ✅ 8/8 — `npm run recovery:check` 2026-07-27 | 2026-07-27 |
| Drill project deleted / paused | ✅ Fork `vdjleqiuxovskirqzjcg` deleted via CLI; production untouched | 2026-07-27 |
| P0-06 closed | ✅ drill verified (PITR add-on still off — optional later) | 2026-07-27 |

---

## 6. What this drill proves / does not prove

**Proves:** physical backup or PITR can materialize a usable independent DB copy; critical public team row survives; production env untouched.

**Does not prove:** Storage file restore; full Auth login flows on fork without reconfig; webhook/Lemon; Vercel cutover.
