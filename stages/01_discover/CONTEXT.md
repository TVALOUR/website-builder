# Stage 01 — Discover

**Find out what is in their head and what is true about their business, and write both
down — the vision with dissected references, the facts with sources.**

This is the stage the whole repo exists for. Every other stage is craft. This one is the
difference between *their* website and *a* website: the facts half stops the model
inventing a business, and the vision half stops it defaulting a design nobody chose.

◆ **This is a stop.** You do not proceed to stage 02 until a human has read `brief.md` and
said yes.

---

## Inputs

- Anything the client supplied: sketches, screenshots, a brief, an email, photos, a logo,
  reference URLs, an old site. It goes in `drop/` (repo root, sorted, and the folder they
  can use before a build exists) or straight into `builds/<slug>/_intake/`. **Check `drop/`
  before you ask anything** — `node assets.mjs` lists what is waiting there.
- The human in this conversation.
- `../../config.md` — your defaults, written by stage 00 from `../../config.example.md`.
- `questions.md` — the question bank, 73 questions across ten parts (Layer 3). **Read it. Do
  not improvise the interview.**
- `../../shared/references.md` — how a dropped reference becomes a dissected card.
- `../../shared/writing.md` — so the brief is written against the bar from the start.

## Process

### 1. Open the build

```
node start.mjs "<project name>"
```

It creates `builds/<slug>/` with `STATE.md` and `_intake/`, and prints these orders. If the
folder already exists, you are resuming: read `STATE.md` and continue from its `Next
action`.

### 2. Open the asset desk and give them a path

```
node assets.mjs <slug> scan
```

It moves anything sitting in `drop/` into `builds/<slug>/_intake/`, creates
`builds/<slug>/assets/{logo,photos,brand,fonts,docs,reference}/`, indexes everything that landed,
and writes `assets/MANIFEST.md` — one row per file, with columns for where
it came from, whether it is the client's to publish, whether it was generated, where it is used and
what its alt text is.

**That manifest is a gate, not a note.** The site gate refuses to publish an image with no row, no
Source or no answer in Rights. Re-run `scan` whenever new material lands; it never overwrites a
filled cell.

Then give the client an **absolute path** to put things in — `start.mjs` prints both. `drop/` is
usually the one to say out loud: it is sorted into six named folders, it is the same path on every
build, and it works before this build existed. A named folder is an answerable ask; "send me your
stuff" is not, and the difference shows up in what arrives.

### 3. Collect and read the intake before you ask anything

