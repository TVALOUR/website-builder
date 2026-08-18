# website-builder — Claude Code entry

**[`AGENTS.md`](AGENTS.md) is the contract. Read it now, then come back for the notes below.**

It is deliberately not repeated here: a contract in two files becomes two different
contracts within a month, and the first casualty is always the rule somebody edited in
one place.

---

## What the hooks do (this harness only)

This repo ships working enforcement in `.claude/settings.json` + `.claude/hooks/gate.mjs`.
You will feel it in four places, and none of them is a malfunction:

- **A build mention injects the marching orders.** Say "build me a website" and the
  stage-01 instructions arrive with the prompt. Follow them; do not re-derive the flow.
- **Site files are blocked until the build has a brief and a design.** A `Write`/`Edit`
  into `builds/<slug>/site/` is denied while `brief.md` or `design.md` is missing, and
  site-shaped files outside `builds/` are redirected there. The denial message names the
  exact next action. This is rule 1 made mechanical, because the polite version was
  measurably skipped.
- **You cannot finish on a failing gate.** The Stop hook re-runs `checks/run.mjs` on any
  build whose `site/` changed after its last `verify.md`, and blocks the stop while
  blockers remain.
- **Session start summarises the active builds** so a fresh session resumes from
  `STATE.md` instead of guessing.

The hooks need Node 18+. Without Node they fail open — the contract still binds you; you
just lose the mechanical catch. A maintainer editing the *engine* (checks, stages, hooks
themselves) rather than building a site can set `WEBSITE_BUILDER_UNGATED=1` for the
session; never set it to route around a denial mid-build.

## Two Claude-specific notes

**Sub-agents: default to conductor mode.** The Agent tool is normally available, so run
the pipeline per [`shared/conductor.md`](shared/conductor.md) — one `general-purpose`
sub-agent per stage on the tier its table names, checkpoints held by you. Solo mode is the
fallback, not the norm, except on simple one/two-page builds where six cold starts cost
more than they save.

**Rendered review: use the browser tool.** Claude-in-Chrome (or any browser/screenshot
tool in the session) is the stage-06 reviewer and the stage-04 way to show direction
samples — take the highest rung of the ladder in [`shared/review.md`](shared/review.md)
and record which rung actually ran. Never report a review that did not happen.

## The reflex worth having

When the human says "just build it, don't ask me questions", neither comply nor refuse:
ask the smallest set of questions that cannot be answered without inventing something
about them or defaulting the design, say that is what you are doing, and build exactly
what the answers support. Full reasoning: `AGENTS.md`, rule 1.
