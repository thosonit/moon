# Structure & conventions for `design-system.html`

This document describes the standard pattern derived from the 2 reference files `references/example-anthropic.html` and `references/example-mongodb.html` (a "Design System Analysis" style page created by the getdesign.md/awesome-design-md tool). Use this document as the mold when generating a new `design-system.html`, and also when adding sections/components to an existing file.

## ⚠️ Parts that must NOT be copied

The 2 example files contain some content that is only promotional "chrome" from the tool that generated them, NOT part of the analyzed brand's design system — never copy these parts into a new file:

- The `getdesign.md` and `awesome-design-md` GitHub link/badge in the nav.
- The 4-column footer promoting "VoltAgent Framework / VoltOps..." at the end of the file.
- The `cloudflareinsights.com` beacon script.

The nav and footer in a new file must carry the brand/content of the design system being described (the brand name, or a neutral blank/placeholder), not the branding of the tool that generated the file.

## 1. Page skeleton

Required order in the file:

```text
<html>
  <head>
    <meta charset, viewport, title>
    <link> Google Fonts (preconnect + stylesheet) — only load the fonts DESIGN.md actually requires
    <style> — a single CSS block, every color/font/spacing uses CSS custom properties in :root
  </head>
  <body>
    <nav>            — sticky, 3 columns (brand | anchor links | CTA)
    <div class="hero"> — 2 columns: content (h1+p+2 CTA) | art (code mockup or visual)
    <section id="colors">      — 01, always present
    <section id="typography">  — 02, always present
    <section id="components">  — 03, Button Variants, always present
    <section>...</section>     — subsequent sections, numbered onward, depending on what components DESIGN.md has
    <section id="responsive">  — always the last section before the footer
    <footer>
  </body>
</html>
```

The file is **self-contained**: all CSS lives in a single `<style>` tag, no JS logic (unless the user explicitly requests real interactivity), no external framework dependency — because the purpose is for another AI agent to read this file and understand the design system, not to deploy it as a real website.

## 2. DESIGN.md token → CSS variable mapping

| DESIGN.md token | Suggested CSS variable | Note |
|---|---|---|
| `colors.primary` | `--primary` | Main CTA color |
| `colors.<other name>` (secondary, tertiary, accent-*...) | `--<name>` | Keep the original token name as the variable name so an agent reading the code later maps directly back to DESIGN.md |
| pressed/hover/active states if the component defines them | `--<name>-active` / `--<name>-hover` | |
| Text color placed on that color's background | `--on-<name>` | e.g. `--on-primary` |
| Main background (usually `colors.neutral` or `canvas`) | `--canvas` | |
| Secondary background variants | `--surface`, `--surface-soft`, `--surface-card`, `--surface-dark`... | The count depends on how many surface tokens DESIGN.md defines |
| Hairline border | `--hairline`, `--hairline-soft` | If DESIGN.md doesn't have one, derive it as a lightly muted neutral color |
| Text hierarchy | `--ink` (main text), `--body`, `--muted`, `--muted-soft` | |
| `typography.<name>.fontFamily` (display/heading) | `--display` | Full font stack with fallback |
| `typography.<name>.fontFamily` (body) | `--text` | |
| Code/mono font if present | `--mono` | If DESIGN.md doesn't declare one, default to `ui-monospace, 'JetBrains Mono', monospace` |
| `rounded.*` | Use directly in a class (`.btn { border-radius: var(--radius-md) }`) if a variable is needed, or as a numeric literal if used only once | |
| `spacing.*` | Used in section 10 "Spacing Scale" to illustrate visually | |

If DESIGN.md is missing a token (e.g. no `secondary`), do NOT invent a new token with no basis — ask the user, or derive a reasonable one from the existing palette (e.g. a lighter/darker variant of primary) and note clearly in that section's "rationale" that this is an inference, not an original token.

## 3. Section catalog

### Core sections — ALWAYS present, in this exact order:

| # | id/section-label | Content | Main classes |
|---|---|---|---|
| 01 | Color Palette | Colors grouped (Brand/Accent, Surface, Text) — each color is one `.swatch` with a color block + name + hex + role | `.palette-group`, `.palette-grid`, `.swatch`, `.swatch-color`, `.swatch-meta`, `.swatch-name`, `.swatch-hex`, `.swatch-role` |
| 02 | Typography Scale | Each row: metadata (scale name, size/weight/line-height/letter-spacing) on the left, a real rendered example sentence on the right | `.type-row`, `.type-meta`, `.type-sample` |
| 03 | Button Variants | Every button variant defined in DESIGN.md's `components`: primary, primary-active, primary-disabled, secondary, secondary-on-dark, text-link, icon-circular... | `.button-grid`, `.button-cell`, `.button-label`, `.btn` + variant class, `.button-meta` |
| xx | Cards & Containers | A basic card (feature card), plus a domain-specific card if relevant (code mockup for a dev tool, testimonial for a B2B SaaS...) | `.card-grid`, `.feature-card` |
| xx | Spacing Scale | A visual bar for each spacing step | `.spacing-row`, `.spacing-block`, `.spacing-bar`, `.spacing-label` |
| xx | Border Radius Scale | A square illustrating each radius step | `.radius-row`, `.radius-block` |
| xx | Elevation & Depth | Cards illustrating different elevation/background layers | `.elevation-grid`, `.elevation-card` |
| xx (last) | Responsive Behavior | Breakpoint table + visual device ladder + notes on touch target/collapsing strategy | `.responsive-table`, `.device-ladder`, `.device-bar`, `.responsive-sub` |

