#!/usr/bin/env node
// website-builder — the Claude Code enforcement hook.
//
//   node .claude/hooks/gate.mjs <pre|post|stop|prompt|session>
//
// Wired by .claude/settings.json. One file, zero dependencies, five events:
//
//   pre      PreToolUse on Write/Edit — no site file before the build's
//            brief.md, facts.md and design.md exist AND hold substance, and no
//            site-shaped file outside builds/. This is AGENTS.md rule 1 made
//            mechanical, because the polite version was measurably skipped.
//   post     PostToolUse on Bash — the editor tools are not the only way to
//            write a file. After every shell command, any build whose site/
//            exists ahead of its discovery/design documents is called out,
//            loudly, in the next context. Detection, not prevention: the
//            command has already run.
//   stop     Stop — a session cannot end while a build's site/ or facts.md
//            changed since a verify.md that carries a real verdict, and the
//            gate reports blockers. Runs the real checker, not a heuristic.
//   prompt   UserPromptSubmit — a build mention injects the stage-01 marching
//            orders (or the resume pointer), so the pipeline is in-context the
//            moment it is needed.
//   session  SessionStart — a one-paragraph summary of active builds.
//
// Every failure path fails OPEN (exit 0, no output): a broken hook must never
// be the reason work cannot proceed. That is a deliberate trade — the contract
// still binds; you lose the mechanical catch. Engine maintainers can set
// WEBSITE_BUILDER_UNGATED=1.
//
// What this file honestly cannot do: stop an agent that deliberately routes
// around it (Bash writes are detected after the fact, not blocked; a forged
// verify.md is a contract violation the stage-07 read-back catches, not this
// file). It converts accidental skipping into denials and deliberate skipping
// into visible evidence. Determined fraud is out of scope for a hook.

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
const stateOf = (slug) => {
  try { return readFileSync(join(buildsDir, slug, 'STATE.md'), 'utf8'); } catch { return null; }
};
// A build marked closed stops being policed. This is the documented escape for
// an abandoned experiment: one word in its STATE.md, not a deleted folder.
const isClosed = (slug) => {
  const s = stateOf(slug);
  return s !== null && /\b(ABANDONED|ARCHIVED|LAUNCHED)\b/.test(s);
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

// "Exists" is not "written". An empty brief satisfies nothing; requiring a few
// honest lines raises the cost of routing around stage 01 from `touch` to
// actively faking documents — at which point the violation is deliberate and
// visible, which is all a hook can make it.
const docGaps = (slug) => {
  const dir = join(buildsDir, slug);
  const gaps = [];
  const substantial = (f, min) => {
    try { return statSync(join(dir, f)).size >= min; } catch { return false; }
  };
  if (!substantial('brief.md', 150)) gaps.push('brief.md (missing or still empty)');
  if (!substantial('content.md', 150)) gaps.push('content.md (missing or still empty)');
  if (!substantial('design.md', 150)) gaps.push('design.md (missing or still empty)');
  try {
    const facts = readFileSync(join(dir, 'facts.md'), 'utf8');
    const tableLines = facts.split('\n').filter((l) => l.includes('|')).length;
    if (tableLines < 3) gaps.push('facts.md (no ledger table rows yet)');
  } catch { gaps.push('facts.md (missing)'); }
  return gaps;
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

    const inBuild = rel.match(/^builds\/([^/]+)\/(.*)$/i);
    if (inBuild) {
      const [, slug, inner] = inBuild;
      const has = (f) => existsSync(join(buildsDir, slug, f));

      // Anything under _intake/ is client-supplied material — never gated.
      if (/^_intake\//i.test(inner)) pass();

      if (/^site\//i.test(inner)) {
        if (!has('STATE.md')) {
          deny(`builds/${slug}/ has no STATE.md, so this build was never opened. ` +
            `Run: node start.mjs "<project name>" - it creates the state file and intake ` +
            `folder the pipeline keys off - then start at stages/01_discover/CONTEXT.md.`);
        }
        const gaps = docGaps(slug);
        if (gaps.length) {
          deny(`Not yet: builds/${slug}/ still lacks ${gaps.join('; ')}. Site files come ` +
            `after discovery and design are locked (AGENTS.md rule 1) - otherwise this is ` +
            `the default-design, invented-facts site this repo exists to prevent. Next: ` +
            `read builds/${slug}/STATE.md and continue from its Next action ` +
            `(${nextActionOf(slug) || 'run stage 01 discover'}). The questions to ask the ` +
            `human are in stages/01_discover/questions.md - ask them, do not guess.`);
        }
        pass();
      }

      // Site-shaped files at the build root (outside site/): the design-samples
      // page is stage 04's legitimate pre-design artifact, so the bar here is
      // discovery (brief + facts), not the locked design.
      if (/\.(html?|css)$/i.test(inner)) {
        if (!has('STATE.md')) {
          deny(`builds/${slug}/ has no STATE.md, so this build was never opened. ` +
            `Run: node start.mjs "<project name>" first.`);
        }
        const gaps = docGaps(slug)
          .filter((g) => !g.startsWith('design.md') && !g.startsWith('content.md'));
        if (gaps.length) {
          deny(`Not yet: builds/${slug}/ still lacks ${gaps.join('; ')}. Even scaffolding ` +
            `like design samples comes after stage 01 discover has produced a real brief ` +
            `and facts ledger - run the interview first (stages/01_discover/CONTEXT.md).`);
        }
        pass();
      }
      pass();
    }

    if (/\.(html?|css)$/i.test(rel)
        && !/^(examples|templates|checks|\.claude)\//i.test(rel)) {
      deny(`Site files live in builds/<slug>/site/, never at ${rel}. Open a build first - ` +
        `node start.mjs "<project name>" - then run stage 01 (discover) and stage 04 ` +
        `(design) before any markup exists. Engine maintainers editing the repo itself: ` +
        `set WEBSITE_BUILDER_UNGATED=1.`);
    }
    pass();
  }

  // ------------------------------------------------------------------ post
  // Bash (or any generator) can create files the pre hook never sees. This
  // event does not block - the command already ran - it makes the bypass loud
  // on the very next turn instead of silent until stage 06.
  if (event === 'post') {
    if (process.env.WEBSITE_BUILDER_UNGATED === '1') pass();
    const offenders = [];
    for (const slug of listBuilds()) {
      if (isClosed(slug)) continue;
      const siteDir = join(buildsDir, slug, 'site');
      if (!existsSync(siteDir)) continue;
      let hasFiles = false;
      try { hasFiles = readdirSync(siteDir).length > 0; } catch { /* fail open */ }
      if (!hasFiles) continue;
      const gaps = docGaps(slug);
      if (gaps.length) offenders.push(`builds/${slug}/site exists but the build lacks ${gaps.join('; ')}`);
    }
    if (offenders.length) {
      out({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `[website-builder] Pipeline bypass detected: ${offenders.join(' | ')}. ` +
            `Site files may not precede discovery and design (AGENTS.md rule 1). Stop building, ` +
            `run stage 01 (and 04) properly, and reconcile what already exists against the real ` +
            `brief - or delete it and start honestly.`,
        },
      });
    }
    pass();
  }

  // ------------------------------------------------------------------ stop
  if (event === 'stop') {
    if (payload.stop_hook_active) pass();
    if (process.env.WEBSITE_BUILDER_UNGATED === '1') pass();
    for (const slug of listBuilds()) {
      if (isClosed(slug)) continue;
      const siteDir = join(buildsDir, slug, 'site');
      if (!existsSync(siteDir)) continue;
      const siteM = latestMtime(siteDir);
      if (!siteM) continue;

      // facts.md is part of what "verified" attested to: editing the ledger
      // after a verify invalidates the verify.
      const factsPath = join(buildsDir, slug, 'facts.md');
      const factsM = existsSync(factsPath) ? statSync(factsPath).mtimeMs : 0;
      const changedM = Math.max(siteM, factsM);

      // verify.md only counts if it carries a named verdict - a touched empty
      // file is not an attestation (and forging one is a deliberate, visible
      // contract violation, which is the most a hook can enforce).
      const verifyPath = join(buildsDir, slug, 'verify.md');
      let verifyM = 0;
      if (existsSync(verifyPath)) {
        try {
          const v = readFileSync(verifyPath, 'utf8');
          if (/\b(PASS|REVISE|FAIL)\b/.test(v)) verifyM = statSync(verifyPath).mtimeMs;
        } catch { /* fail open */ }
      }
      if (changedM <= verifyM) continue;

      const args = [join(root, 'checks', 'run.mjs'), siteDir, '--json'];
      if (existsSync(factsPath)) args.push('--facts', factsPath);
      const res = spawnSync(process.execPath, args, {
        cwd: root, encoding: 'utf8', timeout: 45000,
      });
      if (res.error || !res.stdout) continue; // fail open
      let counts;
      try { counts = JSON.parse(res.stdout).counts || {}; } catch { continue; }
      const blockers = counts.blocker ?? 0;
      if (blockers > 0) {
        out({
          decision: 'block',
          reason: `builds/${slug} changed after its last verified state, and the gate now ` +
            `reports ${blockers} blocker${blockers === 1 ? '' : 's'}. Run ` +
            `node checks/run.mjs builds/${slug}/site --facts builds/${slug}/facts.md, ` +
            `fix what it names (never --skip), and record the verdict in ` +
            `builds/${slug}/verify.md before finishing (AGENTS.md rule 4). If this build ` +
            `is genuinely dead, write ABANDONED in its STATE.md and it stops being policed.`,
        });
      }
    }
    pass();
  }

  // ------------------------------------------------------------------ prompt
  if (event === 'prompt') {
    const text = String(payload.prompt || '');
    const nouns = '(website|web\\s?site|webpage|web\\s?page|landing\\s?page|home\\s?page|site|portfolio|online\\s+presence|web\\s+presence)';
    const verbs = '(build|make|create|design|redesign|remake|rebuild|develop|generate|launch|ship|spin\\s+up|put\\s+together|need|want)';
    const mention = new RegExp(`\\b${verbs}\\b[\\s\\S]{0,60}?\\b${nouns}\\b`, 'i').test(text)
      || new RegExp(`\\b${nouns}\\b[\\s\\S]{0,40}?\\b(build|make|create|for)\\b`, 'i').test(text);
    if (!mention) pass();

    const builds = listBuilds().filter((s) => existsSync(join(buildsDir, s, 'STATE.md')) && !isClosed(s));
    if (builds.length) {
      const lines = builds.map((s) => `  builds/${s}/ -> ${nextActionOf(s)}`).join('\n');
      say(`[website-builder] Build mention detected. Active build(s) exist:\n${lines}\n` +
        `If this message is about one of them, resume from its STATE.md Next action. ` +
        `If it is a NEW site, open it with node start.mjs "<project name>" and run ` +
        `stage 01 discover (stages/01_discover/CONTEXT.md) before any design or code.`);
    }
    const setup = existsSync(join(root, 'config.md'))
      ? '' : `  0. config.md does not exist - run stage 00 setup once first (stages/00_setup/CONTEXT.md).\n`;
    say(`[website-builder] Build mention detected and no build is open. Before any design ` +
      `or code exists:\n` + setup +
      `  1. node start.mjs "<project name>"\n` +
      `  2. Stage 01 discover (stages/01_discover/CONTEXT.md) - ask for what is in their ` +
      `head FIRST: sketches (a photo of paper is fine), screenshots, reference sites they ` +
      `love or want to remake, the one they hate, brand colours and fonts, their old site ` +
      `- into builds/<slug>/_intake/. Then the interview from ` +
      `stages/01_discover/questions.md (question 0, part V, then the facts).\n` +
      `  3. Write brief.md + facts.md and STOP for the human's yes.\n` +
      `Site files are hook-blocked until brief.md, facts.md and design.md exist. "Just ` +
      `build it" means asking the smallest set of unguessable questions, not skipping ` +
      `them (AGENTS.md rule 1).`);
  }

  // ------------------------------------------------------------------ session
  if (event === 'session') {
    const builds = listBuilds().filter((s) => existsSync(join(buildsDir, s, 'STATE.md')) && !isClosed(s));
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
