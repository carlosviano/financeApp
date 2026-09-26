# 0004 — Enforce the rules that matter, convene the rest

- **Status:** Accepted
- **Date:** 2026-09-26
- **Supersedes:** constitution §2 (Golden rule)

## Context

Constitution §2 said every architectural rule must be a lint error, a compile error or a failing test. Following it to the letter in Phase 1 produced branded types, per-layer import rules and a scan that forbids disabling rules inline. Each one was defensible, but together they made a small portfolio app harder to read and to change, and the branded types broke against unistyles' types. The trigger for changing §2 is that the cost showed up in practice, not in theory.

## Decision

The build enforces the rules whose breakage is costly and easy to miss: the feature boundaries, no colour literals outside the primitive palette, no literal values in inline styles, no `any`, and `pnpm verify` as a merge gate. Everything else — token layering, naming — is a convention checked in code review. A convention becomes a rule when it keeps being broken.

## Alternatives considered

- **Keep §2 as written.** It is consistent, but it keeps growing machinery for rules that a solo project breaks rarely.
- **Drop enforcement entirely.** It is simpler, but the boundaries and colour rules are cheap and catch real mistakes, and they are easy to explain.

## Consequences

- Removed: branded colour types (C3, C4), the token-layer import rule (C1), and the inline-disable scan (B4). See ADR 0002.
- `AGENTS.md` no longer asks agents to turn every rule into lint. It asks them not to add enforcement without asking.
- Migration: none beyond this change. The removed checks had no runtime effect.
