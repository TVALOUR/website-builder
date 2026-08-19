// website-builder — which TRADE this is, resolved once for every rule.
//
// The sibling of lib/profile.mjs and lib/regime.mjs. Those two answer "which
// country" and "what kind of project"; this one answers "what does the law
// require of this trade", which is the question the jurisdiction profiles
// explicitly say they cannot answer.
//
// THE DESIGN DECISION THAT MATTERS MOST HERE is that detection and enforcement
// are separated. It would be easy — and wrong — to sniff "physiotherapy" out of
// an <h1> and start emitting blockers about HCPC registration. Words are
// ambiguous. "Chambers" is a barrister and a hotel. "Practice" is a clinic, a
// law firm and a music teacher. "Agent" is a letting agent, a travel agent and
// a talent agent. A checker that acts on a guess produces a blocker the build
// cannot clear by fixing the site, only by arguing with the tool — and people
// who cannot clear a blocker learn to pass --skip.
//
// So: detection RAISES A QUESTION (`sector/undeclared`, major). Declaration in
// the brief or the facts ledger APPLIES THE DUTIES. The build says what it is,
// once, and then the gate is as hard as the law is.
//
// Writing `Sector: none` is a legitimate answer and is respected in full. It is
// also on the record, in a file the client can read, which is the point: an
// unregulated trade should have said so on purpose.

import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import base, { REGULATED_SMELL } from '../../sectors/_base.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const sectorsDir = join(root, 'sectors');

/** Sector ids available in sectors/, excluding framework files. */
export function listSectors() {
  try {
    return readdirSync(sectorsDir)
      .filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
      .map((f) => f.replace(/\.mjs$/, ''))
      .sort();
  } catch { return []; }
}

const isPlain = (v) => v && typeof v === 'object' && !Array.isArray(v) && !(v instanceof RegExp);

/** Deep merge: arrays and regexes replace wholesale, plain objects merge key by key. */
function merge(a, b) {
  if (b === undefined) return a;
  if (!isPlain(a) || !isPlain(b)) return b;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = merge(a[k], v);
  return out;
}

/**
 * The sector a BUILD declares.
 *
 * Read from the same two files, in the same order, and with the same
 * emphasis-stripping as `profileFromBrief` — because a repo where the
 * jurisdiction is read one way and the sector another is a repo with two
 * answers to "where do I write this down".
 *
 * `facts.md` wins over `brief.md`. The ledger is the file a human has read back
 * to the client; the brief is the file an agent wrote.
 */
export function sectorFromBuild(siteDir) {
  if (!siteDir) return null;
  const buildDir = dirname(siteDir);
  for (const f of ['facts.md', 'brief.md']) {
    const p = join(buildDir, f);
    if (!existsSync(p)) continue;
    const flat = readFileSync(p, 'utf8').replace(/\*\*/g, '').replace(/__/g, '');
    // Table row (| Sector | health-clinic | …) or list line (- Sector: health-clinic)
    const row = /^\s*\|\s*Sector\s*\|\s*`?([a-z0-9-]+)`?\s*\|/im.exec(flat);
    if (row) return row[1];
    const line = /^\s*(?:[-*]\s*)?Sector\s*:\s*`?([a-z0-9-]+)`?/im.exec(flat);
    if (line) return line[1];
  }
  return null;
}

/**
 * What the site's own words suggest the trade is.
 *
 * Returns EVERY sector that matched, not the best one. A site that reads as two
 * sectors ("physiotherapy and sports massage clinic with an on-site cafe") is a
 * real thing, and picking a winner would hide the second set of duties. The
 * caller reports the list and asks.
 *
 * @param {string} text  the visible site text, lowercased or not
 * @param {object[]} sectors  loaded sector objects
 */
export function detectSectors(text, sectors) {
  const hits = [];
  const hay = String(text || '');
  for (const s of sectors) {
    const d = s.detect || {};
    if ((d.not || []).some((re) => re.test(hay))) continue;
    const strong = (d.strong || []).filter((re) => re.test(hay));
    const weak = (d.weak || []).filter((re) => re.test(hay));
    // One strong term, or two weak ones. A single weak term is how "practice"
    // turns a piano teacher into a law firm.
    if (strong.length >= 1 || weak.length >= 2) {
      hits.push({
        id: s.id,
        name: s.name,
        strong: strong.map(String),
        weak: weak.map(String),
        confidence: strong.length ? 'named' : 'inferred',
      });
    }
  }
  return hits;
}

