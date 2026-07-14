# Security milestone — production smoke test

**Branch:** `pre-launch-audit`  
**When to run:** After all four security migrations are applied to **production** Supabase **and** the matching Vercel production deployment is live.  
**Who:** You (or a teammate) — no deep technical knowledge required.  
**Time:** ~45–60 minutes.

---

## Before you start

| Item | What you need |
|------|----------------|
| **Account A** | Owner of an existing team (Team A) with a **published** public page |
| **Account B** | Different user — owner of Team B, or a user with **no** access to Team A |
| **Browsers** | Normal browser (logged in) + **Incognito / private** window (anonymous) |
| **URLs** | Production site `https://www.myteamspace.cc` |
| **Team A slug** | e.g. `your-team-slug` → `https://www.myteamspace.cc/your-team-slug` |
| **Team A admin** | `https://www.myteamspace.cc/admin/team/{team-id}/...` (from dashboard) |

**Save screenshots** for any step marked 📸 if the result is unclear or you need to report a problem.

**Do not** run exploit SQL or manual INSERT/UPDATE on production.  
**Do not** paste real access codes, invite tokens, or API keys into chat or screenshots.

---

## Where to look if something fails

| Symptom | Where to check |
|---------|----------------|
| Page shows error / blank | Browser **DevTools → Console** (F12) |
| Save or login fails | **Network** tab — red failed requests |
| Server errors | **Vercel → Project → Logs** (filter Production, last 15 min) |
| Database / RPC errors | **Supabase → Logs → Postgres** or **API** |

**Error examples:** HTTP 500, “Team not found” on a page that worked before, autosave never finishing, invitation link always failing.

---

## A. Existing production page (anonymous)

**Goal:** A published team page still works for parents and visitors.

| Step | Action | Expected ✅ | Error ❌ |
|------|--------|-------------|----------|
| A1 | Open Incognito. Go to Team A public URL `/{slug}` | Page loads with team name, logo, blocks | 500 error, blank page, “Application error” |
| A2 | Scroll the page | Hero, schedule, gallery, links render | Missing sections that were there before |
| A3 | Open same URL on phone or narrow browser window | Layout readable, images load | Broken layout, broken images |
| A4 | Stay in Incognito — you must **not** see builder UI, draft banner, or admin links | Only public content + “Coach login” in header | Draft content, coach preview banner, internal fields |
| A5 | Optional 📸 | Screenshot of loaded public page | — |

---

## B. Owner access (Account A)

**Goal:** Owner can still edit and publish their team.

| Step | Action | Expected ✅ | Error ❌ |
|------|--------|-------------|----------|
| B1 | Log in as **Account A** | Login succeeds | Cannot log in |
| B2 | Open `/admin` | Dashboard shows **Team A** | Empty dashboard, wrong teams |
| B3 | Open Team A **builder** | Builder loads with blocks | 500, redirect to login loop |
| B4 | Change a **safe** field (e.g. tagline or a text block) | Field updates on screen | — |
| B5 | Wait **~3 seconds** (autosave) | No error toast; save completes | “Could not save”, endless loading |
| B6 | Refresh the builder page | Your change is still there | Change lost |
| B7 | Click **Publish** (if not already published) | Publish succeeds | Publish blocked without clear reason |
| B8 | Open Team A public URL in Incognito | Published content matches your edit | Old content or error |
| B9 | Optional 📸 | Builder after save + public page | — |

---

## C. Draft isolation

**Goal:** Unpublished teams are hidden from anonymous visitors.

| Step | Action | Expected ✅ | Error ❌ |
|------|--------|-------------|----------|
| C1 | As **Account A**, use a team that is **not published** (draft), or create a new test team and **do not** publish | Team visible in `/admin` | — |
| C2 | Note the team **slug** | — | — |
| C3 | Open `/{slug}` in **Incognito** | Friendly “not live yet” / not found — **not** full team content | Full draft page visible to everyone |
| C4 | As **Account A** (logged in), open same `/{slug}` | **Coach preview** banner + page content | 404 for owner |
| C5 | Optional 📸 | Incognito vs logged-in view | — |

---

