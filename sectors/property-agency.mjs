// website-builder — estate and letting agency.
//
// The other trade whose duty names the website in the statute, and the one
// where a general-purpose builder does the most damage, because the missing
// page is the FEE LIST and the client asked for a site that "looks premium".
//
// Consumer Rights Act 2015 s.83(3) is unusually blunt for a consumer statute:
// the agent "must publish a list of the fees on the agent's website (if it has
// a website)". No threshold, no exemption for a one-person agency, no "where
// practicable". If there is a website, the list goes on it.
//
//   LAW LAST VERIFIED: 2026-08-19
//   NEXT REVIEW:       2027-02-19
//
// NOT LEGAL ADVICE. Nobody qualified has read this.

export default {
  id: 'property-agency',
  name: 'Estate and letting agency',
  aliases: ['estate-agent', 'letting-agent', 'lettings'],

  detect: {
    strong: [
      /\bletting agents?\b/i,
      /\bestate agents?\b/i,
      /\blettings? (?:agency|agent|team)\b/i,
      /\bproperty management (?:company|services)\b/i,
      /\bblock management\b/i,
    ],
    weak: [
      /\btenants?\b/i,
      /\blandlords?\b/i,
      /\btenancy agreement\b/i,
      /\bassured shorthold\b/i,
      /\bvaluations?\b/i,
      /\bproperties? (?:to let|for sale)\b/i,
    ],
    not: [
      // A builder, architect or surveyor talks about property all day and is
      // not an agent. The strong list is what separates them; this stops the
      // weak pair firing on a construction site's copy.
      /\b(?:we (?:build|design|survey)|architectural practice|chartered surveyors?)\b/i,
    ],
  },

  jurisdictions: {
    uk: {
      regulator: 'Trading Standards (enforcement) · an approved redress scheme (The Property Ombudsman or Property Redress Scheme)',
      register: 'https://www.tpos.co.uk/find-a-member',

      duties: [
        {
          kind: 'page',
          what: 'published list of the agent\'s fees',
          patterns: [/fees?|charges|pricing|costs?|tariff/i],
          // No appliesIf. s.83(3) has no threshold and no exemption, and adding
          // a condition here to be safe would be inventing one the Act does not
          // contain — the same defect as inventing a price.
          why: 'Consumer Rights Act 2015 s.83(3): a letting agent "must publish a list of the fees on the agent\'s '
            + 'website (if it has a website)". The website is named in the statute. There is no size threshold and '
            + 'no exemption for a small agency, and enforcement is by local weights and measures authorities with a '
            + 'financial penalty. This is the single most commonly missing page on a letting agent\'s site, and it '
            + 'is missing because nobody asked for it.',
        },
        {
          kind: 'present',
          what: 'a statement naming the redress scheme the agent belongs to',
          pattern: /\b(?:The Property Ombudsman|Property Ombudsman|TPOS?\b|Property Redress Scheme|PRS\b|redress scheme)\b/i,
          why: 'Consumer Rights Act 2015 s.83(7) requires, with the fee list, "a statement — (a) that indicates '
            + 'that the agent is a member of a redress scheme, and (b) that gives the name of the scheme". '
            + 'Membership of an approved redress scheme is separately compulsory for lettings and property '
            + 'management work. Naming the scheme is the part sites forget: a logo in a footer strip is not a '
            + 'statement, and it is not readable by anyone using a screen reader.',
          wantsRegisterLink: true,
        },
        {
          kind: 'present',
          what: 'a statement about client money protection',
          pattern: /\bclient money protection\b|\bCMP\b|\bclient money\b/i,
          appliesIf: /\b(?:letting|lettings|rent(?:al|s)?|tenant|landlord|property management)\b/i,
          why: 'Consumer Rights Act 2015 s.83(6): where the agent is required to be a member of a client money '
            + 'protection scheme, the agent must display or publish "a statement that — (a) indicates that the '
            + 'agent is a member of a client money protection scheme, and (b) gives the name of the scheme". '
            + 'Holding client money without cover is a separate offence; this gate is only about saying so on the '
            + 'site. If the agent genuinely holds no client money, say that instead of saying nothing.',
        },
        {
          kind: 'absent',
          what: 'a tenant fee this trade may no longer charge in England',
          // Deliberately narrow. The Tenant Fees Act bans a long list; these are
          // the three that survive on old websites years after the ban, because
          // they are on a page nobody edits.
          pattern: /\b(?:admin(?:istration)? fee|tenancy set[- ]?up fee|referencing fee|inventory check[- ]?in fee)\b[^.\n]{0,40}?(?:£\s?\d|\d+\s?(?:pounds|GBP))/i,
          why: 'Tenant Fees Act 2019 s.1 prohibits a landlord requiring a relevant person to make a prohibited '
            + 'payment in connection with an assured shorthold tenancy in England; s.2 does the same for agents. '
            + 'Permitted payments are the closed list in Sch.1 — rent, a capped deposit, a capped holding deposit, '
            + 'default fees, change-of-tenancy and early-termination charges. An advertised admin, referencing or '
            + 'check-in fee is the shape of the charge the Act bans, published on the agent\'s own site. Check it '
            + 'against Sch.1 before removing this finding: a genuinely permitted payment stated plainly is fine, '
            + 'and this pattern is looking for the banned ones by their common names.',
        },
      ],

      confirm: [
        {
          id: 'property-agency/uk/material-information',
          what: 'Whether every property listing carries the material information National Trading Standards requires — tenure, council tax band, price or rent, and for lettings the deposit and the availability date.',
          why: 'The National Trading Standards Estate and Letting Agency Team\'s material-information guidance, '
            + 'issued under the enforcement powers the DMCC Act 2024 now carries, treats omission of material '
            + 'information in a property listing as a prohibited practice. This repo builds brochure sites, not '
            + 'property portals, so the listings are usually elsewhere — but if the site lists properties, the '
            + 'duty follows them onto it, and no static reader can tell whether a listing is complete.',
        },
        {
          id: 'property-agency/uk/scheme-current',
          what: 'Whether the named redress and client-money schemes are the ones the agent is a member of TODAY, checked in the scheme\'s own member list.',
          why: 'Agents change scheme, and the website is the last place it gets updated. A published claim of '
            + 'membership that has lapsed is a false statement about a consumer protection, made by the business '
            + 'to its own customers.',
        },
      ],
    },

    us: { researched: false, why: 'Real estate licensing, agency disclosure and trust-account rules are state law, administered by fifty separate real estate commissions, and most states additionally require a licence number and brokerage name in advertising. Fifty answers. Not researched in this pass.' },
    eu: { researched: false, why: 'No EU-wide estate agency instrument was found; regulation is member-state level and ranges from full licensing to none. Not researched.' },
    ca: { researched: false, why: 'Provincial: RECO in Ontario, BCFSA in British Columbia, and so on. Not researched in this pass.' },
    au: { researched: false, why: 'State and territory licensing with mandatory agency agreements and trust accounting. Not researched in this pass.' },
  },

  coverage: {
    uk: {
      // s.83 is enforced by local weights and measures authorities and carries
      // the redress-scheme statement. It does not constitute a regulator and it
      // does not restrict who may trade, so it is not cited for either.
      whoRegulates: null,
      whoRegulatesWhy: 'There is no single regulator of letting agency in England. Enforcement of the fee-publication duty sits with local weights and measures authorities, and consumer redress with an approved scheme. No instrument constituting a regulator for this trade was read in this pass.',
      entryRestriction: null,
      entryRestrictionWhy: 'No licence is required to trade as a letting agent in England. Membership of an approved redress scheme is compulsory, which is a condition of trading rather than an entry qualification, and the instrument imposing it (the Estate Agents Act 1979 / CEARA 2007 regime) was not read to a citable standard in this pass.',
      websiteDuties: 'https://www.legislation.gov.uk/ukpga/2015/15/section/83',
      advertisingLimits: 'https://www.legislation.gov.uk/ukpga/2019/4/section/2',
      complaintsRoute: 'https://www.legislation.gov.uk/ukpga/2015/15/section/83',
    },
  },

  provenance: {
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: '2026-08-19',
    nextReview: '2027-02-19',
    sources: [
      {
        claim: 'Consumer Rights Act 2015 s.83 — the duty of letting agents to publicise fees. s.83(3) names the agent\'s website; s.83(6) and s.83(7) require the client-money-protection and redress-scheme statements to accompany the fee list.',
        url: 'https://www.legislation.gov.uk/ukpga/2015/15/section/83',
        accessed: '2026-08-19',
        class: 'primary',
        quote: 'publish a list of the fees on the agent\'s website',
      },
      {
        claim: 'Tenant Fees Act 2019 s.2 — prohibition on a letting agent requiring a prohibited payment in connection with an assured shorthold tenancy in England. The permitted payments are the closed list in Schedule 1.',
        url: 'https://www.legislation.gov.uk/ukpga/2019/4/section/2',
        accessed: '2026-08-19',
        class: 'primary',
      },
    ],
    caveats: [
      'The Tenant Fees Act 2019 applies in ENGLAND. Wales has its own regime under the Renting Homes (Fees etc.) (Wales) Act 2019, and Scotland banned tenant fees long before either. The `absent` duty in this file is written to the English ban and will be wrong at the edges elsewhere.',
      's.83 is about LETTING agents. A pure sales estate agency is caught by a different set — the Estate Agents Act 1979 and the redress requirement — and this file checks the redress statement for both while citing s.83 for the fee list. A sales-only agency should read the fee-list finding as a prompt, not as a breach.',
      'Nothing here checks whether the published fees are correct, only that a fee page exists and the scheme statements are present. A published fee list that understates what is charged is a consumer-protection problem no file can see.',
    ],
  },
};
