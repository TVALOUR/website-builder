# Recorded runs

What has actually been built with this repo, what broke, and what each run does
and does not prove. Every claim about this tool's output should be checkable
against a row here; if a run is not recorded, treat it as not having happened.

The builds themselves are not committed. `builds/*/` is gitignored because a
real build folder holds a real business's facts, assets and conversations, and
none of that belongs in a public fork. What is committed is the trace.

---

## 2026-08-19 · Runs 1 and 2 — the first naive end-to-end builds

**Why:** every mechanism in this repo had been exercised on real inputs, and
nobody had cloned it and built a site with it. The calibration ledger's
prediction G1 said the first non-UK build would surface a jurisdiction defect
that was not already recorded. It surfaced four, and seven other defects
alongside them.

**Method.** A fresh `git clone` of the public repo into a scratch directory, no
`config.md`, no local state, following only the repo's own instructions —
`node start.mjs`, stage 00, the stage 01 question bank, `checks/brief.mjs`,
`assets.mjs`, `checks/run.mjs`. Both clients are declared demos (question 0,
answer c), on reserved `.example` domains and reserved fictional phone ranges.
Both are non-UK, because that is where the prediction pointed.

| | Run 1 | Run 2 |
|---|---|---|
| Client | Fairmont Chimney & Wood Heat, a chimney sweep | Kingswell Awnings Pty Ltd, an awning installer |
| Where | Ottawa, Ontario — chosen ON the Quebec border, so the Canadian answer is not one answer | Adelaide, South Australia |
| Profile | `ca` | `au` |
| Regime | (c) fictional demo, sole proprietorship | (c) fictional demo, Pty Ltd |
| First gate run | **FAIL — 33 blockers** | **FAIL — 2 blockers** |
| Final | **PASS** — 0 blockers, 1 major | **PASS** — 0 blockers, 1 major |
| Remaining major | `copy/em-dash` at 9.8 per 1,000 — the gate being right about the writing | `copy/em-dash` at 7.6 per 1,000 — same |

### What run 1 found

Eight defects. Four were BLOCKERs on correct work — the build could not ship
while doing what the repo told it to do.

1. **`config.example.md` shipped `Profile: uk` as its value**, four lines above
   its own sentence "There is no default". Copy the template, fill in your name,
   and every build silently runs against UK law. That is the Kansas-plumber
   failure the README opens by describing, sitting in the file stage 00 tells you
   to copy.
2. **`copy/placeholder` blocked the NANPA reserved range on every page** of a
   build that had answered question 0 as a demo — the range question 0 *requires*
   a demo to use.
3. **The project regime was parsed inside `legal.mjs` for `legal.mjs`**, so no
   other family could see the answer to the question the interview says "decides
   which rules bind".
4. **That parser's entity vocabulary was British** — `sole trader`, `limited`,
   `plc`, `llp`. A Canadian sole proprietorship matched none of it, and the
   fallback then decided the entity's legal form by grepping the HTML for
   "Companies House" and "registered in England".
5. **`legal/privacy-policy` demanded the literal phrase "privacy officer"**, so a
   page using the statute's own words — "person in charge of the protection of
   personal information", P-39.1 s.3.1 — failed at BLOCKER.
6. **`legal/regulated-claim` blocked a disclaimer.** "Neither is a guarantee
   about parts of a structure nobody can see", in a terms page.
7. **`seo/structured-data` reported "no JSON-LD structured data anywhere on the
   site"** on a page carrying a valid graph, because it recognised only the
   literal strings `LocalBusiness` and `Organization` — not the seventy subtypes
   Google's own documentation tells a trade business to use.
8. **`facts/unsourced-hours` and `unsourced-number` required the fact to sit in
   ONE ledger cell.** The template's `| Fact | Value |` header invites splitting
   it, and a correctly sourced fact then became a BLOCKER with nothing to explain
   why.

### What run 2 found

One further defect, of a class run 1 had already shown: **`au`'s privacy
`mustMention` was a vocabulary test where four other profiles were not.** The
same honest page passed in four jurisdictions and failed in Australia, for no
reason in Australian law. A probe now runs one deliberately plain-English page
against every profile, so no profile can quietly become a test of phrasing.

### Rounds 3 to 5 — attacking what the fixes added

The fixes were then attacked over three further passes, because new code is the
least-reviewed code in the repo. Three more defects, all in mechanisms written
the same day:

- the reserved-number check could not read a `tel:` href, so it reported the
  reserved number as live;
- the demo regex matched the bare words `personal`, `portfolio` and `sample`, so
  five ordinary real-business entity cells were classified as demos;
- the ledger recombination could invent a source: `| Projects in 2024 | 47 |`
  indexed both "2024 projects" and "47 projects".

