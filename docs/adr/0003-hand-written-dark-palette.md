# 0003 — The dark palette is written by hand

- **Status:** Accepted
- **Date:** 2026-09-25

## Context

The app needs a dark theme, and the design only has light values. The spec first asked for the dark palette to be generated from the light one by a colour transform, and a version was built that mirrored each colour's luminance. It worked, but it was a lot of colour maths to understand and maintain for a small app, and its output was hard to adjust by eye.

## Decision

We will pick the dark colours by hand and add them to the existing primitive scales (`sand[900]`, `slate[50]`, `indigo[300]`, …). `semantic.ts` maps the roles twice, once for light and once for dark.

## Alternatives considered

- **Generate dark from light with a transform.** Nothing can drift, but the output is hard to adjust by eye. Its oddities, like the card coming out darker than the page, need a code change to fix, and that is more machinery than the project needs.
- **One palette per theme, with the same names in each.** It is a common pattern, but it doubles the primitive layer and makes it harder to see which colours are shared.

## Consequences

- Each dark colour is easy to read and easy to change.
- The light and dark mappings share the `ColourRoles` type, so a role missing from either is a compile error (D11).
- Nothing keeps the two palettes in step. The contrast test (D12) is what catches a dark colour that stops being readable.
