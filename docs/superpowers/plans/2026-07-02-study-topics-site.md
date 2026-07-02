# Study Topics Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, no-build-step HTML/CSS/JS site, deployable to Vercel, showing study "topics" — starting with "60 ngày thuyết trình" — where each topic has a list of days, and each day shows one full/fit-screen public Google Drive image.

**Architecture:** Three static pages (`index.html`, `topic.html`, `day.html`) each backed by one small JS module that fetches JSON data and renders into the DOM. Data lives in per-topic JSON files under `data/`. No frameworks, no build tooling, no server code — Vercel serves the files as-is.

**Tech Stack:** Plain HTML5, CSS3 (custom properties, no preprocessor), vanilla ES modules (`<script type="module">`), `fetch()` for JSON loading. No npm dependencies required for the site itself.

## Global Constraints

- No build step — files must run directly when served statically (Vercel static hosting or any local static server).
- Data lives in JSON files committed to the repo (`data/topics.json`, `data/<topic-id>.json`) — no database, no server-side code.
- Google Drive links are stored as raw share URLs (`https://drive.google.com/file/d/<ID>/view...`) in JSON; client JS converts them to `https://drive.google.com/uc?id=<ID>` for `<img src>`.
- Visual style: light editorial/clean — light background, magazine-scale heading hierarchy, intentional (non-uniform) spacing rhythm, minimal semantic accent color. No progress-tracking UI.
- Missing/invalid `driveUrl` → show a "Chưa có ảnh" placeholder, never a broken `<img>`.
- Invalid `topic` or `day` query param → show a "Not found" message with a link back to `index.html`.
- Testing is manual (static informational site, no test framework in scope): verify at breakpoints 320/768/1024/1440, verify Drive URL conversion, verify Prev/Next boundaries at day 1 and day 60, verify placeholder for empty `driveUrl`.

---

## File Structure

```
moon/
├── index.html
├── topic.html
├── day.html
├── data/
│   ├── topics.json
│   └── 60-ngay-thuyet-trinh.json
├── css/
│   └── style.css
├── js/
│   ├── drive-url.js      # pure helper: parse Drive share URL -> direct image URL
│   ├── app.js             # index.html controller
│   ├── topic.js            # topic.html controller
│   └── day.js               # day.html controller
└── vercel.json
```

- `js/drive-url.js` is isolated because it's pure logic (easy to unit-test in isolation via a manual console check) reused conceptually by `topic.js` (thumbnail-free, not needed there) and `day.js` (full image).
- Each page controller (`app.js`, `topic.js`, `day.js`) owns exactly one page's data-fetch + render + DOM-wiring responsibility.

---

### Task 1: Project scaffold, data files, and Vercel config

**Files:**
- Create: `data/topics.json`
- Create: `data/60-ngay-thuyet-trinh.json`
- Create: `vercel.json`
- Create: `.gitignore`

**Interfaces:**
- Produces: `data/topics.json` shape `[{ id: string, title: string, totalDays: number }]`
- Produces: `data/<topic-id>.json` shape `[{ day: number, driveUrl: string }]` (one entry per day, 1..totalDays, `driveUrl` may be `""`)

- [ ] **Step 1: Create `data/topics.json`**

```json
[
  {
    "id": "60-ngay-thuyet-trinh",
    "title": "60 ngày thuyết trình",
    "totalDays": 60
  }
]
```

- [ ] **Step 2: Create `data/60-ngay-thuyet-trinh.json` with 60 placeholder entries**

Generate via shell so all 60 entries are present and correctly numbered:

```bash
node -e "
const days = Array.from({ length: 60 }, (_, i) => ({ day: i + 1, driveUrl: '' }));
require('fs').writeFileSync('data/60-ngay-thuyet-trinh.json', JSON.stringify(days, null, 2) + '\n');
"
```

Expected: `data/60-ngay-thuyet-trinh.json` exists with 60 objects, `day` fields 1 through 60 in order, each `driveUrl: ""`.

- [ ] **Step 3: Verify JSON is valid**

Run: `node -e "console.log(JSON.parse(require('fs').readFileSync('data/60-ngay-thuyet-trinh.json')).length)"`
Expected output: `60`

- [ ] **Step 4: Create `vercel.json`**

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

- [ ] **Step 5: Create `.gitignore`**

```
.DS_Store
node_modules/
```

- [ ] **Step 6: Commit**

```bash
git add data/topics.json data/60-ngay-thuyet-trinh.json vercel.json .gitignore
git commit -m "chore: add topic data files and vercel config"
```

---

### Task 2: Shared CSS foundation

