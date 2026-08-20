# Changelog — <business name>

<!-- The record of every change made to this site AFTER it first shipped.
     One entry per round, newest first. `node checks/round.mjs builds/<slug>`
     checks its shape and tells you whether a round is open.

     This is NOT the repo's own CHANGELOG.md at the root — that one records what
     changed in the tool. This one records what changed in THIS client's site,
     and it is written for them: they should be able to read it and recognise
     their own words.

     A round is OPEN while the work is happening and SHIPPED once the gate has
     run and the change is live. Exactly one round may be open at a time.

     Four fields, and the first one is the one that matters:

       **Asked:**        what they said, in THEIR words. Not your summary of
                         the problem, not the fix you decided on. The sentence
                         they actually used is the thing you will need in six
                         months when the next request contradicts it.
       **Changed:**      what you did, file by file where it helps.
       **Not changed:**  what you deliberately left, and why. A designer who
                         changes everything asked for is a pair of hands; the
                         reason you did not move something is the advice they
                         are paying for.
       **Gate:**         the checker's verdict for this round, run after the
                         change: PASS / REVISE / FAIL and the blocker count.

     Roll back a round with the git tag stage 08 writes: `git tag` in this
     folder lists them (round-0, round-1, ...), and `git checkout round-1 -- site/`
     puts the previous state back without losing the history of how you got here. -->

## Round 0 — OPEN — <YYYY-MM-DD>

**Asked:** the original build — see `brief.md` for what they asked for.
**Changed:** the site, from nothing.
**Not changed:** n/a
**Gate:** <run it at stage 06 and record the verdict here>
