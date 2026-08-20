# Changelog

What changed, and what it means for a folder you already cloned.

This repo is not a library you pin a version of — it is a **contract an agent reads at the
start of every build**. A rule edited here changes what your agent does on your next site,
without your code changing at all, and without anything on screen saying so. That is the
reason this file exists: `git log` records what the author did; this records what happens
to *you* when you pull.

Every release answers three questions in this order:

- **What may newly fail your build.** New gates are the whole point of the repo and they
  are also the thing that turns a site that passed last week into one that does not. That
  section is first because it is the only one anyone urgently needs.
- **What is new.** Capability you did not have before.
- **What was wrong.** Fixes, including the ones this repo found in its own code — kept in
  plain sight rather than folded into "various improvements", because a checker that hides
  its own defects is asking for a trust it has not earned.

## Versioning

`0.MINOR.PATCH`, tagged in git. Still `0.` because the contract is young enough that a
stage's shape can still change.

| Bump | Means | What you should do |
|---|---|---|
| **MINOR** | a rule changed, a gate was added, a stage contract moved, a command's behaviour changed | re-read `AGENTS.md`, and re-run `checks/run.mjs` on any live site before your next deploy |
| **PATCH** | a defect fixed, a fixture corrected, wording that misled | pull and carry on |

Dates are the day the work landed on `main`, ISO, and there is no release without one.

**Maintainers:** an engine change adds a line to `## Unreleased` in the same commit. Not a
convention — `checks/changelog.mjs` runs in the selftest and in CI, and this file's shape
is checked the way everything else here is.

---

## Unreleased

Nothing yet.

---

## 0.2.0 — 2026-08-19

The week the repo grew two axes it did not have — what the **law** asks of a particular
trade, and what a page can **positively** look like — plus a front door for the material
the whole pipeline is built around.

### What may newly fail your build

- **`legal/sector-*`** — a build whose trade has a file in `sectors/` now carries that
  trade's duties. Nine trades ship: aesthetics clinic, construction and trades, financial
  services, food and hospitality, gas and heating, health clinic, legal services, property
  agency, veterinary. A site advertising prescription-only cosmetic injectables, a letting
  agent with no fee schedule, or a solicitor with no price transparency will now be told.
  A trade with **no** file gets no duties and the report says *nobody researched this* —
  which is a different sentence from *no duties here*, and only one of them is ever true.
- **`design/hero-composite`** — the hero is judged on its *arrangement*, not on whether the
  expected elements are present. A hero holding all the right parts in the generated
  arrangement now fails where it used to pass.
- **`legal/demo-undeclared` and `copy/placeholder`** — a fixture or demo that publishes a
  real-looking phone number without saying it is a demo. Added because this repo's own
  reference build did exactly that: its ledger claimed a drama number and the button
  carried an ordinary Barnstaple one that may belong to somebody.

### New

- **The sector axis.** `sectors/`, one file per trade keyed by country, with its own
  research protocol and `_schema.md`. Wired through the contract, the stage-01 interview
  (the trade question is now asked without being prompted) and the docs. `node
  checks/run.mjs --sectors` lists what has been researched.
- **The pattern library.** `patterns/` — 23 section archetypes, one stylesheet, and a
  specimen sheet you can open and look at, each archetype carrying **the reason not to use
  it**. It is the positive half of a design contract that was, until now, almost entirely
  negative: a page can break none of the rules and still be the most average arrangement a
  model knows.
- **`drop/` — the repo's front door.** Logo, photos, brand, fonts, docs, references. It
  existed in the instructions before it existed on disk, so a fresh clone had nowhere to
  put a logo. Contents are git-ignored; the next asset scan moves them into the build.
- **The citation gate is checkable.** `node checks/citations.mjs` proves every legal claim
  in a profile carries a class derived from its publisher, that no profile leaves one of
  the seven coverage questions unanswered, and that nothing rests on a law-firm blog.
  `--online` re-reads every source and checks the quoted words are still there.
- **A live checks badge** on the README, so the gate's state is reported by CI rather than
  by the author.

### Fixed

- Four defects in the `drop/` code, found by attacking it rather than reading it — and a
  fifth in the blocker added to fix them, which could have pointed the error at the wrong
  build.
- Two gate defects that only appeared when the folder was run against real bare builds.
- `--help` on the commands: `start.mjs --help` used to slugify the flag and **open a build
  called "help"**, and `checks/run.mjs --help` exited 2 — the code this repo's own CI reads
  as a crash.
- `start.mjs` is covered by the selftest. No gate could reach it before, which made the one
  command every user types first the least tested code here.
- The per-build `git init` hardened, and an ignore line that had been removed put back.
- Eight defects in the week's own code, found by an F3 critique; two of eight cross-model
  findings held, and both were real.
- A name dropped from a shipped file, found by a leak sweep.

---

## 0.1.0 — 2026-08-18

First public cut: the universal edition — one folder that any coding agent can read.

### New

- **The contract.** `AGENTS.md`, with `CLAUDE.md` / `GEMINI.md` / `GROK.md` /
  `.cursorrules` / `.clinerules` / `.windsurfrules` pointing at it rather than repeating
  it, because a contract in two files becomes two different contracts within a month.
- **Eight stages**, one folder each, discovery first: the interview happens by default, not
  on request, and asks for artifacts — sketches, screenshots, the site you love, the one
  you hate — before it asks questions.
- **The checker.** `checks/run.mjs`, zero dependencies, 162 gates across 13 families, with
  `checks/selftest.mjs` proving both directions against fixtures: the clean control must
  pass, the negative control must fail *and* trip every listed gate. A gate that never
  fires on the negative control is reported UNPROVEN and treated as broken, because a probe
  that cannot fail is not a probe.
- **Facts have provenance.** Every claim on a shipped site traces to a sourced row in
  `facts.md`, or the build does not ship. The gate cannot prove a row is *true* — that gap
  closes with a human reading the file back to the client at stage 07, and the repo says so
  rather than implying otherwise.
- **Jurisdictions are files.** `profiles/` — `uk`, `us`, `eu`, `ca`, `au`, plus
  `intl-baseline`, an honesty floor that names no statute. There is no default country: a
  run with no profile raises `legal/jurisdiction` as a blocker rather than quietly applying
  somebody else's law. Every profile is `provenance: 'researched'` with `verifiedBy: null`,
  and the gate repeats that on every run.
- **Assets are traceable.** `assets.mjs` indexes what the client actually sent and checks
  the manifest; every row names where the file came from.
- **Discovery is a gate, not a hook.** `checks/brief.mjs` decides whether the interview
  actually happened — a brief with no features, no jurisdiction, an unanswered blocking
  question or a surviving template placeholder does not pass, however confident it reads.
- **Enforcement on Claude Code.** `.claude/hooks/gate.mjs`: site files are blocked until
  the build has a real brief, ledger, copy and design; shell writes that dodge the editor
  tools are called out on the next turn; and a session cannot stop on a failing gate.
- **Controls that fail on purpose.** `examples/` ships the clean control alongside
  dishonest, negative, bare, assets and sector controls, so the gate's ability to fail is
  demonstrable rather than asserted.

### Fixed before anyone else saw it

- An F2 pass removed invented history, reconciled the contracts and made the legal layer
  jurisdiction-neutral; two F3 hardening waves closed twelve confirmed adversarial
  findings; an example that failed the gate it shipped beside was retired.
- Law that was simply wrong, in more than one profile, corrected against primary sources.
