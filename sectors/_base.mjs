// website-builder — the sector layer's shared floor.
//
// WHY A SECOND AXIS EXISTS.
//
// `profiles/` answers "which country does this business trade in". It does not,
// and cannot, answer "what does the law require *of this trade*". The UK
// profile says so in its own caveats, and has since the day it was written:
//
//     'Regulated trades (healthcare, finance, law, gas, electrical) carry
//      obligations no static checker can know about.'
//
// That sentence was honest and it was also a hole. A physiotherapy clinic, a
// letting agent, a solicitor and an aesthetics clinic are four sites the whole
// jurisdiction layer treats identically, and the law does not: two of them have
// duties that name the website in the statute, one of them cannot lawfully
// print its own price list, and one of them commits a criminal offence by using
// a word in an <h1>.
//
// So the sector is a second profile axis, resolved from the same place the
// jurisdiction is (the brief and the facts ledger), merged onto this base, and
// gated by `checks/rules/sector.mjs`.
//
// THE THREE RULES THAT KEEP THIS HONEST, and they are not negotiable:
//
//   1. **A sector duty is jurisdiction-shaped too.** "Physiotherapist" is a
//      protected title in the UK, a state-licensed one in the US and an AHPRA
//      registration in Australia. A sector file therefore keys its duties by
//      jurisdiction, and an unresearched jurisdiction is `researched: false`
//      with a stated reason — never an empty object that reads as "nothing
//      required here".
//
//   2. **Detection is a suggestion; declaration is the fact.** The detector
//      reads words. Words are ambiguous — "practice" is a physiotherapy clinic
//      and a law firm and a golf coach. Detection therefore never silently
//      applies a sector's blockers. It raises `sector/undeclared` and asks the
//      build to say what it is, which is a question stage 01 should have asked
//      anyway.
//
//   3. **Nobody qualified has read any of this either.** Same standing as the
//      jurisdiction profiles: `status: 'researched'`, `verifiedBy: null`, and
//      the report repeats it on every run. A sector file that reads as advice
//      is a sector file that is wrong.
//
// NOT LEGAL ADVICE. This encodes what a competent developer should refuse to
// ship for a given trade so the business is not obviously exposed. It is not a
// compliance audit, it does not know about the client's own regulator
// correspondence, and a green run is not a defence.

/**
 * Duty test kinds, deliberately few.
 *
 * A declarative test set is the difference between "the rule engine is generic
 * and a new sector is data" and "every sector ships its own JavaScript". The
 * second shape is how a rule family becomes unauditable: nobody can answer
 * "what does this sector actually check" without reading code.
 *
 *   present       something must appear somewhere on the site
 *   absent        something must NOT appear anywhere on the site
 *   page          a page whose route matches one of these patterns must exist
 *   sourcedNumber a registration/licence number must appear AND trace to a
 *                 sourced row in facts.md — the facts family's discipline,
 *                 applied to the one number a visitor is most likely to trust
 *
 * Anything a static reader genuinely cannot decide goes in `confirm`, is
 * emitted as a MINOR addressed to a human, and is never dressed up as a gate.
 */
export const TEST_KINDS = ['present', 'absent', 'page', 'sourcedNumber'];

/**
 * Duties that hold for every regulated trade in every country this repo knows
 * about, so a sector file carries only what is genuinely sector-shaped.
 *
 * Kept deliberately short. The temptation with a base like this is to fill it
 * with plausible-sounding universals, and a universal that is not universal is
 * the same defect as an invented price: it produces a confident finding nobody
 * can trace to an instrument.
 */
export const universalConfirm = [
  {
    id: 'sector/insurer-named',
    what: 'Whether professional indemnity or public liability cover is claimed on the site, and if so whether the insurer, the level of cover and the policy status came from the client rather than from the builder.',
    why: 'An insurance claim is a factual claim about a live contract, and it is the one visitors read as a guarantee. `facts/row-unsourced` catches it having no row; nothing can catch a row that is out of date. Ask for the certificate, or drop the claim.',
  },
  {
    id: 'sector/registration-current',
    what: 'Whether every registration, licence or scheme-membership number on the site is current TODAY, checked against the public register rather than against what the client remembered.',
    why: 'A lapsed registration number published as current is worse than no number: it is a representation a regulator can act on, and the site is the publication. Every regulator in this file operates a free public register — check the number in it, and record the date you checked in facts.md.',
  },
];

/**
 * The vocabulary the detector uses to decide a build is *some* regulated trade
 * even when it cannot tell which one. Used only to raise `sector/undeclared`
 * with a useful message; never to apply a sector's duties.
 */
export const REGULATED_SMELL = [
  /\b(?:registered|regulated|authorised|authorized|licensed|licence[dn]?|accredited)\s+(?:with|by|under)\b/i,
  /\b(?:regulator|regulatory body|governing body|professional body|public register)\b/i,
  /\b(?:indemnity insurance|professional indemnity|malpractice)\b/i,
];

export default {
  // Every sector file merges onto this. Anything a file leaves out is inherited
  // rather than missing — the same contract profiles/_base.mjs holds.
  id: null,
  name: null,
  aliases: [],

  detect: {
    /** A match here alone is enough to name the sector. */
    strong: [],
    /** Two of these, or one plus a strong, name the sector. */
    weak: [],
    /** A match here vetoes the sector however many others hit. */
    not: [],
  },

  /**
   * Keyed by jurisdiction id — the same ids `profiles/` uses. A jurisdiction
   * absent from this map is not "no duties", it is "nobody researched it", and
   * the loader says exactly that.
   */
  jurisdictions: {},

  provenance: {
    status: 'researched',
    verifiedBy: null,
    lawLastVerified: null,
    nextReview: null,
    sources: [],
    caveats: [],
  },
};
