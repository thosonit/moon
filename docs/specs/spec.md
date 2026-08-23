# Specs Overview

`moon` has three screens, each documented as its own spec. All three share the same data model (`data/topics.json` + `data/<topicId>.json`), the same visual language (see [DESIGN.md](../design/DESIGN.md)), and the same input model: mouse/touch plus TV-remote/keyboard D-pad navigation (`src/moon/js/tv-nav.js`).

| Code | Spec | Screen | Route |
|---|---|---|---|
| 01 | [01-topic-grid.spec.md](./01-topic-grid.spec.md) | Home — Topic Grid | `index.html` |
| 02 | [02-day-list.spec.md](./02-day-list.spec.md) | Topic — Day List | `topic.html?topic=<id>` |
| 03 | [03-image-viewer.spec.md](./03-image-viewer.spec.md) | Day — Image Viewer | `day.html?topic=<id>&day=<n>` |

## Cross-cutting behavior

- **Progress persistence** (`src/moon/js/progress.js`): completed days are stored per-topic in `localStorage` under `moon:progress:<topicId>` as an array of day numbers. There is no backend — progress is device-local and is lost if storage is cleared.
- **TV-remote support** (`src/moon/js/tv-nav.js`): every screen must support arrow-key/D-pad navigation with a visible `.tv-focused` state, and a "Back" action bound to `Escape`, `Backspace`, and the Tizen/webOS remote back key codes (`10009`, `461`).
- **Reduced motion**: every animation (mascot bounce, snowfall, twinkle) must be disabled under `prefers-reduced-motion: reduce`.
- **No backend / no build step**: all three screens are static HTML + vanilla JS reading local JSON files. Any new feature must stay within that constraint unless the user explicitly asks to add a build step or server.
