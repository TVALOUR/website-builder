#!/usr/bin/env node
// Static-analysis checker for a mechanically-verifiable SUBSET of the design
// contract's numbered slop-test gates (checklist form: pre-ship-gates.md).
//
// Why this exists: a build agent's own pre-emit critique is the model grading its
// own homework. Most of the 57 gates genuinely need judgment or a rendered
// browser (invented metrics, chrome redraw, visual rhythm, two-line wrap) and
// stay that way — this script does NOT replace stage-06's
// visual review. It independently re-verifies the ~14 gates that are pure
// static analysis once CSS custom properties are resolved, so a passing stamp
// is confirmed by a machine, not just asserted by the same model that wrote
// the code.
//
// Gates covered (numbering inherited from the contract's source slop test): 24, 26, 27, 37, 38a, 39, 40, 41,
// 48, 50, 51, 55, 56. Plus two workspace-local second-order proxies (anti-slop-rules
// §11): 63 (signature motif stamped on most sections) and 64 (uniform section
// rhythm); plus P1: unresolved <<TOKEN>> / [NEEDS:] placeholder shipped in page text.
// Every finding is FAIL (pattern-matched with confidence) or WARN (heuristic —
// needs a human look). Nothing here is rendering-aware: no real cascade, no
// inheritance, no computed layout. Treat this as a fast pre-check before the
// stage-06 visual review, not a substitute for it.
//
// Usage: node shared/design/check-slop-gates.mjs <site-dir>
//   site-dir is REQUIRED -- relative to cwd, or absolute. No default: a missing
//   argument once silently scanned the previous build's stale scratch tree and
//   printed a well-formed PASS. Scans every *.css and *.html
//   file under site-dir recursively.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = join(__dirname, '..', '..');

// Why the argument is mandatory: a missing site argument used to silently
// default to stages/05_build/output/site — the PREVIOUS build's scratch
// output, which usually has no legal pages at all. A truncated paste, or a session
// that forgot to pass the site name while copying the command shape
// all produced a well-formed `**0 FAIL, N WARN.**` line scoped to the wrong tree —
// exactly the checker-lied shape this whole layer exists to kill. There is no
// default anymore: no argument is a hard usage error, not a silent scan.
if (!process.argv[2]) {
  console.error('Usage: node shared/design/check-slop-gates.mjs <site-dir>');
  console.error('');
  console.error('  <site-dir> is REQUIRED -- there is no default target. Pass either:');
  console.error('    - a path relative to the current working directory (e.g. sites/your-site)');
  console.error('    - an absolute path (e.g. C:\\...\\sites\\your-site)');
  console.error('');
  console.error('  Omitting it used to silently scan stages/05_build/output/site (the previous');
  console.error('  build\'s scratch tree) and print a well-formed PASS scoped to the wrong site.');
  process.exit(2);
}
// isAbsolute: the old unconditional `join(cwd, argv[2])` mangled an
// absolute path into `<cwd>/C:/Users/...` instead of using it as-is -- it failed loudly
// (ENOENT), but it directly contradicted the instruction that the caller must pass
// literal absolute paths. An absolute argument is now used verbatim.
const siteDir = isAbsolute(process.argv[2]) ? process.argv[2] : join(process.cwd(), process.argv[2]);

// ---------- file collection ----------

function walk(dir, exts, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, exts, out);
    else if (exts.some((e) => entry.toLowerCase().endsWith(e))) out.push(full);
  }
  return out;
}

const cssFiles = walk(siteDir, ['.css']);
const htmlFiles = walk(siteDir, ['.html']);

if (cssFiles.length === 0) {
  console.error(`No CSS files found under ${siteDir}. Nothing to check.`);
  process.exit(2);
}

const findings = []; // {gate, severity: 'FAIL'|'WARN', file, line, detail}

function report(gate, severity, file, line, detail) {
  findings.push({ gate, severity, file: relative(WORKSPACE_ROOT, file), line, detail });
}

