# HOME-01 — Topic Grid

**Spec:** [01-topic-grid.spec.md](../specs/01-topic-grid.spec.md)
**Prototype:** [HOME-01-topic-grid-00.screen.html](./HOME-01-topic-grid-00.screen.html)
**Production route:** `index.html`

## Layout

Centered header (`h1.site-title`, pink `--color-accent-strong`, Baloo 2) above a bento-style card grid (`.topic-grid`, `repeat(auto-fill, minmax(16rem, 1fr))`). Ambient snowfall sits behind everything at `z-index: 0`.

## Content shown in the prototype

Two sample topics, matching real data shape from `data/topics.json`:

- 🐰 **Mindmap Heineman GK** — 70 ngày
- 🐧 **365 Daily English Presentations** — 365 ngày

## States illustrated

- **Default** — both cards at rest.
- **Hover/focus** (`.tv-focused` on the second card) — lifted, accent border, faster mascot bounce — demonstrates both mouse hover and D-pad focus, since they share the same visual treatment.

## Notes for implementers

- The mascot emoji cycles by card *index*, not topic identity — adding a 3rd topic reuses `🐱` regardless of subject.
- Card is a single `<a>` — the whole surface is the tap/click target, matching the spec's touch-target requirement.
