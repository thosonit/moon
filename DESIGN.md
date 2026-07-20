---
version: alpha
name: Moon-kawaii-design
description: A soft pastel-pink "kawaii sticker book" interface built for a 5-year-old girl (Moon - Quỳnh Như) browsing learning topics and daily lesson pages. The system anchors on a warm pink-tinted canvas with large rounded "kawaii" cards, a friendly rounded font pairing (Baloo 2 display / Quicksand body), and gentle looping animal-mascot animations (bounce, wave, twinkle, fly-across) built from compositor-friendly transform/opacity keyframes. Brand voltage comes from bubblegum-pink accents against a soft cream-pink surface — deliberately playful and tactile where most learning-app UIs default to flat, neutral templates.

colors:
  bg: "oklch(97% 0.02 20)"
  surface: "oklch(99% 0.01 20)"
  surface-alt: "oklch(94% 0.04 15)"
  text: "oklch(35% 0.03 20)"
  text-muted: "oklch(55% 0.03 20)"
  accent: "oklch(75% 0.14 10)"
  accent-strong: "oklch(62% 0.18 8)"
  secondary: "oklch(85% 0.08 340)"
  tertiary: "oklch(90% 0.09 90)"
  success: "oklch(85% 0.12 150)"
  border: "oklch(90% 0.03 20)"

typography:
  hero:
    fontFamily: "Baloo 2, Quicksand, -apple-system, sans-serif"
    fontSize: "clamp(2.25rem, 1.6rem + 3vw, 4rem)"
    fontWeight: 700
    lineHeight: 1.15
  heading:
    fontFamily: "Baloo 2, Quicksand, -apple-system, sans-serif"
    fontSize: "clamp(1.75rem, 1.4rem + 2vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "clamp(1.1rem, 1rem + 0.4vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.6

rounded:
  card: "1.5rem-2rem"
  pill: 999px

spacing:
  section: "clamp(4rem, 3rem + 5vw, 10rem)"

components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
  button-icon:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent-strong}"
    rounded: "{rounded.full}"
  topic-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    shadow: "0 8px 24px oklch(75% 0.14 10 / 0.25)"
  day-list-item:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
---

## Overview

Moon's interface is built for a 5-year-old girl browsing daily lesson pages — every decision optimizes for delight, big touch targets, and gentle motion over information density. The base atmosphere is a **soft pink-tinted canvas** (`{colors.bg}`) with a subtle gradient into `{colors.surface-alt}`, never a flat single tone. Headlines run **Baloo 2** (or Quicksand as fallback) — rounded, friendly, weight 700 — paired with system sans body copy sized larger than typical UI for early-reader legibility.

Brand voltage comes from **bubblegum pink** (`{colors.accent}`), used on primary buttons, active states, and headline accents, with lilac (`{colors.secondary}`) and butter-yellow (`{colors.tertiary}`) reserved for small decorative moments — stars, badges, mascots — never competing with the pink.

Each topic has a companion animal mascot (rabbit, cat, bear, dog, penguin) rendered as simple flat SVG and animated with looping CSS keyframes: gentle bounce on cards, a wave on the homepage hero, background twinkle sparkles, and a one-shot fly-across when entering the day viewer. All motion respects `prefers-reduced-motion`.

**Key Characteristics:**
- Warm pink canvas (`{colors.bg}`) with pink-tinted gradient into `{colors.surface-alt}` — never flat white or gray.
- Bubblegum accent (`{colors.accent}`) on primary buttons and active states; `{colors.accent-strong}` on hover/press.
- Baloo 2 / Quicksand rounded display font at weight 700, always paired with an emoji (🌙🌸🐰) in headings.
- Large border radii (`1.5rem`–`2rem` on cards, pill on buttons) — no sharp corners anywhere.
- Soft pink drop shadows instead of gray shadows, giving cards a "floating sticker" feel.
- Per-topic animal mascots animated via `transform`/`opacity`-only keyframes — bounce, wave, twinkle, fly-across.
- Text sized above typical UI defaults (`{typography.body}` ~1.1–1.35rem) and line-height 1.6+ for a 5-year-old's reading comfort.
- Every animation guarded by `prefers-reduced-motion: reduce`.

