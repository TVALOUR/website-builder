// website-builder — the facts ledger parser.
//
// WHY THIS FILE EXISTS. The first version of the provenance gate did not parse
// facts.md at all. It lowercased the whole file, stripped punctuation, and asked
// whether a claim's characters appeared anywhere in the resulting blob. An F3
// critique took that apart with controls, and every one of these landed:
//
//   * A facts.md containing one naked line of text — no table, no rows, no
//     sources — legitimised four fabrications.
//   * `£9` passed because it is a substring of the sourced `£95`.
//   * `£95.00` was BLOCKED although `£95` was sourced.
//   * A postcode could never match, ever: the normaliser uppercased while the
//     ledger was lowercased, so that comparison was dead code.
//   * `+44 1548 852341` in the ledger did not match `01548 852 341` on the page.
//   * And the Source column — the half that makes a ledger mean anything — had
//     no probe of any kind.
//
// The README called that arithmetic. It was a substring search, and shipping it
// under a green "claimsUnsourced: 0" would have reproduced exactly the
// false-assurance failure this repo was written to indict.
//
// So: a real table parse, a required Source cell, and value-level comparison
// with format-drift normalisation on BOTH sides — because stage 03's entire job
// is turning ledger rows into natural prose, which means drift is the expected
// case and not an edge case.

/** A markdown table row: { cells, fact, value, source, confirmed, line } */
function parseTables(md) {
  const lines = md.split(/\r?\n/);
  const rows = [];
  let header = null;
  let idx = { fact: 0, value: 1, source: 2, confirmed: 3 };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim().startsWith('|')) { header = null; continue; }

    const cells = raw.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

    // Separator row (|---|---|) confirms the line above was a header.
    if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue;

    const lower = cells.map((c) => c.toLowerCase());
    const looksHeader = lower.some((c) => /^(fact|item|service|work|thing)$/.test(c))
      || (lower.includes('source') && (lower.includes('value') || lower.includes('price')));
    if (looksHeader) {
      header = lower;
      idx = {
        fact: Math.max(0, header.findIndex((c) => /^(fact|item|service|work|thing)$/.test(c))),
        value: header.findIndex((c) => /^(value|price|detail|answer)$/.test(c)),
        source: header.findIndex((c) => /source/.test(c)),
        confirmed: header.findIndex((c) => /confirm|verified|checked/.test(c)),
      };
      continue;
    }
    if (!header) continue; // a table with no header row is not a ledger

    rows.push({
      cells,
      line: i + 1,
      fact: cells[idx.fact] ?? '',
      value: idx.value >= 0 ? (cells[idx.value] ?? '') : (cells[1] ?? ''),
      source: idx.source >= 0 ? (cells[idx.source] ?? '') : '',
      confirmed: idx.confirmed >= 0 ? (cells[idx.confirmed] ?? '') : '',
      hasSourceColumn: idx.source >= 0,
    });
  }
  return rows;
}

/** A Source cell that is present but says nothing is not a source. */
const EMPTY_SOURCE = /^(|-|—|–|n\/?a|tbd|tbc|todo|unknown|assumed|inferred|\?+|\.+)$/i;

export function isSourced(row) {
  return row.hasSourceColumn && !EMPTY_SOURCE.test((row.source || '').trim());
}

// ---------------------------------------------------------------- normalising
//
// Applied to BOTH the ledger value and the site claim, so equivalent-but-
// differently-formatted pairs compare equal. Every one of these exists because
// the critique produced a real false blocker from its absence.

export const norm = {
  /** £1,200.00 / 1200 / "1200 pounds" / GBP 1200 -> "1200" */
  price(s) {
    const m = String(s).replace(/[,\s]/g, '').replace(/\u00a3|&pound;/gi, '£')
      .match(/(?:£|\$|€|gbp|usd|eur)?(\d+(?:\.\d{1,2})?)(?:pounds?|gbp)?/i);
    if (!m) return null;
    return String(parseFloat(m[1]));
  },
  /**
   * +44 1548 852341 / (01548) 852-341 / 01548 852 341 -> "01548852341"
   *
   * REPLACED AT RUN TIME by `localise()` below, with the shape the jurisdiction
   * profile states. This body is the UK default, and leaving it as the only
   * implementation is what silently switched facts/unsourced-phone off for every
   * non-UK build: a US number normalised to null, so the page "asserted nothing
   * checkable" and the whole family reported clean.
   */
  phone(s) {
    const d = String(s).replace(/[^\d+]/g, '').replace(/^\+?44/, '0');
    return /^0\d{9,10}$/.test(d) ? d : null;
  },
  email(s) {
    return String(s).trim().toLowerCase() || null;
  },
  /** TQ7 1AB / tq71ab -> "TQ71AB" */
  postcode(s) {
    const c = String(s).replace(/\s+/g, '').toUpperCase();
    return /^[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}$/.test(c) ? c : null;
  },
  /** "Mon-Fri 8am to 5pm" and "Monday to Friday from 8am to 5pm" -> same tuple */
  hours(s) {
    const t = String(s).toLowerCase();
    const days = (t.match(/\b(mon|tue|wed|thu|fri|sat|sun)/g) || [])
      .map((d) => d.slice(0, 3));
    const times = (t.match(/\b\d{1,2}(?:[:.]\d{2})?\s*(?:am|pm)?/g) || [])
      .map((x) => x.replace(/[\s.]/g, '').replace(/^(\d):/, '0$1:'))
      .filter((x) => /\d/.test(x));
    if (!days.length && !times.length) return null;
    return days.join('') + '|' + times.join('');
  },
  /** "25 years" / "25 Years of experience" -> "25|year" */
  quantity(s) {
    const m = String(s).toLowerCase().match(/(\d[\d,]*)\s*\+?\s*(year|customer|client|patient|project|job|review|%)/);
    if (!m) return null;
    return m[1].replace(/,/g, '') + '|' + m[2];
  },
  text(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
  },
};

