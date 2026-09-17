# AGENTS.md — financeApp

## Project

Personal-finance app in React Native (Expo SDK 57, RN 0.86, TS strict) that unifies bank accounts, transaction feed, categorisation and budgets. Portfolio project: prioritises architectural judgment over feature volume (6–7 screens). **Feature-first** architecture (`auth`, `transactions`, `budgets`, `settings`) with boundaries enforced by ESLint and TypeScript, not by convention. Server state in TanStack Query, client state in Zustand, styling with react-native-unistyles 3 on top of a 3-layer design-token system, mock API with MSW (cursor pagination), persistence with MMKV + expo-secure-store. Sentry from day one, tests as a real CI gate.

## How we work — human in the loop

This project is a learning exercise, not a delivery race. The agent proposes, I review, and only then does anything land. Reviewing every diff before it becomes a commit is the point of the exercise, not an obstacle to it — work that lands without being read teaches nobody anything.

**The stop gate.** When a task's code is finished, stop and show me the diff. Do not `git commit`, do not push, do not open a PR, and do not begin the next task until I have explicitly approved that specific step. Approval of one step is never approval of the next: "the diff looks good" is not permission to commit, and permission to commit is not permission to open the PR. Ask for each.

**One task in flight at a time.** Exactly one task branch exists at any moment. The next branch is not created until the current task's PR is approved, merged, and its checkbox ticked in `specs/active.md`. Never start a second task while the first is awaiting review.

**Commit messages stay short.** A Conventional Commits subject line, then three or four lines of plain language saying what the commit does and why anyone should care. Write them so a person who has never opened this repository understands the point. No essays, no bullet lists, no restating the diff — the reasoning belongs in the spec or an ADR, where it stays findable.

**I write the pull request, you merge it.** The agent pushes the branch and opens the PR with a description covering what changed, why, and what to look at while reviewing. Reviewing, approving and merging are mine alone — the agent never merges a PR, never approves one, and never pushes to `main` directly.

**Waiting is the correct state.** If I have not replied, do not pick up adjacent work to stay busy. Report what is done, say what you are waiting on, and stop.

## Commands

- Run: `pnpm start` (Metro) · `pnpm ios` · `pnpm android`
- Native prebuild: `pnpm prebuild --clean`
- Tests: `pnpm test` (unit) · `pnpm test:watch` · `pnpm e2e` (Maestro)
- Lint/format: `pnpm lint` · `pnpm format` · `pnpm typecheck`
- Full verification (what CI runs): `pnpm verify` = `lint && typecheck && test`

## Style and conventions

- **Language**: code, identifiers, comments, commits, PRs and ADRs **in English**. No mixed-language identifiers.
- **TypeScript** 5.x in `strict` mode. `any` is forbidden; use `unknown` + narrowing or define the type. No `@ts-ignore` without a comment justifying it.
- **Naming**: `PascalCase.tsx` for components, `camelCase.ts` for hooks/utilities (`useX`, `formatX`), `kebab-case` for `expo-router` routes, `SCREAMING_SNAKE` for environment constants.
- **Feature layout**: each `src/features/<name>/` has `api/`, `model/`, `ui/` and an `index.ts` as its **single public API**. Outside the feature, imports go only through `index.ts`.
- **State**: server state → TanStack Query (query keys via a central factory in `api/keys.ts`, never loose string literals); client state → Zustand; Context reserved for dependency injection (theme, i18n). Never mirror server data into Zustand.
- **Styling**: unistyles + tokens only. Hardcoded hex outside `src/theme/` is forbidden, as are `style={{…}}` objects with literal values. No escape props like `customBackgroundColor?: string` on base components.
- **Forms**: react-hook-form + zod schemas. Schemas live in `model/` and are shared with the backend. A form **never** carries state between screens.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`). One commit ≠ one file; one commit = one coherent change that compiles and passes lint. Keep the body to three or four plain-language lines — see *How we work*.

## Rules

- **Read `docs/constitution.md` and the active spec (`specs/active.md`) before touching code.** If there is no active spec for the task, stop and ask; do not improvise scope.
- **Project golden rule**: every architectural rule must be a lint or compile error, never a documented agreement. If you spot a rule that lives only in a comment or a PR review, propose how to turn it into `eslint-plugin-boundaries`, `no-restricted-imports`, or a type. Do not break it in the meantime.
- **Import boundaries** (enforced by ESLint — do not bypass with `// eslint-disable`):
  - A feature **may not** import another feature's internals; only from its `index.ts`.
  - `src/shared/**` **may not** import from `src/features/**`.
  - `src/app/**` contains **only** routes and layouts. Any `styles.ts`, helper or component goes elsewhere, or must be prefixed with `_`.
- **Do not add dependencies without asking.** The stack is closed (see `docs/constitution.md`). If you believe a library is missing, propose the decision with alternatives and consequences before installing anything. Specifically forbidden: axios, styled-components, Redux, AsyncStorage, moment, full lodash.
- **Do not touch native config by hand.** No editing `android/` or `ios/` directly (they are gitignored). Every native change ships as a config plugin in `src/plugins/`.
- **Never commit secrets or keys.** MMKV keys, Sentry tokens, EAS credentials: only via `EXPO_PUBLIC_*` (public, ships in the bundle) or EAS Environment Variables (private). If unsure whether something is secret, it is.
- **When you close a phase, write its ADR.** Without an ADR, the decision is not made. ADRs go in `docs/adr/NNNN-title.md` with context, decision, alternatives rejected and consequences.
- **SDD flow**: for any non-trivial feature, first update or create the spec in `specs/<feature>.md` (what it does, acceptance criteria, edge cases, out of scope), show it to me, and only then drop into code.
- **Task decomposition and branching**: before starting work on a spec, break its acceptance criteria into the smallest coherent tasks that each land as a single PR. For each task, create a branch off `main` named `<type>/<phase>-<short-slug>` (e.g. `feat/phase-1-token-system`, `chore/phase-1-eslint-boundaries`, `test/phase-2-refresh-queue`), using the same types as Conventional Commits. One task = one branch = one PR. Group criteria only when they cannot be verified independently; if in doubt, split. Show me the proposed task list and branch names before creating any branch, and wait for my approval.
- **Direction of travel**: Phase 2 will add AI-powered features (natural-language transaction Q&A, spending insights, recurring-expense detection) via a FastAPI backend, plus an evals harness. Do not implement any of this in Phase 1, but when a Phase 1 decision has two equivalent options and one preserves flexibility for a future `ai-insights` feature, prefer that one and note it in the relevant ADR.

## When you finish any task

1. Run `pnpm verify` — it must pass green. If it fails, fix it before calling the task done.
2. Update the spec (`specs/<feature>.md`) marking which acceptance criteria are covered and which are still open.
3. If the task closed an architectural decision, write or update the corresponding ADR in `docs/adr/`.
4. Summarise in your reply: what you did, which files you touched, what remains open in the spec, and which decisions you left open for me to close.
5. **Then stop.** Show me the diff and wait for my explicit approval before committing, before opening the PR, and before touching the next task. Do not create the next branch.