## Colors

### Brand & Accent
- **Accent / Bubblegum Pink** (`{colors.accent}` — oklch(75% 0.14 10)): The signature Moon pink. Used on titles, primary buttons, active borders, and standout icons.
- **Accent Strong** (`{colors.accent-strong}` — oklch(62% 0.18 8)): Hover/active press state for buttons and icons — a deeper, more saturated pink.
- **Secondary / Lilac** (`{colors.secondary}` — oklch(85% 0.08 340)): Decorative accent only — badges, mascot details, star/reward moments. Never the dominant color.
- **Tertiary / Butter Yellow** (`{colors.tertiary}` — oklch(90% 0.09 90)): Sunshine accent for reward highlights, alongside secondary.
- **Success / Mint** (`{colors.success}` — oklch(85% 0.12 150)): Completed-lesson state — card border and star-burst reward animation.

### Surface
- **Background** (`{colors.bg}` — oklch(97% 0.02 20)): Very light pink page floor, always gradiented with `{colors.surface-alt}`, never a flat single tone.
- **Surface** (`{colors.surface}` — oklch(99% 0.01 20)): Card and control backgrounds — near-white with a pink tint.
- **Surface Alt** (`{colors.surface-alt}` — oklch(94% 0.04 15)): Deeper pink secondary background, paired with `{colors.bg}` in gradients.
- **Border** (`{colors.border}` — oklch(90% 0.03 20)): Hairline borders on cards and dashed/scalloped "sticker book" edges.

### Text
- **Text** (`{colors.text}` — oklch(35% 0.03 20)): Primary reading text — warm brown-pink, never pure black.
- **Text Muted** (`{colors.text-muted}` — oklch(55% 0.03 20)): Secondary labels, captions, subtitles ("Bài n").

## Typography

### Font Family
Display headings use **Baloo 2** with **Quicksand** as the web-font fallback — both are rounded, friendly, Vietnamese-diacritic-capable Google Fonts. Body copy stays on the system sans stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`) for maximum legibility at larger sizes. No serif, no geometric/neutral sans — roundness is non-negotiable for this audience.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.hero}` | clamp(2.25rem, 1.6rem + 3vw, 4rem) | 700 | 1.15 | Homepage hero title, always with an emoji |
| `{typography.heading}` | clamp(1.75rem, 1.4rem + 2vw, 2.75rem) | 700 | 1.2 | Section headings, topic titles |
| `{typography.body}` | clamp(1.1rem, 1rem + 0.4vw, 1.35rem) | 400 | 1.6 | Running text — larger than typical UI default for early readers |

### Principles
Headings always pair with a decorative emoji (🌙🌸🐰) — this is not optional flourish, it's the primary "friendliness" signal for a pre-literate/early-reading child. Body text stays large (min ~18px rendered) and generously spaced (line-height 1.6+); never shrink type to fit layout — grow the layout instead.

### Note on Font Substitutes
If Baloo 2 is unavailable, Quicksand is the direct fallback (already rounded, same Google Fonts family, Vietnamese support). Do not fall back further to a neutral system sans for headings — the roundness is the brand voice.

## Layout

### Spacing System
- **Section rhythm:** `{spacing.section}` — fluid `clamp(4rem, 3rem + 5vw, 10rem)` between major page bands.
- **Card internal padding:** generous, scaled to the large border radius — cards should read as "thick and soft," not thin outlines.
- **Breathing room:** favor large gaps over dense grids; a 5-year-old scans big shapes, not tight information hierarchies.

### Grid & Page Structure
- **`index.html`:** Hero band (title + waving mascot) above a bento-style topic grid — cards vary in size, not a uniform grid, each carrying its own mascot icon.
- **`topic.html`:** Single-column "sticker book" list — one rounded row per day, circular pink day-number badge, bold title, optional "currently studying" ribbon on the next incomplete day.
- **`day.html`:** Fullscreen image viewer with floating icon buttons (back / fullscreen / zoom) — layout unchanged from the base app, only re-skinned to pink tones plus a one-shot mascot fly-across on page entry.

