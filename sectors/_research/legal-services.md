# Research notes - legal-services

## What was established

The SRA Transparency Rules make three duties that name the firm's website:

- **Rule 1.1 / 1.5 / 1.6** - price information for the specified services, on
  the website, "clear and accessible and in a prominent place".
- **Rule 2.1** - the complaints handling procedure, on the website, including
  how and when to complain to the Legal Ombudsman and to the SRA.
- **Rule 4.1** - the SRA number and the SRA digital badge, "in a prominent
  place on its website".

Legal Services Act 2007 s.12 supplies the reserved-activities scope question
behind the `reserved-activity` confirm item.

## Contradiction angle

The reading that would make Rule 1.1 not bind: it is conditional on the body
publishing the AVAILABILITY of the specified services. A commercial firm doing
none of them owes nothing under it. That reading is correct and is why the
price duty carries an `appliesIf` rather than binding on every law firm - the
gate would otherwise fire on a correctly-behaving commercial practice, which is
the cry-wolf shape this repo bans.

Second contradiction: these are SRA rules, so they bind SRA-authorised bodies
only. A CLC-regulated conveyancer, a BSB-regulated barrister and a CILEX firm
have their own transparency regimes, NOT read in this pass. The `present` gates
accept all four regulators' wording; the citation names only the SRA's rules.
That mismatch is recorded in the file's caveats rather than papered over.

## What could NOT be established

- The other three regulators' transparency rules. Not read.
- Whether "prominent place" has been interpreted anywhere. Nothing here judges
  prominence, and a footer-only costs page will pass this checker.
- Any non-UK jurisdiction. Attorney advertising is state-by-state in the US and
  bar-by-bar in the EU; both entries are `researched: false`.

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
