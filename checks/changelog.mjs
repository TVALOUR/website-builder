#!/usr/bin/env node
// website-builder — the changelog's own gate.
//
//   node checks/changelog.mjs           check CHANGELOG.md
//   node checks/changelog.mjs --cases   run the negative fixtures that prove it can fail
//   node checks/changelog.mjs --tags    also compare released versions against git tags
//
// WHY THIS FILE EXISTS. A changelog is the one document in a repo that nothing
// forces anybody to write, so it rots in a predictable order: first the dates
// stop being real, then a release ships with an empty section, then somebody
// adds 0.3.0 above 0.4.0 and the file starts lying about the order things
// happened in. On a repo whose entire argument is that an unenforced rule is a
// wish, a changelog maintained by good intentions would be the loudest possible
// exception.
//
// So the shape is checked, and — per the rule this repo holds every other probe
// to — the checker ships the broken fixtures that prove it can fail. Run
// `--cases` and watch each one get caught.
//
// What this CANNOT check: whether an entry is true, or whether a change that
// happened got written down at all. A silent engine change with no line here
// passes. That gap closes with a person, the same way facts.md does.
//
// Exit: 0 clean · 1 the file is malformed · 2 the file is missing.

import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const FILE = join(root, 'CHANGELOG.md');

// `## 0.2.0 — 2026-08-19`. Em dash is the house style; a plain hyphen is
// accepted because the difference is invisible in most editors and rejecting it
// would be pedantry rather than a check.
// The leading `v` is optional and accepted, because `checkTags` below builds tag
// names as `v0.2.0` — a file written in the same convention as its own tags was
// being called malformed by the tool that expects them.
const RELEASE = /^##\s+v?(\d+)\.(\d+)\.(\d+)\s+[—-]\s+(\d{4}-\d{2}-\d{2})\s*$/;
const UNRELEASED = /^##\s+Unreleased\s*$/i;

