---
name: design-system-html-builder
description: Build a self-contained design-system.html file (colors, typography, buttons, cards, spacing, radius, elevation, responsive rules) from a DESIGN.md design-token file, so other AI coding agents have a rich, visual, copy-pasteable reference for building UI consistent with the brand. Use this skill whenever the user asks to "generate a design system page/site", "visualize my DESIGN.md", "create a design-system.html", "showcase my design tokens", or wants to add/extend components in an existing design-system.html. Also use it if the user uploads or references a page like a "Design System Analysis" (colors/typography/components showcase) and wants one built, extended, or updated for their own project.
---

# Design System HTML Builder

Generate `design-system.html` — a static, self-contained page visually presenting every design token (color, typography, spacing, radius, elevation, component) pulled from a `DESIGN.md` file. This file's purpose is DIFFERENT from `DESIGN.md`: DESIGN.md is machine-readable token data for an agent to consume directly, while `design-system.html` is the full visual presentation so an agent (and a human) can *see* what the design system looks like before writing real UI code — reducing drift when tokens are applied to an actual layout.

Read `references/structure-spec.md` before starting any create/edit work in this skill — it's the structural spec, the CSS class/variable naming conventions, and the catalog of required/optional sections. The two files `references/example-anthropic.html` and `references/example-mongodb.html` are real examples to cross-reference when you need to see how a specific pattern was implemented (open with `Read` when needed — no need to read them in full if `structure-spec.md` is already enough).

The skill has 2 modes: **(A) Create new** and **(B) Add to/extend** an existing file. Determine the mode before doing anything else — if the user references an existing `design-system.html` (uploaded, or created in a previous session), always use mode B instead of rebuilding from scratch.

## Mode A — Create a new design-system.html

### Step 1 — Find and read DESIGN.md

