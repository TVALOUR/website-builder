# Vetted Tools & Resources (Layer 3)

The approved list of tools this workspace may use, and the **security posture** for
each. If something isn't here, it hasn't been vetted — don't reach for it mid-build.
To add one, it must clear the bar in the last section.

## The design method lives in the vendored files

`shared/design/` **is** the
method, complete: the non-negotiables (`anti-slop-rules.md`), the divergence menu
(`stages/04_design/references/design-directions.md`), the cross-build memory
(`sites/variety-ledger.md`), the gate checklist (`pre-ship-gates.md`), the review
playbook (`visual-review.md`), and the imagery contract (`imagery.md`). Stage files
route each one; nothing here requires an install.

If your harness ships **optional design skills** (e.g. Claude Code's `hallmark`
slop-test/audit skill, or `frontend-design`), stages 04 and 06 may use them for
extra catalogue depth. They are never a dependency: the vendored files carry the
same non-negotiables and stand alone. Never fake an uninstalled skill's output;
say in the spec / QA report when one was used.

## In-repo static checker (no install, workspace-owned)

| Tool | Used at | What it does |
|------|---------|--------------|
| **`check-slop-gates.mjs`** | stage 06 | Node script (zero deps) that mechanically verifies the pattern-matchable slop gates: contrast math, token discipline, font-family count, italic headings, interactive-state coverage, reduced-motion presence, spacing scale, image-grid tracks, header overflow-wrap, uppercase/line-height collisions, duplicate sticky offsets. |

Run it with:

```
node shared/design/check-slop-gates.mjs sites/<name>
```

Exits non-zero on any FAIL. **It does not replace the stage-06 visual review** —
most gates (invented metrics, visual rhythm, composition, hero fold-fit) need
judgment on a rendered page. Treat FAIL as confirmed-blocking, WARN as "needs a
human look", and a clean run as "the mechanical subset passed" — not full clearance.

**Known limitations:** no real CSS cascade (only same-rule colour+background pairs
are contrast-checked); translucent colours report as WARN, not computed;
selector-name heuristics can over- and under-report interactive states.

## Review & testing tools (stage 06)

Review runs on the capability ladder in `visual-review.md` §1: a **browser tool
in the harness** when one exists (zero install — the default); otherwise the
**human is the reviewer** — serve the site (`python -m http.server` or open
`index.html`), tell them exactly what to look at per `visual-review.md`, and
record their answers as the review evidence. The tools below are the scripted
alternative — each needs the human's approval before any install.

| Tool | Maker | For | Posture |
|------|-------|-----|---------|
| **Your harness's browser tool** (e.g. Claude-in-Chrome) | your agent's vendor | Screenshots, multi-viewport sweep, DOM/text read, console — the default review when present | Already available if your harness ships one. No install. |
| **Playwright MCP** | Microsoft (`@playwright/mcp`, Apache-2.0) | Scripted cross-browser nav, headless screenshots, a11y-tree snapshots | Wire as an MCP server in your agent's config (`npx @playwright/mcp@latest`). **Ask first.** |
| **@axe-core/playwright** | Deque | WCAG 2.1/2.2 automated violation scan | `npx` in a scratch dir. **Ask first.** |
| **Lighthouse** | Google | Performance / Accessibility / SEO audits | `npx lighthouse <url>`. **Ask first.** |
| **pa11y** | open source | Quick CLI a11y scan | `npx pa11y <url>`. **Ask first.** |

Prefer `npx` over global installs; never add a dependency to a *built site* just to
test it.

## In-repo references that encode the method

- `shared/design/moodboard.md` — the owner's taste intake: dissected per-build
  reference cards, consumed by stage 04, expiring at promote.
- `shared/design/anti-slop-rules.md` — the design non-negotiables.
- `shared/design/pre-ship-gates.md` — the stage-06 gate checklist.
- `shared/design/visual-review.md` — how a built site gets reviewed.
- `shared/design/imagery.md` — the generated-imagery honesty contract.
- `shared/content/copywriting.md` — the real-business copy method.
- `_config/deploy.md` — deploy preservation (GitHub + Cloudflare Pages).

## The bar for adding anything new

1. **Reputable maker** — your agent's own vendor, Microsoft, Google, Deque, or a widely-used open-source
   project with real maintenance. No one-off repos.
2. **No unnecessary scripts** — it must not run code, fetch remote payloads, or
   touch files outside its job. Read its source/permissions first.
3. **Clear, single purpose** an existing tool doesn't cover.
4. **Least privilege** — prefer `npx`/one-off over global; prefer no-install when it
   suffices.
5. **The build stage stays offline** — review tooling belongs to stage 06, never
   wired into the automated build.

If it doesn't clear all five, it doesn't go in. When in doubt, don't add it.
