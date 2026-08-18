#!/usr/bin/env node
// sitewright — the checker's own test.
//
//   node checks/selftest.mjs
//
// Answers the only question that matters about a quality gate: how do you know
// it isn't just printing PASS? It runs the full checker against two fixtures
// and asserts BOTH directions:
//
//   examples/negative-control  must FAIL, and must trip every gate listed below
//   examples/clean-control     must PASS with zero blockers
//
// A gate that never fires on the negative control is reported as UNPROVEN. That
// is not a warning — it means that gate is currently decoration, and it should
// be treated as broken until either the fixture gains a trigger or the rule is
// fixed. The failure this whole repo exists to prevent is a probe that cannot
// fail, and a checker gets to hold itself to that first.
//
// Exit: 0 all proven and both fixtures behaved · 1 otherwise.

import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// Gates that CANNOT be proven by a static fixture, each with the reason. This
// list is the honest edge of the test: every entry is a gate whose trigger
// cannot exist in the same fixture as the others, or needs state a file cannot
// hold. Adding to it should feel expensive.
const UNPROVABLE = {
  'facts/unsourced-price|blocker': 'needs a facts.md present but incomplete; covered by the facts fixture below',
  'facts/unsourced-phone|blocker': 'same',
  'facts/unsourced-email|blocker': 'same',
  'facts/unsourced-address|blocker': 'same',
  'facts/unsourced-hours|major': 'same',
  'facts/unsourced-number|major': 'same',
  'facts/testimonial-unsourced|blocker': 'same',
  'facts/needs-unresolved|blocker': 'same',
  'seo/noindex-shipped|blocker': 'a noindex fixture would suppress the page from the other gates it also serves',
  'seo/og-image-exists|major': 'requires an og:image that resolves AND one that does not, in the same file',
  'seo/structured-data-valid|major': 'requires a JSON-LD block, which would satisfy seo/structured-data',
  'legal/consent-reject-parity|major': 'requires a consent banner, which would satisfy legal/consent-banner',
  'security/env-file-shipped|blocker': 'would mean committing a fake .env to the repo',
  'a11y/autoplay|major': 'needs a media element the fixture has no other use for',
  'integrity/case-sensitive-path|major': 'cannot be created on a case-insensitive filesystem',
  'integrity/mixed-content|blocker': 'an http subresource would be flagged by security/http-link too; kept distinct on purpose',
  'design/uniform-rhythm|minor': 'requires 4+ section rules sharing one padding token, which fights design/spacing-scale',
  'perf/unpurged-css|minor': 'would mean committing a 250 KB stylesheet to the repo',
  'perf/image-weight|major': 'would mean committing a 1 MB image to the repo',
  'perf/image-format|minor': 'same',
  'perf/lazy-lcp|major': 'would need loading=lazy on the first image, which contradicts perf/lazy-loading in one file',
  'perf/font-weights|minor': 'needs 5+ @font-face rules pointing at font files the repo does not ship',
  'copy/sentence-rhythm|minor': 'needs 25+ sentences of uniformly-lengthed prose',
  'copy/heading-shape|minor': 'needs 6+ headings of one grammatical shape',
  'perf/lazy-loading|minor': 'needs 4+ images over 30 KB, i.e. binaries this repo will not carry',
  'integrity/contact-route|blocker': 'fires only when NO page on the site has any contact route; the fixture needs contact details for the facts and legal gates, and the two cannot share a site',
  'security/csp|minor': 'fires only when a _headers file EXISTS but omits a CSP; adding one would silence security/no-headers, which is the more important finding of the two',
};

function run(args) {
  const r = spawnSync(process.execPath, [join(here, 'run.mjs'), ...args], {
    cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  });
  if (r.error) throw r.error;
  let json = null;
  try { json = JSON.parse(r.stdout); } catch { /* non-json mode */ }
  return { code: r.status, json, stdout: r.stdout, stderr: r.stderr };
}

let failures = 0;
const say = (ok, msg) => {
  if (!ok) failures++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'}  ${msg}`);
};

console.log('\nsitewright selftest\n');

