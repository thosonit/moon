---
name: design-md-builder
description: Build, lint, fix, and export DESIGN.md files — Google's open format for describing a visual identity/design system (colors, typography, spacing, components) to AI coding agents. Use this skill whenever the user wants to create a design system file, a DESIGN.md, a brand style guide for AI agents, wants to define design tokens for their project, mentions "DESIGN.md", "design tokens for agents", or wants to export a design system to Tailwind/DTCG/tokens.json. Also use it if the user has an existing DESIGN.md they want validated, linted, fixed, or updated.
---

# DESIGN.md Builder

Build a `DESIGN.md` file that conforms to Google's open spec (`google-labs-code/design.md`, currently `version: alpha`) — a file describing a design system (design tokens + rationale) for AI coding agents to read and produce UI consistently.

The workflow has 4 fixed steps. Don't skip the lint step — it's what guarantees the file is actually valid per spec, not just "looks right."

## Step 1 — Ask what the user wants

Before writing any token, gather the core information. If the user already provided it in their request (e.g. color codes, brand name, style...), don't ask again — only ask for what's missing.

Use `AskUserQuestion` to gather this quickly (the user picks from options instead of typing), at most 3 questions per call. Prioritize asking in these groups, splitting into 2 calls if needed:

**Round 1 — style direction:**
- What's the name/brand of this design system? (if there's no name yet, offer suggestions or leave it blank and pick a descriptive name yourself)
- Overall vibe/style: e.g. Minimalist/Editorial, Playful/Vibrant, Corporate/Trust, Dark & Techy, Warm & Organic... (ask via `AskUserQuestion` as a single-select with a few suggested options, plus room for them to describe further in free text if they want)
- Is there an existing brand color/logo to follow, or should Claude propose a new palette?

**Round 2 — technical detail (if the user seems technical or the project already has a stack):**
- Are they using Tailwind, or any specific CSS framework? (affects whether to prepare for a later export)
- Are there specific components that need their own tokens defined up front (button, card, input...), or should a few common ones be defaulted?
- Font pairing: a specific heading/body typeface pair, or should Claude propose one from Google Fonts based on the chosen vibe? (e.g. Editorial → a serif display + humanist sans body; Corporate/Trust → a single neutral grotesk like Inter/Public Sans across both; Playful → a rounded display font)
- Icon collection: which icon set the codebase should standardize on — e.g. Lucide (default recommendation for most React/Next/Vue stacks — MIT-licensed, tree-shakeable, consistent 24px grid), Google Material Symbols (if the project already leans Material/Android), Phosphor (if the vibe calls for more weight variants), or Heroicons (if already on Tailwind UI). Skip asking if the codebase already has an icon package installed — just detect and reuse it.

If the user doesn't answer these, default silently: propose a font pairing that fits the vibe, and default the icon collection to **Lucide** unless the project already has one installed — state both assumptions in the response instead of leaving them unstated.

If the user just says something like "build me a DESIGN.md for a serious fintech app" — that's already enough context for a reasonable inference (serious/trust → neutral + one accent, clear sans-serif). Ask at most one confirming question instead of a barrage, then proceed with a reasonable assumption, stating that assumption clearly in the response.

## Step 2 — Build the DESIGN.md file

Read `references/spec.md` (the condensed full spec) before writing the file if this is the first time in this session, to make sure you stick to:

