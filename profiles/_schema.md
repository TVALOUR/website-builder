# Profile schema

Every file in `profiles/` (except the ones starting `_`) is an ES module with a default export
matching this shape. It is merged **on top of** `_base.mjs`, so anything you leave out is inherited
rather than missing. Zero dependencies, Node 18+.

Two rules govern every field:

1. **State only what is country-shaped.** If the answer is the same in Osaka and Ohio, it belongs in
   `_base.mjs`, not here.
2. **A gap is `UNCONFIRMED`, in the file, in writing.** Never a guess, never silence.

---

## Top level

| Field | Type | What it does |
|---|---|---|
| `id` | string | Must equal the filename without `.mjs`. This is what `--profile` takes. |
| `name` | string | One line naming the regime, shown nowhere but read by everyone: `'United States (FTC Act · state privacy laws · ADA Title III)'` |
| `country` | string | Human name of the country. |
| `iso2` | string | Two-letter code. `'EU'` is used for the EU-wide floor, which is not a country and says so. |

## `provenance` — the field that keeps the repo honest

| Field | Type | What it does |
|---|---|---|
| `status` | `'verified'` \| `'researched'` \| `'baseline'` | **`verified`** — a named person with the relevant qualification read it. **`researched`** — assembled from primary sources by an agent; nobody qualified read it. **`baseline`** — deliberately generic, makes no country-specific claim. |
| `verifiedBy` | string \| null | A real name, or `null`. `status: 'verified'` with a null name is itself a blocker: unverifiable self-certification is the thing this repo exists to stop. |
| `lawLastVerified` | `YYYY-MM-DD` | When the sources were last actually opened. |
| `nextReview` | `YYYY-MM-DD` | Six months out. The loader shouts once it passes. |
| `sources` | `[{claim, url, accessed, class, quote?, quoteUrl?}]` | One row per citation used anywhere in the file. **This list is the audit trail** — a citation not represented here is a citation nobody can check. Fields below. |
| `caveats` | `string[]` | Plain-English statements of what this profile cannot know. Read by a human before it goes near a client. |

`status: 'researched'` makes the gate label every legal finding as unverified, on every run. That
label is not decoration and it is not removable from the report.

### A source row

| Field | Required | What it does |
|---|---|---|
| `claim` | yes | What this URL is cited *for*. A URL with no claim is a bookmark. |
| `url` | yes | Where a human should go to read it. |
| `accessed` | yes | `YYYY-MM-DD`. An undated citation cannot be told apart from one nobody opened. |
| `class` | yes | `primary` · `primary-mirror` · `regulator` · `court` · `secondary`. **Not your choice** — see below. |
| `quote` | for load-bearing claims | The source's own words, verbatim, long enough not to appear by accident. |
| `quoteUrl` | rarely | Where the *words* are, when that is not `url`. The Australian register gives a stable per-Act URL that renders a table of contents and hides the text behind a date-stamped path. |

**`class` is derived from the publisher, not declared by the author.**
`checks/lib/source-class.mjs` maps each host to a class and `checks/citations.mjs` re-derives it;
a row that labels a law-firm bulletin `primary` is a check failure, not a judgement call. A host
nobody has classified is a **blocker** — add it to the map in the same commit, rather than letting
it default to something and look considered. `secondary` is not banned: commencement timetables and
"has the Bill been introduced yet" genuinely have no primary source. What is banned is a
BLOCKER-severity claim resting on secondary alone, and a primary-source rate nobody can reproduce.

**`quote` is what makes a wrong citation detectable.** A Canadian greenwashing claim in this repo
quoted a phrase Parliament had struck. The URL was live, the page loaded, the claim was false, and
it reached the client inside a BLOCKER — because nothing compared the claim to the source's words.
`node checks/citations.mjs --online` re-reads every source and fails when a quote is gone. Never
write a `quote` you have not read: a fabricated quote wearing a verification badge is worse than
no quote at all, and a row with no `quote` is honest.

## `coverage` — the seven questions, and the check for silence

```js
coverage: {
  privacyNotice:       'https://…',   // what makes a privacy notice required, or not
  consentModel:        'https://…',   // what makes prior-opt-in, or notice-and-opt-out, right here
  accessibilityDuty:   'https://…',   // the route to liability, INCLUDING discrimination law
  businessIdentity:    'https://…',   // what must be disclosed on the site itself
  misleadingClaims:    'https://…',   // the statute behind the claim gates
  electronicMarketing: 'https://…',   // is the SITE in scope of spam law, or only sending from it
  fictionalData:       'https://…',   // the reserved phone range a demo must use
}
```

Each value must be a URL that appears in `provenance.sources`, and should not be `secondary`.
Required on every `researched` profile; `baseline` is exempt and says so on every run.

**Why this exists.** The Canadian profile told clients accessibility was "best practice, not law"
for a small business. It analysed both accessibility-*standards* statutes correctly and never
mentioned human-rights law — the only route that actually reaches a small business, and the route
every other profile names. Nothing caught it, because nothing checked whether a question had been
**asked**. A percentage counts what is there; only this map asks what is missing. Filling it in on
the UK profile — the best-sourced one, 7/7 primary — immediately surfaced that the UK GDPR and the
Ofcom drama ranges were both asserted throughout the file and cited nowhere in it.

