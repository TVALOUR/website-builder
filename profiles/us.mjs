// website-builder -- United States profile.
//
// The legal gates are jurisdiction-shaped, so the jurisdiction is a file rather
// than a hardcode. Run it with `--profile us`.
//
// NOT LEGAL ADVICE. This encodes what a competent web developer should ship by
// default so a small business is not obviously exposed. It never makes a site
// "compliant", and nothing here should be read as saying it does. A regulated
// trade (healthcare, finance, law, contracting, real estate) has obligations no
// static checker can know about.
//
//   LAW LAST VERIFIED: 2026-08-18
//   NEXT REVIEW:       2027-02-18
//
// Read profiles/_research/us.md before changing anything here. It carries the
// URLs, the fetch dates, the contradiction angle, and -- more useful than any of
// them -- the list of questions this research could NOT answer.
//
// WHY THE DATE IS AT THE TOP. The UK profile shipped an earlier version that
// confidently cited three laws which had been revoked or rewritten underneath
// it. That is the failure mode this file is built to avoid, and US law decays
// faster than UK law, not slower: twenty state comprehensive privacy laws came
// into effect in six years, four more are already enacted and waiting, and in
// the eighteen months to August 2026 the FTC lost three of its own trade rules
// in federal court. Anything below that somebody might quote to a client must be
// re-checked at the review date.
//
// ---------------------------------------------------------------------------
// THE THREE THINGS A UK-SHAPED MIND GETS WRONG ABOUT THE US, UP FRONT
// ---------------------------------------------------------------------------
//
//  1. THERE IS NO US EQUIVALENT OF COMPANIES ACT s.82. No federal or state law
//     requires a company to publish its entity number or registered office on
//     its own website. `disclosure` is therefore nearly empty, and that is a
//     research finding, not an unfinished section. See the loud comment there.
//
//  2. A COOKIE BANNER IS NOT REQUIRED ANYWHERE IN THE UNITED STATES. No federal
//     law and no state law requires consent before a cookie is set. The US model
//     is notice-and-opt-out. Porting an EU banner here is cargo cult -- see
//     `consentModelWhy`, which is deliberately long because getting this
//     backwards is the single most common error in US website advice.
//
//  3. THE COMPREHENSIVE PRIVACY LAWS MISS A TINY SITE ENTIRELY -- AND A PRIVACY
//     POLICY IS STILL MANDATORY. Those are not in tension. CCPA and its nineteen
//     siblings all have volume or revenue thresholds a five-page brochure site
//     misses by orders of magnitude. But CalOPPA (California) and DOPPA
//     (Delaware) have NO threshold at all and bite the moment a contact form
//     collects a name and an email. So privacy is `always` -- for a completely
//     different reason, with a completely different required content list, than
//     in the UK. Do not paste CCPA rights language onto a site that is not a
//     covered business; that is a false statement, not a safe default.

