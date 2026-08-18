# Stage 00 — Setup

Run once per clone. Two minutes. It exists so the other stages stop asking you the same
things on every build.

## Process

Ask the human these, then write `../../config.md` (from `../../config.example.md`):

1. **Who is building?** Name and email, for the git history and any author metadata.
2. **Jurisdiction** — which file in `profiles/` applies. `uk` today. If you need another and
   it does not exist, say so plainly: the legal gates are the part that is genuinely
   country-shaped, and running the UK profile on a US site would produce confident wrong
   advice.
3. **Default stack** — `static` unless there is a reason. Plain HTML, CSS and JS is the right
   answer for a five-page brochure site far more often than it is fashionable to say.
4. **Default host** — Cloudflare Pages, Netlify, GitHub Pages, or somewhere else. This
   decides which redirect and headers file format stage 07 emits.
5. **Form handling** — which hosted service you use when a build needs a form, and whether you
   have checked that it publishes a data-processing agreement. Front end only means the form
   posts somewhere you do not own, and the privacy notice has to name it.
6. **House rules** — anything you always do that is not already in `AGENTS.md`.

## Output

`../../config.md`. It is deliberately at the repo root and deliberately not in `.gitignore`:
on a fork it is yours to commit, and on a team it is the thing that stops two people building
to different defaults.
