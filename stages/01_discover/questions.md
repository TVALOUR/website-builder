# The question bank

Every question here earned its place by having a documented cost when it goes unasked. The
cost is written next to it. That is not padding: it is there so you can tell a client *why*
you are asking, which is the difference between an answer and a shrug.

**BLOCKING** means: without an answer you would have to invent something about a real
business, default a design nobody chose, or ship a real legal exposure. Ask it, or record
the refusal and build less.

You will not ask all of this. You will ask all the blocking ones — and you will ask them in
batches with the reason attached, not as an interrogation (`CONTEXT.md` §3).

---

## 0. Before anything — what kind of project is this?

**BLOCKING — Which of these is it: (a) a real business or organisation with premises or a
service area, (b) a real product, company or project that lives online — a SaaS, an app, a
brand with no shopfront — or (c) a personal / portfolio / demo / fictional project?**

*Cost of skipping:* the regimes are different and guessing picks the wrong one. A local or
service business binds every part of this bank: every fact sourced, every legal page real,
the trader disclosures on the page. An online product or company keeps the honesty regime
in full (its prices, claims and identity are still real facts) but owes no shopfront
disclosures — record `Entity type` accordingly in `facts.md` and the gate adjusts. A
personal or fictional project relaxes what must *exist*, not what must be *honest* — parts
A–C shrink to what is real about the person or the idea, and anything invented is declared
on the page as fictional, uses reserved domains (`.example`) and drama phone ranges, and
never wears real-business dress it did not earn. The failure mode this question prevents
has a fixture: `examples/dishonest-control/` is a professional-looking site whose every
fact is invented, and it is what a model produces when nobody asked question 0.

Part V binds in **both** regimes. Nobody's head is empty; a demo has a vision too.

---

## V. The vision in their head

The half of discovery nearly every pipeline skips, and the reason generated sites all look
alike: nobody asked what the person could already see. Two rules govern this whole part:

- **Artifacts before questions.** A dropped sketch answers twenty questions. Ask them to
  hand things over into `builds/<slug>/_intake/` *first*; interview only for what the
  artifacts leave open.
- **Show, don't interrogate.** Most people cannot answer "what typography do you want?" and
  should never be asked it. When they have no vocabulary for an axis, offer to decide and
  show them rendered options at the stage-04 stop instead (that stop presents samples they
  can see, not adjectives). "No opinion, show me" is a first-class answer — record it.

1. **V1 — BLOCKING — What can you hand me before I ask anything?**
   Sketches or wireframes (a photo of paper is fine) · screenshots of anything · sites you
   love · a site you are half-remaking · the site you hate · your logo · brand fonts ·
   brand colours · your old site · any leaflet, sign, menu, business card or ad you already
   use. Into `_intake/`, then the interview fills the gaps.
   *Cost:* without this ask, the person's actual vision never enters the pipeline and the
   model substitutes its own defaults — which is the single failure this repo exists to
   fix. "Nothing to hand over" is an acceptable answer; not asking is not.
2. **V2 — BLOCKING — Is there a website you are basically trying to remake?**
   *Cost:* people often carry a complete reference in their head and never say so because
   nobody asked. If yes, get the URL or screenshots; it gets dissected into a card per
   `shared/references.md` (DNA extracted, never copied) and becomes the strongest design
   input the build has.
