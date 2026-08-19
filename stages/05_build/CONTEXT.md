# Stage 05 — Build

Turn the four approved documents into files.

→ Auto-proceed. The decisions were made upstream; this is execution. If you find yourself
making a design or content decision here, something upstream was incomplete: stop and go back
rather than deciding it quietly in the markup.

## Before you write a line

- Every image you place must already have a row in `builds/<slug>/assets/MANIFEST.md` with a Source
  and a Rights answer, and its alt text comes from that row. The gate blocks anything else, and the
  point is that the decision was taken by somebody looking at the picture rather than improvised at
  build time.
- **Motion** and **Imagery** come from `brief.md`. Under `none`, do not reach for a scroll-reveal
  because the page feels static: that feeling is the layout's problem. Under `client-assets-only`,
  a missing photograph is `<!-- TODO: needs asset ... -->` plus a `[NEEDS:]` line, never a
  generated stand-in.

## Inputs

- `builds/<slug>/brief.md`, `sitemap.md`, `content.md`, `design.md`
- `builds/<slug>/facts.md`
- `../../templates/` — legal pages, consent banner, `_headers`, robots, structured data
- `../../examples/clean-control/` — **a complete worked reference. Read it before you start.**
  It is faster to copy a shape that passes than to rediscover one.

## Process

> **The shapes are in `patterns/`.** Copy the markup from `patterns/sections/*.html`
> and the matching block from `patterns/patterns.css` — the codes match. Do not
> retype an archetype from memory: the details that make them work (16px inputs,
> `minmax(0, 1fr)` on image tracks, a border width that does not change on focus,
> named transition properties, the sentence after the submit button) are exactly
> the details that get dropped, and each one is a gate.


1. **Check your inputs.** All four present, no unresolved `[NEEDS: …]` or `<<PLACEHOLDER>>`.
   If any are open, stop. Building around a gap is how a gap becomes fiction.

2. **Build into `builds/<slug>/site/` only.** Nothing outside it.

3. **Content verbatim from `content.md`.** You are not editing here. If a line does not fit
   the layout, that is a stage 03 or 04 conversation, not a rewrite in the markup.

4. **Tokens exactly from `design.md`.** Every colour and font as a named custom property in
   `:root`. No improvised hex mid-stylesheet. This is the mechanism by which a design system
   stops being one.

5. **The boring files, which are the ones that get forgotten:**
   - `robots.txt` and `sitemap.xml`, generated from the real page list and the real domain
   - `404.html` — every static host serves it, and without one a mistyped link shows a
     stranger's branding on the client's domain
   - `favicon.svg` plus a 180×180 `apple-touch-icon.png`
   - `_headers` (or the host equivalent) from `../../templates/`
   - Open Graph and Twitter tags on every page, with an absolute `og:image` URL
   - `<link rel="canonical">` per page
   - A `LocalBusiness` JSON-LD graph with name, address, phone, hours, area served and url

6. **Legal pages are real pages** in the same design system, with the same header and footer,
   not a stripped text dump. Footer-linked from every page.

7. **The consent banner ships only if something needs consent.** If the site loads no
   analytics, no pixels, no embedded video and no third-party fonts, there is nothing to
   consent to, and a banner for nothing is a dark pattern with a cost and no benefit. Say so
   in the cookie policy instead. If anything non-essential does load, copy
   `../../templates/consent.js` in and ship every such script inert:
   `<script type="text/plain" data-consent="analytics" data-src="…">`.

8. **Self-host the fonts.** Do not link Google's CDN. It is a third-country transfer of the
   visitor's IP before any consent, it is two extra handshakes on the critical path, and
   self-hosting removes both problems in one move.

9. **Images:** explicit `width` and `height` on every one, `loading="lazy"` below the fold and
   **never** on the hero, `fetchpriority="high"` on the LCP image, modern format where it
   helps. Real alt text describing what the image conveys here, not its filename.

Between the images and the gate: **generated assets, only if `design.md` lists any**
and the session has an image tool. Produce each per `../../shared/imagery.md` — the
reject checklist and the declaration rules bind in full — at the listed size, into
`site/assets/`. A failed, rejected or unavailable asset uses its named fallback and
leaves `<!-- TODO: needs asset ... -->`; generation never blocks the build.

10. **Run the gate before you report finished.**
    ```
    node ../../checks/run.mjs builds/<slug>/site --facts builds/<slug>/facts.md
    ```
    Fix your own blockers. Handing an unchecked build to stage 06 wastes the review on things
    a script would have caught in two seconds.

## Outputs

- `builds/<slug>/site/`
- `builds/<slug>/build-notes.md` — anything a reviewer needs to know: decisions you had to
  make, anything you could not implement as specified and why
- `STATE.md` updated

## Verify

- [ ] The gate returns zero blockers.
- [ ] Every page in `sitemap.md` exists and is reachable from the nav or the footer.
- [ ] Copy matches `content.md` word for word.
- [ ] No colour or font literal outside `:root`.
- [ ] robots, sitemap, 404, favicon, `_headers`, OG, canonical and JSON-LD all present.
- [ ] It opens and works with `file://` or a plain static server, with no build step required.
