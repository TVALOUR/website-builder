# Asset Manifest — Template (Layer 3)

Fill this at **stage 04** when the design calls for generated imagery; it
writes the result to `stages/04_design/output/asset-manifest.md`. It is the compact,
text-only art direction that the stage-05a image step (if an image tool is wired)
hands to stage 05. Keep it tight — one block per asset. No pixels live here.

Read [`../../../shared/design/imagery.md`](../../../shared/design/imagery.md) first:
it defines allowed subjects (§4), the honesty floor (§5), the slop checklist (§6),
and prompt discipline (§7). Every asset below must satisfy them.

If the design needs **no** generated imagery, write exactly:
`No generated assets — imagery is CSS/SVG/typographic and/or client-supplied.`
…and skip stage 05a entirely.

---

## Shared style (applies to every asset — keeps the set coherent)

- **Medium / style:** <<e.g. flat two-colour risograph illustration>>
- **Palette (from design tokens):** <<list the actual hues, e.g. paper oklch(...), accent oklch(...)>>
- **Mood:** <<one line, tied to the brief's "why">>
- **Never include:** text, logos, watermarks, faces, real people/premises/credentials.

## Assets

Repeat one block per image:

### asset-01

- **Filename:** `assets/<name>.<webp|svg|png>`
- **Purpose / placement:** <<where it goes, e.g. home hero background>>
- **Subject:** <<what it depicts — must be in imagery.md §4, never §5>>
- **Style line:** <<the explicit medium/style sentence, reusing the shared style>>
- **Dimensions / aspect:** <<e.g. 1600×900 (2× for HiDPI), or "scalable SVG">>
- **Transparency:** <<solid | transparent>>
- **Alt text:** <<honest, descriptive — or "" if purely decorative>>
- **Decorative only:** <<yes → aria-hidden; no → needs real alt>>
- **Generated:** yes
- **Fallback if it fails review:** <<CSS gradient | hand-SVG | omit the element>>

### asset-02

…

---

**Self-check before handing off (stage 04):**

- [ ] Every subject is in imagery.md §4 and **none** in §5 (no people/logos/premises/credentials).
- [ ] Every asset has a fallback that ships clean if generation is dropped.
- [ ] The set shares one style line (coheres).
- [ ] Palette and aspect ratios come from the design tokens, not guessed.
- [ ] Alt text is honest and never claims a generated image is a real photo.
