# Stage 01 — Brief

Capture **what** this website is, **who** it's for, and **why** — the decisions
every later stage depends on.

**Run modes:** conductor — spawn this stage on the **standard** tier (simple
builds: cheap) · solo — run it inline. Tier table: [`../../_config/model-routing.md`](../../_config/model-routing.md).

**Rhythm:** ◆ collaborative checkpoint — discuss what the site is with the human
and lock the brief before auto-proceeding to sitemap/content (see `AGENTS.md`).

## Inputs

- Layer 4 (working): **`../../_intake/`** — the client's supplied brief and materials,
  if any (PDF / txt / md / docx requirements; `assets/` real logos & photos;
  `references/` inspiration). See `../../_intake/README.md`. The primary requirements
  source when present.
- Layer 4 (working): the human's description of the site they want (this conversation)
  — fills any gaps the intake doesn't cover.
- Layer 3 (reference): `../../_config/website-builder-config.md` — author, default stack, deploy/git policy.
- Layer 3 (reference): `../../_config/deploy.md` — deploy options (GitHub storage vs Cloudflare Pages host) + preservation rule.
- Layer 3 (reference): `../../shared/design/anti-slop-rules.md` — so the brief is framed against the quality bar from the start.
- Layer 3 (reference): `../../_config/model-routing.md` § Complexity tiers — the simple/standard/complex criteria; the brief sets the build tier.

## Process

### 0. Ingest the intake folder (if it has any files)

If `../../_intake/` contains anything, process it **before** interviewing:

- **Read every document.** Text PDFs, `.txt`, `.md`, `.docx` are read directly. For a
  **scanned / image-only PDF** the Read tool can't extract text — render its pages to
  PNG first (any PDF-to-image route your shell offers), then read the images. View any image files.
- **Distill with a source map.** Pull purpose, audience, voice, scope, must-haves,
  constraints, deploy facts out of the documents. **Tag every captured fact with its
  source file** (e.g. `[from: brief.pdf p3]`) so the brief is auditable to the client's
  own words.
- **Flag gaps & conflicts.** List what the documents don't cover, and anywhere they
  contradict each other or the config — as open questions / assumptions to confirm.
  Never silently guess to fill a hole.
- **Catalogue real assets.** Inventory `_intake/assets/*` in the brief (what each file
  is, where it should be used) and mark them **client-supplied / real** — so stage 04
  prefers them over generated imagery (`shared/design/imagery.md` §3) and stage 06
  copies them into the shipped site. Client-supplied testimonials, stats, logos, and
  credentials are **real facts** and may be used; this is the sanctioned channel for
  them (the honesty floor bans *inventing* them, not using what the client gave you).
- **Catalogue references.** Note `_intake/references/*` (and any URLs) as emulate/avoid
  inspiration for stage 04's `study` step.

Then interview the human to fill the gaps the intake left open. If `_intake/` is empty,
skip straight to the interview — the brief works fully without it.

### Pin down the brief

Interview the human (or read their request) and pin down each of these. Where neither
the intake nor the human has said, propose a sensible default from
`website-builder-config.md` and mark it as an assumption to confirm — don't leave it blank.

1. **Purpose / goal** — what the site must achieve (sell, book, inform, portfolio,
   launch). The single most important outcome.
2. **Audience** — who visits, what they want, what device/context they're in.
3. **Brand & voice** — name, tone (3–5 adjectives), any existing identity
   (logo, colours, fonts) or "from scratch." What feeling should it evoke?
4. **Scope — pages** — the rough page list (refined in stage 02).
5. **Must-haves & must-avoids** — required features (forms, booking, gallery),
   and any explicit dislikes.
6. **Content source** — does the human supply copy/assets, or do we write it?
   (Stage 03 only uses *real* facts — capture what's known now.)
7. **Tech stack** — confirm or override the default (`static` / `tailwind` /
   `astro` / `next`). Pick the simplest that meets the need.
8. **Deploy target & domain** — where it'll live (or "local only" for now). Per
   `deploy.md`: if a site already has a remote/host, capture and preserve it exactly;
   note GitHub-as-storage vs an actual host (e.g. Cloudflare Pages). Don't pick a
   host for the owner — record it as an open question if unstated.
9. **References / inspiration** — any sites the human likes or wants to avoid
   (useful for stage 04's `study` step).
10. **Legal pages & jurisdiction** — the four baseline legal pages (privacy,
    cookies, terms, accessibility) ship by default as a footer-only tail
    (`../../shared/legal/legal-pages.md`). Say so, then ask two things: keep
    all four (a site collecting no data may drop some — this is the one place
    the opt-out can happen; otherwise stage 02 appends them), and **which
    jurisdiction / audience region** the business serves — the templates are
    jurisdiction-neutral and stage 03 writes to the recorded law, never an
    assumed country. Record both in the brief.

Write a tight, decision-dense brief. No fluff. Every later stage will cite it.

## Outputs

`brief.md` -> output/ — when intake was used, it includes a **Sources** map (which fact
came from which file) and a **Client assets** catalogue (real files + intended use),
plus the usual open-questions/assumptions list.

Plus: update `../../SESSION.md` — tick stage 01, one-line note, mark 02 **NEXT**.

## Review

Before stage 02, the human confirms purpose, audience, voice, stack, the page
list, and the legal-pages + jurisdiction decision are right. If you keep rewriting the same assumption each run, fix the
default in `../../_config/website-builder-config.md` instead.
