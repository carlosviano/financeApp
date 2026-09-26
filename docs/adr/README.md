# Architecture Decision Records

This directory holds the log of closed architectural decisions for financeApp. Each ADR captures **one** decision at the moment it was made, so that future work — mine or an agent's — can see not just _what_ the project does but _why_.

## Rules

- One decision per file. Numbered sequentially (`0001`, `0002`, …), never renumbered, never deleted.
- Files are named `NNNN-kebab-case-title.md`.
- Once merged, an ADR is **immutable**. To change a past decision, write a new ADR whose front matter says `Supersedes: NNNN`, and update the superseded file's status to `Superseded by NNNN`.
- An ADR is written **at the moment the decision closes**, not retroactively.
- If a phase closes without an ADR, the decision isn't fully made yet.

## Index

| #    | Title                                           | Status   |
| ---- | ----------------------------------------------- | -------- |
| 0001 | TypeScript 6.x replaces the 5.x entry           | Accepted |
| 0002 | Three token layers, kept apart by convention    | Accepted |
| 0003 | The dark palette is written by hand             | Accepted |
| 0004 | Enforce the rules that matter, convene the rest | Accepted |

<!-- Add rows above this line as ADRs are written. -->

## Template

Copy this into a new file when opening an ADR. Keep it short — a good ADR is one page, not five.

```markdown
# NNNN — <Short decision title>

- **Status:** Proposed | Accepted | Superseded by NNNN
- **Date:** YYYY-MM-DD
- **Supersedes:** (optional) NNNN

## Context

What was the situation that forced a decision? What constraints applied? What did we know, and what did we not know? Two or three paragraphs, no more.

## Decision

The decision, stated in one or two sentences. Active voice. "We will use X."

## Alternatives considered

- **Alternative A** — Why it was rejected. One or two sentences per alternative.
- **Alternative B** — Same.
- **Alternative C** — Same.

At least two real alternatives. "Nothing" is not an alternative; "keep the current approach" sometimes is.

## Consequences

What becomes easier as a result of this decision? What becomes harder? What follow-up work does this create (new ADRs, migrations, docs)? Be honest about the trade-offs — an ADR that lists only upsides is a red flag.
```
