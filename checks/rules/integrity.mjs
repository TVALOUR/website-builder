// website-builder — integrity gates: is the thing actually wired up?
//
// This family exists for one defect above all others: a contact form that
// looks perfect and does nothing when submitted. A brochure site has exactly
// one job — get the enquiry to the owner — and an AI build can satisfy every
// design rule while quietly dropping every enquiry on the floor. Nobody finds
// out for a month, and what they lose is not a bug report, it is the work.
//
// Everything here is resolvable from static files. If a check needs a running
// browser it belongs in the judgment checklist, not this file.
//
// RULE PROVENANCE
//   source:  TAXONOMY.md (18-angle research wave, 2026-08-18, adversarially verified)
//   dated:   2026-08-18
//   review:  2027-02-18 — six months. Signals decay: a tell that identified a
//            generator in 2023 can be a mainstream choice by 2026. At review,
//            ask of every rule here "is this still true?" and RETIRE the ones
//            that are not. Removing a rule is a normal outcome, not a failure;
//            TAXONOMY.md has a section for it.

import { read, displayPath, exists, lineAt } from '../lib/fs.mjs';
import { references, tags, attr, hasAttr, body, visibleTextPositional, decodeEntities } from '../lib/html.mjs';
import { BLOCKER, MAJOR, MINOR } from '../lib/report.mjs';
import { join, dirname, resolve, relative, sep } from 'node:path';

export const gates = [
  { id: 'integrity/form-dead', severity: 'blocker', what: 'a form with no action and no JS handler — enquiries vanish' },
  { id: 'integrity/broken-internal-link', severity: 'blocker', what: 'a link to a page that is not in the build' },
  { id: 'integrity/missing-asset', severity: 'blocker', what: 'an img/script/stylesheet reference with no file behind it' },
  { id: 'integrity/broken-anchor', severity: 'major', what: 'a #fragment link with no matching id on the page' },
  { id: 'integrity/duplicate-id', severity: 'major', what: 'the same id used twice in one document' },
  { id: 'integrity/hallucinated-cdn', severity: 'major', what: 'a third-party script URL that looks invented or unpinned' },
  { id: 'integrity/empty-href', severity: 'major', what: 'href="#" or href="" as a real navigation target' },
  { id: 'integrity/no-404', severity: 'major', what: 'no 404 page' },
  { id: 'integrity/mixed-content', severity: 'blocker', what: 'an http:// subresource on an https site' },
  { id: 'integrity/case-sensitive-path', severity: 'major', what: 'a reference whose case does not match the file on disk' },
  { id: 'integrity/contact-route', severity: 'blocker', what: 'no way at all for a visitor to make contact' },
  { id: 'integrity/unclosed-tag', severity: 'major', what: 'obviously unbalanced block markup' },
  { id: 'integrity/tel-link', severity: 'blocker', what: 'a phone number printed as plain text, so tapping it on a phone does nothing' },
  { id: 'integrity/dead-social', severity: 'major', what: 'a social link that goes to the platform homepage, not a profile' },
];

// UK phone shapes as they are actually written on small-business sites. Loose
// match, then validated by digit count, for the same reason the facts extractor
// is: an enumerated-format regex silently matched none of them on a real site.


const EXTERNAL = /^(https?:)?\/\/|^(mailto|tel|sms|whatsapp|geo|data|javascript):/i;

/**
 * Resolve an href/src to a path on disk, the way a static host would.
 *
 * The percent-decode is load-bearing and was learned the hard way: without it
 * this gate reported seven BLOCKERs on a live site for `assets/Web%20pix/…`,
 * a file that was sitting right there under a name with a space in it. A false
 * blocker is the most expensive kind of finding — it is how a team learns to
 * pass `--skip` to the checker. Decode first, then look.
 */
function resolveRef(value, fromFile, siteDir) {
  let clean = value.split('#')[0].split('?')[0];
  if (!clean) return null;
  try { clean = decodeURIComponent(clean); } catch { /* malformed escape: use as-is */ }
  let p;
  if (clean.startsWith('/')) p = join(siteDir, clean);
  else p = resolve(dirname(fromFile), clean);
  const candidates = [p];
  if (!/\.\w{2,5}$/.test(clean)) {
    candidates.push(p + '.html', join(p, 'index.html'), join(p, 'index.htm'));
  }
  if (clean.endsWith('/')) candidates.push(join(p, 'index.html'));
  return candidates;
}

