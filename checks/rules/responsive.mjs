// website-builder — responsive and real-device gates.
//
// An AI never opens the site on a phone. It cannot, and it does not know what
// it is missing. Most responsive failure needs a browser to see — that part
// stays in the manual checklist and is honestly labelled there. What this file
// catches is the subset with a reliable STATIC signature: the declarations that
// are known to break on a real device regardless of what the rest of the page
// does.
//
// The iOS Safari items are not pedantry. Roughly half of local-service search
// happens on an iPhone, and 100vh on iOS has included the browser chrome for a
// decade — a "full height" hero is cut off at the bottom on every one of them.
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
import { loadStylesheets, collectTokens, resolveVar } from '../lib/css.mjs';
import { tags, attr } from '../lib/html.mjs';
import { BLOCKER, MAJOR, MINOR, plural, verb } from '../lib/report.mjs';

// NOT DECLARED HERE: touch-target size (WCAG 2.2 2.5.8, 24x24 CSS px).
// It needs computed layout, so a static reader cannot emit it — and a gate
// declared but unable to fire is worse than an absent one: it shows up in
// --list and in the coverage denominator looking like a real check. It lives
// in stages/06_verify as a browser step, honestly labelled as one.
export const gates = [
  { id: 'responsive/vh-on-ios', severity: 'major', what: '100vh, which includes the browser toolbar on iOS' },
  { id: 'responsive/fixed-width', severity: 'major', what: 'a fixed pixel width wider than the narrowest phone' },
  { id: 'responsive/overflow-guard', severity: 'minor', what: 'no overflow-x guard on html/body' },
  { id: 'responsive/grid-min-width', severity: 'minor', what: 'a grid track that may not shrink, a common cause of horizontal scroll' },
  { id: 'responsive/long-string-wrap', severity: 'minor', what: 'no overflow-wrap on headings, so a long word overflows' },
  { id: 'responsive/hover-only', severity: 'major', what: 'navigation that only opens on hover, unusable on touch' },
  { id: 'responsive/safe-area', severity: 'minor', what: 'a fixed bottom bar with no safe-area inset' },
  { id: 'responsive/no-breakpoints', severity: 'blocker', what: 'a stylesheet with no media queries and no intrinsic layout' },
  { id: 'responsive/table-overflow', severity: 'minor', what: 'a wide table with no scroll container' },
  { id: 'responsive/print', severity: 'minor', what: 'no print stylesheet' },
];

