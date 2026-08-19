# profiles/ — the jurisdiction system

**The legal family is the only genuinely country-shaped part of this repo. So the country is a
file, and when the file does not exist the agent writes it — it never runs the nearest one.**

Running UK rules on a US site does not produce slightly-wrong output. It produces a Kansas
plumber's website citing the Companies Act 2006 and demanding a company number that does not
exist, in a page specifically about being trustworthy. That is worse than no legal page at all,
because it looks like diligence.

---

## What is in here

| File | What it is |
|---|---|
| `_base.mjs` | The jurisdiction-**neutral** floor. Tracker fingerprints, third-party leak list, the universal claim patterns, the honesty rules. Every profile is merged on top of it. |
| `_schema.md` | The contract a profile satisfies, field by field, with what each one changes. |
| `_research/<id>.md` | The working notes behind a researched profile: angles run, sources with URLs and dates, what the contradiction angle found, and what could **not** be established. |
| `<id>.mjs` | One jurisdiction. |
| `intl-baseline.mjs` | The honest fallback for a country nobody has written yet. Asserts the honesty floor, names no statute. |

Shipped today: `uk` · `us` · `eu` · `ca` · `au` · `intl-baseline`.

**Every one of them is `provenance.status: 'researched'` — assembled from primary sources, read by
nobody qualified.** `verifiedBy` is `null` and stays `null` until a real name goes in it. The gate
repeats that label on every run so it cannot be forgotten between the research and the client.

---

## How a jurisdiction gets chosen

1. **Stage 00 asks** — the country the business trades in, not the country the developer lives in.
2. It goes in `config.md` as `- **Profile:** \`us\``.
3. `checks/run.mjs` resolves in this order: `--profile` flag → `config.md` → **nothing**.

There is no fallback country. A run with no jurisdiction raises `legal/jurisdiction` as a
**blocker** and the entire legal family switches off with a stated reason. That is deliberate: the
previous behaviour was a silent skip, and a silent skip meant a site with no privacy policy and a
Meta Pixel firing on load could print `PASS`.

---

## When the country has no profile — the research protocol

The question this answers, in the words it was asked in: *"perhaps the system would research and
figure this out depending on the person's answer."* It is one pass, and it is the same pass every
time.

**Do not start it if the agent cannot search and fetch the live web.** A legal profile written from
model memory is exactly the artifact this repo exists to prevent — the UK profile's own header
records three citations that had been revoked or rewritten while it confidently cited them as live.
Without web access: use `intl-baseline`, say so to the client in writing, and recommend a local
adviser reads the four legal pages. That is a better product than a confident invention.

### The brief

> You are writing `profiles/<iso2-lowercase>.mjs` for **\<COUNTRY\>**. Read `profiles/uk.mjs` for
> the house style, `profiles/_schema.md` for the contract, `shared/legal.md` for the method, and
> `checks/rules/legal.mjs` for how your regexes get used.
>
> Scope: a **static brochure site**, 5–10 pages, no accounts, no payments, no database. It may have
> a contact form posting to a third-party service, `tel:`/`mailto:` links, optionally analytics,
> optionally an embedded map or video. Nothing else. Do not research e-commerce or platform law.
>
> **Fan out by angle, and one angle is mandatory: the contradiction angle.** Actively hunt for
> credible sources arguing the mainstream compliance advice for this country is wrong or
> overstated. The three that repay it everywhere:
> - Is a cookie banner actually required here, or is EU practice being cargo-culted?
> - Does the privacy law reach a business this small, or is there a threshold that exempts it?
> - Is there any local equivalent of the UK duty to publish a company number and registered office
>   on the site? (In most of the world: no. Confirming that changes the profile's whole shape.)
>
> **Every citation carries a URL you actually fetched and the date you fetched it.** No citation
> from memory. Cannot fetch a primary source ⇒ write `UNCONFIRMED` in the file. A gap is fine; a
> confident wrong citation is the defect this repo exists to prevent.
>
> **Check currency.** For each law: still in force? Amended? By what, and when? Note what is
> *enacted but not yet effective* separately from what binds today.
>
> Write two files: `profiles/<id>.mjs` to the schema, and `profiles/_research/<id>.md` — angles,
> sources with dates, what the contradiction angle found, every point where sources disagreed and
> which you followed, and a required section **"What could NOT be established"**.
>
> Never write that anything "makes the site compliant". Set `provenance.status: 'researched'` and
> `verifiedBy: null`. Test every regex mentally against innocent prose: a gate that cries wolf is a
> gate people learn to skip, which is worse than no gate.
>
> **Then run `node checks/citations.mjs --profile <id>` and fix what it says.** It is not a
> formality and it is not stylistic. It requires:
>
> - a `class` on every citation, **derived from the publisher** — if the host is not in
>   `checks/lib/source-class.mjs`, add it in the same commit rather than letting it default;
> - a `quote` on every load-bearing row: the source's own words, which `--online` re-reads and
>   fails on when they change. **Never write a quote you have not read.** A fabricated quote
>   wearing a verification badge is worse than no quote, and a row with no quote is honest;
> - a `coverage` map answering all seven questions, each pointing at a non-secondary source in
>   `provenance.sources`. Answer every one **including where the answer is "nothing here
>   requires it"** — that is a finding too, and it needs a source. This is the check that
>   catches the failure a percentage cannot: a question nobody asked reads to a client exactly
>   like a question that was asked and came back empty.

### What the protocol is allowed to leave out

The base profile already carries the tracker list, the third-party leak list, the claim patterns
and the honesty floor. A new profile answers only what is country-shaped:

- `legal.consentModel` + `consentModelWhy` — the single highest-value field in the file
- `legal.pages.*.required` / `.why` / `.mustMention`
- `legal.disclosure.corporation` / `.soleTrader`
- `legal.claimCitations.*` — the local law behind each universal claim class
- `legal.localRegisters` — trade registers to catch by name
- `legal.extras` — obligations with no slot in the schema
- `locale.*` — language, spelling, currency, date shape, phone example, reserved fictional numbers

That split is why country N+1 is one prompt rather than a rebuild.

### After it lands

```
node checks/selftest.mjs                                   # the profile must not break the gate
node checks/run.mjs examples/clean-control --profile <id> --facts examples/clean-control/facts.md
```

The second command is a sanity check, not a pass mark: `clean-control` is a UK fixture, so a new
profile flagging things on it is often the profile being right.

---

## When to stop trusting a profile

`provenance.nextReview` is six months out and the loader shouts once it passes. Law is the
fastest-decaying content in this repo. At review, re-check every source URL and ask of every rule
"is this still true?" — **retiring a rule is a normal outcome, not a failure.**

The three that were wrong in an earlier UK draft, kept here as the standing warning:

- PECR reg.6 was rewritten by DUAA 2025 Sch A1 on 5 February 2026, and the word DUAA appeared
  nowhere in the repo.
- CPUT 2008 was revoked on 6 April 2025 by the DMCC Act 2024, and was cited twice as current.
- The Companies (Trading Disclosures) Regs 2008 were revoked by SI 2015/17.

None of them were careless. All three were true when written.

---

**Nothing in this folder is legal advice.** It encodes what a competent developer ships by default
so a small business is not obviously exposed. A regulated trade has obligations no static checker
can know about, and a business that is unsure needs a solicitor, not a template.
