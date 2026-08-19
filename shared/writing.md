# Writing

The design gives an AI site away in about two seconds. The writing gives it away in one, and
it is the half nobody guards.

This file is the method for stage 03. `checks/rules/copy.mjs` enforces the mechanical parts of
it, and the parts a script cannot check are here because they are still the rules.

---

## The one test

> **Could this paragraph appear, word for word, on a competitor's website?**

If yes, it says nothing. Delete it and write the specific thing instead. This single question
catches more filler than every rule below combined, and it is the one to run on your own draft
before anybody else sees it.

"We pride ourselves on quality workmanship and customer satisfaction" passes every grammar
check ever written and communicates precisely nothing. "He will tell you when he thinks you
are stretching a shoeing cycle" could only be about one business.

---

## The em dash

**None in body copy.** Not fewer. None.

The reasoning, because a rule you do not understand is a rule you will quietly drop:

An em dash is a fine mark and good writers use it. That is not the point. The point is
**density**. A human writing a page about drainage uses one, maybe, if the sentence really
wants it. A language model uses one per paragraph, because the dash is how it holds two
half-thoughts together without committing to the relationship between them, and it has been
trained on a great deal of prose that does exactly that.

So the tell is not the character. The tell is *reaching for it*. And on a five-page site for a
local business the honest fix is nearly always better writing anyway: the dash is hiding either
two sentences that should be separate, or a clause that wants a comma, a colon or brackets.

- *"We offer a full service — from first visit to final invoice."* → *"We offer a full service,
  from first visit to final invoice."*
- *"He is a farrier — and a good one."* → *"He is a farrier, and a good one."*
- *"Three things matter — speed, price and trust."* → *"Three things matter: speed, price and
  trust."*

The gate blocks on any em dash in visitor-facing copy. If you are writing something genuinely
editorial where the dash earns its place, raise `copy.emDashAllowance` in your profile and own
the decision. Do not smuggle them past by using an en dash instead: that is the same reach with
a narrower character.

---

## Words that mean nothing

These do not appear. Not because any one is a crime, but because together they are the
vocabulary of text that was generated rather than written.

**seamless · elevate · unlock · delve · tapestry · cutting-edge · state-of-the-art ·
world-class · best-in-class · game-changer · ever-evolving · unparalleled · meticulously ·
nestled · embark · empower · harness the power · synergy · holistic approach · testament to ·
passionate about · your journey · crafted with care · at the heart of everything we do ·
when it comes to · look no further · rest assured · dive into · in the realm of ·
plays a pivotal role · fast-paced world**

The replacement is always the same shape: **a fact instead of an adjective.** Not "meticulous
attention to detail" but "he re-checks every shoe cold before he leaves". Not "passionate about
customer service" but "you get a text before he is late, not after".

---

## Sentences that give it away

Structure is the harder tell, because no word list catches it.

- **"Not just X — it's Y."** The most recognisable construction in machine-written marketing.
  It sounds like a thought and contains none. Say Y.
- **"Whether you're a X or a Y…"** A way of addressing everyone, which is a way of addressing
  nobody. Pick one and write to them.
- **"In today's fast-paced world…"** Delete the clause. The sentence is always better.
- **"That's where we come in."** Never.
- **"We understand that…"** Throat-clearing. Start at the next word.
- **"Are you looking for…?"** A rhetorical question opener is a stall.
- **The rule of three, every time.** Three adjectives, three benefits, three cards. One list of
  three is rhythm. Every list of three is a template.
- **Uniform sentence length.** This is the tell no vocabulary list catches and the one that
  survives every rewrite. Human writing lurches: a four-word sentence next to a twenty-six-word
  one. Generated writing settles at fifteen to twenty and stays there. Read your draft aloud;
  if it has no lurch in it, break something.

---

## What good local-business copy actually does

1. **Says what the thing is in the first six words.** A visitor deciding whether they are in
   the right place has already decided by then.
2. **Answers the phone questions.** Question 10 in the interview asks what customers ask that
   the site should have told them. Those answers are the page, near enough verbatim.
3. **Uses their words.** If the owner says "the round", the site says "the round", not
   "our service portfolio". Insider language the customer also uses is trust. Insider language
   the customer does not use is a wall.
4. **Names places, times and prices.** "Saturday clinics in Bideford" beats "flexible
   appointments". Specificity is the entire mechanism by which copy sounds human.
5. **Admits the limits.** "New yards usually wait eight to ten days" is more persuasive than
   "fast, reliable service", because only one of them is a thing somebody could be wrong about.
   Copy that could not be false does not read as true.
6. **One action, said the same way everywhere.** Pick "Call Will" or "Request a quote" and use
   that exact phrase in every button on the site.

---

## Honesty, which is the floor

