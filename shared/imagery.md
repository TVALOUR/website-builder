# Generated imagery — the honesty contract

The rules for any AI-generated image in a build. **This repo wires no image generator** —
if your session has one (an image tool, an MCP), this file binds it; if not, stage 04
records "no generated assets" and the design uses real client assets and CSS/SVG/type
only. The floor below never moves either way.

## 1. When to generate — and when not to

An image must do a job nothing cheaper does. In order of preference:

1. **Real client assets** from `_intake/` — always beat generated ones, and the honesty
   floor bans *inventing* imagery, not using what the client actually gave you.
2. **CSS / hand-built SVG** — icons, geometric motifs, texture, structure. Cheaper,
   sharper, scalable, zero slop risk.
3. **Generated imagery** — only for what 1–2 cannot supply: an atmospheric texture, an
   editorial illustration, a matched set of spot illustrations. It must earn the bytes.

Never generate filler. A well-typeset section with no image beats a decorative one that
says nothing.

## 2. Allowed subjects

Non-photoreal or clearly illustrative, in one visual language matched to the design
tokens: textures and atmospherics (paper, grain, fog, light) · editorial illustration
(flat, line, woodcut, risograph, collage) · spot icons as a matched set · patterns and
generative motifs · abstract conceptual hero art.

## 3. Forbidden subjects — never, in any regime

- **Photoreal people presented as real** — owners, staff, customers, testimonial faces.
- **Real-looking premises, locations or facilities** that do not exist as shown.
- **Products-as-real** — a photoreal shot of a product that is not a genuine photo.
- **Logos, wordmarks, badges, seals, "as seen in", partner marks.**
- **Awards, certifications, accreditations, credential imagery.**
- **Maps, charts or infographics asserting real data** — build those from real data in
  code.
- Anything a viewer would read as a factual claim about the business. Generating one is
  the same offence as inventing a price; stock photography of someone else's premises is
  the same offence with a receipt.

When a real photo is needed and none exists, leave `[NEEDS: real photo of …]` and tell
the owner. A site with no photographs and real confidence beats a site wearing somebody
else's.

## 4. The reject checklist (open every generated file and look)

Any hit = one corrective regeneration at most, then fall back to CSS/SVG/type:

- **Anatomy:** wrong hands, extra limbs, garbled teeth, waxy skin, the over-blurred
  bokeh-portrait look.
- **Text and marks:** garbled letterforms, invented logos or signage, watermark ghosts.
- **Scene:** melted or cloned objects, impossible perspective, shadows that disagree
  with the light.
- **Light and colour:** HDR glow, oversaturation, uniform plastic sheen.
- **Fit:** off-palette, off-mood, or a set that does not share one visual language.

Borderline is a fail. The bar is "a studio would ship this", not "good enough".

## 5. Prompt discipline

Name the medium explicitly ("flat vector illustration", "risograph two-colour print");
pin the palette to the design tokens and the dimensions to the layout; state what must
not appear ("no text, no logos, no faces, no watermark"); reuse one style sentence
across the batch so the set coheres.

## 6. Declaration — every generated asset is on the record

Stage 04's `design.md` carries an asset list, one line per intended asset:

```
- assets/img/hero-texture.webp — generated: yes — "slate paper texture, brand-cool grey"
  — alt: "" (decorative) — fallback: CSS gradient wash — 1600×900
```

Stage 05 builds only what the list names, at the size the layout uses, with explicit
`width`/`height`, honest alt text (or `alt="" aria-hidden` if decorative) — and never
describes a generated image, in copy or metadata, as a photograph of anything real. A
failed or skipped asset uses its named fallback and leaves `<!-- TODO: needs asset … -->`
— generation never blocks a ship.
