# Phase 1 — Foundations: enforced architecture and the token system

- **Status:** Closed early
- **Opened:** 2026-09-15
- **Closed:** 2026-09-25

> **Closed early for the MVP.** Tasks 0–5 landed. Task 6 (theme runtime) and task 10 (`Button`) moved into Phase 2, where the MVP needs them. Tasks 7 (theme persistence recovery), 8 (accessibility primitives) and 9 (the i18n lint rule) are deferred until after the MVP, as are the Definition of done items still unticked below. Phase 2's Non-decisions track them.

---

## Tasks

One task = one branch off `main` = one PR. Ordered by dependency, not by criterion number. Tick the checkbox and the criteria it covered in the same PR that lands it.

**Human in the loop.** Tasks are worked one at a time and each one stops for review before it is committed. No task below is started until the previous one's PR has been reviewed, approved and merged — see _How we work_ in `AGENTS.md`.

| #   | Task                                                                | Branch                            | Criteria               |
| --- | ------------------------------------------------------------------- | --------------------------------- | ---------------------- |
| 0   | Commit the SDD scaffolding; pin the design-token extraction         | `chore/phase-1-sdd-foundation`    | —                      |
| 1   | Scaffold the Expo/TS project and the `pnpm verify` gate             | `chore/phase-1-scaffold`          | A1–A5                  |
| 2   | ESLint boundary rules plus their fixture tests                      | `chore/phase-1-eslint-boundaries` | B1–B5                  |
| 3   | Primitive tokens, using the design canvas as a guide                | `feat/phase-1-token-primitives`   | C2, C5                 |
| 4   | Semantic and component layers, with layer violations as type errors | `feat/phase-1-token-layers`       | C1, C3, C4, C6, C7, C8 |
| 5   | Hand-written dark palette; contrast tests                           | `feat/phase-1-theme-derivation`   | D11, D12               |
| 6   | Theme runtime: three modes, live OS following                       | `feat/phase-1-theme-runtime`      | D1, D2, D3, D5         |
| 7   | Theme persistence and its recovery paths                            | `feat/phase-1-theme-persistence`  | D4, D6, D7, D8, D9     |
| 8   | Accessibility primitives: font-scale clamp, motion, hit targets     | `feat/phase-1-a11y-primitives`    | E1–E8                  |
| 9   | i18n layer and the no-literal-strings rule                          | `feat/phase-1-i18n-lint`          | G1, G2                 |
| 10  | `Button` — the component that proves the system                     | `feat/phase-1-button`             | F1–F6                  |

- [x] 0 · `chore/phase-1-sdd-foundation`
- [x] 1 · `chore/phase-1-scaffold`
- [x] 2 · `chore/phase-1-eslint-boundaries`
- [x] 3 · `feat/phase-1-token-primitives`
- [x] 4 · `feat/phase-1-token-layers`
- [x] 5 · `feat/phase-1-theme-derivation`
- [ ] 6 · `feat/phase-1-theme-runtime` — moved to Phase 2
- [ ] 7 · `feat/phase-1-theme-persistence` — deferred
- [ ] 8 · `feat/phase-1-a11y-primitives` — deferred
- [ ] 9 · `feat/phase-1-i18n-lint` — deferred
- [ ] 10 · `feat/phase-1-button` — moved to Phase 2

---

## Why this phase exists

The constitution's golden rule is that every architectural rule must be a lint error, a compile error, or a failing test. That rule is worth nothing until the toolchain that enforces it exists. This phase builds that toolchain first, before there is any feature code to protect, because retrofitting boundaries onto a codebase that has already grown around their absence is the exact failure this project is meant to argue against. A boundary rule added on day one costs an afternoon; the same rule added in month three costs a migration.

The second thing this phase builds is the design-token system. There is a finished visual design in `design/redesign-pantallas` — thirty-four artboards sharing one palette. That design is **reference material for this phase, not a build target**. We use it as a guide when picking the colour, radius, shadow and type values of the primitive layer, and we stop there. No screen in that canvas gets implemented in Phase 1. The reason to define tokens before building screens is the same reason to build lint rules before building features: once a screen exists, every hardcoded value in it is a value somebody has to go back and find.

The phase ships exactly one component, `Button`. Its job is not to be useful. Its job is to be the proof that the three-layer token system, the theme runtime, the accessibility primitives and the no-escape-props rule all hold together in a real component — and to fail loudly if they do not.

---

## Scope

**In:**

