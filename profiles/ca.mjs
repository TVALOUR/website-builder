// website-builder — Canada profile.
//
// NOT LEGAL ADVICE. This encodes what a competent web developer should ship by
// default so a small Canadian business is not obviously exposed. A regulated
// trade, a federally regulated business, or a business with real e-commerce
// has more obligations than any static checker can know about, and the gate
// says so rather than implying a green run means "compliant".
//
//   LAW LAST VERIFIED: 2026-08-18
//   NEXT REVIEW:       2027-02-18
//
// Follow uk.mjs's discipline: every citation below carries a URL that was
// actually fetched (or, where marked, retrieved via a search-engine snippet
// quoting the real page — see profiles/_research/ca.md for which is which)
// on the date above. Where a fact could not be pinned to a primary source in
// the time available, it is marked UNCONFIRMED rather than asserted. A
// confident wrong citation is the exact failure this repo exists to prevent
// (see uk.mjs's header — three revoked/rewritten UK citations sat undetected
// because nothing recorded a verification date).
//
// SCHEMA NOTE, read before wiring this in: this file follows the split
// architecture described in profiles/_base.mjs (universal nonEssentialScripts
// / consentBeforeLoad / claimPatterns live in _base.mjs; a country profile
// supplies only consentModel, pages, disclosure and claimCitations). As of
// this writing checks/rules/legal.mjs does NOT merge _base.mjs — it reads a
// profile's OWN top-level nonEssentialScripts/consentBeforeLoad/regulatedClaims
// and disclosure.limited, which is the shape uk.mjs still uses. Running this
// file through the checker as-is will therefore throw (L.regulatedClaims and
// L.nonEssentialScripts are undefined) until the loader is updated to merge
// _base.mjs the way its own header describes, or this file is additionally
// given the old flat shape. Flagged, not silently worked around — a decision
// for whoever wires the CA profile in, not a call this file should make
// unilaterally by guessing which shape "wins".

