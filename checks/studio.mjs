#!/usr/bin/env node
// website-builder — the studio layer's gate.
//
//   node checks/studio.mjs           check studio/ (silent and clean if unused)
//   node checks/studio.mjs --cases   the fixtures that prove it can fail
//
// WHY THIS FILE EXISTS. `studio/` is the one place in this repo where anything
// persists between builds, and persistence is exactly what the rest of the repo
// refuses on purpose: stacking taste across projects is how every site a system
// builds ends up resembling the last one.
//
// The exception is narrow and it has a line through it. The OPERATOR's standards
// persist — how much you ask, what you have learned never to ship. The CLIENT's
// taste does not, and neither does a look. So this checker watches two things,
// and both of them are that line:
//
//   1. A standing POSITIVE look under "Always" in floor.md. "Always ask about
//      photography" is a method. "Always a warm serif" is the gravity well,
//      written down, made permanent and applied to businesses that have nothing
//      in common. The second one is caught.
//   2. Three builds in a row that have started to resemble each other, read from
//      directions.md — the mechanical version of stage 04's "differ from the
//      last two builds on two of three axes", which until now was a rule an
//      agent had to remember about builds it could no longer see.
//
// What this CANNOT check: whether a quote in rejections.md is really what
// somebody said. A ledger can be honestly shaped and entirely invented. That
// gap needs a person, like facts.md.
//
// Exit: 0 clean or unused · 1 a finding.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const studioDir = join(root, 'studio');

// A look, in the words people actually write. Hexes, the direction names from
// shared/directions.md, and the type/colour vocabulary that turns a method into
// a house style.
const HEX = /#[0-9a-f]{3,8}\b/i;
const DIRECTIONS = /\b(field ledger|editorial|industrial spec|signwriter|clinical|catalogue|terminal|field guide|noticeboard|manifest|studio plate|almanac|product sheet)\b/i;
const LOOK_WORDS = /\b(serif|sans|grotesque|mono|monospace|condensed|didone|humanist|slab|palette|accent colour|accent color|cream|sage|navy|warm neutral|gradient)\b/i;
// The words that mean the line is asking about a look rather than fixing one.
const NOT_A_PRESCRIPTION = /\b(ask|asks|asking|check|checks|confirm|whether|avoid|unless|never|not\s+a|no\s)/i;

/** Split a markdown document into `## ` sections. */
function sections(text) {
  const out = {};
  let key = null;
  for (const line of text.split(/\r?\n/)) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) { key = m[1].toLowerCase(); out[key] = []; continue; }
    if (key) out[key].push(line);
  }
  for (const k of Object.keys(out)) out[k] = out[k].join('\n');
  return out;
}

/** The rule with the teeth: no standing positive look. */
export function checkFloor(text) {
  const findings = [];
  const s = sections(text);
  if (!('always' in s) || !('never' in s)) {
    findings.push({ msg: 'floor.md needs an "## Always" section and a "## Never" section — the split is the whole point, because only one of them is safe to make permanent' });
  }
  const always = s.always || '';
  for (const line of always.split(/\r?\n/)) {
    const t = line.trim();
    if (!t.startsWith('-') || t.startsWith('<!--')) continue;
    // A look word is only a standing look when the line PRESCRIBES one. "Always
    // ask whether their brand uses a serif or a sans" is a method, and flagging
    // it is how a checker teaches people to switch it off. Five honest lines out
    // of five were false-flagged before this existed.
    const hit = HEX.exec(t) || DIRECTIONS.exec(t) || LOOK_WORDS.exec(t);
    // ...and the qualifier only counts when it comes BEFORE the look it governs.
    // Testing the whole line let "Always use a warm serif, never a grotesque"
    // suppress itself on the word `never` at the far end.
    if (hit) {
      const q = NOT_A_PRESCRIPTION.exec(t.slice(0, hit.index));
      if (q) continue;
    }
    if (hit) {
      findings.push({
        msg: `a standing LOOK under Always ("${hit[0]}"): ${t.slice(0, 80)}${t.length > 80 ? '…' : ''}` +
          ' — a look that persists across clients is the gravity well made permanent. Move it to Never if it is a thing you avoid, or into the build that wants it.',
      });
    }
  }
  return findings;
}

