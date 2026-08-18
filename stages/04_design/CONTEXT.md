# Stage 04 — Design

Choose a concrete **design direction** and lock a **token system** so the build
makes zero design decisions of its own. This is the highest-judgement stage.

**Run modes:** conductor — spawn on the **strongest** tier (simple builds:
standard), and name `references/design-directions.md`,
`references/live-references.md`, `../../sites/variety-ledger.md`, and
`../../shared/design/moodboard.md` (+ the board at
`../../_intake/references/moodboard.md` if present) in the spawn prompt — a cold
sub-agent won't know to use them otherwise · solo — run inline, on the
strongest session you have. Tier table: [`../../_config/model-routing.md`](../../_config/model-routing.md).

**Before starting:** if `_intake/references/moodboard.md` is empty/absent, ask the
human **once**: *"Any sites you want on the moodboard for this build — things whose
font, feel, or positioning I should dissect and draw from?"* Dissect any drops per
`../../shared/design/moodboard.md`, then proceed.

**Rhythm:** ◆ collaborative checkpoint — surface the direction, palette, and font
pairing (with alternatives + reasoning) and iterate *with the human* before locking
the spec. This is the design conversation, not a yes/no.

## Inputs

- Layer 4 (working): `../01_brief/output/brief.md` — voice, audience, references.
- Layer 4 (working): `../02_sitemap/output/sitemap.md` — what needs designing.
- Layer 4 (working): `../03_content/output/content.md` — the real copy to design around.
- Layer 3 (reference): `references/design-directions.md` — the divergence menu (15 distinct archetypes + the gravity-well guard). **Pick from here.**
- Layer 4 (working): `../../_intake/references/moodboard.md` — the owner's dissected reference cards for THIS build, if any. **Highest reference authority** (above generic live research); read per `../../shared/design/moodboard.md` § How stage 04 consumes the board.
- Layer 3 (reference): `../../shared/design/moodboard.md` — the moodboard protocol (card capture, steal/adapt/leave discipline, per-build expiry).
- Layer 3 (reference): `references/live-references.md` — the live reference-research protocol (how to pull 2–3 current real-studio sites in the chosen direction and extract their DNA). **Run after picking, before locking tokens.**
- Layer 3 (reference): `../../sites/variety-ledger.md` — what every prior build looked like. **Read before choosing, so this one diverges.**
- Layer 3 (reference): `../../shared/design/anti-slop-rules.md` — the non-negotiables.
- Layer 3 (reference): `../../shared/design/README.md` — how design flows 04→05→06.
- Layer 3 (reference): `../../shared/design/resources.md` — vetted tools (and the bar for adding more).
- Layer 3 (reference): `../../shared/design/imagery.md` — the generated-imagery contract (allowed subjects, honesty floor, slop checklist).
- Layer 3 (reference): `references/asset-manifest-template.md` — the manifest format to fill if the design needs generated imagery.
- Optional (only if your harness has design skills installed — e.g. `hallmark` / `frontend-design` in Claude Code): extra catalogue depth, never a dependency. The vendored `shared/design/` rules are the binding floor; never fake a skill's output, and note in the spec if one was used.

## Process

1. **Read the variety ledger + pick a divergent direction (do this first).**
   Open [`../../sites/variety-ledger.md`](../../sites/variety-ledger.md) and read
   every row — especially the last two builds' display-type genre, colour
   temperament, and macrostructure. Then open
   [`references/design-directions.md`](references/design-directions.md) and shortlist
   2–3 archetypes that fit *this* client's sector/audience/voice. **Cross out any that
   collide with a recent build** (same type genre AND colour temperament as the last
   one or two). Apply the ledger's **distance rule**: the chosen direction must differ
   from the last two rows on at least **two** of {display-type genre, colour
   temperament, macrostructure}. Beware the **gravity well** (soft serif + green +
   warm cream) — do not land there unless the brief unavoidably demands warm-organic,
   and even then differentiate sharply from prior organic builds. Write a one-line
   **"why this client + how it diverges from the ledger"** justification into the spec.
2. **Study references — in order of authority: client refs → moodboard → live
   research.** Client-supplied references first: if the brief names sites to
   emulate/avoid, extract their DNA (palette, type, macrostructure) per
   `references/live-references.md` § How to research. Second, the **moodboard**: if
   `../../_intake/references/moodboard.md` has cards, consume them per
   [`../../shared/design/moodboard.md`](../../shared/design/moodboard.md) — review
   each card's verdict, take the **Steal** items (one influence per axis),
   honour every **Leave**. Then — only for gaps the first two don't cover — run the
   live-research protocol in
   [`references/live-references.md`](references/live-references.md): find 2–3
   current real-studio sites in the chosen direction via WebSearch/WebFetch and
   extract their actual type/colour/structure DNA. Rules that bind across all
   three: extract DNA, never copy identity; references inform the *execution* of
   the chosen direction, they don't override the divergence requirement or any
   anti-slop rule; cap at ~4–6 fetches. List the studied URLs/cards + what was
   taken (and deliberately not taken) in the spec's divergence justification.
