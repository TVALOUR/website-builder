# studio/ — what persists between builds

Everything else in this repo is per-build by construction. `references.md` starts empty
every time; `design.md` is read back only to make the *next* site different. That is
deliberate, and `shared/references.md` says why: stacking one client's taste onto the next
is how every site a system builds ends up resembling the last one it built.

This folder is the one exception, and it is a narrow one.

## The distinction that makes it safe

There are two people in a build, and only one of their tastes may travel.

- **The client's taste is theirs, and it stays in their build.** Their references, their
  colours, their feel-words, the anti-vision. None of it crosses into the next site.
- **The operator's standards are yours, and they persist.** How much you ask before you
  build. What you have learned never to ship. The thing a particular client says every
  single time. A working studio has a house *method* and a house *floor* — it does not have
  a house *look*, and the moment it does, its work all looks the same.

So: **negatives and process persist. A look never does.** `checks/studio.mjs` enforces
exactly that line, because it is the one that will be crossed by accident — a rule that
starts as "always ask about photography" and drifts into "always use a warm serif" is how
the gravity well gets written down and made permanent.

## The three files

None of them ship. `studio/*.md` is git-ignored except this README and the `*.example.md`
files; copy an example to the real name to start one.

| File | What goes in it |
|---|---|
| `floor.md` | your standing rules. **Always** — process and craft, things you do every time. **Never** — looks, moves and shapes you have learned not to ship |
| `rejections.md` | the ledger. One row per rejected thing, carrying **their exact words** and the rule you took from it |
| `directions.md` | one row per finished build: which direction, display type, colour temperament, macrostructure. This is what makes "differ from the last two builds" checkable instead of remembered |

## How they are used

- **Stage 01** — read `floor.md` before the interview. A question you always end up asking
  is a question that belongs in the interview, not in your head.
- **Stage 04** — read all three. `rejections.md` before you present anything: showing
  somebody a thing they have already turned down twice is the fastest way to look like a
  tool rather than a designer. `directions.md` to check the gravity well mechanically.
- **Stage 06 and 08** — write to `rejections.md` when a verdict comes back. **Their words,
  verbatim, at the time.** A paraphrase written a day later is your diagnosis wearing their
  voice, and it is the thing you will most want to re-examine later.

## The rule about verbatim, once more

`rejections.md` is only worth keeping if the quote column is real. *"It looks cheap"* is
usable six months later — you can hold a new design up against it. *"Client wanted a more
premium feel"* is already an interpretation, and interpretations compound: three of them
stacked and you are designing for a person who does not exist.

## What this cannot do

It cannot tell you *why* somebody rejected something — only that they did, and what they
said. And a floor rule that was right for one client can be wrong for the next; the file is
a prompt to think, not a spec to apply. Re-read it, do not just obey it.
