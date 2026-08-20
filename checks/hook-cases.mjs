// The enforcement hook's own probes — the post-launch half.
//
//   node checks/hook-cases.mjs        run it directly
//   (checks/selftest.mjs imports and runs it too)
//
// WHY THIS FILE EXISTS. `.claude/hooks/gate.mjs` is the only part of this repo
// that can actually stop a bad write, and until now no check could reach it —
// the same gap that let `start.mjs` ship untested until something reached in and
// found it opening a build called "help".
//
// The specific behaviour probed here is the one that changed: LAUNCHED used to
// switch the whole hook off, so every edit to a live client site was unbriefed,
// ungated and unrecorded. It now requires an open revision round instead. That
// is a rule with two directions and both must hold — it has to deny the edit
// with no round, and it has to get out of the way once a round is open. A gate
// that only ever says no is as broken as one that only ever says yes.
//
// Everything runs in a throwaway copy of the parts of the repo the hook reads,
// in the OS temp dir. Nothing here touches builds/.

import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** A minimal repo the hook can run inside: the hook, the round checker, one build. */
function scaffold(state, changelog, { site = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'wb-hook-'));
  mkdirSync(join(dir, '.claude', 'hooks'), { recursive: true });
  mkdirSync(join(dir, 'checks'), { recursive: true });
  mkdirSync(join(dir, 'builds', 'acme'), { recursive: true });
  cpSync(join(root, '.claude', 'hooks', 'gate.mjs'), join(dir, '.claude', 'hooks', 'gate.mjs'));
  cpSync(join(root, 'checks', 'round.mjs'), join(dir, 'checks', 'round.mjs'));

  const b = join(dir, 'builds', 'acme');
  writeFileSync(join(b, 'STATE.md'), state);
  // Substantial discovery documents, so anything the hook says is about the
  // round rather than about stage 01. checks/brief.mjs is deliberately NOT
  // copied: briefGaps() fails open without it, which isolates what is measured.
  const filler = (name) => `# ${name}\n\n` + `Real content, written by a person, not a template prompt.\n`.repeat(6);
  writeFileSync(join(b, 'brief.md'), filler('Brief'));
  writeFileSync(join(b, 'content.md'), filler('Content'));
  writeFileSync(join(b, 'design.md'), filler('Design'));
  writeFileSync(join(b, 'facts.md'), '| Fact | Value | Source |\n|---|---|---|\n| Phone | 01598 000000 | their letterhead |\n');
  if (changelog !== null) writeFileSync(join(b, 'CHANGELOG.md'), changelog);
  if (site) {
    mkdirSync(join(b, 'site'), { recursive: true });
    writeFileSync(join(b, 'site', 'index.html'), '<!doctype html><title>Acme</title><h1>Acme</h1>');
  }
  return dir;
}

function fire(dir, event, payload) {
  const r = spawnSync(process.execPath, [join(dir, '.claude', 'hooks', 'gate.mjs'), event], {
    cwd: dir, input: JSON.stringify(payload), encoding: 'utf8', timeout: 30000,
  });
  let json = null;
  try { json = JSON.parse(r.stdout || 'null'); } catch { /* text or nothing */ }
  return { raw: r.stdout || '', json };
}

const writeSite = (dir) => ({ cwd: dir, tool_input: { file_path: join(dir, 'builds', 'acme', 'site', 'index.html') } });
const denial = (res) => res.json?.hookSpecificOutput?.permissionDecision === 'deny'
  ? res.json.hookSpecificOutput.permissionDecisionReason : null;

const SHIPPED = '# Changelog — Acme\n\n## Round 0 — SHIPPED — 2026-08-18\n\n'
  + '**Asked:** the original build\n**Changed:** the site, from nothing\n**Not changed:** n/a\n**Gate:** PASS, 0 blockers\n';
const OPEN = '# Changelog — Acme\n\n## Round 1 — OPEN — 2026-08-20\n\n'
  + '**Asked:** "the hero feels shouty"\n**Changed:** in progress\n**Not changed:** —\n**Gate:** not yet run\n\n'
  + SHIPPED.split('\n').slice(2).join('\n');