- Expo SDK 57 / RN 0.86 / TypeScript strict project scaffolding, and the `pnpm verify` script that CI runs.
- GitHub Actions workflow running `pnpm verify` on every PR as a merge gate.
- `eslint-plugin-boundaries` and `no-restricted-imports` configuration enforcing the constitution's three import boundaries, each with a fixture that proves the rule still fires.
- The three-layer token system: primitive, semantic, component — with cross-layer violations surfacing as type errors, not review comments.
- Primitive values picked from the design canvas, which is used as a guide rather than copied literally.
- The dark palette, written by hand.
- Theme runtime: `light`, `dark`, `system`; MMKV persistence; the recovery paths for every way that persistence can fail.
- Accessibility primitives: font-scale clamping, reduced-motion handling, minimum hit targets.
- The i18n layer and the lint rule banning user-visible string literals in JSX.
- `Button`.

**Out — explicitly:**

- **Every screen in `design/redesign-pantallas/`.** All thirty-four artboards. Onboarding, login, the transaction feed, budgets, settings — none of them. The canvas is read for values in this phase and for nothing else.
- Navigation structure and `expo-router` route tree beyond the single root layout needed to mount the theme provider.
- MSW, the HTTP client, TanStack Query and every query-key factory.
- Zustand slices other than the theme store.
- Auth, session, secure-store, auto-lock, privacy overlay and screenshot blocking.
- Sentry wiring (see Non-decisions).
- Any base component other than `Button`.
- Everything in the Phase 2 `ai-insights` direction named in `AGENTS.md`: natural-language transaction Q&A, spending insights, recurring-expense detection, the FastAPI backend, the evals harness.

---

## Acceptance criteria

### A · Verification gate

- [x] **A1.** The system **shall** expose a `pnpm verify` script that runs `lint`, `typecheck` and `test` in that order and exits non-zero if any of the three fails.
- [x] **A2.** The system **shall** compile under TypeScript `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` and `noImplicitOverride`.
- [x] **A3.** **When** a pull request targets `main`, the system **shall** run `pnpm verify` on Linux in GitHub Actions and **shall** block merge if it exits non-zero.
- [x] **A4.** **If** a file under `src/**` uses the `any` type, **then** the system **shall** fail lint.
- [x] **A5.** **If** a file under `src/**` uses `@ts-ignore` or `@ts-expect-error` without a trailing justification comment, **then** the system **shall** fail lint.

### B · Import boundaries

- [x] **B1.** **If** a module under `src/features/<a>/**` imports from `src/features/<b>/**` by any path other than that feature's `index.ts`, **then** the system **shall** fail lint.
- [x] **B2.** **If** a module under `src/shared/**` imports from `src/features/**`, **then** the system **shall** fail lint.
- [x] **B3.** **If** a file under `src/app/**` is neither an `expo-router` route, nor a layout, nor prefixed with `_`, **then** the system **shall** fail lint.
- [x] **B4.** **If** a file under `src/**` carries an `eslint-disable` directive naming a boundary rule, **then** the system **shall** fail the architecture test suite.
- [x] **B5.** The system **shall** hold, for each of B1–B3, a fixture module under `tests/architecture/fixtures/` that ESLint reports as an error, and the architecture test suite **shall** fail **if** any fixture stops being reported.

### C · Token system

- [x] **C1.** The system **shall** define design tokens in exactly three layers — primitive, semantic, component — each importable only by the layer directly above it.
- [x] **C2.** The primitive layer **shall** be the only module in the repository containing literal colour values.
- [x] **C3.** **If** a semantic token is assigned a literal colour value instead of a primitive reference, **then** the system **shall** fail typecheck.
- [x] **C4.** **If** a component token is assigned a primitive reference or a literal instead of a semantic reference, **then** the system **shall** fail typecheck.
- [x] **C5.** **If** a file outside `src/theme/**` contains a hex, `rgb()`, `rgba()`, `hsl()` or `oklch()` colour literal, **then** the system **shall** fail lint.
- [x] **C6.** **If** a JSX `style` prop is given an inline object literal containing a literal value, **then** the system **shall** fail lint.
- [x] **C7.** **If** a semantic or component token name contains an appearance word — `green`, `red`, `blue`, `gold`, `teal`, `grey`, `gray`, `dark`, `light` — **then** the system **shall** fail the token-naming test.
- [x] **C8.** The typography scale **shall** expose at most eight variants, and **if** a ninth variant is added, **then** the system **shall** fail typecheck.

### D · Theme runtime and persistence

