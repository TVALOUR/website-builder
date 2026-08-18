// website-builder — what KIND of project this is, resolved once for every rule.
//
// WHY THIS FILE EXISTS.
//
// Question 0 of the interview asks whether the build is (a) a real local or
// service business, (b) a real product or company that lives online, or (c) a
// personal, portfolio, demo or fictional project. The questions file says the
// answer "decides which rules bind".
//
// It did not. The answer was parsed inside `checks/rules/legal.mjs`, for its own
// use, and no other family could see it. A naive Canadian build found the
// consequence in the first run: the build answered (c), used the NANPA range
// reserved for fiction exactly as question 0 instructs a demo to do, and
// `copy/placeholder` blocked it at BLOCKER on every page. Two parts of one repo
// disagreeing, with the client-facing half losing.
//
// The second thing that file got wrong is subtler and was also found by running
// it outside the UK. Its entity vocabulary was `sole trader`, `limited`, `plc`,
// `llp` — British terms. A Canadian sole proprietorship matched none of them, so
// the entity form fell through to a fallback that sniffed the HTML for "company
// number", "registered in England" and "Companies House". Three UK strings,
// deciding a Canadian business's legal form. `checks/brief.mjs` already knew
// `proprietor|llc|inc|corporation` — two files in one repo, disagreeing about the
// same question, and the stricter one was the one clients never see.
//
// So the regime is resolved here, once, from `facts.md`, and handed to every
// family on `ctx`. Adding a country means adding words to a list in one place.

/**
 * Words that mean "this entity has separate legal personality". Anything with a
 * registry number behind it. Deliberately international: a checker that only
 * speaks British will silently mis-read four of the six jurisdictions it ships.
 */
//
// EVERY alternative is wrapped in word boundaries by `anchored()` below. The
// first draft was not, and `checks/regime-cases.mjs` failed on its first run:
// "invented for this demonstration" was classified as an incorporated entity,
// because `nv` (Dutch NV) matches inside "i-nv-ented". `oy`, `ab`, `sa`, `ug`
// and `kg` are all two letters that occur inside ordinary English words, and a
// two-letter company suffix list without boundaries is a trap. Left as a note
// rather than a silent fix: this is the same loose-pattern shape as every false
// blocker in claim-cases.mjs, committed while writing the check for it.
const anchored = (words) => new RegExp(words.map((w) => `\\b(?:${w})\\b`).join('|'), 'i');

const INCORPORATED = anchored([
  // UK / Ireland
  'limited', 'ltd\\.?', 'plc', 'llp', 'cic',
  // US / Canada
  'llc', 'l\\.l\\.c\\.', 'inc\\.?', 'incorporated', 'corp\\.?', 'corporation',
  'professional corporation', 'société par actions', 'ulc',
  // Australia / NZ / Singapore
  'pty\\.? ?ltd', 'proprietary limited', 'pte\\.? ?ltd',
  // EU
  'gmbh', 'ug', 'ag', 'kg', 'sarl', 's\\.? ?à ?r\\.?l\\.?', 'sas', 'sasu', 'sa',
  's\\.?p\\.?a\\.?', 's\\.?r\\.?l\\.?', 'bv', 'nv', 'oy', 'ab', 'aps', 'kft', 'sp\\.? ?z ?o\\.?o\\.?',
]);

/**
 * Words that mean "the owner and the business are the same legal person".
 * `sole trader` is British; `sole proprietorship` is what the same thing is
 * called across North America and much of Asia, and its absence from this list
 * is the defect that produced the file.
 */
const UNINCORPORATED = anchored([
  'sole\\s*trader', 'sole\\s*proprietor(?:ship)?', 'proprietorship',
  'partnership', 'unincorporated', 'self[-\\s]?employed', 'freelance',
  'individual trader', 'doing business as', '\\bdba\\b',
  'einzelunternehmen', 'entreprise individuelle', 'auto[-\\s]?entrepreneur',
  'travailleur autonome', 'empresario individual', 'ditta individuale',
  'eenmanszaak', 'enskild firma',
]);

/** Question 0, answer (c). */
const DEMO = /\b(personal|portfolio|demo(?:nstration)?|fiction(?:al)?|invented|not\s+a\s+real|sample|teaching|example\s+(?:build|project)|test\s+build)\b/i;

/** Question 0, answer (b) — real, but with no shopfront and no service area. */
const ONLINE_ONLY = /\b(saas|software|app\b|platform|online[-\s]?only|no\s+premises|product\s+company|not\s+a\s+(?:local\s+)?(?:business|trader))\b/i;

/**
 * Number ranges every numbering authority reserves so a published fictional
 * number cannot ring a real household. A DEMO build is instructed to use one of
 * these; a real business must never publish one. Same string, opposite verdicts,
 * which is exactly why the regime has to be visible outside legal.mjs.
 *
 *   NANPA   555-0100 to 555-0199, every North American area code
 *   Ofcom   01632 960xxx, 07700 900xxx, 08081 570xxx, <area> 496 0xxx
 *   ACMA    (0x) 5550 xxxx, (0x) 7010 xxxx
 */
export const RESERVED_FICTION_NUMBER =
  /\b(?:555[-\s]?01\d{2}|01632\s?96\d{4}|07700\s?90\d{4}|08081\s?57\d{4}|\(?0[2378]\)?[\s-]?(?:5550|7010)[\s-]?\d{4})\b/;

/**
 * Read the project regime out of a facts ledger.
 *
 * @param {string} factsText raw contents of facts.md, or '' when there is none
 * @returns {{declared: boolean, raw: string, form: 'incorporated'|'unincorporated'|null,
 *            isDemo: boolean, isOnlineOnly: boolean, isLocalTrader: boolean}}
 */
export function resolveRegime(factsText) {
  const text = String(factsText || '');
  const row = /\|\s*Entity\s*type\s*\|([^|]*)\|/i.exec(text);
  const raw = row ? row[1].trim() : '';

  // The declaration line at the top of a demo ledger counts too. A file whose
  // first paragraph says "This business is invented" has answered question 0
  // whether or not the Entity type cell repeats it, and reading only the cell
  // was how a correctly-labelled demo still failed as though it were a real
  // business trying to publish a drama number.
  const preamble = text.slice(0, 1200);
  const declaredDemo = DEMO.test(raw) || /\bthis (?:business|site|project) is (?:invented|fictional|a demo)/i.test(preamble);

  const form = row
    ? (UNINCORPORATED.test(raw) ? 'unincorporated'
      : INCORPORATED.test(raw) ? 'incorporated'
        : null)
    : null;

  const isOnlineOnly = !declaredDemo && (ONLINE_ONLY.test(raw));
  return {
    declared: Boolean(row),
    raw,
    form,
    isDemo: declaredDemo,
    isOnlineOnly,
    isLocalTrader: !declaredDemo && !isOnlineOnly,
  };
}
