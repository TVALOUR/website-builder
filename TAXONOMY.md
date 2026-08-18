# The defect taxonomy

Where every rule in this repo comes from, and — more usefully — which rules were **rejected**.

**Method.** 17 research angles run in parallel, each admitted only if it could return a finding
no other angle could. Every angle's blockers and majors were then handed to a separate skeptic
told to refute them and to default to refuted when unsure. 226 raw defects survived into 129
deduplicated ones across 14 families. One angle of eighteen (prior-art tooling survey) failed
to return and is recorded as a gap rather than quietly dropped.

**One angle was adversarial by design.** Its whole job was to attack the premise and produce
findings that *remove* rules. It succeeded, and its removals are binding: they are the section
below, and several of them killed things this repo had already built.

---

## What was REMOVED, and why

A taxonomy that only adds is a failed taxonomy. These are rules that seemed obviously right,
that most "AI slop" checklists carry, and that the evidence does not support.

### The em-dash ban became a density cap

**This repo shipped the ban first, and the ban was wrong.**

Measured em-dash rates: a published human-prose corpus pools at **6.43 per 1,000 words**
(range 3.47–10.13); GPT-4.1 sits at **10.62**; plain human controls at **3.23**. Those ranges
overlap. Presence proves nothing, and both Chicago and AP mandate em-dash constructions.
Banning the character forces comma splices into the one artefact the client reads, while the
tells that actually matter — invented testimonials, generic claims, stock imagery — walk past.

Density separates them cleanly, and the measurement on the four real sites this tool was built
against settles it:

| Site | per 1,000 words |
|---|---|
| Site A | **25.97** |
| Site B | 0.22 |
| Site C | 0.00 |
| Site D | 0.00 |

25.97 is two and a half times the top of the entire human published range and more than twice
GPT-4.1's own rate. The instinct was right; the rule was wrong. `copy/em-dash` now warns above
6.43 and blocks above 10.13, both configurable in the profile.

### The cookie banner is no longer a default

**Legally obsolete for this deliverable since 5 February 2026.** The DUAA 2025 exceptions
remove the prior-consent requirement for cookies used solely for first-party statistical
purposes by the site operator, and for appearance and functionality — information plus a free
opt-out is enough. With genuinely cookieless analytics, PECR reg.6 is not engaged at all.

A banner nobody needs costs measured bounce and conversion, and on a small screen it covers the
phone number. The rule is now: no third-party tags, cookieless first-party analytics if any,
and a check that nothing sets a cookie or contacts a third party before interaction.

### Do not ban centred heroes, three-column grids, or common layouts

The evidence runs the other way. First-impression aesthetic judgement forms in 17–50 ms and
rates low visual complexity plus **high prototypicality** best. Jakob's Law and NN/g's
six-times-harder centred-logo finding show what breaking convention costs. The customer arrives
from Google Maps, on a phone, wanting the phone number within five seconds.

`shared/design.md` targets **defaults** — Inter as display face, the violet-to-blue gradient,
four typefaces, `transition: all` — and explicitly does not target convention. That section was
written before this finding arrived and the finding validates it.

### Do not claim AI caused the homogeneous web

Chronologically false. 227,000+ screenshots across 17 years show layout similarity distance
fell **44% between 2010 and 2019**, driven by responsive constraints and Bootstrap, years
before an LLM could generate a page. Models learned the centred hero from a web humans had
already homogenised. The honest pitch is "this does not look like a 2015 template".

### Not adopted, each for a sourced reason

