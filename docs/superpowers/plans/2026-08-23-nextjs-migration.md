# Migrate Moon sang Next.js Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the static HTML/CSS/JS "Moon - Quỳnh Như" site as a Next.js App Router + TypeScript + Tailwind CSS app with identical behavior, without introducing a database, auth, or new features.

**Architecture:** Server Components fetch topic/day data from JSON files (moved under `public/data/`) via `lib/data.ts`; the same data is also exposed through two API routes for future flexibility. Interactive pieces (grid/keyboard navigation, fullscreen, progress toggle, snowfall) become small client components/hooks that port the existing vanilla-JS logic 1:1. Styling moves from `css/style.css` to Tailwind utilities plus a Tailwind theme that mirrors the current CSS custom properties exactly, so the visual output does not change.

**Tech Stack:** Next.js (App Router), React 19, TypeScript, Tailwind CSS v3, lucide-react, npm. No test framework (explicit scope decision — see spec §1).

**Spec:** `docs/superpowers/specs/2026-08-23-nextjs-migration-design.md`

## Global Constraints

- No test framework is being set up in this plan (Vitest/Playwright are explicitly out of scope — spec §1). Verification is manual: run `npm run dev` and check behavior in the browser, plus `npx tsc --noEmit` for type safety.
- Keep behavior identical to the current static site — this is a framework migration, not a redesign or feature addition (spec §1, YAGNI).
- Use path params (`/topic/[topicId]`, `/day/[topicId]/[day]`), not query params (spec §4).
- Icons come from `lucide-react` only, no hand-rolled SVG (spec §6).
- Progress stays in `localStorage`, same key format `moon:progress:<topicId>` (spec §7).
- Tailwind theme colors/spacing/radii/shadows must reproduce the exact values currently in `src/moon/css/style.css` (spec §8) — do not invent new values.
- `data/` JSON/image assets move to `public/data/` unchanged (same relative paths, same `imagePath` strings) so no JSON content needs rewriting.
- Package manager: npm (spec §2).

---

## File Structure

```text
moon/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── page.tsx
│   ├── topic/[topicId]/page.tsx
│   ├── day/[topicId]/[day]/page.tsx
│   └── api/
│       ├── topics/route.ts
│       └── topics/[topicId]/days/route.ts
├── components/
│   ├── TopicGrid.tsx
│   ├── TopicCard.tsx
│   ├── DayList.tsx
│   ├── DayListItem.tsx
│   ├── DayViewer.tsx
│   ├── Snowfall.tsx
│   └── BackKeyNav.tsx
├── hooks/
│   ├── useProgress.ts
│   ├── useGridNav.ts
│   └── useBackKey.ts
├── lib/
│   ├── types.ts
│   ├── data.ts
│   └── drive-url.ts
├── public/
│   ├── favicon.svg / favicon-32.png / favicon-180.png
│   └── data/
│       ├── topics.json
│       ├── mindmap-heineman-gk7.json
│       ├── 365-daily-english-presentations.json
│       └── images/*.webp
├── package.json, tsconfig.json, next.config.ts, tailwind.config.ts, postcss.config.mjs
└── vercel.json (updated)
```

`src/moon/` is deleted once the new app is verified working (Task 6).

---

### Task 1: Project scaffold — Next.js + TypeScript + Tailwind + root layout

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx` (temporary placeholder, replaced in Task 3)
- Create: `.gitignore` entries for `node_modules`, `.next` (modify existing `.gitignore`)

**Interfaces:**
- Produces: Tailwind theme tokens (`colors.bg/surface/surface-alt/text/text-muted/accent/accent-strong/secondary/tertiary/success/border`, `fontFamily.heading/body`, `fontSize.base/heading/subheading`, `spacing.section/md/sm`, `borderRadius.card/row`, `boxShadow.card/card-hover/row/row-hover/icon`, `transitionTimingFunction['out-expo']`, `transitionDuration.normal`) that every later component/task relies on by class name (e.g. `bg-surface`, `rounded-card`, `shadow-card`, `ease-out-expo`, `duration-normal`, `p-md`, `pt-section`).
- Produces: root HTML shell (`<html lang="vi">`, fonts, `<body>`).

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "moon",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^16.3.2",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "lucide-react": "^0.500.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.13",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, `package-lock.json` created, no error output.

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Write `next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 5: Write `postcss.config.mjs`**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Write `tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#fff0ef",
        surface: "#fff9f9",
        "surface-alt": "#ffe1e3",
        text: "#493434",
        "text-muted": "#826b6a",
        accent: "#f8869a",
        "accent-strong": "#db4b71",
        secondary: "#f2bade",
        tertiary: "#f5dc98",
        success: "#93e4a4",
        border: "#f2d7d6",
      },
      fontFamily: {
        heading: ["var(--font-baloo-2)", "var(--font-quicksand)", "-apple-system", "sans-serif"],
        body: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        base: "clamp(1.05rem, 1rem + 0.3vw, 1.2rem)",
        heading: "clamp(2.5rem, 1.8rem + 3.5vw, 4.25rem)",
        subheading: "clamp(1.25rem, 1.1rem + 0.8vw, 1.75rem)",
      },
      spacing: {
        section: "clamp(2.5rem, 2rem + 2.5vw, 6rem)",
        md: "clamp(1rem, 0.9rem + 0.5vw, 1.5rem)",
        sm: "0.5rem",
      },
      borderRadius: {
        card: "1.75rem",
        row: "1.25rem",
      },
      boxShadow: {
        card: "0 8px 24px rgba(248, 134, 154, 0.18)",
        "card-hover": "0 12px 28px rgba(248, 134, 154, 0.3)",
        row: "0 4px 14px rgba(248, 134, 154, 0.12)",
        "row-hover": "0 8px 20px rgba(248, 134, 154, 0.25)",
        icon: "0 4px 14px rgba(248, 134, 154, 0.25)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        normal: "220ms",
      },
    },
  },
};

export default config;
```