- [ ] **D1.** The system **shall** support exactly three theme modes: `light`, `dark` and `system`.
- [ ] **D2.** **While** the theme mode is `system`, the system **shall** follow the operating system colour scheme and **shall** apply a change to it without requiring a restart.
- [ ] **D3.** **When** the user selects a theme mode, the system **shall** apply it to the running app.
- [ ] **D4.** **When** the user selects a theme mode, the system **shall** persist it to MMKV under a versioned key.
- [ ] **D5.** **When** the app boots with a valid persisted theme mode, the system **shall** apply that mode before the first paint.
- [ ] **D6.** **If** no persisted theme mode is present at boot, **then** the system **shall** apply `system` and **shall** persist nothing until the user makes a choice.
- [ ] **D7.** **If** a persisted theme mode is present but is not one of the three valid modes, **then** the system **shall** discard it, apply `system`, and return an `invalid` recovery status from the theme loader.
- [ ] **D8.** **If** reading the persisted theme mode throws at boot, **then** the system **shall** apply `system`, **shall** return an `unavailable` recovery status, and **shall not** propagate the error to the caller.
- [ ] **D9.** **If** persisting a selected theme mode fails, **then** the system **shall** keep that mode applied for the remainder of the session.
- [x] **D11.** **If** a semantic token has a value in one theme and no value in the other, **then** the system **shall** fail typecheck.
- [x] **D12.** Every semantic text-on-surface token pair **shall** meet a WCAG AA contrast ratio of at least 4.5:1 in both the light and the dark theme.

### E · Accessibility primitives

- [ ] **E1.** The system **shall** scale text with the operating system font-scale setting.
- [ ] **E2.** **If** the operating system font scale exceeds 2.0, **then** the system **shall** clamp body text to 2.0.
- [ ] **E3.** **If** the operating system font scale exceeds 1.6, **then** the system **shall** clamp money amounts to 1.6.
- [ ] **E4.** **When** the operating system font scale is exactly 2.0, the system **shall** render body text at 2.0.
- [ ] **E5.** **When** the operating system font scale is exactly 1.6, the system **shall** render money amounts at 1.6.
- [ ] **E6.** **While** the operating system reports reduced motion as enabled, the system **shall** render transitions as opacity-only and **shall not** run scale or translate animations.
- [ ] **E7.** **If** the reduced-motion setting cannot be read, **then** the system **shall** behave as though reduced motion is enabled.
- [ ] **E8.** Every interactive element **shall** expose a touch target of at least 44×44 points.

### F · Button

- [ ] **F1.** `Button` **shall** read every colour, radius, spacing and typography value it renders from the component token layer.
- [ ] **F2.** **If** a prop whose name matches `custom*Color`, `*ColorOverride` or `*Style` is added to `Button`'s public props, **then** the system **shall** fail typecheck.
- [ ] **F3.** **While** `Button` is pressed, the system **shall** apply its pressed component tokens.
- [ ] **F4.** **While** `Button` is loading, the system **shall** render it as disabled and **shall** expose `accessibilityState.busy` as true.
- [ ] **F5.** **If** `Button` is pressed while disabled or loading, **then** the system **shall not** invoke `onPress`.
- [ ] **F6.** **While** reduced motion is enabled, `Button` **shall** change press state without a scale animation.

### G · Internationalisation

- [ ] **G1.** **If** a user-visible string literal appears in JSX under `src/**`, **then** the system **shall** fail lint.
- [ ] **G2.** **If** a translation key referenced in code is absent from the default locale catalogue, **then** the system **shall** fail the i18n completeness test.

---

## Edge cases and decisions made explicit

**The dark palette is written by hand.** The canvas is light-only — `Settings-Appearance` offers Claro / Oscuro / Automático, but no dark values exist anywhere in it. The dark shades are picked by eye and added to the same primitive scales (`sand[900]`, `indigo[300]`, …), and `semantic.ts` maps the roles twice, once per theme. Both mappings share one type, so a role missing from either is a compile error (D11), and D12 checks that the hand-picked text colours stay readable.

**The design canvas is a guide, not a source of truth.** `design/` is gitignored reference material. The primitive layer takes its colours, radii, shadows and fonts from it by eye and names them by appearance (`sand`, `slate`, `indigo`, …). Nothing checks the primitives against the canvas: a design that is only reference material should not be able to fail the build.

**Cross-layer token violations are type errors because branding makes them type errors.** Primitive values carry an opaque branded type; the semantic layer is typed as a mapping whose values must be that brand; the component layer as a mapping whose values must be the semantic brand. A literal assigned at the semantic layer is a type mismatch, not a lint heuristic. This is the reason C3 and C4 say _typecheck_ rather than _lint_ — it costs nothing extra and it cannot be disabled inline.

**The typography cap is a type-level assertion, not a runtime count.** The variant names are a tuple whose type only allows a length of one to eight. Adding a ninth name makes the tuple the wrong type, which fails `pnpm typecheck`. The scale starts at seven, leaving room for one more. A runtime length check would only fail at test time and could be argued away; a compile error cannot.

**Font-scale caps differ by role, on purpose.** Body text clamps at 2.0; money amounts clamp at 1.6. Money is rendered in tight numeric layouts where a long amount at 2.0 either clips or reflows in a way that changes what the number appears to be — a worse accessibility outcome than slightly smaller text. E4 and E5 exist as separate criteria from E2 and E3 because the boundary is inclusive: at exactly the cap the text renders _at_ the cap, not one step below. That `<=` versus `<` distinction is the classic off-by-one here, and it is untestable unless it is written down.

