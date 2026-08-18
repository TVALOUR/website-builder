# Stage 03 — Content

Write the **real copy** for every section of every page, in the brand's voice.

**Run modes:** conductor — spawn on the **standard** tier (all build tiers —
copy quality is the product) · solo — run inline. Tier table: [`../../_config/model-routing.md`](../../_config/model-routing.md).

**Rhythm:** → auto-proceed — sanity-check the copy and continue (pause if the copy
invents facts; the human can say "show me the content" to review).

## Inputs

- Layer 4 (working): `../01_brief/output/brief.md` — voice, audience, known facts.
- Layer 4 (working): `../02_sitemap/output/sitemap.md` — the sections to fill.
- Layer 3 (reference): `../../shared/content/copywriting.md` — the copy method (UVP, frameworks, voice, honesty).
- Layer 3 (reference): `../../shared/design/anti-slop-rules.md` — §6 honest content.
- Layer 3 (reference): `../../shared/legal/legal-pages.md` — section templates for the four baseline legal pages.

## Process

1. **Legal pages first (mechanical, do it before the creative copy).** Write the
   four baseline legal pages per `../../shared/legal/legal-pages.md`'s section
   templates, using only facts `brief.md` supplies. Never invent a company
   registration number, address, or data-protection contact — label a gap
   `[NEEDS: …]` like any other missing fact. Skip only the pages `brief.md`
   explicitly opts out of.
2. **Set the value proposition first.** Per `copywriting.md §2`, draft the UVP — the
   concrete who/outcome/why-this-business promise — and lead `content.md` with it so
   stages 04–05 share one north-star message. Don't invent a differentiator.
3. Walk the sitemap **section by section** and write the actual text each needs:
   headlines, subheads, body copy, button labels, captions, microcopy, alt-text
   intent, form labels, meta title/description. Use the section-by-section and
   framework guidance in `copywriting.md` (vary PAS/AIDA/FAB/BAB; don't template
   the page); apply the "could this appear on a competitor's site?" filler test.
4. **Voice** — match the tone adjectives from the brief. Specific, human, concrete.
   No filler, no "Welcome to our website," no marketing cliché.
5. **Honesty (hard rule)** — use only facts the brief supplies. **Never invent**
   metrics, testimonials, client names, prices, credentials, team members, or
   addresses. Where a real fact is needed but unknown, write a clearly labelled
   placeholder like `[NEEDS: opening hours]` and list it under "Open questions" so
   the human can fill it — do not fabricate.
6. **No lorem ipsum.** Every word is shippable or an explicit labelled placeholder.
7. Keep copy lengths realistic for the layout (a hero lede ~2 lines / ≤60ch; body
   measure 45–75ch). Note any section where the right length depends on the design.
8. Provide SEO meta per page and a single, consistent CTA voice.

Organise the output by page, then by section, matching the sitemap's order exactly
so stage 05 can drop copy straight into the build.

## Outputs

`content.md` -> output/

Plus: update `../../SESSION.md` — tick stage 03, one-line note, mark 04 **NEXT**.

## Review

Before stage 04, confirm there's no invented fact and no `lorem`; resolve or
explicitly defer every `[NEEDS: …]` placeholder.
