#!/usr/bin/env node
// website-builder — the gate.
//
//   node checks/run.mjs <site-dir> [options]
//
// Options:
//   --json              machine-readable output on stdout, nothing else
//   --only <families>   comma-separated: copy,legal,seo,a11y,design,perf,integrity,security,facts,responsive
//   --skip <families>   same list, inverted
//   --profile <name>    jurisdiction profile from profiles/ (no default - config.md or --profile)
//   --assets <path>     asset manifest (default: <site>/../assets/MANIFEST.md)
//   --facts <file>      path to the build's facts.md, for provenance checks
//   --no-color          plain output
//   --list              print every gate this build of the checker knows about, and exit
//
// Exit: 0 clean · 1 blockers found · 2 could not run (bad path, or a rule
//       family crashed — an unknown result is never a pass).
//
// --only/--skip runs print PARTIAL, never PASS, and their exit code covers only
// the families that ran. Never wire a scoped run into CI or a verify.md.
//
// There is NO default site directory. A checker that silently scans the wrong
// tree and prints a confident PASS is worse than no checker at all — that
// exact bug shipped once in this tool's ancestor, so the argument is required.

import { isAbsolute, join, resolve } from 'node:path';
import { statSync } from 'node:fs';
import { Report } from './lib/report.mjs';
import { walk, allFiles, walkStats } from './lib/fs.mjs';
import { loadProfile, profileFromConfig, profileFromBrief } from './lib/profile.mjs';

import copy from './rules/copy.mjs';
import legal from './rules/legal.mjs';
import seo from './rules/seo.mjs';
import a11y from './rules/a11y.mjs';
import design from './rules/design.mjs';
import perf from './rules/perf.mjs';
import integrity from './rules/integrity.mjs';
import security from './rules/security.mjs';
import facts from './rules/facts.mjs';
import responsive from './rules/responsive.mjs';
import assets from './rules/assets.mjs';

const FAMILIES = { copy, legal, seo, a11y, design, perf, integrity, security, facts, responsive, assets };

// ------------------------------------------------------------------ argv

const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(name);
  return i !== -1 ? (argv[i + 1] || '') : null;
};
const has = (name) => argv.includes(name);

if (has('--list')) {
  for (const [name, fam] of Object.entries(FAMILIES)) {
    console.log(`\n${name}`);
    for (const g of fam.gates || []) console.log(`  ${g.id.padEnd(34)} ${g.severity.padEnd(8)} ${g.what}`);
  }
  console.log('');
  process.exit(0);
}

const target = argv.find((a) => !a.startsWith('--') && argv[argv.indexOf(a) - 1] !== '--only'
  && argv[argv.indexOf(a) - 1] !== '--skip' && argv[argv.indexOf(a) - 1] !== '--profile'
  && argv[argv.indexOf(a) - 1] !== '--assets'
  && argv[argv.indexOf(a) - 1] !== '--facts');

if (!target) {
  console.error('Usage: node checks/run.mjs <site-dir> [--json] [--only fam,fam] [--skip fam] [--profile uk] [--facts path] [--assets path]');
  console.error('');
  console.error('  <site-dir> is REQUIRED. There is deliberately no default: a checker that');
  console.error('  scans the wrong directory and prints PASS is the failure this tool exists to stop.');
  console.error('  Run `node checks/run.mjs --list` to see every gate.');
  process.exit(2);
}

const siteDir = isAbsolute(target) ? target : resolve(process.cwd(), target);

try {
  if (!statSync(siteDir).isDirectory()) throw new Error('not a directory');
} catch {
  console.error(`Cannot read a directory at: ${siteDir}`);
  process.exit(2);
}

const only = (flag('--only') || '').split(',').filter(Boolean);
const skip = (flag('--skip') || '').split(',').filter(Boolean);

// VALIDATE THE SCOPE FLAGS. `--only cpy` used to run zero gates and print a
// confident PASS with exit 0 on a fixture that otherwise produces 35 blockers.
// That is the same failure shape as defaulting the site directory, which this
// file already refuses to do — applied to the flag that controls the probe.
const known = Object.keys(FAMILIES);
const unknown = [...only, ...skip].filter((f) => !known.includes(f));
if (unknown.length) {
  console.error(`Unknown family name(s): ${unknown.join(', ')}`);
  console.error(`Valid families: ${known.join(', ')}`);
  process.exit(2);
}
// Jurisdiction resolution: the flag, then THE BUILD'S OWN brief.md, then what
// stage 00 recorded in config.md, then nothing.
//
// brief.md comes before config.md for the reason the whole subsystem exists: a
// developer in Devon builds for a client in Ohio, and the client's country is a
// fact about the client, not about the developer's default. Leaving brief.md out
// of this chain meant the per-build override that stage 00, config.md and
// templates/brief.md all document silently did nothing, and the Ohio site was
// gated against UK law — the Kansas-plumber failure this repo opens by
// describing, reproduced by following the repo's own documented command.
//
// There is still no fallback COUNTRY. Running out of sources means running out.
const briefProfile = profileFromBrief(siteDir);
const configProfile = profileFromConfig();
const profileName = flag('--profile') || briefProfile || configProfile || null;
const factsPath = flag('--facts');
const assetsPath = flag('--assets');
const asJson = has('--json');
const color = !has('--no-color') && process.stdout.isTTY !== false;

// ------------------------------------------------------------------ scan

