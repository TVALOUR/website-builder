// website-builder — the project-regime resolver's case suite.
//
//   node checks/regime-cases.mjs        run it directly
//   (checks/selftest.mjs imports and runs it too)
//
// Question 0 asks whether the build is a real local business, a real online-only
// product, or a demo. `stages/01_discover/questions.md` says the answer "decides
// which rules bind". Two defects made that untrue, and both were found by
// running a build rather than by reading the code:
//
//   1. The answer was parsed inside `checks/rules/legal.mjs`, so no other family
//      could see it. A build that correctly declared itself a fictional demo,
//      and used the NANPA range reserved for fiction because question 0 requires
//      a demo to use one, was blocked by `copy/placeholder` on every page.
//
//   2. The entity vocabulary was British — `sole trader`, `limited`, `plc`,
//      `llp`. A Canadian sole proprietorship matched none of it, and the
//      fallback then decided the entity's legal form by grepping the HTML for
//      "Companies House" and "registered in England". Three UK strings, judging
//      four non-UK jurisdictions.
//
// Every case below is a phrase a real ledger would contain in one of the six
// countries this repo ships a profile for.

import { resolveRegime, isReservedFictionNumber } from './lib/regime.mjs';

const row = (entity, preamble = '') =>
  `${preamble}\n\n| Fact | Value | Source | Confirmed |\n|---|---|---|---|\n| Entity type | ${entity} | owner | yes |\n`;

export const CASES = [
  // [entity-type cell, expected form, expected isDemo, note]

  // --- unincorporated, in the words each country actually uses
  ['sole trader (not a limited company)', 'unincorporated', false, 'UK'],
  ['sole proprietorship registered in Ontario', 'unincorporated', false, 'Canada — the term that was missing'],
  ['sole proprietor, no separate entity', 'unincorporated', false, 'US'],
  ['sole trader / ABN holder, not a Pty Ltd', 'unincorporated', false, 'Australia'],
  ['general partnership', 'unincorporated', false, 'partnership'],
  ['self-employed, trading under his own name', 'unincorporated', false, 'plain English'],
  ['Einzelunternehmen', 'unincorporated', false, 'Germany'],
  ['entreprise individuelle', 'unincorporated', false, 'France'],

  // --- incorporated
  ['private limited company (Ltd), Companies House 08812345', 'incorporated', false, 'UK'],
  ['Delaware LLC', 'incorporated', false, 'US'],
  ['Ontario corporation (Inc.)', 'incorporated', false, 'Canada'],
  ['Pty Ltd, ACN 123 456 789', 'incorporated', false, 'Australia'],
  ['GmbH, HRB 12345', 'incorporated', false, 'Germany'],
  ['SARL', 'incorporated', false, 'France'],
  ['sp. z o.o.', 'incorporated', false, 'Poland'],
  ['sp.z.o.o.', 'incorporated', false, 'Poland, no spaces - the form the first draft missed'],

  // --- NOT online-only. A cross-model pass found "no premises" here, and it
  // was right: a mobile trader has no shopfront and a real service area, and
  // treating that as an online product reduces the disclosures a local trader
  // owes. Not having premises and not having a service area are different facts.
  ['Sole trader, operating out of my home, no premises for customers', 'unincorporated', false, 'REAL - mobile trader'],
  ['limited company building scaffolding platforms', 'incorporated', false, 'REAL - platforms are physical here'],

  // --- question 0 answer (c)
  ['fictional demo brand, not a real trading entity', null, true, 'demo, in the Entity type cell'],
  
  ['invented for this demonstration', null, true, 'invented'],
  ['personal portfolio site, no business behind it', null, true, 'portfolio, with its noun'],

  // --- NOT demos. Every one of these is a real business whose entity cell
  // happens to contain a word question 0 uses as a category label. All five
  // were classified as demos by the first draft, which would have switched off
  // a real business's trader-disclosure gates and then blocked it for failing
  // to declare a fiction it was not.
  ['sole trader, personal liability, no company', 'unincorporated', false, 'REAL - personal liability'],
  ['sole trader; the owner takes personal responsibility for the work', 'unincorporated', false, 'REAL - personal responsibility'],
  ['limited company; personal guarantee given to the bank', 'incorporated', false, 'REAL - personal guarantee'],
  ['sole trader offering a personal training service', 'unincorporated', false, 'REAL - personal trainer'],
  ['limited company with a portfolio of six rental properties', 'incorporated', false, 'REAL - property portfolio'],
  ['sole trader; sends a fabric sample with every quote', 'unincorporated', false, 'REAL - sells samples'],
];

