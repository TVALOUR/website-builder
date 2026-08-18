# Website-Builder — One-Time Setup

Answer these once. The agent writes the answers into `_config/` and every build reads
them as stable defaults. Re-run any time your preferences change.

> If the **Author / owner name** row in `_config/website-builder-config.md` no longer
> reads `<<OWNER_NAME>>`, setup is already done — skip this.

## Questions

1. **Author / owner name** — who "made" these sites (footer credit, repo author).
   Replaces the `<<OWNER_NAME>>` token in `_config/website-builder-config.md`
   (and in `LICENSE`, if you keep the MIT licence). _No default — this one is yours._

2. **Default tech stack** — the stack to use when a brief doesn't specify one:
   - `static` — hand-written HTML + CSS + vanilla JS with design tokens (default;
     simplest to host, fastest, zero build step).
   - `tailwind` — static HTML + Tailwind CSS (utility-first, still no framework).
   - `astro` — Astro (component-based, ships minimal JS, great for content sites).
   - `next` — Next.js (React; for app-like sites or when SSR/ISR is needed).
   _Default:_ `static`, overridable per brief at stage 01.

3. **Deploy / hosting target** — where finished sites go. Options: none (local
   only), GitHub Pages, Netlify, Vercel, Cloudflare Pages, custom.
   _Default:_ none (decide per site at promotion).

4. **Git policy for built sites** — should each finished site in `sites/<name>/`
   get its own Git repo at promotion? _Default:_ yes, local repo; push only when
   you say so.

5. **Site-naming style** — folder name for promoted sites under `sites/`.
   _Default:_ `kebab-case` of the site's short name (e.g. `example-clinic`).


## After answering

The agent fills `_config/website-builder-config.md` from Q1–Q5.

Then continue at `stages/01_brief/CONTEXT.md`.
