// website-builder — European Union profile (the EU-wide FLOOR, not any one member state).
//
// NOT LEGAL ADVICE. This encodes what a competent web developer should ship by
// default so a small EU business is not obviously exposed. A regulated trade
// (healthcare, finance, law, gas, electrical) has obligations no static checker
// can know about, and the gate says so rather than implying a green run means
// "compliant". Nothing here makes a site compliant. Nothing here can.
//
//   LAW LAST VERIFIED: 2026-08-18
//   NEXT REVIEW:       2027-02-18
//
// WHY THE DATE IS THE FIRST THING YOU SEE. The UK profile's header records that
// an earlier version of it confidently cited three laws that had been revoked or
// rewritten while it named them as live. That is the failure mode this file is
// written against, and this research pass caught the EU equivalents:
//
//   * The ePrivacy REGULATION — the "coming soon" replacement for Directive
//     2002/58 that a decade of guidance told people to prepare for — is DEAD.
//     Withdrawn by the Commission at its 2533rd meeting on 16 July 2025 and
//     announced in the Official Journal on 6 October 2025 (OJ C/2025/5423). Any
//     advice that says "until the ePrivacy Regulation arrives" is now false.
//   * The EU Online Dispute Resolution platform is SWITCHED OFF. Regulation
//     (EU) 2024/3228 Art.1 repealed Regulation (EU) 524/2013 with effect from
//     20 July 2025. The ODR link that a generation of EU legal-page templates
//     hardcodes must now be REMOVED, not added. Shipping it is a link to a dead
//     service on a page about being trustworthy.
//   * The 2025 GDPR "simplification" / Digital Omnibus package is a PROPOSAL,
//     not law. COM(2025)837 of 19 Nov 2025 (procedure 2025/0360(COD), status
//     "Ongoing") would move cookie consent out of ePrivacy and into a new GDPR
//     Art.88a and add machine-readable consent signals at Art.88b. None of it
//     is in force. The smaller COM(2025)501 of 21 May 2025 (Art.30(5) record-
//     keeping relief up to 750 employees) is also unadopted. Do not build to
//     either, and do not cite either as current law.
//
// WHAT THIS PROFILE IS FOR: a 5-10 page static brochure site for a small
// business or sole trader. No accounts, no payments, no database. A contact form
// posting to a third-party service, tel:/mailto:, maybe analytics, maybe an
// embedded map or video. That is the entire assumed surface. Anything that
// takes money, holds an account, or hosts other people's content is outside
// what was researched here.
//
// WHAT THIS PROFILE IS NOT: a member-state profile. The EU floor is genuinely a
// floor. ePrivacy is a DIRECTIVE, so the cookie rule you are actually subject to
// is a national statute (Germany TDDDG s.25, France LIL art.82, Spain LSSI
// art.22.2, Italy's Garante guidelines), and those diverge on the one question
// this repo cares most about. The Unfair Commercial Practices Directive is also
// a directive, and its penalties are national. See legal.extras
// "eu/derive-member-state-profile" — that item is a BLOCKER on purpose.
//
// Working notes, every angle run, every source URL and fetch date, the
// contradiction angle's findings and a "What could NOT be established" section:
//   profiles/_research/eu.md

