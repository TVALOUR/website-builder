// website-builder — a small HTML reader for static analysis.
//
// Regex over markup, deliberately. A real parser would be a dependency, and the
// whole point of this repo is that a fresh clone runs with nothing installed.
// The tradeoff is stated honestly: this reads WELL-FORMED markup the way a
// linter does. It will misread markup inside a <script> template literal or a
// deeply exotic attribute. Every rule built on it is written so that a misread
// downgrades to a WARN rather than blocking a build.

import { lineAt } from './fs.mjs';

const SCRIPT_STYLE = /<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const COMMENTS = /<!--[\s\S]*?-->/g;
const TAGS = /<[^>]+>/g;

const ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'",
  '&apos;': "'", '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–',
  '&hellip;': '…', '&rsquo;': '’', '&lsquo;': '‘',
  '&ldquo;': '“', '&rdquo;': '”', '&pound;': '£',
  '&copy;': '©', '&times;': '×', '&middot;': '·',
};

export function decodeEntities(s) {
  return s
    .replace(/&[a-z]+;|&#\d+;|&#x[0-9a-f]+;/gi, (m) => {
      const lower = m.toLowerCase();
      if (ENTITIES[lower]) return ENTITIES[lower];
      let cp = null;
      let n;
      if ((n = /^&#(\d+);$/.exec(m))) cp = parseInt(n[1], 10);
      else if ((n = /^&#x([0-9a-f]+);$/i.exec(m))) cp = parseInt(n[1], 16);
      return cp !== null ? String.fromCodePoint(cp) : m;
    });
}

/**
 * The text a visitor actually reads. Script, style and comments are removed
 * BEFORE tags, so a CSS content string or a JS string never counts as prose —
 * this is what stops a checker reporting an em dash that lives in a comment.
 * Entities are decoded, so `&mdash;` and a literal em dash are the same finding.
 */
export function visibleText(html) {
  return decodeEntities(
    html.replace(SCRIPT_STYLE, ' ').replace(COMMENTS, ' ').replace(TAGS, ' ')
  );
}

/**
 * Same as visibleText but preserves character offsets, so a finding can carry a
 * real line number. Removed regions are replaced with spaces of equal length.
 */
export function visibleTextPositional(html) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  return html.replace(SCRIPT_STYLE, blank).replace(COMMENTS, blank).replace(TAGS, blank);
}

/** All occurrences of an element as raw tag strings, with offsets. */
export function tags(html, name) {
  const re = new RegExp(`<${name}\\b[^>]*>`, 'gi');
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ raw: m[0], index: m.index, line: lineAt(html, m.index) });
  }
  return out;
}

/** Read one attribute off a raw tag string. Returns null when absent. */
export function attr(rawTag, name) {
  const m = new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i').exec(rawTag);
  if (!m) return null;
  return decodeEntities(m[2] ?? m[3] ?? m[4] ?? '');
}

/** True when a boolean attribute is present at all (e.g. `disabled`, `async`). */
export function hasAttr(rawTag, name) {
  return new RegExp(`\\b${name}\\b`, 'i').test(rawTag);
}

/** Contents of the first <head>…</head>, or the whole document if unmarked. */
export function head(html) {
  const m = /<head\b[^>]*>([\s\S]*?)<\/head\s*>/i.exec(html);
  return m ? m[1] : html.slice(0, 4000);
}

/** Contents of <body>, or everything after </head>. */
export function body(html) {
  const m = /<body\b[^>]*>([\s\S]*?)<\/body\s*>/i.exec(html);
  if (m) return m[1];
  const h = /<\/head\s*>/i.exec(html);
  return h ? html.slice(h.index + h[0].length) : html;
}

/** <meta name="x"> or <meta property="x"> value, or null. */
export function meta(html, key) {
  for (const t of tags(head(html), 'meta')) {
    const n = (attr(t.raw, 'name') || attr(t.raw, 'property') || '').toLowerCase();
    if (n === key.toLowerCase()) return attr(t.raw, 'content') ?? '';
  }
  return null;
}

/** <link rel="x"> href, or null. rel is matched token-wise ("icon shortcut"). */
export function linkRel(html, rel) {
  for (const t of tags(html, 'link')) {
    const r = (attr(t.raw, 'rel') || '').toLowerCase().split(/\s+/);
    if (r.includes(rel.toLowerCase())) return attr(t.raw, 'href') ?? '';
  }
  return null;
}

export function title(html) {
  const m = /<title\b[^>]*>([\s\S]*?)<\/title\s*>/i.exec(html);
  return m ? decodeEntities(m[1]).trim() : null;
}

/** Every JSON-LD block, parsed. Unparseable blocks come back as {__invalid}. */
export function jsonLd(html) {
  const out = [];
  const re = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script\s*>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1].trim());
      out.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch (e) {
      out.push({ __invalid: true, __error: String(e.message), __line: lineAt(html, m.index) });
    }
  }
  return out;
}

/**
 * Every @type anywhere in a JSON-LD graph, at any nesting depth.
 *
 * Recurses into ALL object values, not just @graph. An earlier version stopped
 * at @graph and arrays, which meant an AggregateRating sitting under the
 * `aggregateRating` property — where it always sits — was invisible. The gate
 * that depends on this reported nothing and looked like it had checked.
 */
export function ldTypes(blocks) {
  const types = new Set();
  const seen = new Set();
  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (seen.has(node)) return; // cycles are legal in JSON-LD via @id refs
    seen.add(node);
    if (Array.isArray(node)) return node.forEach(visit);
    const t = node['@type'];
    if (typeof t === 'string') types.add(t);
    else if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && types.add(x));
    for (const [k, v] of Object.entries(node)) {
      if (k === '@type') continue;
      if (v && typeof v === 'object') visit(v);
    }
  };
  blocks.forEach(visit);
  return types;
}

/** Collect every object in a JSON-LD graph whose @type matches, at any depth. */
export function ldNodes(blocks, typeName) {
  const out = [];
  const seen = new Set();
  const visit = (node) => {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (Array.isArray(node)) return node.forEach(visit);
    const t = node['@type'];
    const list = typeof t === 'string' ? [t] : Array.isArray(t) ? t : [];
    if (list.some((x) => String(x).toLowerCase().includes(typeName.toLowerCase()))) out.push(node);
    for (const [k, v] of Object.entries(node)) {
      if (k === '@type') continue;
      if (v && typeof v === 'object') visit(v);
    }
  };
  blocks.forEach(visit);
  return out;
}

/**
 * Every href/src reference in the document, with its element and line.
 *
 * Comments are blanked (not removed) before scanning, so line numbers survive
 * and commented-out markup is not treated as shipped. Learned from a real false
 * positive: a documentation comment containing `data-src="…"` was reported as
 * twenty missing assets across a nine-page site. Anything a browser ignores,
 * this must ignore.
 */
export function references(html) {
  const src = html.replace(COMMENTS, (m) => m.replace(/[^\n]/g, ' '));
  const out = [];
  const re = /<(a|link|script|img|source|iframe|video|audio|form|use)\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(src)) !== null) {
    const el = m[1].toLowerCase();
    const raw = m[0];
    const line = lineAt(src, m.index);
    for (const a of ['href', 'src', 'action', 'srcset', 'data-src']) {
      const v = attr(raw, a);
      if (v !== null && v !== '') out.push({ el, attrName: a, value: v, raw, line });
    }
  }
  return out;
}
