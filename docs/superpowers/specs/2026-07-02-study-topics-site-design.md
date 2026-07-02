# Study Topics Site — Design

## Overview

A simple static site, deployed to Vercel, that displays study "topics." The first topic is "60 ngày thuyết trình" (60 days of presentation practice), containing a list of days 1–60. Each day links to a full/fit-screen view of a publicly shared Google Drive image. All content data lives in JSON files committed alongside the source.

## Architecture

Plain HTML/CSS/JS, no build step, deployed directly to Vercel as a static site.

```
moon/
├── index.html                        # Home — grid of topic cards
├── topic.html                        # List of days 1..N for one topic
├── day.html                          # Full/fit-screen image viewer for one day
├── data/
│   ├── topics.json                   # Topic registry
│   └── 60-ngay-thuyet-trinh.json     # Per-day Drive image links for this topic
├── css/
│   └── style.css
├── js/
│   ├── app.js                        # Loads topics.json, renders topic grid
│   ├── topic.js                      # Loads a topic's day-list JSON, renders day list
│   └── day.js                        # Renders full-screen image, prev/next/back
└── vercel.json                       # Static routing config, if needed
```

## Data Model

`data/topics.json`:

```json
[
  {
    "id": "60-ngay-thuyet-trinh",
    "title": "60 ngày thuyết trình",
    "totalDays": 60
  }
]
```

`data/60-ngay-thuyet-trinh.json`:

```json
[
  { "day": 1, "driveUrl": "https://drive.google.com/file/d/XXXXXXXX/view" },
  { "day": 2, "driveUrl": "" }
]
```

- `driveUrl` stores the raw Google Drive share link as copied by the user.
- Adding a new topic later means adding one entry to `topics.json` and one new `data/<id>.json` file — no code changes required as long as the day-list shape matches.

## Navigation Flow

1. `index.html` — grid of topic cards (one per entry in `topics.json`). Click a card → `topic.html?topic=<id>`.
2. `topic.html` — reads `topic` from the query string, loads `data/<id>.json`, renders a list of Ngày 1..N. Click a day → `day.html?topic=<id>&day=N`.
3. `day.html` — reads `topic` and `day` from the query string, loads the same JSON, shows the image for that day full/fit-screen.
   - Prev/Next buttons move to day N-1/N+1 (disabled at day 1 and day N).
   - Back button returns to `topic.html?topic=<id>`.

## Google Drive Image Embedding

Users paste the raw share link (`https://drive.google.com/file/d/<ID>/view?...`) into the JSON. Client-side JS extracts `<ID>` via regex and builds the direct-view URL `https://drive.google.com/uc?id=<ID>` for the `<img src>`.

- If `driveUrl` is empty or the ID can't be parsed, show a "Chưa có ảnh" placeholder instead of a broken image.

## Visual Style

Light editorial/clean direction:
- Light background, editorial-scale typography for headings (magazine-style hierarchy, not uniform sizing).
- Intentional spacing rhythm rather than uniform padding everywhere.
- Minimal accent color used semantically (e.g., current day indicator), not decoratively.
- No progress tracking / completion state — out of scope for this version.

## Error Handling

- Missing/empty `driveUrl` for a day → placeholder text, no broken `<img>`.
- Invalid `topic` or `day` query param → simple "Not found" message with a link back to home.

## Out of Scope (this iteration)

- Multiple topics beyond "60 ngày thuyết trình" (framework supports it, but no second topic is built now).
- Progress tracking / marking days as done.
- Authentication or private image hosting — Drive links must be public.

## Testing

Manual verification only, appropriate for a static informational site:
- Visual check at breakpoints 320/768/1024/1440 for all three pages.
- Verify Drive link → image URL conversion with a real public Drive link.
- Verify Prev/Next boundary behavior (day 1 and day 60).
- Verify placeholder shows for a day with empty `driveUrl`.
