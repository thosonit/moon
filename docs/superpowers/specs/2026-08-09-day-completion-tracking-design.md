# Day Completion Tracking — Design Spec

**Date:** 2026-08-09
**Status:** Approved

## Purpose

Let the child (or a parent) mark a lesson day as "done" while viewing it, and see which days in a topic have already been completed, without any backend.

## Storage

New module `js/progress.js`. Progress is stored client-side in `localStorage`, one key per topic:

```
moon:progress:<topicId> -> JSON array of completed day numbers, e.g. [1, 3, 4]
```

Exported functions:

- `isDayDone(topicId, day)` → `boolean`
- `toggleDayDone(topicId, day)` → `boolean` (returns the new done state)
- `getCompletedDays(topicId)` → `Set<number>`

Reads/writes are wrapped so a disabled/unavailable `localStorage` (private browsing, quota) degrades to a no-op rather than throwing.

## `day.html` — done toggle button

A new fixed icon button, `.viewer-icon-button.viewer-done-toggle`, positioned bottom-left of the viewer (the slot vacated by the old zoom controls).

- Icon: inline Lucide SVG — `circle` outline when not done, `circle-check-big` filled with `--color-success` when done (per `CLAUDE.md`, functional icons must be Lucide, not emoji).
- `aria-label` / `title`: "Đánh dấu hoàn thành" when not done, "Đã hoàn thành" when done.
- Click calls `toggleDayDone(topicId, day)`, swaps the icon/label, and toggles an `.is-done` class on the button for styling.
- State is read once on render (`isDayDone`) to set initial icon.

## `topic.html` — completed badge in day list

`renderDays()` in `js/topic.js` reads `getCompletedDays(topicId)` once and, for each day whose number is in the set, adds `.is-done` to the `<li class="day-list-item">` and appends a small Lucide `check` badge (`.day-list-done-badge`) to the corner of the card.

Styling: `.day-list-item.is-done a` gets a subtle `--color-success`-tinted border/background wash so completed days are visually distinct in the grid, without hiding the title/subtitle.

## Out of scope

- No cross-device sync — progress is per-browser/per-device only.
- No "percent complete" summary on `index.html` in this pass.
- No undo confirmation — toggling is instant and reversible by tapping again.

## Testing

Manual verification in browser (no test runner configured in this repo):

- Toggle done/undone on `day.html`, confirm icon + persisted state after reload.
- Confirm `topic.html` shows the badge for days marked done, across a page reload.
- Confirm a fresh topic/day with no stored progress renders the "not done" state without errors.
