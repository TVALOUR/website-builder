// website-builder — the claim patterns' precision suite.
//
//   node checks/claim-cases.mjs        run it directly
//   (checks/selftest.mjs imports and runs it too)
//
// The claim patterns in `profiles/_base.mjs` are shared by every jurisdiction,
// so a loose one is a false BLOCKER in every country at once. That is the worst
// shape a defect in this repo can take, and it has happened four times:
//
//   "we do more than clients expect"                  -> a customer-count claim
//   "we cannot guarantee the part is in stock"        -> a guarantee to honour
//   "we do not offer a money back guarantee"          -> a guarantee to honour
//   "nobody is going to tell you we are the best joiner in Devon"
//                                                     -> a superiority claim
//
// Every one is a business being careful being reported as a business
// overclaiming. Every one is below as a "quiet" case.
//
// The "fires" half exists so nobody fixes the quiet half by turning the rule
// off. And every profile is exercised, not just the one the fixtures were
// written for — because two profiles hand-rolled their own claim arrays and
// silently lost a whole class, which nothing noticed.
//
// Zero dependencies. Node 18+.

import { loadProfile, listProfiles } from './lib/profile.mjs';

export const PROSE = [
  // [text, key, shouldFire]
  ['We do more than clients expect', 'count', false],
  ['Serving more than the usual suspects', 'count', false],
  ['Over 500 happy customers', 'count', true],
  ['1,200+ projects completed', 'count', true],

  ['We cannot guarantee that the part is in stock', 'guarantee', false],
  ['We do not offer a money back guarantee on bespoke work, because it cannot be resold.', 'guarantee', false],
  ['If you cannot guarantee a date we will not pretend that we can.', 'guarantee', false],
  ['We guarantee same-day callout', 'guarantee', true],
  ['Money-back guarantee on every stock item', 'guarantee', true],

  // 2026-08-19, from a naive Canadian build. Its terms page said "Neither is a
  // guarantee about parts of a structure nobody can see" — a disclaimer, in a
  // terms page, blocked at BLOCKER as a promise the business must honour. The
  // negation guard knew the auxiliary-verb forms and none of the pronoun ones.
  ['Neither is a guarantee about parts of a structure nobody can see.', 'guarantee', false],
  ['Nothing on this page is a guarantee that the work will suit your appliance.', 'guarantee', false],
  ['None of this is a guarantee of a fixed price.', 'guarantee', false],
  ['An inspection is not a guarantee about anything nobody can see.', 'guarantee', false],
  // ...and the fix must not silence the real thing three words later.
  ['We guarantee the work for twelve months.', 'guarantee', true],

  ['Nobody here is going to tell you we are the best joiner in Devon.', 'superiority', false],
  ['the best way to reach us is by phone', 'superiority', false],
  ['The best joiner in Devon, three years running', 'superiority', true],

  ['our registered office in Exeter', 'accreditation', false],
  ['registered address on the invoice', 'accreditation', false],
  ['a member of the team will call you back', 'accreditation', false],
  ['We are approved by nobody in particular and we have never entered an award.', 'accreditation', false],
  ['Registered with Gas Safe, number 123456', 'accreditation', true],
  ['Certified by BSI', 'accreditation', true],

  ['25 years of experience', 'years', true],
  ['4.8 out of 5 across 90 reviews', 'rating', true],
  ['We are a carbon-neutral business', 'environmental', true],
];

/** Every claim class the base declares must resolve to a citation in every profile. */
export async function checkCoverage() {
  const base = (await import('../profiles/_base.mjs')).default;
  const keys = Object.keys(base.legal.claimPatterns);
  const rows = [];
  for (const id of listProfiles()) {
    const { profile } = await loadProfile(id);
    if (!profile) { rows.push({ id, ok: false, missing: ['profile failed to load'] }); continue; }
    const labels = (profile.legal.regulatedClaims || []).map((r) => r[1]);
    const missing = keys.filter((k) => {
      const label = base.legal.claimPatterns[k][1];
      return !labels.includes(label);
    });
    rows.push({ id, ok: missing.length === 0, missing });
  }
  return { keys, rows };
}

/** Precision of the shared patterns against real prose. */
export async function checkPrecision() {
  const base = (await import('../profiles/_base.mjs')).default;
  return PROSE.map(([text, key, shouldFire]) => {
    const fired = base.legal.claimPatterns[key][0].test(text);
    return { text, key, shouldFire, fired, ok: fired === shouldFire };
  });
}

if (process.argv[1] && process.argv[1].endsWith('claim-cases.mjs')) {
  let bad = 0;
  console.log('\nclaim patterns — precision against ordinary prose\n');
  for (const r of await checkPrecision()) {
    if (!r.ok) bad++;
    console.log(`  ${r.ok ? 'ok  ' : 'FAIL'}  ${r.key.padEnd(14)} ${r.shouldFire ? 'fires  ' : 'quiet  '} "${r.text.slice(0, 62)}"`);
  }
  console.log('\nclaim coverage — every class reaches a citation in every profile\n');
  const { keys, rows } = await checkCoverage();
  for (const r of rows) {
    if (!r.ok) bad++;
    console.log(`  ${r.ok ? 'ok  ' : 'FAIL'}  ${r.id.padEnd(16)} ${r.ok ? `all ${keys.length} classes` : `MISSING: ${r.missing.join(', ')}`}`);
  }
  console.log(bad ? `\n  ${bad} mismatch(es)\n` : '\n  all claim cases correct\n');
  process.exit(bad ? 1 : 0);
}
