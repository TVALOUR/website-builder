# Visual, Accessibility & Responsive Review (Layer 3)

How a built site is **actually looked at** before it ships — across viewports, for
real accessibility, with evidence recorded. This is the review playbook for
**stage 06**. It complements `pre-ship-gates.md`: the gates say *what* must be true;
this file says *how to verify it* on a rendered page.

---

## 1. Pick the review path (a capability ladder)

Who "looks" depends on what your harness has — probe once per `AGENTS.md` § Run
modes and take the **highest rung available**. Never report a higher rung than
the one that actually ran.

**Rung 1 — a browser tool in the harness (zero install).** If your agent ships a
browser/screenshot tool (e.g. Claude-in-Chrome, a built-in browser driver), use
it for every build. It can:

- **Navigate** to the rendered site (open `index.html` via a local file URL, or
  the dev-server URL for framework stacks).
- **Screenshot** each page at several viewport widths for an evidence trail.
- **Read page text / DOM** to confirm copy matches `content.md` and headings
  nest correctly (one `<h1>`, no skipped levels).
- **Resize** to sweep the responsive range (see §3).
- **Check console** for errors/warnings on each page.

It satisfies the whole review on its own for most static brochure sites.

**Rung 2 — a Playwright MCP wired into your agent's config (§5).** Scripted,
headless screenshots per viewport, plus an accessibility tree to read directly.
Needs the human's approval to install.

**Rung 3 — the human's eyes (always available).** No rendering capability at
all → the first-choice reviewer is **the human**, with
the agent directing precisely:

- **Serve the site** (`python -m http.server` from the site dir, or the framework
  dev command) and give the human the URL.
- **Direct the look** — per page, tell them exactly what to check from §2/§2.5/§3
  below, one batch at a time, and ask for what they see (not "does it look OK?" but
  "at 375px wide, does any element overflow horizontally? what sits in the right
  half of the hero?").
- **Read the source yourself** in parallel — copy vs `content.md`, heading nesting,
  tokens vs the design spec, alt text — everything checkable without pixels.
- **Record their answers** as the review evidence in the QA report, marked
  human-verified.

Whichever rung ran, the QA report says which one it was.

---

## 2. What to actually look at (the human pass)

Work through each page viewport by viewport — via screenshots or the human's
answers. Don't trust a green checklist nobody saw render. For each page:

- **First impression** — does it read as *made, not generated*? Any AI tell from
  `anti-slop-rules.md` (default Inter/Roboto, purple-on-white gradient, Hero→3-cards
  →CTA rhythm, gradient text, uniform `hover:scale`)? If yes, it fails — back to 05.
- **Hierarchy** — eye lands on the real headline first; one clear focal point per
  view; accent colour is genuinely sparse (≤ ~5%).
- **Rhythm** — sections don't all share the same padding/three-column cadence; the
  signature move from `design-spec.md` is actually present.
- **Copy in place** — text matches `content.md` verbatim; no `lorem`, no leftover
  `[NEEDS: …]`, no `<!-- TODO -->` rendered into view.
- **Real chrome** — no fake browser bars, no invented logos/badges, one icon set.

Capture (or have the human capture) a screenshot of each page at desktop and
mobile widths as the evidence attached to the QA report.

---

## 2.5 The composition pass — hunt the second-order tells

§2 catches the *obvious* tells. This pass catches the ones that survive a green
checklist — the [`anti-slop-rules.md §11`](anti-slop-rules.md) tells that are about
**composition, not correctness**. A site can pass every mechanical gate and still read
as generated; this is the pass that catches the classic blank-half hero
*after* the gates are all green. Run it every build. It is deliberately **adversarial
and per-section** — the mechanism that makes it work is that it forces you to *look at
each band and defend it in writing*, which a tickable checklist never does.

**The stance:** assume every section is slop until you can name *why it isn't.* The
gates prove the site is correct; this pass proves it was *composed*. "It passed the
checklist" is not a defence here.

**The method.** Screenshot each section full-width at ~1280 and ~1440. For each one, do
not tick a box — **write a one-line verdict**: either `HELD/EARNED — <why>` or
`FIX — <the tell> → <the move>`. Ask, in order:

1. **Is the negative space held, or just blank?** Find every large empty region — the
   open side of an asymmetric hero, the wide gutter beside a text column, the band under
   a CTA. Name what *anchors* it (a hairline/rule, an honest index or figure, structural
   numerals, oversized type bleeding in, an interaction target). **If the answer is
   "nothing," it's a void, not negative space** — compose it or restructure. (The classic
   case: content in cols 1–8, right ~35% blank → FIX: a hairline-divided
   honest index holding the right column.)
2. **Is the signature rationed, or stamped?** Does this section open with the same motif
   (eyebrow / `>` / `// label` / numeral) as most others? Count its uses across the page.
   If it prefixes the majority of sections, it *is* the eyebrow-kicker AI pattern — strip
   it from this section and let the opening carry itself.
3. **Is the rhythm distinct, or a repeat?** Is this section's padding *and* skeleton the
   same as its neighbour's? Two identical splits (or bands) back-to-back is the tell —
   differentiate one. The page needs ≥2 genuinely distinct section archetypes.
