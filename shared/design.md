# Design

The non-negotiables. Stage 04 chooses within them; stage 06 checks against them.

**PROVENANCE:** ported from the website-builder workspace this repo descends from, which
distilled them from the `hallmark` anti-slop design system and Anthropic's `frontend-design`
guidance. Rewritten here where the original assumed a workspace that no longer exists.

**The test for every rule below:** *would a working studio ship this?* If a choice could have
come from any generator, it fails.

---

## What is deliberately NOT banned

Read this before the rules, because it changes how to apply them.

Common layouts are common partly because they work. People know how to read a centred hero, a
row of three, an accordion of questions. Banning convention outright does not produce braver
design, it produces a site the visitor has to learn, and that trade is almost always bad for the
small business paying for it.

So what follows targets **defaults**, not conventions: the choices a generator makes when it has
not made a choice. Inter as the display face. The purple-to-blue gradient. Four typefaces
scattered by role. `transition: all`. Those are not design decisions, they are the absence of
one, and that is the whole distinction this file is drawing.

A centred hero you chose, and can defend, is fine. A centred hero because centring is the
default is the problem.

---
## 0. There is a library of shapes, and it is not a template

Rules 1 to 11 below are almost entirely NEGATIVE: not Inter, not the gradient,
not four typefaces, not `transition: all`, not the hero-then-three-cards rhythm.
A page can break none of them and still read as generated, because avoiding a
default is not the same as making a decision, and there is no gate for average.

[`patterns/`](../patterns/README.md) is the positive half. Twenty-three section
archetypes, each with the question it answers, the case it is wrong for, and
**what holds its negative space** — which is the design question rule 11 says the
mechanical gates cannot reach.

Open `patterns/preview/index.html` and look at it before designing anything. Then
pick shapes that DISAGREE with each other: a page needs at least two genuinely
different archetypes, and two identical splits back to back is the mild version
of having one.

It is a vocabulary, not a template. There is no page to fill in, the tokens are a
worked example to replace rather than a house style, and a build that ships them
unchanged has skipped the decision stage 04 exists to make.

## 1. Have a point of view

Before any layout, decide the *why* — the position this site takes. A design is a
set of decisions, not a template filled in. Score the plan on six axes before
building (Philosophy, Hierarchy, Execution, Specificity, Restraint, Variety); fix
anything weak before writing code. The output must look like **this brief**, not
"a page that could be anyone's."

## 2. Typography — one coherent voice, never the tells

- **One typeface family by default.** Set the **whole** site — headings, body, UI,
  nav, buttons, labels, captions, folios — in a **single** well-chosen family, and
  build hierarchy from **weight, size, case, letter-spacing and colour**, never from
  swapping fonts. A reader must never wonder why one run of text is in a different font
  from the text beside it. Consistency reads as *designed*; fonts scattered by role
  read as AI slop. (Same family at different weights is still one family.)
- **A second family is allowed only as a deliberate, harmonious pairing** — one display
  + one text face that visibly belong together — and **only when the design spec names
  the pairing and justifies why one family won't do.** Hard cap: **two families, ever.**
  **No third "outlier" face** for a wordmark, stat, pull-quote, or label — give those a
  weight/case/spacing treatment of an existing family instead. (This supersedes the old
  "max three".)
- **Never mix a decorative, script, calligraphic, or heavily-italic face with an
  upright one for general text or labels.** The "elegant italic/serif heading sitting
  next to a plain sans body, with little labels in a third techy font" look is *exactly*
  the slop tell to avoid. If a display serif and the body face aren't unmistakably
  harmonious, **use one family.**
- **All font references go through `--font-*` tokens** in `:root` — no inline
  `font-family` literals, so the family set is auditable and can't drift mid-build.
- **No** Inter, Roboto, Open Sans, Poppins, Lato, or system-default as the *display*
  face. Pick the family with intent and name it as a token.
- **No italic headings.** Headers are roman; emphasis comes from weight, accent
  colour, or a drawn underline. Italic is for occasional body-copy emphasis only —
  never headings, nav, buttons, labels, or whole blocks.
- Prose measure stays in **45–75 ch**.

## 3. Colour — restraint and tint

- **No** purple→blue / cyan→magenta gradients anywhere — including
  `background-clip: text` gradient headlines. No gradient text, ever.
- **No** pure `#000` or `#fff` as a base (exception: a deliberate monochrome
  modern-minimal paper). Tint every neutral toward the anchor hue.
