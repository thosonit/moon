# Screens Overview

Static HTML prototypes of `moon`'s three real screens, paired with a short doc per screen. These mirror the shipped pages in `src/moon/` — same CSS classes, same tokens from [DESIGN.md](../design/DESIGN.md) — with sample data baked in for quick visual review without running the app or wiring JSON data.

| Code | Screen | Doc | Prototype | Corresponding spec |
|---|---|---|---|---|
| HOME-01 | Topic Grid | [HOME-01-topic-grid-00.screen.md](./HOME-01-topic-grid-00.screen.md) | [HOME-01-topic-grid-00.screen.html](./HOME-01-topic-grid-00.screen.html) | [01-topic-grid.spec.md](../specs/01-topic-grid.spec.md) |
| TOPIC-02 | Day List | [TOPIC-02-day-list-00.screen.md](./TOPIC-02-day-list-00.screen.md) | [TOPIC-02-day-list-00.screen.html](./TOPIC-02-day-list-00.screen.html) | [02-day-list.spec.md](../specs/02-day-list.spec.md) |
| DAY-03 | Image Viewer | [DAY-03-image-viewer-00.screen.md](./DAY-03-image-viewer-00.screen.md) | [DAY-03-image-viewer-00.screen.html](./DAY-03-image-viewer-00.screen.html) | [03-image-viewer.spec.md](../specs/03-image-viewer.spec.md) |

The `-00` suffix is the variant number — bump it (`-01`, `-02`, ...) when proposing an alternate layout for the same screen, keeping `-00` as the baseline that matches production.

Each `.screen.html` prototype is fully self-contained — CSS is inlined in its own `<style>` block (a frozen copy of the relevant rules from `src/moon/css/style.css`), with no relative link back into `src/`. This is deliberate: a screen doc must stay readable/renderable on its own even if the source implementation changes, moves, or is refactored later. There is no JS, no fetch, no localStorage — only the visual states called out in each doc.

If the real `src/moon/css/style.css` tokens change, these prototypes will drift and should be refreshed by hand — they are a snapshot, not a live reference.
