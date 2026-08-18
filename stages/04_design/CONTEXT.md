# Stage 04 — Design

Decide what this site looks like, and be able to say why.

◆ **This is a stop.** Design is where being wrong is most expensive to unwind, and it is the
part a client has the strongest and least articulable opinions about. Present the direction
and the alternatives you rejected, and let them push back before a line of CSS exists.

## Inputs

- `builds/<slug>/brief.md` — voice, audience, the three sites they liked and the one they hated
- `builds/<slug>/sitemap.md` — what has to fit
- `builds/<slug>/facts.md` — what real assets exist: logo, colours, photos, licensed fonts
- `../../shared/design.md` — the non-negotiables. Read them.
- `../../shared/directions.md` — the menu. Choose from it rather than from your own taste.

## Process

### 1. Take a position first

Before any layout, write one sentence: **what is this site's argument?** Not "clean and
modern", which is what a page says when nobody decided. Something with an opinion in it:
*a farrier's day book* · *a laboratory notebook* · *a village noticeboard* · *a shipping
manifest* · *a printed price list nailed to a wall*.

Everything after this either serves that sentence or is decoration you have not noticed yet.

### 2. Choose a direction, do not drift into one

Pick from `../../shared/directions.md`. The menu exists for one measured reason: left alone,
every model converges on the same three or four looks, and a site built by taste alone ends up
resembling the last one you built rather than this business.

If the workspace has built before, read `builds/*/design.md` first. The new site must differ
from the last two on at least **two** of {display type, colour temperament, macrostructure}.
A swapped accent hue is not variety.

### 3. Type

- **One family.** Two only if the pairing is deliberate, harmonious, and you can say in a
  sentence why one will not do. Never three.
- Hierarchy comes from **size, weight, case, letter-spacing and colour**. Not from swapping
  fonts by role. The serif heading over sans body with a mono label is a specific, instantly
  recognisable generated look.
- **Not Inter, Roboto, Open Sans, Poppins, Lato or a system stack as the display face.** Those
  are what gets chosen when nothing is chosen.
- **Check the licence** (`facts.md`, question 22). A desktop licence does not permit webfont
  use. Self-host the woff2; do not link Google's CDN.
- No italic headings. Prose measure 45 to 75 characters.

### 4. Colour

- Everything a named token in `:root`.
- No purple-to-blue or cyan-to-magenta gradient. No gradient-filled text, ever.
- No pure `#000` or `#fff` as the base. Tint the neutrals toward the anchor hue. It is a
  degree of difference and it is most of why one page reads as designed and another does not.
- Accent covers roughly 5% of a viewport at most. It is emphasis, not filling.
- Define the ink colour that goes on top of every accent fill, and check the contrast at the
  ratio, not by eye.

### 5. Structure

- Not hero, three equal cards, call to action, footer.
- Hero not all centred on one axis. Heavier bottom padding than top.
- **At least two genuinely distinct section shapes.** Not one skeleton with different words.
- **Compose the empty space.** Mechanical asymmetry that leaves one third simply void
  satisfies the rule and still looks generated, because the gap is not doing anything. Give it
  something to hold: a rule system, an index, structural numerals, type bleeding off the edge.
- **Ration the signature.** A recurring device is punctuation, not a section template. On most
  headings it becomes the eyebrow-kicker tell in costume.
- Nav and footer are decisions too. Do not ship the default shape without choosing it.

### 6. Imagery, honestly

Use what `facts.md` says exists and is theirs to publish. If there are no photographs, do not
generate a person, a premises, a product or a credential, and do not buy stock of someone
else's workshop. Carry the page with type and structure instead. A site with no photographs
and real confidence beats a site with someone else's photographs.

### 7. Write `design.md`

Tokens, per-section layout notes, the direction and why it, and **the alternatives you
rejected and what they lost on**. That last part is what makes the checkpoint a conversation
instead of a yes/no.

### 8. Stop and discuss

Present the direction, the palette, the type, and the rejected options. Take direction. Loop
until they are happy, then lock it.

## Outputs

- `builds/<slug>/design.md`
- `STATE.md` updated

## Verify

- [ ] The one-sentence argument is written down, and the choices serve it.
- [ ] One family, or two with a stated reason.
- [ ] Fonts are licensed for web and will be self-hosted.
- [ ] Every colour and font is a named token.
- [ ] Two or more genuinely distinct section shapes.
- [ ] Every large empty area is holding something.
- [ ] Different from the last two builds on two axes.
- [ ] The rejected alternatives are written down.
