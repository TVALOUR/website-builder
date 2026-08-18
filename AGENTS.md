# website-builder — the contract

**You are building a real website for a real person. Read this before you write anything.**

This one file is the agreement for every coding agent — Claude Code, Codex, Cursor, Gemini
CLI, Grok CLI, Windsurf, Cline, or a person with a text editor. `CLAUDE.md`, `GEMINI.md` and
`GROK.md` point here rather than repeating it, because a contract that exists in two files
becomes two different contracts within a month.

---

## The one sentence

> **Every AI builds the same website because none of them ask what is in the person's head.**

Two failures, one cause. Handed "build me a website", a model invents the facts (a site about
businesses *like* this one, with prices and testimonials nobody said) and defaults the design
(the layout, palette and type it gives everyone). Both happen because it started building
before it asked. The person had a picture in their head — a sketch, a site they half-remember
wanting to remake, the blue on their van — and nobody ever saw it.

So the work here is front-loaded, and it is not optional. Most of this repo's value is spent
before a line of HTML exists.

## The two commands

```
node start.mjs "<project name>"                              # opens a build
node checks/run.mjs builds/<slug>/site --facts builds/<slug>/facts.md   # decides if it ships
```

Everything between those two commands is the eight stages below.

---

## The six rules that are not negotiable

### 1. Ask before you build — always, without being told to

Any request to build, redesign or remake a website starts at **stage 01 discover**, never at
code. Stage 01 has two halves and both are mandatory:

- **The vision** — what they see in their head. Ask for artifacts before questions: sketches
  (a photo of paper is fine), screenshots, reference sites they love or want to remake, the
  one they hate, brand assets, existing material. Colours, fonts, the feeling. A dropped
  sketch answers twenty questions; collect it first (`stages/01_discover/questions.md`,
  part V).
- **The facts** — what is true. Prices, hours, places, credentials, ownership
  (`questions.md`, parts A–G).

When the human says "just build it, don't ask me questions", the correct move is neither to
comply nor to refuse: ask the **smallest set of questions that cannot be answered without
inventing something about them or defaulting the design**, say that is what you are doing,
and build exactly what the answers support. The questions are not process. They are the
difference between their website and a website.

### 2. Never invent a fact about a real business

Not a price, not an opening time, not a testimonial, not a review count, not a year
established. A missing fact is asked for or left out — there is no third option where it
stays because it sounds right. `facts.md` holds every claim with its source, and the gate
fails the build on any claim without a row. This is enforced, not encouraged.

A **personal, portfolio, demo or fictional project** (stage 01 asks which, first) relaxes
what exists, not what is honest: invented content is declared on the page as fictional, uses
reserved domains and drama phone ranges, and never wears real-business dress it did not earn.
`examples/clean-control/NOTES.md` shows the discipline.

### 3. The design comes from their head, not your defaults

References they gave you are dissected into cards before any direction is chosen
(`shared/references.md`). The direction is picked from a menu, on purpose, against what was
built before (`shared/directions.md`). Tokens are locked before code. And the design stop
presents **rendered samples, not adjectives** — the human picks between things they can see.
If they gave you nothing visual, that is a finding to raise, not a licence to default.

### 4. The gate decides, not your opinion of your work

Exit 0 ships. Exit 1 does not. You do not argue with a blocker and you do not pass `--skip`
to make one go away. A finding you believe is wrong is a bug in the checker: fix the checker,
add a fixture that proves it, and say so. Everything the gate cannot see — composition,
rendered layout, whether it looks *designed* — is in stage 06 as an eyes-on step, honestly
labelled, and it is not optional either.

### 5. Front end only

Static HTML, CSS and JavaScript. No back end, no database, no accounts, no secrets in the
client bundle. A contact form points at a hosted form service or a `tel:` link, and stage 01
asks which. This is a scope boundary, not a limitation to apologise for.

### 6. Write like a person wrote it

The copy gives a generated site away faster than the design does. No em dashes in body copy,
none of the vocabulary in `checks/rules/copy.mjs`, no "not just X, it's Y", no paragraph that
could sit unchanged on a competitor's site. Read `shared/writing.md` before stage 03.

---

## The eight stages

Each stage has a `CONTEXT.md` naming its Inputs, Process and Outputs. **Read one at a time.**
Loading all eight is how an agent starts answering stage 05's question with stage 02's
information.

| # | Stage | Gate | What it produces |
|---|-------|------|------------------|
| 00 | `setup` | once | `config.md` — who you are, defaults, jurisdiction |
| 01 | `discover` | ◆ **stop** | `brief.md` + `facts.md` — the vision and the sourced facts |
| 02 | `architect` | → auto | `sitemap.md` — pages, nav, what each page must carry |
| 03 | `write` | → auto | `content.md` — real copy, every claim tied to a fact |
| 04 | `design` | ◆ **stop** | `design.md` + rendered direction samples the human picks from |
| 05 | `build` | → auto | `site/` — the actual files |
| 06 | `verify` | ◆ **stop** | `verify.md` — the gate output plus what only eyes can judge |
| 07 | `launch` | ◆ **stop** | `handoff.md` — redirects, DNS, ownership, the test enquiry |

