# Phase 2 — MVP: an app worth showing

- **Status:** Active
- **Opened:** 2026-09-25
- **Archives as:** `specs/phase-2-mvp.md`

---

## Tasks

One task = one branch off `main` = one PR, ordered by dependency. Tick the checkbox and the criteria it covered in the PR that lands it.

| #   | Task                                                 | Branch                           | Criteria       |
| --- | ---------------------------------------------------- | -------------------------------- | -------------- |
| 0   | Close Phase 1, open this spec                        | `docs/phase-2-mvp-spec`          | —              |
| 1   | Theme runtime: unistyles, three modes, OS following  | `feat/phase-2-theme-runtime`     | T1, T2         |
| 2   | i18n: English by default, Spanish as second language | `feat/phase-2-i18n`              | I1, I2, I3, I4 |
| 3   | Base components: `Text`, `Button`, `Card`            | `feat/phase-2-base-components`   | U1, U2, U3     |
| 4   | Mock API: MSW, `fetch` wrapper, TanStack Query       | `feat/phase-2-mock-api`          | M1, M2, M3, M4 |
| 5   | Navigation: tabs and the transaction detail route    | `feat/phase-2-navigation`        | N1, N2         |
| 6   | Home: total balance and accounts                     | `feat/phase-2-home`              | H1, Q1, Q2     |
| 7   | Transactions feed with cursor pagination             | `feat/phase-2-transactions-feed` | X1, X2, X3     |
| 8   | Transaction detail and categorisation                | `feat/phase-2-categorise`        | X4, X5         |
| 9   | Budgets for the current month                        | `feat/phase-2-budgets`           | B1, B2         |
| 10  | Settings: theme selector, persisted                  | `feat/phase-2-settings`          | T3, T4, G1     |

- [x] 0 · `docs/phase-2-mvp-spec`
- [x] 1 · `feat/phase-2-theme-runtime`
- [x] 2 · `feat/phase-2-i18n`
- [ ] 3 · `feat/phase-2-base-components`
- [ ] 4 · `feat/phase-2-mock-api`
- [ ] 5 · `feat/phase-2-navigation`
- [ ] 6 · `feat/phase-2-home`
- [ ] 7 · `feat/phase-2-transactions-feed`
- [ ] 8 · `feat/phase-2-categorise`
- [ ] 9 · `feat/phase-2-budgets`
- [ ] 10 · `feat/phase-2-settings`

---

## Why this phase exists

Phase 1 built the token system and the rules around it, but there is still nothing to look at. This phase turns it into an app someone can open on a phone: a home screen, a transaction feed, categorisation, budgets and settings, running on mock data. That is what a portfolio needs first. The remaining Phase 1 work (theme persistence recovery, accessibility primitives, the i18n lint rule) and the planned rule simplification wait until there is an app to apply them to.

---

## Scope

**In:**

- Theme runtime (unistyles) with light, dark and system modes; the mode persisted in MMKV.
- A minimal i18n layer: English as the default language, Spanish as the second, and a typed `t()`.
- Base components `Text`, `Button` and `Card`, reading only from component tokens.
- MSW mock API with simulated latency and cursor pagination; a small typed `fetch` wrapper; TanStack Query with key factories per feature.
- Five screens: Home, Transactions, Transaction detail, Budgets, Settings, with tab navigation.

**Out — explicitly:**

- Login, auth, session, onboarding, secure-store, auto-lock, privacy overlay.
- Sentry.
- Accessibility primitives (font-scale clamping, reduced motion, hit-target checks) — Phase 1 task 8.
- The no-literal-strings lint rule — Phase 1 task 9.
- Theme persistence recovery statuses (`invalid`, `unavailable`) — Phase 1 D7–D8.
- Any language other than English and Spanish, and an in-app language picker.
- Maestro E2E.
- AI features, the FastAPI backend, evals.

---

## Acceptance criteria

### T · Theme

- [x] **T1.** The system **shall** support three theme modes: `light`, `dark` and `system`.
- [x] **T2.** **While** the mode is `system`, the system **shall** follow the OS colour scheme and apply a change without a restart.
- [ ] **T3.** **When** the user selects a mode in Settings, the system **shall** apply it immediately and persist it to MMKV.
- [ ] **T4.** **If** the persisted mode is missing or not one of the three, **then** the system **shall** apply `system`.

### I · Text and language

- [x] **I1.** The system **shall** render every user-visible string through `t()`.
- [x] **I2.** **If** code references a key that is not in the English catalogue, **then** the system **shall** fail typecheck.
- [x] **I3.** **If** the Spanish catalogue is missing a key that the English one has, **then** the system **shall** fail typecheck.
- [x] **I4.** **When** the device language is Spanish, the system **shall** show Spanish; otherwise it **shall** show English.

### U · Base components

