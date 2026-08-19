# Why this reference build reports 1 major

It passes — zero blockers — and it reports 1 MAJOR on purpose. It is the gate
being right, and it is not silenced, because silencing a correct finding to make
an exemplar look clean is how a gate starts being decoration.

> This file said "two majors" for longer than it was true. The second one
> stopped firing when `legal/regulated-claim` was tightened to require the
> claim's own discriminator, and nothing re-read this paragraph — the README
> then quoted it. Sixth instance of the same class in this repo: a claim about
> the code, written in prose, going stale silently. `checks/selftest.mjs` now
> compares the number in this heading against what the fixture actually
> produces, so the two fail together.

### 1. `design/default-display-font` — "display face is Georgia"

Correct. A system serif is not a decided display face, and the gate says so.

The repo ships **no binaries**, so it cannot ship a licensed woff2 to demonstrate
the right answer. A real build picks a face, checks its licence covers webfont
use (stage 01 question 22 — a desktop licence does not), self-hosts the woff2,
and this finding disappears.

The alternative was an exemption for "system stacks with a documented reason",
and it lost: the first exemption is the one that teaches everyone the gate is
negotiable.

### 2. `legal/regulated-claim` — no longer fires here, and that is correct

The Farriers Registration Council claim on this site used to report as a MAJOR.
It stopped when the gate was tightened to require the claim's OWN discriminator
rather than any capitalised word within ninety characters — a change made
because "Licensed by the State of Ohio" was being excused by the trading name
sitting near it in the ledger.

The finding it used to make is still the honest end state, and it is worth
stating even though no gate now says it on this fixture: **the machine can prove
a claim traces to a sourced row. It cannot prove the row is true.** A register
number on a real build still has to be checked against the real register by a
person, before launch.

---

**The business is invented** and uses the reserved `.example` TLD plus an Ofcom
drama phone range, so nothing here can resolve to or be confused with a real
farrier. That is the same rule the pipeline applies to client work: never
fabricate a real company.
