# Research notes — `uk`

**Status:** researched, not verified · **Law last verified:** 2026-08-18 · **Next review:** 2027-02-18

These notes exist because the loader pointed every UK run at them and they did not exist. `uk.mjs`
predates the research protocol in `profiles/README.md`: it was assembled during the repo's own build
and then adversarially critiqued, rather than through the one-pass protocol the other profiles
followed. This file records what is actually behind it, including the parts that are thinner than
the other profiles', because a profile whose audit trail is missing is indistinguishable from one
that was invented.

---

## What is load-bearing, and where it came from

Every citation in `uk.mjs` carries a URL and an access date in its `provenance.sources` block. The
six that decide behaviour:

| Claim | Source | Class |
|---|---|---|
| PECR reg.6 consent, as amended by DUAA 2025 | legislation.gov.uk | primary |
| DMCC Act 2024 Part 4 Ch.1, in force 6 Apr 2025, replacing CPUT 2008 | legislation.gov.uk | primary |
| Trading disclosures on a website — SI 2015/17 | legislation.gov.uk | primary |
| Companies Act 2006 s.82 | legislation.gov.uk | primary |
| E-Commerce Regs 2002 reg.6 | legislation.gov.uk | primary |
| Equality Act 2010 reasonable adjustments | legislation.gov.uk | primary |

## The contradiction angle — what it found

Run as an adversarial critique of the file rather than as a separate research pass, and it produced
the three findings now recorded in the file's own header. All three were citations that were **true
when written** and had since been revoked or rewritten:

- **PECR reg.6** was rewritten by DUAA 2025 Sch A1 on 5 February 2026. The word DUAA appeared
  nowhere in the repo, and the file was recommending prior consent for cookies the amendment had
  moved to information-plus-opt-out.
- **CPUT 2008** was revoked on 6 April 2025 by the DMCC Act 2024, and was cited twice as current.
- **The Companies (Trading Disclosures) Regs 2008** were revoked by SI 2015/17.

That is the finding this profile contributes to the repo: **law is the fastest-decaying content
here, and the tell was the absence of a date.** Every profile now carries `lawLastVerified` and
`nextReview` because of it.

The second contradiction finding is the one most likely to be repeated to a client: **the correct
default for a brochure site is usually NO cookie banner.** A site loading no analytics, no pixel, no
embedded video, no embedded map and no third-party font sets nothing that needs consent, and a
banner with nothing to consent to costs every visitor a click and makes a false claim about the
site. Mainstream UK compliance content says the opposite by default.

## What could NOT be established

1. **Whether "genuinely cookieless first-party analytics does not engage reg.6 at all" is as broad
   as `uk.mjs` states it.** The EU profile reaches the opposite conclusion on Art.5(3) — the
   provision PECR reg.6 implements — citing EDPB Guidelines 2/2023, which extend it to pixels,
   tracked URLs and IP-only tracking. The UK sentence is defensible for a tool that neither stores
   nor accesses information on the device, and is broader than that as written. Current ICO
   guidance on non-cookie technologies has not been fetched. **Treat the UK sentence as narrower
   than it reads until somebody checks it.**
2. **Scotland and Northern Ireland divergence.** The profile is written to the UK-wide floor. Where
   consumer and accessibility law differs, this file does not say so.
3. **Regulated trades.** Healthcare, finance, law, gas and electrical carry obligations no static
   checker can know about. Out of scope by design, not by omission.
4. **Whether the DUAA commencement URL is the right citation.** `provenance.sources` cites the DUAA
   schedule; a link check found it 404s, because Schedule A1 is inserted *into PECR* (SI 2003/2426)
   rather than being a schedule of the DUAA. The substance is confirmed by SI 2026/82 (Commencement
   No. 6); the citation has been corrected to point at both. **This is the second time a UK citation
   in this file has been wrong in a way only a fetch could reveal** — which is why the protocol now
   requires the URL to have been fetched, and why a link check belongs in the review step.
5. **Whether any of it is right.** Nobody with a UK legal qualification has read this file.
   `verifiedBy` is `null` and stays `null` until somebody's name goes in it.

## Note for the next reviewer

This profile is the one `config.example.md` ships as the default and the one `profiles/README.md`
tells contributors to read for house style. It has **six** sources; `us` has 39 and `eu` has 33.
That gap is not a judgement about which is more correct — it is a statement about how much of this
one rests on a critique pass rather than a research pass. At the next review, run it through the
protocol in `profiles/README.md` properly, and classify every source.