- [ ] **U1.** `Text`, `Button` and `Card` **shall** take every colour, spacing, radius and typography value from the component token layer.
- [ ] **U2.** **While** `Button` is loading, the system **shall** render it disabled and expose `accessibilityState.busy` as true.
- [ ] **U3.** **If** `Button` is pressed while disabled or loading, **then** the system **shall not** call `onPress`.

### M · Mock API and data

- [ ] **M1.** The system **shall** serve accounts, transactions, categories and budgets from MSW handlers with simulated latency.
- [ ] **M2.** The transactions endpoint **shall** return pages of 20, newest first, with an opaque `nextCursor` that is null on the last page.
- [ ] **M3.** Every query key **shall** come from its feature's `api/keys.ts`.
- [ ] **M4.** The system **shall** carry money as integer minor units and format it with the device locale only when rendering.

### N · Navigation

- [ ] **N1.** The system **shall** show four tabs: Home, Transactions, Budgets, Settings.
- [ ] **N2.** **When** the user taps a transaction, the system **shall** open its detail screen.

### Q · Loading and errors (every data screen)

- [ ] **Q1.** **While** a screen's first request is in flight, the system **shall** show a loading state.
- [ ] **Q2.** **If** a screen's request fails, **then** the system **shall** show an error with a retry action.

### H · Home

- [ ] **H1.** Home **shall** show the total balance across accounts and one row per account with its balance.

### X · Transactions

- [ ] **X1.** The transactions screen **shall** list transactions newest first, grouped by day.
- [ ] **X2.** **When** the user scrolls near the end of the list, the system **shall** fetch the next page, and **shall** stop when `nextCursor` is null.
- [ ] **X3.** **If** fetching a later page fails, **then** the system **shall** keep the loaded pages and show a retry at the end of the list.
- [ ] **X4.** The detail screen **shall** show amount, merchant, date, account and category.
- [ ] **X5.** **When** the user picks a new category, the system **shall** show it immediately and save it; **if** saving fails, **then** it **shall** restore the previous category and say so.

### B · Budgets

- [ ] **B1.** The budgets screen **shall** show, for each category with a budget, the amount spent this month against its limit.
- [ ] **B2.** **If** spending exceeds the limit, **then** the system **shall** render that budget with the `negative` role.

### G · Settings

- [ ] **G1.** Settings **shall** offer the three theme modes and show which one is active.

---

## Edge cases and decisions made explicit

**Dependencies this phase adds.** From the constitution's stack: `react-native-unistyles` (plus its peer `react-native-nitro-modules`), `react-native-mmkv`, `@tanstack/react-query`, `msw`. Not in the stack: `react-native-url-polyfill` and `fast-text-encoding`, which MSW needs on React Native, and `expo-localization` to read the device language. Unistyles 3 and MMKV are native modules, so the app runs in a dev client (`pnpm prebuild`), not Expo Go. Each is installed in the task that needs it.

**i18n has no library.** English is the source catalogue, and its keys are the type of `t(key)`, which makes I2 a compile error. The Spanish catalogue is typed with the same shape as the English one, which makes I3 a compile error. Two languages and a handful of placeholders do not need i18next. A library is worth it once plurals or more languages arrive.

**Pagination can shift under the user.** If a categorisation changes the list while pages are loaded, the next page is still requested by cursor, not by offset, so nothing is skipped or duplicated. That is the reason the endpoint uses cursors at all.

**Categorisation is optimistic.** X5 updates the cached transaction before the server answers and rolls back on error. The budgets query is invalidated on success, since a category change moves spending between budgets.

**Rule simplification landed with task 1.** Branded colour types, the C1 layer-import rule and the B4 disable scan are gone, and constitution §2 is softened (ADRs 0002 and 0004). Branded types clashed with unistyles' theme types, which settled the timing.

**The mock data is fixed.** Fixtures are generated once and checked in, so screenshots and tests are stable. "This month" in B1 is computed relative to the newest fixture, not the device clock, so the budgets screen never goes empty.

---

## Non-decisions

- **Theme recovery statuses and boot-before-first-paint** (Phase 1 D5–D9) come back with the persistence work after this phase.
- **Accessibility primitives and the i18n lint rule** (Phase 1 tasks 8 and 9) follow this phase.
- **Auth and onboarding** are the next product phase, together with secure-store.
- **Sentry** needs an ADR against constitution §7 when it is scheduled.

---

## Definition of done

- [ ] All tasks landed, each as its own reviewed PR.
- [ ] Every acceptance criterion ticked, with the test or type check that covers it named in the PR.
- [ ] `pnpm verify` green in CI.
- [ ] The app runs on an iOS simulator and an Android emulator, with all five screens working in light and dark.
- [ ] `README.md` shows what the app does, with screenshots, and how to run it.
- [ ] ADR written for the mock API approach (MSW on native, cursor pagination).
- [ ] `specs/active.md` archived as `specs/phase-2-mvp.md`.