That pass also asked what the demo regime *costs*. It cost nothing: declaring it
switched off the trader-disclosure gates and licensed the reserved phone range,
and nothing required the disclosure that justifies the exemption. Question 0's
own text already said a fictional build "declares [what is invented] on the page
as fictional". `legal/demo-undeclared` now checks it.

Which is how the last one turned up. **The repo's own reference fixture,
`examples/clean-control/`, published `01271 860 442` under a written claim that
it used an Ofcom drama range.** That is a Barnstaple number; Ofcom's drama ranges
are `01632 960xxx` and, per listed area code, `496 0xxx`. It was in the README's
screenshot, in the primary call-to-action, on the repo whose whole argument is
that a plausible invented fact is the one nobody checks. Fixed, re-shot, and the
caption now says the business is invented, which it did not.

### What these runs prove

- A stranger can clone this, follow the documented path, and reach a shipping
  site in a jurisdiction the repo did not originally target. That was not true
  on 2026-08-18: the first run stopped at 33 blockers, four of them for doing
  exactly what the repo instructed.
- The gates catch real problems. Both builds failed first and passed after work.
- The non-UK path had never been walked, and it was broken in four places.

### What they do not prove

- **These are demos.** Question 0 was answered (c) for both. The facts are
  invented and declared as invented in the ledger, in the page footer and on the
  page itself. Nobody has yet built a site for a real paying client with this.
- **No design stop was held with a human.** Stage 04's rendered-samples stop was
  written up, not run — there was no client in the room to choose. The design
  half of this pipeline still has no ledger the way the facts half does, and that
  is unchanged.
- **Neither site was deployed.** Stage 07 produced a handoff, not a launch.
- **They say nothing about whether the law is right.** They exercise the
  jurisdiction *plumbing*. `checks/citations.mjs` is the mechanism aimed at the
  law itself, and it does not settle correctness either — see its header.

---

## 2026-08-19 (later) - the sector axis and the pattern library: NOT a run

Both shipped the same day and **neither has been through a build.** That sentence is the whole
point of this section, and it is here rather than in a footnote because a folder of nine sector
files with primary-source citations looks exactly like something that has been used.

| | State |
|---|---|
| Sector duties fired on a real client build | **never** |
| Sector duties fired on a fixture | yes — four negative controls in `examples/sector-control/`, one per failure shape |
| Sector citations re-read against their live sources | yes — `node checks/citations.mjs --online`, 18 quotes present, 0 drifted |
| Question 57b (the trade) asked of a person | **never** |
| Pattern library used in a build | **never** |
| Pattern library measured against the gate it teaches | yes — zero design, a11y and responsive findings, and mutation-tested |

### What running the new machinery over this repo ITSELF found

Both are recorded because they are the honest yield of dogfooding, and because both are the same
defect shape — a short pattern matching more than it means:

- **`\bvets?\b` was a STRONG detection term**, and `examples/clean-control` is a **farrier's**
  site that says "speak to your vet", the way every equine trade does. The fixture the whole
  selftest depends on was handed an RCVS registration blocker. Moved to weak; farriery added as a
  veto.
- **`\bbuilders?\b` matched inside "website-builder"** — a hyphen is a word boundary — so this
  repo's own pattern library was classified as a construction firm.

### What the F3 critique on the same day found in the same code

Eight defects, three of them S1, every one reproduced before it was fixed. The largest: **eight of
nine sector coverage maps answered three to five different questions with the same URL** — the
exact claim-to-source failure the coverage mechanism exists to catch on the jurisdiction side,
reproduced on the new axis by the person building it. `citations/coverage-repeated` now catches it,
and the 16 questions that genuinely had no instrument behind them say so in writing instead of
pointing at one that does not carry them.

The other two S1s: `sector/number-unsourced` was a substring test that let an unconfirmed
registration number through if its digits appeared inside any longer sourced number, and the report
printed a flatly false sentence on a site naming two trades. Full ledger in the private critique
artifact; the fixes are in the git history.

---

## Prior artifacts, and what they are

| Artifact | What it is | What it is NOT |
|---|---|---|
| `examples/clean-control/` | A fixture, hand-built to demonstrate the design bar and the sourcing discipline. Passes the gate; CI gates on it every push. | Not a pipeline run. It was not produced by the eight stages, and its own NOTES.md says so. |
| `examples/dishonest-control/` | A fixture: professional-looking, every business fact invented. Exists so the selftest can prove the gate catches the plausible failure, not just the obvious one. | Not a site anybody would ship. |
| `examples/negative-control/`, `bare-control/`, `assets-control/`, `managed-control/` | Fixtures for specific gate families. | Not builds. |
