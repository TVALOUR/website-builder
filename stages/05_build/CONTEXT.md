# Stage 05 — Build

Turn the four approved inputs into a real, runnable, distinctively designed site.
The design decisions are locked upstream in the spec — this stage is execution work.

**Run modes:** conductor — spawn on the **standard** tier (complex builds:
strongest), naming `references/build-prompt.md` in the spawn prompt as the
binding contract · solo — run inline. Tier table: [`../../_config/model-routing.md`](../../_config/model-routing.md).

**Rhythm:** → auto-proceed — build, then continue to QA unless the build report
flags a problem (missing input, unresolved placeholder), in which case pause and
raise it.

## Inputs

- Layer 4 (working): `../01_brief/output/brief.md` — stack, deploy, purpose.
- Layer 4 (working): `../02_sitemap/output/sitemap.md` — pages, nav, sections.
- Layer 4 (working): `../03_content/output/content.md` — the verbatim copy.
- Layer 4 (working): `../04_design/output/design-spec.md` — tokens + per-section layout.
- Layer 3 (reference): `../../shared/design/anti-slop-rules.md` — the non-negotiables.
- Layer 3 (reference): `../../shared/legal/legal-pages.md` + `../../shared/legal/consent.js` — the four baseline legal pages + the front-end-only cookie-consent template to wire in verbatim.
- Layer 3 (reference): `references/build-prompt.md` — the binding build contract.
- Layer 4 (working): `../04_design/output/asset-manifest.md` — generated-imagery direction (only if stage 04 produced one; see 05a note).

## Process

### 05a — Generated imagery: only if your setup has an image tool

If your environment has an image-generation tool and stage 04 produced an
`asset-manifest.md`, generate each asset per `../../shared/design/imagery.md` into
`output/site-assets/` before building. Without a tool, stage 04 records **"No
generated assets"** and you supply real images; if a manifest exists anyway, the
build uses each asset's named CSS/SVG/typographic **fallback** and leaves a
`<!-- TODO: needs asset … -->`. A missing image beats a slop one.

### 05b — Build the site

1. Confirm all four input files exist and are free of unresolved `<<PLACEHOLDER>>`
   / `[NEEDS: …]` tokens. If not, stop and resolve the upstream stage first.
2. Read the four inputs + `anti-slop-rules.md` + `references/build-prompt.md`.
   The build-prompt's contract binds you in full — verbatim content, exact tokens,
   every anti-slop rule, invent nothing. In addition:
   - You may use the shell — create folders, copy files, run a build step if the
     brief's stack needs one. Prefer the `static` stack; keep dependencies minimal.
   - If accepted generated assets exist under `output/site-assets/`, **copy them
     into `output/site/assets/`** and reference them with honest alt text.
   - No deploys, no git, no global installs — hard boundary.
3. Build the site **only** into `output/site/` using the stack named in the brief
   (default `static`). Use the content verbatim; apply the design tokens exactly;
   obey every anti-slop rule. Invent nothing.
   **Legal pages** — build all four baseline pages (`privacy.html`, `cookies.html`,
   `terms.html`, `accessibility.html`) from `content.md`'s legal section, same
   header/footer chrome and design tokens as every other page — not a stripped
   plain-text dump. Link all four from the footer. If a Cookie Policy ships, copy
   `../../shared/legal/consent.js` verbatim to `output/site/js/consent.js` and wire
   the banner markup + footer "Cookie preferences" button per its header comment;
   any analytics/marketing script ships inert (`type="text/plain"
   data-consent="…"`) until consent is granted. Zero non-essential scripts → still
   ship the banner shell so the Cookie Policy's claims stay true.
4. Write `output/build-report.md`: stack used, file tree, run/preview steps, tokens
   applied, any TODOs/missing inputs, and a self-check against `pre-ship-gates.md`.
5. Stop. Do not run QA or promote — that's stage 06.

## Outputs

`site/` (the built website) -> output/
`build-report.md` -> output/

## Review

Before stage 06, confirm everything was written only inside
`output/site/`, the report is present, and the build is runnable. Contract
violations (stray files, fabricated content, substituted fonts) are reverted and
the build re-run with a tightened prompt.
