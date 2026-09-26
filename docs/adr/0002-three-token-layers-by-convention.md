# 0002 — Three token layers, kept apart by convention

- **Status:** Accepted
- **Date:** 2026-09-26

## Context

Constitution §6 asks for three token layers — primitive, semantic, component — with no shortcuts between them. A first version enforced this with branded colour types (`string & { brand }`) and a `no-restricted-imports` rule per layer. It worked, but the types were hard to read, and they clashed with unistyles: its theme types walk our tokens with a mapped type, which broke on the branded strings and needed an extra helper type just to undo the brands.

## Decision

The three layers stay as three files in `src/theme` — `primitives.ts`, `semantic.ts`, `components.ts` — and `src/theme/index.ts` exports only the component layer. Which layer may reference which is a convention, checked in code review. Colours are plain `string`s.

## Alternatives considered

- **Branded colour types plus per-layer import rules.** They turn a layer shortcut into a compile or lint error, but at a cost in readability and library friction that a small app does not need.
- **`eslint-plugin-boundaries` element types per layer.** The plugin is already installed, but it is more configuration to read, and it only covers imports.

## Consequences

- The token files are plain objects and interfaces, readable without knowing type-level tricks.
- Unistyles gets `ComponentTokens` directly, with no helper types.
- Nothing stops a component token from using a palette colour directly. Review catches it. If it keeps happening, it becomes a lint rule then.
- Still enforced: no colour literals outside `primitives.ts` (C2/C5), the typography cap (C8), both themes filling every role (D11), and contrast (D12).