export default {
  id: 'ca',
  name: 'Canada (PIPEDA · Quebec Law 25 · Competition Act · ACA/AODA)',
  country: 'Canada',
  iso2: 'CA',

  provenance: {
    status: 'researched', // machine-assembled from primary sources, NOT reviewed by a lawyer
    verifiedBy: null,
    lawLastVerified: '2026-08-18',
    nextReview: '2027-02-18',

    sources: [
      { claim: 'Bill C-27 (which carried the Consumer Privacy Protection Act) died when Parliament was prorogued 6 January 2025; PIPEDA remains the operative federal private-sector privacy statute; as of this article, no successor bill has been reintroduced under a confirmed number', url: 'https://gowlingwlg.com/en/insights-resources/articles/2025/federal-privacy-reform', accessed: '2026-08-18' },
      { claim: 'PIPEDA current landing page — confirms the 10 fair information principles (accountability, identifying purposes, consent, limiting collection, limiting use/disclosure/retention, accuracy, safeguards, openness, individual access, challenging compliance) are still the live framework', url: 'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/', accessed: '2026-08-18' },
      { claim: '"Commercial activity" under PIPEDA s.2(1) turns on the nature of the activity, not the size, revenue, or for-profit status of the organization — no small-business or revenue-threshold exemption exists', url: 'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda-compliance-help/pipeda-interpretation-bulletins/interpretations_03_ca/', accessed: '2026-08-18' },
      { claim: 'Alberta PIPA and BC PIPA (and Quebec\'s private-sector Act) are designated "substantially similar" to PIPEDA; the designation exempts in-province activity from PIPEDA but PIPEDA still applies to interprovincial/cross-border transfers and to federally regulated businesses regardless of province', url: 'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/prov-pipeda/', accessed: '2026-08-18' },
      { claim: 'PIPEDA consent must be express when information is sensitive or the use falls outside reasonable expectations; implied consent (opt-out) can be acceptable for less-sensitive information with clear notice — retrieved via search snippet quoting the OPC\'s "Interpretation Bulletin: Form of Consent" and "Guidelines for obtaining meaningful consent" pages, not independently re-fetched in full', url: 'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda-compliance-help/pipeda-interpretation-bulletins/interpretations_07_consent/', accessed: '2026-08-18' },
      { claim: 'Quebec Law 25 (formerly Bill 64) came into force in three phases — 22 Sept 2022, 22 Sept 2023, and the final phase 22 Sept 2024, which introduced the right to data portability (structured, commonly-used technological format; 30/20+10 day response windows)', url: 'https://www.blg.com/en/insights/2024/ri/quebec-law-25-still-has-more-to-say-answers-to-your-questions-on-the-new-data-portability-right/', accessed: '2026-08-18' },
      { claim: 'Law 25 applies based on the location of the individual, not the organization — an out-of-province or out-of-country business offering goods/services to, or monitoring the behaviour of, people in Quebec is in scope, with no size or revenue threshold', url: 'https://www.bclplaw.com/en-US/events-insights-news/quebec-law-no-25-a-little-known-privacy-law-with-a-big-reach.html', accessed: '2026-08-18' },
      { claim: 'Law 25 requires a designated Privacy Officer whose contact information is made public (default: the person with the highest authority in the organization, i.e. often the owner of a small business, unless the role is delegated); requires clear prior notice — separate from the general privacy notice — before activating any technology that identifies, locates or profiles a person, with non-essential tracking/profiling technology off by default until the visitor activates it', url: 'https://www.mccarthy.ca/en/insights/blogs/techlex/quebecs-law-25-and-cookies-not-so-cookie-cutter', accessed: '2026-08-18' },
      { claim: 'CASL regulates commercial electronic messages (CEMs) sent to an electronic address — it does not regulate a website\'s existence or content by itself; the scope is defined around messages, not pages', url: 'https://ised-isde.canada.ca/site/canada-anti-spam-legislation/en', accessed: '2026-08-18' },
      { claim: 'CASL implied consent arises from an existing business relationship — a purchase, contract, or (narrower) an inquiry — valid for 2 years from the transaction or 6 months from a bare inquiry; the burden of proving consent, express or implied, sits with the sender, who must keep records', url: 'https://help.klaviyo.com/hc/en-us/articles/4402385511579', accessed: '2026-08-18' },
      { claim: 'CASL s.74.011 of the Competition Act (parallel electronic-advertising provision) and CASL itself both touch sender-identification in electronic messages; testimonials/endorsements are policed under Competition Act ss.52, 74.01 and 74.02 as false-or-misleading representations, including an undisclosed material connection (payment, free product, employment) between the endorser and the business', url: 'https://www.ipvancouverblog.com/testimonials/', accessed: '2026-08-18' },
      { claim: 'Competition Bureau drip-pricing rule: never advertise an unattainable price — mandatory fixed fees the buyer cannot avoid must be in the headline price, with the only exception being a fee imposed directly by a statute; a variable charge can still raise concerns', url: 'https://competition-bureau.canada.ca/en/deceptive-marketing-practices/drip-pricing', accessed: '2026-08-18' },
      { claim: 'Bill C-59 added Competition Act s.74.01(b.1) (product-level environmental-benefit claims must be based on "adequate and proper testing," burden on the claimant) and s.74.01(b.2) (business/business-activity-level environmental claims must be based on "adequate and proper substantiation in accordance with internationally recognized methodology," burden on the claimant) — reverse-onus, in force 20 June 2024 (royal assent); "internationally recognized methodology" is not defined in the Act itself', url: 'https://www.blg.com/en/insights/2024/07/false-advertising-and-greenwashing-bill-c-59-changes-to-competition-act', accessed: '2026-08-18' },
      { claim: 'The Competition Act\'s new private right of access (leave from the Competition Tribunal on a public-interest test) for deceptive-marketing conduct under s.74.01/74.1 and civil collaborations under s.90.1 came into force 20 June 2025', url: 'https://www.osler.com/en/insights/updates/private-right-of-access-for-relief-from-anti-competitive-harm-now-in-force-in-canada/', accessed: '2026-08-18' },
      { claim: 'The Accessible Canada Act applies to the federal public sector and to federally regulated private-sector organizations only (banking, interprovincial transport, telecoms, etc.) — an ordinary provincially-regulated small business is outside its scope entirely', url: 'https://allyant.com/compliance/aca-compliance-the-accessible-canada-act/', accessed: '2026-08-18' },
      { claim: 'Ontario\'s AODA Information and Communications Standard requires WCAG 2.0 Level AA for public web content posted after 1 January 2012, but ONLY for designated public-sector organizations and private/non-profit organizations with 50 or more employees; a business under that threshold has no AODA website obligation', url: 'https://www.ontario.ca/page/how-make-websites-accessible', accessed: '2026-08-18' },
      { claim: 'Charter of the French Language s.52: catalogues, brochures and "other publications of the same nature, regardless of the medium used" must be available in French, and if bilingual the French version must be displayed at least as prominently and on terms at least as favourable; a 2024 regulation clarified this reaches website and social-media content, with a package of final Bill 96 amendments (including the trademark/signage "markedly predominant" rule) in force 1 June 2025', url: 'https://www.weglot.com/blog/bill-96-explained', accessed: '2026-08-18' },
      { claim: 'On 1 June 2025 the employee threshold for mandatory francisation (workplace) registration with the OQLF dropped from 50 to 25 — a separate obligation from the s.52 website-content rule, which carries no employee-count threshold at all', url: 'https://gowlingwlg.com/en/insights-resources/articles/2025/entree-dernieres-dispositions-loi-96', accessed: '2026-08-18' },
      { claim: 'No Canadian statute requires a corporation number or registered-office address to be published on a business\'s own website; the CBCA\'s individuals-with-significant-control register is filed with, and searched through, Corporations Canada, not displayed on the company\'s site', url: 'https://ised-isde.canada.ca/site/corporations-canada/en/business-corporations/public-disclosure-corporate-information', accessed: '2026-08-18' },
      { claim: 'Ontario\'s Consumer Protection Act, 2002 "internet agreement" disclosure duty (supplier name, address, etc.) is triggered only when a consumer is entering an actual internet AGREEMENT with a payment obligation over $50 — it does not reach an informational brochure site with no checkout', url: 'https://www.mannlawyers.com/resources/internet-agreements-with-ontario-consumers-consumer-protection-act-considerations-for-businesses/', accessed: '2026-08-18' },
      { claim: 'PIPEDA mandatory breach-reporting rules (report to the OPC and affected individuals on a "real risk of significant harm" threshold; keep records of every breach regardless) came into force 1 November 2018 and remain current', url: 'https://ehlaw.ca/new-pipeda-breach-reporting-obligations/', accessed: '2026-08-18' },
      { claim: 'NANPA permanently reserves 555-0100 through 555-0199 inside every North American area code (Canada is part of the NANP) for fictional/testing use; 555-1212 (directory assistance) and 555-4334 are separately reserved and are NOT fictional-safe', url: 'https://en.wikipedia.org/wiki/555_(North_American_Numbering_Plan)', accessed: '2026-08-18' },
    ],

    caveats: [
      'This profile assumes the site is reachable by the general public with no geofencing. If Quebec traffic is genuinely and verifiably excluded, several Law 25 duties here (the French-language requirement, the profiling notice, the named privacy officer) may not bind — that determination needs a human, not this file.',
      'No court or Tribunal decision was found applying PIPEDA, Law 25, or the Competition Act specifically to a 5-10 page brochure site with a third-party contact form. Every citation is the statute or regulator guidance applied to that fact pattern by this file\'s author, not a precedent decided on it.',
      'Whether provincial Business Names Registration Act disclosure duties (which generally attach to invoices, contracts and cheques) extend to the CONTENT of a business\'s own website could not be confirmed for any province in the research time available. Treated conservatively as NOT required on-site; see disclosure.corporation/soleTrader below, both intentionally near-empty.',
      '"Internationally recognized methodology" (Competition Act s.74.01(b.2), the business-level greenwashing provision) is undefined in the Act itself as of this review. The Bureau opened a post-2024 consultation referencing frameworks like ISSB, SASB, GRI and TCFD without endorsing one — so no single citation can name "the" required methodology.',
      'Alberta PIPA and BC PIPA each carry their own website-facing detail (slightly different consent wording, breach-notice thresholds) that this profile does not separately encode. It treats PIPA-governed Canada as PIPEDA-equivalent for this checker\'s purposes, which is a simplification a business operating solely within Alberta or BC should not fully rely on.',
      'The claim that the OPC has shifted toward a "GDPR-aligned" posture on tracking-technology consent (requiring meaningful, closer-to-express consent for advertising/profiling pixels even outside Quebec) rests on secondary commentary, not a primary OPC guidance document independently re-fetched in full during this research pass — the OPC\'s own online-behavioural-advertising guidance page returned a 404 when fetched directly. Treat the stricter reading as the safer default, not as independently confirmed OPC text.',
      'Nothing in this file was reviewed by a lawyer called to the bar in any Canadian province or territory. It is a competent-developer default assembled by an AI agent from primary and secondary sources — not legal advice, and not a substitute for one when the stakes are real (a regulated trade, real e-commerce, a business that already has a Quebec footprint).',
      'This file was written against the schema described in profiles/_base.mjs (claimCitations, disclosure.corporation/soleTrader/all). As of 2026-08-18, checks/rules/legal.mjs does not merge _base.mjs and still reads a profile\'s own top-level nonEssentialScripts/consentBeforeLoad/regulatedClaims and disclosure.limited — the shape uk.mjs uses. This file will not run cleanly through the checker until that loader gap is closed; see the header comment above and profiles/_research/ca.md.',
      'CASL\'s implied-consent time windows and record-keeping duty are documented here for completeness but describe an EMAIL-MARKETING operational practice, not a website-content gate — nothing in checks/rules/legal.mjs currently checks CASL compliance at all, and this profile does not invent a check for it.',
    ],
  },

  locale: {
    language: 'en-CA',
    // Canadian Press style (the de facto newsroom/business-writing standard)
    // keeps the British -our/-re endings (colour, centre, favour, theatre)
    // but follows American practice for -ize over -ise (organize, realize)
    // and shortens -gramme to program. That is closer to 'gb' than 'us' on
    // the endings a spell-checker actually flags, so 'gb' is the better of
    // the two available buckets — not a perfect fit, because no such bucket
    // exists for the specific CP hybrid. A French-language build (Quebec
    // audience) is a different locale entirely (fr-CA) and is out of scope
        // for this file, which covers the English-language default only.
    spelling: 'gb',
    dateFormat: 'MMMM D, YYYY',
    currency: 'CAD',
    currencySymbol: '$',
    // A real Toronto area code (416) paired with the NANP's reserved
    // fictional block, so the format reads as authentic without being a
    // number anyone could actually dial into existence.
    phoneExample: '(416) 555-0142',
    fictionalPhoneRange: 'NANPA reserves 555-0100-555-0199 in every North American area code for fiction/testing, and Canada is part of the NANP — see provenance.sources. 555-1212 (directory assistance) and 555-4334 are NOT in the fictional-safe range.',
    // Canadian postal code: letter-digit-letter, space, digit-letter-digit.
    // The excluded first-position letters (D, F, I, O, Q, U) and excluded
    // letters elsewhere (D, F, I, O, Q, U, plus W and Z outside the first
    // position) follow Canada Post's forward-sortation-area rules. As a
    // STRING because the loader compiles it; case-insensitive is assumed.
    postcodePattern: '^[ABCEGHJ-NPRSTVXY]\\d[ABCEGHJ-NPRSTV-Z] ?\\d[ABCEGHJ-NPRSTV-Z]\\d$',
    addressOrder: 'street, city, province postalcode',
    measurement: 'metric',
  },

  copy: { emDashPer1000Warn: 6.43, emDashPer1000Block: 10.13, language: 'en-CA' },

  legal: {
    privacyLaw: 'PIPEDA (+ Quebec Law 25 / Alberta PIPA / BC PIPA where they apply)',

    // Canada does not have one national answer here, which is the thing
    // generic "Canadian website compliance" advice usually flattens away.
    // Outside Quebec, PIPEDA tolerates IMPLIED consent (a clear notice, no
    // forced click) for non-sensitive, in-expectation collection — ordinary
    // first-party analytics disclosed in a privacy policy is the textbook
    // case, and the OPC guidance on meaningful consent says so directly (see
    // provenance.sources). That is 'notice-and-opt-out' territory, not
    // GDPR-style prior opt-in, and a business that operates entirely outside
        // Quebec and can prove it may legitimately ship a lighter cookie story.
    //
    // But a static brochure site on the open internet cannot prove a Quebec
    // visitor will never arrive, and Quebec Law 25 is stricter on exactly
    // the mechanism this repo cares about: any technology that identifies,
    // locates or profiles a visitor — which reaches ordinary analytics and
    // ad pixels, not just narrowly-defined "cookies" — must be OFF BY
    // DEFAULT until the visitor takes an action to turn it on. That is
    // functionally prior-opt-in.
    //
    // So the shipped default here is the stricter one, exactly as the UK
    // profile ships PECR's stricter reading rather than assuming every
    // visitor is a "non-cookie-averse" one. A business that can genuinely
    // rule out Quebec traffic (a hyper-local service area, verified) is the
    // one case where 'notice-and-opt-out' would be the honest, lighter
    // answer instead — that is a judgment call for the human building the
    // site, not something this file should silently assume.
    consentModel: 'prior-opt-in',
    consentModelWhy: 'Quebec Law 25 requires profiling/tracking technology to be off by default with a specific prior notice before activation (see provenance.sources — McCarthy Tetrault, "Law 25 and Cookies"), and Law 25 applies based on the VISITOR\'s location, not the business\'s, so any site reachable from Quebec without geofencing is in scope. PIPEDA alone, for a business genuinely outside Quebec\'s reach, would tolerate notice-and-opt-out (implied consent with clear notice) for non-sensitive, in-expectation collection like basic first-party analytics — see the OPC\'s guidance on meaningful consent. Ship the Quebec-safe default; treat the lighter PIPEDA-only answer as an explicit, documented exception, not the default.',

    pages: {
      privacy: {
        patterns: [/privacy|confidentialit/i],
        required: 'always',
        why: 'PIPEDA\'s openness principle requires a readily available policy explaining an organization\'s personal-information practices the moment any personal data is collected — which a contact form or analytics both trigger. Quebec Law 25 adds specific content requirements a generic PIPEDA-only notice will miss (see mustMention).',
        mustMention: [
          [/\b(what|which)\s+(data|information)|we\s+collect|personal\s+(data|information)/i, 'what personal information is collected'],
          [/\b(purpose|why\s+we\s+(collect|use)|consent)\b/i, 'the purpose(s) it is collected for and that consent is the basis (PIPEDA has no GDPR-style "legal basis" menu — consent, express or implied, is the mechanism)'],
          [/\b(right\s+to|your\s+rights|access|correct|rectif|withdraw\s+(your\s+)?consent|portability)\b/i, 'data-subject rights — access, correction, withdrawing consent, and (for Quebec residents, since 22 Sept 2024) data portability'],
          [/\b(retain|retention|how\s+long|keep\s+your)\b/i, 'how long data is kept'],
          [/\b(privacy\s+(officer|contact)|responsable\s+de\s+la\s+protection)\b/i, 'the name or title of the person accountable for privacy — required to be identifiable under PIPEDA\'s accountability principle everywhere, and required to be PUBLICLY named under Quebec Law 25'],
          [/\b(privacy\s+commissioner|office\s+of\s+the\s+privacy\s+commissioner|opc|priv\.gc\.ca|commission\s+d.acc[eè]s\s+[aà]\s+l.information|\bcai\b)\b/i, 'the right to complain to the OPC (and, for Quebec residents, the CAI)'],
          [/[\w.+-]+@[\w-]+\.[\w.]+|\bcontact\s+us\b/i, 'a contact route for a privacy request'],
        ],
      },
      cookies: {
        patterns: [/cookie|temoin/i],
        required: 'if-non-essential-scripts',
        why: 'Whether a banner is REQUIRED is genuinely split by geography, which is the point of consentModelWhy above — but a cookie/tracking-technology PAGE explaining what is set and why is good PIPEDA openness-principle practice everywhere, and Quebec Law 25\'s profiling notice must exist as its own clear notice regardless. See shared/legal.md\'s "no banner on a site with nothing to consent to" logic — it applies here exactly as it does in the UK profile: the honest default for a five-page local-business site with no analytics is NO cookies page and NO banner at all.',
        mustMention: [
          [/\bessential|strictly\s+necessary\b/i, 'the essential/non-essential split'],
          [/\b(identif(y|ies)|locate|profil(e|ing))\b/i, 'that any technology identifying, locating or profiling a visitor is named (Quebec Law 25\'s profiling-notice concept reaches ordinary analytics and ad pixels, not just cookies narrowly)'],
          [/\b(withdraw|change|manage|opt.?out|deactivate)\s+(your\s+)?(consent|preferences|cookie)|\bno\s+cookies\b|\bsets\s+no\s+cookies\b/i,
            'how to withdraw/deactivate, or a statement that nothing needing consent is set'],
        ],
      },
      terms: {
        patterns: [/terms|conditions/i],
        required: 'recommended',
        why: 'Not a statutory requirement for a brochure site under any Canadian law found in this research; standard practice, limits liability, cheap to ship.',
        mustMention: [],
      },
      accessibility: {
        patterns: [/accessib/i],
        required: 'recommended',
        why: 'The Accessible Canada Act reaches only the federal public sector and federally regulated businesses (banking, interprovincial transport, telecoms) — not an ordinary provincially-regulated small business. Ontario\'s AODA Information and Communications Standard sets WCAG 2.0 AA for public web content, but ONLY for organizations with 50+ employees; a business under that threshold has no AODA website obligation at all, and other provinces (outside Ontario, Manitoba, Nova Scotia, BC) have no equivalent website standard in force. So for the overwhelming majority of clients this checker will ever build for, an accessibility statement is best practice, not law — and claiming otherwise wastes build effort and misleads the client, exactly as the UK profile says about the European Accessibility Act.',
        mustMention: [
          [/\bwcag\b/i, 'the standard targeted'],
          [/\b(report|contact|email|tell us|get in touch)\b/i, 'how to report a problem'],
          [/\b(known\s+limitation|not\s+(yet\s+)?(been\s+)?tested|we\s+have\s+not|aim|target|working\s+towards)\b/i,
            'honest limits — the statement must say what is NOT done, not assert bare conformance'],
        ],
      },
    },

    // Canada has no equivalent of the UK's Companies Act / Trading Disclosures
    // Regulations requirement to show a company number and registered office
    // ON the business's own website (see provenance.sources — the CBCA's
    // individuals-with-significant-control register is filed with and
    // searched through Corporations Canada, not published on the company's
    // site). That is a genuinely different shape from the UK profile, not a
    // gap in research — both `corporation` and `soleTrader` are deliberately
    // near-empty. Do not add a company-number pattern here without a found
    // statute requiring it; see caveats above on the Business Names Act
    // question, which stayed UNCONFIRMED.
    disclosure: {
      corporation: [],
      soleTrader: [],
      all: [
        [/[\w.+-]+@[\w-]+\.[\w.]+|tel:|\b\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/,
          'an email address or phone number',
          'No single Canadian statute mandates this the way the UK\'s E-Commerce Regulations do — Ontario\'s Consumer Protection Act "internet agreement" disclosure duty, the closest analogue, is triggered only by an actual online purchase agreement over $50, which a no-checkout brochure site never forms (see provenance.sources). This is a practical baseline the checker enforces anyway: PIPEDA\'s openness principle assumes an individual can reach the organization to make a privacy request, and every provincial consumer-protection complaint process assumes a working contact route exists. Not a single hard citation; a floor.'],
      ],
    },

    // Claim CLASSES are universal; their regex patterns live in _base.mjs.
    // This supplies the CANADIAN law that makes each one risky.
    claimCitations: {
      rating: 'A fabricated, incentivized-but-undisclosed, or unrepresentative star rating is a false-or-misleading representation under Competition Act ss.52 (criminal) and 74.01 (civil, reviewable conduct). Canada has no dedicated fake-review statute the way some jurisdictions are adopting — ordinary misleading-advertising law carries it, and the Bureau treats undisclosed paid/incentivized reviews as an active enforcement priority. It must trace to a real, attributable review.',
      count: 'A specific customer/client/project count is a "representation to the public" under Competition Act s.74.01(1)(a) — false or misleading in a material respect is reviewable by the Bureau and, since 20 June 2025, by a private applicant who obtains Tribunal leave on a public-interest test. Must be substantiable on request.',
      superiority: 'An objective superiority, "award-winning," or "market-leading" claim is a factual representation under s.74.01 and must be true; if it is not, the exposure runs to administrative monetary penalties, not just a slap on the wrist. General subjective puffery ("great service") is not caught, which is why the shared pattern requires an intensifier plus a place name or "award-winning" — see _base.mjs\'s precision-over-recall note.',
      accreditation: 'Claiming membership of, or accreditation by, a real trade body or regulator the business does not actually hold is a false representation under ss.52/74.01, and for a regulated trade (electricians, real estate, several health professions) is independently a licensing offence under the relevant provincial act — a criminal matter, not a marketing slip. The membership or registration number must be real and checkable.',
      guarantee: 'A guarantee stated on the site is both a contractual term the business is held to AND, if the business does not actually honour it, a false-or-misleading representation under s.74.01. Only ship one the owner has agreed to.',
      insurance: 'Substantiable in the same way as an accreditation claim — s.74.01 catches a false claim of being insured, and a commercial or trade client asking to see the certificate before hiring is routine, not paranoid.',
      years: 'A specific years-in-business or years-of-experience number is checkable against the relevant provincial corporate/business-name registry or the domain\'s registration date, and is a "representation to the public" under s.74.01 if it is wrong. Confirm it before it ships.',
      environmental: 'Greenwashing — Competition Act s.74.01(b.1) (product-level environmental-benefit claims) and s.74.01(b.2) (business/business-activity-level claims), both added by Bill C-59 and in force since 20 June 2024. BOTH ARE REVERSE-ONUS: the business, not the Bureau, must already hold "adequate and proper testing" (product claims) or "adequate and proper substantiation in accordance with internationally recognized methodology" (business claims) BEFORE the claim is published, not assembled after a complaint. "Internationally recognized methodology" is undefined in the Act itself as of this review (see caveats) — treat any such claim as unsafe to ship unless the business can name the actual methodology used. Private parties gained the right to bring a case directly to the Competition Tribunal, with leave on a public-interest test, on 20 June 2025.',
    },

    extras: [
      {
        id: 'ca/quebec-french-language',
        severity: 'major',
        what: 'Charter of the French Language s.52 — a commercial website reachable by Quebec residents (no geofencing assumed) must offer French content on terms "at least as favourable" as, and displayed at least as prominently as, any other language. This is not a Bill 96 invention; s.52 predates it and a 2024 regulation clarified it reaches website and social-media content specifically. French cannot be a stub or a lesser summary of the English content.',
        detect: 'Prose description for the checker: confirm whether the site is realistically limited to a single non-Quebec market (a strong local-service-area signal in facts.md) or is open to the whole Canadian/global public. If the latter, check for a French-language version that mirrors the English content in completeness, not just a translated homepage.',
        why: 'See provenance.sources (Weglot / Gowling WLG on Bill 96\'s final 1 June 2025 provisions) — this is one of the sharpest differences from every other jurisdiction this repo covers: it is a LANGUAGE mandate tied to reachability, not a disclosure or consent mandate.',
      },
      {
        id: 'ca/law25-privacy-officer',
        severity: 'major',
        what: 'Quebec Law 25 requires a designated, publicly identifiable Privacy Officer. Default, absent delegation, is the most senior person in the organization — for a sole trader or small partnership, that is usually the owner by name or title.',
        detect: 'Prose description: the privacy policy names a person or role (not only a generic "contact us") responsible for privacy, with a way to reach them.',
        why: 'See provenance.sources (McCarthy Tetrault) — this is genuinely stricter than PIPEDA\'s baseline, which requires the accountable individual to be identifiable ON REQUEST, not published by default.',
      },
      {
        id: 'ca/law25-profiling-notice',
        severity: 'major',
        what: 'Law 25 requires a specific, separate notice — distinct from the general privacy policy — before activating any technology that identifies, locates, or profiles a visitor, and that technology must be OFF by default. This concept is broader than "cookies": it reaches ordinary analytics and ad pixels.',
        detect: 'Prose description: if any nonEssentialScripts hit fires (per _base.mjs), confirm the consent mechanism\'s copy specifically names the technology and frames it as profiling/tracking, not just "cookies" generically.',
        why: 'See provenance.sources (McCarthy Tetrault, "Law 25 and Cookies: Not So Cookie Cutter") — the same finding drives consentModel above.',
      },
      {
        id: 'ca/casl-scope',
        severity: 'minor',
        what: 'CASL does not regulate the website itself — it regulates commercial electronic messages SENT to an electronic address (email, SMS, social DM). A contact form or a newsletter sign-up field on the site is not itself a CASL event. CASL bites the moment the business actually emails those addresses something commercial, at which point consent (express, or implied via an existing business relationship inside CASL\'s 2-year/6-month windows) and a working unsubscribe are owed, with the burden of proving consent on the sender.',
        detect: 'Prose description: do NOT flag the mere presence of a contact form or newsletter field as a CASL exposure. If the site\'s own copy promises automated marketing emails will follow a form submission, that is the point to raise CASL, not the form\'s existence.',
        why: 'See provenance.sources (ised-isde.canada.ca) — this is the contradiction-angle finding for CASL: a lot of generic "Canadian website compliance" content implies CASL is a website-content law. It is not; it is an email-marketing law that happens to be enforced by the CRTC.',
      },
      {
        id: 'ca/business-identity-no-uk-equivalent',
        severity: 'minor',
        what: 'Unlike the UK, no Canadian statute found in this research requires a corporation number or registered-office address to be published ON a business\'s own website. The CBCA\'s individuals-with-significant-control register is filed with, and searched through, Corporations Canada — not displayed on the company\'s own site. Provincial "internet agreement" disclosure duties (e.g. Ontario CPA 2002 s.38-ish territory) trigger only once an actual paid consumer agreement is being formed online, which a checkout-free brochure site never does.',
        detect: 'Prose description: do not demand a company/registration number, registered office, or trading-disclosure block the business has no legal obligation to publish. If the build later grows real e-commerce, re-run this research — the shape changes.',
        why: 'See provenance.sources (Corporations Canada; Mann Lawyers on Ontario CPA "internet agreements") — this is the surprising negative finding the brief asked for, and it genuinely changes this profile\'s shape versus uk.mjs\'s disclosure.limited/soleTrader blocks.',
      },
    ],
  },

  seo: {
    locale: 'en_CA',
    // A Canadian local business without these is invisible in the search
    // that matters, same logic as the UK profile.
    localBusinessRequired: true,
  },
};
