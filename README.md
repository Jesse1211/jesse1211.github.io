# jesse1211.github.io

Personal portfolio rendered as a fake glass terminal floating over a
Zdog star background. Live at <https://jesseliu.me>.

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

## Architecture notes

See [`CLAUDE.md`](./CLAUDE.md) for the full architecture writeup
(history-driven terminal, reveal/typing animation timing, Joy theme
overrides, Pages configuration, common gotchas).
