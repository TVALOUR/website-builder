// website-builder — aesthetics and cosmetic injectables.
//
// The finding nobody expects, and the one that will surprise a client most:
// **in the UK it is unlawful to advertise Botox to the public at all.** Not
// "advertise it carefully". Not "with a disclaimer". At all.
//
// Botulinum toxin is a prescription only medicine, and Human Medicines
// Regulations 2012 reg.284(1) says, in one line:
//
//     "A person may not publish an advertisement that is likely to lead to the
//      use of a prescription only medicine."
//
// The MHRA and the ASA have both read that as covering a clinic's own website
// naming the treatment, and "Botox from £180" is the exact shape of the
// advertisement the regulation describes. A price list is the strongest possible
// inducement to use.
//
// Every AI site builder ships this page. It is on the client's brief, it reads
// as an ordinary service, and the copy writes itself. That is precisely why it
// belongs in a gate rather than in a paragraph somebody might read.
//
//   LAW LAST VERIFIED: 2026-08-19
//   NEXT REVIEW:       2027-02-19
//
// NOT LEGAL ADVICE. Nobody qualified has read this, and a clinic should take
// its own before publishing anything in this area.

export default {
  id: 'aesthetics-clinic',
  name: 'Aesthetics and cosmetic injectables',
  aliases: ['aesthetics', 'cosmetic-clinic', 'medspa'],

  detect: {
    strong: [
      /\bbotox\b/i,
      /\bbotulinum\b/i,
      /\bdermal fillers?\b/i,
      /\blip fillers?\b/i,
      /\banti[- ]wrinkle injections?\b/i,
      /\baesthetics? clinic\b/i,
      /\bnon[- ]surgical cosmetic\b/i,
    ],
    weak: [
      /\bskin (?:clinic|rejuvenation)\b/i,
      /\bmicroneedling\b/i,
      /\bchemical peels?\b/i,
      /\bprofhilo\b/i,
      /\bpractitioner\b/i,
    ],
    not: [],
  },

  jurisdictions: {
    uk: {
      regulator: 'Medicines and Healthcare products Regulatory Agency (medicines advertising) · Advertising Standards Authority (the CAP Code)',
      register: 'https://www.gov.uk/government/organisations/medicines-and-healthcare-products-regulatory-agency',

      duties: [
        {
          kind: 'absent',
          what: 'a prescription only medicine advertised to the public by brand or generic name',
          // Deliberately the names, not the category. "Anti-wrinkle treatment"
          // without naming the medicine is the lawful formulation the industry
          // actually uses, and a gate that blocked it would be blocking the fix.
          pattern: /\b(?:botox|bocouture|azzalure|dysport|xeomin|botulinum toxin|vistabel)\b/i,
          why: 'Human Medicines Regulations 2012 reg.284(1): "A person may not publish an advertisement that is '
            + 'likely to lead to the use of a prescription only medicine." Botulinum toxin products are '
            + 'prescription only. Naming one on a public web page — and above all listing a price for it — is the '
            + 'advertisement the regulation prohibits, and both the MHRA and the ASA enforce it against clinic '
            + 'websites. THE FIX IS NOT A DISCLAIMER. It is to stop naming the medicine: describe the consultation, '
            + 'the practitioner and the assessment, and let the prescriber name the product in the room. That is '
            + 'the wording compliant clinics use, and it is better copy anyway.',
        },
        {
          kind: 'absent',
          what: 'a price attached to a prescription only treatment',
          pattern: /\b(?:botox|bocouture|azzalure|dysport|xeomin|botulinum)\b[^.\n]{0,60}?(?:£\s?\d|from\s+£)/i,
          why: 'Same instrument, aggravated. A price is the clearest inducement to use there is, and a priced '
            + 'listing removes any argument that the page was informational rather than promotional. Raised '
            + 'separately from the naming finding because it is the version that gets enforced.',
        },
        {
          kind: 'absent',
          what: 'a cosmetic procedure advertised with a time-limited discount or offer',
          pattern: /\b(?:\d{1,2}%\s*off|special offer|limited time|book now and save|flash sale|black friday)\b[^.\n]{0,80}?\b(?:filler|injectable|aesthetic|treatment|botox|lip)\b|\b(?:filler|injectable|lip filler|anti[- ]wrinkle)\b[^.\n]{0,80}?\b(?:\d{1,2}%\s*off|special offer|limited time)\b/i,
          why: 'CAP Code rule 12.9 requires proof before suggesting a therapy is guaranteed to work, and the wider '
            + 'concern the ASA has repeatedly upheld in this sector is promotional pressure on an irreversible '
            + 'medical decision. A countdown or a discount on an injectable is the practice both the ASA and the '
            + 'MHRA name in their own guidance to this industry. If the clinic runs offers, run them on the '
            + 'non-medical services.',
        },
        {
          kind: 'absent',
          what: 'a before-and-after image described in the copy for an injectable treatment',
          pattern: /\bbefore\s*(?:and|&|\/)\s*after\b[^.\n]{0,60}?\b(?:botox|filler|injectable|anti[- ]wrinkle|lip)\b|\b(?:botox|filler|injectable|lip filler)\b[^.\n]{0,60}?\bbefore\s*(?:and|&|\/)\s*after\b/i,
          why: 'A before-and-after for a prescription only medicine is an advertisement for it under reg.284(1), '
            + 'and for any cosmetic procedure CAP rule 12.1 requires the claim it makes to be evidenced. This gate '
            + 'reads the COPY, not the images — it cannot see a gallery with no words around it, and that gap is '
            + 'stated rather than papered over. Where before-and-afters are used lawfully at all, it is in a '
            + 'consultation, not on a public page.',
        },
      ],

      confirm: [
        {
          id: 'aesthetics-clinic/uk/prescriber',
          what: 'Who the prescriber is, whether they see the patient in person before prescribing, and whether the site\'s wording implies anyone else can authorise the treatment.',
          why: 'A prescription only medicine must be prescribed by an appropriate practitioner following an '
            + 'assessment of the individual patient. The GMC, NMC and GPhC have all taken the position that remote '
            + 'prescribing of botulinum toxin is not acceptable practice. A page that reads as though the '
            + 'injector prescribes, when they do not, misrepresents the most important fact about the service.',
        },
        {
          id: 'aesthetics-clinic/uk/local-licensing',
          what: 'Whether the local authority requires a licence or registration for the procedures offered, and whether England\'s cosmetic-procedures licensing scheme has commenced by the time this site ships.',
          why: 'Health and Care Act 2022 s.180 gives the Secretary of State power to make a licensing scheme for '
            + 'non-surgical cosmetic procedures in England. Commencement has moved more than once, and a site that '
            + 'ships into a live scheme without a licence number is exposed on a duty that did not exist when the '
            + 'copy was written. Check the current position; do not trust this file\'s date.',
        },
      ],
    },

    us: { researched: false, why: 'The FDA restricts prescription-drug advertising but permits direct-to-consumer promotion subject to fair-balance and risk-disclosure rules — the opposite default from the UK\'s outright prohibition, which makes this the single worst sector to generalise across jurisdictions. State medical boards add corporate-practice and supervision rules. Not researched in this pass, and the UK rule must not be applied to a US site.' },
    eu: { researched: false, why: 'Directive 2001/83/EC Art.88(1) prohibits advertising to the general public of medicinal products available on prescription only — structurally the same rule the UK inherited — but transposition, enforcement and the treatment of clinic websites differ by member state. Not researched in this pass.' },
    ca: { researched: false, why: 'Food and Drugs Act s.3 and Schedule A restrict advertising of treatments for listed diseases; prescription-drug advertising to the public is limited to name, price and quantity. Not researched in this pass.' },
    au: { researched: false, why: 'The Therapeutic Goods Act 1989 prohibits advertising prescription medicines to the public, and AHPRA additionally bans testimonials for regulated health services. Structurally close to the UK. Not researched in this pass.' },
  },

  coverage: {
    uk: {
      whoRegulates: null,
      whoRegulatesWhy: 'No single regulator. The MHRA enforces medicines advertising, the ASA enforces the CAP Code, and local authorities license some procedures. No instrument naming a regulator for this trade as a trade was found.',
      entryRestriction: null,
      entryRestrictionWhy: 'There is no protected title or licence for a non-medical injector in the UK today. The restriction is on PRESCRIBING the medicine, not on injecting it, and whether the Health and Care Act 2022 s.180 licensing scheme for England has commenced was not confirmed in this pass.',
      websiteDuties: 'https://www.legislation.gov.uk/uksi/2012/1916/regulation/284/made',
      advertisingLimits: 'https://www.legislation.gov.uk/uksi/2012/1916/regulation/280/made',
      complaintsRoute: 'https://www.asa.org.uk/type/non_broadcast/code_section/12.html',
    },
  },

  provenance: {
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: '2026-08-19',
    nextReview: '2027-02-19',
    sources: [
      {
        claim: 'Human Medicines Regulations 2012 reg.284(1) — the prohibition on publishing an advertisement likely to lead to the use of a prescription only medicine. This is the whole basis of this file, and it is one sentence long.',
        url: 'https://www.legislation.gov.uk/uksi/2012/1916/regulation/284/made',
        accessed: '2026-08-19',
        class: 'primary',
        quote: 'A person may not publish an advertisement that is likely to lead to the use of a prescription only medicine',
      },
      {
        claim: 'Human Medicines Regulations 2012 reg.280 — the general principles for advertising a medicinal product: it must comply with the summary of product characteristics, encourage rational use by presenting the product objectively and without exaggerating its properties, and must not be misleading.',
        url: 'https://www.legislation.gov.uk/uksi/2012/1916/regulation/280/made',
        accessed: '2026-08-19',
        class: 'primary',
        quote: 'may not publish an advertisement for a medicinal product',
      },
      {
        claim: 'CAP Code section 12 — the advertising code the ASA enforces against clinic websites in this sector, including rule 12.1 on evidence and 12.9 on guaranteed efficacy.',
        url: 'https://www.asa.org.uk/type/non_broadcast/code_section/12.html',
        accessed: '2026-08-19',
        class: 'regulator',
        quote: 'Objective claims must be backed by evidence',
      },
    ],
    caveats: [
      'This file reads TEXT. An image of a price list, a gallery with no captions, or a social embed showing the same content is invisible to it, and all three are how this material actually reaches the page. The gate is a floor, not a sweep.',
      'The prohibition is on advertising the MEDICINE. Advertising the consultation, the practitioner\'s qualifications and the assessment process is lawful and is what compliant clinics do. If removing these findings makes the page vague, the answer is more detail about the clinic, not the medicine\'s name back in.',
      'Dermal fillers are, for the most part, NOT prescription only medicines — they are medical devices, and reg.284 does not reach them. The patterns here deliberately treat filler copy more lightly than botulinum copy for that reason. The offer and before-and-after findings still apply to both, on CAP grounds rather than medicines grounds.',
      'The UK position is close to the opposite of the US one. Do not carry any of this to a `us` build; the `us` entry in this file is deliberately unresearched rather than adapted.',
    ],
  },
};
