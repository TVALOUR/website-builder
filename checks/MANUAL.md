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
| `copy/title-default` | A `<title>` of "Home", "Untitled" or "Website" says nothing in the tab, the search result or a shared link. Write the real one. |
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

**Before anything else: which country?** `profiles/` decides every rule in this section, and there
is no default. Read `config.md` for `- **Profile:**`, or the build's `brief.md`. If the country has
no file, do not substitute the nearest one — research it (`profiles/README.md`) or work to
`intl-baseline` and say so in writing to the client.

| Gate | By hand |
|---|---|
| `legal/jurisdiction` | Is there a profile at all, and does it exist in `profiles/`? No profile means every gate below is OFF, and a report with them off is not a pass. **Blocker.** Also check `provenance.status`: `researched` means real sources and no qualified reviewer, so every finding here is a prompt to check rather than advice. |
| `legal/local-rule` | Open the profile's `legal.extras` and read every entry that has no `pattern`. These are obligations no static file can decide — Quebec's French-language rules, Germany's Impressum, a state contractor-licence display. Confirm each one by hand and write down which you confirmed. A blocker-rated one nobody has checked is a launch that waits. |
| `legal/privacy-policy` | Does a privacy page exist? Does it cover: what data, lawful basis, rights, retention, the ICO, and a contact route? |
| `legal/cookie-policy` | Search all HTML and JS for `googletagmanager`, `google-analytics`, `gtag(`, `fbq(`, `hotjar`, `clarity.ms`. **Any hit makes a cookie policy and a working consent gate mandatory.** |
| `legal/consent-required` | For each such script: is it `type="text/plain"` with `data-src`? If it has a live `src=`, it fires before consent. Blocker. |
| `legal/consent-banner` | If anything non-essential loads, is there a banner at all? |
| `legal/consent-reject-parity` | Does the banner have a reject control as prominent as accept? |
| `legal/footer-links` | Open every page. Is privacy linked in the footer of each one? |
| `legal/third-party-preconsent` | Search for `fonts.googleapis.com`, `youtube.com/embed` (not `-nocookie`), `google.com/maps/embed`. |
| `legal/business-identity` | Limited company: is the company number and registered office on the site? Sole trader: is there a geographic address? Both: an email or phone? Not applied when facts.md's Entity type row declares a personal, demo, fictional or online-product project - those owe honesty, not shopfront disclosures. |
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
| `integrity/dead-social` | Click every social icon. One that opens the platform's homepage instead of a profile says "we do not actually have one" — link the real profile or remove it. |

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

## assets

Provenance for FILES, the same discipline `facts.md` applies to CLAIMS. An image on a page is a
claim about the business — *this is our shop, this is our work, this is the team* — and one nobody
can trace is exactly as dishonest as an unsourced price.

**First, open `builds/<slug>/assets/MANIFEST.md` and read it against the pages.** Then:

| Gate | By hand |
|---|---|
| `assets/manifest-exists` | Does the build have a manifest at all? If any page shows a local image and there is no manifest, stop. **Blocker.** |
| `assets/unmanifested` | List every `<img src>`, `<source srcset>`, `<video>` and CSS `url()` that points at a local file. Each one needs a row. Anything without one is either a stock photo of somebody else's premises or a file nobody can account for. **Blocker.** |
| `assets/source-unrecorded` | Every row needs a Source: which email, which folder, which sketch, which generator. Blank, `?`, `n/a` and `TBC` are all blank. **Blocker.** |
| `assets/rights-unrecorded` | Every row needs the client's own answer to "is this yours to publish?", in their words. A photo the client paid a photographer for is usually still the photographer's copyright, and a print licence does not license a website. **Blocker.** |
| `assets/generated-not-permitted` | Read `- **Imagery:**` in `brief.md`. Default `client-assets-only`. Any row marked Generated under that policy ships nothing. **Blocker.** |
| `assets/generated-forbidden-subject` | For each generated row, read its "what it shows" against `shared/imagery.md` §3: never people, premises, products, logos, badges, awards, or charts asserting real data. Banned in every regime, including fiction. **Blocker.** |
| `assets/generated-undeclared` | Does any Source name a generator (Midjourney, DALL-E, Stable Diffusion, Firefly, Flux) while the Generated column says no? The declaration is what makes the subject rules checkable at all. |
| `assets/file-missing` | Does every row point at a file that exists in `assets/`, `_intake/` or `site/`? A manifest describing files nobody has is not a record. |
| `assets/alt-mismatch` | For each image, read the page's `alt` against the manifest's Alt cell. If they describe different pictures, either the alt drifted from the decision or **the file at that path is not the file the row vouches for** — which is what a photo renamed onto somebody else's cleared row looks like from the outside. Check which. |
| `assets/alt-unrecorded` | Every image row needs alt text decided in the manifest by somebody looking at the picture — not improvised in the markup, which is where "image1" comes from. `decorative` is a real answer. |
| `assets/intake-unused` | List what the client handed over. Anything not on the site and not marked "not used — <why>" is a decision nobody took. The client noticed that their logo is missing; they did not conclude it was deliberate. |

## design

| Gate | By hand |
|---|---|
| `design/motion-policy` | Read `- **Motion:**` in `brief.md` (default `none`). Under **none**: search the CSS for `@keyframes` and for `animation:`, and the JS for `IntersectionObserver`, `requestAnimationFrame`, `.animate(`, `scroll-behavior: smooth`, GSAP/AOS/Lottie. Any hit is a **blocker** — the client did not ask for movement. Transitions on colour, background, border, outline, opacity, shadow, fill and stroke are FINE: that is hover and focus feedback, and removing it makes the page worse. Transform, position and size are not. Under **subtle**: nothing may loop `infinite`, and nothing should run past about 1.2s. |
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
| `design/emoji-ui` | Look at every heading, button and nav item. Any emoji in them is the tell — set type or use one icon set instead. |
| `design/radius-zoo` | List every `border-radius` value (ignore 0, 50% and pill values). More than four different values means nobody picked one. |
| `design/shadow-zoo` | List every `box-shadow`. One elevation style, two at most. Five different shadows is five opinions about where the light is. |
| `design/hover-hide` | Hover everything. Nothing should fade out or vanish under your cursor. |
| `design/hover-only-reveal` | Anything that only appears on hover is invisible on every phone. Search the CSS for `:hover` rules that set `display` or `visibility`; each needs a click/focus route too. |
| `design/hero-100vh` | Load the homepage at laptop size. If the first screen is exactly the hero with no hint of a next section, visitors read it as a dead end. |
| `design/italic-heading` | Any `font-style: italic` on an h1-h6 or hero title. |
| `design/uniform-hover` | Is the same `scale()` applied on four or more unrelated hover states? One reflex everywhere is not an interaction design. |
| `design/spacing-scale` | List every px padding, margin and gap. Anything not a multiple of 4 is off-scale. |
| `design/uniform-rhythm` | Do all the section rules share one padding value? That reads as a stack, not a composition. |
