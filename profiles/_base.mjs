// website-builder — the jurisdiction-neutral floor.
//
// Every profile in this folder is merged ON TOP of this file. What lives here is
// the part that does not change when you cross a border:
//
//   * which scripts set non-essential storage (a Meta Pixel is a Meta Pixel in
//     every country)
//   * which third-party embeds leak the visitor before any choice
//   * the SHAPE of a claim that needs evidence — a star rating, a customer count,
//     a superiority claim, an accreditation, a guarantee, an insurance boast, a
//     years-in-business number
//   * the honesty floor: never invent a legal fact, never assert compliance
//
// What is NOT here, because it is genuinely country-shaped:
//
//   * whether consent must be collected BEFORE the script fires, or disclosed
//     with an opt-out, or merely described in a notice  (legal.consentModel)
//   * which pages are required and what each must say    (legal.pages)
//   * what identity a business must disclose on its site (legal.disclosure)
//   * WHICH LAW makes each claim class risky, and what the penalty is
//     (legal.claimCitations — the profile supplies the citation, this file
//      supplies the pattern that finds the claim)
//
// That split is the whole design. Adding a country means answering the second
// list, not rewriting the first — which is what makes the research protocol in
// profiles/README.md a one-prompt job instead of a rebuild.
//
// NOT LEGAL ADVICE, here or in any profile that extends it.

// A business SAYING IT DOES NOT DO SOMETHING is the opposite of a claim, and
// reporting the disclaimer as the promise is the most embarrassing false
// positive a claim checker can produce. Measured on twenty lines of ordinary
// honest small-business copy, the un-negated patterns fired on four of them,
// every one a sentence declining to make the claim.
//
// The window is 60 characters because the negation is usually several words
// upstream: "nobody here is going to tell you we are the best joiner in Devon".
// First letters are spelled as classes rather than carried by an /i flag: the
// superiority pattern is deliberately case-SENSITIVE (its trailing [A-Z] place
// name is the discriminator), so an /i here would break the rule it guards.
// Without the classes, a sentence OPENING with the negation — "Nobody here is
// going to tell you we are the best joiner in Devon" — slipped straight past.
const NOT = String.raw`(?<!\b(?:[Nn]ot|[Nn]ever|[Nn]obody|[Nn]o one|[Nn]o-one|[Cc]annot|[Cc]an't|[Cc]an not|[Dd]o not|[Dd]on't|[Dd]oes not|[Dd]oesn't|[Ww]on't|[Uu]nable to)\b[^.!?]{0,60})`;

