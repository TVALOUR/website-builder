// website-builder — accessibility gates.
//
// HONEST COVERAGE STATEMENT, and this must stay in the report rather than the
// docs: automated tooling detects roughly a third of real WCAG failures. This
// file detects a subset of THAT — the markup-shaped ones a static reader can
// see without a browser. A clean run here is not an accessible site. It means
// the obvious, cheap, repeatable failures are gone so a human review can spend
// its time on the ones that need judgment.
//
// These specific patterns are here because they are what LLM-written markup
// produces over and over: the div that should be a button, the icon-only
// control with no name, the placeholder standing in for a label, the aria-
// expanded that nothing ever updates.
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
import { tags, attr, hasAttr, body, visibleText, decodeEntities } from '../lib/html.mjs';
import { loadStylesheets, collectTokens, resolveVar, resolveColor, contrastRatio, hasSignificantAlpha } from '../lib/css.mjs';
import { BLOCKER, MAJOR, MINOR } from '../lib/report.mjs';

// NOT DECLARED HERE: touch-target size (WCAG 2.2 2.5.8, 24x24 CSS px).
// It needs computed layout, so a static reader cannot emit it — and a gate
// declared but unable to fire is worse than an absent one: it shows up in
// --list and in the coverage denominator looking like a real check. It lives
// in stages/06_verify as a browser step, honestly labelled as one.
export const gates = [
  { id: 'a11y/img-alt', severity: 'blocker', what: 'every <img> has an alt attribute' },
  { id: 'a11y/alt-quality', severity: 'major', what: 'alt text that is a filename, "image", or the word "image of"' },
  { id: 'a11y/control-name', severity: 'blocker', what: 'icon-only buttons and links have an accessible name' },
  { id: 'a11y/div-as-button', severity: 'major', what: 'a clickable div/span instead of a button' },
  { id: 'a11y/label', severity: 'blocker', what: 'every form input has a real label' },
  { id: 'a11y/placeholder-as-label', severity: 'major', what: 'placeholder used instead of a label' },
  { id: 'a11y/focus-visible', severity: 'blocker', what: 'focus outlines not removed without a replacement' },
  { id: 'a11y/reduced-motion', severity: 'major', what: 'animation respects prefers-reduced-motion' },
  { id: 'a11y/skip-link', severity: 'major', what: 'a skip link that points at something real' },
  { id: 'a11y/landmarks', severity: 'major', what: 'main/header/footer/nav landmarks exist' },
  { id: 'a11y/contrast', severity: 'blocker', what: 'declared text/background pairs meet WCAG AA' },
  { id: 'a11y/aria-invalid', severity: 'major', what: 'aria-expanded/aria-controls that nothing maintains' },
  { id: 'a11y/autoplay', severity: 'major', what: 'autoplaying media with no control' },
  { id: 'a11y/font-size-ios', severity: 'major', what: 'inputs under 16px, which force a zoom on iOS' },
  { id: 'a11y/link-new-tab', severity: 'minor', what: 'target=_blank without warning or rel=noopener' },
  { id: 'a11y/overlay-widget', severity: 'blocker', what: 'an accessibility overlay widget standing in for accessible markup' },
];

// Overlay vendors. These do not fix the underlying violations: roughly a
// quarter of 2025 US web-accessibility suits targeted sites already running
// one, courts have rejected sole reliance on them, and the FTC fined accessiBe
// $1m in 2025 over deceptive compliance marketing. Shipping one on a client
// site sells them a defence that does not hold.
const OVERLAY_VENDORS = /accessibe|userway|audioeye|equalweb|max-?access|accessiway|adally|allyable|truabilities/i;

const BAD_ALT = /^(image|photo|picture|img|logo|icon|graphic|banner|screenshot|untitled)?$|^(image|photo|picture|graphic)\s+of\b|\.(jpg|jpeg|png|gif|webp|svg|avif)$|^(dsc|img|photo)[-_ ]?\d+/i;

