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

// The round parser, shared with checks/round.mjs's CLI and with the contract, so
// the hook and the checker cannot answer differently. Guarded: an older clone
// missing the file loses this one rule and keeps every other one.
let checkRounds = null;
try { ({ checkRounds } = await import('../../checks/round.mjs')); } catch { /* fail open */ }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const event = process.argv[2] || '';

let payload = {};
try { payload = JSON.parse(readFileSync(0, 'utf8') || '{}'); } catch { /* fail open */ }

const out = (obj) => { process.stdout.write(JSON.stringify(obj)); process.exit(0); };
const say = (text) => { process.stdout.write(text); process.exit(0); };
const pass = () => process.exit(0);

// Strip Windows extended-length/device prefixes BEFORE resolving: a path
// spelled \\?\C:\... never string-matches its plain twin, which silently
// defeated the containment check (found by the adversarial review).
const deprefix = (p) => String(p).replace(/^\\\\[?.]\\/, '');
const norm = (p) => resolve(deprefix(p)).replace(/\//g, sep).toLowerCase();
const under = (child, parent) => norm(child).startsWith(norm(parent) + sep);

// A UNC path is a second name for a file this hook already governs, and
// containment here is a string comparison, so the second name never matches:
// \\localhost\C$\...\builds\x\site\index.html is byte-for-byte the same file as
// C:\...\builds\x\site\index.html and walked straight past every check at once —
// the round rule, the discovery gaps, and the no-markup-outside-builds rule
// (adversarial pass, 2026-08-20). Resolving the alias is not reliably possible
// (realpath on an admin share stays an admin share), so the answer is to refuse
// the spelling rather than try to canonicalise it. Nothing in a normal session
// addresses this repo over UNC.
const isUnc = (p) => /^\\\\/.test(deprefix(p));

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
// A build marked dead stops being policed. This is the documented escape for an
// abandoned experiment: one word in its STATE.md, not a deleted folder.
//
// LAUNCHED used to live in this list, and that was the single largest hole in
// the enforcement: the hook went silent at exactly the moment the files became
// a page the public was already looking at. Every "can you just make the hero
// smaller" after go-live was then unbriefed, ungated and unrecorded. A launched
// build is now policed differently rather than not at all — see roundOf below,
// and stages/08_revise/CONTEXT.md.
const isDormant = (slug) => {
  const s = stateOf(slug);
  return s !== null && /\b(ABANDONED|ARCHIVED)\b/.test(s);
};
// LAUNCHED is read from TWO places on purpose. STATE.md is a file an edit can
// change, and deleting one word from it used to switch every live-site rule off
// with nothing else required (adversarial pass, 2026-08-20). handoff.md is stage
// 07's own output — the document read back to the client at go-live — so its
// existence is the harder half of the signal. Removing that is not a quiet edit;
// it is deleting the handover.
const isLaunched = (slug) => {
  const s = stateOf(slug);
  if (s !== null && /\bLAUNCHED\b/.test(s)) return true;
  return existsSync(join(buildsDir, slug, 'handoff.md'));
};

// The build's own CHANGELOG.md, read through the same checker stage 08 uses, so
// the hook and the contract cannot drift into two different answers. Fails OPEN:
// no Node, no parse, no opinion.
// Imported rather than spawned. The first version forked a node process per
// launched build on every Bash call and every stop — measured at 460–890ms with
// five launched builds, paid by every command in the session whether or not it
// touched this repo. Same module the CLI and the contract use, so they still
// cannot drift; it just no longer costs a process to ask.
const roundOf = (slug) => {
  if (!checkRounds) return null;
  try {
    const p = join(buildsDir, slug, 'CHANGELOG.md');
    if (!existsSync(p)) return { ok: false, missing: true, open: null, findings: [] };
    const r = checkRounds(readFileSync(p, 'utf8'));
    return { ok: r.ok, missing: false, open: r.open ? { n: r.open.n, date: r.open.date } : null, findings: r.findings };
  } catch { return null; }
};
// Markup parked directly at a build's root: everything except the named
// stage-04 scaffolding. _intake/ is the client's material and never counted.
const strayRootMarkup = (slug) => {
  try {
    return readdirSync(join(buildsDir, slug), { withFileTypes: true })
      .filter((e) => e.isFile() && /\.(html?|css)$/i.test(e.name)
        && !/^design-samples[^/]*\.html?$/i.test(e.name))
      .map((e) => e.name);
  } catch { return []; }
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
  const placeholder = (f) => {
    try {
      const text = readFileSync(join(dir, f), 'utf8');
      if (/lorem\s+ipsum/i.test(text)) return true;
      // start.mjs now writes a brief SKELETON at build open, so "exists and is
      // over 150 bytes" stopped meaning "somebody wrote something" the moment
      // the template landed — a 4 KB file of angle-bracket prompts satisfied it.
      // Six or more unreplaced <prompts> is the template, not a document.
      return (text.match(/^\s*<[A-Z][^>\n]{15,}/gm) || []).length >= 6;
    } catch { return false; }
  };
  for (const f of ['brief.md', 'content.md', 'design.md']) {
    if (!substantial(f, 150)) gaps.push(`${f} (missing or still empty)`);
    else if (placeholder(f)) gaps.push(`${f} (placeholder filler, not a real document)`);
  }
  try {
    const facts = readFileSync(join(dir, 'facts.md'), 'utf8');
    // Real rows, not bare pipes: at least a header line and one data line,
    // each carrying actual cell content between separators.
    const rows = facts.split('\n').filter((l) => /\|[^|\n]*[a-z0-9][^|\n]*\|/i.test(l)).length;
    if (rows < 2) gaps.push('facts.md (no real ledger rows yet)');
  } catch { gaps.push('facts.md (missing)'); }
  return gaps;
};

// The size check above proves somebody wrote SOMETHING. It cannot tell a real
// discovery from a confident-sounding one, and that gap is exactly how a build
// reached the point of offering the client a two-item legal-jurisdiction menu
// having never asked for a brief, an image, an asset or a feature.
//
// checks/brief.mjs is the substantive version: required sections, blocking
// questions, a jurisdiction that resolves to a profile that exists. Run it and
// report what it says. Fails OPEN — if Node cannot run it, the contract still
// binds, the mechanical catch is just absent.
const briefGaps = (slug) => {
  try {
    const r = spawnSync(process.execPath, [join(root, 'checks', 'brief.mjs'), join(buildsDir, slug), '--json'],
      { cwd: root, encoding: 'utf8', timeout: 20000, maxBuffer: 8 * 1024 * 1024 });
    if (r.error || !r.stdout) return [];
    const j = JSON.parse(r.stdout);
    if (j.ok) return [];
    const out = [];
    if (j.missingSections?.length) out.push(`brief.md has no ${j.missingSections.join(', ')} section`);
    if (j.thinSections?.length) out.push(`brief.md's ${j.thinSections.map((t) => t.key).join(', ')} section${j.thinSections.length === 1 ? ' is' : 's are'} a heading with nothing decided under it`);
    if (j.unansweredBlocking?.length) out.push(`${j.unansweredBlocking.length} BLOCKING question${j.unansweredBlocking.length === 1 ? '' : 's'} unanswered (${j.unansweredBlocking.slice(0, 4).join('; ')}${j.unansweredBlocking.length > 4 ? '; …' : ''})`);
    if (j.jurisdictionProblems?.length) out.push(j.jurisdictionProblems[0]);
    // ANY failure reason inherits enforcement, not just the four named above.
    // Rebuilding the list from specific keys meant a brief.mjs failure outside
    // them — an invalid policy value, say — returned [] and the write was
    // allowed: the hook silently disagreeing with the checker it had just run,
    // and every future check needing a matching hook edit to have any effect.
    if (!out.length) out.push('checks/brief.mjs reports the brief is not ready — run it and read the output');
    return out;
  } catch { return []; }
};

try {
  // ------------------------------------------------------------------ pre
  if (event === 'pre') {
    if (process.env.WEBSITE_BUILDER_UNGATED === '1') pass();
    const input = payload.tool_input || {};
    const raw = input.file_path || input.notebook_path || '';
    if (!raw) pass();
    const file = resolve(payload.cwd || process.cwd(), raw);

    const denyRaw = (reason) => out({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    });
    // Refused before containment is even asked, because the whole point of the
    // spelling is that containment answers wrongly.
    if (isUnc(raw) || isUnc(file)) {
      denyRaw(`That path is a UNC alias (${String(raw).slice(0, 80)}), and every check in this repo ` +
        `is keyed to the drive-letter path, so writing through it would skip all of them at once. ` +
        `Address the file as a normal path under ${root}.`);
    }
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
        // A live site is edited inside a round, or it is edited by nobody. The
        // round is a heading and four lines, and it exists so the change can be
        // traced back to the sentence the client actually said.
        if (isLaunched(slug)) {
          const r = roundOf(slug);
          if (r && !r.missing && !r.open) {
            deny(`builds/${slug} is LAUNCHED and no revision round is open, so this edit would ` +
              `change a page the public is already looking at with nothing recording why. ` +
              `Open one first: add "## Round <next> - OPEN - <today>" to the top of ` +
              `builds/${slug}/CHANGELOG.md with an "**Asked:**" line carrying the client's own ` +
              `words, then make the change. The stage is stages/08_revise/CONTEXT.md; the ` +
              `checker is node checks/round.mjs builds/${slug}. If this build is dead, write ` +
              `ABANDONED in its STATE.md instead.`);
          }
          if (r && r.missing) {
            deny(`builds/${slug} is LAUNCHED and has no CHANGELOG.md, so there is nowhere to ` +
              `record what is being changed or why. Copy templates/CHANGELOG.md into ` +
              `builds/${slug}/, write Round 0 honestly (the original build), then open the ` +
              `round this edit belongs to. See stages/08_revise/CONTEXT.md.`);
          }
        }
        const gaps = [...docGaps(slug), ...briefGaps(slug)];
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

      // The ONLY site-shaped file allowed at the build root is stage 04's named
      // scaffolding, design-samples*.html — and even that only after discovery.
      // An unrestricted carve-out here let an entire site ship one directory
      // above site/, invisible to every check at once (adversarial review).
      if (/\.(html?|css)$/i.test(inner)) {
        if (!/^design-samples[^/]*\.html?$/i.test(inner)) {
          deny(`Site files live in builds/${slug}/site/, not at builds/${slug}/${inner}. ` +
            `The only markup allowed at the build root is stage 04's design-samples*.html ` +
            `scaffolding. Move real pages into site/ - after the pipeline has earned them.`);
        }
        if (!has('STATE.md')) {
          deny(`builds/${slug}/ has no STATE.md, so this build was never opened. ` +
            `Run: node start.mjs "<project name>" first.`);
        }
        const gaps = [...docGaps(slug), ...briefGaps(slug)]
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

    // drop/ is the front door for the client's own material, and it is theirs,
    // not this build's output - same standing as builds/<slug>/_intake/. An export
    // of their old site is a .html file, and denying it would be the gate blocking
    // the one thing the pipeline spends stage 01 asking for.
    if (/^drop\//i.test(rel)) pass();

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
      if (isDormant(slug)) continue;
      const siteDir = join(buildsDir, slug, 'site');
      let hasFiles = false;
      if (existsSync(siteDir)) {
        try { hasFiles = readdirSync(siteDir).length > 0; } catch { /* fail open */ }
      }
      if (hasFiles) {
        const gaps = docGaps(slug);
        if (gaps.length) offenders.push(`builds/${slug}/site exists but the build lacks ${gaps.join('; ')}`);
      }
      // A live site edited outside a round. Shell writes reach the files the
      // pre hook never sees, and this is the event that says so.
      if (hasFiles && isLaunched(slug)) {
        const r = roundOf(slug);
        const clM = existsSync(join(buildsDir, slug, 'CHANGELOG.md'))
          ? statSync(join(buildsDir, slug, 'CHANGELOG.md')).mtimeMs : 0;
        if (r && r.missing) {
          offenders.push(`builds/${slug} is LAUNCHED and has no CHANGELOG.md - there is nowhere to record what changed on a live site`);
        } else if (r && !r.open && latestMtime(siteDir) > clM) {
          offenders.push(`builds/${slug} is LAUNCHED, its site/ changed, and no revision round is open (stages/08_revise/CONTEXT.md)`);
        }
      }
      // Site-shaped files parked at the build root (the shape that dodged
      // every check at once in the adversarial review).
      const stray = strayRootMarkup(slug);
      if (stray.length) {
        offenders.push(`builds/${slug}/ holds site files outside site/ (${stray.slice(0, 3).join(', ')}${stray.length > 3 ? ', ...' : ''}) - only design-samples*.html belongs there`);
      }
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
      if (isDormant(slug)) continue;

      // Placement is itself a violation: real pages at the build root are the
      // shape that evaded pre, post and stop simultaneously before this check.
      const stray = strayRootMarkup(slug);
      if (stray.length) {
        out({
          decision: 'block',
          reason: `builds/${slug}/ holds site files outside site/ (${stray.slice(0, 3).join(', ')}) - ` +
            `only design-samples*.html belongs at the build root. Move them into ` +
            `builds/${slug}/site/ and run the gate, or delete them. If this build is dead, ` +
            `write ABANDONED in its STATE.md.`,
        });
      }

      const siteDir = join(buildsDir, slug, 'site');
      if (!existsSync(siteDir)) continue;
      const siteM = latestMtime(siteDir);
      if (!siteM) continue;

      // A launched build whose live files moved with no round open. The session
      // does not end on it, for the same reason it does not end on a failing
      // gate: the change is already on somebody's public page, and the only
      // thing missing is the sentence saying who asked for it.
      if (isLaunched(slug)) {
        const r = roundOf(slug);
        const clPath = join(buildsDir, slug, 'CHANGELOG.md');
        const clM = existsSync(clPath) ? statSync(clPath).mtimeMs : 0;
        // No record at all. This is the build that was STARTED BEFORE the round
        // system existed, which makes it the likely case rather than the edge
        // one — and it was the one state that reached `stop` unblocked, because
        // both conditions below require a CHANGELOG to have been parsed. A
        // missing file was quietly safer than a malformed one, which is exactly
        // backwards.
        if (r && r.missing) {
          out({
            decision: 'block',
            reason: `builds/${slug} is LAUNCHED and has no CHANGELOG.md, so nothing records what has ` +
              `changed on a site the public is already looking at. Copy templates/CHANGELOG.md into ` +
              `builds/${slug}/, write Round 0 honestly (the original build, and the verdict its ` +
              `verify.md carries), and open a round for anything changed since. The stage is ` +
              `stages/08_revise/CONTEXT.md; node checks/round.mjs builds/${slug} checks the result. ` +
              `If this build is dead, write ABANDONED in its STATE.md.`,
          });
        }
        if (r && !r.missing && !r.open && siteM > clM) {
          out({
            decision: 'block',
            reason: `builds/${slug} is LAUNCHED, its site/ has changed, and no revision round is open. ` +
              `A change to a live site is recorded or it is not made: add "## Round <next> - OPEN - <today>" ` +
              `to the top of builds/${slug}/CHANGELOG.md with an "**Asked:**" line in the client's own words, ` +
              `run node checks/run.mjs builds/${slug}/site --facts builds/${slug}/facts.md, put the verdict in ` +
              `the round and flip it to SHIPPED. The stage is stages/08_revise/CONTEXT.md. If this build is ` +
              `dead, write ABANDONED in its STATE.md.`,
          });
        }
        if (r && !r.missing && !r.ok) {
          out({
            decision: 'block',
            reason: `builds/${slug}/CHANGELOG.md does not parse as a round record: ` +
              `${r.findings.slice(0, 2).map((f) => f.msg).join('; ')}. Run node checks/round.mjs builds/${slug} ` +
              `and fix what it names - a record nobody can read is the same as no record.`,
          });
        }
      }

      // facts.md is part of what "verified" attested to: editing the ledger
      // after a verify invalidates the verify.
      const factsPath = join(buildsDir, slug, 'facts.md');
      const factsM = existsSync(factsPath) ? statSync(factsPath).mtimeMs : 0;
      const changedM = Math.max(siteM, factsM);

      // verify.md only counts if it carries a named verdict as a VERDICT LINE -
      // the word at the start of a line or after "verdict:", exactly as stage
      // 06's contract writes it. A sentence that merely contains the word
      // ("does not PASS a proofread yet") is prose, not an attestation - the
      // adversarial review silenced this hook with exactly that decoy.
      // (Forging a real verdict line remains a deliberate, visible contract
      // violation, which is the most a hook can enforce.)
      const verifyPath = join(buildsDir, slug, 'verify.md');
      let verifyM = 0;
      if (existsSync(verifyPath)) {
        try {
          const v = readFileSync(verifyPath, 'utf8');
          if (/^[#>*\s-]*(\*\*)?(verdict\s*[:\-]\s*)?(\*\*)?\s*(PASS|REVISE|FAIL)\b/im.test(v)) {
            verifyM = statSync(verifyPath).mtimeMs;
          }
        } catch { /* fail open */ }
      }
      // A verify.md newer than the site is not proof the site was checked — it
      // is proof a file with a later timestamp exists. Writing `VERDICT: PASS`
      // LAST, after the site files, satisfied this comparison and the checker
      // was never spawned at all. So the discovery documents are checked on
      // EVERY stop regardless of mtime, and only the expensive full gate run is
      // skipped when the timestamps say nothing changed.
      const docs = [...docGaps(slug), ...briefGaps(slug)];
      if (docs.length) {
        out({
          decision: 'block',
          reason: `builds/${slug}/ has a site/ and ${docs.join('; ')}. The site was built ahead of its own `
            + `discovery, so nothing here rests on anything the client said. Run stage 01 `
            + `(stages/01_discover/CONTEXT.md), then node checks/brief.mjs builds/${slug}. If this build is `
            + `genuinely dead, write ABANDONED in its STATE.md and it stops being policed.`,
        });
      }
      if (changedM <= verifyM) continue;

      const args = [join(root, 'checks', 'run.mjs'), siteDir, '--json'];
      if (existsSync(factsPath)) args.push('--facts', factsPath);
      const res = spawnSync(process.execPath, args, {
        cwd: root, encoding: 'utf8', timeout: 45000,
      });
      if (res.error || !res.stdout) continue; // fail open
      let parsed;
      try { parsed = JSON.parse(res.stdout); } catch { continue; }
      // A crashed rule family means the result is UNKNOWN, and unknown never
      // passes - previously a crash with zero surviving blockers slipped
      // through because only counts.blocker was read (adversarial review).
      if (parsed.verdict === 'ERROR' || (parsed.crashes && parsed.crashes.length)) {
        const fam = (parsed.crashes && parsed.crashes[0] && parsed.crashes[0].family) || 'a rule';
        out({
          decision: 'block',
          reason: `builds/${slug} changed and the checker CRASHED on it (${fam} family) - ` +
            `its result is unknown, and unknown is not a pass. Run ` +
            `node checks/run.mjs builds/${slug}/site --facts builds/${slug}/facts.md, read ` +
            `the ERROR, fix the input (or the checker, with a fixture), and re-verify.`,
        });
      }
      const blockers = (parsed.counts && parsed.counts.blocker) || 0;
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

    const builds = listBuilds().filter((s) => existsSync(join(buildsDir, s, 'STATE.md')) && !isDormant(s));
    if (builds.length) {
      const lines = builds.map((s) => `  builds/${s}/ -> ${isLaunched(s) ? 'LIVE - any change is a round (stages/08_revise/CONTEXT.md). ' : ''}${nextActionOf(s)}`).join('\n');
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
      `- into drop/ (it is in the repo root, sorted into logo/photos/brand/fonts/docs/` +
      `reference, and the next asset scan moves it into the build) or straight into ` +
      `builds/<slug>/_intake/. Then the interview from ` +
      `stages/01_discover/questions.md (question 0, part V, then the facts).\n` +
      `  3. ASK QUESTION 57b - what trade is this, in the regulator's words? Nobody volunteers ` +
      `it, and for some trades the law names the WEBSITE: a letting agent must publish its fees ` +
      `on it, a law firm its prices and complaints route, an aesthetics clinic may not name or ` +
      `price Botox at all. Write the answer as a | Sector | <id> | row in facts.md. ` +
      `node checks/run.mjs --sectors lists what is researched; "none" is a real answer and most ` +
      `trades' answer, but it is an ANSWER, not a silence.\n` +
      `  4. Write brief.md + facts.md and STOP for the human's yes.\n` +
      `Site files are hook-blocked until brief.md, facts.md and design.md exist. "Just ` +
      `build it" means asking the smallest set of unguessable questions, not skipping ` +
      `them (AGENTS.md rule 1).`);
  }

  // ------------------------------------------------------------------ session
  if (event === 'session') {
    const builds = listBuilds().filter((s) => existsSync(join(buildsDir, s, 'STATE.md')) && !isDormant(s));
    const config = existsSync(join(root, 'config.md'))
      ? '' : ' config.md does not exist - stage 00 setup has never run (one minute, stages/00_setup/CONTEXT.md).';

    // The studio layer's one mechanical moment. `studio/` is opt-in and
    // git-ignored, and its stage-06 write-back was pure instruction: "append the
    // direction that shipped, and what they said". An instruction that fires
    // while an agent is mid-conversation with a human who just gave a verdict is
    // the exact shape of rule this repo has watched reach zero adherence. So the
    // NEXT session opens by naming the builds that verified and never made it
    // into the log. Only for people who started the layer - silent otherwise,
    // and never blocking: a nudge that stops work would get the layer deleted.
    let studioGap = '';
    try {
      const dirLog = join(root, 'studio', 'directions.md');
      if (existsSync(dirLog)) {
        const logged = readFileSync(dirLog, 'utf8');
        const unlogged = listBuilds().filter((s) => !isDormant(s)
          && existsSync(join(buildsDir, s, 'verify.md'))
          && !logged.includes(s));
        if (unlogged.length) {
          studioGap = ` studio/directions.md has no row for ${unlogged.slice(0, 3).map((s) => `builds/${s}`).join(', ')}` +
            `${unlogged.length > 3 ? ` +${unlogged.length - 3} more` : ''} - verified, never logged, so the ` +
            `gravity-well check (node checks/studio.mjs) is scoring fewer builds than you have built.`;
        }
      }
    } catch { /* fail open - the layer is optional and so is this line */ }

    if (builds.length) {
      const lines = builds.map((s) => `  builds/${s}/ -> ${isLaunched(s) ? 'LIVE - any change is a round (stages/08_revise/CONTEXT.md). ' : ''}${nextActionOf(s)}`).join('\n');
      say(`[website-builder] This folder builds websites through a nine-stage contract ` +
        `(AGENTS.md). Active build(s):\n${lines}\nResume from STATE.md, not from memory.` +
        config + studioGap);
    }
    say(`[website-builder] This folder builds websites through a nine-stage contract ` +
      `(AGENTS.md). No build is open. A build request starts with node start.mjs ` +
      `"<name>" and stage 01 discover - the vision-and-facts interview - never with ` +
      `code.${config}${studioGap}`);
  }

  pass();
} catch {
  pass(); // a broken hook must never block work
}
