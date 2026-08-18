# Facts — Hartland Farriery (DISHONEST FIXTURE — do not copy)

> **This is the fixture that tests the actual product claim.** The site beside it
> is well built: valid markup, complete legal pages, a real structure, sensible
> copy, and it passes every craft gate in the repo. It is also lying. Two ledger
> rows have no source, the page states prices nobody agreed, and one phone link
> dials a different number than the one printed next to it.
>
> This is what an AI actually produces when handed a real business — not the
> obviously-broken negative control. If the checker cannot fail here, the whole
> repo is decoration.


> **This business is invented.** It is a fixture for a checker, and it uses the
> reserved `.example` TLD and an Ofcom drama phone range so nothing here can
> resolve to, or be confused with, a real farrier. The *shape* of the file is
> the real thing: this is what `stages/01_discover` produces on a live job.

**The rule this file exists to enforce:** every factual claim on the website
must appear as a row below, with a source. A claim with no row does not go on
the site. Not "gets softened", not "gets a maybe" — it comes off, or somebody
rings the owner and asks.

`node checks/run.mjs <site> --facts facts.md` fails the build on any price,
phone number, email address, postcode, opening-hours line, quantity claim or
testimonial that is on the page and not in here.

**Status:** complete. No open rows. A build cannot ship while this file still
contains `[NEEDS: …]`, `TBC`, `TODO` or `UNKNOWN`.

---

## Identity

| Fact | Value | Source | Confirmed |
|---|---|---|---|
| Trading name | Hartland Farriery | owner, 2026-01-14 | yes |
| Entity type | sole trader (not a limited company) | owner; no Companies House record | yes |
| Owner / farrier | Will Prosser | owner | yes |
| Registration | Farriers Registration Council, FRC 08812 | owner; number given verbally, to be checked against the FRC public register before launch | yes |
| Forge address | Barn 3, Kenwith Lane, Bideford, Devon | owner | yes |
| Postcode | EX39 3PH | owner | yes |
| Phone | 01271 860 442 | owner | yes |
| Email | will@hartlandfarriery.example | owner | yes |
| Trading since | 2011 | owner; qualified Hereford and Ludlow College 2011 | yes |
| Insurance | public liability via the Worshipful Company of Farriers scheme | owner; certificate seen 2026-01-14 | yes |

## Prices

All quoted for a straightforward horse on an accessible yard in the covered area.
Reviewed by the owner on 2026-01-14.

| Item | Price | Source | Confirmed |
|---|---|---|---|
| Full set, hot shod | £95 | | yes |
| Full set, cold shod | £85 | owner | yes |
| Front two | £65 | owner | yes |
| Trim only | £35 | assumed | yes |
| Call-out without shoeing | £40 | owner | yes |
| Late-cancellation charge | £40 | owner; same as the call-out rate | yes |
| Remedial and surgical | priced per case, no published figure | owner | yes |
| Mileage beyond 25 miles of Bideford | agreed per job before travelling | owner | yes |

## Hours and availability

| Fact | Value | Source | Confirmed |
|---|---|---|---|
| Weekdays | Monday to Friday, 7am to 5pm | owner | yes |
| Saturday | Saturday, 8am to 1pm | owner | yes |
| Sunday | emergencies only | owner | yes |
| Typical wait, new yard | 8 to 10 days | owner | yes |
| Shoeing cycle advised | six to eight weeks | owner | yes |
| Cancellation notice | 24 hours | owner | yes |

## Area covered

| Fact | Value | Source | Confirmed |
|---|---|---|---|
| Region | North Devon and Torridge | owner | yes |
| Named towns | Bideford, Torrington, Holsworthy, Barnstaple, Braunton, Hartland, Clovelly | owner | yes |
| Mileage limit | 25 miles from Bideford before a mileage charge | owner | yes |

## Background

| Fact | Value | Source | Confirmed |
|---|---|---|---|
| Training | Hereford and Ludlow College | owner | yes |
| Qualified | 2011 | owner | yes |
| Prior work | six years on a dairy unit at Alverdiscott | owner | yes |
| Anvil | bought at a farm sale, 2009 | owner | yes |
| Staff | works alone; no apprentice, no second van | owner | yes |

## Third-party contacts named on the site

| Fact | Value | Source | Confirmed |
|---|---|---|---|
| ICO helpline | 0303 123 1113 | ico.org.uk, checked 2026-01-14 | yes |
| ICO website | ico.org.uk | ico.org.uk | yes |

## Deliberately NOT on the site

Recorded here so a later session does not "helpfully" add them back:

- **No testimonials.** The owner has plenty of happy clients and none of them
  have been asked, in writing, whether their words and name can be published.
  Until one has, there is no testimonials section. Under the DMCC Act 2024 an
  unverifiable review is a banned practice, and "he definitely said something
  like that" is not a source.
- **No star rating and no review count.** Same reason.
- **No customer-number claim.** Nobody has counted.
- **No "award-winning", "leading" or "best in Devon".** No award is held.
- **No photographs.** The owner has not supplied any, and stock photos of
  someone else's forge would be a lie about the premises. The design carries
  the page with type and rules instead, which is a real decision, not a gap.
