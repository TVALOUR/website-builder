// website-builder — a small CSS reader for static analysis.
//
// PROVENANCE: the rule tokenizer, custom-property resolver and the
// hex/rgb/hsl/oklch -> contrast pipeline are ported from `check-slop-gates.mjs`
// in an earlier private system by Tom MacKellar (2026), where they were written
// and hardened against real shipped sites. Ported here with the workspace-path
// coupling removed so the checker runs from any clone location.
//
// WHAT THIS IS NOT: a browser. There is no cascade, no specificity, no
// inheritance, no computed layout. A finding from this module is a claim about
// what the *source* says, never about what the page *renders*. Every rule that
// uses it must be written so a false positive is a WARN, not a BLOCKER.

import { read, lineAt } from './fs.mjs';

// ---------------------------------------------------------------- tokenizing

export function stripComments(css) {
  // Preserve newlines so line numbers stay accurate after stripping.
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

/**
 * Split a stylesheet into flat {selector, declarations, startLine} rules.
 * @media / @supports are recursed into (their inner rules carry `atRule`);
 * @keyframes and @font-face are kept as opaque blocks (`isKeyframesOrFont`).
 */
export function parseRules(cssRaw) {
  const css = stripComments(cssRaw);
  const rules = [];
  let i = 0;
  const n = css.length;
  while (i < n) {
    const braceIdx = css.indexOf('{', i);
    if (braceIdx === -1) break;
    const selectorRaw = css.slice(i, braceIdx).trim();
    let depth = 1;
    let j = braceIdx + 1;
    while (j < n && depth > 0) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    const body = css.slice(braceIdx + 1, j - 1);
    const startLine = lineAt(css, braceIdx);

    if (/^@(media|supports|keyframes|font-face|-webkit-keyframes|layer|container)/i.test(selectorRaw)) {
      if (/^@(media|supports|layer|container)/i.test(selectorRaw)) {
        for (const r of parseRules(body)) {
          rules.push({ ...r, atRule: selectorRaw, startLine: startLine + r.startLine - 1 });
        }
      } else {
        rules.push({
          selector: selectorRaw, body, declarations: [], startLine,
          atRule: null, isKeyframesOrFont: true,
        });
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
      declarations.push({
        prop: decl.slice(0, colonIdx).trim().toLowerCase(),
        value: decl.slice(colonIdx + 1).trim(),
      });
    }
    rules.push({ selector: selectorRaw, body, declarations, startLine, atRule: null });
    i = j;
  }
  return rules;
}

/**
 * Read every stylesheet into one rule list, each rule tagged with its origin.
 *
 * Accepts either a list of file paths, or a list of {file, text, inline}
 * sources. The second form exists because a great many AI-built pages put the
 * whole stylesheet in a <style> block — an earlier version of this reader only
 * looked at .css files and therefore skipped the design and responsive families
 * entirely on exactly the kind of site this repo is aimed at. It reported that
 * as "skipped", not "passed", which is the only reason it was caught.
 */
export function loadStylesheets(sources) {
  let allRules = [];
  let allText = '';
  for (const src of sources || []) {
    const isPath = typeof src === 'string';
    const file = isPath ? src : src.file;
    const text = isPath ? read(src) : src.text;
    const lineOffset = isPath ? 0 : (src.lineOffset || 0);
    allText += `\n/* --- ${file} --- */\n${text}`;
    const rules = parseRules(text);
    for (const r of rules) {
      r.file = file;
      r.inline = !isPath && !!src.inline;
      r.startLine += lineOffset;
    }
    allRules = allRules.concat(rules);
  }
  return { rules: allRules, text: allText };
}

// ------------------------------------------------------------ custom props

/** Custom properties declared on :root / [data-theme=…] / html. Last writer wins. */
export function collectTokens(rules) {
  const tokens = {};
  const tokenRules = rules.filter(
    (r) => !r.isKeyframesOrFont && /(^|,)\s*(:root|html\b|\[data-theme)/i.test(r.selector)
  );
  for (const r of tokenRules) {
    for (const d of r.declarations) {
      if (d.prop.startsWith('--')) tokens[d.prop] = d.value;
    }
  }
  return tokens;
}

/** Expand var(--x, fallback) against a token map, guarding against cycles. */
export function resolveVar(value, tokens, seen = new Set()) {
  return String(value).replace(/var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/g, (m, name, fallback) => {
    if (seen.has(name)) return m;
    if (tokens[name] !== undefined) {
      const next = new Set(seen);
      next.add(name);
      return resolveVar(tokens[name], tokens, next);
    }
    return fallback ? fallback.trim() : m;
  });
}

// --------------------------------------------------------------- colour

export function parseColor(raw) {
  const v = String(raw).trim();
  let m;
  if ((m = /^#([0-9a-f]{3})$/i.exec(v))) {
    return m[1].split('').map((c) => parseInt(c + c, 16));
  }
  if ((m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(v))) {
    const hex = m[1];
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }
  if ((m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i.exec(v))) {
    return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])];
  }
  if ((m = /^hsla?\(\s*([-\d.]+)(?:deg)?[,\s]+([\d.]+)%[,\s]+([\d.]+)%/i.exec(v))) {
    return hslToRgb(parseFloat(m[1]), parseFloat(m[2]) / 100, parseFloat(m[3]) / 100);
  }
  if ((m = /^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([-\d.]+)/i.exec(v))) {
    return oklchToRgb(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }
  return null;
}

export function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

/** Approximate OKLCH -> sRGB. Adequate for a contrast pre-check, not colorimetry. */
export function oklchToRgb(L, C, H) {
  if (L > 1) L = L / 100;
  const hRad = (H * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  const toSrgb = (c) => {
    c = Math.max(0, Math.min(1, c));
    return (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055) * 255;
  };
  return [toSrgb(r), toSrgb(g), toSrgb(bl)];
}

export function relLuminance([r, g, b]) {
  const chan = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
}

export function contrastRatio(c1, c2) {
  const L1 = relLuminance(c1);
  const L2 = relLuminance(c2);
  const [lighter, darker] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (lighter + 0.05) / (darker + 0.05);
}

export function resolveColor(rawValue, tokens) {
  return parseColor(resolveVar(rawValue, tokens));
}

/**
 * True when a colour is translucent enough that its rendered appearance depends
 * on whatever sits behind it — which static analysis cannot know. Callers must
 * SKIP such values rather than assume opacity; assuming it once produced a
 * confident 1.00:1 "failure" for a perfectly fine translucent hover tint.
 */
export function hasSignificantAlpha(rawValue, tokens) {
  const resolved = resolveVar(rawValue, tokens);
  let m = /rgba\([^)]*[,\s]([\d.]+)\s*\)/i.exec(resolved);
  if (m) return parseFloat(m[1]) < 0.9;
  m = /hsla\([^)]*[,\s]([\d.]+)\s*\)/i.exec(resolved);
  if (m) return parseFloat(m[1]) < 0.9;
  m = /^#[0-9a-f]{6}([0-9a-f]{2})$/i.exec(resolved.trim());
  if (m) return parseInt(m[1], 16) / 255 < 0.9;
  if (/\/\s*0?\.\d+\s*\)/.test(resolved)) return true; // modern rgb(0 0 0 / .5) syntax
  return false;
}
