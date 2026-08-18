# Design Directions — The Divergence Menu (Layer 3)

A catalogue of genuinely distinct **design archetypes** to choose *between* at stage
04. Its job is the opposite of `anti-slop-rules.md`: that file says what to *avoid*;
this file forces a *spread*. Avoiding the defaults is not the same as being different
from the last site — the model has its own "tasteful default" and will land on it
every build unless something pushes it elsewhere. This menu is that push.

> **Use this with [`../../../sites/variety-ledger.md`](../../../sites/variety-ledger.md).**
> Read the ledger first, see which directions/palettes/fonts the recent builds used,
> then pick from this menu something a real distance away — justified by *this*
> client, not by taste.

This is the workspace's theme catalogue in decision form. The vendored design
files carry the depth; use them for the full
catalogue. This file is the floor that guarantees the *choice* actually happens.

---

## The gravity well — read this before you pick

Left unconstrained, this workspace converges on one look:

> **soft serif (almost always Fraunces) + sage/teal-green accent + warm off-white
> "paper" + generous editorial whitespace.**

Unwatched builds land there again and again — watch your own ledger fill. It is a *fine* look — that's
the trap. It's the local maximum the model relaxes into. **If your chosen direction
is drifting toward Fraunces + green + cream and the brief did not specifically
demand a warm-organic feel, stop and pick a different direction.** Variety is a
requirement, not a tiebreaker.

Three concrete escape levers, in order of impact:
1. **Different display-type genre** — if the last build was a serif, this one is a
   grotesque, a mono, a slab, or a condensed signage face. Type genre is the single
   biggest driver of "this feels like a different studio made it."
2. **Different colour temperament** — if the last was warm earth, this is cool steel,
   or stark mono + one signal colour, or saturated spot inks. Move the *whole*
   temperature, not one swatch.
3. **Different macrostructure** — a different page skeleton (see each direction's
   "structure" note), not the same skeleton recoloured.

---

## How to use this menu

1. From the brief's **sector, audience, voice, and any reference sites**, shortlist
   2–3 directions below that genuinely *fit the client*.
2. Cross out any that collide with a recent ledger row (same type genre **and**
   colour temperament as the last 1–2 builds).
3. Pick one with a clear "why this client" sentence. You may **blend two** directions
   if the brief justifies it — but say which two and why, and the blend must still
   read as distinct from prior builds.
4. Carry the chosen direction into the token system (step 3 of the stage-04 process)
   and record it in the ledger.

Then design *against the second-order tells* from the outset — picking a non-default
direction is necessary but not sufficient (see [`../../../shared/design/anti-slop-rules.md`](../../../shared/design/anti-slop-rules.md)
§11). Before locking the layout:

- **Plan the negative space as composition.** For every large gap — the open side of an
  asymmetric hero especially — decide what *holds* it (a hairline/rule system, an honest
  index or figure, structural numerals, oversized type bleed). If the answer is "nothing,"
  the layout is mechanical asymmetry and will read as generated. Empty ≠ negative space.
- **Ration the signature.** Assign the direction's recurring motif (eyebrow, `>` prompt,
  `//` label, numeral tag) to a **minority** of section openings — the entry/statement/exit
  beats — not to every heading. Decide up front which sections open bare.
- **Give the page ≥2 distinct section archetypes.** Don't let every band share one
  padding and one skeleton; no two identical splits in a row.
- **Check the POV is executable.** If a constraint (e.g. a single-font mandate) removes
  the mechanism a direction depends on — mono for "Terminal", a display serif for
  "Editorial" — either re-earn the concept another way or rename the direction so it
  matches what the tokens can actually render.

Font names below are **starting points, not mandates** — all are distinctive and (where
noted) Google-Fonts-available so a static build can load them. The rule is *intent*:
name faces that suit the direction, never reach for the same one out of habit, and
never use the banned tells (Inter/Roboto/Open Sans/Poppins/Lato/system as display).

