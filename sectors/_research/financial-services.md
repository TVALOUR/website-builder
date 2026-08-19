# Research notes - financial-services

## What was established

**FCA Handbook GEN 4 Annex 1R** prescribes the statutory status disclosure:
"Authorised and regulated by the Financial Conduct Authority", with the FCA's
own note that the full name is used rather than the abbreviation.

**FSMA 2000 s.19** - the general prohibition on carrying on a regulated activity
without authorisation or exemption.

**FSMA 2000 s.21** - the financial promotion restriction. A website is a
communication in the course of business.

Credit broking is a regulated activity, which is what brings a garage, a dentist
or a glazier offering "finance available" inside this sector. That is the finding
in this file most likely to surprise a client, and it is why the `weak` detection
terms include ordinary retail finance language.

## Contradiction angle

The counter-reading looked for: are the CONC representative-example requirements
really engaged by a "0% finance available" line on a trade website? The
requirement is triggered by a promotion including an incentive to enter a credit
agreement, and a rate is the paradigm incentive - so yes on the face of it. But
the detail of which promotions engage which CONC 3 provision was NOT read
section by section in this pass, and the duty's `why` describes the rule
generically rather than citing a CONC rule number. That restraint is deliberate:
citing a rule number that had not been read would be the exact defect the
citations checker was built to catch.

Second: exclusions exist for introductions to authorised persons in certain
circumstances, so not every "finance available" page needs permission. That is
why the introducer question is a CONFIRM item and not a blocker.

## What could NOT be established

- CONC 3 in detail. Not read; no rule number cited.
- Where and how prominently GEN 4 requires the disclosure to appear. Not read.
- Any non-UK jurisdiction. This sector is too consequential for a partial
  answer, and all four are `researched: false`.

## Standing warning

Three gates and three questions do not approach the FCA Handbook. This file is
a floor and a low one, and its caveats say so in capitals.

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
