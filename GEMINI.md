# website-builder — Gemini CLI entry

Read **`AGENTS.md`** now, before anything else — it is your full operating contract for
this workspace. Then, if any `builds/*/STATE.md` exists, read it and resume from its
`Next action` line.

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

## The floor

The floor, and it is not a summary — it is the actual contract:

1. **Ask before you build.** Any request to build, redesign or remake a website starts at
   stage 01, never at code. `node start.mjs "<name>"`, then
   `stages/01_discover/CONTEXT.md`. 72 questions in `stages/01_discover/questions.md`; ask
   every BLOCKING one. `node checks/brief.mjs builds/<slug>` says whether discovery actually
   happened — and `checks/run.mjs` now refuses to pass a build whose brief has not, so this
   is a gate on every harness, not a promise on one.
2. **Never invent a fact about a real business.** Every claim traces to a sourced row in
   `builds/<slug>/facts.md`.
3. **Never publish a file with no traceable origin.** `node assets.mjs <slug> scan` writes
   `builds/<slug>/assets/MANIFEST.md`; every image on a page needs a row with a Source and
   the client's own answer on whether it is theirs to publish.
4. **Two defaults are OFF** and stay off unless `brief.md` says otherwise:
   `- **Motion:** none` and `- **Imagery:** client-assets-only`. Having an image generator
   is not permission; the client asking for it is.
5. **The country is a file, and there is no default.** Question 57 asks which country the
   business trades under. `profiles/` must have it — or you research one
   (`profiles/README.md`, one pass) or use `intl-baseline` and say so in writing. Never run
   the nearest country's law.
6. **Front end only.** Static HTML, CSS and JS. No back end, no database, no accounts.
7. **The gate decides**, not your opinion of your work:
   `node checks/run.mjs builds/<slug>/site --facts builds/<slug>/facts.md`. Exit 0 ships,
   exit 1 does not, and you never pass `--skip` to make a finding go away. If you touched a
   file in `profiles/`, `node checks/citations.mjs` too: it fails on a citation whose class
   does not match its publisher, and on a profile that leaves one of the seven coverage
   questions unanswered.
8. **Stop and talk to the human** at stages 01, 04, 06 and 07.

Resuming? Read `builds/*/STATE.md` first and continue from its `Next action` line.
