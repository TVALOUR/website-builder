# Running the gate by hand

For when there is no Node, or when you want to know what the checker is actually doing rather
than trusting it.

Same gate ids, same three severities, same verdict format. An agent with no shell can work
through this by reading files. It is slower and it is not worse: several of the checker's own
bugs were found by someone doing this and disagreeing with the output.

**Verdict:** any BLOCKER unresolved means the site does not ship. Majors need a decision each,
written down. Minors are judgement.

---

## copy

| Gate | By hand |
|---|---|
| `copy/em-dash` | Count `—` and `&mdash;` in visible text (ignore `<script>`, `<style>`, `<!-- -->`), then divide by the site's word count and multiply by 1,000. **Warn above 6.43 per 1,000, block above 10.13.** It is a density cap, not a ban: published human prose sits at 6.43/1,000 and GPT-4.1 at 10.62, so presence proves nothing. See TAXONOMY.md. |
| `copy/ai-vocabulary` | Search for each word in `shared/writing.md` § "Words that mean nothing". |
| `copy/ai-syntax` | Search for `not just`, `whether you're`, `in today's`, `that's where we`, `we understand that`, `welcome to our website`. |
| `copy/placeholder` | Search for `lorem`, `TODO`, `[NEEDS:`, `<<`, `{{`, `example.com`, `Jane Doe`, `Your Company`, `placeholder.com`. |
| `copy/straight-quotes` | Search for `'` and `"` inside sentences. Should be `’` `“ ”`. |
| `copy/ellipsis` | Search for `...`. Should be `…`, or rewritten. |
| `copy/title-tag` | List every page's `<title>`. All present? All unique? All under 65 characters? |
| `copy/meta-description` | Same for `<meta name="description">`. Present, unique, 50–165 characters. |
| `copy/link-text` | Search for `>click here<`, `>read more<`, `>learn more<`. |
| `copy/sentence-rhythm` | Read a page aloud. If every sentence is the same length, break some. |
| `copy/exclamations` | Count `!` per page. More than three is enthusiasm standing in for a reason. |
| `copy/dev-note-shipped` | Search HTML comments for TODO, FIXME, HACK, XXX. Invisible to visitors, so not a blocker, but a client who opens View Source should not find your working notes about their business. |
| `copy/heading-shape` | List every heading. If most open with the same shape (all gerunds, all 'Your X'), the page was filled in, not written. |

## facts

The most valuable half-hour in the process, and the only part of this document
worth doing even if you never run the tool.

**First, read facts.md itself.**

| Gate | By hand |
|---|---|
| `facts/no-ledger` | Is there a facts.md at all? If the site states any price, phone number, email, postcode or quantity and there is no ledger, stop. Nothing about this site is verifiable. |
| `facts/ledger-unstructured` | Is it a markdown **table** with a header row including a Source column? A file of prose cannot be checked against, and accepting one is how the first version of this gate fooled itself. |
| `facts/row-unsourced` | Read down the Source column. Every row needs one. A cell that is empty, or says `-`, `n/a`, `TBD`, `assumed` or `inferred`, is not a source. |
| `facts/needs-unresolved` | Search facts.md for `[NEEDS:`, `TBC`, `TODO`, `UNKNOWN`. Any hit is a question only the client can answer, and shipping around it means guessing in public on their behalf. |

**Then walk the built site and list every claim.** Prices, phone numbers, email
addresses, postcodes, opening-hours lines, star ratings, and any number followed
by *years*, *customers*, *clients*, *jobs* or *reviews*. Look in five places, not
one. The last four are where the checker found things nobody had read:

1. the visible page text
2. `tel:` and `mailto:` href values
3. the meta description and the `og:` tags
4. the JSON-LD block
5. **the JavaScript** - anything written with `innerHTML` reaches the visitor
   exactly as if it had been typed into the HTML