- Look for `DESIGN.md` in `docs/design/` (per the project's standard structure — see `CLAUDE.md`). If the user points to a different path, read it directly with `Read`.
- If it doesn't exist yet, ask the user to provide it, or if they say "there isn't one, just make it for me" then first run the `design-md-builder` skill's process (via the `Skill` tool) to create DESIGN.md, then continue.
- Do NOT invent tokens if DESIGN.md is missing — better to ask again than to produce a design system that doesn't match the user's real intent.

### Step 2 — Plan the sections

Based on the tokens and the `components` section in DESIGN.md, determine:
- Core sections (always present — see item 3 in `structure-spec.md`): Colors, Typography, Buttons, Cards, Spacing Scale, Border Radius Scale, Elevation & Depth, Responsive Behavior.
- Optional sections with justification (a component defined in DESIGN.md, or a specific user request): badges, forms, pricing, callout, tiles, tabs, code mockup, testimonials...

If unsure which optional sections to add, ask the user a quick question via `AskUserQuestion` (e.g. "Does your product need a pricing/testimonial page in this showcase, or just the basic UI components?") instead of deciding unilaterally or asking a long list of questions.

### Step 3 — Actually run the frontend-design process, not just "reference" it

Call `Skill({skill: "frontend-design:frontend-design"})` and **genuinely go through its two-phase process** for anything DESIGN.md doesn't specify in detail (hero layout, how to illustrate icons, hover/shadow details, whether to number sections):

1. **Brainstorm before writing code**: based on DESIGN.md, quickly sketch (in thinking, no need to show all of it to the user) — what the hero layout will look like, which illustration is the "signature element" distinctive to this brand (not a generic hero block), and whether the section layout should use numbered labels.
2. **Self-critique before building**: ask yourself — does the planned output fall into one of the 3 "default looks" frontend-design warns about (cream+serif+terracotta; near-black background+neon accent; broadsheet with hairlines + 01/02/03 numbering everywhere)? The numbered `section-label` pattern inherited from the two reference example files (`example-anthropic.html`, `example-mongodb.html`) IS that broadsheet look — only keep that numbering if it's genuinely a good fit for the DESIGN.md being processed (e.g. the DESIGN.md itself is editorial/broadsheet in character); if DESIGN.md describes a brand with a very different personality (playful, minimal without hairlines, etc.), drop the numbering or change the section presentation accordingly — don't keep the mold just because it's the example files' format.
3. Only write code after the self-critique is done, following the finalized plan.

The final file must reflect the actual brand personality in DESIGN.md — not a template shared across every brand that only changes color.

### Step 4 — Write the file

Use `Write` to write `docs/design/design-system.html` (same directory as `DESIGN.md`) following the skeleton, token mapping, and class patterns in `structure-spec.md`:
- All colors/fonts come from `:root` CSS custom properties, named after the original token names in DESIGN.md (see the mapping table in item 2 of the spec) — so an agent reading the code later can easily cross-reference back to DESIGN.md.
- Sections numbered continuously, core sections first, optional ones inserted in between, Responsive Behavior always the last section.
- Do NOT copy the promotional nav-badge/footer of the original tool (see the warning at the top of `structure-spec.md`) — the nav and footer must carry the identity of the brand being described, not the tool that generated the file.
- The file is fully self-contained: a single `<style>` block, no external framework dependency, only load Google Fonts if DESIGN.md specifies a font outside the system stack.

### Step 5 — Present

Report back to the user concisely: the path of the file just written (`docs/design/design-system.html`), how many sections, and anything inferred beyond the original DESIGN.md (if any) and why.

## Mode B — Add / extend a component in an existing file

Use this when the user says something like "add component X to design-system.html", "add section Y", "add UI for Z".

### Step 1 — Read both sources of truth

1. Read the relevant `DESIGN.md` to get the canonical tokens/rules (colors, fonts, rounding, spacing already defined). If the new component needs a token/color not yet in DESIGN.md, do NOT invent one — ask the user: use the closest existing token for now, or update DESIGN.md first (and if updated, re-run lint via the `design-md-builder` skill if available).
2. Read the existing `design-system.html` file (with `Read`) to get: the list of CSS variables currently used in `:root`, current class conventions, the last section number before "Responsive Behavior".

### Step 2 — Build the new component following existing conventions, still through the frontend-design lens

Even when just adding to an existing file, don't switch off aesthetic judgment: call `Skill({skill: "frontend-design:frontend-design"})` (especially the "Restraint and self-critique" section) so the new component doesn't clash in tone with the rest — same level of detail, same hover/shadow language, no new "signature element" competing with the existing one.

Per item 6 of `structure-spec.md`:
- Insert the new section BEFORE the "Responsive Behavior" section, numbered as the last number + 1.
- Append new styles to the end of the existing `<style>` block (don't create a second `<style>` block), reusing the existing `:root` variables instead of hardcoding hex values.
- Keep the section header pattern (`section-label` + `section-heading` + `section-intro`) and the same grid/gap pattern as sections of the same type (e.g. if adding a button variant, reuse the existing `.button-grid`/`.button-cell` instead of creating parallel classes).
- If the section is important enough, add an entry to `.nav-links` pointing to the new `id`.

### Step 3 — Insert with Edit and double-check

Use `Edit` to insert the new section right before `<section id="responsive">` (or the equivalent tag), and insert new CSS right before the closing `</style>` tag. After inserting, quickly review the 2 existing breakpoint media queries to make sure the new section doesn't break the mobile layout — if the new component uses a multi-column grid, add a column-collapsing rule to the existing media query rather than skipping it.

### Step 4 — Present

Report back briefly: what was just added to `design-system.html` and what section number it is.

## General notes

- `design-system.html` doesn't need real interactive logic (no JS needed) unless the user explicitly asks for a clickable/interactive demo — the main goal is visually presenting tokens + components, not building a fully functional website.
- If DESIGN.md isn't lint-clean yet (still has errors), tell the user before building design-system.html from it, since token errors (`broken-ref`...) will make the page render incorrectly.
- There's no hard requirement to have 13-17 sections like the two example files — the number of sections depends on how rich the input DESIGN.md actually is.