Answer every one, including when the answer is "nothing here requires it". That is a finding too,
and it needs a source.

## `locale`

| Field | Example | Notes |
|---|---|---|
| `language` | `'en-US'` | Goes in `<html lang>`. |
| `spelling` | `'us'` \| `'gb'` | Drives the copy checker. |
| `dateFormat` | `'MMMM D, YYYY'` | `11/12/2026` means two different days on two continents. Sites should spell the month. |
| `currency` / `currencySymbol` | `'USD'` / `'$'` | |
| `phoneExample` | `'(555) 123-4567'` | The shape a real number takes, for the brief and for review. |
| `fictionalPhoneRange` | string | The reserved or drama range a **fictional** build must use, with its citation. Ofcom, NANPA and ACMA each reserve ranges precisely so a published number cannot ring a real person. |
| `postcodePattern` | string | Written as a string (`'/\\b\\d{5}(-\\d{4})?\\b/'`); the loader compiles it and reports an uncompilable one rather than crashing. |
| `addressOrder` | `'street, city, state ZIP'` | |
| `measurement` | `'metric'` \| `'imperial'` | |
| `direction` | `'ltr'` \| `'rtl'` | RTL changes layout, not just text: the build owes `dir="rtl"` and logical CSS properties, not `left`/`right`. |

## `copy`

`emDashPer1000Warn` / `emDashPer1000Block` / `language`. The thresholds were measured on **English**
prose. A non-English profile re-measures or sets them to `null`, which turns the gate off with a
stated reason instead of applying an English convention to German.

## `legal`

### `privacyLaw`
Short name of the governing regime, or an honest `'sectoral/state patchwork'`.

### `consentModel` — the highest-value field in the file
| Value | Means |
|---|---|
| `'prior-opt-in'` | Nothing non-essential may fire before a yes. |
| `'notice-and-opt-out'` | It may fire, but disclosure plus a working opt-out are owed. |
| `'notice-only'` | A privacy notice suffices. |
| `null` | Unknown. The gate reports what loads and declines to rule. |

`consentModelWhy` is a cited paragraph that **explicitly states when a banner is and is not
required**. Getting this backwards is the single most common error in the whole family, in both
directions: a banner on a site with nothing to consent to is a dark pattern with a cost and no
benefit, and no banner on a site running a Meta Pixel is a fine waiting to happen.

### `pages.{privacy,cookies,terms,accessibility}`
| Field | Notes |
|---|---|
| `patterns` | `RegExp[]` matched against the route, so `privacy.html`, `privacy-policy.html` and `/privacy/index.html` are the same page. |
| `required` | `'always'` · `'if-collects-personal-data'` (a form, a `mailto:`, or anything non-essential loading) · `'if-non-essential-scripts'` · `'recommended'`. Anything but `recommended` makes a missing page a **blocker**. |
| `why` | The citation. It is printed in the finding, so a developer reads the reason at the moment it matters. |
| `mustMention` | `[[RegExp, 'plain description']]` — sections the page must actually contain. A privacy page missing one is a blocker; the others are majors. |

### `disclosure.{corporation,soleTrader,all}`
`[[RegExp, 'what must appear', 'the law and why']]`. `all` is inherited from the base (a reachable
contact route) and rarely needs extending. Entity type is read from the `Entity type` row of
`facts.md`, never sniffed from the page — sniffing got it exactly backwards on a ledger that said
"sole trader (not a limited company)".

**If a country requires little or nothing here, leave the arrays empty and say so loudly in a
comment.** Inventing requirements to look thorough is the same defect as inventing a price.

### `claimCitations`
The keys are the universal claim classes in `_base.mjs`: `rating`, `count`, `superiority`,
`accreditation`, `guarantee`, `insurance`, `years`, `environmental`. The **pattern** is shared; you
supply the **local law and penalty exposure** for each. A class with no citation falls back to
`claimFallback`, which finds the claim and declines to name a statute — the honest output for an
unresearched jurisdiction.

### `localRegisters`
`string[]` of trade registers and regulators — `'gas safe'`, `'niceic'`, `'cslb'`. The loader ORs
them into the accreditation pattern so they are caught by name, not only by grammar.

### `extras`
Obligations with no slot above. Two kinds:

```js
// A real probe: fires only on a match, at the declared severity.
{ id: 'de/impressum', severity: 'blocker', what: '…', why: '…cited…',
  pattern: '/impressum/i', absent: true }

// Not machine-checkable: emitted as a MINOR telling a human to confirm it.
{ id: 'ca/quebec-french', severity: 'major', what: '…', why: '…cited…',
  detect: 'prose describing what to look for' }
```

An unprobeable extra is deliberately **not** raised at its declared severity. A blocker that fires
on every run is not a gate, it is a banner, and people learn to skip banners.

## `seo`
`locale` (`'en_US'`, for Open Graph) and `localBusinessRequired` (boolean).

---

## Adding one

`README.md` in this folder has the research protocol and the brief to hand an agent. Then:

```
node checks/selftest.mjs
node checks/run.mjs examples/clean-control --profile <id> --facts examples/clean-control/facts.md
```

`clean-control` is a UK fixture. A new profile flagging things on it is often the profile being
right, not the profile being broken.