| Gate | By hand |
|---|---|
| `facts/unsourced-price` | Every price matches a **sourced** row. Compare values, not strings: 95.00 and 95 are the same price, and 9 is not 95. |
| `facts/unsourced-phone` | Every number matches a sourced row. Normalise first: `+44 1548 852341` and `01548 852 341` are the same number. |
| `facts/unsourced-email` | Same. |
| `facts/unsourced-address` | Same, ignoring the space: `TQ7 1AB` and `TQ71AB`. |
| `facts/unsourced-hours` | Same, ignoring wording: `Mon-Fri 8am to 5pm` and `Monday to Friday from 8am to 5pm`. |
| `facts/unsourced-number` | Every "N years", "N customers", "N jobs". If nobody counted, there is no number. |
| `facts/testimonial-unsourced` | Every quoted testimonial traces to a row naming a real person **and** recording their written permission. Under the DMCC Act 2024 an ungenuine review is a banned practice. |
| `facts/href-mismatch` | For every `<a href="tel:...">`, do the digits in the href match the digits in the visible label? This needs no ledger, and it is the version of the wrong-number bug nobody ever notices. |

**Anything with no sourced row is a blocker.** Add a sourced row, or take it off
the site. There is no third option where it stays because it sounds right.

## legal

| Gate | By hand |
|---|---|
| `legal/privacy-policy` | Does a privacy page exist? Does it cover: what data, lawful basis, rights, retention, the ICO, and a contact route? |
| `legal/cookie-policy` | Search all HTML and JS for `googletagmanager`, `google-analytics`, `gtag(`, `fbq(`, `hotjar`, `clarity.ms`. **Any hit makes a cookie policy and a working consent gate mandatory.** |
| `legal/consent-required` | For each such script: is it `type="text/plain"` with `data-src`? If it has a live `src=`, it fires before consent. Blocker. |
| `legal/consent-banner` | If anything non-essential loads, is there a banner at all? |
| `legal/consent-reject-parity` | Does the banner have a reject control as prominent as accept? |
| `legal/footer-links` | Open every page. Is privacy linked in the footer of each one? |
| `legal/third-party-preconsent` | Search for `fonts.googleapis.com`, `youtube.com/embed` (not `-nocookie`), `google.com/maps/embed`. |
| `legal/business-identity` | Limited company: is the company number and registered office on the site? Sole trader: is there a geographic address? Both: an email or phone? |
| `legal/regulated-claim` | Search for star ratings, "award-winning", "leading", "guarantee", "fully insured", "N years", "certified by". Each needs a sourced row. |
| `legal/stale-date` | Does each legal page carry a last-updated date? |
| `legal/copyright-year` | Is the footer year hardcoded? It goes stale every January. |
| `legal/terms` | Does a terms page exist? |
| `legal/accessibility-statement` | Does an accessibility page exist, and does it state known limitations rather than asserting bare conformance? |

## integrity

| Gate | By hand |
|---|---|
| `integrity/form-dead` | For every `<form>`: does it have an `action`, or does the JS handle its submit? **Then actually submit it and confirm it arrives.** No amount of reading proves this. |
| `integrity/broken-internal-link` | Click every link on every page. All of them. |
| `integrity/missing-asset` | For every `src=` and `href=`, confirm the file exists at that path, with that exact capitalisation. |
| `integrity/broken-anchor` | For every `href="#x"`, confirm something on the page has `id="x"`. |
| `integrity/duplicate-id` | List every `id=` per page and look for repeats. |
| `integrity/no-404` | Does `404.html` exist? |
| `integrity/mixed-content` | Search for `src="http://`. |
| `integrity/contact-route` | Is there any way at all to make contact? Form, `tel:`, `mailto:`, a number? |
| `integrity/hallucinated-cdn` | Any CDN URL containing `@latest`. The site can break on a day nobody touched it. |
| `integrity/empty-href` | `href=#` or `href=` used as a real link. |
| `integrity/case-sensitive-path` | Compare every referenced path against the filename on disk, character for character. Works on your laptop, 404s on a Linux host. |
| `integrity/unclosed-tag` | Count opening and closing tags for div, section, main, header, footer, nav, ul, article. Browsers guess differently at unbalanced markup. |
| `integrity/tel-link` | Every phone number printed on a non-legal page is wrapped in a `tel:` link. Then tap it on a real phone. This is the most demonstrable defect in the whole tool. |

## a11y