/**
 * Point `norm.phone` and `norm.postcode` at the loaded jurisdiction.
 *
 * Called once per run by the facts family. Mutating the shared object is
 * deliberate: `buildIndex` and every extractor read `norm` directly, and one
 * process only ever gates one site under one profile, so threading a parameter
 * through six call sites would buy nothing.
 */
export function localise({ phone, postcode }) {
  if (phone) {
    norm.phone = (s) => {
      const d = phone.normalise(s);
      return phone.valid(d) ? d : null;
    };
  }
  if (postcode) {
    norm.postcode = (s) => {
      const c = String(s).replace(/\s+/g, '').toUpperCase();
      const re = new RegExp(`^(?:${postcode.source})$`, postcode.flags.replace(/g/g, ''));
      return re.test(c) ? c : null;
    };
  } else {
    // No stated shape: a postcode cannot be normalised, so nothing compares.
    // The facts family says so out loud rather than applying a British one.
    norm.postcode = () => null;
  }
}

/**
 * Build a lookup of normalised values per claim class from the ledger's rows.
 * Only SOURCED rows contribute — an unsourced row cannot legitimise anything,
 * which is the whole point and was the largest hole in the first version.
 */
export function buildIndex(rows) {
  const idx = { price: new Set(), phone: new Set(), email: new Set(), postcode: new Set(), hours: new Set(), quantity: new Set() };
  const textOfSourced = [];
  for (const row of rows) {
    if (!isSourced(row)) continue;
    // A value can legitimately be any class, so try them all against every cell
    // that could hold one. Cheap, and it means the ledger author does not have
    // to label the class.
    // The cells are tried SEPARATELY and also JOINED, because a fact is
    // routinely split across the two columns the template's own header invites:
    //
    //   | Fact              | Value       |
    //   | Monday to Friday  | 7am to 6pm  |
    //
    // Read cell-by-cell, neither half is an opening-hours line, so a correctly
    // sourced fact produced a BLOCKER with no way for the author to see why.
    // The reference fixture happens to write the whole string in one cell, so
    // nothing caught it until a build wrote it the other way — which is the more
    // natural reading of a column literally headed "Fact".
    const joined = [row.fact, row.value].filter(Boolean).join(', ');
    for (const cell of [row.value, row.fact, joined]) {
      if (!cell) continue;
      textOfSourced.push(cell.toLowerCase());
      for (const k of Object.keys(idx)) {
        const v = norm[k](cell);
        if (v) idx[k].add(v);
      }
      // A cell may hold several claims ("£95 full set, £85 cold") — pull each.
      for (const m of cell.matchAll(/(?:£|\$|€)\s?\d[\d,]*(?:\.\d{1,2})?/g)) {
        const v = norm.price(m[0]);
        if (v) idx.price.add(v);
      }
    }

    // Quantities survive the split only if the number and its unit are
    // recombined, and a row states them in either order:
    //
    //   | Years sweeping | 19 |          the unit is in the Fact cell
    //   | Experience     | 19 years |    the unit is in the Value cell
    //
    // The second already worked. The first is the same sourced fact written the
    // way the header asks for it, and it produced "19 years" unsourced. Only
    // the units the quantity extractor recognises are recombined, so this
    // cannot invent a source for anything else.
    const UNITS = /\b(years?|customers|clients|patients|projects|jobs|reviews)\b/gi;
    const units = [...joined.matchAll(UNITS)].map((m) => m[0].toLowerCase());
    if (units.length) {
      for (const nm of joined.matchAll(/\b\d[\d,]*\+?\b/g)) {
        for (const u of units) {
          const v = norm.quantity(`${nm[0]} ${u}`);
          if (v) idx.quantity.add(v);
        }
      }
    }
  }
  return { ...idx, textOfSourced };
}

export function parseLedger(md) {
  const rows = parseTables(md);
  return {
    rows,
    hasTable: rows.length > 0,
    unsourced: rows.filter((r) => !isSourced(r)),
    index: buildIndex(rows),
  };
}
