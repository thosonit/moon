---
name: git-conventions
description: Commit message and branch naming conventions for this project (Gitflow + Conventional Commits). Use before creating a branch or writing a commit message in this repo.
---

# git-conventions

Commit message and branch naming conventions for this project.

## When to use

Before creating a branch or writing a commit message in this repo.

## Branching model: Gitflow

Two permanent branches:

- `main` — production-ready, always releasable. Only updated via `release/*` or `hotfix/*` merges.
- `develop` — integration branch for ongoing work. Default base for new branches.

Supporting branches:

| Branch | Branches off | Merges into | Naming |
|---|---|---|---|
| Feature | `develop` | `develop` | `feature/<short-description>` |
| Release | `develop` | `main` + `develop` | `release/<version>` |
| Hotfix | `main` | `main` + `develop` | `hotfix/<short-description>` |
| Chore/docs/refactor | `develop` | `develop` | `chore/`, `docs/`, `refactor/<short-description>` |

`<short-description>` is kebab-case, no ticket numbers unless one exists. `<version>` follows semver, e.g. `release/1.2.0`.

After merging a `release/*` or `hotfix/*` into `main`, tag it (`vX.Y.Z`) and merge back into `develop` so fixes aren't lost.

## Commit messages (Conventional Commits)

```text
<type>(<scope>): <description>

<optional body>
```

Types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`

`<scope>` is the affected feature/module, lowercase kebab-case — name it after whatever was actually changed: a `lib/` feature folder (`auth`, `spec`, `player`), or a tooling directory (`skill`, `agent`, `build`, `deps`). Don't force a fixed list; pick the scope that most precisely identifies the change. Omit the scope only when a change truly spans the whole repo and no single scope fits.

- Subject line: imperative mood, lowercase after `type(scope):`, no trailing period.
- Keep the subject under ~72 chars; use the body for the "why" when it's not obvious from the diff.
- One logical change per commit — don't bundle unrelated work.

Examples:
```text
feat(spec): add spec templates and generate-specs skill
feat(project): move flutter source to src/mimi_app
docs: add CLAUDE.md and update README with project structure
```

## Workflow

1. Branch off `develop` (or `main` for hotfixes) using the naming pattern above.
2. Make commits following the Conventional Commits format.
3. Only commit when explicitly asked — never commit automatically.
4. Open PRs into `develop` (features/chores) or `main` + `develop` (releases/hotfixes), per the table above.
5. Never push directly to `main` or `develop`; always go through a PR.