export async function run(ctx, report) {
  const { siteDir, htmlFiles, jsFiles, everyFile } = ctx;
  for (const id of gates.map((g) => g.id)) report.ranGate(id);

  const jsText = jsFiles.map(read).join('\n');
  const onDisk = new Set(everyFile.map((f) => relative(siteDir, f).split(sep).join('/')));
  const onDiskLower = new Map();
  for (const f of onDisk) onDiskLower.set(f.toLowerCase(), f);

  let anyContactRoute = false;

  for (const file of htmlFiles) {
    const raw = read(file);
    const shown = displayPath(file, siteDir);
    const inlineJs = (raw.match(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi) || []).join('\n');
    const pageJs = inlineJs + '\n' + jsText;

    // -------------------------------------------------- forms
    for (const f of tags(raw, 'form')) {
      const action = attr(f.raw, 'action');
      const id = attr(f.raw, 'id');
      const cls = attr(f.raw, 'class') || '';
      const referenced = (id && new RegExp(`['"#]${id}\\b`).test(pageJs))
        || /addEventListener\s*\(\s*['"]submit|onsubmit|\bnew\s+FormData\b|\bfetch\s*\(/i.test(pageJs)
        || (cls && cls.split(/\s+/).some((c) => c && new RegExp(`['".]${c}\\b`).test(pageJs)));

      if ((!action || action.trim() === '' || action.trim() === '#') && !referenced) {
        report.add('integrity/form-dead', BLOCKER,
          'form has no action and nothing in the JS handles its submit',
          { file: shown, line: f.line },
          'Every enquiry submitted here is silently discarded. Point action= at a form service (Formspree, Web3Forms, Netlify Forms, a Cloudflare Function), or remove the form and give a phone number. Then SEND ONE TEST and confirm it arrives.');
      } else if (action && /^https?:\/\//i.test(action)) {
        let host = null;
        try { host = new URL(action).hostname; } catch { /* malformed */ }
        if (!host) {
          report.add('integrity/form-dead', BLOCKER,
            `form action "${action.slice(0, 40)}" is not a valid URL`,
            { file: shown, line: f.line },
            'The browser cannot post this anywhere; every enquiry is discarded. Point action= at a real form-service URL and send one test.');
        } else {
          report.add('integrity/form-dead', MINOR,
            `form posts to ${host} — confirm a real submission arrives`,
            { file: shown, line: f.line },
            'A configured endpoint is not a delivering endpoint. Submit the form once for real before launch; a wrong key fails silently on most of these services.');
        }
      }
      anyContactRoute = true;
    }

    // -------------------------------------------------- references
    const refs = references(raw);
    for (const r of refs) {
      const v = r.value.trim();
      if (v === '') {
        report.add('integrity/empty-href', MAJOR, `<${r.el}> with an empty ${r.attrName}`,
          { file: shown, line: r.line }, 'Give it a destination or make it a <button>.');
        continue;
      }
      if (/^(mailto|tel|sms|whatsapp):/i.test(v)) { anyContactRoute = true; continue; }
      if (v === '#') {
        if (r.el === 'a') {
          report.add('integrity/empty-href', MAJOR, 'href="#" used as a link',
            { file: shown, line: r.line },
            'If it triggers JS it should be a <button>. If it is a real destination, give it one. href="#" jumps to the top of the page and confuses screen readers.');
        }
        continue;
      }
      if (/^https?:\/\//i.test(v)) {
        if (r.attrName !== 'href' || r.el !== 'a') {
          if (/^http:\/\//i.test(v)) {
            report.add('integrity/mixed-content', BLOCKER, `insecure subresource: ${v.slice(0, 70)}`,
              { file: shown, line: r.line },
              'Browsers block http:// subresources on an https page. The asset will simply not load in production.');
          }
        }
        continue;
      }
      if (EXTERNAL.test(v)) continue;

      // fragment-only link
      if (v.startsWith('#')) {
        const frag = v.slice(1);
        if (frag && !new RegExp(`\\bid\\s*=\\s*["']${frag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(raw)
            && !new RegExp(`\\bname\\s*=\\s*["']${frag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'i').test(raw)) {
          report.add('integrity/broken-anchor', MAJOR, `#${frag} — nothing on this page has that id`,
            { file: shown, line: r.line }, 'The link does nothing when clicked.');
        }
        continue;
      }

      if (r.attrName === 'srcset') continue; // handled loosely; multi-value

      const candidates = resolveRef(v, file, siteDir);
      if (!candidates) continue;
      const hit = candidates.find((c) => exists(c));
      if (!hit) {
        const isPage = r.el === 'a';
        report.add(
          isPage ? 'integrity/broken-internal-link' : 'integrity/missing-asset',
          BLOCKER,
          `${isPage ? 'links to' : 'references'} "${v}" — no such file in the build`,
          { file: shown, line: r.line },
          isPage
            ? 'Either the page was never built or the path is wrong. A visitor gets a 404.'
            : 'The asset is missing, so the page renders without it. This is the "it looked fine in the chat" failure.');
      } else {
        // Case mismatch: works on Windows, 404s on the Linux host it deploys to.
        const relHit = relative(siteDir, hit).split(sep).join('/');
        const exact = onDisk.has(relHit);
        const insensitive = onDiskLower.get(relHit.toLowerCase());
        if (!exact && insensitive && insensitive !== relHit) {
          report.add('integrity/case-sensitive-path', MAJOR,
            `"${v}" resolves only because this machine ignores case — on disk it is "${insensitive}"`,
            { file: shown, line: r.line },
            'Static hosts are case-sensitive. This works on your laptop and 404s the moment it deploys.');
        }
      }
    }

    // -------------------------------------------------- duplicate ids
    const ids = {};
    const idRe = /\sid\s*=\s*["']([^"']+)["']/gi;
    let m;
    while ((m = idRe.exec(raw)) !== null) {
      (ids[m[1]] = ids[m[1]] || []).push(lineAt(raw, m.index));
    }
    for (const [id, lines] of Object.entries(ids)) {
      if (lines.length > 1) {
        report.add('integrity/duplicate-id', MAJOR, `id="${id}" appears ${lines.length} times`,
          { file: shown, line: lines[0], count: lines.length },
          'Invalid HTML. Fragment links, labels and JS lookups all bind to the first one and silently ignore the rest.');
      }
    }

    // -------------------------------------------------- unclosed block markup
    for (const tag of ['div', 'section', 'main', 'header', 'footer', 'nav', 'ul', 'article']) {
      const open = (raw.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
      const close = (raw.match(new RegExp(`</${tag}\\s*>`, 'gi')) || []).length;
      if (open !== close) {
        report.add('integrity/unclosed-tag', MAJOR,
          `<${tag}> opened ${open}× but closed ${close}×`,
          { file: shown },
          'Unbalanced markup. Browsers guess, and they guess differently — this is a class of layout bug that only shows on one device.');
      }
    }

    // -------------------------------------------------- contact routes
    //
    // THE MOST DEMONSTRABLE DEFECT THERE IS, and the one this whole family is
    // really for. A local business site exists to produce a phone call. The
    // visitor is on a phone. The number is printed as plain text. They tap it
    // and nothing happens. It looks perfect in every screenshot, it passes
    // every design review, and it fails at the only moment that matters —
    // and nobody testing on a desktop will ever notice.
    const visible = decodeEntities(visibleTextPositional(raw));
    const telHrefs = references(raw)
      .filter((r) => /^tel:/i.test(r.value))
      .map((r) => r.value.replace(/[^\d+]/g, '').replace(/^\+?44/, '0'));

    // Numbers that ARE the label of some tel: link, even a mismatched one.
    // Those are owned by facts/href-mismatch, which describes the defect far
    // more precisely ("reads X but dials Y"). Reporting both just doubles the
    // line count for one underlying problem.
    const linkedLabels = new Set(
      [...raw.matchAll(/<a\b[^>]*href\s*=\s*["']tel:[^"']+["'][^>]*>([\s\S]*?)<\/a>/gi)]
        .map((m) => decodeEntities(m[1].replace(/<[^>]+>/g, ' ')))
        .map((t) => t.replace(/[^\d+]/g, '').replace(/^\+?44/, '0'))
        .filter((d) => /^0\d{9,10}$/.test(d))
    );

    const phoneRe = /(?:\+44|0)[\d\s()-]{8,16}\d/g;
    let pm;
    const untappable = [];
    while ((pm = phoneRe.exec(visible)) !== null) {
      const norm = pm[0].replace(/[\s()-]/g, '').replace(/^\+?44/, '0');
      if (!/^0\d{9,10}$/.test(norm)) continue;
      anyContactRoute = true;
      if (!telHrefs.includes(norm) && !linkedLabels.has(norm)) {
        untappable.push({ text: pm[0].trim(), line: lineAt(visible, pm.index) });
      }
    }
    if (untappable.length) {
      // Severity splits by what the number is FOR. On a services or contact
      // page it is the conversion path and an untappable one is a lost job. In
      // a privacy notice it is usually a citation — the ICO helpline, a
      // regulator — where tapping is a nicety rather than the point. Blocking
      // on a cited regulator number would be the gate overreaching, and a gate
      // that overreaches gets skipped.
      const isReference = /privacy|cookie|terms|accessib/i.test(shown);
      report.add('integrity/tel-link', isReference ? MINOR : BLOCKER,
        `phone number "${untappable[0].text}" is plain text, not a tel: link`,
        { file: shown, line: untappable[0].line, count: untappable.length },
        isReference
          ? 'A cited number on a legal page, so not a conversion path — but it costs one line to make it tappable.'
          : `Wrap it: <a href="tel:+44${untappable[0].text.replace(/[^\d]/g, '').replace(/^0/, '')}">${untappable[0].text}</a>. Most visitors to a local business site arrive on a phone, and the tap IS the conversion.`);
    }
  }

  // -------------------------------------------------- CDN hygiene
  const allText = [...htmlFiles, ...jsFiles].map(read).join('\n');
  const cdnRe = /https?:\/\/(cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com|cdn\.skypack\.dev|esm\.sh)\/[^\s"'<>]+/gi;
  const seenCdn = new Set();
  let c;
  while ((c = cdnRe.exec(allText)) !== null) {
    const url = c[0];
    if (seenCdn.has(url)) continue;
    seenCdn.add(url);
    if (/@latest|\/latest\//i.test(url)) {
      report.add('integrity/hallucinated-cdn', MAJOR, `unpinned CDN dependency: ${url.slice(0, 80)}`,
        {}, 'Pin the version. "@latest" means the site can break on a day nobody touched it.');
    }
  }
  for (const t of tags(allText, 'script')) {
    const src = attr(t.raw, 'src') || '';
    if (/^https?:\/\//i.test(src) && !hasAttr(t.raw, 'integrity')) {
      report.add('integrity/hallucinated-cdn', MINOR,
        `third-party script with no integrity hash: ${src.slice(0, 70)}`,
        {}, 'Add an SRI hash, or self-host it. The polyfill.io incident (June 2024) turned a trusted CDN into malware delivery for ~100k sites overnight.');
      break;
    }
  }

  // ------------------------------------------ dead social links
  // A footer Instagram icon pointing at instagram.com itself. One of the
  // field-survey tells (r/VibeCodeDevs, 2026-08-18; review 2027-02-18):
  // the icons were decoration and nobody ever had a profile to link.
  for (const file of htmlFiles) {
    const raw = read(file);
    const dead = [...raw.matchAll(/<a\b[^>]*href\s*=\s*["']https?:\/\/(?:www\.)?(facebook\.com|instagram\.com|twitter\.com|x\.com|linkedin\.com|tiktok\.com|youtube\.com|threads\.net)\/?(?:[?#][^"']*)?["']/gi)];
    if (dead.length) {
      report.add('integrity/dead-social', MAJOR,
        `${dead.length} social link${dead.length === 1 ? '' : 's'} to a platform homepage, not a profile (${dead[0][1]})`,
        { file: displayPath(file, siteDir), line: lineAt(raw, dead[0].index) },
        'A social icon that opens the platform\'s own homepage tells the visitor "we do not actually have one". Link the real profile, or remove the icon — an absent icon is honest, a dead one is noticed.');
    }
  }

  // -------------------------------------------------- 404
  const has404 = everyFile.some((f) => /(^|[\\/])(404|not-found)\.html?$/i.test(f));
  if (!has404) {
    report.add('integrity/no-404', MAJOR, 'no 404.html in the build', {},
      'Every static host serves 404.html on a bad URL. Without one, a mistyped link shows the host\'s default page — a stranger\'s branding on the client\'s domain.');
  }

  if (!anyContactRoute) {
    report.add('integrity/contact-route', BLOCKER,
      'no form, no tel: link, no mailto: and no phone number anywhere on the site', {},
      'The site cannot produce an enquiry. Whatever else it does well, it does not do the job it was bought for.');
  }
}

export default { gates, run };