- [ ] **Step 7: Write `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background:
    radial-gradient(circle at 8% 12%, rgba(245, 220, 152, 0.35), transparent 40%),
    radial-gradient(circle at 92% 85%, rgba(242, 186, 222, 0.35), transparent 45%),
    linear-gradient(180deg, #fff0ef, #ffe1e3);
}

/* Mascot bounce — used by .topic-mascot in components/TopicCard.tsx */
@keyframes gentle-bounce {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-6px) rotate(-4deg);
  }
}

.topic-mascot {
  animation: gentle-bounce 2.4s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}

.topic-card:hover .topic-mascot {
  animation-duration: 0.8s;
}

/* Snowfall — dynamic per-flake CSS variables set in components/Snowfall.tsx */
@keyframes snow-fall {
  0% {
    transform: translate(0, -10vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translate(var(--drift, 60px), 110vh) rotate(360deg);
    opacity: 0;
  }
}

.snowflake {
  position: absolute;
  top: -2rem;
  font-size: var(--flake-size, 1rem);
  opacity: 0.7;
  animation: snow-fall var(--fall-duration, 12s) linear infinite;
  animation-delay: var(--fall-delay, 0s);
}

@media (prefers-reduced-motion: reduce) {
  .topic-mascot,
  .snowflake {
    animation: none !important;
  }
}
```

- [ ] **Step 8: Write `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { Baloo_2, Quicksand } from "next/font/google";
import "./globals.css";

const baloo2 = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700"],
  variable: "--font-baloo-2",
});

const quicksand = Quicksand({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "700"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Lớp học của Moon - Quỳnh Như",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon-180.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${baloo2.variable} ${quicksand.variable}`}>
      <body className="min-h-screen font-body text-base text-text">{children}</body>
    </html>
  );
}
```

- [ ] **Step 9: Write placeholder `app/page.tsx`**

```tsx
export default function HomePage() {
  return <p className="p-md">Moon — đang migrate sang Next.js…</p>;
}
```

- [ ] **Step 10: Verify dev server boots**

Run: `npm run dev`
Then open `http://localhost:3000` in a browser.
Expected: page loads with the placeholder text, pink-gradient body background visible (radial + linear gradient from `app/globals.css`), no console errors. Stop the dev server (Ctrl+C) after checking.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs tailwind.config.ts app/globals.css app/layout.tsx app/page.tsx .gitignore
git commit -m "feat: scaffold Next.js + TypeScript + Tailwind project"
```

---

### Task 2: Data layer — move assets to `public/data`, `lib/`, API routes

**Files:**
- Create: `lib/types.ts`
- Create: `lib/data.ts`
- Create: `lib/drive-url.ts`
- Create: `app/api/topics/route.ts`
- Create: `app/api/topics/[topicId]/days/route.ts`
- Modify: move `src/moon/data/*` → `public/data/*` (except `.DS_Store`)
- Modify: move `src/moon/favicon.svg`, `favicon-32.png`, `favicon-180.png` → `public/`

**Interfaces:**
- Consumes: none (foundational data layer).
- Produces: `Topic { id: string; title: string; totalDays: number }`, `DayEntry { day: number; title?: string; imagePath?: string; driveUrl?: string }` (both from `lib/types.ts`); `getTopics(): Promise<Topic[]>`, `getTopicMeta(topicId: string): Promise<Topic | null>`, `getDays(topicId: string): Promise<DayEntry[]>` (from `lib/data.ts`); `toDirectImageUrl(driveUrl: string | null | undefined): string | null` (from `lib/drive-url.ts`). All later tasks (pages, API routes) import these exact names/signatures.

- [ ] **Step 1: Move data and favicon assets**

```bash
mkdir -p public/data
git mv src/moon/data/images public/data/images
git mv src/moon/data/topics.json public/data/topics.json
git mv src/moon/data/mindmap-heineman-gk7.json public/data/mindmap-heineman-gk7.json
git mv "src/moon/data/365-daily-english-presentations.json" "public/data/365-daily-english-presentations.json"
git mv "src/moon/data/MINDMAP HEINEMAN GK.pdf" "public/data/MINDMAP HEINEMAN GK.pdf"
rm -f src/moon/data/.DS_Store
git mv src/moon/favicon.svg public/favicon.svg
git mv src/moon/favicon-32.png public/favicon-32.png
git mv src/moon/favicon-180.png public/favicon-180.png
```

Expected: `public/data/topics.json`, `public/data/images/*.webp`, and the three favicon files now exist under `public/`; `src/moon/data` and the three favicon files are gone from `src/moon/`.

- [ ] **Step 2: Write `lib/types.ts`**

```typescript
export interface Topic {
  id: string;
  title: string;
  totalDays: number;
}

export interface DayEntry {
  day: number;
  title?: string;
  imagePath?: string;
  driveUrl?: string;
}
```

- [ ] **Step 3: Write `lib/drive-url.ts`**

```typescript
/**
 * Converts a Google Drive share URL into a direct-viewable image URL.
 * Accepts formats like:
 *   https://drive.google.com/file/d/<ID>/view?usp=sharing
 *   https://drive.google.com/open?id=<ID>
 * Uses the lh3.googleusercontent.com host rather than drive.google.com/uc —
 * the uc endpoint frequently returns 503 when hotlinked from an <img> tag
 * (it expects a top-level navigation), while lh3 serves reliably for embeds.
 * Returns null if no file ID can be extracted or input is empty.
 */
