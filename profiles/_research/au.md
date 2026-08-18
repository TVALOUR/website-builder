# Australia profile — research notes

Working notes behind `profiles/au.mjs`. Not legal advice; a research pass by an agent,
not reviewed by a lawyer. Law last verified 2026-08-18, next review 2027-02-18.

## Method

Fanned out by angle per `tools/research-policy.md` (angle = a distinct claim or question,
not a distinct search query). Contradiction angle run as its own pass (mandatory), not
folded into the confirmatory angles. WebFetch used for primary/regulator sources where it
worked; WebSearch (which itself retrieves and cites live content, not model memory) used
where WebFetch 403'd or timed out, or for triangulating conflicting secondary claims.
Every citation in `au.mjs` names which URL it rests on and an access date of 2026-08-18.

## Angles run

1. **Privacy Act 1988 + APPs** — general shape, APP 1.3, APP 8.
2. **Privacy and Other Legislation Amendment Act 2024 commencement** — which tranche did what,
   and when.
3. **Small business exemption (s.6D) current status** — THE decisive question (see below).
4. **Small business exemption carve-outs** — what drags an exempt-looking business back in.
5. **Cookie/tracking consent** — is a banner actually mandated, or cargo-culted from GDPR.
6. **Contradiction angle (mandatory)** — three sub-questions, run deliberately adversarially
   against the "obviously you need X" instinct. Detailed below.
7. **Spam Act 2003 / Do Not Call Register Act** — relevance to a static brochure site.
8. **Australian Consumer Law** — s.18, s.29, consumer guarantees (s.64/s.64A), fake reviews,
   greenwashing.
9. **Business identity disclosure** — ABN display, ACN/Corporations Act s.153, Business Names
   Registration Act 2011, contrasted explicitly against the UK's Companies Act s.82 duty.
10. **Regulated-trade licence display** — worked one state/trade example (WA electrical) rather
    than claiming national coverage.
11. **DDA 1992 + WCAG + Maguire v SOCOG + Digital Service Standard** — enforceability, currency
    of the precedent, and confirming the DSS is government-only.
12. **Locale mechanics** — ACMA fictional phone ranges, postcode format, address order.

## The decisive finding: the small business exemption is STILL IN FORCE

Privacy Act 1988 (Cth) s.6D exempts a "small business operator" (annual turnover ≤ AUD
3,000,000, in the previous financial year, all income sources, excluding capital gains/asset
sales) from the Act entirely, UNLESS one of the carve-outs in s.6D(4) applies (confirmed
against the OAIC's own "Small business" guidance page, which lists a longer practical set
than s.6D's bare text: health service providers, businesses trading in personal information
without consent, Commonwealth contracted service providers, residential tenancy database
operators, credit reporting bodies, AML/CTF reporting entities, registered employee
associations, protected-action ballot agents, data-retention scheme providers, Consumer Data
Right accredited businesses, related bodies corporate of a non-exempt entity, businesses
prescribed by regulation, and anyone who has voluntarily opted in).

**This exemption has NOT been removed as of 2026-08-18**, and — this is the part a lot of
current content gets wrong — **no Bill to remove it has even been introduced.**

Timeline, cross-checked across four independent legal-sector sources:

- 28 September 2023 — Government's formal response to the Privacy Act Review agrees "in
  principle" to remove the small business exemption. This is a policy position, not law.
- 10 December 2024 — Privacy and Other Legislation Amendment Act 2024 (Tranche 1) receives
  assent. Tranche 1 does NOT touch s.6D. It commences: enhanced OAIC powers, tiered penalties
  and infringement notices, a statutory tort for serious invasion of privacy (in force by
  11 June 2025), and sets up (but does not yet complete) automated-decision transparency and
  a Children's Online Privacy Code, both due 10 December 2026.
- 17 June 2025 (Corrs) — "no indication from the government regarding the timeline for the
  next tranche of privacy reforms."
- February 2026 (Senate estimates, reported by Biztechlawyers, article dated 20 May 2026) —
  Attorney-General confirms Tranche 2 (which is where small-business-exemption removal lives)
  is "progressing", with **no announced timetable** and no Bill before Parliament.
