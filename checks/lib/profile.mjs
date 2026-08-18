// website-builder — the jurisdiction profile loader.
//
// One job: turn a profile NAME into a fully-formed profile object, or into an
// honest refusal. It exists because the previous behaviour was to silently fall
// back when a profile was missing:
//
//     catch { report.skip('profile', 'no profile — legal gates fall back to
//                                     their built-in defaults'); }
//
// There were no built-in defaults. `legal.mjs` opens with `if (!L) return`, so a
// typo'd or absent profile turned the entire legal family off and printed a
// PASS. The site with no privacy policy and a Meta Pixel firing on load shipped
// green. That is the failure this file replaces: a missing jurisdiction is now
// a stated, blocking condition, and the only way to get a green run without one
// is to ask for `intl-baseline` by name and accept what it says about itself.
//
// It also does the merge. Profiles declare only what is country-shaped; the
// universal floor lives in profiles/_base.mjs. Country N+1 answers a short list
// instead of restating tracker regexes that are the same everywhere.

import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import base from '../../profiles/_base.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const profilesDir = join(root, 'profiles');

/** Profile ids available in profiles/, excluding framework files. */
export function listProfiles() {
  try {
    return readdirSync(profilesDir)
      .filter((f) => f.endsWith('.mjs') && !f.startsWith('_'))
      .map((f) => f.replace(/\.mjs$/, ''))
      .sort();
  } catch { return []; }
}

/**
 * The jurisdiction the BUILD declares, from `builds/<slug>/brief.md`.
 *
 * This is the per-build override that stage 00, `config.md` and
 * `templates/brief.md` all document — and that the checker did not read. The
 * result was the exact failure this whole subsystem exists to prevent, produced
 * by following the repo's own documented command: a build whose brief said `us`,
 * gated against a root config that said `uk`, told to publish a privacy notice
 * naming the ICO. A Kansas plumber citing the Companies Act.
 *
 * @param {string} siteDir the directory being gated (builds/<slug>/site)
 */
export function profileFromBrief(siteDir) {
  if (!siteDir) return null;
  const p = join(dirname(siteDir), 'brief.md');
  if (!existsSync(p)) return null;
  const flat = readFileSync(p, 'utf8').replace(/\*\*/g, '').replace(/__/g, '');
  const m = /^\s*(?:[-*]\s*)?Profile\s*:\s*`?([a-z0-9-]+)`?/im.exec(flat);
  return m ? m[1] : null;
}

/**
 * The jurisdiction recorded by stage 00 in config.md, or null.
 * Matches the line `- **Profile:** \`uk\`` that config.example.md documents.
 */
