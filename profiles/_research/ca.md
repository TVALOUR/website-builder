# Canada legal profile — research notes

Working notes behind `profiles/ca.mjs`. Research date: 2026-08-18. Method: `tools/research-policy.md`
(fan out by angle, contradiction angle mandatory). Not legal advice; nobody qualified reviewed this.

---

## Angles run

1. **Currency check** — what is the live federal privacy law right now, given Bill C-27 died.
2. **Quebec Law 25** — phase status, September 2024 portability right, extraterritorial reach.
3. **Provincial substantially-similar laws** — Alberta PIPA, BC PIPA, what the designation actually does.
4. **CASL** — scope, implied consent, whether it touches a website at all.
5. **Competition Act** — drip pricing, testimonials, and the Bill C-59 greenwashing amendments (both the
   June 2024 substantive change and the June 2025 private-right-of-access commencement).
6. **Accessibility** — Accessible Canada Act scope, AODA's 50-employee threshold.
7. **Quebec French-language law** — Charter s.52, Law 96's June 2025 final provisions.
8. **Business identity disclosure** — does Canada have a UK-style company-number-on-website rule.
9. **⚠ CONTRADICTION (mandatory)** — three specific sub-questions from the brief, run explicitly:
   (a) does PIPEDA have a small-business/revenue exemption; (b) is a cookie banner actually legally
   required in Canada, or cargo-culted from GDPR practice; (c) does CASL reach a website at all, or
   only outbound messages.
10. **Locale mechanics** — Canadian spelling convention, postal code format, NANP fictional phone range.

Two angles from the source-credibility ladder were deliberately skipped: a video/mechanism angle
(§7 of research-policy.md) has no application to a legal-citation task, and a "practitioner forum"
angle was folded into angle 9 rather than run separately, since the practitioner voice on Canadian
privacy/consumer law is almost entirely law-firm client alerts, which is where angles 1-8 already
drew from.

---

## What the contradiction angle found

**(a) PIPEDA and small business — CONFIRMED, no exemption exists.**
The OPC's own interpretation bulletin on "commercial activity" (fetched directly) defines the term by
the *nature* of the conduct, not the size, revenue, or profit motive of the organization. Multiple
secondary sources restate this the same way: no employee-count floor, no revenue floor. The common
belief that a "tiny business" is somehow below PIPEDA's radar is simply wrong — the more accurate
statement is that PIPEDA is *under-enforced* against small business, not that it doesn't apply. That
distinction matters for a profile: this file does not soften any PIPEDA-based requirement on the
assumption of enforcement risk being low.

**(b) Cookie banners — SPLIT, and the split is the actual finding.**
Canada has no direct equivalent of the EU's ePrivacy Directive naming when a cookie may or may not be
set. PIPEDA's "meaningful consent" framework permits IMPLIED consent (a clear notice, no forced click)
for information that is not sensitive and where the use is within reasonable expectations — ordinary,
disclosed, first-party analytics is the textbook example the OPC's own guidance on meaningful consent
gives. That means a Canada-only business, provably outside Quebec's reach, could legitimately run
basic analytics on a notice-only or notice-and-opt-out basis with no banner at all — much closer to
the UK's "no banner if nothing needs consenting to" position than most commercial cookie-banner-vendor
content admits (several of those vendor blog posts, unsurprisingly, argue every Canadian site needs
their banner product). Quebec Law 25 is the harder edge: it requires non-essential tracking/profiling
technology off by default with a specific prior notice, which is functionally prior-opt-in, and Law 25
binds based on the VISITOR's location, not the business's. A public, non-geofenced brochure site
cannot rule out a Quebec visitor, so the profile ships the Law 25-safe default and documents the
lighter PIPEDA-only answer as the explicit exception. **Verdict: the common web-agency claim "you
legally need a cookie banner in Canada" is overstated as a blanket rule and accurate as a practical
default** — both things are true depending on which slice of "Canada" is meant, and most vendor content
collapses that distinction to sell a banner product.

**(c) CASL and websites — CONFIRMED, CASL does not reach the website itself.**
Fetched directly from ised-isde.canada.ca: CASL's scope is defined around "commercial electronic
messages" sent to an electronic address. A website is not an electronic address and publishing content
on one is not "sending" anything. CASL becomes relevant only once the business actually emails or
texts a commercial message to an address it collected — at that point implied consent (existing
business relationship, time-limited) or express consent, plus a working unsubscribe, are owed, and the
burden of proving consent sits with the sender. **Generic "CASL compliance checklist for your website"**
content conflates the two: it is real advice for the business's *email marketing practice*, mislabelled
as a *website requirement*. `profiles/ca.mjs` extras entry `ca/casl-scope` exists specifically to stop
the checker (or a human reading the profile) from flagging a plain contact form as a CASL problem.

