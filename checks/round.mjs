#!/usr/bin/env node
// website-builder — the revision round's gate.
//
//   node checks/round.mjs builds/<slug>          check the build's CHANGELOG.md
//   node checks/round.mjs builds/<slug> --json   machine-readable (the hook uses this)
//   node checks/round.mjs --cases                the fixtures that prove it can fail
//
// WHY THIS FILE EXISTS. The pipeline used to end at stage 07, and the hook
// stopped policing a build the moment its STATE.md said LAUNCHED. Both were
// deliberate and both were wrong in the same place: launch is not the end of the
// relationship, it is the start of the part where somebody edits a site that is
// already in front of the public.
//
// So a change after launch happens inside a ROUND, and a round is a record: what
// they asked in their own words, what changed, what deliberately did not, and
// what the gate said afterwards. The first field is the one that earns the file.
// Six months later the argument is never "what did we change" — git knows that —
// it is "what did they actually ask for", and a summary written by the person
// who chose the fix is not evidence.
//
// What this CANNOT check: whether the Asked line is really their words. A round
// can be honestly shaped and fictional. That gap needs a person, like facts.md.
//
// Exit: 0 clean · 1 malformed · 2 no CHANGELOG.md at all.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// `## Round 2 — OPEN — 2026-08-20`
const ROUND = /^##\s+Round\s+(\d+)\s+[—-]\s+(OPEN|SHIPPED)\s+[—-]\s+(\d{4}-\d{2}-\d{2})\s*$/i;
const FIELD = (name) => new RegExp(`^\\s*\\*\\*${name}:\\*\\*\\s*(.+)$`, 'im');
const VERDICT = /\b(PASS|REVISE|FAIL)\b/;

/**
 * Parse and check one build changelog's text.
 * Returns { ok, findings[], rounds[], open } — `open` is the OPEN round or null,
 * which is the answer the hook actually wants.
 */
export function checkRounds(text, today = new Date().toISOString().slice(0, 10)) {
  const lines = text.split(/\r?\n/);
  const findings = [];
  const rounds = [];

  lines.forEach((line, i) => {
    const m = ROUND.exec(line);
    if (m) {
      rounds.push({ line: i + 1, n: +m[1], status: m[2].toUpperCase(), date: m[3], body: '' });
      return;
    }
    // A heading that reads as a round to a human and parses as nothing is worse
    // than an obviously different heading: it is invisible to every tool while
    // looking like the record exists.
    if (/^##\s+Round\b/i.test(line)) {
      findings.push({ line: i + 1, msg: `round heading does not parse — want "## Round 2 — OPEN — 2026-08-20", got "${line.trim()}"` });
    }
  });

  // Bodies: everything between this heading and the next `## `.
  const headingLines = rounds.map((r) => r.line);
  for (const r of rounds) {
    const next = headingLines.find((l) => l > r.line) ?? lines.length + 1;
    r.body = lines.slice(r.line, next - 1).join('\n');
  }

  if (!rounds.length) {
    findings.push({ line: 0, msg: 'no rounds at all — even the original build is Round 0' });
  } else {
    if (!rounds.some((r) => r.n === 0)) {
      findings.push({ line: 0, msg: 'no Round 0 — the original build is the round everything else is measured from' });
    }
    // Newest first, and numbers that do not repeat. A duplicated round number
    // is how two people's changes end up described as one.
    for (let i = 1; i < rounds.length; i++) {
      const a = rounds[i - 1], b = rounds[i];
      if (b.n >= a.n) findings.push({ line: b.line, msg: `Round ${b.n} is listed below Round ${a.n} — newest round goes first, and numbers never repeat` });
      if (b.date > a.date) findings.push({ line: b.line, msg: `Round ${b.n} is dated after the round above it (${b.date} > ${a.date})` });
    }
  }

  const open = rounds.filter((r) => r.status === 'OPEN');
  if (open.length > 1) {
    findings.push({ line: open[1].line, msg: `${open.length} rounds are OPEN at once — one at a time, or nobody can say which change answered which request` });
  }

  // A round left open is a round that never closed, and an open round switches
  // the live-site enforcement off for as long as it stands. Open one, forget it,
  // and the build is unpoliced for the rest of its life — the exact hole the
  // LAUNCHED flag used to be, moved one file across. Fourteen days is generous
  // for a change a client is waiting on; past that the round either ships or it
  // is re-opened with today's date and an honest account of what happened.
  const STALE_DAYS = 14;
  for (const r of open) {
    const days = Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${r.date}T00:00:00Z`)) / 86400000);
    if (Number.isFinite(days) && days > STALE_DAYS) {
      findings.push({
        line: r.line,
        msg: `Round ${r.n} has been OPEN for ${days} days — while it stands, the gate stops asking for a round at all. Close it (run the gate, record the verdict, flip it to SHIPPED) or re-open it dated today with what actually happened.`,
      });
    }
  }

  for (const r of rounds) {
    const asked = FIELD('Asked').exec(r.body);
    if (!asked || !asked[1].trim() || /^<.*>$/.test(asked[1].trim())) {
      findings.push({ line: r.line, msg: `Round ${r.n} has no **Asked:** line — a round with no request in the client's own words is a change nobody can trace back to anybody` });
    }
    if (r.status === 'SHIPPED') {
      const changed = FIELD('Changed').exec(r.body);
      if (!changed || !changed[1].trim()) {
        findings.push({ line: r.line, msg: `Round ${r.n} is SHIPPED with no **Changed:** line` });
      }
      const gate = FIELD('Gate').exec(r.body);
      if (!gate || !VERDICT.test(gate[1])) {
        findings.push({ line: r.line, msg: `Round ${r.n} is SHIPPED with no gate verdict — a round ships on PASS, and "shipped" without a checker run is the state this repo exists to prevent` });
      }
    }
  }

  return { ok: findings.length === 0, findings, rounds, open: open[0] || null };
}

