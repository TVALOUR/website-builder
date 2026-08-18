# Pre-Ship Gates — Stage 06 QA Checklist (Layer 3)

The gate a site must clear before it's promoted to `sites/<name>/`. Run every item
against the **rendered** site (open it, drag the viewport, tab through it) — not
just the source. **Every box must be checkable.** Any failure goes back to stage 05
for a re-run with specific fixes.

First run `node shared/design/check-slop-gates.mjs sites/<name>` — a machine-verified
pass on ~14 of the gates below (contrast, token discipline, font count, italic
headings, interactive states, reduced motion, spacing scale, image-grid tracks,
header wrap, uppercase/line-height, sticky collisions). Fix every FAIL it reports;
triage its WARNs. It is not a substitute for what follows — most gates need
judgment or a rendered browser.

> **No Node?** The script needs Node 18+. Without it, this checklist still runs —
> read every item against the rendered site and the source by hand. You lose the
> mechanical catch on the ~14 pattern-matchable gates, so be stricter on the font,
> gradient and contrast items, not looser. Say in the QA report that the script
> did not run.

This checklist is the standalone floor.

## 0. Pre-flight

- [ ] All four inputs (brief, sitemap, content, design-spec) were present and
      placeholder-free before the build.
- [ ] The build used the design tokens from `design-spec.md` verbatim (no
      improvised colours/fonts).
- [ ] **Ledger distance:** checked against [`../../sites/variety-ledger.md`](../../sites/variety-ledger.md)
      — this site differs from the **last two** builds on ≥ 2 of {display-type genre,
      colour temperament, macrostructure}. Not in the gravity well (serif + green +
      warm cream) unless the brief demanded it and the palette/display differ from
      prior organic builds. A colour swap alone fails this gate.

## 1. Typography

- [ ] Display face is **not** Inter/Roboto/Open Sans/Poppins/Lato/system-default.
      *Check the shipped CSS itself, not just the spec* — grep every `font-family`
      and `:root` font token in the built site for the banned faces. (example-clinic
      shipped with Inter because this was eyeballed, not grepped.)
- [ ] **One coherent family (two only if a justified pairing).** Grep the shipped CSS
      for the **distinct families actually referenced** (every `--font-*` token + any
      inline `font-family`). There must be **one** family — or **two** only if
      `design-spec.md` names and justifies a harmonious display+text pairing.
      **Three or more = fail.** No inline `font-family` literals outside `:root`.
- [ ] **Hierarchy is weight/size/case/spacing, not font-swaps.** Headings, body, nav,
      buttons, labels, folios and captions all resolve to the same family (or the one
      justified pairing). Open the rendered page and confirm **no run of text reads as a
      different or disconnected font** from its neighbours — no wordmark/label/stat in a
      third "outlier" face.
- [ ] **No decorative/script/calligraphic/heavily-italic face** for general text or
      labels, and **no italic headings anywhere** (`h1`–`h6`, hero/section titles,
      wordmark, stats). The "italic-serif heading + plain-sans body + techy-mono label"
      mix fails this gate.
- [ ] Prose measure 45–75 ch.

## 2. Colour

- [ ] No purple/blue/cyan/magenta gradient anywhere; no gradient text.
- [ ] No pure `#000`/`#fff` base (unless deliberate monochrome paper); neutrals tinted.
- [ ] Accent ≤ ~5% of any viewport.
- [ ] Every colour/font is a named token; no mid-render improvised values.
- [ ] `--color-accent-ink` defined and used on every accent fill carrying text.

## 3. Structure

- [ ] Not the Hero → 3 feature-cards → CTA → footer template.
- [ ] No 3-equal-column icon-tile grid; no card-in-card; no side-stripe cards.
- [ ] Hero not all-centred on one axis; bottom padding ≥ 1.3× top padding.
- [ ] Hero essentials (eyebrow, headline, lede, primary CTA) fit the fold at 1280×800.
- [ ] Sections vary in rhythm; nav and footer are not the AI defaults.
- [ ] Every decorative element is motivated (no random ornaments).
- [ ] **Negative space is composed, not blank** (anti-slop-rules §11). No large empty
      region — the open side of an asymmetric hero, the band below a CTA — sits void with
      nothing holding it. Every big gap is a defensible decision, not a leftover of the
      template. Eyeball the hero at 1280×800 and 1440-wide: is the open side *held*?
- [ ] **Signature motif is rationed, not stamped** (anti-slop-rules §11). The recurring
      device (eyebrow/`>`/`// label`/numeral) prefixes a **minority** of section headings,
      not most of them. Count them: a motif on nearly every section is the eyebrow-kicker
      tell in costume.