**Files:**
- Create: `css/style.css`

**Interfaces:**
- Produces: CSS custom properties (`--color-bg`, `--color-text`, `--color-accent`, `--color-surface`, `--space-*`, `--text-*`) and shared classes (`.topic-grid`, `.topic-card`, `.day-list`, `.day-list-item`, `.viewer`, `.viewer-image`, `.viewer-controls`, `.placeholder`, `.not-found`) consumed by all three HTML pages.

- [ ] **Step 1: Write the base stylesheet**

```css
:root {
  --color-bg: oklch(98% 0.005 90);
  --color-surface: oklch(100% 0 0);
  --color-text: oklch(20% 0.01 90);
  --color-text-muted: oklch(45% 0.01 90);
  --color-accent: oklch(55% 0.16 30);
  --color-border: oklch(90% 0.005 90);

  --text-base: clamp(1rem, 0.94rem + 0.3vw, 1.125rem);
  --text-heading: clamp(2rem, 1.4rem + 3vw, 3.5rem);
  --text-subheading: clamp(1.25rem, 1.1rem + 0.8vw, 1.75rem);

  --space-section: clamp(2.5rem, 2rem + 2.5vw, 6rem);
  --space-md: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);
  --space-sm: 0.5rem;

  --duration-normal: 220ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: "Georgia", "Iowan Old Style", serif;
  font-size: var(--text-base);
  line-height: 1.5;
}

header.site-header {
  padding: var(--space-section) var(--space-md) var(--space-md);
}

h1.site-title {
  font-size: var(--text-heading);
  margin: 0;
  letter-spacing: -0.02em;
}

main {
  padding: 0 var(--space-md) var(--space-section);
  max-width: 72rem;
  margin: 0 auto;
}

a {
  color: inherit;
}

/* Topic grid (index.html) */
.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: var(--space-md);
}

.topic-card {
  display: block;
  padding: var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  text-decoration: none;
  transition: transform var(--duration-normal) var(--ease-out-expo),
    border-color var(--duration-normal) var(--ease-out-expo);
}

.topic-card:hover,
.topic-card:focus-visible {
  transform: translateY(-0.25rem);
  border-color: var(--color-accent);
  outline: none;
}

.topic-card h2 {
  font-size: var(--text-subheading);
  margin: 0 0 var(--space-sm);
}

.topic-card p {
  color: var(--color-text-muted);
  margin: 0;
}

/* Day list (topic.html) */
.day-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  gap: var(--space-sm);
}

.day-list-item a {
  display: block;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  text-align: center;
  text-decoration: none;
  transition: border-color var(--duration-normal) var(--ease-out-expo);
}

.day-list-item a:hover,
.day-list-item a:focus-visible {
  border-color: var(--color-accent);
  outline: none;
}

/* Viewer (day.html) */
.viewer {
  position: fixed;
  inset: 0;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
}

.viewer-image-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.viewer-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.viewer-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  border-top: 1px solid var(--color-border);
}

.viewer-controls button,
.viewer-controls a {
  font: inherit;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  cursor: pointer;
  text-decoration: none;
  color: var(--color-text);
}

.viewer-controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.placeholder,
.not-found {
  color: var(--color-text-muted);
  text-align: center;
  padding: var(--space-section) var(--space-md);
}
```

- [ ] **Step 2: Commit**

```bash
git add css/style.css
git commit -m "feat: add shared stylesheet with light editorial styling"
```

---

### Task 3: Drive URL conversion helper

**Files:**
- Create: `js/drive-url.js`

**Interfaces:**
- Produces: `export function toDirectImageUrl(driveUrl)` — returns the direct-view URL string (`https://drive.google.com/uc?id=<ID>`) if `driveUrl` contains a parseable Drive file ID, otherwise returns `null`.
- Consumes: nothing (pure function, no dependencies).

- [ ] **Step 1: Write `js/drive-url.js`**

