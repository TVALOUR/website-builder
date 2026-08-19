# Research notes - food-hospitality

## What was established

**Regulation (EU) No 1169/2011 Art.14** is the website duty:

- Art.14(1)(a): mandatory food information "shall be available before the
  purchase is concluded and shall appear on the material supporting the distance
  selling or be provided through other appropriate means clearly identified by
  the food business operator".
- Art.14(1)(b): all mandatory particulars available at the moment of delivery.
- Art.14(2): for non-prepacked food sold at a distance, the Art.44 particulars -
  which is the allergen information - are made available per Art.14(1).

**Food Information Regulations 2014 reg.5** is the domestic provision for
non-prepacked food. It permits allergen information by any means including
orally - and it EXPRESSLY EXCLUDES food offered by means of distance
communication.

## Contradiction angle

This is where the pass nearly went wrong. reg.5 is the provision everybody
quotes for allergens, and it is the WRONG one for a website: its own exclusion
takes distance selling out of scope. Had the file been written from reg.5 it
would have concluded that a takeaway may satisfy the duty by telling people to
ask staff, which is true at the counter and false online. The correct instrument
is Art.14, and both are cited so the next reader can see the distinction rather
than rediscover it.

Second contradiction: does a brochure site with a menu and a phone number owe
anything? No - it is not distance selling. Hence the `appliesIf` gate on a
visible ordering mechanism. A duty that fired on every restaurant menu would be
wrong and would be ignored.

## What could NOT be established

- FSA guidance text. food.gov.uk 301-redirected to gov.uk and the redirect was
  not followed in this pass; nothing from it is cited.
- Whether display of the hygiene rating is mandatory for this business. It is
  compulsory in Wales and Northern Ireland under their own Acts, neither read.
  Confirm item.
- Scotland's Food Information (Scotland) Regulations 2014. Named, not read.
- Any national measure adopted under Art.44(2) in an EU member state.

## The quote that drifted, caught by the check

The first version of the reg.5 citation carried a quote taken from a summary
rather than from the page: `may make available the particulars specified in
Article 9(1)(c) by any means the operator chooses`. The statute reads `...in
Article 9(1)(c) (labelling of certain substances or products causing allergies
or intolerances) in relation to that food by any means...`, so the words as
quoted are not on the page.

`node checks/citations.mjs --online` failed it as a BLOCKER on the first run
after the file was written. The row now quotes paragraph (2) instead - the
distance-communication EXCLUSION, which is the load-bearing half anyway - and
that text is verbatim.

Recorded because it is the exact failure the online check was built for, found
on the first sector file to use it, against a quote written the same day.

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
