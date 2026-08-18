#!/usr/bin/env node
// website-builder — the Claude Code enforcement hook.
//
//   node .claude/hooks/gate.mjs <pre|stop|prompt|session>
//
// Wired by .claude/settings.json. One file, zero dependencies, four events:
//
//   pre      PreToolUse on Write/Edit — no site file before the build's
//            brief.md and design.md exist, and no site-shaped file outside
//            builds/. This is AGENTS.md rule 1 made mechanical, because the
//            polite version was measurably skipped.
//   stop     Stop — a session cannot end while a build's site/ has changed
//            since its last verify.md and the gate reports blockers. Runs the
//            real checker, not a heuristic.
//   prompt   UserPromptSubmit — a build mention injects the stage-01 marching
//            orders (or the resume pointer), so the pipeline is in-context the
//            moment it is needed.
//   session  SessionStart — a one-paragraph summary of active builds.
//
// Every failure path fails OPEN (exit 0, no output): a broken hook must never
// be the reason work cannot proceed. The contract still binds; you just lose
// the mechanical catch. Engine maintainers can set WEBSITE_BUILDER_UNGATED=1.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, resolve, relative, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const event = process.argv[2] || '';

let payload = {};
try { payload = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { /* fail open */ }

const out = (obj) => { process.stdout.write(JSON.stringify(obj)); process.exit(0); };
const say = (text) => { process.stdout.write(text); process.exit(0); };
const pass = () => process.exit(0);

const norm = (p) => resolve(p).replace(/\//g, sep).toLowerCase();
const under = (child, parent) => norm(child).startsWith(norm(parent) + sep);

const buildsDir = join(root, 'builds');
const listBuilds = () => {
  try {
    return readdirSync(buildsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch { return []; }
};
const nextActionOf = (slug) => {
  try {
    const t = readFileSync(join(buildsDir, slug, 'STATE.md'), 'utf8');
    const m = t.match(/## Next action\s*\n+([\s\S]*?)(\n#|\n*$)/);
    return m ? m[1].trim().split('\n')[0].trim() : 'read its STATE.md';
  } catch { return null; }
};
const latestMtime = (dir) => {
  let latest = 0;
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else { const m = statSync(p).mtimeMs; if (m > latest) latest = m; }
    }
  };
  try { walk(dir); } catch { /* fail open */ }
  return latest;
};

try {
  // ------------------------------------------------------------------ pre
  if (event === 'pre') {
    if (process.env.WEBSITE_BUILDER_UNGATED === '1') pass();
    const input = payload.tool_input || {};
    const raw = input.file_path || input.notebook_path || '';
    if (!raw) pass();
    const file = resolve(payload.cwd || process.cwd(), raw);
    if (!under(file, root)) pass();

    const rel = relative(root, file).replace(/\\/g, '/');
    const deny = (reason) => out({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    });

    const m = rel.match(/^builds\/([^/]+)\/site\//i);
    if (m) {
      const slug = m[1];
      const has = (f) => existsSync(join(buildsDir, slug, f));
      if (!has('STATE.md')) {
        deny(`builds/${slug}/ has no STATE.md, so this build was never opened. ` +
          `Run: node start.mjs "<project name>" - it creates the state file and intake ` +
          `folder the pipeline keys off - then start at stages/01_discover/CONTEXT.md.`);
      }
      const missing = ['brief.md', 'facts.md', 'design.md'].filter((f) => !has(f));
      if (missing.length) {
        deny(`Not yet: builds/${slug}/ is missing ${missing.join(', ')}. Site files come ` +
          `after discovery and design are locked (AGENTS.md rule 1) - otherwise this is ` +
          `the default-design, invented-facts site this repo exists to prevent. Next: ` +
          `read builds/${slug}/STATE.md and continue from its Next action ` +
          `(${nextActionOf(slug) || 'run stage 01 discover'}). The questions to ask the ` +
          `human are in stages/01_discover/questions.md - ask them, do not guess.`);
      }
      pass();
    }

    if (/\.(html?|css)$/i.test(rel)
        && !/^(builds|examples|templates|checks|\.claude)\//i.test(rel)) {
      deny(`Site files live in builds/<slug>/site/, never at ${rel}. Open a build first - ` +
        `node start.mjs "<project name>" - then run stage 01 (discover) and stage 04 ` +
        `(design) before any markup exists. Engine maintainers editing the repo itself: ` +
        `set WEBSITE_BUILDER_UNGATED=1.`);
    }
    pass();
  }

  // ------------------------------------------------------------------ stop
  if (event === 'stop') {
    if (payload.stop_hook_active) pass();
    if (process.env.WEBSITE_BUILDER_UNGATED === '1') pass();
    for (const slug of listBuilds()) {
      const siteDir = join(buildsDir, slug, 'site');
      if (!existsSync(siteDir)) continue;
      const siteM = latestMtime(siteDir);
      if (!siteM) continue;
      const verifyPath = join(buildsDir, slug, 'verify.md');
      const verifyM = existsSync(verifyPath) ? statSync(verifyPath).mtimeMs : 0;
      if (siteM <= verifyM) continue; // verified after the last change

      const factsPath = join(buildsDir, slug, 'facts.md');
      const args = [join(root, 'checks', 'run.mjs'), siteDir, '--json'];
      if (existsSync(factsPath)) args.push('--facts', factsPath);
      const res = spawnSync(process.execPath, args, {
        cwd: root, encoding: 'utf8', timeout: 45000,
      });
      if (res.error || !res.stdout) continue; // fail open
      let counts;
      try { counts = JSON.parse(res.stdout).counts || {}; } catch { continue; }
      const blockers = counts.blocker ?? counts.blockers ?? 0;
      if (blockers > 0) {
        out({
          decision: 'block',
          reason: `builds/${slug}/site changed after its last verify, and the gate now ` +
            `reports ${blockers} blocker${blockers === 1 ? '' : 's'}. Run ` +
            `node checks/run.mjs builds/${slug}/site --facts builds/${slug}/facts.md, ` +
            `fix what it names (never --skip), update builds/${slug}/verify.md, and ` +
            `then finish. Exit 0 ships; exit 1 does not (AGENTS.md rule 4).`,
        });
      }
    }
    pass();
  }

  // ------------------------------------------------------------------ prompt
  if (event === 'prompt') {
    const text = String(payload.prompt || '');
    const mention = /\b(build|make|create|design|redesign|remake|rebuild|new)\b[\s\S]{0,60}?\b(website|web\s?site|webpage|web\s?page|landing\s?page|home\s?page|site\s+for)\b/i.test(text)
      || /\bwebsite\b[\s\S]{0,40}?\b(build|make|create|for)\b/i.test(text);
    if (!mention) pass();

    const builds = listBuilds().filter((s) => existsSync(join(buildsDir, s, 'STATE.md')));
    if (builds.length) {
      const lines = builds.map((s) => `  builds/${s}/ -> ${nextActionOf(s)}`).join('\n');
      say(`[website-builder] Build mention detected. Active build(s) exist:\n${lines}\n` +
        `If this message is about one of them, resume from its STATE.md Next action. ` +
        `If it is a NEW site, open it with node start.mjs "<project name>" and run ` +
        `stage 01 discover (stages/01_discover/CONTEXT.md) before any design or code.`);
    }
    say(`[website-builder] Build mention detected and no build is open. Before any design ` +
      `or code exists:\n` +
      `  1. node start.mjs "<project name>"\n` +
      `  2. Stage 01 discover (stages/01_discover/CONTEXT.md) - ask for what is in their ` +
      `head FIRST: sketches (a photo of paper is fine), screenshots, reference sites they ` +
      `love or want to remake, the one they hate, brand colours and fonts, their old site ` +
      `- into builds/<slug>/_intake/. Then the facts interview from ` +
      `stages/01_discover/questions.md.\n` +
      `  3. Write brief.md + facts.md and STOP for the human's yes.\n` +
      `Site files are hook-blocked until brief.md and design.md exist. "Just build it" ` +
      `means asking the smallest set of unguessable questions, not skipping them ` +
      `(AGENTS.md rule 1).`);
  }

  // ------------------------------------------------------------------ session
  if (event === 'session') {
    const builds = listBuilds().filter((s) => existsSync(join(buildsDir, s, 'STATE.md')));
    const config = existsSync(join(root, 'config.md'))
      ? '' : ' config.md does not exist - stage 00 setup has never run (one minute, stages/00_setup/CONTEXT.md).';
    if (builds.length) {
      const lines = builds.map((s) => `  builds/${s}/ -> ${nextActionOf(s)}`).join('\n');
      say(`[website-builder] This folder builds websites through an 8-stage contract ` +
        `(AGENTS.md). Active build(s):\n${lines}\nResume from STATE.md, not from memory.` +
        config);
    }
    say(`[website-builder] This folder builds websites through an 8-stage contract ` +
      `(AGENTS.md). No build is open. A build request starts with node start.mjs ` +
      `"<name>" and stage 01 discover - the vision-and-facts interview - never with ` +
      `code.${config}`);
  }

  pass();
} catch {
  pass(); // a broken hook must never block work
}
