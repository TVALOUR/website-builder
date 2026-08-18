# Generated Imagery — The Honesty Contract (Layer 3)

The rules for any AI-generated image in a build. **This workspace wires no image
generator by default** — if your setup has one (an image tool, an MCP), this file
binds it; if not, stage 04 records **"No generated assets"** and the design uses
real client assets and CSS/SVG only. Either way the floor below never moves.

## 1. When to generate — and when not to

Generate an image only when it does a job nothing cheaper does. In order of
preference:

1. **Real client assets** the brief provides — always beat generated ones.
2. **CSS / hand-built SVG** — icons, simple decoration, geometric motifs,
   gradients-as-texture. Cheaper, sharper, scalable, no slop risk. Prefer this.
3. **Generated imagery** — only for things 1–2 can't supply: an atmospheric hero
   texture, an editorial illustration, a background pattern, a matched set of spot
   illustrations. It must earn the bytes.

Do **not** generate filler. An empty, well-typeset section beats a decorative AI
image that adds nothing.

## 2. Allowed subjects

Generated imagery must be **non-photoreal or clearly illustrative/atmospheric**, in
one visual language matched to the design tokens: textures & atmospherics (paper,
grain, fog, light, gradient washes) · editorial illustration (flat, line, woodcut,
risograph, collage) · spot icons/pictograms as a matched set · patterns & generative
motifs · abstract conceptual hero art.

> **Narrow exception:** a build **explicitly flagged as demo/template/test in its
> brief** may also use atmospheric scenery that reads as photographic (landscape,
> weather, texture) — relaxing only the non-photoreal rule, only for scenery with
> **nothing** from §3, declared `generated: yes` in the manifest, with a visible
> footer note, and marked `[NEEDS: real photographs]` before any live use.

## 3. Forbidden subjects — the honesty floor (never generate)

- **Photoreal people presented as real** — owners, staff, customers, testimonial
  faces. If the site implies a real human, only a real client-supplied photo may appear.
- **Real-looking premises, locations, or facilities** that don't exist as shown.
- **Products-as-real** — a photoreal shot of a product that isn't a genuine photo.
- **Logos, wordmarks, badges, seals, "as seen in", partner marks.**
- **Awards, certifications, accreditations, ratings, credential imagery.**
- **Maps, charts, or infographics asserting real data** — build those from real data
  in code.
- **Anything a viewer would read as a factual claim** about the business.

When a real photo is needed and none exists, leave a labelled
`<!-- TODO: needs real photo of … -->` and tell the owner — never paper over it with
a generated face.

## 4. The anti-slop image checklist (reject any hit)

Review **every** generated file by opening and looking at it. Any tell = regenerate
with a specific corrective prompt (max ~2 tries) or drop to the fallback:

- **Anatomy:** wrong fingers/hands, extra limbs, garbled teeth, waxy skin, dead
  eyes, the over-blurred bokeh-portrait look.
- **Text & marks:** garbled letterforms, invented logos/signage/UI text, watermark
  ghosts.
- **Scene:** melted or duplicated objects, impossible perspective, cloned patches,
  shadows/reflections that don't match the light.
- **Light & colour:** HDR "AI glow", oversaturation, uniform plastic sheen,
  everything-in-focus or everything-soft.
- **Fit:** blandly-centred stock composition, off-brand palette/mood, a set that
  doesn't share one visual language.

Borderline = fail. The bar is "a studio would ship this", not "good enough".

## 5. Prompt discipline

Name the medium and style explicitly ("flat vector illustration", "risograph
two-colour print"); avoid photoreal humans entirely; pin the palette to the design
tokens and the dimensions to the layout; state what must NOT appear ("no text, no
logos, no watermark, no faces"); reuse one style sentence across a batch so the set
coheres; keep subjects simple.

## 6. Technical bar & provenance

SVG for vector/flat; optimised WebP (or JPG/PNG) for raster; generate at the size
the layout uses; always set explicit `width`/`height`; decorative images get
`alt="" aria-hidden="true"`, meaningful ones get honest, descriptive alt text. Every
generated asset is **declared** in `asset-manifest.md` (`generated: yes`) and never
described in copy, alt, or metadata as a real photograph.

## Fallback — image-gen never blocks a ship

If generation is unavailable or every retry fails §4, the build proceeds **without**
the image, using the manifest's CSS/SVG/typographic fallback, and logs a `TODO` in
the report. A site that ships clean without a hero texture beats one that ships with
a six-fingered hand.
