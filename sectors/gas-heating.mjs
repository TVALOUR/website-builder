// website-builder — gas installation, servicing and heating.
//
// The trade where the honest answer is narrower than it first looks, and saying
// so is the point of the file.
//
// What the law actually says is about the WORK, not the website: Gas Safety
// (Installation and Use) Regulations 1998 reg.3(3) makes it unlawful to carry
// out gas work unless the business is a member of a class of persons approved
// by the Health and Safety Executive — which since 2009 has meant the Gas Safe
// Register. There is no statutory duty found in this pass to print the
// registration number on a website.
//
// So this file does NOT invent one. What it gates is the shape that actually
// hurts people: a site claiming Gas Safe registration with no checkable number
// behind it, and a site advertising gas work while saying nothing about
// registration at all. Both are real. Neither needs a made-up statute.
//
// This restraint is deliberate and worth reading before extending the file.
// The Gas Safe Register's Rules of Registration do govern how the brand and
// number may be used in advertising, and the PDF that carries them could not be
// retrieved in this research pass — the host served a bot-detection page. An
// unretrieved source is not a source, so the rule it might contain is in the
// confirm list, not in a gate.
//
//   LAW LAST VERIFIED: 2026-08-19
//   NEXT REVIEW:       2027-02-19
//
// NOT LEGAL ADVICE.

