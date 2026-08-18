// website-builder — copy gates.
//
// The prose tells. This family exists because the measurement that started this
// repo found 241 em dashes in a site shipped by a system with a 197-line style
// contract and a 58-item pre-ship checklist — neither of which mentioned the
// em dash once. A rule nothing checks reaches zero adherence.
//
// SCOPE NOTE, stated honestly: these gates read the text a VISITOR sees.
// Script bodies, style blocks, HTML comments and attribute values are excluded
// before anything is counted, so a dash inside a CSS content string or a code
// sample never counts against the copy.
//
// RULE PROVENANCE
//   source:  TAXONOMY.md (18-angle research wave, 2026-08-18, adversarially verified)
//   dated:   2026-08-18
//   review:  2027-02-18 — six months. Signals decay: a tell that identified a
//            generator in 2023 can be a mainstream choice by 2026. At review,
//            ask of every rule here "is this still true?" and RETIRE the ones
//            that are not. Removing a rule is a normal outcome, not a failure;
//            TAXONOMY.md has a section for it.

import { read, displayPath } from '../lib/fs.mjs';
import { visibleTextPositional, decodeEntities, tags, attr, title, meta } from '../lib/html.mjs';
import { lineAt } from '../lib/fs.mjs';
import { BLOCKER, MAJOR, MINOR, plural } from '../lib/report.mjs';

export const gates = [
  { id: 'copy/em-dash', severity: 'blocker', what: 'em-dash density above the measured human range' },
  { id: 'copy/ai-vocabulary', severity: 'major', what: 'the known AI marketing lexicon' },
  { id: 'copy/ai-syntax', severity: 'major', what: 'AI sentence constructions (not-just-but, whether-you-are, in-todays)' },
  { id: 'copy/placeholder', severity: 'blocker', what: 'lorem, TODO, example.com, Jane Doe, Acme, unresolved [NEEDS:]' },
  { id: 'copy/straight-quotes', severity: 'minor', what: 'typewriter quotes and apostrophes in prose' },
  { id: 'copy/ellipsis', severity: 'minor', what: 'three periods instead of an ellipsis character' },
  { id: 'copy/sentence-rhythm', severity: 'minor', what: 'sentence lengths too uniform to be human' },
  { id: 'copy/heading-shape', severity: 'minor', what: 'every heading built to one grammatical template' },
  { id: 'copy/exclamations', severity: 'minor', what: 'exclamation marks used as enthusiasm filler' },
  { id: 'copy/title-tag', severity: 'major', what: 'page <title> missing, duplicated across pages, or the wrong length' },
  { id: 'copy/meta-description', severity: 'major', what: 'meta description missing, duplicated, or the wrong length' },
  { id: 'copy/dev-note-shipped', severity: 'minor', what: 'TODO/FIXME notes left in HTML comments' },
  { id: 'copy/link-text', severity: 'major', what: '"click here" / "read more" / "learn more" as the whole link' },
];

// ---------------------------------------------------------------- patterns

const EM_DASH = /[—―]/g;

// Kept deliberately short and high-precision. A word only earns a place here if
// its presence in a five-page local-business site is a genuine smell, not merely
// possible. "Robust", "comprehensive" and "solutions" were tried and cut: real
// tradespeople write them.
const VOCABULARY = [
  [/\bdelv(e|ing|ed)\b/gi, 'delve'],
  [/\btapestry\b/gi, 'tapestry'],
  [/\bseamless(ly)?\b/gi, 'seamless'],
  [/\belevat(e|es|ing|ed)\s+your\b/gi, 'elevate your'],
  [/\bunlock\s+(the|your|new)\b/gi, 'unlock the/your'],
  [/\bcutting[-\s]edge\b/gi, 'cutting-edge'],
  [/\bgame[-\s]chang(er|ing)\b/gi, 'game-changer'],
  [/\bstate[-\s]of[-\s]the[-\s]art\b/gi, 'state-of-the-art'],
  [/\bworld[-\s]class\b/gi, 'world-class'],
  [/\bbest[-\s]in[-\s]class\b/gi, 'best-in-class'],
  [/\bever[-\s]evolving\b/gi, 'ever-evolving'],
  [/\bfast[-\s]paced\s+world\b/gi, 'fast-paced world'],
  [/\bnavigat\w*\s+the\s+\w*\s*landscape\b/gi, 'navigate the landscape'],
  [/\ba\s+testament\s+to\b/gi, 'a testament to'],
  [/\bmeticulous(ly)?\b/gi, 'meticulously'],
  [/\bnestled\s+(in|between|among)\b/gi, 'nestled in'],
  [/\bembark\s+on\s+(a|your)\b/gi, 'embark on a'],
  [/\bempower(s|ing|ed)?\s+(you|your|businesses|customers)\b/gi, 'empower you'],
  [/\bharness(ing)?\s+the\s+power\b/gi, 'harness the power'],
  [/\bunparalleled\b/gi, 'unparalleled'],
  [/\bsynerg(y|ies|istic)\b/gi, 'synergy'],
  [/\bholistic\s+approach\b/gi, 'holistic approach'],
  [/\bwe\s+are\s+passionate\s+about\b/gi, 'we are passionate about'],
  [/\byour\s+(journey|partner\s+in)\b/gi, 'your journey / your partner in'],
  [/\bcraft(ed|ing)?\s+with\s+(care|precision|passion)\b/gi, 'crafted with care'],
  [/\bat\s+the\s+heart\s+of\s+(everything|what)\b/gi, 'at the heart of everything'],
  [/\bwhen\s+it\s+comes\s+to\b/gi, 'when it comes to'],
  [/\blook\s+no\s+further\b/gi, 'look no further'],
  [/\brest\s+assured\b/gi, 'rest assured'],
  [/\bdive\s+(in|into)\b/gi, 'dive into'],
  [/\bin\s+the\s+realm\s+of\b/gi, 'in the realm of'],
  [/\bplays?\s+a\s+(pivotal|crucial|vital)\s+role\b/gi, 'plays a pivotal role'],
];

