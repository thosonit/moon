# DAY-03 — Image Viewer

**Spec:** [03-image-viewer.spec.md](../specs/03-image-viewer.spec.md)
**Prototype:** [DAY-03-image-viewer-00.screen.html](./DAY-03-image-viewer-00.screen.html)
**Production route:** `day.html?topic=<id>&day=<n>`

## Layout

Fullscreen viewer (`.viewer`, `position: fixed; inset: 0`) with the lesson image centered and 5 floating controls layered above it: back (top-left), date label (top-left, next to back), day badge (top-right), fullscreen toggle (bottom-right), done toggle (bottom-left).

## Content shown in the prototype

Day 3 of **Mindmap Heineman GK** — "Funny Things" — rendered as the `"Chưa có ảnh"` placeholder state (no real image bundled with the prototype), with:

- Done toggle in its **not-done** state (empty circle icon).
- Fullscreen toggle in its **not-fullscreen** state (maximize icon).
- Both icon buttons shown at full opacity to make them visible in a static doc — in production they idle at `opacity: 0.4` and rise to `1` on hover/focus.

## States to check when implementing changes

- **Done vs. not-done** — toggling swaps `circle` ↔ `circleCheck` and applies `.is-done` (green).
- **Fullscreen vs. windowed** — toggling swaps `maximize` ↔ `minimize`, driven by the native `fullscreenchange` event, not just the click handler.
- **Image resolved from `imagePath`** vs. **resolved from `driveUrl`** vs. **unresolvable → placeholder** (see `src/moon/js/drive-url.js`).
- **Day-range edges** — `ArrowLeft` at day 1 / `ArrowRight` at the last day must no-op, not wrap or navigate out of range.

## Notes for implementers

- The date shown is always *today's* date, not the lesson's date — there's no per-lesson date field in `data/<topicId>.json`. Don't "fix" this without confirming it's actually meant to be a real date field first (see the spec's Out of scope note).
- `ArrowUp`/`ArrowDown` (control focus) and `ArrowLeft`/`ArrowRight` (day navigation) are independent — a keyboard/remote user can cycle which button is focused without changing the image, and vice versa.