export default {
  id: 'eu',
  name: 'European Union (GDPR \u00b7 ePrivacy \u00b7 DSA \u00b7 UCPD)',
  country: 'European Union',
  iso2: 'EU',

  provenance: {
    // 'researched' — assembled from primary sources by an agent, read by nobody
    // qualified. The loader turns this into a NOTICE printed above every legal
    // finding the run produces, which is the point of recording it.
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: '2026-08-18',
    nextReview: '2027-02-18',

    // Every URL below was actually fetched on the date shown. Where a fetch
    // failed or a page did not support the claim, the claim is marked
    // UNCONFIRMED in this file rather than filled in from memory.
    sources: [
      { claim: 'GDPR Art.13 lists what a privacy notice must say when data is collected from the data subject; Art.13(4) disapplies it only insofar as the data subject already has the information',
        url: 'https://gdpr-info.eu/art-13-gdpr/', accessed: '2026-08-18' },
      { claim: 'GDPR Art.6(1) lawful bases, including 6(1)(b) "steps at the request of the data subject prior to entering into a contract" and 6(1)(f) legitimate interests',
        url: 'https://gdpr-info.eu/art-6-gdpr/', accessed: '2026-08-18' },
      { claim: 'GDPR Art.28(1) sufficient guarantees and Art.28(3) written contract with any processor',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504', accessed: '2026-08-18' },
      { claim: 'ePrivacy Directive 2002/58 Art.5(3) as amended by 2009/136 remains in force and is the operative consent-for-storage-and-access rule; consolidated text shows status In force',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02002L0058-20091219', accessed: '2026-08-18' },
      { claim: 'The ePrivacy Regulation proposal COM(2017)10 / 2017/0003(COD) was WITHDRAWN: Commission approved the withdrawal at its 2533rd meeting on 16 July 2025, announced in the OJ on 6 October 2025',
        url: 'https://www.europarl.europa.eu/legislative-train/theme-connected-digital-single-market/file-jd-e-privacy-reform', accessed: '2026-08-18' },
      { claim: 'OJ notice listing the withdrawn proposals, including COM(2017)10 (ePrivacy)',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:52025XC05423', accessed: '2026-08-18' },
      { claim: 'Digital Omnibus COM(2025)837 of 19.11.2025 proposes GDPR Art.88a (terminal-equipment consent) and Art.88b (machine-readable signals); procedure 2025/0360(COD) status Ongoing, i.e. NOT in force',
        url: 'https://eur-lex.europa.eu/procedure/EN/2025_360', accessed: '2026-08-18' },
      { claim: 'COM(2025)501 of 21.05.2025 proposes raising the GDPR Art.30(5) record-keeping derogation to under 750 persons; still a proposal, not adopted',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52025PC0501R(01)', accessed: '2026-08-18' },
      { claim: 'EDPB Guidelines 2/2023 (v2.0, adopted 7 October 2024): Art.5(3) ePD "does not exclusively apply to cookies, but also to similar technologies"; covers pixels, tracked URLs, local processing and IP-only tracking; expressly does NOT decide when an exemption applies',
        url: 'https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf', accessed: '2026-08-18' },
      { claim: 'EDPB Cookie Banner Taskforce report, adopted 17 January 2023: the legal basis for placing/reading cookies under Art.5(3) cannot be legitimate interests; withdrawal must be possible, at any time, and as easy as giving consent; positions are a MINIMUM threshold to be combined with national requirements',
        url: 'https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf', accessed: '2026-08-18' },
      { claim: 'CNIL: trackers exempt from consent include those storing the user\'s own cookie choice, authentication, shopping basket, UI personalisation, load balancing and certain audience measurement; refusing must be as simple as accepting',
        url: 'https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi', accessed: '2026-08-18' },
      { claim: 'CNIL Sheet 16 audience-measurement exemption criteria (single site, no cross-referencing, last IP byte truncated, 13-month tracker life, inform + allow objection) and the warning that "Most large audience measurement offerings do not fall within the scope of the exemption, regardless of their configuration"',
        url: 'https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications', accessed: '2026-08-18' },
      { claim: 'CNIL audience-measurement solutions page: exemption conditions restated; page last updated 4 July 2025',
        url: 'https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience', accessed: '2026-08-18' },
      { claim: 'e-Commerce Directive 2000/31 Art.5(1)(a)-(g) identity information that must be "easily, directly and permanently accessible", including the electronic mail address, trade register number and VAT number; Art.6 on commercial communications',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32000L0031', accessed: '2026-08-18' },
      { claim: 'Consolidated 2000/31 (to 17/02/2024) shows Arts.12-15 marked DELETED by 32022R2065 while Art.5 and Art.6 remain in force - the DSA did not repeal the identity-disclosure duty',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02000L0031-20240217', accessed: '2026-08-18' },
      { claim: 'UCPD 2005/29 consolidated to 28/05/2022: Art.6 misleading actions, Art.7 misleading omissions, Annex I pt.1 (false code-of-conduct signatory), pt.4 (false approval/endorsement/authorisation), pt.20 ("free"), pt.23b and pt.23c (consumer reviews)',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02005L0029-20220528', accessed: '2026-08-18' },
      { claim: 'Omnibus Directive (EU) 2019/2161 Art.7: member states applied the measures from 28 May 2022 - the review-verification rules bind now',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A32019L2161', accessed: '2026-08-18' },
      { claim: 'Directive (EU) 2024/825 (green transition) Art.4: transposition by 27 March 2026, member states "shall apply those measures from 27 September 2026"; Annex bans uncertified sustainability labels, unsubstantiated generic environmental claims and offset-based neutrality claims',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024L0825', accessed: '2026-08-18' },
      { claim: 'European Accessibility Act (EU) 2019/882: Art.2(2) closed list of covered services; Art.3(30) "e-commerce services" means services provided at a distance by electronic means at the individual request of a consumer "with a view to concluding a consumer contract"; Art.3(23) microenterprise definition; Art.4(5) microenterprises providing services are exempt; Art.31 application from 28 June 2025',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882', accessed: '2026-08-18' },
      { claim: 'Web Accessibility Directive (EU) 2016/2102 Art.1(2) applies to websites and mobile applications OF PUBLIC SECTOR BODIES - not to a private brochure site',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016L2102', accessed: '2026-08-18' },
      { claim: 'EU-US Data Privacy Framework adequacy decision (EU) 2023/1795 shows status "In force"',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023D1795', accessed: '2026-08-18' },
      { claim: 'General Court, 3 September 2025, Case T-553/23 Latombe v Commission: the action for annulment of the DPF adequacy decision was DISMISSED',
        url: 'https://curia.europa.eu/jcms/upload/docs/application/pdf/2025-09/cp250106en.pdf', accessed: '2026-08-18' },
      { claim: 'Appeal against that judgment brought 31 October 2025, Case C-703/25 P - pending, no stay reported, so the adequacy decision continues to apply',
        url: 'https://eur-lex.europa.eu/eli/C/2025/6610/oj/eng', accessed: '2026-08-18' },
      { claim: 'Standard Contractual Clauses, Implementing Decision (EU) 2021/914, status "In force"',
        url: 'https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj/eng', accessed: '2026-08-18' },
      { claim: 'EDPB DPF FAQ for businesses (16 July 2024): the DPF is a SELF-CERTIFICATION mechanism and EEA exporters must check the recipient against the Data Privacy Framework List',
        url: 'https://www.edpb.europa.eu/system/files/2024-07/edpb_dpf_faq-for-businesses_en.pdf', accessed: '2026-08-18' },
      { claim: 'Regulation (EU) 2024/3228 Art.1: "Regulation (EU) No 524/2013 is repealed with effect from 20 July 2025" - the ODR platform is gone and the ODR link must be removed from legal pages',
        url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202403228', accessed: '2026-08-18' },
      { claim: 'Germany: DDG s.5 carries the Impressum duty formerly in TMG s.5, listing name, address, legal form, contact permitting rapid electronic contact and direct communication, register and registration number, VAT/economic identification number',
        url: 'https://www.gesetze-im-internet.de/ddg/__5.html', accessed: '2026-08-18' },
      { claim: 'Germany: the cookie/terminal-equipment consent rule is TDDDG s.25 (the statute formerly abbreviated TTDSG); the official page still lives at the /ttdsg/ path',
        url: 'https://www.gesetze-im-internet.de/ttdsg/__25.html', accessed: '2026-08-18' },
      { claim: 'Spain: LSSI Ley 34/2002 art.10 information duties and art.22.2 cookie consent',
        url: 'https://www.boe.es/eli/es/l/2002/07/11/34/con', accessed: '2026-08-18' },
      { claim: 'Spain: AEPD cookie guidance requires reject to be at the same level as accept, with a compliance deadline of 11 January 2024',
        url: 'https://www.aepd.es/prensa-y-comunicacion/notas-de-prensa/aepd-actualiza-guia-cookies-para-adaptarla-a-nuevas-directrices-cepd', accessed: '2026-08-18' },
      { claim: 'Italy: Garante cookie guidelines (June 2021) require an unambiguous positive act, and treat analytics as technical cookies only where direct identification is precluded',
        url: 'https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876', accessed: '2026-08-18' },
      { claim: 'Germany: Bundesnetzagentur Mitteilung 148/2021 (Amtsblatt 07/21, 14.04.2021) reserves "Drama Numbers" that are permanently unassigned, including Berlin (0)30 23125 000-999, free to show in media',
        url: 'https://www.bundesnetzagentur.de/DE/Fachthemen/Telekommunikation/Nummerierung/_DL/mittlg148_2021.pdf', accessed: '2026-08-18' },
      { claim: 'EDPB Guidelines 2/2019 on Art.6(1)(b) for online services: Art.6(1)(b) is interpreted strictly and does not cover processing that is merely useful; pre-contractual steps at the data subject\'s request can be covered. PARTIAL FETCH - see caveats',
        url: 'https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines-art_6-1-b-adopted_after_public_consultation_en.pdf', accessed: '2026-08-18' },
    ],

    // Plain-English statements of what this profile CANNOT know or verify.
    // These are printed, not buried: a reader who acts on this file is entitled
    // to know exactly where its authority stops.
    caveats: [
      'NOT REVIEWED BY A LAWYER. Assembled from primary sources by an agent on 2026-08-18. Every finding it produces is a prompt to check, never advice, and it must never be quoted to a client as a compliance opinion.',
      'THIS IS AN EU FLOOR, AND THE FLOOR IS NOT WHERE ANY SITE ACTUALLY STANDS. ePrivacy and the UCPD are DIRECTIVES: the rules that bind a real site are national transpositions that diverge on exactly the questions this file answers. Derive a member-state profile before a real build. See legal.extras "eu/derive-member-state-profile".',
      'THE CONSENT-EXEMPTION LINE IS NATIONAL, NOT EU-WIDE. The EDPB expressly declined to decide when an Art.5(3) exemption applies, saying it "should be analysed on a case-by-case basis accounting for the relevant member state transposition(s)". France publishes criteria under which some audience measurement is exempt; other authorities are narrower. This profile therefore treats analytics as consent-requiring by DEFAULT and points at the national escape hatch rather than assuming it.',
      'THE mustMention PATTERNS ARE ENGLISH-ONLY. A site published in German, French, Spanish, Italian, Polish or any other member-state language will fail every content check in legal.pages for a reason that has nothing to do with its legality. A member-state profile must replace these patterns in its own language before the gate means anything.',
      'THE ADDRESS AND REGISTER PATTERNS ARE HEURISTICS. There is no single EU postcode shape, no single trade-register format and no way to pattern-match a human name. The disclosure gate here can miss a present address and can be satisfied by text that is not one. Treat legal/business-identity findings as a prompt to look, and see legal.extras "eu/identity-block-human-check".',
      'ENTITY TYPE AND VAT STATUS ARE NOT INFERABLE. Whether the trader is VAT-registered, whether a regulated profession applies, and which supervisory authority (if any) authorises the activity are facts only the client has. Art.5(1)(e), (f) and (g) of Directive 2000/31 are therefore checked by a human, not by this file.',
      'NO CASE LAW WAS FOUND ON THE EXACT QUESTION THAT DECIDES THE EAA. Whether an enquiry form that leads to an offline contract is an "e-commerce service" under Art.3(30) is a reading of the text plus recital 43, not a ruling. The verdict here is reasoned, and it is contestable.',
      'THE US-TRANSFER POSITION IS STABLE TODAY AND UNDER APPEAL. The DPF adequacy decision survived Case T-553/23 (dismissed 3 September 2025) but is on appeal as C-703/25 P. A profile reviewed after that judgment may need to say something different. Do not treat "DPF is fine" as durable.',
      'PENALTY LEVELS ARE DELIBERATELY ABSENT. UCPD fines are set by national law and the widely-quoted "4% of turnover" figure applies only to particular coordinated cross-border enforcement actions. Rather than state a number this pass could not verify per-country, this file states the exposure and names no figure.',
      'SOME PRIMARY TEXTS COULD NOT BE READ IN FULL. GDPR Art.44 and the operative articles of the DSA defeated repeated fetches of the consolidated texts; the DSA scope conclusion rests on the definitions in Art.3(g) read via a mirror, cross-checked against the DELETED markers visible in the EUR-Lex text of Directive 2000/31. Recorded in profiles/_research/eu.md.',
      'THE GOOGLE FONTS POSITION IS UNSETTLED IN GERMANY AND WAS NOT RESOLVED HERE. The 2022 LG Muenchen I award stands, but later German decisions held the mass warning-letter campaign built on it to be an abuse of rights, and a reported BGH referral to the CJEU could not be verified. Self-hosting is recommended on grounds that do not depend on which way that goes.',
      'VERIFIED BY RUNNING IT, not assumed: on 2026-08-18 `node checks/run.mjs examples/clean-control --profile eu --only legal` loaded this profile with no problems and emitted all 14 legal.extras entries as legal/local-rule findings. Note the checker DOWNGRADES every extra to MINOR and appends "the profile rates this <severity>" - so the blocker-rated entries here (eu/derive-member-state-profile, eu/processor-agreement) will NOT stop a ship on their own. Read them anyway.',
    ],
  },

  locale: {
    // The EU floor is written in English because the floor itself is; a real
    // build in a real country is written in that country's language, and that
    // is a member-state profile's job, not this one's.
    language: 'en',
    spelling: 'gb',
    dateFormat: 'D MMMM YYYY',

    // The euro is the currency of the euro area, NOT of the Union. Bulgaria,
    // Czechia, Denmark, Hungary, Poland, Romania and Sweden are EU member states
    // that do not use it. A member-state profile must override this rather than
    // inherit a wrong currency symbol onto a price list.
    currency: 'EUR',
    currencySymbol: '\u20ac',

    // A REAL reserved number, not an invented one. The German regulator sets
    // aside blocks that are permanently unassigned so nobody is harassed by
    // curious callers, and says they may be used in media without permission:
    // Bundesnetzagentur Mitteilung 148/2021 (Amtsblatt 07/21, 14 April 2021),
    // Berlin (0)30 23125 000 to 999. Also reserved there: Frankfurt
    // (0)69 90009 xxx, Hamburg (0)40 66969 xxx, Koeln (0)221 4710 xxx, Muenchen
    // (0)89 99998 xxx, and mobile (0)171 39200 00-99.
    phoneExample: '+49 30 23125 000',
    fictionalPhoneRange:
      'No EU-wide reserved range exists - numbering is national. Verified national ranges: DE (0)30 23125 000-999 and four other city blocks, Bundesnetzagentur Mitteilung 148/2021, 14 April 2021 (https://www.bundesnetzagentur.de/DE/Fachthemen/Telekommunikation/Nummerierung/_DL/mittlg148_2021.pdf, fetched 2026-08-18). IE 020 91x xxxx (ComReg), FR +33 1 99 00 xx xx and sibling blocks (ARCEP) and SE ranges reserved by PTS are documented but were only confirmed against a tertiary source and are UNCONFIRMED here. Use the German block, or leave the number as a [NEEDS: phone] gap - never invent one that might ring a real person.',

    // There is NO single EU postcode shape. This union covers the common member-
    // state formats and is deliberately permissive, because the gate that uses it
    // fires when it does NOT match: an over-tight pattern here produces a false
    // accusation, which is the worse error. Order runs specific to generic.
    //   NL 1234 AB  |  PT 1234-567  |  PL 12-345  |  CZ/SK/SE 123 45
    //   LV-1234 / LT-12345  |  MT ABC 1234  |  IE A65 F4E2  |  DE/FR/ES/IT 12345
    //   AT/BE/DK/HU/SI/LU/BG/CY 1234
    // A member-state profile MUST replace this with its own national shape; the
    // union will happily accept a Portuguese postcode on a German site.
    postcodePattern: '/^(?:\\d{4}\\s?[A-Z]{2}|\\d{4}-\\d{3}|\\d{2}-\\d{3}|[A-Z]{2}-\\d{4,5}|[A-Z]{3}\\s?\\d{4}|[A-Z]\\d{2}\\s?[A-Z0-9]{4}|\\d{3}\\s?\\d{2}|\\d{4,5})$/i',
    phonePattern: '/\\+\\d{2,3}[\\s.-]?\\d{1,4}[\\s.-]?\\d{3,4}[\\s.-]?\\d{3,5}\\b/g',
    phoneCountryCode: null,
    phoneNationalPrefix: null,
    phoneNationalPattern: null,

    addressOrder: 'street, postcode city, country',
    measurement: 'metric',
    direction: 'ltr',
  },

  copy: {
    // Inherited from the base and left alone: the language here is English, so
    // the English measurement applies. A member-state profile publishing in
    // German MUST set these to null rather than inherit them — the Gedankenstrich
    // is a normal part of German punctuation and the English threshold would
    // block honest native copy.
    emDashPer1000Warn: 6.43,
    emDashPer1000Block: 10.13,
    language: 'en',
  },

  legal: {
    privacyLaw: 'GDPR (Regulation (EU) 2016/679) + ePrivacy Directive 2002/58 as nationally implemented',

    // ------------------------------------------------------------------ consent
    //
    // prior-opt-in. Article 5(3) of Directive 2002/58, as amended by 2009/136,
    // permits storing information in, or gaining access to information already
    // stored in, a visitor's terminal equipment ONLY where the user "has given
    // his or her consent, having been provided with clear and comprehensive
    // information" — with two narrow carve-outs: transmission of a
    // communication, and what is "strictly necessary" to provide a service the
    // user explicitly requested. There is no EU equivalent of the UK's DUAA 2025
    // statistical-cookie relaxation. The EDPB's Cookie Banner Taskforce (17 Jan
    // 2023, para.24) is blunt that "the legal basis for the placement/reading of
    // cookies pursuant to Article 5 (3) cannot be the legitimate interests of
    // the controller" — so there is no legitimate-interest route around it.
    //
    // AND THAT IS NOT THE SENTENCE THAT MATTERS MOST. See consentModelWhy.
    consentModel: 'prior-opt-in',

    consentModelWhy:
      'A CONSENT BANNER IS REQUIRED ONLY IF THE SITE ACTUALLY SETS SOMETHING NON-ESSENTIAL, AND ON A FIVE-PAGE BROCHURE SITE IT USUALLY DOES NOT. Article 5(3) ePD bites on storing or accessing information in the visitor\'s terminal equipment; a static site with no analytics, no pixel, no embedded video, no embedded map and no third-party font stores nothing that needs consent, so the correct output is a cookie page saying exactly that and NO BANNER AT ALL. CNIL lists what is exempt outright - the tracker remembering the visitor\'s own cookie choice, authentication, shopping basket, interface personalisation, load balancing (https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi, fetched 2026-08-18) - and a banner on a site with nothing to consent to is a dark pattern with a cost and no benefit: it costs every visitor a click and makes a claim about the site that is not true. IF something non-essential DOES load, prior consent is owed before it fires, refusing must be as easy as accepting, and withdrawal must be possible at any time and as easy as giving it (EDPB Cookie Banner Taskforce, 17 January 2023, paras 8 and 34). THREE TRAPS. (1) Cookieless does not mean exempt: EDPB Guidelines 2/2023 v2.0 (7 October 2024) hold that Art.5(3) "does not exclusively apply to cookies, but also to similar technologies", and apply it to tracking pixels, tracked URLs, local processing and IP-only tracking. (2) The audience-measurement exemption is NATIONAL and narrower than vendors imply: CNIL grants it only for a single site, with no cross-referencing, the last IP byte truncated and a 13-month tracker life, and says outright that "Most large audience measurement offerings do not fall within the scope of the exemption, regardless of their configuration" (CNIL Sheet 16, fetched 2026-08-18). (3) An ePrivacy consent exemption is not a GDPR exemption: the lawful basis, the Art.13 notice and the retention limit are all still owed.',

    // ------------------------------------------------------------------- pages
    //
    // `patterns` are inherited from _base.mjs and already multilingual on the
    // filename (datenschutz, confidentialite, privacidad, impressum, mentions
    // legales). The mustMention CONTENT patterns below are English-only and that
    // is a stated caveat, not an oversight.
    pages: {
      privacy: {
        patterns: [/privacy|datenschutz|confidentialit|privacidad|informativa/i],
        required: 'always',
        why: 'GDPR Art.13 - owed the moment personal data is collected from the visitor, which a contact form does the instant it is submitted, and which analytics does before that. Art.13(4) disapplies the duty only "where and insofar as the data subject already has the information", which is not a general excuse for a site that has never told anyone anything. Note that even a site with no form processes visitor IP addresses in server logs, and an IP is personal data where the operator can reasonably obtain the means to identify the person (CJEU C-582/14 Breyer) - so the honest default is that the page always ships. Every item below is a separate Article 13 sub-paragraph, not padding.',
        mustMention: [
          // Art.13(1)(a) — the identity and contact details of the controller.
          [/\b(data\s+controller|the\s+controller\s+(of|for|is)|we\s+are\s+the\s+controller|controller\s+responsible|responsible\s+for\s+(the\s+)?(processing|your\s+(personal\s+)?data))\b/i,
            'who the controller is (Art.13(1)(a))'],
          // Art.13(1)(c) first limb — the purposes and the data itself.
          [/\b(what|which)\s+(personal\s+)?(data|information)\b|\bdata\s+we\s+collect\b|\bwe\s+collect\b|\binformation\s+we\s+collect\b/i,
            'what data is collected'],
          // Art.13(1)(c) second limb + 13(1)(d) — the lawful basis, named.
          [/\b(lawful\s+basis|legal\s+basis|legitimate\s+interests?|performance\s+of\s+a\s+contract|pre-?contractual|your\s+consent|consent\s+under\s+article)\b/i,
            'the lawful basis, named'],
          // Art.13(1)(e) — recipients or categories of recipients. On a brochure
          // site this is the form host and the hosting provider, and it is the
          // section that is omitted most often, because writing it means
          // admitting a third party sees the enquiry.
          [/\b(recipients?|third\s+part(y|ies)|processors?|service\s+providers?|who\s+we\s+share|share\s+your\s+(personal\s+)?(data|information)|sub-?processors?)\b/i,
            'who else receives the data - the form host and the hosting provider count (Art.13(1)(e))'],
          // Art.13(1)(f) — transfers to a third country. Deliberately satisfiable
          // BOTH WAYS: a site that transfers nothing may say so. Requiring the
          // page to mention transfers unconditionally would be a false demand.
          [/\b(outside\s+the\s+(EU|EEA|European\s+(Union|Economic\s+Area))|third\s+countr(y|ies)|international\s+transfers?|standard\s+contractual\s+clauses|data\s+privacy\s+framework|adequacy\s+decision|not\s+transferred\s+outside|stored\s+(only\s+)?(with)?in\s+the\s+(EU|EEA))\b/i,
            'where the data goes - either the transfer safeguard, or a plain statement that nothing leaves the EEA (Art.13(1)(f))'],
          // Art.13(2)(a) — storage period, or the criteria used to determine it.
          [/\b(retain|retention|how\s+long|keep\s+your|storage\s+period|deleted?\s+after)\b/i,
            'how long data is kept (Art.13(2)(a))'],
          // Art.13(2)(b)-(c) — the rights, including withdrawal where consent is
          // the basis.
          [/\b(your\s+rights|right\s+to\s+(access|rectif|eras|restrict|object|data\s+portab)|rectification|erasure|data\s+portability)\b/i,
            'data-subject rights (Art.13(2)(b))'],
          // Art.13(2)(d) — the right to lodge a complaint with a supervisory
          // authority. Named authorities are accepted so a member-state profile
          // inheriting this does not fail on its own regulator's name.
          [/\b(supervisory\s+authority|data\s+protection\s+authority|lodge\s+a\s+complaint|complain\s+to\s+the|CNIL|AEPD|Garante|Datenschutzbeh|Data\s+Protection\s+Commission)\b/i,
            'the right to complain to a supervisory authority (Art.13(2)(d))'],
          // Art.13(1)(a) second limb — a route for a data request.
          [/[\w.+-]+@[\w-]+\.[\w.]+|\bcontact\s+us\b/i,
            'a contact route for a data request'],
        ],
      },

      cookies: {
        patterns: [/cookie|temoin|galleta/i],
        required: 'if-non-essential-scripts',
        why: 'ePrivacy Directive 2002/58 Art.5(3) as nationally implemented (Germany TDDDG s.25, France LIL art.82, Spain LSSI art.22.2) - consent, on clear and comprehensive information, before anything non-essential is stored or read. The information duty is what makes the page necessary; the consent duty is what makes the banner necessary, and the two are not the same requirement. NOTE the correct default for a brochure site is usually NO BANNER: see legal.consentModelWhy. A page describing analytics the site does not load is a false statement about the business, and the checker flags it as one.',
        mustMention: [
          [/\b(essential|strictly\s+necessary|technically\s+necessary)\b/i,
            'the essential / non-essential split'],
          [/\b(withdraw|change|manage|opt.?out)\s+(your\s+)?(consent|preferences|cookie)|\bno\s+cookies\b|\bsets?\s+no\s+cookies\b|\bnothing\s+that\s+(needs|requires)\s+consent\b/i,
            'how to withdraw consent, or a plain statement that nothing needing consent is set'],
          // "Clear and comprehensive information" is the statutory phrase, and a
          // list of cookies with no lifetimes is neither.
          [/\b(expir|duration|lifetime|how\s+long|\d{1,2}\s*(month|day|year)s?)\b/i,
            'how long each cookie lasts - Art.5(3) asks for clear and comprehensive information, and a table with no durations is not'],
        ],
      },

      // TERMS / LEGAL NOTICE / IMPRESSUM. Required, and this is the single
      // biggest EU-versus-US divergence in the whole file.
      //
      // Article 5(1) of Directive 2000/31 requires the trader's identity to be
      // "easily, directly and permanently accessible". The DSA did NOT repeal
      // it: the consolidated text of 2000/31 shows Articles 12-15 marked DELETED
      // by Regulation 2022/2065 while Article 5 and Article 6 stand. Germany
      // transposes it at DDG s.5 with the same triple test ("leicht erkennbar,
      // unmittelbar erreichbar und staendig verfuegbar"), Spain at LSSI art.10.
      //
      // Strictly, the law requires the INFORMATION to be permanently accessible,
      // not a page with a particular name. It is set to `always` here anyway,
      // because on a multi-page site a dedicated, footer-linked page is the only
      // shape that reliably satisfies "permanently", it is the settled
      // convention in DE, FR, ES and IT, and its absence is the most-enforced
      // small-site failing in Germany. If a build genuinely carries the Art.5
      // items on every page, this is a defensible one to relax at stage 01 — but
      // relax it deliberately and record it, do not let it fall off.
      terms: {
        patterns: [/terms|conditions|impressum|legal.?notice|mentions.?legales|aviso.?legal|note.?legali/i],
        required: 'always',
        why: 'Directive 2000/31 Art.5(1) - the trader\'s identity and contact details must be easily, directly and permanently accessible, and a dedicated legal-notice page (Impressum, mentions legales, aviso legal) is how the EU does that. Art.5 survived the DSA intact. The identity CONTENT is enforced by legal.disclosure, not by this page\'s mustMention. WARNING, and this is a live example of why this file carries dates: do NOT add an ODR-platform link. Regulation (EU) 2024/3228 Art.1 repealed Regulation (EU) 524/2013 with effect from 20 July 2025 and the platform is switched off, so the link that most EU legal-page templates still hardcode now points at nothing.',
        mustMention: [
          [/\b(governing\s+law|applicable\s+law|laws?\s+of\s+[A-Z]|jurisdiction\s+of|courts?\s+of)\b/,
            'which law governs and which courts hear a dispute'],
          [/\b(liabilit|disclaimer|no\s+warrant|as\s+is\b)/i,
            'a liability position'],
        ],
      },

      // ACCESSIBILITY. Recommended, NOT required — and the reasoning matters,
      // because commercially interested sources say otherwise loudly.
      //
      // The European Accessibility Act (Directive (EU) 2019/882) HAS been live
      // since 28 June 2025 (Art.31(2)). It does not reach this site, on two
      // independent grounds, either of which is probably sufficient alone:
      //
      //   1. SCOPE. Art.2(2) is a CLOSED LIST: electronic communications
      //      services; services providing access to audiovisual media services;
      //      certain air, bus, rail and waterborne passenger-transport elements;
      //      consumer banking services; e-books and dedicated software; and
      //      e-commerce services. A brochure site is none of the first five. It
      //      only reaches the Act as an "e-commerce service", defined at
      //      Art.3(30) as a service provided at a distance by electronic means
      //      at the individual request of a consumer "with a view to concluding
      //      a consumer contract", which recital 43 anchors to "the online sale
      //      of any product or service". A form that produces an ENQUIRY, after
      //      which a human quotes and the contract is concluded offline, is
      //      marketing, not the transaction. And Annex I Sec.IV(g) confirms the
      //      target: its requirements are about identification, electronic
      //      signature and PAYMENT functionality. A site with no payment has
      //      nothing for that provision to bite on.
      //   2. MICROENTERPRISE. Art.4(5): "Microenterprises providing services
      //      shall be exempt from complying with the accessibility requirements
      //      referred to in paragraph 3 of this Article and any obligations
      //      relating to the compliance with those requirements." A blanket
      //      carve-out for services, unlike the much narrower Art.14(4) relief
      //      for products, which only waives the paperwork. Art.3(23):
      //      microenterprise = fewer than 10 persons AND turnover or balance
      //      sheet at or under EUR 2 million.
      //
      // Directive (EU) 2016/2102 does not help either side: Art.1(2) scopes it
      // to public sector bodies.
      //
      // WHERE THIS COULD BE WRONG, stated plainly because it could: if the form
      // is really a BOOKING or ORDER that concludes a contract on submission
      // (auto-confirmed reservation, fixed-price service accepted on the page),
      // ground 1 weakens and only the microenterprise exemption is left — and
      // that exemption is untested in any member-state court this pass could
      // find. See legal.extras "eu/eaa-rescope-if-transactional". Two commercial
      // accessibility vendors fetched during this research frame scope as "any
      // business that sells covered products or services to EU consumers", which
      // is consistent with Art.2(2) read broadly and inconsistent with reading
      // Art.3(30) as written. Their incentive is noted; so is the fact that a
      // boundary two vendors push on is a boundary, not a wall.
      //
      // So the statement ships because it is good practice and because it is the
      // one legal page that can be written honestly from work actually done —
      // not because the EAA compels it. Saying otherwise wastes build effort and
      // misleads the client.
      accessibility: {
        patterns: [/accessib|barrierefrei|accesibilidad|accessibilit/i],
        required: 'recommended',
        why: 'Good practice, not a statutory duty for this site. The European Accessibility Act (Directive (EU) 2019/882), live since 28 June 2025, does NOT reach a microenterprise brochure site: Art.2(2) is a closed list of service categories a brochure site falls outside, and Art.3(30) defines "e-commerce services" as concluding a consumer contract at a distance, which an enquiry form does not do; independently, Art.4(5) exempts microenterprises providing services outright. Directive (EU) 2016/2102 applies to public sector bodies only (Art.1(2)). Ship the statement because it is honest and useful, and never claim the EAA required it.',
        mustMention: [
          [/\bwcag\b/i, 'the standard targeted'],
          [/\b(report|contact|email|tell\s+us|get\s+in\s+touch)\b/i, 'how to report a problem'],
          // An unverified public conformance claim is worse than none: it is a
          // statement of fact about the site that nobody has tested. Automated
          // tooling covers only part of the problem space, and this page is one
          // of the easiest places in a build to publish a claim that is false.
          [/\b(known\s+limitation|not\s+(yet\s+)?(been\s+)?tested|we\s+have\s+not|aim|target|working\s+towards)\b/i,
            'honest limits - the statement must say what is NOT done, not assert bare conformance'],
        ],
      },
    },

    // -------------------------------------------------------------- disclosure
    //
    // Directive 2000/31 Art.5(1). The items differ by entity type, which the
    // checker cannot infer — it is read from the `Entity type` row in facts.md.
    //
    // A note on how these gates FAIL, because it inverts the usual rule. Every
    // other pattern in this repo is tuned for precision, because a pattern that
    // fires on innocent prose trains people to skip the report. These fire when
    // they do NOT match, so an over-tight pattern here manufactures a false
    // accusation and sends someone looking for a fact that is already on the
    // page. They are therefore deliberately permissive, and they will
    // occasionally pass on text that is not really an address. Findings are
    // MAJOR, meaning "go look", not "this is broken".
    disclosure: {
      corporation: [
        [/\b(commercial|trade|company|business)\s+register\b|\bregistration\s+(number|no\.?)\b|\bcompany\s+(number|no\.?)\b|\bregistered\s+(in|at|with)\s+the\b|\bHandelsregister\b|\bHR[AB]\s?\d|\bSIRE[NT]\b|\bRCS\b|\bK\.?v\.?K\.?\s?\d|\b(KBO|BCE)\b|\bRegistro\s+Mercantil\b|\bRegistro\s+delle\s+Imprese\b|\bREA\s?[A-Z]{0,2}\s?\d/i,
          'the trade register and its registration number',
          'Directive 2000/31 Art.5(1)(d) - where the provider is entered in a trade or similar public register, the register and the registration number must be given. Germany DDG s.5(1) no.4 and Spain LSSI art.10 carry the same duty. In Belgium it is stricter still: Code de droit economique art.III.74 requires the enterprise number on the site.'],
        [/\b(GmbH|gGmbH|UG|AG|KG|OHG|SARL|S\.A\.R\.L\.|SAS|SASU|SA\b|SRL|S\.r\.l\.|SpA|S\.p\.A\.|SL\b|S\.L\.|SLU|B\.?V\.?|N\.?V\.?|Oy\b|Oyj|AB\b|A\/S|ApS|Sp\.\s?z\s?o\.?o\.?|d\.o\.o\.|Kft|Zrt|OOD|EOOD|Ltd|Limited|PLC|SE\b)(?![A-Za-z])/,
          'the legal form in the trading name',
          'Directive 2000/31 Art.5(1)(a) and Germany DDG s.5(1) no.1 - the name under which the provider trades, which for a company includes its legal form and, where relevant, its authorised representatives.'],
      ],

      // DELIBERATELY EMPTY, and this is a decision rather than a gap.
      //
      // What a sole trader owes under Art.5(1)(a) and Germany DDG s.5(1) no.1 is
      // a real personal name — Vorname und Nachname, not a trading style. A
      // human name cannot be pattern-matched: there is no regex that separates
      // "Anna Meier, Inhaberin" from any other two capitalised words on the
      // page. Any pattern written here would either fire on every site or on
      // none, and a gate that cries wolf is a gate people learn to skip.
      //
      // The check is real and it moved, it did not vanish: see legal.extras
      // "eu/sole-trader-real-name". The geographic address they also owe is in
      // `all` below, because Art.5(1)(b) binds every provider, not only traders.
      soleTrader: [],

      all: [
        // Art.5(1)(c) NAMES the electronic mail address specifically. This is a
        // genuine EU-versus-US divergence and a genuine EU-versus-UK one: a
        // contact form alone does not satisfy it, and German practice is
        // explicit that it does not. Note the checker scans VISIBLE TEXT, so a
        // mailto: link reading "Email us" will fail this — which is the right
        // outcome, because the Impressum convention is to PRINT the address.
        [/[\w.+-]+@[\w-]+\.[a-z]{2,}/i,
          'a printed email address',
          'Directive 2000/31 Art.5(1)(c) - details "including his electronic mail address, which allow him to be contacted rapidly and communicated with in a direct and effective manner". A contact form is not an email address. Print it; do not hide it behind link text.'],

        // Art.5(1)(b) — the geographic address at which the provider is
        // established. Heuristic union of member-state postcode shapes, followed
        // by a capitalised place name. The lookbehind stops "since 2019 Berlin"
        // and "in 2024 Munich" from passing the bare-digits branch as an
        // address; it is not airtight, and it is not meant to be.
        [/\b\d{3}\s\d{2}\s+[A-Z\u00C0-\u00DE][\w'-]{2,}|\b[A-Z]\d{2}\s?[A-Z0-9]{4}\b|\b\d{4}\s?[A-Z]{2}\s+[A-Z\u00C0-\u00DE][\w'-]{2,}|\b\d{4}-\d{3}\s+[A-Z\u00C0-\u00DE][\w'-]{2,}|\b\d{2}-\d{3}\s+[A-Z\u00C0-\u00DE][\w'-]{2,}|\b[A-Z]{2}-\d{4,5}\s+[A-Z\u00C0-\u00DE][\w'-]{2,}|(?<!\b(?:since|in|from|until|circa|by|est\.?)\s)\b\d{4,5}\s+[A-Z\u00C0-\u00DE][\w'-]{2,}/,
          'a geographic postal address',
          'Directive 2000/31 Art.5(1)(b) - "the geographic address at which the service provider is established". Not a PO box, not a contact form. Germany DDG s.5(1) no.1 and Spain LSSI art.10 both carry it. This pattern is a heuristic across many national postcode formats and will sometimes be wrong in both directions - confirm by eye.'],
      ],
    },

    // ---------------------------------------------------------- claim citations
    //
    // The claim PATTERNS are universal and live in profiles/_base.mjs; the
    // loader stitches these citations onto them. What this profile supplies is
    // WHICH EU LAW makes each class risky.
    //
    // One structural point that applies to all of them: the Unfair Commercial
    // Practices Directive is a DIRECTIVE. What binds a trader is the national
    // transposition, and the penalties are national. No fine figure is quoted
    // anywhere below, because this pass could not verify per-country maxima and
    // the widely-repeated "4% of turnover" line applies to a specific class of
    // coordinated cross-border enforcement, not to a local trading-standards
    // action against a plumber in Lyon.
    claimCitations: {
      rating:
        'Directive 2005/29 (UCPD) Annex I pt.23c, inserted by Directive (EU) 2019/2161 and applicable since 28 May 2022, bans "[s]ubmitting or commissioning another legal or natural person to submit false consumer reviews or endorsements, or misrepresenting consumer reviews or social endorsements". An aggregate star rating IS a representation about reviews. It must trace to real, attributable reviews - and see `count` for the verification duty that comes with publishing them.',

      count:
        'UCPD Art.6 (misleading actions: a practice is misleading if it "contains false information and is therefore untruthful or in any way, including overall presentation, deceives or is likely to deceive the average consumer, even if the information is factually correct") and Art.7 (misleading omissions). A specific number is a factual claim and must be substantiable on request. Where the number counts REVIEWS rather than customers, Annex I pt.23b also applies: it is banned to state "that reviews of a product are submitted by consumers who have actually used or purchased the product without taking reasonable and proportionate steps to check that they originate from such consumers" - so publishing testimonials creates a duty to have verified them, not merely to have received them.',

      superiority:
        'UCPD Art.6(1) and Art.7. "Leading", "best in the region", "award-winning" and "No.1" are objective claims about the trader and must be substantiable before publication, not after a complaint. Where the claim implies an award or endorsement, Annex I pt.4 makes it a per-se banned practice to claim "that a trader ... or a product has been approved, endorsed or authorised by a public or private body when he/it has not or making such a claim without complying with the terms of the approval". National advertising codes sit on top of this and are often stricter.',

      accreditation:
        'UCPD Annex I pt.4 (false claim of approval, endorsement or authorisation by a public or private body) and pt.1 ("[c]laiming to be a signatory to a code of conduct when the trader is not"). If the register is real, the membership number must be real and checkable. Separately, Directive 2000/31 Art.5(1)(f) requires a regulated profession to publish the professional body it is registered with, the professional title and the member state that granted it, and a reference to the applicable professional rules - so for a regulated trade the accreditation is not merely a claim to be substantiated, it is a mandatory disclosure. In several member states practising a regulated trade without the registration is a criminal matter, not a marketing slip.',

      guarantee:
        'UCPD Art.6(1)(g), which covers deception as to "the consumer\'s rights ... or the risks he may face". A guarantee stated on the site is a commercial guarantee the business is held to alongside the statutory conformity rights consumers already have under Directive (EU) 2019/771, and presenting a statutory right as if it were a special favour is itself a misleading practice. Only ship a guarantee the owner has agreed to honour, and never imply it replaces the legal rights.',

      insurance:
        'UCPD Arts.6 and 7 - a factual claim about the business, substantiable on request, and clients do ask to see the certificate. If the insurance is a condition of an authorisation scheme, Directive 2000/31 Art.5(1)(e) additionally requires the particulars of the relevant supervisory authority to appear on the site.',

      years:
        'UCPD Art.6(1) - a specific number is a checkable factual claim, and in most member states it is checkable against the national trade register or the domain age in about a minute. Confirm it against a sourced row before it ships.',

      // The one with a date attached, and the date is the point.
      environmental:
        'TODAY (2026-08-18) this is UCPD Art.6 and Art.7 only: a green claim is a factual claim and must be substantiable. FROM 27 SEPTEMBER 2026 it is much harder. Directive (EU) 2024/825 ("empowering consumers for the green transition") Art.4 requires member states to adopt transposing measures by 27 March 2026 and to "apply those measures from 27 September 2026". Its Annex then makes three things PER-SE banned, with no substantiation defence available for the first: "[d]isplaying a sustainability label that is not based on a certification scheme or not established by public authorities" (pt.2a); "[m]aking a generic environmental claim for which the trader is not able to demonstrate recognised excellent environmental performance relevant to the claim" (pt.4a); and "[c]laiming, based on the offsetting of greenhouse gas emissions, that a product has a neutral, reduced or positive impact on the environment in terms of greenhouse gas emissions" (pt.4c). READ THE DATE AGAINST THE BUILD: a site shipped now is overwhelmingly likely to still be live on 27 September 2026, so a self-made "eco-friendly" badge or a "carbon neutral" line is not a claim that is legal today and reviewable later - it is a claim with a known expiry a few weeks out. Strip it now.',
    },

    // Register and regulator names the loader ORs into the accreditation
    // pattern, so a named body is caught by name and not only by grammar.
    // Deliberately short: EU-wide bodies plus the few national registers a
    // small-trader brochure site is most likely to name. A member-state profile
    // should extend this substantially with its own trade registers.
    localRegisters: [
      'Handwerkskammer', 'Handelskammer', 'IHK', 'TUV', 'TUEV', 'DEKRA',
      'Chambre de Metiers', 'Chambre de Commerce', 'Qualibat', 'RGE',
      'Camera di Commercio', 'Camara de Comercio', 'Colegio Oficial',
      'CE marking', 'EN ISO', 'ISO 9001', 'ISO 14001', 'EMAS',
      'EU Ecolabel', 'Blauer Engel', 'Nordic Swan',
    ],

    // ------------------------------------------------------------------ extras
    //
    // Jurisdiction-specific rules a human must confirm.
    //
    // HONESTY NOTE, corrected: `legal/local-rule` DOES read this array now.
    // Entries carrying a `pattern` are real probes and fire at their declared
    // severity; entries without one cannot be decided by a static file, so they
    // are collected into a single MINOR listing every one of them, with the
    // severity the profile assigned printed beside each. That means a
    // blocker-rated entry here does NOT stop a ship on its own — it is on the
    // list stage 07 reads back to the client, and a blocker-rated one nobody has
    // checked is the reason a launch waits.
    //
    // Fourteen separate minors saying "confirm this by hand" would be a wall
    // people scroll past, which is why they arrive as one finding.
    extras: [
      {
        id: 'eu/derive-member-state-profile',
        severity: 'blocker',
        what: 'This is the EU FLOOR. No site trades in "the EU" - it trades in a member state, under that state\'s transposition.',
        detect: 'Before any real build, check whether a member-state profile exists for the country in facts.md. If the profile in use is `eu`, say so out loud in the report and name what is therefore unchecked.',
        why: 'ePrivacy is a directive: the operative cookie rule is Germany TDDDG s.25, France LIL art.82, Spain LSSI art.22.2, and so on, and the authorities diverge on the one question that decides whether a banner is needed. Known deviations above this floor: GERMANY - Impressum at DDG s.5 (replaced TMG s.5) with the "leicht erkennbar, unmittelbar erreichbar und staendig verfuegbar" test, plus MStV s.18 naming a responsible person for journalistic-editorial content. SPAIN - AEPD cookie guidance requires reject to sit at the same level as accept, in force since 11 January 2024. FRANCE - CNIL requires refusing to be as simple as accepting and publishes its own audience-measurement exemption criteria. ITALY - the Garante requires an unambiguous positive act and treats analytics as technical only where direct identification is precluded. BELGIUM - Code de droit economique art.III.74 requires the enterprise number on the site, which the EU floor does not.',
      },
      {
        id: 'eu/no-analytics-no-banner',
        severity: 'major',
        what: 'A consent banner on a site that sets nothing non-essential is wrong, not cautious.',
        detect: 'If the build loads no analytics, no pixel, no third-party font, no embedded map and no embedded video, and a cookie banner is present anyway, remove the banner and keep the cookie page.',
        why: 'Art.5(3) ePD bites on storage of and access to information in terminal equipment. Nothing stored means nothing to consent to. A banner then costs every visitor a click, hurts the metrics it was installed to protect, and publishes a claim about the site that is false. Decide at stage 01 whether analytics is genuinely wanted; for a five-page local business site the honest answer is usually no, and the entire consent problem disappears with it.',
      },
      {
        id: 'eu/cookieless-is-not-exempt',
        severity: 'major',
        what: 'A "cookieless" or "privacy-first" analytics vendor is not automatically consent-exempt.',
        detect: 'If the build includes Plausible, Fathom, Umami, Simple Analytics, Matomo or a server-side tag and the cookie page or build notes assert that no consent is needed, require the specific national basis in writing.',
        why: 'EDPB Guidelines 2/2023 v2.0 (7 October 2024) hold that Art.5(3) "does not exclusively apply to cookies, but also to similar technologies" and apply it to tracking pixels, tracked URLs, local processing and IP-only tracking. The exemption that does exist is national and narrow: CNIL grants it only for a single site, with no cross-referencing of the data, the last IP byte truncated and a 13-month tracker lifetime, and states that "Most large audience measurement offerings do not fall within the scope of the exemption, regardless of their configuration". And an ePrivacy consent exemption is not a GDPR exemption - lawful basis, Art.13 notice and retention are all still owed.',
      },
      {
        id: 'eu/contact-form-lawful-basis',
        severity: 'major',
        what: 'Name the lawful basis for the contact form, and expect sources to disagree about which it is.',
        detect: 'Read the privacy page\'s lawful-basis section against the form. If it says "consent" and the form has no unticked opt-in box, or if it names nothing at all, fix it.',
        why: 'GENUINE DISAGREEMENT, reported rather than resolved. Art.6(1)(b) covers processing "necessary ... in order to take steps at the request of the data subject prior to entering into a contract", and a visitor asking for a quote has done exactly that - but EDPB Guidelines 2/2019 read 6(1)(b) strictly and exclude what is merely useful, and an enquiry that never becomes a contract sits awkwardly under it. Art.6(1)(f) legitimate interests is the other common answer and requires a documented balancing test that nobody on a five-page build ever writes. Consent, Art.6(1)(a), is the answer most templates print and is usually the WORST of the three here: it must be freely given and withdrawable, and a form the visitor cannot submit without ticking a box is not freely given. Pick one, write it down, and make the page say the same thing the form does. A privacy page naming a basis the site does not actually rely on is a false statement in the client\'s name.',
      },
      {
        id: 'eu/processor-agreement',
        severity: 'blocker',
        what: 'The form host and the hosting provider are PROCESSORS, and Art.28(3) requires a written contract with each.',
        detect: 'Name the form endpoint (Formspree, Netlify Forms, Basin, Getform, Google Forms) and the host in facts.md, and confirm each publishes a Data Processing Agreement the client has actually accepted. If the client has not accepted it, that is a gap, not a formality.',
        why: 'GDPR Art.28(1) permits a controller to use "only processors providing sufficient guarantees to implement appropriate technical and organisational measures", and Art.28(3) requires the processing to be "governed by a contract or other legal act ... that is binding on the processor with regard to the controller and that sets out the subject-matter and duration of the processing, the nature and purpose of the processing, the type of personal data and categories of data subjects and the obligations and rights of the controller". Most vendors publish a DPA that is accepted by using the service; some require an explicit signature. Both processors must also be named as recipients on the privacy page - see pages.privacy.mustMention.',
      },
      {
        id: 'eu/us-transfer-check',
        severity: 'major',
        what: 'If the form host or the web host is US-based, the enquiry leaves the EEA and needs a transfer route.',
        detect: 'For each named vendor, check whether it is listed and ACTIVE on the Data Privacy Framework List at dataprivacyframework.gov. If it is not, the fallback is the Standard Contractual Clauses in Implementing Decision (EU) 2021/914, and the privacy page must say which route is relied on.',
        why: 'The EU-US Data Privacy Framework adequacy decision (EU) 2023/1795 shows status "In force" as of 2026-08-18 and survived its first annulment challenge: the General Court DISMISSED Case T-553/23 Latombe v Commission on 3 September 2025. IT IS NOT SETTLED - an appeal, Case C-703/25 P, was brought on 31 October 2025 and is pending, with no stay reported, so the decision continues to apply for now. The DPF is a SELF-CERTIFICATION mechanism: per the EDPB\'s own FAQ, an EEA exporter must check the recipient is on the list rather than assume it. Adequacy attaches to the certified organisation, not to the United States generally, and it does not cover an uncertified vendor at all.',
      },
      {
        id: 'eu/sole-trader-real-name',
        severity: 'major',
        what: 'A sole trader must publish a real personal name, not only a trading style. No regex can check this.',
        detect: 'Human check. Where facts.md declares a sole trader or unincorporated business, read the legal-notice page and confirm a natural person is named. "Meier Gardens" is a trading style; "Anna Meier, trading as Meier Gardens" is the disclosure.',
        why: 'Directive 2000/31 Art.5(1)(a) requires the name of the service provider, and member states read that as the natural person behind the trading style - Germany DDG s.5(1) no.1 is explicit about first and last name. This check lives here rather than in legal.disclosure.soleTrader because a human name cannot be distinguished from any other pair of capitalised words by pattern, and a gate that fires on every site is a gate people learn to skip.',
      },
      {
        id: 'eu/no-odr-link',
        severity: 'major',
        what: 'Do NOT add an ODR-platform link. The platform is switched off.',
        detect: 'Search the build for ec.europa.eu/consumers/odr and for the phrase "online dispute resolution". If a template inserted one, remove it.',
        why: 'Regulation (EU) 2024/3228 Art.1: "Regulation (EU) No 524/2013 is repealed with effect from 20 July 2025." New complaints stopped on 20 March 2025 and the platform closed on 20 July 2025. A great many EU legal-page templates still hardcode the link, so this is a live decay trap rather than a hypothetical one - exactly the class of error this repo exists to catch. Directive 2013/11 on consumer ADR was not repealed with it, so a trader who is committed to a particular ADR body still names that body; it just no longer routes through the EU platform.',
      },
      {
        id: 'eu/dsa-probably-out-of-scope',
        severity: 'minor',
        what: 'Do not reflexively add a DSA "point of contact" block. The DSA probably does not reach this site.',
        detect: 'If the build carries DSA Art.11/12 contact-point language, ask whether the site hosts any content provided by third parties (reviews visitors post, user uploads, a forum). If it does not, drop the block.',
        why: 'The DSA applies to "intermediary services", defined in Art.3(g) as mere conduit, caching or hosting - all three framed around information provided BY A RECIPIENT of the service. A brochure site publishes only its own content and hosts nothing from anyone else, so on the definitions it never becomes an intermediary service and Arts.11-13 never attach. UNCONFIRMED IN ONE RESPECT, stated honestly: this research pass found no Commission guidance or case law saying so in terms for brochure sites specifically, and the operative DSA articles could not be fetched from EUR-Lex directly (the consolidated text defeated repeated fetches; the article text came from a mirror). It is a reasoned reading of the definitions, not a settled answer. What IS confirmed from EUR-Lex is that the DSA deleted Arts.12-15 of Directive 2000/31 and left Art.5 standing, so the identity duty above is unaffected either way.',
      },
      {
        id: 'eu/green-claims-deadline-2026-09-27',
        severity: 'major',
        what: 'Green claims and self-made sustainability badges become per-se banned on 27 September 2026.',
        detect: 'Flag any eco/green/sustainable/carbon wording and any sustainability badge image, and check it against the ban list before ship, not against today\'s law.',
        why: 'Directive (EU) 2024/825 Art.4: member states transpose by 27 March 2026 and "shall apply those measures from 27 September 2026". As of 2026-08-18 it does not bind traders yet - but a brochure site shipped today will still be live then, and three things become banned outright with no substantiation defence: a sustainability label not based on a certification scheme or established by public authorities; a generic environmental claim the trader cannot back with recognised excellent environmental performance; and any claim of neutral, reduced or positive greenhouse-gas impact based on offsetting. Design it out now rather than scheduling a legal edit for late September.',
      },
      {
        id: 'eu/review-verification',
        severity: 'major',
        what: 'Publishing testimonials creates a duty to have VERIFIED them, and to say how.',
        detect: 'For every testimonial or rating on the site, check facts.md for who said it, when, and what step was taken to confirm they were a real customer.',
        why: 'UCPD Annex I pt.23b, in force since 28 May 2022, bans "[s]tating that reviews of a product are submitted by consumers who have actually used or purchased the product without taking reasonable and proportionate steps to check that they originate from such consumers"; pt.23c bans submitting or commissioning false reviews and misrepresenting real ones. Art.7(6) requires a trader who gives access to reviews to say whether and how it ensures they come from real customers. A quote on a page with no name, no date and no record is the exact shape this bans.',
      },
      {
        id: 'eu/self-host-fonts-and-embeds',
        severity: 'major',
        what: 'Self-host fonts; make maps and videos click-to-load. The reasoning is stronger than the famous case.',
        detect: 'Covered by the base profile\'s consentBeforeLoad patterns. This entry exists to record what the German case law actually says, so nobody argues the fix away.',
        why: 'A hotlinked Google Font, an embedded map and an embedded video each contact a third party and disclose the visitor\'s IP address before any choice is made, which engages Art.5(3) and the Art.13(1)(f) transfer disclosure at once. The famous authority, LG Muenchen I 3 O 17493/20 (20 January 2022), awarded damages for exactly this - but its CURRENT STANDING IS MIXED and should not be overstated: later German decisions, including LG Muenchen I itself in 4 O 13063/22 (30 March 2023) and AG Ludwigsburg 8 C 1361/22, held the mass warning-letter campaign built on that ruling to be an abuse of rights under BGB s.242, because the claimant crawled sites to provoke the transfer and then monetised it. A reported BGH referral to the CJEU on the point could not be verified in this pass and is UNCONFIRMED. None of that changes the fix: self-hosting removes the question entirely, is faster, and does not depend on how the litigation ends.',
      },
      {
        id: 'eu/eaa-rescope-if-transactional',
        severity: 'minor',
        what: 'Re-run the accessibility analysis if the form is really a booking, or the business is not a microenterprise.',
        detect: 'Two triggers. (1) The form concludes something on submission - an auto-confirmed reservation, a fixed-price service accepted on the page - rather than producing an enquiry a human answers. (2) facts.md shows 10 or more staff, or turnover and balance sheet both above EUR 2 million.',
        why: 'The profile\'s position that the European Accessibility Act does not reach this site rests on two independent grounds, and each trigger removes one of them. Trigger (1) weakens the Art.3(30) argument, because a site that concludes a consumer contract by electronic means is much closer to an "e-commerce service" than a marketing page with an enquiry form. Trigger (2) removes the Art.4(5) microenterprise exemption outright. With both gone, the Annex I Sec.IV(g) requirements and a WCAG-level conformance obligation become a live question rather than a courtesy - and that is a question for a lawyer, not for this file.',
      },
      {
        id: 'eu/identity-block-human-check',
        severity: 'minor',
        what: 'Read the legal-notice block by eye once. The disclosure patterns are heuristics and both of their failure modes are quiet.',
        detect: 'Confirm five things a pattern cannot: that the address is the real place of establishment; that the register number matches the register named; whether the trader is VAT-registered (Art.5(1)(g) then requires the VAT number, and a non-registered trader must NOT print one); whether the activity is subject to an authorisation scheme (Art.5(1)(e) then requires the supervisory authority); and whether a regulated profession is involved (Art.5(1)(f) then requires the professional body, the title and the granting member state).',
        why: 'Directive 2000/31 Art.5(1)(e), (f) and (g) are all conditional on facts only the client has, so no static checker can raise them and none of them appears in legal.disclosure. The address pattern is a union of national postcode shapes and will occasionally accept text that is not an address; the register pattern accepts the word "registration number" without checking that a number follows. Neither failure is loud. And the rule that outranks all of this: NEVER INVENT A LEGAL FACT. Not a company number, not a registered office, not a VAT number, not a supervisory authority. A gap is `[NEEDS: ...]` and the gate refuses to ship it; an invented one is a false statement, published, in the client\'s name, on the page specifically about who they are.',
      },
    ],
  },

  seo: {
    // NOT en_GB. Post-Brexit that string tells a search engine the site is
    // British, which is precisely wrong for an EU trader, and it is a stale
    // default carried over from the era when one profile covered both. en_IE is
    // the honest choice for an English-language EU floor. A member-state profile
    // must override with its own — de_DE, fr_FR, es_ES, it_IT — and if it does
    // not, this line is the bug.
    locale: 'en_IE',
    localBusinessRequired: true,
  },
};
