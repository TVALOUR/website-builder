# Sector schema

Every file in `sectors/` (except the ones starting `_`) is an ES module with a default export
matching this shape. It is merged **on top of** `_base.mjs`, so anything you leave out is inherited
rather than missing. Zero dependencies, Node 18+.

This is the second profile axis. `profiles/` answers *which country*; this answers *what does the
law require of this trade*, which every jurisdiction profile in this repo says in its own caveats
that it cannot.

Three rules govern every field, and none of them is negotiable.

1. **A sector duty is jurisdiction-shaped too.** "Physiotherapist" is a protected title in the UK,
   a state-licensed one in the US, an AHPRA registration in Australia. Duties are therefore keyed
   by jurisdiction, and an unresearched jurisdiction is `researched: false` **with a reason** —
   never an empty object, which reads as "nothing required here".
2. **Detection suggests; declaration decides.** See "Detection" below. A sector's blockers are
   applied because a human wrote the trade down, not because a regex matched a word.
3. **Nobody qualified has read any of it.** `status: 'researched'`, `verifiedBy: null`, and the
   report repeats it on every run. Same standing as a jurisdiction profile.

---

## Top level

| Field | Type | What it does |
|---|---|---|
| `id` | string | Must equal the filename without `.mjs`. This is what a build's `Sector` row and `--sector` take. |
| `name` | string | One line naming the trade, printed in `--sectors` and in every finding. |
| `aliases` | `string[]` | Other names a person might write. Currently documentation only — the loader does not resolve them, and pretending otherwise would be machinery that does not run. |

## `detect` — how the checker guesses, and why the guess is not enough

```js
detect: {
  strong: [/\bsolicitors?\b/i],      // the trade naming itself. One is enough.
  weak:   [/\bprobate\b/i],          // suggestive. Two are needed, or one plus a strong.
  not:    [/\blegal notices?\b/i],   // a veto, however many others matched.
}
```

Detection reads the site's **visible text**, not the markup: a class name is a developer's word,
and the trade a site is in is the trade its sentences describe.

**Write the `not` list first.** It is the one that stops the file being a nuisance. `legal` appears
in the footer of every site this repo builds, *by this repo's own instruction*, so a legal-services
detector without a veto on "legal notices" fires on every build the tool produces — which is the
definition of a gate people learn to skip.

**What detection then does depends on whether the build is one this repo made:**

| | Managed build (`STATE.md` or `brief.md` beside `site/`) | Audited third-party site |
|---|---|---|
| **Strong match** | raises `sector/undeclared` (major) and applies nothing | applies the duties, and every finding says it came from detection |
| **Weak match** | raises `sector/undeclared` (major) and applies nothing | applies nothing |

The asymmetry is deliberate. On a build there is somebody to ask, and asking is the whole point.
On an audit there is nobody, and a site that calls itself "solicitors" in its own `<h1>` is not
ambiguous.

## `jurisdictions` — keyed by the ids `profiles/` uses

```js
jurisdictions: {
  uk: { regulator, register, duties: [...], confirm: [...] },
  us: { researched: false, why: 'Fifty state bars. Not researched in this pass.' },
}
```

| Field | What it does |
|---|---|
| `regulator` | Human name of the body, printed in findings. `null` when the trade is unregulated here — which is a real answer. |
| `register` | URL of the free public register a visitor would check a number in. Drives `sector/register-link`. |
| `duties` | The machine-checkable obligations. Shape below. |
| `confirm` | Obligations no static reader can decide. Emitted as MINOR, addressed to a human. |
| `researched` | Set `false`, with `why`, for a jurisdiction nobody has read. |

**A jurisdiction absent from the map is treated exactly like `researched: false`** — the run says
"nobody researched this", never "no duties here". Those are different sentences and only one of
them is true.

**An EMPTY `duties` array is a legitimate answer and is sometimes the right one.**
`construction-trades` ships one for `uk`, because UK building trades are unregulated. Inventing a
duty to make a file look substantial is the same defect as inventing a price.

### A duty

```js
{
  kind: 'present' | 'absent' | 'page' | 'sourcedNumber',
  what: 'the firm\'s SRA authorisation number',   // completes "no ___ appears on the site"
  why:  '…the citation, and the reasoning, in full…',
  pattern: /…/,           // present · absent · sourcedNumber
  patterns: [/…/],        // page — matched against the ROUTE and the <title>, never the body
  appliesIf: /…/,         // optional: the duty binds only on a site that does this
  wantsRegisterLink: true // optional, `present` only
}
```

| `kind` | Gate it raises | Severity | What it means |
|---|---|---|---|
| `present` | `sector/disclosure-missing` | blocker | something must appear somewhere on the site |
| `absent` | `sector/prohibited-content` | blocker | something must NOT appear anywhere on the site |
| `page` | `sector/page-missing` | major | a page whose **route or title** matches must exist |
| `sourcedNumber` | `sector/number-unsourced` | blocker | a registration number must appear **and** trace to a sourced row in `facts.md` |

