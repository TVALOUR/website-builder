// website-builder — fact provenance.
//
// THIS IS THE ONE THAT MATTERS.
//
// Every other family checks craft. This one checks honesty, and it is the only
// gate here that addresses the actual reason AI-built sites are dangerous
// rather than merely samey: handed a real business, a language model invents
// things about it. Prices it does not charge. Hours it is not open. Services it
// does not offer. Qualifications it does not hold. It does this fluently, in
// the house style, in a page that passes every design rule ever written.
//
// "Do not invent facts" is an instruction, and instructions decay. This turns
// it into arithmetic: pull every checkable claim off the built site, and require
// each one to match a SOURCED ROW in facts.md.
//
// RULE PROVENANCE
//   source:  TAXONOMY.md (18-angle research wave, 2026-08-18, adversarially verified)
//            + F3 critique 2026-08-18 findings B1-B6, which rebuilt this file
//   dated:   2026-08-18
//   review:  2027-02-18
//
// WHY THIS FILE WAS REBUILT, because it is the reason it looks like it does.
// Version one never parsed facts.md. It lowercased the file, stripped the
// punctuation, and substring-searched the resulting blob. An F3 critique took
// that apart with controls: one naked line of prose legitimised four
// fabrications; £9 passed by hiding inside £95; £95.00 was blocked although £95
// was sourced; the postcode comparison was provably dead code; and the Source
// column — the half that makes a ledger mean anything — had no probe at all.
// The README called it arithmetic. It was a substring search, and it printed
// "claimsUnsourced: 0" over invented prices.
//
// WHAT IT STILL CANNOT DO, stated plainly: it cannot tell whether facts.md is
// itself true. It closes the gap between "the model made this up" and "a human
// wrote this down and said where it came from". That is the gap a static
// checker can honestly close, and it is the one that matters.

import { read, displayPath, exists, lineAt } from '../lib/fs.mjs';
import { visibleTextPositional, decodeEntities, meta, jsonLd, references } from '../lib/html.mjs';
import { parseLedger, norm } from '../lib/ledger.mjs';
import { BLOCKER, MAJOR, MINOR, plural } from '../lib/report.mjs';
import { join } from 'node:path';

export const gates = [
  { id: 'facts/no-ledger', severity: 'blocker', what: 'the build has a facts.md at all' },
  { id: 'facts/ledger-unstructured', severity: 'blocker', what: 'facts.md is not a parseable table' },
  { id: 'facts/row-unsourced', severity: 'blocker', what: 'a ledger row with an empty Source cell' },
  { id: 'facts/unsourced-price', severity: 'blocker', what: 'a price on the site with no sourced row' },
  { id: 'facts/unsourced-phone', severity: 'blocker', what: 'a phone number nobody confirmed' },
  { id: 'facts/unsourced-email', severity: 'blocker', what: 'an email address nobody confirmed' },
  { id: 'facts/unsourced-address', severity: 'blocker', what: 'a postcode nobody confirmed' },
  { id: 'facts/unsourced-hours', severity: 'major', what: 'opening hours with no source' },
  { id: 'facts/unsourced-number', severity: 'major', what: 'a quantity claim with no source' },
  { id: 'facts/testimonial-unsourced', severity: 'blocker', what: 'a quoted testimonial with no attributed row' },
  { id: 'facts/needs-unresolved', severity: 'blocker', what: 'facts.md still has unanswered rows' },
  { id: 'facts/href-mismatch', severity: 'blocker', what: 'a tel:/mailto: href whose value differs from its own visible text' },
];

