# config

Stage 00 writes `config.md` from this file. Copy it, fill it in, commit it on your fork.
It is deliberately not gitignored: on a team it is the thing that stops two people building
to different defaults.

## Who is building

- **Name:** <your name>
- **Email:** <your email>

## Jurisdiction

- **Profile:** `<choose one — this line is deliberately unfilled>`

  Which file in `profiles/` the legal gates use. Shipped: `uk` · `us` · `eu` · `ca` · `au` ·
  `intl-baseline`.

  **This template used to ship `uk` here**, four lines above the sentence "There is no default",
  which meant a stranger who copied it, filled in their name and email, and built a site for a
  client in Ohio got the UK profile without ever choosing it — and the report told them to publish
  the ICO's details. That is the Kansas-plumber failure the README opens by describing, sitting in
  the file stage 00 tells you to copy. The placeholder above does not resolve to a profile, so the
  first run blocks on `legal/jurisdiction` until somebody answers the question.

  The legal family is the genuinely country-shaped part of this repo, and running the UK profile
  on a US site does not produce slightly-wrong output — it produces a Kansas plumber citing the
  Companies Act 2006 and publishing a company number that cannot exist.

  **There is no default.** A run with no profile raises `legal/jurisdiction` as a blocker.

  **If your country is not here, research it** — `profiles/README.md` has the protocol and the
  brief to hand an agent. It is one pass, and it produces the profile plus working notes with
  every source URL and access date. If the session has no web access, use `intl-baseline` (an
  honesty floor that names no statute), say so to the client, and recommend a local adviser reads
  the four legal pages. Do not write a legal profile from memory: three citations in an earlier
  UK draft had been revoked or rewritten while it confidently cited them as live.

## Defaults

- **Stack:** `static`

  Plain HTML, CSS and JS. This is the right answer for a five-page brochure site far more often
  than it is fashionable to say.

- **Host:** `cloudflare-pages`

  Decides which redirect and headers file format stage 07 emits.
  One of: `cloudflare-pages` · `netlify` · `github-pages` · `vercel` · `other`

- **Form handling:** `<none | formspree | web3forms | basin | netlify-forms | other>`

  Front end only means the form posts somewhere you do not own. Whichever you pick must publish
  a data-processing agreement, and the privacy notice must name it. If the honest answer for
  most of your builds is a `tel:` link, put `none` and stop apologising for it.

## Defaults that are OFF unless you turn them on

- **Motion:** `none`

  `none` · `subtle` (it happens once and settles) · `expressive`. Under `none` the site still
  transitions colour, shadow and opacity on hover and focus — that is state feedback, and removing
  it makes a page worse. Nothing slides, fades in on scroll, or loops.

  Off by default because "everything fades in as you scroll" is what a page does when nobody
  decided, and it is the most recognisable tell of a generated site. Enforced by
  `design/motion-policy`, so it is a rule rather than a preference.

- **Imagery:** `client-assets-only`

  `client-assets-only` · `generated-allowed`. Off by default because a generated image on a real
  business's site is a picture of a place that does not exist or a person who does not work there.
  Even under `generated-allowed`, generated imagery may never depict people, premises, products,
  logos or awards (`shared/imagery.md` §3), and the assets gate blocks it.

Both can be overridden per build in that build's `brief.md`, which is where the client's actual
answer to questions 62 and 63 lives.

## House rules

<anything you always do that is not already in AGENTS.md>
