# config

Stage 00 writes `config.md` from this file. Copy it, fill it in, commit it on your fork.
It is deliberately not gitignored: on a team it is the thing that stops two people building
to different defaults.

## Who is building

- **Name:** <your name>
- **Email:** <your email>

## Jurisdiction

- **Profile:** `uk`

  Which file in `profiles/` the legal gates use. The legal family is the genuinely
  country-shaped part of this repo, and running the UK profile on a US site would produce
  confident wrong advice. If your jurisdiction is missing, say so plainly rather than running
  the nearest one.

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

## House rules

<anything you always do that is not already in AGENTS.md>