3. **V3 — Walk me round each reference: what grabbed you?**
   The type, the colour, the layout, the motion, the way it talks, or the whole thing? One
   axis per reference is enough. (This deepens question 25's three-likes-one-hate.)
   *Cost:* a reference without a named axis gets averaged into mush, or worse, copied.
4. **V4 — BLOCKING — What must this site NOT look or feel like?**
   *Cost:* "my last site was purple" and "nothing corporate" are load-bearing constraints,
   and they only surface when asked. The anti-vision kills more bad directions than the
   vision picks good ones.
5. **V5 — BLOCKING — Someone lands on the site for five seconds. What must they know, and
   what must they feel?**
   *Cost:* this is the hero brief in one answer — what the H1 says, what sits above the
   fold, what the first impression argues. Unasked, the hero defaults to a slogan.
6. **V6 — BLOCKING — Three words for how it should feel.** Push past "clean and modern", which is what
   a site says when nobody decided: cheap or premium? warm or precise? loud or quiet?
   traditional or new?
   *Cost:* the stage-04 direction choice needs a temperament to aim at, not a shrug.
7. **V7 — BLOCKING — Colours: do you have exact values, or a thing I can take them from,
   or no opinion?**
   Hex values if they exist; "the blue on the van" is a legitimate source (eyedropper the
   photo and say so in `facts.md`); no opinion routes to rendered options at stage 04.
   (Deepens question 23.)
   *Cost:* unasked, the palette comes from the model's defaults, and the client's first
   reaction is the expensive one.
8. **V8 — Fonts: do you have brand fonts, and are they licensed for web use?**
   (Deepens question 22 — the licence half is there and it is blocking for a real
   business.) No fonts is fine; that is the designer's choice to make at stage 04, made as
   a real choice with the temperament from V6.

Everything Part V collects lands in `brief.md`'s **Vision** section, and every reference is
dissected into `builds/<slug>/references.md` per `shared/references.md` before stage 04
opens.

---

## A. The business itself

1. **BLOCKING — What is the legal name, and is it a limited company, a sole trader, or a
   partnership?**
   *Cost of skipping:* a limited company must show its registered name, number and registered
   office on the site (Companies Act 2006 s.82). A sole trader must show a geographic address.
   The two lists barely overlap, so guessing gets one of them wrong in public.
2. **BLOCKING — What do you actually sell, in your own words?**
   *Cost:* this is where category-shaped copy comes from. "Physiotherapy" produces a generic
   physio site. "I go to people's houses and get stroke patients walking again" produces
   theirs.
3. **What do you want MORE of, and what do you want LESS of?**
   *Cost:* every site without this answer optimises for "all enquiries", which means the
   homepage sells the cheap job as hard as the profitable one.
4. **Who are your competitors, by name?**
   *Cost:* stage 04 cannot avoid looking like the others if it has not seen them.
5. **What is the one thing you do that they do not?**
   *Cost:* without it, stage 03 writes "quality service and customer focus", which is what
   copy says when it has nothing to say. Do not accept a superlative here. Push for a fact.
6. **How long have you been doing this, and what did you do before?**
   *Cost:* years-in-business is the most-invented number on the web. Get the real one or
   have none.
7. **Is your work seasonal?**
   *Cost:* affects what the homepage leads with, and whether the site needs to say
   "booking into March" anywhere.

## B. Customers

8. **Who rings you? Describe the last three.**
   *Cost:* "small businesses" is not an audience. Three real callers is.
9. **What are they worried about when they call?**
   *Cost:* this is the copy. Almost literally: the objections they raise on the phone are the
   headings the site should answer.
10. **What do they ask that you wish the website had already told them?**
    *Cost:* the single highest-value question in this bank. It is the site's page list, said
    out loud by the person who fields the calls.
11. **Phone, email, WhatsApp or form? Which do you actually want?**
    *Cost:* a form on a tradesperson's site that they never check is worse than no form. If
    they want calls, the site should want calls.
12. **Are they mostly on a phone?**
    *Cost:* almost always yes for local trade, and it changes what must fit above the fold.

## C. Facts that will end up on the page

13. **BLOCKING — Prices. Real ones, or the reason you do not publish them.**
    *Cost:* the flagship failure. Handed no prices, a model invents a plausible list, and the
    client finds out when a customer arrives expecting £45. "It depends" is a valid answer and
    goes in `facts.md` as "priced per job".
14. **BLOCKING — Opening hours, including weekends and bank holidays.**
    *Cost:* wrong hours send someone to a closed door. That customer does not come back, and
    they do not tell you why.
15. **BLOCKING — Where do you actually work? Name the towns.**
    *Cost:* "the South West" is not a service area. It is also the difference between ranking
    for the places they want and the places they do not.
16. **BLOCKING — Phone number and email, exactly as they should appear.**
    *Cost:* a transposed digit is invisible to everyone including the owner, who never rings
    their own phone.
17. **BLOCKING — Every qualification, accreditation, registration or insurance you want
    mentioned, with the number.**
    *Cost:* claiming a trade registration you do not hold is a criminal matter in several
    trades, not a marketing slip. If they claim it, the number goes in `facts.md` and gets
    checked against the public register before launch.
18. **Do you have testimonials, and have those people said in writing you can publish them?**
    *Cost:* under the DMCC Act 2024 an unverifiable review is a banned practice with penalties
    up to 10% of global turnover. "He definitely said something like that" is not a source.
    No written permission means no testimonials section. That is fine.
19. **Any numbers you want on the site — customers served, jobs done, success rates?**
    *Cost:* if they have not counted, there is no number. This is where "over 500 happy
    customers" is born.
20. **Anything you must NOT say?**
    *Cost:* regulated trades have claims they legally cannot make, and every owner has one
    sentence a competitor sued over.

## D. Brand and materials

21. **BLOCKING — Do you have a logo? Send the actual file, not a screenshot.**
    *Cost:* a redrawn logo is a lie about their identity, and it will be spotted by the one
    person who matters. Vector if it exists. If there is genuinely no logo, say so in the
    brief and set type instead of drawing one.
22. **BLOCKING — Do you have brand fonts, and are they licensed for web use?**
    *Cost:* the question nobody asks. A desktop font licence does not permit webfont use, and
    foundries do audit. If they have a brand font they cannot licence, the site uses a
    metric-compatible alternative and the brief says why. If they have no fonts, that is the
    designer's choice to make in stage 04 and it should be a real choice, not a default.
23. **Brand colours — do you have hex values, or just "the blue on the van"?**
    *Cost:* an eyedropper on a photo of a van is a legitimate source. Pretending you knew the
    hex is not.
24. **BLOCKING — Photos. Do you have any, and are they yours to publish?**
    *Cost:* stock photos of someone else's premises are a false statement about the business.
    A generated image of a "team" is worse. If there are no photos, the design carries the
    page with type and structure, and that is a decision, not a gap.
25. **Describe three websites you like, and one you hate.**
    *Cost:* taste is not derivable. Without this, stage 04 designs for its own taste and the
    client's first reaction is the expensive one. (Part V turns each answer into a dissected
    reference card.)