// ---------------------------------------------------------------- negative
console.log('negative control — must fail loudly');
const neg = run(['examples/negative-control', '--json', '--no-color']);
say(neg.code === 1, `exit code 1 (got ${neg.code})`);
say(neg.json?.verdict === 'FAIL', `verdict FAIL (got ${neg.json?.verdict})`);
say((neg.json?.counts.blocker || 0) >= 15,
  `at least 15 blockers (got ${neg.json?.counts.blocker})`);

// ---------------------------------------------------------------- facts
console.log('\nfacts fixture — provenance gates must fire');
const facts = run(['examples/negative-control', '--json', '--no-color',
  '--facts', 'examples/negative-control-facts.md', '--only', 'facts']);
const factFindings = facts.json?.findings || [];
const factGates = new Set(factFindings.map((f) => f.gate));
for (const g of ['facts/unsourced-price', 'facts/unsourced-phone', 'facts/unsourced-email',
                 'facts/unsourced-address', 'facts/unsourced-number',
                 'facts/testimonial-unsourced', 'facts/needs-unresolved']) {
  say(factGates.has(g), `${g} fired`);
}

// ---------------------------------------------------------------- clean
console.log('\nclean control — must pass');
const clean = run(['examples/clean-control', '--json', '--no-color',
  '--facts', 'examples/clean-control/facts.md']);
say(clean.code === 0, `exit code 0 (got ${clean.code})`);
say(clean.json?.verdict === 'PASS', `verdict PASS (got ${clean.json?.verdict})`);
if (clean.json && clean.json.counts.blocker > 0) {
  for (const f of clean.json.findings.filter((x) => x.severity === 'blocker')) {
    console.log(`        unexpected blocker: ${f.gate} — ${f.message} (${f.file || '-'})`);
  }
}

// ------------------------------------------------------------- dishonest
//
// THE FIXTURE THE CRITIQUE DEMANDED, and the one that actually tests the
// product claim. The negative control proves the checker catches an obviously
// broken site. It never proved the checker catches a PLAUSIBLE one: correct
// markup, valid legal pages, real structure, and every business fact invented.
// That is the site a model actually produces, and it is the only thing this
// repo claims to be uniquely good at stopping.
console.log('\ndishonest-but-craftsmanlike control — must FAIL on provenance');
const dishonest = run(['examples/dishonest-control', '--json', '--no-color',
  '--facts', 'examples/dishonest-control/facts.md']);
say(dishonest.code === 1, `exit code 1 (got ${dishonest.code})`);
const dishonestGates = new Set((dishonest.json?.findings || []).map((f) => f.gate));
for (const g of ['facts/unsourced-price', 'facts/row-unsourced', 'facts/href-mismatch']) {
  say(dishonestGates.has(g), `${g} fired on a site that looks entirely professional`);
}

// ------------------------------------------------------------------ bare
//
// Three BLOCKER paths cannot share a fixture with their own siblings:
// legal/privacy-policy fires only when NO privacy page exists (negative-control
// needs one to test footer-links and stale-date), and facts/ledger-unstructured
// needs a facts.md that is not a table (every other facts gate needs one that
// is). Rather than write them off as unprovable, they get a file.
console.log('\nbare control — the three blocker paths that need their own fixture');
const bare = run(['examples/bare-control', '--json', '--no-color',
  '--facts', 'examples/bare-control/facts.md']);
say(bare.code === 1, `exit code 1 (got ${bare.code})`);
const bareGates = new Set((bare.json?.findings || []).map((f) => f.gate));
for (const g of ['legal/privacy-policy', 'facts/ledger-unstructured', 'copy/em-dash']) {
  say(bareGates.has(g), `${g} fired`);
}

// ---------------------------------------------------------------- coverage
//
// KEYED ON gate + SEVERITY, and that is the whole point of this section.
//
// An F3 critique mutation-tested the previous version: it replaced the
// dead-contact-form condition in integrity.mjs with `if (false)` — deleting the
// BLOCKER branch of the gate the integrity family says it exists for above all
// others — and this file printed "All assertions passed" and "84% coverage".
// The MINOR branch of the same gate id kept it alive.
//
// Ten gates emit two severities under one id. Keying on the id alone means any
// of their blocking branches can be removed silently, which is the exact
// mechanism by which a gate becomes theatre.
console.log('\ngate coverage — every gate+severity must be provably able to fail');
const listed = run(['--list']);
const allGates = [...listed.stdout.matchAll(/^\s{2}(\S+\/\S+)\s+(\w+)\s/gm)]
  .map((m) => ({ id: m[1], severity: m[2] }));
