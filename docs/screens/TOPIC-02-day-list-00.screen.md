# TOPIC-02 — Day List

**Spec:** [02-day-list.spec.md](../specs/02-day-list.spec.md)
**Prototype:** [TOPIC-02-day-list-00.screen.html](./TOPIC-02-day-list-00.screen.html)
**Production route:** `topic.html?topic=<id>`

## Layout

3-column header grid (`.topic-header`: back button | centered title | spacer) above a responsive row grid (`.day-list`, `repeat(auto-fill, minmax(10rem, 1fr))`).

## Content shown in the prototype

Five sample days from **Mindmap Heineman GK**, mixing done/not-done state:

| Day | Title | State |
|---|---|---|
| 1 | At the Market | done |
| 2 | Rex | done |
| 3 | Funny Things | **next up** (focused) |
| 4 | The Baby Animals | not done |
| 5 | Over the River | not done |

## States illustrated

- **Done** (`is-done`) — green-tinted background/border + checkmark badge, days 1–2.
- **Next up** (`tv-focused`) — day 3 shown focused, matching the real screen's default D-pad focus (`latestDoneDay + 1`).
- **Not done** — plain surface, days 4–5.
- **Back control** — top-left icon button, arrow-left, links to Home.

## Notes for implementers

- In production the "next up" row also receives scroll-into-view + initial grid-nav focus on page load — the prototype only shows the visual `.tv-focused` state, not the scroll behavior (static HTML has nothing to scroll to).
- The done badge SVG is the same `check` icon defined in `src/moon/js/icons.js`.
