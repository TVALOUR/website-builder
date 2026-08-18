// website-builder — performance gates.
//
// Static-file signatures only. This does not measure Core Web Vitals — that
// needs a real browser on a real connection, and a checker that PREDICTS an LCP
// number would be inventing it. What it does catch is the set of build-time
// decisions that reliably produce a bad LCP/CLS/INP later, each of which is
// visible in the source and cheap to fix before launch.
//
// The bias is toward the mobile visitor on a rural 4G connection, because that
// is who is actually searching for a tradesperson at the moment they need one.
//
// RULE PROVENANCE
//   source:  TAXONOMY.md (18-angle research wave, 2026-08-18, adversarially verified)
//   dated:   2026-08-18
//   review:  2027-02-18 — six months. Signals decay: a tell that identified a
//            generator in 2023 can be a mainstream choice by 2026. At review,
//            ask of every rule here "is this still true?" and RETIRE the ones
//            that are not. Removing a rule is a normal outcome, not a failure;
//            TAXONOMY.md has a section for it.

import { read, displayPath, exists } from '../lib/fs.mjs';
import { tags, attr, hasAttr, head, linkRel } from '../lib/html.mjs';
import { loadStylesheets } from '../lib/css.mjs';
import { BLOCKER, MAJOR, MINOR, plural, verb } from '../lib/report.mjs';
import { statSync } from 'node:fs';
import { join, extname, dirname, resolve } from 'node:path';

export const gates = [
  { id: 'perf/image-dimensions', severity: 'major', what: 'images without width/height, which shift the layout as they load' },
  { id: 'perf/image-weight', severity: 'major', what: 'an image heavy enough to dominate the page load' },
  { id: 'perf/image-format', severity: 'minor', what: 'PNG/JPEG where AVIF or WebP would halve the bytes' },
  { id: 'perf/lazy-loading', severity: 'minor', what: 'below-the-fold images loading eagerly' },
  { id: 'perf/lazy-lcp', severity: 'major', what: 'lazy-loading the hero image, which delays the very thing being measured' },
  { id: 'perf/font-render-blocking', severity: 'major', what: 'webfonts loaded in a way that blocks first paint' },
  { id: 'perf/font-display', severity: 'major', what: 'no font-display, so text is invisible until the font arrives' },
  { id: 'perf/font-weights', severity: 'minor', what: 'more font files downloaded than the CSS actually uses' },
  { id: 'perf/render-blocking-js', severity: 'major', what: 'scripts in <head> with no defer or async' },
  { id: 'perf/unpurged-css', severity: 'minor', what: 'a full framework stylesheet shipped for a five-page site' },
  { id: 'perf/preload-lcp', severity: 'minor', what: 'the hero image is not preloaded' },
];

const RASTER = new Set(['.png', '.jpg', '.jpeg']);
const MODERN = new Set(['.avif', '.webp']);

function sizeOf(p) {
  try { return statSync(p).size; } catch { return null; }
}

