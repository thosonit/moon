# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A Next.js (App Router) website. See [`README.md`](./README.md) for what it does. TypeScript, Tailwind CSS, no database. Deployed on Vercel using Next.js's own build output.

## Structure

```text
app/           # Routes: /, /topic/[topicId], /day/[topicId]/[day], /api/topics/*
components/    # React components (TopicGrid, DayList, DayViewer, Snowfall, ...)
hooks/         # useProgress, useGridNav, useBackKey
lib/           # data.ts (reads JSON under public/data), drive-url.ts, types.ts
public/data/   # topics.json, per-topic day JSON, images — served as static files
docs/
├── architecture/  # N/A — no backend beyond the two thin API routes in app/api
├── specs/         # Feature specs
├── api/           # N/A — see app/api/*/route.ts for the two JSON endpoints
├── database/      # N/A — data lives in public/data/*.json
├── screens/       # Per-screen docs + .screen.html prototypes
├── design/        # DESIGN.md — the design system source of truth
└── superpowers/   # Per-task specs/plans (superpowers plugin defaults)
tests/         # Not used yet — no test runner configured
vercel.json    # Must stay at repo root
```

## Rules

- Follow [`docs/design/DESIGN.md`](./docs/design/DESIGN.md) for all styling/layout/animation — don't introduce ad hoc tokens.
- Icons: [Lucide Icons](https://lucide.dev) only for functional UI controls. No emoji/other icon sets for buttons/nav/status — emoji are fine for decorative flourishes per `DESIGN.md`.
- No test framework or linter is configured — this is deliberate, not an oversight (Next.js's own build/typecheck is the only verification gate).
- UI copy is in Vietnamese; keep new user-facing text consistent with the existing tone.

## Running locally

```bash
npm install
npm run dev
```
