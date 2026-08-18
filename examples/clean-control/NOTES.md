# Why this reference build reports two majors

It passes — zero blockers — and it reports two MAJORs on purpose. Both are the
gate being right, and neither is silenced, because silencing a correct finding to
make an exemplar look clean is how a gate starts being decoration.

### 1. `design/default-display-font` — "display face is Georgia"

Correct. A system serif is not a decided display face, and the gate says so.

The repo ships **no binaries**, so it cannot ship a licensed woff2 to demonstrate
the right answer. A real build picks a face, checks its licence covers webfont
use (stage 01 question 22 — a desktop licence does not), self-hosts the woff2,
and this finding disappears.

The alternative was an exemption for "system stacks with a documented reason",
and it lost: the first exemption is the one that teaches everyone the gate is
negotiable.

### 2. `legal/regulated-claim` — "Registered with the Farriers Registration Council"

Also correct, and this is the gate working as designed. A register claim is a
regulator exposure, so it **blocks** unless a sourced row in `facts.md` backs it.
Here one does, so it drops to MAJOR with "(a ledger row mentions it)" — meaning
*a human still has to confirm the source is real before launch*.

That is the honest end state. The machine can prove a claim traces to a sourced
row. It cannot prove the row is true, and it does not pretend to.

---

**The business is invented** and uses the reserved `.example` TLD plus an Ofcom
drama phone range, so nothing here can resolve to or be confused with a real
farrier. That is the same rule the pipeline applies to client work: never
fabricate a real company.