| Gate | By hand |
|---|---|
| `a11y/img-alt` | Every `<img>` has `alt`. Decorative ones have `alt=""`, which is a decision; absent is not. |
| `a11y/alt-quality` | No alt text that is a filename, "image", or "image of". |
| `a11y/control-name` | Every icon-only button or link has `aria-label`, `title`, or visually-hidden text. |
| `a11y/label` | Every input has a `<label for>` or `aria-label`. A placeholder is not a label. |
| `a11y/focus-visible` | Search the CSS for `outline: none`. If present, is there a `:focus-visible` style? **Then tab through the site and watch.** |
| `a11y/reduced-motion` | If anything animates, is there a `prefers-reduced-motion` block? |
| `a11y/contrast` | Put every text/background pair through a contrast checker. Body 4.5:1. Large text (24px, or 18.66px bold) 3:1. |
| `a11y/skip-link` | Is there a skip link, and does its target id exist? |
| `a11y/landmarks` | Does every page have `<main>`? |
| `a11y/font-size-ios` | Any input under 16px font-size force-zooms on iOS and does not zoom back. |
| `a11y/div-as-button` | Search for `onclick=` on a div or span. A div is not focusable and does not fire on Enter or Space. |
| `a11y/placeholder-as-label` | Any input whose only label is its placeholder. The placeholder vanishes the moment someone types. |
| `a11y/aria-invalid` | Search for `aria-expanded`. Does any JavaScript ever update it? A permanently-false one is worse than none. |
| `a11y/autoplay` | Any `<video autoplay>` or `<audio autoplay>` without `muted` and without controls. |
| `a11y/link-new-tab` | `target=_blank` without `rel=noopener`. A free lint, not a security finding: browsers apply implicit noopener now. |
| `a11y/overlay-widget` | Search for accessiBe, UserWay, AudioEye, EqualWeb. Overlays do not fix the underlying failures and are disproportionately present on sites that get sued. |

## seo

| Gate | By hand |
|---|---|
| `seo/viewport` | `<meta name="viewport">` on every page. |
| `seo/charset` | `<meta charset="utf-8">` first in `<head>`. |
| `seo/html-lang` | `<html lang="…">`. |
| `seo/open-graph` | `og:title`, `og:description`, `og:image` on every content page. Test one by pasting the URL into a messaging app. |
| `seo/canonical` | `<link rel="canonical">` per page. |
| `seo/structured-data` | Is there a `LocalBusiness` JSON-LD block? Paste it into Google's Rich Results Test. |
| `seo/robots-txt` / `seo/sitemap-xml` | Both exist? Does every URL in the sitemap resolve? |
| `seo/favicon` | A favicon exists and is linked. |
| `seo/h1` | Exactly one `<h1>` per page. |
| `seo/heading-order` | No level skipped (h2 straight to h4). |
| `seo/noindex-shipped` | Search for `noindex`. On a content page it is a launch-killer nobody notices. |
| `seo/placeholder-domain` | Search for `yourdomain`, `example.com`, `localhost` in canonicals, OG tags and the sitemap. |
| `seo/og-image-exists` | Does the og:image URL resolve, and is it absolute? Most scrapers do not resolve a relative og:image. |
| `seo/structured-data-valid` | Paste each JSON-LD block into a validator. Invalid structured data is ignored entirely, so the effort is spent and the benefit is zero. |
| `seo/review-schema` | Search the JSON-LD for `Review` or `AggregateRating`. On the business own domain this is always ineligible, and an embedded review widget does not change that. |
| `seo/charset-early` | Is `<meta charset>` inside the first ~1024 bytes? Present but late still mangles the price list. |

## perf