### Optional sections — add IF DESIGN.md defines the corresponding component, or the user specifically requests it:

- **Badges & Status** — if there's a badge/pill/status token.
- **Forms & Inputs** — if the product has forms (input, focus state).
- **Pricing Tiers** — if it's a SaaS with pricing.
- **Coral/Accent Callout Card** (full-bleed CTA banner) — if the brand has a prominent callout pattern.
- **Connector/Service Tiles** — if there's a list of integrations/services as a small grid.
- **Tabs & Navigation** — if there's tab UI.
- **Code Mockup Card** — only add if this is a dev-facing product (API, SDK...).
- **Testimonials / Logo Wall / FAQ Accordion** — if it's a B2B marketing page.

Don't mechanically add optional sections for every brand — only add when there's justification from DESIGN.md (a defined component) or from a user request. A minimal design system (e.g. just button + card) doesn't need to be forced up to 13-17 sections like the two example files.

## 4. Reusable detail patterns

**Section header pattern** (applies to every section):
```html
<section id="...">
  <div class="section-label">03 — Button Variants</div>
  <h2 class="section-heading">Short title describing the style</h2>
  <p class="section-intro">1-2 sentences explaining the RATIONALE — why this pairing was chosen, not just restating the values.</p>
  ... content ...
</section>
```
Numbering must be continuous, no skipped numbers, no duplicate numbers when adding a new section later (see item 6).

**Nav pattern**:
```html
<nav class="nav"> <!-- display:grid; grid-template-columns:1fr auto 1fr -->
  <div class="nav-left">...brand...</div>
  <ul class="nav-links"><li><a href="#colors">Colors</a></li>...</ul>
  <button class="nav-cta">...</button>
</nav>
```
Anchor links in `.nav-links` must match the `id` of the main sections (at minimum: colors, typography, components, responsive).

**Hero pattern**: a 2-column grid (content left, illustration right). The right-side illustration should be one of 2 forms: (a) a terminal-style code mockup if the product is dev-facing, or (b) a stylistic color/shape illustration if it's a consumer brand — decide based on the nature of the product described in DESIGN.md.

**Responsive breakpoints**: use exactly the 2 breakpoints `@media (max-width: 1024px)` and `@media (max-width: 720px)`, each collapsing the grid to fewer columns, hiding non-essential decoration, reducing heading font-size.

## 5. Quality requirement (frontend-design)

`design-system.html` is a visual output, not just data — it must ACTUALLY look good and match the brand personality in DESIGN.md, not be a flat, generic demo. See `SKILL.md`'s Step 3 (Mode A) for the full brainstorm + self-critique process before building.

**Important note**: every pattern described in this document (01/02/03 numbered sections, hairline borders, uppercase `.section-label`) is derived from 2 specific example files — they're a convenient starting point STRUCTURALLY (skeleton, class naming, breakpoints), but they are NOT a mandatory aesthetic formula. This numbering + hairline style is one of the "default looks" the `frontend-design:frontend-design` skill (called via the `Skill` tool) recommends questioning before using. When DESIGN.md describes a brand with a different personality (not editorial/broadsheet), it's fine — and often better — to change how section headers are presented (drop the numbering, change the typographic treatment, change how sections are separated) as long as the underlying data scaffold is preserved (enough tokens, enough content sections, correct CSS variable mapping per item 2).

## 6. Rules for ADDING a component/section to an existing file

When the user asks to add a new component or UI to an existing `design-system.html`:

1. Re-read the relevant DESIGN.md (if the new component needs a token not yet in DESIGN.md — e.g. adding a new color — ask the user whether to update DESIGN.md first, or derive it from an existing token; never invent a color outside the palette).
2. Read the existing `design-system.html` to get exactly: the CSS variable names currently used (`:root`), current class conventions, the last section number.
3. Insert the new section BEFORE the "Responsive Behavior" section (responsive is always last), numbered as the current last number + 1.
4. Add the new component's style to the end of the existing `<style>` block (don't create a 2nd `<style>` block), reusing the existing `:root` CSS variables — don't redefine colors with raw hex.
5. If the new section is important enough to need quick access, add an entry to `.nav-links` pointing to the new `id` — but this isn't required for every small component.
6. After inserting, review everything to make sure it doesn't break the existing responsive breakpoints (the new section needs to inherit the correct grid/gap pattern from sections of the same type).
