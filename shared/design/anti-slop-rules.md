# Anti-Slop Rules — The Non-Negotiables (Layer 3)

The contract-level design rules. These **bind every stage** and apply from stage
04 (direction) through stage 06 (QA). This file is the floor that must never be
breached.

> The test for every rule: **would a world-class human studio ship this?** If a
> choice could have come from any AI default, it fails.

---

## 1. Have a point of view

Before any layout, decide the *why* — the position this site takes. A design is a
set of decisions, not a template filled in. Test the plan on six axes before
building — **Philosophy** (a nameable point of view), **Hierarchy** (one thing
clearly matters most per screen), **Execution** (every token deliberate),
**Specificity** (could only be this brand), **Restraint** (nothing decorative
that says nothing), **Variety** (a real distance from the last builds) —
writing a one-line defence for each; fix any axis you cannot defend before
writing code. The output must look like **this brief**, not
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
  effect the user can already see; auto-rotating content pauses on hover+focus.

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
- **Generated imagery** (any image tool) is allowed only under
  [`imagery.md`](imagery.md): non-photoreal/illustrative subjects only, **never**
  AI-made people/logos/premises/credentials, every asset passes the slop checklist
  and carries honest alt text. When in doubt, fall back to CSS/SVG — a missing image
  beats a slop one.

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
the last — not just by colour swap. This is enforced, not aspirational:

- **Pick from the menu.** Stage 04 chooses an archetype from
  [`../../stages/04_design/references/design-directions.md`](../../stages/04_design/references/design-directions.md),
  not from the model's own taste.
- **Read the ledger first.** [`../../sites/variety-ledger.md`](../../sites/variety-ledger.md)
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
These are the ones the stage-06 composition pass keeps surfacing after the
mechanical gates are green. Judge them with the world-class-studio test, at stage 04 *and* 06.

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

These four don't have clean automated checks — `check-slop-gates.mjs` flags only the
mechanical proxies (motif over-use, uniform section padding). They are a **stage-04
direction requirement and a stage-06 visual-review gate**, judged by eye.

---

The exhaustive, gate-by-gate version is in
[`pre-ship-gates.md`](pre-ship-gates.md). **Run the gates before promoting any
site.**
