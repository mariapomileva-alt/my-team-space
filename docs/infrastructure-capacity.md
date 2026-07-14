# Infrastructure capacity — MyTeamSpace

**Date:** 14 July 2026  
**Assumptions:** Single Supabase project, Vercel serverless, public Storage bucket `team-assets`, average coach on **Single Team** plan unless noted.

---

## Platform scale definitions

| Metric | "200 clients" | "500 teams" |
|--------|---------------|-------------|
| Paying coaches | ~200 | ~200–400 (mix of Single + Academy) |
| Team rows | ~200–250 | ~500 |
| Academy accounts (20 teams each) | ~5–10 | ~10–25 |
| Active builders (concurrent) | ~10–25 peak | ~25–60 peak |
| Public page views/day | ~2k–10k | ~5k–25k |

---

## Supabase Database

### Current schema characteristics

- **Tenant key:** `teams.id` + `team_members.user_id`
- **Largest column:** `teams.blocks` (jsonb) — unbounded
- **Indexes present:** `teams.slug`, `teams.subscription_status`, `team_members.user_id`, content tables `(team_id, …)`
- **Connection model:** Serverless via `@supabase/ssr` — pooler recommended at scale

### Growth estimate

| Teams | Avg blocks JSON | DB row size (teams only) | + content tables |
|-------|-----------------|--------------------------|------------------|
| 200 | 50 KB | ~10 MB | ~50 MB total |
| 500 | 80 KB | ~40 MB | ~150 MB total |

**Verdict:** Database size is **not** the first bottleneck at 500 teams.

### First DB pressure points

1. **Write rate** on `teams` from autosave (1.5s debounce × concurrent builders)
2. **JSONB read** of full `blocks` on every public page cache miss
3. **Connection count** if serverless concurrency spikes without pooler

### Recommendations

| Item | Now | At 200 | At 500 |
|------|-----|--------|--------|
| Supabase plan | **Pro minimum** | Pro | Pro |
| Connection pooler | Enable (Supavisor) | Required | Required |
| PITR | Enable | Required | Required |
| Extra indexes | None until slow-query log | Review `slug` lookups | Same |

---

## Supabase Storage

### Configuration today

- Bucket: `team-assets` (**public read**)
- Max file: **5 MB** (API + bucket policy)
- Client compression: WebP/JPEG via `lib/media/compress-image.ts`
- Path: `{team_id}/{folder}/{file}`

### Capacity scenarios

**Average file size after compression:** ~300–800 KB (images), assume **500 KB** for planning.

| Scenario | Files | Storage @ 500 KB | Storage @ 1 MB | Storage @ 3 MB |
|----------|-------|------------------|----------------|----------------|
| 200 teams × 100 photos | 20,000 | **10 GB** | 20 GB | 60 GB |
| 200 teams × 500 photos | 100,000 | **50 GB** | 100 GB | 300 GB |
| 500 teams × 500 photos | 250,000 | **125 GB** | 250 GB | 750 GB |

### Bandwidth (public pages)

Rough formula:  
`monthly_egress ≈ page_views × avg_images_per_page × avg_image_size`

| Page views/mo | 8 images × 500 KB | 20 images × 500 KB |
|---------------|-------------------|---------------------|
| 50,000 | ~200 GB | ~500 GB |
| 200,000 | ~800 GB | ~2 TB |

**First Storage limit hit:** Supabase **included egress** on lower tiers, then overage charges.

### Mitigations (minimal, in order)

1. **Already have:** client-side resize/WebP before upload
2. **Short term:** enforce gallery count soft limit in UI (e.g. 50 images)
3. **Medium term:** lazy loading + thumbnails in gallery block (don't load all originals)
4. **Long term:** private bucket + CDN signed URLs (P1-05)

---

## Vercel

### Current usage pattern

- Next.js 16 SSR/ISR on public `/{slug}`
- Dynamic admin routes (`force-dynamic`)
- Webhook route (Node runtime)
- Upload proxy through API route (5 MB max)

### Likely limits hit first

| Limit | Hobby risk | Pro |
|-------|------------|-----|
| Bandwidth | **High** (marketing + public pages + images from Supabase, not Vercel image CDN for team photos) | Higher included |
| Function duration | Medium (webhook, save) | 60s default |
| Build failures | **Already occurred** | Same — fix CI |
| Log retention | Short | Longer |

**Recommendation:** **Vercel Pro** before active ad spend / launch campaigns.

### ISR / caching

- Public team data: `unstable_cache` 15s + tag invalidation on save
- Page segment: `revalidate = 60`
- At 500 teams with diverse slugs, cache hit ratio depends on traffic concentration

---

## Lemon Squeezy / billing

- 200 subscribers: within standard Lemon limits
- Webhook volume: negligible (< 1000 events/mo)
- **Risk:** webhook processing errors invisible without monitoring

---

## Estimated monthly infrastructure cost

**Rough USD estimates — verify against current pricing pages.**

### ~50 paying clients (~50 teams)

| Service | Plan | Est. /mo |
|---------|------|----------|
| Supabase | Pro | $25 |
| Vercel | Pro | $20 |
| Lemon Squeezy | % of revenue | ~$50–150 fees |
| Resend (invites) | Free/low | $0–20 |
| Monitoring (Sentry free tier) | | $0 |
| **Total infra** | | **~$45–65 + payment fees** |

### ~200 paying clients (~220 teams, moderate photos)

| Service | Est. /mo |
|---------|----------|
| Supabase Pro + storage/egress overage | $25–80 |
| Vercel Pro | $20–40 |
| Lemon fees (5% + $0.50) | ~$400–500 on €29–199 MRR mix |
| Resend | $20 |
| Sentry Team | $0–26 |
| **Total infra** | **~$65–170 + payment fees** |

### ~500 teams (400+ paying, heavy galleries)

| Service | Est. /mo |
|---------|----------|
| Supabase Pro + **50–125 GB storage**, egress | $80–200+ |
| Vercel Pro + bandwidth | $40–100 |
| Lemon fees | scales with revenue |
| **Total infra** | **~$150–350+** before payment processor % |

---

## Alerts to configure

| Alert | Threshold suggestion |
|-------|---------------------|
| Supabase DB size | > 80% plan |
| Supabase Storage | > 70% included |
| Supabase egress | weekly anomaly +80% |
| Vercel bandwidth | > 80% monthly |
| Vercel deployment | any failure |
| Webhook 4xx/5xx | > 0 in 1 hour |
| Uptime | homepage + sample public slug 5xx |

---

## Upgrade triggers

| Signal | Action |
|--------|--------|
| Storage > 50 GB | Review gallery limits; consider image pipeline |
| Egress > 200 GB/mo | CDN strategy; thumbnail generation |
| DB connections exhausted | Supavisor pooler; reduce serverless concurrency |
| Autosave p95 > 3s | Index review; reduce payload size |
| Vercel bandwidth > Pro included | Pro+ or cache tuning |

---

## DNS (current production)

| Host | Target |
|------|--------|
| `myteamspace.cc` | Vercel (307 → www) |
| `www.myteamspace.cc` | Vercel production deployment |

**Subdomain split (app vs public pages):** **Not required** at 500 teams. Revisit at 5k+ teams or enterprise isolation needs.
