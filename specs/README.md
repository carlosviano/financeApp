# Specs

This directory holds the specifications that drive development in financeApp. The project follows Spec-Driven Development: work happens against a written spec, not against a chat conversation.

## The rule of one active spec

At any moment there is **exactly one** file called `active.md`. It describes the phase currently being built. When that phase closes, `active.md` is renamed to `phase-N-<name>.md` and a fresh `active.md` is dropped in for the next phase.

There is no drafts folder, no backlog. If a phase isn't the one being built right now, it either doesn't exist yet or it's archived — nothing in between. This keeps agents from reading stale scope by accident, which is the single most common failure mode of documented projects.

## What a spec contains

Every spec has these sections, in this order:

1. **Header** — status
2. **Why this phase exists** — one or two paragraphs of prose. What problem does this phase solve, and why now?
3. **Scope** — bullet list of what's in and what's out. Being explicit about "out" matters more than "in".
4. **Acceptance criteria** — the testable list. Uses EARS syntax (see below).
5. **Edge cases and decisions to make explicit** — prose. Things the acceptance criteria assume but don't spell out.
6. **Non-decisions** — deliberately deferred questions, with a pointer to the phase that will resolve them.
7. **Definition of done** — the checklist that closes the phase and archives the spec.

Sections 2, 5, and 6 are prose. Sections 3, 4, and 7 are lists.

## Acceptance criteria use EARS

EARS (Easy Approach to Requirements Syntax) is a small set of templates that force each criterion to be unambiguous and testable. **Every acceptance criterion in a spec must start with one of five keywords**:

| Pattern      | Template                                                                  | Use for                            |
| ------------ | ------------------------------------------------------------------------- | ---------------------------------- |
| Ubiquitous   | _The system **shall** `<response>`._                                      | Always-true invariants             |
| Event-driven | **\*When** `<trigger>`, the system **shall** `<response>`.\*              | Reactions to user or system events |
| State-driven | **\*While** `<state>`, the system **shall** `<response>`.\*               | Behaviour that holds during a mode |
| Unwanted     | **\*If** `<condition>`, **then** the system **shall** `<response>`.\*     | Error paths and edge cases         |
| Optional     | **\*Where** `<feature is included>`, the system **shall** `<response>`.\* | Feature-flagged behaviour          |

If a criterion doesn't start with one of **shall / when / while / if…then / where**, rewrite it until it does. The "if…then" pattern in particular is worth using generously — it's what surfaces the edge cases prose tends to hide.

Everything outside the acceptance-criteria section is prose. Don't force EARS on scope, rationale, or edge-case narrative — it makes them unreadable.

## Lifecycle of a spec

1. **Draft `active.md`** for the next phase before writing any code. Show it to a reviewer (or read it aloud yourself the next morning).
2. **Break it down.** Before writing code, decompose the acceptance criteria into a task list. Each task is a coherent, independently verifiable chunk that maps to one branch and one PR. Record the task list at the top of `active.md` under a `## Tasks` heading, with checkboxes and the branch name for each. Tasks are ordered by dependency, not by criterion order.
3. **Build against it, one branch per task.** Each session, the agent reads `AGENTS.md` → `docs/constitution.md` → `specs/active.md`, picks the next unchecked task, creates its branch off `main`, and works only on that task's criteria. When the task lands, its checkbox and the criteria it covered are ticked in the same PR.
   **This is a human-in-the-loop project.** The agent stops at the end of each task and waits for review before committing, before opening the PR, and before starting the next task — see _How we work_ in `AGENTS.md`. Only one task branch exists at a time.
4. **Update in place.** Criteria get checked off as they land. If scope changes mid-phase, the spec is updated _first_, then the code follows — never the other way around.
5. **Close and archive.** When every criterion in the Definition of Done is checked, rename `active.md` to `phase-N-<slug>.md` and open the next phase's spec as the new `active.md`. Archived specs are frozen — never edited afterwards.
6. **Reopening work on an archived area** means writing a new spec, not resurrecting the old one.

## Index of archived specs

| #   | Phase | Closed on | File |
| --- | ----- | --------- | ---- |
| —   | —     | —         | —    |

<!-- Add rows above this line as phases close. -->
