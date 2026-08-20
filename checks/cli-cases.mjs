// The tools' front-of-house: what happens when somebody types the most cautious
// command they know, before they have committed to anything.
//
//   node checks/cli-cases.mjs        run it directly
//   (checks/selftest.mjs imports and runs it too)
//
// WHY THIS FILE EXISTS. Three defects, all found by running the repo the way a
// person meets it for the first time rather than by reading it:
//
//   - `node start.mjs --help` slugified the flag and OPENED A BUILD called
//     "help" — a folder, an asset tree, a brief skeleton and a git repo — from
//     the one command someone types precisely because they are not ready to
//     start anything yet.
//   - `node checks/run.mjs --help` printed the usage to stderr and exited 2,
//     which is the code this repo's own CI reads as "the checker crashed".
//   - `node assets.mjs --help` quietly listed builds instead, so the flag looked
//     like it did nothing.
//
// None of these break a build. They are all first-five-minutes impressions of a
// tool that is asking to be trusted with somebody's business, which is why they
// are worth a probe rather than a comment.
//
// Nothing here touches the working repo: the start.mjs case runs in a throwaway
// copy in the OS temp dir, and the read-only cases run in place.

import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkRounds } from './round.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const run = (cwd, args) =>
  spawnSync(process.execPath, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

export function runCli() {
  const out = [];

  // ---- run.mjs: help is not an error, a missing target still is ----
  for (const flag of ['--help', '-h']) {
    const r = run(root, ['checks/run.mjs', flag]);
    out.push({
      ok: r.status === 0 && /Usage: node checks\/run\.mjs/.test(r.stdout || ''),
      msg: `checks/run.mjs ${flag} prints the usage on stdout and exits 0 (got ${r.status})`,
    });
  }
  {
    const r = run(root, ['checks/run.mjs']);
    out.push({
      ok: r.status === 2 && /REQUIRED/.test(r.stderr || ''),
      msg: 'and with no site directory it still refuses, exit 2 — there is deliberately no default target',
    });
  }

  // ---- assets.mjs: the flag answers, rather than doing something else ----
  {
    const r = run(root, ['assets.mjs', '--help']);
    out.push({
      ok: r.status === 0 && /Usage: node assets\.mjs/.test(r.stdout || '') && /drop\//.test(r.stdout || ''),
      msg: 'assets.mjs --help prints its usage, including what drop/ is for',
    });
  }

  // ---- start.mjs: asking for help must not open a build ----
  {
    const dir = mkdtempSync(join(tmpdir(), 'wb-cli-'));
    try {
      cpSync(join(root, 'start.mjs'), join(dir, 'start.mjs'));
      mkdirSync(join(dir, 'builds'), { recursive: true });
      mkdirSync(join(dir, 'templates'), { recursive: true });
      for (const f of ['STATE.md', 'brief.md', 'CHANGELOG.md']) {
        const src = join(root, 'templates', f);
        if (existsSync(src)) cpSync(src, join(dir, 'templates', f));
      }

      for (const flag of ['--help', '-h']) {
        const r = run(dir, ['start.mjs', flag]);
        const opened = readdirSync(join(dir, 'builds'));
        out.push({
          ok: r.status === 0 && opened.length === 0 && /Usage: node start\.mjs/.test(r.stdout || ''),
          msg: `start.mjs ${flag} explains itself and opens nothing (builds/: ${opened.join(', ') || 'empty'})`,
        });
      }

      // ...and the guard must not swallow a real business whose name contains it.
      const r = run(dir, ['start.mjs', 'Help Me Plumbing']);
      out.push({
        ok: r.status === 0 && existsSync(join(dir, 'builds', 'help-me-plumbing', 'STATE.md')),
        msg: 'while a business actually called "Help Me Plumbing" still opens a build — the guard reads flags, not words',
      });

      // ...and that build gets its round record on day one. Created at open
      // rather than at launch, because a file that appears only when somebody
      // remembers to create it is a file that does not exist.
      {
        const p = join(dir, 'builds', 'help-me-plumbing', 'CHANGELOG.md');
        let parsed = { ok: false, findings: [{ msg: 'no CHANGELOG.md' }], rounds: [] };
        if (existsSync(p)) {
          const text = readFileSync(p, 'utf8');
          parsed = checkRounds(text);
          out.push({
            ok: /Help Me Plumbing/.test(text) && !/<YYYY-MM-DD>/.test(text),
            msg: 'the seeded changelog carries the real business name and a real date, not the template prompts',
          });
        }
        // Round 0 is OPEN with no gate verdict yet — that one finding is the
        // honest state of a build that has not been verified, and asserting the
        // absence of every other finding is what proves the seed is well-formed.
        const others = parsed.findings.filter((f) => !/gate verdict/.test(f.msg));
        out.push({
          ok: parsed.rounds.length === 1 && others.length === 0,
          msg: `start.mjs seeds a parseable Round 0${others.length ? `: ${others.map((f) => f.msg).join('; ')}` : ''}`,
        });
      }
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }

  return out;
}

// Runnable on its own: node checks/cli-cases.mjs
if (process.argv[1] && process.argv[1].endsWith('cli-cases.mjs')) {
  let bad = 0;
  for (const r of runCli()) {
    if (!r.ok) bad++;
    console.log(`${r.ok ? '  ok  ' : '  FAIL'}  ${r.msg}`);
  }
  console.log(bad ? `\n${bad} failed` : '\nall passed');
  process.exit(bad ? 1 : 0);
}
