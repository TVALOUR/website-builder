// website-builder — the discovery gate's own test.
//
//   node checks/brief-cases.mjs        run it directly
//   (checks/selftest.mjs imports and runs it too)
//
// A gate on discovery is worth exactly what it costs to fool. Both of these
// happened on a shipped version:
//
//   * 277 words of lorem ipsum plus ONE line of keyword bait scored
//     "PASS — the brief carries substance in all 14 sections and every blocking
//     question is addressed", exit 0.
//   * A genuinely thorough 900-word interview brief — real client, real
//     refusals, real anti-vision — reported twelve sections "not there at all".
//
// Both came from the same place: the section check matched HEADINGS and the
// blocking check scanned the WHOLE DOCUMENT, so the template's own instructions
// answered its own questions, and a brief that used different headings scored
// nothing.
//
// Zero dependencies. Node 18+.

import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor '
  + 'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud. ';

const SALAD = '_intake remak must not feel colour limited sell service price hour area phone '
  + 'qualif logo font photo right edit visitor motion imagery domain existing site do five-second.';

export const REAL = `# Brief — Colwell Plumbing

## Project regime
A real business. Ben Colwell trades as a sole trader, no limited company, has done since 2013.

## Goal
More emergency callouts from landlords in Columbus, and fewer "can you quote for a whole bathroom"
calls, which he turns down four times a week.

## Audience
Landlords and letting agents, almost all on a phone, ringing because water is coming through a
ceiling right now. They want to know he can come today and roughly what it costs.

## Vision
Handed over: two photos of the van in _intake/, and the logo as a PNG off an old invoice.
Remaking: none — he has never had a site. References: he likes rotoroot.com "because you can tell
they are real people". Anti-vision: "nothing that looks like a franchise". Five seconds: they must
know he covers Columbus and can come today, and feel he will actually turn up. Feel: plain, quick,
local. Colour: the blue on the van, eyedropped from the photo. Type: no opinion, show options at 04.

## Voice
Direct, unfussy, a bit dry. His words: "I'd rather tell you it's a two-hour job than pretend."

## Scope
Home, services, service area, contact. Four pages.

## Features
Home: ring him. Services: see what he does and roughly what it costs. Area: check he covers you.
Contact: ring him again. Enquiries go to ben@ — the inbox he opens daily. Not editable by him;
static, every change is a developer job, and he knows. No booking, no payments, no accounts.
No analytics, so no banner. Opening hours displayed, not "open now" — he works odd hours.

## Must-have and must-avoid
Must have the emergency number above the fold on every page. Must avoid stock photos of plumbers.

## Brand and assets
Logo: PNG only, no vector. Fonts: none held. Photos: two of the van, he took them himself and
confirmed in writing we can publish them. No photos of customers' houses — he was clear about that.

## Market and jurisdiction
- **Profile:** us
- **Sector:** none — Ohio licenses electricians and plumbers, and nobody licenses gutter cleaning.
  Checked against the sector list; unregulated, and now on the record as an answer
  somebody gave rather than a question nobody asked.
Trades under Ohio, registered nowhere else, all customers in Franklin County. English. USD, dates
spelled with the month.

## Motion and imagery
- **Motion:** none
- **Imagery:** client-assets-only

## Stack, host and domain
Static. Host: Cloudflare Pages. Domain: he owns colwellplumbing.example through GoDaddy and has the
login. No existing site. Email runs on Google Workspace on that domain.

## Assumptions
Assumed he wants the phone number as the primary call to action rather than a form; he has not said
so in those words. Assumed no service-area map, since he named the county.

## Open questions
[NEEDS: his actual callout charge — he says "depends" and I have pushed once]
`;


export const CASES = [
  ['lorem-with-keyword-bait', false,
    `# Brief — Test\n\n`
    + ['Project regime', 'Goal', 'Audience', 'Vision', 'Voice', 'Scope', 'Features',
      'Must-have and must-avoid', 'Brand and assets', 'Market and jurisdiction',
      'Motion and imagery', 'Stack, host and domain', 'Assumptions', 'Open questions']
      .map((h) => `## ${h}\n\n${LOREM}${LOREM}\n`).join('\n')
    + `\n${SALAD}\n`],
  ['keyword-salad-only', false, `# Brief — Test\n\n## Vision\n\n${SALAD}\n`],
  ['empty', false, '# Brief — Test\n'],
  ['a real brief', true, REAL],
];

export function runBriefCases() {
  const results = [];
  for (const [name, shouldPass, body] of CASES) {
    const dir = mkdtempSync(join(tmpdir(), 'wb-brief-'));
    try {
      writeFileSync(join(dir, 'brief.md'), body);
      writeFileSync(join(dir, 'facts.md'), '| Fact | Value | Source |\n|---|---|---|\n| Phone | (614) 221-9876 | client, 2026-08-14 |\n');
      const r = spawnSync(process.execPath, [join(root, 'checks', 'brief.mjs'), dir, '--json'],
        { cwd: root, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
      let j = null;
      try { j = JSON.parse(r.stdout); } catch { /* below */ }
      const passed = j?.ok === true;
      results.push({
        name, ok: passed === shouldPass, expected: shouldPass,
        detail: j
          ? `missing=${(j.missingSections || []).length} thin=${(j.thinSections || []).length} `
            + `unanswered=${(j.unansweredBlocking || []).length} filler=${(j.fillerProblems || []).length} `
            + `diversity=${j.lexicalDiversity}`
          : `no JSON (exit ${r.status})`,
      });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  return results;
}

if (process.argv[1] && process.argv[1].endsWith('brief-cases.mjs')) {
  console.log('\ndiscovery gate — what passes and what does not\n');
  let bad = 0;
  for (const r of runBriefCases()) {
    if (!r.ok) bad++;
    console.log(`  ${r.ok ? 'ok  ' : 'FAIL'}  ${r.name.padEnd(26)} ${r.expected ? 'must PASS' : 'must FAIL'}   ${r.detail}`);
  }
  console.log(bad ? `\n  ${bad} mismatch(es)\n` : `\n  all ${CASES.length} cases correct\n`);
  process.exit(bad ? 1 : 0);
}
