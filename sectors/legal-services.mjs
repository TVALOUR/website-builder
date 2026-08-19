// website-builder — legal services.
//
// The clearest case for the whole sector axis. Three of this trade's duties do
// not merely apply to the business, they name the WEBSITE as the place the duty
// is discharged — and a general-purpose site builder ships a solicitor a site
// that breaches all three while passing every other gate in this repo.
//
//   LAW LAST VERIFIED: 2026-08-19
//   NEXT REVIEW:       2027-02-19
//
// NOT LEGAL ADVICE, and the irony of that sentence on this particular file is
// noted. Nobody qualified has read it.

export default {
  id: 'legal-services',
  name: 'Legal services (solicitors, conveyancers, will writers)',
  aliases: ['solicitors', 'law-firm', 'conveyancing'],

  detect: {
    // "Solicitors" and "conveyancing" are the trade naming itself. Nothing else
    // in ordinary English uses them.
    strong: [
      /\bsolicitors?\b/i,
      /\bconveyanc(?:ing|er|ers)\b/i,
      /\blaw firm\b/i,
      /\bbarristers?'? chambers\b/i,
      /\blicensed conveyanc/i,
    ],
    weak: [
      /\blegal advice\b/i,
      /\bprobate\b/i,
      /\bwills? and probate\b/i,
      /\blasting powers? of attorney\b/i,
      /\bfamily law\b/i,
      /\bemployment tribunal\b/i,
    ],
    // A page ABOUT the law is not a law firm. `legal notice`, `legal pages` and
    // the footer word `legal` are on every site this repo builds, by its own
    // instruction — so a sector detector that fired on them would fire on every
    // build the repo produces, which is the definition of a useless gate.
    not: [
      /\blegal (?:notices?|pages?|information|disclaimer)\b/i,
    ],
  },

  jurisdictions: {
    uk: {
      regulator: 'Solicitors Regulation Authority',
      register: 'https://www.sra.org.uk/consumers/register/',

      duties: [
        {
          kind: 'present',
          what: 'the firm\'s SRA authorisation number',
          // The rule says "prominent place", which a static reader cannot judge.
          // What it CAN judge is whether the number is on the site at all, and
          // that is the failure that actually happens.
          pattern: /\bSRA\b[^.\n]{0,40}?\b\d{5,7}\b|\bSRA (?:number|no\.?|ID)\b/i,
          why: 'SRA Transparency Rules 4.1: an authorised body "must display in a prominent place on its website'
            + '… its SRA number and the SRA\'s digital badge". This is a rule of the firm\'s own regulator, made '
            + 'under the Legal Services Act 2007, and the website is named in it. A site with no SRA number is '
            + 'not a stylistic gap, it is the one disclosure the SRA checks for in its own sweeps.',
          wantsRegisterLink: true,
        },
        {
          kind: 'present',
          what: 'the words "authorised and regulated by the Solicitors Regulation Authority", or the equivalent for the firm\'s own regulator',
          pattern: /\b(?:authorised|authorized|regulated)\s+(?:and\s+regulated\s+)?by\s+the\s+(?:Solicitors Regulation Authority|SRA|Council for Licensed Conveyancers|CLC|Bar Standards Board|CILEX Regulation)\b/i,
          why: 'SRA Transparency Rules 4.1 pairs the number with the statement of regulated status, and Rule 4.2 '
            + 'extends the same wording to letterhead and email. A number with no sentence around it does not tell '
            + 'a visitor what they are looking at. If the firm is regulated by the CLC, the BSB or CILEX instead, '
            + 'the wording changes and this gate accepts those — but it does not accept silence.',
        },
        {
          kind: 'page',
          what: 'published complaints procedure, with the route to the Legal Ombudsman',
          patterns: [/complaints?/i, /\bcomplaints?\s+(?:procedure|policy|handling)\b/i],
          why: 'SRA Transparency Rules 2.1: an authorised body "must publish on its website details of its '
            + 'complaints handling procedure including, details about how and when a complaint can be made to the '
            + 'Legal Ombudsman and to the SRA". This is a PAGE duty, and it is the page a general-purpose site '
            + 'builder never ships because no client thinks to ask for it. Route it from the footer, not the '
            + 'primary nav.',
        },
        {
          kind: 'page',
          what: 'published price information for the reserved services the firm advertises',
          patterns: [/pric|cost|fees?|charges/i],
          // Rule 1.1 binds only on a firm that publishes the AVAILABILITY of the
          // specified services. A firm that advertises none of them owes nothing
          // here, and a gate that ignored that would be wrong on a commercial
          // practice — which is exactly the cry-wolf shape this repo bans.
          appliesIf: /\b(?:conveyanc|probate|uncontested probate|employment tribunal|immigration|licensing (?:act )?application|motoring offence|debt recovery|residential (?:sale|purchase|property))\b/i,
          why: 'SRA Transparency Rules 1.1: a body publishing the availability of the specified services "must, in '
            + 'relation to those services, publish on its website cost information in accordance with rule 1.5 and '
            + '1.6". Rule 1.5 sets what the information must contain — total or range, the basis of charges, the '
            + 'experience and qualifications of whoever does the work, disbursements, VAT and what is included. '
            + 'Rule 1.6 requires it "clear and accessible and in a prominent place on your website". This duty '
            + 'fired because the site advertises at least one specified service; if it does not actually offer it, '
            + 'fix the copy rather than the gate.',
        },
        {
          kind: 'sourcedNumber',
          what: 'an SRA authorisation number',
          pattern: /\bSRA\b[^.\n]{0,20}?\b(\d{5,7})\b/gi,
          why: 'The SRA number is the string a visitor uses to check the firm is real, and a wrong one points at '
            + 'somebody else\'s firm.',
        },
      ],

      confirm: [
        {
          id: 'legal-services/uk/digital-badge',
          what: 'Whether the SRA digital badge is embedded on the site, and whether embedding it loads anything before cookie consent.',
          why: 'Transparency Rule 4.1 requires the badge as well as the number, and the badge is a third-party '
            + 'embed. Two rules in this repo now meet: the SRA requires it, and `legal/third-party-preconsent` '
            + 'refuses third-party loads before a choice. Both are satisfiable — the badge is required to be '
            + 'displayed, not required to be loaded from the SRA before consent — but somebody has to decide how, '
            + 'and a checker reading files cannot see whether a badge rendered.',
        },
        {
          id: 'legal-services/uk/reserved-activity',
          what: 'Whether every service described on the site is one this firm is actually authorised to carry on.',
          why: 'The reserved legal activities in Legal Services Act 2007 s.12 and Sch.2 may only be carried on by '
            + 'an authorised person. A will-writing business that is NOT authorised may lawfully write wills and '
            + 'may not conduct the probate that follows — and its website is where that line gets crossed, usually '
            + 'by a page written to be reassuring. No file can check this; the firm\'s authorisation scope can.',
        },
      ],

    },

    us: { researched: false, why: 'Attorney advertising is regulated state by state under each state bar\'s rules of professional conduct — typically an ABA Model Rule 7.1-7.3 derivative, with meaningful divergence on required disclaimers, "specialist" claims and testimonial rules. Fifty answers, none of them federal. Not researched in this pass, and a single US entry here would be a guess wearing a citation.' },
    eu: { researched: false, why: 'Regulated at member-state level by each national bar; Directive 98/5/EC governs establishment, not website disclosure. No EU-wide website duty was found in this pass.' },
    ca: { researched: false, why: 'Regulated provincially by each law society. Not researched in this pass.' },
    au: { researched: false, why: 'Regulated under the Legal Profession Uniform Law in NSW/VIC and separately elsewhere. Not researched in this pass.' },
  },

  coverage: {
    uk: {
      whoRegulates: 'https://www.sra.org.uk/solicitors/standards-regulations/transparency-rules/',
      entryRestriction: 'https://www.legislation.gov.uk/ukpga/2007/29/section/12',
      websiteDuties: 'https://www.sra.org.uk/solicitors/standards-regulations/transparency-rules/',
      advertisingLimits: 'https://www.sra.org.uk/solicitors/standards-regulations/transparency-rules/',
      complaintsRoute: 'https://www.sra.org.uk/solicitors/standards-regulations/transparency-rules/',
    },
  },

  provenance: {
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: '2026-08-19',
    nextReview: '2027-02-19',
    sources: [
      {
        claim: 'SRA Transparency Rules 1.1, 1.5, 1.6, 2.1 and 4.1 — the price, complaints and identification duties, each of which names the firm\'s website as the place the duty is discharged.',
        url: 'https://www.sra.org.uk/solicitors/standards-regulations/transparency-rules/',
        accessed: '2026-08-19',
        class: 'regulator',
        quote: 'must display in a prominent place on its website',
      },
      {
        claim: 'Legal Services Act 2007 s.12 — the reserved legal activities. The scope question behind the `reserved-activity` confirm item: a business may lawfully do some of this work and not the rest, and its website is where the two get blurred.',
        url: 'https://www.legislation.gov.uk/ukpga/2007/29/section/12',
        accessed: '2026-08-19',
        class: 'primary',
      },
    ],
    caveats: [
      'The SRA rules bind SRA-authorised bodies. A firm regulated by the Council for Licensed Conveyancers, the Bar Standards Board or CILEX Regulation has a comparable but NOT identical rulebook, and this file checks for the wording of all four while citing only the SRA\'s. If the client is not SRA-authorised, read their own regulator\'s transparency rules before trusting these findings.',
      'An unregulated will-writing or paralegal business is not in this sector at all and these duties do not bind it. It has a different exposure — holding itself out as something it is not — which `legal/regulated-claim` catches and this file does not.',
      'Rule 1.6 says "clear and accessible and in a prominent place". Nothing here judges prominence. A costs page linked only from the footer satisfies this checker and may not satisfy the SRA.',
    ],
  },
};
