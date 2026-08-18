#!/usr/bin/env node
// website-builder — open a build.
//
//   node start.mjs "<project name>"
//
// Creates builds/<slug>/ with its STATE.md and intake folder, and prints the
// stage-01 marching orders. This is the one sanctioned way a build begins:
// the folder layout this script creates is what the rest of the pipeline
// (and, on Claude Code, the hooks) key off.
//
// Run with no arguments to see the active builds and their next actions.
// Zero dependencies. Node 18+.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const buildsDir = join(root, 'builds');

const slugify = (s) => s.toLowerCase().trim()
  .replace(/['’]/g, '')
  .replace(/[^\p{L}\p{N}]+/gu, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 60);

const nextActionOf = (statePath) => {
  try {
    const text = readFileSync(statePath, 'utf8');
    const m = text.match(/## Next action\s*\n+([\s\S]*?)(\n#|\n*$)/);
    return m ? m[1].trim().split('\n')[0].trim() : '(no Next action line — read the file)';
  } catch { return '(unreadable STATE.md)'; }
};

const listBuilds = () => {
  if (!existsSync(buildsDir)) return [];
  return readdirSync(buildsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(buildsDir, d.name, 'STATE.md')))
    .map((d) => ({ slug: d.name, state: join(buildsDir, d.name, 'STATE.md') }));
};

const name = process.argv.slice(2).join(' ').trim();

if (!name) {
  const builds = listBuilds();
  console.log('');
  if (builds.length) {
    console.log('Active builds:');
    for (const b of builds) {
      console.log(`  builds/${b.slug}/  ->  ${nextActionOf(b.state)}`);
    }
    console.log('');
    console.log('Resume one by reading its STATE.md, or open a new build:');
  } else {
    console.log('No active builds.');
    console.log('');
    console.log('Open one:');
  }
  console.log('  node start.mjs "<project name>"');
  console.log('');
  process.exit(builds.length ? 0 : 1);
}

const slug = slugify(name);
if (!slug) {
  console.error(`Could not make a folder name out of "${name}".`);
  process.exit(1);
}

const buildDir = join(buildsDir, slug);
if (existsSync(join(buildDir, 'STATE.md'))) {
  console.log(`builds/${slug}/ already exists.`);
  console.log(`Resume it: read builds/${slug}/STATE.md and continue from its Next action line:`);
  console.log(`  ${nextActionOf(join(buildDir, 'STATE.md'))}`);
  process.exit(0);
}

mkdirSync(join(buildDir, '_intake'), { recursive: true });

// The asset folders exist BEFORE the first question, because the first question
// is "what can you hand me". A named folder is an answerable ask; "send me your
// stuff" is not, and the difference shows up in what arrives.
for (const f of ['logo', 'photos', 'brand', 'fonts', 'docs', 'reference']) {
  mkdirSync(join(buildDir, 'assets', f), { recursive: true });
}

// A brief skeleton with the required headings already in it. The checker reads
// those headings, so shipping the shape means the agent fills a form rather
// than inventing a document structure that happens to omit the awkward parts.
try {
  const briefTemplate = join(root, 'templates', 'brief.md');
  if (existsSync(briefTemplate) && !existsSync(join(buildDir, 'brief.md'))) {
    writeFileSync(join(buildDir, 'brief.md'),
      readFileSync(briefTemplate, 'utf8').replace('<business name>', name));
  }
} catch { /* the template is a convenience; stage 01 works without it */ }

let state;
try {
  state = readFileSync(join(root, 'templates', 'STATE.md'), 'utf8')
    .replace('<business name>', name)
    .replace('<slug>', slug)
    .replace('<what just happened, in one line>', 'build opened by start.mjs')
    .replace('<one or two sentences telling a fresh session exactly what to do next>',
      'Run stage 01: read stages/01_discover/CONTEXT.md, collect the intake, run the interview.');
} catch {
  state = `# State — ${name}\n\n**Build:** ${slug}\n\n## Next action\nRun stage 01: read stages/01_discover/CONTEXT.md.\n`;
}
writeFileSync(join(buildDir, 'STATE.md'), state);

const configured = existsSync(join(root, 'config.md'));

console.log(`
Opened builds/${slug}/
${configured ? '' : `
  FIRST: config.md does not exist yet. Run stage 00 once
  (stages/00_setup/CONTEXT.md) — it takes a minute and every build reads it.
`}
Next — stage 01 discover, and it is a stop, not a formality:

  1. Anything they can HAND OVER goes in the intake folder before any question
     is asked: sketches (a photo of paper is fine), screenshots, reference
     sites they love or want to remake, the one they hate, a logo, brand fonts
     and colours, an old site, existing marketing material. Give them the exact
     path — a named folder is an answerable ask, "send me your stuff" is not:

       ${join(buildDir, '_intake')}

     One dropped sketch answers twenty questions.
  2. Read stages/01_discover/CONTEXT.md and run the interview from
     stages/01_discover/questions.md — 72 questions across ten parts, and you
     ask every BLOCKING one. Batch them, lead with why, take the answer you get.
  3. node assets.mjs ${slug} scan
     Indexes everything that landed, creates assets/MANIFEST.md, and prints
     exactly which files still need a source, a rights answer and alt text.
     The gate will not publish an image whose Rights cell is empty.
  4. Fill in builds/${slug}/brief.md (the skeleton is already there) and write
     builds/${slug}/facts.md. Then:

       node checks/brief.mjs builds/${slug}

     It answers one question: is there enough decided, client-supplied substance
     here that the next six stages will not have to invent anything? Sections it
     names are questions to go and ask, not boxes to fill in yourself.
  5. STOP and have the human confirm the brief before stage 02.

Two defaults you do not have to be told about again, both enforced by the gate:
NO MOTION and NO GENERATED IMAGERY. Either one becomes available by the client
asking for it and the brief recording it — never by the build deciding.

No site file exists before brief.md and design.md do. The gate that decides
whether the build ships:

  node checks/run.mjs builds/${slug}/site --facts builds/${slug}/facts.md
`);
