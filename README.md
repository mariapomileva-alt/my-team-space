# MyTeamSpace

Team **webpage** builder (block-based, micro-site style) — Next.js app in this repo.

## GitHub Pages (why you might see the wrong page)

GitHub Pages **cannot** run Next.js from source. If **Settings → Pages** uses **Deploy from branch** with folder **`/` (root)`**, GitHub shows **`README.md`** as the site — that looks like the default Next.js “Getting Started” text.

**Fix:** set Pages to publish from the **`/docs`** folder on `main` (this repo includes a pre-built static site under `docs/`).

1. Repo **Settings → Pages → Build and deployment**
2. **Source:** *Deploy from a branch*
3. **Branch:** `main`, folder **`/docs`**, Save  
4. Wait a minute, then open `https://mariapomileva-alt.github.io/my-team-space/` with a hard refresh (cache).

After you change `app/` or styles, rebuild the `docs/` folder locally:

```bash
npm run pages:docs
```

Commit and push the updated `docs/` folder (or switch to GitHub Actions — see `DEPLOY_GITHUB_PAGES.txt`).

## Custom domain (`myteamspace.cc`) on GitHub Pages

Your repo already includes `docs/CNAME` with **`myteamspace.cc`** (apex). GitHub will serve the `docs/` output at **`https://myteamspace.cc/`** (site root), not under `/my-team-space/`.

Because of that, the static export **must be built without** `BASE_PATH` so asset URLs are `/_next/...` instead of `/my-team-space/_next/...`:

```bash
npm run pages:docs:root
```

Use **`pages:docs`** only for the default project URL  
`https://mariapomileva-alt.github.io/my-team-space/`.

### Namecheap Advanced DNS (replace parking)

1. **Remove** the `www` CNAME pointing to `parkingpage.namecheap.com`.
2. **Remove** the `@` URL Redirect to `http://www.myteamspace.cc/` (or it will fight GitHub).
3. **Add four A records** for the apex `@` (GitHub Pages):

   | Type | Host | Value            | TTL     |
   |------|------|------------------|---------|
   | A    | `@`  | `185.199.108.153` | 30 min or Automatic |
   | A    | `@`  | `185.199.109.153` | same |
   | A    | `@`  | `185.199.110.153` | same |
   | A    | `@`  | `185.199.111.153` | same |

   (Official list: [GitHub — configuring an apex domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain).)

4. In the GitHub repo: **Settings → Pages → Custom domain** enter **`myteamspace.cc`**, save, wait for DNS check, then enable **Enforce HTTPS** when it appears.

**Optional `www`:** add a **CNAME** record: Host `www`, Value `mariapomileva-alt.github.io.`, then add **`www.myteamspace.cc`** under the same Pages custom-domain UI if you want both hosts.

## Local dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

Private / your choice.
