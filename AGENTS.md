# Website-Builder — Agent Contract

You are the agent for the **Website-Builder** workspace. You turn a plain-language
description of a website into a finished, **distinctively designed** static site by
working through six stages — one at a time, in order, with human checkpoints.

This one file is the contract for **every** agent harness. Codex, Cursor, and
anything else that reads `AGENTS.md` natively starts here. Claude Code arrives via
`CLAUDE.md`, Gemini CLI via `GEMINI.md`, Grok CLI via `GROK.md` — thin pointers
back into this file. Same pipeline, same rules, whoever is running.

This workspace produces websites that look **made, not generated**. Every site it
ships must clear the anti-AI-slop bar in `shared/design/`: no default Inter/Roboto,
no purple-gradient-on-white, no templated hero → 3-features → CTA rhythm.
World-class human studio quality is the standard.

## The rhythm

```
01_brief ──► 02_sitemap ──► 03_content ──► 04_design ──► 05_build ──► 06_qa
◆checkpoint   →auto          →auto          ◆checkpoint   →auto       ◆checkpoint
purpose       structure      copy           direction     code        ship
```

- **◆ checkpoint — 01 brief, 04 design, 06 QA:** STOP and discuss the work with the
  human. A checkpoint is a conversation, not a yes/no — surface the choices (for
  design: direction, palette, fonts, with reasoning and the alternatives you
  weighed), take their pushback, iterate, then lock the output and move on.
- **→ auto — 02 sitemap, 03 content, 05 build:** do the stage, sanity-check your own
  result, post a one-line note, continue. Pause and raise it if something looks
  wrong (a sitemap that misreads the brief, copy that invents a fact).

Two guarantees that never break: a build always **begins** by agreeing the brief
(checkpoint 01) and always **ends** with the human approving the built site
(checkpoint 06). The human can override the rhythm any time: "show me the sitemap"
gates an auto stage; "run to QA" collapses the middle (checkpoint 06 still holds).

## Run modes — pick by capability, not by brand

Different harnesses have different powers. Probe your own **once, at the start of a
build**, and note the answers in `SESSION.md`. Nothing in this workspace assumes a
brand — only a capability.

| Ask yourself | If yes | If no |
|---|---|---|
| **Can I spawn sub-agents?** (a task/agent tool that gives a fresh agent file access) | **Conductor mode** — stay lean, spawn one sub-agent per stage per [`shared/conductor.md`](shared/conductor.md), hold the checkpoints yourself. Preferred when available: each stage's heavy reading stays out of your context, and stages run on cost-matched model tiers ([`_config/model-routing.md`](_config/model-routing.md)). | **Solo mode** — run the stages yourself, one at a time, reading ONLY the current stage's `CONTEXT.md`. Between stages a fresh session is fine and often better: `SESSION.md` carries the state. |
| **Can I see a rendered page?** (a browser or screenshot tool — Claude-in-Chrome, a Playwright MCP, anything that can screenshot a local site) | Stage 06's visual review runs through it. | The human is the renderer: serve the site and direct their eyes precisely ([`shared/design/visual-review.md`](shared/design/visual-review.md) §1). |
| **Can I search + fetch the live web?** | Stage 04 runs its live-reference research. | Design from the `design-directions.md` menu alone, and say so in the spec. |
| **Do I have an image-generation tool?** | Stage 05a may generate assets under [`shared/design/imagery.md`](shared/design/imagery.md). | Real client assets + CSS/SVG only; each manifest asset's named fallback applies. |

Solo mode is not the lesser mode — it is the same pipeline with the context
discipline enforced by you instead of by process boundaries. **Never claim a
capability you did not exercise:** the QA report names which review path actually
ran, and a visual check that didn't happen is recorded as not done, never assumed.

## The one rule that makes this work

**Read only the files the current stage's `CONTEXT.md` lists, do only that stage's
job, write only to that stage's `output/`.** Never pre-read the whole repo, other
stages' references, or `examples/`. This is what keeps context small and output
sharp — the folder structure is the orchestration; trust it.

Work **one stage per task**. Between stages (especially after a checkpoint), a fresh
session is fine and often better: `SESSION.md` carries the state, and each stage's
`CONTEXT.md` is self-contained.

## Where you are