export default {
  id: '_base',
  name: 'jurisdiction-neutral floor',
  country: null,
  iso2: null,

  provenance: {
    // 'verified'   — a named human with the relevant qualification checked it
    // 'researched' — assembled from primary sources by an agent; nobody qualified read it
    // 'baseline'   — deliberately generic; makes no country-specific claim at all
    status: 'baseline',
    verifiedBy: null,
    lawLastVerified: '2026-08-18',
    nextReview: '2027-02-18',
    sources: [],
    caveats: [],
  },

  locale: {
    language: 'en',
    spelling: 'gb',
    dateFormat: 'D MMMM YYYY',
    currency: null,
    currencySymbol: '',
    phoneExample: null,
    fictionalPhoneRange: null,
    postcodePattern: null,
    // Phone handling, read by checks/lib/locale.mjs. A profile that leaves these
    // null gets a permissive international fallback rather than another
    // country's shape - which is what three gates used to do, so the repo's
    // flagship "no unsourced phone number ships" promise was OFF everywhere
    // except the UK.
    phonePattern: null,          // '/(?:\\+61|\\b0)[\\d\\s()-]{8,14}\\d/g'
    phoneCountryCode: null,      // '61'  - stripped when normalising
    phoneNationalPrefix: null,   // '0'   - re-added when normalising
    phoneNationalPattern: null,  // '/^0\\d{9}$/' - what a valid national number looks like
    addressOrder: null,
    measurement: 'metric',
    // Right-to-left scripts change layout, not just text. A build whose content
    // language is Arabic, Hebrew, Persian or Urdu sets this, and then owes
    // dir="rtl" plus logical CSS properties rather than left/right ones.
    direction: 'ltr',
  },

  copy: {
    // Em-dash DENSITY per 1,000 words of visible copy. Not a ban: measured human
    // published prose pools at 6.43/1,000 (range 3.47-10.13) and GPT-4.1 at
    // 10.62 — presence proves nothing, density proves a great deal. Warn at the
    // human average, block above the top of the human range.
    //
    // These numbers were measured on ENGLISH prose. A profile whose language is
    // not English should either re-measure or set them to null, which turns the
    // gate off with a stated reason rather than applying an English threshold to
    // German, where the dash convention differs.
    emDashPer1000Warn: 6.43,
    emDashPer1000Block: 10.13,
    language: 'en',
  },

  legal: {
    privacyLaw: null,

    // 'prior-opt-in'       — nothing non-essential may fire before a yes
    // 'notice-and-opt-out' — it may fire, but disclosure + a working opt-out are owed
    // 'notice-only'        — a privacy notice suffices
    // null                 — unknown; the gate says so rather than guessing
    consentModel: null,
    consentModelWhy: '',

    // Page requirements are country-shaped, so the base supplies only the filename
    // patterns. A profile that leaves `required` unset inherits 'recommended',
    // which reports a MINOR and never blocks a ship on an unresearched rule.
    pages: {
      privacy: { patterns: [/privacy|datenschutz|confidentialit|privacidad/i], required: 'recommended', why: '', mustMention: [] },
      cookies: { patterns: [/cookie|temoin/i], required: 'recommended', why: '', mustMention: [] },
      terms: { patterns: [/terms|conditions|impressum|legal.?notice|mentions.?legales/i], required: 'recommended', why: '', mustMention: [] },
      accessibility: { patterns: [/accessib/i], required: 'recommended', why: '', mustMention: [] },
    },

    // Scripts that set or read non-essential storage. Universal: the tracker does
    // the same thing in Ohio as in Osaka. What differs is whether it may fire
    // before consent, and that is legal.consentModel's job.
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
      [/plausible\.io|umami\.|cdn\.usefathom\.com|simpleanalytics/i, 'privacy-first analytics (often cookieless — confirm before treating it as consent-exempt)'],
    ],

    // Third-party embeds that contact a third party on page load, before the
    // visitor has decided anything. Each has a documented drop-in fix.
    consentBeforeLoad: [
      [/fonts\.googleapis\.com|fonts\.gstatic\.com/i, 'Google Fonts loaded from Google',
        'Self-host the woff2 files. Hotlinking transmits the visitor IP to a third country before any choice; self-hosting removes the question entirely and is faster. A German court (LG Muenchen I, 3 O 17493/20, Jan 2022) awarded damages on exactly this.'],
      [/(?<!nocookie\.)youtube\.com\/embed/i, 'YouTube embed sets cookies on load',
        'Swap the host for youtube-nocookie.com, or use a click-to-load poster image.'],
      [/maps\.googleapis\.com|google\.com\/maps\/embed/i, 'Google Maps embed loads before consent',
        'Use a static map image linking out to Maps, or click-to-load.'],
      [/platform\.twitter\.com|instagram\.com\/embed|tiktok\.com\/embed/i, 'social embed loads before consent',
        'Click-to-load, or link out instead of embedding.'],
      [/cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|unpkg\.com|ajax\.googleapis\.com/i, 'a script served from a public CDN',
        'Self-host it. A CDN sees every visitor IP, and a compromised CDN serves your visitors whatever it likes. If it must stay, add an SRI integrity hash.'],
    ],

    // Business identity disclosure. Every entry is country-shaped EXCEPT the one
    // below: a trader nobody can contact is a problem in every legal system that
    // has consumer law at all.
    disclosure: {
      corporation: [],
      soleTrader: [],
      all: [
        [/[\w.+-]+@[\w-]+\.[\w.]+|tel:|\b\+?\d[\d\s().-]{7,}\b/,
          'an email address or phone number',
          'A reachable contact route. Most consumer-protection regimes require one and none forbids it. If the only route is a form the owner never checks, the site has no contact route.'],
      ],
    },

    // ---------------------------------------------------------------------
    // Claim classes. The PATTERN is universal — a star rating looks the same
    // everywhere. The CITATION is not, so each profile supplies
    // legal.claimCitations.<key> and the loader stitches the two together.
    //
    // PRECISION OVER RECALL, deliberately. Every pattern here was tightened
    // against real shipped sites until it stopped firing on innocent prose. An
    // earlier, looser version flagged "registered office" as an accreditation
    // claim and "the best way to reach us" as a superiority claim — and a gate
    // that cries wolf is a gate people learn to skip, which is worse than no
    // gate. If a pattern is ambiguous it belongs in a judgment checklist, not
    // here.
    // ---------------------------------------------------------------------
    claimPatterns: {
      rating: [/\b\d(\.\d)?\s*(★+|stars?\b|out\s+of\s+5|\/\s*5)\b/i, 'a star rating'],
      // A NUMBER is mandatory. The earlier version made the digits optional, so
      // "we do more than clients expect" was reported as a customer-count claim
      // — found by testing the patterns against innocent prose rather than
      // against the claims they were written for.
      count: [/\b(?:(?:over|more\s+than|upwards\s+of)\s+)?\d[\d,]*\+?\s*(?:happy\s+|satisfied\s+)?(?:customers|clients|patients|reviews|projects|jobs)\b/i, 'a customer-count claim'],
      // Case stays SENSITIVE: the trailing [A-Z] place name is what separates
      // "the best joiner in Devon" from "the best way to reach us".
      superiority: [new RegExp(`${NOT}(?:\\b(?:no\\.?\\s?1|number\\s+one)\\s+\\w+|\\b(?:the\\s+)?(?:best|leading|top|premier|foremost)\\s+\\w+\\s+in\\s+(?:the\\s+)?[A-Z][\\w]+|\\baward[-\\s]winning\\b|\\bmarket[-\\s]leading\\b)`), 'a superiority or award claim'],
      // Requires an actual register or qualifier after the word, so "registered
      // office" and "registered address" do not match.
      //
      // Case is spelled out letter by letter rather than carried by an /i flag,
      // because the trailing [A-Z] IS the discriminator — it is what separates
      // "registered with NICEIC" from "registered office". An /i flag would make
      // that [A-Z] meaningless and the pattern would fire on ordinary prose,
      // while leaving the first word case-SENSITIVE silently missed every claim
      // that opened a sentence ("Registered with Gas Safe").
      accreditation: [/\b(?:[Cc]ertified|[Aa]ccredited|[Rr]egistered|[Aa]pproved|[Qq]ualified|[Ll]icensed|[Mm]ember)\s+(?:by|with|of)\s+[A-Z]/, 'an accreditation or register claim'],
      // NEGATED guarantees are the opposite of a guarantee. "We cannot guarantee
      // the part is in stock" is a disclaimer, and flagging it as a promise the
      // business must honour is exactly backwards. Variable-length lookbehind is
      // supported in V8, which is the only engine this runs on.
      // The negation guard applies to EVERY alternative. It used to sit on the
      // first branch only, so "we do NOT offer a money back guarantee on
      // bespoke work" was reported as a guarantee the business must honour.
      guarantee: [new RegExp(`${NOT}(?:\\b(?:we\\s+)?guarantee(?:d)?\\s+\\w+|\\bmoney[-\\s]back\\s+guarantee\\b|\\b100%\\s+(?:satisfaction|guaranteed?)\\b|\\blifetime\\s+(?:guarantee|warranty)\\b)`, 'i'), 'a guarantee'],
      insurance: [/\b(fully|comprehensively)\s+insured\b|\b(public|professional)\s+(liability|indemnity)\s+insurance\b/i, 'an insurance claim'],
      years: [/\b(\d+)\+?\s*years?\s+(of\s+)?(experience|trading|in\s+business|serving)\b/i, 'a years-in-business claim'],
      // Green claims are separately legislated in the EU, UK, Canada and
      // Australia now, on different timetables. The pattern is shared; a profile
      // with no environmental citation gets the generic warning below.
      environmental: [/\b(carbon[-\s]neutral|net[-\s]zero|climate[-\s]positive|eco[-\s]friendly|environmentally\s+friendly|100%\s+(recycled|sustainable)|plastic[-\s]free|green\s+energy)\b/i, 'an environmental claim'],
    },

    // Used when a profile supplies no citation for a class. It never asserts a
    // specific law, because this file does not know one.
    claimFallback: 'Substantiate it before it ships. Every consumer-protection regime this repo has looked at treats an unsubstantiated factual claim about a business as actionable; which statute applies here is not encoded, because this jurisdiction profile did not supply one.',

    // Profiles append register or regulator names here and the loader ORs them
    // into the accreditation pattern, so "Gas Safe" or "CSLB" is caught by name.
    localRegisters: [],

    extras: [],
  },

  seo: {
    locale: null,
    localBusinessRequired: true,
  },
};