A fourth, unprompted contradiction surfaced while researching (b): several sources describe the OPC's
posture on online behavioural advertising as recently trending toward a stricter, more GDPR-like
reading of "meaningful consent" for tracking/profiling pixels — i.e., drifting away from pure implied
consent even outside Quebec. This could not be confirmed against the OPC's own OBA guidance page
directly (it 404'd on fetch), so it is recorded as a caveat, not asserted as settled law. If true, it
would narrow the daylight between "PIPEDA-only" and "Law 25" that this file otherwise treats as a real
gap — worth re-checking at the next review.

---

## Where sources disagreed, and what was followed

- **"Is a revenue/size exemption real?"** — no disagreement found; every source, including the OPC
  itself, agreed there isn't one. Included for completeness because the brief specifically asked for it
  to be tested, not because any source argued otherwise.
- **"Does a brochure site need a cookie banner?"** — genuine disagreement in tone: commercial
  cookie-consent-tool vendors (cookie-banner.ca, secureprivacy.ai, cookiechimp.com, etc.) uniformly
  argue toward "yes, get a banner," while the OPC's own consent guidance and PIPEDA's text support a
  lighter reading for non-sensitive, disclosed, non-Quebec-exposed use. Followed the OPC/statute text
  over the vendor content, per the evidence ladder in research-policy.md §6 (official > commercial
  intermediary), while still shipping the stricter Quebec-safe default given the site can't prove it's
  Quebec-free.
- **"Does Law 25's website-French requirement come from Bill 96 (2022) or the June 2025 amendments?"**
  — sources initially looked contradictory (some framed the website rule as a Bill 96 novelty, others
  as a pre-existing s.52 duty). Resolved: s.52 itself is older than Bill 96; a 2024 regulation clarified
  it reaches website/social content, and the June 2025 package added the *trademark/signage*
  "markedly-predominant" rule and dropped the francisation-registration threshold to 25 employees — a
  DIFFERENT, narrower provision than the general website-content rule. The profile cites s.52 for the
  website duty and keeps the June 2025 trademark/signage change out of scope (it governs product
  packaging and physical signage, not a services brochure site).
- **"Does Canada have a UK-style on-site company-number requirement?"** — no source argued yes. This
  was the expected-null result the brief flagged in advance ("I expect largely NO — confirm"), and it
  is confirmed: the closest analogues (CBCA's ISC register, Ontario's internet-agreement disclosure
  duty) both fail to reach a brochure site, for different reasons (register is filed centrally, not
  published on-site; agreement duty triggers only on an actual paid online contract).

---

## What could NOT be established

- Whether a provincial Business Names Registration Act's disclosure duty (which several provinces
  attach to invoices, contracts, and cheques) extends to a business's own WEBSITE content specifically,
  in any of the ten provinces. Not found either way in the time available. `ca.mjs` treats this
  conservatively — `disclosure.corporation` and `disclosure.soleTrader` are left near-empty rather than
  asserting a requirement that could not be sourced.
- A primary-source (not secondary-commentary) read of Law 25's exact statutory section numbers for the
  privacy-officer and profiling-notice duties (i.e., the actual text at legisquebec.gouv.qc.ca). Every
  citation for those two duties is a law-firm client alert summarizing the Act, not the Act's own text.
  The underlying obligation is corroborated by multiple independent firms (McCarthy Tétrault, BLG,
  Osler, OneTrust, Outside GC) describing it consistently, which is reasonable corroboration for a
  *general* claim, but the exact section numbers in `ca.mjs`'s comments are inferred, not verified word
  for word against the statute.
  Fix if this ever needs to be exact: fetch legisquebec.gouv.qc.ca directly for the Act respecting the
  protection of personal information in the private sector, ss.8.1-8.2 and the privacy-officer
  provision, and cite the Act itself.
- Whether the OPC has issued *updated, current* guidance formally tightening implied consent for
  behavioural-advertising/tracking pixels outside Quebec (see the fourth contradiction-angle finding
  above). The OPC's OBA guidance URL 404'd on direct fetch; only secondary characterizations were
  available. Recorded as a caveat in `ca.mjs`, not asserted.
- Full province-by-province survey of accessibility law beyond Ontario's AODA. The brief asked
  specifically about AODA, which was answered directly (50-employee threshold, confirmed via
  ontario.ca). Manitoba, Nova Scotia, and British Columbia each have their own accessibility statutes
  with different thresholds and timelines that were not separately researched — `ca.mjs` covers AODA
  and the federal ACA only, and is honest about that scope in the accessibility page's `why`.
- Whether checks/rules/legal.mjs will actually run against `ca.mjs`'s schema without modification. It
  will not, as written — see the header comment in `ca.mjs` and the note below. This is a code-reading
  finding, not a legal-research one, but it is material to whether the deliverable "works," so it is
  recorded here too.

---

## A structural note, not a legal one

`profiles/_base.mjs` already exists in this repo and describes a split architecture — universal
tracker/embed/claim-PATTERN data in the base file, jurisdiction-specific consent model, page
requirements, disclosure rules, and claim CITATIONS in each country profile (`legal.claimCitations`,
`legal.disclosure.corporation/soleTrader/all`). The task brief's schema matches `_base.mjs` exactly.

`checks/rules/legal.mjs`, the actual consumer of a profile at run time, does **not** merge `_base.mjs`
in. It reads a profile's own top-level `nonEssentialScripts`, `consentBeforeLoad`, and `regulatedClaims`
arrays, and `disclosure.limited` (not `.corporation`) — the flat shape `uk.mjs` still uses. `_base.mjs`
itself appears to be unwired: nothing in the repo besides `_base.mjs` references `claimPatterns`,
`claimCitations`, `localRegisters`, or `disclosure.corporation`.

`ca.mjs` was written to the brief's given schema (the `_base.mjs` shape) rather than `uk.mjs`'s flat
shape, because the brief specified that schema explicitly and in full. The practical consequence: as
things stand today, running `node checks/run.mjs <site> --profile ca` will throw when
`checks/rules/legal.mjs` tries to iterate `L.regulatedClaims` (undefined) and `L.nonEssentialScripts`
(undefined). Closing that gap means either (a) updating `checks/rules/legal.mjs` to merge `_base.mjs`
under a profile the way `_base.mjs`'s own header describes, or (b) giving `ca.mjs` the old flat shape
as well. That is an architecture call outside this task's scope — flagged here and in `ca.mjs`'s header
rather than silently resolved either way.