export async function run(ctx, report) {
  const { siteDir, htmlFiles, cssFiles, styleSources } = ctx;
  for (const id of gates.map((g) => g.id)) report.ranGate(id);

  const { text: cssText } = loadStylesheets(styleSources);

  // ------------------------------------------------------------ fonts
  const fontFaces = [...cssText.matchAll(/@font-face\s*\{([\s\S]*?)\}/gi)].map((m) => m[1]);
  const withoutDisplay = fontFaces.filter((f) => !/font-display\s*:/i.test(f));
  if (fontFaces.length && withoutDisplay.length) {
    report.add('perf/font-display', MAJOR,
      `${withoutDisplay.length} of ${fontFaces.length} @font-face rules have no font-display`,
      { count: withoutDisplay.length },
      'Add font-display: swap. Without it most browsers hide the text for up to 3 seconds waiting for the font — the visitor stares at a blank page that has already loaded.');
  }

  const fontFiles = new Set();
  for (const f of fontFaces) {
    for (const m of f.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) fontFiles.add(m[1]);
  }
  if (fontFiles.size > 4) {
    report.add('perf/font-weights', MINOR,
      `${fontFiles.size} font files declared`,
      { count: fontFiles.size },
      'Each is a separate download before text renders in its real face. Two or three weights of one family is almost always enough — build hierarchy from size and case instead.');
  }

  // @import inside CSS is the worst way to load a font: the browser cannot even
  // discover it until the stylesheet has parsed, serialising two round trips.
  if (/@import\s+url\([^)]*fonts\./i.test(cssText)) {
    report.add('perf/font-render-blocking', MAJOR,
      'webfont loaded with @import inside a stylesheet',
      {},
      'The browser cannot discover the font until the CSS has downloaded AND parsed — two serial round trips before any text appears. Move it to a <link> in the head, or self-host.');
  }

  // ------------------------------------------------------------ per page
  for (const file of htmlFiles) {
    const raw = read(file);
    const shown = displayPath(file, siteDir);
    const h = head(raw);

    // render-blocking JS
    for (const t of tags(h, 'script')) {
      if (!attr(t.raw, 'src')) continue;
      if (hasAttr(t.raw, 'defer') || hasAttr(t.raw, 'async')
          || (attr(t.raw, 'type') || '').toLowerCase() === 'module') continue;
      report.add('perf/render-blocking-js', MAJOR,
        `<script src> in <head> with no defer/async`,
        { file: shown, line: t.line },
        'Parsing stops dead until this downloads and executes. Add defer, or move it to the end of <body>.');
      break;
    }

    // Google Fonts without preconnect is two extra DNS+TLS handshakes on the
    // critical path — though self-hosting is the better answer and the legal
    // family already says so.
    if (/fonts\.googleapis\.com/i.test(h) && !/rel\s*=\s*["']preconnect["'][^>]*fonts\.gstatic/i.test(h)) {
      report.add('perf/font-render-blocking', MINOR,
        'Google Fonts stylesheet with no preconnect to fonts.gstatic.com',
        { file: shown },
        'Better still: self-host the woff2 files. It removes two handshakes, the render-blocking stylesheet, and the GDPR question in one move.');
    }

    const imgs = tags(raw, 'img');
    let firstImage = true;
    const eagerBelowFold = [];
    for (const img of imgs) {
      const src = attr(img.raw, 'src') || '';
      const hasW = attr(img.raw, 'width');
      const hasH = attr(img.raw, 'height');
      const lazy = /lazy/i.test(attr(img.raw, 'loading') || '');

      if ((!hasW || !hasH) && !/^data:/i.test(src)) {
        report.add('perf/image-dimensions', MAJOR,
          `<img> without width and height: ${src.slice(0, 50)}`,
          { file: shown, line: img.line },
          'Set both attributes (the intrinsic pixel size — CSS can still resize it). Without them the page reflows as each image arrives, which is the single biggest source of Cumulative Layout Shift and of the tap that lands on the wrong thing.');
      }

      // The first image in the document is very likely the LCP element. Lazy-
      // loading it is a documented anti-pattern: it delays the exact paint the
      // metric measures.
      if (firstImage && lazy) {
        report.add('perf/lazy-lcp', MAJOR,
          `the first image on the page is loading="lazy": ${src.slice(0, 50)}`,
          { file: shown, line: img.line },
          'Remove loading="lazy" from the hero and add fetchpriority="high". Lazy-loading the LCP image measurably makes the metric worse — it is the one image that must load first.');
      }
      // Deliberately NOT nagged for SVGs and small files: lazy-loading a 2 KB
      // icon costs an IntersectionObserver callback to save nothing, and a
      // report full of that noise is a report people stop reading.
      const cheapFormat = /\.svg(\?|$)/i.test(src);
      if (!firstImage && !lazy && !cheapFormat && !/^data:/i.test(src) && imgs.length > 3) {
        eagerBelowFold.push({ file: shown, line: img.line, src });
      }

      // real file weight and format
      if (src && !/^(data:|https?:)/i.test(src)) {
        const p = src.startsWith('/') ? join(siteDir, src) : resolve(dirname(file), src.split('?')[0]);
        const bytes = exists(p) ? sizeOf(p) : null;
        const ext = extname(p).toLowerCase();
        if (bytes && bytes > 400_000) {
          report.add('perf/image-weight', MAJOR,
            `${(bytes / 1024 / 1024).toFixed(2)} MB image: ${src.slice(0, 50)}`,
            { file: shown, line: img.line },
            'On rural 4G this alone is several seconds. Resize to the largest size it actually displays at, then export AVIF or WebP at ~80% quality.');
        } else if (bytes && bytes > 180_000 && RASTER.has(ext)) {
          report.add('perf/image-format', MINOR,
            `${Math.round(bytes / 1024)} KB ${ext.slice(1).toUpperCase()}: ${src.slice(0, 40)}`,
            { file: shown, line: img.line },
            'AVIF or WebP typically halves this at the same visible quality. Keep the original as a <source> fallback if you need one.');
        }
        if (firstImage && !linkRel(h, 'preload')) {
          report.add('perf/preload-lcp', MINOR,
            'the hero image is not preloaded',
            { file: shown },
            `Add <link rel="preload" as="image" href="${src.slice(0, 40)}" fetchpriority="high"> so the browser starts it before the CSS finishes.`);
        }
      }
      firstImage = false;
    }

    // Only worth reporting the ones big enough to matter, and once per page.
    const heavyEager = eagerBelowFold.filter((e) => {
      const p = e.src.startsWith('/') ? join(siteDir, e.src) : resolve(dirname(file), e.src.split('?')[0]);
      const b = exists(p) ? sizeOf(p) : 0;
      return (b || 0) > 30_000;
    });
    if (heavyEager.length) {
      report.add('perf/lazy-loading', MINOR,
        `${plural(heavyEager.length, 'below-the-fold image')} ${verb(heavyEager.length, 'loads', 'load')} eagerly`,
        { file: shown, line: heavyEager[0].line, count: heavyEager.length },
        'Add loading="lazy" to everything below the fold. On a phone that is most of the page, and they compete with the hero for bandwidth.');
    }
  }

  // ------------------------------------------------------------ CSS weight
  for (const f of cssFiles) {
    const bytes = sizeOf(f) || 0;
    if (bytes > 250_000) {
      report.add('perf/unpurged-css', MINOR,
        `${Math.round(bytes / 1024)} KB stylesheet: ${displayPath(f, siteDir)}`,
        { file: displayPath(f, siteDir) },
        'A brochure site does not need a quarter-megabyte of CSS. If this is an unpurged framework build, run its purge step — most of these files are 95% unused rules.');
    }
  }
}

export default { gates, run };