**Ask for artifacts first** (question V1): sketches — a photo of paper is fine —
screenshots, reference sites, the logo, brand fonts and colours, the old site, any leaflet
or sign or card they already use. Into `drop/` (or this build's `_intake/`). One dropped
sketch answers twenty questions, and asking a client something they already put in writing
is the fastest way to look like you did not read it.

Then read every file in `_intake/`:

- Text documents, `.md`, `.txt`, `.docx`: read directly.
- A scanned PDF: render pages to images and read those. Do not skip it because it is awkward.
- Images and sketches: look at them. A logo tells you the palette, the type, and often the
  whole tone. A sketch is a layout decision the client already made — treat it as one.

**Tag every fact you extract with where it came from** (`[brief.pdf p2]`, `[their email
2026-01-09]`, `[sketch photo]`). That tag becomes the Source column in `facts.md`, and
unsourced is the same as invented.

### 4. Interview

Work through `questions.md`, in its order: **question 0** (real business, or
personal/demo/fiction — it decides which parts bind), then **part V** (the vision), then
parts A–J as the regime requires. The parts, so you know what you are committing to:

| | | |
|---|---|---|
| **A** the business | **B** customers | **C** facts that reach the page |
| **D** brand and materials | **E** the assets themselves, and the rights to them | **F** features - what a visitor must be able to DO |
| **G** market, language and money | **H** motion and imagery | **I** domain and hosting |
| **J** process | | |

Three of those (E, F, G) exist because a real build reached the point of asking a client to pick a
legal jurisdiction from a two-item menu having never asked for a brief, an image, an asset or a
feature. The bank was not the problem; the parts that were missing were missing. You do not have to ask everything, and you do have to ask
everything marked **BLOCKING** — those are the ones where guessing means inventing
something about a real business, defaulting a design nobody chose, or shipping a legal
exposure.

How to run it so it is not an interrogation:

- **Batch.** Six questions in one message, not six messages. A client answering an
  interrogation gets shorter with every reply.
- **Lead with why.** "What are your actual prices? I ask because if you don't tell me, an AI
  will make some up, and I have seen it happen." People answer that. They do not answer
  "Please provide pricing information."
- **Show, don't interrogate.** Never ask a design-vocabulary question of someone without
  the vocabulary. "No opinion" on colour or type is a first-class answer: record it, and
  the stage-04 stop will show them **rendered options** to pick between instead.
- **Take the answer you get.** "It depends" is a real answer about pricing and it goes in
  `facts.md` as "priced per job, no published figure" — which then stops stage 03 inventing
  a number to fill the gap.
- **Question 57 is not optional and has no default.** Which country the business trades under
  picks the legal profile. If `profiles/` has no file for it, research one before stage 03 writes a
  legal page (`profiles/README.md` — one pass), or use `intl-baseline` and say so to the client.
  Never substitute the nearest country.
- **Push once on the ones that matter.** If the answer to "do you have a logo" is
  "somewhere", ask them to find it. A real logo changes the whole design and a recreated
  one is a lie about their identity. Same for the site they are half-remaking (V2): if it
  exists, get the URL.

### 5. Dissect the references

Every reference that surfaced — the remake target, the three-they-like, the one-they-hate,
any screenshot in `_intake/` — becomes a card in `builds/<slug>/references.md` per
`../../shared/references.md`: what grabbed them, the DNA (type, colour, structure, motion),
and a steal / adapt / leave verdict. Do it now, while their words are fresh — stage 04
consumes the cards, and a card written at drop time beats one reconstructed later.

No web access? Ask for screenshots instead; a bare URL nobody can see parks as
`[NEEDS: screenshot]`, never a guessed verdict.

### 6. Write `facts.md`

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
- **A fictional project declares itself.** Its rows are sourced "invented for this demo
  (declared)", the site carries a visible declaration, domains are reserved (`.example`)
  and phone numbers come from a drama range. Honesty about being fiction is the fiction
  regime's whole obligation.

### 7. Write `brief.md`

Short. Decision-dense. Everything downstream cites it.

- **Project regime** — real business, or personal/demo/fiction (question 0).
- **Goal** — the one outcome. Not "an online presence": *more enquiries for remedial work
  from vets, rather than more general shoeing*.
- **Audience** — who visits, on what device, worried about what.
- **Vision** — the part V harvest: what they handed over (and where it sits in `_intake/`),
  the remake target if any, one line per reference card with its axis, the anti-vision
  ("never purple, nothing corporate"), the five-second answer (what a visitor must know and
  feel), the three feel-words, and the colour/font state — exact values, a source to take
  them from, or "no opinion, show rendered options at 04". Every axis is either *supplied*,
  *delegated-by-choice*, or *open* — never silently defaulted.
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

### 8. Check it, then stop

Present `brief.md` — the Vision section first, read back in their own words — and the
`[NEEDS:]` list. Ask for corrections. Do not start stage 02 on "looks good" alone if the
open-questions list is non-empty: name what is still missing and what you will do about
each one.

### 8b. Run the checker before you present anything

```
node checks/brief.mjs builds/<slug>
```

It answers one question: is there enough decided, client-supplied substance here that the next six
stages will not have to invent anything? Every section it names is a **question to go and ask** —
not a box for you to fill in yourself. On Claude Code the pre-write hook runs the same check, so a
thin brief blocks site files rather than quietly producing a default site.

It cannot tell you whether the answers are TRUE. That gap closes at stage 07, when a human reads
`facts.md` back to the client.

## Outputs

- `builds/<slug>/facts.md`
- `builds/<slug>/brief.md`
- `builds/<slug>/references.md` — one dissected card per reference (omit only if the
  interview genuinely surfaced none, and then the brief says so)
- `builds/<slug>/assets/MANIFEST.md` — one row per asset, with rights and source
- `builds/<slug>/STATE.md` updated: stage 01 done, stage 02 next.

## Verify before you stop

- [ ] Question 0 was asked and the regime is recorded in `brief.md`.
- [ ] The artifact ask (V1) happened before the questioning, and everything handed over is
      in `_intake/` and reflected in the brief.
- [ ] Every reference that surfaced has a card in `references.md`, each with the axis that
      grabbed them — or the brief records "no references supplied, direction delegated".
- [ ] The brief's Vision section leaves no axis silently defaulted: colours, type, feel and
      anti-vision are each supplied, delegated-by-choice, or listed open.
- [ ] Every claim in `brief.md` traces to a row in `facts.md` or is marked as an assumption.
- [ ] `facts.md` has no row without a Source.
- [ ] Every **BLOCKING** question in `questions.md` is answered or explicitly refused, with
      the refusal recorded.
- [ ] You have not written a single service, price, credential or opening time the client did
      not give you.
- [ ] The "deliberately absent" section exists, even if it is short.
- [ ] `node checks/brief.mjs builds/<slug>` exits 0.
- [ ] Every asset the build intends to publish has a manifest row with a Source and a Rights
      answer, in the client's own words. `node assets.mjs <slug> check` lists what is outstanding.
- [ ] The brief records `- **Profile:**`, `- **Motion:**` and `- **Imagery:**` explicitly, even
      where they are the defaults. A recorded default is a decision; an absent one is an accident.
- [ ] Question 57 was answered by the client, and a profile exists for that country.