```js
/**
 * Converts a Google Drive share URL into a direct-viewable image URL.
 * Accepts formats like:
 *   https://drive.google.com/file/d/<ID>/view?usp=sharing
 *   https://drive.google.com/open?id=<ID>
 * Returns null if no file ID can be extracted or input is empty.
 */
export function toDirectImageUrl(driveUrl) {
  if (!driveUrl || typeof driveUrl !== "string") {
    return null;
  }

  const fileMatch = driveUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/uc?id=${fileMatch[1]}`;
  }

  const openMatch = driveUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openMatch) {
    return `https://drive.google.com/uc?id=${openMatch[1]}`;
  }

  return null;
}
```

- [ ] **Step 2: Manually verify the three cases in a Node REPL**

Run:

```bash
node --input-type=module -e "
import { toDirectImageUrl } from './js/drive-url.js';
console.log(toDirectImageUrl('https://drive.google.com/file/d/1AbCdEfGhIjK/view?usp=sharing'));
console.log(toDirectImageUrl('https://drive.google.com/open?id=1AbCdEfGhIjK'));
console.log(toDirectImageUrl(''));
console.log(toDirectImageUrl(undefined));
"
```

Expected output (4 lines):
```
https://drive.google.com/uc?id=1AbCdEfGhIjK
https://drive.google.com/uc?id=1AbCdEfGhIjK
null
null
```

- [ ] **Step 3: Commit**

```bash
git add js/drive-url.js
git commit -m "feat: add Google Drive URL conversion helper"
```

---

### Task 4: Home page — topic grid

**Files:**
- Create: `index.html`
- Create: `js/app.js`

**Interfaces:**
- Consumes: `data/topics.json` (shape from Task 1), `css/style.css` classes `.topic-grid`, `.topic-card` (from Task 2).
- Produces: none consumed by later tasks (leaf page), but establishes the query-param link convention `topic.html?topic=<id>` that Task 5 must read.

- [ ] **Step 1: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Chủ đề học tập</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="site-header">
    <h1 class="site-title">Chủ đề học tập</h1>
  </header>
  <main>
    <div id="topic-grid" class="topic-grid"></div>
  </main>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `js/app.js`**

```js
async function loadTopics() {
  const response = await fetch("data/topics.json");
  if (!response.ok) {
    throw new Error(`Failed to load topics.json: ${response.status}`);
  }
  return response.json();
}

function renderTopics(topics) {
  const grid = document.getElementById("topic-grid");
  grid.innerHTML = "";

  for (const topic of topics) {
    const card = document.createElement("a");
    card.className = "topic-card";
    card.href = `topic.html?topic=${encodeURIComponent(topic.id)}`;

    const title = document.createElement("h2");
    title.textContent = topic.title;

    const meta = document.createElement("p");
    meta.textContent = `${topic.totalDays} ngày`;

    card.append(title, meta);
    grid.append(card);
  }
}

loadTopics()
  .then(renderTopics)
  .catch((error) => {
    const grid = document.getElementById("topic-grid");
    grid.textContent = "Không tải được danh sách chủ đề.";
    console.error(error);
  });
```

- [ ] **Step 3: Manually verify in a local static server**

Run: `npx serve . -l 4173` (or any static file server) from the project root, then open `http://localhost:4173/index.html`.

Expected: page shows heading "Chủ đề học tập" and one card "60 ngày thuyết trình — 60 ngày". Clicking the card navigates to `topic.html?topic=60-ngay-thuyet-trinh`.

- [ ] **Step 4: Commit**

```bash
git add index.html js/app.js
git commit -m "feat: add home page with topic grid"
```

---

### Task 5: Topic page — day list

**Files:**
- Create: `topic.html`
- Create: `js/topic.js`

**Interfaces:**
- Consumes: `data/topics.json` and `data/<topic-id>.json` (Task 1 shapes), query param `topic` set by Task 4's links, CSS classes `.day-list`, `.day-list-item`, `.not-found` (Task 2).
- Produces: link convention `day.html?topic=<id>&day=<n>` that Task 6 must read.

- [ ] **Step 1: Write `topic.html`**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Danh sách ngày</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <header class="site-header">
    <h1 class="site-title" id="topic-title">Đang tải...</h1>
    <p><a href="index.html">&larr; Về trang chủ</a></p>
  </header>
  <main>
    <ul id="day-list" class="day-list"></ul>
  </main>
  <script type="module" src="js/topic.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `js/topic.js`**