export function runCases() {
  const out = [];
  for (const [entity, form, isDemo, note] of CASES) {
    const r = resolveRegime(row(entity));
    out.push({
      entity, note,
      formOk: r.form === form, gotForm: r.form, wantForm: form,
      demoOk: r.isDemo === isDemo, gotDemo: r.isDemo, wantDemo: isDemo,
    });
  }

  // A demo declared in the ledger's opening paragraph counts, even when the
  // Entity type cell is about something else. Reading only the cell is how a
  // clearly-labelled demo still failed as a real business.
  const preambleOnly = resolveRegime(row(
    'brand with no premises',
    '> **This business is invented.** It is a demonstration build.'));
  out.push({ entity: '(declared in the preamble, not the cell)', note: 'preamble',
    formOk: true, gotForm: preambleOnly.form, wantForm: preambleOnly.form,
    demoOk: preambleOnly.isDemo === true, gotDemo: preambleOnly.isDemo, wantDemo: true });

  return out;
}

/** The reserved ranges must be recognised in every shipped country's format. */
export const RESERVED = [
  ['(613) 555-0147', true, 'NANPA, Canada'],
  // The tel: href forms. A number written for a machine has no word boundary
  // before the 555, and the anchored pattern could not see it - so the gate
  // that catches a demo publishing a LIVE number reported the RESERVED one as
  // live. Found on the third pass over the same two builds.
  ['tel:+16135550147', true, 'NANPA as a tel: href'],
  ['+441632960442', true, 'UK drama as an international tel: href'],
  ['tel:01632960442', true, 'UK drama, no spaces'],
  ['+61855504412', true, 'ACMA geographic as a tel: href'],
  ['tel:+61491570156', false, 'an ACMA mobile is an enumerated list, not a range - see au.mjs'],
  ['555-0100', true, 'NANPA, bare'],
  ['+1 212 555 0199', true, 'NANPA, international format'],
  ['01632 960123', true, 'Ofcom geographic catch-all'],
  ['07700 900456', true, 'Ofcom mobile'],
  ['(02) 5550 1234', true, 'ACMA NSW/ACT'],
  ['08 7010 4321', true, 'ACMA, the range the profile used to omit'],
  // Must NOT fire on real numbers, or the gate blocks every honest build.
  ['(613) 236 1000', false, 'a real Ottawa number shape'],
  ['tel:+16132361000', false, 'a real Ottawa number as a tel: href'],
  ['tel:+441271860442', false, 'a real Barnstaple number as a tel: href - the fixture shipped this'],
  ['01271 860442', false, 'a real UK number shape'],
  ['555-1212', false, 'directory assistance — NOT in the fictional-safe range'],
  ['(02) 9374 4000', false, 'a real Sydney number shape'],
];

export function runReserved() {
  return RESERVED.map(([text, should, note]) => {
    const fired = isReservedFictionNumber(text);
    return { text, note, should, fired, ok: fired === should };
  });
}

if (process.argv[1] && process.argv[1].endsWith('regime-cases.mjs')) {
  let bad = 0;
  console.log('\nproject regime — question 0, resolved for every family\n');
  for (const r of runCases()) {
    const ok = r.formOk && r.demoOk;
    if (!ok) bad++;
    console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${String(r.gotForm).padEnd(15)}${r.gotDemo ? 'demo  ' : '      '}${r.note.padEnd(34)} "${r.entity.slice(0, 46)}"`);
    if (!r.formOk) console.log(`          wanted form ${r.wantForm}, got ${r.gotForm}`);
    if (!r.demoOk) console.log(`          wanted isDemo ${r.wantDemo}, got ${r.gotDemo}`);
  }
  console.log('\nreserved fiction numbers — required on a demo, forbidden on a real site\n');
  for (const r of runReserved()) {
    if (!r.ok) bad++;
    console.log(`  ${r.ok ? 'ok  ' : 'FAIL'}  ${r.should ? 'reserved' : 'real    '}  ${r.text.padEnd(18)} ${r.note}`);
  }
  console.log(bad ? `\n  ${bad} mismatch(es)\n` : '\n  all regime cases correct\n');
  process.exit(bad ? 1 : 0);
}
