# jesse1211.github.io

Personal portfolio rendered as a fake glass terminal floating over a
Zdog star background. Live at <https://jesseliu.me>.

This repo is the **render layer only**. All content lives in the
**`Journey`** repo, pulled in as a git submodule at
`src/journey-content` — the single source of truth. To install with
content: `git clone --recurse-submodules`.

## Develop

```bash
pnpm install
pnpm dev       # http://localhost:5100
pnpm lint
pnpm build
```

## Deploy

Push to `main` — GitHub Actions (`.github/workflows/deploy.yml`) lints,
builds, and publishes to GitHub Pages. The custom domain
`jesseliu.me` is preserved via `public/CNAME`.

## Editing content

Content is **not** in this repo. Edit the `Journey` repo, then bump
the submodule pointer here:

```bash
git submodule update --remote --merge src/journey-content
git commit -am "bump journey-content" && git push   # deploys
```

## Architecture notes

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture writeup
(render/content split, history-driven terminal, animation timing,
Joy theme overrides, Pages configuration, gotchas).