The kinds are few on purpose. A declarative test set is the difference between "a new sector is
data" and "every sector ships its own JavaScript" — and the second shape is how a rule family
becomes unauditable, because nobody can answer *what does this sector actually check* without
reading code.

`page` deliberately does **not** read the body text. Matching the body would let a homepage that
mentions the word "complaints" satisfy "publish a complaints procedure", which is a gate reporting
coverage it does not have.

**`appliesIf` is what keeps this family honest.** Half of these duties bind only on a site that
does a particular thing — advertises a reserved legal service, takes orders online, promotes a
treatment. A duty with no `appliesIf` binds on every site in the trade, and that is a claim the
author has to be willing to make out loud.

### A confirm item

```js
{ id: 'legal-services/uk/digital-badge', what: 'the question, addressed to a person', why: '…why it matters…' }
```

Emitted as `sector/human-confirm`, MINOR, on every run where the sector applies. They are minors
because a checker cannot rule on them, **not** because they are minor — several are the most
consequential things in the file, and they say so.

If you find yourself wanting a blocker for something a file cannot decide, that is the signal to
write a confirm item instead. A blocker that fires on every run is not a gate, it is a banner, and
people learn to skip banners.

## `coverage` — the five questions, per jurisdiction

```js
coverage: {
  uk: {
    whoRegulates:      'https://…',  // which body, under what instrument
    entryRestriction:  'https://…',  // may anyone practise, or use the title?
    websiteDuties:     'https://…',  // what must appear on the site — including "nothing"
    advertisingLimits: 'https://…',  // what this trade may not say
    complaintsRoute:   'https://…',  // the redress route a client must be told about
  },
}
```

**A question may be answered "nothing here requires it", and that is written down rather than
cited.** Set the topic to `null` and add a sibling `<topic>Why` of at least 40 characters saying
what was looked for and not found. The check reports it at MINOR — an unregulated trade is a
finding a client should see — and distinguishes it from silence, which blocks.

```js
coverage: {
  uk: {
    websiteDuties: null,
    websiteDutiesWhy: 'No instrument found requires anything on a gas engineer website. That is the '
      + 'finding, and the present-duty in this file argues its case rather than citing a statute '
      + 'that does not exist.',
  },
}
```

**One source may not answer three of the five questions.** `citations/coverage-repeated` is a
MAJOR when it does, and it exists because the first nine sector files failed it: eight of them
pointed three, four or five questions at the same URL. A statute restricting who may practise does
not also say what the trade may not advertise, and a rule about website prices says nothing about
the complaints route. Each was a claim-to-source link that did not hold, in the mechanism built to
catch exactly that on the jurisdiction side, reproduced on the new axis by the person building it.
Two uses of one instrument is plausible; three is a map filled in to satisfy the check.

Required for every jurisdiction the file claims to have researched. Each value must be a URL that
appears in `provenance.sources` and is not `secondary` — or the explicit `null` + `<topic>Why`
above. `checks/citations.mjs` blocks a file that leaves one genuinely blank.

**Why five questions rather than a percentage.** A primary-source rate counts what is there. Only
a coverage map asks what is *missing* — and the defect that produced this mechanism on the
jurisdiction side was a profile that answered every question it asked and never asked the one that
mattered.

Answer every one, **including when the answer is "nothing here requires it".** That is a finding
too — and it needs either a source or the written `<topic>Why` above. What it may never be is
blank, and what it may never be is the previous question's URL pasted again.

## `provenance`

Identical in shape and standing to `profiles/_schema.md` → `provenance`: `status`, `verifiedBy`,
`lawLastVerified`, `nextReview`, `sources[]`, `caveats[]`.

Two things carry over unchanged and are worth restating:

- **`class` is derived from the publisher, not declared by the author.** `checks/lib/source-class.mjs`
  maps host → class and `checks/citations.mjs` re-derives it. An unknown host is a **blocker**, not
  a shrug: add it in the same commit.
- **`quote` is what makes a wrong citation detectable.** `node checks/citations.mjs --online`
  re-reads every source and fails when the quoted words are gone. **Never write a quote you have
  not read** — the first draft of `food-hospitality` quoted a summary rather than the statute, and
  the online check failed it as a blocker on its first run. That is the mechanism working; a
  fabricated quote wearing a verification badge is worse than no quote at all.

---

## Adding one

`README.md` in this folder has the research protocol and the brief to hand an agent. Then:

```
node checks/citations.mjs --profile <id>            # sourcing, offline
node checks/citations.mjs --online --profile <id>   # every quote re-read against the source
node checks/selftest.mjs                            # gates, coverage, MANUAL.md
```

A new gate needs a negative control in `examples/sector-control/` and a row in `checks/MANUAL.md`.
The selftest enforces both.
