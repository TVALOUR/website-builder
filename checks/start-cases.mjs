// Regression cover for the per-build `git init` in start.mjs.
//
// WHY THIS FILE EXISTS. Every other gate in this repo reads a built SITE.
// start.mjs is the tool that opens one, so nothing checked it, and it shipped
// three defects a reader could not see:
//
//   1. it inherited GIT_DIR / GIT_WORK_TREE from the calling shell. With
//      either set -- git hooks, `git rebase -x`, some CI and agent wrappers --
//      `git init` redirected into the outer repo and the build's first commit
//      landed in THAT history instead. Reproduced live against this repo,
//      which is public.
//   2. with no git identity configured, init and add succeeded and only commit
//      failed, leaving a broken .git behind while the printed message said
//      nothing had happened.
//   3. the new repo had no .gitignore, so following the README's own deploy
//      advice would have published `_intake/` -- the client's raw material.
//
// All three are fixed in code. A comment saying so is not a check, and the
// first one is a silent leak that only shows up in someone else's repo. These
// cases fail if any of it comes back.
//
// Nothing here touches the working repo: each case builds a throwaway engine
// in the OS temp dir and deletes it.

import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Passed to every git call the cases make AND to start.mjs itself. CI runners
// have no user.name/user.email, and start.mjs strips only the repo-location
// variables, so these survive into the child and stand in for a configured
// identity. Without them every case would fail in CI for the wrong reason.
const IDENT = {
  GIT_AUTHOR_NAME: 'selftest', GIT_AUTHOR_EMAIL: 'selftest@example.com',
  GIT_COMMITTER_NAME: 'selftest', GIT_COMMITTER_EMAIL: 'selftest@example.com',
};

const clean = () => {
  // Start from an env with no inherited git redirection, so a case that sets
  // GIT_DIR is testing its own poison and not the harness's.
  const e = { ...process.env, ...IDENT };
  for (const k of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY',
    'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_COMMON_DIR']) delete e[k];
  return e;
};

