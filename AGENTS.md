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

## The commands

```
node start.mjs "<project name>"                              # opens a build
node assets.mjs <slug> scan                                  # indexes what the client handed over
node checks/brief.mjs builds/<slug>                          # decides if discovery actually happened
node checks/run.mjs builds/<slug>/site --facts builds/<slug>/facts.md   # decides if it ships
node checks/citations.mjs [--online]                         # checks how the LAW was sourced
node checks/run.mjs --sectors                                # the trades this repo has researched
```

Everything between the first and the last is the eight stages below.

---

## The nine rules that are not negotiable

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

**And this rule is checked, because the polite version was measurably skipped.** A build once
reached the point of offering the client a two-item legal-jurisdiction menu having never asked for
a brief, an image, an asset or a feature. The spec was fine; nothing read it. So:

```
node checks/brief.mjs builds/<slug>
```

reads `brief.md` and reports which required sections are missing, which are headings with
placeholders under them, and which BLOCKING questions have no answer anywhere. Every line it prints
is a question to go and ask — never a box to fill in yourself. On Claude Code the pre-write hook
runs it, so a thin brief denies site files.

### 2. Never invent a fact about a real business

Not a price, not an opening time, not a testimonial, not a review count, not a year
established. A missing fact is asked for or left out — there is no third option where it
stays because it sounds right. This is enforced, not encouraged: `facts.md` holds every
claim with its source; the gate reads the built site — page text, `tel:`/`mailto:` hrefs,
meta tags, JSON-LD and the JavaScript — extracts every price, phone number, email,
postcode, opening-hours line, quantity claim and quoted testimonial, and fails the build
on any that has no sourced row. The claim classes are enumerated, not magic: anything
subtler is what stage 07's read-back of `facts.md` to the client exists to catch.

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

### 7. Every asset traces to a row, and nothing is generated unless they asked

`facts.md` made every CLAIM traceable. `builds/<slug>/assets/MANIFEST.md` does the same for every
FILE, because an image on a page is a claim too — *this is our shop, this is our work, this is the
team* — and an image nobody can trace is exactly as dishonest as a price nobody can trace.

`node assets.mjs <slug> scan` creates the folders (`logo` · `photos` · `brand` · `fonts` · `docs` ·
`reference`), indexes whatever landed in `_intake/`, and writes the manifest with a row per file:
where it came from, whether it is the client's to publish, whether it was generated, where it is
used, and its alt text. The gate refuses to publish an image with no row, no Source or no Rights
answer, and it flags material the client handed over that the site quietly ignored.

**Two defaults are OFF, per build, enforced rather than remembered:**

| | Default | Turn it on by | Enforced by |
|---|---|---|---|
| **Motion** | `none` | `- **Motion:** subtle` in `brief.md`, after the client asks | `design/motion-policy` |
| **Imagery** | `client-assets-only` | `- **Imagery:** generated-allowed` in `brief.md`, after the client asks | `assets/generated-not-permitted` |

Under `none`, colour, shadow and opacity still respond to hover and focus — that is feedback, and
removing it makes a page worse. What stops is anything that moves. "Everything fades in as you
scroll" is the most recognisable tell of a generated site and no client has ever asked for it by
name.

Under `client-assets-only`, a section with no photograph is carried by type, space and structure,
or it leaves `[NEEDS: real photo of ...]` and the owner is told. Even under `generated-allowed`,
generated imagery may never depict people, premises, products, logos or awards — `shared/imagery.md`
§3, and the gate checks the manifest's own "what it shows" column against that list.

### 8. The jurisdiction is a file, and a missing one is a blocker

The legal family is the only genuinely country-shaped part of this repo. Running one country's
rules on another does not produce slightly-wrong output; it produces a Kansas plumber citing the
Companies Act 2006 and publishing a company number that cannot exist.

So stage 00 and question 57 ask for the **country**, and:

- a profile exists (`uk` · `us` · `eu` · `ca` · `au`) → use it;
- none exists → **research one** — `profiles/README.md` has the protocol and the brief, it is a
  single pass, and it writes both the profile and its working notes with every source URL and
  access date;
- the session cannot search the live web → use `intl-baseline` (an honesty floor that names no
  statute), say so to the client, and recommend a local adviser reads the four legal pages. Never
  write a legal profile from memory, and never substitute the nearest country.

There is no default country. Every shipped profile is `provenance: 'researched'` — real sources,
no qualified reviewer — and the gate repeats that label on every run.

### 9. The trade is a file too, and "unregulated" is an answer somebody gives

The jurisdiction knows which country. It does not know what the business **is**, and for some
trades the law names the website:

- a letting agent **must publish its fees on its website** — Consumer Rights Act 2015 s.83(3);
- a law firm **must publish prices, a complaints route and its SRA number on its website** — SRA
  Transparency Rules 1.1, 2.1, 4.1;
- a food business that can take an order **must give allergen information before the purchase is
  concluded** — Regulation (EU) No 1169/2011 Art.14(1)(a);
- an aesthetics clinic **may not name or price Botox at all**, because it is a prescription only
  medicine and advertising one to the public is prohibited outright — Human Medicines Regulations
  2012 reg.284(1). No disclaimer fixes this. Removing the medicine's name does.

None of that is discoverable from the country, and a site that breaches it passes every other gate
in this repo.

So question 57b asks what the trade is, and the answer goes in `facts.md` as a row:

```
| Sector | legal-services | confirmed by Anna, 2026-08-19 |
```

