// website-builder — veterinary practice.
//
// A short file, because the duty is short and inventing more would be padding.
//
// Veterinary Surgeons Act 1966 s.19:
//
//     "No individual shall practise, or hold himself out as practising or as
//      being prepared to practise, veterinary surgery unless he is registered
//      in the register of veterinary surgeons or the supplementary veterinary
//      register."
//
// Read the middle clause. "Hold himself out as… being prepared to practise" is
// a description of a website. This is one of the few statutes where publishing
// the page IS the regulated act, which is why an unregistered animal-therapy
// business describing its work in clinical terms is exposed by its own homepage.
//
//   LAW LAST VERIFIED: 2026-08-19
//   NEXT REVIEW:       2027-02-19
//
// NOT LEGAL ADVICE, and not veterinary advice.

export default {
  id: 'veterinary',
  name: 'Veterinary practice and animal treatment',
  aliases: ['vet', 'vets', 'veterinary-surgery'],

  detect: {
    strong: [
      /\bveterinary (?:surgery|surgeons?|practice|clinic|hospital)\b/i,
      /\bvets?\b(?=\s|,|\.|$)/i,
      /\bMRCVS\b/,
      /\bRCVS\b/,
      /\bequine vet/i,
    ],
    weak: [
      /\bpets?\b/i,
      /\bvaccinations?\b/i,
      /\bneutering\b/i,
      /\bmicrochipping\b/i,
      /\banimals?\b/i,
      /\bfarm animals?\b/i,
    ],
    not: [
      // Groomers, kennels, pet shops and animal physiotherapists are NOT in
      // this sector, and sweeping them in would be the exact over-reach s.19
      // itself is careful about.
      /\b(?:dog groom|cattery|kennels|pet (?:shop|sitting|food)|dog walk)/i,
    ],
  },

  jurisdictions: {
    uk: {
      regulator: 'Royal College of Veterinary Surgeons',
      register: 'https://www.rcvs.org.uk/check-the-register/',

      duties: [
        {
          kind: 'present',
          what: 'the surgeon\'s RCVS registration, or the practice\'s RCVS Practice Standards status',
          pattern: /\b(?:MRCVS|RCVS|Royal College of Veterinary Surgeons|Practice Standards Scheme)\b/i,
          appliesIf: /\bveterinary (?:surgery|surgeons?|practice|clinic|hospital)\b|\bvets?\b/i,
          why: 'Veterinary Surgeons Act 1966 s.19 restricts practising — and holding oneself out as prepared to '
            + 'practise — veterinary surgery to those on the register. No instrument found in this pass requires '
            + 'the registration to appear on a website. What it does mean is that a site describing veterinary '
            + 'work is itself the holding-out, so the registration is the fact the whole page rests on, and a '
            + 'page that never mentions it is a page that never states its own basis.',
          wantsRegisterLink: true,
        },
        {
          kind: 'absent',
          what: 'veterinary treatment offered by a business that is not a veterinary practice',
          // Fires only when the site both offers a clinical act AND says it is
          // not a vet, which is the specific dangerous shape: a therapy or
          // grooming business describing regulated acts.
          pattern: /\b(?:not a (?:vet|veterinary (?:surgeon|practice))|non[- ]veterinary|we are not vets)\b[^.]{0,200}?\b(?:diagnos|prescrib|treat(?:ment)? of|surger|operat|vaccinat)/i,
          why: 'Diagnosis, prescription, surgery and vaccination are veterinary surgery within s.27 of the Act, and '
            + 'may not be carried on by an unregistered person. Schedule 3 permits some acts by others — a '
            + 'veterinary nurse under direction, an owner treating their own animal, listed minor treatments — but '
            + 'a business that states it is not a vet and then describes diagnosing or prescribing has written the '
            + 'offence onto its own page. If Schedule 3 covers what the business actually does, say which limb of '
            + 'it does, in the copy.',
        },
      ],

      confirm: [
        {
          id: 'veterinary/uk/24-hour-cover',
          what: 'What the site says about out-of-hours and emergency cover, and whether that matches the arrangement actually in place.',
          why: 'The RCVS Code of Professional Conduct requires practices to make provision for 24-hour emergency '
            + 'cover, and the public-facing statement of who to ring at 3am is the part clients rely on and the '
            + 'part websites get wrong after a provider changes. This is a facts question with a welfare '
            + 'consequence, which is a combination worth a human reading it back.',
        },
        {
          id: 'veterinary/uk/pom-v-advertising',
          what: 'Whether any medicine named on the site is POM-V, and if so whether naming it to the public is permitted.',
          why: 'The Veterinary Medicines Regulations restrict advertising of POM-V products to the public in terms '
            + 'close to the human-medicines rule that makes advertising Botox unlawful — see sectors/'
            + 'aesthetics-clinic.mjs, which encodes the human-side version with a citation. The veterinary side '
            + 'was NOT researched to the same depth in this pass, so it is a question here rather than a gate.',
        },
      ],
    },

    us: { researched: false, why: 'State veterinary practice acts and state boards; title and practice restrictions vary. Not researched in this pass.' },
    eu: { researched: false, why: 'Directive 2005/36/EC governs recognition of veterinary qualifications; practice restriction is national. Not researched.' },
    ca: { researched: false, why: 'Provincial veterinary medical associations. Not researched.' },
    au: { researched: false, why: 'State veterinary practitioners boards. Not researched.' },
  },

  coverage: {
    uk: {
      whoRegulates: 'https://www.legislation.gov.uk/ukpga/1966/36/section/19',
      entryRestriction: 'https://www.legislation.gov.uk/ukpga/1966/36/section/19',
      websiteDuties: 'https://www.legislation.gov.uk/ukpga/1966/36/section/19',
      advertisingLimits: 'https://www.legislation.gov.uk/ukpga/2024/13/part/4',
      complaintsRoute: 'https://www.legislation.gov.uk/ukpga/1966/36/section/19',
    },
  },

  provenance: {
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: '2026-08-19',
    nextReview: '2027-02-19',
    sources: [
      {
        claim: 'Veterinary Surgeons Act 1966 s.19 — restriction on the practice of veterinary surgery by unqualified persons, including the "hold himself out as… being prepared to practise" limb that a website engages directly. Schedule 3 carries the exemptions.',
        url: 'https://www.legislation.gov.uk/ukpga/1966/36/section/19',
        accessed: '2026-08-19',
        class: 'primary',
        quote: 'No individual shall practise, or hold himself out as practising or as being prepared to practise, veterinary surgery',
      },
      {
        claim: 'DMCC Act 2024 Part 4 Chapter 1 — the unfair commercial practices regime, cited for the advertisingLimits question because no veterinary-specific advertising instrument was read to a citable standard in this pass. Naming it rather than leaving the question blank is the point of the coverage map.',
        url: 'https://www.legislation.gov.uk/ukpga/2024/13/part/4',
        accessed: '2026-08-19',
        class: 'primary',
      },
    ],
    caveats: [
      'THIS IS THE THINNEST SECTOR FILE IN THE REPO and it is thin on purpose. One statute was read properly; the RCVS Code of Professional Conduct and the Veterinary Medicines Regulations were not. Both are named in the confirm list rather than encoded, because a gate written from a summary is a gate that will be confidently wrong.',
      'Animal physiotherapists, hydrotherapists, farriers and behaviourists are NOT in this sector. Farriery has its own statute (the Farriers (Registration) Act 1975) and is not encoded anywhere in this repo — which is a gap worth naming given that the reference fixture shipping with the repo is a farriery site.',
      'The `absent` duty here is written narrowly enough that it will miss the common case: a business that describes clinical acts and never says it is not a vet. Widening it would mean flagging every veterinary practice for describing veterinary work, which is worse. This limitation is real and is stated rather than hidden.',
    ],
  },
};