3. **Brainstorm within the chosen direction.** Generate a couple of concrete takes
   *inside* the archetype you picked; choose one
   with a clear point of view. State the feeling it targets, how it differs from an AI
   default, and — explicitly — how it differs from the last ledger build.
4. **Lock the tokens** — produce a concrete, named token system:
   - **Colour** — 4–6 values (paper, ink, accent, accent-ink, 1–2 neutrals),
     tinted, as OKLCH or hex. Accent footprint ≤ ~5%.
   - **Type** — display + body (+ optional outlier) with real font names (no
     Inter/Roboto default), the type scale, and line-heights. No italic headings.
   - **Spacing & layout** — a 4px-based spacing scale, container/measure widths,
     grid/breakpoint approach.
   - **One signature move** — the single distinctive element that makes the site
     memorable (a typographic treatment, an asymmetric grid, a motivated motif).
5. **Per-page/section design notes** — for each section in the sitemap, say how it
   should be laid out (which macrostructure, alignment, emphasis), explicitly
   avoiding the templated rhythm. Specify hero shape, nav pattern, footer pattern.
   **Design against the second-order tells here, at spec time — it's far cheaper than
   patching a void at QA** (`anti-slop-rules.md §11`). For every section state, in the
   spec: (a) **what holds its negative space** — for any deliberately empty region,
   especially the open side of an asymmetric hero, name the anchor (hairline/rule, honest
   index or figure, structural numerals, type-bleed); "content on the left, empty right"
   with no anchor is mechanical asymmetry and is not acceptable; (b) **whether it carries
   the signature motif** — assign the motif to a *minority* of openings, not every heading;
   (c) that it is one of **≥2 distinct section archetypes**, not the same band repeated.
6. **Imagery & assets** — decide whether the design needs *generated* imagery at
   all (prefer client assets, then CSS/SVG; see `imagery.md` §3). If it does, fill
   `references/asset-manifest-template.md` → `output/asset-manifest.md`: a compact,
   text-only art-direction line per asset (subject, style, palette from the tokens,
   dimensions, alt text, fallback). Stay inside `imagery.md` §4 (allowed subjects)
   and never inside §5 (no people/logos/premises/credentials). If no generated
   imagery is needed, say so explicitly and stage 05a is skipped. **No pixels here**
   — stage 05a generates
   them (only if the harness has an image tool); this is direction only.
7. **Motion & states** — name the (restrained) interactions and the required
   element states, per anti-slop §5/§7/§8.
8. **Self-critique + variety check** — score the direction on the six axes
   (Philosophy, Hierarchy, Execution, Specificity, Restraint, Variety); revise
   anything < 3 before writing the spec. **Also run the composition check on the spec
   itself** (`anti-slop-rules.md §11`): read every section note back and confirm each
   deliberately-empty region has a named anchor, the signature is rationed to a minority
   of openings, there are ≥2 distinct archetypes, and the direction's POV is one the
   locked tokens can actually deliver (e.g. don't name "Terminal" if the type system has
   no mono to sell it — re-earn or rename). Fix the spec before build; a void designed in
   now is a void shipped later. Then run the **ledger distance check**: lay
   the locked tokens beside the last two ledger rows and confirm they differ on ≥ 2
   of {display-type genre, colour temperament, macrostructure}. If they don't — or if
   the palette is drifting to green+cream or the display face to Fraunces without the
   brief demanding it — **go back to step 1 and pick a different direction**. Variety
   failure is a blocking failure, not a note.

The spec must be **buildable verbatim**: the build stage should never have to
invent a colour, font, size, or layout. Concrete values, not adjectives.

## Outputs

`design-spec.md` -> output/ — must open with the **direction + divergence
justification** (chosen archetype, the "why this client", and how it differs from the
last two ledger rows), so stage 06 can copy it into the ledger on promote.
`asset-manifest.md` -> output/ (only if the design needs generated imagery; otherwise
record "No generated assets" and skip stage 05a)

## Review

Before stage 05, confirm the spec is concrete (named tokens, real fonts, per-section
layout), carries a written divergence justification, and **passes the ledger distance
check** against the last two builds, and clears every relevant rule in
`anti-slop-rules.md`. If an
`asset-manifest.md` was produced, confirm every asset is an allowed subject
(`imagery.md` §4), none is forbidden (§5), and each has a clean non-generated fallback.