const SYNTAX = [
  [/\bnot\s+just\s+[^.<>!?]{2,50}?[—–,]\s*(it'?s|we'?re|they'?re)\b/gi,
    '"not just X — it\'s Y" construction'],
  [/\bit'?s\s+not\s+(just\s+)?(about\s+)?[^.<>!?]{2,50}?[—–,]\s*it'?s\b/gi,
    '"it\'s not about X, it\'s Y" construction'],
  [/\bwhether\s+you'?re\s+[^.<>!?]{2,60}?\bor\b/gi, '"whether you\'re X or Y" opener'],
  [/\bin\s+today'?s\s+[\w\s-]{0,20}?(world|market|landscape|climate|economy|age)\b/gi,
    '"in today\'s … world" opener'],
  [/\bmore\s+than\s+just\s+a\b/gi, '"more than just a" construction'],
  [/\bthat'?s\s+where\s+(we|[A-Z][\w]*)\s+comes?\s+in\b/gi, '"that\'s where we come in"'],
  [/\bwe\s+understand\s+that\b/gi, '"we understand that" throat-clear'],
  [/\bwe\s+believe\s+(that\s+)?every\b/gi, '"we believe that every" opener'],
  [/\bwelcome\s+to\s+(our\s+)?(website|site)\b/gi, '"welcome to our website"'],
  [/\bare\s+you\s+(looking|tired|struggling|ready)\b/gi, 'rhetorical question opener'],
];

const PLACEHOLDER = [
  // Requires the Latin to CONTINUE. A bare mention of the phrase is discourse
  // ABOUT filler, not filler — one real site's only blocker was its own
  // marketing line "No lorem ipsum, no placeholder text left for you to fix",
  // which is the opposite of the defect.
  [/\blorem\s+ipsum\s+(dolor|sit|amet|consectetur|adipiscing)/gi, 'lorem ipsum filler', BLOCKER],
  [/\bdolor\s+sit\s+amet\b/gi, 'lorem ipsum filler', BLOCKER],
  [/\bTODO\b/g, 'TODO left in copy', BLOCKER],
  [/\[NEEDS:[^\]]*\]/gi, 'unresolved [NEEDS:] placeholder', BLOCKER],
  [/<<[A-Z_]+>>/g, 'unfilled <<PLACEHOLDER>>', BLOCKER],
  [/\{\{\s*\w+\s*\}\}/g, 'unrendered {{template}} token', BLOCKER],
  [/\b(john|jane)\s+(doe|smith)\b/gi, 'placeholder person name', BLOCKER],
  // NB: example.com inside placeholder= is CORRECT (RFC 2606 reserves it for
  // exactly this). The attribute sweep above deliberately omits placeholder=.
  [/\bexample\.(com|org|net)\b/gi, 'example.com left in', BLOCKER],
  [/\byour\s+(company|business|brand)\s+(name|here)\b/gi, '"Your Company Name" placeholder', BLOCKER],
  [/\b(acme|nexus|lorem)\s+(corp|inc|ltd|company|solutions)\b/gi, 'placeholder company name', BLOCKER],
  [/\bplaceholder\.(com|co)\b/gi, 'placeholder image host', BLOCKER],
  [/\bvia\s?placeholder\.com\b/gi, 'placeholder image host', BLOCKER],
  [/\b(0123456789|01234\s?567890|555[-\s]?0\d{3})\b/g, 'placeholder phone number', BLOCKER],
  [/\b(insert|add)\s+(your\s+)?(text|content|copy)\s+here\b/gi, 'unfilled content slot', BLOCKER],
];

const VAGUE_LINKS = /^(click here|read more|learn more|here|more|find out more|see more|details|link)$/i;

// ---------------------------------------------------------------- helpers

function sentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z"'“])/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 3);
}

function stdev(xs) {
  if (xs.length < 2) return 0;
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1));
}

