// website-builder — discoverability gates.
//
// Measured motivation: across 45 pages shipped by the predecessor system,
// Open Graph appeared on 9, canonical on 17, structured data on 10, and no site
// had a favicon set or a web manifest. For a LOCAL business that is not a
// nice-to-have — the way these sites actually get shared is one person sending
// another the link on WhatsApp, and with no OG tags that arrives as a naked URL.
//
// Scope discipline: this family checks what is verifiably ON THE PAGE. It makes
// no ranking predictions, and it deliberately does NOT check the folklore items
// (meta keywords, keyword density, "freshness") that have no current evidence
// behind them for a static brochure site.
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
import { head, meta, linkRel, tags, attr, jsonLd, ldTypes, ldNodes, visibleText } from '../lib/html.mjs';
import { BLOCKER, MAJOR, MINOR, plural, verb } from '../lib/report.mjs';
import { join, relative, sep } from 'node:path';

export const gates = [
  { id: 'seo/viewport', severity: 'blocker', what: 'the viewport meta tag — without it the site renders desktop-wide on a phone' },
  { id: 'seo/charset', severity: 'blocker', what: 'a charset declaration, so £ and accented names are not mojibake' },
  { id: 'seo/html-lang', severity: 'major', what: 'the lang attribute, which screen readers use to pick a voice' },
  { id: 'seo/open-graph', severity: 'major', what: 'og:title / og:description / og:image so a shared link renders' },
  { id: 'seo/og-image-exists', severity: 'major', what: 'the og:image actually resolves' },
  { id: 'seo/canonical', severity: 'minor', what: 'a canonical URL per page' },
  { id: 'seo/structured-data', severity: 'major', what: 'a LocalBusiness/Organization graph a search engine can read' },
  { id: 'seo/structured-data-valid', severity: 'major', what: 'JSON-LD that actually parses' },
  { id: 'seo/robots-txt', severity: 'major', what: 'robots.txt' },
  { id: 'seo/sitemap-xml', severity: 'major', what: 'sitemap.xml, and every URL in it real' },
  { id: 'seo/favicon', severity: 'major', what: 'a favicon' },
  { id: 'seo/h1', severity: 'major', what: 'exactly one h1 per page' },
  { id: 'seo/heading-order', severity: 'minor', what: 'heading levels that do not skip' },
  { id: 'seo/noindex-shipped', severity: 'blocker', what: 'a noindex left on a page that is meant to be found' },
  { id: 'seo/placeholder-domain', severity: 'blocker', what: 'yourdomain.com / localhost left in a canonical, sitemap or OG url' },
  { id: 'seo/review-schema', severity: 'major', what: 'Review or AggregateRating in the business own-domain JSON-LD, which is always ineligible' },
  { id: 'seo/charset-early', severity: 'major', what: 'charset declared too late in the head' },
];

const PLACEHOLDER_DOMAIN = /(yourdomain|your-domain|example|mysite|localhost|127\.0\.0\.1|sitename)\.(com|co\.uk|org|net|dev)?|https?:\/\/localhost/i;

