# Screens Overview

Static HTML prototypes of `moon`'s three real screens, paired with a short doc per screen. These mirror the shipped pages in `src/moon/` — same CSS classes, same tokens from [DESIGN.md](../design/DESIGN.md) — with sample data baked in for quick visual review without running the app or wiring JSON data.

| Code | Screen | Doc | Prototype | Corresponding spec |
|---|---|---|---|---|
| HOME-01 | Topic Grid | [HOME-01-topic-grid-00.screen.md](./HOME-01-topic-grid-00.screen.md) | [HOME-01-topic-grid-00.screen.html](./HOME-01-topic-grid-00.screen.html) | [01-topic-grid.spec.md](../specs/01-topic-grid.spec.md) |
| TOPIC-02 | Day List | [TOPIC-02-day-list-00.screen.md](./TOPIC-02-day-list-00.screen.md) | [TOPIC-02-day-list-00.screen.html](./TOPIC-02-day-list-00.screen.html) | [02-day-list.spec.md](../specs/02-day-list.spec.md) |
| DAY-03 | Image Viewer | [DAY-03-image-viewer-00.screen.md](./DAY-03-image-viewer-00.screen.md) | [DAY-03-image-viewer-00.screen.html](./DAY-03-image-viewer-00.screen.html) | [03-image-viewer.spec.md](../specs/03-image-viewer.spec.md) |

The `-00` suffix is the variant number — bump it (`-01`, `-02`, ...) when proposing an alternate layout for the same screen, keeping `-00` as the baseline that matches production.

Each `.screen.html` prototype loads the real stylesheet (`src/moon/css/style.css`) via relative path, so it always stays visually in sync with the shipped design — it is a static snapshot (no JS, no fetch, no localStorage), not a live copy of the app.
