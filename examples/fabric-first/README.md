# Fabric First — sample website

A four-page sample site built to demonstrate the workspace's design bar. Green,
grey and white; one bold modern typeface; no back end and no forms.

**It is a fictional company.** The projects, people, address, phone number and
email are illustrative placeholders, declared in the colophon on every page. The
phone number is an Ofcom drama number (`01632 960 431`) reserved for fiction, so
it can never ring a real person. The technical specifications and the order of
work are real.

## Run it

```
python -m http.server 8731     # from this folder
```

Then open <http://localhost:8731/index.html>. It is static — no build step, no
dependencies. Opening `index.html` directly off disk also works; only the
Fontshare webfont needs a network.

## Pages

| File | What it is |
|---|---|
| `index.html` | The position, the drawing, the specification, the five stages |
| `method.html` | The five stages in full, with the drawing tracking what you read |
| `projects.html` | Three projects as a hairline index, not a card grid |
| `contact.html` | Direct contact. Phone, email, address — **no form** |

## The design decisions

- **Genre** modern-minimal · **Macrostructure** Narrative Workflow ·
  **Nav** N10 floating-on-scroll morph · **Footer** Ft1 mast-headed.
- **Theme** custom (tuned), not a catalog theme. Cool near-white paper
  `oklch(98.8% 0.005 152)`, a single deep signal green `oklch(46% 0.135 152)`,
  and a charcoal band `oklch(24% 0.014 152)`. Every neutral is tinted toward the
  anchor hue; there is no pure white or black anywhere.
- **Type** Cabinet Grotesk, one family site-wide at 400/500/800. Hierarchy comes
  from weight, size, case and tracking only — never from swapping faces.
- **Signature — "The Section."** A hand-built SVG cross-section (Tier B in the
  enrichment hierarchy) in which the airtightness membrane is drawn as one
  unbroken green line around the heated volume. On `method.html` each stage
  lights the layer it is about. No photography, stock or generated.

### Why green, given the gravity well

The design contract warns that unwatched AI design passes converge on *soft
serif + sage green + warm cream* (`design-directions.md` § the gravity well).
The brief mandated green, so
the build exits the well on the other three axes instead: a saturated deep
**signal** green rather than a muted sage, **cool** near-white paper rather than
warm cream, a **heavy grotesque** rather than a serif, and a workflow
macrostructure rather than soft cards.

### Why there is no contact form

Standing scope: front end only, no back end. A form that cannot submit is worse
than no form. Contact is a real `tel:` and `mailto:` instead.

## Verification

- `node ../../shared/design/check-slop-gates.mjs .` → **0 FAIL** (5 WARN, all
  confirmed false positives: `.btn--quiet` is a modifier always applied
  alongside `.btn`, which carries the `:focus-visible` and `:disabled` rules;
  the `.contact` grid track holds no images).
- Rendered and swept in Chrome across **4 pages × 12 widths, 320–1920 px**: no
  horizontal scroll, no two-line clickable text.
- Hero clears the **1280 × 800** fold with 159 px to spare.
- Every text node measured in sRGB against its computed background: **WCAG
  4.5:1** body / **3:1** large, on all four pages, light and charcoal surfaces
  (gates 40–41).

### Known limitation

The layer highlight and the nav morph both run off one `requestAnimationFrame`
scroll loop, so neither updates while the tab is backgrounded — rAF is paused
there by the browser. That is correct behaviour, not a defect, but it means
automated checks must render the tab to observe either one.
