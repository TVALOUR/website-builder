// website-builder — the international baseline.
//
// USE THIS WHEN YOU DO NOT KNOW THE LAW WHERE THE SITE TRADES.
//
// It exists so that "we have no profile for Kenya" produces an honest, useful
// run instead of one of the two bad outcomes it used to produce: the legal
// family silently switching off, or somebody pointing `--profile uk` at a
// Kenyan business and shipping Companies Act citations to Nairobi.
//
// What it asserts: the honesty floor. Every factual claim on the site traces to
// a source. A business is contactable. A privacy notice exists and describes
// what actually happens, because a site with a contact form processes personal
// data under every modern privacy regime this repo has looked at, and there are
// now well over 140 of them. A claim that would be risky in the UK, US, EU,
// Canada and Australia is flagged as risky here too — the SHAPE of a dangerous
// claim is portable even when the statute is not.
//
// What it refuses to assert: which law applies, whether a cookie banner is
// owed, what identity must appear on the page, and what the penalty is for
// getting it wrong. Every finding it produces says "check this locally" rather
// than naming a statute it has not read.
//
// It is a floor to build on, not a destination. `profiles/README.md` turns a
// country into a profile in one research pass, and doing that is a better
// answer than shipping on this for a real client.
//
// NOT LEGAL ADVICE.
//
//   LAW LAST VERIFIED: n/a — this profile deliberately cites no law
//   NEXT REVIEW:       2027-02-18 (the universal claim shapes, not the law)

export default {
  id: 'intl-baseline',
  name: 'International baseline (honesty floor, no jurisdiction claimed)',
  country: null,
  iso2: null,

  provenance: {
    status: 'baseline',
    verifiedBy: null,
    lawLastVerified: '2026-08-18',
    nextReview: '2027-02-18',
    sources: [],
    caveats: [
      'This profile names no statute and rules on no local obligation. A green run says the site is honest and contactable, not that it is lawful where it trades.',
      'Cookie and tracking consent is the single largest divergence between countries. This profile reports what the site loads and declines to say whether prior consent is required.',
      'Business identity disclosure varies from near-nothing (much of the US) to a full statutory Impressum (Germany). Nothing is demanded here beyond a reachable contact route.',
      'Accessibility law varies from an enforceable duty to none at all. WCAG is applied here as craft, not as compliance.',
    ],
  },

  legal: {
    privacyLaw: null,

    // Deliberately null. Reporting "we do not know" is the correct output; a
    // guess here is exactly the confident wrong advice the repo exists to stop.
    consentModel: null,
    consentModelWhy:
      'Unknown for this jurisdiction. The gate will still tell you exactly what the site loads and what leaks '
      + 'before any choice, because that is a fact about the files. Whether prior consent is required where this '
      + 'business trades is a question for a local profile or a local adviser. The safe engineering answer, and '
      + 'the one this repo recommends everywhere, is to load nothing that needs consent: no analytics, no pixel, '
      + 'self-hosted fonts, click-to-load embeds. Then the question never arises in any country.',

    pages: {
      privacy: {
        patterns: [/privacy|datenschutz|confidentialit|privacidad|policy/i],
        // Not 'always', because this profile does not know the local trigger.
        // 'if-collects-personal-data' is true nearly everywhere there is a
        // privacy law at all, and a contact form or a mailto is collection.
        required: 'if-collects-personal-data',
        why: 'Most jurisdictions with a privacy law require a notice once personal data is collected, and a '
          + 'contact form, an email link or an analytics script is collection. MOST, not all: this repo ships a '
          + 'counter-example — Australia\'s small business exemption (Privacy Act s.6D) puts a business under the '
          + 'turnover threshold outside the Act entirely, and profiles/au.mjs is built around it. So this is the '
          + 'defensible default for an unknown country, not a statement about yours. Which law applies here is '
          + 'not encoded; check locally.',
        mustMention: [
          [/\b(what|which)\s+(data|information)|we\s+collect|personal\s+(data|information)/i, 'what data is collected'],
          [/\b(why|purpose|use\s+(it|your)|in\s+order\s+to)\b/i, 'why it is collected'],
          [/\b(retain|retention|how\s+long|keep\s+your|delete)\b/i, 'how long it is kept'],
          [/\b(share|shared|third\s+part|processor|provider)\b/i, 'who else sees it'],
          [/[\w.+-]+@[\w-]+\.[\w.]+|\bcontact\s+us\b/i, 'a contact route for a data request'],
        ],
      },
      cookies: {
        patterns: [/cookie|temoin/i],
        required: 'if-non-essential-scripts',
        why: 'Something non-essential is loading. Whether prior consent is required here is jurisdiction-specific '
          + 'and this profile does not rule on it — but disclosing what is set is defensible everywhere, and '
          + 'loading nothing that needs consent is defensible everywhere and cheaper.',
        mustMention: [
          [/\bessential|strictly\s+necessary\b/i, 'the essential/non-essential split'],
          [/\b(withdraw|change|manage|opt.?out)\s+(your\s+)?(consent|preferences|cookie)|\bno\s+cookies\b|\bsets\s+no\s+cookies\b/i,
            'how to opt out, or a statement that nothing needing consent is set'],
        ],
      },
      terms: {
        patterns: [/terms|conditions|impressum|legal.?notice|mentions.?legales/i],
        required: 'recommended',
        why: 'Standard practice, limits liability, cheap to ship. Statutory in some jurisdictions (Germany\'s '
          + 'Impressum is the strongest example) and in none of them harmful.',
        mustMention: [],
      },
      accessibility: {
        patterns: [/accessib/i],
        required: 'recommended',
        why: 'Applied here as craft rather than compliance: whether an enforceable duty exists is local. The '
          + 'statement is the one legal page that can always be written honestly from work actually done.',
        mustMention: [
          [/\bwcag\b/i, 'the standard targeted'],
          [/\b(report|contact|email|tell us|get in touch)\b/i, 'how to report a problem'],
          [/\b(known\s+limitation|not\s+(yet\s+)?(been\s+)?tested|we\s+have\s+not|aim|target|working\s+towards)\b/i,
            'honest limits — the statement must say what is NOT done, not assert bare conformance'],
        ],
      },
    },

    // Nothing beyond reachability is demanded, because in much of the world
    // nothing beyond reachability is required. `all` is inherited from the base.
    disclosure: {
      corporation: [],
      soleTrader: [],
    },

    // No local citations: every claim class falls back to legal.claimFallback,
    // which finds the claim and declines to name a statute. That is the honest
    // output when the jurisdiction is unknown.
    claimCitations: {},

    extras: [
      {
        id: 'intl-baseline/jurisdiction-unknown',
        severity: 'minor',
        what: 'the build is running without a jurisdiction profile',
        detect: 'always, once — a standing note on the report',
        why: 'The legal findings in this run are the portable ones. Before a real client launch, either write a '
          + 'profile for their country (profiles/README.md, one research pass) or have a local adviser read the '
          + 'four legal pages. Ten minutes of the second is worth more than any amount of the first.',
      },
    ],
  },

  seo: {
    locale: null,
    // Unknown: a local-business schema helps a business with premises and is
    // noise for one without. Left on, because the cost of the extra JSON-LD is
    // a few hundred bytes and the cost of missing it is invisibility.
    localBusinessRequired: true,
  },
};
