# Research notes - gas-heating

## What was established

**Gas Safety (Installation and Use) Regulations 1998 reg.3(3)** - no employer
may allow an employee, and no self-employed person may, carry out work on a gas
fitting or service pipework unless a member of a class of persons approved by
the Health and Safety Executive. That approved class is the Gas Safe Register.

This regulates the WORK. Nothing found regulates the website.

## Contradiction angle

The question this pass set out to answer was "must a Gas Safe number appear on a
website?" The honest answer found was **no instrument says so**. The temptation
was to encode it anyway, because every trade body and every consumer campaign
behaves as though it were required.

Resisted. The `present` duty asks for a Gas Safe statement on a site that
advertises gas work, and its `why` argues the case explicitly rather than
citing a statute that does not exist. The caveats lead with this.

## What could NOT be established

- **The Gas Safe Rules of Registration and Brand Enforcement Policy.** Both
  PDFs are published by gassaferegister.co.uk and the host served a
  bot-detection page to a plain fetch. Search results describe the brand rules
  as covering websites, adverts, vehicle signage, stationery and directory
  listings, and treat misuse by a registered business as a breach of the Rules
  - but that is a search summary, not the document. It is therefore in the
  confirm list at MINOR and in no gate.
- The per-category scope of a registration. Confirm item.
- Northern Ireland's SR 2004/63 equivalent. Named, not read.

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