export async function run(ctx, report) {
  const { siteDir, htmlFiles, everyFile, profile } = ctx;
  for (const id of gates.map((g) => g.id)) report.ranGate(id);

  let anyStructuredData = false;
  let ogPages = 0;
  // Aggregated across pages: one shared <head> template producing nine identical
  // findings trains people to scroll past the report instead of reading it.
  const ogMissing = [];
  const canonMissing = [];

  for (const file of htmlFiles) {
    const raw = read(file);
    const shown = displayPath(file, siteDir);
    const h = head(raw);
    const isLegal = /privacy|cookie|terms|accessib/i.test(shown);

    // ---------------------------------------------------------- head basics
    if (!/name\s*=\s*["']viewport["']/i.test(h)) {
      report.add('seo/viewport', BLOCKER, 'no viewport meta tag', { file: shown },
        'Add <meta name="viewport" content="width=device-width, initial-scale=1">. Without it every phone renders the page at 980px and zooms out — the site is unusable on the device most local searches happen on.');
    }
    // Charset must land inside the first 1024 bytes or the browser may have
    // already begun decoding with the wrong encoding — which is where the
    // classic 'Â£' and 'cafÃ©' on a price list comes from.
    const charsetIdx = raw.search(/<meta[^>]*charset\s*=/i);
    if (charsetIdx > 1024) {
      report.add('seo/charset-early', MAJOR,
        `charset is declared ${charsetIdx} bytes into the document`,
        { file: shown },
        'Move <meta charset="utf-8"> to the first line inside <head>. Past ~1024 bytes the browser may already be decoding with the wrong encoding, and the visible symptom is a mangled price list.');
    }
    if (!/charset\s*=/i.test(h)) {
      report.add('seo/charset', BLOCKER, 'no charset declaration', { file: shown },
        'Add <meta charset="utf-8"> as the first thing in <head>. Without it £ and any accented name render as mojibake on some servers.');
    }
    if (!/<html[^>]*\blang\s*=/i.test(raw)) {
      report.add('seo/html-lang', MAJOR, 'no lang attribute on <html>', { file: shown },
        `Add lang="${profile?.copy?.language || 'en-GB'}". A screen reader with no lang reads English copy in whatever voice it defaulted to.`);
    }

    // ---------------------------------------------------------- noindex
    // Deliberately NOT a blocker on a legal page: noindexing privacy/cookies/
    // terms is a normal, considered choice, and blocking on it would teach
    // people to distrust the gate. On a page meant to be found it is a
    // launch-killer, because nothing about the site looks wrong.
    const robotsMeta = meta(raw, 'robots') || '';
    if (/noindex/i.test(robotsMeta)) {
      if (isLegal) {
        report.add('seo/noindex-shipped', MINOR, 'legal page is noindexed (normal, flagged so it is a decision not an accident)',
          { file: shown }, 'No action needed if this was deliberate.');
      } else {
        report.add('seo/noindex-shipped', BLOCKER, 'page carries a noindex directive', { file: shown },
          'This page will never appear in search. Almost always a staging leftover nobody notices for months, because the site itself looks perfect.');
      }
    }

    // ---------------------------------------------------------- open graph
    const ogTitle = meta(raw, 'og:title');
    const ogDesc = meta(raw, 'og:description');
    const ogImage = meta(raw, 'og:image');
    if (ogTitle && ogDesc && ogImage) ogPages++;
    if (!isLegal && (!ogTitle || !ogDesc || !ogImage)) {
      const missing = [!ogTitle && 'og:title', !ogDesc && 'og:description', !ogImage && 'og:image'].filter(Boolean);
      ogMissing.push({ file: shown, missing: missing.join(', ') });
    }
    if (ogImage && !/^https?:\/\//i.test(ogImage)) {
      const p = ogImage.startsWith('/') ? join(siteDir, ogImage) : join(siteDir, ogImage);
      if (!exists(p)) {
        report.add('seo/og-image-exists', MAJOR, `og:image "${ogImage}" does not resolve`, { file: shown },
          'Also: og:image should be an ABSOLUTE url. Most scrapers will not resolve a relative one.');
      } else {
        report.add('seo/og-image-exists', MINOR, 'og:image is a relative URL', { file: shown },
          'Use the full https://… address. Facebook and WhatsApp do not resolve relative og:image paths.');
      }
    }

    // ---------------------------------------------------------- canonical
    const canon = linkRel(raw, 'canonical');
    if (!canon && !isLegal) canonMissing.push(shown);

    // ---------------------------------------------------------- placeholder domain
    for (const [where, value] of [['canonical', canon], ['og:image', ogImage], ['og:url', meta(raw, 'og:url')]]) {
      if (value && PLACEHOLDER_DOMAIN.test(value)) {
        report.add('seo/placeholder-domain', BLOCKER,
          `${where} still points at a placeholder domain: ${value.slice(0, 60)}`,
          { file: shown },
          'This ships the developer\'s scaffolding to production. Replace with the real domain everywhere, including sitemap.xml.');
      }
    }

    // ---------------------------------------------------------- structured data
    const blocks = jsonLd(raw);
    for (const b of blocks) {
      if (b.__invalid) {
        report.add('seo/structured-data-valid', MAJOR, `JSON-LD does not parse: ${b.__error.slice(0, 60)}`,
          { file: shown, line: b.__line },
          'Invalid structured data is ignored entirely — the effort is spent and the benefit is zero. Paste it into Google\'s Rich Results Test.');
      }
    }
    const good = blocks.filter((b) => !b.__invalid);
    const types = ldTypes(good);
    // Presence is not the gate. A LocalBusiness node missing the fields a
    // customer actually wants — where, when, what number — is machine-readable
    // nothing, and 'has JSON-LD' would have called it done.
    for (const node of ldNodes(good, 'LocalBusiness')) {
      anyStructuredData = true;
      const missing = ['name', 'address', 'telephone', 'url']
        .filter((k) => !node[k])
        .concat(node.openingHoursSpecification || node.openingHours ? [] : ['openingHours']);
      if (missing.length) {
        report.add('seo/structured-data', MAJOR,
          `LocalBusiness graph is missing ${missing.join(', ')}`,
          { file: shown },
          'These are the fields that feed Maps, the knowledge panel and AI answers. A graph without them is markup that says nothing.');
      }
    }
    // An Organization that is not a LocalBusiness owes only identity fields.
    // Demanding openingHours from a software company's schema was a measured
    // false positive, and false positives are how a gate gets ignored.
    for (const node of ldNodes(good, 'Organization')) {
      if (String(node['@type']).toLowerCase().includes('localbusiness')) continue;
      anyStructuredData = true;
      const missing = ['name', 'url'].filter((k) => !node[k]);
      if (missing.length) {
        report.add('seo/structured-data', MAJOR,
          `Organization graph is missing ${missing.join(', ')}`,
          { file: shown },
          'name and url are the minimum that makes an Organization node say anything. Add logo and sameAs where they exist.');
      }
    }

    // A FLAT RULE, and it is flat on purpose. Google explicitly names reviews
    // collected or displayed on the entity's own site — including via an
    // embedded third-party widget — as self-serving and ineligible for review
    // rich results. There is no configuration that makes this work, so the
    // pipeline must not ship it believing it does.
    if (types.has('Review') || types.has('AggregateRating')) {
      report.add('seo/review-schema', MAJOR,
        'Review / AggregateRating markup on the business own domain',
        { file: shown },
        'Self-serving review markup is ineligible for rich results and always has been, and an embedded review widget does not change that. Remove it from the JSON-LD. Keep the testimonials on the page for humans, with a real source in facts.md.');
    }

    // ---------------------------------------------------------- headings
    const hs = [...raw.matchAll(/<h([1-6])\b/gi)].map((m) => +m[1]);
    const h1s = hs.filter((n) => n === 1).length;
    if (h1s === 0) {
      report.add('seo/h1', MAJOR, 'no <h1>', { file: shown },
        'Every page needs one h1 naming what the page is. It is the first thing a screen reader user hears and the strongest on-page signal there is.');
    } else if (h1s > 1) {
      report.add('seo/h1', MINOR, `${h1s} <h1> elements`, { file: shown, count: h1s },
        'One per page. Multiple h1s flatten the document outline.');
    }
    for (let i = 1; i < hs.length; i++) {
      if (hs[i] - hs[i - 1] > 1) {
        report.add('seo/heading-order', MINOR, `heading jumps from h${hs[i - 1]} to h${hs[i]}`,
          { file: shown },
          'Screen-reader users navigate by heading level. A skipped level reads as a missing section.');
        break;
      }
    }
  }

  // ---------------------------------------------------------- aggregated
  if (ogMissing.length) {
    const all = ogMissing.length === htmlFiles.length;
    report.add('seo/open-graph', MAJOR,
      `${plural(ogMissing.length, 'page')} ${verb(ogMissing.length, 'has', 'have')} no social preview tags (${ogMissing[0].missing})`,
      { file: ogMissing[0].file, count: ogMissing.length },
      `Local businesses get shared by one person sending another the link. With no OG tags that arrives in WhatsApp or Facebook as a bare URL with no picture and no title — the least clickable object on the screen.${all ? ' Every page is missing them, so add it to the shared head template once.' : ''}`);
  }
  if (canonMissing.length) {
    report.add('seo/canonical', MINOR,
      `${plural(canonMissing.length, 'page')} ${verb(canonMissing.length, 'has', 'have')} no canonical URL`,
      { file: canonMissing[0], count: canonMissing.length },
      'One line per page. It settles www vs non-www, trailing slash, and tracking-parameter duplicates before they become a problem.');
  }

  // ---------------------------------------------------------- site-wide
  const rel = (f) => relative(siteDir, f).split(sep).join('/').toLowerCase();
  const names = everyFile.map(rel);

  if (!names.includes('robots.txt')) {
    report.add('seo/robots-txt', MAJOR, 'no robots.txt', {},
      'Ship one, even if it allows everything — it is also where the sitemap is declared, and its absence generates a 404 on every crawl.');
  }

  const sitemapFile = everyFile.find((f) => rel(f) === 'sitemap.xml');
  if (!sitemapFile) {
    report.add('seo/sitemap-xml', MAJOR, 'no sitemap.xml', {},
      'Generate it from the page list. Without one, discovery depends entirely on internal linking.');
  } else {
    const xml = read(sitemapFile);
    const locs = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => m[1]);
    if (locs.some((l) => PLACEHOLDER_DOMAIN.test(l))) {
      report.add('seo/placeholder-domain', BLOCKER, 'sitemap.xml lists a placeholder domain', {},
        'Every URL in the sitemap points somewhere that does not exist. Regenerate it against the real domain.');
    }
    // Every listed URL should correspond to a page in the build.
    const pageRoutes = new Set(htmlFiles.map((f) => rel(f).replace(/index\.html?$/, '').replace(/\.html?$/, '')));
    const orphans = locs.filter((l) => {
      try {
        const path = new URL(l).pathname.replace(/^\/|\/$/g, '').replace(/\.html?$/, '');
        return !pageRoutes.has(path) && !pageRoutes.has(path + '/') && !(path === '' && pageRoutes.has(''));
      } catch { return false; }
    });
    if (orphans.length) {
      report.add('seo/sitemap-xml', MAJOR,
        `sitemap lists ${orphans.length} URL${orphans.length === 1 ? '' : 's'} with no matching page (e.g. ${orphans[0]})`,
        { count: orphans.length },
        'A sitemap of 404s is a negative signal, and it is the classic sign the sitemap was written rather than generated.');
    }
  }

  const hasFavicon = names.some((n) => /favicon\.(ico|svg|png)$/.test(n))
    || htmlFiles.some((f) => linkRel(read(f), 'icon'));
  if (!hasFavicon) {
    report.add('seo/favicon', MAJOR, 'no favicon anywhere', {},
      'Browsers show a blank page icon, and the tab is unidentifiable among twenty others. Ship at least favicon.svg plus a 180×180 apple-touch-icon.');
  }

  if (!anyStructuredData && profile?.seo?.localBusinessRequired) {
    report.add('seo/structured-data', MAJOR, 'no JSON-LD structured data anywhere on the site', {},
      'A local business needs a LocalBusiness graph with name, address, telephone, openingHoursSpecification, areaServed and url. It is the machine-readable version of the facts a customer is looking for, and it feeds Maps, the knowledge panel and AI answers alike. Template in templates/site/localbusiness.jsonld.');
  }

  report.stats.ogCoverage = `${ogPages}/${htmlFiles.length}`;
}

export default { gates, run };
