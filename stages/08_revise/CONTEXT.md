# Stage 08 — Revise

Change a site that is already live, on the record, without quietly undoing the thing that
made it good.

◆ **This is a stop at both ends.** The human says what they want changed, and the human
says when it goes live. What happens in between is a **round**.

## Why this stage exists

The pipeline used to end at stage 07, and the hook stopped policing a build the moment its
`STATE.md` said `LAUNCHED`. Both were deliberate, and both were wrong in the same place.
Launch is not the end of the relationship — it is the beginning of the part where somebody
edits a page the public is already looking at, with no interview, no gate and no record.

Every "can you just make the hero smaller" after go-live went through no stage at all. This
is that stage.

It is also the difference between a tool and a designer. A tool does what it is asked. A
designer keeps a record of what they were asked, does the part that helps, says out loud
what they did not do and why, and notices when the fourth request in a row is really the
same complaint wearing different clothes.

## When this runs, and when it does not

| The request | Where it goes |
|---|---|
| Any change to a site that has shipped or been handed over | **here** |
| A change mid-build, before launch | the stage that owns it — 03 for copy, 04 for design, 05 for build |
| A whole new page or section | here to open the round, then **02 → 05 in miniature**: it needs a sitemap decision, copy, a design that fits the locked direction, and the gate |
| A new fact, price, testimonial or claim | here — **and it needs a sourced row in `facts.md` first**, exactly as it would have at stage 01. Rule 2 does not expire at launch |

## Inputs

- `builds/<slug>/CHANGELOG.md` — the round record. Seeded by `start.mjs`.
- `builds/<slug>/design.md` — the locked direction, and the alternatives that were
  rejected. Read the rejected list before you agree to anything: the request in front of
  you is sometimes one of them coming back.
- `builds/<slug>/brief.md` · `facts.md` · `content.md` · `verify.md`.
- `../../studio/` if it exists — the standing floor and the rejection ledger. A thing this
  human has rejected twice before does not need rejecting a third time from scratch.

## Process

### 1. Open the round BEFORE you touch anything

Add a heading at the top of `builds/<slug>/CHANGELOG.md`:

```
## Round <N> — OPEN — <today>

**Asked:** "<their words, verbatim>"
```

Verbatim is the whole point, and it is the field people are most tempted to improve. *"The
hero feels shouty"* is worth more in six months than *"client requested reduced heading
weight"*, because the second one is already your diagnosis, and your diagnosis is the thing
you will want to re-examine when the next request contradicts it.

`node checks/round.mjs builds/<slug>` checks the shape. The Claude Code hook reads the same
file: on a launched build, **site files are blocked until a round is open**.

### 2. Work out what they are actually asking for

One pass, out loud, before any edit:

- **Is this a fact, a taste, or a fault?** A fault (broken link, wrong price, overflow on a
  phone) gets fixed and does not need a debate. A fact needs a sourced row. A taste is a
  conversation, and it is the only one of the three where "no" is sometimes the right
  answer.
- **Does it fight the locked direction?** `design.md` holds one argument and the choices
  that serve it. A request that contradicts it is not a small edit — it is a proposal to
  change the argument. Say so, offer the version of their request that the direction *can*
  hold, and let them choose. Drifting halfway is how a site that had a point becomes a site
  that had one.
- **Is it the same complaint again?** Look back through the rounds. **Three rounds circling
  one area means the design is wrong there, not the detail** — stop patching and re-open
  stage 04 for that section. Say that plainly; it is the most valuable sentence in this
  stage and the one an eager tool never says.

### 3. Make the change on a copy that the gate has seen

Never edit the live files first. Work in `builds/<slug>/site/`, run the checker, then ship
what passed. The gate applies to a round exactly as it applied to the build:

```
node checks/run.mjs builds/<slug>/site --facts builds/<slug>/facts.md
```

Rules 2, 5, 6, 7, 8 and 9 all still bind. A testimonial that arrives by text message after
launch still needs a row. A photograph of somebody else's workshop is still not theirs. The
jurisdiction and trade duties are still the ones in the profile.

### 4. Write down what you did *not* change

`**Not changed:**` is the field that makes this a design service. If they asked for five
things and one of them would hurt them — the phone number moved off the header on a site
whose visitors are standing in a car park with a leak — you do the four, you leave the
fifth, and you say why in one sentence. Then it is a decision they can overrule rather than
something you silently ignored.

If they overrule you, do it, and record that they did. **Their site.**

### 5. Close the round

- Run the gate. Put the verdict in `**Gate:**` — `PASS, 0 blockers`, and the count if not.
- Flip the heading from `OPEN` to `SHIPPED`.
- Tag it in the build's own git repo, so the round can be undone as a unit:
  ```
  cd builds/<slug> && git add -A && git commit -m "round <N>: <what they asked>" && git tag round-<N>
  ```
  Rolling back is then `git checkout round-<N-1> -- site/` — which restores the files
  without erasing the record of why they changed, unlike editing the page back by hand.
- Update `STATE.md`: `LAUNCHED`, plus one line saying which round shipped and when.
- If `studio/` exists and this round taught you something durable about how this human
  works — a phrase they use for a problem, a thing they always want, a thing they never
  want — add it there per `../../studio/README.md`. **Negatives and process only, never a
  look to repeat.**

## Outputs

- `builds/<slug>/CHANGELOG.md` — the round, SHIPPED, with a gate verdict
- the changed site files, gated
- a `round-<N>` tag in the build's git repo
- `STATE.md` updated

## Verify before you stop

- [ ] The round was opened before the first edit, not written up afterwards.
- [ ] `**Asked:**` is their words, not a summary of them.
- [ ] Every new fact on the page has a sourced row in `facts.md`.
- [ ] The gate ran **after** the change and its verdict is in the round.
- [ ] Anything you declined is written down with the reason, in one sentence.
- [ ] `node checks/round.mjs builds/<slug>` is clean.
- [ ] If this was the third round in one area, you said so.
