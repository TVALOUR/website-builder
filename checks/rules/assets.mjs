// website-builder — the asset provenance gate.
//
// Measured motivation, same shape as every other family here: the repo already
// had the rule. `shared/imagery.md` bans generated people and premises,
// `questions.md` D21/D24 asks for the logo and asks whether the photos are the
// client's to publish, and stage 01 says put everything in `_intake/`. Nothing
// connected any of it to the site that shipped. There was no list of what the
// client handed over, no record of what was cleared for publication, and no
// check that the image on the page was either.
//
// So: an image on a page is a claim. "This is our shop." "This is our work."
// "This is the team." An image with no traceable origin is exactly as dishonest
// as a price with no traceable origin, and this family treats it that way.
//
// The manifest is builds/<slug>/assets/MANIFEST.md. Discovery mirrors facts.md:
// an explicit --assets path wins, otherwise a colocated or parent assets folder.

import { join, dirname } from 'node:path';
import { read, displayPath, exists } from '../lib/fs.mjs';
import { references, tags, attr } from '../lib/html.mjs';
import { BLOCKER, MAJOR, MINOR } from '../lib/report.mjs';
import { parseManifest, basenameKey, isBlank, FORBIDDEN_GENERATED_SUBJECTS } from '../lib/manifest.mjs';
import { loadPolicy } from '../lib/policy.mjs';
import { readdirSync, statSync, existsSync } from 'node:fs';

export const gates = [
  { id: 'assets/manifest-exists', severity: 'blocker', what: 'a build that publishes images has an asset manifest' },
  { id: 'assets/unmanifested', severity: 'blocker', what: 'every image on the site traces to a manifest row' },
  { id: 'assets/rights-unrecorded', severity: 'blocker', what: 'every published asset records whether it is the client\'s to publish' },
  { id: 'assets/source-unrecorded', severity: 'blocker', what: 'every published asset records where it came from' },
  { id: 'assets/generated-not-permitted', severity: 'blocker', what: 'generated imagery only ships when the build asked for it' },
  { id: 'assets/generated-forbidden-subject', severity: 'blocker', what: 'no generated image depicts a real person, premises, product, logo or award' },
  { id: 'assets/generated-undeclared', severity: 'major', what: 'an asset the site describes as a photograph is not declared as generated' },
  { id: 'assets/file-missing', severity: 'major', what: 'the manifest does not list files that are not there' },
  { id: 'assets/alt-unrecorded', severity: 'major', what: 'every published image has alt text decided in the manifest, not improvised in the markup' },
  { id: 'assets/alt-mismatch', severity: 'major', what: 'the page and the manifest agree about what a picture shows' },
  { id: 'assets/intake-unused', severity: 'minor', what: 'material the client handed over is either used or explicitly set aside' },
];

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp|tiff?)$/i;
const MEDIA_EXT = /\.(mp4|webm|mov|m4v|ogg|mp3|wav|pdf)$/i;

/**
 * Files a build ships that are ours by construction, not the client's material.
 *
 * ANCHORED, exact names only. The previous version matched a SUBSTRING of a name
 * the builder controls — `icon-`, `sprite` — so publishing two arbitrary
 * photographs as `icon-hero.png` and `sprite.png` exempted them from the entire
 * assets family with no manifest rows at all. An allowlist matched on part of a
 * name the other side chooses is not an allowlist.
 */
const OURS = /^(favicon\.(ico|svg|png)|apple-touch-icon(-precomposed)?\.png|og\.(png|jpg|jpeg|webp)|android-chrome-\d+x\d+\.png|mstile-\d+x\d+\.png|safari-pinned-tab\.svg|site\.webmanifest|browserconfig\.xml|logo-placeholder\.(svg|png))$/i;

/**
 * A responsive rendition belongs to its parent photograph, not to a row of its
 * own. `yard-800.jpg`, `yard-1600w.jpg` and `yard@2x.jpg` are one asset with one
 * source and one set of rights; demanding three manifest rows for one photo is
 * friction with no honesty benefit.
 */
function renditionParent(name) {
  const m = /^(.+?)(?:[-_@](?:\d{2,5}w?|[234]x))+(\.[a-z0-9]+)$/i.exec(name);
  return m ? `${m[1]}${m[2]}`.toLowerCase() : null;
}

