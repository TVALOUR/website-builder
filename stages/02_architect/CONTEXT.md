# Stage 02 — Architect

Turn the brief into a page list and decide what each page must carry.

→ Auto-proceed. Sanity-check it and continue, but pause if the structure has clearly
misread the brief.

## Inputs

- `builds/<slug>/brief.md`, `facts.md`
- `../../shared/legal.md` — the baseline pages, which are not optional
- `../../profiles/<jurisdiction>.mjs` — which legal pages this jurisdiction needs

## Process

### 1. Pages

Start from question 10 in the interview: *what do they ask that the site should already have
told them?* That answer is usually the page list, written by the person who fields the calls.

**Build the smallest site that answers it.** The most common failure here is not a missing
page, it is four pages the business cannot fill: a blog with no posts, a team page with one
person, a careers page with no jobs, "case studies" with nothing in them. An empty section is
worse than an absent one, because it tells a visitor the business has stalled.

For a local service business the honest default is: home, services (or one page per service
if there are genuinely different buyers), about, contact. Add a page only when a fact in
`facts.md` needs a home.

**Service-area pages.** One page per town, all near-identical, is a doorway-page pattern that
search engines discount and visitors see straight through. One page per *service*, mentioning
the real towns, is the version that works. Only build a place page if there is genuinely
different content for that place.

### 2. Legal pages, appended as a fixed tail

Per `../../shared/legal.md`, and per the profile. They go in the footer, never the primary
nav. They are not a per-build decision and they are not a stage-05 afterthought: they need
real content in stage 03, from real facts.

### 3. Navigation

Five items or fewer in the primary nav. Label things what they are, not cleverly: a farrier's
customers scan for "prices", and "Investment" is a word that costs enquiries.

Do not ship the default nav shape without deciding on it. Wordmark left, inline links, button
right, hairline border is *a* choice, but it should be one you made.

### 4. What each page carries

For every page, list its sections in order with one line each on what that section is for.
This is the skeleton stage 03 writes into and stage 05 builds. Deliberately vary the shape
between pages: if every page is intro, three things, call to action, you have designed a
template, not a site.

Name the facts each section needs. If a section needs a fact that is not in `facts.md`, that
is not a licence to invent one: go back and ask, or cut the section.

### 5. The things local sites forget

Check each is placed somewhere, or explicitly not needed: service area and travel limits,
opening hours including bank holidays, whether they come to you or you go to them, parking
and access, payment methods, insurance and accreditations, what happens on a first visit,
cancellation terms, minimum charge, out-of-hours.

## Outputs

- `builds/<slug>/sitemap.md`
- `STATE.md` updated

## Verify

- [ ] Every page can be filled from `facts.md` without inventing anything.
- [ ] No page exists that the business cannot populate today.
- [ ] The legal tail is present and footer-placed.
- [ ] Nav labels are plain, and there are five or fewer.
- [ ] Page shapes differ from each other.
