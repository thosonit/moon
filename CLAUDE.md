# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, no-build website. See [`README.md`](./README.md) for what it does. Vanilla HTML/CSS/JS, no framework, no bundler, no package.json. Deployed on Vercel — source lives in `src/moon/`, and the repo-root `vercel.json` points Vercel's `outputDirectory` there.

## Structure

```text
.claude/       # Assistant config: skills, agents, hooks, settings
src/moon/      # The site itself — all HTML/CSS/JS/data
docs/
├── architecture/  # N/A — no framework/backend for this static site
├── specs/         # Feature specs
├── api/           # N/A — no server/API layer
├── database/      # N/A — data lives in src/moon/data/*.json
├── screens/       # Per-screen docs + .screen.html prototypes
├── design/        # DESIGN.md — the design system source of truth
└── superpowers/   # Per-task specs/plans (superpowers plugin defaults)
tests/         # Not used yet — no test runner configured
vercel.json    # Must stay at repo root; outputDirectory: "src/moon"
```

## Rules

- Follow [`docs/design/DESIGN.md`](./docs/design/DESIGN.md) for all styling/layout/animation — don't introduce ad hoc tokens.
- Icons: [Lucide Icons](https://lucide.dev) only for functional UI controls. No emoji/other icon sets for buttons/nav/status — emoji are fine for decorative flourishes per `DESIGN.md`.
- No build step, no tests/linter/CI configured — this is deliberate, not an oversight.
- UI copy is in Vietnamese; keep new user-facing text consistent with the existing tone.

## Running locally

```bash
npx serve src/moon
# or
python3 -m http.server 8000 --directory src/moon
```
