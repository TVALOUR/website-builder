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
| `sources` | `[{claim, url, accessed}]` | One row per citation used anywhere in the file. **This list is the audit trail** — a citation not represented here is a citation nobody can check. |
| `caveats` | `string[]` | Plain-English statements of what this profile cannot know. Read by a human before it goes near a client. |

`status: 'researched'` makes the gate label every legal finding as unverified, on every run. That
label is not decoration and it is not removable from the report.

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
