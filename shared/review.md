# Review — how a rendered page actually gets looked at

Stage 06's `CONTEXT.md` says *what* must be true; this file says *how to verify it on a
rendered page*, with whatever eyes the session actually has. Stage 04 uses the same ladder
to show direction samples at its stop.

---

## 1. The ladder — take the highest rung you actually have

Probe once per `AGENTS.md` § Run modes, and record in `verify.md` which rung ran. **Never
report a rung that did not run** — a review that did not happen, recorded as if it had, is
the exact false assurance this repo exists to remove.

**Rung 1 — a browser tool in the harness (zero install).** Claude-in-Chrome, a built-in
browser driver, anything that can open a page and screenshot it. Navigate to the site
(`file://` or a local server), screenshot each page at several widths, read the DOM for
copy and heading structure, watch the console for errors. For most static sites this
satisfies the whole rendered review on its own.

**Rung 2 — a Playwright MCP or equivalent, if one is already wired in.** Scripted,
headless screenshots per viewport plus an accessibility tree. Installing one mid-build
needs the human's approval first (§4).

**Rung 3 — the human's eyes (always available).** No rendering capability at all → the
human is the reviewer and you direct precisely:

- Serve the site (`python -m http.server` from the site dir, or open `index.html`) and
  give them the URL.
- Direct the look one batch at a time — not "does it look OK?" but "at 375px wide, does
  anything overflow sideways? what is sitting in the right half of the hero?"
- Read the source yourself in parallel — copy against `content.md`, heading nesting,
  tokens against `design.md`, alt text — everything checkable without pixels.
- Record their answers as the review evidence, marked human-verified.

## 2. The composition pass — the tells that survive a green checker

The gate proves a site is *correct*. This pass proves it was *composed* — and it is
deliberately adversarial and per-section, because a tickable checklist never catches the
blank-half hero that a written verdict does.

**The stance:** assume every section is generated until you can name why it is not.

**The method:** screenshot (or have the human describe) each section full-width at ~1280
and ~1440. For each one write a one-line verdict — `HELD — <why>` or `FIX — <the tell> →
<the move>` — asking, in order:

1. **Is the empty space held, or just blank?** Find every large empty region — the open
   side of an asymmetric hero, the band under a CTA. Name what anchors it (a rule system,
   an honest index or figure, structural numerals, type bleeding in). If the answer is
   "nothing", it is a void, not negative space.
2. **Is the signature rationed, or stamped?** Count the recurring motif across the page.
   Prefixing most sections means it has become the eyebrow-kicker pattern in costume.
3. **Is the rhythm distinct, or a repeat?** Same padding *and* same skeleton as the
   neighbouring section is a stack, not a composition. The page needs at least two
   genuinely distinct section shapes.
4. **Does the point of view survive contact with the pixels?** A "Terminal" with nothing
   monospaced, an "Editorial" with no measure discipline — re-earn it or rename it.
5. **Would a working studio sign this section?** Not "is it inoffensive". If it reads as
   "the template, filled in and stopped", it fails — name the fix.

Every `FIX` is applied or sent back to stage 05 as a specific instruction — never just
noted. The verdicts land in `verify.md`; that written trail is the proof the looking
happened.

## 3. The responsive sweep — 320 to 1920

Resize (or have the human drag) and check at minimum **320, 375, 768, 1024, 1440, 1920**:

- No horizontal scroll anywhere in the range.
- No clickable text wrapping to two lines.
- Nav collapses sensibly; tap targets ≥ 24px (44px is the comfortable target, 24 the
  floor); nothing overlaps or clips.
- Body copy stays in a readable 45–75ch measure; no orphaned single words in display
  heads.
- Images scale without distortion; the layout never depends on a fixed width.
- **The interaction pass, on the smallest width too:** nothing important lives only
  behind hover (touch has no hover); the primary CTA sits still rather than following
  the scroll; content does not wait for a scroll-triggered fade to exist; the next
  section peeks above the fold so the page visibly continues.

## 4. The accessibility pass

Manual, every build, on whichever rung is running:

- **Contrast** — body ≥ 4.5:1, large text and UI ≥ 3:1, against the *rendered*
  background, including text over images.
- **Keyboard** — tab through every page: visible focus on every stop, logical order, no
  traps, menus and modals operable and escapable without a mouse.
- **Landmarks and headings** — one `<h1>` per page, no skipped levels, real
  `header`/`nav`/`main`/`footer`.
- **Names** — every image an intent-appropriate `alt` (empty for decorative), every
  control an accessible name, every input a real `<label>`.
- **Motion** — turn on the OS reduce-motion setting and reload: nothing should still
  move.

For a deeper automated scan (axe-core, Lighthouse, pa11y via `npx`), **ask the human
before installing anything**, run from a scratch directory, and treat the output as a
list to confirm by hand — automation finds roughly a third of real failures, and the
repo does not pretend otherwise. Never add a dependency to the built site just to test
it.

## 5. What gets recorded

In `verify.md`: which rung ran, the per-section composition verdicts, the sweep result
(pass, or the widths that broke and how), the accessibility result, console errors, and
screenshots (or the human's answers) as evidence. A single failure blocks promotion —
with the specific fix written down, not a vibe.
