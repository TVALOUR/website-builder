// website-builder — UK / EU profile.
//
// The legal gates are jurisdiction-shaped, so the jurisdiction is a file rather
// than a hardcode. Swap it with `--profile us` once someone writes profiles/us.mjs.
//
// NOT LEGAL ADVICE. This encodes what a competent web developer should ship by
// default so a small business is not obviously exposed. A regulated trade
// (healthcare, finance, law, gas, electrical) has more obligations than any
// static checker can know about, and the gate says so rather than implying
// a green run means "compliant".
//
//   LAW LAST VERIFIED: 2026-08-18
//   NEXT REVIEW:       2027-02-18
//
// The date is here because its absence was the tell. An F3 critique found three
// citations that had been revoked or rewritten while the file confidently cited
// them as live law:
//
//   * PECR reg.6 was rewritten by DUAA 2025 Sch A1 on 5 February 2026, and the
//     word DUAA appeared nowhere in this repo.
//   * CPUT 2008 was revoked on 6 April 2025 by the DMCC Act 2024, and was cited
//     twice as current.
//   * The Companies (Trading Disclosures) Regs 2008 were revoked by SI 2015/17.
//
// Law is the fastest-decaying content in this repo. Anything cited here that
// somebody might quote to a client must be re-checked against legislation.gov.uk
// at the review date, and a citation with no date is a citation nobody can trust.

