# Baseline legal pages (Layer 3)

Every build ships four legal pages by default — not bolted on at the end, not
skipped because the brief didn't mention them. Left per-build, this drifts fast: the
same four documents end up under three different filename conventions, or three of them
quietly go missing on a site that has a contact form. This file **fixes the filenames**
and makes inclusion the default across every stack (static/tailwind/astro/next), so the
stage-06 presence check has something exact to look for.

> **Templates, not legal advice.** They are a proportionate starting point for a
> small brochure site, written to a GDPR-shaped baseline — the strictest common
> privacy floor — **not to any one country's law**. The governing law is
> wherever the business operates and its audience lives: stage 01 records the
> jurisdiction in `brief.md`, stage 03 writes to it. Anything collecting real
> personal data at scale, or trading as a registered company, needs a local
> lawyer's eyes before launch.

## The four pages (fixed filenames — don't rename per build)

| Page | File | Why it's baseline |
|------|------|--------------------|
| Privacy Policy | `privacy.html` (or `/privacy` route) | Privacy law in most jurisdictions (GDPR and its equivalents — UK GDPR, CCPA/CPRA, PIPEDA, Australia's APPs, …) requires one the moment a site collects any personal data — including via a contact form or analytics. |
| Cookie Policy | `cookies.html` (or `/cookies`) | EU/UK ePrivacy-class rules (PECR and equivalents) require disclosure + consent for any non-essential cookie (analytics, marketing pixels); many other jurisdictions require at least disclosure — consent-by-default is the safe global floor. |
| Terms of Use | `terms.html` (or `/terms`) | Not a hard legal requirement for a brochure site, but standard practice and cheap to ship; limits liability, sets acceptable use. |
| Accessibility Statement | `accessibility.html` (or `/accessibility`) | Public-facing good practice under WCAG and local accessibility/equality law (Equality Act, ADA, EAA, …); also documents the anti-slop a11y gates this workspace already enforces (pre-ship-gates.md §7), so it's mostly a truthful writeup of work already done. |

**Skip condition:** only drop a page if the human explicitly says so at stage 01
(e.g. a single-page personal portfolio with no forms, no analytics, no cookies may
skip Cookie Policy — note the decision in `brief.md`). Otherwise all four ship.

## Stage 02 (sitemap)

Add all four to the page list as a fixed tail, after the brief-driven pages —
they don't compete with IA decisions, they're baseline. Add them to the **footer**
nav only (never primary nav) as a single row: `Privacy · Cookies · Terms ·
Accessibility`. Note them in `sitemap.md` under a "Legal (baseline)" subheading so
stage 03/05 don't have to re-derive that they're always-on.

## Stage 03 (content)

Write real copy for all four using the templates below, **to the jurisdiction
recorded in `brief.md`** (stage 01 asks); if none is recorded, mark
`[NEEDS: jurisdiction]` at the top of the privacy + cookie pages rather than
assuming a country's law. The honesty rule
(`copywriting.md` / anti-slop-rules §6) applies in full: **never invent** a
company registration number, data-protection registration number (e.g. ICO in
the UK), registered address, or
data-protection contact. Use `brief.md` facts; anything missing is a labelled
`[NEEDS: …]` placeholder, same as any other content gap — not an excuse to
fabricate a legal fact.

### Privacy Policy — sections to cover
1. Who we are (business name, contact, `[NEEDS: registered address]` if a
   company; sole traders can use a trading address if the brief supplies one).
2. What data we collect and why (only what the actual site collects — e.g. name/
   email from a contact form, analytics cookies if used). Don't list data
   collection mechanisms the site doesn't actually have.
3. Legal basis (consent / legitimate interest / contract — pick the one that
   actually applies per data type).
4. How long data is kept, who it's shared with (state "no third parties" if true).
5. Data subject rights (access, rectification, erasure, objection) + how to
   exercise them (an email address, from the brief).
6. Cookies — link to the Cookie Policy rather than duplicating it.
7. Changes to this policy + last-updated date.

### Cookie Policy — sections to cover
1. What cookies are, in plain language (one short paragraph, no jargon).
2. **Essential** cookies (session/consent-state) — always active, no consent needed.
3. **Non-essential** cookies actually in use (analytics, marketing) — name the
   real ones from the brief/build (e.g. "Google Analytics" only if it's actually
   wired in); never list a placeholder vendor as if it's active.
4. How to withdraw consent — point at the footer "Cookie preferences" control
   (see the consent-manager template below).
5. A cookie table: name, purpose, duration, category — fill only rows that are real.

### Terms of Use — sections to cover
1. Acceptance of terms, who the site is for.
2. Intellectual property (site content ownership).
3. Acceptable use (no scraping, no misuse of forms).
4. Liability disclaimer (standard "information provided as-is" language).
5. Governing law — England & Wales unless the brief says otherwise.
6. Contact for disputes.

### Accessibility Statement — sections to cover
1. Commitment statement (plain: "we want this site to be usable by everyone").
2. Standard targeted — WCAG 2.1 AA (matches the workspace's own a11y gates).
3. What's been done — pull *true* claims from the site actually built (semantic
   landmarks, alt text, keyboard nav, contrast ratios, reduced-motion support) —
   this is the one legal page that can be filled honestly from stage 06's own gate
   results rather than invented boilerplate.
4. Known limitations, if any (be honest — don't claim perfection).
5. How to report an accessibility problem (contact from the brief).
6. Last-reviewed date.

## Stage 05 (build) — cookie consent

If the Cookie Policy is in scope (i.e. not explicitly skipped), the build wires a
**front-end-only** consent banner — no backend, no server-side consent store,
fits the workspace's front-end-only service boundary. Copy
[`consent.js`](consent.js) verbatim into `output/site/js/consent.js` and wire the
banner markup + footer "Cookie preferences" button per its contract (documented in
the file's own header comment). Any non-essential script (analytics/marketing) on
the site **must** ship inert per that contract — `<script type="text/plain"
data-consent="analytics" data-src="…">` — never firing before consent. If the
site has zero non-essential scripts, still ship the banner shell with an empty
`CATEGORIES` list disabled (cookies limited to "essential only") — simpler than a
banner that never shows, and keeps the Cookie Policy's claims true.

Each of the four HTML files is a real page in the same stack/design system as the
rest of the site — same header/footer chrome, design tokens, nav — not a stripped
plain-text dump. Legal pages still have to pass the anti-slop gates (they're just
lower-stakes on the composition ones; typography/colour/contrast/responsive gates
still apply in full).

## Stage 06 (QA) — gate

Added to `pre-ship-gates.md` §9 (Function): all four legal pages exist (unless
explicitly skipped in `brief.md`), the footer links to each, and — if a Cookie
Policy ships — the consent banner actually renders and its "reject" path leaves no
non-essential script executed (open devtools/network tab, reject, confirm no
analytics request fires).
