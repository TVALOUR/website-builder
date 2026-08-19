// website-builder — food businesses: restaurants, cafés, takeaways, bakeries,
// caterers, farm shops.
//
// The duty a brochure-site builder never sees coming: the moment the site can
// take an order, allergen information becomes a WEBSITE obligation, discharged
// before the purchase is concluded.
//
// Regulation (EU) No 1169/2011 Art.14(1)(a), retained in UK law:
//
//     "Mandatory food information… shall be available before the purchase is
//      concluded and shall appear on the material supporting the distance
//      selling or be provided through other appropriate means clearly
//      identified by the food business operator."
//
// Art.14(1)(b) adds that all mandatory particulars must also be available at
// delivery, and Art.14(2) carries the allergen particulars in Art.44 onto
// non-prepacked food sold at a distance. A takeaway menu with an order button
// and no allergen information is the ordinary case, and it is non-compliant.
//
// Note what this does NOT say. A restaurant site that only shows a menu and a
// phone number is not distance selling, and this file does not pretend it is —
// the duty is gated behind an ordering mechanism, which is a thing a static
// reader can actually see.
//
//   LAW LAST VERIFIED: 2026-08-19
//   NEXT REVIEW:       2027-02-19
//
// NOT LEGAL ADVICE, and not food-safety advice.

const ORDERING = /\b(?:order online|place (?:an )?order|add to (?:basket|cart|order)|checkout|order now|click and collect|order for (?:delivery|collection)|deliveroo|just ?eat|uber ?eats)\b/i;

