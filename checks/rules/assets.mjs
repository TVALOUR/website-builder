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
  { id: 'assets/intake-unused', severity: 'minor', what: 'material the client handed over is either used or explicitly set aside' },
];

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp|tiff?)$/i;
const MEDIA_EXT = /\.(mp4|webm|mov|m4v|ogg|mp3|wav|pdf)$/i;

/** Files a build ships that are ours by construction, not the client's material. */
const OURS = /(favicon|apple-touch-icon|og\.(png|jpg|jpeg|webp)|icon-|sprite|logo-placeholder)/i;

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
  const published = new Map();   // basename -> {refs:[{file,line,el,value}]}
  const noteRef = (value, where) => {
    if (!value || /^(data:|#|mailto:|tel:|javascript:)/i.test(value)) return;
    if (/^https?:\/\//i.test(value)) return;      // remote assets are the legal family's problem
    if (!IMAGE_EXT.test(value) && !MEDIA_EXT.test(value)) return;
    const key = basenameKey(value);
    if (!key || OURS.test(key)) return;
    if (!published.has(key)) published.set(key, { value, refs: [] });
    published.get(key).refs.push(where);
  };

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
      const src = attr(t, 'src');
      if (src) noteRef(src, { file: shown, line: 0, el: 'img', alt: attr(t, 'alt') });
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

  const byKey = new Map();
  for (const row of manifest.rows) byKey.set(basenameKey(row.file), row);

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
  for (const [key, entry] of published) {
    const row = byKey.get(key);
    const at = entry.refs[0] || {};

    if (!row) {
      report.add('assets/unmanifested', BLOCKER,
        `"${entry.value}" is published but has no row in the manifest`,
        { file: at.file, line: at.line || undefined },
        `Add it to ${shownManifest} with where it came from and whether it is the client's to publish — or take it `
        + 'off the page. Stock photography of somebody else\'s premises is a false statement about this business, '
        + 'and it is the easiest one to ship by accident.');
      continue;
    }

    if (row.hasRightsColumn && isBlank(row.rights)) {
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

    if (row.hasAltColumn && isBlank(row.alt) && IMAGE_EXT.test(row.file)
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
