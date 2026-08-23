# 01 — Topic Grid (Home)

**Route:** `index.html`
**Files:** `src/moon/index.html`, `src/moon/js/app.js`, `src/moon/css/style.css`

## Overview

The landing screen. Shows every learning topic as a bouncy mascot card in a bento-style grid. This is the entry point for Moon (Quỳnh Như, age 5) to pick what to study today.

## Functional requirements

1. On load, fetch `data/topics.json` — an array of `{ id, title, totalDays }`.
2. Render one `.topic-card` (`<a>`) per topic, in DOM order, into `#topic-grid`:
   - A mascot emoji (`🐰 🐻 🐱 🐧 🦊 🐼`, cycling by index — not tied to topic identity).
   - The topic title (`<h2>`).
   - A meta line: `"{totalDays} ngày"`.
   - `href="topic.html?topic={id}"` (URL-encoded).
3. Grid uses `repeat(auto-fill, minmax(16rem, 1fr))` — column count is responsive, not fixed.
4. Ambient decoration: 22 falling snowflake glyphs (`initSnowfall()`), purely visual, `aria-hidden`.
5. Grid/D-pad navigation is enabled on the card list via `enableGridNav`, starting focus at index 0.

## States

| State | Behavior |
|---|---|
| Loading | Grid is empty until the fetch resolves (no explicit spinner). |
| Loaded | Cards render as described above. |
| Fetch failure | Grid text is replaced with `"Không tải được danh sách chủ đề."` and the error is logged to console. |
| Empty topics array | Grid renders with zero cards — no explicit empty-state message today. |

## Interaction

- Pointer: click/tap a card → navigates to `topic.html?topic=<id>`.
- Keyboard/remote: arrow keys move focus row-by-row/column-by-column (`enableGridNav`); Enter/click activates the focused card's link (native anchor behavior).
- Hover/focus: card lifts (`translateY(-0.35rem) scale(1.02)`), border turns accent pink, mascot bounce speeds up from 2.4s → 0.8s.

## Non-functional

- Card content must stay large-touch-target friendly — the whole card is the tap target, not just the title.
- No sharp corners: cards use `border-radius: 1.75rem`.

## Out of scope

- Sorting/filtering topics.
- Showing per-topic completion progress on the card (today the card only shows total day count, not how many are done — see [02-day-list.spec.md](./02-day-list.spec.md) for where completion is surfaced).
