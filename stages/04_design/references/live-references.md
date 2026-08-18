# Live Reference Research — Grounding Stage 04 in Current Studio Work (Layer 3)

The 15-archetype menu in [`design-directions.md`](design-directions.md) is a
**vocabulary floor**, not a ceiling. A static menu drifts stale, and after enough
builds it becomes its own gravity well — the same convergence problem the variety
ledger exists to catch, one level up. This protocol keeps each build's *execution*
grounded in what real studios are shipping **now**.

**When:** every standard/complex build, after the direction is shortlisted (stage 04
step 1) and before tokens are locked. Simple-tier builds may skip it. Client-supplied
references in `_intake/references/` take priority — run this *in addition* only if
they leave gaps.

## The rules (read before researching)

1. **Extract DNA, never copy identity.** You are harvesting *genre-level* moves —
   type genre, colour temperament, macrostructure, one signature gesture — not a
   specific site's look. If your spec would let a viewer name the reference site,
   you copied. No lifted wordmarks, layouts reproduced section-for-section,
   distinctive illustrations/motifs, or verbatim palettes.
2. **References inform execution, not direction.** The divergence choice (step 1,
   ledger + distance rule) is already made before you research. A stunning reference
   from the wrong direction does not override it.
3. **Anti-slop rules still bind.** A real site using gradient text or Inter-as-display
   is not a licence — the non-negotiables in `../../shared/design/anti-slop-rules.md`
   beat any reference.
4. **Bounded effort.** 2–3 references studied properly beats 10 skimmed. Cap the
   research at ~4–6 fetches total; if nothing good surfaces, fall back to the menu
   alone and say so in the spec.

## How to research

Use your **web search + fetch** tools if the harness has them (`AGENTS.md` § Run
modes; without web access, design from the menu alone and say so in the spec). A
conductor-spawned sub-agent must never contend for the human's live browser —
search + fetch only.

1. **Search** for current gallery/award pages matching the chosen direction +
   client sector, e.g. `site:awwwards.com [sector]`, `siteinspire [direction keyword]`,
   `godly.website [sector]`, `"best [sector] websites" 2026 design`. Prefer curated
   galleries over listicles.
2. **Shortlist 2–3 candidate sites** from the results that fit the chosen direction
   and the client's sector/audience.
3. **Fetch each candidate** and extract its real DNA — not vibes, values:
   - type: family names from CSS/`<link>` font loads; display genre (grotesque /
     didone / mono / condensed…)
   - colour: actual hex/oklch values from stylesheets; temperament (warm/cool/mono/spot)
   - macrostructure: section skeleton, nav pattern, hero shape, footer pattern
   - one signature move worth *adapting* (not lifting)
   JS-heavy sites may fetch thin — drop them and pick another candidate rather than
   guessing.
4. **Reconcile across the 2–3 extractions** — take one clear influence per axis;
   where sources disagree, prefer the move that fits the chosen direction and the
   client's sector, and record what was deliberately *not* taken.

## What it feeds

- **The token system (step 4):** real, current font pairings and palette temperaments
  in the chosen direction — instead of the model's trained-in defaults or the menu's
  static starting points.
- **The design spec's divergence justification:** list the reference URLs studied and
  one line each on what was taken (and deliberately *not* taken). Stage 06 copies this
  into the variety ledger on promote, so future builds can also check they aren't
  converging on the same references.

## Failure modes to refuse

- Turning research into a taste survey — endless browsing with no extraction.
- Averaging the references into mush. Take **one** clear influence per axis.
- Citing a reference to justify breaking the distance rule or an anti-slop rule.
- Studying only famous mega-brand sites (Apple, Stripe, Linear) — their DNA is
  already the model's default; that's convergence, not research. Prefer studio and
  niche work.