export function toDirectImageUrl(driveUrl: string | null | undefined): string | null {
  if (!driveUrl || typeof driveUrl !== "string") {
    return null;
  }

  const fileMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}=w2000`;
  }

  const openMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return `https://lh3.googleusercontent.com/d/${openMatch[1]}=w2000`;
  }

  return null;
}
```

- [ ] **Step 4: Write `lib/data.ts`**

```typescript
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { DayEntry, Topic } from "./types";

const DATA_DIR = path.join(process.cwd(), "public", "data");

export async function getTopics(): Promise<Topic[]> {
  const raw = await readFile(path.join(DATA_DIR, "topics.json"), "utf-8");
  return JSON.parse(raw) as Topic[];
}

export async function getTopicMeta(topicId: string): Promise<Topic | null> {
  const topics = await getTopics();
  return topics.find((topic) => topic.id === topicId) ?? null;
}

export async function getDays(topicId: string): Promise<DayEntry[]> {
  const raw = await readFile(path.join(DATA_DIR, `${topicId}.json`), "utf-8");
  return JSON.parse(raw) as DayEntry[];
}
```

- [ ] **Step 5: Write `app/api/topics/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getTopics } from "@/lib/data";

export async function GET() {
  const topics = await getTopics();
  return NextResponse.json(topics);
}
```

- [ ] **Step 6: Write `app/api/topics/[topicId]/days/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { getDays, getTopicMeta } from "@/lib/data";

export async function GET(_request: Request, { params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params;
  const topicMeta = await getTopicMeta(topicId);
  if (!topicMeta) {
    return NextResponse.json({ error: "Topic not found" }, { status: 404 });
  }
  const days = await getDays(topicId);
  return NextResponse.json(days);
}
```

- [ ] **Step 7: Verify via dev server + curl**

Run: `npm run dev` (in one terminal), then in another terminal:
```bash
curl -s http://localhost:3000/api/topics
curl -s http://localhost:3000/api/topics/mindmap-heineman-gk7/days | head -c 300
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/topics/does-not-exist/days
```
Expected: first command returns the 2-topic JSON array; second returns the mindmap day array starting with `[{"day":1,...`; third prints `404`. Stop the dev server after checking.

- [ ] **Step 8: Commit**

```bash
git add public/data public/favicon.svg public/favicon-32.png public/favicon-180.png lib app/api
git commit -m "feat: add data layer and API routes, move static data assets"
```

---

### Task 3: Home page — Snowfall, TopicCard, TopicGrid, grid keyboard navigation

**Files:**
- Create: `hooks/useGridNav.ts`
- Create: `components/Snowfall.tsx`
- Create: `components/TopicCard.tsx`
- Create: `components/TopicGrid.tsx`
- Modify: `app/page.tsx` (replace placeholder)

**Interfaces:**
- Consumes: `Topic` (`lib/types.ts`), `getTopics()` (`lib/data.ts`).
- Produces: `useGridNav<T extends HTMLElement>(containerRef: RefObject<T | null>, itemSelector: string, options?: { initialIndex?: number }): void` — reused as-is by Task 4's `DayList`. `<Snowfall />` (no props) — reused as-is by Task 4's topic page.

- [ ] **Step 1: Write `hooks/useGridNav.ts`**

```typescript
"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

const ROW_TOLERANCE_PX = 4;

interface Row {
  top: number;
  cells: HTMLElement[];
}

function groupIntoRows(items: HTMLElement[]): Row[] {
  const rows: Row[] = [];
  for (const item of items) {
    const top = Math.round(item.offsetTop);
    let row = rows.find((candidate) => Math.abs(candidate.top - top) < ROW_TOLERANCE_PX);
    if (!row) {
      row = { top, cells: [] };
      rows.push(row);
    }
    row.cells.push(item);
  }
  rows.sort((a, b) => a.top - b.top);
  return rows;
}

interface UseGridNavOptions {
  initialIndex?: number;
}

/**
 * Enables arrow-key (D-pad) navigation across a grid/list of focusable items,
 * using a roving tabindex and a `.tv-focused` class for visible focus.
 */
export function useGridNav<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  itemSelector: string,
  { initialIndex = 0 }: UseGridNavOptions = {},
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let currentIndex = 0;

    function getItems(): HTMLElement[] {
      return Array.from(container!.querySelectorAll<HTMLElement>(itemSelector));
    }

    function setFocus(index: number, items: HTMLElement[]) {
      if (!items.length) return;
      currentIndex = Math.max(0, Math.min(index, items.length - 1));
      items.forEach((item, i) => {
        item.tabIndex = i === currentIndex ? 0 : -1;
        item.classList.toggle("tv-focused", i === currentIndex);
      });
      items[currentIndex].focus();
    }

    function move(direction: "left" | "right" | "up" | "down") {
      const items = getItems();
      if (!items.length) return;
      const rows = groupIntoRows(items);
      const rowIndex = rows.findIndex((row) => row.cells.includes(items[currentIndex]));
      if (rowIndex === -1) {
        setFocus(0, items);
        return;
      }
      const row = rows[rowIndex];
      const colIndex = row.cells.indexOf(items[currentIndex]);

      if (direction === "left") {
        setFocus(items.indexOf(row.cells[Math.max(0, colIndex - 1)]), items);
      } else if (direction === "right") {
        setFocus(items.indexOf(row.cells[Math.min(row.cells.length - 1, colIndex + 1)]), items);
      } else if (direction === "up" && rowIndex > 0) {
        const targetRow = rows[rowIndex - 1];
        setFocus(items.indexOf(targetRow.cells[Math.min(colIndex, targetRow.cells.length - 1)]), items);
      } else if (direction === "down" && rowIndex < rows.length - 1) {
        const targetRow = rows[rowIndex + 1];
        setFocus(items.indexOf(targetRow.cells[Math.min(colIndex, targetRow.cells.length - 1)]), items);
      }
    }

    function handleKeydown(event: KeyboardEvent) {
      const directionByKey: Record<string, "left" | "right" | "up" | "down"> = {
        ArrowLeft: "left",
        ArrowRight: "right",
        ArrowUp: "up",
        ArrowDown: "down",
      };
      const direction = directionByKey[event.key];
      if (!direction) return;
      event.preventDefault();
      move(direction);
    }

    function handleFocusin(event: FocusEvent) {
      const items = getItems();
      const index = items.indexOf(event.target as HTMLElement);
      if (index === -1) return;
      currentIndex = index;
      items.forEach((item, i) => item.classList.toggle("tv-focused", i === index));
    }

    container.addEventListener("keydown", handleKeydown);
    container.addEventListener("focusin", handleFocusin, true);
    setFocus(initialIndex, getItems());

    return () => {
      container.removeEventListener("keydown", handleKeydown);
      container.removeEventListener("focusin", handleFocusin, true);
    };
  }, [containerRef, itemSelector, initialIndex]);
}
```

- [ ] **Step 2: Write `components/Snowfall.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";