`node checks/run.mjs --sectors` lists what has been researched. **`none` is a real answer and most
trades' answer** — most trades are not regulated, and saying so is correct. But it is an answer, on
the record, that a human gave: an unregulated trade and an unasked question are different things,
and `sector/undeclared` exists to keep them different.

If the trade is regulated and there is no file, write one — `sectors/README.md` has the protocol
and the brief. **Never write a sector file from memory, and never adapt another country's rule to
fill a gap.** Every file is `researched`, `verifiedBy: null`, and the gate repeats that label.

## The eight stages

Each stage has a `CONTEXT.md` naming its Inputs, Process and Outputs. **Read one at a time.**
Loading all eight is how an agent starts answering stage 05's question with stage 02's
information.

| # | Stage | Gate | What it produces |
|---|-------|------|------------------|
| 00 | `setup` | once | `config.md` — who you are, the country, motion and imagery defaults |
| 01 | `discover` | ◆ **stop** | `brief.md` + `facts.md` + `assets/MANIFEST.md` — the vision, the sourced facts, and every file with its rights |
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
| **Do I have an image-generation tool?** | It stays UNUSED unless `brief.md` says `- **Imagery:** generated-allowed`. Having the capability is not permission; the client asking for it is. Then [`shared/imagery.md`](shared/imagery.md)'s honesty contract binds. | Real client assets + CSS/SVG/type only. A missing image beats a dishonest one. |
| **Can I search and fetch the live web?** (for a jurisdiction with no profile) | Research it per [`profiles/README.md`](profiles/README.md) — one pass, primary sources, contradiction angle, every citation carrying the URL you fetched. | `intl-baseline`, said out loud to the client, plus a recommendation that a local adviser reads the legal pages. Never a profile written from memory. |

## Enforcement

On **Claude Code**, rules 1 and 4 are wired into hooks (`.claude/settings.json`): a build
mention triggers the stage-01 marching orders; site files cannot be written until the
build's `brief.md`, `facts.md` and `design.md` exist and hold substance; a shell-side
write that dodges the editor tools is called out on the next turn; and a session cannot
end while a changed site fails the gate. The hooks convert accidental skipping into
denials and deliberate skipping into visible evidence — determined fraud is out of any
hook's scope. On every other harness the same contract holds by structure instead: the
rules files (`.cursorrules`, `.windsurfrules`, `.clinerules`) point here, the entry
command creates the build folder, the gate fails closed, and `STATE.md` makes a skipped
stage visible. If you notice yourself routing around any of this, that is the defect this
repo exists to fix — stop and run stage 01.

## How to start

**Resuming?** If any `builds/*/STATE.md` exists, read it first and continue from its
`Next action`. Do not re-read earlier stages' contracts; their outputs are on disk.

**Fresh?**

1. If `config.md` does not exist, run `stages/00_setup/CONTEXT.md` once. It takes a minute.
2. `node start.mjs "<project name>"` — it creates `builds/<slug>/`, the asset folders, a brief
   skeleton, and prints the orders.
3. `node assets.mjs <slug> scan`, then give the client the absolute `_intake/` path it printed.
   Artifacts before questions: one dropped sketch answers twenty of them.
4. Read `stages/01_discover/CONTEXT.md` and do only that stage. Run
   `node checks/brief.mjs builds/<slug>` before you present anything. Stop at the gate. Then read
   stage 02's contract, and only then.

## What is in here

```
website-builder/
├── AGENTS.md          ← this file: the contract, for any agent
├── CLAUDE.md · GEMINI.md · GROK.md ← per-harness entries pointing here
├── start.mjs          ← opens a build: builds/<slug>/ + assets folders + brief skeleton + orders
├── assets.mjs         ← the asset desk: indexes what the client sent, writes the manifest
├── stages/            ← one folder per stage, each with a CONTEXT.md
├── patterns/          ← 22 section archetypes to build a page OUT OF — open preview/index.html
├── shared/            ← writing · design · directions · references · review · imagery · conductor · legal
├── checks/            ← the gate: run.mjs, thirteen rule families, brief.mjs, case suites, zero deps
├── sectors/           ← one file per TRADE, keyed by country + _base.mjs + its own research protocol
├── profiles/          ← one file per COUNTRY + _base.mjs + the research protocol in README.md
├── templates/         ← legal pages, consent, _headers, robots, structured data, STATE.md
├── examples/          ← clean-control (passes) · dishonest · negative · bare · assets · managed controls (fail on purpose)
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
- **The sector layer is nine trades, and the world has thousands.** A build in a trade with no
  file gets no trade duties and is told so; it is not told the trade is unregulated. Those are
  different sentences and the report uses the right one.
- **Hooks exist only where the harness has them.** Elsewhere, an agent determined to skip
  the pipeline can. The structure makes skipping visible and the gate makes it fail; it
  cannot make it impossible.
- **None of this is legal advice.** A profile encodes what a competent developer ships by default
  so a small business is not obviously exposed. Every one that ships here is
  `provenance: 'researched'` — assembled from primary sources with dated URLs, and read by nobody
  qualified. `verifiedBy` is `null` and stays `null` until a real name goes in it, and the gate
  repeats that on every run. A country with no profile gets one researched or gets
  `intl-baseline`; it never gets the nearest neighbour's law.
- **The asset manifest proves provenance, not truth.** It proves somebody recorded where a photo
  came from and what the client said about publishing it. It cannot prove the client was right
  about who owns the copyright, and on paid photography they frequently are not. That is a
  question for stage 07's read-back, and it is worth asking twice.
