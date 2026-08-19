# sectors/ — what the law requires of the TRADE

`profiles/` knows which country the business trades in. It does not know what the business *is*,
and the law does. Four duties this folder encodes name the website in the instrument itself:

| The duty | The instrument |
|---|---|
| A letting agent **must publish its fees on its website** | Consumer Rights Act 2015 s.83(3) |
| A law firm **must publish prices, a complaints route and its SRA number on its website** | SRA Transparency Rules 1.1, 2.1, 4.1 |
| A food business selling at a distance **must give allergen information before the purchase concludes** | Regulation (EU) No 1169/2011 Art.14(1)(a) |
| An aesthetics clinic **may not name or price Botox at all** | Human Medicines Regulations 2012 reg.284(1) |

Every one of those is a static-file question. Until this folder existed, none of them was asked —
and every jurisdiction profile in the repo carried a caveat saying so:

> *"Regulated trades (healthcare, finance, law, gas, electrical) carry obligations no static checker
> can know about."*

That was honest, and it was a hole.

---

## What ships

| Sector | Researched for | The one thing people are surprised by |
|---|---|---|
| `legal-services` | uk | Price transparency is a **website** rule, not a marketing choice |
| `property-agency` | uk | s.83 says "on the agent's website" — no threshold, no small-agency exemption |
| `health-clinic` | uk | Using a protected title you are not entitled to is a criminal offence, and a page can commit it |
| `aesthetics-clinic` | uk | **Advertising Botox to the public is unlawful.** Not "carefully". At all |
| `gas-heating` | uk | The honest answer: no statute requires the number on a website. It is here anyway, argued rather than asserted |
| `food-hospitality` | uk, eu | The moment the site can take an order, allergens become a website duty |
| `financial-services` | uk | A garage offering "0% finance" is doing a regulated activity |
| `veterinary` | uk | "Hold himself out as being prepared to practise" is a description of a website |
| `construction-trades` | uk, us | UK: **nothing**, and the file ships an empty duties array to say so. California: the licence number in all advertising |

`node checks/run.mjs --sectors` prints this list from the files rather than from this table, which
is the version to trust.

## How a build uses it

One row in `builds/<slug>/facts.md`:

```
| Sector | legal-services | confirmed by Anna, 2026-08-19 |
```

`Sector: none` is a real answer and **most trades' answer**. It is also on the record, in a file
the client can read, given by a human. That is the difference between an unregulated trade and an
unasked question, and it is the whole reason `sector/undeclared` exists.

For an audit of somebody else's site there is no brief, so pass it directly:

```
node checks/run.mjs /path/to/site --profile uk --sector legal-services
```

or let detection do it — on an unmanaged site a site that calls itself "solicitors" in its own
words gets that trade's duties applied, with every finding labelled as detection-derived.

---

## Writing a new one

The bar is the bar for `profiles/`, and it is high on purpose: this folder produces BLOCKER-severity
findings about somebody's livelihood.

### The research protocol

**One pass, five angles, primary sources, everything dated.** Fan out by angle — not by search
term, which returns the same page five times.

1. **Entry.** Is the trade, or its title, restricted by statute? Who enforces it? What is the
   offence? Start at the legislation, not at a law firm's summary of it.
2. **Website.** Does any instrument name the *website*, the *advertisement*, or the *published
   material* as the place a duty is discharged? **This is the angle that decides whether the file
   is worth having.** A sector file that only lists trade facts belongs in a blog post.
3. **Advertising.** What may this trade not say? Statute *and* the applicable advertising code.
4. **Contradiction — mandatory.** What would make everything above wrong? Actively look for the
   reading in which the duty does not bind a small brochure site, and **write down what you find**
   even when it survives. Every file in this folder has a contradiction section in its notes; two
   of them changed the file.
5. **Jurisdiction.** Is this the same in the other five profiles? Where the answer is "no, and I
   have not read the other one", write `researched: false` with that as the reason.

### The rules that are not negotiable

- **A gap is `researched: false` with a reason, in writing.** Never a guess, never silence, never
  an empty object.
- **Never write a `quote` you have not read.** The online check re-reads every one. The first draft
  of `food-hospitality` quoted a summary instead of the statute and failed as a blocker on the
  first run — which is the check working, and is recorded in that sector's notes rather than
  quietly fixed.
- **An unretrieved source is not a source.** `gas-heating` wanted the Gas Safe Rules of
  Registration; the host served a bot-detection page. The rule those pages might contain is in the
  `confirm` list at MINOR and in no gate. Do the same.
- **If the honest answer is "nothing", ship the empty array and say so three times** — in the file
  header, in a comment on the array, and in the caveats. A reader skimming a folder will read an
  empty array as an unfinished file unless you stop them.
- **Working notes are compulsory.** `sectors/_research/<id>.md`: the angles run, what was
  established, the contradiction angle, and what could NOT be established. `checks/citations.mjs`
  blocks a `researched` file with no notes, because the status is a claim about how the file was
  made and without the notes nobody can check it.

### The brief to hand an agent

> Research the legal duties that fall on **&lt;trade&gt;** operating in **&lt;country&gt;**, for the purpose
> of deciding what its **website** must and must not contain. Run the five angles in
> `sectors/README.md`, including the contradiction angle. Use primary sources — the legislature's
> own text, or the regulator's own rulebook — and record for every citation: the claim it supports,
> the URL, the date accessed, and a verbatim quote of the load-bearing words. Where no primary
> source exists, say so rather than substituting a law-firm bulletin. Produce
> `sectors/<id>.mjs` to `sectors/_schema.md` and `sectors/_research/<id>.md` to the protocol above.
> **Do not invent a duty to make the file look complete**, and do not adapt another country's rule
> to fill a gap — mark it `researched: false` with the reason.

### Then

```
node checks/citations.mjs --profile <id>            # structure, class, coverage
node checks/citations.mjs --online --profile <id>   # every quote re-read against its source
node checks/selftest.mjs                            # gates, negative controls, MANUAL.md
```

A new **gate** (as opposed to a new sector file) additionally needs a negative control in
`examples/sector-control/` and a row in `checks/MANUAL.md`. The selftest enforces both, and will
tell you which one you forgot.

---

## What this folder is not

It is not legal advice, it is not a compliance audit, and a green run is not a defence. Every file
is `provenance: 'researched'` — assembled from published sources by an agent and read by **nobody
qualified in the trade**. `verifiedBy` is `null` on all nine and stays null until a real name goes
in it. The report says so on every run that applies a sector, and that label is not removable.

What the folder does is narrower and true: it stops a site shipping without the disclosure the
trade's own regulator writes about websites. Contributions very welcome — especially verified ones.
