# AURA Hub — Website

[![Link Check](https://github.com/Aura-hub-ai-native-workspace/aura-hub-website/actions/workflows/link-check.yml/badge.svg)](https://github.com/Aura-hub-ai-native-workspace/aura-hub-website/actions/workflows/link-check.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)

The public marketing site for [AURA Hub](https://github.com/Aura-hub-ai-native-workspace/aura-hub), the AI-native engineering environment. This repository contains **only** the static website — no application code, no build tooling.

It is a single self-contained HTML page (`index.html`) with inline CSS and JavaScript, plus an `assets/` folder of images. There is no framework, no package manager, and no build step.

## Screenshots

The site itself showcases product screenshots, served from `assets/screenshots/`:

<p>
  <img src="assets/screenshots/01-app-shell-home.png" alt="AURA Hub — App Shell Home" width="49%" />
  <img src="assets/screenshots/03-ai-chat.png" alt="AURA Hub — AI Chat" width="49%" />
</p>
<p>
  <img src="assets/screenshots/04-mission-control.png" alt="AURA Hub — Mission Control" width="49%" />
  <img src="assets/screenshots/09-architecture-blueprint.png" alt="AURA Hub — Architecture Explorer" width="49%" />
</p>

The full set (`01`, `03`, `04`, `07`–`13`) is used across the hero, product showcase, screenshots grid, and interactive demo sections of `index.html`. The brand mark used for the favicon, nav logo, and footer is `assets/brand/aura-logo.png`.

## Deployment

This repository is ready to deploy as-is to any static host — no build step, no dependencies.

### Cloudflare Pages

1. Connect this repository in the Cloudflare Pages dashboard.
2. Framework preset: **None**
3. Build command: *(leave empty)*
4. Build output directory: `/`
5. Deploy.

Cloudflare will serve `index.html` directly with no build phase. `_headers` (security + caching rules) and `robots.txt`/`sitemap.xml` are picked up automatically — Cloudflare Pages requires no extra configuration for them.

Since this repository has no `wrangler.toml`, no `package.json`, and no Workers code, Cloudflare correctly detects it as a static site as long as it's connected on its own — do not connect it as a subfolder of the main `aura-hub` monorepo, which mixes in the desktop app's Node tooling and causes Cloudflare to misdetect the project type.

### Other static hosts

Because it's just an HTML file and an image folder, it also works unmodified on:

```bash
# Netlify
npx netlify deploy --dir=. --prod

# Vercel
npx vercel --prod

# GitHub Pages
# Settings → Pages → Deploy from branch → / (root)
```

Or simply open `index.html` directly in a browser — the page has no server dependency and works fully offline.

## Repository contents

| File | Purpose |
|---|---|
| `index.html` | The entire site — markup, styles, and script, self-contained |
| `404.html` | Custom not-found page, matches site branding |
| `robots.txt` | Allows all crawlers, points to `sitemap.xml` |
| `sitemap.xml` | Single-URL sitemap for search engines |
| `_headers` | Cloudflare Pages security + caching headers |
| `assets/` | Brand mark and product screenshots |
| `.github/workflows/link-check.yml` | CI: fails a PR/push if a link or asset reference breaks |

## Updating

Edit `index.html` directly; it's plain HTML/CSS/JS. To update a screenshot, replace the file in `assets/screenshots/` under the same filename referenced in the markup. If the canonical domain ever changes, update it in three places: `index.html` (`<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`), `robots.txt`, and `sitemap.xml`.

## Links

- Main project: [github.com/Aura-hub-ai-native-workspace/aura-hub](https://github.com/Aura-hub-ai-native-workspace/aura-hub)
- Live site: [aurahub.is-a.dev](https://aurahub.is-a.dev) *(once Cloudflare Pages is connected — see Deployment above)*
- Contact: hello@aurahub.dev

## License

Apache License 2.0 — see [LICENSE](./LICENSE).
