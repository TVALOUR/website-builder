// website-builder — what the law requires of THIS TRADE.
//
// The thirteenth family, and the one that closes a hole the twelve others
// declared and could not fill. `profiles/uk.mjs` has carried this sentence in
// its caveats since the day it was written:
//
//     'Regulated trades (healthcare, finance, law, gas, electrical) carry
//      obligations no static checker can know about.'
//
// True of a checker that only knows the country. Four of those duties name the
// website in the instrument itself:
//
//   * a letting agent must publish its fees ON ITS WEBSITE — Consumer Rights
//     Act 2015 s.83(3);
//   * a law firm must publish prices and a complaints route ON ITS WEBSITE, and
//     show its SRA number in a prominent place — SRA Transparency Rules 1.1,
//     2.1, 4.1;
//   * a food business selling at a distance must give allergen information
//     BEFORE the purchase is concluded — Reg (EU) 1169/2011 Art.14(1)(a);
//   * an aesthetics clinic may not publish a price for Botox at all, because
//     it is a prescription only medicine — Human Medicines Regs 2012 reg.284(1).
//
// Every one of those is a static-file question. None of them was asked.
//
// WHAT THIS FAMILY WILL NOT DO. It will not tell anyone they are compliant. The
// sector files are `researched`, `verifiedBy: null`, read by nobody qualified in
// the trade, and the report repeats that on every run. What it does is stop a
// site shipping without the disclosure its own trade press would notice was
// missing — which is a much smaller claim, and a true one.

import { basename } from 'node:path';
import { read, displayPath } from '../lib/fs.mjs';
import { visibleText, title as pageTitle } from '../lib/html.mjs';
import { parseLedger } from '../lib/ledger.mjs';
import { BLOCKER, MAJOR, MINOR } from '../lib/report.mjs';
import { isManagedBuild } from '../lib/policy.mjs';
import { resolveSector, sectorFromBuild, smellsRegulated } from '../lib/sector.mjs';
import { existsSync, readFileSync } from 'node:fs';

export const gates = [
  { id: 'sector/undeclared', severity: 'major', what: 'a site that reads as a regulated trade, with no sector declared' },
  { id: 'sector/unknown', severity: 'blocker', what: 'a declared sector with no file behind it' },
  { id: 'sector/disclosure-missing', severity: 'blocker', what: 'a disclosure this trade is required to publish, absent from the site' },
  { id: 'sector/prohibited-content', severity: 'blocker', what: 'content this trade is forbidden to publish' },
  { id: 'sector/page-missing', severity: 'major', what: 'a page this trade is required to publish' },
  { id: 'sector/number-unsourced', severity: 'blocker', what: 'a registration or licence number nobody confirmed' },
  { id: 'sector/register-link', severity: 'minor', what: 'a registration a visitor cannot check, because nothing links the public register' },
  { id: 'sector/human-confirm', severity: 'minor', what: 'trade duties no static reader can decide, listed for a human' },
];

const ids = gates.map((g) => g.id);

