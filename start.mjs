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

  1. Anything they can HAND OVER goes in builds/${slug}/_intake/ before any
     question is asked: sketches (a photo of paper is fine), screenshots,
     reference sites they love or want to remake, the one they hate, a logo,
     brand fonts and colours, an old site, existing marketing material.
     One dropped sketch answers twenty questions.
  2. Read stages/01_discover/CONTEXT.md and run the interview from
     stages/01_discover/questions.md — the vision half AND the facts half.
  3. Write builds/${slug}/brief.md and builds/${slug}/facts.md, then STOP and
     have the human confirm them before stage 02.

No site file exists before brief.md and design.md do. The gate that decides
whether the build ships:

  node checks/run.mjs builds/${slug}/site --facts builds/${slug}/facts.md
`);
