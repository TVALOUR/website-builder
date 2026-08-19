#!/usr/bin/env node
// website-builder — the asset desk.
//
//   node assets.mjs <slug> scan     take in drop/, then index what they handed over
//   node assets.mjs <slug> scan --keep    the same, but copy out of drop/ instead of moving
//   node assets.mjs <slug> check    what is still unanswered, as questions to ask
//   node assets.mjs                 what every build is holding, and what waits in drop/
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

import {
  copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync,
} from 'node:fs';
import { basename, dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const buildsDir = join(root, 'builds');
const dropDir = join(root, 'drop');

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

// ------------------------------------------------------------------ the drop

// `drop/` is the repo's front door, and it exists in a fresh clone before any
// build does. The pipeline always asked for the client's material first - one
// dropped sketch answers twenty interview questions - but the folder it named
// only appeared AFTER start.mjs ran, inside a git-ignored directory. So anyone
// who downloaded this repo opened it and found nowhere to put their logo, and
// the build quietly proceeded on the model's defaults instead: the exact failure
// this repo exists to prevent, arriving through the one door nobody was watching.
//
// Files land in drop/, then MOVE into the build's own `_intake/` on the next
// scan. Moving rather than copying is deliberate: a copy leaves one client's
// photographs sitting in a shared folder for the next build to inherit, which is
// the same class of defect as an invented fact and just as quiet. `--keep` copies
// instead, for the case where the folder really is somebody's library.
//
// Nothing is deleted here: a move is a rename into the build.

// basename(), not a hand-written path test: on Windows `walk` returns
// backslash-separated paths, so a check written around the forward slash alone
// matches nothing there - and drop/logo/README.md would be taken into the build
// as if it were the client's material. node:path knows both separators.
const isScaffold = (p) => basename(String(p)).toLowerCase() === 'readme.md';

const dropFiles = () => (existsSync(dropDir) ? walk(dropDir).filter((f) => !isScaffold(f)) : []);

// A name already in _intake/ is never overwritten. Two clients whose photos are
// both called IMG_0421.jpg is the ordinary case, not the exotic one.
function freeName(target) {
  if (!existsSync(target)) return target;
  const dot = basename(target).lastIndexOf('.');
  const base = basename(target);
  const dir = dirname(target);
  const stem = dot > 0 ? base.slice(0, dot) : base;
  const ext = dot > 0 ? base.slice(dot) : '';
  for (let n = 2; n < 1000; n++) {
    const candidate = join(dir, `${stem}-${n}${ext}`);
    if (!existsSync(candidate)) return candidate;
  }
  return join(dir, `${stem}-${process.pid}${ext}`);
}

function adopt(buildDir, keep = false) {
  const taken = [];
  for (const abs of dropFiles()) {
    const rel = relative(dropDir, abs).split(sep).join('/');
    const target = freeName(join(buildDir, '_intake', ...rel.split('/')));
    try {
      mkdirSync(dirname(target), { recursive: true });
      if (keep) copyFileSync(abs, target);
      else {
        // rename fails across volumes (a drop/ reached through a junction, a
        // container mount); copy-then-remove is the same outcome, slower.
        try { renameSync(abs, target); } catch { copyFileSync(abs, target); rmSync(abs, { force: true }); }
      }
      taken.push([rel, relative(buildDir, target).split(sep).join('/')]);
    } catch (e) {
      // One unreadable file must not strand the other nineteen in drop/.
      console.error(`  could not take drop/${rel}: ${e.message}`);
    }
  }
  return taken;
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

/**
 * Prose the human wrote, preserved across a rescan.
 *
 * `scan` rebuilt the whole file from a template every time and only table CELLS
 * survived. So the "Deliberately absent" section — whose entire job is to stop a
 * later session generating what the client does not have — was replaced with its
 * own placeholder on the next scan. The file header claimed "safe to re-run, it
 * never overwrites a filled cell": true of cells, false of the one paragraph
 * that mattered most.
 */
const ABSENT_PLACEHOLDER = '<Anything the build decided NOT to have — no team photo because nobody has one, '
  + 'no premises shot because they work from a van.\nWrite it here so a later session does not "helpfully" generate one.>';

function keepProse(text, heading, fallback) {
  if (!text) return fallback;
  const re = new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`, 'm');
  const m = re.exec(text);
  if (!m) return fallback;
  const body = m[1].trim();
  // An untouched placeholder is not prose worth keeping.
  if (!body || /^<[\s\S]*>$/.test(body)) return fallback;
  return body;
}

function render(slug, rows, policy, previous) {
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

${keepProse(previous, 'Deliberately absent', ABSENT_PLACEHOLDER)}
`;
}

// ---------------------------------------------------------------- commands

function scan(slug, keep = false) {
  const buildDir = join(buildsDir, slug);
  if (!existsSync(buildDir)) {
    console.error(`No build at builds/${slug}/. Open one first:  node start.mjs "<project name>"`);
    process.exit(1);
  }
  const assetsDir = join(buildDir, 'assets');
  for (const [name] of FOLDERS) mkdirSync(join(assetsDir, name), { recursive: true });
  mkdirSync(join(buildDir, '_intake'), { recursive: true });

  const taken = adopt(buildDir, keep);
  if (taken.length) {
    console.log('');
    console.log(`Took ${taken.length} file(s) ${keep ? 'from' : 'out of'} drop/ into builds/${slug}/_intake/:`);
    for (const [from, to] of taken.slice(0, 30)) console.log(`  drop/${from}  ->  ${to}`);
    if (taken.length > 30) console.log(`  ... and ${taken.length - 30} more.`);
  }

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

  const previous = existsSync(manifestPath) ? readFileSync(manifestPath, 'utf8') : '';
  writeFileSync(manifestPath, render(slug, existing, policy, previous));

  console.log('');
  console.log(`builds/${slug}/assets/  — ${FOLDERS.length} folders ready`);
  for (const [name, why] of FOLDERS) console.log(`  assets/${name.padEnd(10)} ${why}`);
  console.log('');
  console.log(`Manifest: builds/${slug}/assets/MANIFEST.md`);
  console.log(`  ${existing.size} row${existing.size === 1 ? '' : 's'} total, ${added} new this scan.`);
  if (!found.length) {
    console.log('');
    console.log('  Nothing in drop/, _intake/ or assets/ yet. That is the first thing stage 01');
    console.log('  asks for, and one dropped sketch answers twenty questions. Two paths work -');
    console.log('  give whichever is easier to say out loud:');
    console.log(`    ${dropDir}`);
    console.log(`    ${join(buildDir, '_intake')}`);
    console.log('  Anything in the first moves into the second the next time this runs.');
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

  // Dropped after the last scan means not in the manifest, so not in this report
  // and not in the build. Silence here would read as 'nothing outstanding'.
  const waiting = dropFiles();
  if (waiting.length) {
    console.log(`  ${waiting.length} file(s) are sitting in drop/. Anything dropped since the`);
    console.log('  last scan is not in this build, so it is not in the report below either:');
    console.log(`    node assets.mjs ${slug} scan`);
  }

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
  const waiting = dropFiles();
  if (waiting.length) {
    const bytes = waiting.reduce((n, f) => { try { return n + statSync(f).size; } catch { return n; } }, 0);
    console.log('');
    console.log(`drop/  - ${waiting.length} file(s) waiting, ${humanSize(bytes)}`);
    for (const f of waiting.slice(0, 10)) console.log(`    ${relative(dropDir, f).split(sep).join('/')}`);
    if (waiting.length > 10) console.log(`    ... and ${waiting.length - 10} more.`);
    console.log('  They move into a build the next time you run:  node assets.mjs <slug> scan');
  }

  const builds = existsSync(buildsDir)
    ? readdirSync(buildsDir, { withFileTypes: true }).filter((d) => d.isDirectory())
    : [];

  if (!builds.length) {
    console.log('');
    console.log('No builds yet.');
    console.log(waiting.length
      ? '  Open one and the waiting files come with it:  node start.mjs "<project name>"'
      : '  Open one:  node start.mjs "<project name>"');
    console.log('');
    return;
  }

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

const argv = process.argv.slice(2);
const keep = argv.includes('--keep');
const [slug, cmd] = argv.filter((a) => !a.startsWith('--'));
if (!slug) list();
else if (cmd === 'scan' || !cmd) scan(slug, keep);
else if (cmd === 'check') check(slug);
else {
  console.error(`Unknown command "${cmd}". Use: scan [--keep] | check`);
  process.exit(2);
}
