# Stage 06 — Verify

**Two halves, and the second one is the one people skip.**

The machine half is `checks/run.mjs`. It is fast, it is repeatable, and its verdict is not
negotiable. The rendered half is everything a static file reader cannot see, which is most
of what makes a site good.

Reporting only the machine half is how a build gets called "verified" when nobody has looked
at it. That is the specific failure this stage is shaped to prevent.

◆ **This is a stop.** The human approves before anything is promoted or deployed.

---

## Inputs

- `builds/<slug>/site/` — the build.
- `builds/<slug>/facts.md` — for provenance.
- `builds/<slug>/brief.md` — for the trace-back at the end.
- `../../shared/design.md` — for the judgment items.
- `../../shared/review.md` — the ladder (who renders), the composition method, the sweep.

## Process

### Part 1 — the machine

```
node checks/run.mjs builds/<slug>/site --facts builds/<slug>/facts.md
```

**Read three things, in this order:**

1. **The path it scanned.** Confirm it is the build you mean. A checker pointed at last
   week's folder prints a beautiful PASS about the wrong site, and the exit code cannot tell
   you that. This is why there is no default argument.
2. **The blocker count.** Non-zero means the build does not ship. Fix the cause and re-run.
   Never `--skip` a family to make a number go away; if a finding is genuinely wrong that is
   a bug in the checker, and the fix is a rule change plus a fixture that proves it.
3. **The skipped list.** A skipped gate is not a passed gate. If it says the facts gates could
   not run, then nothing has checked whether the site invents things, and you must say so
   rather than let the PASS imply otherwise.

Then triage the majors. Each is a real defect; some are acceptable with a reason, and the
reason goes in `verify.md`. "Left as-is" with no reason is not triage.

### Part 2 — the rendered half

Take the **highest rung of the ladder** in `../../shared/review.md` §1: a browser tool in
the harness renders and screenshots it; otherwise a wired-in Playwright; otherwise the
human's eyes with you directing precisely. Whichever ran is recorded in `verify.md` by
name — a rung that did not run is never reported as if it had.

The following cannot be checked any other way, and each is a thing that has shipped past a
green checker.

**Look at it (1280×800, then drag the window down to 320px)**

- [ ] **Does the empty space do anything?** The open side of an asymmetric hero, the band
      under a CTA. Real negative space is *held* by something: a rule, an index, a figure,
      oversized type bleeding in. A hero whose right third is simply void is the clearest
      "filled in the template and stopped" signal there is. Empty is not the same as negative
      space.
- [ ] **Do the sections have different shapes**, or is it one layout repeated with different
      words? A page needs at least two genuinely distinct section archetypes. Two identical
      splits back to back is the mild version of the same failure.
- [ ] **Is the recurring motif rationed?** If the eyebrow kicker prefixes most headings, it
      has become the pattern it was meant to escape, just in costume.
- [ ] **Does the design's stated point of view survive contact with the pixels?** If the
      direction is called "Editorial" and there is no measure discipline, the label is doing
      work the page is not. Re-earn it or rename it.
- [ ] **Is it still the site from `design.md`?** Tokens verbatim, samples direction
      honoured, each reference card's steal visible where the spec put it.
- [ ] **Would a competent studio ship this?** Not "is it inoffensive". Would someone sign it.

Write the per-section `HELD`/`FIX` verdicts per `../../shared/review.md` §2 — the written
trail is the proof the looking happened.

**Use it**

- [ ] Tab through every page from the top. Can you see where you are, on every single stop?
- [ ] Reach every menu, accordion and modal with the keyboard alone, and get back out.
- [ ] **Hover with intent:** nothing fades out or vanishes when hovered; nothing important
      exists *only* behind a hover (touch has no hover); the primary CTA sits still rather
      than chasing the scroll.
- [ ] **Scroll honestly:** content is present without waiting for scroll-triggered fades;
      the next section peeks above the fold; nothing hijacks the wheel.
- [ ] Read it at 400% zoom. Does it reflow, or does it scroll sideways?
- [ ] Turn on the OS "reduce motion" setting and reload. Does anything still move?
- [ ] Click every navigation item and every footer link. All of them.
- [ ] On a real phone if you have one, not just a narrow window. The two are not the same.

**Read it**

- [ ] Read the whole site out loud. The paragraphs that are hard to say out loud are the ones
      that were written to fill a space.
- [ ] Pick any three paragraphs. Could they appear, unchanged, on a competitor's site? If yes,
      they say nothing.
- [ ] Check every number against `facts.md` yourself. The gate proves each claim has a row.
      It cannot prove the row is true, and you are the last person who will look.

**Trace back**

- [ ] Re-read `brief.md` — the Vision section especially. Is this the site that was asked
      for, the one they could see in their head, or a competent answer to a different
      question? This is the check that catches a build that is good and wrong.

### Part 3 — write it down

`verify.md` records: the gate output verbatim, every major and what was decided about it,
which review rung ran, the per-section composition verdicts, the human checklist with real
ticks, and the named verdict.

**A verdict is one of three words and nothing else:**

- **PASS** — ships.
- **REVISE** — named findings, back to the owning stage, re-verify after.
- **FAIL** — the build does not answer the brief. Back to stage 01 or 04.

"Looks good" is not a verdict. A stage-06 output with no verdict means the stage did not run.

## The trade half

If the build declares a `Sector`, the gate has already applied that trade's duties — but the
`sector/human-confirm` findings are addressed to **you**, not to the checker, and they are minors
only because a file cannot rule on them. Several are the most consequential things in the run:

- Is every registration or licence number on the site **current today**, checked in the regulator's
  own free register rather than against what the client remembered? A lapsed number published as
  current is a representation a regulator can act on, and the site is the publication.
- Do the regulator's permissions actually cover **everything the homepage advertises**?
- If insurance is claimed anywhere, has somebody seen the certificate?

Answer each one in `verify.md` in a sentence. "Confirmed with the client" is an answer;
silence is not.

## Outputs

- `builds/<slug>/verify.md`
- `STATE.md` updated
- **`studio/` updated, if it exists** — append the direction that actually shipped to
  `directions.md` (it is now on screen, not merely chosen), and every verdict the human
  gave to `rejections.md`, **in their words, at the time**. A day later it is your
  diagnosis in their voice, which is the version you will most want to re-examine and the
  one you can no longer trust. See `../../studio/README.md`; negatives and process only,
  never a look to repeat.

## Verify before you stop

- [ ] The scanned path in the gate output is this build.
- [ ] **Zero blockers. Not "zero blockers or a note explaining them".**
      An earlier version of this line said "or an explicit human decision recorded
      against each remaining one", which quietly contradicted rule 4 in
      `AGENTS.md` — and it did so in the checklist a person actually follows
      rather than the contract they read once. A blocker is fixed or the finding
      is a bug in the checker. There is no third path, and the exit code is the
      verdict.
- [ ] Majors are triaged: each one either fixed, or left with a written reason.
      "Left as-is" with no reason is not triage.
- [ ] The verdict line was **not** produced by a scoped run. `--only` and `--skip`
      print PARTIAL rather than PASS for exactly this reason; if `verify.md`
      quotes a PARTIAL, the stage did not finish.
- [ ] Every skipped gate is named in `verify.md`, not silently absent.
- [ ] The rendered half was actually done — by a browser tool, a Playwright, or a human —
      and `verify.md` names which rung.
- [ ] There is a named verdict.
