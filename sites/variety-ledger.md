# Variety Ledger — Cross-Build Design Memory (Layer 3 / registry)

The persistent record of **what every site built here looks like**, so the next one
doesn't repeat it. This is the memory that makes
[`anti-slop-rules.md`](../shared/design/anti-slop-rules.md) rule 10 ("Variety across
builds") *operational* instead of aspirational.

**The loop:**
- **Stage 04 reads this first.** Before choosing a direction, read every row. Pick a
  direction (from [`../stages/04_design/references/design-directions.md`](../stages/04_design/references/design-directions.md))
  that is a real distance from the recent builds — different **display-type genre**
  AND different **colour temperament**, not a recolour. Record your reasoning.
- **Stage 06 appends a row** when a site is promoted (every field below, honestly).

> **Distance rule:** a new build must differ from the **last two** rows on at least
> **two** of {display-type genre, colour temperament, macrostructure}. One swapped
> accent colour is not variety.

---

## Quick-scan table

*(Empty — this is a fresh install. Stage 06 appends the first row when the first
site is promoted.)*

| Date | Site | Direction | Display type | Colour temperament | Paper | Accent | Signature |
|------|------|-----------|--------------|--------------------|-------|--------|-----------|
| — | — | — | — | — | — | — | — |

> **The gravity well.** Left to itself, an AI design pass converges: soft serif or
> Inter, sage/teal green, warm cream paper, rounded cards. Once two consecutive rows
> share that shape, the next build **must leave it** — a different display genre and a
> different colour temperament, justified in the stage-04 spec. Watch this table for
> the drift; that is the whole point of keeping it.

---

## Full record

Add one block per promoted site, in promotion order. Keep it honest — a row that
flatters the build is worse than no row, because stage 04 reads it as ground truth.

```
### <date> — <site-name>

- **Direction:** <which of the design-directions menu, or a named custom one>
- **Display type:** <family + why it isn't a default>
- **Body type:** <family>
- **Colour temperament:** <cool / warm / neutral / dark-first — in words, not hex>
- **Paper:** <hex + description>
- **Accent:** <hex + how scarce, as a rough % of surface>
- **Macrostructure:** <the page rhythm — what replaces hero → 3 features → CTA>
- **Signature:** <the one device a viewer would remember>
- **Distance from the previous two rows:** <which two axes moved, concretely>
- **Known compromises:** <anything the brief forced that you'd otherwise avoid>
```