/** Read a build's CHANGELOG.md. Returns null when there is none. */
export function readBuildChangelog(buildDir) {
  const p = join(buildDir, 'CHANGELOG.md');
  return existsSync(p) ? readFileSync(p, 'utf8') : null;
}

// --------------------------------------------------------------- the fixtures
export const CASES = [
  ['no rounds at all', '# Changelog — Acme\n\nWe changed some things.\n', /no rounds at all/],
  ['no Round 0', '# C\n\n## Round 2 — SHIPPED — 2026-08-20\n\n**Asked:** "make it quieter"\n**Changed:** hero\n**Gate:** PASS, 0 blockers\n', /no Round 0/],
  ['two rounds open at once', '# C\n\n## Round 2 — OPEN — 2026-08-20\n\n**Asked:** "a"\n\n## Round 1 — OPEN — 2026-08-19\n\n**Asked:** "b"\n\n## Round 0 — SHIPPED — 2026-08-18\n\n**Asked:** built\n**Changed:** all\n**Gate:** PASS\n', /OPEN at once/],
  ['a round with no request', '# C\n\n## Round 1 — OPEN — 2026-08-20\n\n**Changed:** the hero\n\n## Round 0 — SHIPPED — 2026-08-18\n\n**Asked:** built\n**Changed:** all\n**Gate:** PASS\n', /no \*\*Asked:\*\* line/],
  ['a request left as the template prompt', '# C\n\n## Round 0 — OPEN — 2026-08-18\n\n**Asked:** <what they said>\n', /no \*\*Asked:\*\* line/],
  ['shipped with no gate verdict', '# C\n\n## Round 0 — SHIPPED — 2026-08-18\n\n**Asked:** built\n**Changed:** everything\n**Gate:** ran it\n', /no gate verdict/],
  ['shipped with nothing changed', '# C\n\n## Round 0 — SHIPPED — 2026-08-18\n\n**Asked:** built\n**Gate:** PASS, 0 blockers\n', /no \*\*Changed:\*\* line/],
  ['rounds in the wrong order', '# C\n\n## Round 0 — SHIPPED — 2026-08-18\n\n**Asked:** built\n**Changed:** all\n**Gate:** PASS\n\n## Round 1 — SHIPPED — 2026-08-19\n\n**Asked:** "a"\n**Changed:** hero\n**Gate:** PASS\n', /newest round goes first/],
  ['a round left open and forgotten', '# C\n\n## Round 1 — OPEN — 2026-01-01\n\n**Asked:** "a"\n\n## Round 0 — SHIPPED — 2025-12-01\n\n**Asked:** built\n**Changed:** all\n**Gate:** PASS\n', /OPEN for \d+ days/],
  ['a heading that reads as a round and is not', '# C\n\n## Round two (August)\n\n**Asked:** "a"\n\n## Round 0 — SHIPPED — 2026-08-18\n\n**Asked:** built\n**Changed:** all\n**Gate:** PASS\n', /does not parse/],
];

