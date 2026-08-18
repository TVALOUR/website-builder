#!/usr/bin/env node
// website-builder — the discovery gate.
//
//   node checks/brief.mjs builds/<slug>          human output
//   node checks/brief.mjs builds/<slug> --json   machine output
//
// Exit: 0 the brief is substantive · 1 it is not · 2 could not run.
//
// WHY THIS EXISTS, stated plainly because it is the same lesson twice.
//
// The question bank in stages/01_discover/questions.md had 49 questions before
// this change and has 72 now. Stage 01 already said "artifacts before
// questions", already said which questions were BLOCKING, already told the
// agent to put everything in `_intake/`. And a real build still reached the
// point of asking the client to choose a legal jurisdiction from a two-item
// list without ever having asked for a brief, an image, an asset or a feature.
//
// The spec was fine. Nothing checked it. That is the exact sentence at the top
// of checks/rules/legal.mjs about the four legal pages, and it turns out to
// apply to the stage whose whole job is asking.
//
// So this file is the missing half. It reads brief.md and answers one question:
// does this document contain enough decided, client-supplied substance that the
// next six stages will not have to invent anything? A section that exists but
// says nothing counts as missing, because in practice it is.
//
// Zero dependencies. Node 18+.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

// ---------------------------------------------------------------- the schema
//
// `min` is the word floor for the section's body. The numbers are low on
// purpose: this is a check for "somebody answered", not a word count. A section
// under its floor is nearly always a heading with a placeholder under it.
const SECTIONS = [
  { key: 'regime', min: 4, match: /regime|kind of project|project type/i,
    ask: 'Question 0 — real business, real online product, or personal/demo/fiction? It decides which rules bind.' },
  { key: 'goal', min: 8, match: /^goal|the goal|objective/i,
    ask: 'The ONE outcome. Not "an online presence" — "more enquiries for remedial work from vets".' },
  { key: 'audience', min: 8, match: /audience|who visits|customers?$/i,
    ask: 'Who visits, on what device, worried about what. Questions 8-12.' },
  { key: 'vision', min: 25, match: /vision/i,
    ask: 'Part V. What they could already see: what they handed over, the remake target, the references and their axes, the anti-vision, the five-second answer, the three feel-words, and the colour/type state.' },
  { key: 'voice', min: 6, match: /voice|tone/i,
    ask: '3 to 5 adjectives, and one sentence of theirs you would be happy to quote.' },
  { key: 'scope', min: 8, match: /scope|page list|sitemap/i,
    ask: 'The rough page list. Refined at stage 02, but it starts here.' },
  { key: 'features', min: 15, match: /features?|what the site (has to|must) do|functional/i,
    ask: 'Questions 47-56 — page by page, what must a visitor be able to DO? This is what turns a page list into a website.' },
  { key: 'constraints', min: 8, match: /must.have|must.avoid|constraints|anti.vision/i,
    ask: 'Must-have and must-avoid, including everything they hate. "My last site was purple" is load-bearing.' },
  { key: 'brand', min: 10, match: /brand|assets|materials|logo/i,
    ask: 'Logo, colours, fonts and whether they are licensed for web use, photos and whether they are theirs to publish. Questions 21-24 and 41-46.' },
  { key: 'market', min: 8, match: /market|jurisdiction|language|country|legal/i,
    ask: 'Questions 57-61 — which country the business trades under, where its customers are, what language, what currency. This picks the legal profile, and there is no default.' },
  { key: 'policy', min: 4, match: /motion|imagery|policies|defaults/i,
    ask: 'Questions 62-63 — motion and generated imagery. Both are OFF unless this section says otherwise, and the gate enforces it.' },
  { key: 'stack', min: 6, match: /stack|host|domain|technical/i,
    ask: 'Stack, host, and who owns the domain today. Question 31 is the classic agency trap.' },
  { key: 'assumptions', min: 5, match: /assumption/i,
    ask: 'Everything you defaulted rather than asked, listed so the client can correct it in one pass. An empty list here is almost always a lie.' },
  { key: 'open', min: 3, match: /open question|outstanding|needs|still to ask/i,
    ask: 'Every [NEEDS:] gathered in one place, so nobody has to grep for them.' },
];