export default {
  id: 'gas-heating',
  name: 'Gas installation, servicing and heating',
  aliases: ['gas', 'heating-engineer', 'plumbing-heating', 'boiler'],

  detect: {
    strong: [
      /\bgas safe\b/i,
      /\bgas engineers?\b/i,
      /\bboiler (?:install|service|servicing|repair|replacement)/i,
      /\bcentral heating (?:install|engineer|system)/i,
      /\blandlord gas safety (?:certificate|record)\b/i,
      /\bCP12\b/,
    ],
    weak: [
      /\bplumb(?:er|ing)\b/i,
      /\bradiators?\b/i,
      /\bcombi boiler\b/i,
      /\bpower flush\b/i,
      /\bheat pumps?\b/i,
    ],
    not: [
      // A boiler-cover comparison site or an energy supplier is not a gas
      // engineer, and applying an engineer's duties to it would be wrong.
      /\bcompare (?:boiler|energy) (?:quotes|deals)\b|\benergy supplier\b/i,
    ],
  },

  jurisdictions: {
    uk: {
      regulator: 'Health and Safety Executive (the duty) · Gas Safe Register (the approved class)',
      register: 'https://www.gassaferegister.co.uk/find-an-engineer-or-check-the-register/',

      duties: [
        {
          kind: 'present',
          what: 'a statement that the business is Gas Safe registered',
          pattern: /\bgas safe\b/i,
          appliesIf: /\bgas\b[^.\n]{0,60}?\b(?:engineer|install|service|servicing|safety|appliance|boiler|fire|cooker|hob)\b|\bboiler (?:install|service|servicing|repair|replacement)/i,
          why: 'Gas Safety (Installation and Use) Regulations 1998 reg.3(3): "no employer shall allow any of his '
            + 'employees to carry out any work in relation to a gas fitting or service pipework and no '
            + 'self-employed person shall carry out any such work, unless the employer or self-employed person… is '
            + 'a member of a class of persons approved for the time being by the Health and Safety Executive". '
            + 'A site advertising gas work is advertising work that is a criminal offence to do unregistered. '
            + 'Nothing requires the statement to be on the website — but a site that omits it is either leaving '
            + 'out the single most reassuring fact about the business, or the business is not registered, and only '
            + 'one of those is fixable by a web developer.',
          wantsRegisterLink: true,
        },
        {
          kind: 'sourcedNumber',
          what: 'a Gas Safe Register number',
          // Gas Safe business registration numbers are six or seven digits.
          pattern: /\bgas safe\b[^.\n]{0,40}?\b(\d{6,7})\b/gi,
          why: 'The Gas Safe number is the string a customer is told, by the Register\'s own public campaign, to '
            + 'check before letting anyone touch their boiler. Publishing one that does not trace to a sourced row '
            + 'is publishing a safety credential nobody confirmed.',
        },
        {
          kind: 'absent',
          what: 'a claim to be Gas Safe registered for work outside the registration\'s scope',
          pattern: /\bgas safe (?:registered|approved|certified)\b[^.\n]{0,50}?\b(?:electric(?:al|ian)|rewire|consumer unit|solar panel|air conditioning)\b/i,
          why: 'A Gas Safe registration covers specified gas work categories and nothing else. Stretching the '
            + 'phrase across an electrical or renewables offer is the accreditation-scope claim `legal/'
            + 'regulated-claim` looks for in general, caught here in the specific form this trade produces.',
        },
      ],

      confirm: [
        {
          id: 'gas-heating/uk/brand-rules',
          what: 'Whether the Gas Safe Register\'s current Rules of Registration and Brand Enforcement Policy permit the way the logo and number are used on this site.',
          why: 'The Register operates a brand enforcement policy covering websites, vehicle signage, stationery '
            + 'and directory listings, and misuse by a registered business is treated as a breach of the Rules of '
            + 'Registration. THIS PASS COULD NOT RETRIEVE THE RULES: the host served a bot-detection page rather '
            + 'than the PDF. So the rule is named and not encoded, which is the honest position — read the current '
            + 'Rules of Registration directly before shipping a site that carries the logo.',
        },
        {
          id: 'gas-heating/uk/category-scope',
          what: 'Which gas work categories the registration actually covers, checked against what the site offers.',
          why: 'A registration is per category — natural gas, LPG, cookers, fires, boilers, commercial. A site '
            + 'that offers commercial catering equipment on a domestic-only registration is advertising work the '
            + 'business may not lawfully do. The Register\'s public entry lists the categories; the website is '
            + 'usually written from the owner\'s summary of them.',
        },
      ],
    },

    us: { researched: false, why: 'Gas fitting is licensed by state and often by municipality, with no federal register. Not researched in this pass.' },
    eu: { researched: false, why: 'Member-state competent-person schemes; no EU-wide instrument found. Not researched.' },
    ca: { researched: false, why: 'Provincial gas-fitter certification (TSSA in Ontario, Technical Safety BC, and so on). Not researched.' },
    au: { researched: false, why: 'State-based gasfitter licensing with a separate Australian Gas Association appliance regime. Not researched.' },
  },

  coverage: {
    uk: {
      whoRegulates: 'https://www.legislation.gov.uk/uksi/1998/2451/regulation/3/made',
      entryRestriction: 'https://www.legislation.gov.uk/uksi/1998/2451/regulation/3/made',
      websiteDuties: 'https://www.legislation.gov.uk/uksi/1998/2451/regulation/3/made',
      advertisingLimits: 'https://www.legislation.gov.uk/ukpga/2024/13/part/4',
      complaintsRoute: 'https://www.legislation.gov.uk/uksi/1998/2451/regulation/3/made',
    },
  },

  provenance: {
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: '2026-08-19',
    nextReview: '2027-02-19',
    sources: [
      {
        claim: 'Gas Safety (Installation and Use) Regulations 1998 reg.3(3) — the approved-class requirement. This is the instrument behind the Gas Safe Register, and it regulates the WORK, not the website. Cited here for exactly that reason: it is the source of the duty and the source of the limit on what this file may claim.',
        url: 'https://www.legislation.gov.uk/uksi/1998/2451/regulation/3/made',
        accessed: '2026-08-19',
        class: 'primary',
        quote: 'unless the employer or self-employed person, as the case may be, is a member of a class of persons approved for the time being by the Health and Safety Executive',
      },
      {
        claim: 'DMCC Act 2024 Part 4 Chapter 1 — the unfair commercial practices regime that replaced CPUT 2008 on 6 April 2025, and the route by which a false accreditation claim on a trade website is enforced. Cited for the advertisingLimits question, because no gas-specific advertising instrument was found.',
        url: 'https://www.legislation.gov.uk/ukpga/2024/13/part/4',
        accessed: '2026-08-19',
        class: 'primary',
      },
    ],
    caveats: [
      'NO STATUTORY DUTY TO PRINT THE REGISTRATION NUMBER ON A WEBSITE WAS FOUND IN THIS PASS. The `present` duty in this file is justified on the reasoning stated in its own `why`, not on an instrument that says "put it on the site". If that reasoning does not convince you, the finding is a prompt and not a breach — and that distinction is the whole reason it is written out rather than asserted.',
      'The Gas Safe Rules of Registration could not be retrieved: gassaferegister.co.uk served a bot-detection page to a plain fetch. Anything those rules require about advertising is therefore in the confirm list and not in a gate.',
      'Northern Ireland has its own gas safety regulations (SR 2004/63) mirroring the GB ones. This file cites the GB instrument.',
      'Plumbing without gas work is not regulated in the UK at all, and a plumber\'s site should NOT be pushed into this sector. That is why `plumbing` is a weak term and the gas terms are the strong ones.',
    ],
  },
};
