#!/usr/bin/env node
// website-builder — the asset desk.
//
//   node assets.mjs <slug> scan     index everything the client handed over
//   node assets.mjs <slug> check    what is still unanswered, as questions to ask
//   node assets.mjs                 what every build is holding
//
// Why this exists: the pipeline already told the agent to collect the client's
// sketches, logo, photos and old material into `_intake/`. Nothing then read
// that folder, nothing recorded what was cleared for publication, and nothing
// connected any of it to the site that shipped. So builds quietly reverted to
// the model's own defaults — which is the single failure this repo exists to
// fix, arriving through the one door nobody was watching.
//
// `scan` is safe to re-run. It never overwrites a filled cell; new files get new
// rows and existing rows are left exactly as the human left them.
//
// Zero dependencies. Node 18+.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const buildsDir = join(root, 'builds');

// The folders a build gets. They are named for what the CLIENT hands over,
// because the whole point is that the client's material has somewhere to land.
const FOLDERS = [
  ['logo', 'the actual logo files - vector if it exists. A redrawn logo is a lie about their identity.'],
  ['photos', 'their photographs. Of their premises, their work, their team. Not stock.'],
  ['brand', 'colour values, brand guidelines, anything that pins the palette. A photo of the van counts.'],
  ['fonts', 'brand font files, and the licence that permits webfont use. A desktop licence does not.'],
  ['docs', 'menus, price lists, leaflets, certificates, the old site export. Facts live in here.'],
  ['reference', 'sites they love, the one they hate, screenshots, sketches. Study only - never shipped.'],
];

const IMAGE = /\.(png|jpe?g|gif|webp|avif|svg|bmp|tiff?)$/i;
const MEDIA = /\.(mp4|webm|mov|m4v|mp3|wav|ogg)$/i;
const DOC = /\.(pdf|docx?|txt|md|csv|xlsx?|pages)$/i;
const FONT = /\.(woff2?|ttf|otf|eot)$/i;

const kindOf = (p) => {
  const rel = p.toLowerCase();
  if (FONT.test(rel)) return 'font';
  if (DOC.test(rel)) return 'document';
  if (MEDIA.test(rel)) return 'video/audio';
  if (!IMAGE.test(rel)) return 'other';
  if (/logo|mark|wordmark/.test(rel)) return 'logo';
  if (/reference|screenshot|sketch|wireframe|moodboard/.test(rel)) return 'reference';
  return 'photo';
};

function walk(dir, out = [], depth = 0) {
  if (depth > 6 || !existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'MANIFEST.md') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out, depth + 1);
    else out.push(p);
  }
  return out;
}

const humanSize = (n) => (n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${Math.round(n / 1024)} KB` : `${(n / 1048576).toFixed(1)} MB`);

// ---------------------------------------------------------------- manifest io

const HEADER = ['File', 'Kind', 'What it shows', 'Source', 'Rights', 'Generated', 'Used', 'Alt'];

function parseRows(text) {
  const rows = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim().startsWith('|')) continue;
    const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;
    if (/^file$/i.test(cells[0])) continue;
    const file = cells[0].replace(/^`|`$/g, '');
    if (!file || /^<.*>$/.test(file)) continue;
    rows.set(file.replace(/\\/g, '/'), cells);
  }
  return rows;
}

function render(slug, rows, policy) {
  const widths = HEADER.map((h, i) => Math.max(h.length, ...[...rows.values()].map((r) => (r[i] || '').length)));
  const line = (cells) => `| ${cells.map((c, i) => String(c || '').padEnd(widths[i])).join(' | ')} |`;
  const sep = `|${widths.map((w) => '-'.repeat(w + 2)).join('|')}|`;

  const open = [...rows.values()].filter((r) => /^\?$/.test((r[4] || '').trim()) || !(r[3] || '').trim() || (r[3] || '').trim() === '?');

  return `# Assets — ${slug}

**Imagery policy:** ${policy}

Every file the client handed over, and every file that ships. One row each.

**This table is a gate, not a note.** \`checks/rules/assets.mjs\` refuses to ship an image that
has no row here, a row with no Source, or a row with no answer in Rights. An image on a page is a
claim about the business — *this is our shop, this is our work, this is the team* — and an image
nobody can trace is exactly as dishonest as a price nobody can trace.

How to fill it in:

- **Source** — where the file came from. \`client email 2026-08-14\`, \`photographed on site\`,
  \`_intake/brochure.pdf p3\`. Unsourced is the same as invented.
- **Rights** — the client's own answer to "is this yours to publish?", in their words. "Probably
  fine" is a real answer and is not the same as yes. A photo taken by a photographer the client
  paid is very often still the photographer's copyright.
- **Generated** — \`yes\` for anything an image model made. Generated imagery is OFF unless the
  brief says \`- **Imagery:** generated-allowed\`, and even then it may never depict a real person,
  premises, product, logo or award (\`shared/imagery.md\` §3).
- **Used** — where it ends up: \`home hero\`, \`services gallery\`, or \`not used — <why>\`.
  "Not used" is a decision, and writing it down stops the next session silently re-adding it.
- **Alt** — decide it here, where somebody who knows what the picture shows is looking at it.
  Purely decorative is a real answer: write \`decorative\`.

${line(HEADER)}
${sep}
${[...rows.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, r]) => line(r)).join('\n')}

## Still to ask the client

${open.length
    ? open.map((r) => `- [ ] \`${r[0]}\` — ${!(r[3] || '').trim() || r[3] === '?' ? 'where did this come from?' : ''}${/^\?$/.test((r[4] || '').trim()) ? ' is it theirs to publish?' : ''}`).join('\n')
    : '- Nothing outstanding. Every row has a source and a rights answer.'}