// Blocking questions, by the id used in questions.md, and a pattern that shows
// the brief actually carries the answer. Deliberately generous: the checker is
// looking for evidence the subject was ADDRESSED, not grading the prose.
const BLOCKING = [
  ['V1  artifacts handed over', /_intake|handed over|supplied|sent me|dropped|nothing to hand over|no materials/i],
  ['V2  the site they are remaking', /remak|reference|inspired by|no references|none supplied|delegated/i],
  ['V4  the anti-vision', /must not|never|avoid|hate|anti.vision/i],
  ['V5  the five-second answer', /five.second|5.second|above the fold|first impression|hero/i],
  ['V6  three feel-words', /feel|tone|temperament|adjectiv/i],
  ['V7  colour state', /colou?r/i],
  ['A1  legal name and entity type', /limited|ltd|sole trader|partnership|llc|inc\b|corporation|entity|proprietor|not a (real|trading)/i],
  ['A2  what they sell, in their words', /sell|service|offer|do\b/i],
  ['C13 prices, or why there are none', /price|quote|per job|cost|£|\$|€|no published/i],
  ['C14 opening hours', /hour|open|closed|by appointment|24\/7|availab/i],
  ['C15 where they work', /area|town|city|region|serve|coverage|remote|online only/i],
  ['C16 phone and email', /@|phone|tel|mobile|contact/i],
  ['C17 qualifications and registrations', /qualif|accredit|registrat|insur|licen|member|none held|no registrations/i],
  ['D21 logo', /logo|wordmark|no logo|set type instead/i],
  ['D22 fonts and their licence', /font|typeface|licen/i],
  ['D24 photos and whether they are theirs', /photo|image|picture|no photos/i],
  ['E41 photo rights', /right|permission|copyright|theirs to publish|took the photo|photographer/i],
  ['F27 can they edit it themselves', /edit|update|cms|static|developer job/i],
  ['F47 what a visitor must be able to DO', /visitor|must be able|do\b|ring|call|enquir|download|book/i],
  ['G57 the country they trade under', /jurisdiction|country|profile|uk|united kingdom|us\b|united states|eu\b|canada|australia|trades? (in|under)/i],
  ['H62 motion', /motion/i],
  ['H63 generated imagery', /imagery|generated/i],
  ['I31 who owns the domain', /domain|registrar|dns/i],
  ['I32 the existing site', /existing site|old site|current site|no existing|new domain|nothing to replace/i],
];

const PLACEHOLDER = /^(tbd|tbc|todo|n\/?a|-+|\?+|<[^>]*>|\[[^\]]*\]|none yet|to be confirmed|\.\.\.|…)$/i;

