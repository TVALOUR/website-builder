// website-builder — filesystem helpers for the checkers.
// Zero dependencies. Node 18+.

import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

/** Directories never scanned — build output, vendored code, VCS metadata. */
const SKIP_DIRS = new Set([
  '.git', 'node_modules', '.next', '.astro', '.cache', '.vercel', '.netlify',
  'dist', 'build', '.svelte-kit', '__pycache__', '.venv', 'venv',
]);

/** Mutable scan stats: run.mjs resets and reports these, so a symlinked
 *  page is a stated limitation instead of a silent omission. */
export const walkStats = { symlinks: 0 };

/**
 * Recursively collect files under `dir` whose name ends with one of `exts`.
 * Symlinks are not followed (statSync on a broken link would throw; we skip)
 * — but they are COUNTED, because a static host dereferences and serves them
 * while this scanner would otherwise silently see nothing.
 */
export function walk(dir, exts, out = []) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.isSymbolicLink()) { walkStats.symlinks++; continue; }
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(full, exts, out);
    } else if (exts.some((e) => entry.name.toLowerCase().endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

/** Every file under `dir`, regardless of extension. Used for presence checks. */
export function allFiles(dir) {
  return walk(dir, ['']);
}

export function read(file) {
  try {
    return readFileSync(file, 'utf8');
  } catch {
    return '';
  }
}

export function exists(p) {
  return existsSync(p);
}

/**
 * Path shown in findings. Relative to the scanned site root and always
 * forward-slashed, so a finding reads the same on Windows and Linux — this
 * matters because the same repo is checked in CI and on a laptop.
 */
export function displayPath(file, siteDir) {
  const rel = relative(siteDir, file);
  return (rel || file).split(sep).join('/');
}

/** 1-indexed line number of a character offset. */
export function lineAt(text, index) {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text[i] === '\n') line++;
  return line;
}
