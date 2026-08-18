// website-builder — build policies the gate has to enforce.
//
// Two defaults changed here, and both changed because the old behaviour was a
// model's preference imposed on a client who never asked for it:
//
//   MOTION   defaults to `none`. Animation is a design decision somebody makes
//            on purpose, and "everything fades in on scroll" is what a page does
//            when nobody decided. It is also the single fastest way to make a
//            small business site feel like a template.
//
//   IMAGERY  defaults to `client-assets-only`. A generated image on a real
//            business's site is a picture of a place that does not exist, a
//            person who does not work there, or a product that was never
//            photographed. The repo already bans that as a subject rule; this
//            makes the DEFAULT off, so allowing it is a decision with a name on
//            it rather than something that happened while nobody was looking.
//
// Both are read from the build's own brief.md first and the repo's config.md
// second, so a client who wants motion gets motion — by saying so, at stage 01,
// on the record.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..', '..');

const MOTION = ['none', 'subtle', 'expressive'];
const IMAGERY = ['client-assets-only', 'generated-allowed'];

function readIf(p) {
  try { return existsSync(p) ? readFileSync(p, 'utf8') : ''; } catch { return ''; }
}

/**
 * Pull `- **Motion:** subtle` (or `Imagery`, or any other key) out of a markdown
 * doc. Tolerant of the bullet, the bold, backticks and trailing prose, because
 * these files are written by hand and by agents in roughly equal measure.
 */
function field(text, key) {
  if (!text) return null;
  // Emphasis is STRIPPED before matching rather than matched around it.
  //
  // The house format in every file here is `- **Motion:** subtle` — colon INSIDE
  // the bold markers. An earlier pattern expected `**Motion**:` and so matched
  // none of them: every build silently ran on the default, the override was
  // unreachable, and nothing said so, because falling back to the safe default
  // looks exactly like working correctly. Found by running the checker against
  // this repo's own reference build and disbelieving the answer.
  const flat = text.replace(/\*\*/g, '').replace(/__/g, '');
  const re = new RegExp(`^\\s*(?:[-*]\\s*)?${key}\\s*:\\s*\`?([a-z][a-z-]*)\`?`, 'im');
  const m = re.exec(flat);
  return m ? m[1].toLowerCase() : null;
}

/**
 * Is this a build THIS repo produced, or somebody else's site being audited?
 *
 * The README promotes the checker as an audit tool for any static site — "useful
 * before quoting for a redesign, or on the site your last vibe-coding session
 * produced". That use case has no brief, no manifest and no agreed motion
 * policy, so gates that enforce an agreement would fire on every single one of
 * them. A blocker that every external site trips is not a gate, it is a reason
 * to stop using the tool.
 *
 * The tell is a sibling STATE.md or brief.md — the files start.mjs writes.
 */
export function isManagedBuild(siteDir) {
  const buildDir = dirname(siteDir);
  return existsSync(join(buildDir, 'STATE.md')) || existsSync(join(buildDir, 'brief.md'));
}

/**
 * Resolve the policies in force for a build.
 *
 * @param {string} siteDir  the directory being gated (builds/<slug>/site)
 * @returns {{motion, imagery, motionSource, imagerySource, brief: string|null, managed: boolean}}
 */
export function loadPolicy(siteDir) {
  const buildDir = dirname(siteDir);
  const briefPath = join(buildDir, 'brief.md');
  const briefText = readIf(briefPath);
  const configText = readIf(join(repoRoot, 'config.md'));

  const pick = (key, allowed, fallback) => {
    const fromBrief = field(briefText, key);
    if (fromBrief && allowed.includes(fromBrief)) return [fromBrief, 'brief.md'];
    const fromConfig = field(configText, key);
    if (fromConfig && allowed.includes(fromConfig)) return [fromConfig, 'config.md'];
    // An unrecognised value is treated as absent and the default applies. It is
    // reported by the caller, not swallowed: a typo'd policy that silently
    // enables generation is exactly the accident this file exists to prevent.
    return [fallback, 'default'];
  };

  const [motion, motionSource] = pick('Motion', MOTION, 'none');
  const [imagery, imagerySource] = pick('Imagery', IMAGERY, 'client-assets-only');

  const declared = {
    motion: field(briefText, 'Motion') || field(configText, 'Motion'),
    imagery: field(briefText, 'Imagery') || field(configText, 'Imagery'),
  };

  return {
    motion,
    imagery,
    motionSource,
    imagerySource,
    managed: isManagedBuild(siteDir),
    brief: existsSync(briefPath) ? briefPath : null,
    // Non-null when somebody wrote a value that is not in the allowed list.
    badMotion: declared.motion && !MOTION.includes(declared.motion) ? declared.motion : null,
    badImagery: declared.imagery && !IMAGERY.includes(declared.imagery) ? declared.imagery : null,
  };
}

export const MOTION_VALUES = MOTION;
export const IMAGERY_VALUES = IMAGERY;