function sectionsOf(md) {
  const out = [];
  const lines = md.split(/\r?\n/);
  let current = null;
  for (const line of lines) {
    const h = /^(#{2,4})\s+(.*)$/.exec(line);
    if (h) {
      if (current) out.push(current);
      current = { title: h[2].trim(), body: [] };
      continue;
    }
    // A `- **Vision:** …` bullet is a heading in everything but syntax, and
    // plenty of real briefs are written that way. Treat it as one.
    const b = /^\s*[-*]\s*\*\*([^*]{2,40})\*\*\s*[-—:]\s*(.*)$/.exec(line);
    if (b) {
      if (current) out.push(current);
      current = { title: b[1].trim(), body: [b[2]] };
      continue;
    }
    if (current) current.body.push(line);
  }
  if (current) out.push(current);
  return out.map((s) => ({
    title: s.title,
    text: s.body.join('\n').trim(),
    words: s.body.join(' ').replace(/[#*`>|_-]/g, ' ').split(/\s+/).filter((w) => /[a-z0-9£$€]/i.test(w)).length,
  }));
}

// Emphasis is stripped before matching. The house format is `- **Motion:** subtle`
// — colon INSIDE the bold markers — and a pattern that expected `**Motion**:`
// matched none of them. See the same note in checks/lib/policy.mjs: a reader that
// silently finds nothing and applies the default is indistinguishable from a
// reader that works.
function field(text, key) {
  const re = new RegExp(`^\\s*(?:[-*]\\s*)?${key}\\s*:\\s*\`?([a-z][a-z-]*)\`?`, 'im');
  const m = re.exec(String(text || '').replace(/\*\*/g, '').replace(/__/g, ''));
  return m ? m[1].toLowerCase() : null;
}

// ---------------------------------------------------------------- run

const argv = process.argv.slice(2);
const asJson = argv.includes('--json');
const target = argv.find((a) => !a.startsWith('--'));

if (!target) {
  console.error('Usage: node checks/brief.mjs builds/<slug> [--json]');
  console.error('');
  console.error('  Checks that stage 01 actually happened: that brief.md carries decided,');
  console.error('  client-supplied substance rather than headings with placeholders under them.');
  process.exit(2);
}

const buildDir = isAbsolute(target) ? target : resolve(process.cwd(), target);
const briefPath = existsSync(join(buildDir, 'brief.md')) ? join(buildDir, 'brief.md') : buildDir;
if (!existsSync(briefPath) || statSync(briefPath).isDirectory()) {
  console.error(`No brief.md at ${join(buildDir, 'brief.md')}`);
  console.error('');
  console.error('That is stage 01, and it is a stop, not a formality. Read');
  console.error('stages/01_discover/CONTEXT.md and run the interview from');
  console.error('stages/01_discover/questions.md — the vision half AND the facts half.');
  process.exit(2);
}

const md = readFileSync(briefPath, 'utf8');
const found = sectionsOf(md);
const slug = basename(dirname(briefPath) === buildDir ? buildDir : dirname(briefPath));

const missing = [];
const thin = [];
for (const spec of SECTIONS) {
  const hit = found.find((s) => spec.match.test(s.title));
  if (!hit) { missing.push(spec); continue; }
  const body = hit.text.replace(/^[-*]\s*/gm, '').trim();
  const isPlaceholder = PLACEHOLDER.test(body);
  if (hit.words < spec.min || isPlaceholder) {
    thin.push({ ...spec, title: hit.title, words: hit.words, reason: isPlaceholder ? 'placeholder' : 'too little' });
  }
}

// The BLOCKING scan runs against the brief with its TEMPLATE PROMPTS REMOVED.
//
// This is the difference between the check being real and being theatre. The
// skeleton in templates/brief.md necessarily contains the words "colour",
// "logo", "font", "domain" and "motion" — they are the instructions telling you
// what to write. Matching against the raw document therefore scored an entirely
// unfilled template as having answered 23 of 24 blocking questions.
//
// Anything still inside <angle brackets> is a prompt, not an answer, so it is
// stripped before the scan along with fenced examples and HTML comments. What
// remains is what a human actually typed.
// It scans SECTION BODIES, and only the bodies of sections that passed the
// substance check above — never headings. A heading is supplied by the template:
// "## Motion and imagery" contains the word "motion", so scanning the raw
// document scored a completely unfilled skeleton as having answered 23 of 24
// blocking questions. Headings are the questions. Bodies are the answers.
const thinKeys = new Set(thin.map((t) => t.key));
const answersOnly = found
  .filter((s) => !SECTIONS.some((spec) => spec.match.test(s.title) && thinKeys.has(spec.key)))
  .map((s) => s.text)
  .join('\n')
  .replace(/```[\s\S]*?```/g, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]{10,}>/g, ' ');

const unanswered = BLOCKING.filter(([, re]) => !re.test(answersOnly));

// Policy values must be present AND valid. A misspelt policy silently applies
// the default, and the default for imagery is the one that matters.
const motion = field(md, 'Motion');
const imagery = field(md, 'Imagery');
const policyProblems = [];
if (!motion) policyProblems.push('brief.md does not record `- **Motion:** none | subtle | expressive` — the build will run as `none`, which is right by default but should be a decision on the record.');
else if (!['none', 'subtle', 'expressive'].includes(motion)) policyProblems.push(`Motion is "${motion}", which is not one of none | subtle | expressive. The gate will apply "none".`);
if (!imagery) policyProblems.push('brief.md does not record `- **Imagery:** client-assets-only | generated-allowed` — the build will run as `client-assets-only`, which is right by default but should be a decision on the record.');
else if (!['client-assets-only', 'generated-allowed'].includes(imagery)) policyProblems.push(`Imagery is "${imagery}", which is not one of client-assets-only | generated-allowed. The gate will apply "client-assets-only".`);

// The jurisdiction has to resolve to a profile that exists. "We'll sort the
// legal pages later" is how a build reaches stage 05 with no jurisdiction.
const available = existsSync(join(root, 'profiles'))
  ? readdirSync(join(root, 'profiles')).filter((f) => f.endsWith('.mjs') && !f.startsWith('_')).map((f) => f.replace(/\.mjs$/, ''))
  : [];
const declaredProfile = field(md, 'Profile') || field(md, 'Jurisdiction');
const jurisdictionProblems = [];
if (!declaredProfile) {
  jurisdictionProblems.push('brief.md does not name a jurisdiction profile. Add `- **Profile:** <id>`. There is no default country, deliberately.');
} else if (!available.includes(declaredProfile)) {
  jurisdictionProblems.push(`brief.md names profile "${declaredProfile}" and profiles/ has none. Available: ${available.join(', ')}. `
    + 'Research one before stage 03 writes a legal page — profiles/README.md has the protocol, and it is a single pass. '
    + 'Do NOT substitute the nearest country.');
}

// Sibling artifacts. facts.md is stage 01's other half and the gate reads it.
const factsPath = join(buildDir, 'facts.md');
const manifestPath = join(buildDir, 'assets', 'MANIFEST.md');
const siblings = [];
if (!existsSync(factsPath)) siblings.push('facts.md is missing. It is the other half of stage 01, and the site gate refuses to ship without it.');
else if (/\[NEEDS:/i.test(readFileSync(factsPath, 'utf8'))) {
  const n = (readFileSync(factsPath, 'utf8').match(/\[NEEDS:/gi) || []).length;
  siblings.push(`facts.md has ${n} unresolved [NEEDS:] — fine right now, blocking at stage 06. They are the list to go back to the client with.`);
}
if (!existsSync(manifestPath)) siblings.push(`no asset manifest yet. Run \`node assets.mjs ${slug} scan\` — it creates the folders, indexes whatever landed in _intake/, and prints exactly what is still unanswered.`);

// An UNSET policy is fine: the default applies, and the default is the safe one.
// An INVALID policy is not, and it used to be reported and then not counted, so
// `- **Imagery:** generated_allowed` (underscore) passed the check while
// silently applying `client-assets-only` — the writer believed they had turned
// generation on, the gate believed it was off, and nobody was told they
// disagreed. A typo that changes what the build is allowed to do has to fail.
const invalidPolicy = policyProblems.filter((p) => /which is not one of/.test(p));
const problems = missing.length + thin.length + unanswered.length
  + jurisdictionProblems.length + invalidPolicy.length;
const ok = problems === 0;

if (asJson) {
  process.stdout.write(JSON.stringify({
    brief: briefPath, ok,
    missingSections: missing.map((m) => m.key),
    thinSections: thin.map((t) => ({ key: t.key, title: t.title, words: t.words, floor: t.min, reason: t.reason })),
    unansweredBlocking: unanswered.map(([id]) => id),
    policyProblems, jurisdictionProblems, notes: siblings,
    motion: motion || 'none (default)', imagery: imagery || 'client-assets-only (default)',
  }, null, 2) + '\n');
  process.exit(ok ? 0 : 1);
}

const bar = (s) => `\n${s}\n${'-'.repeat(s.length)}`;
console.log(`\nbrief check — ${briefPath}`);

if (missing.length) {
  console.log(bar('Sections that are not there at all'));
  for (const m of missing) console.log(`  ${m.key.padEnd(12)} ${m.ask}`);
}
if (thin.length) {
  console.log(bar('Sections that exist and say nothing'));
  for (const t of thin) console.log(`  ${t.key.padEnd(12)} "${t.title}" — ${t.words} words\n  ${' '.repeat(12)} ${t.ask}`);
}
if (unanswered.length) {
  console.log(bar('Blocking questions with no answer anywhere in the brief'));
  for (const [id] of unanswered) console.log(`  ${id}`);
  console.log('\n  A refusal is a valid answer and it must be WRITTEN DOWN: "prices — REFUSED,');
  console.log('  owner does not want them published". Recorded, the build works around it.');
  console.log('  Absent, stage 03 fills the gap with something plausible and invented.');
}
if (jurisdictionProblems.length) {
  console.log(bar('Jurisdiction'));
  for (const p of jurisdictionProblems) console.log(`  ${p}`);
}
if (policyProblems.length) {
  console.log(bar('Motion and imagery'));
  for (const p of policyProblems) console.log(`  ${p}`);
}
if (siblings.length) {
  console.log(bar('Alongside the brief'));
  for (const p of siblings) console.log(`  ${p}`);
}

console.log('');
if (ok) {
  console.log(`  PASS — the brief carries substance in all ${SECTIONS.length} sections and every blocking`);
  console.log('  question is addressed. Present it to the human, Vision section first, in their own');
  console.log('  words, then stop. This check cannot tell you whether the answers are TRUE.');
} else {
  console.log(`  NOT READY — ${problems} thing${problems === 1 ? '' : 's'} to resolve before stage 02.`);
  console.log('  Batch them into ONE message to the client with the reason attached to each.');
  console.log('  Six questions in one message, not six messages: a client answering an');
  console.log('  interrogation gets shorter with every reply.');
}
console.log('');
process.exit(ok ? 0 : 1);
