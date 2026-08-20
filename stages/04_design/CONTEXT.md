# Stage 04 — Design

Decide what this site looks like, be able to say why — and let the human decide between
things they can **see**, not adjectives.

◆ **This is a stop.** Design is where being wrong is most expensive to unwind, and it is the
part a client has the strongest and least articulable opinions about. Present rendered
samples and the alternatives you rejected, and let them push back before the real CSS
exists.

## Two defaults that are not yours to change (unless the client changes them)

- **Motion is `none`** unless `brief.md` says otherwise. Colour, shadow and opacity still respond
  to hover and focus — that is feedback. Nothing slides, fades in on scroll, or loops. The gate
  enforces it (`design/motion-policy`), so a direction built on movement fails at stage 06 rather
  than at the client meeting.
- **Imagery is `client-assets-only`** unless `brief.md` says otherwise. The direction is carried by
  the client's own assets, type, space, CSS and hand-built SVG. A section with no photograph is a
  design problem to solve, not a licence to generate one.

Both are recorded per build because both are the client's call, and both were previously a habit.

## A delegated axis that you decide comes BACK to the brief

If `brief.md` says motion, imagery, colour or type was **delegated by choice**, and you then decide
it here, **write the resolved value back into `brief.md` before this stage closes**:

```
- **Motion:** subtle          <- and one line saying who decided and why
- **Imagery:** client-assets-only
```

This is not bookkeeping. The gate reads that field, so a delegated axis that gets decided in
`design.md` and never written back is read as movement nobody agreed to — and it fails the build at
stage 06 for work that was correct. It happened to this repo's own reference build: stage 04 chose a
restrained once-only entrance, exactly the good outcome, and the gate reported it as a violation
because stage 01's delegation was still the last word in the field.

## Inputs

- `builds/<slug>/brief.md` — the Vision section: what they handed over, the five-second
  answer, the feel-words, the anti-vision, and which axes were delegated.
- `builds/<slug>/references.md` — the dissected reference cards. **Highest design
  authority in this stage.** Consume per `../../shared/references.md`.
- `builds/<slug>/sitemap.md` — what has to fit.
- `builds/<slug>/facts.md` — what real assets exist: logo, colours, photos, licensed fonts.
- `../../shared/design.md` — the non-negotiables. Read them.
- `../../shared/directions.md` — the menu. Choose from it rather than from your own taste.
- `../../shared/references.md` — the live-research protocol, for gaps the client's cards
  leave open.
- `../../shared/imagery.md` — the generated-imagery honesty contract, if imagery is even
  wanted.
- `../../shared/photography.md` — how to direct the camera the client already owns, which
  is the answer to a thin page far more often than generated imagery is.
- `../../studio/` if it exists — `rejections.md` before you present anything, and
  `directions.md` to check the gravity well against the log rather than from memory.
- `../../shared/review.md` §1 — the ladder for showing rendered samples at the stop.

## Process

> **Before anything else, open `patterns/preview/index.html`.** Twenty-three
> section archetypes with the reason not to use each one, and a token set to
> replace. It is a vocabulary rather than a template, and it exists because the
> design rules elsewhere in this repo are almost all negative: a page that breaks
> none of them can still be the most average arrangement the model knows.
> `patterns/README.md` is the how, and it is short.


### 1. Read what they gave you, first

Open `references.md` and take each card's **Steal** items — one influence per axis (type /
colour / structure / motion / voice) — and honour every **Leave**. The client's dissected
taste outranks the menu, outranks live research, and outranks your own preferences. If the
brief says "no references supplied, direction delegated", that is a decision on the
record: the menu carries more weight and the rendered samples at the stop carry the most.

### 2. Take a position

Write one sentence: **what is this site's argument?** Not "clean and modern", which is what
a page says when nobody decided. Something with an opinion in it: *a farrier's day book* ·
*a laboratory notebook* · *a village noticeboard* · *a printed price list nailed to a
wall*. It must agree with the brief's five-second answer and feel-words — if it does not,
one of them is wrong; raise it.

### 3. Choose a direction, do not drift into one

Pick from `../../shared/directions.md`. The menu exists for one measured reason: left
alone, every model converges on the same three or four looks, and a site built by taste
alone ends up resembling the last one you built rather than this business.

If the workspace has built before, read the previous `builds/*/design.md` first. The new
site must differ from the last two on at least **two** of {display type, colour
temperament, macrostructure}. A swapped accent hue is not variety.

If `studio/directions.md` exists, that check is mechanical rather than remembered — run
`node checks/studio.mjs` and it will say when three builds have started to resemble each
other. It is also the only way to make the rule work at all once the earlier builds have
been archived off this machine.

And read `studio/rejections.md` before you choose. Presenting somebody a direction they
have already turned down twice, in the words they used to turn it down, is the fastest way
to stop looking like a designer and start looking like a tool that forgot.

Where the client's cards leave whole axes open, run the live-research protocol in
`../../shared/references.md` (2–3 current studio sites in the chosen direction, DNA
extracted, carded) — or skip it without web access and say so in `design.md`.

### 4. Type

- **One family.** Two only if the pairing is deliberate, harmonious, and you can say in a
  sentence why one will not do. Never three.
- Hierarchy comes from **size, weight, case, letter-spacing and colour**. Not from swapping
  fonts by role. The serif heading over sans body with a mono label is a specific, instantly
  recognisable generated look.
- **Not Inter, Roboto, Open Sans, Poppins, Lato — nor this year's equivalents (Space
  Grotesk, Manrope, Sora, DM Sans) — as the display face.** Those are what gets chosen when
  nothing is chosen. If the client's own brand font is one of them, that is a decision with
  a source; say so in `design.md`.