/** The positive fixture: a well-formed file must survive all of the above. */
export const GOOD = '# Changelog — Acme Plumbing\n\n'
  + '## Round 1 — OPEN — 2026-08-20\n\n'
  + '**Asked:** "the hero feels shouty and I can never find the prices"\n'
  + '**Changed:** hero headline down two steps, price index moved above the fold\n'
  + '**Not changed:** the phone number stays in the header — they asked to move it to the footer, and it is the only contact route on a phone\n'
  + '**Gate:** not yet run\n\n'
  + '## Round 0 — SHIPPED — 2026-08-18\n\n'
  + '**Asked:** the original build — see brief.md\n'
  + '**Changed:** the site, from nothing\n'
  + '**Not changed:** n/a\n'
  + '**Gate:** PASS, 0 blockers\n';

export function runRoundCases() {
  const out = [];
  // A fixed 'today' so the staleness case is a probe rather than a calendar.
  for (const [name, text, want] of CASES) {
    const { ok, findings } = checkRounds(text, '2026-08-20');
    const hit = findings.some((f) => want.test(f.msg));
    out.push({ ok: !ok && hit, msg: `${name} — caught${ok ? ' NOTHING (a broken round record passed)' : hit ? '' : `, but with the wrong finding: ${findings.map((f) => f.msg).join('; ')}`}` });
  }
  const good = checkRounds(GOOD, '2026-08-20');
  out.push({ ok: good.ok, msg: good.ok ? 'and a well-formed record passes, with its open round found' : `the good fixture FAILED: ${good.findings.map((f) => f.msg).join('; ')}` });
  out.push({ ok: good.open && good.open.n === 1, msg: 'the open round is identified by number, which is what the hook keys off' });
  // The template must satisfy its own checker, minus the parts a human fills
  // in. A template that cannot pass the gate it ships beside is the defect this
  // repo retired an example over.
  const tmpl = join(root, 'templates', 'CHANGELOG.md');
  if (existsSync(tmpl)) {
    const t = checkRounds(readFileSync(tmpl, 'utf8').replace(/<YYYY-MM-DD>/g, '2026-08-20'), '2026-08-20');
    const onlyGate = t.findings.every((f) => /gate verdict/.test(f.msg));
    out.push({ ok: onlyGate, msg: onlyGate ? 'templates/CHANGELOG.md parses as a real Round 0' : `templates/CHANGELOG.md does not parse: ${t.findings.map((f) => f.msg).join('; ')}` });
  }
  return out;
}

// ------------------------------------------------------------------- CLI
if (process.argv[1] && process.argv[1].endsWith('round.mjs')) {
  const argv = process.argv.slice(2);

  if (argv.includes('--help') || argv.includes('-h')) {
    console.log('Usage: node checks/round.mjs <build dir> [--json]\n' +
      '       node checks/round.mjs --cases\n\n' +
      '  Checks builds/<slug>/CHANGELOG.md — the record of every change made to\n' +
      '  the site after it first shipped. Reports whether a round is open.\n');
    process.exit(0);
  }

  if (argv.includes('--cases')) {
    let bad = 0;
    for (const r of runRoundCases()) {
      if (!r.ok) bad++;
      console.log(`${r.ok ? '  ok  ' : '  FAIL'}  ${r.msg}`);
    }
    console.log(bad ? `\n${bad} failed` : '\nall passed');
    process.exit(bad ? 1 : 0);
  }

  const target = argv.find((a) => !a.startsWith('-'));
  const json = argv.includes('--json');
  if (!target) {
    console.error('A build directory is REQUIRED: node checks/round.mjs builds/<slug>');
    process.exit(2);
  }
  const dir = resolve(process.cwd(), target);
  const text = readBuildChangelog(dir);
  if (text === null) {
    if (json) { console.log(JSON.stringify({ ok: false, missing: true, findings: [] })); process.exit(2); }
    console.error(`No CHANGELOG.md in ${target}. Every build has one from the moment start.mjs opens it; ` +
      `copy templates/CHANGELOG.md in and record Round 0 honestly.`);
    process.exit(2);
  }

  const { ok, findings, rounds, open } = checkRounds(text);
  if (json) {
    console.log(JSON.stringify({ ok, missing: false, open: open ? { n: open.n, date: open.date } : null, rounds: rounds.length, findings }));
    process.exit(ok ? 0 : 1);
  }
  for (const f of findings) console.log(`  ${f.line ? `L${f.line}` : '   '}  ${f.msg}`);
  console.log(ok
    ? `\n${rounds.length} round(s) recorded — ${open ? `Round ${open.n} is OPEN (since ${open.date})` : 'none open, the site is as shipped'}\n`
    : `\n${findings.length} problem(s).\n`);
  process.exit(ok ? 0 : 1);
}
