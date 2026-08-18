# Conductor Mode — Running One Sub-Agent Per Stage (Layer 3)

This file is the **mechanism** for conductor mode — the run mode `AGENTS.md`
§ Run modes selects **when your harness can spawn sub-agents** (a task/agent tool
that gives a fresh agent file access — e.g. Claude Code's Agent tool, or any
equivalent). No such tool → this file does not apply; run **solo mode** exactly as
`AGENTS.md` describes, and ignore everything below.

The **policy** (which model tier per stage) is
[`../_config/model-routing.md`](../_config/model-routing.md). Read that table
first; this file tells you how to act on it.

In conductor mode you — the session the human started — do not build the website
stage by stage yourself. You **spawn one sub-agent per stage** on the tier the
routing table picks, hold the checkpoint conversations yourself, and stay lean.
The checkpoint/auto rhythm itself is defined once, in `AGENTS.md` § The rhythm —
it is identical in both run modes; conductor mode changes only *who executes a
stage*, never *where the human is consulted*.

---

## Flat hierarchy

```
conductor (you)
 ├─ 01 sub-agent      (does stage 01, returns; spawns nothing)
 ├─ 02 sub-agent      (does stage 02, returns; spawns nothing)
 ├─ …
 └─ 06 qa sub-agent   (does stage 06, returns; spawns nothing)
```

Only the conductor spawns. Stage sub-agents are leaves — they read, do their one
job, write their one output file, return a short summary, and exit. This keeps the
review gates legible and stops runaway agent trees.

---

## The spawn recipe

For each stage, make **one** sub-agent call:

- **Agent type:** your harness's general-purpose worker (it needs file
  read/write/edit, search, and shell). In Claude Code that is the Agent tool with
  `subagent_type: "general-purpose"`.
- **Model:** the tier from the routing matrix, translated to your ecosystem's
  model names (`_config/model-routing.md` § The three tiers). **This is the whole
  point** — it sets the model for that stage's work independent of the
  conductor's own model. If your spawn tool cannot set a model, spawn anyway:
  the context isolation alone is worth it.
- **Description/label:** 3–5 words, e.g. `Run stage 04 design`.
- **Prompt:** the cold-start briefing below.

### Sub-agent prompt template

A sub-agent has **no memory of this conversation**. The prompt must stand alone
and point precisely at the stage contract — never paste the stage's work into the
prompt, just point at the files (the ICM is designed so each stage's `CONTEXT.md`
is self-contained).

```
You are the stage <NN> sub-agent for the Website-Builder workspace at:
  <absolute path to this workspace's root folder>

Do ONLY stage <NN>. Steps:
1. Read AGENTS.md (Layer 0) and shared/design/anti-slop-rules.md — they bind every stage.
2. Read stages/<NN>_<name>/CONTEXT.md — that is your full contract (Inputs / Process / Outputs).
3. Read ONLY the inputs that CONTEXT.md lists (the prior stages' output/ files are on disk).
4. Do the stage's one job. Write ONLY your stage's output file(s) under stages/<NN>_<name>/output/.
5. Do NOT start any other stage. Do NOT spawn other agents. Do NOT promote/deploy.

When done, reply with a SHORT summary (≤ 200 words):
  - what you produced + the exact path(s) you wrote;
  - the key decisions a human reviewer must check at the gate;
  - anything unresolved or any <<PLACEHOLDER>> / [NEEDS: …] you could not fill.
```

Fill `<NN>_<name>` from the stage folder. For **stage 04** also name
`stages/04_design/references/design-directions.md`,
`stages/04_design/references/live-references.md`, `sites/variety-ledger.md`, and
`shared/design/moodboard.md` (+ the board at `_intake/references/moodboard.md` if
present) in the prompt — its `CONTEXT.md` already lists them, but naming them
avoids a cold agent missing them. For **stage 05** additionally name
`stages/05_build/references/build-prompt.md` as the binding build contract.

---

## The conductor's own loop

