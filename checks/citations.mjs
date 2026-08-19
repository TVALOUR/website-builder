#!/usr/bin/env node
// website-builder — the citation gate.
//
//   node checks/citations.mjs                    every profile, offline
//   node checks/citations.mjs --profile ca       one profile
//   node checks/citations.mjs --online           + re-fetch every URL, check quotes
//   node checks/citations.mjs --json             machine-readable
//   node checks/citations.mjs --hosts            print the host classification map
//
// Exit: 0 clean · 1 findings · 2 could not run.
//
// WHY THIS EXISTS.
//
// The gate can prove a site's facts trace to a ledger. It cannot prove the LAW
// in a profile is right, and this file does not pretend to: no lawyer has read
// any of it, `verifiedBy` is null on all six, and the report says so on every
// run.
//
// What this file does is make being wrong DETECTABLE, which is a different and
// achievable thing. Three real failures motivated it, all found in shipped code:
//
//   1. A Canadian greenwashing citation quoted the phrase "internationally
//      recognized methodology" from s.74.01(1)(b.2). Parliament had struck that
//      phrase (2026, c.3, s.597). The URL was live, the page loaded, the claim
//      was false, and it reached the client inside a BLOCKER. Nothing could
//      have caught it, because nothing compared the claim to the source's words.
//   2. `class` was read by the loader, printed in the report, and populated on
//      2 of 125 rows — so the primary-source rate everyone quoted was a number
//      counted by hand from prose, and one profile was "6/6 primary" in its
//      notes and 2/7 in its code.
//   3. The Canadian profile called accessibility "best practice, not law" for a
//      small business. It analysed both accessibility-STANDARDS statutes and
//      never mentioned human-rights law, which is the route every other profile
//      names. Nobody spotted it, because nothing checked that a profile had
//      ANSWERED a question — only that its answers were formatted.
//
// So: (1) `quote` pins a claim to the source's own words, and `--online`
// re-reads the source and fails when the words are gone. (2) `class` is derived
// from the publisher, not declared, so it cannot be flattered. (3) `coverage`
// makes each profile answer a fixed list of questions with a non-secondary
// citation, so SILENCE fails instead of reading as "no obligation here".
//
// None of that makes the law right. It makes the law's decay, its sourcing and
// its gaps visible, which is the honest ceiling for a repo with no lawyer in it.
//
// WHAT THIS STILL CANNOT DO, stated so nobody reads a green run as more:
//
//   * `coverage` is a LINK, not a reading. It proves a question was answered and
//     that the answer points at a non-secondary source. It cannot tell whether
//     the source says what the profile claims it says, and a profile could point
//     several topics at one broad instrument and pass. (Sometimes that is
//     correct — the ePrivacy Directive genuinely answers both the consent and
//     the e-marketing question for `eu`.)
//   * `quote` proves the words are still on the page. It cannot prove the words
//     mean what the claim says they mean, and the Canadian scope error this repo
//     found was exactly that shape: a real section, quoted accurately, used to
//     support a proposition it does not state.
//   * A `secondary` citation is not wrong. Commencement timetables and "has the
//     Bill been introduced" have no primary source, and a check that pushed
//     those to primary would push people to cite something inapposite instead.
//
// The remaining gap is a qualified human reading a profile, and `verifiedBy`
// stays null until one does.

import { readdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CLASSES, LOAD_BEARING, classForUrl, knownHosts } from './lib/source-class.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
// The override exists so the selftest can point this at a throwaway profile
// that breaks every rule, and prove the gate fails. A gate nobody has watched
// fail is a gate nobody should believe. It is not for normal use.
const PROFILES = process.env.WEBSITE_BUILDER_PROFILES_DIR || join(HERE, '..', 'profiles');
// The sector layer is law too, and the argument for checking it is the argument
// for checking profiles/ — a trade duty is the kind of claim that can be
// confidently, invisibly wrong, and the only defence this repo has is that the
// citation is checkable. A sector folder outside this checker would be exactly
// the unchecked law the README says the repo does not ship.
const SECTORS = process.env.WEBSITE_BUILDER_SECTORS_DIR || join(HERE, '..', 'sectors');