export function profileFromConfig() {
  const p = join(root, 'config.md');
  if (!existsSync(p)) return null;
  // Emphasis stripped before matching, so `**Profile:**`, `**Profile**:` and a
  // bare `Profile:` all read the same. A reader that silently finds nothing here
  // is worse than one that errors: it produces a run with no jurisdiction.
  const flat = readFileSync(p, 'utf8').replace(/\*\*/g, '').replace(/__/g, '');
  const m = /^\s*(?:[-*]\s*)?Profile\s*:\s*`?([a-z0-9-]+)`?/im.exec(flat);
  return m ? m[1] : null;
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
 * Profiles written by hand or by a research pass express regexes that must
 * survive JSON-ish authoring, so a pattern may arrive as a string. Compile it,
 * and never throw on a bad one — a malformed pattern becomes a stated problem,
 * not a crash that reads as a clean run.
 */
function compile(value, where, problems) {
  if (value == null) return null;
  if (value instanceof RegExp) return value;
  if (typeof value !== 'string') return null;
  const m = /^\/(.*)\/([gimsuy]*)$/s.exec(value.trim());
  try {
    return m ? new RegExp(m[1], m[2]) : new RegExp(value);
  } catch (err) {
    problems.push(`${where}: not a usable regular expression (${err.message}) — the rule that uses it will not run`);
    return null;
  }
}

/**
 * Stitch the universal claim PATTERNS onto the profile's local CITATIONS to
 * produce the [regex, label, why] triples the legal family consumes.
 *
 * A class with no local citation still ships, carrying `claimFallback` — which
 * says plainly that the pattern is universal and the law is not encoded. That
 * is the honest output for a jurisdiction nobody has researched: find the claim,
 * decline to name a statute.
 */
function buildRegulatedClaims(L) {
  const out = [];
  const registers = (L.localRegisters || []).filter(Boolean);
  for (const [key, entry] of Object.entries(L.claimPatterns || {})) {
    if (!Array.isArray(entry)) continue;
    const [re, label] = entry;
    const why = (L.claimCitations && L.claimCitations[key]) || L.claimFallback;
    out.push([re, label, why]);

    // Local register names get their OWN case-insensitive entry rather than
    // being ORed into the generic pattern. Merging them forced an /i flag onto
    // the whole thing, and the accreditation pattern's trailing [A-Z] is the
    // discriminator that separates "registered with NICEIC" from "registered
    // office" — an /i flag there turns a precise gate into a cry-wolf one.
    if (key === 'accreditation' && registers.length) {
      const names = registers.map((r) => String(r).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
      out.push([new RegExp(`\\b(?:${names})\\b`, 'i'), 'a named trade register', why]);
    }
  }
  return out;
}

/**
 * Load a profile.
 *
 * @returns {{ profile: object|null, problems: string[], notices: string[], name: string }}
 *   `problems` are conditions the caller must surface as findings — a missing
 *   profile, an uncompilable pattern. `notices` are things the reader must be
 *   told but that do not by themselves stop a ship, chiefly the provenance of a
 *   researched profile.
 */
export async function loadProfile(nameArg) {
  let name = nameArg;
  const problems = [];
  const notices = [];

  if (!name) {
    problems.push(
      'no jurisdiction chosen. The legal family is the genuinely country-shaped part of this repo, '
      + `and running one country's rules on another produces confident wrong advice. Run stage 00 to write config.md, `
      + `or pass --profile <id>. Available: ${listProfiles().join(', ') || '(none)'}.`);
    return { profile: null, problems, notices, name: null };
  }

  // The name is interpolated into an import specifier, so it is constrained to
  // the shape a profile id actually has. Nothing here is reachable by an
  // attacker — you already run this checker on your own machine — but a
  // `--profile ../../something` that resolves to a file outside profiles/ would
  // load rules from a place nobody would think to look for them, and a rule set
  // whose origin is not obvious is the one problem this whole subsystem exists
  // to remove.
  // `--profile UK` is a person being reasonable, not an error. Case is folded;
  // anything that is still not an id after that is genuinely not one.
  name = String(name).trim().toLowerCase();
  // An ALLOWLIST, not a shape test. A shape test still let `_base` through by
  // hand - a profile whose every page requirement is 'recommended', so nothing
  // could block - and `../checks/rules/legal` resolved to a real module whose
  // exports merged onto the base and reported a jurisdiction. The set of valid
  // ids is knowable, so it is checked rather than approximated.
  if (!listProfiles().includes(name)) {
    problems.push(
      `no profile "${name}" in profiles/. An id names a jurisdiction file in that folder — it is not a path, `
      + `and the framework files (_base, _schema) are not jurisdictions. `
      + `Available: ${listProfiles().join(', ') || '(none)'}. `
      + `Writing a new one takes one research pass: see profiles/README.md.`);
    return { profile: null, problems, notices, name };
  }

  let raw;
  try {
    raw = (await import(`../../profiles/${name}.mjs`)).default;
  } catch {
    problems.push(
      `no profile "${name}" in profiles/. The legal gates cannot run without one, and they are not `
      + `falling back to another country's rules — that is how a US site ends up citing the Companies Act. `
      + `Available: ${listProfiles().join(', ') || '(none)'}. `
      + `Writing a new one takes one research pass: see profiles/README.md.`);
    return { profile: null, problems, notices, name };
  }

  const profile = merge(base, raw);
  const L = profile.legal || (profile.legal = {});

  // Back-compat both ways. uk.mjs predates the schema and says `limited`; the
  // schema says `corporation` because most of the world does not use the word
  // "limited". Whichever a profile supplies, both keys end up populated, so no
  // rule has to know which vintage it is reading.
  const d = L.disclosure || (L.disclosure = {});
  if (d.corporation && !d.limited) d.limited = d.corporation;
  if (d.limited && !d.corporation) d.corporation = d.limited;

  // A profile may hand-roll regulatedClaims (uk.mjs does) or supply citations
  // and let the base patterns do the work (everything since).
  if (!Array.isArray(L.regulatedClaims) || !L.regulatedClaims.length) {
    L.regulatedClaims = buildRegulatedClaims(L);
  }

  if (profile.locale && typeof profile.locale.postcodePattern === 'string') {
    profile.locale.postcodePattern = compile(
      profile.locale.postcodePattern, `${name}.locale.postcodePattern`, problems);
  }

  // ---------------------------------------------------------- provenance
  //
  // The whole point of recording where a profile came from is that the report
  // repeats it. A researched profile is a genuine research pass with cited
  // primary sources — and it is still not a lawyer reading it, so every legal
  // finding it produces must arrive wearing that label.
  const p = profile.provenance || {};
  if (p.status === 'researched') {
    // "Assembled from primary sources" is a CLAIM. Two things now test it: the
    // working notes have to exist, and the sources have to say what class they
    // are. Two shipped profiles were roughly 60% law-firm marketing and vendor
    // blogs under the same label as one that was 90% legislation, and nothing
    // told the reader which they were holding.
    const notes = join(profilesDir, '_research', `${name}.md`);
    const sources = Array.isArray(p.sources) ? p.sources : [];
    const classified = sources.filter((s) => s && s.class);
    const primary = sources.filter((s) => s && /^(primary|regulator|court)$/i.test(s.class || ''));
    const mix = sources.length
      ? (classified.length === sources.length
        ? ` ${primary.length} of ${sources.length} citations are primary or regulator sources.`
        : ` ${sources.length} citations, ${sources.length - classified.length} of them unclassified — see profiles/_schema.md on source class.`)
      : ' It cites no sources at all, which for a researched profile is itself the finding.';
    notices.push(
      `profile "${name}" is RESEARCHED, not verified: assembled from published sources by an agent, `
      + `reviewed by nobody qualified. Treat every legal finding below as a prompt to check, not as advice.${mix}`
      + (existsSync(notes) ? ` Working notes: profiles/_research/${name}.md.` : ''));
    if (!existsSync(notes)) {
      problems.push(
        `profile "${name}" declares status 'researched' and there are no working notes at `
        + `profiles/_research/${name}.md. The status is a claim about how the file was made; without the notes — `
        + `angles run, sources with access dates, what could NOT be established — nobody can check it. `
        + `Write them, or set the status to what is true.`);
    }
  } else if (p.status === 'baseline') {
    notices.push(
      `profile "${name}" is the jurisdiction-NEUTRAL baseline. It encodes the honesty floor and the `
      + `universally-risky claim shapes, and it deliberately makes no claim about the law where this site `
      + `trades. A real build in a real country needs a real profile.`);
  } else if (p.status === 'verified' && !p.verifiedBy) {
    problems.push(
      `profile "${name}" claims status 'verified' but names nobody in provenance.verifiedBy. `
      + `Unverifiable self-certification is the thing this repo exists to stop; set the name or set the status.`);
  }

  if (p.nextReview) {
    const due = Date.parse(p.nextReview);
    if (!Number.isNaN(due) && due < Date.now()) {
      notices.push(
        `profile "${name}" passed its review date (${p.nextReview}). Law is the fastest-decaying content `
        + `in this repo — three citations in an earlier UK draft had been revoked while it cited them as live. `
        + `Re-check the sources before quoting any of it to a client.`);
    }
  }

  if (L.consentModel == null) {
    notices.push(
      `profile "${name}" does not state a consent model, so the cookie gates fall back to reporting what the `
      + `site loads without ruling on whether prior consent is owed here.`);
  }

  return { profile, problems, notices, name };
}