Use only facts from `facts.md`. Never invent a price, a testimonial, a client name, a
credential, a qualification, a year, an award, a team member, an address or a "trusted by"
logo.

A missing fact is `[NEEDS: …]` and it goes to the human. It is never a plausible-sounding
guess, and it is never quietly dropped either, because a section silently deleted is a decision
the client did not get to make.

No lorem ipsum, ever. Every word ships or is explicitly labelled as missing.

---

## The lines nobody writes, which are the ones people read

Every one of these is a sentence a real business's site has and a generated one does not, because
nobody asked for it and no gate misses it. They are short, they are boring to write, and between
them they do more work than the homepage.

- **What happens after the button.** "We reply the same working day, usually by phone." A form
  whose last line says what happens next converts better than any headline on the site, and almost
  no generated site has one.
- **The bank holidays.** Generated sites list Monday to Friday and stop. The customer's actual
  question is about the day that is not in the list — so write "Sunday and bank holidays: closed",
  and write the Christmas closure with its dates and take it down in January.
- **The access line.** "Level access throughout, no step at the threshold, and the toilet is
  accessible." Worth more to the people who need it than every accessibility statement on the site,
  and it costs one sentence.
- **The directions a satnav gets wrong.** "If your satnav sends you to Trescott Farm you have gone
  half a mile too far." Nobody can invent this. It is the clearest possible proof a person wrote
  the page.
- **The limit, stated before it is asked about.** "There are two of us and we do not run more than
  one job at a time. It is the reason the work is what it is, and it is the honest trade." Copy that
  could not be false does not read as true.
- **The thing the trade is bad at.** Real sites name the awkward part — a lead time, a minimum
  charge, a job they will not take. It is the single fastest way to sound like a business rather
  than a brochure, and it is the sentence a model will never volunteer.
- **A caption on the photograph.** "The drying store. Oak sits here for a year before anything is
  cut from it." Captions are almost never written, which is exactly why one reads as made.
- **A date on anything temporary.** A notice with no date is a notice nobody can tell has gone
  stale — and a stale one is the loudest possible signal that nobody maintains the site.

## The wording of a price

Prices are where copy is most tempted into vagueness and where vagueness costs the most.

- **"From £420 a window" beats "competitive rates"** by every measure, including the number of
  wasted phone calls.
- **A "from" price owes the reader what moves it.** "Rot repairs are quoted separately after we
  open it up" is the sentence that stops the price being a bait.
- **"Prices on application" is a real answer** when the work genuinely varies, and it needs the
  reason attached: "every roof is different and a number here would be a guess" is honest;
  "contact us for a bespoke quotation" is a stall.
- Whatever the number is, it is in `facts.md` with a source, or it does not go on the page.
  `facts/unsourced-price` blocks it either way.

## What a regulated trade may not say

If the build declares a `Sector`, read `sectors/<id>.mjs` before writing a word of the services
page. The copy is where these go wrong, not the markup, and some of them are offences rather than
style:

- **Never a protected title the client does not hold.** "Physiotherapy" on a sports-massage site is
  the representation Health Professions Order 2001 art.39 is about, not a synonym.
- **Never "cure", never "guaranteed results", never a named serious condition** on a clinic site.
  CAP rule 12.6 and, for one condition, Cancer Act 1939 s.4, which has no evidence defence.
- **Never name or price a prescription only medicine.** Botox and its siblings. Write the
  consultation, the practitioner and the assessment instead — which is better copy anyway, because
  it is about the person rather than the product.
- **Never an accreditation stretched past its scope.** "Gas Safe registered" beside an electrical
  offer is a claim about a registration that does not cover it.
- **Say the registration, and link the register.** Every regulator in `sectors/` runs a free public
  one. A number with a link beside it is checkable in a click; a number alone is a request to be
  believed.

---

## Microcopy

The button labels, the form hints, the error messages, the empty states, the alt text. Nobody
writes these, which is exactly why writing them is most of what makes a site feel made.

- Button: say what happens. "Send enquiry", not "Submit".
- Error: say what to do. "That postcode has too few characters", not "Invalid input".
- Alt text: say what the image conveys *here*. "Andy fitting a splint in a client's living
  room", not "physiotherapy".
- After a form: say what happens next and roughly when. "We will ring you back the same
  evening" is worth more than the entire homepage.

---

## Typography of the text itself

- Curly quotes and apostrophes, not typewriter ones. `’` and `“ ”`.
- A real ellipsis character, or better, no ellipsis.
- A hyphen in compound words, an en dash in number ranges (`9–5`), and no em dash at all.
- `£1,200` with the comma. `01271 860 442` grouped the way people read it out.
- Exclamation marks are enthusiasm punctuation standing in for a reason to be enthusiastic.
  Use approximately none.