```
1. Stage 01 (brief) — CHECKPOINT. Spawn the brief sub-agent (standard tier);
   set/confirm the build TIER. Discuss what the site is with the human; re-spawn
   with their notes until they're happy; lock brief.md.
2. Auto-proceed 02 sitemap → 03 content. Spawn each on its tier, sanity-check the
   summary, post a one-line note, continue. PAUSE only if a summary looks wrong.
3. Stage 04 (design) — CHECKPOINT. Spawn the design sub-agent (strongest tier).
   It surfaces the direction + palette + font pairing (+ the alternatives it
   weighed). DISCUSS with the human as their design partner; for a different
   take, re-spawn 04 with their direction; for a small tweak, adjust the spec
   directly. Loop until they're happy; lock design-spec.md.
4. Auto-proceed 05 build. Spawn the build sub-agent (standard tier; strongest for
   a complex-tier build), naming build-prompt.md as its binding contract.
   Sanity-check the build report; PAUSE if it flagged a problem (e.g. a missing
   input or an unresolved placeholder).
5. Stage 06 (QA) — CHECKPOINT. Spawn the QA sub-agent (standard tier); run the
   anti-slop gates + visual review; present the verdict. The human approves
   before you promote to sites/. Report the final location and stop.
```

At a checkpoint you are the human's partner, not a form to sign: present options
and reasoning and take direction. The conductor stays lean — it reads `AGENTS.md`,
this file, and `model-routing.md`, then mostly holds short summaries; it should
**not** read every stage's full output (that work lives in the sub-agents).
Pulling up a specific produced file to discuss at a checkpoint is fine.

---

## Session state (SESSION.md)

The conductor writes `SESSION.md` (workspace root) at every gate, exactly as
`AGENTS.md` § Session state says — same duty in both run modes. Mid-build it
looks like:

```markdown
# Session State — Website-Builder

**Active build:** <site-slug>
**Tier:** simple | standard | complex
**Run mode:** conductor | solo   ·   **Capabilities:** <browser? web? images?>
**Updated:** <freeform note — e.g. "after stage 04 checkpoint">

## Stage progress
- [x] 01 brief — approved — <one-line key decision>
- [x] 02 sitemap — auto-proceeded — <one-line>
- [x] 03 content — auto-proceeded — <one-line>
- [ ] 04 design — **NEXT**
- [ ] 05 build
- [ ] 06 qa

## Checkpoint decisions
### 01 brief
<what the human approved: client, tier, deploy target — 3–5 lines>

## Next action
<one or two sentences telling a fresh session exactly what to do next>
```

Overwrite in place (a snapshot, not a log); keep it under ~40 lines so reading it
costs nothing. It is a Layer 4 working artifact — never move it into `_config/`
or `shared/`.

---

## Inline fallback (small builds)

For a **simple** one/two-page build, six cold-start spawns can cost more than
they save. The conductor may instead run the stages **inline** (do them itself,
i.e. drop to solo mode) on a single standard-tier model for the whole build — *but the
collaborative checkpoints (01 brief, 04 design, 06 QA) are still mandatory*. See
`model-routing.md` § When to skip the sub-agent. Standard and complex builds
should use the spawn pattern so the strongest model stays boxed into stage 04 and
the conductor's context stays clean.

---

## Why this is worth the cold starts

- **The strongest model is surgical.** On a standard build it runs once (stage
  04). Without the pattern, either the whole session pays top-tier rates or
  stage 04 is under-powered.
- **The conductor never rots.** Long pipelines degrade when one context holds
  every stage's raw output. Summaries-only keeps the conductor sharp and cheap
  through stage 06.
- **Checkpoints stay human.** The sub-agent returns a *summary built for
  review*, which is exactly what a checkpoint discussion needs — better than
  scrolling raw output in one giant session.

The tradeoff (cold re-reads of `CONTEXT.md` + prior outputs) is the price of all
three. The routing matrix is tuned so you only pay it where it nets out positive.