- 1 July 2026 — a SEPARATE, already-legislated carve-out takes effect: the Anti-Money
  Laundering and Counter-Terrorism Financing Amendment Act 2024 pulls an estimated 100,000+
  small businesses in designated sectors (real estate, legal, accounting/trust-and-company
  services) under the Privacy Act regardless of turnover. This is real and current, but it is
  NOT the general small-business exemption being removed — it is a sector-specific carve-out
  that already existed in shape (s.6D(4) always excluded specific sectors) and simply grew.

**Practical effect for this profile:** a typical local-trader brochure site (a plumber, a
café, a landscaper, a small consultancy) with turnover under $3m, that does not provide
health services, does not trade personal data, and has no Commonwealth contract, is —
as the law stands — genuinely outside the Privacy Act. `au.mjs` reflects this by setting
`legal.pages.privacy.required` to `'recommended'`, not `'always'` (contrast the UK profile,
where UK GDPR Art.13 bites the moment a contact form exists, no turnover threshold, full
stop). This is the single biggest shape difference between the two profiles.

## Contradiction angle — what it found

Run as three deliberately adversarial sub-questions, per the brief.

**(a) Does a small business under the turnover threshold actually need a privacy policy?**
No, not by force of law, per the analysis above — with the carve-outs as the live exception.
Secondary sources (Sprintlaw, IM Lawyers, and several compliance-SaaS blogs) are split: some
correctly state the exemption and its carve-outs; several others assert or imply the
exemption is gone or about to be gone on a specific date (commonly "10 December 2026",
apparently borrowed from the ADM-transparency/Children's-Code commencement date, which is a
real date for different, unrelated provisions). This is the single clearest example of
"common advice overstated" the contradiction angle turned up, and it is why `au.mjs`'s
`provenance.caveats` opens with it.

**(b) Is a cookie banner legally required in Australia?** No general statute requires one.
Multiple sources converge on this (Pandectes, OneTrust, and independently-summarized OAIC
guidance): "Australia does not have a GDPR-style cookie consent requirement... no specific
Australian law that says 'you must show a cookie banner before any tracking occurs'."
What DOES bind an APP entity is ordinary APP 1/5 disclosure plus an APP 7 opt-out for
direct-marketing/targeted-advertising use — the OAIC's tracking-pixel guidance (4 Nov 2024)
pushes hard on "set and forget banners are not sufficient" as a matter of good practice, but
frames the obligation as APP compliance (notice + opt-out), not a EU/UK-style consent gate.
`au.mjs` sets `consentModel: 'notice-and-opt-out'` on this basis, and states plainly that a
site loading nothing non-essential should ship no banner at all, mirroring `shared/legal.md`'s
"the best cookie banner is no cookie banner" for the UK profile.

**(c) Does the DDA 1992 create an enforceable private-business website accessibility duty, and
what is Maguire v SOCOG worth in 2026?** The DDA's s.24 prohibition on discrimination in
goods/services/facilities has been read to cover websites since Maguire v SOCOG (HREOC, 2000):
Bruce Maguire, blind, complained the Sydney Olympics website (and ticketing/programme
materials) were inaccessible; HREOC (now the Australian Human Rights Commission) found
unlawful discrimination and ultimately awarded $20,000 after SOCOG only partially complied
with an order to fix the site. This is real and is the case every accessibility vendor cites.
The contradiction-angle caveat: this was a Human Rights Commission conciliation/determination
against a very large, well-resourced Olympic organising body, decided in 2000 — it is not a
Federal Court damages judgment, and no comparable case against an ordinary small brochure-site
trader was found in this pass. The DDA's s.11 "unjustifiable hardship" defence is explicitly
size-and-resource-weighted, which cuts hard in favour of a small business relative to SOCOG's
facts. `au.mjs` states this nuance in `pages.accessibility.why` rather than presenting Maguire
as if it settles the question for a five-page local-trader site. Separately confirmed: the
government's Digital Service Standard (WCAG 2.2 AA mandate) binds Australian Government
agencies only — it is not, and does not purport to be, a private-sector obligation. WCAG is
still recommended in `au.mjs` as the practical standard to target, just not cited as if the
DSS itself compelled it.

## Where sources disagreed, and which was followed

- **Small business exemption removal date.** Several SEO/compliance-vendor sources (weblegal.ai,
  compliancekit.co, ottoit.com.au — none of them law firms) assert or imply a fixed 10 December
  2026 removal. Four independent law-firm/industry sources (Ashurst, Corrs, IAPP, Biztechlawyers)
  and the OAIC's own guidance page do not. Followed the law-firm/regulator sources; treated the
  vendor-blog claim as the contradiction-angle finding itself rather than as fact, and named it
  explicitly in `provenance.caveats` because it is exactly the kind of confident-wrong citation
  this repo's UK profile header exists to warn against.