const declaredKeys = allGates.map((g) => `${g.id}|${g.severity}`);

const firedKeys = new Set([
  ...(neg.json?.findings || []).map((f) => `${f.gate}|${f.severity}`),
  ...factFindings.map((f) => `${f.gate}|${f.severity}`),
  ...(dishonest.json?.findings || []).map((f) => `${f.gate}|${f.severity}`),
  ...(bare.json?.findings || []).map((f) => `${f.gate}|${f.severity}`),
]);

const unproven = declaredKeys.filter((k) => !firedKeys.has(k) && !UNPROVABLE[k]);
say(allGates.length > 0, `${allGates.length} gates registered`);
say(unproven.length === 0,
  unproven.length === 0
    ? `every declared gate+severity fired on a fixture, or is documented`
    : `${unproven.length} gate+severity pair(s) never fired and are not documented:\n        ${unproven.join('\n        ')}`);

// PHANTOM GATE CHECK. A gate declared in a family's gates[] array but never
// passed to report.add() anywhere in that family is a gate that cannot fire at
// all — it exists only in --list and in the coverage denominator.
console.log('\nphantom gates — every declared id must appear as a report.add argument');
const phantoms = [];
for (const fam of readdirSync(join(here, 'rules')).filter((f) => f.endsWith('.mjs'))) {
  const src = readFileSync(join(here, 'rules', fam), 'utf8');
  for (const m of src.matchAll(/id:\s*'([^']+)'/g)) {
    // Counted, not string-matched against `report.add('<id>'`: several gates are
    // reported through a variable (a gateId ternary, an EXTRACTORS table), which
    // is legitimate. A declared id that appears exactly ONCE in the file appears
    // only in gates[] — it is in --list and in the coverage denominator and
    // nothing can ever emit it.
    const uses = src.split(`'${m[1]}'`).length - 1;
    if (uses < 2) phantoms.push(`${fam}: ${m[1]}`);
  }
}
say(phantoms.length === 0,
  phantoms.length === 0 ? 'no phantom gates' : `declared but never reported: ${phantoms.join(', ')}`);

// MANUAL.md COVERAGE. The README claims every gate has a written manual
// equivalent. That claim drifted from 41-of-122 to 45-of-126 in a single day
// while nothing checked it, so now something does.
console.log('\nMANUAL.md — the no-Node fallback must cover every gate');
const manual = readFileSync(join(root, 'checks', 'MANUAL.md'), 'utf8');
const undocumented = allGates.map((g) => g.id).filter((id) => !manual.includes(id));
say(undocumented.length === 0,
  undocumented.length === 0
    ? `all ${allGates.length} gates appear in MANUAL.md`
    : `${undocumented.length} gate(s) missing from MANUAL.md: ${undocumented.slice(0, 8).join(', ')}${undocumented.length > 8 ? ` +${undocumented.length - 8} more` : ''}`);

const documented = Object.keys(UNPROVABLE).filter((k) => declaredKeys.includes(k));
const pct = Math.round((firedKeys.size / declaredKeys.length) * 100);
console.log(`\n  ${firedKeys.size} gate+severity pairs proven by fixture · ${documented.length} documented as not statically provable`);
console.log(`  coverage: ${pct}% of ${declaredKeys.length} declared pairs have a live negative control`);

// Written to disk so README numbers are DERIVED rather than typed. They were
// typed, and they were stale within a day.
writeFileSync(join(root, 'checks', 'coverage.json'), JSON.stringify({
  gates: allGates.length,
  declaredPairs: declaredKeys.length,
  provenPairs: firedKeys.size,
  documentedUnprovable: documented.length,
  coveragePercent: pct,
  families: 10,
}, null, 2) + '\n');
console.log('  (written to checks/coverage.json — README numbers come from here)\n');

if (failures) {
  console.log(`${failures} assertion(s) failed.\n`);
  process.exit(1);
}
console.log('All assertions passed.\n');