const SNOWFLAKE_COUNT = 22;
const SNOWFLAKE_CHARS = ["❄", "❅", "❆"];

export function Snowfall() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    for (let i = 0; i < SNOWFLAKE_COUNT; i += 1) {
      const flake = document.createElement("span");
      flake.className = "snowflake text-secondary";
      flake.textContent = SNOWFLAKE_CHARS[i % SNOWFLAKE_CHARS.length];

      const left = Math.random() * 100;
      const duration = 8 + Math.random() * 10;
      const delay = Math.random() * -18;
      const size = 0.75 + Math.random() * 1.1;
      const drift = 40 + Math.random() * 80;

      flake.style.left = `${left}vw`;
      flake.style.setProperty("--fall-duration", `${duration}s`);
      flake.style.setProperty("--fall-delay", `${delay}s`);
      flake.style.setProperty("--flake-size", `${size}rem`);
      flake.style.setProperty("--drift", `${drift}px`);

      container.append(flake);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    />
  );
}
```

- [ ] **Step 3: Write `components/TopicCard.tsx`**

```tsx
import Link from "next/link";
import type { Topic } from "@/lib/types";

interface TopicCardProps {
  topic: Topic;
  mascot: string;
}

export function TopicCard({ topic, mascot }: TopicCardProps) {
  return (
    <Link
      href={`/topic/${encodeURIComponent(topic.id)}`}
      className="topic-card relative block rounded-card border-2 border-border bg-surface p-md text-text no-underline shadow-card transition-[transform,border-color,box-shadow] duration-normal ease-out-expo hover:-translate-y-1.5 hover:scale-[1.02] hover:border-accent hover:shadow-card-hover focus-visible:-translate-y-1.5 focus-visible:scale-[1.02] focus-visible:border-accent focus-visible:shadow-card-hover focus-visible:outline-none active:scale-[0.97] [&.tv-focused]:-translate-y-1.5 [&.tv-focused]:scale-[1.02] [&.tv-focused]:border-accent [&.tv-focused]:shadow-card-hover"
    >
      <span aria-hidden="true" className="topic-mascot mb-2 inline-block text-3xl">
        {mascot}
      </span>
      <h2 className="m-0 mb-2 font-heading text-subheading text-accent-strong">{topic.title}</h2>
      <p className="m-0 text-text-muted">{topic.totalDays} ngày</p>
    </Link>
  );
}
```

- [ ] **Step 4: Write `components/TopicGrid.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { useGridNav } from "@/hooks/useGridNav";
import type { Topic } from "@/lib/types";
import { TopicCard } from "./TopicCard";

const TOPIC_MASCOTS = ["🐰", "🐻", "🐱", "🐧", "🦊", "🐼"];

interface TopicGridProps {
  topics: Topic[];
}