◆ means **stop and talk to the human** — a conversation, not a summary-then-continue.
→ means do it, sanity-check it yourself, keep going, and pause if something looks wrong.

A build lives in `builds/<slug>/`, one folder per site. `builds/<slug>/STATE.md` is the
resume point: a new session — same harness or a different one — reads it before anything
else and continues from its `Next action` line. Update it at every gate.

## Run modes — pick by capability, not by brand

Probe what your harness can actually do, **once, at build start**, and note the answers in
`STATE.md`. Never claim a capability you did not exercise; a review that did not run is
recorded as not run.

| Ask yourself | If yes | If no |
|---|---|---|
| **Can I spawn sub-agents?** | **Conductor mode** — one sub-agent per stage per [`shared/conductor.md`](shared/conductor.md); you hold the checkpoints. | **Solo mode** — run the stages yourself, one at a time. Not the lesser mode: same pipeline, discipline enforced by you instead of by process boundaries. |
| **Can I see a rendered page?** (browser / screenshot tool) | Stage 06's eyes-on half and stage 04's rendered samples run through it. | The human is the renderer: serve the site, direct their eyes precisely (`shared/review.md`). |
| **Can I search and fetch the live web?** | Stage 01/04 dissect reference URLs directly (`shared/references.md`). | Ask the human for screenshots of their references instead. |
| **Do I have an image-generation tool?** | Stage 05 may generate assets under [`shared/imagery.md`](shared/imagery.md)'s honesty contract. | Real client assets + CSS/SVG/type only. A missing image beats a dishonest one. |

## Enforcement

On **Claude Code**, rules 1 and 4 are wired into hooks (`.claude/settings.json`): a build
mention triggers the stage-01 marching orders, site files cannot be written before the
build's `brief.md` and `design.md` exist, and a session cannot end while a changed site
fails the gate. On every other harness the same contract holds by structure instead: the
entry command creates the build folder, the gate fails closed, and `STATE.md` makes a
skipped stage visible. If you notice yourself routing around any of this, that is the
defect this repo exists to fix — stop and run stage 01.

## How to start

**Resuming?** If any `builds/*/STATE.md` exists, read it first and continue from its
`Next action`. Do not re-read earlier stages' contracts; their outputs are on disk.

**Fresh?**

1. If `config.md` does not exist, run `stages/00_setup/CONTEXT.md` once. It takes a minute.
2. `node start.mjs "<project name>"` — it creates `builds/<slug>/` and prints the orders.
3. Read `stages/01_discover/CONTEXT.md` and do only that stage. Stop at the gate. Then read
   stage 02's contract, and only then.

## What is in here

```
website-builder/
├── AGENTS.md          ← this file: the contract, for any agent
├── CLAUDE.md · GEMINI.md · GROK.md ← per-harness entries pointing here
├── start.mjs          ← opens a build: builds/<slug>/ + STATE.md + marching orders
├── stages/            ← one folder per stage, each with a CONTEXT.md
├── shared/            ← writing · design · directions · references · review · imagery · conductor · legal
├── checks/            ← the gate: run.mjs, ten rule families, selftest, zero dependencies
├── profiles/          ← jurisdiction lives in a file, not a hardcode (uk.mjs today)
├── templates/         ← legal pages, consent, _headers, robots, structured data, STATE.md
├── examples/          ← clean-control (passes) · dishonest-control · negative-control · bare-control (fail on purpose)
├── .claude/           ← the Claude Code hooks (gate.mjs) — see CLAUDE.md
└── builds/            ← your work, one folder per site, git-ignored
```

## Honesty about what this cannot do

- **The gate is static.** It reads files. It cannot see a rendered page, so it cannot judge
  whether the layout is good or the hero is balanced. Those live in stage 06 as an eyes-on
  step, labelled as one.
- **Automated accessibility checking finds roughly a third of real WCAG failures**, and this
  covers a subset of that third. A clean run means the cheap failures are gone, not that the
  site is accessible.
- **`facts.md` cannot be verified by a machine.** The gate proves every claim traces to a
  row. It cannot prove the row is true. That gap closes with a human reading the file back
  to the client before launch, which is stage 07.
- **Hooks exist only where the harness has them.** Elsewhere, an agent determined to skip
  the pipeline can. The structure makes skipping visible and the gate makes it fail; it
  cannot make it impossible.
- **None of this is legal advice.** `profiles/uk.mjs` encodes what a competent developer
  ships by default so a small business is not obviously exposed. It is UK and EU shaped;
  other jurisdictions are a profile file nobody has written yet, and stage 00 asks rather
  than assumes.
