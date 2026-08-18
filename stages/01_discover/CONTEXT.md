# Stage 01 — Discover

**Find out what is actually true about this business, and write it down with sources.**

This is the stage the whole repo exists for. Every other stage is craft. This one is the
difference between a website *about this business* and a website about businesses like it.

◆ **This is a stop.** You do not proceed to stage 02 until a human has read `brief.md` and
said yes.

---

## Inputs

- Anything the client supplied: a brief, an email, photos, a logo, an old site. Put it in
  `builds/<slug>/_intake/` first.
- The human in this conversation.
- `../../config.md` — your defaults, written by stage 00 from `../../config.example.md`.
- `questions.md` — the question bank (Layer 3). **Read it. Do not improvise the interview.**
- `../../shared/writing.md` — so the brief is written against the bar from the start.

## Process

### 1. Open the build

Create `builds/<slug>/` with a `STATE.md` from `../../templates/STATE.md`. `<slug>` is
kebab-case from the business name. If the folder already exists, you are resuming: read
`STATE.md` and continue from its `Next action`.

### 2. Read the intake before you ask anything

If `_intake/` has files, read every one before opening your mouth. Asking a client something
they already put in writing is the fastest way to look like you did not read it.

- Text documents, `.md`, `.txt`, `.docx`: read directly.
- A scanned PDF: render pages to images and read those. Do not skip it because it is awkward.
- Images: look at them. A logo tells you the palette, the type, and often the whole tone.

**Tag every fact you extract with where it came from** (`[brief.pdf p2]`, `[their email
2026-01-09]`). That tag becomes the Source column in `facts.md`, and unsourced is the same
as invented.

### 3. Interview

Work through `questions.md`. It is grouped, and each group says what breaks when it goes
unasked. You do not have to ask all of it, and you do have to ask everything marked
**BLOCKING** — those are the ones where guessing means inventing something about a real
business or shipping a legal exposure.

How to run it so it is not an interrogation:

- **Batch.** Six questions in one message, not six messages. A client answering an
  interrogation gets shorter with every reply.
- **Lead with why.** "What are your actual prices? I ask because if you don't tell me, an AI
  will make some up, and I have seen it happen." People answer that. They do not answer
  "Please provide pricing information."
- **Take the answer you get.** "It depends" is a real answer about pricing and it goes in
  `facts.md` as "priced per job, no published figure" — which then stops stage 03 inventing
  a number to fill the gap.
- **Push once on the ones that matter.** If the answer to "do you have a logo" is "somewhere",
  ask them to find it. A real logo changes the whole design and a recreated one is a lie
  about their identity.

### 4. Write `facts.md`

Every factual claim that will appear on the site, in a table, with a source. Copy the shape
from `../../examples/clean-control/facts.md`.

Rules for this file, and they are the point of the stage:

- **A row with no Source is not a row.** Delete it or go and ask.
- **A gap stays a gap.** Write `[NEEDS: opening hours]` and leave it. The gate refuses to
  ship a build whose `facts.md` still contains one, which is deliberate: it converts "we
  never got round to asking" from a thing that silently becomes fiction into a thing that
  blocks a launch.
- **Record what is deliberately absent, and why.** No testimonials because nobody has given
  written permission. No star rating because there is no review platform. This section stops
  a later session "helpfully" adding them back.
- **Third-party facts count too.** If the privacy notice cites the ICO helpline, that number
  goes in the table with a source, because a wrong one is still wrong.

### 5. Write `brief.md`

Short. Decision-dense. Everything downstream cites it.

- **Goal** — the one outcome. Not "an online presence": *more enquiries for remedial work
  from vets, rather than more general shoeing*.
- **Audience** — who visits, on what device, worried about what.
- **Voice** — 3 to 5 adjectives, and one sentence of theirs you would be happy to quote.
- **Scope** — the rough page list. Refined in stage 02.
- **Must-have / must-avoid** — including anything they hate. "My last site was purple" is
  load-bearing.
- **Brand** — logo, colours, **fonts and whether they are licensed for web use**, photos, and
  whether the photos are theirs to publish.
- **Stack and host** — and who owns the domain today.
- **Assumptions** — everything you defaulted rather than asked, listed so the human can
  correct it in one pass.
- **Open questions** — every `[NEEDS:]`, gathered.

### 6. Stop

Present `brief.md` and the `[NEEDS:]` list. Ask for corrections. Do not start stage 02 on
"looks good" alone if the open-questions list is non-empty: name what is still missing and
what you will do about each one.

## Outputs

- `builds/<slug>/facts.md`
- `builds/<slug>/brief.md`
- `builds/<slug>/STATE.md` updated: stage 01 done, stage 02 next.

## Verify before you stop

- [ ] Every claim in `brief.md` traces to a row in `facts.md` or is marked as an assumption.
- [ ] `facts.md` has no row without a Source.
- [ ] Every **BLOCKING** question in `questions.md` is answered or explicitly refused, with
      the refusal recorded.
- [ ] You have not written a single service, price, credential or opening time the client did
      not give you.
- [ ] The "deliberately absent" section exists, even if it is short.
