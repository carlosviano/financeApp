# Design

The visual design for financeApp is a Claude Design canvas: 34 artboards covering onboarding, access, home, transactions, accounts, budgets, settings and system states.

## The canvas is not in this repository

`design/redesign-pantallas/` is gitignored. It is ~3.1 MB, most of it a single generated bundle, and it is **reference material, not a build input** — no screen in it is implemented in Phase 1, and the repository is a portfolio shop window rather than a design archive.

Keep your own copy of the canvas at `design/redesign-pantallas/`. Nothing in `pnpm verify` requires it.

## What _is_ committed, and why

| File                 | Purpose                                                                                                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `canvas-tokens.json` | The 26 `:root` custom properties shared by all 34 artboards — colours, radii, shadows, font families — pinned with a SHA-256 of the block they came from. |
| `extract-tokens.mjs` | Regenerates the above from the canvas. Zero dependencies, Node only.                                                                                      |

The extraction exists because acceptance criterion **C9** requires the primitive token layer to match the design, and a check that only runs on one laptop is precisely the "documented agreement" the project's golden rule forbids. Committing the extraction lets that check run in CI without dragging the canvas along with it.

## Regenerating

```sh
node design/extract-tokens.mjs          # rewrite canvas-tokens.json
node design/extract-tokens.mjs --check  # fail if the canvas has drifted from it
```

The script refuses to emit anything if the artboards stop agreeing on a single `:root` block — at that point there is no one palette to extract and a human needs to look at why.

## How C9 is checked

Two tests, deliberately split:

- **In CI** — the primitive layer is compared against `canvas-tokens.json`. Always runs; the canvas is not needed.
- **Locally** — `--check` re-reads the canvas and fails if `canvas-tokens.json` is stale. Skipped when `design/redesign-pantallas/` is absent, which is the normal state on a CI runner.

So design drift is caught on the machine that has the design, and token drift is caught everywhere.

## Backup

The canvas lives only on the machine that generated it. If it matters to you beyond Phase 1 token extraction, back it up somewhere durable — a private repository or ordinary file backup. Losing it would not break the build, but it would cost you the reference for every screen phase after this one.
