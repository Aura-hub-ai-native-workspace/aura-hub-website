# AURA Hub — Website

The public marketing site for [AURA Hub](https://github.com/Aura-hub-ai-native-workspace/aura-hub), the AI-native engineering environment. This repository contains **only** the static website — no application code, no build tooling.

It is a single self-contained HTML page (`index.html`) with inline CSS and JavaScript, plus an `assets/` folder of images. There is no framework, no package manager, and no build step.

## Screenshots

The site itself showcases product screenshots — see `assets/screenshots/`:

| | | |
|---|---|---|
| `01-app-shell-home.png` | `03-ai-chat.png` | `04-mission-control.png` |
| `07-automation-studio.png` | `08-knowledge-graph.png` | `09-architecture-blueprint.png` |
| `10-engineering-memory.png` | `11-engineering-governance.png` | `12-provider-settings.png` |
| `13-command-palette.png` | | |

The brand mark used for the favicon, nav logo, and footer is `assets/brand/aura-logo.png`.

## Deployment

This repository is ready to deploy as-is to any static host — no build step, no dependencies.

### Cloudflare Pages

1. Connect this repository in the Cloudflare Pages dashboard.
2. Framework preset: **None**
3. Build command: *(leave empty)*
4. Build output directory: `/`
5. Deploy.

Cloudflare will serve `index.html` directly with no build phase.

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

## Updating

Edit `index.html` directly; it's plain HTML/CSS/JS. To update a screenshot, replace the file in `assets/screenshots/` under the same filename referenced in the markup.

## Links

- Main project: [github.com/Aura-hub-ai-native-workspace/aura-hub](https://github.com/Aura-hub-ai-native-workspace/aura-hub)
- Contact: hello@aurahub.dev

## License

Apache License 2.0 — see [LICENSE](./LICENSE).