/** True only for a date string that is a real calendar day, not just digits. */
function isRealDate(s) {
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/**
 * Check one changelog's text. Returns { ok, findings[] } — findings carry the
 * line number, because "the changelog is malformed" with no line is the kind of
 * error message that gets ignored until it is deleted.
 */
export function checkChangelog(text) {
  const lines = text.split(/\r?\n/);
  const findings = [];
  const releases = [];
  let unreleasedAt = -1;

  lines.forEach((line, i) => {
    if (UNRELEASED.test(line)) {
      if (unreleasedAt !== -1) findings.push({ line: i + 1, msg: 'a second "## Unreleased" section — there can only be one' });
      unreleasedAt = i;
      return;
    }
    const m = RELEASE.exec(line);
    if (m) {
      releases.push({ line: i + 1, major: +m[1], minor: +m[2], patch: +m[3], date: m[4] });
      return;
    }
    // A heading that looks like a release but does not parse is worse than one
    // that is obviously something else: it reads as a release to a human and is
    // invisible to every tool.
    if (/^##\s+v?\d/.test(line)) {
      findings.push({ line: i + 1, msg: `heading does not parse as a release — want "## 0.2.0 — 2026-08-19", got "${line.trim()}"` });
    }
  });

  if (unreleasedAt === -1) {
    findings.push({ line: 0, msg: 'no "## Unreleased" section — the next change has nowhere to land, which is how a changelog stops being written' });
  }
  if (releases.length === 0) {
    findings.push({ line: 0, msg: 'no releases at all' });
  }

  // Order: newest first, strictly descending, and dates that do not go
  // backwards as you read down. Both have been got wrong in real repos by a
  // merge rather than by a person.
  for (let i = 1; i < releases.length; i++) {
    const a = releases[i - 1], b = releases[i];
    const rank = (r) => r.major * 1e6 + r.minor * 1e3 + r.patch;
    if (rank(b) >= rank(a)) {
      findings.push({ line: b.line, msg: `${b.major}.${b.minor}.${b.patch} is listed below ${a.major}.${a.minor}.${a.patch} but is not older — newest goes first` });
    }
    if (b.date > a.date) {
      findings.push({ line: b.line, msg: `${b.date} is dated after the release above it (${a.date})` });
    }
  }

  for (const r of releases) {
    if (!isRealDate(r.date)) findings.push({ line: r.line, msg: `${r.date} is not a real date` });
  }

  // An empty release is the tell that somebody tagged and moved on. Content
  // means any non-blank line before the next `## ` heading or the end.
  const headingLines = [...releases.map((r) => r.line), ...(unreleasedAt === -1 ? [] : [unreleasedAt + 1])].sort((a, b) => a - b);
  for (const r of releases) {
    const next = headingLines.find((l) => l > r.line) ?? lines.length + 1;
    const body = lines.slice(r.line, next - 1).join('\n').replace(/^[\s-]*$/gm, '').trim();
    if (!body) findings.push({ line: r.line, msg: `${r.major}.${r.minor}.${r.patch} has no entries — a release with nothing in it is a tag, not a changelog` });
  }

  return { ok: findings.length === 0, findings, releases };
}

/**
 * Released versions against git tags. Advisory, and skipped without git or in a
 * shallow checkout: CI clones without tags by default, and a check that fails
 * for an absent reason teaches people to ignore it.
 */
export function checkTags(releases) {
  const r = spawnSync('git', ['tag', '--list'], { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) return { skipped: 'git is not available here' };
  const tags = new Set(r.stdout.split(/\r?\n/).map((t) => t.trim()).filter(Boolean));
  if (tags.size === 0) return { skipped: 'no tags in this checkout (CI clones without them)' };
  const missing = releases
    .map((x) => `v${x.major}.${x.minor}.${x.patch}`)
    .filter((t) => !tags.has(t));
  return { missing };
}

// --------------------------------------------------------------- the fixtures
//
// Each one is a changelog that is wrong in exactly one way, with the finding it
// must produce. A probe that cannot fail is not a probe, and that applies to
// the probe watching the changelog as much as to the 162 watching the sites.
export const CASES = [
  ['no Unreleased section', '# Changelog\n\n## 0.1.0 — 2026-08-18\n\n- shipped\n', /Unreleased/],
  ['a release with nothing in it', '# Changelog\n\n## Unreleased\n\nNothing yet.\n\n## 0.2.0 — 2026-08-19\n\n## 0.1.0 — 2026-08-18\n\n- shipped\n', /no entries/],
  ['versions out of order', '# Changelog\n\n## Unreleased\n\nNothing yet.\n\n## 0.1.0 — 2026-08-18\n\n- a\n\n## 0.2.0 — 2026-08-19\n\n- b\n', /newest goes first/],
  ['a date that goes forwards down the page', '# Changelog\n\n## Unreleased\n\nNothing yet.\n\n## 0.2.0 — 2026-08-18\n\n- a\n\n## 0.1.0 — 2026-08-19\n\n- b\n', /dated after the release above/],
  ['a date that is not a day', '# Changelog\n\n## Unreleased\n\nNothing yet.\n\n## 0.1.0 — 2026-02-31\n\n- a\n', /not a real date/],
  ['a heading that looks like a release and is not', '# Changelog\n\n## Unreleased\n\nNothing yet.\n\n## v1.2 (August)\n\n- a\n\n## 0.1.0 — 2026-08-18\n\n- b\n', /does not parse as a release/],
  ['no releases', '# Changelog\n\n## Unreleased\n\nNothing yet.\n', /no releases at all/],
];

/** Runs the fixtures. Shape matches every other *-cases.mjs here. */
export function runChangelogCases() {
  const out = [];
  for (const [name, text, want] of CASES) {
    const { ok, findings } = checkChangelog(text);
    const hit = findings.some((f) => want.test(f.msg));
    out.push({ ok: !ok && hit, msg: `${name} — caught${ok ? ' NOTHING (the check passed a broken file)' : hit ? '' : `, but with the wrong finding: ${findings.map((f) => f.msg).join('; ')}`}` });
  }
  // And the real file must pass, or the fixtures above are proving nothing.
  if (existsSync(FILE)) {
    const { ok, findings } = checkChangelog(readFileSync(FILE, 'utf8'));
    out.push({ ok, msg: ok ? 'and the repo\'s own CHANGELOG.md passes' : `the repo's own CHANGELOG.md FAILS: ${findings.map((f) => `L${f.line} ${f.msg}`).join('; ')}` });
  }
  return out;
}

// ------------------------------------------------------------------- CLI
if (process.argv[1] && process.argv[1].endsWith('changelog.mjs')) {
  const argv = process.argv.slice(2);

  if (argv.includes('--help') || argv.includes('-h')) {
    console.log('Usage: node checks/changelog.mjs [--cases] [--tags]\n\n' +
      '  (no flags)  check CHANGELOG.md and print any findings\n' +
      '  --cases     run the negative fixtures that prove this check can fail\n' +
      '  --tags      also report released versions with no matching git tag\n');
    process.exit(0);
  }

  if (argv.includes('--cases')) {
    let bad = 0;
    for (const r of runChangelogCases()) {
      if (!r.ok) bad++;
      console.log(`${r.ok ? '  ok  ' : '  FAIL'}  ${r.msg}`);
    }
    console.log(bad ? `\n${bad} failed` : '\nall passed');
    process.exit(bad ? 1 : 0);
  }

  if (!existsSync(FILE)) {
    console.error('CHANGELOG.md is missing. A repo people are told to pull needs one.');
    process.exit(2);
  }

  const { ok, findings, releases } = checkChangelog(readFileSync(FILE, 'utf8'));
  for (const f of findings) console.log(`  ${f.line ? `L${f.line}` : '   '}  ${f.msg}`);

  if (argv.includes('--tags')) {
    const t = checkTags(releases);
    if (t.skipped) console.log(`  tags: not checked — ${t.skipped}`);
    else if (t.missing.length) console.log(`  tags: released but never tagged — ${t.missing.join(', ')}`);
    else console.log('  tags: every release has one');
  }

  console.log(ok
    ? `\nCHANGELOG.md is well-formed — ${releases.length} release(s), newest ${releases[0] ? `${releases[0].major}.${releases[0].minor}.${releases[0].patch} (${releases[0].date})` : 'none'}\n`
    : `\n${findings.length} problem(s).\n`);
  process.exit(ok ? 0 : 1);
}