// The questions a country profile exists to answer. A profile silent on one of
// these is not "clean" — it is unasked, and unasked reads to a client exactly
// like "no obligation here". Each maps to a URL that must appear in
// provenance.sources AND must not be secondary-only.
export const COVERAGE_TOPICS = {
  privacyNotice: 'what makes a privacy notice required (or not) for this site',
  consentModel: 'what makes prior-opt-in, or notice-and-opt-out, the right default here',
  accessibilityDuty: 'the route by which an inaccessible site creates liability — including the '
    + 'discrimination-law route, not only the accessibility-standards statutes',
  businessIdentity: 'what the business must disclose on the site itself',
  misleadingClaims: 'the statute behind the claim gates',
  electronicMarketing: 'whether the site itself is in scope of spam / e-marketing law',
  fictionalData: 'the reserved phone or address range a demo build must use',
};

// The questions a SECTOR file exists to answer, per jurisdiction it claims to
// have researched. Same discipline as the seven above and the same reason: a
// sector file silent on "what may this trade not say" reads to a client exactly
// like "it may say anything".
//
// Keyed per jurisdiction because that is where the answers actually differ. A
// trade's regulator, its entry restriction and its website duties are three
// different answers in the UK and the US, and a single flat map would force one
// of them to stand for both.
export const SECTOR_COVERAGE_TOPICS = {
  whoRegulates: 'which body regulates this trade here, and under what instrument',
  entryRestriction: 'whether the law restricts who may practise, or who may use the trade\'s title',
  websiteDuties: 'what, if anything, must appear on the website itself — including when the answer is "nothing"',
  advertisingLimits: 'what this trade may not say in its advertising',
  complaintsRoute: 'the complaints or redress route a client must be told about, or that no sector route exists',
};

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };

if (has('--hosts')) {
  for (const h of knownHosts()) console.log(`${String(classForUrl(`https://${h.replace('*.', 'x.')}/`)).padEnd(15)}${h}`);
  process.exit(0);
}

const ONLINE = has('--online');
const JSON_OUT = has('--json');
const ONLY = val('--profile');

const findings = [];
const add = (gate, severity, profile, message, fix) =>
  findings.push({ gate, severity, profile, message, fix });

// Two source folders, one discipline. `kind` carries everything that genuinely
// differs between them, so the audit below reads one shape and neither folder
// gets a weaker version of the check by accident.
const KINDS = [
  { kind: 'profile', dir: PROFILES, notes: 'profiles/_research', label: 'profiles/' },
  { kind: 'sector', dir: SECTORS, notes: 'sectors/_research', label: 'sectors/' },
];

const targets = [];
for (const k of KINDS) {
  let names;
  try {
    names = (await readdir(k.dir)).filter((f) => f.endsWith('.mjs') && !f.startsWith('_'));
  } catch (err) {
    // A missing sectors/ is a repo without the trade layer, not a failure. A
    // missing profiles/ is a broken checkout and always was.
    if (k.kind === 'profile') { console.error(`cannot read ${k.dir}: ${err.message}`); process.exit(2); }
    continue;
  }
  for (const f of names) targets.push({ ...k, file: f, name: f.replace(/\.mjs$/, '') });
}
if (ONLY) {
  const before = targets.length;
  const kept = targets.filter((t) => t.name === ONLY);
  targets.length = 0; targets.push(...kept);
  if (!targets.length) { console.error(`no profile or sector named "${ONLY}" (searched ${before})`); process.exit(2); }
}
const files = targets;

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const summary = [];

for (const target of files) {
  const { name, file, kind } = target;
  let profile;
  try {
    profile = (await import(`file://${join(target.dir, file).replace(/\\/g, '/')}`)).default;
  } catch (err) {
    add('citations/profile-unloadable', 'blocker', name,
      `${target.label}${file} threw on import: ${err.message}`,
      kind === 'sector'
        ? 'A sector that cannot load turns the whole trade family into an ERROR verdict.'
        : 'A profile that cannot load turns the whole legal family into an ERROR verdict.');
    continue;
  }

  const p = profile.provenance || {};
  const sources = Array.isArray(p.sources) ? p.sources : [];
  const researched = p.status === 'researched';

  // A baseline profile deliberately makes no country claim. Say that out loud
  // rather than skipping it silently — a skipped check and a passed check
  // printed the same word once in this repo, and it cost a release.
  if (!researched) {
    summary.push({ profile: name, status: p.status || 'unset', sources: sources.length,
      loadBearing: null, rate: null, note: 'not a researched profile — sourcing checks do not apply' });
    if (p.status === 'verified' && !p.verifiedBy) {
      add('citations/verified-unnamed', 'blocker', name,
        `status 'verified' with provenance.verifiedBy null`,
        'Unverifiable self-certification is the thing this repo exists to stop.');
    }
    continue;
  }

  if (!sources.length) {
    add('citations/no-sources', 'blocker', name,
      `status 'researched' and provenance.sources is empty`,
      'The status is a claim about how the file was made. Cite, or change the status.');
  }

  if (!existsSync(join(target.dir, '_research', `${name}.md`))) {
    add('citations/notes-missing', 'blocker', name,
      `no working notes at ${target.notes}/${name}.md`,
      'Without the angles run and what could NOT be established, nobody can check the research.');
  }

  if (!DATE.test(p.lawLastVerified || '')) {
    add('citations/no-verify-date', 'major', name,
      `provenance.lawLastVerified is "${p.lawLastVerified}"`,
      'Law is the fastest-decaying content here. Undated research cannot be triaged.');
  }
  if (!DATE.test(p.nextReview || '')) {
    add('citations/no-review-date', 'major', name,
      `provenance.nextReview is "${p.nextReview}"`, 'Set one, six months out.');
  } else if (Date.parse(p.nextReview) < Date.now()) {
    add('citations/review-overdue', 'major', name,
      `review date ${p.nextReview} has passed`,
      'Three citations in an earlier UK draft had been revoked while it cited them as live.');
  }

  // ------------------------------------------------------------ per source
  const seen = new Map();
  let loadBearing = 0;
  sources.forEach((s, i) => {
    const where = `sources[${i}]`;
    if (!s || typeof s !== 'object') {
      add('citations/malformed', 'blocker', name, `${where} is not an object`, 'Fix the literal.');
      return;
    }
    if (!s.claim || !String(s.claim).trim()) {
      add('citations/no-claim', 'major', name, `${where} has no claim text`,
        'A URL with no claim is a bookmark. Say what it is cited FOR.');
    }
    let url = null;
    try { url = new URL(s.url); } catch {
      add('citations/bad-url', 'blocker', name, `${where} url is not a URL: ${s.url}`,
        'A citation nobody can open is not a citation.');
      return;
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      add('citations/bad-url', 'major', name, `${where} is not http(s): ${s.url}`, 'Use a web URL.');
    }
    if (!DATE.test(s.accessed || '')) {
      add('citations/no-accessed', 'major', name,
        `${where} accessed is "${s.accessed}"`,
        'An undated citation cannot be told apart from one nobody has opened.');
    }

    // The class is DERIVED, never trusted. This is the whole point: a row that
    // labels a law-firm bulletin `primary` fails here rather than inflating a
    // number the report prints.
    const derived = classForUrl(s.url);
    if (!derived) {
      add('citations/host-unclassified', 'blocker', name,
        `${where} cites ${url.hostname} — no class for that host`,
        'Add it to checks/lib/source-class.mjs in this commit, with the reason in the review. '
        + 'An unknown host must not default to anything: defaulting is how vendor content '
        + 'gets counted as research.');
    } else if (!s.class) {
      add('citations/class-missing', 'blocker', name,
        `${where} has no class (host suggests "${derived}")`,
        'The report prints a primary-source rate. Unclassified rows make it unprintable.');
    } else if (!CLASSES.includes(s.class)) {
      add('citations/class-unknown', 'blocker', name,
        `${where} class "${s.class}" is not one of ${CLASSES.join(', ')}`, 'Use one of them.');
    } else if (s.class !== derived) {
      add('citations/class-mismatch', 'blocker', name,
        `${where} declares class "${s.class}" but ${url.hostname} is "${derived}"`,
        'The class is a function of the publisher. If the host map is wrong, fix the map — '
        + 'do not overrule it row by row, which is self-certification with extra steps.');
    }
    if (s.class && LOAD_BEARING.has(s.class)) loadBearing += 1;

    const key = `${s.url} ${s.claim}`;
    if (seen.has(key)) {
      add('citations/duplicate', 'minor', name,
        `${where} duplicates sources[${seen.get(key)}] exactly`, 'Delete one.');
    } else seen.set(key, i);

    if (s.quote !== undefined && (!s.quote || String(s.quote).trim().length < 12)) {
      add('citations/quote-too-short', 'major', name,
        `${where} has a quote of ${String(s.quote || '').trim().length} characters`,
        'A quote short enough to appear by accident anchors nothing. Quote a clause.');
    }
  });

  const rate = sources.length ? Math.round((loadBearing / sources.length) * 100) : 0;

  // ------------------------------------------------------------- coverage
  //
  // The check that would have caught the Canadian accessibility gap.
  const cov = profile.coverage || {};
  const urls = new Set(sources.map((s) => s.url));
  const classOf = new Map(sources.map((s) => [s.url, s.class]));

  // A SECTOR's coverage is per jurisdiction, and only for the jurisdictions it
  // claims to have researched. A file that says `us: { researched: false }` owes
  // nothing for the US, and demanding answers there would punish the honesty
  // that entry exists to record.
  if (kind === 'sector') {
    const claimed = Object.entries(profile.jurisdictions || {})
      .filter(([, v]) => v && v.researched !== false).map(([k]) => k);
    if (!claimed.length) {
      add('citations/coverage-missing', 'blocker', name,
        'no jurisdiction in this sector file is researched, and it still declares status "researched"',
        'A sector with no researched jurisdiction encodes no duty anywhere. Research one, or set the status.');
    }
    for (const j of claimed) {
      const map = (cov || {})[j] || {};
      const used = new Map();
      for (const [topic, question] of Object.entries(SECTOR_COVERAGE_TOPICS)) {
        const cited = map[topic];

        // "NOTHING HERE REQUIRES IT" is a real answer, and it needs writing down
        // rather than citing. `topic: null` with a sibling `topicWhy` records a
        // question that was ASKED and answered in the negative — which is a
        // different state from unanswered, and the difference is the whole point
        // of this map. It is still reported, at minor, because an unregulated
        // trade is a finding a client should see.
        if (cited === null && typeof map[`${topic}Why`] === 'string' && map[`${topic}Why`].length >= 40) {
          add('citations/coverage-nothing-required', 'minor', name,
            `coverage.${j}.${topic}: no instrument found — ${map[`${topic}Why`]}`,
            'Recorded as an answer rather than a gap. If that is wrong, the fix is a citation.');
          continue;
        }

        if (!cited) {
          add('citations/coverage-missing', 'blocker', name,
            `coverage.${j}.${topic} is unanswered — ${question}`,
            'Silence on a question reads to a client exactly like "no obligation here". Cite the source '
            + 'that carries this file\'s answer — or set it to null with a `' + topic + 'Why` explaining '
            + 'what was looked for and not found.');
          continue;
        }
        if (!urls.has(cited)) {
          add('citations/coverage-uncited', 'blocker', name,
            `coverage.${j}.${topic} points at ${cited}, which is not in provenance.sources`,
            'The coverage map is a claim to source link. A link to nothing is worse than none.');
          continue;
        }
        if (!LOAD_BEARING.has(classOf.get(cited))) {
          add('citations/coverage-secondary', 'major', name,
            `coverage.${j}.${topic} rests on a ${classOf.get(cited)} source (${new URL(cited).hostname})`,
            'These questions drive BLOCKER-severity findings. Find the instrument, or record in the '
            + 'working notes why no primary source exists for this one.');
        }
        used.set(cited, [...(used.get(cited) || []), topic]);
      }

      // ONE SOURCE CANNOT ANSWER MOST OF THE QUESTIONS.
      //
      // This check exists because the first nine sector files failed it. Eight of
      // them pointed three, four or five different questions at the same URL —
      // a statute that restricts who may practise does not also say what the
      // trade may not advertise, and a rule about website prices says nothing
      // about the complaints route. Each of those was a claim→source link that
      // did not hold, in the mechanism built to catch exactly that on the
      // jurisdiction side, reproduced on the new axis by the person building it.
      //
      // Repetition is not banned. One instrument genuinely can carry two of
      // these. Three is where it stops being plausible and starts being a map
      // filled in to satisfy the check.
      for (const [url, topics] of used) {
        if (topics.length < 3) continue;
        add('citations/coverage-repeated', 'major', name,
          `coverage.${j}: ${new URL(url).hostname}${new URL(url).pathname} is cited for ${topics.length} `
          + `different questions (${topics.join(', ')})`,
          'A source that answers most of the list is usually a source that answers one of them and was '
          + 'copied into the rest. Read it again against each question: where it genuinely says nothing, '
          + 'the honest entry is null plus a `<topic>Why`, not the same URL again.');
      }
    }
    summary.push({ profile: `${name} (sector)`, status: p.status, sources: sources.length, loadBearing, rate,
      quotes: sources.filter((s) => s.quote).length, note: null });
    continue;
  }

  for (const [topic, question] of Object.entries(COVERAGE_TOPICS)) {
    const cited = cov[topic];
    if (!cited) {
      add('citations/coverage-missing', 'blocker', name,
        `coverage.${topic} is unanswered — ${question}`,
        'Silence on a question reads to a client exactly like "no obligation here". '
        + 'Cite the source that carries this profile\'s answer, even when the answer is '
        + '"nothing here requires it" — that is a finding too, and it needs a source.');
      continue;
    }
    if (!urls.has(cited)) {
      add('citations/coverage-uncited', 'blocker', name,
        `coverage.${topic} points at ${cited}, which is not in provenance.sources`,
        'The coverage map is a claim→source link. A link to nothing is worse than none.');
      continue;
    }
    if (!LOAD_BEARING.has(classOf.get(cited))) {
      add('citations/coverage-secondary', 'major', name,
        `coverage.${topic} rests on a ${classOf.get(cited)} source (${new URL(cited).hostname})`,
        'These seven questions drive BLOCKER-severity findings. A law-firm bulletin is a fine '
        + 'pointer and a poor foundation — find the instrument, or record in the working notes '
        + 'why no primary source exists for this one.');
    }
  }

  summary.push({ profile: name, status: p.status, sources: sources.length, loadBearing, rate,
    quotes: sources.filter((s) => s.quote).length, note: null });
}

// -------------------------------------------------------------------- online
//
// Liveness alone proves nothing — the wrong Canadian citation returned 200 the
// whole time it was wrong. The quote is the check; the status code is context.
const online = [];
if (ONLINE) {
  const jobs = [];
  for (const target of files) {
    const profile = (await import(`file://${join(target.dir, target.file).replace(/\\/g, '/')}`)).default;
    for (const s of (profile.provenance?.sources || [])) jobs.push({ name: target.name, s });
  }
  const UA = { 'user-agent': 'website-builder-citation-check/1.0 (+https://github.com/TVALOUR/website-builder)',
    accept: 'text/html,application/xhtml+xml,*/*' };
  const norm = (t) => t.replace(/[‘’ʼ]/g, "'").replace(/[“”]/g, '"')
    .replace(/[‐-―−]/g, '-').replace(/[   ]/g, ' ')
    .replace(/\s+/g, ' ').toLowerCase();

  let i = 0;
  const worker = async () => {
    while (i < jobs.length) {
      const { name, s } = jobs[i++];
      // Where the WORDS are is not always where a reader should be sent. The
      // Australian register gives a stable per-Act URL that renders a table of
      // contents and hides the text behind a date-stamped epub path; the URL a
      // human wants and the URL a fetch can read are different documents.
      const fetchUrl = s.quoteUrl || s.url;
      let status = 'ERR', body = '';
      try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 30000);
        const r = await fetch(fetchUrl, { headers: UA, redirect: 'follow', signal: ctl.signal });
        clearTimeout(t);
        status = r.status;
        body = await r.text();
      } catch (err) { status = `ERR ${String(err.message || err).slice(0, 60)}`; }
      const row = { profile: name, url: s.url, fetched: fetchUrl, status, quote: !!s.quote, quoteFound: null };
      if (status !== 200) {
        // A 403/429 is a bot wall, not a dead citation. Say which.
        const sev = (status === 403 || status === 429) ? 'minor' : 'major';
        add('citations/unreachable', sev, name,
          `${status} on ${fetchUrl}`,
          sev === 'minor'
            ? 'Bot-blocked, not necessarily gone. Open it by hand at the next review.'
            : 'Re-source it or drop the claim it carries.');
      } else if (s.quote) {
        const plain = body.replace(/<script[\s\S]*?<\/script>/gi, ' ')
          .replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
        const text = norm(plain);
        // COULD-NOT-READ IS NOT COULD-NOT-FIND, and conflating them is how a
        // check earns a reputation for crying wolf and then gets switched off.
        // Several official consolidations — Ontario e-Laws, legisquebec, the EP
        // legislative train — serve a JavaScript shell to a plain fetch: HTTP
        // 200, a few hundred characters, no statute. Reporting that as "the law
        // changed" is a false BLOCKER on a citation that is perfectly fine, and
        // this checker produced three of them on its first run. Real statute
        // pages here return 9,000-24,000 characters; the shells return 159-420.
        if (text.length < 1500) {
          row.quoteFound = null;
          add('citations/unverifiable', 'minor', name,
            `${fetchUrl} returned ${text.length} characters of text — almost certainly a `
            + 'JavaScript shell, so the quote could not be checked either way',
            'Not a finding about the citation. Open it in a browser at the next review, or add a '
            + 'quoteUrl pointing at a plain-HTML copy of the same words.');
        } else {
          row.quoteFound = text.includes(norm(s.quote));
          if (!row.quoteFound) {
            add('citations/quote-gone', 'blocker', name,
              `the quoted words are no longer on ${fetchUrl}`,
              `Looked for: "${String(s.quote).slice(0, 120)}". This is the check that would have `
              + 'caught the repealed Canadian wording. Re-read the source, fix the claim, re-quote.');
          }
        }
      }
      online.push(row);
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
}

// -------------------------------------------------------------------- output
const counts = findings.reduce((a, f) => { a[f.severity] = (a[f.severity] || 0) + 1; return a; }, {});
const failed = (counts.blocker || 0) > 0;

if (JSON_OUT) {
  console.log(JSON.stringify({ summary, findings, counts, online, verdict: failed ? 'FAIL' : 'PASS' }, null, 2));
} else {
  console.log('\n  citation gate — profiles/ and sectors/\n');
  for (const r of summary) {
    if (r.note) { console.log(`  ${r.profile.padEnd(15)} ${r.status.padEnd(11)} ${r.note}`); continue; }
    console.log(`  ${r.profile.padEnd(15)} ${String(r.status).padEnd(11)} `
      + `${String(r.loadBearing).padStart(3)}/${String(r.sources).padEnd(3)} `
      + `primary-or-regulator (${r.rate}%)  ${r.quotes} anchored by quote`);
  }
  if (ONLINE) {
    const dead = online.filter((o) => o.status !== 200).length;
    const drift = online.filter((o) => o.quoteFound === false).length;
    console.log(`\n  online: ${online.length} fetched · ${dead} not 200 · `
      + `${online.filter((o) => o.quoteFound === true).length} quotes still present · ${drift} drifted`);
  }
  if (findings.length) {
    console.log('');
    for (const f of findings) {
      console.log(`  ${f.severity.toUpperCase().padEnd(8)} ${f.gate}  [${f.profile}]`);
      console.log(`           ${f.message}`);
      console.log(`           → ${f.fix}`);
    }
  }
  console.log(`\n  ${failed ? 'FAIL' : 'PASS'} — `
    + `${counts.blocker || 0} blocker, ${counts.major || 0} major, ${counts.minor || 0} minor\n`);
  console.log('  This checks how the law was SOURCED, not whether it is right. Nobody qualified');
  console.log('  has read any profile in this repo, and verifiedBy is null on every one.\n');
}

process.exit(failed ? 1 : 0);