## D. Tenant isolation (Account B)

**Goal:** User B cannot access Team A’s admin.

| Step | Action | Expected ✅ | Error ❌ |
|------|--------|-------------|----------|
| D1 | Log in as **Account B** | Login succeeds | — |
| D2 | Open `/admin` | **Team A does not** appear (unless B is a legitimate member) | Team A listed |
| D3 | Paste Team A’s admin URL directly (from Account A’s browser) | Access denied, redirect, or empty — **not** Team A builder | B can edit Team A |
| D4 | Optional 📸 | Account B dashboard | — |

**Do not** run manual SQL on production to test RLS.

---

## E. Invitation flow

**Goal:** Staff invite still works once per user.

| Step | Action | Expected ✅ | Error ❌ |
|------|--------|-------------|----------|
| E1 | As **Account A** (coach), open Team A → staff / invites (Step 2 in admin) | Page loads | — |
| E2 | Send invite to a **test email** you control (not a real parent if possible) | Invite created / email sent | Error |
| E3 | Open invite link while logged in as that email (**Account B** or new test user) | Accept succeeds; user can open Team A admin | “Forbidden”, email mismatch |
| E4 | Open the **same** invite link again | “Already accepted” or lands in admin — **no duplicate** staff row | Duplicate members |
| E5 | Open invite with **fake token** in URL | Clear error — not access | Access granted |
| E6 | Do **not** screenshot or share the real token | — | — |

---

## F. Role escalation (sanity check)

**Goal:** Assistants cannot promote themselves; owner stays protected.

| Step | Action | Expected ✅ | Error ❌ |
|------|--------|-------------|----------|
| F1 | If you have an **assistant** on Team A, log in as assistant | Can open allowed admin pages | — |
| F2 | Assistant should **not** have a UI to become “owner/coach” | No self-promote option | Assistant becomes coach via UI |
| F3 | As **Account A** (owner), remove an assistant (if safe test user) | Removal works | Owner cannot manage staff |
| F4 | Owner should **not** be able to delete themselves as last owner | UI or error prevents it | Team left without owner |

*Full RLS escalation tests use staging + prepared scripts — not manual production SQL.*

---

## G. Public data exposure

**Goal:** Public API responses do not leak secrets.

| Step | Action | Expected ✅ | Error ❌ |
|------|--------|-------------|----------|
| G1 | Incognito → open Team A public page | Page works | — |
| G2 | DevTools → **Network** → find request to Supabase (`get_public_team_by_slug` or team load) | Response has team name, blocks, colors | — |
| G3 | In response JSON, search for: `access_code`, `invite_token`, `lemon_`, `customer` | **Not present** | Any secret field visible |
| G4 | Check `page_settings` in response | Only display fields (e.g. `designStyle`, `logoUrl`) — **not** `coachWhatsapp`, `payments` | Private settings visible |
| G5 | Do **not** copy full response into public channels | — | — |

---

## H. Regression flows (quick pass)

| Flow | Account | Expected ✅ |
|------|---------|-------------|
| Signup | New test email | Account created, lands in onboarding/admin |
| Login | A or B | Session works |
| Logout | If available in UI | Session cleared |
| Single Team dashboard | A | One primary team works |
| Academy dashboard | Academy coach (if you have one) | Multiple teams listed |
| Builder autosave | A | See section B |
| Publish | A | See section B |
| Public page | Incognito | See section A |
| Gallery images | Incognito | Images load from storage |
| Schedule block | Incognito | Events visible if configured |
| Existing memberships | A | Teams you owned before still appear |

---

## Pass / fail

**PASS** — all sections A–H complete with expected results; no new mass 5xx in Vercel logs.

**FAIL** — any ❌ result or critical 5xx → **stop**, note step ID (e.g. C3), screenshot, check Vercel + Supabase logs, consider rollback (see `docs/security-migration-deployment.md`).

---

## After PASS

1. Record **production commit SHA** and **migration apply time** (UTC).
2. Update `docs/pre-launch-audit.md` — mark P0-01, P0-02, P0-04, P0-05 as **deployed and verified**.
3. Only then proceed to **P0-03** planning.