export async function run(ctx, report) {
  const { siteDir, htmlFiles, cssFiles, styleSources } = ctx;
  for (const id of gates.map((g) => g.id)) report.ranGate(id);
  if (!styleSources.length) {
    report.skip('responsive', 'no stylesheets and no <style> blocks found');
    return;
  }

  const { rules, text: cssText } = loadStylesheets(styleSources);
  const tokens = collectTokens(rules);
  // r.file is already a display path (run.mjs builds styleSources that way).
  const at = (r) => ({ file: r.file || null, line: r.startLine });
  const gridTracks = [];
  let reportedVh = false;

  // ------------------------------------------------------ breakpoints exist
  const mediaCount = (cssText.match(/@media[^{]*\((?:min|max)-width/gi) || []).length;
  const intrinsic = /(minmax\(|clamp\(|auto-fit|auto-fill|flex-wrap\s*:\s*wrap|@container)/i.test(cssText);
  if (mediaCount === 0 && !intrinsic) {
    report.add('responsive/no-breakpoints', BLOCKER,
      'no media queries and no intrinsic responsive layout anywhere in the CSS', {},
      'This site is one fixed layout. On a phone it either scrolls sideways or renders at 30% scale. Nothing else in this report matters more.');
  }

  for (const r of rules) {
    if (r.isKeyframesOrFont) continue;

    for (const d of r.declarations) {
      const val = resolveVar(d.value, tokens);

      // 100vh: on iOS Safari, vh has always included the browser toolbar, so a
      // "full viewport" hero is taller than the visible area and its bottom
      // content — usually the CTA — sits under the chrome.
      // NOTE: no `break` here. An earlier version broke out of the declaration
      // loop after reporting, which meant every later declaration in the SAME
      // rule went unchecked — a `.hero` that used 100vh silently hid its own
      // `width: 1440px` from the fixed-width gate. One finding per rule is
      // achieved with a flag, never by abandoning the rest of the rule.
      if (!reportedVh && /\b100vh\b/.test(val) && /height/.test(d.prop)
          && !/\b(100dvh|100svh)\b/.test(cssText)) {
        reportedVh = true;
        report.add('responsive/vh-on-ios', MAJOR,
          `${r.selector.split(',')[0].trim()} uses 100vh`,
          at(r),
          'Use 100dvh (with a 100vh fallback line above it). On iOS Safari 100vh includes the toolbar, so the bottom of the hero — usually the button — is hidden below the fold on every iPhone.');
      }

      // A fixed width above 320px cannot fit the narrowest supported phone.
      if ((d.prop === 'width' || d.prop === 'min-width') && /^\d{3,}px$/.test(val.trim())) {
        const px = parseInt(val, 10);
        if (px > 320 && !r.atRule) {
          report.add('responsive/fixed-width', MAJOR,
            `${r.selector.split(',')[0].trim()} { ${d.prop}: ${val} } outside any media query`,
            at(r),
            'Use max-width instead, or a percentage. A hard width wider than 320px guarantees horizontal scroll on the smallest phones still in use.');
        }
      }

      // HEURISTIC, and reported as one. A 1fr track only actually overflows
      // when its content has a large intrinsic width — an image, a long
      // unbroken string, a nested grid. Static analysis cannot tell which, and
      // an earlier version of this rule emitted eight MAJORs on a single site
      // for tracks that were almost certainly fine. Confidence belongs in the
      // severity: one aggregated MINOR saying "check these", not a wall of
      // assertions the tool cannot actually support.
      if (/^grid-template-(columns|rows)$/.test(d.prop)
          && /\b1fr\b/.test(val) && !/minmax\(\s*0/.test(val)) {
        gridTracks.push(r.selector.split(',')[0].trim());
      }

      // A fixed bottom bar under the iPhone home indicator.
      if (d.prop === 'position' && /fixed|sticky/.test(val)) {
        const bottom = r.declarations.find((x) => x.prop === 'bottom');
        if (bottom && /^0(px)?$/.test(resolveVar(bottom.value, tokens).trim())
            && !/safe-area-inset-bottom/i.test(cssText)) {
          report.add('responsive/safe-area', MINOR,
            `${r.selector.split(',')[0].trim()} is pinned to bottom: 0 with no safe-area inset`,
            at(r),
            'On an iPhone the home indicator sits over it. Use padding-bottom: env(safe-area-inset-bottom).');
        }
      }
    }

    // Hover-only disclosure: a menu that appears on :hover and has no click or
    // focus equivalent simply does not open on a touchscreen.
    if (/:hover\b/.test(r.selector) && /^(display|visibility|opacity)$/.test(r.declarations[0]?.prop || '')) {
      const base = r.selector.split(':hover')[0].trim();
      const hasClickEquivalent = new RegExp(
        `${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\.(is-)?open|\\[aria-expanded|\\.active|:focus-within)`, 'i'
      ).test(cssText);
      if (/nav|menu|dropdown|submenu/i.test(base) && !hasClickEquivalent) {
        report.add('responsive/hover-only', MAJOR,
          `${base} opens on hover with no click/focus equivalent`,
          at(r),
          'There is no hover on a touchscreen. Add :focus-within and a click-toggled class — otherwise this menu is simply unreachable on a phone, which is where most of the traffic is.');
      }
    }
  }

  // ------------------------------------------------------ aggregated heuristics
  if (gridTracks.length) {
    const uniq = [...new Set(gridTracks)];
    report.add('responsive/grid-min-width', MINOR,
      `${plural(uniq.length, 'grid')} ${verb(uniq.length, 'uses', 'use')} a bare 1fr track: ${uniq.slice(0, 4).join(', ')}${uniq.length > 4 ? ` +${uniq.length - 4} more` : ''}`,
      { count: uniq.length },
      'Worth checking at 320px. A 1fr track will not shrink below the intrinsic width of its content, so any of these holding an image or a long unbroken string will push the page sideways. minmax(0, 1fr) is the fix, and it costs nothing where it was not needed.');
  }

  // ------------------------------------------------------ global guards
  const htmlBodyRules = rules.filter((r) => /(^|,)\s*(html|body)\b/i.test(r.selector));
  const guarded = htmlBodyRules.some((r) =>
    r.declarations.some((d) => /^overflow(-x)?$/.test(d.prop) && /(hidden|clip)/i.test(d.value)));
  if (!guarded) {
    report.add('responsive/overflow-guard', MINOR,
      'no overflow-x: clip on html/body',
      {},
      'A safety net, not a fix: it stops one stray wide element ruining every page. Find the real cause too — this hides the symptom.');
  }

  if (!/overflow-wrap|word-break|hyphens/i.test(cssText)) {
    report.add('responsive/long-string-wrap', MINOR,
      'no overflow-wrap anywhere in the CSS',
      {},
      'Add overflow-wrap: anywhere to headings. A long email address or an unbroken business name overflows the screen on a 320px phone and takes the layout with it.');
  }

  if (!/@media\s+print/i.test(cssText)) {
    report.add('responsive/print', MINOR, 'no print stylesheet', {},
      'People do print a local business page — the address, the hours, the price list. Ten lines: hide the nav, black on white, show link URLs after the text.');
  }

  // ------------------------------------------------------ tables
  for (const file of htmlFiles) {
    const raw = read(file);
    for (const t of tags(raw, 'table')) {
      const before = raw.slice(Math.max(0, t.index - 300), t.index);
      if (!/overflow-x|table-(wrap|scroll|container)|style\s*=\s*["'][^"']*overflow/i.test(before)) {
        report.add('responsive/table-overflow', MINOR,
          'table with no horizontal scroll container',
          { file: displayPath(file, siteDir), line: t.line },
          'Wrap it in a div with overflow-x: auto. A price table with four columns pushes a phone layout sideways.');
        break;
      }
    }
  }

  report.stats.mediaQueries = mediaCount;
}

export default { gates, run };