// `norm` is shared with the ledger parser so BOTH sides of every comparison are
// normalised identically. The absence of that symmetry is what produced false
// blockers on entirely correct work: stage 03's whole job is turning ledger rows
// into natural prose, so format drift is the expected case, not an edge case.
const EXTRACTORS = [
  {
    gate: 'facts/unsourced-price', severity: BLOCKER, label: 'price', key: 'price',
    // `£` and `&pound;` are in here because that is how a currency symbol
    // actually appears inside a JavaScript string literal and an HTML entity,
    // and the JavaScript surface is one this gate now reads. Without them a
    // price injected via innerHTML walks straight past.
    re: /(?:£|\$|€|\\u00a3|&pound;)\s?\d[\d,]*(?:\.\d{1,2})?|\b(?:GBP|USD|EUR)\s?\d[\d,]*(?:\.\d{1,2})?|\b\d[\d,]*(?:\.\d{1,2})?\s?(?:pounds|quid)\b/gi,
    why: 'A price the owner never quoted is a price they may be held to, and it is the failure a customer notices first.',
  },
  {
    gate: 'facts/unsourced-phone', severity: BLOCKER, label: 'phone number', key: 'phone',
    re: /(?:\+44|\b0)[\d\s()-]{8,16}\d/g,
    why: 'A wrong number sends every enquiry to a stranger, and it is the hardest error to notice from the inside — the owner never rings their own phone.',
  },
  {
    gate: 'facts/unsourced-email', severity: BLOCKER, label: 'email address', key: 'email',
    re: /\b[\w.+-]+@[\w-]+\.[\w.]{2,}\b/g,
    why: 'An invented address bounces silently. Nobody finds out until they ask why nobody has been in touch.',
  },
  {
    gate: 'facts/unsourced-address', severity: BLOCKER, label: 'postcode', key: 'postcode',
    re: /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/g,
    why: 'A plausible-but-wrong postcode sends customers to somebody else\'s house.',
  },
  {
    gate: 'facts/unsourced-hours', severity: MAJOR, label: 'opening-hours line', labelPlural: 'opening-hours lines', key: 'hours',
    // Must capture the CLOSING time as well. An earlier version stopped after
    // the opening time, so "Monday to Friday, 7am to 5pm" normalised to a
    // different tuple than the byte-identical ledger row and produced a false
    // MAJOR against a correctly-sourced fixture.
    re: /\b(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\.?\s*(?:-|–|to)\s*(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\.?[,\s]*(?:from\s+)?\d{1,2}(?:[:.]\d{2})?\s*(?:am|pm)?(?:\s*(?:-|–|to|until)\s*\d{1,2}(?:[:.]\d{2})?\s*(?:am|pm)?)?/gi,
    why: 'Wrong hours send someone to a closed door, and that customer does not come back.',
  },
  {
    gate: 'facts/unsourced-number', severity: MAJOR, label: 'quantity claim', key: 'quantity',
    re: /\b\d[\d,]*\+?\s*(?:years?|customers|clients|patients|projects|jobs|reviews)\b/gi,
    why: 'A specific number reads as evidence. If nobody sourced it, it is decoration wearing evidence\'s clothes.',
  },
];

const TESTIMONIAL = /[“"]([^”"]{40,400})[”"]/g;

function findLedger(ctx) {
  // An explicit --facts path that does not exist is an error, never a silent
  // fallback to the search order. run.mjs turns this into exit 2.
  if (ctx.factsPath) return exists(ctx.factsPath) ? ctx.factsPath : null;
  for (const name of ['facts.md', 'FACTS.md', '../facts.md', '../01_discover/facts.md']) {
    const p = join(ctx.siteDir, name);
    if (exists(p)) return p;
  }
  return null;
}

/**
 * Every surface a claim can reach a visitor through, not just body text.
 *
 * The critique injected a fake phone, a fake price and four placeholder
 * patterns through `script.js`, and the run came back byte-identical to a clean
 * baseline. A number that reaches the visitor via innerHTML is as real as one
 * typed into the HTML — and tel:/mailto: hrefs, meta descriptions and JSON-LD
 * are exactly the surfaces nobody ever reads.
 */
function claimSurfaces(raw, jsText) {
  const out = [{ label: 'page text', text: decodeEntities(visibleTextPositional(raw)), positional: true }];

  const hrefs = references(raw)
    .filter((r) => /^(tel|mailto|sms):/i.test(r.value))
    .map((r) => r.value);
  if (hrefs.length) out.push({ label: 'contact link', text: hrefs.join('\n') });

  const metas = ['description', 'og:title', 'og:description', 'twitter:description']
    .map((k) => meta(raw, k)).filter(Boolean);
  if (metas.length) out.push({ label: 'meta tag', text: metas.join('\n') });

  const ld = jsonLd(raw).filter((b) => !b.__invalid);
  if (ld.length) out.push({ label: 'structured data', text: JSON.stringify(ld) });

  if (jsText && jsText.trim()) out.push({ label: 'JavaScript', text: jsText });

  return out;
}

export async function run(ctx, report) {
  const { siteDir, htmlFiles, jsFiles } = ctx;
  for (const id of gates.map((g) => g.id)) report.ranGate(id);

  const jsText = jsFiles.map(read).join('\n');

  // Does this site actually assert anything checkable? A brochure page with no
  // price, number or address genuinely does not need a ledger; one with a price
  // on it does, and the old code let that through as a MAJOR.
  let anyClaim = false;
  outer: for (const file of htmlFiles) {
    for (const surface of claimSurfaces(read(file), jsText)) {
      for (const ex of EXTRACTORS) {
        ex.re.lastIndex = 0;
        let m;
        while ((m = ex.re.exec(surface.text)) !== null) {
          if (norm[ex.key](m[0])) { anyClaim = true; break outer; }
        }
      }
    }
  }

  const ledgerPath = findLedger(ctx);
  if (!ledgerPath) {
    // FAILS CLOSED. The old behaviour — MAJOR, skip the family, exit 0 — was
    // precisely the state produced by the failure this repo exists to stop:
    // the human says "just build it", the agent skips stage 01, and the tool
    // hands back a green tick. run.mjs already refuses to default the site
    // directory for this reason. The same instinct belongs here.
    report.add('facts/no-ledger', anyClaim ? BLOCKER : MAJOR,
      anyClaim
        ? 'no facts.md, and this site states prices, numbers or contact details'
        : 'no facts.md',
      {},
      'Run stage 01 and write one, or pass --facts <path>. Without it nothing can tell a real price from an invented one, and neither can the client. This is the check that separates a site built FROM a business from a site built ABOUT one.');
    report.skip('facts/*', 'no facts.md — provenance was NOT checked, so nothing in this run says the claims are sourced');
    return;
  }

  const ledgerRaw = read(ledgerPath);
  const ledgerShown = displayPath(ledgerPath, siteDir);
  const ledger = parseLedger(ledgerRaw);

  if (!ledger.hasTable) {
    report.add('facts/ledger-unstructured', BLOCKER,
      'facts.md contains no parseable table, so no claim can be traced to a row',
      { file: ledgerShown },
      'The ledger must be a markdown table with a header row that includes a Source column. Copy the shape from examples/clean-control/facts.md. A file of prose cannot be checked against, and a checker that pretends otherwise is worse than none at all.');
    return;
  }

  if (ledger.unsourced.length) {
    const sample = ledger.unsourced.slice(0, 3).map((r) => `"${(r.fact || r.value).slice(0, 30)}"`).join(', ');
    report.add('facts/row-unsourced', BLOCKER,
      `${plural(ledger.unsourced.length, 'ledger row')} with no Source: ${sample}`,
      { file: ledgerShown, line: ledger.unsourced[0].line, count: ledger.unsourced.length },
      'A row with no Source is not a row. Say where the fact came from — the owner, an email, a public register, a photo of the van — or delete it and take the claim off the site. An unsourced row legitimises nothing.');
  }

  // Code spans excluded: a well-written ledger explains its own convention, and
  // an earlier version read that explanation as four unanswered rows.
  const ledgerProse = ledgerRaw.replace(/`[^`\n]*`/g, ' ').replace(/```[\s\S]*?```/g, ' ');
  const unresolved = (ledgerProse.match(/\[NEEDS:[^\]]*\]|<<[A-Z_]+>>|\bTBC\b|\bUNKNOWN\b|\bTODO\b/gi) || []);
  if (unresolved.length) {
    report.add('facts/needs-unresolved', BLOCKER,
      `facts.md still has ${plural(unresolved.length, 'unanswered row')} (e.g. "${unresolved[0].slice(0, 40)}")`,
      { file: ledgerShown, count: unresolved.length },
      'Ask the owner. Every one is a question only they can answer, and shipping around it means guessing in public on their behalf.');
  }

  // ------------------------------------------------------- extract and match
  const seen = new Map();
  for (const file of htmlFiles) {
    const raw = read(file);
    const shown = displayPath(file, siteDir);

    for (const surface of claimSurfaces(raw, jsText)) {
      for (const ex of EXTRACTORS) {
        ex.re.lastIndex = 0;
        let m;
        while ((m = ex.re.exec(surface.text)) !== null) {
          const claim = m[0].trim();
          const value = norm[ex.key](claim);
          if (!value) continue;
          const key = ex.gate + '|' + value;
          if (seen.has(key)) continue;
          seen.set(key, {
            ex, claim, value, file: shown, surface: surface.label,
            line: surface.positional ? lineAt(surface.text, m.index) : null,
          });
        }
      }
    }

    // href vs its own visible text. Needs no ledger, and catches the version of
    // the wrong-number bug where the label is right and the link is wrong —
    // which is the one nobody ever notices.
    const aRe = /<a\b[^>]*href\s*=\s*["'](tel:|mailto:)([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let am;
    while ((am = aRe.exec(raw)) !== null) {
      const scheme = am[1].toLowerCase();
      const target = am[2];
      const label = decodeEntities(am[3].replace(/<[^>]+>/g, ' ')).trim();
      if (!label) continue;
      if (scheme === 'tel:') {
        const a = norm.phone(target); const b = norm.phone(label);
        if (a && b && a !== b) {
          report.add('facts/href-mismatch', BLOCKER,
            `link reads "${label}" but dials ${target}`,
            { file: shown, line: lineAt(raw, am.index) },
            'The visible number and the dialled number differ. Every tap goes to the wrong place while the page looks perfectly correct.');
        }
      } else if (/@/.test(label)) {
        const a = norm.email(target); const b = norm.email(label);
        if (a && b && a !== b) {
          report.add('facts/href-mismatch', BLOCKER,
            `link reads "${label}" but sends to ${target}`,
            { file: shown, line: lineAt(raw, am.index) },
            'The visible address and the mailto target differ. Enquiries go somewhere nobody is reading.');
        }
      }
    }

    // testimonials
    const text = decodeEntities(visibleTextPositional(raw));
    TESTIMONIAL.lastIndex = 0;
    let tm;
    while ((tm = TESTIMONIAL.exec(text)) !== null) {
      const quote = tm[1].trim();
      const stem = norm.text(quote).slice(0, 24);
      const found = stem && ledger.index.textOfSourced.some((v) => norm.text(v).includes(stem));
      if (!found) {
        report.add('facts/testimonial-unsourced', BLOCKER,
          `quoted testimonial not in a sourced row: "${quote.slice(0, 55)}…"`,
          { file: shown, line: lineAt(text, tm.index) },
          'Under the DMCC Act 2024 publishing a review that is not genuine is a banned practice, with penalties up to 10% of global turnover. Every quote needs a real person who said it AND gave permission to publish it, both recorded in facts.md.');
      }
    }
  }

  // ------------------------------------------------------------------ verdict
  const unsourced = [...seen.values()].filter((c) => !ledger.index[c.ex.key].has(c.value));

  const byGate = new Map();
  for (const u of unsourced) {
    if (!byGate.has(u.ex.gate)) byGate.set(u.ex.gate, []);
    byGate.get(u.ex.gate).push(u);
  }
  for (const [gate, items] of byGate) {
    const ex = items[0].ex;
    const samples = items.slice(0, 4).map((i) => `"${i.claim}"`).join(', ');
    const surfaces = [...new Set(items.map((i) => i.surface))];
    const note = surfaces.some((s) => s !== 'page text') ? ` (in: ${surfaces.join(', ')})` : '';
    report.add(gate, ex.severity,
      `${plural(items.length, ex.label, ex.labelPlural)} with no sourced row in facts.md: ${samples}${items.length > 4 ? ` +${items.length - 4} more` : ''}${note}`,
      { file: items[0].file, line: items[0].line, count: items.length },
      `${ex.why} Either add a sourced row to facts.md, or take it off the site. There is no third option where it stays because it sounds right.`);
  }

  report.stats.factsLedger = ledgerShown;
  report.stats.ledgerRows = ledger.rows.length;
  report.stats.ledgerRowsSourced = ledger.rows.length - ledger.unsourced.length;
  report.stats.claimsChecked = seen.size;
  report.stats.claimsUnsourced = unsourced.length;
}

export default { gates, run };
