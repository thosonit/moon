# 02 — Day List (Topic)

**Route:** `topic.html?topic=<topicId>`
**Files:** `src/moon/topic.html`, `src/moon/js/topic.js`, `src/moon/css/style.css`

## Overview

Lists every day/lesson within one topic as a "sticker book" row grid, showing which days are already done and jumping straight to the next one to study.

## Functional requirements

1. Read `topic` from the query string.
2. Fetch `data/topics.json` to resolve the topic's `title`, and `data/<topicId>.json` for the day list (`{ day, title, imagePath | driveUrl }[]`).
3. Set the header title (`#topic-title`) to the topic's `title`.
4. Render one `.day-list-item > a` per day entry:
   - Subtitle: `"Bài {day}"`.
   - Title: `entry.title`, falling back to `"Bài {day}"` if missing.
   - `href="day.html?topic={topicId}&day={day}"`.
5. Completion state (`src/moon/js/progress.js`, `getCompletedDays(topicId)` from `localStorage`):
   - A done day gets the `.is-done` class (green-tinted background/border) and a checkmark badge (`ICONS.check`, `aria-label="Đã hoàn thành"`).
6. **Auto-scroll**: on render, scroll the most-recently-completed day's row into view (`block: "center"`), instant if `prefers-reduced-motion: reduce`, smooth otherwise.
7. **Default focus**: grid/D-pad navigation (`enableGridNav`) starts focus on the day right after the latest completed one (`latestDoneDay + 1`), or index 0 if nothing is completed yet.
8. Back button (top-left, arrow-left icon) links to `index.html`; the hardware/remote "Back" key does the same (`enableBackKey`).
9. Ambient snowfall decoration, same as the home screen.

## States

| State | Behavior |
|---|---|
| Missing `topic` param | Not-found view (see below). |
| Unknown `topic` id (not in `topics.json`) | Not-found view. |
| Fetch/network error (any step) | Not-found view (caught at the `init()` level). |
| Valid topic, zero days | List renders empty — no explicit empty-state message today. |

**Not-found view**: header title becomes `"Không tìm thấy chủ đề"`, and `#day-list` is replaced with `Chủ đề này không tồn tại. <a href="index.html">Về trang chủ</a>`.

## Interaction

- Pointer: click/tap a day → `day.html?topic=<id>&day=<n>`.
- Keyboard/remote: arrow keys navigate the day grid; Back key (`Escape`/`Backspace`/Tizen `10009`/webOS `461`) returns to the home screen.
- Hover/focus: row lifts slightly, border turns accent pink.

## Non-functional

- The entire row (not just the title text) must stay tappable.
- Grid columns are responsive (`minmax(10rem, 1fr)`), not fixed.

## Out of scope

- Editing/reordering days.
- Marking a day done from this screen (done state is set only from the image viewer — see [03-image-viewer.spec.md](./03-image-viewer.spec.md)).