/** True when the site talks like a regulated trade without naming one this repo knows. */
export function smellsRegulated(text) {
  return REGULATED_SMELL.some((re) => re.test(String(text || '')));
}

/** Load one sector file, merged onto the base. */
export async function loadSector(name) {
  const id = String(name || '').trim().toLowerCase();
  if (!listSectors().includes(id)) return null;
  try {
    const raw = (await import(`../../sectors/${id}.mjs`)).default;
    return merge(base, raw);
  } catch { return null; }
}

/** Load every sector file. Used by the detector, which must consider all of them. */
export async function loadAllSectors() {
  const out = [];
  for (const id of listSectors()) {
    const s = await loadSector(id);
    if (s) out.push(s);
  }
  return out;
}

/**
 * Resolve the sector for a run.
 *
 * @param {object} args
 * @param {string} args.declared     sector id from the build, or null
 * @param {string} args.jurisdiction profile id in force
 * @param {string} args.text         the site's visible text, for detection
 * @returns {Promise<{
 *   declared: string|null, sector: object|null, rules: object|null,
 *   detected: object[], problems: string[], notices: string[]
 * }>}
 *   `rules` is the jurisdiction entry — the duties that actually apply. It is
 *   null when the sector is known and this country is not researched, which is
 *   a stated outcome and not the same as "no duties".
 */
export async function resolveSector({ declared, jurisdiction, text }) {
  const problems = [];
  const notices = [];
  const all = await loadAllSectors();
  const detected = detectSectors(text, all);

  if (declared === 'none') {
    // An explicit "this trade is not regulated". Honoured, and recorded.
    if (detected.length) {
      notices.push(
        `the build declares \`Sector: none\`, and the site's own words read as `
        + `${detected.map((d) => d.name).join(' and ')}. The declaration wins — it is a human's answer and the `
        + `detector is a word-matcher — but if that is wrong the duties in sectors/${detected[0].id}.mjs are the `
        + `ones nobody is checking.`);
    }
    return { declared, sector: null, rules: null, detected, problems, notices };
  }

  if (!declared) {
    return { declared: null, sector: null, rules: null, detected, problems, notices };
  }

  const sector = await loadSector(declared);
  if (!sector) {
    problems.push(
      `the build declares \`Sector: ${declared}\` and there is no sectors/${declared}.mjs. `
      + `Known sectors: ${listSectors().join(', ') || '(none)'}. Writing a new one is one research pass — `
      + `sectors/README.md has the protocol — or write \`Sector: none\` if this trade genuinely has no `
      + `sector-specific duties, which is a real answer and most trades' answer.`);
    return { declared, sector: null, rules: null, detected, problems, notices };
  }

  const entry = (sector.jurisdictions || {})[jurisdiction];
  if (!entry) {
    notices.push(
      `sector "${sector.name}" has no researched duties for jurisdiction "${jurisdiction}". `
      + `That is an absence of research, NOT a finding that the trade is unregulated there — every country in `
      + `this repo regulates some of these trades, and the ones it regulates differ. `
      + `Researched here: ${Object.keys(sector.jurisdictions || {}).filter((k) => sector.jurisdictions[k] && sector.jurisdictions[k].researched !== false).join(', ') || 'none'}.`);
    return { declared, sector, rules: null, detected, problems, notices };
  }
  if (entry.researched === false) {
    notices.push(
      `sector "${sector.name}" in "${jurisdiction}": ${entry.why || 'not researched, no reason recorded — which is itself the finding.'}`);
    return { declared, sector, rules: null, detected, problems, notices };
  }

  const p = sector.provenance || {};
  if (p.status === 'researched') {
    const sources = Array.isArray(p.sources) ? p.sources : [];
    notices.push(
      `sector "${sector.name}" is RESEARCHED, not verified: assembled from published sources by an agent, `
      + `read by nobody qualified in that trade. ${sources.length} citation${sources.length === 1 ? '' : 's'}. `
      + `Every finding below is a prompt to check with the client's regulator, not advice.`);
  }
  if (p.nextReview) {
    const due = Date.parse(p.nextReview);
    if (!Number.isNaN(due) && due < Date.now()) {
      notices.push(
        `sector "${sector.name}" passed its review date (${p.nextReview}). Trade regulation moves faster than `
        + `general law, not slower — re-check before quoting any of it to a client.`);
    }
  }

  return { declared, sector, rules: entry, detected, problems, notices };
}
