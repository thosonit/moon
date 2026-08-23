# 03 — Image Viewer (Day)

**Route:** `day.html?topic=<topicId>&day=<n>`
**Files:** `src/moon/day.html`, `src/moon/js/day.js`, `src/moon/js/drive-url.js`, `src/moon/js/progress.js`, `src/moon/css/style.css`

## Overview

Fullscreen, distraction-free viewer for one day's lesson image — the screen a child actually spends time looking at. Everything else (nav chrome, controls) is minimized to floating icon buttons.

## Functional requirements

1. Read `topic` and `day` (parsed as an integer) from the query string.
2. Fetch `data/topics.json` to resolve `topicMeta` (needed for `totalDays` range-checking and the alt text), then `data/<topicId>.json` for the day entries.
3. Resolve the image source for the requested day, in priority order:
   - `entry.imagePath` (local file under `data/images/...`), else
   - `toDirectImageUrl(entry.driveUrl)` — converts a Google Drive share link (`/file/d/<ID>/...` or `?id=<ID>`) into a direct `lh3.googleusercontent.com/d/<ID>=w2000` URL (chosen over the `drive.google.com/uc` endpoint, which 503s when hotlinked from `<img>`).
   - If neither resolves, show the `"Chưa có ảnh"` placeholder instead of an image.
4. Render, all as fixed-position floating controls over the image:
   - **Back** (top-left) → `topic.html?topic=<id>`.
   - **Date label** (top-left, next to Back) — today's calendar date (`en-US`, e.g. "23 Aug 2026"), *not* the lesson's date — there is no per-lesson date in the data model.
   - **Day badge** (top-right) — the day number.
   - **Fullscreen toggle** (bottom-right) — calls `viewer.requestFullscreen()` / `document.exitFullscreen()`; icon and label swap between maximize/minimize based on `fullscreenchange`.
   - **Done toggle** (bottom-left) — calls `toggleDayDone(topicId, day)`; icon swaps between an empty circle and a checked circle, and turns green when done.
5. Keyboard/remote navigation while viewing:
   - `ArrowLeft` / `ArrowRight` → go to `day - 1` / `day + 1`, clamped to `[1, topicMeta.totalDays]` (no-op past the edges).
   - `ArrowUp` / `ArrowDown` → cycle focus among the 3 icon controls (back, done, fullscreen), independent of image navigation.
   - Back key (`Escape`/`Backspace`/Tizen `10009`/webOS `461`) → returns to `topic.html?topic=<id>`.

## States

| State | Behavior |
|---|---|
| Missing `topic`, or `day` isn't a number | Not-found view. |
| Unknown topic id | Not-found view. |
| `day` outside `[1, totalDays]` | Not-found view. |
| Any fetch error | Not-found view (caught at `init()`). |
| Valid day, no `imagePath`/`driveUrl` resolvable | Viewer chrome renders normally; image area shows `"Chưa có ảnh"`. |

**Not-found view**: `#viewer-root` is replaced with `Không tìm thấy nội dung. <a href="index.html">Về trang chủ</a>`.

## Non-functional

- Icon buttons default to low opacity (0.4) and rise to full opacity on hover/focus, so they don't compete with the image.
- All icon buttons meet the touch-target size used elsewhere (`2.75rem`+).
- Done-state persistence is local-only (`localStorage`, per `moon:progress:<topicId>`) — there is no sync across devices.

## Out of scope

- Zoom/pan gestures on the image itself (the icon is named "zoom" in some docs/comments elsewhere but the current implementation only exposes fullscreen, not a dedicated zoom control).
- Editing the lesson image or title from this screen.
- Showing the lesson's own date (only today's date is shown).