| Gate | By hand |
|---|---|
| `perf/image-dimensions` | Every `<img>` has `width` and `height`. |
| `perf/image-weight` | Any image over 400 KB is a problem on rural 4G. |
| `perf/lazy-lcp` | The **first** image on the page must NOT be `loading="lazy"`. |
| `perf/lazy-loading` | Below-the-fold images should be. |
| `perf/font-display` | Every `@font-face` has `font-display: swap`. |
| `perf/font-render-blocking` | No `@import` of a font inside CSS. |
| `perf/render-blocking-js` | No `<script src>` in `<head>` without `defer` or `async`. |
| `perf/image-format` | Any PNG or JPEG over ~180 KB. AVIF or WebP typically halves it at the same visible quality. |
| `perf/font-weights` | Count the font files. More than four is more round trips than a brochure site needs. |
| `perf/unpurged-css` | Any stylesheet over ~250 KB is almost certainly an unpurged framework build. |
| `perf/preload-lcp` | Is the hero image preloaded with `fetchpriority=high`? |

## security

| Gate | By hand |
|---|---|
| `security/secret-in-client` | Search all JS for `sk_live`, `AIza`, `AKIA`, `ghp_`, `api_key`, `secret`, `password`. |
| `security/env-file-shipped` | Is there a `.env`, `.git/`, `.bak` or `.map` in the deploy folder? |
| `security/no-headers` | Is there a `_headers` file (or host equivalent)? |
| `security/sri` | Every third-party `<script src>` has an `integrity` hash, or is self-hosted. |
| `security/form-destination` | If a hosted form service is used, is it named in the privacy notice? |
| `security/csp` | Is there a Content-Security-Policy in the headers file? Worth adding once the inline handlers are gone. |
| `security/http-link` | Any `href=http://` to an external site. |
| `security/inline-event-handlers` | Count `onclick=`, `onload=` and friends. They force any CSP to allow unsafe-inline. |

## responsive

| Gate | By hand |
|---|---|
| `responsive/no-breakpoints` | Are there any `@media` queries or intrinsic layout at all? |
| `responsive/vh-on-ios` | Search for `100vh`. Use `100dvh`. |
| `responsive/fixed-width` | Search for `width: NNNpx` over 320 outside a media query. |
| `responsive/hover-only` | Any menu that opens only on `:hover` does not open on a phone. |
| `responsive/print` | Is there an `@media print` block? |
| Everything else | **Open it on a real phone.** Drag the window to 320px. Zoom to 400%. There is no substitute and there never will be. |
| `responsive/overflow-guard` | Is there `overflow-x: clip` on html/body? A safety net, not a fix. |
| `responsive/grid-min-width` | Any `1fr` grid track without `minmax(0, 1fr)`. Check those at 320px; a track holding an image will push the page sideways. |
| `responsive/long-string-wrap` | Is there any `overflow-wrap` in the CSS? A long email address overflows a 320px phone without it. |
| `responsive/safe-area` | Any `position: fixed; bottom: 0` without `env(safe-area-inset-bottom)`. The iPhone home indicator sits over it. |
| `responsive/table-overflow` | Any `<table>` not wrapped in an `overflow-x: auto` container. |

## design

| Gate | By hand |
|---|---|
| `design/default-display-font` | Is the display face Inter, Roboto, Open Sans, Poppins, Lato, or a system stack? |
| `design/font-count` | Count the distinct first-choice families across all `font-family` declarations. More than two fails. |
| `design/gradient-text` | Search for `background-clip: text` with a gradient. |
| `design/default-gradient` | Any violet-to-blue or cyan-to-magenta gradient. |
| `design/pure-black-white` | Is the page base `#fff` or `#000`? |
| `design/transition-all` | Search for `transition: all`. |
| `design/animate-layout` | Any transition on `width`, `height`, `top`, `left`, `margin`, `padding`. |
| `design/token-discipline` | Count colour literals outside `:root`. |
| `design/motif-stamped` | Count the eyebrow/kicker elements against the section count. A majority fails. |
| `design/emoji-icons` | Emoji used as feature or step icons. |
| `design/fake-chrome` | Hand-drawn browser bars, phone frames, fake dashboards. |
| `design/italic-heading` | Any `font-style: italic` on an h1-h6 or hero title. |
| `design/uniform-hover` | Is the same `scale()` applied on four or more unrelated hover states? One reflex everywhere is not an interaction design. |
| `design/spacing-scale` | List every px padding, margin and gap. Anything not a multiple of 4 is off-scale. |
| `design/uniform-rhythm` | Do all the section rules share one padding value? That reads as a stack, not a composition. |
