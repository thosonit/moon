# TV Remote (D-pad) Navigation — Design Spec

**Date:** 2026-08-09
**Status:** Approved

## Purpose

When the site is opened in a smart-TV browser, there's no mouse/touch — only a
remote with arrow keys, OK/Enter, and a Back button. Add keyboard/D-pad
navigation across all three screens so the app is usable without a mouse.

## Shared module: `js/tv-nav.js`

- `enableGridNav(container, itemSelector)` — roving-tabindex arrow navigation
  over a set of items inside `container`. Items are grouped into visual rows
  by `offsetTop` (tolerant of sub-pixel differences), so it adapts to however
  many columns the responsive grid currently has. Left/Right move within a
  row, Up/Down move to the nearest column in the row above/below. A
  `.tv-focused` class is toggled for a guaranteed-visible focus ring
  (in addition to native `:focus-visible`, which programmatic `.focus()`
  calls don't always trigger). Enter/Space activation is native browser
  behavior on the focused `<a>`/`<button>` — no extra handling needed.
- `enableBackKey(handler)` — listens for `Escape`, `Backspace`, and the
  vendor-specific key codes Tizen (`10009`) and webOS (`461`) remotes send for
  their dedicated Back button, and calls `handler`.

## Per-screen wiring

- **`index.html`** (`js/app.js`): `enableGridNav(topicGrid, ".topic-card")`
  after rendering. No back-key handler — it's the root screen.
- **`topic.html`** (`js/topic.js`): `enableGridNav(dayList, "a")` after
  rendering. `enableBackKey` navigates to `index.html`, matching the existing
  back link's target.
- **`day.html`** (`js/day.js`): this screen isn't a grid — it's one image plus
  three floating icon buttons — so it gets bespoke handling instead of
  `enableGridNav`:
  - Left/Right go to the previous/next day (clamped to `[1, totalDays]`),
    matching the natural "flip the page" gesture for a remote.
  - Up/Down cycle focus (wrapping) through the icon buttons in a fixed
    logical order: back, done-toggle, fullscreen.
  - `enableBackKey` navigates to `topic.html` for the current topic, matching
    the existing back button's target.

## Styling

`.tv-focused` is added alongside each screen's existing `:hover`/
`:focus-visible` selector (`.topic-card`, `.day-list-item a`,
`.viewer-icon-button`) so keyboard/remote focus reuses the same visual
treatment as mouse hover — no new visual language introduced.

## Out of scope

- No on-screen remote/gamepad emulation or Gamepad API support — only
  keyboard events, which is what TV browsers send for remote presses.
- No focus trapping/restoration across page navigations — each page starts
  fresh with focus on its first item, consistent with a normal page load.
