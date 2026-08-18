# Stage 06 — QA & Ship

Verify the built site against the anti-slop gates and the brief, then promote it to
`sites/<name>/`.

**Run modes:** conductor — spawn on the **standard** tier (simple builds:
cheap; strongest for a premium independent audit) · solo — run inline. Tier table: [`../../_config/model-routing.md`](../../_config/model-routing.md).

**Rhythm:** ◆ collaborative checkpoint — the human approves the built site
(anti-slop gates + visual review) before it's promoted to `sites/`. The final say is
always theirs.

## Inputs

- Layer 4 (working): `../05_build/output/site/` — the built site.
- Layer 4 (working): `../05_build/output/build-report.md` — the build report + self-check.
- Layer 3 (reference): `../../shared/design/pre-ship-gates.md` — the QA checklist (includes the baseline legal-pages + consent-banner gate, §9).
- Layer 3 (reference): `../../shared/legal/legal-pages.md` — what the four baseline legal pages must contain.
- Layer 3 (reference): `../../shared/design/anti-slop-rules.md` — the non-negotiables.
- Layer 3 (reference): `../../sites/variety-ledger.md` — cross-build memory; check the site diverges, then append its row on promote.
- Layer 3 (reference): `../../shared/design/visual-review.md` — how to render, screenshot, sweep viewports, and check a11y.
- Layer 3 (reference): `../../_config/website-builder-config.md` — naming + git policy.
- Layer 3 (reference): `../../_config/deploy.md` — preserving GitHub + Cloudflare Pages setups.
- Optional (only if your harness has design skills installed — e.g. `hallmark` in Claude Code): audit depth on top of `pre-ship-gates.md`, never instead of it; record in the QA report if one ran, and never fake a skill's output.

## Process

1. **Render it — take the highest rung of the review ladder** (`visual-review.md`
   §1). Serve the site (static: `python -m http.server` from the site dir;
   framework: the dev command from the report), then drive your harness's
   **browser tool** if it has one; else a wired **Playwright MCP** (screenshots
   per viewport); else hand the human the URL with a specific checklist from
   `visual-review.md` — what to look at per section, which widths to drag
   through — and record their answers as the review evidence. Say in the QA
   report which rung ran.
2. **Run the gates.** Run the static checker for a machine-verified pass on the
   mechanical subset:
   ```
   node ../../shared/design/check-slop-gates.mjs ../05_build/output/site
   ```
   **Read two of its output lines, not one:** the `Scanned N CSS file(s) … under
   X` line and the FAIL/WARN counts — and confirm `X` is the exact site being
   checked. The path argument is mandatory (a bare run refuses to scan), but a
   stale or wrong path still scans happily and prints a clean-looking result
   for the wrong tree — the exit code cannot catch that; only the
   `Scanned … under` line can.
   Fix every FAIL before continuing — those are pattern-matched with confidence,
   not a judgment call. Triage each WARN (heuristic; some are false positives — see
   the known-limitations notes in `resources.md`'s static-checker section). Confirm the four baseline legal pages exist
   (`privacy*`, `cookie*`, `terms*`, `accessib*`) and are footer-linked from every
   page. Then work through every item in `pre-ship-gates.md` against the rendered
   site. Record each result; a single failure blocks promotion. **Grep the shipped
   CSS** for banned display faces (Inter/Roboto/Open Sans/Poppins/Lato) and confirm
   the **ledger distance gate** (§0) against `../../sites/variety-ledger.md` —
   eyeballing is how a banned font ships.
3. **The composition pass (mandatory — the second-order tells).** Run
   `visual-review.md` §2.5 against the *rendered* site — through section screenshots
   (browser tool / Playwright) or the human describing each section: per section, hunt uncomposed
   negative space, a stamped-not-rationed signature, repeated rhythm, and a nominal
   POV, and write a `HELD/EARNED` or `FIX` verdict for each. Passing the mechanical
   gates in step 2 does **not** satisfy this — a green checker can still front a
   blank-half hero. Write the per-section verdicts to
   `output/composition-critique.md`. **Any section that can't earn a `HELD/EARNED`
   blocks promotion** — fix it in place (static site) or send the specific move back
   to stage 05.
4. **Function checks** — all links resolve, no 404s, no `lorem`/placeholder left;
   every page in `sitemap.md` exists; copy matches `content.md`.
5. **Accessibility & responsive** — run the §3 responsive sweep and §4 accessibility
   pass from `visual-review.md`: contrast, keyboard nav, landmarks, alt text; no
   horizontal scroll and no two-line clickable text from 320–1920px. Attach the
   per-page desktop + mobile screenshots as evidence in the report.
6. **Fix loop.** For any failure, write specific instructions and re-run stage 05
   with them. Re-QA until clean.
7. **Promote.** When every gate passes, copy `../05_build/output/site/` to
   `../../sites/<kebab-name>/` (naming per config), give it its own local Git repo
   if policy says so (push only on request), and add a row to `../../sites/README.md`.
   Follow `../../_config/deploy.md`: preserve any existing remote/host/pipeline
   exactly, record deploy facts honestly in the registry, and deploy or push only if
   the owner asked. GitHub push is storage, not deployment.
   **Archive the intake.** If `../../_intake/` was used for this build, copy its
   contents into `../../sites/<kebab-name>/_source/` for provenance (the original
   client brief + supplied assets next to the site they produced), then clear
   `../../_intake/` so the next client starts clean. If `_intake/` was empty, skip.
   **Moodboard exception:** any card in `_intake/references/moodboard.md` marked
   `parked: next-build` survives the clear — leave those cards (only those) on a
   fresh board for the next build; everything else archives as above.
8. **Append the variety-ledger row.** Add this build to
   `../../sites/variety-ledger.md` — the quick-scan table row **and** a full build
   record — reading the fields from the *shipped* `:root` tokens and the design-spec's
   divergence note. Be truthful: if execution drifted from the planned direction, log
   what actually shipped. This is what stops the *next* build from converging.
9. Write the QA report: gate results, fixes applied, final status, promoted path.

## Outputs

`qa-report.md` -> output/
`composition-critique.md` -> output/ — the per-section `HELD/EARNED`/`FIX` verdicts from
the composition pass (step 3); the written proof the second-order-tell review happened.
(plus the promoted site at `../../sites/<name>/`, the archived intake at
`../../sites/<name>/_source/` if intake was used, an updated `sites/README.md`, and a
new row in `../../sites/variety-ledger.md`)

Plus: update `../../SESSION.md` — on promote, set status
`COMPLETE — promoted to sites/<name>/`.

## Verify

Re-read `../01_brief/output/brief.md` and confirm the shipped site fulfils the
stated **goal and audience** — that it's the thing that was asked for, not a
competent answer to a different question. Flag any drift before declaring done.

## Review

If you keep fixing the same class of slop every build, that's a signal to tighten
the source — `../../shared/design/anti-slop-rules.md` or
`references/build-prompt.md` — not just this site.
