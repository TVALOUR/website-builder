# Moodboard — the owner's reference intake & why-it-wins analysis (Layer 3)

The owner drops websites they like (or pointedly dislikes) — a URL or screenshot, any time,
in any conversation. This protocol turns each drop into a **dissected reference card**
the current build's stage 04 can steal from with precision. It is the taste-input
half of the design system: the DNA extraction says *what* a site is; this layer adds
*why it wins* and *what exactly to take*.

**The scoping rule that makes it safe:** the moodboard is **per-build and expires**.
Cards live in `_intake/references/moodboard.md`, are archived to
`sites/<name>/_source/` at stage-06 promote, and the folder is cleared. The next
build starts with an empty board unless the owner explicitly says "reuse the moodboard
from <site>" (then copy the named cards back from that site's `_source/`). Never
read a previous build's archived board on your own initiative — stacking references
across projects is exactly the convergence the variety ledger exists to prevent.

## When this fires

- The owner drops a URL/screenshot with taste language: "I like this site", "look at this
  one", "add this to the moodboard", "this is the vibe", "inspo for the site",
  "this site feels amazing / terrible".
- Stage 04 opens and the board is empty → ask the owner **once**:
  *"Any sites you want on the moodboard for this build — things whose font, feel,
  or positioning you'd like me to dissect and draw from?"* If they have none, proceed
  without; the live-references protocol still runs as usual.
- Mid-build: fine at any stage. If stage 04's spec is already **locked**, add the
  card, then ask one question: *"Design's locked for this build — amend the spec
  (re-opens the 04 checkpoint), or park this for the next project?"* Parked cards
  stay on the board marked `parked: next-build` and survive into the next intake
  instead of being cleared.
- No active build: still capture. `_intake/` is the next build's staging area —
  the card simply waits for the next stage 01.

**Cap: 5 active cards per build.** Past that, adding a new card means the owner names one
to drop. Averaging ten references produces mush; three studied properly produce a
point of view (same bound as `live-references.md` rule 4).

## Who dissects

You do, inline — a card is a bounded job (one fetch, one verdict, ~15 lines). Batch
multiple dropped URLs into one pass. Keep the reading out of the build stages: a
card is written once at drop time and *consumed* at stage 04, not re-fetched there
unless it is missing what stage 04 needs.

(Conductor mode: dissection may run in a spawned sub-agent instead — batch all
dropped URLs into one spawn so the heavy fetching stays out of the conductor;
during stage 04, the already-running design sub-agent dissects new drops itself.)

## Per card — the capture procedure

1. **Ask what drew them** (skip if they already said): one question only — *"What
   grabbed you — the type, the colour, the layout, the motion, the way it talks, or
   the whole thing?"* Their answer is the card's most important field: it tells
   stage 04 **which axis** of this reference matters. A site can be on the board for
   its font alone.
2. **Extract the DNA** — fetch the site (or study the screenshot) and extract its
   DNA per `stages/04_design/references/live-references.md` § How to research:
   macrostructure, display/body faces, paper, accent + footprint, motion, density.
   Diagnosis-level use only: **never** copy pixels, never reproduce a layout
   section-for-section.
   No fetch tool? Ask the human for a screenshot instead — a bare URL without
   web access parks the card as `[NEEDS: screenshot]`, never a guessed verdict.
3. **Write the why-it-wins verdict** — the layer `study` doesn't do. Answer these,
   in prose, ~5 sentences (for a disliked reference, invert: why it loses):
   - **Load-bearing move.** The single element doing the most work. If you removed
     one thing and the site collapsed into generic, what is it?
   - **Tension.** What opposition creates the feel — huge display against tiny
     labels, dense text against empty space, loud colour against near-monochrome,
     motion against stillness? Flat sites have no tension; that's usually *why*
     a site loses.
   - **Craft evidence.** The details that prove a human sweated it — optical
     alignment, a bespoke glyph, a hover that respects the easing system, copy
     that sounds like a person. These are what "not AI slop" actually looks like.
   - **Coherence.** Does every choice serve one idea, or is it three good ideas
     fighting? Name the one idea if it exists.
4. **Capture voice & positioning** (the owner asks for this explicitly): how the site
   *talks* — headline register (declarative / wry / technical / intimate), how it
   frames the offer, who it assumes is reading. Two sentences.
5. **Fill Steal / Adapt / Leave** — the output stage 04 actually consumes:
   - **Steal** — moves specific enough to act on. Not "nice typography" but
     "display set at 90px+ with -3% tracking while nav stays 11px mono caps —
     the scale jump IS the brand."
   - **Adapt** — right instinct, needs translation to this client/our stack
     (e.g. "their WebGL grain → our CSS `filter: contrast()` noise overlay").
   - **Leave** — observed but not carried, **with the reason cited**: on the
     anti-slop banned list (name the rule/gate), collides with the variety
     ledger, or wrong for this client. A reference using parallax or `transition:
     all` is not a licence — the bans in `anti-slop-rules.md` and the design
     contract's motion discipline beat any reference, always. Feel gets re-expressed inside
     the discipline (3 easings, 3 duration buckets, transform/opacity only), not
     imported raw.

## The card format (append to `_intake/references/moodboard.md`)

```markdown
## <site name> — <URL or "screenshot"> · added <date>
**Owner flagged:** <their words / the axis that grabbed them — or "disliked: <why>">
**DNA:** <macrostructure> · <display face/genre> + <body> · paper <band/hue> ·
accent <hue @ footprint> · motion <library/reveal or none> · density <read>
**Why it wins:** <the ~5-sentence verdict: load-bearing move, tension, craft, coherence>
**Voice:** <register + positioning, 2 sentences>
**Steal:** <bulleted, concrete>
**Adapt:** <bulleted, with the translation>
**Leave:** <bulleted, each with cited reason>
```

## How stage 04 consumes the board

- Read the board **before** the generic live-references research — the owner's dissected
  taste outranks a cold gallery crawl. Cards can *replace* the live-research step
  when they cover the gaps (client refs → moodboard → live research, in that order
  of authority).
- Steals inform **execution inside the chosen direction** — same rule as
  `live-references.md` rule 2: the divergence pick (ledger + distance rule) is made
  first and a loved reference does not override it, nor any anti-slop rule.
- The design-spec's divergence justification must name which cards fed it and
  **which steals were used** — one line each — so stage 06 can copy the lineage
  into the variety ledger and future builds can see which references are burnt.
- One influence per axis (type / colour / structure / motion / voice). Two cards
  pulling the same axis in different directions = pick one, note the loser.

## What this protocol refuses

- Emitting a portable design spec from a moodboard card — a moodboard is
  inspiration, not extraction-for-reuse.
- Reading another build's archived moodboard unprompted.
- Carrying a banned move because "the reference does it."
- Letting a reference override the ledger distance rule.
- More than 5 active cards, or cards nobody dissected ("just look at these ten
  URLs" → pick the best ones properly or decline the rest).