### Whitespace Philosophy
Every surface should feel like a padded sticker on a soft table, not a spreadsheet. Prioritize scale and roundness over density; when in doubt, make the touch target bigger and the gap wider.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow | Page background |
| Soft pink shadow | `0 8px 24px oklch(75% 0.14 10 / 0.25)` | `{component.topic-card}`, `{component.day-list-item}` — replaces gray shadows entirely |
| Scalloped/dashed border | Dashed or wave border via `mask`/SVG | Topic cards, for a "sticker book" page feel |
| Textured background | Repeating low-opacity (~0.08) dot/star/heart pattern | Page background only — must stay subtle, never busy |

The elevation philosophy is **pink-shadow-first, gray-shadow-never**. Depth comes from warm-tinted shadows and dashed sticker borders rather than neutral drop shadows — this is the single biggest tell that separates this system from a generic template.

### Decorative Depth
- Per-topic animal mascot icons (rabbit, cat, bear, dog, penguin) as flat 2–3 color SVGs, with animatable sub-parts (ears, tail, eyes).
- Background dot/star/heart texture at very low opacity, twinkling on a slow loop.
- A one-shot fly-across mascot (butterfly/bee) on entering the day viewer, gone after ~3.5s.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.card}` | 1.5rem–2rem | Topic cards, day-list rows, all container surfaces |
| `{rounded.pill}` | 999px | All buttons — primary and icon buttons alike |

### Illustration Style
Mascots and decorative elements are flat, simple-shape SVG illustrations (2–3 colors, rounded outlines) — never photography, never complex multi-layer illustration. This keeps assets lightweight and easy to animate part-by-part with CSS.

## Components

### Buttons

**`button-primary`** — Pill-shaped, background `{colors.accent}`, white text. Hover: `transform: scale(1.05)` plus a deepened pink shadow. Active/press: `transform: scale(0.95)` for clear tactile feedback for small fingers.

**`button-icon`** — Circular icon-only buttons (back, fullscreen, zoom in the day viewer). Background `{colors.surface}`, icon color `{colors.accent-strong}`, hairline `{colors.border}` outline. Default state sits at low opacity, rising to full opacity on hover/focus (`.viewer-icon-button` pattern).

### Cards

**`topic-card`** — Bento-grid homepage card. Background `{colors.surface}`, rounded `{rounded.card}`, soft pink shadow, dashed/scalloped border option, small bouncing mascot icon in one corner. Sizes vary card-to-card rather than a uniform grid.

**`day-list-item`** — Sticker-book row on the topic page. Background `{colors.surface}`, rounded `{rounded.card}`, circular pink day-number badge on the left, bold title, muted "Bài n" subtitle. Completed rows get a `{colors.success}` border plus a one-time star (⭐) pop animation; the next unstarted day carries a gently blinking ribbon.

### Mascot & Motion Primitives

**`mascot-icon`** — Small looping bounce (`gentle-bounce`, 2.4s, `ease-out-expo`) on topic-card and list-row mascot icons.

**`mascot-hero`** — Large hero mascot with a `wave` keyframe on its paw/wing, delayed ~3s between repeats so it doesn't distract continuously.

**`bg-sparkle`** — Background dot/star/heart particles on a slow `twinkle` loop (opacity 0.15↔0.5, scale 1↔1.2, 3s).

**`mascot-flyby`** — One-shot `fly-across` animation (3.5s, `ease-out-expo`, plays once) triggered when the day viewer mounts; the mascot enters from off-screen left and exits off-screen right/up.

All four motion primitives are disabled entirely under `prefers-reduced-motion: reduce`, keeping only essential tab/page transitions.

## Do's and Don'ts

### Do
- Anchor every page on the pink-gradient canvas (`{colors.bg}` → `{colors.surface-alt}`). Flat single-tone backgrounds read as generic template.
- Pair every heading with a decorative emoji (🌙🌸🐰).
- Use pill shape for every button, large radii (`1.5rem`–`2rem`) for every card — no sharp corners anywhere in the system.
- Use pink-tinted shadows (`oklch(75% 0.14 10 / 0.25)`) instead of gray/neutral shadows on all elevated surfaces.
- Give every topic its own animal mascot, animated with `transform`/`opacity` keyframes only.
- Guard every looping animation with `prefers-reduced-motion: reduce`.
- Keep body text large (`{typography.body}` clamp min ~1.1rem) and line-height ≥1.6 for early readers.

### Don't
- Don't use gray/neutral shadows — every shadow tints pink.
- Don't use flat, evenly-sized card grids — vary topic-card sizes for a bento, hand-arranged feel.
- Don't use pure black text — always the warm brown-pink `{colors.text}`.
- Don't let secondary (`{colors.secondary}`) or tertiary (`{colors.tertiary}`) accents outweigh the primary pink — they're for small reward/decorative moments only.
- Don't use `linear` easing for organic motion — mascots and sparkles use `ease-out`/`ease-in-out` exclusively.
- Don't use photography or complex multi-layer illustration for mascots — flat, simple, 2–3 color SVG only.
- Don't run any looping animation when `prefers-reduced-motion: reduce` is set.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | 320–767px | Hero mascot shrinks and moves below the title instead of overlapping it; topic bento grid collapses to 1-up |
| Tablet | 768–1023px | Bento grid 2-up; hero mascot stays beside the title at reduced scale |
| Desktop | 1024–1439px | Full bento grid (mixed 2–3 column sizes); hero mascot at full scale in the header's bottom-right |
| Wide | ≥1440px | Same as desktop with additional outer whitespace; content stays comfortably centered, not stretched |

Verify at the project's standard checkpoints: 320, 768, 1024, 1440px.

### Touch Targets
- `{component.button-primary}` and `{component.button-icon}` sized generously above the 44px minimum — this app is used by a 5-year-old, so err larger than adult-UI defaults.
- Day-list rows (`{component.day-list-item}`) are fully tappable end-to-end, not just the title text.
- Viewer zoom controls (`−` / `%` / `+`) stay large and spaced apart to avoid mis-taps.

### Collapsing Strategy
- Hero mascot never overlaps the title on small screens — it drops below instead of shrinking illegibly.
- Bento grid reduces column count before shrinking card content — cards keep their large radius and padding at every breakpoint.
- Day viewer's floating icon buttons keep fixed circular size across breakpoints; only their corner offsets adjust.

## Iteration Guide

1. Focus on ONE component at a time. Reference its token key (`{component.topic-card}`, `{component.day-list-item}`).
2. Variants (`-active`, `-completed`) live as separate notes under the same component, not new components.
3. Use `{token.refs}` everywhere in new CSS — never hardcode a hex/oklch value that already has a token.
4. Mascot animations are additive, never replace layout logic — motion should always degrade gracefully to a static icon.
5. Pink stays the dominant accent; lilac and butter-yellow are reward/decorative only. Don't introduce a fourth competing accent hue.
6. When adding a new topic, create or reuse a mascot SVG before touching layout — the mascot-per-topic pattern is the system's core identity.
7. When in doubt about emphasis: bigger rounded Baloo 2 type before heavier weight or more color.

## Known Gaps

- Baloo 2 / Quicksand are Google Fonts and must be loaded via `<link>` or self-hosted with `font-display: swap`; not yet wired into `css/style.css` at time of writing — see task list below.
- No SVG mascot assets exist yet in the repo — the illustration style (flat, 2–3 color, animatable parts) is specified but unimplemented.
- The dashed/scalloped "sticker book" border technique (`mask`/SVG) is described conceptually but no concrete implementation has been chosen yet.
- Reward interactions (star-burst on lesson completion) are described at the animation-primitive level only; the triggering logic (how "completed" state is tracked) is out of scope for this file.

## Implementation Task List

1. Add Baloo 2 / Quicksand via `<link>` or self-host, with `font-display: swap`.
2. Update the `:root` color tokens in `css/style.css` to the pink palette in **Colors**.
3. Create 2–3 mascot SVGs (rabbit, cat, bear) as reusable components for the hero and topic cards.
4. Add the `gentle-bounce`, `wave`, `twinkle`, and `fly-across` keyframes to `css/style.css`, each guarded by `prefers-reduced-motion`.
5. Apply the new button/card styles to `.viewer-icon-button`, `.topic-card`, and `.day-list-item` per **Components**.