/** The gravity well, read from the log rather than from memory. */
export function checkDirections(text) {
  const findings = [];
  const cells = (l) => l.split('|').map((c) => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);
  const lines = text.split(/\r?\n/).filter((l) => /^\s*\|/.test(l) && !/^\s*\|\s*-+/.test(l));
  if (!lines.length) return findings;

  // Columns are found BY NAME, not by position. Reading axes off fixed indices
  // meant one honest extra column ("Client", say) shifted every axis silently
  // and the checker then reported a gravity well citing the wrong cells —
  // confident, wrong, and impossible to argue with. A misread is worse than a
  // miss here, because nobody doubts a checker that sounds specific.
  const header = cells(lines[0]).map((h) => h.toLowerCase());
  const col = (...names) => header.findIndex((h) => names.some((n) => h.includes(n)));
  const idx = {
    build: col('build', 'site', 'slug'),
    direction: col('direction'),
    type: col('display', 'type'),
    colour: col('colour', 'color'),
    structure: col('structure', 'macro'),
  };
  const missing = Object.entries(idx).filter(([, v]) => v === -1).map(([k]) => k);
  if (missing.length) {
    findings.push({ msg: `directions.md has no column for ${missing.join(', ')} — the header must name build, direction, display type, colour temperament and macrostructure, in any order. Without them nothing can be compared, and guessing by position is how a checker reports the wrong cells with total confidence.` });
    return findings;
  }

  const rows = lines.slice(1).map(cells).filter((c) => c.length > Math.max(...Object.values(idx)) && !/^date$/i.test(c[0]));
  const at = (r, k) => (r[idx[k]] || '').toLowerCase();

  // Newest first, as the file is written. Three consecutive builds that agree
  // on two of the three axes are one house style with different words on it.
  for (let i = 0; i + 2 < rows.length; i++) {
    const [a, b, c] = [rows[i], rows[i + 1], rows[i + 2]];
    const same = ['type', 'colour', 'structure'].filter((k) => at(a, k) === at(b, k) && at(b, k) === at(c, k));
    if (same.length >= 2 || (at(a, 'direction') === at(b, 'direction') && at(b, 'direction') === at(c, 'direction'))) {
      findings.push({
        msg: `${a[idx.build]}, ${b[idx.build]} and ${c[idx.build]} are converging — three builds running sharing ` +
          `${same.length >= 2 ? 'two or more of {display type, colour temperament, macrostructure}' : `one direction (${a[idx.direction]})`}. ` +
          'That is the gravity well. The next build differs on two axes or it is the same site with different words.',
      });
      break;
    }
  }
  return findings;
}

/** The ledger is only worth keeping if the quote column is real. */
export function checkRejections(text) {
  const findings = [];
  const rows = text.split(/\r?\n/)
    .filter((l) => /^\s*\|/.test(l) && !/^\s*\|\s*-+/.test(l))
    .map((l) => l.split('|').map((c) => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1))
    .filter((c) => c.length >= 5 && !/^date$/i.test(c[0]));
  for (const r of rows) {
    if (!/["'“”‘’]/.test(r[3])) {
      findings.push({ msg: `${r[0]} ${r[1]}: the words column is not a quote (${r[3].slice(0, 60)}) — a paraphrase is your diagnosis wearing their voice, and it is the part you will most want to re-examine later` });
    }
  }
  return findings;
}

/** Run over the real folder. Returns [] when the layer is not in use. */
export function checkStudio(dir = studioDir) {
  const findings = [];
  // existsSync, not content truthiness: an EMPTY floor.md read as "the layer is
  // not in use", so the one state that most needs saying something got silence.
  const read = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), 'utf8') : null);
  const floor = read('floor.md');
  const dirs = read('directions.md');
  const rej = read('rejections.md');
  if (floor !== null) findings.push(...checkFloor(floor).map((f) => ({ ...f, file: 'floor.md' })));
  if (dirs !== null) findings.push(...checkDirections(dirs).map((f) => ({ ...f, file: 'directions.md' })));
  if (rej !== null) findings.push(...checkRejections(rej).map((f) => ({ ...f, file: 'rejections.md' })));
  return { findings, used: floor !== null || dirs !== null || rej !== null };
}