- **Token schema** with the correct fields: `version`, `name`, `description`, `colors`, `typography`, `rounded`, `spacing`, `components`.
- **colors** must have at least a `primary` token (if missing, the linter will warn and other agents will invent a color).
- **typography** should have at least 1-2 tokens (e.g. `h1`, `body-md`) — leaving it out entirely will make agents fall back to default fonts. Set `fontFamily` on each typography token to the chosen pairing (e.g. heading tokens use the display face, body tokens use the body face) rather than one font for everything unless the vibe calls for a single-family system.
- **components** should reference back to `colors`/`typography`/`rounded` using `{colors.primary}` syntax instead of repeating raw values — this avoids `orphaned-tokens` warnings and keeps the file maintainable when colors change.
- **Icon collection**: the spec has no dedicated `icons` token group, so record the choice as a `components.icon` entry (e.g. `components: { icon: { family: "lucide", size: "20px", strokeWidth: 1.5, color: "{colors.on-surface}" } }`) — this keeps it machine-readable for other agents instead of burying it only in prose. Also mention it in the `## Overview` prose (name + why it fits the vibe) so a human skimming the file sees it immediately.
- **Markdown section order** (`##`) MUST follow: Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts. Any section can be skipped if not needed, but the sections that are written must not be reordered.
- Each section should have 2-5 sentences/bullets explaining the **why**, not just restating the token values already in the YAML — that's what separates a good DESIGN.md from a shallow one.
- Write the file with `Write` to `docs/design/DESIGN.md` (or a different name if the user has multiple design systems in the same project, e.g. `DESIGN-dark.md`).

## Step 3 — Lint and self-fix

This step is mandatory — don't eyeball it and assume "probably fine," always run the real linter:

```bash
npx -y @google/design.md lint docs/design/DESIGN.md 2>&1 | grep -v "npm error config prefix"
```

(The line `npm error config prefix cannot be changed...` is harmless sandbox-environment noise, not a real error — always filter it out when reading the output, don't mistake it for a file error.)

The result is JSON with `findings[]` (each finding has a `severity`: `error`/`warning`/`info`) and a `summary`. Handle by severity:

- **`error`** (e.g. `broken-ref` — a token reference pointing to a token that doesn't exist): MUST be fixed immediately with `Edit` — this makes the file invalid.
- **`warning`**: fix if it makes sense (e.g. `missing-primary`, `missing-typography`, `contrast-ratio` below the WCAG AA 4.5:1 threshold, `section-order` out of sequence, `unknown-key` — possibly a typo like `colours:` instead of `colors:`). For `orphaned-tokens` (a color defined but not used by any component), consider: if it's a reserved semantic color (success/warning/error), it's fine to keep as-is and explain in the response — no need to delete it or force it onto a component.
- **`info`**: reference only (e.g. `token-summary`), no action needed.

After fixing, re-run lint to confirm `errors: 0`. Repeat up to a few times until clean. If any warning is deliberately kept, tell the user why instead of silently ignoring it.

Summarize the lint result briefly for the user (how many errors/warnings were fixed, what was kept and why) — don't paste the raw JSON into the response.

## Step 4 — Export to other formats (only when requested)

Don't do this automatically unless the user asks, or already told you their stack in Step 1 (e.g. "I use Tailwind"). If that signal is there, you can proactively ask a short question like "Want me to export this to a Tailwind config too?" instead of exporting extra files unprompted.

Export commands:

```bash
# Tailwind v4 (CSS @theme block) — most common for new projects
npx -y @google/design.md export --format css-tailwind docs/design/DESIGN.md > docs/design/theme.css

# Tailwind v3 (theme.extend JSON, used in tailwind.config.js)
npx -y @google/design.md export --format json-tailwind docs/design/DESIGN.md > docs/design/tailwind.theme.json

# W3C DTCG tokens.json — for Figma Variables / Storybook compatibility
npx -y @google/design.md export --format dtcg docs/design/DESIGN.md > docs/design/tokens.json
```

After exporting, tell the user which file(s) were written — always mention both the original `DESIGN.md` and the export file, not just the export in isolation.

If the user wants to compare against an older version (a previously edited design system), use the `diff` command:

```bash
npx -y @google/design.md diff DESIGN-v1.md DESIGN-v2.md 2>&1 | grep -v "npm error config prefix"
```

## Important notes

- The format is currently `version: alpha` and may change. If the CLI returns an unexpected error that doesn't match `references/spec.md`, the package has likely been updated; consider running `npx -y @google/design.md spec --rules` to get the latest spec directly from the CLI instead of trusting the static doc alone.
- No need to install the package beforehand — always use `npx -y @google/design.md ...`, it will fetch from the npm registry automatically.
- If the user only wants to see/understand the spec and doesn't want a file created yet, you can answer directly from `references/spec.md` without running the CLI or creating a file.