walkStats.symlinks = 0;
const htmlFiles = walk(siteDir, ['.html', '.htm']);
const cssFiles = walk(siteDir, ['.css']);
const jsFiles = walk(siteDir, ['.js', '.mjs']);
const everyFile = allFiles(siteDir);

if (htmlFiles.length === 0) {
  console.error(`No HTML found under ${siteDir}. Nothing to check.`);
  console.error('If the site is framework-built, point this at the BUILT output, not the source.');
  process.exit(2);
}

// Style sources = real stylesheets PLUS every <style> block in the HTML. Many
// AI-built pages keep all their CSS inline; reading only .css files means the
// design and responsive gates silently do nothing on exactly those sites.
import { read as readFile, displayPath, lineAt } from './lib/fs.mjs';
const styleSources = cssFiles.map((f) => ({ file: displayPath(f, siteDir), text: readFile(f), inline: false }));
let inlineBlocks = 0;
for (const f of htmlFiles) {
  const raw = readFile(f);
  const re = /<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi;
  let m;
  while ((m = re.exec(raw)) !== null) {
    if (!m[1].trim()) continue;
    inlineBlocks++;
    styleSources.push({
      file: displayPath(f, siteDir),
      text: m[1],
      inline: true,
      lineOffset: lineAt(raw, m.index),
    });
  }
}

// Inline style="" attributes are CSS too - six clashing radii applied via
// style attributes were invisible to the design family (adversarial review).
for (const f of htmlFiles) {
  const raw = readFile(f);
  const decls = [...raw.matchAll(/\bstyle\s*=\s*("([^"]*)"|'([^']*)')/gi)]
    .map((m) => (m[2] ?? m[3] ?? '').trim()).filter(Boolean);
  if (decls.length) {
    styleSources.push({
      file: displayPath(f, siteDir),
      text: decls.map((v, i) => `[style-attr-${i}]{${v}}`).join('\n'),
      inline: true,
      lineOffset: 0,
    });
  }
}

const report = new Report(siteDir);
report.stats = {
  htmlFiles: htmlFiles.length,
  cssFiles: cssFiles.length,
  inlineStyleBlocks: inlineBlocks,
  jsFiles: jsFiles.length,
  profile: profileName,
  // Recorded so a verify.md pasted from a scoped run is distinguishable from a
  // clean full run. It was not, and that is how a partial result becomes a
  // completion claim.
  only: only.length ? only : undefined,
  skipped: skip.length ? skip : undefined,
};
report.scoped = only.length > 0 || skip.length > 0;
report.suppressed = only.length ? known.filter((k) => !only.includes(k)) : skip;

const loaded = await loadProfile(profileName);
const profile = loaded.profile || {};

// A build that says one country while the run judges it as another is the
// failure mode wearing a disguise: the report looks authoritative and cites the
// wrong statute book. Silence here is how it stayed hidden.
if (briefProfile && profileName && briefProfile !== profileName) {
  loaded.problems.push(
    `the build's brief.md says the client trades under "${briefProfile}" and this run judged it as `
    + `"${profileName}"${flag('--profile') ? ' (from --profile)' : ' (from config.md)'}. Every legal finding below `
    + `is about the wrong country. Drop the flag, or fix the brief — but do not read this report until they agree.`);
}
// A missing or broken jurisdiction is a BLOCKER, not a skip. The old code
// skipped, legal.mjs early-returned on the empty profile, and the run printed
// PASS on a site with no privacy policy at all.
//
// The findings are RAISED BY legal.mjs, not here: a gate belongs to the family
// that declares it, and a gate declared in one file and emitted from another is
// invisible to the phantom-gate check that exists to catch exactly that.
// The provenance banner is structured data on the report, not a skip line.
// Skip lines are dim, print below the findings they qualify, and share a word
// with "this gate did not run" - which is how the most important sentence in the
// system ended up dressed as a non-event.
if (loaded.profile) {
  const pv = loaded.profile.provenance || {};
  report.provenance = {
    id: loaded.profile.id,
    status: pv.status || null,
    verifiedBy: pv.verifiedBy || null,
    lawLastVerified: pv.lawLastVerified || null,
    nextReview: pv.nextReview || null,
    sources: Array.isArray(pv.sources) ? pv.sources.length : 0,
    caveats: Array.isArray(pv.caveats) ? pv.caveats : [],
  };
}
// Everything else the loader wants said - a review date passed, no consent model
// - stays a skip line, which is what those are.
for (const note of loaded.notices) {
  if (/is RESEARCHED, not verified|jurisdiction-NEUTRAL baseline/.test(note)) continue;
  report.skip('profile', note);
}

if (walkStats.symlinks > 0) {
  report.skip('scan', `${walkStats.symlinks} symlink(s) not followed - anything behind them was NOT checked`);
}

const ctx = { siteDir, htmlFiles, cssFiles, jsFiles, everyFile, profile, factsPath, assetsPath, styleSources,
  profileProblems: loaded.problems, profileName };

for (const [name, family] of Object.entries(FAMILIES)) {
  if (only.length && !only.includes(name)) continue;
  if (skip.includes(name)) continue;
  try {
    await family.run(ctx, report);
  } catch (err) {
    // A crashing rule must never be mistaken for a clean rule: verdict ERROR,
    // exit 2 (report.mjs owns that contract).
    report.crash(name, (err && err.message) || 'unknown error');
  }
}

// ------------------------------------------------------------------ out

if (asJson) {
  process.stdout.write(JSON.stringify(report.toJSON(), null, 2) + '\n');
} else {
  process.stdout.write(report.render({ color }));
}

process.exit(report.exitCode);
