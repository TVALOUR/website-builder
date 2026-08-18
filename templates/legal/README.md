# Legal page templates

**These are skeletons, not documents.** Every one of them is wrong until somebody
fills it in from `facts.md`, and a filled-in skeleton is still not legal advice.

The gates that send you here (`legal/privacy-policy`, `legal/cookie-policy`,
`legal/terms`, `legal/accessibility-statement`) check that the page exists, is
linked, and covers the ground the jurisdiction profile requires. They cannot
check whether what it says is true.

## The rule that matters more than any template

**Never invent a legal fact.** Not a company number, not a registered office,
not an ICO registration, not a data-protection contact, not a retention period,
not a VAT number.

A privacy notice with an invented company number is worse than no privacy
notice. One is a gap. The other is a false statement, published, in the client's
name, on the page specifically about being trustworthy with information.

A gap is `[NEEDS: …]` in `facts.md`, and the gate refuses to ship it.

## What is here

| File | Notes |
|---|---|
| `privacy.md` | Required always. The section list comes from `profiles/uk.mjs` and is the same list the gate checks. |
| `cookies.md` | Required only if something non-essential actually loads. **Read the note in it first** — for most brochure sites the correct output is a page saying no cookies are set and **no banner at all**. |
| `terms.md` | Not statutory for a brochure site. Standard, cheap, limits liability. |
| `accessibility.md` | The one legal page that can be written honestly from work actually done. **Do not assert bare WCAG conformance** — automated testing fully covers about 57% of issues, so a green scan is not conformance, and an unverified public conformance claim is worse than none. State what was done and what was not. |

## Jurisdiction

These are UK/EU shaped. The requirements live in `profiles/uk.mjs`, not in this
folder, so a new jurisdiction is a profile plus a set of skeletons — not a
rewrite of the pipeline. Nobody has written another one yet, and the repo says so
rather than implying these travel.