> **This menu is the vocabulary floor, not the ceiling.** It's a static snapshot and
> will drift stale; a menu followed long enough becomes its own gravity well. After
> picking a direction, run the live-research pass in
> [`live-references.md`](live-references.md) — 2–3 current real-studio sites in the
> chosen direction — so the *execution* (actual font pairings, palette temperaments,
> structural moves) comes from what studios ship now, not from this file's starting
> points alone.

---

## The directions

### 1. Swiss / International Typographic
- **POV:** Order, objectivity, the grid is the design. Content speaks; the layout gets out of the way.
- **Fits:** design studios, consultancies, architecture, B2B with a precision story, fintech that wants "serious."
- **Structure:** strict modular grid; flush-left ragged-right; generous margins; asymmetric balance; almost no decoration.
- **Type:** a clean neo-grotesque — *Söhne / Neue Haas* (premium) → **Schibsted Grotesk, Hanken Grotesk, Archivo, Geist** (Google). One family, many weights.
- **Colour:** black + white + grey, **one pure signal** (classic Swiss red, or a single saturated hue). Tint neutrals minimally.
- **Signature:** an oversized index number, a hairline rule system, or type set to a visible baseline grid.
- **Avoid the well by:** no serif, no earth tones — this is the cleanest possible counter to warm-organic.

### 2. Editorial / Magazine
- **POV:** This site is a publication. Headlines, columns, a reading rhythm.
- **Fits:** agencies, restaurants, publishers, essays, portfolios, anything voice-led.
- **Structure:** multi-column text, drop caps or standfirsts, pull-quotes, an article-like flow rather than marketing bands.
- **Type:** a *characterful* serif display — **Newsreader, Spectral, Source Serif 4, Libre Caslon, Petrona, Gloock** (Google), *GT Sectra / Canela / Tiempos* (premium) — with a humanist body. **Reach past Fraunces** here on purpose.
- **Colour:** ink on warm paper + **one** editorial accent (vermilion, oxblood, ink-blue).
- **Signature:** a masthead, an issue/date numeral, a running marginal note.
- **Avoid the well by:** if you use a serif, it must *not* be Fraunces and the accent must *not* be green — that combo is the gravity well.

### 3. Brutalist / Raw
- **POV:** Exposed structure, honesty of materials, no polish-for-polish's-sake.
- **Fits:** indie tools, music, art, fashion, anything that wants edge and anti-corporate signalling.
- **Structure:** hard borders, visible boxes, monospace labels, stark contrast, intentional "unstyled" moments, big raw type.
- **Type:** mono + grotesque — **JetBrains Mono / Spline Sans Mono / Departure Mono** + **Archivo / Familjen Grotesk**.
- **Colour:** off-white + near-black + **one hazard accent** (acid yellow, hot pink, electric blue).
- **Signature:** a literal cursor, exposed metadata, a marquee, a hard grid of bordered cells.
- **Avoid the well by:** built-in — there is no soft serif or earth tone here.

### 4. Technical / Terminal
- **POV:** Built for people who read docs. Density, precision, data over decoration.
- **Fits:** dev tools, APIs, infrastructure, security, data products.
- **Structure:** tight information density, mono for code/labels, tables, status chips, optional dark engineer mode (tinted, never `#000`).
- **Type:** mono + a tight grotesque — **IBM Plex Mono / Geist Mono / Martian Mono** + **Geist / Space Grotesk / Inter Tight** *(body only)*.
- **Colour:** charcoal or paper base + a **cool signal** (electric blue, terminal green, cyan-as-accent-only).
- **Signature:** a live-looking status line, a command snippet with a real prompt, a monospaced data rail.
- **Avoid the well by:** cool + technical is the opposite temperature to warm-organic.

