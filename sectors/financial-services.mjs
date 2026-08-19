// website-builder — financial services: advisers, mortgage and insurance
// brokers, and — the one nobody expects — any business that arranges credit for
// its customers.
//
// The surprise in this file is not the IFA. It is the garage offering finance,
// the dentist offering "0% over 12 months", the double-glazing firm with a
// "spread the cost" page. Arranging or introducing consumer credit is a
// regulated activity, and a website that advertises it is a financial promotion.
//
// FCA GEN 4 Annex 1R sets the prescribed statutory status disclosure, and it is
// prescribed WORDING, not a paraphrase:
//
//     "Authorised and regulated by the Financial Conduct Authority"
//
// with the FCA's own instruction that the full name is used rather than the
// abbreviation.
//
//   LAW LAST VERIFIED: 2026-08-19
//   NEXT REVIEW:       2027-02-19
//
// NOT LEGAL ADVICE and emphatically not regulatory advice. This is the sector
// where being roughly right is worth nothing.

export default {
  id: 'financial-services',
  name: 'Financial services, and any business arranging consumer credit',
  aliases: ['ifa', 'mortgage-broker', 'insurance-broker', 'financial-adviser'],

  detect: {
    strong: [
      /\bfinancial advis(?:er|ers|or|ors|ory)\b/i,
      /\bmortgage (?:advis|broker|adviser)/i,
      /\binsurance broker/i,
      /\bindependent financial advis/i,
      /\bwealth management\b/i,
      /\bFCA\b(?!\s*(?:cup|women))/,
      /\bcredit broker\b/i,
    ],
    weak: [
      /\bfinance (?:options?|available|packages?)\b/i,
      /\b0% (?:apr|finance|interest)\b/i,
      /\bspread the cost\b/i,
      /\bpay monthly\b/i,
      /\brepresentative apr\b/i,
      /\bbuy now,? pay later\b/i,
      /\bpensions?\b/i,
      /\binvestments?\b/i,
    ],
    not: [],
  },

  jurisdictions: {
    uk: {
      regulator: 'Financial Conduct Authority',
      register: 'https://register.fca.org.uk/',

      duties: [
        {
          kind: 'present',
          what: 'the prescribed statutory status disclosure',
          pattern: /\b(?:authorised|authorized)\s+and\s+regulated\s+by\s+the\s+Financial\s+Conduct\s+Authority\b|\bappointed representative of\b[^.\n]{0,80}?\bFinancial Conduct Authority\b/i,
          why: 'FCA GEN 4 Annex 1R prescribes the statutory status disclosure an authorised firm must use, and the '
            + 'FCA\'s own note on it is that the full name "Financial Conduct Authority" is used rather than the '
            + 'abbreviation "FCA". This gate looks for the prescribed sentence, not for the letters — a footer '
            + 'reading "FCA regulated" is not the disclosure, and it is what almost every small firm\'s website '
            + 'says. An appointed representative uses the AR form of words instead, which this gate also accepts.',
          wantsRegisterLink: true,
        },
        {
          kind: 'present',
          what: 'the firm\'s Financial Services Register number',
          pattern: /\b(?:FRN|firm reference (?:number|no\.?)|financial services register (?:number|no\.?))\b[^.\n]{0,20}?\b\d{6}\b|\bregister(?:ed)? (?:number|no\.?)\b[^.\n]{0,15}?\b\d{6}\b/i,
          why: 'The Financial Services Register is how a consumer checks that a firm is authorised and for what. '
            + 'Publishing the status sentence without the six-digit reference makes the claim unverifiable, and '
            + 'the register entry is the only place the PERMISSIONS are visible — which is the part that decides '
            + 'whether the firm may lawfully do what its homepage says it does.',
          wantsRegisterLink: true,
        },
        {
          kind: 'present',
          what: 'a representative example, or a route to the credit terms, on a site advertising finance',
          pattern: /\brepresentative (?:example|apr)\b|\bAPR\b|\btotal amount payable\b/i,
          appliesIf: /\b(?:0% (?:apr|finance|interest)|finance available|spread the cost|pay monthly|buy now,? pay later|interest[- ]free credit)\b/i,
          why: 'A financial promotion for credit that includes an incentive — "0%", "spread the cost", "finance '
            + 'available" — triggers the representative-APR and representative-example requirements in the FCA\'s '
            + 'consumer credit rules (CONC 3), which exist so a headline rate cannot appear without the cost '
            + 'beside it. This is the duty that catches the garage and the dentist, neither of whom thinks of '
            + 'themselves as a financial services business, and whose website is the promotion.',
        },
      ],

      confirm: [
        {
          id: 'financial-services/uk/permissions-scope',
          what: 'Whether the FCA permissions on the register entry actually cover every service the site advertises, and whether the firm is directly authorised or an appointed representative.',
          why: 'The register entry lists permissions. A firm authorised for insurance mediation and advertising '
            + 'mortgage advice is outside its permissions, and the website is the evidence. An appointed '
            + 'representative must additionally name its principal. Both are one lookup and neither is a thing a '
            + 'file can do.',
        },
        {
          id: 'financial-services/uk/promotion-approval',
          what: 'Whether every page of this site has been through the firm\'s own financial-promotion approval process before it goes live.',
          why: 'FCA rules require a firm to approve the form and content of a financial promotion before it is '
            + 'communicated. On a website that means the whole site, not the finance page — and a developer who '
            + 'publishes copy in a regulated firm\'s name without it has bypassed a control the firm is '
            + 'accountable for. Hand the copy over for sign-off; do not publish and then tell them.',
        },
        {
          id: 'financial-services/uk/unregulated-introducer',
          what: 'If the business is NOT FCA-authorised but points customers at a finance provider, whether that introduction needs credit-broking permission or an exclusion applies.',
          why: 'Introducing customers to a lender is credit broking, a regulated activity under the Regulated '
            + 'Activities Order art.36A, and doing it by way of business without permission is an offence under '
            + 'FSMA 2000 s.19. There are exclusions — most usefully for introductions to an authorised person in '
            + 'certain circumstances — and which one applies is a question for the firm\'s compliance adviser. '
            + 'What is NOT safe is a site with a "finance available" page and no answer to this question.',
        },
      ],
    },

    us: { researched: false, why: 'Split between the SEC, FINRA, state securities regulators, state insurance departments and the CFPB depending on the product, each with its own advertising rule. Not researched in this pass; the sector is too consequential for a partial answer.' },
    eu: { researched: false, why: 'MiFID II, IDD and the Consumer Credit Directive set the frame, with national conduct rules on top. Not researched in this pass.' },
    ca: { researched: false, why: 'Provincial securities commissions and insurance councils, with OSFI federally. Not researched.' },
    au: { researched: false, why: 'ASIC licensing under the Corporations Act and the National Consumer Credit Protection Act. Not researched.' },
  },

  coverage: {
    uk: {
      whoRegulates: 'https://www.handbook.fca.org.uk/handbook/GEN/4/Annex1.html',
      entryRestriction: 'https://www.legislation.gov.uk/ukpga/2000/8/section/19',
      websiteDuties: 'https://www.handbook.fca.org.uk/handbook/GEN/4/Annex1.html',
      advertisingLimits: 'https://www.legislation.gov.uk/ukpga/2000/8/section/21',
      complaintsRoute: 'https://www.handbook.fca.org.uk/handbook/DISP/1/2.html',
    },
  },

  provenance: {
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: '2026-08-19',
    nextReview: '2027-02-19',
    sources: [
      {
        claim: 'FCA Handbook GEN 4 Annex 1R — the prescribed statutory status disclosure for an authorised firm, and the FCA\'s instruction that the full name "Financial Conduct Authority" is used rather than the abbreviation.',
        url: 'https://www.handbook.fca.org.uk/handbook/GEN/4/Annex1.html',
        accessed: '2026-08-19',
        class: 'regulator',
        quote: 'Authorised and regulated by the Financial Conduct Authority',
      },
      {
        claim: 'FCA Handbook DISP 1.2.1R — the duty to publish information about internal complaints handling, to refer eligible complainants to it, and to give clear information about the Financial Ombudsman Service on the website and in contract terms. This is the complaints route this trade owes, and it names the website.',
        url: 'https://www.handbook.fca.org.uk/handbook/DISP/1/2.html',
        accessed: '2026-08-19',
        class: 'regulator',
      },
      {
        claim: 'FSMA 2000 s.19 — the general prohibition. Carrying on a regulated activity in the UK without authorisation or exemption is an offence, and credit broking is a regulated activity. This is the instrument behind the `unregulated-introducer` confirm item.',
        url: 'https://www.legislation.gov.uk/ukpga/2000/8/section/19',
        accessed: '2026-08-19',
        class: 'primary',
      },
      {
        claim: 'FSMA 2000 s.21 — the financial promotion restriction: a person must not, in the course of business, communicate an invitation or inducement to engage in investment activity unless authorised or the content is approved. A website is a communication.',
        url: 'https://www.legislation.gov.uk/ukpga/2000/8/section/21',
        accessed: '2026-08-19',
        class: 'primary',
      },
    ],
    caveats: [
      'THIS FILE IS A FLOOR AND A LOW ONE. Financial services conduct rules run to thousands of pages and are the single worst area in this repo to treat a green run as reassurance. Three gates and three questions do not approach the FCA Handbook.',
      'The credit-broking duties reach businesses that do not think of themselves as financial at all. That is the point of the `weak` detection terms — but it also means this sector can be detected on a garage or a dental practice, which is a surprise, not an error.',
      'GEN 4 Annex 1R sets the wording; where and how prominently it must appear is governed by other Handbook provisions this pass did not read. A disclosure buried in a legal page satisfies this checker and may not satisfy the FCA.',
      'Nothing here checks whether the firm is authorised. It checks whether it SAYS SO in the prescribed form. A site making the disclosure while unauthorised is a much more serious problem, and the register lookup that would catch it is a human step.',
    ],
  },
};
