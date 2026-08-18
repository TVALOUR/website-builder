// website-builder — Canada profile.
//
// NOT LEGAL ADVICE. This encodes what a competent web developer should ship by
// default so a small Canadian business is not obviously exposed. A regulated
// trade, a federally regulated business, or a business with real e-commerce
// has more obligations than any static checker can know about, and the gate
// says so rather than implying a green run means "compliant".
//
//   LAW LAST VERIFIED: 2026-08-18
//   NEXT REVIEW:       2027-02-18
//
// Follow uk.mjs's discipline: every citation below carries a URL that was
// actually fetched (or, where marked, retrieved via a search-engine snippet
// quoting the real page — see profiles/_research/ca.md for which is which)
// on the date above. Where a fact could not be pinned to a primary source in
// the time available, it is marked UNCONFIRMED rather than asserted. A
// confident wrong citation is the exact failure this repo exists to prevent
// (see uk.mjs's header — three revoked/rewritten UK citations sat undetected
// because nothing recorded a verification date).
//
// SCHEMA NOTE: this file follows the split described in profiles/_base.mjs —
// the universal nonEssentialScripts, consentBeforeLoad and claimPatterns live
// there, and a country profile supplies only consentModel, pages, disclosure
// and claimCitations. checks/lib/profile.mjs merges the two, and CI exercises
// this profile on every push.
//
// (An earlier version of this comment said the loader did not merge, so this
// file "will therefore throw". That was true when it was written and was fixed
// the same day, and it sat here afterwards asserting a defect that no longer
// existed — inside a caveat list the report prints to clients. Nothing re-reads
// a profile's prose when the code changes. If you edit the loader, grep the
// profiles for claims about it.)