```js
function getTopicIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get("topic");
}

async function loadTopicMeta(topicId) {
  const response = await fetch("data/topics.json");
  if (!response.ok) {
    throw new Error(`Failed to load topics.json: ${response.status}`);
  }
  const topics = await response.json();
  return topics.find((topic) => topic.id === topicId) || null;
}

async function loadDays(topicId) {
  const response = await fetch(`data/${topicId}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load data/${topicId}.json: ${response.status}`);
  }
  return response.json();
}

function renderNotFound() {
  document.getElementById("topic-title").textContent = "Không tìm thấy chủ đề";
  const list = document.getElementById("day-list");
  list.outerHTML = `<p class="not-found">Chủ đề này không tồn tại. <a href="index.html">Về trang chủ</a></p>`;
}

function renderDays(topicId, topicMeta, days) {
  document.getElementById("topic-title").textContent = topicMeta.title;

  const list = document.getElementById("day-list");
  list.innerHTML = "";

  for (const entry of days) {
    const item = document.createElement("li");
    item.className = "day-list-item";

    const link = document.createElement("a");
    link.href = `day.html?topic=${encodeURIComponent(topicId)}&day=${entry.day}`;
    link.textContent = `Ngày ${entry.day}`;

    item.append(link);
    list.append(item);
  }
}

async function init() {
  const topicId = getTopicIdFromQuery();
  if (!topicId) {
    renderNotFound();
    return;
  }

  const topicMeta = await loadTopicMeta(topicId);
  if (!topicMeta) {
    renderNotFound();
    return;
  }

  const days = await loadDays(topicId);
  renderDays(topicId, topicMeta, days);
}

init().catch((error) => {
  console.error(error);
  renderNotFound();
});
```

- [ ] **Step 3: Manually verify**

With the same local server running, open `http://localhost:4173/topic.html?topic=60-ngay-thuyet-trinh`.

Expected: heading shows "60 ngày thuyết trình", grid shows 60 items labeled "Ngày 1" through "Ngày 60", each linking to `day.html?topic=60-ngay-thuyet-trinh&day=N`.

Then open `http://localhost:4173/topic.html?topic=does-not-exist`.

Expected: heading shows "Không tìm thấy chủ đề" and a "Chủ đề này không tồn tại." message with a link back to the home page.

- [ ] **Step 4: Commit**

```bash
git add topic.html js/topic.js
git commit -m "feat: add topic page with day list"
```

---

### Task 6: Day viewer page — full/fit-screen image with Prev/Next/Back

**Files:**
- Create: `day.html`
- Create: `js/day.js`

**Interfaces:**
- Consumes: `data/topics.json`, `data/<topic-id>.json` (Task 1), `toDirectImageUrl` from `js/drive-url.js` (Task 3), query params `topic`/`day` set by Task 5's links, CSS classes `.viewer`, `.viewer-image-wrap`, `.viewer-image`, `.viewer-controls`, `.placeholder`, `.not-found` (Task 2).
- Produces: nothing consumed by later tasks (leaf page).

- [ ] **Step 1: Write `day.html`**

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Xem ảnh ngày</title>
  <link rel="stylesheet" href="css/style.css" />
</head>
<body>
  <div id="viewer-root"></div>
  <script type="module" src="js/day.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `js/day.js`**

```js
import { toDirectImageUrl } from "./drive-url.js";

function getParams() {
  const params = new URLSearchParams(window.location.search);
  const topicId = params.get("topic");
  const day = Number.parseInt(params.get("day"), 10);
  return { topicId, day };
}

async function loadTopicMeta(topicId) {
  const response = await fetch("data/topics.json");
  if (!response.ok) {
    throw new Error(`Failed to load topics.json: ${response.status}`);
  }
  const topics = await response.json();
  return topics.find((topic) => topic.id === topicId) || null;
}

async function loadDays(topicId) {
  const response = await fetch(`data/${topicId}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load data/${topicId}.json: ${response.status}`);
  }
  return response.json();
}

function renderNotFound(root) {
  root.innerHTML = `<p class="not-found">Không tìm thấy nội dung. <a href="index.html">Về trang chủ</a></p>`;
}

function renderViewer(root, { topicId, topicMeta, days, day }) {
  const entry = days.find((d) => d.day === day);
  const imageUrl = entry ? toDirectImageUrl(entry.driveUrl) : null;

  const isFirst = day <= 1;
  const isLast = day >= topicMeta.totalDays;

  root.innerHTML = "";

  const viewer = document.createElement("div");
  viewer.className = "viewer";

  const imageWrap = document.createElement("div");
  imageWrap.className = "viewer-image-wrap";

  if (imageUrl) {
    const img = document.createElement("img");
    img.className = "viewer-image";
    img.src = imageUrl;
    img.alt = `${topicMeta.title} - Ngày ${day}`;
    imageWrap.append(img);
  } else {
    const placeholder = document.createElement("p");
    placeholder.className = "placeholder";
    placeholder.textContent = "Chưa có ảnh";
    imageWrap.append(placeholder);
  }

  const controls = document.createElement("div");
  controls.className = "viewer-controls";

  const backLink = document.createElement("a");
  backLink.href = `topic.html?topic=${encodeURIComponent(topicId)}`;
  backLink.textContent = "← Danh sách";

  const prevButton = document.createElement("button");
  prevButton.textContent = "‹ Trước";
  prevButton.disabled = isFirst;
  prevButton.addEventListener("click", () => {
    window.location.href = `day.html?topic=${encodeURIComponent(topicId)}&day=${day - 1}`;
  });

  const label = document.createElement("span");
  label.textContent = `Ngày ${day} / ${topicMeta.totalDays}`;

  const nextButton = document.createElement("button");
  nextButton.textContent = "Sau ›";
  nextButton.disabled = isLast;
  nextButton.addEventListener("click", () => {
    window.location.href = `day.html?topic=${encodeURIComponent(topicId)}&day=${day + 1}`;
  });

  controls.append(backLink, prevButton, label, nextButton);
  viewer.append(imageWrap, controls);
  root.append(viewer);
}

async function init() {
  const root = document.getElementById("viewer-root");
  const { topicId, day } = getParams();

  if (!topicId || Number.isNaN(day)) {
    renderNotFound(root);
    return;
  }

  const topicMeta = await loadTopicMeta(topicId);
  if (!topicMeta || day < 1 || day > topicMeta.totalDays) {
    renderNotFound(root);
    return;
  }

  const days = await loadDays(topicId);
  renderViewer(root, { topicId, topicMeta, days, day });
}

init().catch((error) => {
  console.error(error);
  renderNotFound(document.getElementById("viewer-root"));
});
```

