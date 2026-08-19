# patterns/ — twenty-two section shapes, and when not to use each one

Open [`preview/index.html`](preview/index.html) in a browser. That is the fastest way to
understand this folder, and it is the only one that shows you the thing rather than describing it.

---

## Why a library exists at all in a repo that bans templates

The rest of this repo tells an agent what **not** to do: not Inter, not the purple gradient, not
four typefaces, not `transition: all`, not the hero → three cards → CTA rhythm. Twenty-two design
gates, all of them negative.

A model reading that produces a page that breaks none of them and still looks generated, because
avoiding defaults is not the same as making a decision. Told "don't use the card grid", it reaches
for the next-most-average shape it knows, and there is no gate for average.

So this folder is the positive half. **It is a vocabulary, not a template.** There is no
`index.html` you fill in and no build step. There are twenty-two section shapes, each with the
question it answers, the case it is wrong for, and — the part that actually matters — **what holds
the negative space**.

> Mechanical asymmetry satisfies the rule and still looks generated, because the empty region is
> not doing anything. Real negative space is *held*: a rule system, an honest index, structural
> numerals, an interaction target. A hero whose right third is simply void is the clearest "the
> template was filled in and it stopped" signal there is. **Empty is not negative space.**

Every archetype below names its counterweight. If you take one thing from this folder, take that
sentence.

## The composite this library exists to replace

```
             an eyebrow in small caps
   A VERY LARGE HEADLINE ACROSS TWO LINES
        one line of grey subtitle
      [ Get started ]  [ Learn more ]

              all centred
```

Nothing in that is wrong on its own. Eyebrows are a legitimate device — this library uses one,
twice, deliberately. The problem is the *arrangement*: it is what gets built when nobody has
decided anything, so it reads as generated however good the type is.

The four heroes here each answer a different question about what sits beside the headline, which
is the design decision the composite avoids making.

## What is in it

| | | |
|---|---|---|
| **H1** `hero-ledger` | headline against a ruled index of real facts | the highest-hit-rate hero for a local trade |
| **H2** `hero-statement` | one sentence at 22ch, and a rule | needs the confidence to say one thing |
| **H3** `hero-figure` | a real photograph with a real caption | only with photography the client owns |
| **H4** `hero-directory` | headline against the whole contact block | for sites whose job is to make the phone ring |
| **B1** `band-statement` | a surface change, one paragraph, nothing else | once per page, where the argument turns |
| **B2** `index-list` | services as a ruled list with a price column | the best alternative to a card grid there is |
| **B3** `split` | 7 columns of prose against 5 of image | safest shape here, therefore the easiest to overuse |
| **B4** `steps` | a process as numerals, no icons | five steps maximum |
| **B5** `faq` | native `<details>`, questions in customers' words | no JavaScript, keyboard-operable, prints |
| **B6** `quote` | one testimonial, attributed and dated | not three, and never a carousel |
| **B7** `spec-table` | a real table in a scroll container | when the reader wants to compare, not browse |
| **B8** `work-row` | image, title, one line, no card | needs real photography |
| **B9** `entries` | dated items in a ruled list | never for a blog with no posts |
| **T1** `people` | first names and what they actually do | not for a team of one |
| **T2** `hours` | hours, **including bank holidays**, with a dated exception | the line generated sites always miss |
| **T3** `where` | directions, parking and access, no map embed | avoids leaking the visitor to Google pre-consent |
| **T4** `disclosure` | registration number, register link, insurer, entity | what `sectors/` requires, in one panel |
| **T5** `notice` | a dated notice bar | for something temporarily true, never for marketing |
| **A1** `form` | labels, hints, and what happens next | the sentence after the button is the point |
| **A2** `cta-line` | one line on a rule | one phrase, used identically everywhere |
| **C1** `nav-stacked` | wordmark over a place name, links below | an alternative to wordmark-left-button-right |
| **C2** `nav-rule` | one line under a heavy rule | when the display face is doing enough already |
| **C3** `footer-ledger` | address, hours, contact, legal tail, entity details | a record, not a farm of links |

## How to use it

1. **Look at [`preview/index.html`](preview/index.html).**
2. Pick shapes that **disagree with each other**. A page needs at least two genuinely different
   archetypes, and two identical splits back to back is the mild version of having one.
3. Copy the markup from `sections/*.html` and the matching CSS block from
   [`patterns.css`](patterns.css). The codes match.
4. **Replace every token.** All of them. `patterns.css` ships a worked token set, not a house
   style, and a build that ships it unchanged has skipped the decision stage 04 exists to make.
5. Run the gate. `node checks/run.mjs builds/<slug>/site --facts builds/<slug>/facts.md`.

### Rules that survive the copy-paste

- **Two typeface families, ever.** Where a third is tempting — a wordmark, a stat, a pull quote —
  use a weight, a case and a letter-spacing treatment of one you already have. Tabular figures are
  one CSS property, and they are what a monospace face usually gets smuggled in for.
- **The eyebrow is punctuation, not a section template.** It appears on two of twenty-two shapes
  here. Once it prefixes most of a page's headings it has become the pattern it was meant to
  escape, in costume, and `design/motif-stamped` will say so.
- **Four vertical rhythms, not one.** `band-tall` · `band` · `band-short` · `band-tight`. A page
  where every section shares one padding value reads as a stack, not a composition.
- **The accent covers under about 5% of any viewport.** An accent that fills a band is a second
  paper colour.
- **Hover and focus may respond; nothing else moves.** The default motion policy in this repo is
  `none`, and the only transitions in this stylesheet are on colour. That is feedback, not
  animation, and it is why there is almost nothing for the reduced-motion block to switch off.

## The claim this folder makes about itself, and the probe behind it

`node checks/selftest.mjs` runs the full gate over `patterns/preview/` and asserts **zero
`design/`, `a11y/` and `responsive/` findings at any severity**. A library that teaches a standard
it does not meet is worth less than nothing, so the standard is checked rather than asserted.

It deliberately does **not** assert the other families. The sheet is a specimen sheet, not a site:
it holds four heroes, so it has four `<h1>` elements and `seo/h1` objects, correctly. It has no
privacy policy, because it is not a business. Those findings are expected and the assertion is
scoped to say so out loud rather than quietly passing a scoped run off as a clean one.

Two things worth knowing about how that check was made honest:

- **The stylesheet is inlined into the generated sheet**, not linked. A linked stylesheet one
  directory up sits outside the tree the checker walks, so the design and responsive families
  would have read no CSS at all and printed a clean run. That happened here first, before it was
  noticed — which is the failure mode this whole repo is about.
- **The clean run was mutation-tested.** Adding `transition: all` and `font-family: Inter` to the
  sheet produces three design findings immediately. A probe that cannot fail is not a probe.

## Everything on the sheet is invented

Trescott Joinery does not exist. The phone number is inside Ofcom's drama range for Barnstaple
(01271 960 xxx), the email uses the reserved `.example` TLD, and every price, name and date is
made up. That is the same discipline `examples/clean-control` holds and for the same reason: a
fixture must not be able to ring a real person.

The three photographs are the repo's own generated test images from
`examples/assets-control/`. They are placeholders in a specimen sheet, and on a real build a
generated photograph of a workshop would be blocked by `assets/generated-forbidden-subject` — as
it should be.

## Regenerating the sheet

```
node patterns/preview.mjs
```

Reads `sections/*.html` and `patterns.css`, writes `preview/index.html`. The generated file is
committed, so nobody has to run anything to look at the library. Run it after editing a section,
and the script will refuse if a new section file has not been added to its running order — a
specimen sheet silently missing a pattern is worse than none.