export default {
  id: 'ca',
  name: 'Canada (PIPEDA · Quebec Law 25 · Competition Act · ACA/AODA)',
  country: 'Canada',
  iso2: 'CA',

  provenance: {
    status: 'researched', // machine-assembled from primary sources, NOT reviewed by a lawyer
    verifiedBy: null,
    lawLastVerified: '2026-08-18',
    nextReview: '2027-02-18',

    sources: [
      // ---------------------------------------------------------------- primary
      //
      // Added 2026-08-19 in the re-sourcing pass. Before it this profile was 36%
      // primary-or-regulator and the rest law-firm client alerts, and that base
      // rate had already produced one flatly wrong citation (the repealed
      // greenwashing wording) and, it turned out, two more: a Law 25 scope claim
      // the Act does not make, and an accessibility answer that omitted the only
      // route that reaches a small business.
      //
      // Every row below carries `quote` — the source's own words, checked by
      // `node checks/citations.mjs --online`. That is what makes a repeal
      // detectable instead of invisible.

      { claim: 'PIPEDA s.2(1) — "commercial activity" is defined by the character of the conduct. There is no size, revenue or employee threshold anywhere in the Act.',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/P-8.6/FullText.html', accessed: '2026-08-19', class: 'primary',
        quote: 'commercial activity means any particular transaction, act or conduct or any regular course of conduct that is of a commercial character' },
      { claim: 'PIPEDA s.4(1)(a) — the Part applies to every organization in respect of personal information it collects, uses or discloses in the course of commercial activities.',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/P-8.6/page-1.html', accessed: '2026-08-19', class: 'primary',
        quote: 'This Part applies to every organization in respect of personal information that' },
      { claim: 'PIPEDA Schedule 1 cl.4.8.1 (Openness) — the duty that makes a published privacy notice the practical answer.',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/P-8.6/page-7.html', accessed: '2026-08-19', class: 'primary',
        quote: 'Organizations shall be open about their policies and practices with respect to the management of personal information' },
      { claim: 'PIPEDA Schedule 1 cl.4.1.2 — the accountable individual must be identifiable ON REQUEST. This is the baseline Quebec s.3.1 goes beyond, and the difference is why the profile treats a named privacy contact as a Quebec obligation rather than a federal one.',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/P-8.6/page-7.html', accessed: '2026-08-19', class: 'primary',
        quote: 'shall be made known upon request' },
      { claim: 'PIPEDA s.10.1(1) — breach reporting on a real-risk-of-significant-harm threshold.',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/P-8.6/FullText.html', accessed: '2026-08-19', class: 'primary',
        quote: 'if it is reasonable in the circumstances to believe that the breach creates a real risk of significant harm to an individual' },

      { claim: 'Competition Act s.52(1) — criminal false or misleading representations, made knowingly or recklessly, to promote a product or any business interest.',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/C-34/section-52.html', accessed: '2026-08-19', class: 'primary',
        quote: 'knowingly or recklessly make a representation to the public that is false or misleading in a material respect' },
      { claim: 'Competition Act s.74.01(1)(a) — civil reviewable conduct: a representation to the public that is false or misleading in a material respect. This is the statute behind every claim gate in this profile.',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/C-34/section-74.01.html', accessed: '2026-08-19', class: 'primary',
        quote: 'makes a representation to the public that is false or misleading in a material respect' },
      { claim: 'Competition Act s.74.01(1)(b.2) as it now reads — the reverse-onus environmental-claim provision. The phrase "internationally recognized methodology" is GONE, struck by 2026, c.3, s.597; the page\'s own amendment history records the 2026 amendment.',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/C-34/section-74.01.html', accessed: '2026-08-19', class: 'primary',
        quote: 'is not based on adequate and proper substantiation, the proof of which lies on the person making the representation' },
      { claim: 'Competition Act s.103.1(6.2) — private access does not reach a 74.01(1)(b.2) application. Added by 2026, c.3, s.598.',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/C-34/section-103.1.html', accessed: '2026-08-19', class: 'primary',
        quote: 'the Tribunal is not to consider an application for leave' },

      { claim: 'CASL s.6(1) — the prohibition is on SENDING a commercial electronic message to an electronic address. Publishing a web page is not sending, and a website is not an electronic address (s.1(1)).',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/E-1.6/FullText.html', accessed: '2026-08-19', class: 'primary',
        quote: 'It is prohibited to send or cause or permit to be sent to an electronic address a commercial electronic message' },

      { claim: 'Quebec P-39.1 s.1 — the Act\'s SCOPE provision. It binds a person who collects, holds, uses or communicates personal information in the course of carrying on an enterprise. It contains no test based on where the individual is: the words "resident" and "located in" do not appear in the Act at all.',
        url: 'https://www.legisquebec.gouv.qc.ca/en/document/cs/p-39.1', accessed: '2026-08-19', class: 'primary',
        quote: 'in the course of carrying on an enterprise within the meaning of article 1525 of the Civil Code' },
      { claim: 'Quebec P-39.1 s.3.1 — the person in charge of the protection of personal information, and the duty to publish their title and contact information ON THE WEBSITE. This one is unusually direct: the statute names the website.',
        url: 'https://www.legisquebec.gouv.qc.ca/en/document/cs/p-39.1', accessed: '2026-08-19', class: 'primary',
        quote: 'must be published on the enterprise' },
      { claim: 'Quebec P-39.1 s.8.1 — technology that identifies, locates or profiles. Read the verb: the duty is to INFORM, of the use and of the means available to activate. It is not written as a consent provision, and the off-by-default reading is an inference from "activate", not a phrase in the Act.',
        url: 'https://www.legisquebec.gouv.qc.ca/en/document/cs/p-39.1', accessed: '2026-08-19', class: 'primary',
        quote: 'must first inform the person' },
      { claim: 'Quebec P-39.1 s.27 — the portability right: computerized personal information collected from the applicant, communicated in a structured, commonly used technological format on request.',
        url: 'https://www.legisquebec.gouv.qc.ca/en/document/cs/p-39.1', accessed: '2026-08-19', class: 'primary',
        quote: 'in a structured, commonly used technological format' },
      { claim: 'Charter of the French Language s.52 — the website duty. "Regardless of the medium used" is in the SECTION ITSELF, put there by 2022, c.14, s.44 (Bill 96); it is not a later regulation, and the profile said it was.',
        url: 'https://www.legisquebec.gouv.qc.ca/en/document/cs/c-11', accessed: '2026-08-19', class: 'primary',
        quote: 'Regardless of the medium used, catalogues, brochures, folders, commercial directories, order forms and any other documents of the same nature that are available to the public must be drawn up in French' },

      { claim: 'Accessible Canada Act s.7(1) — the Act reaches the federal public sector and businesses within the legislative authority of Parliament. An ordinary provincially-regulated small business is outside it.',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/A-0.6/page-1.html', accessed: '2026-08-19', class: 'primary',
        quote: 'that is within the legislative authority of Parliament' },
      { claim: 'Ontario O. Reg. 191/11 s.14(2) — the WCAG duty binds designated public sector organizations and LARGE organizations only.',
        url: 'https://www.ontario.ca/laws/regulation/110191', accessed: '2026-08-19', class: 'primary',
        quote: 'Designated public sector organizations and large organizations shall make their internet websites and web content conform' },
      { claim: 'Ontario O. Reg. 191/11 s.2 — "large organization" is 50 or more employees in Ontario, so a business under that has no s.14 duty.',
        url: 'https://www.ontario.ca/laws/regulation/110191', accessed: '2026-08-19', class: 'primary',
        quote: 'large organization” means an organization with 50 or more employees in Ontario' },
      { claim: 'Canadian Human Rights Act s.5 — discrimination in the provision of services customarily available to the general public. THE ROUTE THIS PROFILE PREVIOUSLY OMITTED: the accessibility answer is not exhausted by the ACA and the AODA.',
        url: 'https://laws-lois.justice.gc.ca/eng/acts/h-6/section-5.html', accessed: '2026-08-19', class: 'primary',
        quote: 'It is a discriminatory practice in the provision of goods, services, facilities or accommodation customarily available to the general public' },
      { claim: 'Ontario Human Rights Code s.1 — the provincial equivalent, naming disability expressly. Every province has one; Ontario is the worked example, not the only one.',
        url: 'https://www.ontario.ca/laws/statute/90h19', accessed: '2026-08-19', class: 'primary',
        quote: 'Every person has a right to equal treatment with respect to services, goods and facilities, without discrimination because of' },

      // -------------------------------------------------------------- secondary
      //
      // Kept, not deleted. Commencement timetables, "has a Bill been introduced
      // yet", and enforcement posture genuinely have no primary source, and a
      // profile that pretended otherwise would be worse than one that counts them.
      { claim: 'Bill C-27 (which carried the Consumer Privacy Protection Act) died when Parliament was prorogued 6 January 2025; PIPEDA remains the operative federal private-sector privacy statute; as of this article, no successor bill has been reintroduced under a confirmed number', url: 'https://gowlingwlg.com/en/insights-resources/articles/2025/federal-privacy-reform', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'PIPEDA current landing page — confirms the 10 fair information principles (accountability, identifying purposes, consent, limiting collection, limiting use/disclosure/retention, accuracy, safeguards, openness, individual access, challenging compliance) are still the live framework', url: 'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/', accessed: '2026-08-18', class: 'regulator' },
      { claim: '"Commercial activity" under PIPEDA s.2(1) turns on the nature of the activity, not the size, revenue, or for-profit status of the organization — no small-business or revenue-threshold exemption exists', url: 'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda-compliance-help/pipeda-interpretation-bulletins/interpretations_03_ca/', accessed: '2026-08-18', class: 'regulator' },
      { claim: 'Alberta PIPA and BC PIPA (and Quebec\'s private-sector Act) are designated "substantially similar" to PIPEDA; the designation exempts in-province activity from PIPEDA but PIPEDA still applies to interprovincial/cross-border transfers and to federally regulated businesses regardless of province', url: 'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/prov-pipeda/', accessed: '2026-08-18', class: 'regulator' },
      { claim: 'PIPEDA consent must be express when information is sensitive or the use falls outside reasonable expectations; implied consent (opt-out) can be acceptable for less-sensitive information with clear notice — retrieved via search snippet quoting the OPC\'s "Interpretation Bulletin: Form of Consent" and "Guidelines for obtaining meaningful consent" pages, not independently re-fetched in full', url: 'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/pipeda-compliance-help/pipeda-interpretation-bulletins/interpretations_07_consent/', accessed: '2026-08-18', class: 'regulator' },
      { claim: 'Quebec Law 25 (formerly Bill 64) came into force in three phases — 22 Sept 2022, 22 Sept 2023, and the final phase 22 Sept 2024, which introduced the right to data portability (structured, commonly-used technological format; 30/20+10 day response windows)', url: 'https://www.blg.com/en/insights/2024/ri/quebec-law-25-still-has-more-to-say-answers-to-your-questions-on-the-new-data-portability-right/', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'Law 25 applies based on the location of the individual, not the organization — an out-of-province or out-of-country business offering goods/services to, or monitoring the behaviour of, people in Quebec is in scope, with no size or revenue threshold', url: 'https://www.bclplaw.com/en-US/events-insights-news/quebec-law-no-25-a-little-known-privacy-law-with-a-big-reach.html', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'Law 25 requires a designated Privacy Officer whose contact information is made public (default: the person with the highest authority in the organization, i.e. often the owner of a small business, unless the role is delegated); requires clear prior notice — separate from the general privacy notice — before activating any technology that identifies, locates or profiles a person, with non-essential tracking/profiling technology off by default until the visitor activates it', url: 'https://www.mccarthy.ca/en/insights/blogs/techlex/quebecs-law-25-and-cookies-not-so-cookie-cutter', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'CASL regulates commercial electronic messages (CEMs) sent to an electronic address — it does not regulate a website\'s existence or content by itself; the scope is defined around messages, not pages', url: 'https://ised-isde.canada.ca/site/canada-anti-spam-legislation/en', accessed: '2026-08-18', class: 'regulator' },
      { claim: 'CASL implied consent arises from an existing business relationship — a purchase, contract, or (narrower) an inquiry — valid for 2 years from the transaction or 6 months from a bare inquiry; the burden of proving consent, express or implied, sits with the sender, who must keep records', url: 'https://help.klaviyo.com/hc/en-us/articles/4402385511579', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'CASL s.74.011 of the Competition Act (parallel electronic-advertising provision) and CASL itself both touch sender-identification in electronic messages; testimonials/endorsements are policed under Competition Act ss.52, 74.01 and 74.02 as false-or-misleading representations, including an undisclosed material connection (payment, free product, employment) between the endorser and the business', url: 'https://www.ipvancouverblog.com/testimonials/', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'Competition Bureau drip-pricing rule: never advertise an unattainable price — mandatory fixed fees the buyer cannot avoid must be in the headline price, with the only exception being a fee imposed directly by a statute; a variable charge can still raise concerns', url: 'https://competition-bureau.canada.ca/en/deceptive-marketing-practices/drip-pricing', accessed: '2026-08-18', class: 'regulator' },
      { claim: 'Bill C-59 added Competition Act s.74.01(b.1) (product-level environmental-benefit claims must be based on "adequate and proper testing," burden on the claimant) and s.74.01(b.2) (business/business-activity-level environmental claims must be based on "adequate and proper substantiation in accordance with internationally recognized methodology," burden on the claimant) — reverse-onus, in force 20 June 2024 (royal assent); "internationally recognized methodology" is not defined in the Act itself', url: 'https://www.blg.com/en/insights/2024/07/false-advertising-and-greenwashing-bill-c-59-changes-to-competition-act', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'The Competition Act\'s new private right of access (leave from the Competition Tribunal on a public-interest test) for deceptive-marketing conduct under s.74.01/74.1 and civil collaborations under s.90.1 came into force 20 June 2025', url: 'https://www.osler.com/en/insights/updates/private-right-of-access-for-relief-from-anti-competitive-harm-now-in-force-in-canada/', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'The Accessible Canada Act applies to the federal public sector and to federally regulated private-sector organizations only (banking, interprovincial transport, telecoms, etc.) — an ordinary provincially-regulated small business is outside its scope entirely', url: 'https://allyant.com/compliance/aca-compliance-the-accessible-canada-act/', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'Ontario\'s AODA Information and Communications Standard requires WCAG 2.0 Level AA for public web content posted after 1 January 2012, but ONLY for designated public-sector organizations and private/non-profit organizations with 50 or more employees; a business under that threshold has no AODA website obligation', url: 'https://www.ontario.ca/page/how-make-websites-accessible', accessed: '2026-08-18', class: 'primary' },
      { claim: 'Charter of the French Language s.52: catalogues, brochures and "other publications of the same nature, regardless of the medium used" must be available in French, and if bilingual the French version must be displayed at least as prominently and on terms at least as favourable; a 2024 regulation clarified this reaches website and social-media content, with a package of final Bill 96 amendments (including the trademark/signage "markedly predominant" rule) in force 1 June 2025', url: 'https://www.weglot.com/blog/bill-96-explained', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'On 1 June 2025 the employee threshold for mandatory francisation (workplace) registration with the OQLF dropped from 50 to 25 — a separate obligation from the s.52 website-content rule, which carries no employee-count threshold at all', url: 'https://gowlingwlg.com/en/insights-resources/articles/2025/entree-dernieres-dispositions-loi-96', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'No Canadian statute requires a corporation number or registered-office address to be published on a business\'s own website; the CBCA\'s individuals-with-significant-control register is filed with, and searched through, Corporations Canada, not displayed on the company\'s site', url: 'https://ised-isde.canada.ca/site/corporations-canada/en/business-corporations/public-disclosure-corporate-information', accessed: '2026-08-18', class: 'regulator' },
      { claim: 'Ontario\'s Consumer Protection Act, 2002 "internet agreement" disclosure duty (supplier name, address, etc.) is triggered only when a consumer is entering an actual internet AGREEMENT with a payment obligation over $50 — it does not reach an informational brochure site with no checkout', url: 'https://www.mannlawyers.com/resources/internet-agreements-with-ontario-consumers-consumer-protection-act-considerations-for-businesses/', accessed: '2026-08-18', class: 'secondary' },
      { claim: 'PIPEDA mandatory breach-reporting rules (report to the OPC and affected individuals on a "real risk of significant harm" threshold; keep records of every breach regardless) came into force 1 November 2018 and remain current', url: 'https://ehlaw.ca/new-pipeda-breach-reporting-obligations/', accessed: '2026-08-18', class: 'secondary' },
      // Re-sourced 2026-08-19 from Wikipedia to the numbering administrator's own
      // page — the same row us.mjs cites. Canada is inside the NANP, so the
      // reservation is the identical one; there was never a reason for the two
      // profiles to cite different classes of source for the same fact.
      { claim: 'NANPA reserves 555-0100 through 555-0199 in every North American area code for fictional use, and Canada is inside the NANP. 555-1212 (directory assistance) is separately assigned and is NOT fictional-safe.',
      // No `quote` on this row on purpose: the page's exact wording was not read
      // in this pass, and a quote nobody has read is a fabrication wearing a
      // verification badge — precisely the failure the quote field exists to
      // stop. Liveness is still checked; anchor it at the next review.
        url: 'https://www.nanpa.com/numbering/555-line-numbers', accessed: '2026-08-19', class: 'primary' },
    ],

    caveats: [
      'This profile assumes the site is reachable by the general public with no geofencing. If Quebec traffic is genuinely and verifiably excluded, several Law 25 duties here (the French-language requirement, the profiling notice, the named privacy officer) may not bind — that determination needs a human, not this file.',
      'No court or Tribunal decision was found applying PIPEDA, Law 25, or the Competition Act specifically to a 5-10 page brochure site with a third-party contact form. Every citation is the statute or regulator guidance applied to that fact pattern by this file\'s author, not a precedent decided on it.',
      'Whether provincial Business Names Registration Act disclosure duties (which generally attach to invoices, contracts and cheques) extend to the CONTENT of a business\'s own website could not be confirmed for any province in the research time available. Treated conservatively as NOT required on-site; see disclosure.corporation/soleTrader below, both intentionally near-empty.',
      '"Internationally recognized methodology" (Competition Act s.74.01(b.2), the business-level greenwashing provision) is undefined in the Act itself as of this review. The Bureau opened a post-2024 consultation referencing frameworks like ISSB, SASB, GRI and TCFD without endorsing one — so no single citation can name "the" required methodology.',
      'Alberta PIPA and BC PIPA each carry their own website-facing detail (slightly different consent wording, breach-notice thresholds) that this profile does not separately encode. It treats PIPA-governed Canada as PIPEDA-equivalent for this checker\'s purposes, which is a simplification a business operating solely within Alberta or BC should not fully rely on.',
      'The claim that the OPC has shifted toward a "GDPR-aligned" posture on tracking-technology consent (requiring meaningful, closer-to-express consent for advertising/profiling pixels even outside Quebec) rests on secondary commentary, not a primary OPC guidance document independently re-fetched in full during this research pass — the OPC\'s own online-behavioural-advertising guidance page returned a 404 when fetched directly. Treat the stricter reading as the safer default, not as independently confirmed OPC text.',
      'Nothing in this file was reviewed by a lawyer called to the bar in any Canadian province or territory. It is a competent-developer default assembled by an AI agent from primary and secondary sources — not legal advice, and not a substitute for one when the stakes are real (a regulated trade, real e-commerce, a business that already has a Quebec footprint).',
      "Sourcing is uneven, and this line deliberately does not say by how much: run `node checks/citations.mjs` for the computed primary-or-regulator share, and `--online` to re-read every quoted source and fail on any whose words have changed. What is still secondary here is mostly commencement timetables and enforcement posture, which have no primary source by their nature. The greenwashing entry is what a weaker base rate produced: it repeated two things that had been legislated away by the time it was written.",
      'CASL\'s implied-consent time windows and record-keeping duty are documented here for completeness but describe an EMAIL-MARKETING operational practice, not a website-content gate — nothing in checks/rules/legal.mjs currently checks CASL compliance at all, and this profile does not invent a check for it.',
    ],
  },

  // Seven questions every country profile must answer, each pointing at the row
  // in provenance.sources that carries the answer. `checks/citations.mjs` fails
  // a profile that leaves one blank or answers it from a secondary source.
  //
  // This exists because of accessibilityDuty. This profile answered "best
  // practice, not law" and was the only one of six that never mentioned its own
  // discrimination statute — an omission that reads to a client exactly like a
  // considered "no obligation here", and that nothing could catch, because
  // nothing checked whether a question had been ASKED.
  coverage: {
    privacyNotice: 'https://laws-lois.justice.gc.ca/eng/acts/P-8.6/page-7.html',
    consentModel: 'https://www.legisquebec.gouv.qc.ca/en/document/cs/p-39.1',
    accessibilityDuty: 'https://laws-lois.justice.gc.ca/eng/acts/h-6/section-5.html',
    businessIdentity: 'https://ised-isde.canada.ca/site/corporations-canada/en/business-corporations/public-disclosure-corporate-information',
    misleadingClaims: 'https://laws-lois.justice.gc.ca/eng/acts/C-34/section-74.01.html',
    electronicMarketing: 'https://laws-lois.justice.gc.ca/eng/acts/E-1.6/FullText.html',
    fictionalData: 'https://www.nanpa.com/numbering/555-line-numbers',
  },

  locale: {
    language: 'en-CA',
    // Canadian Press style (the de facto newsroom/business-writing standard)
    // keeps the British -our/-re endings (colour, centre, favour, theatre)
    // but follows American practice for -ize over -ise (organize, realize)
    // and shortens -gramme to program. That is closer to 'gb' than 'us' on
    // the endings a spell-checker actually flags, so 'gb' is the better of
    // the two available buckets — not a perfect fit, because no such bucket
    // exists for the specific CP hybrid. A French-language build (Quebec
    // audience) is a different locale entirely (fr-CA) and is out of scope
        // for this file, which covers the English-language default only.
    spelling: 'gb',
    dateFormat: 'MMMM D, YYYY',
    currency: 'CAD',
    currencySymbol: '$',
    // A real Toronto area code (416) paired with the NANP's reserved
    // fictional block, so the format reads as authentic without being a
    // number anyone could actually dial into existence.
    phoneExample: '(416) 555-0142',
    fictionalPhoneRange: 'NANPA reserves 555-0100-555-0199 in every North American area code for fiction/testing, and Canada is part of the NANP — see provenance.sources. 555-1212 (directory assistance) and 555-4334 are NOT in the fictional-safe range.',
    // Canadian postal code: letter-digit-letter, space, digit-letter-digit.
    // The excluded first-position letters (D, F, I, O, Q, U) and excluded
    // letters elsewhere (D, F, I, O, Q, U, plus W and Z outside the first
    // position) follow Canada Post's forward-sortation-area rules. As a
    // STRING because the loader compiles it; case-insensitive is assumed.
    postcodePattern: '^[ABCEGHJ-NPRSTVXY]\\d[ABCEGHJ-NPRSTV-Z] ?\\d[ABCEGHJ-NPRSTV-Z]\\d$',
    phonePattern: '/(?:\\+1[\\s.-]?)?(?:\\(\\d{3}\\)|\\d{3})[\\s.-]?\\d{3}[\\s.-]?\\d{4}\\b/g',
    phoneCountryCode: '1',
    phoneNationalPrefix: '',
    phoneNationalPattern: '/^\\d{10}$/',
    addressOrder: 'street, city, province postalcode',
    measurement: 'metric',
  },

  copy: { emDashPer1000Warn: 6.43, emDashPer1000Block: 10.13, language: 'en-CA' },

  legal: {
    privacyLaw: 'PIPEDA (+ Quebec Law 25 / Alberta PIPA / BC PIPA where they apply)',

    // Canada does not have one national answer here, which is the thing
    // generic "Canadian website compliance" advice usually flattens away.
    // Outside Quebec, PIPEDA tolerates IMPLIED consent (a clear notice, no
    // forced click) for non-sensitive, in-expectation collection — ordinary
    // first-party analytics disclosed in a privacy policy is the textbook
    // case, and the OPC guidance on meaningful consent says so directly (see
    // provenance.sources). That is 'notice-and-opt-out' territory, not
    // GDPR-style prior opt-in, and a business that operates entirely outside
        // Quebec and can prove it may legitimately ship a lighter cookie story.
    //
    // Quebec is the stricter edge, and the earlier version of this comment
    // overstated it TWICE — both times sourced to a law-firm client alert
    // rather than to the Act, and both times in the direction that makes the
    // client's obligation look bigger. Corrected 2026-08-19 against the
    // official consolidation (legisquebec, "Ce document a valeur officielle",
    // à jour au 1er avril 2026):
    //
    //   * It said "Law 25 applies based on the VISITOR's location, not the
    //     business's." The Act does not say that. s.1 binds a person handling
    //     personal information "in the course of carrying on an enterprise";
    //     the words "resident" and "located in" appear nowhere in it. Whether
    //     Quebec's regime reaches an out-of-province enterprise with Quebec
    //     visitors is a real and unsettled question, argued by analogy to the
    //     GDPR — it is not a sentence in the statute, and this file must not
    //     quote it as one.
    //   * It cited s.8.1 as a prior-CONSENT rule. s.8.1 is a NOTICE rule: the
    //     collector "must first inform the person" of the use of the
    //     technology and "of the means available to activate" its identifying,
    //     locating or profiling functions. Off-by-default is a reasonable
    //     inference from the word "activate" — you cannot be told how to
    //     activate something already running — but it is an inference, and
    //     s.14's consent standard is a separate provision doing separate work.
    //
    // The shipped default is still the stricter one, and it is a JUDGMENT,
    // labelled as one, not a citation: a public brochure site cannot rule out
    // a Quebec visitor, the cost of prior-opt-in on a site with no analytics
    // is zero (there is nothing to gate), and the cost of being wrong the
    // other way is a regulator's view of profiling technology running
    // un-notified. A business that can genuinely rule out Quebec exposure has
    // the lighter PIPEDA answer available and should take it — implied
    // consent with clear notice, for non-sensitive in-expectation collection,
    // is squarely within the OPC's meaningful-consent guidance.
    consentModel: 'prior-opt-in',
    consentModelWhy: 'This is the cautious default, not a statutory command, and the difference matters. '
      + 'Quebec P-39.1 s.8.1 requires a person collecting personal information with technology that '
      + 'identifies, locates or profiles to "first inform" the visitor of its use and of "the means '
      + 'available to activate" those functions — a notice duty, from which off-by-default follows by '
      + 'inference rather than by wording. The Act\'s scope provision (s.1) binds enterprises, not '
      + 'visitors; the common claim that Law 25 "applies based on where the visitor is" is an argument '
      + 'by analogy to the GDPR, not text in the statute, and this profile no longer repeats it as one. '
      + 'Outside Quebec, PIPEDA tolerates implied consent with clear notice for non-sensitive, '
      + 'in-expectation collection — ordinary disclosed first-party analytics is the textbook case, and '
      + 'a business that can rule out Quebec exposure may legitimately ship notice-and-opt-out instead. '
      + 'The stricter default is shipped because a public brochure site cannot prove it has no Quebec '
      + 'visitors and because a site with no analytics pays nothing for it. Record the choice either way.',

    pages: {
      privacy: {
        patterns: [/privacy|confidentialit/i],
        required: 'always',
        why: 'PIPEDA\'s openness principle requires a readily available policy explaining an organization\'s personal-information practices the moment any personal data is collected — which a contact form or analytics both trigger. Quebec Law 25 adds specific content requirements a generic PIPEDA-only notice will miss (see mustMention).',
        mustMention: [
          [/\b(what|which)\s+(data|information)|we\s+collect|personal\s+(data|information)/i, 'what personal information is collected'],
          [/\b(purpose|why\s+we\s+(collect|use)|consent)\b/i, 'the purpose(s) it is collected for and that consent is the basis (PIPEDA has no GDPR-style "legal basis" menu — consent, express or implied, is the mechanism)'],
          [/\b(right\s+to|your\s+rights|access|correct|rectif|withdraw\s+(your\s+)?consent|portability)\b/i, 'data-subject rights — access, correction, withdrawing consent, and (for Quebec residents, since 22 Sept 2024) data portability'],
          [/\b(retain|retention|how\s+long|keep\s+your)\b/i, 'how long data is kept'],
          // The statute's own words are "person in charge of the protection of
          // personal information" (P-39.1 s.3.1), and PIPEDA Schedule 1 cl.4.1
          // says "individual(s) who are accountable". This pattern used to
          // require the phrase "privacy officer", so a page that named the role
          // in the Act's language failed at BLOCKER while a page that used a
          // job title nobody legislated passed. Found by a naive Ontario build.
          [/\b(privacy\s+(officer|contact|lead|manager)|person\s+(in\s+charge|responsible|accountable)[^.]{0,40}(privacy|personal\s+information)|(accountable|responsible)\s+for\s+privacy|data\s+protection\s+officer|responsable\s+de\s+la\s+protection)\b/i, 'the name or title of the person accountable for privacy — required to be identifiable under PIPEDA\'s accountability principle everywhere, and required to be PUBLICLY named on the website under Quebec P-39.1 s.3.1'],
          [/\b(privacy\s+commissioner|office\s+of\s+the\s+privacy\s+commissioner|opc|priv\.gc\.ca|commission\s+d.acc[eè]s\s+[aà]\s+l.information|\bcai\b)\b/i, 'the right to complain to the OPC (and, for Quebec residents, the CAI)'],
          [/[\w.+-]+@[\w-]+\.[\w.]+|\bcontact\s+us\b/i, 'a contact route for a privacy request'],
        ],
      },
      cookies: {
        patterns: [/cookie|temoin/i],
        required: 'if-non-essential-scripts',
        why: 'Whether a banner is REQUIRED is genuinely split by geography, which is the point of consentModelWhy above — but a cookie/tracking-technology PAGE explaining what is set and why is good PIPEDA openness-principle practice everywhere, and Quebec Law 25\'s profiling notice must exist as its own clear notice regardless. See shared/legal.md\'s "no banner on a site with nothing to consent to" logic — it applies here exactly as it does in the UK profile: the honest default for a five-page local-business site with no analytics is NO cookies page and NO banner at all.',
        mustMention: [
          [/\bessential|strictly\s+necessary\b/i, 'the essential/non-essential split'],
          [/\b(identif(y|ies)|locate|profil(e|ing))\b/i, 'that any technology identifying, locating or profiling a visitor is named (Quebec Law 25\'s profiling-notice concept reaches ordinary analytics and ad pixels, not just cookies narrowly)'],
          [/\b(withdraw|change|manage|opt.?out|deactivate)\s+(your\s+)?(consent|preferences|cookie)|\bno\s+cookies\b|\bsets\s+no\s+cookies\b/i,
            'how to withdraw/deactivate, or a statement that nothing needing consent is set'],
        ],
      },
      terms: {
        patterns: [/terms|conditions/i],
        required: 'recommended',
        why: 'Not a statutory requirement for a brochure site under any Canadian law found in this research; standard practice, limits liability, cheap to ship.',
        mustMention: [],
      },
      accessibility: {
        patterns: [/accessib/i],
        required: 'recommended',
        // CHANGED 2026-08-19. This entry used to name only the accessibility-
        // STANDARDS statutes (the ACA and the AODA), correctly conclude that
        // neither reaches a small business, and stop there — so it read as "no
        // duty". Every other profile in this repo names the DISCRIMINATION route
        // as well: uk the Equality Act, us ADA Title III, au DDA s.24 and
        // Maguire, eu the EAA analysis. ca was the only one that did not, in the
        // direction that understates the client's exposure. Found by diffing the
        // same question across all six profiles, which is now what
        // `coverage.accessibilityDuty` exists to force.
        why: "Two routes, and both matter. (1) The accessibility-STANDARDS statutes do NOT reach a small business: the Accessible Canada Act s.7(1) covers the federal public sector and businesses \"within the legislative authority of Parliament\" - banking, interprovincial transport, telecoms - and Ontario's AODA standard (O. Reg. 191/11 s.14(2)) binds \"designated public sector organizations and large organizations\", where s.2 defines large as \"50 or more employees in Ontario\". (2) HUMAN-RIGHTS law does reach one, and it is the route that matters here: Canadian Human Rights Act s.5 makes it \"a discriminatory practice in the provision of goods, services, facilities or accommodation customarily available to the general public\" to deny access on a prohibited ground, and every province has its own code - Ontario's Human Rights Code s.1 gives \"every person ... a right to equal treatment with respect to services, goods and facilities, without discrimination because of ... disability\". This is the same route Australia's DDA s.24 takes and the one Maguire v SOCOG turned on. No reported Canadian decision applying s.5 or a provincial code to a small business's brochure site was found in this pass, so the statement stays RECOMMENDED rather than required - but the duty exists, the enforcement path is a human-rights complaint rather than a website-standards audit, and nobody should tell a client there is no duty at all.",
        mustMention: [
          [/\bwcag\b/i, 'the standard targeted'],
          [/\b(report|contact|email|tell us|get in touch)\b/i, 'how to report a problem'],
          [/\b(known\s+limitation|not\s+(yet\s+)?(been\s+)?tested|we\s+have\s+not|aim|target|working\s+towards)\b/i,
            'honest limits — the statement must say what is NOT done, not assert bare conformance'],
        ],
      },
    },

    // Canada has no equivalent of the UK's Companies Act / Trading Disclosures
    // Regulations requirement to show a company number and registered office
    // ON the business's own website (see provenance.sources — the CBCA's
    // individuals-with-significant-control register is filed with and
    // searched through Corporations Canada, not published on the company's
    // site). That is a genuinely different shape from the UK profile, not a
    // gap in research — both `corporation` and `soleTrader` are deliberately
    // near-empty. Do not add a company-number pattern here without a found
    // statute requiring it; see caveats above on the Business Names Act
    // question, which stayed UNCONFIRMED.
    disclosure: {
      corporation: [],
      soleTrader: [],
      all: [
        [/[\w.+-]+@[\w-]+\.[\w.]+|tel:|\b\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/,
          'an email address or phone number',
          'No single Canadian statute mandates this the way the UK\'s E-Commerce Regulations do — Ontario\'s Consumer Protection Act "internet agreement" disclosure duty, the closest analogue, is triggered only by an actual online purchase agreement over $50, which a no-checkout brochure site never forms (see provenance.sources). This is a practical baseline the checker enforces anyway: PIPEDA\'s openness principle assumes an individual can reach the organization to make a privacy request, and every provincial consumer-protection complaint process assumes a working contact route exists. Not a single hard citation; a floor.'],
      ],
    },

    // Claim CLASSES are universal; their regex patterns live in _base.mjs.
    // This supplies the CANADIAN law that makes each one risky.
    claimCitations: {
      rating: 'A fabricated, incentivized-but-undisclosed, or unrepresentative star rating is a false-or-misleading representation under Competition Act ss.52 (criminal) and 74.01 (civil, reviewable conduct). Canada has no dedicated fake-review statute the way some jurisdictions are adopting — ordinary misleading-advertising law carries it, and the Bureau treats undisclosed paid/incentivized reviews as an active enforcement priority. It must trace to a real, attributable review.',
      count: 'A specific customer/client/project count is a "representation to the public" under Competition Act s.74.01(1)(a) — false or misleading in a material respect is reviewable by the Bureau and, since 20 June 2025, by a private applicant who obtains Tribunal leave on a public-interest test. Must be substantiable on request.',
      superiority: 'An objective superiority, "award-winning," or "market-leading" claim is a factual representation under s.74.01 and must be true; if it is not, the exposure runs to administrative monetary penalties, not just a slap on the wrist. General subjective puffery ("great service") is not caught, which is why the shared pattern requires an intensifier plus a place name or "award-winning" — see _base.mjs\'s precision-over-recall note.',
      accreditation: 'Claiming membership of, or accreditation by, a real trade body or regulator the business does not actually hold is a false representation under ss.52/74.01, and for a regulated trade (electricians, real estate, several health professions) is independently a licensing offence under the relevant provincial act — a criminal matter, not a marketing slip. The membership or registration number must be real and checkable.',
      guarantee: 'A guarantee stated on the site is both a contractual term the business is held to AND, if the business does not actually honour it, a false-or-misleading representation under s.74.01. Only ship one the owner has agreed to.',
      insurance: 'Substantiable in the same way as an accreditation claim — s.74.01 catches a false claim of being insured, and a commercial or trade client asking to see the certificate before hiring is routine, not paranoid.',
      years: 'A specific years-in-business or years-of-experience number is checkable against the relevant provincial corporate/business-name registry or the domain\'s registration date, and is a "representation to the public" under s.74.01 if it is wrong. Confirm it before it ships.',
      // CORRECTED 2026-08-18 after an independent check against the consolidated
      // statute. The earlier text was assembled from law-firm bulletins written
      // in 2024 and repeated two things that had since been legislated away —
      // in the direction that OVERSTATES the client's obligation and exposure,
      // which is the worse direction to be wrong in.
      //
      //   * The "internationally recognized methodology" wording was STRUCK from
      //     s.74.01(1)(b.2) by 2026 c.3 s.597 (Budget Implementation Act, royal
      //     assent 26 March 2026). The test is now "adequate and proper
      //     substantiation, the proof of which lies on the person making the
      //     representation".
      //   * Private access does NOT reach (b.2): s.103.1(6.2), added by
      //     2026 c.3 s.598, bars leave for an application made on the basis of
      //     that paragraph.
      //
      // Sources: laws-lois.justice.gc.ca/eng/acts/C-34/section-74.01.html and
      // /section-103.1.html, plus the Competition Bureau's own environmental-
      // claims page confirming the removal. This is the case for verifying
      // against the consolidated statute rather than a firm's summary.
      environmental: 'Greenwashing — Competition Act s.74.01(1)(b.1) (product-level environmental-benefit claims, "adequate and proper testing") and s.74.01(1)(b.2) (business or business-activity-level claims, "adequate and proper substantiation"), both added by Bill C-59 and in force since 20 June 2024. BOTH ARE REVERSE-ONUS: the business, not the Bureau, must already hold the substantiation BEFORE the claim is published, not assemble it after a complaint. The "internationally recognized methodology" requirement that accompanied (b.2) was REPEALED by 2026 c.3 s.597 — do not quote it to a client. Private access under s.103.1 does not reach (b.2) (s.103.1(6.2), 2026 c.3 s.598), so the exposure here is Bureau enforcement, not a private applicant.',
    },

    extras: [
      {
        id: 'ca/quebec-french-language',
        severity: 'major',
        what: 'Charter of the French Language s.52 — "Regardless of the medium used, catalogues, brochures, folders, commercial directories, order forms and any other documents of the same nature that are available to the public must be drawn up in French", and a version in another language may not be available on terms more favourable than the French one. A commercial brochure site is squarely inside "documents of the same nature". French cannot be a stub or a lesser summary of the English content.',
        detect: 'Prose description for the checker: confirm whether the site is realistically limited to a single non-Quebec market (a strong local-service-area signal in facts.md) or is open to the whole Canadian/global public. If the latter, check for a French-language version that mirrors the English content in completeness, not just a translated homepage.',
        // CORRECTED 2026-08-19. This entry used to say s.52 predates Bill 96 and
        // that "a 2024 regulation clarified it reaches website content", sourced
        // to a translation-plugin vendor's blog. The section predating Bill 96 is
        // right; the rest was not. The words "Regardless of the medium used" ARE
        // the reach-to-websites rule, and Bill 96 put them there (2022, c.14,
        // s.44). Attributing a statutory amendment to a later regulation is the
        // kind of error a client repeats to their lawyer.
        why: 'Quoted from s.52 itself (see provenance.sources, legisquebec). This is one of the sharpest differences from every other jurisdiction here: a LANGUAGE mandate tied to reachability, not a disclosure or consent mandate. Whether it reaches an enterprise carrying on business outside Quebec is the same unsettled scope question flagged under consentModel — take that to a Quebec adviser rather than assuming either answer.',
      },
      {
        id: 'ca/law25-privacy-officer',
        severity: 'major',
        what: 'Quebec P-39.1 s.3.1 — the person exercising the highest authority in the enterprise is the person in charge of the protection of personal information unless the function is delegated in writing, and their "title and contact information of the person in charge of the protection of personal information must be published on the enterprise\'s website". For a sole trader or small partnership that is usually the owner, by name or by title.',
        detect: 'Prose description: the privacy policy names a person or role (not only a generic "contact us") responsible for privacy, with a way to reach them.',
        // Re-sourced 2026-08-19 from a law-firm summary to the section itself.
        why: 'Quoted from s.3.1 itself (see provenance.sources, legisquebec). This is one of the few places in any profile here where a statute names the WEBSITE as the place a thing must appear, so it is unusually safe ground. It is genuinely stricter than PIPEDA Schedule 1 cl.4.1.2, which requires the accountable individual to be identifiable "upon request" and not published at all.',
      },
      {
        id: 'ca/law25-profiling-notice',
        severity: 'major',
        what: 'Quebec P-39.1 s.8.1 — a person collecting personal information using technology "that includes functions allowing the person concerned to be identified, located or profiled must first inform the person (1) of the use of such technology; and (2) of the means available to activate the functions". The section defines profiling as assessing characteristics such as work performance, economic situation, health, personal preferences, interests or behaviour — which is broader than "cookies" and reaches ordinary analytics and ad pixels. The notice is its own notice, distinct from the general privacy policy.',
        detect: 'Prose description: if any nonEssentialScripts hit fires (per _base.mjs), confirm the consent mechanism\'s copy specifically names the technology and frames it as profiling/tracking, not just "cookies" generically.',
        // NARROWED 2026-08-19. This entry used to assert flatly that the
        // technology "must be OFF by default", citing a law-firm blog. The
        // statute says INFORM. Off-by-default is a sound inference from being
        // told "the means available to ACTIVATE" something, and it is still the
        // right default to ship — but it is an inference, and the client-facing
        // text below now says which is which. Same correction as consentModel.
        why: 'Quoted from s.8.1 itself (see provenance.sources, legisquebec). The duty in the section is to INFORM, before collection. Off-by-default follows by inference from "the means available to activate" rather than from any phrase in the Act, and it is the cautious reading this profile ships. Where a build turns analytics on for a Quebec-exposed site: notice first, activation by the visitor, and tell the client which part is the statute and which part is the caution.',
      },
      {
        id: 'ca/casl-scope',
        severity: 'minor',
        what: 'CASL does not regulate the website itself — it regulates commercial electronic messages SENT to an electronic address (email, SMS, social DM). A contact form or a newsletter sign-up field on the site is not itself a CASL event. CASL bites the moment the business actually emails those addresses something commercial, at which point consent (express, or implied via an existing business relationship inside CASL\'s 2-year/6-month windows) and a working unsubscribe are owed, with the burden of proving consent on the sender.',
        detect: 'Prose description: do NOT flag the mere presence of a contact form or newsletter field as a CASL exposure. If the site\'s own copy promises automated marketing emails will follow a form submission, that is the point to raise CASL, not the form\'s existence.',
        why: 'See provenance.sources (ised-isde.canada.ca) — this is the contradiction-angle finding for CASL: a lot of generic "Canadian website compliance" content implies CASL is a website-content law. It is not; it is an email-marketing law that happens to be enforced by the CRTC.',
      },
      {
        id: 'ca/business-identity-no-uk-equivalent',
        severity: 'minor',
        what: 'Unlike the UK, no Canadian statute found in this research requires a corporation number or registered-office address to be published ON a business\'s own website. The CBCA\'s individuals-with-significant-control register is filed with, and searched through, Corporations Canada — not displayed on the company\'s own site. Provincial "internet agreement" disclosure duties (e.g. Ontario CPA 2002 s.38-ish territory) trigger only once an actual paid consumer agreement is being formed online, which a checkout-free brochure site never does.',
        detect: 'Prose description: do not demand a company/registration number, registered office, or trading-disclosure block the business has no legal obligation to publish. If the build later grows real e-commerce, re-run this research — the shape changes.',
        why: 'See provenance.sources (Corporations Canada; Mann Lawyers on Ontario CPA "internet agreements") — this is the surprising negative finding the brief asked for, and it genuinely changes this profile\'s shape versus uk.mjs\'s disclosure.limited/soleTrader blocks.',
      },
    ],
  },

  seo: {
    locale: 'en_CA',
    // A Canadian local business without these is invisible in the search
    // that matters, same logic as the UK profile.
    localBusinessRequired: true,
  },
};
