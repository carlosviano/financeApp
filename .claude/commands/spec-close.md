---
description: Close the current active spec and open the next phase's spec
---

Close the current phase and roll the active spec forward.

1. Read `specs/active.md` end to end.
2. Verify every checkbox in the Acceptance Criteria section and the Definition of Done section is ticked. If any is not, stop and list the unchecked items — do not proceed. The spec is not closeable.
3. Confirm the phase number and slug from the spec's header (e.g. Phase 1, `skeleton`). Ask me to confirm the archive filename: `specs/phase-<N>-<slug>.md`.
4. Rename `specs/active.md` to that archive filename using `git mv` so history is preserved.
5. Add a row to the "Index of archived specs" table in `specs/README.md` with the number, phase name, today's date, and a relative link to the archived file.
6. Ask me for the next phase's number, name, and one-line purpose. Create a fresh `specs/active.md` with the seven-section skeleton from `specs/README.md` (Header, Why this phase exists, Scope, Acceptance criteria, Edge cases and decisions to make explicit, Non-decisions, Definition of done). Leave the body sections empty with headers in place, except the Header which you fill in with status `In progress`, owner, and target close date (ask me).
7. Remind me that acceptance criteria must use EARS syntax (shall / when / while / if…then / where) and that the next step is to draft the Scope and Acceptance criteria before any code work begins on the new phase.

Do not commit. Do not start work on the new phase's tasks — this command only rolls the paperwork.