- Accent colour covers **≤ ~5%** of any viewport — it's for emphasis, not filling.
- Every colour and font references a **named token** in `:root`. No mid-render
  improvised hexes or one-off `oklch(...)`.
- Define `--color-accent-ink` for text on accent fills; verify contrast (below).

## 4. Structure — break the AI template

- **No** generic Hero → 3 equal feature-cards → CTA → footer rhythm.
- **No** 3-equal-column icon-above-heading card grid; no card-in-card; no thick
  coloured side-stripe borders.
- **Hero shape:** not everything centred on one vertical axis. Pick at most two
  centred elements; push the eyebrow or CTA off-axis. Heavier bottom padding than
  top. Essential hero content (eyebrow, headline, lede, primary CTA) fits the fold
  at **1280×800** without scrolling.
- Sections must vary in rhythm — not identical whitespace bands.
- **Nav & footer:** don't ship the AI defaults (wordmark-left + inline links +
  button-right hairline nav; 4-column Product/Company/Resources/Legal footer).
  Choose a deliberate alternative.
- Decoration must be **motivated** — a cursor in a typed command, a numeral that
  names a year/issue, an interaction-driven gradient. No random ornaments.

## 5. Motion — quiet and purposeful

- **No** `transition: all` — name the properties.
- **No** uniform `hover:scale-105` across unrelated elements; no element with
  multiple simultaneous hover effects.
- **Never** animate `width/height/top/left/margin/padding` — animate `transform`
  and `opacity`.
- Focus rings appear **instantly** (no fade-in).
- Every animation/transform has a `@media (prefers-reduced-motion: reduce)` fallback.
- No overshoot/bouncy easing on UI state changes; no celebratory toast for an
  effect the user can already see; auto-rotating content has a
  **visible, focusable pause control**. Pausing on hover is NOT sufficient: WCAG 2.2.2 is a
  Level A criterion requiring a control the user can operate, and a keyboard user who never
  hovers still cannot stop the motion.

## 6. Honest content — never fabricate

- **No invented metrics, reviews, names, prices, logos, or credentials.** Every
  factual claim comes from `content.md`. Missing data becomes a labelled
  placeholder + a TODO, never a made-up number.
- No "Jane Doe / John Smith" or startup clichés (Acme, Nexus, Seamless, Unleash).
- A bare giant number is never the sole hero headline — pair it with words.

## 7. Real chrome, real assets

- **No** hand-drawn fake browser bars, phone frames, code-window chrome, terminals,
  or IDE chrome. Use a real screenshot in a `<figure>`, or omit it.
- One icon library only; no emoji as feature/step/pricing icons. Prefer custom SVG
  or lead with typography. Hand-built SVG/CSS art needs `aria-label` or
  `aria-hidden`.
- **Generated imagery**, if your toolchain has any, is allowed only for
  non-photoreal illustrative subjects, with honest alt text. **Never** an AI-made
  person, logo, premises, product or credential: those are statements about a real
  business, and generating one is the same offence as inventing a price. Stock
  photography of someone else's workshop is the same offence with a receipt.
  When in doubt, fall back to CSS, SVG or type — a missing image beats a dishonest
  one, and a site with no photographs and real confidence beats a site wearing
  somebody else's.

## 8. Accessibility & contrast (hard floor)

- **Body text** ≥ WCAG 4.5:1; **large text/icons/focus rings** ≥ 3:1, against the
  *computed* background. Never button-text ≈ button-fill; never ink-on-ink in dark
  sections (flip the text colour when you flip the surface).
- Interactive elements need all states: default + hover + `:focus-visible` +
  `:active` + `:disabled`. Disabled uses three channels (opacity + `not-allowed` +
  the `disabled`/`aria-disabled` attribute), never opacity alone.
- Inputs: border-width never shifts between states; focus ring via `outline` not
  `border`; input height matches adjacent button height; reserve helper-text space.
- Semantic landmarks, alt text on meaningful images, keyboard-navigable.

## 9. Responsive (hard floor)

- **No horizontal scroll** at any width 320–1920px (`overflow-x: clip` on `html`
  and `body`).
- **No** clickable text (buttons, nav, CTA, footer links) wrapping to two lines.
- Spacing values come from a named scale (multiples of 4px) — no arbitrary `17px`.
- Image-bearing `1fr` grid tracks use `minmax(0, 1fr)`; display headers get
  `overflow-wrap: anywhere; min-width: 0`; all-caps display heads keep
  `line-height ≥ 1.0`.