export function runHookCases() {
  const out = [];

  // ---- a live site, no round open: the write is denied ----
  {
    const dir = scaffold('**Build:** acme\n\nSTATUS: LAUNCHED\n\n## Next action\nLive since August.\n', SHIPPED);
    try {
      const reason = denial(fire(dir, 'pre', writeSite(dir)));
      out.push({
        ok: !!reason && /revision round is open/.test(reason) && /CHANGELOG\.md/.test(reason),
        msg: `LAUNCHED with no open round — the edit to the live site is denied, and the denial names the next action (${reason ? 'denied' : 'ALLOWED'})`,
      });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }

  // ---- the same site with a round open: the write goes through ----
  {
    const dir = scaffold('**Build:** acme\n\nSTATUS: LAUNCHED\n\n## Next action\nRound 1 in progress.\n', OPEN);
    try {
      const reason = denial(fire(dir, 'pre', writeSite(dir)));
      out.push({
        ok: reason === null,
        msg: `LAUNCHED with Round 1 OPEN — the edit is allowed${reason ? `, but was DENIED: ${reason.slice(0, 90)}` : ''}`,
      });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }

  // ---- a live site with no record at all ----
  {
    const dir = scaffold('**Build:** acme\n\nSTATUS: LAUNCHED\n', null);
    try {
      const reason = denial(fire(dir, 'pre', writeSite(dir)));
      out.push({
        ok: !!reason && /no CHANGELOG\.md/.test(reason),
        msg: 'LAUNCHED with no CHANGELOG.md — denied, and told where the template is',
      });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }

  // ---- a build still in the pipeline is NOT asked for a round ----
  //
  // The round rule belongs to the live site. Applying it before launch would
  // mean stage 05 could not write a page without inventing a client request,
  // which is the kind of over-reach that gets a hook disabled entirely.
  {
    const dir = scaffold('**Build:** acme\n\n## Next action\nStage 05.\n', null);
    try {
      const reason = denial(fire(dir, 'pre', writeSite(dir)));
      out.push({
        ok: reason === null || !/round/i.test(reason),
        msg: 'a build still mid-pipeline is not asked for a revision round',
      });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }

  // ---- stop: a live site changed with no round open blocks the session ----
  {
    const dir = scaffold('**Build:** acme\n\nSTATUS: LAUNCHED\n', SHIPPED);
    try {
      // The site is newer than the record: something moved and nothing said why.
      const past = new Date(Date.now() - 60_000);
      utimesSync(join(dir, 'builds', 'acme', 'CHANGELOG.md'), past, past);
      const res = fire(dir, 'stop', { stop_hook_active: false });
      out.push({
        ok: res.json?.decision === 'block' && /no revision round is open/.test(res.json.reason || ''),
        msg: 'stop — a live site that changed with no round open blocks the session, and says how to close it',
      });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }

  // ---- stop: a live site with no record at all ----
  //
  // The build that was STARTED BEFORE the round system existed — the likely
  // case, not the edge one. It reached `stop` unblocked until an independent
  // read of the hook found that both stop conditions required a CHANGELOG to
  // have been parsed first, so a MISSING file was quietly safer than a
  // malformed one. Exactly backwards, and only visible by running the event
  // rather than reading it.
  {
    const dir = scaffold('**Build:** acme\n\nSTATUS: LAUNCHED\n', null);
    try {
      const res = fire(dir, 'stop', { stop_hook_active: false });
      out.push({
        ok: res.json?.decision === 'block' && /no CHANGELOG\.md/.test(res.json.reason || ''),
        msg: 'stop — a LAUNCHED build with no CHANGELOG.md blocks too, not just one whose record is merely stale',
      });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }

  // ---- the three routes an adversarial pass actually got through, 2026-08-20 ----
  //
  // Each of these was a silent allow when it was found, and each is here because
  // "we fixed it" is not a thing this repo lets anyone say without a probe.
  {
    const dir = scaffold('**Build:** acme\n\nSTATUS: LAUNCHED\n', SHIPPED);
    try {
      // 1. A UNC alias for the same file. Containment is a string comparison, so
      //    the second spelling of one path walked past every check at once.
      const unc = '\\\\localhost\\C$' + join(dir, 'builds', 'acme', 'site', 'index.html').replace(/^[A-Za-z]:/, '');
      const reason = denial(fire(dir, 'pre', { cwd: dir, tool_input: { file_path: unc } }));
      out.push({ ok: !!reason && /UNC alias/.test(reason), msg: 'a UNC alias for a governed path is refused, not silently allowed' });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }
  {
    // 2. A round opened once and never closed used to switch the rule off for
    //    the rest of the build's life — the LAUNCHED hole moved one file across.
    const stale = '# Changelog — Acme\n\n## Round 1 — OPEN — 2020-01-01\n\n**Asked:** "a"\n\n'
      + SHIPPED.split('\n').slice(2).join('\n');
    const dir = scaffold('**Build:** acme\n\nSTATUS: LAUNCHED\n', stale);
    try {
      const res = fire(dir, 'stop', { stop_hook_active: false });
      out.push({
        ok: res.json?.decision === 'block' && /OPEN for \d+ days/.test(res.json.reason || ''),
        msg: 'a round left open for years stops being a licence — the stop hook names it',
      });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }
  {
    // 3. Deleting the word LAUNCHED from STATE.md turned everything off. Stage
    //    07's own handoff.md is the half an edit cannot quietly erase.
    const dir = scaffold('**Build:** acme\n\nStatus: reviewing\n', null);
    try {
      writeFileSync(join(dir, 'builds', 'acme', 'handoff.md'), '# Handoff\n\nLive since August.\n');
      const reason = denial(fire(dir, 'pre', writeSite(dir)));
      out.push({
        ok: !!reason && /CHANGELOG/.test(reason),
        msg: 'removing LAUNCHED from STATE.md does not unlaunch a build that has a handoff.md',
      });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }

  // ---- the studio layer's one mechanical moment ----
  //
  // Opt-in, git-ignored, and its write-back was pure instruction until this
  // fired: "append what shipped and what they said", asked of an agent whose
  // attention is on a human who just gave a verdict. The next session names the
  // gap instead. Silent for anyone who never started the layer, which is the
  // half that keeps it from being noise.
  {
    const dir = scaffold('**Build:** acme\n\n## Next action\nStage 06.\n', null);
    try {
      writeFileSync(join(dir, 'builds', 'acme', 'verify.md'), 'VERDICT: PASS\n');
      const quiet = fire(dir, 'session', {});
      out.push({ ok: !/studio/.test(quiet.raw), msg: 'session — no studio/directions.md means no studio line at all' });

      mkdirSync(join(dir, 'studio'), { recursive: true });
      writeFileSync(join(dir, 'studio', 'directions.md'), '| Date | Build | Direction |\n|---|---|---|\n| 2026-01-01 | someone-else | Manifest |\n');
      const nudged = fire(dir, 'session', {});
      out.push({
        ok: /studio\/directions\.md has no row for builds\/acme/.test(nudged.raw),
        msg: 'session — a verified build missing from the direction log is named on the next session, not forgotten',
      });

      writeFileSync(join(dir, 'studio', 'directions.md'), '| Date | Build | Direction |\n|---|---|---|\n| 2026-01-02 | acme | Field ledger |\n');
      const logged = fire(dir, 'session', {});
      out.push({ ok: !/no row for/.test(logged.raw), msg: 'and it goes quiet once the row exists' });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }

  // ---- a dead build is still left alone ----
  {
    const dir = scaffold('**Build:** acme\n\nSTATUS: ABANDONED\n', null);
    try {
      const res = fire(dir, 'stop', { stop_hook_active: false });
      out.push({
        ok: res.json?.decision !== 'block',
        msg: 'ABANDONED still stops the policing entirely — the documented escape survived the change',
      });
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }

  return out;
}

// Runnable on its own: node checks/hook-cases.mjs
if (process.argv[1] && process.argv[1].endsWith('hook-cases.mjs')) {
  let bad = 0;
  for (const r of runHookCases()) {
    if (!r.ok) bad++;
    console.log(`${r.ok ? '  ok  ' : '  FAIL'}  ${r.msg}`);
  }
  console.log(bad ? `\n${bad} failed` : '\nall passed');
  process.exit(bad ? 1 : 0);
}