- [ ] **Step 3: Manually verify boundary and placeholder behavior**

With the local server running:

1. Open `http://localhost:4173/day.html?topic=60-ngay-thuyet-trinh&day=1`.
   Expected: "‹ Trước" button is disabled, "Sau ›" is enabled, label reads "Ngày 1 / 60", image area shows "Chưa có ảnh" (since Task 1's placeholder data has empty `driveUrl`).
2. Click "Sau ›". Expected: URL becomes `day.html?topic=60-ngay-thuyet-trinh&day=2`, label reads "Ngày 2 / 60".
3. Open `http://localhost:4173/day.html?topic=60-ngay-thuyet-trinh&day=60` directly.
   Expected: "Sau ›" is disabled, "‹ Trước" is enabled, label reads "Ngày 60 / 60".
4. Open `http://localhost:4173/day.html?topic=60-ngay-thuyet-trinh&day=61`.
   Expected: "Không tìm thấy nội dung." message with a link back to home.
5. Click "← Danh sách" from step 1's page. Expected: navigates to `topic.html?topic=60-ngay-thuyet-trinh`.

- [ ] **Step 4: Test image rendering with one real public Drive link**

Edit `data/60-ngay-thuyet-trinh.json` locally (not committed — this is a manual smoke test), set `day: 1`'s `driveUrl` to a real public Google Drive share link, reload `day.html?topic=60-ngay-thuyet-trinh&day=1`.

Expected: the actual image renders full/fit-screen (object-fit: contain, no cropping/distortion).

Revert the edit afterward (`git checkout -- data/60-ngay-thuyet-trinh.json`) so the placeholder data stays committed.

- [ ] **Step 5: Commit**

```bash
git add day.html js/day.js
git commit -m "feat: add day viewer page with prev/next/back navigation"
```

---

### Task 7: Cross-page responsive check

**Files:**
- Modify: `css/style.css` (only if issues found)

**Interfaces:**
- Consumes: all pages/CSS from Tasks 2, 4, 5, 6.

- [ ] **Step 1: Check `index.html`, `topic.html`, `day.html` at 320px, 768px, 1024px, 1440px widths**

Using browser dev tools responsive mode (or `npx serve` + manual window resize) at each of the four widths, open all three pages and check:
- No horizontal overflow/scrollbar.
- `.topic-grid` and `.day-list` reflow to fewer columns on narrow widths without overlapping text.
- `.viewer-image` stays fully visible within the viewport (no cropping) at every width.
- `.viewer-controls` buttons remain tappable (not overlapping) at 320px.

- [ ] **Step 2: Fix any overflow or layout issues found**

If an issue is found, adjust the relevant rule in `css/style.css` (e.g., add `min-width: 0` to grid items, or reduce `.viewer-controls` gap/padding at narrow widths via a media query) and re-check the affected breakpoint.

- [ ] **Step 3: Commit (only if changes were made)**

```bash
git add css/style.css
git commit -m "fix: address responsive layout issues across breakpoints"
```

---

## Deployment Note (not a task — reference only)

Once all tasks are committed, deploying to Vercel requires no configuration beyond `vercel.json` already created in Task 1: run `vercel` (or connect the GitHub repo in the Vercel dashboard) and it will serve the static files as-is, with `index.html` as the root.
