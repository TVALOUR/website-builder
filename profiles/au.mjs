// website-builder — Australia profile.
//
// NOT LEGAL ADVICE. This encodes what a competent web developer should ship by
// default so a small brochure site is not obviously exposed. A regulated trade
// (health, finance, law, building, electrical) has more obligations than any
// static checker can know about, and the gate says so rather than implying a
// green run means "compliant".
//
//   LAW LAST VERIFIED: 2026-08-18
//   NEXT REVIEW:       2027-02-18
//
// THE DECISIVE FACT THIS PROFILE IS BUILT AROUND
//
// A five-to-ten-page brochure site for a small local trader almost always sits
// BELOW the Privacy Act 1988 (Cth) s.6D small-business threshold (annual
// turnover <= AUD 3,000,000) and is therefore, by default, OUTSIDE the Act
// entirely — none of the 13 Australian Privacy Principles bind it, including
// APP 1.3 (privacy policy) and APP 8 (cross-border disclosure). This is the
// single most common wrong assumption in Australian web-compliance advice: a
// large share of the marketing content found while researching this file
// states or implies the exemption has already been removed. It has not. See
// provenance.caveats and profiles/_research/au.md ("What could NOT be
// established" + the contradiction-angle section) for the full trail.
//
// The exemption does NOT apply the moment ANY of these is true, regardless of
// turnover (Privacy Act s.6D(4), confirmed against the OAIC's own "Small
// business" page):
//   - the business provides a health service, or holds health information
//     otherwise than as an employee record
//   - it trades in personal information (buys, sells or rents contact lists,
//     "for a benefit, service or advantage") without the individual's consent
//   - it is a credit reporting body, or a credit provider disclosing to one
//   - it is contracted to provide services TO the Commonwealth under a
//     Commonwealth contract
//   - it operates a residential tenancy database
//   - it is a reporting entity under the AML/CTF Act (from 1 July 2026 this
//     newly catches ~100,000+ small businesses in designated sectors — real
//     estate, legal, accounting/trust-and-company services — a SEPARATE and
//     already-commenced carve-out, not the general exemption debate)
//   - it is related to a body corporate that is not exempt
//   - it has voluntarily opted in (small businesses can, and some do, to make
//     a privacy-policy claim credible to enterprise customers)
//
// So the honest per-build question is not "does this site need a privacy
// policy" in the abstract — it is "does facts.md show the business is a
// health provider, trades personal data, or works Commonwealth contracts".
// This checker cannot read a client's turnover or trading practices from
// HTML, so `pages.privacy.required` below is 'recommended', not 'always' —
// unlike the UK profile, where UK GDPR Art.13 bites the moment a contact form
// exists, with no turnover threshold at all. That divergence is deliberate,
// not an oversight: see profiles/_research/au.md.
//
// A second decisive fact: Australia has NO PECR-equivalent statute that makes
// a cookie consent banner a general legal requirement. See legal.consentModel.
//
// A third: unlike UK Companies Act 2006 s.82 (which DOES require a company
// number and registered office on the website itself), Corporations Act 2001
// s.153 lists specific "public documents" — letterhead, invoices, receipts,
// orders for goods/services, official notices — and a plain brochure website
// is not obviously one of them (ASIC RG 13.19 calls it "a question of fact").
// The Australian business-identity position is materially lighter than the
// UK's, so `legal.disclosure.corporation` and `.soleTrader` below are left
// EMPTY rather than padded with a UK-shaped obligation that does not exist
// here; the ACN/ABN question is instead an `extras` entry, non-blocking.

