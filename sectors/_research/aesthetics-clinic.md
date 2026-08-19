# Research notes - aesthetics-clinic

## What was established

**Human Medicines Regulations 2012 reg.284(1)**, in one sentence: "A person may
not publish an advertisement that is likely to lead to the use of a prescription
only medicine." Botulinum toxin products are prescription only. A clinic web
page naming one, and above all pricing one, is the advertisement described.

**reg.280** supplies the general advertising principles for a medicinal product:
compliance with the summary of product characteristics, objective presentation
without exaggeration, not misleading.

**CAP Code section 12** applies on top, and is the route by which promotional
pressure on an irreversible procedure is challenged.

## Contradiction angle

The counter-reading actively looked for: is an informational page about a
treatment an "advertisement"? reg.284 turns on whether the publication is
"likely to lead to the use of" the medicine, which is broader than a
promotional-intent test - a priced service listing plainly satisfies it, and an
unpriced clinical explanation is a harder case. The file reflects that: naming
the medicine and pricing the medicine are RAISED SEPARATELY, and the reason
given is that the priced version is the one that gets enforced.

Second contradiction, and it matters: **dermal fillers are mostly medical
devices, not prescription only medicines.** reg.284 does not reach them. The
patterns are deliberately narrower on filler copy than on botulinum copy, and
the caveats say so. Treating all injectables alike would have been the obvious
mistake.

Third: reg.280's fetched text did NOT contain the POM prohibition, contrary to
the working hypothesis of the first fetch in this pass. The correct provision is
reg.284. Recorded here because a sector file that had shipped on that hypothesis
would have cited a live URL for a claim the page does not carry - the exact
failure shape the citations checker exists for.

## What could NOT be established

- MHRA enforcement guidance specific to clinic websites. Not fetched.
- Whether the Health and Care Act 2022 s.180 licensing scheme for non-surgical
  cosmetic procedures in England has commenced. Confirm item; do not trust this
  file's date.
- Every non-UK jurisdiction. The US default is close to the OPPOSITE (DTC
  prescription advertising is permitted subject to fair balance), which makes
  this the worst sector in the repo to generalise. All four are
  `researched: false` on purpose.

## Method

One research pass, 2026-08-19, run against primary sources first and secondary
sources only where no primary exists. Angles run on every sector in this pass:

1. **Entry angle** - is the trade, or its title, restricted by statute? Who
   enforces it, and what is the offence?
2. **Website angle** - does any instrument name the website, the advertisement,
   or the published material as the place a duty is discharged? This is the
   angle that separates a sector file worth having from a list of trade facts.
3. **Advertising angle** - what may this trade not say? Both statute and the
   applicable advertising code.
4. **Contradiction angle** (mandatory, per the repo's research policy) - what
   would make the conclusion above WRONG? Deliberately looked for the reading in
   which the duty does not bind a small brochure site, and recorded it where it
   was found.
5. **Jurisdiction angle** - is this duty the same in the other five profiles?
   Where the answer was "no, and I have not read the other one", the
   jurisdiction entry says `researched: false` with the reason.

## Standing limits on this whole pass

- Nobody qualified in any of these trades has read any of it. `verifiedBy` is
  null on every file and stays null.
- Quotes were taken from the fetched page at the access date. `node
  checks/citations.mjs --online` re-reads them and fails when a quote is gone.
- Where a source could not be retrieved, the rule it would have carried is in
  the sector's `confirm` list, NOT in a gate. An unretrieved source is not a
  source.