export default {
  id: 'uk',
  name: 'United Kingdom (UK GDPR · PECR · Companies Act · Equality Act)',
  country: 'United Kingdom',
  iso2: 'GB',

  // Everything not stated here is inherited from profiles/_base.mjs — the
  // tracker fingerprints, the third-party leak list, the universal claim
  // patterns. This file carries only what is genuinely British.
  provenance: {
    // RESEARCHED, not verified. It was assembled from primary sources and then
    // adversarially critiqued — which is how the three revoked citations in the
    // header were caught — and no qualified lawyer has read it. Nobody's name
    // goes in verifiedBy until somebody's does.
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: '2026-08-18',
    nextReview: '2027-02-18',
    sources: [
      { claim: 'PECR reg.6 as rewritten by DUAA 2025 Sch A1, in force 5 Feb 2026', url: 'https://www.legislation.gov.uk/ukpga/2025/18/schedule/A1', accessed: '2026-08-18' },
      { claim: 'DMCC Act 2024 Part 4 Ch.1, in force 6 Apr 2025, replacing CPUT 2008', url: 'https://www.legislation.gov.uk/ukpga/2024/13/part/4', accessed: '2026-08-18' },
      { claim: 'Trading disclosures on a website — SI 2015/17, which revoked the 2008 Regs', url: 'https://www.legislation.gov.uk/uksi/2015/17/made', accessed: '2026-08-18' },
      { claim: 'Companies Act 2006 s.82 (trading disclosures power)', url: 'https://www.legislation.gov.uk/ukpga/2006/46/section/82', accessed: '2026-08-18' },
      { claim: 'E-Commerce (EC Directive) Regulations 2002 reg.6 (trader information)', url: 'https://www.legislation.gov.uk/uksi/2002/2013/regulation/6/made', accessed: '2026-08-18' },
      { claim: 'Equality Act 2010 reasonable-adjustments duty', url: 'https://www.legislation.gov.uk/ukpga/2010/15/section/20', accessed: '2026-08-18' },
    ],
    caveats: [
      'Regulated trades (healthcare, finance, law, gas, electrical) carry obligations no static checker can know about.',
      'Scotland and Northern Ireland diverge on some consumer and accessibility points; this profile is written to the UK-wide floor.',
      'A green run means the site is not obviously exposed on what a static file can prove. It does not mean compliant, and nothing here is legal advice.',
    ],
  },

  locale: {
    language: 'en-GB',
    spelling: 'gb',
    dateFormat: 'D MMMM YYYY',
    currency: 'GBP',
    currencySymbol: '£',
    phoneExample: '01234 567890',
    // Ofcom reserves these for drama so a broadcast number cannot ring a real
    // person. A fictional build uses them; a real one never does.
    fictionalPhoneRange: 'Ofcom drama ranges — 01632 960000-960999, 07700 900000-900999, 020 7946 0000-0999',
    postcodePattern: '/\\b[A-Z]{1,2}\\d{1,2}[A-Z]?\\s?\\d[A-Z]{2}\\b/i',
    phonePattern: '/(?:\\+44|\\b0)[\\d\\s()-]{8,16}\\d/g',
    phoneCountryCode: '44',
    phoneNationalPrefix: '0',
    phoneNationalPattern: '/^0\\d{9,10}$/',
    addressOrder: 'street, town, county, postcode',
    measurement: 'metric',
    direction: 'ltr',
  },

  copy: {
    // Em-dash DENSITY, per 1,000 words of visible copy. Not a ban: measured
    // human published prose pools at 6.43/1,000 (range 3.47-10.13) and GPT-4.1
    // at 10.62, so presence proves nothing and density proves a great deal.
    //
    // Warn at the human average, block above the top of the human range. The
    // site that motivated this repo scored 25.97 and would fail either way;
    // the three other real sites checked scored 0.00, 0.00 and 0.22 and are
    // untouched by both thresholds.
    //
    // Raise them for genuinely editorial work. Lower them if you want the
    // house style tighter than the evidence requires — that is a taste call,
    // and it should be made as one.
    emDashPer1000Warn: 6.43,
    emDashPer1000Block: 10.13,
    language: 'en-GB',
  },

  legal: {
    privacyLaw: 'UK GDPR + Data Protection Act 2018, as amended by the Data (Use and Access) Act 2025',

    // PRIOR OPT-IN, with a real and widening exception. PECR reg.6 still
    // requires consent before non-essential storage, but DUAA 2025 Sch A1 (live
    // 5 Feb 2026) moved first-party statistical cookies and appearance/
    // functionality cookies to information-plus-free-opt-out. Genuinely
    // cookieless first-party analytics does not engage reg.6 at all.
    //
    // Which means the correct default for a brochure site is usually NO BANNER,
    // and the most common error in this whole family is shipping one anyway.
    consentModel: 'prior-opt-in',
    consentModelWhy:
      'PECR reg.6 requires consent before any non-essential cookie or similar storage. Since DUAA 2025 Sch A1 '
      + '(5 Feb 2026) first-party statistical cookies used by the site operator, and cookies used solely for '
      + 'appearance or functionality, need information and a free opt-out rather than prior consent. A site that '
      + 'loads no analytics, no pixel, no embedded video, no embedded map and no third-party font sets nothing '
      + 'that needs consent, and the correct output is a cookie page saying exactly that and NO banner at all. '
      + 'A banner with nothing to consent to is a dark pattern with a cost and no benefit.',

    // Registers whose names should be caught on sight, ORed into the universal
    // accreditation pattern by the loader.
    localRegisters: [
      'gas safe', 'niceic', 'napit', 'hcpc', 'gdc', 'gmc', 'nmc', 'sra', 'cqc', 'riba', 'rics',
      'checkatrade', 'trustmark', 'fmb', 'city & guilds', 'iosh', 'nebosh',
    ],

    // Filename patterns accepted for each baseline page. Matching is
    // case-insensitive and pattern-based on purpose: `privacy.html`,
    // `privacy-policy.html` and `/privacy/index.html` are all the same page.
    pages: {
      privacy: {
        patterns: [/privacy/i],
        required: 'always',
        why: 'UK GDPR Art.13 — required the moment the site collects any personal data, including through a contact form or analytics.',
        mustMention: [
          [/\b(what|which)\s+(data|information)|we\s+collect|personal\s+(data|information)/i, 'what data is collected'],
          [/\b(lawful\s+basis|legal\s+basis|legitimate\s+interest|consent|contract)\b/i, 'the lawful basis'],
          [/\b(right\s+to|your\s+rights|access|rectification|erasure|object)\b/i, 'data-subject rights'],
          [/\b(retain|retention|how\s+long|keep\s+your)\b/i, 'how long data is kept'],
          [/\b(ico|information\s+commissioner)\b/i, 'the right to complain to the ICO'],
          [/[\w.+-]+@[\w-]+\.[\w.]+|\bcontact\s+us\b/i, 'a contact route for a data request'],
        ],
      },
      cookies: {
        patterns: [/cookie/i],
        required: 'if-non-essential-scripts',
        why: 'PECR reg.6 — consent before any non-essential cookie. NOTE the DUAA 2025 exceptions, live since 5 February 2026: cookies used SOLELY for first-party statistical purposes by the site operator, and those used solely for appearance or functionality, need information and a free opt-out rather than prior consent. Genuinely cookieless first-party analytics does not engage reg.6 at all. So the correct default for a brochure site is usually NO banner — see shared/legal.md.',
        mustMention: [
          [/\bessential|strictly\s+necessary\b/i, 'the essential/non-essential split'],
          [/\b(withdraw|change|manage|opt.?out)\s+(your\s+)?(consent|preferences|cookie)|\bno\s+cookies\b|\bsets\s+no\s+cookies\b/i,
            'how to withdraw consent, or a statement that nothing needing consent is set'],
        ],
      },
      terms: {
        patterns: [/terms/i],
        required: 'recommended',
        why: 'Not a statutory requirement for a brochure site; standard practice, limits liability, cheap to ship.',
        mustMention: [],
      },
      accessibility: {
        patterns: [/accessib/i],
        required: 'recommended',
        why: 'Equality Act 2010 duty to make reasonable adjustments, which carries a size-weighted disproportionate-burden defence. NOT the European Accessibility Act: the EAA does not reach a UK microbusiness informational site on two independent grounds — the microenterprise exemption, and more decisively Annex I\'s closed list of covered service categories, which a brochure site with no online payment or ticketing falls outside entirely. Claiming otherwise wastes build effort and misleads the client.',
        mustMention: [
          [/\bwcag\b/i, 'the standard targeted'],
          [/\b(report|contact|email|tell us|get in touch)\b/i, 'how to report a problem'],
          // An unverified public conformance claim is worse than none: it is a
          // statement of fact about the site that nobody has tested. Automated
          // tooling fully covers only about 57% of issues, and a study of 32
          // blind users found only 50.4% of the problems they actually hit
          // mapped to any success criterion at all.
          [/\b(known\s+limitation|not\s+(yet\s+)?(been\s+)?tested|we\s+have\s+not|aim|target|working\s+towards)\b/i,
            'honest limits — the statement must say what is NOT done, not assert bare conformance'],
        ],
      },
    },

    // Scripts that set or read non-essential storage. Presence of any of these
    // makes a cookie policy AND a working consent gate mandatory, not optional.
    nonEssentialScripts: [
      [/googletagmanager\.com|gtag\/js|google-analytics\.com|\bga\(|gtag\(/i, 'Google Analytics / Tag Manager'],
      [/connect\.facebook\.net|fbq\(/i, 'Meta Pixel'],
      [/hotjar\.com|hj\(/i, 'Hotjar'],
      [/clarity\.ms/i, 'Microsoft Clarity'],
      [/doubleclick\.net|googlesyndication/i, 'Google Ads'],
      [/linkedin\.com\/px|_linkedin_partner_id/i, 'LinkedIn Insight'],
      [/tiktok\.com\/i18n\/pixel|ttq\./i, 'TikTok Pixel'],
      [/snap\.licdn\.com/i, 'LinkedIn'],
      [/matomo|piwik/i, 'Matomo'],
      [/\bfullstory\b|\bmouseflow\b|\bluckyorange\b/i, 'session recording'],
    ],

    // Third-party embeds that set cookies or leak the visitor's IP before any
    // consent decision. Each has a documented drop-in fix, named in the finding.
    consentBeforeLoad: [
      [/fonts\.googleapis\.com|fonts\.gstatic\.com/i, 'Google Fonts loaded from Google',
        'Self-host the font files. A German court (LG München I, 3 O 17493/20, Jan 2022) held that hotlinking Google Fonts transmits the visitor IP to a third country without consent; self-hosting removes the question entirely and is faster.'],
      [/(?<!nocookie\.)youtube\.com\/embed/i, 'YouTube embed sets cookies on load',
        'Swap the host for youtube-nocookie.com, or use a click-to-load poster image.'],
      [/maps\.googleapis\.com|google\.com\/maps\/embed/i, 'Google Maps embed loads before consent',
        'Use a static map image linking out to Maps, or click-to-load.'],
      [/platform\.twitter\.com|instagram\.com\/embed|tiktok\.com\/embed/i, 'social embed loads before consent',
        'Click-to-load, or link out instead of embedding.'],
    ],

    // Business identity disclosure. Which set applies depends on the entity
    // type, which the checker cannot infer — it is read from facts.md.
    disclosure: {
      limited: [
        [/\b(company\s+(number|no\.?|reg)|registered\s+in\s+england|companies\s+house)\b/i,
          'registered company number', 'Companies Act 2006 s.82 + the Company, Limited Liability Partnership and Business (Names and Trading Disclosures) Regulations 2015 (SI 2015/17), which revoked the 2008 Regs — a limited company must show its registered name, number, and place of registration on its website.'],
        [/\bregistered\s+(office|address)\b/i, 'registered office address', 'Same regulations (SI 2015/17).'],
      ],
      soleTrader: [
        [/\b\d{1,4}[a-z]?\s+[\w'-]+\s+(road|street|lane|avenue|way|close|drive|court|place|terrace|hill|park|square)\b|\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/i,
          'a geographic address or postcode', 'E-Commerce (EC Directive) Regs 2002 reg.6 — a trader must give a geographic address that is easily, directly and permanently accessible, not merely a contact form. A sole trader using a business name also owes the proprietor\'s real name and a contact address under Companies Act 2006 Part 41 + SI 2015/17 — and NOT a company number, which they do not have.'],
      ],
      all: [
        [/[\w.+-]+@[\w-]+\.[\w.]+|tel:|\b0\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}\b/,
          'an email address or phone number', 'E-Commerce Regulations 2002 reg.6 — contact details that allow rapid, direct communication.'],
      ],
    },

    // Claims that need evidence before they may ship. Each is a real regulator
    // exposure, not a style preference.
    //
    // PRECISION OVER RECALL, deliberately. Every pattern here was tightened
    // against real shipped sites until it stopped firing on innocent prose. An
    // earlier, looser version flagged "registered office" as an accreditation
    // claim and "the best way to reach us" as a superiority claim — and a gate
    // that cries wolf is a gate people learn to skip, which is worse than no
    // gate. If a pattern is ambiguous it belongs in the judgment checklist,
    // not here.
    // The loader assembles regulatedClaims from _base.mjs claimPatterns plus
    // these citations. This file used to hand-roll the whole array, which
    // bypassed the shared patterns entirely: the environmental claim class did
    // not exist here at all, so an unsubstantiated green claim shipped clean,
    // and the accreditation pattern carried an /i flag that the base file
    // explicitly warns turns a precise gate into a cry-wolf one.
    // localRegisters above supplies the UK trade registers by name.
    claimCitations: {
      rating:
        'DMCC Act 2024 (in force 2025) — a review or rating that is not genuine is a banned practice, with penalties up to 10% of global turnover. It must trace to a real, attributable review.',
      count:
        'DMCC Act 2024 Part 4 Ch.1 (in force 6 Apr 2025, replacing CPUT 2008) — a specific number is a factual claim and must be substantiable on request.',
      superiority:
        'CAP Code 3.1/3.7 — objective superiority claims must be backed by documentary evidence held BEFORE publication.',
      accreditation:
        'If the register is real (Gas Safe, NICEIC, HCPC, GDC, SRA, CQC…) the membership number must be real and checkable. Claiming an unheld trade registration is a criminal matter in several trades, not a marketing slip.',
      guarantee:
        'DMCC Act 2024 Part 4 (replacing CPUT 2008, revoked 6 Apr 2025) — a guarantee stated on the site is a contractual term the business is held to. Only ship one the owner has agreed to honour.',
      insurance:
        'Substantiable, and clients do ask to see the certificate.',
      years:
        'A specific number is checkable against Companies House or the domain age. Confirm it before it ships.',
      environmental:
        'DMCC Act 2024 Part 4 Ch.1 (in force 6 Apr 2025) covers misleading environmental claims as a general unfair-practice matter, and the CMA Green Claims Code sets the substantiation bar the regulator applies. "Carbon neutral" and "eco-friendly" are objective claims and need evidence held BEFORE publication. UNCONFIRMED whether a dedicated UK green-claims instrument has commenced since 2026-08-18 - check at review.',
    },
  },

  seo: {
    locale: 'en_GB',
    // A UK local business without these is invisible in the search that matters.
    localBusinessRequired: true,
  },
};
