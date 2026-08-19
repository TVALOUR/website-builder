# Research notes - construction-trades

## What was established

**United Kingdom: nothing.** Building, roofing, plastering, carpentry,
landscaping and general handyman work are unregulated. No licence, no register,
no protected title, no mandatory website disclosure. Every scheme a UK builder's
site carries is voluntary membership.

The `uk` duties array is therefore EMPTY, and that is the finding. The exposure
runs through general consumer law - DMCC Act 2024 Part 4 for a false
accreditation claim, Consumer Rights Act 2015 Part 1 for the service itself -
both of which existing families already gate.

**California: crisp and opposite.** Business and Professions Code s.7030.5
requires a licensee to include the licence number in construction contracts,
subcontracts, calls for bid and "all forms of advertising, as prescribed by the
registrar of contractors". s.7028 makes unlicensed contracting a misdemeanour.

## Contradiction angle

The pressure on this file was to invent UK duties so it would not look empty.
Sites for builders LOOK like they should have obligations, and a reader
skimming a sector folder will read an empty array as an unfinished file rather
than as an answer. The mitigation is that the emptiness is documented three
times - in the file header, in a comment on the array itself, and as the first
caveat.

Contradiction on the US side: applying California's rule to a contractor in
another state is the same error as running the UK profile on a Kansas plumber,
one level down. Hence the `appliesIf` on the site mentioning California. The
known cost is that a Californian contractor whose site never names the state
will not trigger the duty; that miss was chosen over 49 states of confident
wrong findings.

## What could NOT be established

- Any US state other than California. Confirm item.
- Scotland's building warrant regime. Named, not read.
- Whether Part P electrical work should be its own sector file. It is currently
  excluded by the `not` patterns and has no file of its own, which is a gap.

## The other false positive: `\bbuilders?\b` matches "website-builder"

Found by running the sector detector over this repo's own pattern library, whose
`<title>` is "Pattern library - website-builder". A hyphen is a word boundary,
so `\bbuilders?\b` matched inside the repo's own name and a page about making
websites was classified as a construction firm.

Vetoes added for `website|site|page|web|funnel|landing-page|form|app|store`
builders, plus bodybuilder and the other compound uses. Left as a comment in the
file rather than a silent fix, for the same reason as the veterinary one: the
loose two-word pattern is the recurring defect shape here, and the record is
worth more than the tidy diff.

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
