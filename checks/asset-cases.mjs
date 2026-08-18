// website-builder — the asset gate's laundering and false-positive suite.
//
//   node checks/asset-cases.mjs        run it directly
//   (checks/selftest.mjs imports and runs it too)
//
// `examples/assets-control/` proves each asset gate CAN fire. This file proves
// the harder half: that the gate cannot be walked around, and that it does not
// fire on ordinary correct work.
//
// Every "must catch" case below is a real bypass an earlier version shipped:
// two different files sharing a basename so the uncleared one inherited the
// cleared one's provenance; an arbitrary photograph named `sprite.png` to hit a
// substring allowlist; a deleted Rights column taking its own blocker with it;
// a cache-busted `?v=3` that failed an extension test and left the family
// entirely. Every "must allow" case is work that should never have been flagged.
//
// Zero dependencies. Node 18+.

import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const HEAD = '| File | Kind | What it shows | Source | Rights | Generated | Used | Alt |\n|---|---|---|---|---|---|---|---|';
const CLEARED = '| photos/team.jpg | photo | the two owners in the workshop | client email 2026-08-14 | client owns, said yes in writing | no | about | The owners in the workshop |';

// [name, mustCatch, files{}, manifestBody]
export const CASES = [
  ['basename-laundering', true, {
    'img/about/team.jpg': 'x',
    'img/stock/team.jpg': 'x',
    'index.html': '<img src="img/about/team.jpg" alt="The owners"><img src="img/stock/team.jpg" alt="A generic smiling team">',
  }, `${HEAD}\n${CLEARED}`],

  ['rename-onto-a-cleared-row', true, {
    'img/team.jpg': 'x',
    'index.html': '<img src="img/team.jpg" alt="Our new premises">',
  }, `${HEAD}\n| photos/team.jpg | photo | the two owners in the workshop | client email | client owns | no | about | The owners |`],

  ['allowlist-substring-bypass', true, {
    'img/sprite.png': 'x',
    'img/icon-hero.png': 'x',
    'index.html': '<img src="img/sprite.png" alt="Our workshop"><img src="img/icon-hero.png" alt="The team">',
  }, `${HEAD}\n${CLEARED}`],

  ['rights-column-deleted', true, {
    'img/yard.jpg': 'x',
    'index.html': '<img src="img/yard.jpg" alt="The yard">',
  }, '| File | Kind | What it shows | Source | Generated | Alt |\n|---|---|---|---|---|---|\n| photos/yard.jpg | photo | the yard | a stock library, licence unknown | no | The yard |'],

  ['cache-busted-query-string', true, {
    'img/shop-front.jpg': 'x',
    'index.html': '<img src="img/shop-front.jpg?v=3" alt="The shop">',
  }, `${HEAD}\n${CLEARED}`],

  ['video-poster', true, {
    'img/poster.jpg': 'x',
    'clip.mp4': 'x',
    'index.html': '<video poster="img/poster.jpg" src="clip.mp4"></video>',
  }, `${HEAD}\n${CLEARED}`],

  ['generated-plural-subject', true, {
    'img/founders.jpg': 'x',
    'index.html': '<img src="img/founders.jpg" alt="Our founders">',
  }, `${HEAD}\n| photos/founders.jpg | photo | our founders standing together | generated for this build | n/a | yes | about | Our founders |`],

  // ------------------------------------------------------------ must ALLOW
  ['declared-favicons', false, {
    'favicon.svg': 'x',
    'android-chrome-192x192.png': 'x',
    'img/team.jpg': 'x',
    'index.html': '<link rel="icon" href="favicon.svg"><link rel="icon" href="android-chrome-192x192.png"><p>hello</p>',
  }, `${HEAD}\n${CLEARED}`],

  ['srcset-renditions', false, {
    'img/team-800.jpg': 'x',
    'img/team-1600.jpg': 'x',
    'img/team.jpg': 'x',
    'index.html': '<img src="img/team.jpg" srcset="img/team-800.jpg 800w, img/team-1600.jpg 1600w" alt="The owners in the workshop">',
  }, `${HEAD}\n${CLEARED}`],

  ['fully-recorded-asset', false, {
    'img/team.jpg': 'x',
    'index.html': '<img src="img/team.jpg" alt="The owners in the workshop">',
  }, `${HEAD}\n${CLEARED}`],
];

export function runAssetCases() {
  const results = [];
  for (const [name, mustCatch, files, manifest] of CASES) {
    const dir = mkdtempSync(join(tmpdir(), 'wb-assets-'));
    try {
      mkdirSync(join(dir, 'site'));
      mkdirSync(join(dir, 'assets'), { recursive: true });
      writeFileSync(join(dir, 'STATE.md'), '# State\n\n## Next action\nnone\n');
      writeFileSync(join(dir, 'brief.md'), '# Brief\n\n## Motion and imagery\n\n- **Imagery:** client-assets-only\n');
      writeFileSync(join(dir, 'assets', 'MANIFEST.md'), `# Assets\n\n**Imagery policy:** client-assets-only\n\n${manifest}\n`);
      for (const [rel, body] of Object.entries(files)) {
        const full = join(dir, 'site', rel);
        mkdirSync(dirname(full), { recursive: true });
        writeFileSync(full, rel.endsWith('.html')
          ? `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title></head><body><h1>t</h1>${body}<a href="mailto:a@example.com">m</a></body></html>`
          : body);
      }

      const r = spawnSync(process.execPath,
        [join(root, 'checks', 'run.mjs'), join(dir, 'site'), '--profile', 'uk', '--only', 'assets', '--json', '--no-color'],
        { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });

      let findings = [];
      try { findings = (JSON.parse(r.stdout).findings || []).filter((f) => f.gate.startsWith('assets/')); } catch { /* below */ }
      // alt-mismatch is a MAJOR by design — it is a disagreement to investigate,
      // not a proven forgery — so a catch is any finding, not only a blocker.
      const caught = findings.length > 0;
      results.push({
        name, ok: caught === mustCatch, expected: mustCatch,
        detail: findings.map((f) => `${f.severity}: ${f.gate} — ${f.message.slice(0, 60)}`),
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  return results;
}

if (process.argv[1] && process.argv[1].endsWith('asset-cases.mjs')) {
  console.log('\nasset provenance — laundering routes and false positives\n');
  let bad = 0;
  for (const r of runAssetCases()) {
    if (!r.ok) bad++;
    console.log(`  ${r.ok ? 'ok  ' : 'FAIL'}  ${r.name.padEnd(26)} ${r.expected ? 'must be caught' : 'must be allowed'}`
      + (r.ok ? '' : `  <- ${r.detail.join(' | ') || 'nothing found'}`));
  }
  console.log(bad ? `\n  ${bad} mismatch(es)\n` : `\n  all ${CASES.length} cases correct\n`);
  process.exit(bad ? 1 : 0);
}