function findManifest(siteDir, flagPath) {
  if (flagPath && exists(flagPath)) return flagPath;
  const candidates = [
    join(siteDir, '..', 'assets', 'MANIFEST.md'),
    join(siteDir, 'assets', 'MANIFEST.md'),
    join(siteDir, '..', 'ASSETS.md'),
    join(siteDir, '..', 'assets', 'manifest.md'),
  ];
  for (const p of candidates) if (exists(p)) return p;
  return null;
}

function listFiles(dir, out = [], depth = 0) {
  if (depth > 6 || !existsSync(dir)) return out;
  let entries = [];
  try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) listFiles(p, out, depth + 1);
    else out.push(p);
  }
  return out;
}

export async function run(ctx, report) {
  const { siteDir, htmlFiles, styleSources, assetsPath } = ctx;
  for (const id of gates.map((g) => g.id)) report.ranGate(id);

  const buildDir = dirname(siteDir);
  const policy = loadPolicy(siteDir);
  report.stats.imageryPolicy = policy.imagery;
  report.stats.motionPolicy = policy.motion;

  // ------------------------------------------------ what the site publishes
  //
  // KEYED ON THE PUBLISHED PATH, not the basename.
  //
  // Keying on the basename collapsed two different files into one entry before
  // the manifest was ever consulted, so a page carrying both `img/about/team.jpg`
  // (the client's photo, cleared) and `img/stock/team.jpg` (a stock image nobody
  // cleared) reported ONE published asset and no findings — the stock image
  // inheriting the client photo's source, rights and alt text. Laundering, by
  // rename, through the gate whose entire job is provenance.
  //
  // The basename is still how a published path is matched to a manifest ROW,
  // because the manifest records where a file came from and the site records
  // where it went. But that match is now one-to-one or it is a finding.
  const published = new Map();   // published path -> {value, refs:[…]}
  const noteRef = (value, where) => {
    if (!value || /^(data:|#|mailto:|tel:|javascript:)/i.test(value)) return;
    if (/^https?:\/\//i.test(value)) return;      // remote assets are the legal family's problem
    // Strip the query string and fragment FIRST. Testing the extension against
    // the raw value meant a cache-busted `hero.jpg?v=3`, an SVG sprite target
    // `icons.svg#phone` and every fingerprinted asset failed the extension test
    // and left the gate entirely — while basenameKey() below already contained
    // the code to handle exactly that, and never got the chance to run.
    const clean = String(value).split(/[?#]/)[0];
    if (!IMAGE_EXT.test(clean) && !MEDIA_EXT.test(clean)) return;
    const key = basenameKey(clean);
    if (!key || OURS.test(key)) return;
    const path = clean.replace(/^\.?\//, '').toLowerCase();
    if (!published.has(path)) published.set(path, { value: clean, refs: [] });
    published.get(path).refs.push(where);
  };

  // Anything a <link rel="icon|apple-touch-icon|mask-icon"> points at is site
  // furniture by declaration rather than by filename, which is the honest test.
  const declaredIcons = new Set();
  for (const f of htmlFiles) {
    for (const t of tags(read(f), 'link')) {
      const rel = (attr(t.raw, 'rel') || '').toLowerCase();
      const href = attr(t.raw, 'href');
      if (href && /\b(icon|apple-touch-icon|mask-icon|manifest)\b/.test(rel)) {
        declaredIcons.add(basenameKey(String(href).split(/[?#]/)[0]));
      }
    }
  }

  for (const f of htmlFiles) {
    const raw = read(f);
    const shown = displayPath(f, siteDir);
    for (const r of references(raw)) {
      if (r.attrName === 'srcset') {
        for (const part of r.value.split(',')) noteRef(part.trim().split(/\s+/)[0], { file: shown, line: r.line, el: r.el });
      } else {
        noteRef(r.value, { file: shown, line: r.line, el: r.el });
      }
    }
    // <img> alt handling, kept alongside the reference so the two agree.
    for (const t of tags(raw, 'img')) {
      // tags() yields {raw, index, line} objects, not strings. Passing the
      // object straight to attr() returned null every time, so the page's alt
      // text was never captured and assets/alt-mismatch could not fire.
      const src = attr(t.raw, 'src');
      if (src) noteRef(src, { file: shown, line: t.line, el: 'img', alt: attr(t.raw, 'alt') });
    }
  }
  for (const s of styleSources || []) {
    for (const m of String(s.text).matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) {
      noteRef(m[1], { file: s.file, line: 0, el: 'css' });
    }
  }

  // ------------------------------------------------ the manifest
  const manifestPath = findManifest(siteDir, assetsPath);
  const manifest = parseManifest(manifestPath);
  const shownManifest = manifestPath ? displayPath(manifestPath, buildDir) : 'builds/<slug>/assets/MANIFEST.md';

  if (!manifestPath || !manifest.hasTable) {
    // Somebody else's site being audited has no manifest and was never going to
    // have one. Blocking it would fire on every external audit the README
    // promotes, which is how a gate teaches people to stop running it.
    if (!policy.managed) {
      report.skip('assets', 'not a builds/<slug>/ folder — asset provenance is checked only for builds this '
        + 'repo produced, because an audited third-party site has no manifest and was never going to. '
        + 'Everything else in this run still applies.');
      return;
    }
    if (published.size > 0) {
      report.add('assets/manifest-exists', BLOCKER,
        `the site publishes ${published.size} asset${published.size === 1 ? '' : 's'} and there is no asset manifest`,
        { file: shownManifest },
        'Run `node assets.mjs <slug> scan` to build one from what is in the build folder, then fill in the '
        + 'Source and Rights columns from what the client actually told you. An image whose origin nobody '
        + 'recorded is a claim about the business that nobody can back — the same defect as an unsourced price.');
    } else {
      report.skip('assets', `no asset manifest at ${shownManifest} and the site publishes no local images — nothing to trace`);
    }
    return;
  }

  // Basename -> the rows claiming it. More than one row on a basename is the
  // manifest's own ambiguity and gets said out loud rather than resolved by
  // insertion order, which is what Map.set() was quietly doing.
  const byKey = new Map();
  for (const row of manifest.rows) {
    const k = basenameKey(row.file);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(row);
  }

  // A required column the header never declared is not a question that stopped
  // needing an answer.
  if (!manifest.columns.rights) {
    report.add('assets/rights-unrecorded', BLOCKER,
      'the manifest has no Rights column, so nothing records whether any of these files is the client\'s to publish',
      { file: shownManifest },
      'Add it. Deleting the column used to delete the check with it — a two-second edit to a file this repo '
      + 'invites you to hand-edit. Re-run `node assets.mjs <slug> scan` to restore the full header.');
  }
  if (!manifest.columns.alt) {
    report.add('assets/alt-unrecorded', MAJOR,
      'the manifest has no Alt column, so alt text is being improvised at build time rather than decided here',
      { file: shownManifest },
      'Add it. "image1" comes from deciding alt text while writing markup instead of while looking at the picture.');
  }

  // Which published paths claim each basename — the other half of the
  // ambiguity check.
  const pathsByBase = new Map();
  for (const path of published.keys()) {
    const k = basenameKey(path);
    if (!pathsByBase.has(k)) pathsByBase.set(k, []);
    pathsByBase.get(k).push(path);
  }

  // THE MANIFEST CANNOT GRANT PERMISSION. Its `Imagery policy:` line is a
  // display of what was agreed, written there by `assets.mjs scan` so somebody
  // filling the table can see the rule they are filling it under.
  //
  // An earlier version let the manifest supply the policy whenever the brief was
  // silent. That is a privilege escalation with no client in it: editing one
  // line of a table the agent itself maintains would authorise generated imagery
  // that nobody ever asked for — the precise accident this family exists to
  // prevent, reachable from inside the file it was meant to police. Permission
  // comes from brief.md or config.md, both of which record a human's answer.
  const imagery = policy.imagery;
  if (manifest.imageryPolicy && manifest.imageryPolicy !== imagery) {
    report.add('assets/generated-not-permitted', MAJOR,
      `the manifest says the imagery policy is "${manifest.imageryPolicy}" and the build's actual policy is "${imagery}" (from ${policy.imagerySource})`,
      { file: shownManifest },
      'The manifest does not set policy — brief.md does, because that is where the client\'s answer lives. '
      + 'Re-run `node assets.mjs <slug> scan` to bring the header back in line, or change brief.md if the '
      + 'client actually changed their mind.');
  }

  // ------------------------------------------------ every published asset
  const seenRows = new Set();
  for (const [path, entry] of published) {
    const key = basenameKey(path);
    const at = entry.refs[0] || {};

    // Site furniture declared as such by a <link rel="icon">, and responsive
    // renditions of a photograph that IS manifested. Neither is client material
    // needing its own provenance row.
    if (declaredIcons.has(key)) continue;
    const parent = renditionParent(key);
    if (parent && byKey.has(parent)) continue;

    const claims = byKey.get(key) || [];
    const siblings = pathsByBase.get(key) || [];

    // Ambiguity is the finding, not something to resolve by picking one.
    if (claims.length && siblings.length > 1) {
      report.add('assets/unmanifested', BLOCKER,
        `${siblings.length} different files are published as "${key}" (${siblings.join(', ')}) and the manifest has `
        + `${claims.length === 1 ? 'one row' : `${claims.length} rows`} for that name — which file the row describes is unknowable`,
        { file: at.file, line: at.line || undefined },
        'Rename them apart, or give each one its own row keyed on its published path. A manifest that binds a NAME '
        + 'rather than a file is laundering: drop any image in beside a cleared one, give it the same name, and it '
        + 'inherits somebody else\'s source, rights and alt text.');
      continue;
    }
    if (claims.length > 1) {
      report.add('assets/unmanifested', BLOCKER,
        `the manifest has ${claims.length} rows for "${key}" (lines ${claims.map((r) => r.line).join(', ')}) and they cannot both describe the published file`,
        { file: shownManifest, line: claims[0].line },
        'Merge them, or key the rows on their full path. Two rows for one name means the checks below are reading '
        + 'whichever one happened to be last.');
      continue;
    }

    const row = claims[0];
    if (row) seenRows.add(row);

    if (!row) {
      report.add('assets/unmanifested', BLOCKER,
        `"${entry.value}" is published but has no row in the manifest`,
        { file: at.file, line: at.line || undefined },
        `Add it to ${shownManifest} with where it came from and whether it is the client's to publish — or take it `
        + 'off the page. Stock photography of somebody else\'s premises is a false statement about this business, '
        + 'and it is the easiest one to ship by accident.');
      continue;
    }

    if (manifest.columns.rights && isBlank(row.rights)) {
      report.add('assets/rights-unrecorded', BLOCKER,
        `"${row.file}" ships with no answer in the Rights column`,
        { file: shownManifest, line: row.line },
        'Ask the client the question in questions.md D24: is this yours to publish? Their answer goes in the cell, '
        + 'in their words. "Probably fine" is a real answer and it is not the same as yes.');
    }

    if (isBlank(row.source)) {
      report.add('assets/source-unrecorded', BLOCKER,
        `"${row.file}" ships with no Source`,
        { file: shownManifest, line: row.line },
        'Where did this file come from — which email, which folder, which sketch, which generator? Unsourced is '
        + 'the same as invented, and that rule does not stop applying because the artifact is a JPEG.');
    }

    if (row.generated) {
      if (imagery !== 'generated-allowed') {
        report.add('assets/generated-not-permitted', BLOCKER,
          `"${row.file}" is declared generated, and this build's imagery policy is "${imagery}"`,
          { file: shownManifest, line: row.line },
          'Generated imagery is OFF by default. If the client asked for it, record `- **Imagery:** generated-allowed` '
          + 'in brief.md and say in the brief who asked for it. Otherwise use the client\'s own assets, or CSS/SVG/type — '
          + 'a well-typeset section with no image beats a decorative one that says nothing.');
      }
      for (const [re, what] of FORBIDDEN_GENERATED_SUBJECTS) {
        if (re.test(row.shows || '') || re.test(row.alt || '')) {
          report.add('assets/generated-forbidden-subject', BLOCKER,
            `"${row.file}" is generated and depicts ${what} — "${(row.shows || row.alt).slice(0, 60)}"`,
            { file: shownManifest, line: row.line },
            'shared/imagery.md §3: never, in any regime. A viewer reads this as a factual claim about the business. '
            + 'Generating it is the same offence as inventing a price. Leave `[NEEDS: real photo of ...]` and tell the owner.');
          break;
        }
      }
    } else if (/\b(ai|generated|midjourney|dall.?e|stable\s*diffusion|firefly|imagen|flux)\b/i.test(row.source || '')) {
      report.add('assets/generated-undeclared', MAJOR,
        `"${row.file}" names a generator in its Source but the Generated column does not say yes`,
        { file: shownManifest, line: row.line },
        'Set the Generated column. The declaration is what makes the subject rules checkable at all, and an asset '
        + 'that hides its origin in a free-text cell has hidden it.');
    }

    // THE PAGE AND THE MANIFEST HAVE TO AGREE ABOUT WHAT THE PICTURE IS.
    //
    // This is what closes the last laundering route. Drop any image in beside a
    // cleared one, give it the cleared one's name, and every other check passes:
    // the row exists, it has a source, it has rights. What it does not have is
    // agreement — the page calls the file "our new premises" while the row that
    // vouches for it describes two owners in a workshop. One of those two
    // statements is false about the file that shipped, and the gate cannot tell
    // which, which is exactly the finding.
    //
    // It also enforces the design intent the Alt column exists for: alt text is
    // decided by somebody looking at the picture, not improvised while writing
    // markup, which is where "image1" comes from.
    const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const pageAlts = [...new Set(entry.refs.map((r) => r.alt).filter((a) => a != null))];
    const declaredAlt = norm(row.alt);
    const decorative = /^(decorative|none|empty|n\/a)$/.test(declaredAlt);
    for (const pageAlt of pageAlts) {
      const seen = norm(pageAlt);
      if (!declaredAlt || (decorative && !seen)) continue;
      if (seen === declaredAlt) continue;
      // Substring either way is a rewording, not a different subject.
      if (seen && declaredAlt && (seen.includes(declaredAlt) || declaredAlt.includes(seen))) continue;
      report.add('assets/alt-mismatch', MAJOR,
        `"${row.file}" — the page says "${String(pageAlt).slice(0, 48)}" and the manifest says "${String(row.alt).slice(0, 48)}"`,
        { file: at.file, line: at.line || undefined },
        'These describe different pictures. Either the alt text drifted from the decision, or the file at this path is '
        + 'not the file the row vouches for — and if it is the second, an uncleared image is wearing a cleared one\'s '
        + 'provenance. Check which, then make them agree.');
      break;
    }

    if (manifest.columns.alt && isBlank(row.alt) && IMAGE_EXT.test(row.file)
        && !/decorative|aria-hidden|alt=""/i.test(`${row.used} ${row.kind} ${row.alt}`)) {
      report.add('assets/alt-unrecorded', MAJOR,
        `"${row.file}" has no alt text recorded`,
        { file: shownManifest, line: row.line },
        'Decide it here, where the person who knows what the picture shows is looking at it — not in the markup at '
        + 'build time, which is where "image1" comes from. Purely decorative is a real answer: write "decorative" '
        + 'and the build ships alt="" with aria-hidden.');
    }
  }

  // ------------------------------------------------ manifest rows with no file
  const assetsDir = join(buildDir, 'assets');
  const intakeDir = join(buildDir, '_intake');
  const onDisk = new Set([...listFiles(assetsDir), ...listFiles(intakeDir), ...listFiles(siteDir)]
    .map((p) => basenameKey(p)));

  for (const row of manifest.rows) {
    if (!onDisk.has(basenameKey(row.file))) {
      report.add('assets/file-missing', MAJOR,
        `the manifest lists "${row.file}" and no such file exists in assets/, _intake/ or site/`,
        { file: shownManifest, line: row.line },
        'Either the file was never delivered — in which case this is a [NEEDS:] to chase, not a row — or it was '
        + 'renamed and the manifest was not. A manifest that describes files nobody has is not a record.');
    }
  }

  // ------------------------------------------------ intake the build ignored
  //
  // MINOR on purpose. The client sent a logo and the site does not use it is
  // usually a mistake and occasionally a decision; the gate raises it and the
  // human answers it. Silence was the wrong answer, because the client noticed.
  const intakeFiles = listFiles(intakeDir).filter((p) => IMAGE_EXT.test(p) || MEDIA_EXT.test(p));
  const unused = intakeFiles.filter((p) => {
    const k = basenameKey(p);
    if (published.has(k)) return false;
    const row = byKey.get(k);
    // A row that says why it is not used has answered the question.
    return !(row && /\bnot used\b|\bunused\b|\bset aside\b|\breference only\b|\breject/i.test(`${row.used} ${row.shows}`));
  });
  if (unused.length) {
    report.add('assets/intake-unused', MINOR,
      `${unused.length} file${unused.length === 1 ? '' : 's'} the client handed over ${unused.length === 1 ? 'is' : 'are'} not on the site and not accounted for: `
      + unused.slice(0, 6).map((p) => basenameKey(p)).join(', ') + (unused.length > 6 ? ', …' : ''),
      { file: displayPath(intakeDir, buildDir) },
      'Use it, or add a manifest row saying "not used" and why. A client who sent you their logo and finds it absent '
      + 'from the site does not conclude that it was a considered decision.');
  }

  report.stats.assetsPublished = published.size;
  report.stats.assetsManifested = manifest.rows.length;
}

export default { gates, run };
