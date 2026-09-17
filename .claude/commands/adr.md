---
description: Scaffold a new ADR from the template in docs/adr/README.md
---

Create a new Architecture Decision Record.

1. Read `docs/adr/README.md` to get the template and to find the next ADR number (highest existing number + 1, zero-padded to 4 digits).
2. Ask me for the ADR title if I haven't given one in the invocation. Turn it into a kebab-case slug.
3. Create `docs/adr/NNNN-<slug>.md` using the template, pre-filling:
   - The number and title in the H1.
   - Status: `Proposed`.
   - Today's date in `YYYY-MM-DD`.
   - Leave Context, Decision, Alternatives considered, and Consequences empty with the template's section headers in place.
4. Add a new row to the index table in `docs/adr/README.md` with number, title, and status `Proposed`.
5. Show me the created file path and remind me that ADRs are written at the moment a decision closes, not retroactively — so I should fill it in now while the reasoning is fresh, not later.

Do not commit. Do not mark the ADR as Accepted; that's my call after I fill it in.
