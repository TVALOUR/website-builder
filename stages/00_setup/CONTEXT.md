# Stage 00 — Setup

Run once per clone. Two minutes. It exists so the other stages stop asking you the same things on
every build.

## Process

Ask the human these, then write `../../config.md` (from `../../config.example.md`):

1. **Who is building?** Name and email, for the git history and any author metadata.

2. **Jurisdiction — which country's rules the builds run under.**

   Ask for the **country**, not for a menu item. Then:

   - A profile exists in `profiles/` (`uk` · `us` · `eu` · `ca` · `au`) → use it.
   - No profile for that country → **research one.** `profiles/README.md` has the protocol and
     the brief to hand an agent; it is a single pass and it produces a profile file plus its
     working notes with every source URL and access date. Do this rather than picking the nearest
     country: the legal family is the genuinely country-shaped part of this repo, and running the
     UK profile on a US site produces a Kansas plumber citing the Companies Act 2006.
   - **The session cannot search and fetch the live web** → do NOT research it from memory. Use
     `intl-baseline`, tell the client plainly that the legal pages are built to a jurisdiction-
     neutral honesty floor, and recommend a local adviser reads them. That is a better product
     than a confident invention, and it is the honest answer rather than the impressive one.

   There is **no default country**. A run with no profile raises `legal/jurisdiction` as a blocker
   and switches the whole legal family off with a stated reason.

   Per-build override: a build for a client in another country sets `- **Profile:** <id>` in its
   own `brief.md`, and stage 01 question 57 is where that comes from.

3. **Default stack** — `static` unless there is a reason. Plain HTML, CSS and JS is the right
   answer for a five-page brochure site far more often than it is fashionable to say.

4. **Default host** — Cloudflare Pages, Netlify, GitHub Pages, or somewhere else. This decides
   which redirect and headers file format stage 07 emits.

5. **Form handling** — which hosted service you use when a build needs a form, and whether you have
   checked that it publishes a data-processing agreement. Front end only means the form posts
   somewhere you do not own, and the privacy notice has to name it.

6. **Motion — the default is `none`, and you are being asked whether to change it.**

   `none` · `subtle` (it happens once and settles) · `expressive`. Under `none` the site still
   transitions colour, shadow and opacity on hover and focus, because that is feedback rather than
   animation; nothing slides, fades in on scroll, or loops.

   Leave it at `none` unless you have a reason. "Everything fades in as you scroll" is the most
   recognisable tell of a generated site and no client has ever asked for it by name. A build whose
   client does want movement sets it in that build's `brief.md`.

7. **Imagery — the default is `client-assets-only`, and you are being asked whether to change it.**

   `client-assets-only` · `generated-allowed`. Off by default because a generated image on a real
   business's site is a picture of a place that does not exist or a person who does not work there.
   Even under `generated-allowed`, generated imagery may never depict people, premises, products,
   logos or awards — `../../shared/imagery.md` §3, enforced by the assets gate.

8. **House rules** — anything you always do that is not already in `AGENTS.md`.

## Output

`../../config.md`. It is deliberately at the repo root and deliberately not in `.gitignore`: on a
fork it is yours to commit, and on a team it is the thing that stops two people building to
different defaults.

## Verify before you stop

- [ ] The jurisdiction is a country the human named, not one you inferred from their accent, their
      timezone or your own default.
- [ ] `profiles/<id>.mjs` exists for it — or `intl-baseline` was chosen deliberately and the human
      was told what that means.
- [ ] Motion and Imagery are both recorded, even if both are the default. A recorded default is a
      decision; an absent one is an accident waiting to be blamed on the tool.
