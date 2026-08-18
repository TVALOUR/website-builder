# References — from "I like this site" to a design input

The protocol that turns what the client can point at — a URL, a screenshot, a sketch, the
site they are half-remaking — into something stage 04 can actually design from. It is the
taste half of discovery: `facts.md` captures what is *true*; this captures what they can
*see*.

The unit is a **card**: one reference, dissected, with a verdict. Cards live in
`builds/<slug>/references.md`, are written at stage 01 (or whenever a reference is
dropped), and are consumed at stage 04. They are per-build by construction — a new build
starts with none, because stacking references across projects is how every site converges
on the last one.

---

## The two iron rules

1. **Extract DNA, never copy identity.** You are harvesting genre-level moves — type
   genre, colour temperament, macrostructure, one signature gesture — not a site's look.
   If the finished design would let a viewer name the reference, you copied. No lifted
   wordmarks, no layouts reproduced section-for-section, no verbatim palettes. This holds
   *hardest* for the remake target (question V2): "remake" means *rebuild what it does for
   them*, in their own identity — not clone it. Say that to the client in one line when
   the card is written, so nobody is surprised at stage 04.
2. **The contract beats any reference.** A reference using gradient text, `transition:
   all` or four typefaces is not a licence — `shared/design.md` wins, always. What a
   banned move *achieves* gets re-expressed inside the discipline; the move itself is
   left, with the reason cited on the card.

## Caps

**Five cards per build, at most.** Averaging ten references produces mush; three studied
properly produce a point of view. Past five, adding a card means the client names one to
drop. And one influence per axis (type / colour / structure / motion / voice): two cards
pulling the same axis in different directions means pick one and note the loser.

## Per card — the capture procedure

1. **Ask what grabbed them** (skip if they already said): one question — *"What grabbed
   you: the type, the colour, the layout, the motion, the way it talks, or the whole
   thing?"* Their answer is the card's most important field: it tells stage 04 **which
   axis** of this reference matters. A site can be on the board for its font alone. For a
   disliked reference, invert: what exactly repels them.
2. **Get eyes on it.** Fetch the URL if the harness can; otherwise ask for screenshots. A
   bare URL nobody rendered parks the card as `[NEEDS: screenshot]` — never a guessed
   verdict. A sketch or a screenshot from `_intake/` is studied the same way.
3. **Extract the DNA** — values, not vibes:
   - **Type**: family names from the CSS or the pixels; display genre (grotesque / didone /
     mono / condensed / humanist…).
   - **Colour**: actual values where readable; temperament in words (warm / cool / mono /
     one-spot).
   - **Macrostructure**: section skeleton, nav pattern, hero shape, footer pattern, density.
   - **Motion**: what moves, how much, and whether it respects the reader.
4. **Write the why-it-wins verdict** — ~5 sentences of prose (inverted for a disliked one):
   - **Load-bearing move.** Remove one thing and the site collapses into generic — what is
     it?
   - **Tension.** What opposition creates the feel — huge display against tiny labels,
     dense text against empty space, loud colour against near-monochrome?
   - **Craft evidence.** The details that prove a human sweated it — optical alignment, a
     bespoke glyph, copy that sounds like a person. This is what "not generated" actually
     looks like.
   - **Coherence.** Does every choice serve one idea? Name the idea if it exists.
5. **Fill Steal / Adapt / Leave** — the output stage 04 actually consumes:
   - **Steal** — moves specific enough to act on. Not "nice typography" but "display at
     90px+ with tight tracking while nav stays 11px caps — the scale jump IS the brand."
   - **Adapt** — right instinct, needs translating to this client or this stack.
   - **Leave** — observed but not carried, **with the reason cited**: banned by
     `shared/design.md` (name the rule), wrong for this client, or collides with what this
     workspace built last.

## The card format (append to `builds/<slug>/references.md`)

```markdown
## <site name> — <URL or "screenshot" or "sketch"> · added <date>
**They said:** <their words / the axis that grabbed them — or "disliked: <why>">
**DNA:** <macrostructure> · <display genre + body> · <paper> · <accent + footprint> ·
<motion> · <density>
**Why it wins:** <the ~5-sentence verdict>
**Steal:** <bulleted, concrete>
**Adapt:** <bulleted, with the translation>
**Leave:** <bulleted, each with the cited reason>
```

## Live reference research (stage 04, when the client's own references leave gaps)

The client's cards outrank everything, but when they cover one axis and the direction
needs grounding on the others, research 2–3 **current, real-studio** sites in the chosen
direction — with the web tools if the harness has them, or not at all (design from
`shared/directions.md` alone and say so in `design.md`).

- Search curated galleries (awwwards, siteinspire, godly) for the chosen direction plus
  the client's sector; prefer studio and niche work. **Not the mega-brands** (Apple,
  Stripe, Linear): their DNA is already every model's default, so studying them is
  convergence dressed as research.
- Cap the whole pass at ~4–6 fetches. Two or three studied properly beat ten skimmed. A
  JS-heavy site that fetches thin gets dropped, not guessed at.
- Each researched site gets the same card treatment, marked `source: live research`, and
  the same two iron rules apply.
- Research informs **execution inside the already-chosen direction** — it never overrides
  the direction choice, the distance-from-previous-builds rule, or any design rule.

## How stage 04 consumes the cards

Read `references.md` before choosing a direction. Authority order: **the client's cards →
live research → the menu alone.** Take the Steal items (one influence per axis), honour
every Leave, and write into `design.md` which card fed which decision — one line each —
so the choices stay auditable back to the client's own taste.

## What this protocol refuses

- A verdict on a reference nobody rendered.
- Carrying a banned move because "the reference does it".
- Averaging references into mush instead of one influence per axis.
- More than five cards, or ten URLs nobody dissected ("look at these" → pick the best
  properly or decline the rest).
- Turning research into a taste survey — endless browsing with no extraction.