- **Check the licence** (`facts.md`, question 22). A desktop licence does not permit webfont
  use. Self-host the woff2; do not link Google's CDN.
- No italic headings. Prose measure 45 to 75 characters.

### 5. Colour

- Everything a named token in `:root`.
- Client-supplied colours win: exact hexes, or values eyedropped from a supplied artifact
  with the source recorded. "No opinion" was delegated — decide, and show it rendered.
- No purple-to-blue or cyan-to-magenta gradient. No gradient-filled text, ever.
- No pure `#000` or `#fff` as the base. Tint the neutrals toward the anchor hue. It is a
  degree of difference and it is most of why one page reads as designed and another does
  not.
- Accent covers roughly 5% of a viewport at most. Define the ink colour that goes on top of
  every accent fill, and check the contrast at the ratio, not by eye.

### 6. Structure

- Not hero, three equal cards, call to action, footer.
- Hero not all centred on one axis. Heavier bottom padding than top. The next section
  should peek above the fold — a hero locked to exactly 100vh with nothing showing beneath
  it reads as a dead end on every laptop.
- The hero answers the five-second question from the brief: what is this, who is it for,
  why care — with one clear action. No redundant kicker restating the H1 above the H1.
- **At least two genuinely distinct section shapes.** Not one skeleton with different words.
- **Compose the empty space.** Mechanical asymmetry that leaves one third simply void
  satisfies the rule and still looks generated, because the gap is not doing anything. Give
  it something to hold: a rule system, an index, structural numerals, type bleeding off the
  edge.
- **Ration the signature.** A recurring device is punctuation, not a section template. On
  most headings it becomes the eyebrow-kicker tell in costume.
- Nav and footer are decisions too. Do not ship the default shape without choosing it.
- Interaction with intent: hover states brighten or affirm, they never make the hovered
  thing fade or vanish; nothing important lives only behind hover (touch has no hover);
  the primary CTA sits still; content exists without JavaScript and does not wait for a
  scroll trigger to appear.

### 7. Imagery, honestly

Use what `facts.md` says exists and is theirs to publish. If there are no photographs, do
not generate a person, a premises, a product or a credential, and do not buy stock of
someone else's workshop — carry the page with type and structure instead. If the design
genuinely wants generated *illustrative* assets and the session has an image tool, list
each one in `design.md` per `../../shared/imagery.md` §6 (subject, style pinned to the
tokens, alt, fallback); otherwise write "no generated assets".

**And if the imagery is thin, direct the camera they already own.** Copy
`../../templates/shot-list.md` to `builds/<slug>/shot-list.md` and fill it in per
`../../shared/photography.md` — six shots at most, each
with where it goes, why it earns its place, the framing, and the **fallback if it never
arrives**. Hand it over as its own document.

This happens *here*, before the design locks, for a mechanical reason: a section designed
around a photograph that never turns up has to be rebuilt, and one designed to work without
a photograph cannot absorb a good one later without being opened up again. Deciding now is
what makes both cheap. A shot that does not arrive must change nothing — that is the rule
this stage is agreeing to when it writes the list.

### 8. Render the choice — samples, not adjectives

Before the stop, build **one throwaway page**: `builds/<slug>/design-samples.html` — the
top of the homepage (hero + one section) executed 2–3 ways, one per candidate direction,
using the **real** headline and copy from `content.md` and the real logo if one exists.
Self-contained file, tokens inline, no dependencies; label each variant with its direction
name and one line on what it argues. Fifteen minutes of work that replaces a paragraph of
adjectives nobody can picture.

Show it through the highest rung of `../../shared/review.md` §1 — screenshots via a
browser tool, or serve it and direct the human's eyes. This is how "no opinion, show me"
from stage 01 gets honoured, and how everyone else confirms the direction *before* the
whole site exists in it. The samples file is scaffolding: it never ships, and it is
deleted or ignored once `design.md` locks.

### 9. Write `design.md`

Tokens, per-section layout notes, the direction and why it fits **this** client, **which
reference card fed which decision** (one line each — the lineage back to their own taste),
the asset list or "no generated assets", and **the alternatives you rejected and what they
lost on**. That last part is what makes the checkpoint a conversation instead of a yes/no.

### 10. Stop and discuss

Present the rendered samples, the direction, the palette, the type, and the rejected
options. Take direction. Loop until they are happy, then lock it.

## Outputs

- `builds/<slug>/design.md`
- `builds/<slug>/design-samples.html` (scaffolding — never ships)
- `builds/<slug>/shot-list.md` if the imagery is thin, or a line in `design.md` saying the
  photography they already have is enough
- `STATE.md` updated

## Verify

- [ ] The one-sentence argument is written down, and the choices serve it.
- [ ] Every reference card's Steal/Leave was honoured, and `design.md` names which card fed
      which decision.
- [ ] One family, or two with a stated reason. Fonts licensed for web and self-hosted.
- [ ] Every colour and font is a named token; client-supplied values used exactly.
- [ ] Two or more genuinely distinct section shapes; every large empty area is holding
      something.
- [ ] Different from the last two builds on two axes — checked against
      `studio/directions.md` where it exists, not from memory.
- [ ] Nothing presented that `studio/rejections.md` says they have already turned down.
- [ ] Thin imagery answered with a shot list, and every section works without its
      photograph.
- [ ] Rendered samples were shown at the stop (which rung, and what the human said).
- [ ] The rejected alternatives are written down.