```
website-builder/
├── AGENTS.md            ← this file: the contract every agent reads
├── CLAUDE.md · GEMINI.md · GROK.md  ← per-harness pointers into this file
├── SESSION.md           ← live build state — read FIRST when resuming
├── _intake/             ← drop the client's brief/assets here (stage 01 reads it)
├── _clients/            ← queued briefs, one folder per client (git-ignored)
├── setup/questionnaire.md  ← one-time owner setup
├── _config/             ← author/stack/deploy config + the model-tier matrix
├── shared/              ← conductor recipe, ICM conventions, design contract, copy method, legal templates
│   └── design/          ← anti-slop rules, pre-ship gates, visual review, slop-gate script
├── sites/               ← finished sites + registry + variety ledger
├── examples/            ← one fictional sample site (the design bar, not a pipeline log)
└── stages/01_brief … 06_qa/   ← each: CONTEXT.md (contract) · references/ · output/
```

## Routing — where to go

| The human wants to… | Go to |
|---|---|
| Resume an in-progress build | `SESSION.md`, then the stage it marks **NEXT** |
| Start a brand-new website | `stages/01_brief/CONTEXT.md` |
| Hand over a client brief / assets first | drop in `_intake/` (see `_intake/README.md`), then stage 01 |
| Configure the workspace (first time) | `setup/questionnaire.md` — needed only while the owner-name row in `_config/website-builder-config.md` still reads `<<OWNER_NAME>>` |
| Revise structure / copy / look of the current build | re-enter at stage 02 / 03 / 04 |
| Rebuild from approved inputs | `stages/05_build/CONTEXT.md` |
| QA and ship | `stages/06_qa/CONTEXT.md` |
| See how conductor mode spawns stages | `shared/conductor.md` |
| See which model tier runs each stage | `_config/model-routing.md` |
| Understand the file/layer conventions (Layers 0–4) | `shared/icm-conventions.md` |

Stages are resumable: you can re-enter at any stage as long as the earlier stages'
outputs exist. Before stage 01 of a new build, read
`shared/design/anti-slop-rules.md` once — it binds every stage — and check
`_config/website-builder-config.md`: an owner-name row still reading
`<<OWNER_NAME>>` means setup has never run; offer `setup/questionnaire.md`
(two minutes) before starting.

## Session state — SESSION.md

Update `SESSION.md` (workspace root) at every gate: build starts → create it with
the site slug, tier, run mode, and capability answers; a stage completes → tick it,
record the checkpoint decision in one line, mark the next stage **NEXT**; build
promotes → mark COMPLETE. Overwrite in place, keep it under ~40 lines. A fresh
session — same harness or a different one — reads it first and resumes exactly
where the last one stopped. That is what makes the workspace shareable across
agents mid-build: the state lives in files, never in one agent's memory.

## Hard rules (every stage)

- **Invent nothing.** All facts about the business — names, prices, testimonials,
  credentials, addresses — come from the brief or the client's materials. A missing
  fact becomes a labelled `[NEEDS: …]` marker, never a guess.
- **The design spec is law at build time.** Stage 05 improvises no colour, font, or
  layout; every value traces to a token stage 04 locked.
- **Visual QA is honest about what you can see.** Stage 06's visual review runs
  through a browser/screenshot tool if your harness has one, otherwise through the
  **human's eyes** (serve the site, tell them what to look at, ask targeted
  questions). Never claim a visual check you could not perform — the QA report
  records which path ran.
- **Promotion is gated.** A site reaches `sites/<name>/` only after stage 06 runs
  `shared/design/pre-ship-gates.md` — with the slop-gate script when Node is
  available, or the checklist's manual pass recorded as such without it — and
  the human approves. Push to a remote only when the owner explicitly asks.

## Models

- **Conductor mode:** spawn each stage on the tier
  [`_config/model-routing.md`](_config/model-routing.md) names — cheap for the
  mechanical stages, strongest for design. That file speaks in tiers
  (cheap / standard / strongest), with your ecosystem's names mapped in.
- **Solo mode / one model per session:** if your harness lets you choose a model
  per session, use the strongest reasoning model for stage 04 (design) and stage
  06 (QA) sessions — the judgement stages; anything current handles 02 (sitemap).
  One model throughout is also fine — the contract holds regardless.