## Deliberately absent

<Anything the build decided NOT to have — no team photo because nobody has one, no premises shot
because they work from a van. Write it here so a later session does not "helpfully" generate one.>
`;
}

// ---------------------------------------------------------------- commands

function scan(slug) {
  const buildDir = join(buildsDir, slug);
  if (!existsSync(buildDir)) {
    console.error(`No build at builds/${slug}/. Open one first:  node start.mjs "<project name>"`);
    process.exit(1);
  }
  const assetsDir = join(buildDir, 'assets');
  for (const [name] of FOLDERS) mkdirSync(join(assetsDir, name), { recursive: true });
  mkdirSync(join(buildDir, '_intake'), { recursive: true });

  const manifestPath = join(assetsDir, 'MANIFEST.md');
  const existing = existsSync(manifestPath) ? parseRows(readFileSync(manifestPath, 'utf8')) : new Map();
  const policy = existsSync(manifestPath)
    ? (/\*\*Imagery(?:\s+policy)?:\*\*\s*`?([a-z-]+)`?/i.exec(readFileSync(manifestPath, 'utf8')) || [, 'client-assets-only'])[1]
    : (/\*{0,2}Imagery\*{0,2}\s*:\s*`?([a-z-]+)`?/i.exec(existsSync(join(root, 'config.md')) ? readFileSync(join(root, 'config.md'), 'utf8') : '') || [, 'client-assets-only'])[1];

  const found = [...walk(join(buildDir, '_intake')), ...walk(assetsDir)];
  let added = 0;
  for (const abs of found) {
    const rel = relative(buildDir, abs).split(sep).join('/');
    if (existing.has(rel)) continue;
    existing.set(rel, [rel, kindOf(rel), '?', '?', '?', 'no', '?', '?']);
    added++;
  }

  writeFileSync(manifestPath, render(slug, existing, policy));

  console.log('');
  console.log(`builds/${slug}/assets/  — ${FOLDERS.length} folders ready`);
  for (const [name, why] of FOLDERS) console.log(`  assets/${name.padEnd(10)} ${why}`);
  console.log('');
  console.log(`Manifest: builds/${slug}/assets/MANIFEST.md`);
  console.log(`  ${existing.size} row${existing.size === 1 ? '' : 's'} total, ${added} new this scan.`);
  if (!found.length) {
    console.log('');
    console.log('  Nothing in _intake/ or assets/ yet. That is the first thing stage 01 asks for,');
    console.log('  and one dropped sketch answers twenty questions. Give them the exact path:');
    console.log(`    ${join(buildDir, '_intake')}`);
  }
  console.log('');
  check(slug, true);
}

function check(slug, quiet = false) {
  const buildDir = join(buildsDir, slug);
  const manifestPath = join(buildDir, 'assets', 'MANIFEST.md');
  if (!existsSync(manifestPath)) {
    console.error(`No manifest yet. Run:  node assets.mjs ${slug} scan`);
    process.exit(1);
  }
  const rows = parseRows(readFileSync(manifestPath, 'utf8'));
  const unanswered = [];
  for (const [file, r] of rows) {
    const missing = [];
    if (!(r[3] || '').trim() || r[3] === '?') missing.push('where it came from');
    if (!(r[4] || '').trim() || r[4] === '?') missing.push('whether it is theirs to publish');
    if (IMAGE.test(file) && (!(r[7] || '').trim() || r[7] === '?')) missing.push('alt text');
    if (missing.length) unanswered.push([file, missing]);
  }

  if (!unanswered.length) {
    console.log(`  Every one of the ${rows.size} rows has a source, a rights answer and alt text.`);
    return;
  }
  console.log(`  ${unanswered.length} of ${rows.size} rows still need an answer:`);
  for (const [file, missing] of unanswered.slice(0, 20)) {
    console.log(`    ${file}`);
    console.log(`      -> ${missing.join(' · ')}`);
  }
  if (unanswered.length > 20) console.log(`    … and ${unanswered.length - 20} more.`);
  if (!quiet) {
    console.log('');
    console.log('  Ask in ONE batched message with the reason attached, not one question per file.');
    console.log('  The rights question is the one people answer wrongly when it is asked casually:');
    console.log('  a photo the client paid a photographer for is usually still the photographer\'s.');
  }
}

function list() {
  if (!existsSync(buildsDir)) { console.log('\nNo builds yet.\n'); return; }
  const builds = readdirSync(buildsDir, { withFileTypes: true }).filter((d) => d.isDirectory());
  if (!builds.length) { console.log('\nNo builds yet.\n'); return; }
  console.log('');
  for (const b of builds) {
    const intake = walk(join(buildsDir, b.name, '_intake'));
    const assets = walk(join(buildsDir, b.name, 'assets'));
    const manifest = existsSync(join(buildsDir, b.name, 'assets', 'MANIFEST.md'));
    const bytes = [...intake, ...assets].reduce((n, p) => { try { return n + statSync(p).size; } catch { return n; } }, 0);
    console.log(`  builds/${b.name}/`);
    console.log(`    _intake: ${intake.length} file(s) · assets: ${assets.length} file(s) · ${humanSize(bytes)}`
      + `${manifest ? '' : '  — NO MANIFEST, run: node assets.mjs ' + b.name + ' scan'}`);
  }
  console.log('');
}

const [slug, cmd] = process.argv.slice(2);
if (!slug) list();
else if (cmd === 'scan' || !cmd) scan(slug);
else if (cmd === 'check') check(slug);
else {
  console.error(`Unknown command "${cmd}". Use: scan | check`);
  process.exit(2);
}
