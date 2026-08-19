# Brief — <business name>

Written at stage 01 from what the client actually said. Every downstream stage cites this file.
`node checks/brief.mjs builds/<slug>` reads it and says what is still missing.

**Short and decision-dense.** A long brief nobody reads is worse than a short one everybody does.
Where the client refused to answer, write the refusal — a recorded refusal is a decision the build
can work around, and an absent answer is a gap stage 03 fills with something plausible and invented.

---

## Project regime

<Question 0: a real local/service business · a real product or company that lives online · a
personal, portfolio, demo or fictional project. It decides which rules bind.>

## Goal

<The ONE outcome. Not "an online presence" — "more enquiries for remedial work from vets, rather
than more general shoeing".>

## Audience

<Who visits, on what device, worried about what. Questions 8-12. "Small businesses" is not an
audience; the last three people who rang are.>

## Vision

<Part V, and this is the section that makes it their website rather than a website. It gets read
back to them first at the stop.>

- **Handed over:** <what is in `_intake/`, file by file. "Nothing" is a real answer.>
- **Remaking:** <the site they are basically trying to remake, with the URL — or "none">
- **References:** <one line per card in `references.md`, each with the axis that grabbed them>
- **Anti-vision:** <what it must NOT look or feel like. "My last site was purple" is load-bearing.>
- **Five seconds:** <what a visitor must know, and what they must feel>
- **Feel:** <three words, past "clean and modern": cheap or premium, warm or precise, loud or
  quiet, traditional or new>
- **Colour:** <exact values · a thing to take them from ("the blue on the van") · or "no opinion,
  show rendered options at 04">
- **Type:** <brand fonts and whether they are licensed for web use · or "designer's choice at 04">

Every axis above is **supplied**, **delegated by choice**, or **open** — never silently defaulted.

## Voice

<3 to 5 adjectives, and one sentence of theirs you would be happy to quote on the site.>

## Scope

<The rough page list. Refined at stage 02.>

## Features — what a visitor must be able to DO

<Questions 47-56, page by page. Not what the page is about: what they do on it. This is what turns
a page list into a website.>

| Page | What a visitor does here | Needs |
|---|---|---|
| <home> | <rings you, sees where you work> | <tel: link, service area> |

- **Enquiries land at:** <the inbox a human opens daily, and who checks it>
- **Editable by the client:** <no — static; every change is a developer job. They know this.>
- **Out of scope, said out loud:** <booking, payments, accounts, uploads>
- **Analytics:** <no — and therefore no banner · or which, and the consent consequences>

## Must-have and must-avoid

<Including everything they hate, and anything they are stuck with: a colour, a strapline, the name
on the van.>

## Brand and assets

<Questions 21-24 and 41-46. The per-file detail lives in `assets/MANIFEST.md`; this is the summary
and the outstanding asks.>

- **Logo:** <formats held, or "none — set type instead, per the brief">
- **Fonts:** <held, and licensed for web use? A desktop licence is not a webfont licence.>
- **Photos:** <what exists, who took them, and whether they are the client's to publish>
- **Still needed:** <the [NEEDS:] list for assets>

## Market and jurisdiction

<Questions 57-61. This picks the legal profile, and there is no default country.>

- **Profile:** <uk | us | eu | ca | au | intl-baseline — must exist in `profiles/`>
- **Sector:** <a trade id from `node checks/run.mjs --sectors`, or `none`. NOT optional and NOT a
  guess: the country profile does not know what the business IS, and for some trades the law names
  the website. `none` is a real answer and most trades' answer — but somebody has to give it. The
  same value goes in `facts.md` as a `| Sector |` row, which is what the gate reads.>
- **Trades under:** <country, and where the business is registered>
- **Customers in:** <same country, or abroad too — selling into the EU pulls in EU obligations
  wherever the business sits>
- **Language:** <and whether it is right-to-left>
- **Money and dates:** <currency, and how dates are written>

## Motion and imagery

<Questions 62-63. Both default to OFF and the gate enforces both.>

- **Motion:** none
  <`none` · `subtle` (happens once and settles) · `expressive`. Anything but `none` names who
  asked for it.>
- **Imagery:** client-assets-only
  <`client-assets-only` · `generated-allowed`. Even under `generated-allowed`, generated imagery
  may never depict people, premises, products, logos or awards — `shared/imagery.md` §3.>

## Stack, host and domain

- **Stack:** <static>
- **Host:** <and who pays for it>
- **Domain:** <who owns it TODAY, and who has the registrar login>
- **Existing site:** <what happens to it, and whether email runs on that domain>

## Assumptions

<Everything defaulted rather than asked, listed so the client can correct it in one pass. An empty
list here is almost always untrue rather than impressive.>

## Open questions

<Every [NEEDS:] gathered. The stop does not end on "looks good" while this list is non-empty:
name what is missing and what you will do about each one.>