- [ ] **≥2 genuinely distinct section archetypes** (anti-slop-rules §11); not every
      section shares one `padding-block` token *and* one layout skeleton. No two identical
      splits back-to-back.
- [ ] **The POV is earned by execution, not just named** (anti-slop-rules §11). The
      direction's label (Terminal/Editorial/…) is backed by what's actually on screen; a
      later constraint hasn't quietly stripped the mechanism that sold it. If it has,
      re-earn or rename — don't ship a nominal concept.

## 4. Motion

- [ ] No `transition: all`; no uniform `hover:scale-105`; no multi-effect hovers.
- [ ] No animation of `width/height/top/left/margin/padding`.
- [ ] Focus rings appear instantly; every motion has a reduced-motion fallback.
- [ ] No bouncy easing on UI state; no redundant success toast; carousels pause on hover+focus.

## 5. Honest content

- [ ] No invented metrics, reviews, names, prices, logos, or credentials.
- [ ] No "Jane Doe / John Smith" or Acme/Nexus/Seamless/Unleash clichés.
- [ ] No bare giant number as the sole hero headline.
- [ ] Any missing data is a labelled placeholder + TODO, not fabricated.

## 6. Chrome & assets

- [ ] No hand-drawn fake browser/phone/code/terminal/IDE chrome.
- [ ] One icon library; no emoji as feature/step/pricing icons.
- [ ] Decorative SVG/CSS art has `aria-label` or `aria-hidden`.

## 7. Accessibility & contrast

- [ ] Body text ≥ 4.5:1; large text/icons/focus rings ≥ 3:1 against computed bg.
- [ ] No button-text ≈ button-fill; no ink-on-ink in dark sections.
- [ ] Interactive elements have default + hover + focus-visible + active + disabled.
- [ ] Disabled uses opacity + `not-allowed` + the disabled attribute.
- [ ] Inputs: border-width stable across states; focus ring via `outline`; input
      height = button height; helper-text space reserved.
- [ ] Semantic landmarks; alt text on meaningful images; full keyboard navigation.

## 8. Responsive

- [ ] No horizontal scroll at any width 320–1920px.
- [ ] No clickable text wraps to two lines at any width.
- [ ] Spacing from a named 4px scale; no arbitrary values.
- [ ] Image-bearing `1fr` tracks use `minmax(0, 1fr)`; display heads have
      `overflow-wrap: anywhere`; all-caps display heads keep line-height ≥ 1.0.
- [ ] Renders flawlessly at 320 / 375 / 414 / 768px.

## 9. Function

- [ ] All internal links resolve; no 404s; no `lorem`/placeholder text left.
- [ ] Site runs/previews per the build report's instructions.
- [ ] Every page in `sitemap.md` exists; every page's copy matches `content.md`.
- [ ] **Baseline legal pages** (`../legal/legal-pages.md`): Privacy, Cookies, Terms,
      Accessibility all exist and are footer-linked — unless `brief.md` explicitly
      opted one out. No invented legal fact (registration number, address, DPO
      contact) — a gap is a labelled placeholder, same as any other content gap.
- [ ] **Consent banner** (if Cookie Policy ships): renders on first visit; "reject
      non-essential" leaves zero analytics/marketing requests firing (check the
      network tab); the footer "Cookie preferences" control reopens it.

## 10. Trace-back (Verify)

- [ ] The finished site fulfils the **goal and audience** stated in
      `stages/01_brief/output/brief.md`. Re-read the brief and confirm the built
      site is the thing that was asked for — not a competent answer to a different
      question.

## 11. Generated imagery (only if the site uses any)

Open every generated image and judge it with your own eyes — see
[`imagery.md`](imagery.md) §6 for the full checklist.

- [ ] **No forbidden subjects** (imagery.md §5): no AI-made people-as-real, premises,
      products-as-real, logos, badges, awards, or credential imagery.
- [ ] **No slop tells**: no malformed hands/fingers/teeth, no garbled text, no melted/
      warped/cloned objects, no over-blurred bokeh-portrait look, no HDR "AI glow",
      no watermark ghosts, no mismatched shadows/reflections.
- [ ] The asset **set is coherent** (one visual language) and **on-brand** (palette/
      mood match the design tokens).
- [ ] Each generated image is **declared** in `asset-manifest.md` with honest,
      descriptive alt text (or `alt="" aria-hidden` if decorative); none is passed
      off as a real photo of the client, team, premises, or work.
- [ ] Each is optimised (sensible format/size) with explicit `width`/`height`.
- [ ] Any dropped/unavailable asset fell back cleanly to CSS/SVG/typography — the
      site ships clean with no broken or missing image.

---

**Promotion:** only when every box is checked. Copy the site to `sites/<name>/`,
add a row to `sites/README.md`, and record the gate result in
`stages/06_qa/output/qa-report.md`.