- **Whether Maguire v SOCOG "settles" DDA website accessibility.** Several accessibility-tool
  vendor pages present it as flatly dispositive ("Australia's DDA was tested... All Australian
  businesses providing online services are subject to the DDA"). Followed the more cautious
  framing above; the case is real and the principle (websites are a "service" under the DDA) is
  sound, but its evidentiary weight against a small trader specifically was not something this
  pass could verify with a citable precedent.
- **IP address as "personal information" for Google Fonts self-hosting advice.** The UK profile
  can cite a decided German court judgment (LG München I) holding that hotlinked Google Fonts
  transmit a visitor's IP without consent. No Australian equivalent was found, and whether a bare
  IP address is "personal information" under the Privacy Act is itself unsettled in Australian
  case law (the Telstra litigation line). `au.mjs` therefore keeps the self-hosting advice (it
  is simply also faster and more resilient) but does not claim it as a settled Australian legal
  breach the way the UK profile can for its jurisdiction — this entry is actually inherited
  unchanged from `profiles/_base.mjs`, which is itself written jurisdiction-neutrally; the AU
  caveat lives in `provenance.caveats` instead of overriding the base entry.
- **Whether a website must show an ABN/ACN.** Multiple "do I need to display my ABN" articles
  (Lawpath, RegisterMyABN) converge cleanly: no, not on a website — only on invoices/receipts.
  Sprintlaw's ACN article was checked against the primary trigger, Corporations Act s.153's list
  of "public documents" (business letterhead, invoices, statements of account, receipts, orders
  for goods/services, official notices) plus ASIC RG 13.19, which treats whether a document
  counts as "a question of fact." A plain, non-transactional brochure site is not obviously any
  of the listed categories. No source disagreed with this; it simply meant departing from the
  UK profile's shape (Companies Act 2006 s.82 does explicitly reach the website itself) rather
  than assuming the same structure applies here. Handled as a non-blocking `extras` entry.

## What could NOT be established

- **A confirmed date, or even a confirmed Bill, for Tranche 2** (small business exemption
  removal, the "fair and reasonable" test, and other Privacy Act Review recommendations still
  outstanding). Status as of 2026-08-18: agreed in principle since Sept 2023, "progressing" per
  February 2026 Senate estimates, no Bill introduced, no commencement date. This is a genuine
  open question, not a gap in this research pass — the primary sources themselves do not know
  the answer yet.
- **A state-by-state catalogue of regulated-trade licence-display duties.** Only Western
  Australia's electrical contractor rule (Electrical (Licensing) Regulations 1991 (WA) reg.45,
  which explicitly extends to "any advertisement" including web pages) was confirmed as a worked
  example. Builders, plumbers, gasfitters, real estate agents, and the same trades in every other
  state/territory were not individually checked. `au.mjs`'s `au/regulated-trade-licence-number`
  extra says this explicitly rather than implying national coverage.
- **Whether the Business Names Registration Act 2011's disclosure duty ("written communications
  and public places") reaches a website specifically.** Secondary sources describe the duty in
  general terms; no primary ASIC guidance or case confirming (or ruling out) that a website
  counts as either a "written communication" or a "public place" for this Act was found in the
  time available. Marked UNCONFIRMED in `provenance.caveats` rather than folded into
  `disclosure.soleTrader` as if settled.
- **Whether a bare IP address is "personal information"** under current Australian case law —
  genuinely contested, not just under-researched (see above).
- **An Australian-specific measurement of em-dash density in published prose.** `au.mjs` inherits
  the UK profile's English-language figure (6.43/1,000 warn, 10.13/1,000 block, from a general
  human-published-prose study) because no separate Australian corpus study was found. Flagged in
  a code comment rather than presented as AU-verified.
- **The exact ACCC guide's post-28-March-2026 penalty figures for environmental claims specifically**
  — the ACCC's own environmental-claims guide (published December 2023) states it is due an
  update and does not yet reflect the corporate penalty increase (fixed component up to $100m
  for conduct on or after 28 March 2026) that now applies to ACL contraventions generally. The
  general penalty increase is confirmed; a greenwashing-specific enforcement figure post-dating
  the guide's own update was not found.
