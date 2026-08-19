// website-builder — building, construction and the general trades.
//
// This file exists partly to make a point the other sector files cannot: the
// honest answer for a whole country can be "almost nothing", and saying so out
// loud is worth more than manufacturing duties to look thorough.
//
// In the UK a builder, a roofer, a plasterer, a landscaper and a general
// handyman are UNREGULATED. There is no licence, no register, no protected
// title and no mandatory website disclosure. Every scheme a UK builder's site
// carries — FMB, TrustMark, NHBC, CheckaTrade — is voluntary. The `uk` entry
// below therefore ships an EMPTY duties array with the reason written out, and
// puts the real exposure where it belongs: in the general claim gates, which
// already catch an accreditation asserted without a source.
//
// In California the opposite is true, and it is unusually crisp. Business and
// Professions Code s.7030.5 requires a licensee to put the licence number in
// "all forms of advertising", and a website is advertising.
//
// One trade, two countries, opposite answers. That is the argument for the
// jurisdiction axis inside a sector file rather than one global rule per trade.
//
//   LAW LAST VERIFIED: 2026-08-19
//   NEXT REVIEW:       2027-02-19
//
// NOT LEGAL ADVICE.

export default {
  id: 'construction-trades',
  name: 'Building, construction and general trades',
  aliases: ['builder', 'construction', 'roofing', 'contractor'],

  detect: {
    strong: [
      /\bbuilders?\b/i,
      /\bbuilding contractors?\b/i,
      /\bgeneral contractors?\b/i,
      /\broofing (?:contractors?|services|specialists?)\b/i,
      /\bgroundworks?\b/i,
      /\bloft conversions?\b/i,
      /\bhouse extensions?\b/i,
    ],
    weak: [
      /\bextensions?\b/i,
      /\brenovations?\b/i,
      /\bplaster(?:ing|er)\b/i,
      /\bcarpentry\b/i,
      /\bbrickwork\b/i,
      /\bdriveways?\b/i,
      /\bscaffolding\b/i,
    ],
    not: [
      // A gas or electrical specialist has its own file and its own statute.
      /\bgas safe\b|\bNICEIC\b|\bpart p\b/i,
      // SOFTWARE. Found by running this detector over this repo's own pattern
      // library, whose <title> is "Pattern library — website-builder": a hyphen
      // is a word boundary, so \bbuilders?\b matches inside "website-builder"
      // and a page about making websites was classified as a construction firm.
      // Left as a comment rather than a silent fix because it is the exact
      // loose-pattern shape every false blocker in this repo has had, committed
      // by the person writing the rule against it.
      /\b(?:website|site|page|web|funnel|landing[- ]?page|form|app|store|store[- ]?front)[- ]builders?\b/i,
      /\bbody\s?builder|\bempire[- ]?builder|\bteam[- ]?builder|\bmodel builder/i,
    ],
  },

  jurisdictions: {
    uk: {
      regulator: null,
      register: null,

      // DELIBERATELY EMPTY. Read the caveats before adding anything here.
      //
      // Inventing a duty to make the file look substantial is the same defect
      // as inventing a price, and it is more tempting here than anywhere else
      // in this folder, because a builder's site LOOKS like it should have
      // obligations. It does not. Its exposure is ordinary consumer law, which
      // `legal/regulated-claim`, `facts/*` and `copy/*` already cover.
      duties: [],

      confirm: [
        {
          id: 'construction-trades/uk/scheme-membership',
          what: 'Whether every trade scheme, guarantee or accreditation shown on the site is a current membership, checked in that scheme\'s own member directory.',
          why: 'UK building trades are unregulated, so every badge on the site is a VOLUNTARY membership and every '
            + 'one of them is checkable. A lapsed FMB or TrustMark logo is a misleading action under DMCC Act '
            + '2024 Part 4, and it is the most common false claim on a trade website — usually because nobody '
            + 'took the logo down. `legal/regulated-claim` flags the claim; only a person can check the '
            + 'membership.',
        },
        {
          id: 'construction-trades/uk/insurance-backed-guarantee',
          what: 'If the site offers a guarantee or warranty, who actually stands behind it, for how long, and whether it is insurance-backed.',
          why: 'A "10 year guarantee" from a sole trader is worth what the sole trader is worth in year nine. '
            + 'Insurance-backed guarantees are a real product with a real provider and a policy number; a '
            + 'guarantee with neither is a marketing sentence. The Consumer Rights Act 2015 rights exist either '
            + 'way and are not the thing being advertised.',
        },
        {
          id: 'construction-trades/uk/building-control',
          what: 'Whether the site implies the business can sign off building regulations approval itself.',
          why: 'Building control approval comes from the local authority or an approved inspector, not from the '
            + 'builder. Copy reading "fully building regs approved" or "we handle building control" is at best '
            + 'loose and at worst a claim to a power the business does not have. It is a copy fix, and it is one '
            + 'a general-purpose site builder writes by default because it sounds reassuring.',
        },
      ],
    },

    us: {
      regulator: 'State contractor licensing board (California: Contractors State License Board)',
      register: 'https://www.cslb.ca.gov/onlineservices/checklicenseII/checklicense.aspx',

      duties: [
        {
          kind: 'present',
          what: 'the contractor\'s state licence number',
          pattern: /\b(?:license|licence|lic\.?|CSLB)\s*#?\s*\d{5,8}\b|\bCA\s*(?:lic|license)\s*#?\s*\d{5,8}\b/i,
          // The US profile is a federal/state patchwork, so a state-specific
          // duty has to be gated on the state. Firing California's rule on a
          // Texas roofer is the "Kansas plumber citing the Companies Act" error
          // this repo's jurisdiction layer was built to stop, one level down.
          appliesIf: /\bCalifornia\b|\bCA\s+9\d{4}\b/,
          why: 'California Business and Professions Code s.7030.5 requires a licensee to include the licence '
            + 'number in construction contracts, subcontracts, calls for bid and "all forms of advertising, as '
            + 'prescribed by the registrar of contractors". A website is advertising. This duty is gated on the '
            + 'site mentioning California because it is CALIFORNIA law — most states have a comparable rule and '
            + 'none of them were read in this pass.',
          wantsRegisterLink: true,
        },
        {
          kind: 'sourcedNumber',
          what: 'a contractor licence number',
          pattern: /\b(?:license|licence|lic\.?|CSLB)\s*#?\s*(\d{5,8})\b/gi,
          why: 'A licence number is checkable in the board\'s free lookup, and a wrong one on a website points a '
            + 'homeowner at somebody else\'s bond and somebody else\'s complaint history.',
        },
      ],

      confirm: [
        {
          id: 'construction-trades/us/state-rule',
          what: 'Which state the business is licensed in, and what THAT state requires in advertising.',
          why: 'Only California was researched in this pass. Most states require the licence number in '
            + 'advertising and several require the licensed business name to match exactly; the details differ '
            + 'and the penalties differ. Read the licensing board\'s advertising rule for the actual state before '
            + 'treating the finding above, or its absence, as meaningful.',
        },
      ],
    },

    eu: { researched: false, why: 'Construction trades are regulated at member-state level, from Germany\'s Handwerksordnung licensing to no requirement at all. Not researched in this pass.' },
    ca: { researched: false, why: 'Provincial and municipal contractor licensing, plus mandatory new-home warranty programmes in several provinces. Not researched.' },
    au: { researched: false, why: 'State builder licensing with mandatory licence-number-in-advertising rules in several states, and home-warranty insurance requirements. Structurally close to the US entry; not researched in this pass.' },
  },

  coverage: {
    uk: {
      // Three nulls in a row, and they are the file's whole argument. UK building
      // trades have no regulator, no register, no protected title and no website
      // duty, and pointing the general consumer statute at all three questions
      // would have dressed an absence up as a citation.
      whoRegulates: null,
      whoRegulatesWhy: 'Nobody. UK building trades have no regulator and no register; every scheme a builder displays is voluntary membership. Enforcement of a false claim about one runs through general consumer law, cited under advertisingLimits.',
      entryRestriction: null,
      entryRestrictionWhy: 'None. No licence, qualification or registration is required to trade as a builder, roofer, plasterer or landscaper in the UK. Gas and electrical work are separate trades with separate instruments and separate files.',
      websiteDuties: null,
      websiteDutiesWhy: 'None. No instrument requires anything to appear on a UK building trade website beyond the entity disclosures every business owes, which the jurisdiction profile covers.',
      advertisingLimits: 'https://www.legislation.gov.uk/ukpga/2024/13/part/4',
      complaintsRoute: 'https://www.legislation.gov.uk/ukpga/2015/15/part/1',
    },
    us: {
      whoRegulates: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7028',
      entryRestriction: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7028',
      websiteDuties: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7030.5',
      advertisingLimits: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7030.5',
      complaintsRoute: null,
      complaintsRouteWhy: 'The Contractors State License Board takes complaints against licensees in California, and its governing provisions were not read in this pass. Only s.7028 and s.7030.5 were.',
    },
  },

  provenance: {
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: '2026-08-19',
    nextReview: '2027-02-19',
    sources: [
      {
        claim: 'California Business and Professions Code s.7030.5 — a licensee must include the licence number in construction contracts, subcontracts, calls for bid and all forms of advertising. This is the citation behind the only machine-checkable duty in this file.',
        url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7030.5',
        accessed: '2026-08-19',
        class: 'primary',
        quote: 'all forms of advertising, as prescribed by the registrar of contractors',
      },
      {
        claim: 'California Business and Professions Code s.7028 — engaging in the business of contracting without a licence is a misdemeanour. Cited for the entry-restriction question: it is what makes the licence number meaningful rather than decorative.',
        url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7028',
        accessed: '2026-08-19',
        class: 'primary',
        quote: 'it is a misdemeanor for a person to engage in the business of, or act in the capacity of, a contractor within this state',
      },
      {
        claim: 'DMCC Act 2024 Part 4 Chapter 1 — the unfair commercial practices regime that reaches a false claim of scheme membership or accreditation. This is the UK answer to every coverage question in this file, and the reason the UK duties array is empty rather than invented.',
        url: 'https://www.legislation.gov.uk/ukpga/2024/13/part/4',
        accessed: '2026-08-19',
        class: 'primary',
      },
      {
        claim: 'Consumer Rights Act 2015 Part 1 — the statutory rights on services, including the requirement that a service be performed with reasonable care and skill. Cited for the complaints-route question: in the UK a builder\'s customer has statutory rights and no sector ombudsman, which is the honest answer.',
        url: 'https://www.legislation.gov.uk/ukpga/2015/15/part/1',
        accessed: '2026-08-19',
        class: 'primary',
      },
    ],
    caveats: [
      'THE UK DUTIES ARRAY IS EMPTY AND THAT IS THE FINDING. UK building trades are unregulated: no licence, no register, no protected title, no mandatory website disclosure. If you came here expecting a list, the absence is the answer, and the exposure lives in the general claim and facts gates instead.',
      'Only California was researched on the US side. The duty is gated on the site mentioning California precisely so it cannot be applied to a state nobody checked — and that also means a Californian contractor whose site never names the state will not trigger it. That is a known miss, chosen over a confident wrong finding in 49 other states.',
      'Gas and electrical work are NOT in this sector even when the same firm does them. Gas has a criminal-offence registration requirement (see sectors/gas-heating.mjs); electrical work in England and Wales is governed by Building Regulations Part P with competent-person schemes. The `not` patterns keep them apart deliberately.',
      'Scotland requires a building warrant before most work starts, which is a different structure from the England and Wales approval regime. Nothing here encodes either.',
    ],
  },
};
