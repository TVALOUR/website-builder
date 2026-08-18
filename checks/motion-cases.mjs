// website-builder — the motion gate's false-positive suite.
//
//   node checks/motion-cases.mjs        run it directly
//   (checks/selftest.mjs imports and runs it too)
//
// Every "must NOT block" case below is real, ordinary, well-built code that an
// earlier version of `design/motion-policy` blocked a ship on. That list is the
// point of the file: a BLOCKER that is wrong about somebody's code is not a
// small defect, it is the moment the tool stops being a checker and becomes an
// obstacle, and `--skip design` goes into the shell history and stays there —
// taking the ten real design gates with it.
//
// The "must block" cases exist so nobody fixes the first list by turning the
// gate off. Both halves have to hold.
//
// Zero dependencies. Node 18+.

import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// [name, expectation, css, js]
//   false  — must not produce a blocker
//   true   — must produce a blocker
//   'flag' — must produce a finding at some severity
export const CASES = [
  // ---------------------------------------------------------- must NOT block
  ['raf-debounce', false, 'body{color:#222}', `
    let t; window.addEventListener('resize', () => {
      cancelAnimationFrame(t);
      t = requestAnimationFrame(() => document.documentElement.style.setProperty('--vh', innerHeight + 'px'));
    });`],
  ['io-aria-current', false, 'body{color:#222}', `
    const o = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) {
      document.querySelector('a[href="#' + e.target.id + '"]').setAttribute('aria-current', 'true'); } });
    document.querySelectorAll('section').forEach((s) => o.observe(s));`],
  ['commented-out-keyframes', false, `
    /* Client asked for no movement, so this is disabled:
    @keyframes fadeUp { from { opacity:0 } to { opacity:1 } }
    */
    body{color:#222}`, 'console.log(1);'],
  ['unreferenced-keyframes', false, '@keyframes spin{to{transform:rotate(360deg)}} body{color:#222}', 'console.log(1);'],
  ['js-comment-mentions-io', false, 'body{color:#222}', `
    // we deliberately do NOT use IntersectionObserver here - the client did not want scroll reveals
    console.log(1);`],
  ['filter-hover', false, '.card{transition:filter .2s} .card:hover{filter:brightness(1.05)}', ''],
  ['outline-offset-focus', false, 'a:focus-visible{outline-offset:3px;transition:outline-offset .12s}', ''],
  ['colour-hover', false, 'a{transition:color .15s} a:hover{color:#1a4d2e}', ''],
  ['static-centring-transform', false, '.m{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)}', ''],

  // -------------------------------------------------------------- must block
  ['real-scroll-reveal', true, '.r{opacity:0;transition:opacity .4s,transform .4s}', `
    const o = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.style.opacity = 1; e.target.style.transform = 'none'; } }));
    document.querySelectorAll('.r').forEach((n) => o.observe(n));`],
  ['referenced-keyframes', true, '@keyframes drift{from{transform:translateY(12px)}to{transform:none}} .c{animation:drift .6s}', ''],
  ['transform-transition', true, '.c{transition:transform .3s} .c:hover{transform:scale(1.02)}', ''],
  ['animation-library', true, 'body{color:#222}', "import gsap from 'gsap'; gsap.to('.x',{y:0});"],

  // ------------------------------------------------------------ must be seen
  ['scroll-behavior-smooth', 'flag', 'html{scroll-behavior:smooth}', ''],
];

/** @returns {{name, ok, expected, severities}[]} */
export function runMotionCases() {
  const results = [];
  for (const [name, expectation, css, js] of CASES) {
    const dir = mkdtempSync(join(tmpdir(), 'wb-motion-'));
    try {
      mkdirSync(join(dir, 'site'));
      // A managed build with an explicit `none` policy — the case where the
      // gate is supposed to be at its strictest.
      writeFileSync(join(dir, 'STATE.md'), '# State\n\n## Next action\nnone\n');
      writeFileSync(join(dir, 'brief.md'), '# Brief\n\n## Motion and imagery\n\n- **Motion:** none\n');
      writeFileSync(join(dir, 'site', 'styles.css'), css);
      writeFileSync(join(dir, 'site', 'app.js'), js);
      writeFileSync(join(dir, 'site', 'index.html'),
        '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title>'
        + '<link rel="stylesheet" href="styles.css">'
        // JSON-LD carrying an animation word on purpose: it is data, not script.
        + '<script type="application/ld+json">{"@context":"https://schema.org","name":"requestAnimationFrame"}</script>'
        + '</head><body><h1>t</h1><a href="mailto:a@example.com">mail</a>'
        + '<script src="app.js"></script></body></html>');

      const r = spawnSync(process.execPath,
        [join(root, 'checks', 'run.mjs'), join(dir, 'site'), '--profile', 'uk', '--only', 'design', '--json', '--no-color'],
        { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });

      let findings = [];
      try { findings = (JSON.parse(r.stdout).findings || []).filter((f) => f.gate === 'design/motion-policy'); } catch { /* below */ }
      const blocked = findings.some((f) => f.severity === 'blocker');
      const ok = expectation === 'flag' ? findings.length > 0 : blocked === expectation;
      results.push({
        name, ok, expected: expectation,
        severities: findings.map((f) => `${f.severity}: ${f.message.slice(0, 64)}`),
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  return results;
}

// Run standalone.
if (process.argv[1] && process.argv[1].endsWith('motion-cases.mjs')) {
  console.log('\nmotion gate — false positives and true positives\n');
  let bad = 0;
  for (const r of runMotionCases()) {
    if (!r.ok) bad++;
    const want = r.expected === 'flag' ? 'must be flagged' : r.expected ? 'must block' : 'must NOT block';
    console.log(`  ${r.ok ? 'ok  ' : 'FAIL'}  ${r.name.padEnd(24)} ${want}${r.ok ? '' : `  <- ${r.severities.join(' | ') || 'no finding at all'}`}`);
  }
  console.log(bad ? `\n  ${bad} mismatch(es)\n` : `\n  all ${CASES.length} cases correct\n`);
  process.exit(bad ? 1 : 0);
}
