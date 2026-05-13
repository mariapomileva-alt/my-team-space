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

## Local dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

Private / your choice.
