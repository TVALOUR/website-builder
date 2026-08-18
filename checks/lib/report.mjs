// sitewright — the finding model, the console report, and the exit contract.
//
// THE EXIT CONTRACT (this is the whole point of the tool — do not soften it):
//   0  no blockers.            The site may ship.
//   1  one or more BLOCKERs.   The site may not ship.
//   2  the checker could not run (bad path, nothing to scan).
//
// A checker that cannot fail is not a checker. Exit code 1 is the product.

export const BLOCKER = 'blocker';
export const MAJOR = 'major';
export const MINOR = 'minor';

/**
 * Pluralise a count for finding messages. Handles the irregular labels this
 * tool actually uses, so a report never says "2 opening hourss" — small, but a
 * report has to read as though someone wrote it, or it reads as machine output,
 * which is what we are here to fix.
 */
export function plural(n, singular, pluralForm) {
  if (n === 1) return `1 ${singular}`;
  return `${n} ${pluralForm || (/(s|x|z|ch|sh)$/.test(singular) ? singular + 'es' : singular + 's')}`;
}

/** "1 grid uses" / "3 grids use" */
export function verb(n, singularVerb, pluralVerb) {
  return n === 1 ? singularVerb : pluralVerb;
}

const ORDER = { [BLOCKER]: 0, [MAJOR]: 1, [MINOR]: 2 };

const GLYPH = { [BLOCKER]: '✗', [MAJOR]: '!', [MINOR]: '·' };
const LABEL = { [BLOCKER]: 'BLOCKER', [MAJOR]: 'MAJOR  ', [MINOR]: 'MINOR  ' };

export class Report {
  constructor(siteDir) {
    this.siteDir = siteDir;
    // Set by run.mjs when --only/--skip narrowed the run. A scoped run reports
    // PARTIAL, never PASS: exit 0 keeps the flag useful for iterating, and the
    // word stops a partial result being pasted into a report as a clean one.
    this.scoped = false;
    this.suppressed = [];
    this.findings = [];
    this.ran = [];      // gate ids that executed, so coverage is stated not assumed
    this.skipped = [];  // {gate, why} — a gate that could not run says so out loud
    this.stats = {};
  }

  /**
   * @param gate     stable id, `family/name` — cite it in a fix, never the prose
   * @param severity blocker | major | minor
   * @param message  what is wrong, in the fewest words that stay specific
   * @param where    {file, line} — optional, but a finding with a location is
   *                 worth several without one
   * @param fix      what to actually do about it
   */
  add(gate, severity, message, where = {}, fix = '') {
    this.findings.push({
      gate, severity, message,
      file: where.file || null,
      line: where.line || null,
      count: where.count ?? null,
      fix,
    });
  }

  ranGate(id) { if (!this.ran.includes(id)) this.ran.push(id); }
  skip(gate, why) { this.skipped.push({ gate, why }); }

  get blockers() { return this.findings.filter((f) => f.severity === BLOCKER); }
  get majors() { return this.findings.filter((f) => f.severity === MAJOR); }
  get minors() { return this.findings.filter((f) => f.severity === MINOR); }
  get passed() { return this.blockers.length === 0; }
  get exitCode() { return this.passed ? 0 : 1; }

  sorted() {
    return [...this.findings].sort(
      (a, b) => ORDER[a.severity] - ORDER[b.severity] || a.gate.localeCompare(b.gate)
    );
  }

  toJSON() {
    return {
      site: this.siteDir,
      verdict: !this.passed ? 'FAIL' : (this.scoped ? 'PARTIAL' : 'PASS'),
      scoped: this.scoped,
      suppressedFamilies: this.suppressed,
      counts: {
        blocker: this.blockers.length,
        major: this.majors.length,
        minor: this.minors.length,
      },
      gatesRun: this.ran.length,
      gatesSkipped: this.skipped,
      stats: this.stats,
      findings: this.sorted(),
    };
  }

  render({ color = true } = {}) {
    const c = color
      ? { red: '[31m', yellow: '[33m', dim: '[2m', bold: '[1m', green: '[32m', off: '[0m' }
      : { red: '', yellow: '', dim: '', bold: '', green: '', off: '' };
    const tint = { [BLOCKER]: c.red, [MAJOR]: c.yellow, [MINOR]: c.dim };

    const out = [];
    out.push('');
    out.push(`${c.bold}sitewright${c.off} ${c.dim}— ${this.siteDir}${c.off}`);
    out.push('');

    const list = this.sorted();
    if (!list.length) {
      out.push(`  ${c.green}Nothing found.${c.off}`);
    }
    for (const f of list) {
      const loc = f.file ? ` ${c.dim}${f.file}${f.line ? ':' + f.line : ''}${c.off}` : '';
      const n = f.count !== null && f.count !== undefined ? ` ${c.dim}(${f.count})${c.off}` : '';
      out.push(`  ${tint[f.severity]}${GLYPH[f.severity]} ${LABEL[f.severity]}${c.off}  ${c.bold}${f.gate}${c.off}  ${f.message}${n}${loc}`);
      if (f.fix) out.push(`             ${c.dim}→ ${f.fix}${c.off}`);
    }

    out.push('');
    out.push(`  ${c.dim}${this.ran.length} gates ran${this.skipped.length ? `, ${this.skipped.length} skipped` : ''}.${c.off}`);
    for (const s of this.skipped) {
      out.push(`  ${c.dim}  skipped ${s.gate}: ${s.why}${c.off}`);
    }
    out.push('');
    if (this.scoped) {
      out.push(`  ${c.yellow}SUPPRESSED${c.off}: ${this.suppressed.join(', ')} — this run did NOT check them.`);
      out.push('');
    }
    if (this.passed) {
      const tail = this.majors.length
        ? ` ${c.yellow}${this.majors.length} major${this.majors.length === 1 ? '' : 's'} to answer for.${c.off}`
        : '';
      if (this.scoped) {
        out.push(`  ${c.yellow}${c.bold}PARTIAL${c.off} — no blockers in the families that ran.${tail} This is not a pass.`);
      } else {
        out.push(`  ${c.green}${c.bold}PASS${c.off} — no blockers.${tail}`);
      }
    } else {
      out.push(`  ${c.red}${c.bold}FAIL${c.off} — ${this.blockers.length} blocker${this.blockers.length === 1 ? '' : 's'}. This site is not shippable.`);
    }
    out.push('');
    return out.join('\n');
  }
}