export default {
  id: 'au',
  name: 'Australia (Privacy Act + APPs · Australian Consumer Law · DDA)',
  country: 'Australia',
  iso2: 'AU',

  provenance: {
    status: 'researched', // machine-assembled from primary sources, NOT reviewed by a lawyer
    verifiedBy: null,
    lawLastVerified: '2026-08-18',
    nextReview: '2027-02-18',
    sources: [
      { claim: "small business exemption ($3m turnover threshold), s.6D definition and its carve-outs (health service, trading in personal information, Commonwealth contract, credit reporting, residential tenancy database, AML/CTF, related bodies corporate)", url: 'https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/small-business', accessed: '2026-08-18' },
      { claim: 'opt-in mechanism and the general shape of the exemption', url: 'https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/opting-in-to-the-privacy-act', accessed: '2026-08-18' },
      { claim: 'current text of the Privacy Act 1988 (Cth), in force 2026', url: 'https://www.legislation.gov.au/C2004A03712/latest/text', accessed: '2026-08-18' },
      { claim: "Privacy and Other Legislation Amendment Act 2024 commencement tranches — immediate powers/codes (11 Dec 2024), statutory tort for serious invasion of privacy (in force by 11 June 2025), automated-decision transparency (APP 1.7) and the Children's Online Privacy Code both due 10 December 2026", url: 'https://www.ashurst.com/en/insights/australias-first-tranche-of-privacy-reforms-a-deep-dive-and-why-they-matter/', accessed: '2026-08-18' },
      { claim: 'DECISIVE: as of May 2026 the small-business exemption removal (Tranche 2) has NOT been introduced as a Bill; government confirmed in Feb 2026 Senate estimates it is "progressing" with no announced timetable', url: 'https://www.biztechlawyers.com/legal-articles/australias-privacy-reform-shaping-the-future-of-data-protection', accessed: '2026-08-18' },
      { claim: 'as of June 2025, no indication from government of a Tranche 2 timeline at all', url: 'https://www.corrs.com.au/insights/australias-ongoing-privacy-reforms-bolstering-australias-privacy-regulatory-framework', accessed: '2026-08-18' },
      { claim: 'exemption removal originates as an "agreed in principle" response (28 Sept 2023) to the Privacy Act Review, not enacted law', url: 'https://iapp.org/news/a/amending-australias-privacy-act-small-businesses-bigger-responsibilities', accessed: '2026-08-18' },
      { claim: 'APP 1.7 automated-decision transparency obligation text and 10 December 2026 commencement, penalties up to $66,000 for a non-compliant privacy policy', url: 'https://jws.com.au/what-we-think/practical-implications-of-new-transparency-requirements-for-automated-decision-making/', accessed: '2026-08-18' },
      { claim: 'OAIC tracking-pixel guidance (4 Nov 2024): APP 1/5 transparency duties, APP 7 opt-out for direct-marketing use, "set and forget" banners are not sufficient — but no general cookie-banner mandate is asserted', url: 'https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/tracking-pixels-and-privacy-obligations', accessed: '2026-08-18' },
      { claim: 'APP 8 cross-border disclosure — "reasonable steps" test, ordinarily an enforceable contract with the overseas recipient', url: 'https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-8-app-8-cross-border-disclosure-of-personal-information', accessed: '2026-08-18' },
      { claim: 'Corporations Act 2001 (Cth) s.153 "public document" list (letterhead, invoices, receipts, orders, official notices) and ASIC RG 13.19 treating whether a document qualifies as "a question of fact" — a website is not named on the list', url: 'https://sprintlaw.com.au/articles/displaying-your-australian-company-number-acn-legal-essentials/', accessed: '2026-08-18' },
      { claim: 'ACL s.18 misleading or deceptive conduct — broad, intent-irrelevant prohibition', url: 'https://sprintlaw.com.au/articles/section-18-of-the-australian-consumer-law-explained/', accessed: '2026-08-18' },
      { claim: 'ACL s.29 false or misleading representations — quality, sponsorship, price, warranty/guarantee claims; penalties up to the greater of a set amount, 3x benefit obtained, or 10% of turnover', url: 'https://sprintlaw.com.au/articles/understanding-section-29-of-the-australian-consumer-law-for-businesses/', accessed: '2026-08-18' },
      { claim: 'ACL s.64 — a contract term purporting to exclude a consumer guarantee is void; s.64A narrow carve-out for non-personal/household goods, fair-and-reasonable test only', url: 'https://www.accc.gov.au/consumers/buying-products-and-services/warranties', accessed: '2026-08-18' },
      { claim: "ACCC guide to environmental claims (published Dec 2023) — clear/accurate, substantiated, not overstated; ACCC states the guide itself is due an update and does not yet reflect the 28 March 2026 penalty increase ($100m fixed component for corporations)", url: 'https://www.accc.gov.au/about-us/publications/a-guide-to-making-environmental-claims-for-business', accessed: '2026-08-18' },
      { claim: 'ACCC named environmental claims / greenwashing a 2025-26 compliance and enforcement priority', url: 'https://www.ashurst.com/en/insights/australias-greenwashing-regulatory-landscape-asic-and-the-accc-stay-focused/', accessed: '2026-08-18' },
      { claim: 'ACCC review/testimonial internet sweep — 37% of 137 businesses reviewed showed concerning conduct; incentive/connection must be disclosed', url: 'https://www.accc.gov.au/about-us/publications/online-reviews-and-testimonials', accessed: '2026-08-18' },
      { claim: "ABN is not legally required on a website — it is required on tax invoices/receipts (ATO); a missing ABN on an invoice can trigger 47% withholding", url: 'https://lawpath.com.au/blog/do-i-need-to-display-my-abn-on-my-businesss-website', accessed: '2026-08-18' },
      { claim: "WA electrical contractor licence-number display duty as a representative example of state-based trade licensing rules that DO reach advertising, including web pages (Electrical (Licensing) Regulations 1991 (WA) reg.45)", url: 'https://ecawa.org.au/news-insights/display-of-electrical-contractor-s-licence-number-faqs', accessed: '2026-08-18' },
      { claim: 'Maguire v SOCOG (2000) HREOC decision — website found to unlawfully discriminate under the DDA 1992, $20,000 damages, partial-compliance history', url: 'https://en.wikipedia.org/wiki/Maguire_v_Sydney_Organising_Committee_for_the_Olympic_Games_(2000)', accessed: '2026-08-18' },
      { claim: 'Digital Service Standard binds Australian Government agencies only (WCAG 2.2 AA); no equivalent statutory mandate for private business websites', url: 'https://iconagency.com.au/news/2025-10-21-australian-government-website-accessibility-2025-dss-wcag-22-and-multilingual', accessed: '2026-08-18' },
      { claim: "Business Names Registration Act 2011 (Cth) governs registration and disclosure \"in written communications and public places\" for a trading name distinct from the trader's own name; no website-specific disclosure clause was found", url: 'https://sprintlaw.com.au/business-law-library/legislation/cth/business-names-registration-act-2011/', accessed: '2026-08-18' },
      { claim: 'Spam Act 2003 (Cth) — consent (express or inferred), sender ID, and a functional unsubscribe for commercial electronic messages', url: 'https://sprintlaw.com.au/articles/understanding-the-commercial-electronic-messages-law-what-australian-businesses-need-to-know-about-the-spam-act-2003/', accessed: '2026-08-18' },
      { claim: 'Do Not Call Register Act 2006 (Cth) — governs unsolicited telemarketing CALLS and marketing FAXES made by a business; does not reach an inbound web contact form or click-to-call link', url: 'https://www.donotcall.gov.au/about/about-the-do-not-call-register', accessed: '2026-08-18' },
    ],
    caveats: [
      "A significant share of current-dated Australian \"privacy law 2026\" marketing content (compliance-tool vendors, SEO blogs) states or implies the small-business exemption has ALREADY been removed, or names a fixed December 2026 removal date. Neither is correct as of 2026-08-18: the removal is a Tranche 2 proposal the government has agreed to \"in principle\" since September 2023, no Bill has been introduced, and no commencement date exists. December 2026 is real, but belongs to two DIFFERENT, already-legislated provisions (automated-decision transparency, the Children's Online Privacy Code) that this profile's comments deliberately do not conflate with exemption removal.",
      "This profile cannot read a business's actual annual turnover, whether it trades in personal information, or whether it holds a Commonwealth services contract. Those facts decide whether the Privacy Act applies at all, and they belong in facts.md, not in this file.",
      'Whether a bare IP address alone counts as "personal information" under the Privacy Act is unsettled in Australian case law (the Federal Court/Full Court history around Privacy Commissioner v Telstra Corporation Ltd [2017] FCAFC 4 leaves this genuinely contested for some technical data). The Google Fonts / third-party-CDN entries below are shipped as best practice (self-hosting is also simply faster and more resilient), not as a settled cross-border-disclosure breach the way the UK profile can cite a decided German court judgment on point.',
      'No primary source was found stating that a private brochure site with no online transaction has a general statutory duty to publish its ABN, ACN, or a geographic address. That silence is treated here as the honest current position, not as proof no such duty could ever be argued from ACL s.18 (misleading impression of contactability) in an unusual fact pattern.',
      'State and territory trade-licensing display rules (builders, electricians, plumbers, gasfitters, real estate agents) are NOT uniformly researched here — only Western Australia\'s electrical contractor rule was confirmed as a worked example. Every other state/territory and every other regulated trade needs its own check before a licence-display finding is treated as settled for that build.',
      'The Business Names Registration Act 2011 disclosure duty is stated by secondary sources to apply to "written communications and public places" but no primary source or ASIC regulatory guide was found confirming a website specifically counts as either. Marked UNCONFIRMED rather than asserted either way.',
      'This is a research pass by an agent, not a solicitor. A regulated trade, a business collecting health information, or any business unsure whether it trades in personal information should get real advice before publishing a privacy policy — or before publishing none.',
    ],
  },

  locale: {
    language: 'en-AU',
    spelling: 'gb', // Australian English follows British spelling conventions (colour, organise, licence/license split)
    dateFormat: 'D MMMM YYYY',
    currency: 'AUD',
    currencySymbol: '$',
    // ACMA-reserved fictional ranges (source: acma.gov.au, "Phone numbers for use in
    // TV shows, films and creative works"). NSW/ACT landline shown as the example;
    // swap the area code for the build's actual state.
    phoneExample: '(02) 5550 1234',
    fictionalPhoneRange:
      'ACMA reserves 5550 XXXX behind every geographic area code for fiction — '
      + '02 5550 XXXX (NSW/ACT), 03 5550 XXXX (VIC/TAS), 07 5550 XXXX (QLD), '
      + '08 5550 XXXX (WA/SA/NT) — plus 0491 570 XXX nationally for mobiles. '
      + 'Never ship a real allocated number as a placeholder.',
    // Australian postcodes are exactly four digits. Supplied as a STRING; the
    // profile loader (checks/lib/profile.mjs) compiles it to a RegExp.
    postcodePattern: '^\\d{4}$',
    addressOrder: 'street, suburb STATE postcode', // e.g. "12 Example St, Fremantle WA 6160"
    measurement: 'metric',
  },

  copy: {
    // Inherited from the same measured baseline the UK profile uses (human
    // published English-language prose pools at 6.43/1,000 em dashes, range
    // 3.47-10.13; GPT-4.1 measured at 10.62). NOT independently re-measured
    // against an Australian corpus — no AU-specific study was found — so this
    // is carried over as the best available English-language figure, flagged
    // here rather than presented as AU-verified.
    emDashPer1000Warn: 6.43,
    emDashPer1000Block: 10.13,
    language: 'en-AU',
  },

  legal: {
    privacyLaw: 'Privacy Act 1988 (Cth) + the 13 Australian Privacy Principles (APPs)',

    // Australia has no PECR/ePrivacy-Directive equivalent: there is no statute
    // that says "get consent before a cookie fires". What DOES bind an APP
    // entity (i.e. one NOT covered by the s.6D small-business exemption) is
    // ordinary APP 1/5/7 machinery: say what you collect and why (APP 1.3,
    // APP 5), and give a simple opt-out for anything used for direct marketing
    // or targeted ads (APP 7) — disclosure-and-opt-out, not prior consent.
    // The OAIC's own tracking-pixel guidance (4 Nov 2024) pushes hard on
    // "set and forget banners are not enough" but stops short of mandating a
    // banner outright, and explicitly frames the obligation as APP compliance,
    // not a UK/EU-style consent gate.
    //
    // So: 'notice-and-opt-out' is the closest fit of the three allowed values
    // — but only for a business the Privacy Act actually reaches. A business
    // inside the small-business exemption (see the file header) owes NONE of
    // this by force of law; a cookie/privacy page is then best-practice, not
    // compliance, and a banner on a site with nothing to consent to is the
    // same dark pattern the UK profile and shared/legal.md both warn against.
    consentModel: 'notice-and-opt-out',
    consentModelWhy:
      'No Australian statute requires prior opt-in consent before a cookie fires (contrast UK PECR reg.6). '
      + 'An APP entity (i.e. NOT covered by the Privacy Act s.6D small-business exemption — turnover > AUD 3m, '
      + 'or one of the carve-outs in the file header applies) owes APP 1/5 disclosure of what is collected and '
      + 'why, plus an APP 7 opt-out for anything used for direct marketing or targeted advertising; that is '
      + 'notice-and-opt-out, not prior-opt-in. A business genuinely inside the exemption owes none of this by '
      + 'force of law at all — the correct default for that build, exactly as with a UK site loading nothing '
      + 'non-essential, is NO banner, and a cookie page (if shipped) that says plainly what does and does not run.',

    pages: {
      privacy: {
        patterns: [/privacy/i],
        // NOT 'always' — see the file header. A brochure site whose owner's
        // turnover is under $3m and who does not trade in personal data, hold
        // health information, or work a Commonwealth contract is, as the law
        // stands on 2026-08-18, outside the Privacy Act and owes no APP 1.3
        // policy at all. 'recommended' still ships a MINOR finding if the page
        // is missing (cheap insurance, and payment/analytics vendors and
        // enterprise customers routinely demand one by contract regardless of
        // the statutory position) without overstating it as a legal mandate.
        required: 'recommended',
        why: "Privacy Act 1988 s.6D + APP 1.3: mandatory ONLY once the business is an APP entity — i.e. turnover exceeds AUD 3m, OR it provides a health service, trades in personal information, is a Commonwealth contracted service provider, is a credit reporting body, or has voluntarily opted in. Confirm the entity's actual status in facts.md before treating an absent policy as a compliance gap rather than a missed best practice.",
        mustMention: [
          [/\b(what|which)\s+(personal\s+)?(data|information)\s+(we|do\s+we|is)\s+collect|we\s+collect\b|personal\s+information\s+(we|that)/i, 'what personal information is collected'],
          [/\b(purpose|why)\s+we\s+(collect|use)|how\s+we\s+use\s+(your\s+)?(data|information)\b/i, 'the purpose personal information is collected and used for (APP 1.3(b))'],
          [/\b(access|correct(ion)?)\s+(your\s+)?(personal\s+)?(data|information)|\bright\s+to\s+(access|correct)\b/i, 'how to access or correct your information (APP 12/13)'],
          [/\boverseas|\bcross.border|\boutside\s+australia|\bforeign\s+(recipient|server)\b/i, 'whether information is disclosed overseas, and to which countries if practicable (APP 8 / APP 1.3)'],
          [/\b(oaic|information\s+commissioner)\b/i, 'the right to complain to the OAIC'],
          [/[\w.+-]+@[\w-]+\.[\w.]+|\bcontact\s+us\b/i, 'a contact route for a privacy request'],
        ],
      },
      cookies: {
        patterns: [/cookie/i],
        required: 'if-non-essential-scripts',
        why: 'No general Australian cookie-consent statute exists (contrast UK PECR). If the site loads analytics, ad pixels or third-party embeds, disclosure under APP 1/5 plus an APP 7 opt-out is owed IF the business is an APP entity at all (see legal.privacyLaw / the file header) — and the honest default for a site loading nothing non-essential is no cookie page and no banner.',
        mustMention: [
          [/\bessential|strictly\s+necessary\b/i, 'the essential/non-essential split'],
          [/\b(opt.?out|withdraw|change|manage)\s+(your\s+)?(consent|preferences|cookie|tracking)|\bno\s+cookies\b|\bsets\s+no\s+cookies\b/i,
            'how to opt out or manage tracking, or a statement that nothing needing disclosure is set'],
        ],
      },
      terms: {
        patterns: [/terms/i],
        required: 'recommended',
        why: "Not a statutory requirement for a brochure site; standard practice, and the natural place to state a \"guarantee\" or \"warranty\" honestly alongside — never in place of — the consumer guarantees in ACL Div 1, Part 3-2, which cannot be excluded (s.64).",
        mustMention: [],
      },
      accessibility: {
        patterns: [/accessib/i],
        required: 'recommended',
        why: 'Disability Discrimination Act 1992 s.24 prohibits discrimination in the provision of goods, services and facilities, extended to websites by Maguire v SOCOG (HREOC, 2000) — the anchor case, but note it was a Human Rights Commission conciliation/determination against a well-resourced Olympic body, not a damages award tested against an ordinary small trader at trial; the "unjustifiable hardship" defence in s.11 is genuinely size-weighted, and no equivalent case against a small brochure-site operator was found in this research pass. The Digital Service Standard (WCAG 2.2 AA) binds Australian Government agencies only, not private business — useful as a practical target, not a citable obligation here.',
        mustMention: [
          [/\bwcag\b/i, 'the standard targeted'],
          [/\b(report|contact|email|tell us|get in touch)\b/i, 'how to report a problem'],
          [/\b(known\s+limitation|not\s+(yet\s+)?(been\s+)?tested|we\s+have\s+not|aim|target|working\s+towards)\b/i,
            'honest limits — the statement must say what is NOT done, not assert bare conformance'],
        ],
      },
    },

    // Business identity disclosure. Left genuinely empty rather than padded
    // with a UK-shaped obligation that this research pass could not confirm
    // exists for a non-transactional brochure site (see the file header and
    // provenance.caveats). `all` is intentionally left unset too, so the site
    // inherits profiles/_base.mjs's jurisdiction-neutral "a reachable contact
    // route" entry rather than a locally-invented one dressed up as AU law.
    disclosure: {
      corporation: [],
      soleTrader: [],
    },

    // Local law behind each universal claim shape (profiles/_base.mjs owns the
    // regex patterns; the loader in checks/lib/profile.mjs stitches these
    // citations onto them). No pattern is redefined here.
    claimCitations: {
      rating: 'ACL s.29(1)(e) — a false or misleading representation about the standard, quality, value or grade of goods/services. A displayed star rating must trace to a real, attributable set of reviews the business can produce on request.',
      count: "ACL s.29 — a specific number (\"over 500 jobs\", \"1,200+ happy customers\") is a factual representation and must be substantiable. The ACCC's 2023 internet sweep found 37% of 137 reviewed businesses had concerning review/testimonial practices, and it named this a live enforcement focus.",
      superiority: 'ACL s.18 (misleading or deceptive conduct, no intent required) and s.29(1)(a)/(g) — "best", "leading", "award-winning", "No.1 in [place]" are objective comparative claims; hold the evidence before publishing, not after a complaint.',
      accreditation: 'ACL s.29(1)(a)/(h) — claiming a sponsorship, approval, or affiliation (a trade body, a registration, a licence) that is not real or current is a false representation. For a REGULATED trade the exposure is separate and often worse: most states make practising, or advertising as able to practise, without the required licence a specific offence (see legal.extras — licence-number display is state-based and only partially researched here).',
      guarantee: "ACL s.29(1)(m) prohibits a false or misleading representation about the existence, exclusion or effect of any guarantee. More decisively: ACL s.64 makes VOID any term purporting to exclude, restrict or modify a consumer guarantee (repair/replace/refund for a major failure, and more), so a site's own \"guarantee\" or \"warranty\" copy must never read as offering LESS than the statutory guarantees already give a consumer — doing so is itself the breach, not just an empty promise.",
      insurance: 'ACL s.29(1)(a)/(l) — an insurance claim ("fully insured", "public liability insurance held") is a factual representation and, in a regulated trade, is also routinely a licence condition; only ship what the owner can produce a current certificate for.',
      years: 'ACL s.29 — a specific years-in-business or years-of-experience figure is checkable against ASIC company registration or ABN registration date, and must be sourced, not estimated.',
      environmental: "ACL s.18/s.29 as applied to environmental and sustainability claims, per the ACCC's \"A guide to making environmental claims for business\" (Dec 2023) and its 2025-26 Compliance and Enforcement Priorities, which name greenwashing as an active enforcement target across energy, food, fashion and homewares. The ACCC guide itself flags it is due an update and does not yet reflect the corporate penalty rise (fixed component up to $100m for conduct on or after 28 March 2026) — treat both the guide and this note as due for a refresh, not as the final word.",
    },

    // Names OR'd into the base accreditation pattern (profiles/_base.mjs /
    // checks/lib/profile.mjs buildRegulatedClaims), so a claim naming one of
    // these registers by name is caught even without the generic
    // "certified/accredited/registered ... by/with ..." grammar firing.
    // Deliberately partial: state-based trade regulators are numerous and were
    // not exhaustively catalogued in this pass (see provenance.caveats).
    localRegisters: [
      'AHPRA', 'Ahpra', // health practitioners (national scheme)
      'QBCC', 'VBA', 'NSW Fair Trading', 'Consumer and Business Services', // building/renovation licensing bodies (Qld, Vic, SA)
      'Master Builders', 'HIA', // industry bodies sometimes claimed as if they were licences
      'NECA', 'Master Electricians', // electrical trade bodies
      'Law Society', 'Legal Practice Board', // legal practice
      'CPA Australia', 'Chartered Accountants ANZ', // accounting
    ],

    // Non-blocking, informational. The current checker (checks/rules/legal.mjs)
    // reports these under legal/local-rule as "confirm by hand" — treat them as
    // prompts for a human, not as findings the static scan already proved.
    extras: [
      {
        id: 'au/small-business-exemption-check',
        severity: 'minor',
        what: 'confirm whether this business is actually an APP entity before treating any privacy/cookie finding above as a compliance gap',
        detect: 'Read facts.md for turnover, and for any of: health service, trades personal information, Commonwealth contract work, credit reporting, AML/CTF-regulated sector (real estate, legal, accounting/trust services from 1 Jul 2026). If none apply and turnover is under AUD 3m, the Privacy Act does not currently bind this build at all.',
        why: 'Privacy Act 1988 s.6D. This is the single fact that decides whether the whole legal/privacy-policy and legal/cookie-policy gates above describe a real obligation or a best-practice recommendation for THIS build.',
      },
      {
        id: 'au/abn-acn-display',
        severity: 'minor',
        what: 'displaying the ABN (sole trader/partnership) or company name + ACN (Pty Ltd) somewhere on the site — footer or contact page',
        detect: 'Look for an 11-digit ABN or a 9-digit ACN near the business name, typically in the footer.',
        why: "Not a general legal requirement for a non-transactional website (Corporations Act s.153's \"public document\" list does not name a plain brochure site, and no ABN-on-website statute was found — see provenance.caveats). It IS required on every invoice or receipt the business issues (ATO), and displaying it on the site removes any doubt for a client checking who they are dealing with under ACL s.18. Recommend, do not gate.",
      },
      {
        id: 'au/regulated-trade-licence-number',
        severity: 'major',
        what: 'a licence, registration or certification number displayed for any regulated trade named on the site (builder, electrician, plumber, gasfitter, real estate agent, health practitioner)',
        detect: 'If facts.md or the site copy names a regulated trade, check the licence number appears and is state-appropriate; the display DUTY itself is state-based (confirmed here only for WA electrical contractors, Electrical (Licensing) Regulations 1991 (WA) reg.45, which explicitly reaches "any advertisement" including web pages) and was not researched state-by-state.',
        why: 'Practising an unlicensed regulated trade, or advertising as able to, is commonly a specific offence under state law — a materially worse exposure than an ACL claims issue. UNCONFIRMED beyond the WA electrical example; check the specific state/territory regulator before relying on this for any other trade.',
      },
      {
        id: 'au/adm-transparency-2026',
        severity: 'minor',
        what: 'if the site (or a connected backend) makes or materially supports an automated decision about a person — e.g. automatic quote approval/rejection, automated credit or eligibility scoring — the privacy policy must disclose it',
        detect: 'A static brochure site with a contact form routed to a human almost never triggers this. Relevant only if a build adds automated approval/decisioning logic.',
        why: "Privacy Act APP 1.7-1.9, commencing 10 December 2026, requires an APP entity's privacy policy to disclose ADM used to make decisions that could reasonably be expected to significantly affect a person's rights or interests. Penalties for a non-compliant policy up to $66,000. Only binds an APP entity — see the small-business-exemption extra above.",
      },
      {
        id: 'au/childrens-online-privacy-code-2026',
        severity: 'minor',
        what: 'if the site is likely to be accessed by children, note the forthcoming Children\'s Online Privacy Code',
        detect: 'Relevant only to sites plausibly directed at or attracting children — rare for a local-trader brochure build.',
        why: 'The OAIC must register a Children\'s Online Privacy Code by 10 December 2026 setting binding standards for services likely to be accessed by children. Not yet in force as of 2026-08-18; watch for the registered code rather than guessing its content.',
      },
      {
        id: 'au/cross-border-form-processor',
        severity: 'minor',
        what: 'note where the contact-form processor, hosting, or email-delivery service is based, if the business is an APP entity',
        detect: "Most third-party form/hosting services (the ones this repo's templates use) are US-based. Check the vendor's data-location claim.",
        why: 'APP 8 requires an APP entity to take reasonable steps — ordinarily an enforceable contract term — before personal information reaches an overseas recipient. Only binds an APP entity; see the small-business-exemption extra.',
      },
      {
        id: 'au/spam-act-marketing-consent',
        severity: 'minor',
        what: 'if the site has a newsletter/marketing email signup, capture express (or clearly inferable) consent, identify the sender, and provide a working unsubscribe',
        detect: 'Look for a signup form separate from the plain contact form, and for any automated marketing-email tooling.',
        why: 'Spam Act 2003 (Cth) — applies regardless of the Privacy Act small-business exemption; there is no turnover threshold here. A one-off reply to a contact-form enquiry is not a "commercial electronic message" in the sense the Act targets; a newsletter or drip sequence is.',
      },
      {
        id: 'au/do-not-call-not-applicable',
        severity: 'minor',
        what: 'no action needed for a typical brochure site — recorded so the gap is not mistaken for an oversight',
        detect: 'n/a — documentation only.',
        why: 'The Do Not Call Register Act 2006 (Cth) restricts unsolicited telemarketing CALLS and marketing FAXES a business makes. It does not reach a tel: link, a "call us" invitation, or an inbound enquiry the business receives. Included here because the research brief asked whether it applies — for the surface this repo builds, it structurally does not.',
      },
    ],
  },

  seo: {
    locale: 'en_AU',
    // A local Australian trader without these is invisible in the search that
    // matters — the same reasoning as the UK profile, not an AU-specific rule.
    localBusinessRequired: true,
  },
};