export async function run(ctx, report) {
  const { siteDir, htmlFiles, cssFiles, styleSources } = ctx;
  for (const id of gates.map((g) => g.id)) report.ranGate(id);

  const { rules, text: cssText } = loadStylesheets(styleSources);
  const tokens = collectTokens(rules);

  // ------------------------------------------------------------- CSS-level
  // outline:none / outline:0 with no :focus-visible replacement anywhere. This
  // is the single most common keyboard-accessibility failure in generated CSS,
  // and it is invisible to anyone using a mouse.
  const killsOutline = rules.filter((r) =>
    !r.isKeyframesOrFont &&
    r.declarations.some((d) => d.prop === 'outline' && /^(none|0(px)?)$/i.test(d.value.trim()))
  );
  const hasFocusVisible = /:focus-visible/i.test(cssText);
  if (killsOutline.length && !hasFocusVisible) {
    report.add('a11y/focus-visible', BLOCKER,
      `outline removed in ${killsOutline.length} rule${killsOutline.length === 1 ? '' : 's'} with no :focus-visible style anywhere`,
      { file: killsOutline[0].file || null, line: killsOutline[0].startLine, count: killsOutline.length },
      'A keyboard user now has no idea where they are on the page. If the default ring is ugly, replace it — :focus-visible { outline: 2px solid var(--accent); outline-offset: 2px } — do not delete it.');
  }

  const hasAnimation = rules.some((r) =>
    r.isKeyframesOrFont ? /@(-webkit-)?keyframes/i.test(r.selector)
      : r.declarations.some((d) => ['transition', 'animation', 'animation-name'].includes(d.prop)));
  if (hasAnimation && !/prefers-reduced-motion/i.test(cssText)) {
    report.add('a11y/reduced-motion', MAJOR, 'the site animates and never checks prefers-reduced-motion', {},
      'Add @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important } }. For a vestibular-disorder visitor this is the difference between a usable page and a nauseating one.');
  }

  // Input font-size under 16px: iOS Safari zooms the whole page on focus and
  // never zooms back out. A phone-first local business site cannot afford it.
  for (const r of rules) {
    if (r.isKeyframesOrFont) continue;
    if (!/\b(input|textarea|select)\b/i.test(r.selector)) continue;
    const fs = r.declarations.find((d) => d.prop === 'font-size');
    if (!fs) continue;
    const px = /^([\d.]+)px$/i.exec(resolveVar(fs.value, tokens).trim());
    const rem = /^([\d.]+)rem$/i.exec(resolveVar(fs.value, tokens).trim());
    const size = px ? +px[1] : rem ? +rem[1] * 16 : null;
    if (size !== null && size < 16) {
      report.add('a11y/font-size-ios', MAJOR,
        `${r.selector.split(',')[0].trim()} sets font-size ${fs.value} — under 16px`,
        { file: r.file || null, line: r.startLine },
        'iOS Safari force-zooms the page when a sub-16px input is focused, and does not zoom back. Use 16px (1rem) minimum on inputs.');
      break;
    }
  }

  // Contrast on declared pairs. Only rules that set BOTH colour and background
  // are checked — anything relying on inheritance is a browser question, and a
  // guess here would produce exactly the confident-but-wrong finding this repo
  // is built to avoid.
  let contrastChecked = 0;
  for (const r of rules) {
    if (r.isKeyframesOrFont) continue;
    const fg = r.declarations.find((d) => d.prop === 'color');
    const bg = r.declarations.find((d) => d.prop === 'background-color' || d.prop === 'background');
    if (!fg || !bg) continue;
    if (hasSignificantAlpha(fg.value, tokens) || hasSignificantAlpha(bg.value, tokens)) continue;
    const c1 = resolveColor(fg.value, tokens);
    const c2 = resolveColor(bg.value, tokens);
    if (!c1 || !c2) continue;
    contrastChecked++;
    const ratio = contrastRatio(c1, c2);

    // WCAG "large scale text" is 18pt (24px) at any weight, OR 14pt (18.66px)
    // when BOLD. Missing the bold half of that definition made this gate report
    // a 3.91:1 blocker against a 20px bold button that was correctly built to
    // the 3:1 large-text floor — a false blocker on work that was already right,
    // which is the fastest way to teach someone to ignore a checker.
    const fsDecl = r.declarations.find((d) => d.prop === 'font-size');
    const fwDecl = r.declarations.find((d) => d.prop === 'font-weight');
    const fwRaw = fwDecl ? resolveVar(fwDecl.value, tokens).trim() : '';
    const isBold = /^(bold|bolder)$/i.test(fwRaw) || (parseInt(fwRaw, 10) >= 700);

    let px = null;
    if (fsDecl) {
      const v = resolveVar(fsDecl.value, tokens).trim();
      let m;
      if ((m = /^([\d.]+)px$/i.exec(v))) px = +m[1];
      else if ((m = /^([\d.]+)r?em$/i.exec(v))) px = +m[1] * 16;
      else if ((m = /^([\d.]+)pt$/i.exec(v))) px = +m[1] * (96 / 72);
    }
    const large = px !== null && (px >= 24 || (isBold && px >= 18.66));
    const floor = large ? 3 : 4.5;
    if (ratio < floor) {
      report.add('a11y/contrast', BLOCKER,
        `${r.selector.split(',')[0].trim()} — ${ratio.toFixed(2)}:1 against its own background (needs ${floor}:1)`,
        { file: r.file || null, line: r.startLine },
        'Darken the text or lighten the surface. This is the most common reason a site that "looks fine" is unreadable in daylight on a phone.');
    }
  }
  if (contrastChecked === 0 && styleSources.length) {
    report.skip('a11y/contrast', 'no rule declares both colour and background on the same selector — contrast needs a rendered check');
  }

  // ------------------------------------------------------------- HTML-level
  for (const file of htmlFiles) {
    const raw = read(file);
    const shown = displayPath(file, siteDir);
    const b = body(raw);

    // ---- images
    for (const img of tags(raw, 'img')) {
      const alt = attr(img.raw, 'alt');
      if (alt === null) {
        report.add('a11y/img-alt', BLOCKER, `<img> with no alt attribute`,
          { file: shown, line: img.line },
          'Every image needs alt. Decorative? alt="" — that is a decision, and an absent attribute is not. A screen reader reads the filename out loud instead.');
      } else if (alt !== '' && BAD_ALT.test(alt.trim())) {
        report.add('a11y/alt-quality', MAJOR, `alt="${alt.slice(0, 40)}" says nothing`,
          { file: shown, line: img.line },
          'Describe what the image conveys HERE: "Andy fitting a foot-drop splint in a client\'s living room", not "image".');
      }
    }

    // ---- icon-only controls
    for (const el of ['button', 'a']) {
      for (const t of tags(raw, el)) {
        const close = raw.indexOf(`</${el}`, t.index);
        if (close === -1) continue;
        const inner = raw.slice(t.index + t.raw.length, close);
        const textContent = decodeEntities(inner.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
        const hasIcon = /<(svg|img|i\b|use)/i.test(inner);
        const named = attr(t.raw, 'aria-label') || attr(t.raw, 'title')
          || attr(t.raw, 'aria-labelledby')
          || /aria-label\s*=/i.test(inner) || /<title\b/i.test(inner)
          || /class\s*=\s*["'][^"']*\b(sr-only|visually-hidden|screen-reader)\b/i.test(inner);
        if (!textContent && hasIcon && !named) {
          report.add('a11y/control-name', BLOCKER,
            `icon-only <${el}> with no accessible name`,
            { file: shown, line: t.line },
            'A screen reader announces "button" and nothing else. Add aria-label="Open menu", or a visually-hidden span.');
        }
      }
    }

    // ---- div-as-button
    const clickableDiv = /<(div|span)\b[^>]*\bonclick\s*=/gi;
    let cd;
    while ((cd = clickableDiv.exec(b)) !== null) {
      if (!/role\s*=\s*["']button["']/i.test(cd[0]) || !/tabindex/i.test(cd[0])) {
        report.add('a11y/div-as-button', MAJOR,
          `clickable <${cd[1]}> that is not a button`,
          { file: shown },
          'Use <button>. A div is not focusable, does not fire on Enter or Space, and is announced as nothing. If it must stay a div it needs role="button", tabindex="0" AND a keydown handler — three things a <button> gives free.');
        break;
      }
    }

    // ---- labels
    for (const el of ['input', 'textarea', 'select']) {
      for (const t of tags(raw, el)) {
        const type = (attr(t.raw, 'type') || '').toLowerCase();
        if (['hidden', 'submit', 'button', 'reset', 'image'].includes(type)) continue;
        const id = attr(t.raw, 'id');
        const labelled = (id && new RegExp(`<label[^>]*\\bfor\\s*=\\s*["']${id}["']`, 'i').test(raw))
          || attr(t.raw, 'aria-label') || attr(t.raw, 'aria-labelledby');
        const wrapped = new RegExp(`<label[^>]*>(?:(?!</label>)[\\s\\S]){0,400}?${el}`, 'i').test(raw);
        if (!labelled && !wrapped) {
          const ph = attr(t.raw, 'placeholder');
          if (ph) {
            report.add('a11y/placeholder-as-label', MAJOR,
              `<${el}> labelled only by its placeholder ("${ph.slice(0, 30)}")`,
              { file: shown, line: t.line },
              'The placeholder disappears the moment someone types, so anyone who loses their place has no way back. Add a real <label>.');
          } else {
            report.add('a11y/label', BLOCKER, `<${el}> with no label at all`,
              { file: shown, line: t.line },
              'A screen reader announces an unnamed edit field. Nobody can complete this form.');
          }
        }
      }
    }

    // ---- skip link
    const skip = /<a[^>]+href\s*=\s*["']#([\w-]+)["'][^>]*>\s*(?:<[^>]+>)?\s*skip\s+to/i.exec(raw);
    if (skip) {
      const targetId = skip[1];
      if (!new RegExp(`\\bid\\s*=\\s*["']${targetId}["']`, 'i').test(raw)) {
        report.add('a11y/skip-link', MAJOR, `skip link points at #${targetId}, which does not exist`,
          { file: shown },
          'The skip link is the first thing a keyboard user hits and it currently does nothing. Add id="' + targetId + '" to <main>.');
      }
    } else if (!/skip\s+to\s+(main|content)/i.test(raw)) {
      report.add('a11y/skip-link', MINOR, 'no skip link', { file: shown },
        'Keyboard users tab through the whole nav on every page without one.');
    }

    // ---- landmarks
    if (!/<main\b/i.test(raw)) {
      report.add('a11y/landmarks', MAJOR, 'no <main> element', { file: shown },
        'Screen readers offer "jump to main content" as a landmark. Without <main> there is nothing to jump to.');
    }

    // ---- aria state nothing maintains
    const expandeds = (raw.match(/aria-expanded\s*=/gi) || []).length;
    if (expandeds) {
      const js = (raw.match(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi) || []).join('\n')
        + ctx.jsFiles.map(read).join('\n');
      if (!/aria-expanded/i.test(js)) {
        report.add('a11y/aria-invalid', MAJOR,
          'aria-expanded is set in the HTML and never updated by any JS',
          { file: shown, count: expandeds },
          'A permanently-false aria-expanded is worse than none: it tells a screen reader the menu is closed while it is open on screen.');
      }
    }

    // ---- autoplay
    for (const el of ['video', 'audio']) {
      for (const t of tags(raw, el)) {
        if (hasAttr(t.raw, 'autoplay') && !hasAttr(t.raw, 'muted') && !hasAttr(t.raw, 'controls')) {
          report.add('a11y/autoplay', MAJOR, `<${el} autoplay> with no controls and no muted`,
            { file: shown, line: t.line },
            'Sound that starts on its own with no way to stop it fails WCAG 1.4.2 and is the fastest way to make someone close the tab.');
        }
      }
    }

    // ---- overlay widgets
    if (OVERLAY_VENDORS.test(raw)) {
      const m = OVERLAY_VENDORS.exec(raw);
      report.add('a11y/overlay-widget', BLOCKER,
        `accessibility overlay detected (${m[0]})`,
        { file: shown },
        'Remove it and fix the markup instead. Overlays do not remediate the underlying failures, they are disproportionately present on sites that get sued, and selling one to a client as compliance is the part that carries real risk.');
    }

    // ---- new tab
    for (const t of tags(raw, 'a')) {
      if (/target\s*=\s*["']_blank["']/i.test(t.raw)) {
        const rel = (attr(t.raw, 'rel') || '').toLowerCase();
        if (!rel.includes('noopener')) {
          report.add('a11y/link-new-tab', MINOR, 'target="_blank" without rel="noopener"',
            { file: shown, line: t.line },
            'Add rel="noopener noreferrer". Also tell the user it opens a new tab — an unannounced context switch is disorienting for screen-reader and screen-magnifier users.');
          break;
        }
      }
    }
  }

  report.stats.contrastPairsChecked = contrastChecked;
  report.stats.a11yCoverageNote =
    'Automated checks find roughly a third of real WCAG failures, and this file covers a subset of those. A clean run is not an accessible site — it is a site whose cheap failures are gone.';
}

export default { gates, run };
