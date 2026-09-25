# 0002 — Three token layers, kept apart by branded colour types

- **Status:** Proposed
- **Date:** 2026-09-25

## Context

Constitution §6 asks for three token layers — primitive, semantic, component — with no shortcuts between them. The golden rule says that has to be enforced by the build, not by review. Two kinds of shortcut need stopping: importing a layer you should not see, and putting the wrong kind of value into a token, such as a hex string in the semantic layer or a primitive in a component token.

## Decision

Each layer is one file in `src/theme`: `primitives.ts`, `semantic.ts`, `components.ts`. `no-restricted-imports` lets only `semantic.ts` import primitives and only `components.ts` import semantic tokens. `src/theme/index.ts` exports only the component layer. Colours carry a brand: `PrimitiveColour` and `SemanticColour` are `string` plus a unique symbol, so a plain string cannot be assigned to either, and neither can be assigned to the other.

## Alternatives considered

- **A naming convention and code review.** This is the documented agreement the golden rule rules out.
- **`eslint-plugin-boundaries` element types for each layer.** It is already installed and would work, but its policy config is harder to read than two `no-restricted-imports` blocks, and it only covers imports. It cannot catch a hex string typed into the semantic layer.
- **One brand for all tokens.** It would stop literals, but a component token could still take a primitive directly, which is exactly the shortcut C4 forbids.

## Consequences

- Wrong values fail `pnpm typecheck`. No lint directive can switch that off.
- There is one cast in `semantic.ts` (`asRoles`) where a primitive becomes a semantic colour. It is the only place allowed to do that, and it only accepts a fully filled set of roles.
- `ColourRoles<C>` is generic, so the dark theme in task 5 has to fill exactly the same roles as the light one (D11).
- Only colours are branded. Radii, spacing and type sizes are plain numbers, so a component could hardcode a number and still typecheck. C6 covers the inline-style case. Branding numbers too would make every stylesheet awkward.
- Components read one theme object from `themes`. The theme runtime (task 6) registers those objects and does not need the lower layers.