// ---------- tiny CSS tokenizer (rule list, not a full AST) ----------
// Strips comments, then splits into {selector, body, startLine} blocks by
// brace matching. Good enough for flat, non-nested stylesheets like the ones
// this workspace ships (no @supports/@container nesting of rules assumed
// beyond one level of @media/@keyframes, which are treated as opaque blocks
// with their own line offset).

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text[i] === '\n') line++;
  return line;
}

function parseRules(cssRaw) {
  const css = stripComments(cssRaw);
  const rules = [];
  let i = 0;
  const n = css.length;
  while (i < n) {
    const braceIdx = css.indexOf('{', i);
    if (braceIdx === -1) break;
    const selectorRaw = css.slice(i, braceIdx).trim();
    // find matching close brace (handles one level of nesting for @media/@keyframes)
    let depth = 1;
    let j = braceIdx + 1;
    while (j < n && depth > 0) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    const body = css.slice(braceIdx + 1, j - 1);
    const startLine = lineAt(css, braceIdx);

    if (/^@(media|supports|keyframes|font-face|-webkit-keyframes)/i.test(selectorRaw)) {
      if (/^@(media|supports)/i.test(selectorRaw)) {
        // recurse into nested rules, but remember we're inside this at-rule
        const nested = parseRules(body);
        for (const r of nested) {
          rules.push({ ...r, atRule: selectorRaw, startLine: startLine + r.startLine - 1 });
        }
      } else {
        rules.push({ selector: selectorRaw, body, declarations: [], startLine, atRule: null, isKeyframesOrFont: true });
      }
      i = j;
      continue;
    }

    const declarations = [];
    for (const part of body.split(';')) {
      const decl = part.trim();
      if (!decl) continue;
      const colonIdx = decl.indexOf(':');
      if (colonIdx === -1) continue;
      const prop = decl.slice(0, colonIdx).trim().toLowerCase();
      const value = decl.slice(colonIdx + 1).trim();
      declarations.push({ prop, value });
    }
    rules.push({ selector: selectorRaw, body, declarations, startLine, atRule: null });
    i = j;
  }
  return rules;
}

let allRules = [];
let allCssText = '';
for (const file of cssFiles) {
  const text = readFileSync(file, 'utf8');
  allCssText += `\n/* --- ${file} --- */\n${text}`;
  const rules = parseRules(text);
  for (const r of rules) r.file = file;
  allRules = allRules.concat(rules);
}

let allHtmlText = '';
const htmlByFile = {};
for (const file of htmlFiles) {
  const text = readFileSync(file, 'utf8');
  htmlByFile[file] = text;
  allHtmlText += `\n<!-- ${file} -->\n${text}`;
}

// ---------- token map (custom properties from :root / [data-theme=...]) ----------