export default {
  id: 'us',
  name: 'United States (FTC Act - state privacy laws - ADA Title III)',
  country: 'United States',
  iso2: 'US',

  provenance: {
    // 'researched' = machine-assembled from primary sources, NOT reviewed by a
    // lawyer. It does not become 'verified' because someone read it carefully.
    status: 'researched',
    // A human lawyer's name goes here or it stays null forever.
    verifiedBy: null,
    lawLastVerified: '2026-08-18',
    nextReview: '2027-02-18',

    // One row per citation used anywhere in this file. This list is the audit
    // trail: if a claim below has no row here, it should not be in the file.
    sources: [
      { claim: 'FTC Act s.5 deception test (three parts) and unfairness standard, 15 U.S.C. 45 / 45(n) -- reproduced verbatim by FDIC because ftc.gov blocks automated fetching', url: 'https://www.fdic.gov/consumer-compliance-examination-manual/vii-1-federal-trade-commission-act-section-5-and-dodd-frank', accessed: '2026-08-18', class: 'regulator' },
      { claim: 'FTC Endorsement Guides, 16 CFR Part 255 -- sections, and the source note 88 FR 48102 (26 July 2023); Guides are administrative interpretations, not independently enforceable rules', url: 'https://www.law.cornell.edu/cfr/text/16/part-255', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: '2023 Endorsement Guides revision: effective 26 July 2023; adds fabricated and AI endorsers, defines clear-and-conspicuous as unavoidable, addresses review gating and suppression', url: 'https://www.govinfo.gov/content/pkg/FR-2023-07-26/html/2023-14795.htm', accessed: '2026-08-18', class: 'primary' },
      { claim: 'FTC Rule on the Use of Consumer Reviews and Testimonials, 16 CFR Part 465 -- DATES line reads "This rule is effective October 21, 2024"; published 89 FR 68034, 22 Aug 2024', url: 'https://www.govinfo.gov/content/pkg/FR-2024-08-22/html/2024-18519.htm', accessed: '2026-08-18', class: 'primary' },
      { claim: 'Same rule, read as the Federal Register page image to settle a source conflict over the effective date (see _research/us.md, "Where sources disagreed")', url: 'https://www.govinfo.gov/content/pkg/FR-2024-08-22/pdf/2024-18519.pdf', accessed: '2026-08-18', class: 'primary' },
      { claim: '16 CFR 465 section list: 465.2 fake reviews, 465.3 [Reserved], 465.4 buying reviews, 465.5 insider reviews, 465.6 company-controlled review sites, 465.7 suppression, 465.8 fake social-media indicators', url: 'https://www.law.cornell.edu/cfr/text/16/part-465', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: 'Part 465 survives -- it is NOT among the FTC rules withdrawn or removed in the February 2026 conforming notice (which took out the CARS Rule, the Non-Compete Rule and the 2024 Negative Option amendments)', url: 'https://www.govinfo.gov/content/pkg/FR-2026-02-12/html/2026-02866.htm', accessed: '2026-08-18', class: 'primary' },
      { claim: 'Part 465 actively enforced in 2026: warning letters to ten companies Dec 2025; FTC v. TruHeight settlement Apr 2026 (USD 4m, suspended to USD 750k on inability to pay); FTC and Illinois AG v. Premium Home Service May 2026. SECONDARY (law firm)', url: 'https://www.dlapiper.com/en-us/insights/publications/2026/07/ftcs-2026-enforcement-approach-to-fake-reviews-takes-shape-takeaways-for-companies', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'FTC civil penalty for a knowing trade-rule violation: USD 53,088 per violation (16 CFR 1.98, as amended 90 FR 5581, 17 Jan 2025)', url: 'https://www.law.cornell.edu/cfr/text/16/1.98', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: 'No 2026 inflation adjustment to federal civil penalties -- OMB M-26-11 (17 Apr 2026) cancels it for lack of October 2025 CPI-U data, so the 2025 figures remain live', url: 'https://www.whitehouse.gov/wp-content/uploads/2026/04/M-26-11-Cancellation-of-Penalty-Inflation-Adjustments-for-2026-Regarding-the-Federal-Civil-Penalties-Inflation-Adjustment-Act-Improvements-Act-of-2015.pdf', accessed: '2026-08-18', class: 'primary' },
      { claim: 'CAN-SPAM: physical postal address IN THE MESSAGE, unsubscribe honoured within 10 business days, no deceptive headers -- and NO opt-in requirement (prior consent appears only as an exception)', url: 'https://www.law.cornell.edu/uscode/text/15/7704', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: 'CAN-SPAM enforcement: FTC enforces as if a s.18 rule violation; state AGs may sue for USD 250 per violation capped at USD 2,000,000, trebled for wilful', url: 'https://www.law.cornell.edu/uscode/text/15/7706', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: 'TCPA: prior express written consent for marketing texts; USD 500 per violation, treble to USD 1,500 for wilful; private right of action', url: 'https://www.law.cornell.edu/uscode/text/47/227', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: 'FCC implementing rules for consent and revocation, 47 CFR 64.1200', url: 'https://www.law.cornell.edu/cfr/text/47/64.1200', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: 'FCC Order DA 25-312 -- revocation-of-consent rules effective 11 Apr 2025, the cross-channel "revoke-all" provision waived to 11 Apr 2026 (both dates now passed)', url: 'https://docs.fcc.gov/public/attachments/DA-25-312A1.pdf', accessed: '2026-08-18', class: 'primary' },
      { claim: 'Florida mini-TCPA, Fla. Stat. 501.059 -- prior express written consent, STOP honoured within 15 days, USD 500 / USD 1,500 private right of action', url: 'http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0500-0599/0501/Sections/0501.059.html', accessed: '2026-08-18', class: 'primary' },
      { claim: 'CCPA applicability thresholds, Cal. Civ. Code 1798.140(d): USD 25m revenue (as adjusted), OR 100,000+ consumers/households bought-sold-shared, OR 50%+ revenue from selling or sharing', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.140', accessed: '2026-08-18', class: 'primary' },
      { claim: 'CPPA CPI adjustment: the revenue threshold is USD 26,625,000 from 1 Jan 2025, next adjustment 1 Jan 2027; administrative fines USD 2,663 / USD 7,988', url: 'https://www.cppa.ca.gov/regulations/cpi_adjustment.html', accessed: '2026-08-18', class: 'regulator' },
      { claim: 'CalOPPA, Cal. Bus. & Prof. Code 22575-22579 -- in force, NO size threshold, six required policy contents including the Do Not Track disclosure, "conspicuously post" defined, 30-day cure', url: 'https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=BPC&division=8.&chapter=22.', accessed: '2026-08-18', class: 'primary' },
      { claim: 'Delaware DOPPA, 6 Del. C. 1205C -- a second threshold-free privacy-policy mandate with the same six contents and the same 30-day cure, confirming CalOPPA is not a California quirk', url: 'https://delcode.delaware.gov/title6/c012c/index.html', accessed: '2026-08-18', class: 'primary' },
      { claim: 'Nevada NRS 603A.340 -- no-threshold notice duty, but with a genuine small-operator carve-out (Nevada-located, not primarily online revenue, under 20,000 unique visitors a year)', url: 'https://nevada.public.law/statutes/nrs_603a.340', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: 'Connecticut Gen. Stat. 42-471 -- privacy policy required only of those collecting Social Security numbers; web display expressly counts; up to USD 5,000 per violation', url: 'https://codes.findlaw.com/ct/title-42-business-selling-trading-and-collection-practices/ct-gen-st-sect-42-471/', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: 'California Fictitious Business Name law, Cal. Bus. & Prof. Code 17900 -- the disclosure mechanism is FILING WITH THE COUNTY CLERK, not publication on the website. Key negative finding', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=17900.&lawCode=BPC', accessed: '2026-08-18', class: 'primary' },
      { claim: 'ADA Title III, 42 U.S.C. 12181 -- the twelve statutory categories of public accommodation. The words "website" and "internet" appear nowhere in it', url: 'https://www.law.cornell.edu/uscode/text/42/12181', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: "DOJ's 2024 web rule (89 FR 31320, 28 CFR Part 35) is TITLE II -- state and local government only, and does not reach private business; an Interim Final Rule of 20 Apr 2026 pushed its deadlines to 2027/2028", url: 'https://www.ada.gov/resources/2024-03-08-web-rule/', accessed: '2026-08-18', class: 'regulator' },
      { claim: 'WCAG 2.2 is the current W3C Recommendation (Oct 2023, updated Dec 2024); WCAG 3.0 is still a working draft, not a Recommendation', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/', accessed: '2026-08-18', class: 'primary' },
      { claim: 'Unruh Civil Rights Act, Cal. Civ. Code 51(f) -- an ADA violation is automatically a violation of this section', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=51', accessed: '2026-08-18', class: 'primary' },
      { claim: 'Cal. Civ. Code 52(a) -- Unruh statutory damages "in no case less than four thousand dollars ($4,000)" per violation', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=52.', accessed: '2026-08-18', class: 'primary' },
      { claim: 'Gil v. Winn-Dixie: the April 2021 opinion holding websites are not public accommodations was VACATED AS MOOT on 28 Dec 2021, so the Eleventh Circuit has no live holding. SECONDARY, corroborated against the CourtListener docket (17-13467, two opinions)', url: 'https://www.hklaw.com/en/insights/publications/2022/01/11th-circuit-vacates-opinion-holding-that-websites-are-not-ada-public', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'Overlay widgets attract litigation rather than deflecting it -- roughly a quarter of 2024 digital accessibility suits targeted sites running one. SECONDARY and an INTERESTED PARTY (competes with overlays); directional only', url: 'https://www.accessibility.works/blog/accessibility-overlay-widgets-attract-lawsuits/', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'FTC ordered accessiBe to pay USD 1,000,000 for claiming its AI overlay made sites WCAG-compliant, and for undisclosed paid reviews. ftc.gov 403s; corroborated via a disability-rights practitioner', url: 'https://www.lflegal.com/2025/01/ftc-accessibe-million-dollar-fine/', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'No US law requires a cookie consent banner; the state laws are opt-out-of-sale models, not prior-consent gates. SECONDARY, and corroborated by consent-SaaS vendors conceding it against their own sales interest', url: 'https://recordinglaw.com/us-laws/data-privacy-laws/cookie-banner-requirements/', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'CIPA reform is NOT law: SB 690 was still pending as of July 2026, and as drafted strips the private right of action only for the narrow pen-register theory, not the s.631 wiretap theory most suits plead. SECONDARY (law firm)', url: 'https://www.troutman.com/insights/sb-690-amended-california-moves-to-strip-private-right-of-action-for-pen-register-claims/', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'The FCC "one-to-one consent" rule was vacated by the Eleventh Circuit on 24 Jan 2025, so compliance guidance describing it as current is describing a dead rule. SECONDARY; reporter citation UNCONFIRMED', url: 'https://www.consumerfinancialserviceslawmonitor.com/2025/01/eleventh-circuit-vacates-fccs-one-to-one-consent-rule-fcc-issues-stay/', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'California contractors: licence number required in "all forms of advertising", Cal. Bus. & Prof. Code 7030.5', url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7030.5', accessed: '2026-08-18', class: 'primary' },
      { claim: 'Nevada contractors: NRS 624.720 requires name and licence number in all advertising, with "advertising" EXPRESSLY defined to include the Internet -- the clearest-drafted statute of the group', url: 'https://nevada.public.law/statutes/nrs_624.720', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: 'Florida contractors: Fla. Stat. 489.119(5)(b) requires the number in each advertisement "regardless of medium". Note the subsection is (5)(b), not the (6)(b) commonly cited', url: 'https://www.flsenate.gov/laws/statutes/2024/489.119', accessed: '2026-08-18', class: 'primary' },
      { claim: 'Washington contractors: RCW 18.27.100 requires the current registration number in advertising that shows the name or address; up to USD 10,000 penalty', url: 'https://law.justia.com/codes/washington/2022/title-18/chapter-18-27/section-18-27-100/', accessed: '2026-08-18', class: 'primary-mirror' },
      { claim: 'NANPA reserves 555-0100 through 555-0199 for entertainment and advertising use; every other 555 line number has been returned to assignable inventory', url: 'https://www.nanpa.com/numbering/555-line-numbers', accessed: '2026-08-18', class: 'primary' },
    ],

    // Plain-English strings naming what this profile CANNOT know or verify.
    // The full list is in profiles/_research/us.md under "What could NOT be
    // established"; these are the ones that change what a reader should DO.
    caveats: [
      'Not legal advice, and not reviewed by a lawyer. A clean run means the site is not obviously exposed on things a static file can prove. It never means "compliant".',
      'THE UNITED STATES IS NOT ONE JURISDICTION. This profile encodes the federal floor plus the state rules that reach a site wherever it is hosted (CalOPPA, DOPPA, Unruh). It does NOT know which state the business, its customers, or a future plaintiff are in, and several obligations turn entirely on that.',
      'The gate cannot tell whether the business is over a state privacy-law threshold. It assumes not, which is right for a five-page brochure site and wrong the moment the site adds a retargeting pixel and draws 100,000+ Californian visitors a year.',
      'The United States is not one jurisdiction. Everything here is the federal floor plus the state rules that reach a tiny brochure site; a business in a state with its own comprehensive privacy law, or in a licensed trade, has obligations this file does not encode.',
      'ftc.gov returned HTTP 403 to automated fetching throughout this research. Every FTC instrument below was confirmed via govinfo.gov or law.cornell.edu instead, which is adequate; but the FTC enforcement ACTIONS cited (accessiBe, TruHeight, Premium Home Service, and the s.5 privacy-policy cases) rest on secondary summaries of the Commission text, not the Commission text.',
      'Whether 16 CFR Part 465 has been challenged in court could not be confirmed from a government source -- only that no challenge was reported and that the February 2026 conforming notice left it untouched. This is not a formality: the FTC lost three separate trade rules in federal court between 2024 and 2026.',
      'Twelve of the twenty in-effect state privacy laws were taken from codified mirrors or converging law-firm trackers rather than the state\'s own site. The conclusion is insensitive to this -- a brochure site misses every threshold by orders of magnitude -- but the individual numbers are not primary-verified.',
      'The ADA circuit split is stated more confidently in most published advice than the case law supports. Much of it rests on pre-internet insurance cases and dicta, and the Eleventh Circuit holding everyone cites was VACATED in 2021. Do not tell a client "your circuit has decided this" without checking.',
      'Professional-licence display rules are trade-specific AND state-specific. Four states were verified for contractors (CA, NV, FL, WA). The gate can detect that a licence claim was made; it cannot know whether the trade is licensed, whether the number is real, or whether that state requires it.',
      'This profile deliberately does not encode e-commerce, HIPAA, COPPA, GLBA or employment obligations. If the site takes payments, handles health information, is directed to children, or is a financial service, it is outside what was researched.',
    ],
  },

  // Seven questions every country profile must answer, each pointing at the row
  // in provenance.sources that carries the answer. `checks/citations.mjs` fails
  // a profile that leaves one blank or answers it from a secondary source.
  // See ca.mjs's coverage block for the omission that produced this check.
  //
  // consentModel points at the CCPA definitions section because the honest US
  // answer is an ABSENCE — no federal or state law requires prior opt-in for a
  // brochure site — and an absence has no citation. What the CCPA does supply
  // is the shape the US actually chose: opt out of sale, not opt in to
  // storage. The absence itself is argued in profiles/_research/us.md.
  coverage: {
    privacyNotice: 'https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=BPC&division=8.&chapter=22.',
    consentModel: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.140',
    accessibilityDuty: 'https://www.law.cornell.edu/uscode/text/42/12181',
    businessIdentity: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=17900.&lawCode=BPC',
    misleadingClaims: 'https://www.fdic.gov/consumer-compliance-examination-manual/vii-1-federal-trade-commission-act-section-5-and-dodd-frank',
    electronicMarketing: 'https://www.law.cornell.edu/uscode/text/15/7704',
    fictionalData: 'https://www.nanpa.com/numbering/555-line-numbers',
  },

  locale: {
    language: 'en-US',
    // Drives the copy checker: US spellings are correct here and en-GB
    // spellings are the defect, which is the reverse of profiles/uk.mjs.
    spelling: 'us',
    dateFormat: 'MMMM D, YYYY',
    currency: 'USD',
    currencySymbol: '$',
    phoneExample: '(555) 123-4567',
    // NANPA returned every 555 line number to assignable inventory in Sept 2016
    // EXCEPT 555-1212 (directory assistance), 555-4334, and this block: "The
    // fictitious, non-working numbers, 555-0100 through 555-0199, will remain
    // reserved for entertainment/advertising."
    //
    // This matters more than it looks. A placeholder phone number outside this
    // range is somebody's real telephone, and shipping it on a live business
    // site points strangers at them. 555-1234 -- the number everyone reaches for
    // -- is assignable and therefore NOT safe.
    fictionalPhoneRange: '555-0100 to 555-0199, in any area code, reserved by NANPA for entertainment and advertising use. Numbers outside this block, including the familiar 555-1234, were returned to assignable inventory in September 2016 and may be live.',
    // As a STRING; the loader compiles it. Matches ZIP and ZIP+4.
    postcodePattern: '/\\b\\d{5}(-\\d{4})?\\b/',
    phonePattern: '/(?:\\+1[\\s.-]?)?(?:\\(\\d{3}\\)|\\d{3})[\\s.-]?\\d{3}[\\s.-]?\\d{4}\\b/g',
    phoneCountryCode: '1',
    phoneNationalPrefix: '',
    phoneNationalPattern: '/^\\d{10}$/',
    addressOrder: 'street, city, state ZIP',
    measurement: 'imperial',
  },

  copy: {
    // Em-dash DENSITY per 1,000 words of visible copy, carried over unchanged
    // from profiles/uk.mjs: measured human published prose pools at 6.43/1,000
    // (range 3.47-10.13) and GPT-4.1 at 10.62, so presence proves nothing and
    // density proves a great deal. The measurement was of English prose, not of
    // British prose, so it transfers.
    emDashPer1000Warn: 6.43,
    emDashPer1000Block: 10.13,
    language: 'en-US',
  },

  legal: {
    privacyLaw: 'sectoral and state patchwork -- no general federal privacy law. The binding layer for a small site is CalOPPA (Cal. Bus. & Prof. Code 22575) and Delaware DOPPA (6 Del. C. 1205C), both threshold-free, plus FTC Act s.5 for anything the policy says that is not true.',

    // 'prior-opt-in'       -- consent BEFORE any non-essential storage (EU/UK)
    // 'notice-and-opt-out' -- disclose + give a working opt-out, no prior gate
    // 'notice-only'        -- a privacy notice suffices
    consentModel: 'notice-and-opt-out',

    consentModelWhy: [
      'NO US LAW REQUIRES A COOKIE BANNER. Not federally, and not in any state. There is no',
      'American PECR reg.6, and the twenty state comprehensive privacy laws in effect on',
      '2026-08-18 are opt-OUT regimes: they give a consumer the right to opt out of the SALE or',
      'SHARING of personal information and of targeted advertising, exercised through a "Do Not',
      'Sell or Share My Personal Information" link, not through a gate that blocks the page',
      'until someone clicks. And even that duty only attaches once the business is over the',
      'state threshold, which a five-page brochure site is not. Deploying a European consent',
      'manager on a small US site is cargo cult: it costs every visitor a click, it makes a',
      'claim about the site that is not true, and it satisfies no obligation the site has.',
      '',
      'The obligation the site DOES have is disclosure. CalOPPA 22575(b) requires the privacy',
      'policy to state the categories of personally identifiable information collected, the',
      'categories of third parties it is shared with, how the operator responds to Do Not Track',
      'signals, and whether third parties may collect information about the visitor across',
      'other sites. That is notice, not consent -- and it applies with no size threshold at all.',
      '',
      'THE HONEST COUNTER-CASE, because leaving it out would be its own kind of wrong. There is',
      'a real and growing US litigation risk around trackers that has nothing to do with cookie',
      'banners as marketed. California Penal Code 631 -- a 1967 wiretap statute -- is being used',
      'against session-replay tools, recording chat widgets and advertising pixels, and the',
      'reform bill (SB 690) was still pending as of July 2026 and would not touch the wiretap',
      'theory most suits actually plead. Embedded third-party video plus a pixel additionally',
      'draws Video Privacy Protection Act claims at USD 2,500 per violation.',
      '',
      'So the right answer for a brochure site is not "add a banner". It is SHIP FEWER TRACKERS.',
      'A site with no analytics, no pixel, no session recorder, no third-party video and no',
      'embedded map has nothing to disclose beyond its contact form, nothing to consent to, and',
      'nothing for a CIPA plaintiff to point at. That is the cheapest legal position available',
      'and it is usually also the fastest site.',
    ].join(' ').replace(/\s+/g, ' ').trim(),

    pages: {
      privacy: {
        patterns: [/privacy/i],
        // ALWAYS -- and note this is NOT because of the CCPA. A brochure site is
        // nowhere near any comprehensive state law's threshold. It is because
        // CalOPPA and Delaware's DOPPA have no threshold whatsoever and are
        // triggered by collecting a name and an email from a resident, which any
        // contact form does the moment one Californian or Delawarean uses it.
        required: 'always',
        why: 'CalOPPA, Cal. Bus. & Prof. Code 22575(a) -- an operator of a commercial website that collects personally identifiable information about California residents must conspicuously post a privacy policy. There is no revenue, volume or size threshold anywhere in the chapter, so it reaches a sole proprietor exactly as it reaches Amazon. Delaware DOPPA (6 Del. C. 1205C) imposes a near-identical threshold-free duty, which confirms this is a pattern rather than a California quirk. Both carry a 30-day cure period after notice. Separately, FTC Act s.5 makes an INACCURATE policy an actionable deception, so a generated policy describing data practices the site does not have is worse than no policy at all.',
        mustMention: [
          // CalOPPA 22575(b)(1). Broad on purpose: this section can honestly be
          // phrased many ways, and a privacy page is not innocent prose, so the
          // false-positive risk that justifies tight patterns elsewhere is low.
          [/\b(categories\s+of\s+(personal|personally\s+identifiable)|information\s+we\s+collect|what\s+(data|information)\s+we\s+collect|we\s+collect)\b/i,
            'the categories of personal information collected'],
          // CalOPPA 22575(b)(1) again -- third parties. A site that shares with
          // nobody must SAY it shares with nobody; silence is not a disclosure.
          [/\b(third[\s-]part(y|ies)|share[ds]?\s+(it\s+)?with|disclose[ds]?\s+to|service\s+providers?|no\s+one\s+else|nobody\s+else)\b/i,
            'the categories of third parties the data is shared with, or an explicit statement that it is shared with none'],
          // CalOPPA 22575(b)(3).
          // Broadened after a live false negative: this pattern's first draft
          // missed "If this notice changes, the date at the top changes with
          // it." in examples/clean-control, which is a perfectly good statement
          // of the required disclosure. A mustMention that misses honest prose
          // trains people to write to the regex instead of to the reader.
          [/\b(if|when)\s+(this|the|our)\s+(notice|policy|statement)\s+(ever\s+)?change|change[sd]?\s+to\s+(this|our)\s+(policy|notice)|update[sd]?\s+(this|our)\s+(policy|notice)|material\s+change|we\s+(may\s+)?(revise|update|change)\s+(this|our)\b/i,
            'how visitors are told when the policy changes'],
          // CalOPPA 22575(b)(5). This one is a genuine US-only requirement and
          // the most commonly missed, because it has no UK or EU analogue. The
          // statute is satisfied by an honest "we do not respond to them" -- it
          // demands a disclosure, not a behaviour. "Do Not Track" is a term of
          // art, so requiring the phrase is precise rather than brittle.
          [/\bdo[\s-]not[\s-]track\b|\bDNT\b|\bglobal\s+privacy\s+control\b|\bGPC\b/i,
            'how the site responds to Do Not Track browser signals -- required of EVERY operator by CalOPPA 22575(b)(5), and satisfied by honestly saying it does not respond to them'],
          [/[\w.+-]+@[\w-]+\.[\w.]+|\bcontact\s+us\b/i,
            'a contact route for a privacy question'],
          // NOT REQUIRED, DELIBERATELY: a data-subject rights section. In the UK
          // that is UK GDPR Art.13 and mandatory. Here, rights to access,
          // delete and correct come from the state comprehensive laws, and a
          // brochure site is under none of them. Promising CCPA rights the
          // business is not subject to is a false statement about the business
          // published on the page about being trustworthy with information --
          // and under FTC Act s.5 an inaccurate privacy policy is the deception,
          // regardless of whether the inaccuracy flatters the visitor. The
          // effective date required by CalOPPA 22575(b)(4) is checked by the
          // legal/stale-date gate, so it is not duplicated here.
        ],
      },

      cookies: {
        patterns: [/cookie/i],
        // 'if-non-essential-scripts' -- and the requirement is DISCLOSURE, not
        // consent. If the site loads nothing non-essential there is nothing to
        // disclose and no page is needed; the gate will treat its absence as
        // MINOR. The best cookie page, as in the UK, is no cookie page.
        required: 'if-non-essential-scripts',
        why: 'NOT a consent requirement -- no US law requires consent before setting a cookie. This is CalOPPA 22575(b)(6), which requires the operator to disclose whether third parties may collect personally identifiable information about a visitor across different websites. Once analytics or a pixel is on the page, that disclosure is owed, and a cookie or tracking page is the clean place to put it (it may equally live inside the privacy policy). The separate reason to write one carefully is FTC Act s.5: a page describing trackers the site does not run, or omitting ones it does, is a false statement about the business.',
        mustMention: [
          [/\b(essential|strictly\s+necessary|required\s+for\s+the\s+site|necessary\s+for)\b/i,
            'the essential/non-essential split'],
          [/\b(opt[\s-]?out|turn\s+(them\s+)?off|disable|browser\s+settings|do\s+not\s+sell|no\s+cookies|sets\s+no\s+cookies)\b/i,
            'how to turn the non-essential ones off -- or an explicit statement that none are set'],
        ],
      },

      terms: {
        patterns: [/terms/i],
        required: 'recommended',
        why: 'No US federal or state law requires terms of use on an informational brochure site -- the contradiction angle confirmed this is overstated advice, not a legal duty. It ships anyway because it is standard, cheap, and the only place to state governing law, disclaim warranties on published information, and set out how the business handles quotes and cancellations.',
        mustMention: [
          // The single thing that makes a US terms page useful at all. The US
          // has fifty-one bodies of contract law and a page that names none of
          // them has not decided anything. Kept to ONE requirement on purpose:
          // this fires MAJOR, and a terms page is untidy rather than unlawful.
          [/\b(governing\s+law|laws?\s+of\s+the\s+state\s+of|jurisdiction|venue)\b/i,
            'which state\'s law governs -- a US terms page that names no state has not settled the one question it exists to settle'],
        ],
      },

      accessibility: {
        patterns: [/accessib/i],
        required: 'recommended',
        why: 'NOT required by any US law -- no statute mandates an accessibility statement for a private business, and saying otherwise is one of the overstated claims this profile exists to correct. It ships because it is the one legal page that can be written honestly from work actually done, and because the underlying exposure is real: ADA Title III reaches businesses with premises under every circuit test, there is NO federal technical standard for private-sector websites (DOJ withdrew its Title III rulemaking in 2017 and its 2024 WCAG rule binds state and local government only), and in California an ADA violation is automatically an Unruh Act violation carrying statutory damages of no less than USD 4,000 per violation. Federal website-accessibility filings rose 27% to 3,117 in 2025.',
        mustMention: [
          [/\bwcag\b/i,
            'the standard targeted -- WCAG 2.2 is the current W3C Recommendation; DOJ settlements have historically specified 2.0 or 2.1 Level AA'],
          [/\b(report|contact|email|tell us|get in touch)\b/i,
            'how to report a problem'],
          // Same requirement as the UK profile, and the US reason is sharper. An
          // unverified public conformance claim is a statement of fact about the
          // site that nobody has tested: automated tooling fully covers only
          // about 57% of issues, and in a study of 32 blind users only 50.4% of
          // the problems they actually hit mapped to any success criterion.
          // In the US it is also doubly self-harming -- it is an unsubstantiated
          // objective claim under FTC Act s.5 (the theory on which the FTC took
          // USD 1m from accessiBe in 2025 for exactly this), and it hands a
          // plaintiff an admission that the business knew the obligation.
          [/\b(known\s+limitation|not\s+(yet\s+)?(been\s+)?tested|we\s+have\s+not|aim|target|working\s+towards|ongoing)\b/i,
            'honest limits -- the statement must say what is NOT done, rather than assert bare conformance'],
        ],
      },
    },

    // -----------------------------------------------------------------------
    // BUSINESS IDENTITY DISCLOSURE -- AND THE ANSWER IS: THE US REQUIRES ALMOST
    // NOTHING. SAYING SO LOUDLY IS THE POINT OF THIS SECTION.
    // -----------------------------------------------------------------------
    //
    // There is NO US equivalent of Companies Act 2006 s.82. Searched and not
    // found: any federal statute or FTC/SEC rule requiring a business to publish
    // its EIN, state entity number, registered agent or registered office on its
    // own website; any Delaware, California, New York, Texas or Florida
    // corporate-code trading-disclosure requirement; any fictitious-name (DBA)
    // statute pushing the true owner's name onto the site rather than onto a
    // filing with the county clerk, which is what Cal. Bus. & Prof. Code 17900
    // actually does.
    //
    // The near-miss worth naming precisely, because it is constantly misquoted:
    // CAN-SPAM does require a valid physical postal address -- IN THE COMMERCIAL
    // EMAIL MESSAGE, 15 U.S.C. 7704(a)(5)(A)(iii). Not on the website. If the
    // site has a newsletter signup, the address obligation attaches to what gets
    // sent, and that is handled in `extras` rather than here.
    //
    // So `corporation` and `soleTrader` are EMPTY, and they are empty on
    // evidence. Filling them to look thorough beside profiles/uk.mjs would send
    // someone hunting for a fact that no US law requires and that many US small
    // businesses would have to invent -- the exact dishonesty this repo exists
    // to stop. A gap here is the correct output.
    disclosure: {
      corporation: [],
      // `limited` is the key checks/rules/legal.mjs reads for a corporation.
      // It is an alias of `corporation`, not a second opinion, and it is present
      // rather than omitted because the checker spreads it directly -- omitting
      // it would throw a TypeError on any site that reads as a corporation.
      limited: [],
      soleTrader: [],
      all: [
        // The one row, and its justification is honest about being thin. No US
        // law compels contact details on a brochure site. It is here because a
        // business the visitor cannot reach cannot be the subject of a truthful
        // "get in touch" call to action, because FTC Act s.5 judges the page as
        // a whole, and because every real brochure site has a phone number or an
        // email anyway -- so this will not cry wolf.
        [/[\w.+-]+@[\w-]+\.[\w.]+|tel:|\(\d{3}\)\s?\d{3}[-\s]?\d{4}|\b\d{3}[-.]\d{3}[-.]\d{4}\b/,
          'an email address or a phone number',
          'NOT a US statutory requirement -- unlike the UK, no US law compels contact details on a website. Included as a craft floor: a site that invites contact and provides no route is failing at its only job, and FTC Act s.5 assesses the overall net impression a page creates.'],
      ],
    },

    // -----------------------------------------------------------------------
    // CLAIM CITATIONS -- the LOCAL LAW that makes each universal claim class
    // risky. Patterns for these classes are intended to live in a shared base
    // profile; until that exists, `regulatedClaims` below carries US-tuned
    // patterns so the current checker keeps working.
    // -----------------------------------------------------------------------
    claimCitations: {
      rating: 'FTC Rule on the Use of Consumer Reviews and Testimonials, 16 CFR 465.2 (effective 21 October 2024) -- creating, buying or disseminating a review or rating that misrepresents a real experience is a violation of a trade regulation rule, carrying a civil penalty of up to USD 53,088 per violation (16 CFR 1.98; no 2026 inflation adjustment was made, per OMB M-26-11). The rule is live and being enforced: FTC warning letters went to ten companies in December 2025 and the TruHeight settlement in April 2026 entered a USD 4m judgment, suspended to USD 750k only on inability to pay. A star rating must trace to real, attributable reviews.',
      count: 'FTC Act s.5, 15 U.S.C. 45, plus the advertising substantiation doctrine -- a specific number is an objective factual claim and the advertiser must hold a reasonable basis for it BEFORE publication, not after a challenge. If nobody counted, there is no number.',
      superiority: 'FTC Act s.5, 15 U.S.C. 45 -- "best", "#1", "leading" and "award-winning" are objective claims judged by the FTC deception test: a representation likely to mislead a reasonable consumer, and material to the decision. An award claim needs a real award from a real body in a stated year. Unlike the UK there is no pre-clearance body and no CAP Code; the exposure is enforcement and competitor Lanham Act suits instead.',
      accreditation: 'FTC Act s.5 for the misrepresentation, plus state licensing law for the underlying conduct -- and the second is the sharper edge. Advertising a trade licence not held is a matter for the state licensing board, not a marketing slip: in California, advertising contracting services without a licence draws a fine under Cal. Bus. & Prof. Code 7027.1, and a licensed contractor must carry the number in all advertising under 7030.5. Membership of a real body (BBB, NARI, NATE, ASE, a state contractor board) means the number must be real and checkable.',
      guarantee: 'FTC Act s.5 -- a guarantee published on the site is a representation the business is held to, and state contract and warranty law makes it an enforceable term. Only ship a guarantee the owner has agreed to honour. Note the guarantee itself is lawful; misdescribing its scope or refusing to honour it is what creates the exposure.',
      insurance: 'FTC Act s.5 -- a false statement of insurance cover is a material misrepresentation, because it is exactly the fact a customer relies on when letting a stranger into their home. Substantiable, and clients do ask for the certificate. In several states it also intersects with licensing: "licensed, bonded and insured" is three separate factual claims, and each must be true.',
      years: 'FTC Act s.5 -- a specific number is a checkable factual claim, verifiable against the secretary of state filing, the licence issue date or the domain registration. Confirm it before it ships.',
    },

    // Anything true here that has no slot above -- one entry per genuine local
    // obligation.
    //
    // MOST OF THESE CARRY A `pattern`, AND THAT IS THE POINT. An extra without
    // one is emitted on every single run as a MINOR telling a human to go and
    // look. Ten of those is not ten gates, it is a wall of text at the end of
    // every report, and people learn to scroll past walls of text. The first
    // draft of this file did exactly that and it was measurably wrong: a clean
    // run produced ten "confirm by hand" lines and two real blockers, so the
    // real findings were outnumbered five to one by permanent furniture.
    //
    // So each rule below that CAN be probed is probed, and fires only on sites
    // where it is live. `absent: true` inverts the test. Two rules genuinely
    // cannot be probed from static files -- the trade-licence question needs to
    // know the trade, and the breach question is about an incident, not a page
    // -- and those stay prose, which is the honest shape for them.
    extras: [
      {
        id: 'us/caloppa-conspicuous-link',
        severity: 'major',
        // Fires only when the word "privacy" appears nowhere on the site, which
        // is the one part of "conspicuously post" a static file can disprove.
        pattern: '/\\bprivacy\\b/i',
        absent: true,
        what: 'no visible "privacy" link anywhere on the site, so the policy is not conspicuously posted',
        detect: 'Check that a link whose visible text contains the word "privacy" appears on the homepage, not only on interior pages, and that it is in the footer of every page rather than buried in a submenu. The word "privacy" specifically -- a link labelled "Legal" or "Policies" alone does not satisfy the statute.',
        why: 'Cal. Bus. & Prof. Code 22577(b) defines "conspicuously post" as the policy on the homepage, or an icon linking to it, or a text link containing the word "privacy" in contrasting type, colour or size. This is a rare case of a US statute specifying link text.',
      },
      {
        id: 'us/testimonial-provenance',
        // MAJOR, not blocker, and deliberately. A blocker that fires on every
        // site with a testimonials section, with no way to satisfy it from a
        // static file, is a banner. The genuinely unbacked claims -- a star
        // rating with no sourced row -- are already caught as a BLOCKER by
        // regulatedClaims below, which can check facts.md. This rule covers the
        // ones no pattern can adjudicate, so it asks rather than blocks.
        severity: 'major',
        pattern: '/\\btestimonials?\\b|\\bwhat\\s+(our\\s+)?(clients|customers|patients)\\s+say\\b|\\breviews?\\b|\\bstar\\s+rating\\b/i',
        what: 'testimonials or reviews on the site -- each needs a real, attributable, permitted source',
        detect: 'For every quoted testimonial, named reviewer, star rating or aggregate score on the site, look for a sourced row in facts.md naming who said it and when. Flag any testimonial written by the owner, an employee, a relative, or generated, and any rating not traceable to a review platform.',
        why: '16 CFR 465.2, 465.4 and 465.5 (effective 21 Oct 2024) prohibit fake or false reviews including AI-generated ones, buying reviews, and insider reviews from officers, employees or their relatives without clearly disclosing the relationship. Civil penalties reach USD 53,088 per violation. The 2023 Endorsement Guides revision (88 FR 48102) separately treats review gating -- soliciting only the customers likely to be positive -- as deceptive. This is the single most likely way a small brochure site acquires real federal exposure, because testimonials are what gets typed in at the end when a page looks thin.',
      },
      {
        id: 'us/newsletter-can-spam',
        severity: 'major',
        pattern: '/\\bnewsletter\\b|\\bmailing\\s+list\\b|\\bsubscribe\\b|\\bsign\\s?up\\s+for\\s+(our\\s+)?(email|updates)/i',
        what: 'a newsletter or mailing-list signup with no plan for the sending obligations it creates',
        detect: 'If any form, field or copy invites an email subscription, check that facts.md records a real physical postal address for the business and that whatever will send the mail supports a working unsubscribe link.',
        why: 'CAN-SPAM, 15 U.S.C. 7704, requires every commercial email to carry a valid physical postal address, a working opt-out that stays live at least 30 days, honoured within 10 business days, and non-deceptive headers and subject lines. Note two things the standard advice gets wrong in opposite directions: the address requirement attaches to the MESSAGE, not to the website; and CAN-SPAM has NO opt-in requirement at all, so a US signup box needs no consent checkbox. Enforcement is via FTC Act s.5 penalties (USD 53,088 per violation), and state attorneys general may separately recover USD 250 per violation up to USD 2,000,000, trebled for wilful violations.',
      },
      {
        id: 'us/sms-invite-tcpa',
        severity: 'major',
        // "text us"/"text me" is specific enough not to fire on the ordinary
        // noun "text". A bare sms is safe for the same reason.
        pattern: '/\\btext\\s+(us|me|our\\s+team|the\\s+office)\\b|\\bsms\\b|\\btext\\s+\\(?\\d{3}\\)?[\\s.-]?\\d{3}/i',
        what: 'the site invites SMS contact, or a form implies the business will text back',
        detect: 'Look for "text us", "text me", "SMS", or a phone field labelled as mobile with copy suggesting the business will send messages. Distinguish inviting an INBOUND text (fine) from collecting a number in order to send OUTBOUND marketing (not fine without consent machinery).',
        why: 'TCPA, 47 U.S.C. 227(b) and 47 CFR 64.1200 -- marketing texts to a wireless number require prior express written consent that identifies the specific number and states that consent is not a condition of purchase. Damages are USD 500 per text, trebled to USD 1,500 for wilful violations, with a private right of action and no need to prove monetary loss. FCC revocation rules have been fully live since 11 April 2026, so any clear opt-out must be honoured promptly. Do NOT build for the FCC "one-to-one consent" rule that much compliance guidance still describes: the Eleventh Circuit vacated it on 24 January 2025 and it never took effect. Florida, Oklahoma and Washington add mini-TCPA layers with their own private rights of action (Fla. Stat. 501.059 verified).',
      },
      {
        id: 'us/trade-licence-number',
        severity: 'major',
        // Fires only when the copy reads as a licensed trade. The checker still
        // cannot know the STATE or whether the number shown is real, so this
        // remains a prompt -- but only for the businesses it could apply to.
        pattern: '/\\b(general\\s+contractor|contracting|contractors?|plumb\\w*|electric(ian|al)|hvac|roof(ing|er)|remodel\\w*|drywall|masonry|real\\s+estate\\s+broker|realtor)\\b/i',
        what: 'a licensed trade advertising services without displaying its licence number',
        detect: 'If facts.md identifies the business as a contractor, electrician, plumber, HVAC, roofer, real-estate broker or similar licensed trade, check that a licence number appears in the page copy itself -- not only on a linked page, and not only in a PDF.',
        why: 'Real and common, though state-specific. California: Cal. Bus. & Prof. Code 7030.5 requires the number in "all forms of advertising", which CSLB guidance and 16 CCR 861 extend to websites, and it must appear in the advertisement itself rather than on a page it links to. Nevada NRS 624.720 is the clearest-drafted, expressly defining advertising to include the Internet. Florida Stat. 489.119(5)(b) requires it "regardless of medium". Washington RCW 18.27.100 attaches it to any advertising showing the name or address, with penalties to USD 10,000. The checker cannot know the trade or the state, so this needs a human answer at stage 01.',
      },
      {
        id: 'us/no-bare-compliance-claim',
        severity: 'major',
        // A true probe: it fires only when the claim is actually on the page.
        // Note it does NOT match an honest accessibility statement, which talks
        // about WCAG and known limitations without asserting bare conformance.
        pattern: '/\\b(ada|wcag|gdpr|section\\s+508)[\\s-]*compliant\\b|\\bfully\\s+accessible\\b|\\b100%\\s+accessible\\b|\\bmeets\\s+all\\s+accessibility\\s+standards\\b/i',
        what: 'the site asserts it is "ADA compliant", "WCAG compliant", "fully accessible" or "GDPR compliant"',
        detect: 'Scan visible text for bare conformance assertions about the site itself -- "ADA compliant", "fully WCAG 2.1 AA compliant", "fully accessible", "100% accessible". An accessibility statement describing what HAS been done and what has not is the correct form and must not be flagged.',
        why: 'Three separate problems in one sentence. It is an unsubstantiated objective claim under FTC Act s.5 -- the exact theory on which the FTC took USD 1,000,000 from accessiBe in 2025 for claiming its product made sites WCAG-compliant. It is almost certainly untrue, since automated tooling fully covers only about 57% of issues. And it hands a plaintiff a written admission of awareness. In California the stakes are concrete: an ADA violation is automatically an Unruh Act violation under Cal. Civ. Code 51(f), carrying statutory damages of no less than USD 4,000 per violation under 52(a).',
      },
      {
        id: 'us/no-accessibility-overlay',
        severity: 'major',
        pattern: '/accessibe|userway|equalweb|audioeye|allyable|maxaccess|user1st|accessiway/i',
        what: 'an accessibility overlay or toolbar widget bolted onto the site',
        detect: 'Look for scripts from accessibe.com, userway.org, equalweb, audioeye, allyable, maxaccess or similar, and for injected "accessibility menu" toolbars.',
        why: 'An overlay does not fix the underlying markup, and the evidence points to it raising exposure rather than lowering it: plaintiffs\' firms run automated scans for known overlay scripts, and roughly a quarter of 2024 digital-accessibility suits targeted sites running one. (That figure is from a vendor competing with overlays -- treat it as directional.) The hard fact is the FTC\'s USD 1m order against accessiBe in 2025 for claiming its overlay delivered WCAG compliance. Fix the semantics, the labels, the contrast and the keyboard order instead. Nothing here is a legal requirement; it is a competence one.',
      },
      {
        id: 'us/tracker-litigation-surface',
        severity: 'major',
        // Narrower than nonEssentialScripts on purpose: plain analytics is NOT
        // the CIPA/VPPA risk and must not be reported as one. This lists only
        // the recording, pixel and third-party-video surfaces that actually
        // draw those claims.
        pattern: '/fullstory|mouseflow|luckyorange|hotjar|clarity\\.ms|fbq\\(|connect\\.facebook\\.net|tiktok\\.com\\/i18n\\/pixel|youtube\\.com\\/embed|vimeo\\.com\\/video|intercom|drift\\.com|tawk\\.to|livechatinc|tidio/i',
        what: 'session recording, a recording chat widget, an ad pixel, or embedded third-party video',
        detect: 'Beyond the plain analytics check, look specifically for session-replay and heatmap tools, chat widgets that transcribe visitor input, advertising and retargeting pixels, and third-party video embeds. Report them as a litigation surface even when a consent mechanism is present.',
        why: 'This is the real US tracker risk, and it is NOT the cookie-banner risk. California Penal Code 631, a 1967 wiretap statute, is being used against session replay, recording chat widgets and pixels; the reform bill SB 690 was still pending in July 2026 and as drafted would not reach the wiretap theory most suits plead. Embedded third-party video combined with a pixel additionally draws Video Privacy Protection Act claims at USD 2,500 statutory damages per violation, with the Supreme Court taking Salazar v. Paramount in January 2026 on who counts as a consumer. Plain first-party-configured analytics is low risk. The mitigation is removal, not a banner.',
      },
      {
        id: 'us/no-invented-state-rights',
        severity: 'blocker',
        // Matches the OPERATIVE assertions only. A bare ccpa was tried and
        // removed: a policy honestly saying "we are not a business under the
        // CCPA" would have tripped a blocker for telling the truth.
        pattern: '/do\\s+not\\s+sell\\s+(or\\s+share\\s+)?my\\s+personal|your\\s+california\\s+privacy\\s+rights|right\\s+to\\s+opt.?out\\s+of\\s+targeted\\s+advertising|\\bshine\\s+the\\s+light\\b|right\\s+to\\s+(know|delete|correct)\\s+under\\s+the\\s+(ccpa|cpra)/i',
        what: 'a privacy policy promising CCPA, CPRA or "state privacy law" rights the business is not subject to',
        detect: 'Check the privacy page for "Do Not Sell or Share My Personal Information", "your California privacy rights", "right to opt out of targeted advertising", or a rights list lifted from a generator, and cross-check facts.md for anything indicating the business clears a state threshold. A five-page brochure site does not.',
        why: 'All twenty state comprehensive privacy laws in effect on 2026-08-18 have volume or revenue thresholds a tiny site misses by orders of magnitude -- California needs USD 26,625,000 in revenue or 100,000 consumers bought, sold or shared; Texas and Nebraska exempt SBA small businesses outright; Florida requires USD 1 billion. A policy asserting rights and mechanisms that do not exist is a false statement about the business, published on the page specifically about being trustworthy with information, and an inaccurate privacy policy is itself an FTC Act s.5 deception. This is the most common defect in generator output. Note the honest exception: if the site later adds a retargeting pixel AND draws 100,000+ Californian visitors a year, "sharing" under Cal. Civ. Code 1798.140(ah) catches it without any sale, and the rights become real.',
      },
      {
        id: 'us/breach-plan',
        severity: 'minor',
        what: 'no stated route for handling a breach of contact-form data',
        detect: 'Not statically checkable. Confirm at handover that the client knows where form submissions are stored and who to call if that store is compromised.',
        why: 'State breach-notification statutes have NO size threshold -- Cal. Civ. Code 1798.82, Tex. Bus. & Com. Code 521.053, the NY SHIELD Act -- and reach a sole proprietor exactly as they reach a corporation. This is the one privacy obligation a tiny brochure site genuinely carries in full, and it is the one no checker can verify, because it is an incident duty rather than a page. Worth thirty seconds at handover: if the contact form posts to a third-party service, the client should know which one.',
      },
    ],

    // -----------------------------------------------------------------------
    // TWO DELIBERATE OVERRIDES OF profiles/_base.mjs, AND THE REASONS.
    //
    // Everything universal -- the tracker list, the claim regex patterns, the
    // page machinery -- comes from the base profile and is merged in by
    // checks/lib/profile.mjs. A country profile should answer a short list, not
    // restate the floor, and this file follows that: there is no
    // `nonEssentialScripts` here, because base's list is a strict superset of
    // anything a US-specific version would say. An earlier draft of this file
    // did restate it, and quietly dropped base's cookieless-analytics row --
    // which is the argument against restating a shared list in one line.
    //
    // The two overrides below are country-shaped judgements, which is exactly
    // what a profile is for. Both should be re-examined at the review date.
    // -----------------------------------------------------------------------

    // OVERRIDE 1 of 2. Third-party embeds that contact a third party on load.
    //
    // WHY THIS OVERRIDES BASE AT ALL: to REMOVE a row, not to add one. Base and
    // profiles/uk.mjs both flag hotlinked Google Fonts, on the authority of a
    // German court decision (LG Muenchen I, 3 O 17493/20) about transmitting a
    // visitor's IP to a third country without consent. There is no US analogue
    // to that holding, so emitting it as a LEGAL finding on a US run would be a
    // confident citation from the wrong country -- the exact defect this repo
    // exists to prevent, and the one that put a dated header on every profile.
    // Self-host the fonts anyway, because it is faster; that is a performance
    // finding and belongs to the perf rules.
    //
    // The rows kept below are re-justified on US grounds (VPPA, CIPA) rather
    // than inherited, and one row is added that base does not carry: recording
    // chat widgets, which are a named CIPA target.
    consentBeforeLoad: [
      [/(?<!nocookie\.)youtube\.com\/embed/i, 'YouTube embed loads and sets cookies before any visitor choice',
        'Swap the host for youtube-nocookie.com, or use a click-to-load poster image. In the US the sharper reason is not cookie law but the Video Privacy Protection Act: embedded third-party video combined with an advertising pixel is the fact pattern behind a live wave of VPPA claims at USD 2,500 statutory damages per violation.'],
      [/maps\.googleapis\.com|google\.com\/maps\/embed/i, 'Google Maps embed loads before any visitor choice',
        'Use a static map image linking out to Maps, or click-to-load. On a brochure site the embed is almost never worth the weight it adds.'],
      [/platform\.twitter\.com|instagram\.com\/embed|tiktok\.com\/embed/i, 'social embed loads before any visitor choice',
        'Click-to-load, or link out instead of embedding.'],
      [/intercom\.io|drift\.com|tawk\.to|livechatinc\.com|tidio/i, 'live chat widget that may record visitor input',
        'On a five-page brochure site a chat widget rarely earns its place -- a phone number does the same job. Recording chat widgets are a named target of California CIPA wiretapping claims (Penal Code 631), and the reform bill SB 690 was still pending as of July 2026.'],
    ],

    // OVERRIDE 2 of 2. Claims that need evidence before they may ship.
    //
    // The loader builds `regulatedClaims` from base's `claimPatterns` plus the
    // `claimCitations` above, and that is the shape every other country profile
    // uses. This file supplies the array by hand instead, for one reason worth
    // stating precisely so it can be undone:
    //
    //   base's `count` pattern fires on "We do more than clients expect", and
    //   base's `guarantee` pattern fires on "We cannot guarantee that the part
    //   is in stock" -- a DISCLAIMER flagged as a guarantee.
    //
    // Both are verified false positives, and the loader's build is all-or-
    // nothing, so there is no way to correct two classes without owning the
    // list. The patterns below are base's, with those two tightened to require
    // a digit and to require "we guarantee" adjacently.
    //
    // THIS IS THE WRONG PLACE FOR THAT FIX and it should not survive. The bug is
    // in the shared floor and affects every profile, not just this one. When
    // base's two patterns are corrected, delete this whole array and add a
    // `localRegisters` entry naming the US registers instead (BBB, NATE, ASE,
    // EPA Lead-Safe, NARI, state contractor boards) -- the loader will then
    // assemble the same result from the shared patterns and the citations
    // above, and this profile will match its siblings.
    //
    // PRECISION OVER RECALL, deliberately, and every pattern here was tested
    // against innocent prose before it shipped. A gate that cries wolf is a gate
    // people learn to skip, which is worse than no gate. Four patterns are
    // TIGHTER than their UK equivalents because the UK versions fire on ordinary
    // English, and the failures are recorded next to each so nobody loosens them
    // back: "We do more than clients expect", "we cannot guarantee that",
    // "Suite #1 Main Street", "licensed by the State of California".
    // The loader assembles regulatedClaims from _base.mjs claimPatterns plus
    // these citations. This file used to hand-roll the whole array, which
    // bypassed the shared patterns entirely: the environmental claim class did
    // not exist here at all, so an unsubstantiated green claim shipped clean,
    // and the accreditation pattern carried an /i flag that the base file
    // explicitly warns turns a precise gate into a cry-wolf one.
    // localRegisters, if this profile grows any, supplies named registers.
    claimCitations: {
      rating:
        'FTC Rule on the Use of Consumer Reviews and Testimonials, 16 CFR 465.2, effective 21 October 2024 -- a rating that misrepresents real consumer experience violates a trade regulation rule, carrying civil penalties up to USD 53,088 per violation. The rule is live and being enforced (warning letters Dec 2025; TruHeight settlement Apr 2026). It must trace to real, attributable reviews.',
      count:
        'FTC Act s.5, 15 U.S.C. 45, plus the advertising substantiation doctrine -- a specific number is an objective factual claim requiring a reasonable basis held BEFORE publication. If nobody counted, there is no number.',
      superiority:
        'FTC Act s.5, 15 U.S.C. 45 -- an objective superiority claim is judged by the deception test: a representation likely to mislead a reasonable consumer, material to the decision. Substantiation must be held before publication. An award claim needs a real award, from a named body, in a stated year. There is no US equivalent of the CAP Code, so the exposure is FTC enforcement and competitor Lanham Act suits instead.',
      accreditation:
        'FTC Act s.5 for the misrepresentation, and state licensing law for the underlying conduct -- the second is the sharper edge. Advertising a trade licence not held is a matter for the state licensing board: in California it draws a fine under Cal. Bus. & Prof. Code 7027.1, and a licensed contractor must show the number in all advertising under 7030.5 (Nevada NRS 624.720 expressly includes the Internet; Florida Stat. 489.119(5)(b) says "regardless of medium"; Washington RCW 18.27.100 carries penalties to USD 10,000). Note that "licensed, bonded and insured" is THREE separate factual claims and each must be true.',
      guarantee:
        'FTC Act s.5 -- a guarantee published on the site is a representation the business is held to, and state contract and warranty law makes it an enforceable term. Only ship one the owner has agreed to honour. The guarantee itself is lawful; misstating its scope, or declining to honour it, is the exposure.',
      insurance:
        'FTC Act s.5 -- a false statement of insurance cover is material, because it is exactly the fact a customer relies on when letting a stranger into their home. Substantiable, and clients do ask for the certificate.',
      years:
        'FTC Act s.5 -- a specific number is checkable against the secretary of state filing, the licence issue date, or the domain registration. Confirm it before it ships.',
      environmental:
        'FTC Act s.5 plus the FTC Green Guides (16 CFR Part 260) - an unqualified environmental benefit claim must be substantiated and, where the benefit is limited, qualified clearly and prominently. State mini-FTC acts add private rights of action in most states. UNCONFIRMED whether the Green Guides revision proposed in 2022 has been finalised - check at review.',
    },
  },

  seo: {
    locale: 'en_US',
    // A US local business without LocalBusiness structured data is invisible in
    // the map pack, which is the search that actually produces phone calls.
    localBusinessRequired: true,
  },
};
