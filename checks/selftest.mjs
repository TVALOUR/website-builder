#!/usr/bin/env node
// website-builder — the checker's own test.
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
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
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
  'facts/unsourced-hours|blocker': 'same',
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

console.log('\nwebsite-builder selftest\n');

// ---------------------------------------------------------------- negative
console.log('negative control — must fail loudly');
const neg = run(['examples/negative-control', '--profile', 'uk', '--json', '--no-color']);
say(neg.code === 1, `exit code 1 (got ${neg.code})`);
say(neg.json?.verdict === 'FAIL', `verdict FAIL (got ${neg.json?.verdict})`);
say((neg.json?.counts.blocker || 0) >= 15,
  `at least 15 blockers (got ${neg.json?.counts.blocker})`);

// ---------------------------------------------------------------- facts
console.log('\nfacts fixture — provenance gates must fire');
const facts = run(['examples/negative-control', '--profile', 'uk', '--json', '--no-color',
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
const clean = run(['examples/clean-control', '--profile', 'uk', '--json', '--no-color',
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
const dishonest = run(['examples/dishonest-control', '--profile', 'uk', '--json', '--no-color',
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
const bare = run(['examples/bare-control', '--profile', 'uk', '--json', '--no-color',
  '--facts', 'examples/bare-control/facts.md']);
say(bare.code === 1, `exit code 1 (got ${bare.code})`);
const bareGates = new Set((bare.json?.findings || []).map((f) => f.gate));
for (const g of ['legal/privacy-policy', 'facts/ledger-unstructured', 'copy/em-dash']) {
  say(bareGates.has(g), `${g} fired`);
}

// ---------------------------------------------------------------- assets
//
// The asset family's negative control. `facts.md` made every CLAIM traceable;
// this proves the same discipline reaches every FILE — that an image with no
// recorded origin, no rights answer, or a generated subject nobody may generate,
// cannot reach a page.
console.log('\nassets control — every asset provenance gate must fire');
const assetsFx = run(['examples/assets-control/site', '--profile', 'uk', '--only', 'assets',
  '--json', '--no-color']);
say(assetsFx.code === 1, `exit code 1 (got ${assetsFx.code})`);
const assetGates = new Set((assetsFx.json?.findings || []).map((f) => f.gate));
for (const g of ['assets/unmanifested', 'assets/rights-unrecorded', 'assets/source-unrecorded',
                 'assets/generated-not-permitted', 'assets/generated-forbidden-subject',
                 'assets/generated-undeclared', 'assets/file-missing', 'assets/alt-unrecorded',
                 'assets/intake-unused']) {
  say(assetGates.has(g), `${g} fired`);
}

// ---------------------------------------------------------------- managed build
//
// The two gates that only bind INSIDE a build this repo produced. The same site
// audited from outside builds/ reports both as observations, because a
// third-party site never agreed a motion policy and was never going to have an
// asset manifest — and a blocker that fires on every external audit is a reason
// to stop running the tool. This fixture proves the managed half; the external
// half is proven by their absence from the negative control.
console.log('\nmanaged build — the policy gates bind inside builds/, not outside');
const managed = run(['examples/managed-control/site', '--profile', 'uk', '--only', 'assets,design,discovery',
  '--json', '--no-color']);
say(managed.code === 1, `exit code 1 (got ${managed.code})`);
const managedGates = new Set((managed.json?.findings || [])
  .filter((f) => f.severity === 'blocker').map((f) => f.gate));
say(managedGates.has('assets/manifest-exists'), 'assets/manifest-exists blocks inside a build');
say(managedGates.has('design/motion-policy'), 'design/motion-policy blocks inside a build');
// The discovery family exists so stage 01 is enforced by the ONE command every
// harness runs, not only by the Claude hook. This fixture has a STATE.md and no
// brief at all, which is the shape of a build that skipped the interview.
say(managedGates.has('discovery/brief-incomplete'),
  'discovery/brief-incomplete blocks a build with no brief — on every harness, not just Claude Code');
const managedAll = new Set((managed.json?.findings || []).map((f) => f.gate));
say(managedAll.has('discovery/no-manifest'), 'discovery/no-manifest flags a build that never ran the asset scan');

const audited = run(['examples/negative-control', '--profile', 'uk', '--only', 'assets,design,discovery',
  '--json', '--no-color']);
const auditedBlockers = new Set((audited.json?.findings || [])
  .filter((f) => f.severity === 'blocker').map((f) => f.gate));
say(!auditedBlockers.has('design/motion-policy'),
  'and NOT outside one — an audited third-party site is not blocked for animating');
say(!auditedBlockers.has('assets/manifest-exists'),
  'nor for having no manifest it was never going to have');
say(!auditedBlockers.has('discovery/brief-incomplete'),
  'nor for having no brief — an audited site was never interviewed by us');

// ---------------------------------------------------------------- jurisdiction
//
// The regression this proves cannot be seen in a fixture's files: it is the
// SHAPE of the failure. A profile that does not exist used to be a `skip`,
// legal.mjs early-returned on the empty object, and a site with no privacy
// policy and a tracker firing on load printed PASS. A missing jurisdiction must
// FAIL, and it must fail loudly enough that nobody reads the gate count as
// coverage.
console.log('\nmissing jurisdiction — must blocker, never silently degrade');
const noJuris = run(['examples/clean-control', '--profile', 'atlantis', '--json', '--no-color',
  '--facts', 'examples/clean-control/facts.md']);
say(noJuris.code === 1, `exit code 1 on an unknown profile (got ${noJuris.code})`);
const noJurisGates = new Set((noJuris.json?.findings || []).map((f) => f.gate));
say(noJurisGates.has('legal/jurisdiction'), 'legal/jurisdiction fired');
say((noJuris.json?.gatesSkipped || []).some((sk) => /legal/.test(sk.gate)),
  'the legal family reported itself as NOT RUN rather than passing');

// The international baseline must load, must run, and must say what it is —
// an honesty floor that names no statute — rather than quietly behaving like a
// country.
console.log('\nintl-baseline — loads, runs, and declares its own limits');
const intl = run(['examples/clean-control', '--profile', 'intl-baseline', '--json', '--no-color',
  '--facts', 'examples/clean-control/facts.md']);
say(intl.code === 0, `exit code 0 (got ${intl.code})`);
const intlGates = new Set((intl.json?.findings || []).map((f) => f.gate));
say(intlGates.has('legal/local-rule'), 'legal/local-rule fired — the profile surfaced its own caveat');
// The provenance label is structured data on the report and is rendered ABOVE
// the findings, so this asserts the field rather than a skip line — the whole
// point of moving it was that a dim line below the findings was not being read.
say(intl.json?.provenance?.status === 'baseline',
  `the report carries the profile's provenance status (got ${intl.json?.provenance?.status})`);
say(!/UNVERIFIED|researched/i.test(intl.stdout || ''),
  'and does not call a deliberately-neutral baseline "researched"');

// ------------------------------------------------------------------ sector
//
// The trade axis. Four managed fixtures, one per shape of failure, because the
// shapes genuinely cannot share a folder: a build cannot both declare a sector
// and fail to declare one.
//
// The assertion that matters most is the last one. Every page in
// `sector-control/declared/` is well-formed, honest and unremarkable to the
// other twelve families, and it breaches three rules its own regulator writes
// about websites. If the sector family stops firing, that fixture goes quiet
// and nothing else notices — which is the condition this block exists to make
// impossible.
console.log('\nsector — trade duties the jurisdiction layer said it could not know');
const sectorDeclared = run(['examples/sector-control/declared/site', '--profile', 'uk', '--json', '--no-color',
  '--facts', 'examples/sector-control/declared/facts.md']);
const sectorProhibited = run(['examples/sector-control/prohibited/site', '--profile', 'uk', '--json', '--no-color',
  '--facts', 'examples/sector-control/prohibited/facts.md']);
const sectorUndeclared = run(['examples/sector-control/undeclared/site', '--profile', 'uk', '--json', '--no-color',
  '--facts', 'examples/sector-control/undeclared/facts.md']);
const sectorUnknown = run(['examples/sector-control/unknown/site', '--profile', 'uk', '--json', '--no-color',
  '--facts', 'examples/sector-control/unknown/facts.md']);

const gatesOf = (r) => new Set((r.json?.findings || []).map((f) => f.gate));
const declaredGates = gatesOf(sectorDeclared);
say(declaredGates.has('sector/disclosure-missing'), 'sector/disclosure-missing fired — a solicitor with no statement of regulated status');
say(declaredGates.has('sector/page-missing'), 'sector/page-missing fired — no complaints procedure, no published costs');
say(declaredGates.has('sector/number-unsourced'), 'sector/number-unsourced fired — an SRA number tracing to nothing');
say(declaredGates.has('sector/register-link'), 'sector/register-link fired — a number nobody can check in one click');
say(declaredGates.has('sector/human-confirm'), 'sector/human-confirm fired — the duties no static reader can decide');
say(gatesOf(sectorProhibited).has('sector/prohibited-content'),
  'sector/prohibited-content fired — a prescription only medicine named and priced');
say(gatesOf(sectorUndeclared).has('sector/undeclared'),
  'sector/undeclared fired — a physiotherapy site whose build never named a trade');
say(gatesOf(sectorUnknown).has('sector/unknown'),
  'sector/unknown fired — a Sector row naming a file that does not exist');
say((sectorUnknown.json?.findings || []).some((f) => /dog-grooming/.test(f.message || '')),
  'the unknown-sector finding names the id it could not find');

// THE POINT OF THE WHOLE AXIS, asserted rather than described.
{
  const blockers = (sectorDeclared.json?.findings || []).filter((f) => f.severity === 'blocker');
  const fromSector = blockers.filter((f) => f.gate.startsWith('sector/'));
  say(fromSector.length > 0,
    `the solicitor fixture produces ${fromSector.length} sector blocker(s) alongside `
    + `${blockers.length - fromSector.length} from the other twelve families — trade duties are additive, not a relabelling`);
}

// ---------------------------------------------------------------- citations
//
// The citation gate has to be able to fail, for the same reason every other
// gate here does — and it has three failure modes worth proving, because all
// three were live defects rather than hypotheticals.
//
//   1. `class` was read by the loader, printed in the report, and set on 2 of
//      125 rows. The primary-source rate everyone quoted was hand-counted from
//      prose and disagreed with the code.
//   2. The class was self-certified, so nothing stopped a law-firm bulletin
//      being labelled `primary` and inflating that rate.
//   3. Nothing checked whether a profile had ANSWERED a question. The Canadian
//      profile called accessibility "best practice, not law" while omitting the
//      only statute that reaches a small business — silently, because silence
//      has no gate.
console.log('\ncitation gate — sourcing must be checkable, not asserted');
const cites = spawnSync(process.execPath, [join(here, 'citations.mjs'), '--json'],
  { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
let citesJson = null;
try { citesJson = JSON.parse(cites.stdout); } catch { /* handled below */ }
say(citesJson !== null, 'checks/citations.mjs produces parseable --json');
say(cites.status === 0,
  `exit code 0 on the shipped profiles (got ${cites.status})`);
const researched = (citesJson?.summary || []).filter((r) => r.status === 'researched');
say(researched.length >= 5, `at least five researched profiles measured (got ${researched.length})`);
say(researched.every((r) => r.sources > 0 && r.loadBearing !== null),
  'every researched profile reports a computed primary-or-regulator count');

// The rate has to come from the data, not from a comment. If a profile's
// sources are unclassified the tool must say so rather than print a number.
{
  const tmp = join(root, 'tmp', 'selftest-profiles');
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  // A profile whose only citation is a law firm, self-certified as primary, and
  // whose coverage map is empty. Every one of the three defects, in one file.
  writeFileSync(join(tmp, 'atlantis.mjs'), `export default {
  id: 'atlantis', name: 'Atlantis', country: 'Atlantis', iso2: 'AT',
  provenance: { status: 'researched', verifiedBy: null,
    lawLastVerified: '2026-08-19', nextReview: '2027-02-19',
    sources: [{ claim: 'everything', url: 'https://www.ashurst.com/insight', accessed: '2026-08-19', class: 'primary' }],
    caveats: [] },
  locale: {}, legal: {}, seo: {},
};\n`);
  const bad = spawnSync(process.execPath, [join(here, 'citations.mjs'), '--json'],
    { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
      env: { ...process.env, WEBSITE_BUILDER_PROFILES_DIR: tmp } });
  let badJson = null;
  try { badJson = JSON.parse(bad.stdout); } catch { /* asserted below */ }
  const gates = new Set((badJson?.findings || []).map((f) => f.gate));
  say(bad.status === 1, `a bad profile exits 1 (got ${bad.status})`);
  say(gates.has('citations/class-mismatch'),
    'citations/class-mismatch fires when a law-firm URL is labelled primary');
  say(gates.has('citations/coverage-missing'),
    'citations/coverage-missing fires when a profile answers none of the seven questions');
  say(gates.has('citations/notes-missing'),
    'citations/notes-missing fires when a researched profile has no working notes');
  rmSync(tmp, { recursive: true, force: true });
}

// ---------------------------------------------------------------- brief gate
//
// Stage 01 is the stage this whole repo exists for, and it was the one stage
// with no machine check at all. These two assertions are the floor: the
// template skeleton must NOT pass (it is placeholders), and a build folder with
// no brief at all must not be mistaken for a clean one.
console.log('\nbrief gate — discovery must be checkable, not just documented');
const briefOnTemplate = spawnSync(process.execPath,
  [join(here, 'brief.mjs'), join(root, 'templates'), '--json'],
  { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
say(briefOnTemplate.status === 1, `the unfilled brief template fails the check (got ${briefOnTemplate.status})`);
let briefJson = null;
try { briefJson = JSON.parse(briefOnTemplate.stdout); } catch { /* asserted below */ }
say(!!briefJson && briefJson.ok === false, 'and reports ok:false with the sections to fill');
say(!!briefJson && (briefJson.thinSections || []).some((t) => t.reason === 'placeholder'),
  'placeholders are named as placeholders, not as short prose');

const briefMissing = spawnSync(process.execPath,
  [join(here, 'brief.mjs'), join(root, 'examples'), '--json'],
  { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
say(briefMissing.status === 2, `a folder with no brief.md exits 2, not 0 (got ${briefMissing.status})`);

// And the cases that decide whether the gate is real: 277 words of lorem ipsum
// with one keyword-bait line used to PASS it, while a genuinely thorough
// 900-word brief failed with twelve sections reported "not there at all".
{
  const { runBriefCases, CASES: BRIEF_CASES } = await import('./brief-cases.mjs');
  for (const r of runBriefCases()) {
    say(r.ok, `${r.name} ${r.expected ? 'PASSES' : 'FAILS'} the discovery gate  (${r.detail})`);
  }
  say(BRIEF_CASES.length >= 4, `${BRIEF_CASES.length} brief cases exercised`);
}

// ---------------------------------------------------------- motion gate
//
// The false-positive half of the motion gate, run as part of the suite rather
// than as something somebody remembers. Every "must NOT block" case in there is
// real code an earlier version stopped a ship on — a rAF-debounced resize
// handler, a JS comment saying the client did NOT want scroll reveals, CSS whose
// keyframes were commented out because the client asked for no movement.
console.log('\nmotion gate — false positives and true positives');
{
  const { runMotionCases, CASES: MOTION_CASES } = await import('./motion-cases.mjs');
  for (const r of runMotionCases()) {
    const want = r.expected === 'flag' ? 'is flagged' : r.expected ? 'blocks' : 'does NOT block';
    say(r.ok, `${r.name} ${want}${r.ok ? '' : ` <- ${r.severities.join(' | ') || 'no finding'}`}`);
  }
  say(MOTION_CASES.length >= 14, `${MOTION_CASES.length} motion cases exercised`);
}

// ---------------------------------------------------------- asset gate
//
// Not "can each gate fire" — that is examples/assets-control/ — but "can the
// gate be walked around". Every must-be-caught case is a real bypass an earlier
// version shipped.
console.log('\nasset provenance — laundering routes and false positives');
{
  const { runAssetCases, CASES: ASSET_CASES } = await import('./asset-cases.mjs');
  for (const r of runAssetCases()) {
    say(r.ok, `${r.name} ${r.expected ? 'is caught' : 'is allowed'}${r.ok ? '' : ` <- ${r.detail.join(' | ') || 'nothing found'}`}`);
  }
  say(ASSET_CASES.length >= 10, `${ASSET_CASES.length} asset cases exercised`);
}

// ------------------------------------------------ the fixture's own prose
//
// NOTES.md explains why the reference build reports the majors it reports, and
// the README quotes that number. It said "two" after the second one had stopped
// firing, and nothing re-read it — the sixth instance of a claim about the code
// going stale in prose. The number in the heading now fails with the fixture.
console.log('\nNOTES.md — the number it claims must be the number the fixture produces');
{
  const notes = readFileSync(join(root, 'examples', 'clean-control', 'NOTES.md'), 'utf8');
  const claimed = /reports\s+(\d+|one|two|three|no)\s+majors?/i.exec(notes);
  const words = { no: 0, one: 1, two: 2, three: 3 };
  const n = claimed ? (words[claimed[1].toLowerCase()] ?? Number(claimed[1])) : null;
  const actual = clean.json?.counts?.major || 0;
  say(claimed !== null, 'NOTES.md states a major count in its heading');
  say(n === actual, `NOTES.md claims ${n} major(s); the fixture reports ${actual}`);
}

// --------------------------------------------- plain English must be enough
//
// A privacy page written the way a person talks, covering every ground any
// shipped profile asks for. Every profile's `mustMention` patterns must find
// what they are looking for in it.
//
// WHAT a jurisdiction requires is local law and rightly differs between
// profiles. HOW HARD IT IS TO SAY IT is not, and this is a check that no
// profile has quietly become a vocabulary test. It exists because two did:
// `ca` demanded the literal phrase "privacy officer" while the statute's own
// term is "person in charge of the protection of personal information", and
// `au` demanded a verb-noun collocation ("correct your information") where
// four other profiles accept the bare word — so one honest page passed in four
// countries and failed in the fifth, for no reason in that country's law.
//
// A gate that demands a form of words is a gate people satisfy by pasting in
// boilerplate, which is the exact opposite of what these are for.
console.log('\nplain English — no profile may require a form of words');
{
  const PLAIN = `
    Privacy. Last reviewed August 19, 2026.
    Who we are: Kingswell Awnings Pty Ltd, Adelaide. Ray Kingswell is accountable for privacy
    here and is the person in charge of the protection of personal information. Ring him on
    (08) 5550 4412 or contact us at office@example.example.
    What personal information we collect: nothing automatic. No analytics and no cookies. If you
    ring or email, we hold your name, your number and what you told us about the job, so that we
    can quote it and do it. That is what we use it for, and consent is the basis for it.
    We do not disclose anything overseas or outside Australia; nothing goes to a foreign recipient.
    We keep job records for seven years and delete a dead quote within twelve months — that is how
    long we keep it.
    Your rights: you can ask what we hold, ask for a copy, ask us to correct it, and withdraw your
    consent. If you are in Quebec you can also ask for it in a portable format (portability).
    If you are not happy, complain to the OAIC, the Office of the Australian Information
    Commissioner, the Information Commissioner, the Privacy Commissioner, the privacy commissioner
    of Canada at priv.gc.ca, the Commission d'acces a l'information, or the ICO. The right to
    complain is yours either way, and the supervisory authority will hear it.
    Cookies: this site sets none. Nothing identifies, locates or profiles you, nothing is strictly
    necessary because there is nothing to remember, and there is no consent to withdraw — no
    cookies are set at all, so there is nothing to opt out of or deactivate. How long each cookie
    lasts is therefore not a question: none is set. Where the data goes: nowhere; it is not
    transferred, and there is no transfer safeguard to describe because nothing leaves.
    Legal basis and lawful basis: your consent, and our legitimate interests in replying to you.
    Do Not Track: this site does not respond to Do Not Track signals because it does not track.
  `;
  const { listProfiles, loadProfile } = await import('./lib/profile.mjs');
  for (const name of listProfiles()) {
    const { profile } = loadProfile(name);
    const must = profile?.legal?.pages?.privacy?.mustMention || [];
    const misses = must.filter(([re]) => !re.test(PLAIN)).map(([, label]) => String(label).slice(0, 46));
    say(misses.length === 0,
      `${name.padEnd(14)} privacy mustMention all satisfied by plain English`
      + (misses.length ? ` <- demands wording for: ${misses.join(' | ')}` : ''));
  }
}

// ------------------------------------------------- the shipped config template
//
// `config.example.md` is the file stage 00 tells every new clone to copy. It
// shipped `- **Profile:** `uk`` four lines above its own sentence "There is no
// default", so a stranger who filled in their name and email and nothing else
// silently gated every build against UK law — including the Ohio client the
// README opens by describing. A probe, not a paragraph, because the paragraph
// was already there and was already being contradicted by the line above it.
console.log('\nconfig template — must not ship a country nobody chose');
{
  const flat = readFileSync(join(root, 'config.example.md'), 'utf8')
    .replace(/\*\*/g, '').replace(/__/g, '');
  const m = /^\s*(?:[-*]\s*)?Profile\s*:\s*`?([a-z0-9-]+)`?/im.exec(flat);
  say(!m, `config.example.md resolves to no profile (got ${m ? m[1] : 'none'})`);
  say(/no default/i.test(flat), 'and still says so in words');
}

// ---------------------------------------------------------------- regime
//
// Question 0's answer has to reach every family, and its vocabulary has to be
// the vocabulary of the six countries this repo ships. Both were false, and
// both were found by running a Canadian build rather than by reading the code:
// a declared fictional demo was blocked for using the reserved phone range that
// same declaration requires, and "sole proprietorship" — the standard term
// across North America — matched no entity pattern at all.
console.log('\nproject regime — question 0 must reach every family, in every country');
{
  const { runCases, runReserved, CASES: REGIME_CASES } = await import('./regime-cases.mjs');
  for (const r of runCases()) {
    say(r.formOk && r.demoOk,
      `${r.note.padEnd(32)} "${r.entity.slice(0, 44)}"`
      + (r.formOk && r.demoOk ? '' : ` <- form ${r.gotForm}/${r.wantForm}, demo ${r.gotDemo}/${r.wantDemo}`));
  }
  for (const r of runReserved()) {
    say(r.ok, `${r.should ? 'reserved' : 'real    '} number ${r.text.padEnd(17)} ${r.note}`);
  }
  say(REGIME_CASES.length >= 15, `${REGIME_CASES.length} entity-form cases exercised`);
}

// ------------------------------------------------------- policy reading
//
// The regression this locks down was invisible for exactly the reason it was
// dangerous: the reader matched `**Motion**: subtle` while the house format
// everywhere is `- **Motion:** subtle`, colon INSIDE the bold. So it read
// nothing, applied the safe default, and looked like it was working. Every
// build silently ignored its own declared policy.
console.log('\npolicy reading — the declared format must actually be read');
{
  const { mkdtempSync, writeFileSync: wf, mkdirSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { loadPolicy } = await import('./lib/policy.mjs');
  const cases = [
    ['- **Motion:** subtle\n- **Imagery:** generated-allowed\n', 'subtle', 'generated-allowed', 'colon inside the bold (the house format)'],
    ['- **Motion**: expressive\n- **Imagery**: generated-allowed\n', 'expressive', 'generated-allowed', 'colon outside the bold'],
    ['Motion: subtle\nImagery: generated-allowed\n', 'subtle', 'generated-allowed', 'no emphasis at all'],
    ['nothing relevant here\n', 'none', 'client-assets-only', 'absent — the safe defaults apply'],
  ];
  for (const [body, wantMotion, wantImagery, label] of cases) {
    const dir = mkdtempSync(join(tmpdir(), 'wb-policy-'));
    mkdirSync(join(dir, 'site'));
    wf(join(dir, 'brief.md'), `# Brief\n\n## Motion and imagery\n\n${body}`);
    const p = loadPolicy(join(dir, 'site'));
    say(p.motion === wantMotion && p.imagery === wantImagery,
      `${label} -> motion=${p.motion}, imagery=${p.imagery}`);
  }
}

// ---------------------------------------------------------- gate drift
//
// A PASS is a claim about a site AND about the ruleset that judged it. Add
// gates and yesterday's PASS is a statement nobody has re-checked. Not
// hypothetical: the reference build's verify.md said "136 gates ran … PASS"
// while the same command on the same unchanged files returned 149 and two
// blockers, and nothing noticed, because nothing re-ran.
//
// builds/ is gitignored, so in CI this is a no-op — it is a local guard for
// exactly the person changing the rules.
console.log('\ngate drift — a PASS on disk must still be a PASS under today\'s rules');
{
  const buildsDir = join(root, 'builds');
  let claimedPasses = 0;
  try {
    for (const d of readdirSync(buildsDir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      let verify = '';
      try { verify = readFileSync(join(buildsDir, d.name, 'verify.md'), 'utf8'); } catch { continue; }
      if (!/\bPASS\b/.test(verify)) continue;
      claimedPasses++;
      const args = [`builds/${d.name}/site`, '--json', '--no-color'];
      try { readFileSync(join(buildsDir, d.name, 'facts.md')); args.push('--facts', `builds/${d.name}/facts.md`); } catch { /* none */ }
      const again = run(args);
      const blockers = again.json?.counts?.blocker ?? -1;
      say(again.code === 0,
        blockers === 0
          ? `builds/${d.name}/ still passes under the current ruleset`
          : `builds/${d.name}/ claims PASS in verify.md but now has ${blockers} blocker(s) — `
            + 'a stale PASS is a false claim, not a stale file');
    }
  } catch { /* no builds/ — the CI case */ }
  if (!claimedPasses) console.log('  --    no build claims a PASS on disk (this is the CI case)');
}

// ------------------------------------------------------- claim patterns
//
// PRECISION, tested directly, plus COVERAGE across every profile.
//
// The patterns are shared by every jurisdiction, so a loose one is a false
// blocker in every country at once. Every "quiet" case in checks/claim-cases.mjs
// is real prose a shipped version flagged - including two sentences in which a
// business was DECLINING to make the claim it was reported as making.
//
// The coverage half exists because two profiles hand-rolled their own claim
// arrays, bypassing the shared patterns, and silently lost the environmental
// class entirely. Nothing noticed for as long as nothing checked.
console.log('\nclaim patterns — precision, and coverage across every profile');
{
  const { checkPrecision, checkCoverage } = await import('./claim-cases.mjs');
  for (const r of await checkPrecision()) {
    say(r.ok, `${r.key} ${r.shouldFire ? 'fires on' : 'stays quiet on'} "${r.text.slice(0, 58)}"`);
  }
  const { keys, rows } = await checkCoverage();
  for (const r of rows) {
    say(r.ok, `profile ${r.id} covers all ${keys.length} claim classes${r.ok ? '' : ` - MISSING ${r.missing.join(', ')}`}`);
  }
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
  ...(assetsFx.json?.findings || []).map((f) => `${f.gate}|${f.severity}`),
  ...(noJuris.json?.findings || []).map((f) => `${f.gate}|${f.severity}`),
  ...(intl.json?.findings || []).map((f) => `${f.gate}|${f.severity}`),
  ...(managed.json?.findings || []).map((f) => `${f.gate}|${f.severity}`),
  ...(sectorDeclared.json?.findings || []).map((f) => `${f.gate}|${f.severity}`),
  ...(sectorProhibited.json?.findings || []).map((f) => `${f.gate}|${f.severity}`),
  ...(sectorUndeclared.json?.findings || []).map((f) => `${f.gate}|${f.severity}`),
  ...(sectorUnknown.json?.findings || []).map((f) => `${f.gate}|${f.severity}`),
]);

const unproven = declaredKeys.filter((k) => !firedKeys.has(k) && !UNPROVABLE[k]);
say(allGates.length > 0, `${allGates.length} gates registered`);

// ------------------------------------------------------- usage text drift
//
// The ratified rule from the last review, applied: a claim about the code
// belongs in a probe, and where prose must carry it, the probe cites the prose
// file so the two fail together.
//
// run.mjs's own usage block listed ten families while FAMILIES held twelve.
// `assets` and `discovery` — the two newest, and `discovery` is the headline
// gate of the last release — were undiscoverable from the tool's own help. A
// comment cannot drift silently once something reads it.
console.log('\nusage text — the header must list the families that exist');
{
  const runSrc = readFileSync(join(here, 'run.mjs'), 'utf8');
  // [a-z0-9,] not [a-z,] — the first draft of this probe stopped at the `1` in
  // `a11y` and compared four families against twelve, which is a probe failing
  // for a reason that has nothing to do with what it is watching.
  const declared = (runSrc.match(/--only <families>\s+comma-separated:\s*([a-z0-9,]+)/) || [])[1];
  const listed = declared ? declared.split(',').filter(Boolean).sort() : [];
  const real = [...new Set(allGates.map((g) => g.id.split('/')[0]))].sort();
  say(listed.length > 0, 'the --only line names a family list at all');
  say(JSON.stringify(listed) === JSON.stringify(real),
    `checks/run.mjs usage lists exactly the ${real.length} shipped families `
    + `(usage: ${listed.join(',') || 'none'})`);
}

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
//
// BELOW the failure check, deliberately: the previous version wrote a healthy
// artifact — "provenPairs: 140, coveragePercent: 94" — from a run that ended
// "1 assertion(s) failed". A number published by a red test is worse than no
// number, because it is quoted as though a green one produced it.
if (failures) {
  console.log(`\n${failures} assertion(s) failed. coverage.json NOT updated — the numbers a red run produces are not numbers.\n`);
  process.exit(1);
}

writeFileSync(join(root, 'checks', 'coverage.json'), JSON.stringify({
  gates: allGates.length,
  declaredPairs: declaredKeys.length,
  provenPairs: firedKeys.size,
  documentedUnprovable: documented.length,
  coveragePercent: pct,
  // Derived from --list, not typed. The previous literal said 10 while the
  // repo shipped 11, and the README quoted the file as though it were derived.
  families: new Set(allGates.map((g) => g.id.split('/')[0])).size,
}, null, 2) + '\n');
console.log('  (written to checks/coverage.json — README numbers come from here)\n');

if (failures) {
  console.log(`${failures} assertion(s) failed.\n`);
  process.exit(1);
}
console.log('All assertions passed.\n');
