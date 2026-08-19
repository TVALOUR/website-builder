# sector-control - the negative controls for the sector family

Four managed builds, each written to fail one shape of the `sector` family. They
are fixtures, not demonstrations of good work: every one of them would also fail
several other families, because a five-line page has no privacy policy, no
footer and no 404. That is fine. A negative control's job is to fire the gate it
was written for, and the selftest asserts exactly that.

| Folder | Fires | Because |
|---|---|---|
| `declared/` | `sector/disclosure-missing` · `sector/page-missing` · `sector/number-unsourced` · `sector/register-link` · `sector/human-confirm` | a solicitor's site with no statement of regulated status, no complaints procedure, no published costs, and an SRA number tracing to nothing |
| `prohibited/` | `sector/prohibited-content` | an aesthetics clinic naming and pricing a prescription only medicine |
| `undeclared/` | `sector/undeclared` | a physiotherapy site whose build never says what trade it is in |
| `unknown/` | `sector/unknown` | a `Sector` row naming a file that does not exist |

Every business here is invented. The phone number in `declared/` is inside
Ofcom's drama range for Exeter (01392 496 0xxx) and the email uses the reserved
`.example` TLD, for the same reason the reference fixture does: a fixture must
not ring a real person.

Run them:

```
node checks/run.mjs examples/sector-control/declared/site   --profile uk --facts examples/sector-control/declared/facts.md
node checks/run.mjs examples/sector-control/prohibited/site --profile uk --facts examples/sector-control/prohibited/facts.md
node checks/run.mjs examples/sector-control/undeclared/site --profile uk --facts examples/sector-control/undeclared/facts.md
node checks/run.mjs examples/sector-control/unknown/site    --profile uk --facts examples/sector-control/unknown/facts.md
```
