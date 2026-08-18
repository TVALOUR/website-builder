# Model Routing — Tiers Per Stage (Layer 3)

How to choose the model for each stage, based on build complexity. The goal is to
preserve output quality while saving tokens — use the strongest model only where
judgement is actually scarce, and a cheap model everywhere else.

This file is the **policy** (which tier for which stage). The **mechanism** (how
conductor mode spawns a sub-agent per stage) is
[`../shared/conductor.md`](../shared/conductor.md).

**Who this file is for:** primarily **conductor mode**, where each spawn can name
its own model. **Solo mode** uses only the last section (§ Solo mode / one model).
If your harness gives you no model choice at all, skip this file entirely — the
pipeline's quality comes from the contracts, and one model throughout is fine.

---

## The three tiers

The matrix speaks in tiers so it maps to any model family:

| Tier | Meaning | Claude Code example | Any other ecosystem |
|------|---------|---------------------|---------------------|
| **cheap** | fastest/smallest current model | `haiku` | your fastest small model |
| **standard** | the default workhorse | `sonnet` | your everyday default model |
| **strongest** | best reasoning available | `opus` (or above) | your top reasoning model |

Translate once for your harness and stay consistent. Model names move faster than
this document — use the names your install offers *today* rather than pinning a
dated ID here; a stale ID copied into a dozen files is the classic failure mode.

---

## The execution model in one picture

```
You start ONE session = the CONDUCTOR (strong model, and lean — it only routes).
The conductor spawns ONE sub-agent per stage, on the tier the table picks:

  conductor ──spawn──► 01 brief sub-agent    ──► returns summary ──► HUMAN GATE
            ──spawn──► 02 sitemap sub-agent  ──► returns summary
            ──spawn──► 03 content sub-agent  ──► returns summary
            ──spawn──► 04 design sub-agent   ──► returns summary ──► HUMAN GATE
            ──spawn──► 05 build sub-agent    ──► returns summary
            ──spawn──► 06 qa sub-agent       ──► returns summary ──► HUMAN GATE
```

Two things this buys you, both real:

1. **Model arbitrage** — the strongest model runs on exactly one stage (04
   design); the cheap tier takes the mechanical ones. You never pay top rates to
   write a sitemap.
2. **Context isolation** — each stage's heavy reading happens in the sub-agent
   and does **not** accumulate in the conductor. By stage 06 the conductor holds
   six short summaries, not five stages of raw output.

The cost is honest: a sub-agent starts **cold** and re-reads its stage
`CONTEXT.md` (+ the prior outputs it needs). For a one-page site that overhead
can exceed the saving — see § When to skip the sub-agent.

---

## Complexity tiers (of the build, set at stage 01)

| Build tier | Criteria | Typical example |
|------|----------|-----------------|
| **simple** | 1–2 pages, pure static HTML/CSS, ≤ moderate JS, no animations, no framework | single-page portfolio, landing page |
| **standard** | 3–5 pages, moderate JS interactions, responsive, no framework | small business site, 4-page brochure |
| **complex** | 5+ pages, rich animations/scroll effects, framework stack (Tailwind/Astro/Next), carousels, external APIs | e-commerce, content site, app-like |

Pick the build tier at stage 01 from the brief; the conductor uses it for every
spawn. If stage 05's real inputs turn out heavier than the stage-01 estimate
(more pages, a framework stack, rich animation), upgrade the build spawn's tier
to match what was actually produced.

---

## Per-stage × build-tier matrix (authoritative)

*(The conductor's own model is not a per-stage spawn decision, so it is not a row
here. Run the conductor on a **strong** model — it holds the gates and the
judgement calls between stages; the cheap tier is too lean for that.)*

| Stage | simple | standard | complex / premium | Why |
|-------|--------|----------|-------------------|-----|
| **01 brief** | cheap | standard | standard | Intake interview; nuance matters once the brief is non-trivial. |
| **02 sitemap** | cheap | cheap | standard | Mechanical structure. Standard only when the IA is genuinely complex. |
| **03 content** | standard | standard | standard | Copy quality is the product — never below the workhorse tier. |
| **04 design** | standard | **strongest** | **strongest** | Highest-judgement stage (direction, divergence, anti-slop). The one place the top model earns its cost. Simple sites don't need it. |
| **05 build** | standard | standard | strongest | Execution work — design is locked upstream. Use the strongest model for framework/animation-heavy builds. |
| **06 qa** | cheap | standard | standard | Code review + anti-slop gate. Upgrade to strongest for a premium independent audit. |

Reading of the matrix: on a **standard** build the only strongest-tier spend is
stage 04; everything else is standard or cheap. That is the intended posture —
the top model is surgical, not ambient.

The same mapping is annotated at the top of each stage's `CONTEXT.md` as a
`Run modes:` line, so the decision is co-located with the stage. If the two ever
disagree, **this table wins** — the `CONTEXT.md` line is a convenience copy.

---

## When to skip the sub-agent (run a stage inline)

Spawning is an optimisation, not a law. The conductor may run a stage **inline**
(do it itself, no spawn) when:

- The build is **simple** tier and one/two pages — the cold-start cost of six
  spawns outweighs the arbitrage. Run the whole build inline on one cheap-or-
  standard model instead.
- You're resuming a single stage by hand and don't want a fresh agent.

Either way the **checkpoint rhythm still applies** — inline or spawned, the
agent collaborates with the human at the checkpoints (01 brief, 04 design, 06
QA) and auto-proceeds the rest. See `AGENTS.md` § The rhythm.

---

## Manual override

The conductor can override the matrix for one spawn — e.g. a strongest-tier
stage-06 audit even on a standard build. Note the override in the gate summary so
the human knows why.

---

## Reasoning effort (if your harness has the knob)

Some harnesses expose a reasoning-effort/thinking setting separate from model
choice. If yours does: mechanical stages (02) → low; routine stages (01, 03, 06)
→ medium; judgement stages (04, and 05 on complex builds) → high. If spawned
sub-agents simply inherit the session's setting (common), use **model tier** as
the only lever and don't fight the harness.

---

## Solo mode / one model per session

No sub-agent tool, or one model for the whole session? Then per-stage routing
collapses to session-level advice, as `AGENTS.md` § Models says: if you can pick
a model per session, run stage 04 (design) and stage 06 (QA) sessions on your
strongest reasoning model and everything else on the default; if you can't
choose at all, proceed — the contracts, not the routing, carry the quality bar.
