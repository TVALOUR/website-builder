# Website-Builder Configuration (Layer 3)

The "house settings" for this workspace. Set via
[`../setup/questionnaire.md`](../setup/questionnaire.md); every build reads these
as stable defaults. A specific brief can override any of them — just say so at
stage 01 and note it in `stages/01_brief/output/brief.md`.

| Setting | Value | Used by |
|---------|-------|---------|
| Author / owner name | <<OWNER_NAME>> | footer credit, repo author, build report |
| Default tech stack | `static` (HTML + CSS + vanilla JS + design tokens) | stage 04–05 |
| Deploy / hosting target | decided per site at promotion; preserve any existing setup — details in [`deploy.md`](deploy.md) (GitHub = storage, Cloudflare Pages = host) | stages 01, 06 |
| Git policy for built sites | own local repo per site at promotion; push only on request | stage 06 |
| Site-naming style | `kebab-case` short name (e.g. `example-clinic`) | stage 06 |
| Placeholder token style | double-angle UPPER_SNAKE, e.g. OWNER_NAME wrapped in `<<`/`>>` | all stages |

## Stack options (override per brief)

- **`static`** — hand-written HTML/CSS/vanilla JS with a design-token layer.
  Default. No build step, trivially hostable anywhere, fastest to ship.
- **`tailwind`** — static HTML + Tailwind. Utility-first, still no framework.
- **`astro`** — component-based, ships minimal JS; ideal for content/marketing.
- **`next`** — Next.js/React; for app-like sites or when SSR/ISR is genuinely needed.

Pick the *simplest* stack that meets the brief. Reach for a framework only when
the site's interactivity or scale earns it — a brochure site does not.

## Notes

- These are defaults, not locks.
- Deployment detail (GitHub + Cloudflare Pages, preservation rules) lives in [`deploy.md`](deploy.md).
- Finished sites live in `../sites/<name>/`; the registry is `../sites/README.md`.