- Renders flawlessly at 320 / 375 / 414 / 768px.

## 10. Variety across builds

If this workspace has built before, the new site must differ **structurally** from
the last — not just by colour swap. This is a JUDGMENT call at stage 04, not a gate. There is no cross-build ledger
file and no checker for it: the honest position is that variety across builds is
something a human notices, and claiming otherwise would be the exact kind of
unbacked assertion this repo exists to remove.

- **Pick from the menu.** Stage 04 chooses an archetype from
  [`directions.md`](directions.md),
  not from the model's own taste.
- **Read the ledger first.** the previous builds in `builds/*/design.md`
  records every prior build's direction, display-type genre, colour temperament,
  macrostructure, and signature. Stage 04 reads it before choosing; stage 06 appends
  to it on promote.
- **Distance rule:** the new site must differ from the **last two** builds on at least
  **two** of {display-type genre, colour temperament, macrostructure}. A swapped accent
  hue is not variety.
- **Mind the gravity well.** This workspace converges on *soft serif (often Fraunces)
  + green/sage accent + warm-cream paper*. Do not land there unless the brief
  unavoidably demands warm-organic — and even then, differentiate the palette and
  display face from every prior organic build in the ledger.

## 11. Beyond the gates — the second-order tells

Rules 1–10 are mostly *pass/fail*: a build either uses Inter or it doesn't, either
gradients text or it doesn't. A site can clear **every** one of them and still read
as AI-made, because the remaining tells are about **composition, not correctness**.
These are the ones a real-project review keeps surfacing after the mechanical
gates are green. Judge them with the world-class-studio test, at stage 04 *and* 06.

- **Composed negative space, never a blank half.** Mechanical asymmetry — shove the
  content into cols 1–8 and leave the rest empty — satisfies Rule 4 and still looks
  generated, because the empty region isn't *doing* anything. Real negative space is
  **held**: a counterweight anchors the open side (a hairline/rule system, an honest
  index or figure, structural numerals, oversized type bleeding in, an interaction
  target). A hero whose right ~35% and the band below its CTA are simply void is the
  clearest "AI filled the template and stopped" signal. **Empty ≠ negative space.**
  Every large gap must be a decision you could defend, not a leftover.
- **Ration the signature; don't stamp it.** A distinctive recurring device (an eyebrow
  kicker, a `>` prompt glyph, a `// label`, a numeral tag) is a *punctuation mark*, not
  a section template. The moment it prefixes the majority of section headings it *becomes*
  the "eyebrow-above-every-heading" AI pattern it was meant to escape — just in costume.
  Use the signature on a **minority** of openings (the statement/entry/exit beats), and
  let other sections open bare or differently. Repetition of the motif is the tell, not
  the motif.
- **Rhythm variance must be real, not nominal.** Rule 4 says sections vary; enforce it
  structurally. Not every section may share the same `padding-block` token **and** the
  same one-column-left-text skeleton. A page needs **≥2 genuinely distinct section
  archetypes** (e.g. full-bleed statement band vs. asymmetric split vs. index list vs.
  centred call) — and two identical splits back-to-back is the mild version of the same
  failure. Same padding + same layout on every band reads as a stack, not a composition.
- **The point of view must be *earned by execution*, not just named.** If the direction
  is called "Terminal" but nothing is actually monospaced, or "Editorial" with no real
  measure/rhythm discipline, the POV is a label the pixels don't back up — itself a smell.
  When a later constraint removes the mechanism a direction depended on (e.g. a single-sans
  mandate strips the mono that sold "terminal"), either re-earn the concept another way or
  **rename the direction to match what's on screen.** A concept the type no longer delivers
  is worse than an honest plainer one.

These four don't have clean automated checks — `checks/rules/design.mjs` flags only the
mechanical proxies (motif over-use, uniform section padding). They are a **stage-04
direction requirement and a stage-06 eyes-on gate** (shared/review.md), judged by eye.

---

The mechanically checkable subset of the above is enforced by `checks/rules/design.mjs` and
`checks/rules/a11y.mjs`. Run them:

```
node checks/run.mjs <site>
```

The rest — composition, negative space, whether the point of view survives contact with the
pixels — is in `stages/06_verify/CONTEXT.md` as a human step, and is honestly labelled as one
rather than pretended to be automated.
