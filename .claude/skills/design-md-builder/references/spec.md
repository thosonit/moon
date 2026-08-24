# DESIGN.md — Format Spec (condensed, based on google-labs-code/design.md, version: alpha)

Source: https://github.com/google-labs-code/design.md — the full spec is at `docs/spec.md` in that repo.

## 1. File structure

A DESIGN.md file has 2 layers:

1. **YAML front matter** — machine-readable design tokens, between two `---` lines at the top of the file.
2. **Markdown body** — prose explaining the rationale, organized under `##` headings.

Tokens are the normative source of truth. The prose only explains context for applying them — it must not contradict the tokens.

## 2. Token schema

```yaml
version: alpha              # optional, currently always "alpha"
name: <string>               # required
description: <string>        # optional
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <token-name>: <string | token reference>
```

Note: `colors` should have at minimum a token named `primary` (the linter will warn `missing-primary` if absent — an agent reading the file will otherwise invent its own primary color).

## 3. Token Types

| Type            | Format                                                                                                             | Example                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------| -------------------------------------- |
| Color           | Any valid CSS color (hex, `rgb()`, `oklch()`, color name, etc.)                                                    | `"#1A1C1E"`, `"oklch(62% 0.18 250)"`  |
| Dimension       | number + unit (`px`, `em`, `rem`)                                                                                   | `48px`, `-0.02em`                     |
| Token Reference | `{path.to.token}` — points to another token already defined                                                        | `{colors.primary}`                    |
| Typography      | object with fields: `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, `letterSpacing`, `fontFeature`, `fontVariation` | see example below                 |

Full Typography example:
```yaml
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
```

## 4. Section order (required if the section is present)

Sections use `##` headings. Sections can be skipped, but if present they MUST appear in this order (linter rule `section-order`, warning severity if out of order):

| # | Section            | Accepted aliases                 |
| - | ------------------ | -------------------------------- |
| 1 | Overview           | Brand & Style                    |
| 2 | Colors             |                                   |
| 3 | Typography         |                                   |
| 4 | Layout             | Layout & Spacing                 |
| 5 | Elevation & Depth  | Elevation                        |
| 6 | Shapes             |                                   |
| 7 | Components         |                                   |
| 8 | Do's and Don'ts    |                                   |

Two sections must never share the same heading — this is a hard error and the file will be rejected.

## 5. Component tokens

Components map a name to a group of sub-tokens:

```yaml
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    rounded: "{rounded.sm}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.tertiary-container}"
```

Valid component properties: `backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`.

Variants (hover, active, pressed, disabled...) are represented as a SEPARATE component entry with a related name, e.g. `button-primary-hover`, `button-primary-active` — don't nest states inside a single component.

## 6. How agents should handle unrecognized content

| Situation                               | Behavior                          |
| --------------------------------------- | --------------------------------- |
| Unknown section heading                 | Keep as-is, no error              |
| Unknown color token name                | Accept if the value is valid      |
| Unknown typography token name           | Accept as valid typography        |
| Unknown component property              | Accept, with a warning            |
| Duplicate section heading               | Error — file rejected             |

## 7. CLI — `@google/design.md` (npm package)

Install / run directly:
```bash
npx @google/design.md lint DESIGN.md
npx @google/design.md diff DESIGN.md DESIGN-v2.md
npx @google/design.md export --format json-tailwind DESIGN.md > tailwind.theme.json
npx @google/design.md export --format css-tailwind DESIGN.md > theme.css
npx @google/design.md export --format dtcg DESIGN.md > tokens.json
npx @google/design.md spec --rules
```

**Windows/PowerShell note**: if `npx @google/design.md ...` produces no output or opens the wrong Markdown editor, use the dot-free alias:
```bash
npx -p @google/design.md designmd lint DESIGN.md
```

### `lint`
Returns JSON with `findings[]` (each finding has `severity`: error/warning/info, `path`, `message`) and `summary: {errors, warnings, info}`. Exit code `1` if there are errors, `0` otherwise.

### Linter rules (9 rules)

| Rule                 | Severity | What it checks                                                                                |
| -------------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `broken-ref`         | error    | A token reference (`{colors.primary}`) doesn't point to any existing token                     |
| `missing-primary`    | warning  | `colors` is present but is missing a `primary` token                                           |
| `contrast-ratio`     | warning  | A component's `backgroundColor`/`textColor` pair falls below the WCAG AA threshold (4.5:1)      |
| `orphaned-tokens`    | warning  | A color token is defined but not referenced by any component                                    |
| `token-summary`      | info     | Summarizes the token count per group                                                            |
| `missing-sections`   | info     | An optional section (spacing, rounded) is absent even though other tokens are present           |
| `missing-typography` | warning  | `colors` is present but `typography` tokens are missing                                         |
| `section-order`      | warning  | Sections appear out of the standard order                                                       |
| `unknown-key`        | warning  | A top-level YAML key looks like a typo of a standard key (e.g. `colours:` → `colors:`)          |

### `export`
| Format          | Output | Description                                                    |
| --------------- | ------ | ---------------------------------------------------------------|
| `json-tailwind` | JSON   | Tailwind v3 `theme.extend` config object                       |
| `css-tailwind`  | CSS    | Tailwind v4 `@theme {...}` block, CSS custom properties         |
| `tailwind`      | JSON   | Alias for `json-tailwind`                                      |
| `dtcg`          | JSON   | W3C Design Tokens Format Module (tokens.json)                   |

Exit code: `0` export succeeded, `1` invalid `--format` or emitter error, `2` couldn't read the input file.

## 8. Status

The format is currently `version: alpha` and may change. Always prefer running the real `lint` (via npx) over guessing at errors — the linter is the most accurate source of truth.