// --------------------------------------------------------------- the fixtures
export function runStudioCases() {
  const out = [];

  const goodFloor = '## Always\n\n- Ask for photographs at the first meeting.\n- Show two rendered directions before any real CSS.\n\n## Never\n\n- Never a centred hero with three equal cards.\n- Never a warm serif on a trade site by default.\n';
  out.push({ ok: checkFloor(goodFloor).length === 0, msg: 'a floor of methods and negatives passes' });

  for (const [name, line, want] of [
    ['a standing font choice', '- Always a warm serif for the display face.', /serif/],
    ['a standing palette', '- Always tint the neutrals toward #f4efe6.', /#f4efe6/],
    ['a standing direction', '- Always start from Field ledger, it works.', /field ledger/i],
  ]) {
    const f = checkFloor(`## Always\n\n${line}\n\n## Never\n\n- Never a stock photo.\n`);
    out.push({ ok: f.length > 0 && want.test(f[0].msg), msg: `${name} under Always — caught${f.length ? '' : ' NOTHING'}` });
  }
  // The false-positive half. Five honest method lines out of five were flagged
  // before the qualifier rule existed, and a checker that refuses real work is
  // one people switch off — which costs more than the misses it was catching.
  for (const line of [
    '- Always ask whether their brand already uses a serif or a sans.',
    '- Always check what accent colour their van and their sign actually are.',
    '- Always avoid a cream palette unless their own material is warm.',
    '- Always confirm whether their brand guide specifies a gradient before ruling one out.',
    '- Always ask if their logo has a navy variant for dark backgrounds.',
  ]) {
    const f = checkFloor(`## Always\n\n${line}\n\n## Never\n\n- Never a stock photo.\n`);
    out.push({ ok: f.length === 0, msg: `an honest method line survives: "${line.slice(2, 52)}…"${f.length ? ` — FLAGGED: ${f[0].msg.slice(0, 60)}` : ''}` });
  }
  {
    // ...but the qualifier must not become a magic word at the end of a line.
    const f = checkFloor('## Always\n\n- Always use a warm serif, never a grotesque.\n\n## Never\n\n- Never a stock photo.\n');
    out.push({ ok: f.length > 0, msg: 'a prescription with "never" trailing at the end of it is still caught' });
  }
  {
    // ...and the same words under Never are exactly what the file is for.
    const f = checkFloor('## Always\n\n- Ask about photography early.\n\n## Never\n\n- Never a warm serif with a sage accent again.\n');
    out.push({ ok: f.length === 0, msg: 'the same look under Never is allowed — negatives are the whole point of keeping the file' });
  }
  {
    const f = checkFloor('- Always ask about photography.\n');
    out.push({ ok: f.some((x) => /Always" section/.test(x.msg) || /"## Always"/.test(x.msg)), msg: 'a floor with no Always/Never split — caught' });
  }

  const varied = '| Date | Build | Direction | Display | Colour | Structure |\n|---|---|---|---|---|---|\n'
    + '| 2026-08-14 | c | Field ledger | serif | warm paper | ruled lists |\n'
    + '| 2026-08-09 | b | Signwriter | display | high chroma | painted panels |\n'
    + '| 2026-08-02 | a | Manifest | grotesque | near-monochrome | tabular |\n';
  out.push({ ok: checkDirections(varied).length === 0, msg: 'three genuinely different builds pass the gravity-well check' });

  const converged = '| Date | Build | Direction | Display | Colour | Structure |\n|---|---|---|---|---|---|\n'
    + '| 2026-08-14 | c | Editorial | warm serif | cream | wide margins |\n'
    + '| 2026-08-09 | b | Field ledger | warm serif | cream | ruled lists |\n'
    + '| 2026-08-02 | a | Clinical | warm serif | cream | short lines |\n';
  const conv = checkDirections(converged);
  out.push({ ok: conv.length > 0 && /gravity well/.test(conv[0].msg), msg: 'three builds sharing type and colour — caught as the gravity well, not as variety' });

  const sameDirection = '| Date | Build | Direction | Display | Colour | Structure |\n|---|---|---|---|---|---|\n'
    + '| 2026-08-14 | c | Editorial | grotesque | cool | masthead |\n'
    + '| 2026-08-09 | b | Editorial | serif | warm | folios |\n'
    + '| 2026-08-02 | a | Editorial | mono | steel | columns |\n';
  out.push({ ok: checkDirections(sameDirection).length > 0, msg: 'and three builds on one direction is caught even when every axis differs' });

  const paraphrased = '| Date | Build | Saw | Words | Rule |\n|---|---|---|---|---|\n| 2026-08-02 | a | hero | client wanted a more premium feel | lift the type |\n';
  out.push({ ok: checkRejections(paraphrased).length > 0, msg: 'a paraphrase in the words column — caught' });
  const quoted = '| Date | Build | Saw | Words | Rule |\n|---|---|---|---|---|\n| 2026-08-02 | a | hero | "looks like every other plumber" | one specific real thing in the first screen |\n';
  out.push({ ok: checkRejections(quoted).length === 0, msg: 'and a real quote passes' });

  // The shipped examples must satisfy their own checker. An example that fails
  // the gate it ships beside is the defect this repo retired an example over.
  for (const f of ['floor', 'rejections', 'directions']) {
    const p = join(studioDir, `${f}.example.md`);
    if (!existsSync(p)) continue;
    const text = readFileSync(p, 'utf8');
    const found = f === 'floor' ? checkFloor(text) : f === 'directions' ? checkDirections(text) : checkRejections(text);
    out.push({ ok: found.length === 0, msg: `studio/${f}.example.md passes its own check${found.length ? `: ${found[0].msg}` : ''}` });
  }

  return out;
}

// ------------------------------------------------------------------- CLI
if (process.argv[1] && process.argv[1].endsWith('studio.mjs')) {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log('Usage: node checks/studio.mjs [--cases]\n\n' +
      '  Checks studio/ — the only layer in this repo that persists between\n' +
      '  builds. Clean and quiet when the layer is not in use.\n');
    process.exit(0);
  }
  if (argv.includes('--cases')) {
    let bad = 0;
    for (const r of runStudioCases()) {
      if (!r.ok) bad++;
      console.log(`${r.ok ? '  ok  ' : '  FAIL'}  ${r.msg}`);
    }
    console.log(bad ? `\n${bad} failed` : '\nall passed');
    process.exit(bad ? 1 : 0);
  }

  const { findings, used } = checkStudio();
  if (!used) {
    console.log('\nstudio/ holds no real files yet — nothing to check. Copy an example to start one.\n');
    process.exit(0);
  }
  for (const f of findings) console.log(`  ${f.file}  ${f.msg}`);
  console.log(findings.length ? `\n${findings.length} finding(s).\n` : '\nstudio/ is clean — standing negatives, no standing look.\n');
  process.exit(findings.length ? 1 : 0);
}
