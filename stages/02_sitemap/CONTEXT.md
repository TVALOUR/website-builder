# Stage 02 — Sitemap

Turn the brief into the site's **information architecture**: the pages, how they
connect, and what each one contains.

**Run modes:** conductor — spawn on the **cheap** tier (complex builds:
standard) · solo — run inline. Tier table: [`../../_config/model-routing.md`](../../_config/model-routing.md).

**Rhythm:** → auto-proceed — sanity-check the sitemap and continue (pause if the
structure misreads the brief; the human can say "show me the sitemap" to review).

## Inputs

- Layer 4 (working): `../01_brief/output/brief.md`
- Layer 3 (reference): `../../shared/design/anti-slop-rules.md` — structure rules (no templated rhythm).
- Layer 3 (reference): `../../shared/legal/legal-pages.md` — the four baseline legal pages every build ships by default.

## Process

1. **Page list** — finalise the pages from the brief's scope. For each: a clear
   name, a URL/path (e.g. `/`, `/about`, `/services/physio`), and its job in one
   line. Keep it as small as the goal allows — fewer, stronger pages beat many thin ones.
   **Always append the four baseline legal pages** (Privacy Policy, Cookie Policy,
   Terms of Use, Accessibility Statement) as a fixed tail per
   `../../shared/legal/legal-pages.md` — footer-only nav, own "Legal (baseline)"
   subheading in `sitemap.md` — unless the brief explicitly opts one out.
2. **Navigation** — primary nav items and order; any secondary/footer nav; mobile
   nav approach. Don't default to the AI nav fingerprint (see anti-slop-rules §4).
3. **Per-page sections** — for each page, list its sections **in order** with a
   one-line purpose each (e.g. Home: intro statement → proof → services preview →
   contact prompt). This is the skeleton stage 03 writes copy into and stage 05
   builds. Deliberately vary section rhythm across pages; avoid hero→3-cards→CTA.
4. **Global elements** — header, footer, and any cross-page components (contact
   block, booking CTA), noted once.
5. **Flows** — the key user journey(s) to the goal (e.g. land → services → book).

Make the structure concrete enough that stage 03 knows exactly what copy each
section needs, and stage 05 knows exactly what to build.

## Outputs

`sitemap.md` -> output/

Plus: update `../../SESSION.md` — tick stage 02, one-line note, mark 03 **NEXT**.

## Review

Before stage 03, confirm the page list and per-page sections match the brief's
goal and scope — this is the contract content and build both rely on.
