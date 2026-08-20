# Photography — directing the camera they already own

Imagery is `client-assets-only` by default, which means the honest answer to "why does this
page look thin" is usually "because nobody asked them to photograph anything". This file is
the fix: a **shot list**, written by whoever is designing the page, for a person with a
phone and twenty minutes.

It is the most designer-shaped thing in this repo. A studio that hands a small business a
site does not wait to see what turns up in an email — it says *stand here, at this time of
day, and photograph these six things.*

---

## When to write one

At **stage 04**, as soon as the direction is chosen and `facts.md` shows the imagery is
thin — no photographs, or photographs that are all one kind (three exterior shots and
nothing else is one photograph taken three times).

Write it before the design locks, not after the build, for a mechanical reason: a section
designed around a photograph that never arrives has to be redesigned, and a section
designed to work *without* one cannot use a photograph that does arrive without being
opened up again. Deciding early is what makes both cheap.

Output is `builds/<slug>/shot-list.md`, copied from **`templates/shot-list.md`** and filled
in — a form with the awkward fields already on it, rather than a document you have to
remember the shape of. Hand the bottom half over as its own thing, not buried in a paragraph
of an email.

**Honest about enforcement:** no gate checks that this happened. It sits in `shared/` with
`directions.md` and `writing.md` — the doctrine layer, which binds by being read. What *is*
mechanical is downstream: a photograph that arrives with no manifest row does not ship
(`assets.mjs`, rule 7), and the imagery policy itself is gated at the brief
(`checks/brief.mjs`). If you find yourself skipping this step, that is the finding.

## The rule that outranks everything here

**A shot that does not arrive changes nothing.** Every section must be designed to hold
without its photograph, and `design.md` names the fallback for each one. A site that is
blocked waiting for a client's camera is a site the client is now late for, and the
temptation at that point is to generate something or buy stock of somebody else's premises
— which is rule 7 and the thing this whole repo exists to stop.

If the photographs arrive, they upgrade a page that already worked. That is the only
relationship the design is allowed to have with them.

## How to write a shot

One block per shot. Six is a good list; ten is a list nobody completes.

```
### 3. The van, parked, on a job

**Where it goes:** the services section, left column.
**Why it earns its place:** it is the only proof on the page that this is a real
  business with real equipment, and it is what a customer looks for.
**Framing:** landscape, van filling roughly two thirds of the frame, angled — not
  square-on. Leave space on the right; the copy sits there.
**Light:** overcast, or early morning. Direct midday sun on white panels blows out.
**Do not:** photograph it in your driveway. The background says as much as the van.
**Fallback if it never arrives:** the services list runs full width with the price
  index on the right.
```

The two fields people skip are the two that matter. **Why it earns its place** stops the
list becoming a wish, and it is the sentence you read back when they ask why they have to
do this. **Fallback** is what keeps the build moving.

## What to ask for, by shape of business

Not a template — a starting point to argue with. Pick the four to six that this business
actually has.

| The business | The shots that carry a page |
|---|---|
| A trade (plumber, electrician, farrier) | work in progress with hands in frame · the finished job · the van or the kit laid out · the person, outdoors, not smiling at the lens |
| Somewhere people go (café, salon, workshop) | the room empty and lit · the room in use · one thing they make, close · the front of the building from where a customer stands |
| A practice (clinic, solicitor, accountant) | the room where the appointment happens · the front door and the way in · the person, seated, natural light, no suit-and-crossed-arms · the waiting area |
| A maker | the material before · the process, mid-action · the finished object on a plain surface · the workshop wide |

## The phone rules, in plain language

Give these to them verbatim. They are the difference between usable and not.

- **Clean the lens.** More photographs are ruined by a thumbprint than by any other cause.
- **Landscape for anything wide**, portrait for a person or a tall object. Decide before
  you press, not by rotating afterwards.
- **Stand still, tap the thing you want sharp**, wait a beat, then press.
- **Turn the flash off.** Always, indoors especially. Open a door or a blind instead.
- **Do not zoom.** Walk closer. Phone zoom is a crop, and it costs everything.
- **Take five of every shot** from slightly different positions. It costs nothing and one
  of them will be the one.
- **Send the originals**, not screenshots and not anything WhatsApp has re-compressed —
  those arrive at a fraction of the resolution the page needs.

## Permission, before the shutter

This is not paperwork, it is the part that goes wrong publicly.

- **A person who is recognisable needs to have agreed** to being on a public website. Staff
  included — a staff photograph outlives the job.
- **Somebody else's property, home or premises** needs their agreement too, and a customer
  saying "sure, take a photo" is not the same as agreeing to it being published.
- **Children:** written permission from a parent, or do not use it.
- Record who agreed to what in `facts.md`, in the row for the asset. "Photographed by the
  client, consent confirmed by text, 12 August" is a source, and it is what makes the row
  honest.

## When it lands

The photographs go into `drop/photos/` (or `builds/<slug>/_intake/`), then
`node assets.mjs <slug> scan` indexes them and every one gets a manifest row naming where
it came from. A photograph with no row does not ship — same rule as every other asset.

Then look at them **before** telling the client they are good. If a shot missed, say so
plainly and ask for that one again; one specific re-shoot is a small ask, and the
alternative is a section carried by an image that does not carry it.