export default {
  id: 'food-hospitality',
  name: 'Food business (restaurant, café, takeaway, bakery, caterer)',
  aliases: ['restaurant', 'cafe', 'takeaway', 'catering'],

  detect: {
    strong: [
      /\b(?:restaurant|takeaway|take[- ]away)\b/i,
      /\b(?:caf[ée]|coffee shop|tearooms?)\b/i,
      /\b(?:bakery|patisserie|delicatessen|farm shop)\b/i,
      /\b(?:catering|caterers?)\b/i,
      /\bour menu\b/i,
      /\bfood hygiene rating\b/i,
    ],
    weak: [
      /\bmenus?\b/i,
      /\bbooking|reservations?\b/i,
      /\bdishes?\b/i,
      /\bgluten[- ]free\b/i,
      /\bvegan options?\b/i,
    ],
    not: [
      // A food PHOTOGRAPHER, a hospitality recruiter or a commercial-kitchen
      // installer talks about menus and restaurants without being one.
      /\b(?:food photograph|hospitality recruitment|commercial kitchen (?:install|design|supplier))/i,
    ],
  },

  jurisdictions: {
    uk: {
      regulator: 'Food Standards Agency (policy) · the local authority (enforcement)',
      register: 'https://ratings.food.gov.uk/',

      duties: [
        {
          kind: 'present',
          what: 'allergen information, or a stated route to it, on a site that can take an order',
          pattern: /\ballergen|\ballergies\b|\bfood intolerance|\b14 (?:major )?allergens\b|\bcontains (?:gluten|nuts|milk|celery|sesame)\b/i,
          appliesIf: ORDERING,
          why: 'Regulation (EU) No 1169/2011 Art.14(1)(a) as retained: mandatory food information "shall be '
            + 'available before the purchase is concluded and shall appear on the material supporting the distance '
            + 'selling". Art.14(2) applies the Art.44 allergen particulars to non-prepacked food sold at a '
            + 'distance, and Art.14(1)(b) requires all mandatory particulars at the moment of delivery. This site '
            + 'can take an order, so the menu on it is "material supporting the distance selling". A phone number '
            + 'and a promise to ask staff satisfies the counter; it does not satisfy the website.',
        },
        {
          kind: 'absent',
          what: 'an unqualified allergen-free claim',
          pattern: /\b(?:100% |completely |totally |entirely )?(?:allergen[- ]free|nut[- ]free kitchen|gluten[- ]free kitchen|guaranteed (?:gluten|nut|dairy)[- ]free)\b/i,
          why: 'An absolute freedom-from claim is a statement about cross-contamination control across an entire '
            + 'kitchen, and it is the claim that ends up in court after an incident. Regulation 1169/2011 requires '
            + 'accuracy about allergens; the DMCC Act 2024 Part 4 reaches a misleading action about a product\'s '
            + 'main characteristics. The compliant phrasing names the dish, names the allergen, and states the '
            + 'cross-contamination position honestly — which is also what an allergic customer actually needs.',
        },
        {
          kind: 'sourcedNumber',
          what: 'a food hygiene rating',
          pattern: /\bfood hygiene rating\b[^.\n]{0,30}?\b([0-5])\b|\brated\s+([0-5])\s+(?:out of 5\s+)?(?:for|by)\s+food hygiene\b/gi,
          why: 'A hygiene rating is the local authority\'s finding, published on the FSA\'s own site, and it '
            + 'changes at the next inspection. A rating printed on a website with no sourced row is a regulatory '
            + 'score the business assigned itself. Source it from ratings.food.gov.uk and record the date.',
        },
      ],

      confirm: [
        {
          id: 'food-hospitality/uk/rating-display',
          what: 'Whether the business trades in Wales or Northern Ireland, where displaying the food hygiene rating is mandatory rather than voluntary.',
          why: 'Display of the FSA rating sticker is voluntary in England and COMPULSORY in Wales (Food Hygiene '
            + 'Rating (Wales) Act 2013) and Northern Ireland (Food Hygiene Rating Act (Northern Ireland) 2016). '
            + 'The website is not the sticker, and neither Act was read in full in this pass — so this is a '
            + 'question for the client\'s environmental health officer, not a gate.',
        },
        {
          id: 'food-hospitality/uk/pdf-menu',
          what: 'Whether the menu is a PDF or an image, in which case neither the allergen check above nor any accessibility gate in this repo has read it.',
          why: 'Most small food businesses publish the menu as a PDF exported from a design tool. Every text-based '
            + 'gate in this repo goes blind at that boundary, and so does a screen reader. If the menu is a PDF, '
            + 'the allergen finding above proves nothing either way, and the honest fix is an HTML menu.',
        },
      ],
    },

    eu: {
      regulator: 'National food authority of the member state (Regulation 1169/2011 is directly applicable)',
      register: null,
      duties: [
        {
          kind: 'present',
          what: 'allergen information, or a stated route to it, on a site that can take an order',
          pattern: /\ballerg|\bintoleran|\bAllergene\b|\ball[eè]rg[eè]ne/i,
          appliesIf: ORDERING,
          why: 'Regulation (EU) No 1169/2011 Art.14(1)(a) and Art.14(2) are directly applicable in every member '
            + 'state without transposition, so the distance-selling allergen duty is the same instrument here as '
            + 'in the UK entry. What differs is enforcement and any national measure under Art.44(2) extending the '
            + 'particulars — check the member state before assuming this is the whole duty.',
        },
      ],
      confirm: [
        {
          id: 'food-hospitality/eu/national-measures',
          what: 'Whether the member state has adopted national measures under Art.44(2) requiring more than allergen information for non-prepacked food.',
          why: 'Art.44(1)(b) lets member states require some or all of the Art.9 and Art.10 particulars for '
            + 'non-prepacked food, and several have. The EU floor in this file is a floor.',
        },
      ],
    },

    us: { researched: false, why: 'The FDA Food Code is a model adopted with variation by states and localities; menu labelling under 21 CFR 101.11 binds chains of 20 or more locations, which is not the business this repo builds for. The nine major food allergens under FALCPA apply to packaged food labels rather than restaurant websites. Not researched in this pass.' },
    ca: { researched: false, why: 'Safe Food for Canadians Regulations and provincial public-health rules. Not researched.' },
    au: { researched: false, why: 'FSANZ Food Standards Code Standard 1.2.3 and the Standard 3.2.2A food-safety requirements. Not researched.' },
  },

  coverage: {
    uk: {
      whoRegulates: 'https://www.legislation.gov.uk/uksi/2014/1855/regulation/5/made',
      entryRestriction: 'https://www.legislation.gov.uk/uksi/2014/1855/regulation/5/made',
      websiteDuties: 'https://www.legislation.gov.uk/eur/2011/1169/article/14',
      advertisingLimits: 'https://www.legislation.gov.uk/ukpga/2024/13/part/4',
      complaintsRoute: 'https://www.legislation.gov.uk/uksi/2014/1855/regulation/5/made',
    },
    eu: {
      whoRegulates: 'https://www.legislation.gov.uk/eur/2011/1169/article/14',
      entryRestriction: 'https://www.legislation.gov.uk/eur/2011/1169/article/14',
      websiteDuties: 'https://www.legislation.gov.uk/eur/2011/1169/article/14',
      advertisingLimits: 'https://www.legislation.gov.uk/eur/2011/1169/article/14',
      complaintsRoute: 'https://www.legislation.gov.uk/eur/2011/1169/article/14',
    },
  },

  provenance: {
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: '2026-08-19',
    nextReview: '2027-02-19',
    sources: [
      {
        claim: 'Regulation (EU) No 1169/2011 Art.14 — distance selling. Art.14(1)(a) puts mandatory food information on the material supporting the distance sale, before the purchase concludes; Art.14(1)(b) requires all mandatory particulars at delivery; Art.14(2) carries the Art.44 allergen particulars onto non-prepacked food sold at a distance.',
        url: 'https://www.legislation.gov.uk/eur/2011/1169/article/14',
        accessed: '2026-08-19',
        class: 'primary',
        quote: 'shall be available before the purchase is concluded and shall appear on the material supporting the distance selling',
      },
      {
        claim: 'Food Information Regulations 2014 reg.5 — the domestic provision for non-prepacked food, which permits allergen information to be given by any means including orally, and which EXPRESSLY EXCLUDES food offered by means of distance communication. That exclusion is why the website duty runs on Art.14 and not on reg.5, and getting it the other way round is the obvious mistake here.',
        url: 'https://www.legislation.gov.uk/uksi/2014/1855/regulation/5/made',
        accessed: '2026-08-19',
        class: 'primary',
        // The quote is paragraph (2), NOT paragraph (1). Paragraph (1) is the
        // permission everyone quotes; paragraph (2) is the exclusion that decides
        // the question, and the first draft of this row quoted (1) loosely enough
        // that the online check could not find the words at all. It failed as a
        // BLOCKER, which is the check working.
        quote: 'offered for sale to a final consumer or to a mass caterer otherwise than by means of distance communication',
      },
      {
        claim: 'DMCC Act 2024 Part 4 Chapter 1 — the unfair commercial practices regime reaching a misleading claim about a product\'s main characteristics, which is the route an unqualified "allergen-free" claim is enforced by outside food law.',
        url: 'https://www.legislation.gov.uk/ukpga/2024/13/part/4',
        accessed: '2026-08-19',
        class: 'primary',
      },
    ],
    caveats: [
      'The allergen duty here is gated on an ORDERING MECHANISM being visible in the markup. A site that takes orders through a third-party widget, an embedded iframe, a phone-only flow or a social-media link may still be distance selling and will not trigger this gate. The gate is a floor.',
      'Natasha\'s Law (the PPDS labelling requirement introduced by SI 2019/1218) is about LABELS on food packed for direct sale, not about websites, and is deliberately not encoded here. Mentioning it in a gate would be padding.',
      'Nothing here reads a PDF or an image menu, which is how most small food businesses publish. See the `pdf-menu` confirm item — on those sites this family has checked almost nothing, and says so.',
      'Scotland: the Food Information (Scotland) Regulations 2014 are the equivalent domestic instrument. This file cites the England one.',
    ],
  },
};