const tokenRules = allRules.filter(
  (r) => !r.isKeyframesOrFont && /(^|,)\s*(:root|\[data-theme)/i.test(r.selector)
);
const tokens = {}; // name -> raw value (last writer wins, matches CSS cascade order for flat files)
for (const r of tokenRules) {
  for (const d of r.declarations) {
    if (d.prop.startsWith('--')) tokens[d.prop] = d.value;
  }
}

function resolveVar(value, seen = new Set()) {
  return value.replace(/var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/g, (m, name, fallback) => {
    if (seen.has(name)) return m;
    if (tokens[name] !== undefined) {
      seen.add(name);
      return resolveVar(tokens[name], seen);
    }
    return fallback ? fallback.trim() : m;
  });
}

// ---------- color parsing -> [r,g,b] 0-255 ----------

function parseColor(raw) {
  const v = raw.trim();
  let m;
  if ((m = /^#([0-9a-f]{3})$/i.exec(v))) {
    const [r, g, b] = m[1].split('').map((c) => parseInt(c + c, 16));
    return [r, g, b];
  }
  if ((m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(v))) {
    const hex = m[1];
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }
  if ((m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(v))) {
    return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
  }
  if ((m = /^hsla?\(\s*([\d.]+)(?:deg)?[,\s]+([\d.]+)%[,\s]+([\d.]+)%/i.exec(v))) {
    return hslToRgb(parseFloat(m[1]), parseFloat(m[2]) / 100, parseFloat(m[3]) / 100);
  }
  if ((m = /^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)/i.exec(v))) {
    return oklchToRgb(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }
  return null;
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

// Approximate OKLCH -> sRGB (good enough for a contrast pre-check, not colorimetrically exact).
function oklchToRgb(L, C, H) {
  if (L > 1) L = L / 100;
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  let r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const toSrgb = (c) => {
    c = Math.max(0, Math.min(1, c));
    return (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055) * 255;
  };
  return [toSrgb(r), toSrgb(g), toSrgb(bl)];
}

function relLuminance([r, g, b]) {
  const chan = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [rl, gl, bl] = [chan(r), chan(g), chan(b)];
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(c1, c2) {
  const L1 = relLuminance(c1), L2 = relLuminance(c2);
  const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

function resolveColor(rawValue) {
  const resolved = resolveVar(rawValue);
  return parseColor(resolved);
}

// Alpha < ~0.9 means the effective on-page colour depends on whatever sits
// behind it, which this script can't know (no real compositing). Treat those
// as unresolvable rather than silently assuming an opaque value — that's what
// produced a bogus 1.00:1 "FAIL" for a translucent hover tint during testing.
function hasSignificantAlpha(rawValue) {
  const resolved = resolveVar(rawValue);
  let m = /rgba?\([^)]*[,\s]([\d.]+)\s*\)/i.exec(resolved);
  if (m && /rgba/i.test(resolved)) return parseFloat(m[1]) < 0.9;
  m = /hsla\([^)]*[,\s]([\d.]+)\s*\)/i.exec(resolved);
  if (m) return parseFloat(m[1]) < 0.9;
  m = /^#[0-9a-f]{6}([0-9a-f]{2})$/i.exec(resolved.trim());
  if (m) return parseInt(m[1], 16) / 255 < 0.9;
  return false;
}

// ================= GATE 48: token discipline =================
// Any hex/rgb/hsl/oklch color literal, or a literal (non-var) font-family,
// declared OUTSIDE a :root / [data-theme] block.

const COLOR_LITERAL = /(#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\()/i;

for (const r of allRules) {
  if (r.isKeyframesOrFont) continue;
  if (/(^|,)\s*(:root|\[data-theme)/i.test(r.selector)) continue; // token block itself is exempt
  for (const d of r.declarations) {
    const isColorProp = /^(color|background|background-color|border|border-color|border-top-color|border-bottom-color|border-left-color|border-right-color|outline|outline-color|fill|stroke|box-shadow|text-decoration-color)$/.test(
      d.prop
    );
    if (isColorProp && COLOR_LITERAL.test(d.value) && !/var\(--/.test(d.value)) {
      // color-mix(in srgb, var(--x) N%, transparent) is fine — only flag if no var() at all feeds it
      report(48, 'FAIL', r.file, r.startLine, `${r.selector} { ${d.prop}: ${d.value} } — literal color outside :root token block`);
    }
    if (d.prop === 'font-family' && !/var\(--font/.test(d.value)) {
      report(48, 'FAIL', r.file, r.startLine, `${r.selector} { font-family: ${d.value} } — literal font-family outside a var(--font-*) token`);
    }
  }
}

// ================= GATE 37/38a: font family count + italic headings =================

const fontTokenNames = Object.keys(tokens).filter((k) => /^--font-/.test(k));
const familySet = new Set();
for (const name of fontTokenNames) {
  const first = tokens[name].split(',')[0].trim().replace(/^['"]|['"]$/g, '');
  if (!/^(system-ui|-apple-system|sans-serif|serif|monospace|segoe ui|arial|helvetica)$/i.test(first)) {
    familySet.add(first.toLowerCase());
  }
}
if (familySet.size > 3) {
  report(37, 'FAIL', cssFiles[0], 1, `${familySet.size} distinct display font families across --font-* tokens: ${[...familySet].join(', ')} (ceiling is 3)`);
} else if (familySet.size === 0 && fontTokenNames.length > 0) {
  report(37, 'WARN', cssFiles[0], 1, `--font-* tokens present but none resolved to a named family — check manually`);
}

const HEADING_SELECTOR = /(^|[\s,>+~.])(h1|h2|h3|h4|h5|h6)([\s,{.:[]|$)|hero|title|wordmark|display/i;
for (const r of allRules) {
  if (r.isKeyframesOrFont) continue;
  if (!HEADING_SELECTOR.test(r.selector)) continue;
  const fontStyle = r.declarations.find((d) => d.prop === 'font-style');
  if (fontStyle && /italic/i.test(fontStyle.value)) {
    report('38a', 'FAIL', r.file, r.startLine, `${r.selector} { font-style: italic } on a heading-shaped selector`);
  }
}
// <em>/<i> inside a heading tag in the HTML
for (const [file, text] of Object.entries(htmlByFile)) {
  const re = /<(h[1-6])[^>]*>[\s\S]{0,300}?<(em|i)[\s>]/gi;
  let m;
  while ((m = re.exec(text))) {
    const line = lineAt(text, m.index);
    report('38a', 'WARN', file, line, `<${m[1]}> contains <${m[2]}> — confirm this isn't an italicised word inside an otherwise-roman heading`);
  }
}

// ================= GATE 26/39: interactive states =================

const interactiveBaseSelectors = new Map(); // base -> {hover,focusVisible,active,disabled}
const PSEUDO_SPLIT = /:(hover|focus-visible|focus|active|disabled)\b/;
for (const r of allRules) {
  if (r.isKeyframesOrFont) continue;
  const looksInteractive = /(^|[\s,])(button|\.btn|a\.|a\[|a:|input|select|textarea|\[role=["']?button)/i.test(r.selector);
  if (!looksInteractive) continue;
  for (const singleSel of r.selector.split(',')) {
    const sel = singleSel.trim();
    const m = PSEUDO_SPLIT.exec(sel);
    const base = m ? sel.slice(0, m.index) : sel;
    if (!base) continue;
    if (!interactiveBaseSelectors.has(base)) {
      interactiveBaseSelectors.set(base, { hover: false, focusVisible: false, active: false, disabled: false, file: r.file, line: r.startLine });
    }
    const entry = interactiveBaseSelectors.get(base);
    if (/:hover/.test(sel)) entry.hover = true;
    if (/:focus-visible/.test(sel)) entry.focusVisible = true;
    if (/:active/.test(sel)) entry.active = true;
    if (/:disabled|\[disabled\]|\[aria-disabled/.test(sel)) entry.disabled = true;
  }
}
for (const [base, entry] of interactiveBaseSelectors) {
  if (entry.hover && !entry.focusVisible) {
    report(26, 'WARN', entry.file, entry.line, `${base} has a :hover rule but no matching :focus-visible rule found`);
  }
  if (entry.hover && !entry.disabled && /button|\.btn|input|select|textarea/i.test(base)) {
    report(26, 'WARN', entry.file, entry.line, `${base} has no :disabled / [aria-disabled] rule found (8-state checklist)`);
  }
}

// Gate 39: disabled via opacity alone, and border-width shifting across states
const inputLikeBases = new Set();
for (const r of allRules) {
  if (r.isKeyframesOrFont) continue;
  if (/(input|select|textarea|\.field)/i.test(r.selector)) {
    for (const singleSel of r.selector.split(',')) {
      const sel = singleSel.trim();
      const m = PSEUDO_SPLIT.exec(sel);
      inputLikeBases.add(m ? sel.slice(0, m.index) : sel);
    }
  }
}
const borderWidthByBase = new Map(); // base -> Set of border-width values seen across its states
for (const r of allRules) {
  if (r.isKeyframesOrFont) continue;
  for (const singleSel of r.selector.split(',')) {
    const sel = singleSel.trim();
    const m = PSEUDO_SPLIT.exec(sel);
    const base = m ? sel.slice(0, m.index) : sel;
    if (!inputLikeBases.has(base)) continue;
    const bw = r.declarations.find((d) => d.prop === 'border-width' || d.prop === 'border');
    if (bw) {
      const widthMatch = /(\d+(\.\d+)?(px|rem|em))/.exec(bw.value);
      if (widthMatch) {
        if (!borderWidthByBase.has(base)) borderWidthByBase.set(base, new Set());
        borderWidthByBase.get(base).add(widthMatch[1]);
      }
    }
  }
}
for (const [base, widths] of borderWidthByBase) {
  if (widths.size > 1) {
    report(39, 'WARN', cssFiles[0], 1, `${base} declares differing border-width across its states: ${[...widths].join(', ')} — border-width must stay constant, vary background/outline/border-color instead`);
  }
}
for (const r of allRules) {
  if (r.isKeyframesOrFont) continue;
  if (/:disabled|\[disabled\]|\[aria-disabled/.test(r.selector)) {
    const hasOpacity = r.declarations.some((d) => d.prop === 'opacity');
    const hasCursor = r.declarations.some((d) => d.prop === 'cursor' && /not-allowed/.test(d.value));
    if (hasOpacity && !hasCursor) {
      report(39, 'FAIL', r.file, r.startLine, `${r.selector} sets opacity for disabled state without cursor: not-allowed`);
    }
  }
}

// ================= GATE 27: reduced-motion fallback presence =================

const hasKeyframes = allRules.some((r) => r.isKeyframesOrFont && /@(-webkit-)?keyframes/i.test(r.selector));
const hasTransitionOrAnimation = allRules.some((r) => r.declarations.some((d) => d.prop === 'transition' || d.prop === 'animation' || d.prop === 'animation-name'));
const hasReducedMotionBlock = /prefers-reduced-motion\s*:\s*reduce/i.test(allCssText);
if ((hasKeyframes || hasTransitionOrAnimation) && !hasReducedMotionBlock) {
  report(27, 'FAIL', cssFiles[0], 1, `Stylesheet declares animation/transition but no @media (prefers-reduced-motion: reduce) block was found anywhere in ${cssFiles.length} CSS file(s)`);
}

// ================= GATE 40/41: contrast =================
// Only checks color+background(-color) declared in the SAME rule — not
// cascade-aware. False negatives (inherited pairs) are expected; treat FAILs
// here as confirmed, and the absence of a FAIL as "not disproven", not "safe".

function fontSizeIsLarge(declarations) {
  const fs = declarations.find((d) => d.prop === 'font-size');
  const fw = declarations.find((d) => d.prop === 'font-weight');
  if (!fs) return false;
  const remMatch = /([\d.]+)rem/.exec(fs.value);
  const pxMatch = /([\d.]+)px/.exec(fs.value);
  let px = null;
  if (remMatch) px = parseFloat(remMatch[1]) * 16;
  else if (pxMatch) px = parseFloat(pxMatch[1]);
  else if (/clamp\(/.test(fs.value)) px = 24; // clamp() display type — assume large, conservative
  if (px === null) return false;
  const bold = fw && (parseInt(fw.value, 10) >= 700 || /bold/i.test(fw.value));
  return px >= 24 || (bold && px >= 18.66);
}

for (const r of allRules) {
  if (r.isKeyframesOrFont) continue;
  const colorDecl = r.declarations.find((d) => d.prop === 'color');
  const bgDecl = r.declarations.find((d) => d.prop === 'background-color' || d.prop === 'background');
  if (!colorDecl || !bgDecl) continue;
  if (/gradient|url\(/.test(bgDecl.value)) continue; // can't evaluate a gradient/image fill statically
  if (hasSignificantAlpha(bgDecl.value) || hasSignificantAlpha(colorDecl.value)) {
    report(40, 'WARN', r.file, r.startLine, `${r.selector} { color: ${colorDecl.value}; background: ${bgDecl.value} } — translucent colour; effective contrast depends on what's underneath, can't be computed statically`);
    continue;
  }
  const fg = resolveColor(colorDecl.value);
  const bg = resolveColor(bgDecl.value);
  if (!fg || !bg) continue;
  const ratio = contrastRatio(fg, bg);
  const large = fontSizeIsLarge(r.declarations);
  const threshold = large ? 3.0 : 4.5;
  if (ratio < threshold) {
    report(40, 'FAIL', r.file, r.startLine, `${r.selector} { color: ${colorDecl.value}; background: ${bgDecl.value} } — contrast ${ratio.toFixed(2)}:1 against a ${threshold}:1 floor`);
  }
  // gate 41: button text ~= button fill
  if (/(^|[\s,.])(button|\.btn|\[role=["']?button)/i.test(r.selector)) {
    const dl = Math.abs(relLuminance(fg) - relLuminance(bg));
    if (dl < 0.08 && ratio < 2) {
      report(41, 'FAIL', r.file, r.startLine, `${r.selector} — button text colour and fill are nearly identical (contrast ${ratio.toFixed(2)}:1); likely the "forgot to flip ink" bug`);
    }
  }
}

// ================= GATE 50: image-bearing 1fr grid tracks =================

const BARE_1FR = /grid-template-(columns|rows)\s*:\s*[^;]*(?<!minmax\(0,\s?)\b1fr\b/i;
for (const r of allRules) {
  if (r.isKeyframesOrFont) continue;
  for (const d of r.declarations) {
    if ((d.prop === 'grid-template-columns' || d.prop === 'grid-template-rows') && /\b1fr\b/.test(d.value) && !/minmax\(\s*0/.test(d.value)) {
      // heuristic cross-reference: does any HTML use this selector's class with an <img>/<picture> descendant nearby?
      const classMatch = /\.([\w-]+)/.exec(r.selector);
      let imageNearby = false;
      if (classMatch) {
        const cls = classMatch[1];
        for (const text of Object.values(htmlByFile)) {
          const re = new RegExp(`class=["'][^"']*\\b${cls}\\b[^"']*["'][\\s\\S]{0,400}?<(img|picture)\\b`, 'i');
          if (re.test(text)) {
            imageNearby = true;
            break;
          }
        }
      }
      report(50, imageNearby ? 'FAIL' : 'WARN', r.file, r.startLine, `${r.selector} { ${d.prop}: ${d.value} } — bare 1fr${imageNearby ? ' with an <img>/<picture> found nearby in markup' : '; confirm manually whether this track ever holds an image'}`);
    }
  }
}

// ================= GATE 51: display headers missing overflow-wrap =================

for (const r of allRules) {
  if (r.isKeyframesOrFont) continue;
  if (!/(^|[\s,>+~.])(h1|h2|h3)([\s,{.:[]|$)|hero.*(title|display)|wordmark/i.test(r.selector)) continue;
  const hasClamp = r.declarations.some((d) => d.prop === 'font-size' && /clamp\(/.test(d.value));
  if (!hasClamp) continue; // only flag actual display-sized headings
  const hasWrap = r.declarations.some((d) => d.prop === 'overflow-wrap' && /anywhere/.test(d.value));
  if (!hasWrap) {
    report(51, 'WARN', r.file, r.startLine, `${r.selector} sets a clamp() display size but no overflow-wrap: anywhere on this rule (may inherit it from a shared heading rule — verify)`);
  }
}

// ================= GATE 55: uppercase + line-height < 1.0 =================

for (const r of allRules) {
  if (r.isKeyframesOrFont) continue;
  const upper = r.declarations.find((d) => d.prop === 'text-transform' && /uppercase/i.test(d.value));
  const lh = r.declarations.find((d) => d.prop === 'line-height');
  if (upper && lh) {
    const val = parseFloat(lh.value);
    if (!Number.isNaN(val) && !/px|rem|em/.test(lh.value) && val < 1.0) {
      report(55, 'FAIL', r.file, r.startLine, `${r.selector} { text-transform: uppercase; line-height: ${lh.value} } — below the 1.0 floor for all-caps display type`);
    }
  }
}

// ================= GATE 56: two sticky top:0 elements =================

const stickyTopZero = [];
for (const r of allRules) {
  if (r.isKeyframesOrFont) continue;
  const pos = r.declarations.find((d) => d.prop === 'position' && /sticky/.test(d.value));
  const top = r.declarations.find((d) => d.prop === 'top' && /^0(px|rem)?$/.test(d.value.trim()));
  if (pos && top) stickyTopZero.push(r);
}
const navLike = stickyTopZero.filter((r) => /nav|header|masthead|banner/i.test(r.selector));
const nonNavLike = stickyTopZero.filter((r) => !/nav|header|masthead|banner/i.test(r.selector));
if (stickyTopZero.length > 1 && nonNavLike.length > 0 && (navLike.length > 0 || stickyTopZero.length - nonNavLike.length === 0)) {
  for (const r of nonNavLike) {
    report(56, 'WARN', r.file, r.startLine, `${r.selector} { position: sticky; top: 0 } alongside another sticky-at-top-0 element — check it isn't painting under/over the nav (needs var(--banner-height) offset)`);
  }
}

// ================= GATE 24: spacing scale =================

const spaceTokenPx = new Set();
for (const [name, val] of Object.entries(tokens)) {
  if (/^--space-/.test(name)) {
    const px = /([\d.]+)px/.exec(val);
    const rem = /([\d.]+)rem/.exec(val);
    if (px) spaceTokenPx.add(Math.round(parseFloat(px[1])));
    else if (rem) spaceTokenPx.add(Math.round(parseFloat(rem[1]) * 16));
  }
}
if (spaceTokenPx.size > 0) {
  for (const r of allRules) {
    if (r.isKeyframesOrFont) continue;
    for (const d of r.declarations) {
      if (!/^(padding|margin|gap)(-block|-inline)?(-start|-end)?$/.test(d.prop)) continue;
      if (/var\(--space/.test(d.value)) continue;
      if (/^(0|auto|inherit)$/.test(d.value.trim())) continue;
      const pxMatches = [...d.value.matchAll(/([\d.]+)px/g)].map((m) => Math.round(parseFloat(m[1])));
      for (const px of pxMatches) {
        if (px !== 0 && px % 4 !== 0) {
          report(24, 'WARN', r.file, r.startLine, `${r.selector} { ${d.prop}: ${d.value} } — ${px}px is not a multiple of 4px and isn't a --space-* token`);
        }
      }
    }
  }
}

// ================= GATE 63: signature motif stamped on most sections =================
// Second-order tell (anti-slop-rules §11): an eyebrow/kicker/prompt motif is fine as
// punctuation but reads as the "eyebrow above every heading" slop pattern once it
// prefixes the majority of sections. Heuristic, per-page: WARN when a page has >=4
// <section>s and a known motif class appears before >=70% of them. Pure proxy — the
// judgment call (which openings *should* carry it) stays with the visual review.

const MOTIF_CLASS = /class=["'][^"']*\b(eyebrow|kicker|overline|prompt-line|rail-label|section-label|section-eyebrow|section-kicker)\b[^"']*["']/gi;
for (const [file, text] of Object.entries(htmlByFile)) {
  const sectionCount = (text.match(/<section\b/gi) || []).length;
  if (sectionCount < 4) continue;
  const motifCount = (text.match(MOTIF_CLASS) || []).length;
  if (motifCount / sectionCount >= 0.7) {
    report(63, 'WARN', file, 1, `${motifCount} eyebrow/kicker motif element(s) across ${sectionCount} <section>s (${Math.round((motifCount / sectionCount) * 100)}%) — a signature stamped on most sections becomes the eyebrow-kicker tell; ration it to a minority of openings`);
  }
}

// ================= GATE 64: uniform section rhythm =================
// Second-order tell (anti-slop-rules §11): if every section-like container shares one
// padding-block token, the page reads as a uniform stack, not a composition. WARN when
// >=4 distinct section-shaped selectors resolve to the SAME padding-block value.

const SECTIONISH = /^\.(section|band|hero|cta-band|cta|piece|panel|feature-section)\b|(^|[\s,])section\b/i;
const paddingBlockByValue = new Map(); // resolved value -> [{selector,file,line}]
for (const r of allRules) {
  if (r.isKeyframesOrFont || r.atRule) continue; // base rules only, not responsive overrides
  if (!SECTIONISH.test(r.selector)) continue;
  const pb = r.declarations.find((d) => d.prop === 'padding-block');
  if (!pb) continue;
  const key = resolveVar(pb.value).trim();
  if (!paddingBlockByValue.has(key)) paddingBlockByValue.set(key, []);
  paddingBlockByValue.get(key).push({ selector: r.selector.split(',')[0].trim(), file: r.file, line: r.startLine });
}
for (const [value, entries] of paddingBlockByValue) {
  if (entries.length >= 4) {
    const list = entries.map((e) => e.selector).join(', ');
    report(64, 'WARN', entries[0].file, entries[0].line, `${entries.length} section-like selectors share one padding-block (${value}): ${list} — vary the vertical rhythm; a page needs >=2 genuinely distinct section archetypes, not one band repeated`);
  }
}

// ---------- P1: unresolved placeholder tokens (always FAIL) ----------
// A shipped page must contain no unresolved <<CONFIG_TOKEN>> and no [NEEDS: ...]
// content marker: the sanctioned in-build form is an HTML comment TODO, which
// renders invisibly -- these two render as text a visitor can read.
const PLACEHOLDER_RE = /<<[A-Z0-9_]+>>|\[NEEDS:/;
for (const file of [...htmlFiles, ...cssFiles]) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(PLACEHOLDER_RE);
    if (m) report('P1', 'FAIL', file, i + 1, `unresolved placeholder shipped: \`${m[0]}\` — resolve it upstream or use the build-report TODO mechanism`);
  }
}

// ---------- report ----------

const bySeverity = { FAIL: [], WARN: [] };
for (const f of findings) bySeverity[f.severity].push(f);

const gateOrder = [24, 26, 27, 37, '38a', 39, 40, 41, 48, 50, 51, 55, 56, 63, 64, 'P1'];
console.log(`# Slop-gate static check\n`);
console.log(`Scanned ${cssFiles.length} CSS file(s), ${htmlFiles.length} HTML file(s) under \`${relative(WORKSPACE_ROOT, siteDir)}\`.\n`);
console.log(`Gates checked (mechanical subset only — see script header for scope): ${gateOrder.join(', ')}.\n`);
console.log(`**${bySeverity.FAIL.length} FAIL, ${bySeverity.WARN.length} WARN.**\n`);

for (const gate of gateOrder) {
  const gf = findings.filter((f) => String(f.gate) === String(gate));
  if (gf.length === 0) {
    console.log(`## Gate ${gate} — pass (no findings)\n`);
    continue;
  }
  console.log(`## Gate ${gate} — ${gf.length} finding(s)\n`);
  for (const f of gf) {
    console.log(`- **${f.severity}** \`${f.file}:${f.line}\` — ${f.detail}`);
  }
  console.log('');
}

console.log('---');
console.log(
  'FAIL = pattern-matched with confidence, treat as blocking. WARN = heuristic, needs a human look. ' +
  'This script does not check gates that require rendering or judgment (invented metrics, chrome redraw, visual rhythm, ' +
  'two-line clickable text, diversification, hero fold-fit, and others) — run the stage-06 visual review for those.'
);

process.exit(bySeverity.FAIL.length > 0 ? 1 : 0);