function firstWordShape(h) {
  const w = h.trim().split(/\s+/)[0] || '';
  if (/ing$/i.test(w)) return 'gerund';
  if (/^(your|our|the|a|an)$/i.test(w)) return 'article';
  if (/^(we|i|you)$/i.test(w)) return 'pronoun';
  if (/^(how|why|what|when|where|who)$/i.test(w)) return 'question';
  return 'other';
}

// ---------------------------------------------------------------- run

export async function run(ctx, report) {
  const { htmlFiles, siteDir, profile } = ctx;
  // Thresholds are per 1,000 words of visible copy, and both come from measured
  // corpora rather than taste. See the block near the end of this file.
  const emDashWarnAt = profile?.copy?.emDashPer1000Warn ?? 6.43;
  const emDashBlockAt = profile?.copy?.emDashPer1000Block ?? 10.13;

  const emDashPages = [];
  const titles = new Map();
  const descriptions = new Map();
  let totalWords = 0;
  let totalEmDash = 0;
  const allSentenceLengths = [];
  const headingShapes = [];

  for (const id of gates.map((g) => g.id)) report.ranGate(id);

  for (const file of htmlFiles) {
    const raw = read(file);
    const shown = displayPath(file, siteDir);
    // Positional so line numbers survive; entity-decoded so &mdash; counts too.
    const text = decodeEntities(visibleTextPositional(raw));
    const words = text.split(/\s+/).filter(Boolean);
    totalWords += words.length;

    // -------- em dash: counted here, judged site-wide below on DENSITY
    let m;
    const dashLines = [];
    EM_DASH.lastIndex = 0;
    while ((m = EM_DASH.exec(text)) !== null) dashLines.push(lineAt(text, m.index));
    totalEmDash += dashLines.length;
    if (dashLines.length) {
      emDashPages.push({ file: shown, line: dashLines[0], count: dashLines.length, words: words.length });
    }

    // -------- vocabulary
    for (const [re, label] of VOCABULARY) {
      re.lastIndex = 0;
      const hits = text.match(re);
      if (hits && hits.length) {
        re.lastIndex = 0;
        const first = re.exec(text);
        report.add(
          'copy/ai-vocabulary', MAJOR,
          `"${label}" — filler that would sit unchanged on a competitor's site`,
          { file: shown, line: first ? lineAt(text, first.index) : null, count: hits.length },
          'Replace with something only this business could say: a real place, a real timescale, a real thing they do.'
        );
      }
    }

    // -------- syntax
    for (const [re, label] of SYNTAX) {
      re.lastIndex = 0;
      const hits = text.match(re);
      if (hits && hits.length) {
        re.lastIndex = 0;
        const first = re.exec(text);
        report.add(
          'copy/ai-syntax', MAJOR, label,
          { file: shown, line: first ? lineAt(text, first.index) : null, count: hits.length },
          'Say the thing plainly instead. These constructions are rhythm without content.'
        );
      }
    }

    // -------- placeholders
    //
    // Searched in VISIBLE TEXT plus a narrow sweep of the attributes a visitor
    // can actually perceive. An earlier version searched the raw file, and on
    // three real professional sites every single finding was a false positive:
    //   * `placeholder="e.g. name@example.com"` — the RFC 2606 reserved domain,
    //     which is the correct thing to put in a form hint
    //   * the sentence "No lorem ipsum, no placeholder text left for you to fix"
    //     in a site's own marketing copy
    //   * `<!-- TODO: needs the channel URL — link omitted until James supplies
    //     one -->`, which is precisely the behaviour rule 1 demands
    // The facts gate had already learned this on the markdown side. The HTML
    // side never got the fix.
    const attrText = [...raw.matchAll(/\b(alt|title|aria-label|href|src)\s*=\s*"([^"]*)"/gi)]
      .map((m) => m[2]).join('\n');
    const placeholderScope = text + '\n' + attrText;
    for (const [re, label, sev] of PLACEHOLDER) {
      re.lastIndex = 0;
      const hits = placeholderScope.match(re);
      if (hits && hits.length) {
        re.lastIndex = 0;
        const first = re.exec(placeholderScope);
        report.add(
          'copy/placeholder', sev, label,
          { file: shown, line: first ? lineAt(placeholderScope, first.index) : null, count: hits.length },
          'Replace with a real fact, or remove the section. Nothing labelled as missing ships.'
        );
      }
    }

    // Developer notes in comments are NOT placeholders in the shipped copy —
    // a visitor never sees them — but they are worth naming once, quietly.
    const devNotes = (raw.match(/<!--[\s\S]*?(TODO|FIXME|HACK|XXX)[\s\S]*?-->/g) || []);
    if (devNotes.length) {
      report.add('copy/dev-note-shipped', MINOR,
        `${devNotes.length} developer note${devNotes.length === 1 ? '' : 's'} left in HTML comments`,
        { file: shown, count: devNotes.length },
        'Invisible to visitors, so not a blocker. Worth clearing before handover: a client who opens View Source should not find your working notes about their business.');
    }

    // -------- typography
    const straight = (text.match(/\w'\w|\s"[A-Za-z]/g) || []).length;
    if (straight >= 5) {
      report.add(
        'copy/straight-quotes', MINOR,
        `${straight} typewriter quote${straight === 1 ? '' : 's'} in prose`,
        { file: shown, count: straight },
        'Use ’ for apostrophes and “ ” for quotes. Typeset text reads as edited; typewriter marks read as pasted.'
      );
    }
    const dots = (text.match(/\w\.\.\.(\s|$)/g) || []).length;
    if (dots >= 2) {
      report.add('copy/ellipsis', MINOR, `${dots} "..." instead of an ellipsis character`,
        { file: shown, count: dots }, 'Use … (or rewrite — an ellipsis is rarely the right punctuation in body copy).');
    }

    const bangs = (text.match(/!/g) || []).length;
    if (bangs >= 4 && words.length > 80) {
      report.add('copy/exclamations', MINOR, `${bangs} exclamation marks`,
        { file: shown, count: bangs },
        'Enthusiasm punctuation reads as filler. Let the claim carry the weight.');
    }

    // -------- rhythm
    const lens = sentences(text).map((s) => s.split(/\s+/).length);
    allSentenceLengths.push(...lens);

    // -------- headings
    const hRe = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi;
    let h;
    const pageHeadings = [];
    while ((h = hRe.exec(raw)) !== null) {
      const t = decodeEntities(h[2].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
      if (t) pageHeadings.push(t);
    }
    headingShapes.push(...pageHeadings.map(firstWordShape));

    // -------- title / description
    const t = title(raw);
    if (!t) {
      report.add('copy/title-tag', MAJOR, 'no <title>', { file: shown },
        'Every page needs a unique title. It is the browser tab, the search result and the shared-link headline.');
    } else {
      if (!titles.has(t)) titles.set(t, []);
      titles.get(t).push(shown);
      if (t.length > 65) {
        report.add('copy/title-tag', MINOR, `<title> is ${t.length} chars — truncates in search results`, { file: shown },
          'Aim for 50-60 characters, front-loaded with the thing people search for.');
      }
    }

    const d = meta(raw, 'description');
    if (d === null || d.trim() === '') {
      report.add('copy/meta-description', MAJOR, 'no meta description', { file: shown },
        'Write a real 150-160 character summary. Without one the search engine picks a sentence at random.');
    } else {
      if (!descriptions.has(d)) descriptions.set(d, []);
      descriptions.get(d).push(shown);
      if (d.length > 165 || d.length < 50) {
        report.add('copy/meta-description', MINOR,
          `meta description is ${d.length} chars`, { file: shown },
          'Aim for 150-160. Under 50 wastes the slot; over 165 gets cut mid-word.');
      }
    }

    // -------- link text
    for (const a of tags(raw, 'a')) {
      const close = raw.indexOf('</a', a.index);
      if (close === -1) continue;
      const inner = decodeEntities(raw.slice(a.index + a.raw.length, close).replace(/<[^>]+>/g, ' '))
        .replace(/\s+/g, ' ').trim();
      if (inner && VAGUE_LINKS.test(inner) && !attr(a.raw, 'aria-label')) {
        report.add('copy/link-text', MAJOR, `link text is just "${inner}"`,
          { file: shown, line: a.line },
          'Say where it goes: "See our stroke rehab service". Screen-reader users navigate by link list, and a page of "read more" is a page of nothing.');
      }
    }
  }

  // -------- cross-page duplicates
  for (const [t, files] of titles) {
    if (files.length > 1) {
      report.add('copy/title-tag', MAJOR,
        `${files.length} pages share the title "${t.slice(0, 60)}"`,
        { file: files[0], count: files.length },
        'One title per page, describing that page. Duplicate titles are the classic sign nobody wrote them.');
    }
  }
  for (const [d, files] of descriptions) {
    if (files.length > 1) {
      report.add('copy/meta-description', MAJOR,
        `${files.length} pages share one meta description`,
        { file: files[0], count: files.length },
        'Write one per page. A copy-pasted description tells a search engine the pages are interchangeable.');
    }
  }

  // ---------------------------------------------------------------- em dash
  //
  // A DENSITY CAP, NOT A BAN — and the change from a ban is evidence-driven, so
  // the evidence is recorded here rather than in a commit nobody re-reads.
  //
  // The instinct behind a ban is right and the ban itself is wrong. Measured
  // em-dash rates: a published human-prose corpus pools at 6.43 per 1,000 words
  // with a 3.47-10.13 range; GPT-4.1 sits at 10.62; plain human controls at
  // 3.23. Those ranges OVERLAP. Presence proves nothing, both Chicago and AP
  // mandate em-dash constructions, and banning the character outright forces
  // comma splices into the one artefact the client actually reads.
  //
  // Density separates them cleanly. On the four real sites this tool was built
  // against, three scored 0.00-0.22 per 1,000 words and one scored 25.97 —
  // two and a half times the top of the entire human published range, and more
  // than twice GPT-4.1's own rate. That site is the reason this repo exists.
  //
  // So: MAJOR above the human corpus mean, BLOCKER above the top of the human
  // range. Both configurable. A site under the cap is left alone, because a
  // writer who uses a dash well is not the problem and never was.
  const per1000 = totalWords ? (totalEmDash / totalWords) * 1000 : 0;
  if (emDashPages.length) {
    const worst = [...emDashPages].sort((a, b) => b.count - a.count)[0];
    const where = emDashPages.length === 1
      ? worst.file
      : `${plural(emDashPages.length, 'page')}, worst ${worst.file} (${worst.count})`;
    const detail = `${plural(totalEmDash, 'em dash', 'em dashes')} across ${totalWords.toLocaleString()} words — ${per1000.toFixed(1)} per 1,000`;

    if (per1000 > emDashBlockAt) {
      report.add('copy/em-dash', BLOCKER,
        `${detail}, above the top of the measured human range (${emDashBlockAt}/1,000)`,
        { file: worst.file, line: worst.line, count: totalEmDash },
        `No human corpus writes this densely. It is the loudest machine-written tell there is, and it is nearly always hiding two sentences that should be separate. Rewrite with a comma, a colon, brackets, or a full stop. Worst offender: ${where}.`);
    } else if (per1000 > emDashWarnAt) {
      report.add('copy/em-dash', MAJOR,
        `${detail}, above the human corpus average (${emDashWarnAt}/1,000)`,
        { file: worst.file, line: worst.line, count: totalEmDash },
        `Not damning on its own — good writers use the dash — but this is above where published prose sits, and on a small-business page the dash is usually the wrong mark anyway. Thin them out. Worst: ${where}.`);
    }
  }

  // -------- site-wide rhythm
  if (allSentenceLengths.length >= 25) {
    const sd = stdev(allSentenceLengths);
    if (sd < 4.5) {
      report.add('copy/sentence-rhythm', MINOR,
        `sentence length varies by only ±${sd.toFixed(1)} words across ${allSentenceLengths.length} sentences`,
        { count: allSentenceLengths.length },
        'Human copy lurches: a four-word sentence next to a twenty-six-word one. Uniform length is the rhythm tell no vocabulary list catches.');
    }
  }

  // -------- heading monotony
  if (headingShapes.length >= 6) {
    const counts = {};
    for (const s of headingShapes) counts[s] = (counts[s] || 0) + 1;
    const [shape, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (n / headingShapes.length > 0.7 && shape !== 'other') {
      report.add('copy/heading-shape', MINOR,
        `${n} of ${headingShapes.length} headings open with the same shape (${shape})`,
        { count: n },
        'Vary them. Every heading built to one template is a page written by filling in a form.');
    }
  }

  report.stats.words = totalWords;
  report.stats.emDashes = totalEmDash;
  report.stats.emDashPer1000Words = totalWords ? +(totalEmDash / totalWords * 1000).toFixed(2) : 0;
}

export default { gates, run };
