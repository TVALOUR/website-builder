# Legal

> **Law last verified: 2026-08-18. Next review: 2027-02-18.**
> Law is the fastest-decaying content in this repo. Three citations in an earlier
> draft had been revoked or rewritten while this file cited them as live, and the
> absence of a date was what let that sit. Re-check against legislation.gov.uk
> before quoting any of it to a client.

What ships by default, and why. Jurisdiction-specific detail lives in `../profiles/<id>.mjs`;
this file is the method.

**Not legal advice.** This is what a competent developer ships so a small business is not
obviously exposed. A regulated trade has obligations no static checker knows about, and a
business that is unsure needs a solicitor, not a template.

---

## The rule that matters more than any template

**Never invent a legal fact.** Not a company number, not a registered office, not an ICO
registration, not a data-protection contact, not a retention period, not a VAT number.

A privacy notice with an invented company number is worse than no privacy notice. One is a gap.
The other is a false statement, published, in the client's name, on a page specifically about
being trustworthy with information.

A gap is `[NEEDS: …]` and the gate refuses to ship it.

---

## The four baseline pages

| Page | Required? | Why |
|---|---|---|
| **Privacy** | **always** | UK GDPR Art.13 the moment any personal data is collected, which includes a contact form and includes analytics |
| **Cookies** | if anything non-essential loads | PECR reg.6, **as rewritten by DUAA 2025 Sch A1 from 5 Feb 2026**: first-party statistical and appearance/functionality cookies now need information plus a free opt-out, not prior consent |
| **Terms** | recommended | not statutory for a brochure site; standard, cheap, limits liability |
| **Accessibility** | recommended | Equality Act 2010 duty; and it is the one legal page that can be written honestly from work actually done |

They ship on **every** build unless the human explicitly drops one at stage 01, and the drop is
recorded in `facts.md`. Footer only, never the primary nav. They are real pages in the site's own
design system, not a stripped text dump, and they need real content in stage 03.

Section-by-section content requirements are in `../profiles/<id>.mjs` under `pages.*.mustMention`,
which is the same list the gate checks. `../examples/clean-control/` has all four, written.

---

## Cookies: the decision most sites get backwards

**The best cookie banner is no cookie banner.**

If the site loads no analytics, no advertising pixel, no embedded video, no embedded map and no
third-party font, then it sets nothing that needs consent, and the correct output is a cookie
page that says exactly that and **no banner at all**.

A banner on a site with nothing to consent to is a dark pattern with a cost and no benefit: it
costs every visitor a click, it hurts the metrics it was installed to protect, and it makes a
claim about the site that is not true.

So the sequence is: decide at stage 01 whether analytics is genuinely wanted (question 30), and
if the honest answer is no — which for a five-page local business site it usually is — the whole
consent problem disappears.

**If something non-essential does load,** then three things are mandatory and the gate enforces
all three:

1. It ships **inert**: `<script type="text/plain" data-consent="analytics" data-src="…">`.
   A banner that appears while the tag has already fired is decoration.
2. **Reject is as easy as accept.** Same prominence, same click count, nothing pre-selected.
   Accept-only banners are the most-enforced cookie failing there is.
3. **Withdrawing is possible**: a footer control that reopens the banner.

`../templates/consent.js` implements all three, front-end only, no back end.

---

## Third parties that leak before any choice

Each of these contacts a third party on page load, before the visitor has decided anything:

| What | Fix |
|---|---|
| Google Fonts from Google's CDN | self-host the woff2. A German court (LG München I, 3 O 17493/20, Jan 2022) held that hotlinking transmits the visitor IP to a third country without consent. Self-hosting removes the question and is faster. |
| YouTube embed | `youtube-nocookie.com`, or a click-to-load poster |
| Google Maps embed | a static image linking out, or click-to-load |
| Social embeds | link out instead |
| Any third-party script | self-host it, or at minimum add an SRI hash |

---

## Business identity

**Different by entity type, and this is the detail generic advice glosses over.**

- **Limited company:** registered name, company number, and place of registration must appear
  (Companies Act 2006 s.82 and the Trading Disclosures Regulations). The registered office too.
- **Sole trader:** a geographic address, not merely a contact form (E-Commerce Regs 2002 reg.6).
- **Both:** contact details allowing rapid direct communication — an email address or a phone
  number.
- **VAT registered:** the VAT number.
- **Regulated profession:** the regulator and the registration number.

The gate reads the entity type from the `Entity type` row in `facts.md`. If that row is missing
it guesses from the site, and it will sometimes guess wrong, so fill the row in.

---

## Claims that need evidence before they ship

Every one of these is a regulator exposure, not a style preference:

- **Reviews, ratings and testimonials.** Under the DMCC Act 2024 (in force 2025) publishing a
  review that is not genuine is a banned practice, with penalties up to 10% of global turnover.
  A quote needs a real person who said it *and* gave written permission to publish it.
- **Superiority and awards.** "Leading", "best in Devon", "award-winning" are objective claims
  and the CAP Code requires documentary evidence held before publication.
- **Accreditations and registrations.** Gas Safe, NICEIC, HCPC, GDC, SRA, CQC and the rest. The
  number must be real and checkable. Claiming an unheld trade registration is a criminal matter
  in several trades.
- **Guarantees.** A guarantee on the site is a contractual term the business is held to. Only
  ship one the owner has agreed to honour.
- **Counts and years.** "Over 500 customers", "25 years' experience". If nobody counted, there is
  no number.

All of them must trace to a sourced row in `facts.md`. The gate flags each as a MAJOR asking you
to confirm exactly that, every time, because these are the ones that get typed in at the end when
the page looks a bit thin.
