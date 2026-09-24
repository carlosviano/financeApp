# Architecture fixtures

Every file under `src/` here is **supposed to fail lint**. They are excluded
from the normal `pnpm lint` pass and are linted deliberately by
`tests/architecture/boundaries.test.ts`.

The test asserts each fixture still produces the rule error named in its
filename. If someone weakens a boundary rule, the violation stops being
reported and the test goes red — which is the whole point. A lint rule with
no test proving it fires is a rule that can be deleted without anyone noticing.
