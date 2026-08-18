// website-builder — did stage 01 actually happen?
//
// WHY THIS IS A RULE FAMILY AND NOT ONLY A HOOK.
//
// `checks/brief.mjs` was reachable from exactly one place: the Claude Code
// pre-write hook. So on Cursor, Codex, Gemini CLI, Grok, Cline and Windsurf —
// every harness this repo claims to support — the discovery gate had NO
// mechanical trigger at all. The fallback was not structural, it was hopeful:
// four files said "run it" in prose, and nothing did.
//
// Worse, the later gate could not catch it. A fabricated brief produces a
// fabricated site whose every claim traces neatly to a fabricated `facts.md`,
// and the facts family checks the TRACE, not the truth. So a build could skip
// the interview entirely and exit 0.
//
// Living here, it inherits the one command every contract file tells every
// harness to run.
//
// It binds only inside a build this repo produced. An audited third-party site
// has no brief and was never going to, and a blocker that fires on every
// external audit is a reason to stop running the tool.

import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BLOCKER, MAJOR } from '../lib/report.mjs';
import { isManagedBuild } from '../lib/policy.mjs';

const here = dirname(dirname(fileURLToPath(import.meta.url)));

export const gates = [
  { id: 'discovery/brief-incomplete', severity: 'blocker', what: 'the build has a brief with real, client-supplied substance' },
  { id: 'discovery/no-manifest', severity: 'major', what: 'the build has an asset manifest, so what was handed over is on the record' },
];

export async function run(ctx, report) {
  const { siteDir } = ctx;
  for (const id of gates.map((g) => g.id)) report.ranGate(id);

  if (!isManagedBuild(siteDir)) {
    report.skip('discovery', 'not a builds/<slug>/ folder — discovery is checked only for builds this repo '
      + 'produced. An audited third-party site has no brief and was never going to.');
    return;
  }

  const buildDir = dirname(siteDir);
  // Every exit path below still reports on the manifest: a build with no brief
  // is precisely the build most likely to have no manifest either, and
  // returning early hid the second finding behind the first.
  const checkManifest = manifestCheckerFor(buildDir, report);
  const r = spawnSync(process.execPath, [join(here, 'brief.mjs'), buildDir, '--json'],
    { cwd: here, encoding: 'utf8', timeout: 30000, maxBuffer: 8 * 1024 * 1024 });

  // NO BRIEF AT ALL is the loudest version of this finding, not an inability to
  // check. brief.mjs exits 2 for it, and treating exit 2 as "could not run"
  // turned the clearest possible failure into a skip line.
  if (!existsSync(join(buildDir, 'brief.md'))) {
    report.add('discovery/brief-incomplete', BLOCKER,
      'this build has a STATE.md and no brief.md at all — stage 01 never ran',
      { file: 'brief.md' },
      'Read stages/01_discover/CONTEXT.md and run the interview. `node start.mjs` writes a skeleton with the '
      + 'required headings; filling it in is the job. Everything downstream cites this file, and a site built '
      + 'without one is a site about a business nobody asked about.');
    checkManifest();
    return;
  }

  // Fails OPEN on an unusable checker — a broken tool must not become a verdict
  // about somebody's site — but says so, because a silent open failure is
  // indistinguishable from a pass.
  if (r.error || (!r.stdout && r.status !== 1)) {
    report.skip('discovery/brief-incomplete',
      `could not run checks/brief.mjs (${r.error?.message || `exit ${r.status}`}) — discovery was NOT checked`);
    checkManifest();
    return;
  }

  let j = null;
  try { j = JSON.parse(r.stdout); } catch { /* below */ }
  if (!j) {
    report.skip('discovery/brief-incomplete', 'checks/brief.mjs returned output this family could not read — discovery was NOT checked');
    checkManifest();
    return;
  }

  if (!j.ok) {
    const bits = [];
    if (j.missingSections?.length) bits.push(`no ${j.missingSections.join(', ')} section`);
    if (j.thinSections?.length) bits.push(`${j.thinSections.map((t) => t.key).join(', ')} still ${j.thinSections.length === 1 ? 'a heading with nothing under it' : 'headings with nothing under them'}`);
    if (j.unansweredBlocking?.length) bits.push(`${j.unansweredBlocking.length} BLOCKING question${j.unansweredBlocking.length === 1 ? '' : 's'} unanswered (${j.unansweredBlocking.slice(0, 3).join('; ')}${j.unansweredBlocking.length > 3 ? '; …' : ''})`);
    if (j.fillerProblems?.length) bits.push(j.fillerProblems[0]);
    if (j.jurisdictionProblems?.length) bits.push(j.jurisdictionProblems[0]);
    // Anything brief.mjs fails on that this list does not name still blocks:
    // an unmatched failure reason used to fail OPEN in the hook, and the same
    // mistake here would mean every future check silently needs a matching edit.
    if (!bits.length) bits.push('checks/brief.mjs reports it is not ready — run it and read the output');

    report.add('discovery/brief-incomplete', BLOCKER,
      `stage 01 is not finished: ${bits.join('; ')}`,
      { file: 'brief.md' },
      `Run \`node checks/brief.mjs ${buildDir.split(/[\\/]/).slice(-2).join('/')}\` and read it. Every line it prints is a `
      + 'question to go and ask the client, not a box to fill in yourself. A site built on a brief nobody '
      + 'filled in is the default-design, invented-facts site this repo exists to prevent — and the facts '
      + 'family cannot catch it, because invented facts trace perfectly to an invented ledger.');
  }

  checkManifest();
}

function manifestCheckerFor(buildDir, report) {
  return () => {
    if (existsSync(join(buildDir, 'assets', 'MANIFEST.md'))) return;
    report.add('discovery/no-manifest', MAJOR,
      'no asset manifest — nothing records what the client handed over or what is theirs to publish',
      { file: 'assets/MANIFEST.md' },
      'Run `node assets.mjs <slug> scan`. It creates the folders, indexes whatever landed in _intake/, and '
      + 'prints exactly which files still need a source and a rights answer. MAJOR rather than blocker '
      + 'because a site with no images genuinely needs no manifest — but then the answer is one scan and an '
      + 'empty table, not silence.');
  };
}

export default { gates, run };
