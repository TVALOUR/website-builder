# website-builder — Grok CLI entry

Read **`AGENTS.md`** now, before anything else — it is your full operating contract for
this workspace. (If your harness did not auto-read this file, the human may need to say
"read AGENTS.md first".) Then, if any `builds/*/STATE.md` exists, read it and resume from
its `Next action` line.

Your harness runs none of this repo's hook enforcement, so the contract binds you by
discipline. The load-bearing rules, which are not summaries but the actual floor:

1. **Any build request starts at stage 01 discover, never at code.** Run
   `node start.mjs "<name>"`, then `stages/01_discover/CONTEXT.md`. Ask for what is in
   the person's head — sketches, screenshots, reference sites, brand colours and fonts —
   before any design exists, and ask for the facts before any claim exists.
2. **Never invent a fact about a real business.** Every claim traces to a sourced row in
   `builds/<slug>/facts.md`; the gate fails the build otherwise.
3. **Site files go only in `builds/<slug>/site/`, and only after `brief.md` and
   `design.md` exist.** Writing HTML anywhere else, or earlier, is the exact failure this
   repo exists to stop.
4. **The gate decides:** `node checks/run.mjs builds/<slug>/site --facts
   builds/<slug>/facts.md`. Exit 0 ships; exit 1 does not; `--skip` is never the answer.
5. **Stop at the stops.** Stages 01, 04, 06 and 07 end in a conversation with the human,
   not a summary.

Pick your run mode from `AGENTS.md` § Run modes by what you can actually do (sub-agents?
rendered pages? web fetch? image generation?) — never claim a capability you did not
exercise.
