// Regression cover for `drop/` — the front door, and the one folder a person
// touches before they touch anything else.
//
// WHY THIS FILE EXISTS. Every gate in this repo reads a built site. `drop/` sits
// at the other end of the pipeline entirely: it is where a client's logo, their
// photographs and the scan of their price list land, and the failures it can have
// are all quiet ones.
//
//   - a README of its own scaffolding taken into the build as client material
//     (the first version did exactly this on Windows: the scaffold test was
//     written around the forward slash, and `walk` returns backslashes there);
//   - a copy left behind, so the NEXT client's build silently inherits the last
//     one's photographs — the same class of defect as an invented fact;
//   - two files called IMG_0421.jpg, one overwriting the other, with nothing said;
//   - dropped material reaching git, in a repo people are told to fork.
//
// None of those announce themselves. A build just proceeds, wrongly, with a
// perfectly ordinary-looking manifest.
//
// Nothing here touches the working repo: each case builds a throwaway engine in
// the OS temp dir and deletes it.

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const haveGit = () => spawnSync('git', ['--version'], { stdio: 'ignore' }).status === 0;

// A minimal engine: the two scripts, the templates they read, builds/, and the
// drop/ scaffolding copied from the real repo — scaffolding included, because
// whether the READMEs are treated as client material is one of the things under
// test and inventing my own copies here would test the wrong file.
function engine() {
  const dir = mkdtempSync(join(tmpdir(), 'wb-drop-'));
  for (const f of ['assets.mjs', 'start.mjs', '.gitignore']) {
    if (existsSync(join(root, f))) cpSync(join(root, f), join(dir, f));
  }
  mkdirSync(join(dir, 'templates'), { recursive: true });
  for (const f of ['STATE.md', 'brief.md']) {
    const src = join(root, 'templates', f);
    if (existsSync(src)) cpSync(src, join(dir, 'templates', f));
  }
  mkdirSync(join(dir, 'builds'), { recursive: true });
  cpSync(join(root, 'drop'), join(dir, 'drop'), { recursive: true });
  return dir;
}

const put = (dir, rel, body) => {
  const p = join(dir, ...rel.split('/'));
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, body);
  return p;
};

const run = (dir, args) =>
  spawnSync(process.execPath, args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

const open = (dir, name) => run(dir, ['start.mjs', name]);
const scan = (dir, slug, ...flags) => run(dir, ['assets.mjs', slug, 'scan', ...flags]);

const files = (dir, rel) => {
  const base = join(dir, ...rel.split('/'));
  const out = [];
  const walk = (d, prefix) => {
    if (!existsSync(d)) return;
    for (const e of readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) walk(join(d, e.name), `${prefix}${e.name}/`);
      else out.push(prefix + e.name);
    }
  };
  walk(base, '');
  return out.sort();
};