export function TopicGrid({ topics }: TopicGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  useGridNav(gridRef, ".topic-card");

  return (
    <div ref={gridRef} className="grid gap-md [grid-template-columns:repeat(auto-fill,minmax(16rem,1fr))]">
      {topics.map((topic, index) => (
        <TopicCard key={topic.id} topic={topic} mascot={TOPIC_MASCOTS[index % TOPIC_MASCOTS.length]} />
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Replace `app/page.tsx`**

```tsx
import { getTopics } from "@/lib/data";
import { Snowfall } from "@/components/Snowfall";
import { TopicGrid } from "@/components/TopicGrid";

export default async function HomePage() {
  const topics = await getTopics();

  return (
    <>
      <Snowfall />
      <header className="relative z-10 flex flex-col items-center gap-sm px-md pb-md pt-section text-center">
        <h1 className="m-0 font-heading text-heading tracking-tight text-accent-strong">
          Lớp học của Moon - Quỳnh Như
        </h1>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-md pb-section">
        <TopicGrid topics={topics} />
      </main>
    </>
  );
}
```

- [ ] **Step 6: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000`.
Expected: title "Lớp học của Moon - Quỳnh Như" in Baloo 2/Quicksand font, snowflakes falling in background, 2 topic cards ("Mindmap Heineman GK", "365 Daily English Presentations") each with a bouncing mascot emoji. Click into a card's tab-index cell with keyboard: press Tab until a card is focused (pink ring/scale-up), then press ArrowRight/ArrowLeft/ArrowDown/ArrowUp — focus should move between the two cards accordingly. Clicking a card navigates to `/topic/<id>` (will 404 until Task 4 — that is expected at this point). Stop the dev server.

- [ ] **Step 7: Commit**

```bash
git add hooks/useGridNav.ts components/Snowfall.tsx components/TopicCard.tsx components/TopicGrid.tsx app/page.tsx
git commit -m "feat: build home page with topic grid and keyboard navigation"
```

---

### Task 4: Topic list page — progress tracking, back-key navigation, day list

**Files:**
- Create: `hooks/useProgress.ts`
- Create: `hooks/useBackKey.ts`
- Create: `components/BackKeyNav.tsx`
- Create: `components/DayListItem.tsx`
- Create: `components/DayList.tsx`
- Create: `app/topic/[topicId]/page.tsx`

**Interfaces:**
- Consumes: `DayEntry`, `Topic` (`lib/types.ts`), `getTopicMeta()`, `getDays()` (`lib/data.ts`), `useGridNav` (Task 3), `Snowfall` (Task 3).
- Produces: `useProgress(topicId: string): { completedDays: Set<number>; isDayDone: (day: number) => boolean; toggleDayDone: (day: number) => void }` — reused by Task 5's `DayViewer`. `useBackKey(onBack: () => void): void` and `<BackKeyNav href={string} />` — reused by Task 5.

- [ ] **Step 1: Write `hooks/useProgress.ts`**

```typescript
"use client";

import { useCallback, useState } from "react";

const STORAGE_PREFIX = "moon:progress:";

function readCompletedDays(topicId: string): number[] {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${topicId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((day): day is number => Number.isInteger(day)) : [];
  } catch {
    return [];
  }
}

function writeCompletedDays(topicId: string, days: number[]): void {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${topicId}`, JSON.stringify(days));
  } catch {
    // localStorage unavailable (private mode, quota) — progress just won't persist.
  }
}

export function useProgress(topicId: string) {
  const [completedDays, setCompletedDays] = useState<Set<number>>(
    () => new Set(readCompletedDays(topicId)),
  );

  const isDayDone = useCallback((day: number) => completedDays.has(day), [completedDays]);

  const toggleDayDone = useCallback(
    (day: number) => {
      setCompletedDays((prev) => {
        const next = new Set(prev);
        if (next.has(day)) {
          next.delete(day);
        } else {
          next.add(day);
        }
        writeCompletedDays(topicId, Array.from(next));
        return next;
      });
    },
    [topicId],
  );

  return { completedDays, isDayDone, toggleDayDone };
}
```

- [ ] **Step 2: Write `hooks/useBackKey.ts`**

```typescript
"use client";

import { useEffect } from "react";

const BACK_KEYS = new Set(["Escape", "Backspace", "GoBack", "BrowserBack"]);
// 10009 = Samsung Tizen remote "Back", 461 = LG webOS remote "Back".
const BACK_KEY_CODES = new Set([10009, 461]);

/**
 * Listens for TV-remote / keyboard "Back" presses (Escape, Backspace, and the
 * vendor-specific key codes Tizen and webOS remotes send) and calls `onBack`.
 */
export function useBackKey(onBack: () => void) {
  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (BACK_KEYS.has(event.key) || BACK_KEY_CODES.has(event.keyCode)) {
        event.preventDefault();
        onBack();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [onBack]);
}
```

- [ ] **Step 3: Write `components/BackKeyNav.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { useBackKey } from "@/hooks/useBackKey";

interface BackKeyNavProps {
  href: string;
}

export function BackKeyNav({ href }: BackKeyNavProps) {
  const router = useRouter();
  useBackKey(() => router.push(href));
  return null;
}
```

- [ ] **Step 4: Write `components/DayListItem.tsx`**

```tsx
import Link from "next/link";
import { Check } from "lucide-react";
import type { DayEntry } from "@/lib/types";

interface DayListItemProps {
  topicId: string;
  entry: DayEntry;
  isDone: boolean;
  itemRef?: (node: HTMLLIElement | null) => void;
}

export function DayListItem({ topicId, entry, isDone, itemRef }: DayListItemProps) {
  return (
    <li ref={itemRef} className="day-list-item relative">
      <Link
        href={`/day/${encodeURIComponent(topicId)}/${entry.day}`}
        className={`flex flex-col gap-1 rounded-row border-2 px-md py-sm text-center text-text no-underline shadow-row transition-[transform,border-color,box-shadow] duration-normal ease-out-expo hover:-translate-y-0.5 hover:scale-[1.03] hover:border-accent hover:shadow-row-hover focus-visible:-translate-y-0.5 focus-visible:scale-[1.03] focus-visible:border-accent focus-visible:shadow-row-hover focus-visible:outline-none active:scale-[0.96] [&.tv-focused]:-translate-y-0.5 [&.tv-focused]:scale-[1.03] [&.tv-focused]:border-accent [&.tv-focused]:shadow-row-hover ${
          isDone ? "border-success bg-success/20" : "border-border bg-surface"
        }`}
      >
        <span className="text-xs text-text-muted">Bài {entry.day}</span>
        <span className="font-heading font-semibold text-accent-strong">
          {entry.title || `Bài ${entry.day}`}
        </span>
        {isDone ? (
          <span
            aria-label="Đã hoàn thành"
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-success text-surface"
          >
            <Check className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </Link>
    </li>
  );
}
```

- [ ] **Step 5: Write `components/DayList.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGridNav } from "@/hooks/useGridNav";
import { useProgress } from "@/hooks/useProgress";
import type { DayEntry } from "@/lib/types";
import { DayListItem } from "./DayListItem";

interface DayListProps {
  topicId: string;
  days: DayEntry[];
}

export function DayList({ topicId, days }: DayListProps) {
  const { completedDays } = useProgress(topicId);
  const listRef = useRef<HTMLUListElement>(null);
  const latestDoneRef = useRef<HTMLLIElement | null>(null);

  const latestDoneDay = completedDays.size > 0 ? Math.max(...completedDays) : null;
  const nextDay = latestDoneDay !== null ? latestDoneDay + 1 : null;
  const nextIndex = useMemo(
    () => (nextDay !== null ? days.findIndex((entry) => entry.day === nextDay) : -1),
    [days, nextDay],
  );

  useGridNav(listRef, "a", { initialIndex: nextIndex >= 0 ? nextIndex : 0 });

  useEffect(() => {
    if (!latestDoneRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    latestDoneRef.current.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }, []);

  return (
    <ul
      ref={listRef}
      className="day-list m-0 grid list-none gap-sm p-0 [grid-template-columns:repeat(auto-fill,minmax(10rem,1fr))]"
    >
      {days.map((entry) => {
        const isDone = completedDays.has(entry.day);
        return (
          <DayListItem
            key={entry.day}
            topicId={topicId}
            entry={entry}
            isDone={isDone}
            itemRef={
              entry.day === latestDoneDay
                ? (node) => {
                    latestDoneRef.current = node;
                  }
                : undefined
            }
          />
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 6: Write `app/topic/[topicId]/page.tsx`**

```tsx
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BackKeyNav } from "@/components/BackKeyNav";
import { DayList } from "@/components/DayList";
import { Snowfall } from "@/components/Snowfall";
import { getDays, getTopicMeta } from "@/lib/data";

interface TopicPageProps {
  params: Promise<{ topicId: string }>;
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicId } = await params;
  const topicMeta = await getTopicMeta(topicId);
  if (!topicMeta) {
    notFound();
  }
  const days = await getDays(topicId);

  return (
    <>
      <Snowfall />
      <BackKeyNav href="/" />
      <header className="relative z-10 grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-md px-md pb-md pt-section">
        <Link
          href="/"
          aria-label="Về trang chủ"
          title="Về trang chủ"
          className="col-start-1 flex h-11 w-11 items-center justify-center rounded-full border-2 border-border bg-surface text-accent-strong shadow-icon"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="col-start-2 m-0 text-center font-heading text-heading text-accent-strong">
          {topicMeta.title}
        </h1>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-md pb-section">
        <DayList topicId={topicId} days={days} />
      </main>
    </>
  );
}
```

- [ ] **Step 7: Verify in browser**

Run: `npm run dev`, open `http://localhost:3000/topic/mindmap-heineman-gk7`.
Expected: header with back arrow (→ `/`) and title "Mindmap Heineman GK", grid of 70 day rows ("Bài 1" … "Bài 70" with titles like "At the Market"). Open devtools console and run `localStorage.setItem('moon:progress:mindmap-heineman-gk7', '[1,2,3]')`, reload the page — rows for day 1–3 should show the mint-green completed style and a check badge, and the grid should auto-scroll to day 3, with keyboard focus starting on day 4's row. Press Escape — should navigate back to `/`. Then run `localStorage.removeItem('moon:progress:mindmap-heineman-gk7')` to reset. Also open `http://localhost:3000/topic/does-not-exist` and confirm Next's 404 page renders. Stop the dev server.

- [ ] **Step 8: Commit**

```bash
git add hooks/useProgress.ts hooks/useBackKey.ts components/BackKeyNav.tsx components/DayListItem.tsx components/DayList.tsx "app/topic"
git commit -m "feat: build topic day-list page with progress tracking and back-key nav"
```

---

### Task 5: Day viewer page — fullscreen, done-toggle, keyboard day navigation

**Files:**
- Create: `components/DayViewer.tsx`
- Create: `app/day/[topicId]/[day]/page.tsx`

**Interfaces:**
- Consumes: `useProgress`, `useBackKey` (Task 4), `toDirectImageUrl`, `getTopicMeta`, `getDays` (Task 2).
- Produces: page route `/day/[topicId]/[day]` — final route in the app, no further consumers.

- [ ] **Step 1: Write `components/DayViewer.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CheckCircle2, Circle, Maximize, Minimize } from "lucide-react";
import { useBackKey } from "@/hooks/useBackKey";
import { useProgress } from "@/hooks/useProgress";

interface DayViewerProps {
  topicId: string;
  topicTitle: string;
  totalDays: number;
  day: number;
  imageUrl: string | null;
}

const ICON_BUTTON_CLASS =
  "viewer-icon-button fixed z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 bg-surface shadow-icon transition-[opacity,transform,border-color] duration-150 hover:scale-105 focus-visible:scale-105 focus-visible:outline-none active:scale-95";

export function DayViewer({ topicId, topicTitle, totalDays, day, imageUrl }: DayViewerProps) {
  const router = useRouter();
  const viewerRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLAnchorElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const fullscreenRef = useRef<HTMLButtonElement>(null);
  const controlRefs = [backRef, doneRef, fullscreenRef];

  const [controlIndex, setControlIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const { isDayDone, toggleDayDone } = useProgress(topicId);
  const isDone = isDayDone(day);

  useBackKey(() => router.push(`/topic/${encodeURIComponent(topicId)}`));

  useEffect(() => {
    setDateLabel(new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }));
  }, []);

  useEffect(() => {
    const active = controlRefs[controlIndex].current;
    active?.classList.add("tv-focused");
    active?.focus();
    return () => {
      active?.classList.remove("tv-focused");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controlIndex]);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (day - 1 >= 1) router.push(`/day/${encodeURIComponent(topicId)}/${day - 1}`);
          break;
        case "ArrowRight":
          event.preventDefault();
          if (day + 1 <= totalDays) router.push(`/day/${encodeURIComponent(topicId)}/${day + 1}`);
          break;
        case "ArrowUp":
          event.preventDefault();
          setControlIndex((index) => (index - 1 + controlRefs.length) % controlRefs.length);
          break;
        case "ArrowDown":
          event.preventDefault();
          setControlIndex((index) => (index + 1) % controlRefs.length);
          break;
        default:
          break;
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, totalDays, topicId, router]);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      viewerRef.current?.requestFullscreen();
    }
  }

  return (
    <div ref={viewerRef} className="viewer fixed inset-0 flex flex-col bg-bg">
      <Link
        ref={backRef}
        href={`/topic/${encodeURIComponent(topicId)}`}
        aria-label="Danh sách"
        title="Danh sách"
        className={`${ICON_BUTTON_CLASS} left-2 top-2 border-border text-accent-strong opacity-40 hover:border-accent hover:opacity-100 focus-visible:border-accent focus-visible:opacity-100`}
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <span className="fixed left-16 top-2 z-10 flex h-11 items-center whitespace-nowrap rounded-full px-4 font-heading text-xl font-semibold text-accent-strong">
        {dateLabel}
      </span>

      <span className="fixed right-2 top-2 z-10 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border-2 border-border bg-surface font-heading text-2xl font-semibold text-accent-strong shadow-icon [font-variant-numeric:tabular-nums]">
        {day}
      </span>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`${topicTitle} - Ngày ${day}`}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        ) : (
          <p className="text-center text-text-muted">Chưa có ảnh</p>
        )}
      </div>

      <button
        ref={fullscreenRef}
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
        title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
        className={`${ICON_BUTTON_CLASS} bottom-2 right-2 border-border text-accent-strong opacity-40 hover:border-accent hover:opacity-100 focus-visible:border-accent focus-visible:opacity-100`}
      >
        {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
      </button>

      <button
        ref={doneRef}
        type="button"
        onClick={() => toggleDayDone(day)}
        aria-label={isDone ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
        title={isDone ? "Đã hoàn thành" : "Đánh dấu hoàn thành"}
        className={`${ICON_BUTTON_CLASS} bottom-2 left-2 ${
          isDone
            ? "border-success text-success opacity-100"
            : "border-border text-accent-strong opacity-40 hover:border-accent hover:opacity-100 focus-visible:border-accent focus-visible:opacity-100"
        }`}
      >
        {isDone ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Write `app/day/[topicId]/[day]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import { DayViewer } from "@/components/DayViewer";
import { getDays, getTopicMeta } from "@/lib/data";
import { toDirectImageUrl } from "@/lib/drive-url";

interface DayPageProps {
  params: Promise<{ topicId: string; day: string }>;
}

export default async function DayPage({ params }: DayPageProps) {
  const { topicId, day: dayParam } = await params;
  const day = Number.parseInt(dayParam, 10);

  const topicMeta = await getTopicMeta(topicId);
  if (!topicMeta || Number.isNaN(day) || day < 1 || day > topicMeta.totalDays) {
    notFound();
  }

  const days = await getDays(topicId);
  const entry = days.find((d) => d.day === day) ?? null;
  const imageUrl = entry ? (entry.imagePath ? `/${entry.imagePath}` : toDirectImageUrl(entry.driveUrl)) : null;

  return (
    <DayViewer
      topicId={topicId}
      topicTitle={topicMeta.title}
      totalDays={topicMeta.totalDays}
      day={day}
      imageUrl={imageUrl}
    />
  );
}
```

- [ ] **Step 3: Verify full flow in browser**

Run: `npm run dev`, open `http://localhost:3000/day/mindmap-heineman-gk7/1`.
Expected:
- Ảnh "At the Market" hiển thị full-bleed, contain-fit.
- Nút back (trái trên) → về `/topic/mindmap-heineman-gk7`.
- Nút fullscreen (phải dưới) bật/tắt fullscreen, icon đổi Maximize ↔ Minimize.
- Nút done (trái dưới) toggle icon Circle ↔ CheckCircle2 và đổi màu thành success; reload trang, trạng thái done phải được giữ (đọc lại từ `localStorage`).
- `ArrowRight` → chuyển tới `/day/mindmap-heineman-gk7/2`; tại ngày 70 (`/day/mindmap-heineman-gk7/70`), `ArrowRight` không làm gì (không có ngày 71).
- Tại ngày 1, `ArrowLeft` không làm gì (không có ngày 0).
- `ArrowUp`/`ArrowDown` di chuyển focus giữa 3 nút (viền `.tv-focused` hiện rõ).
- `Escape` → về `/topic/mindmap-heineman-gk7`, và badge "đã hoàn thành" phải hiện đúng cho ngày vừa đánh dấu.
- Mở `http://localhost:3000/day/mindmap-heineman-gk7/99` → Next 404 page (vượt `totalDays`).
Stop the dev server after checking.

- [ ] **Step 4: Commit**

```bash
git add components/DayViewer.tsx "app/day"
git commit -m "feat: build day viewer page with fullscreen, done-toggle, and keyboard nav"
```

---

### Task 6: Cleanup — remove legacy static site, update config and docs, final QA pass

**Files:**
- Delete: `src/moon/` (entire directory)
- Modify: `vercel.json`
- Modify: `CLAUDE.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: the complete app from Tasks 1–5.
- Produces: none (terminal cleanup task).

- [ ] **Step 1: Remove the legacy static site**

```bash
git rm -r src/moon
```

Expected: `src/moon/` (old HTML/CSS/JS, now fully ported) is removed from the working tree and staged for deletion. `src/` directory itself may now be empty — remove it too if `git rm -r src/moon` leaves no other files under `src/`.

- [ ] **Step 2: Update `vercel.json`**

Replace its entire contents with:

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

(Removes `outputDirectory` — Next.js's own build output is used automatically by Vercel — and removes the manual no-cache headers for `.html`/`js`/`css`, which no longer apply since Next.js fingerprints build assets and manages their caching.)

- [ ] **Step 3: Update `CLAUDE.md`**

Replace the `## What this is` section body and the `## Structure` code block to reflect the new stack. Full replacement for the section from `## What this is` through the end of `## Structure`:

```markdown
## What this is

A Next.js (App Router) website. See [`README.md`](./README.md) for what it does. TypeScript, Tailwind CSS, no database. Deployed on Vercel using Next.js's own build output.

## Structure

\`\`\`text
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
\`\`\`
```

Also update the `## Running locally` section to:

```markdown
## Running locally

\`\`\`bash
npm install
npm run dev
\`\`\`
```

- [ ] **Step 4: Update `README.md`**

Replace the `## Công nghệ` section body with:

```markdown
## Công nghệ

Next.js (App Router), TypeScript, Tailwind CSS. Dữ liệu chủ đề/bài học lưu trong file JSON tĩnh dưới `public/data/`, ảnh bài học lưu ở dạng webp. Triển khai trên Vercel.
```

Replace the `## Cấu trúc dự án` code block with:

```markdown
\`\`\`text
app/          # Routes và API endpoints
components/   # React components
hooks/        # Custom hooks (progress, keyboard/TV navigation)
lib/          # Data access, types
public/data/  # JSON + ảnh bài học
docs/         # Tài liệu dự án (design system, specs, screens...)
tests/        # (chưa dùng)
vercel.json   # Cấu hình deploy Vercel
\`\`\`
```

Replace the `## Chạy thử local` code block with:

```markdown
\`\`\`bash
npm install
npm run dev
\`\`\`
```

- [ ] **Step 5: Type-check the whole project**

Run: `npm run typecheck`
Expected: exits with no errors. If it reports errors, fix them in the relevant file from Tasks 1–5 before proceeding (do not suppress with `@ts-ignore`).

- [ ] **Step 6: Full manual QA pass**

Run: `npm run dev`, open `http://localhost:3000` in a browser and, using devtools' responsive mode, check at 320px, 768px, 1024px, and 1440px widths:
- Home (`/`): topic grid readable and tappable at all 4 widths, no horizontal overflow, snowfall renders.
- Topic list (`/topic/mindmap-heineman-gk7` and `/topic/365-daily-english-presentations`): rows readable at all 4 widths, done/next-day styling works after toggling a day in the viewer.
- Day viewer (`/day/mindmap-heineman-gk7/1`): image fills viewport at all 4 widths without distortion, icon buttons stay reachable and don't overlap the image at 320px.
- Repeat the full click path once end-to-end: home → pick a topic → pick a day → toggle done → back to topic list (badge visible) → back to home.
Fix any regression found before proceeding. Stop the dev server when done.

- [ ] **Step 7: Verify production build**

Run: `npm run build`
Expected: build completes with no errors (warnings about `next/image` remote patterns etc. are fine if the build still succeeds).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: remove legacy static site, update vercel config and docs for Next.js"
```

---

## Self-Review Notes

- **Spec coverage:** §2 (framework/language/styling/data/progress/icons/pm/deploy/test decisions) → Tasks 1–6 all together. §3 (folder structure) → Task 1 scaffold + Task 2 data move. §4 (routing) → Tasks 3–5 page files. §5 (data/API layer) → Task 2. §6 (component behavior) → Tasks 3–5. §7 (hooks) → Tasks 3–4. §8 (styling) → Task 1 (`tailwind.config.ts`, `globals.css`) + all component tasks. §9 (images) → Task 5 (`next/image`, `remotePatterns` from Task 1). §10 (config changes) → Task 6. §11 (risks/manual QA) → Task 5 Step 3 and Task 6 Step 6.
- **Placeholder scan:** no TBD/TODO; every step has concrete code or an exact shell command.
- **Type consistency:** `Topic`/`DayEntry` defined once in `lib/types.ts` (Task 2) and imported by name everywhere else; `useGridNav`/`useProgress`/`useBackKey` signatures defined once (Tasks 3–4) and consumed with matching signatures in Tasks 4–5; `toDirectImageUrl` defined in Task 2 and consumed with the same signature in Task 5.
