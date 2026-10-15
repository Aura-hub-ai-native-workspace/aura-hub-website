# AURA Hub — Website (v2)

The public marketing site for [AURA Hub](https://github.com/Aura-hub-ai-native-workspace/aura-hub).

## Stack

React 18 + Vite 5 + Tailwind CSS 3 + [Motion](https://motion.dev/) + Lenis smooth scroll. TypeScript throughout. No test runner is configured yet (see `scripts/release-checks.mjs` for the dependency-free release checks).

## Scripts

| Command           | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm ci`          | Clean install (CI uses this)             |
| `npm run dev`     | Local dev server (`vite`)                |
| `npm run build`   | Type-check (`tsc`) + production build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally (`vite preview`) |
| `node scripts/release-checks.mjs` | Dependency-free SEO/asset/anchor/header checks |

Requires Node.js 18 or newer.

## Deployment — Cloudflare Workers Static Assets

`wrangler.jsonc` configures asset-only serving (no Worker script; `main` is intentionally omitted):

```jsonc
{
  "name": "aura-hub-website-v2",
  "compatibility_date": "2026-08-07",
  "assets": { "directory": "./dist", "not_found_handling": "404-page" }
}
```

To deploy (human approval required; CI does not deploy):

1. `npm ci && npm run build` — produces `dist/`.
2. `npx wrangler deploy` — reads `wrangler.jsonc` automatically.
3. Custom domain `https://aurahub.website/` is bound to this Worker; `https://aura-hub-website-v2.gokulanand744.workers.dev/` serves the same deployment.

`public/_headers` (security + caching), `public/robots.txt`, `public/sitemap.xml` and `public/404.html` are copied into `dist/` by Vite and picked up natively from the asset directory.

## Repository contents

| Path | Purpose |
|---|---|
| `index.html` | Vite entry — head metadata (canonical, OG/Twitter, JSON-LD) + `<div id="root">` |
| `src/` | React app (`App.tsx`, `components/`, `data/`, `motion/`, `stage/`) |
| `public/brand/` | Brand mark (favicon, nav logo) |
| `public/screenshots/` | Product screenshots |
| `public/404.html` | Custom not-found page (`noindex`, links home) |
| `public/robots.txt` | Allows all crawlers, points to `sitemap.xml` |
| `public/sitemap.xml` | Single-URL sitemap for `https://aurahub.website/` |
| `public/_headers` | Security + caching headers |
| `scripts/release-checks.mjs` | Dependency-free release checks (node builtins only) |
| `wrangler.jsonc` | Workers Static Assets config |

## Updating

- Edit components in `src/`; screenshots live in `public/screenshots/` (keep filenames stable — OG image and showcase reference them).
- If the canonical domain ever changes, update it in three places: `index.html` (`canonical`, `og:url`, `og:image`, `twitter:image`), `public/robots.txt`, and `public/sitemap.xml`.
- Run `node scripts/release-checks.mjs` before asking for review.

## Links

- Main project: [github.com/Aura-hub-ai-native-workspace/aura-hub](https://github.com/Aura-hub-ai-native-workspace/aura-hub)
- Live site: [aurahub.website](https://aurahub.website/)
- Contact: hello@aurahub.dev

## License

Apache License 2.0 — see [LICENSE](./LICENSE).