| Rejected rule | Why not |
|---|---|
| **FAQPage schema for rich results** | FAQ rich results stopped appearing in Google Search entirely on 7 May 2026; tooling support removed that June. Keep FAQ pages for humans; never bill the schema. |
| **`llms.txt` for AI visibility** | Google states directly it does not use it, and server logs show AI services do not request it. Harmless on request, never a feature. |
| **Meta keywords, keyword density, "content freshness"** | Disregarded since 2009, never a mechanism, and there is nothing to freshen on a five-page static site. |
| **AI-detector scores as a copy gate** | Vendor claims do not replicate (GPTZero self-reports 99.3%, independent testing 62%); 61.3% of non-native-speaker essays get flagged; OpenAI withdrew its own classifier at 26% TPR. Optimising against it pushes copy toward the flat register that reads machine-written. |
| **"WCAG 2.2 AA conformance" as the gate** | Automated testing fully covers ~57% of issues, and only 50.4% of problems 32 blind users actually hit mapped to any success criterion. An unverified public conformance claim is worse than none. Ship machine checks plus an honest known-limitations statement. |
| **The European Accessibility Act** | Does not reach a UK microbusiness informational site: microenterprise exemption, and decisively Annex I's closed service list. The live duty is the Equality Act's reasonable adjustments. |
| **Core Web Vitals as a blocking gate** | Google calls them lightweight, and a correct static site passes trivially. Meanwhile GBP signals carry roughly a third of local-pack weight against on-page's ~19%. A perfect Lighthouse score on a site nobody finds is worth nothing. |
| **Back-end security rules** | Authorisation checks, SQLi, row-level security, exposed DB keys — all require a back end that does not exist here. Every check that cannot fail displaces one that can. |
| **`rel="noopener"` as a security finding** | Browsers apply implicit noopener to `target="_blank"` at ~94% coverage. Kept as a free lint; not presented as security. |
| **GA/Meta Pixel as an unlawful transfer** | Stale by three years: the EU-US Data Privacy Framework adequacy decision (July 2023) restored a valid mechanism and both self-certified. The real issue is narrower — neither qualifies for the DUAA statistics exemption, so either one reinstates a full consent banner. |
| **44×44px as the WCAG target size** | That is 2.5.5 Enhanced, Level AAA. The AA floor is **24×24** under 2.5.8. Citing 44 makes the rule feel simultaneously optional and unachievable. |
| **Fixing review rich results with an embedded GBP/Trustpilot widget** | Google explicitly names an embedded third-party widget on the entity's own site as still self-serving. A pipeline "fixing" this ships ineligible schema believing it compliant. Hence the flat rule in `seo/review-schema`. |
| **Relative asset paths for subdirectory deploys** | Backwards for this target. These go to a root domain, and Cloudflare Pages' trailing-slash rewriting changes effective depth per page, so relative is the fragile choice. |
| **SPA fallback routing and `.nojekyll`** | No client router, and the host is not GitHub Pages. Ship a real `404.html` instead. |
| **`unicode-range` subsetting of Google Fonts** | The CSS2 API already splits per-script and browsers fetch only what they need. The real risk is a manually exported font never run through a subsetter. |
| **Requiring a specific `LocalBusiness` subtype** | No source establishes a benefit, and several target trades (farrier, tree surgeon) have no clean subtype. Free polish, never a defect. |
| **Checking Tailwind purge config** | Stale: JIT has been default since v3 and v4 does zero-config detection. The surviving risk is dynamically constructed class strings. |
| **Gradient blobs / aurora backgrounds as an AI tell** | Signal decayed; premium human-designed sites now use it as much as generators do. |
| **Accessibility overlay widgets** | Not merely useless — actively harmful. ~25% of 2025 US accessibility suits targeted sites already running one, and the FTC fined accessiBe $1m in 2025 over deceptive compliance marketing. This one became a **blocking** gate in the opposite direction (`a11y/overlay-widget`). |

### Rules must be able to decay

The deeper finding behind several of the above: this repo had **no mechanism for retiring a
rule whose signal decays**. Gradient blobs were an AI tell in 2023 and are not in 2026, and
nothing in the system could notice.

So every rule file carries a source, a date, and a review date; and the removal route in this
document is a first-class part of the taxonomy rather than an appendix.

---

## What was ADDED as a result

Gates that did not exist before the research and do now:

- **`integrity/tel-link`** — a phone number as plain text, not a `tel:` link. Ranked the single
  most demonstrable defect of all 129: the site's whole job is a phone call, the visitor is on
  a phone, they tap the number, nothing happens. Invisible on a desktop forever.
- **`seo/review-schema`** — `Review`/`AggregateRating` on the business's own domain, flat rule.
- **`seo/charset-early`** — charset present but declared past ~1024 bytes, which still produces
  the mangled price list a presence check would pass.
- **`a11y/overlay-widget`** — accessibility overlay vendors, blocking.
- **`seo/structured-data`** upgraded from presence to **completeness**: a `LocalBusiness` node
  missing name, address, telephone, url or hours is machine-readable nothing.

---

## What could NOT be established

Recorded because a research pass that reports only what it found is half a report.

- **One angle of eighteen failed to return**: the prior-art survey of competing AI website
  builders (Lovable, v0, Bolt, Framer AI, Wix ADI, Durable, 10Web and the developer-side
  tooling ecosystem). So this repo's claims about what competitors do or do not ship are
  **unverified**, and the README does not make any.
- **No benchmark exists for AI-detection on marketing copy at all** — only on essays and
  academic prose. Every claim about detecting machine-written *web* copy is extrapolation.
- **Whether publishing prices helps or hurts a local service business** is not settled by
  anything found; the question is left to the client at stage 01 rather than answered by rule.
- **The ICO's actual enforcement posture toward microbusinesses** could not be established from
  primary sources. The profile encodes the requirements, not a risk estimate, and says so.

---

*Sourced from an 18-angle research wave run 2026-08-18, verified adversarially, synthesised
against a gap scan of the system this repo replaces. Raw output: `wf_0b2b4374-0fd`.*