### 5. Warm Organic / Handcrafted  ⚠️ *the gravity well*
- **POV:** Tactile, earthy, human, made-by-hand.
- **Fits:** *genuinely* wellness, food, craft, sustainability — and only when the brief truly asks for it.
- **Structure:** soft edges, generous air, hand-feel motifs.
- **Type:** soft serif + humanist sans.
- **Colour:** clay, ochre, sage, cream.
- **⚠️ Caution:** this **is** the default the workspace over-uses. Pick it only when the brief demands it, and even then **differentiate the palette and display face from every prior organic build in the ledger** (don't repeat green+cream+Fraunces). If two recent builds are already here, pick something else.

### 6. High-Contrast Monochrome / Minimal
- **POV:** Confidence through restraint. Near-black, near-white, one whisper of colour, lots of air.
- **Fits:** luxury, fashion, photography, architecture, premium services.
- **Structure:** vast whitespace, a few very large elements, image- or type-led, minimal chrome.
- **Type:** one strong face used at extremes of scale — a refined grotesque or a single display serif used *sparingly*.
- **Colour:** tinted off-black + off-white + **one** restrained accent (≤ 5%).
- **Signature:** a single hero gesture — huge type, one full-bleed image, a thin kinetic line.
- **Avoid the well by:** the discipline is monochrome, not earth-toned warmth.

### 7. Retro-Print / Risograph
- **POV:** Limited spot inks, halftone texture, the charm of cheap printing done well.
- **Fits:** events, food, music, indie brands, culture.
- **Structure:** poster-like compositions, overprint, layered shapes, big condensed type.
- **Type:** condensed or geometric display + a plain body — **Anton / Archivo Expanded / Bricolage Grotesque / Syne**.
- **Colour:** **2–3 spot inks** (riso blue, fluoro orange, forest, bubblegum) with deliberate overprint, on cream or newsprint.
- **Signature:** halftone texture, registration-offset overlap, a drawn stamp/badge.
- **Avoid the well by:** spot-ink palettes are nothing like the single-green default.

### 8. Maximalist / Expressive
- **POV:** More is more — but every layer is motivated. Energy, density, personality.
- **Fits:** creative agencies, fashion, festivals, youth/culture brands.
- **Structure:** overlap, scale jumps, edge-to-edge type, layered colour fields — controlled chaos.
- **Type:** a loud display (**Unbounded, Syne, Bricolage Grotesque, Gloock**) + a calm neutral body.
- **Colour:** saturated and plural, but disciplined to a defined set; strong contrast.
- **Signature:** type that breaks the grid, a colour field that bleeds, kinetic scale.
- **Avoid the well by:** colour-forward maximalism is the inverse of restrained earth tones.

### 9. Corporate Modern / Trust
- **POV:** Credible and structured without being templated. Competence you can feel.
- **Fits:** legal, finance, healthcare, B2B services, consultancies.
- **Structure:** clear hierarchy, confident sections, real proof elements — but *break* the hero→3-cards→CTA rhythm explicitly.
- **Type:** a professional grotesque or humanist sans + an optional serif for headlines — **Albert Sans, Onest, Figtree, Schibsted Grotesk** + (opt.) **Newsreader/Spectral**.
- **Colour:** **one confident brand hue** done deliberately (deep blue, teal, burgundy, forest, slate) + tinted neutrals. **No purple→blue gradient.**
- **Signature:** a structured proof band, a credential rail, a deliberate accent system.
- **Avoid the well by:** commit to a *non-green* brand hue when the last build was green (this direction's classic drift is a "confident hue" relaxing back into the warm-organic well — don't let it).

### 10. Geometric / Bauhaus
- **POV:** Primary shapes, geometric type, the joy of the grid and the circle.
- **Fits:** design, education, culture, modern consumer brands.
- **Structure:** shape-driven composition, circles/triangles/blocks as structure, primary-ish colour.
- **Type:** a geometric sans — **Space Grotesk, Sora, Lexend, Object Sans** (avoid Poppins/Futura-clones-as-tell).
- **Colour:** primaries or a bold trio on paper; flat, confident fills.
- **Signature:** a recurring geometric motif that organises the whole page.
- **Avoid the well by:** geometric flat colour ≠ soft organic warmth.

### 11. Soft / Friendly Rounded
- **POV:** Approachable and human without being childish or generic.
- **Fits:** childcare, community, consumer apps, care services, education.
- **Structure:** generous rounding, clear steps, warm but legible hierarchy.
- **Type:** a rounded humanist + a clear body — **Quicksand *(caution: overused)* → Fredoka, Baloo 2, Hanken Grotesk** used warmly.
- **Colour:** soft and distinct — **not** lavender/pastel-purple defaults; pick an owned warm or fresh palette.
- **Signature:** a friendly motif, rounded cards used *non-generically*, a hand-drawn accent.
- **Avoid the well by:** rounded-friendly is a different temperature from earthy-organic; and steer clear of the pastel-lavender SaaS default.

### 12. Dark / Cinematic
- **POV:** Drama and focus. A dark stage that makes type and imagery glow.
- **Fits:** film, hospitality, premium products, music, events.
- **Structure:** dark base (always **tinted**, never `#000`), spotlighted content, big imagery or type, deep section contrast.
- **Type:** a high-contrast serif or a strong grotesque at large scale.
- **Colour:** deep tinted dark (warm coal, midnight, forest-black) + **one** warm or jewel accent.
- **Signature:** a glow/spotlight motif, a single full-bleed cinematic image, dramatic scale shifts.
- **Avoid the well by:** dark is the literal opposite of warm-paper light.

### 13. Document / Academic
- **POV:** Knowledge-forward, almost a printed paper. Restraint and citation.
- **Fits:** research, education, policy, long-form, institutions.
- **Structure:** single readable column, footnotes/margin notes, numbered sections, a contents rail.
- **Type:** a readable text serif + mono for notes — **Source Serif 4, Newsreader, Lora, Petrona** + **IBM Plex Mono**.
- **Colour:** paper + ink + **one** citation accent (link-blue, annotation-red).
- **Signature:** real footnotes, a sticky table of contents, a margin-note system.
- **Avoid the well by:** scholarly restraint with a cool/neutral accent, not a green marketing site.

### 14. Industrial / Utilitarian
- **POV:** Heavy, functional, signage-like. Built for trades and machines.
- **Fits:** construction, manufacturing, automotive, logistics, trades.
- **Structure:** signage hierarchy, stencil/condensed caps, strong horizontal bands, utilitarian tables/specs.
- **Type:** a condensed grotesque / signage face — **Archivo Narrow, Saira Condensed, Anton, Oswald** *(caution)*.
- **Colour:** steel, concrete, **hazard yellow/orange**, oxidised red — industrial, not pretty.
- **Signature:** signage stripes, a spec table, stencilled numerals, a heavy rule system.
- **Avoid the well by:** industrial weight and hazard colour are nothing like soft sage/cream.

### 15. Refined Luxury / Fashion
- **POV:** Luxury as restraint and space. Couture confidence.
- **Fits:** fashion, jewellery, beauty, fine hospitality, premium goods.
- **Structure:** sparse, image-led, wide letter-spacing, vast margins, very few elements per view.
- **Type:** a high-contrast didone or refined serif + a minimal sans — **Bodoni Moda, Cormorant, Italiana, DM Serif Display** + a quiet grotesque.
- **Colour:** monochrome or near-monochrome + a single jewel/metallic restraint; very low accent footprint.
- **Signature:** dramatic letter-spacing, one hero image at scale, luxurious negative space.
- **Avoid the well by:** didone elegance + monochrome is a different planet from warm-organic.

---

## Adding a direction

New directions are welcome, but keep the spread honest: a new entry must be a
*genuinely distinct* archetype (different type genre **or** colour temperament **or**
macrostructure from the existing fifteen), with a clear "fits" list and a named
font/colour starting point. Don't add near-duplicates of the gravity well.