export function runDrop() {
  const out = [];

  // ---- 1. material moves in, its folder survives, the scaffolding does not ----
  let dir = engine();
  try {
    put(dir, 'drop/logo/acme.svg', 'LOGO');
    put(dir, 'drop/photos/shopfront.jpg', 'SHOP');
    put(dir, 'drop/photos/2019-jobs/kitchen.jpg', 'KITCHEN');
    put(dir, 'drop/loose-sketch.png', 'SKETCH');

    open(dir, 'Acme Farriery');
    scan(dir, 'acme-farriery');

    const intake = files(dir, 'builds/acme-farriery/_intake');
    out.push({
      ok: intake.includes('logo/acme.svg') && intake.includes('photos/shopfront.jpg')
        && intake.includes('photos/2019-jobs/kitchen.jpg') && intake.includes('loose-sketch.png'),
      msg: `dropped material lands in the build's _intake/ with its folder intact (${intake.length} file(s))`,
    });

    // The bug this is here for: on Windows the scaffold test matched nothing, so
    // drop/logo/README.md was carried into the build as if the client had sent it.
    out.push({
      ok: !intake.some((f) => /readme\.md$/i.test(f)),
      msg: "drop/'s own README files are scaffolding, and are never taken into the build as client material",
    });
    out.push({
      ok: existsSync(join(dir, 'drop', 'README.md')) && existsSync(join(dir, 'drop', 'logo', 'README.md')),
      msg: 'and they are still in drop/ afterwards, so the folder still explains itself to the next person',
    });

    // Moved, not copied. A copy is how one client's photographs end up in the
    // next client's build without anyone deciding that they should.
    out.push({
      ok: files(dir, 'drop').every((f) => /readme\.md$/i.test(f)),
      msg: 'drop/ holds nothing but its scaffolding afterwards — the files moved, they were not copied',
    });

    const manifest = readFileSync(join(dir, 'builds', 'acme-farriery', 'assets', 'MANIFEST.md'), 'utf8');
    out.push({
      ok: ['logo/acme.svg', 'photos/shopfront.jpg', 'photos/2019-jobs/kitchen.jpg', 'loose-sketch.png']
        .every((f) => manifest.includes(`_intake/${f}`)),
      msg: 'every file taken in gets its own manifest row, so the gate can ask where it came from',
    });

    // ---- 2. the next build starts empty ----
    open(dir, 'Beta Bakery');
    scan(dir, 'beta-bakery');
    out.push({
      ok: files(dir, 'builds/beta-bakery/_intake').length === 0,
      msg: "a second build opened afterwards inherits none of the first client's material",
    });
  } finally { rmSync(dir, { recursive: true, force: true }); }

  // ---- 3. a name collision never overwrites ----
  dir = engine();
  try {
    put(dir, 'drop/photos/IMG_0421.jpg', 'FIRST');
    open(dir, 'Collision Co');
    scan(dir, 'collision-co');
    put(dir, 'drop/photos/IMG_0421.jpg', 'SECOND');
    scan(dir, 'collision-co');

    const photos = files(dir, 'builds/collision-co/_intake/photos');
    const bodies = photos.map((f) => readFileSync(join(dir, 'builds', 'collision-co', '_intake', 'photos', f), 'utf8'));
    out.push({
      ok: photos.length === 2 && bodies.includes('FIRST') && bodies.includes('SECOND'),
      msg: `two different files with the same name both survive, neither overwritten (${photos.join(', ')})`,
    });
  } finally { rmSync(dir, { recursive: true, force: true }); }

  // ---- 4. --keep copies instead of moving ----
  dir = engine();
  try {
    put(dir, 'drop/brand/colours.txt', 'HEXES');
    open(dir, 'Keep Co');
    const r = scan(dir, 'keep-co', '--keep');
    out.push({
      ok: existsSync(join(dir, 'drop', 'brand', 'colours.txt'))
        && existsSync(join(dir, 'builds', 'keep-co', '_intake', 'brand', 'colours.txt')),
      msg: '--keep leaves the original in drop/ and still puts a copy in the build',
    });
    out.push({
      ok: /keep-co/.test(r.stdout || '') && /drop\//.test(r.stdout || ''),
      msg: 'and the scan prints what it took, rather than moving a person\'s files silently',
    });
  } finally { rmSync(dir, { recursive: true, force: true }); }

  // ---- 5. something dropped after the scan is reported, not swallowed ----
  dir = engine();
  try {
    put(dir, 'drop/docs/menu.pdf', 'MENU');
    open(dir, 'Late Co');
    scan(dir, 'late-co');
    put(dir, 'drop/docs/late-price-list.pdf', 'LATE');
    const r = run(dir, ['assets.mjs', 'late-co', 'check']);
    out.push({
      ok: /drop\//.test(r.stdout || '') && /scan/.test(r.stdout || ''),
      msg: 'a file dropped AFTER the last scan is named by `check`, instead of silently sitting outside the build',
    });

    const list = run(dir, ['assets.mjs']);
    out.push({
      ok: /late-price-list\.pdf/.test(list.stdout || ''),
      msg: '`node assets.mjs` with no arguments says what is waiting in drop/',
    });
  } finally { rmSync(dir, { recursive: true, force: true }); }

  // ---- 6. dropped material never reaches git; the scaffolding does ----
  if (!haveGit()) {
    out.push({ ok: true, msg: 'git not on PATH — drop/ ignore-rule case skipped' });
    return out;
  }
  dir = engine();
  try {
    const git = (args) => spawnSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
    git(['init', '-q']);
    put(dir, 'drop/photos/a-clients-shopfront.jpg', 'PRIVATE');
    put(dir, 'drop/photos/2019-jobs/deep.jpg', 'PRIVATE');
    put(dir, 'drop/loose.png', 'PRIVATE');

    const ignored = (rel) => spawnSync('git', ['check-ignore', '-q', rel],
      { cwd: dir, stdio: 'ignore' }).status === 0;

    out.push({
      ok: ignored('drop/photos/a-clients-shopfront.jpg') && ignored('drop/photos/2019-jobs/deep.jpg')
        && ignored('drop/loose.png'),
      msg: "everything a person drops in — at any depth — is git-ignored, so a fork never carries somebody's client material",
    });
    out.push({
      ok: !ignored('drop/README.md') && !ignored('drop/photos/README.md'),
      msg: 'while the folder\'s own READMEs stay tracked, so the front door survives a clone',
    });
  } finally { rmSync(dir, { recursive: true, force: true }); }

  return out;
}

// Runnable on its own: node checks/drop-cases.mjs
if (process.argv[1] && process.argv[1].endsWith('drop-cases.mjs')) {
  let bad = 0;
  for (const r of runDrop()) {
    if (!r.ok) bad++;
    console.log(`${r.ok ? '  ok  ' : '  FAIL'}  ${r.msg}`);
  }
  console.log(bad ? `\n${bad} failed` : '\nall passed');
  process.exit(bad ? 1 : 0);
}
