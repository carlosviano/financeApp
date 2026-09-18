# 0001 — TypeScript 6.x replaces the 5.x entry in the stack table

- **Status:** Accepted
- **Date:** 2026-09-17
- **Accepted:** 2026-09-18
- **Supersedes:** constitution §3, the "Language" row

## Context

The constitution's closed stack table names "TypeScript 5.x, `strict`". That row was written before the project was scaffolded. Expo SDK 57, which the same table pins, ships TypeScript 6.0.3 in its template and is developed and tested against it. React Native 0.86 and React 19.2 type definitions target the same version.

Holding the 5.x line would mean running a compiler older than the one the framework's own type definitions are written for. In practice that surfaces as errors inside `node_modules` that we would have to silence, which works against the strictness the row exists to protect.

TypeScript 6.0 is the first release built on the native Go port of the compiler. It is materially faster on a cold typecheck, which matters for a CI gate that runs on every pull request.

## Decision

We will use TypeScript 6.0.3, the version Expo SDK 57 ships, and treat the "5.x" text in constitution §3 as replaced by "6.x".

## Alternatives considered

- **Pin TypeScript 5.9 and keep the constitution untouched.** Rejected. It puts the compiler behind the type definitions shipped by every framework package in the stack, and the cost lands as suppression comments in our code for problems that are not ours.
- **Leave the row alone and treat the mismatch as a documentation detail.** Rejected outright. Constitution §11 exists to stop exactly this, and §2 says a rule that survives on informal agreement is not a rule. Skipping the ADR here would undercut the argument the whole repository is making.
- **Wait for a future SDK to settle the version.** Rejected. The conflict is live now, on the first task that writes a `package.json`.

## Consequences

`typescript-eslint` 8.70 supports TypeScript up to but not including 6.1, so the lint toolchain works today and will need a version bump before we move to 6.1.

Anyone reading the constitution alone would still see "5.x". That is the cost of an immutable ADR log, and it is why §3 now has to be read alongside this file.

Cold typecheck times drop, which makes the CI gate cheaper to keep as a required check.
