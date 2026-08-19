# Stage 03 — Write

Write the actual words. Every one of them shippable, every claim traceable.

→ Auto-proceed, but pause the moment you catch yourself needing a fact you do not have.

## Inputs

- `builds/<slug>/facts.md` — **the only source of factual claims. There is no other.**
- `builds/<slug>/brief.md` — voice, audience, goal
- `builds/<slug>/sitemap.md` — the sections to fill
- `../../shared/writing.md` — the method and the banned list. Read it first.
- `../../shared/legal.md` — what each legal page must actually cover

## Process

> **If the build declares a Sector, read sectors/<id>.mjs before writing the services
> page.** Some of what that trade may not say is an offence rather than a style choice, and it is
> the COPY that gets it wrong, never the markup. shared/writing.md has the short version under
> "What a regulated trade may not say".
>
> **And write the lines nobody writes** — the sentence after the submit button, the bank holidays,
> the access line, the limit stated before anyone asks. Same file. They are boring to write and
> they are what a real business's site has that a generated one does not.

### 1. Legal pages first

Get them out of the way while you are still being careful. They are mechanical, they use only
facts from `facts.md`, and they are the pages most likely to be rushed at the end and filled
with boilerplate that describes a different business.

Never invent a company number, a registered address, a data-protection contact or a retention
period. A gap is `[NEEDS: …]` like any other, and the gate refuses to ship it.

**Do not describe machinery the site does not have.** A cookie policy listing analytics
cookies on a site with no analytics is a false statement, not a safe default. Write what is
actually there, which for most small sites is refreshingly little.

### 2. The one-sentence promise

Before any page copy, write the sentence the whole site is arguing. Concrete: who it is for,
what they get, why this business. If `facts.md` gives you no real differentiator, do not
invent a superlative to stand in for one. Say the plain true thing instead. "One man, one van,
and he turns up when he said he would" beats "committed to excellence" in every measurable way.

### 3. Walk the sitemap and write

Section by section, in order. Headlines, body, button labels, form labels, error messages,
image alt text, the meta title and description. The microcopy carries the voice too, and it is
what nobody writes.

Vary the shape of your sections. Do not run every one as problem, agitation, solution. A page
where every section has the same rhythm reads as filled in.

### 4. Meta, per page

- **Title**: unique, ~50 to 60 characters, leading with the thing people search for.
- **Description**: a real 150 to 160 character summary with a reason to click. Not the first
  sentence of the page.
- Duplicated titles across pages tells a search engine the pages are interchangeable. They are
  not, and the gate will say so.

### 5. Check yourself before handing over

Read it out loud. Then run the filler test on every paragraph: **could this appear, unchanged,
on a competitor's website?** If yes, delete it and write the specific thing instead.

## Outputs

- `builds/<slug>/content.md`, organised by page then section, in sitemap order, so stage 05
  can drop it straight in
- Any new `[NEEDS: …]` appended to `facts.md` and raised with the human

## Verify

- [ ] Every number, name, price, date and credential appears in `facts.md`.
- [ ] No em dashes in body copy. Check, do not assume.
- [ ] No word from the banned list in `../../shared/writing.md`.
- [ ] No lorem, no TODO, no unfilled placeholder.
- [ ] Titles and descriptions are unique per page.
- [ ] You could hand any paragraph to the owner and they would recognise their business in it.
