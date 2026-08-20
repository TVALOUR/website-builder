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

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = dirname(fileURLToPath(import.meta.url));
const buildsDir = join(root, 'builds');
const dropDir = join(root, 'drop');

// drop/ is the front door that exists before any build does. Counting it here is
// not decoration: if someone dropped their logo in yesterday and the orders do not
// mention it, the build proceeds as though they handed over nothing.
const dropCount = (dir = dropDir, depth = 0) => {
  if (depth > 6 || !existsSync(dir)) return 0;
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) n += dropCount(join(dir, e.name), depth + 1);
    else if (e.name.toLowerCase() !== 'readme.md') n++;
  }
  return n;
};

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

// `node start.mjs --help` used to slugify the flag and open a build called
// "help" - a folder, a brief skeleton and a git repo, from the most cautious
// command a new person can type. Flag forms only: a business really can be
// called Help, and the bare word is a name, not a request for the usage.
const HELP_FLAGS = ['--help', '-h', '-?', '/?', '--usage'];
if (process.argv.slice(2).some((a) => HELP_FLAGS.includes(a.toLowerCase()))) {
  console.log('');
  console.log('Usage: node start.mjs "<project name>"   open a build: builds/<slug>/');
  console.log('       node start.mjs                    list active builds and their next actions');
  console.log('');
  console.log('  It creates the build folder, its _intake/ and asset folders, a brief');
  console.log('  skeleton, its own git repo, and prints the stage-01 orders.');
  console.log('');
  console.log('  Put the client\'s material in drop/ (repo root) first, or point them at it:');
  console.log('  logo · photos · brand · fonts · docs · reference. The next');
  console.log('  `node assets.mjs <slug> scan` moves it into the build.');
  console.log('');
  process.exit(0);
}

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

// The build's own changelog, seeded with Round 0 — the original build. It is
// written at open rather than at launch because a file that only appears once
// somebody remembers to create it is a file that does not exist: the point of
// the round record is the request in the client's words, and those start
// arriving at stage 01, not after go-live.
try {
  const clTemplate = join(root, 'templates', 'CHANGELOG.md');
  if (existsSync(clTemplate) && !existsSync(join(buildDir, 'CHANGELOG.md'))) {
    writeFileSync(join(buildDir, 'CHANGELOG.md'),
      readFileSync(clTemplate, 'utf8')
        .replace('<business name>', name)
        .replace('<YYYY-MM-DD>', new Date().toISOString().slice(0, 10)));
  }
} catch { /* same — stage 08 explains how to write one by hand */ }

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

// Every build gets its own git history from the first file, not just at launch.
// builds/<slug>/ stays git-ignored by THIS repo (the engine) -- this is a
// separate, nested repo scoped to just the one site, so an agent can commit
// checkpoints as it works and site/ is already in a real repo to point a
// deploy target at.
//
// Three things this has to get right, found by adversarial review before
// this ever shipped:
//  - GIT_DIR/GIT_WORK_TREE/GIT_INDEX_FILE, if set in the calling shell (git
//    hooks, `git rebase -x`, some CI/agent wrappers), redirect `git init`
//    into whatever repo THOSE point at -- reproduced: it silently committed
//    into the ENGINE's own history instead of creating a nested repo. Strip
//    them from the child's env explicitly; inheriting process.env is not safe.
//  - `-b main` needs git >= 2.28; symbolic-ref works on any version and does
//    the same thing (repoint HEAD before the first commit exists).
//  - if commit fails (most likely: no user.name/user.email configured) after
//    init+add already ran, a half-repo is worse than no repo -- clean it up
//    so "gitReady = false" means what it says and the printed advice is true.
//  - never touch a build that is ALREADY a repo. The cleanup below deletes
//    .git, so running this block over existing history would be the one
//    unrecoverable failure in the file -- and it would also overwrite a
//    .gitignore the owner had edited and repoint HEAD at an unborn `main`,
//    hiding the commits that are there. start.mjs normally exits before this
//    when STATE.md exists, so only a hand-deleted STATE.md reaches it; the
//    guard is one line and the thing it prevents cannot be undone.
let gitReady = existsSync(join(buildDir, '.git'));
const gitEnv = { ...process.env };
for (const k of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY',
  'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_COMMON_DIR', 'GIT_CEILING_DIRECTORIES']) {
  delete gitEnv[k];
}
const git = (args) => execFileSync('git', args, { cwd: buildDir, env: gitEnv, stdio: 'ignore', timeout: 10000 });
if (!gitReady) {
  try {
    // _intake/ is the client's raw handed-over material (photos, sketches,
    // screenshots, an old logo file) -- unprocessed and often not this
    // client's to redistribute. It stays out of the build's own git history by
    // default, same reasoning as this engine's own .gitignore for builds/.
    writeFileSync(join(buildDir, '.gitignore'), '_intake/\n');
    git(['init', '-q']);
    git(['symbolic-ref', 'HEAD', 'refs/heads/main']);
    git(['add', '-A']);
    git(['commit', '-q', '--allow-empty', '-m', 'start: open build']);
    gitReady = true;
  } catch {
    try { rmSync(join(buildDir, '.git'), { recursive: true, force: true }); } catch { /* best effort */ }
  }
}

const configured = existsSync(join(root, 'config.md'));
const waiting = dropCount();

console.log(`
Opened builds/${slug}/${gitReady ? ' (its own git repo, ready for checkpoint commits)' : ''}
${gitReady ? '' : `
  NOTE: could not git-init this build (git missing, or no user.name/user.email
  configured). The build works the same either way -- run "git init" by hand in
  builds/${slug}/ later if you want history.
`}${configured ? '' : `
  FIRST: config.md does not exist yet. Run stage 00 once
  (stages/00_setup/CONTEXT.md) — it takes a minute and every build reads it.
`}
Next — stage 01 discover, and it is a stop, not a formality:

  1. Anything they can HAND OVER goes in before any question is asked:
     sketches (a photo of paper is fine), screenshots, reference sites they love
     or want to remake, the one they hate, a logo, brand fonts and colours, an
     old site, existing marketing material. Give them an exact path — a named
     folder is an answerable ask, "send me your stuff" is not:

       ${dropDir}
         drop/logo · photos · brand · fonts · docs · reference — sorted for them,
         and it is the same folder whoever they are working with. Step 3 moves
         everything in it into this build.

       ${join(buildDir, '_intake')}
         this build's own folder, if they would rather put it straight there.
${waiting ? `
     ${waiting} file(s) are ALREADY waiting in drop/. Step 3 takes them in — look
     at every one of them before the interview and ask about what you see, not
     about what you would have asked anyway.
` : ''}
     One dropped sketch answers twenty questions.
  2. Read stages/01_discover/CONTEXT.md and run the interview from
     stages/01_discover/questions.md — 72 questions across ten parts, and you
     ask every BLOCKING one. Batch them, lead with why, take the answer you get.
  3. node assets.mjs ${slug} scan
     Moves anything in drop/ into this build, indexes everything that landed,
     creates assets/MANIFEST.md, and prints
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