const git = (dir, args, env) =>
  execFileSync('git', args, { cwd: dir, env: env || clean(), encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

const commits = (dir) => Number(git(dir, ['rev-list', '--count', '--all']).trim());

const haveGit = () => spawnSync('git', ['--version'], { stdio: 'ignore' }).status === 0;

// A minimal engine: start.mjs, the templates it reads, a builds/ folder, and a
// git repo around it. Small on purpose -- the cases are about where commits
// land, not about the pipeline.
function engine() {
  const dir = mkdtempSync(join(tmpdir(), 'wb-start-'));
  cpSync(join(root, 'start.mjs'), join(dir, 'start.mjs'));
  mkdirSync(join(dir, 'templates'), { recursive: true });
  for (const f of ['STATE.md', 'brief.md']) {
    const src = join(root, 'templates', f);
    if (existsSync(src)) cpSync(src, join(dir, 'templates', f));
  }
  mkdirSync(join(dir, 'builds'), { recursive: true });
  writeFileSync(join(dir, 'builds', '.gitkeep'), '');
  git(dir, ['init', '-q']);
  git(dir, ['add', '-A']);
  git(dir, ['commit', '-q', '-m', 'engine base']);
  return dir;
}

const start = (dir, name, extraEnv) =>
  spawnSync(process.execPath, ['start.mjs', name], {
    cwd: dir, env: { ...clean(), ...(extraEnv || {}) }, stdio: 'ignore',
  });

export function runStart() {
  const out = [];
  if (!haveGit()) {
    out.push({ ok: true, msg: 'git not on PATH — start.mjs git cases skipped' });
    return out;
  }

  // ---- 1. a poisoned environment must not redirect the build's commit ----
  let dir = engine();
  try {
    const before = commits(dir);
    start(dir, 'Alpha Co', { GIT_DIR: join(dir, '.git'), GIT_WORK_TREE: dir });
    const after = commits(dir);
    const build = join(dir, 'builds', 'alpha-co');

    out.push({ ok: after === before,
      msg: `GIT_DIR/GIT_WORK_TREE set in the environment do not redirect the build's first commit into the engine's own history (${before} -> ${after} commits)` });
    out.push({ ok: existsSync(join(build, '.git')),
      msg: 'the build gets its own repo even when GIT_DIR points elsewhere' });

    // Cases 2 and 3 need the repo case 1 was supposed to create. When it is
    // missing they must FAIL, not quietly not-run: the first version of this
    // file guarded both on existsSync, so breaking case 1 made two assertions
    // disappear from the output instead of going red. A probe that vanishes
    // reads exactly like a probe that passed.
    const hasRepo = existsSync(join(build, '.git'));

    // ---- 2. _intake/ stays out of the build's history ----
    if (hasRepo) {
      mkdirSync(join(build, '_intake'), { recursive: true });
      writeFileSync(join(build, '_intake', 'client-logo.txt'), 'raw client material\n');
      const ignored = spawnSync('git', ['check-ignore', '-q', '_intake/client-logo.txt'],
        { cwd: build, env: clean(), stdio: 'ignore' }).status === 0;
      out.push({ ok: ignored, msg: "the build's .gitignore keeps _intake/ — the client's raw material — out of its history" });
    } else {
      out.push({ ok: false, msg: "the build's .gitignore keeps _intake/ out of its history — NOT REACHED, the build has no repo" });
    }

    // ---- 3. an existing build repo is never clobbered ----
    // Only reachable when STATE.md has been removed by hand, but the cleanup
    // path deletes .git, so getting this wrong destroys the owner's history.
    if (hasRepo) {
      rmSync(join(build, 'STATE.md'), { force: true });
      writeFileSync(join(build, '.gitignore'), 'custom-rule/\n');
      git(build, ['add', '-A']);
      git(build, ['commit', '-q', '-m', 'owner work']);
      const wasBranch = git(build, ['rev-parse', '--abbrev-ref', 'HEAD']).trim();
      const wasCount = commits(build);
      start(dir, 'Alpha Co');
      const stillThere = existsSync(join(build, '.git'));
      out.push({ ok: stillThere && commits(build) === wasCount && git(build, ['rev-parse', '--abbrev-ref', 'HEAD']).trim() === wasBranch,
        msg: `re-opening a build that is already a repo leaves its history alone (${wasBranch}, ${wasCount} commits)` });
      out.push({ ok: readFileSync(join(build, '.gitignore'), 'utf8').includes('custom-rule/'),
        msg: 're-opening a build does not overwrite a .gitignore its owner edited' });
    } else {
      out.push({ ok: false, msg: 're-opening an existing build repo leaves its history alone — NOT REACHED, the build has no repo' });
      out.push({ ok: false, msg: 're-opening a build does not overwrite an edited .gitignore — NOT REACHED, the build has no repo' });
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }

  // ---- 4. no identity => no half-repo, and the message tells the truth ----
  dir = engine();
  try {
    const noIdent = clean();
    for (const k of Object.keys(IDENT)) delete noIdent[k];
    const empty = join(dir, 'empty.gitconfig');
    writeFileSync(empty, '');
    delete noIdent.EMAIL;
    noIdent.GIT_CONFIG_GLOBAL = empty;
    noIdent.GIT_CONFIG_SYSTEM = empty;
    noIdent.GIT_CONFIG_NOSYSTEM = '1';

    const r = spawnSync(process.execPath, ['start.mjs', 'Gamma Co'],
      { cwd: dir, env: noIdent, encoding: 'utf8' });
    const build = join(dir, 'builds', 'gamma-co');

    out.push({ ok: !existsSync(join(build, '.git')),
      msg: 'a commit that fails for want of a git identity leaves no half-built .git behind' });
    out.push({ ok: existsSync(join(build, 'brief.md')) || existsSync(join(build, '_intake')),
      msg: 'the build itself still opens when git cannot commit' });
    out.push({ ok: /could not git-init/.test(r.stdout || ''),
      msg: 'and the printed message says git-init did not happen, rather than claiming it did' });
  } finally { rmSync(dir, { recursive: true, force: true }); }

  return out;
}
