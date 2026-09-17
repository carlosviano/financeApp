# Constitution — financeApp

> The constitution holds the decisions of this project that **do not change on a whim**. Anything here can only be modified through a written ADR that explicitly supersedes it. The point is to protect the project from decision drift.

---

## 1. Purpose and non-goals

**Purpose.** financeApp is a portfolio project meant to demonstrate architectural judgment for React Native mid/senior roles. It is a personal-finance app that unifies bank accounts, shows a single transaction feed, lets the user categorise movements and enforces monthly budgets per category.

**Explicit non-goals:**

- It is **not** a banking app. No transfers, no payments, no product sign-ups.
- It is **not** a feature-completeness exercise. Scope is capped at ~6–7 screens on purpose.
- It is **not** cross-platform beyond iOS + Android.
- It is **not** multi-brand or multi-tenant.

If a proposal moves the project toward any of these, it is out of scope by default.

---

## 2. Golden rule

**Every architectural rule must be a lint error, a compile error, or a failing test — never a documented agreement.**

## 3. Closed technology stack

The stack below is **closed**. Adding, removing or swapping any item requires an ADR.

| Area                  | Choice                                                 |
| --------------------- | ------------------------------------------------------ |
| Framework             | React Native 0.86 (New Architecture)                   |
| UI runtime            | React 19.2                                             |
| Platform / SDK        | Expo SDK 57 (dev client + prebuild / CNG + EAS)        |
| Language              | TypeScript 5.x, `strict`                               |
| Package manager       | pnpm                                                   |
| Navigation            | expo-router (typed routes)                             |
| Server state          | TanStack Query (central query-key factory)             |
| Client state          | Zustand                                                |
| Styling               | react-native-unistyles 3 + 3-layer design-token system |
| Persistence (prefs)   | MMKV                                                   |
| Persistence (secrets) | expo-secure-store                                      |
| Networking            | `fetch` with a small typed wrapper                     |
| Forms & validation    | react-hook-form + zod                                  |
| Mock API (v1)         | MSW with cursor pagination and simulated latency       |
| Observability         | Sentry (with source maps)                              |
| Testing               | Jest + React Native Testing Library · Maestro (E2E)    |
| CI/CD                 | GitHub Actions + EAS                                   |

**Specifically forbidden without an ADR that supersedes this table:** axios, styled-components, Redux (and RTK), AsyncStorage, moment.js, full lodash imports, any UI kit that ships its own theme runtime.

---

## 4. Architecture

**Feature-first, layer-second.** The unit of organisation is the business feature, not the technical layer.

```
src/
├── app/ Routes and layouts ONLY.
├── features/
│ ├── auth/
│ ├── transactions/
│ ├── budgets/
│ └── settings/
│ ├── api/ queries, mutations, keys
│ ├── model/ zustand slices, zod schemas, domain types
│ ├── ui/ components used only inside this feature
│ └── index.ts PUBLIC API — the only importable surface
├── shared/
│ ├── ui/ design system (atoms and molecules)
│ ├── lib/ http client, storage, db, i18n
│ └── config/ env, constants
└── theme/ 3-layer tokens
```

**Enforced boundaries** (via `eslint-plugin-boundaries` + `no-restricted-imports`):

- A feature may not import another feature's internals — only its `index.ts`.
- `shared/**` may not import from `features/**`.
- `app/**` contains only routes and layouts. Non-route files must be prefixed with `_` or moved out.

Breaking any of these must fail the build.

---

## 5. State

- **Server state** lives in TanStack Query and **only** there. It is never mirrored into Zustand, Context, or MMKV. Query keys come from a central factory (`features/<x>/api/keys.ts`). Invalidation by loose string literal is forbidden.
- **Client state** lives in Zustand. Keep it minimal: session flags, UI filters, drafts. If it can be derived from server state, it does not go here.
- **Context** is for dependency injection only (theme, i18n, feature flags). It is not a store. The root layout has **at most five providers**.

---

## 6. Design system

Three layers, in this order, with no shortcuts:

```
primitive → semantic → component
palette['green/9'] colors.text.positive button.primary.background
```

- Names describe **function**, never appearance. `text.positive`, not `text.green`.
- No hardcoded hex outside `src/theme/`. Enforced by lint.
- No inline `style={{ color: '#…' }}`. Enforced by lint.
- No escape props on base components (`customBackgroundColor`, `customTextColor`, etc.). If a case doesn't fit the system, extend the system.
- Typography scale is capped at 6–8 variants. If you need a ninth, revisit the scale, don't append.

---

## 7. Security posture

- **Secrets** (tokens, refresh tokens, biometric keys) live in `expo-secure-store` / Keychain / Keystore only. Never in MMKV, never in Zustand.
- **MMKV encryption keys** are derived at install time via secure-store, never embedded in the app config or the repo.
- **Auto-lock** on backgrounding; **privacy overlay** in the app switcher; **screenshot blocking** on screens showing money.
- **No PII in logs.** Sentry beforeSend must scrub known-sensitive keys.
- Any change to auth, session, or storage requires an ADR.

---

## 8. Money, dates, i18n

- Money is stored and passed around as **integer minor units** (cents), never as floats. Formatting to the user's locale happens at the UI boundary only.
- Dates are stored as ISO strings in UTC. Display uses the user's locale and time zone.
- All user-visible strings go through i18n from day one. No literals in JSX.

---

## 9. Testing and CI

- Unit + integration tests with Jest + RNTL for hooks and non-trivial components.
- E2E with Maestro for the two happy paths: onboarding→home, and transaction categorisation.
- **Tests are a CI gate.** `pnpm verify` (lint + typecheck + test) must pass on every PR. A red CI blocks merge.
- Coverage is **not** a target; critical logic coverage is. Money math, session/refresh, and query key factories are non-negotiable.

---

## 10. Documentation

- **ADRs** live in `docs/adr/NNNN-title.md`. Every closed architectural decision has one. Format: context, decision, alternatives rejected, consequences.
- **Specs** live in `specs/`. The active one is always `specs/active.md`. When a feature ships, its spec is archived as `specs/<feature>.md`.
- The **README** is the shop window: what it is, the "why nots", how to run it, and a 90-second demo video.

---

## 11. Amending this constitution

Anything in this file changes only through an ADR that:

1. Names the section it supersedes.
2. States the trigger (what changed in reality that invalidates the old decision).
3. Lists the consequences, including migration steps for existing code.

Silent drift is the failure mode this document exists to prevent.