4. **Is the point of view earned on screen?** Does what actually renders deliver the
   direction's promise — the "Terminal" is actually monospaced, the "Editorial" actually
   has the measure and rhythm? If a later constraint stripped the mechanism (a single-font
   mandate killing the mono that sold "terminal"), the POV is nominal — re-earn it or
   rename the direction. Don't ship a label the pixels don't back up.
5. **The studio test:** would a world-class studio ship *this section*, or does it read as
   "the template, filled and stopped"? If the latter, it fails — name the fix.

**Close the loop.** Every `FIX` is either applied in place (you're QA'ing a static site
you can edit) or written as a specific instruction back to stage 05 — never just noted.
The site ships only when **every** section's verdict is `HELD/EARNED`. Record the
per-section verdicts (and the fixes made) as `composition-critique.md` in the QA output —
that written trail is the proof the looking actually happened.

**Escalation:** if the same tell shows up build after build, it belongs upstream — tighten
`anti-slop-rules.md §11` or the stage-04 design step, not just this one site (see stage
06's *Review*).

---

## 3. Responsive sweep (320 → 1920 px)

Resize and screenshot at, at minimum: **320, 375, 768, 1024, 1440, 1920**. At each:

- **No horizontal scroll** anywhere in the range (anti-slop §9).
- **No two-line clickable text** — buttons/links stay on one line or are sized for it.
- Nav collapses sensibly; tap targets ≥ ~44px; nothing overlaps or clips.
- Type stays in a readable measure (45–75ch body) and doesn't reflow into orphans.
- Images/media scale without distortion; no fixed widths forcing overflow.

A browser tool's window resize — or the human dragging theirs — covers this with
no install. For a scripted, repeatable sweep across many pages, the Playwright
recipe in §5 does the same headlessly.

---

## 4. Accessibility pass

Do the manual checks every time; reach for an automated scanner when the site is
large or interactive. Manual, in whichever browser the review path uses (browser tool, or the human's
with the agent directing):

- **Contrast** — body text ≥ 4.5:1, large text/UI ≥ 3:1 against its real background
  (anti-slop §8). Check the actual rendered colours, including on images/overlays.
- **Keyboard** — tab through every interactive element: visible focus ring on each,
  logical order, no traps, skip-link present on long pages, menus operable without a
  mouse.
- **Landmarks & headings** — one `<h1>`, no skipped levels, `header`/`nav`/`main`/
  `footer` landmarks, lists marked up as lists.
- **Names & alt** — every image has intent-appropriate `alt` (empty for decorative),
  every control has an accessible name, every input a real `<label>`.
- **States** — hover, focus, active, disabled all present and distinguishable.

For an exhaustive automated WCAG 2.1/2.2 scan, use the opt-in **axe-core** or
**Lighthouse** recipe in §5. Treat their output as a checklist to *confirm*, not as
a substitute for the manual pass — automation catches ~30–40% of issues.

---

## 5. Opt-in automated tools (ask before installing)

These are reputable, well-known tools — but they require Node packages. **Do not
install anything globally, and ask the human before running any `npm`/`npx`
install.** Use them when the human-directed pass isn't enough (large sites, complex
interactivity, CI) — or as the agent's only route to real screenshots. All belong
to stage 06.

| Tool | Maker | What it gives | How (after approval) |
|------|-------|---------------|----------------------|
| **Playwright MCP** | Microsoft (`@playwright/mcp`, Apache-2.0) | Scriptable cross-browser navigation, multi-viewport screenshots, DOM/accessibility-tree snapshots | Wire as an MCP server in your agent's config (`npx @playwright/mcp@latest`) per its README; scripted/headless |
| **@axe-core/playwright** | Deque (official) | WCAG 2.0/2.1/2.2 violation list with severity + fix hints | In a throwaway test dir: `npx playwright test` with an `AxeBuilder(page).analyze()` spec; read the JSON |
| **Lighthouse / `@lhci/cli`** | Google | Performance (LCP/INP/CLS), Accessibility, SEO, Best-Practices scores + audits | `npx lighthouse <url> --output json --output-path report.json` (or `@lhci/cli` for CI) |
| **pa11y** | open source | Quick CLI a11y scan (HTML CodeSniffer / axe) | `npx pa11y <url>` |

Notes & guardrails:

- **Prefer `npx` over global installs.** Never add a dependency to a *built site*
  just to test it; run scanners against the rendered URL from a scratch location.
- **Network constraint:** the stage-05 build stays offline. These tools belong to
  stage 06, where installing is a deliberate, approved step — not part of the
  automated build.
- **Vet before adding any new tool.** Only the named tools above are pre-approved.
  Anything else goes through the same bar as `resources.md`: reputable maker, no
  unnecessary scripts, clear purpose. When unsure, default to the highest rung
  you already have — the harness browser tool, else the human-directed review.

---

## 6. What to record

Attach to `stages/06_qa/output/qa-report.md`:

- Screenshots per page at desktop + mobile (and any viewport where something broke).
- The responsive-sweep result (pass, or the widths that failed + what failed).
- The accessibility result (manual pass + any scanner output, with violations).
- Console errors/warnings found, if any.
- Which review rung ran (browser tool / Playwright / human-directed — and, if a
  scanner was installed, that the human approved it).

A single failure here blocks promotion — write the specific fix and send it back to
stage 05, exactly as `06_qa/CONTEXT.md` describes.