26. **Anything you are stuck with? A colour, a strapline, a name on the van?**

## E. What the site has to do

27. **BLOCKING — Do you need to edit it yourself?**
    *Cost:* this is a static site. If they expect to change their own prices, they need to know
    now that every change is a developer job, or they need a different product. Finding out
    after launch is a refund conversation.
28. **What happens after someone enquires? Walk me through it.**
    *Cost:* the site should say what happens next. "We will be in touch" is what a site says
    when nobody asked.
29. **Do you need a booking system, payments, or accounts?**
    *Cost:* all three are out of scope here. Say so at question 29, not at delivery.
30. **Do you want analytics?**
    *Cost:* any analytics means a cookie banner, a cookie policy, and consent before the
    script fires. Many small sites genuinely do not need it, and "no analytics" is the fastest
    path to a site with no banner at all — which is better for the visitor and cheaper to
    build. Make it a decision rather than a default.

## F. Domain, hosting and what already exists

31. **BLOCKING — Do you own a domain? Who has the login?**
    *Cost:* the classic agency trap. If the developer registers it in their own name the
    client is a hostage, and if nobody knows the registrar login the launch stalls for a week.
32. **BLOCKING — Is there an existing site? What happens to it?**
    *Cost:* if it is being replaced, its URLs need a redirect map or the business loses its
    rankings and every printed flyer's link. That map is built in stage 07 and it needs the
    old URL list, which is easiest to get while the old site is still up.
33. **Does your email run on that domain?**
    *Cost:* moving DNS carelessly takes the business's email down. This is the single most
    damaging launch-day mistake and it is entirely avoidable.
34. **Does the existing site get traffic, and do you know what for?**
    *Cost:* if one page brings all the enquiries, do not silently delete it.
35. **Where should the new site be hosted, and who pays for it?**

## G. Process

36. **When do you need it?**
37. **Who signs it off? Is there anyone else who gets a veto?**
    *Cost:* the business partner who appears at the end and hates the colour.
38. **What is the budget, and does it include anything after launch?**
39. **Who writes the copy — you, or me from what you have told me?**
40. **What does "done" mean to you?**

---

## When the client will not answer

Some will not. Record it, do not route around it:

```
| Prices | REFUSED — owner does not want prices published | owner, 2026-01-14 | n/a |
```

Then build what the answers support. A services page with no prices and a clear "ring for a
quote" is honest. A services page with invented prices is not, and the gate will stop it.

The same applies to Part V: a client with no visual opinions is routed to rendered options
at stage 04, and the brief records "no references supplied, direction delegated" — which is
a decision on the record, not a gap someone fills with a default.

## The one to ask even when you think you are finished

> **"Is there anything about how this actually works that I have not asked about?"**

It is where the useful stuff comes from: the minimum call-out, the yard with no hard standing,
the fact they will not take new liveries on a Tuesday. None of it is derivable, all of it is
what makes the site read as though somebody who knows the business wrote it.
