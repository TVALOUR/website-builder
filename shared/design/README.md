# The Design Contract (Layer 3)

This folder is why the workspace ships sites that look **made, not generated**. It
binds **both** agents and applies across stages — not just stage 04.

## The files

- **`anti-slop-rules.md`** — the non-negotiables. The distilled, vendored rules
  every site must obey. Read at stages 04, 05, and 06.
- **`../../stages/04_design/references/design-directions.md`** — the *divergence menu*:
  15 distinct archetypes to choose between at stage 04. `anti-slop-rules.md` says what
  to avoid; this says what to spread *toward*, so builds don't all look alike.
- **`../../sites/variety-ledger.md`** — cross-build memory. Stage 04 reads it to
  diverge from prior builds; stage 06 appends to it on promote. Makes rule 10 real.
- **`pre-ship-gates.md`** — the stage-06 QA checklist. A site cannot be promoted to
  `sites/` until it clears these gates.
- **`visual-review.md`** — how to *verify* a rendered site at stage 06: the
  capability ladder (harness browser tool → Playwright MCP → human-directed
  review), the 320→1920px responsive sweep, and the accessibility pass;
  Playwright/axe/Lighthouse are opt-in.
- **`imagery.md`** — the generated-imagery honesty contract: allowed vs forbidden
  subjects, the anti-AI-slop image checklist, and the regenerate/fallback loop.
- **`resources.md`** — the vetted tools registry, the optional per-harness
  design-skills note, and the security bar for adding anything new.
- **`README.md`** — this file: how design flows through the pipeline.

The copy counterpart lives next door at **`../content/copywriting.md`** (the
real-business writing method for stage 03), and deploy preservation at
**`../../_config/deploy.md`**.

## How design flows through the pipeline

```
04_design                 05_build                    06_qa
pick direction      ──►   build to the spec    ──►    run the gates
+ define tokens           obey anti-slop-rules        promote or send back
```

1. **Stage 04 — direction.** Read the **variety ledger**, pick a divergent
   archetype from the **design-directions menu** (justified by the client and a real
   distance from the last builds), then lock a token system (colour, type, layout,
   one signature move). Output: `stages/04_design/output/design-spec.md` — opening
   with the direction + divergence justification. The spec must be concrete enough
   that the build makes no design decisions of its own. If the design needs
   generated imagery, also write `asset-manifest.md` per `imagery.md`.
2. **Stage 05 — build.** Build strictly to `design-spec.md`, obey
   `anti-slop-rules.md`, reference any accepted generated assets. The build never
   improvises tokens or substitutes fonts.
3. **Stage 06 — QA.** Run `pre-ship-gates.md` against the built site (including the
   generated-imagery gate). Any failure is fixed (back to stage 05) before
   promotion.

All of it binds every stage — the contract is these files themselves; nothing here
requires an install. If your harness has optional design skills (e.g. Claude
Code's `hallmark` / `frontend-design`), they add depth at stages 04/06 — the
floor is these files either way; never fake a skill's output.
