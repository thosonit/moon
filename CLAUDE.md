# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build website for a child ("Moon - Quỳnh Như") to browse learning topics and flip through daily lesson images (mindmap/flashcard pages). Vanilla HTML/CSS/JS, no framework, no bundler, no package.json. Deployed on Vercel as a static site (`vercel.json`).

## Visual design direction

See [`DESIGN.md`](./DESIGN.md) for the full UI design spec: a soft pastel-pink theme built for a 5-year-old girl, with rounded "kawaii" cards, a friendly rounded font pairing (Baloo 2 / Quicksand), and animal-mascot animations (gentle bounce, wave, twinkle, fly-across) implemented as compositor-friendly `transform`/`opacity` CSS keyframes with a `prefers-reduced-motion` guard. Consult it before making any styling or animation changes so new UI stays consistent with the intended direction (color tokens, button states, per-page layout).

## Running locally

There is no build step. Serve the directory with any static file server, e.g.:

```
npx serve .
# or
python3 -m http.server 8000
```

Open `index.html` (topic grid) → `topic.html?topic=<id>` (day list) → `day.html?topic=<id>&day=<n>` (image viewer).

There are no tests, linter, or build/CI commands configured in this repo.

## Architecture

Three pages, each backed by one JS module (no router, plain query-string params):

- `index.html` + `js/app.js` — fetches `data/topics.json`, renders a grid of topic cards linking to `topic.html?topic=<id>`.
- `topic.html` + `js/topic.js` — reads `?topic=` from the URL, fetches `data/topics.json` for metadata and `data/<topicId>.json` for the day list, renders `<li>` entries (title as main label, `Bài <n>` as subtitle) linking to `day.html`.
- `day.html` + `js/day.js` — reads `?topic=` and `?day=` from the URL, loads the same two JSON sources, and renders a fullscreen image viewer for that day's page.

Data layer (`data/`):
- `topics.json` — array of `{ id, title, totalDays }`, one entry per topic.
- `<topicId>.json` (e.g. `mindmap-heineman-gk7.json`) — array of `{ day, imagePath, title, driveUrl? }`, one entry per lesson day. `imagePath` (local file under `data/images/`) is preferred; `driveUrl` is a fallback resolved at render time via `js/drive-url.js`.
- `data/images/` — the actual lesson page images (webp).
- Source PDFs used to generate the per-day images are gitignored (`data/*.pdf`) and not committed.

`js/drive-url.js` exports `toDirectImageUrl(driveUrl)`, converting a Google Drive share link into a hotlink-friendly `lh3.googleusercontent.com` URL (the `drive.google.com/uc` endpoint 503s when embedded in an `<img>`). Used as a fallback when an entry has no local `imagePath`.

All pages share `css/style.css`, which defines design tokens as CSS custom properties in `:root` (colors via `oklch()`, fluid type/spacing via `clamp()`).

### Day viewer (`js/day.js`) controls

The viewer (`.viewer`) overlays floating icon buttons on top of the image:
- Back button (`.viewer-back`, top-left) — icon-only (←), links back to `topic.html`.
- Fullscreen button (`.viewer-fullscreen`, bottom-right) — icon-only (⛶), toggles the Fullscreen API on the `.viewer` element.
- Zoom controls (`.viewer-zoom-controls`, bottom-left) — `−` / `%` label / `+` buttons adjusting `zoomLevel` in 5% steps (1x–4x) via a CSS `transform: scale()` on the image, centered via `transform-origin: center center`. Toggles `.is-zoomed` on `.viewer-image-wrap` to enable scrolling/panning when zoomed in.

All floating icon buttons share the `.viewer-icon-button` style: circular, low opacity by default, full opacity on hover/focus.

## Adding a new topic

1. Add an entry to `data/topics.json` (`id`, `title`, `totalDays`).
2. Create `data/<id>.json` with one `{ day, imagePath, title }` object per day, `imagePath` pointing into `data/images/`.
3. Drop the corresponding images into `data/images/`.

## Content language

UI copy and lesson titles are in Vietnamese; keep new user-facing text consistent with the existing Vietnamese tone (e.g. "Bài", "Danh sách", "Không tìm thấy...").