**The theme loader returns a recovery status rather than logging.** D7 and D8 make the loader return a discriminated result — `ok`, `missing`, `invalid`, `unavailable` — instead of firing off a log line. Three reasons: the recovery path becomes unit-testable without mocking a logger; nothing in Phase 1 depends on an observability stack that Phase 1 does not ship; and when Sentry does arrive in Phase 2, attaching a breadcrumb is one call at the consumer, not a rewrite of the loader. The `unavailable` case is the one most likely to be real: MMKV takes its encryption key from secure-store, and a locked Keychain or a corrupt store makes `getString` throw during boot, which is precisely when an unhandled throw is fatal.

**Reduced motion fails toward less motion.** E7 defaults to _enabled_ when the setting cannot be read. Guessing wrong in that direction costs an animation; guessing wrong in the other direction can cost a user with a vestibular disorder. `Button` (F6) drops scale and translate but keeps opacity, which preserves the sense that the press registered without moving anything on screen.

**Escape props are blocked by shape, not by review.** F2 is a type-test file asserting that `keyof ButtonProps` contains no member matching the escape-prop patterns. Adding `customBackgroundColor` to `Button` breaks `pnpm typecheck` on a file nobody has to remember to open. This is the smallest example of the rule the whole phase exists to demonstrate.

**Boundary rules cannot be disabled inline.** B4 is enforced by a test that scans `src/**` for disable directives naming a boundary rule and fails on a hit. This deliberately avoids adding `eslint-plugin-eslint-comments` (a new dependency, which `AGENTS.md` does not permit without asking) and avoids `noInlineConfig`, which would kill every inline directive in the project rather than just the ones that matter. The trade-off is that the scan is a string match: it catches the directive, not a creative rename of the rule. That is acceptable for a solo repository and is noted as a Phase 2 upgrade path.

**Fixtures are excluded from the main lint pass.** The B5 fixtures are files that must _fail_ lint, so they live outside the `src/**` glob and are linted programmatically by the architecture test. Without that separation `pnpm verify` would be red by design.

---

## Non-decisions

**Sentry is deferred to Phase 2.** The constitution says Sentry ships from day one, and this phase does not ship it. The justification is that Phase 1 has nothing to observe: no network layer, no auth, no session, no screens, and one component. Wiring an error reporter to a project with no error surface produces configuration, not observability. D7 and D8 are written so that the Phase 2 wiring is additive — the recovery statuses already exist and simply gain a consumer. **This deviation needs an ADR when Phase 2 opens**, naming constitution §7 and stating the trigger; until that ADR is written the constitution and this spec are in tension, and that tension is deliberate and recorded rather than silent.

**The `beforeSend` PII scrubber** comes with Sentry in Phase 2, for the same reason.

**Secure-store, auto-lock, the privacy overlay and screenshot blocking** are Phase 2 (security), together with the MMKV encryption-key derivation that D8's failure mode depends on. Phase 1 uses an unencrypted MMKV instance for the theme preference, which stores no secret and no PII. The moment anything sensitive lands in MMKV, encryption stops being deferrable.

**The remaining base components** — `Text`, `Card`, `Field`, `Chip`, `Row` — are deliberately not in this phase. One component is enough to prove the token system; five is enough to start entrenching mistakes in it before the system has been used against a real screen.

**The `expo-router` route tree** waits for the phase that builds screens. Phase 1 mounts only the root layout needed to host the theme provider, and the constitution's five-provider ceiling is checked when there are providers to count.

**`text.disabled` is exempt from D12.** It does not reach 4.5:1 in either theme. WCAG exempts inactive controls, and disabled labels are its only use.

---

## Definition of done

- [ ] All ten tasks landed, each as its own PR off `main`, each reviewed and approved before merge.
- [ ] Every acceptance criterion in sections A–G is ticked, with the test, lint rule or type assertion that enforces it identified in the PR that landed it.
- [ ] `pnpm verify` passes on Linux in GitHub Actions and is configured as a required check on `main`.
- [ ] No criterion is satisfied by a documented agreement. Each one points at a lint error, a compile error or a failing test.
- [x] ADR written for the three-layer token architecture and the branded-type enforcement.
- [x] ADR written for the hand-written dark palette.
- [ ] ADR written for the boundary-enforcement mechanism, including the B4 scan and its known limitation.
- [ ] ADR written for deferring Sentry against constitution §7, or Sentry landed in this phase and the non-decision removed.
- [ ] `README.md` states what the phase built and why the enforcement matters — it is currently empty.
- [x] `specs/active.md` renamed to `specs/phase-1-foundations.md`, the row added to the index in `specs/README.md`, and the Phase 2 spec opened as the new `active.md`.
