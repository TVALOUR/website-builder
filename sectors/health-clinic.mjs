// website-builder — clinical practice: physiotherapy, podiatry, chiropody,
// dietetics, speech and language therapy, occupational therapy, and the rest of
// the HCPC-regulated list.
//
// This is the sector where a website can commit a criminal offence by using a
// word. Health Professions Order 2001 art.39 makes it an offence, with intent
// to deceive, to use a protected title one is not entitled to — and article 39
// is not limited to the noun: the HCPC's own position is that describing the
// SERVICE as "physiotherapy" can carry the same implication.
//
// A site builder that writes "physiotherapy in Barnstaple" as an <h1> for a
// sports-massage business has not made a copy error. It has published the
// representation the offence is about.
//
//   LAW LAST VERIFIED: 2026-08-19
//   NEXT REVIEW:       2027-02-19
//
// NOT LEGAL ADVICE, and emphatically not clinical advice.

export default {
  id: 'health-clinic',
  name: 'Clinical practice (physiotherapy, podiatry, and other HCPC-regulated professions)',
  aliases: ['physio', 'physiotherapy', 'podiatry', 'clinic'],

  detect: {
    strong: [
      /\bphysiotherap(?:y|ist|ists)\b/i,
      /\bpodiatr(?:y|ist|ists)\b/i,
      /\bchiropod(?:y|ist|ists)\b/i,
      /\bosteopath(?:y|s)?\b/i,
      /\bchiropract(?:ic|or|ors)\b/i,
      /\bdietitians?\b/i,
      /\bspeech and language therap/i,
      /\boccupational therap(?:y|ist)/i,
      /\bHCPC\b/,
    ],
    weak: [
      /\bclinic\b/i,
      /\bpatients?\b/i,
      /\btreatment plan\b/i,
      /\brehabilitation\b/i,
      /\bmusculoskeletal\b/i,
      /\bsports (?:injury|injuries|therapy)\b/i,
    ],
    not: [
      // Veterinary practice has its own file and its own statute. A vet clinic
      // matching "clinic" plus "treatment plan" must not pick up HCPC duties.
      /\bveterinar|\bequine (?:vet|clinic)\b/i,
    ],
  },

  jurisdictions: {
    uk: {
      regulator: 'Health and Care Professions Council',
      register: 'https://www.hcpc-uk.org/check-the-register/',

      duties: [
        {
          kind: 'present',
          what: 'the practitioner\'s HCPC (or GOsC / GCC) registration number',
          pattern: /\b(?:HCPC|GOsC|General Osteopathic Council|GCC|General Chiropractic Council)\b[^.\n]{0,50}?\b(?:[A-Z]{2}\d{5,6}|\d{5,7})\b|\bHCPC\s*(?:reg(?:istration|istered)?)?\s*(?:number|no\.?)\b/i,
          appliesIf: /\bphysiotherap|podiatr|chiropod|dietitian|speech and language therap|occupational therap|osteopath|chiropract/i,
          why: 'Health Professions Order 2001 art.39 makes it an offence, with intent to deceive, to falsely '
            + 'represent registration or to use a protected title one is not entitled to. The registration number '
            + 'is not itself mandated by the Order — no instrument found in this pass requires it on a website — '
            + 'but it is how a claim to the title stops being a bare assertion. A site that uses the title and '
            + 'publishes no number is asking a patient to take the one thing on trust that the regulator publishes '
            + 'a free register for. If the practitioner is not registered, the fix is the title, not the number.',
          wantsRegisterLink: true,
        },
        {
          kind: 'absent',
          what: 'a claim to cure, or a guaranteed clinical outcome',
          pattern: /\b(?:cures?|curing|guaranteed? (?:relief|results?|recovery|cure)|100% (?:success|effective)|eliminates? (?:your )?pain (?:completely|permanently|for good))\b/i,
          why: 'CAP Code rule 12.6: "Marketers should not falsely claim that a product is able to prevent or treat '
            + 'disease or a malformation; restore, correct or modify a physiological function." Rule 12.1 requires '
            + 'objective claims to be backed by evidence, "if relevant consisting of trials conducted on people", '
            + 'and rule 12.9 requires proof before suggesting a therapy is guaranteed to work. A cure claim on a '
            + 'clinic site is the most-upheld complaint category the ASA has, and the copy that produces it is '
            + 'exactly the reassuring register a language model writes by default.',
        },
        {
          kind: 'absent',
          what: 'a claim to treat a named serious condition',
          // Kept to the conditions CAP and the MHRA treat as the bright line.
          // A physiotherapist may lawfully TREAT a cancer patient; what rule
          // 12.2 is about is offering to treat the condition itself.
          pattern: /\b(?:treat|treating|treatment (?:for|of)|cure|help with)\s+(?:your\s+)?(?:cancer|tumours?|diabetes|multiple sclerosis|parkinson'?s|epilepsy|heart disease|stroke)\b/i,
          why: 'CAP Code rule 12.2: marketers must not offer specific advice on, diagnosis of or treatment for '
            + 'serious or prolonged conditions unless that advice is given under the supervision of a suitably '
            + 'qualified health professional — and a marketing page is not that supervision. Separately, '
            + 'Cancer Act 1939 s.4 prohibits advertisements offering to treat or cure cancer, an offence with no '
            + 'evidence defence. Describing rehabilitation support FOR people living with a condition is a '
            + 'different sentence from offering to treat the condition, and it is the sentence to write.',
        },
        {
          kind: 'sourcedNumber',
          what: 'an HCPC or professional-council registration number',
          pattern: /\b(?:HCPC|GOsC|GCC)\b[^.\n]{0,30}?\b([A-Z]{2}\d{5,6}|\d{5,7})\b/gi,
          why: 'A registration number is a factual claim about a live entry in a public register.',
        },
      ],

      confirm: [
        {
          id: 'health-clinic/uk/cqc-registration',
          what: 'Whether anything described on the site is a regulated activity requiring registration with the Care Quality Commission, and if so whether the CQC registration is named.',
          why: 'The Health and Social Care Act 2008 (Regulated Activities) Regulations 2014 make certain activities '
            + '— notably "treatment of disease, disorder or injury" — registrable, and a provider carrying one on '
            + 'unregistered commits an offence. Ordinary private physiotherapy is generally outside it; adding a '
            + 'doctor, injections or diagnostics can bring it inside. This is a scope question about what the '
            + 'clinic does, which no file can answer and which the client can, in one call to the CQC.',
        },
        {
          id: 'health-clinic/uk/patient-data',
          what: 'Whether any form on the site collects health information, and if so whether the privacy notice names the Article 9 condition relied on.',
          why: 'Health data is special category data under UK GDPR Art.9. A contact form asking "what is the '
            + 'problem?" collects it, and the generic privacy notice this repo ships does not cover it. `legal/'
            + 'privacy-policy` checks that a notice exists and what it mentions; it cannot tell that the form '
            + 'above it turned an ordinary enquiry into a special-category one.',
        },
      ],
    },

    us: { researched: false, why: 'Physical therapy is licensed state by state, and the advertising rules sit in each state board\'s practice act. Federally, the FTC Act s.5 reaches deceptive health claims and the FDA reaches disease claims about products — neither is a website-disclosure duty. Not researched in this pass.' },
    au: { researched: false, why: 'AHPRA registers physiotherapists, osteopaths and chiropractors nationally, and National Law s.133 restricts advertising of regulated health services — including a ban on testimonials, which is unusual and would materially change this file. Genuinely worth researching; not done in this pass, and an entry written from memory would be exactly the confident guess this repo exists to stop.' },
    ca: { researched: false, why: 'Provincial colleges regulate title and advertising. Not researched in this pass.' },
    eu: { researched: false, why: 'Member-state level. Not researched in this pass.' },
  },

  coverage: {
    uk: {
      whoRegulates: 'https://www.hcpc-uk.org/check-the-register/',
      entryRestriction: 'https://www.legislation.gov.uk/uksi/2002/254/article/39',
      websiteDuties: 'https://www.legislation.gov.uk/uksi/2002/254/article/39',
      advertisingLimits: 'https://www.asa.org.uk/type/non_broadcast/code_section/12.html',
      complaintsRoute: 'https://www.hcpc-uk.org/check-the-register/',
    },
  },

  provenance: {
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: '2026-08-19',
    nextReview: '2027-02-19',
    sources: [
      {
        claim: 'Health Professions Order 2001 art.39 — the protected-title offence. A person commits an offence if, with intent to deceive, they falsely represent registration or use a protected title to which they are not entitled.',
        url: 'https://www.legislation.gov.uk/uksi/2002/254/article/39',
        accessed: '2026-08-19',
        class: 'primary',
        quote: 'uses a title referred to in article 6(2) to which he is not entitled',
      },
      {
        claim: 'CAP Code section 12 — medicines, medical devices, health and beauty products and therapies. Rules 12.1 (evidence), 12.2 (serious conditions and supervision), 12.6 (no false prevention or treatment claims) and 12.9 (no guaranteed efficacy).',
        url: 'https://www.asa.org.uk/type/non_broadcast/code_section/12.html',
        accessed: '2026-08-19',
        class: 'regulator',
        quote: 'Marketers should not falsely claim that a product is able to prevent or treat disease',
      },
      {
        claim: 'The HCPC register — the free public register a visitor uses to check a registration number, and the reason a published number is checkable rather than merely asserted.',
        url: 'https://www.hcpc-uk.org/check-the-register/',
        accessed: '2026-08-19',
        class: 'regulator',
      },
      {
        claim: 'Cancer Act 1939 s.4 — the prohibition on advertisements offering to treat or cure cancer. Cited because it is the one health-claim offence with no evidence defence, and because it reaches an ordinary clinic\'s website.',
        url: 'https://www.legislation.gov.uk/ukpga/Geo6/2-3/13/section/4',
        accessed: '2026-08-19',
        class: 'primary',
        quote: 'containing an offer to treat any person for cancer, or to prescribe any remedy therefor',
      },
    ],
    caveats: [
      'Osteopaths and chiropractors are NOT HCPC-registered — they have their own statutory regulators (the General Osteopathic Council under the Osteopaths Act 1993 and the General Chiropractic Council under the Chiropractors Act 1994) with their own title offences. This file detects them and checks for a registration number, and cites the HCPC instrument. Read their own regulator before relying on the wording.',
      'Sports massage, sports therapy and personal training are NOT regulated titles in the UK. A site for one of those is not in this sector, and the risk runs the other way: describing the work as "physiotherapy" is the offence art.39 is about.',
      'The CAP Code is enforced by the ASA, whose sanctions are non-statutory in the first instance and referable to Trading Standards under the DMCC Act 2024. A CAP breach is not automatically an offence; it is a finding against the advertiser, published under their name.',
      'Nothing here reads the clinic\'s scope of practice, insurance or CQC position. Those are the three questions a competent human asks first, and they are all in the confirm list rather than the gates because that is where they honestly belong.',
    ],
  },
};
