# my-website-spa

Personal portfolio website (React + Vite) deployed as a static single-page application (SPA).

## Tech stack

- React 18 + TypeScript
- Vite 5 (build + dev server)
- MUI Joy UI + MUI Material
- Nginx (production container serving the `dist/` output)

## Repository layout

- `src/` – React application code
  - `main.tsx` – app bootstrap
  - `App.tsx` – app shell, theme providers, main layout
  - `components/` – UI components (navigation, home, footer, etc.)
  - `components/canvas/` – canvas animations
  - `models/`, `services/`, `hooks/` – data models and helpers
- `public/` – static assets
- `index.html` – Vite HTML entry
- `vite.config.ts` – Vite configuration (dev server port is `5100`)
- `nginx.conf` – nginx config for SPA routing (`try_files ... /index.html`)

## Scripts

From `package.json`:

- `pnpm dev` – run the Vite dev server
- `pnpm build` – typecheck (`tsc`) then production build (`vite build`)
- `pnpm preview` – preview the production build locally

## Run locally (recommended for development)

Prereqs:
- Node.js 18+ (this repo uses Node 18 in Docker)
- pnpm

Commands:

```bash
pnpm install
pnpm dev
```

Vite will start the dev server (configured for port `5100`).

## Build locally

```bash
pnpm install
pnpm build
```

Build output goes to `dist/`.

## Run with Docker (production nginx)

This repository includes a multi-stage Docker build:

1. A Node builder stage runs `pnpm build` and produces `dist/`.
2. A small nginx image serves `dist/` as a static SPA.

### Build image

```bash
docker build -t my-website-spa:local .
```

### Run container

```bash
docker run --rm -p 5100:5100 my-website-spa:local
```

Then open:
- http://localhost:5100

### Notes

- Nginx is configured for SPA routing, so deep-links work (routes fall back to `index.html`).
- If you want a different host port, change the left side of `-p`, e.g. `-p 8080:5100`.
