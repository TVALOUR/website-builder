# Facts — Invented Example Ltd (FIXTURE — deliberately incomplete)

> **This is a test fixture, not a template.** It is deliberately half-finished so
> the provenance gates have something to catch. For the real shape of this file,
> see `examples/clean-control/facts.md` and `stages/01_discover/CONTEXT.md`.
>
> The business is invented. Nothing here describes a real company, and the whole
> point of this file is that the site it accompanies claims a dozen things that
> never made it into any row below.

## Identity

| Fact | Value | Source | Confirmed |
|---|---|---|---|
| Trading name | Invented Example Ltd | fixture | fixture |
| Entity type | limited company | fixture | fixture |
| Company number | [NEEDS: company number] | — | ✗ |
| Registered office | TBC | — | ✗ |
| Phone | 0161 496 0000 | fixture (Ofcom drama range) | fixture |
| Email | UNKNOWN | — | ✗ |

## Services

| Service | Price | Source | Confirmed |
|---|---|---|---|
| Basic | £49.99/month | fixture | fixture |
| Pro | TODO | — | ✗ |

## Deliberately absent, so the gate has something to find

`index.html` states a dozen things that have no row above: two of the three prices, the
contact email, the postcode, a years-in-business figure, a customer count, a star
rating, a testimonial with a named person, and the opening hours.

They are described here rather than listed, on purpose. An earlier version of this
fixture spelled each value out — which put every one of them **into** the ledger and
silently satisfied the very gates it was written to trip. The checker was right and the
fixture was wrong, which is a good reminder that a negative control is a thing you have
to verify too.