export async function run(ctx, report) {
  const { siteDir, htmlFiles, factsPath, profileName } = ctx;
  for (const id of ids) report.ranGate(id);

  if (!profileName) {
    report.skip('sector', 'no jurisdiction, so no trade duties either — sector duties are country-shaped and '
      + 'this repo will not guess which country. Fix the jurisdiction first.');
    return;
  }

  // One pass over the site's own words. Detection reads what a visitor reads,
  // not the markup: a class name of `legal-services` is a developer's word, and
  // the trade a site is in is the trade its sentences describe.
  const pages = [];
  let corpus = '';
  for (const file of htmlFiles) {
    const raw = read(file);
    if (raw == null) continue;
    const text = visibleText(raw);
    pages.push({ file, raw, text, title: pageTitle(raw) || '', shown: displayPath(file, siteDir) });
    corpus += `\n${text}`;
  }
  if (!pages.length) {
    report.skip('sector', 'no HTML to read');
    return;
  }

  const managed = isManagedBuild(siteDir);
  const declared = ctx.sectorArg || sectorFromBuild(siteDir);
  const resolved = await resolveSector({ declared, jurisdiction: profileName, text: corpus });

  for (const p of resolved.problems) {
    report.add('sector/unknown', BLOCKER, p, { file: 'brief.md' },
      'A sector id is the name of a file in sectors/. It is not free text, and it is not optional once the '
      + 'trade is one this repo has researched — the whole point of the axis is that the duties are as hard '
      + 'as the law is, and a typo that turns them all off is the failure mode worth engineering against.');
  }
  for (const n of resolved.notices) report.skip('sector', n);

  let sector = resolved.sector;
  let rules = resolved.rules;
  let derivedFromDetection = false;

  // ---------------------------------------------------------------- routing
  //
  // A build declares. An AUDIT cannot: there is no brief, there is nobody to
  // ask, and the site belongs to somebody else. So for an unmanaged site a
  // NAMED match — the site calling itself "solicitors", "Gas Safe registered",
  // "chartered physiotherapists" — applies the duties, and every finding says
  // it came from detection. An INFERRED match never does, in either mode.
  if (!sector && resolved.detected.length) {
    const named = resolved.detected.filter((d) => d.confidence === 'named');
    if (!managed && named.length === 1) {
      const { loadSector } = await import('../lib/sector.mjs');
      sector = await loadSector(named[0].id);
      rules = sector && (sector.jurisdictions || {})[profileName];
      derivedFromDetection = true;
      if (rules && rules.researched !== false) {
        report.skip('sector', `audited site, no brief to declare a trade — the site calls itself `
          + `"${named[0].name}" in its own words, so ${profileName}'s duties for that trade were applied. `
          + `Findings below are detection-derived: if the trade is wrong, so are they.`);
      } else {
        rules = null;
      }
    }
  }

  // ------------------------------------------------------- undeclared trade
  if (managed && !declared) {
    const named = resolved.detected.filter((d) => d.confidence === 'named');
    const inferred = resolved.detected.filter((d) => d.confidence === 'inferred');
    if (named.length || inferred.length || smellsRegulated(corpus)) {
      const what = named.length
        ? `the site calls itself ${named.map((d) => `"${d.name}"`).join(' and ')}`
        : inferred.length
          ? `the site reads like ${inferred.map((d) => `"${d.name}"`).join(' or ')}`
          : 'the site talks about being registered, regulated or insured';
      report.add('sector/undeclared', MAJOR,
        `${what}, and the build never says which trade it is in`,
        { file: 'facts.md' },
        `Add one row to facts.md: \`| Sector | ${named[0]?.id || inferred[0]?.id || '<id>'} | <who confirmed it> |\`. `
        + `\`Sector: none\` is a real answer and most trades' answer — but it is an answer, on the record, that a `
        + `human gave. Until then the duties in sectors/ are the ones nobody is checking, and they include the `
        + `ones that name the website in the statute. Known sectors are listed by \`node checks/run.mjs --sectors\`.`);
    }
  }

  if (!sector || !rules) {
    // Say so, on every path. Eight gates reported as "ran" with nothing behind
    // them is the shape of a checker that looks busier than it is, and this is
    // the family most likely to apply to nothing at all — most trades are not
    // regulated, which is the correct and common outcome.
    if (!resolved.problems.length && !resolved.notices.length) {
      report.skip('sector', declared === 'none'
        ? 'the build declares Sector: none, so no trade duties were applied. That is an answer, on the record, that a human gave.'
        : 'no trade duties applied: nothing declared, and nothing in the site\'s own words names a trade this repo carries a file for. '
          + '`node checks/run.mjs --sectors` lists them.');
    }
    return;
  }

  report.sector = {
    id: sector.id,
    name: sector.name,
    jurisdiction: profileName,
    regulator: rules.regulator || null,
    fromDetection: derivedFromDetection,
    status: (sector.provenance || {}).status || null,
    sources: Array.isArray((sector.provenance || {}).sources) ? sector.provenance.sources.length : 0,
  };

  const ledgerRaw = factsPath && existsSync(factsPath) ? readFileSync(factsPath, 'utf8') : '';
  const ledger = ledgerRaw ? parseLedger(ledgerRaw) : null;
  const sourcedText = ledger ? ledger.index.textOfSourced.join(' \n ') : '';
  const via = derivedFromDetection ? ' (trade inferred from the site\'s own words, not declared)' : '';

  for (const duty of rules.duties || []) {
    // `appliesIf` is what stops this family crying wolf. Half of these duties
    // bind only on a site that does a particular thing — publishes prices for a
    // reserved legal service, takes orders online, advertises a treatment. A
    // duty with no `appliesIf` binds on every site in the trade, and that is a
    // claim the author has to be willing to make.
    if (duty.appliesIf && !duty.appliesIf.test(corpus)) continue;

    if (duty.kind === 'present') {
      if (duty.pattern.test(corpus)) {
        maybeRegisterLink(duty, rules, pages, siteDir, report, via);
        continue;
      }
      report.add('sector/disclosure-missing', BLOCKER,
        `${duty.what} appears nowhere on the site`,
        { file: basename(pages[0].file), sector: sector.id },
        `${duty.why}${via}`);
      continue;
    }

    if (duty.kind === 'absent') {
      for (const page of pages) {
        const m = duty.pattern.exec(page.text);
        if (!m) continue;
        report.add('sector/prohibited-content', BLOCKER,
          `${duty.what} — "${String(m[0]).trim().slice(0, 60)}"`,
          { file: page.shown, sector: sector.id },
          `${duty.why}${via}`);
      }
      continue;
    }

    if (duty.kind === 'page') {
      // Route and <title> only, deliberately NOT the body text. Matching body
      // text would let a homepage that mentions the word "complaints" satisfy
      // "publish a complaints procedure", which is the shape of a gate that
      // reports coverage it does not have. A page duty is about a page.
      const found = pages.some((p) => duty.patterns.some((re) => re.test(p.shown) || re.test(p.title || '')));
      if (found) continue;
      report.add('sector/page-missing', MAJOR,
        `no ${duty.what}`,
        { file: 'site/', sector: sector.id },
        `${duty.why}${via}`);
      continue;
    }

    if (duty.kind === 'sourcedNumber') {
      const seen = new Set();
      for (const page of pages) {
        for (const m of page.text.matchAll(duty.pattern)) {
          const num = (m[1] || m[0]).replace(/\s+/g, ' ').trim();
          if (seen.has(num)) continue;
          seen.add(num);
          // Digits only, so "SRA no. 401234" in the ledger matches "SRA 401234"
          // on the page. A registration number is the one string a visitor is
          // most likely to take on trust, and the trade press is full of sites
          // publishing a number that belonged to a business two owners ago.
          const digits = num.replace(/\D/g, '');
          if (digits.length >= 4 && sourcedText.replace(/\D/g, ' ').includes(digits)) continue;
          report.add('sector/number-unsourced', BLOCKER,
            `${duty.what} "${num}" has no sourced row in facts.md`,
            { file: page.shown, sector: sector.id },
            `${duty.why} Add the row, and record the date somebody looked the number up in `
            + `${rules.register ? rules.register : 'the public register'} — not the date the client remembered it.${via}`);
        }
      }
    }
  }

  const confirms = [...(rules.confirm || []), ...((await import('../../sectors/_base.mjs')).universalConfirm)];
  for (const c of confirms) {
    report.add('sector/human-confirm', MINOR,
      c.what,
      { sector: sector.id, ref: c.id },
      `${c.why}${via}`);
  }

  report.stats.sectorDuties = (rules.duties || []).length;
  report.stats.sectorConfirms = confirms.length;
  if (rules.regulator) report.stats.sectorRegulator = rules.regulator;
}

/**
 * A registration number a visitor cannot verify is a number that asks for
 * trust rather than earning it. Every regulator in these files runs a free
 * public register; linking it costs one anchor and is the single cheapest
 * trust signal on a regulated trade's site.
 */
function maybeRegisterLink(duty, rules, pages, siteDir, report, via) {
  if (!rules.register || !duty.wantsRegisterLink) return;
  const host = (() => { try { return new URL(rules.register).hostname.replace(/^www\./, ''); } catch { return null; } })();
  if (!host) return;
  const linked = pages.some((p) => p.raw.includes(host));
  if (linked) return;
  report.add('sector/register-link', MINOR,
    `${duty.what} is published, and nothing links the register a visitor would check it in`,
    { file: displayPath(pages[0].file, siteDir) },
    `${rules.regulator || 'The regulator'} runs a free public register at ${rules.register}. A number with a `
    + `link beside it is checkable in one click; a number on its own is a claim. Minor, because no `
    + `instrument requires the link — it is the difference between a site that is registered and a site that `
    + `can be seen to be.${via}`);
}

export default { gates, run };
