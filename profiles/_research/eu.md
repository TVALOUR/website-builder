# profiles/eu.mjs — research notes

**Pass run:** 2026-08-18. **Profile status:** `researched` — assembled from primary sources by an
agent, read by nobody qualified. **Next review:** 2027-02-18.

**Scope of the question asked:** a 5–10 page static brochure site for a small business or sole
trader in the EU. No accounts, no payments, no database. Contact form posting to a third-party
service, `tel:`/`mailto:`, optionally analytics, optionally an embedded map or video. Nothing here
was researched for e-commerce, platforms, or anything holding an account.

**Method:** `tools/research-policy.md` — fan out by ANGLE, never by headcount; contradiction angle
mandatory at every tier; rank sources on the evidence ladder and record the cut. Six angles ran in
parallel, plus an independent verification pass by the synthesising agent on every claim that
decides an output in the profile.

---

## 1. Angles run

| # | Angle | Finds what no other angle could | Outcome |
|---|---|---|---|
| A | **Currency — ePrivacy Regulation + 2025 GDPR simplification** | Whether the instrument everyone cites still exists | Two headline reversals. See §3. |
| B | **Transfers — DPF validity, Schrems II, Art.28** | Whether the US form host is usable today | DPF in force, challenged, survived at first instance, on appeal |
| C | **Member-state variance** | Where the EU floor is not the real rule | Six countries documented, one genuinely divergent obligation found (Belgium) |
| D | **⚠ CONTRADICTION — mainstream cookie advice is wrong** | Stops a confirming sweep | The most productive angle of the six. See §4. |
| E | **Commercial law — eCommerce Art.5, DSA, UCPD, green claims, reviews** | The dated obligations and the scope traps | Green-claims date confirmed; DSA scope finding |
| F | **EAA scope test** | Whether the accessibility page is a duty or a courtesy | Outside scope on two independent grounds. See §5. |
| — | **Verification pass (synthesiser, not delegated)** | Whether the collectors' load-bearing claims survive a second fetch | Four claims re-fetched independently; two collector failures recovered |

**Angle admission test applied.** Each angle had to name a find no other angle could return. An
earlier seventh angle ("general GDPR compliance for small websites") was cut before launch: it
could not name a unique find, and would have returned the same consensus the contradiction angle
exists to interrogate.

**Where the verification pass mattered.** Angle D reported it could not extract the EDPB Cookie
Banner Taskforce report or EDPB Guidelines 2/2023 (both PDFs returned binary garbage through the
fetch tool). The synthesiser downloaded both and extracted them locally, which is how paragraphs 8,
24 and 34 of the Taskforce report and paragraphs 1, 4, 50–51 and 55–56 of Guidelines 2/2023 reached
this profile as **primary** text rather than as a law-firm paraphrase. Angle A likewise reported one
of its own earlier fetches had produced a wrong CELEX attribution and corrected itself — recorded
here because a collector that flags its own bad read is worth more than one that does not.

---

## 2. Sources — every URL below was fetched on 2026-08-18

Ranked on the evidence ladder in `tools/research-policy.md` §6: primary legislation > EU regulator
guidance > national regulator (DPA) > court press office > trade/law-firm commentary > vendor blog.

### Primary legislation and official records

| Instrument / record | URL | Tier |
|---|---|---|
| GDPR Art.13 (privacy-notice contents; 13(4) already-has-the-information limit) | https://gdpr-info.eu/art-13-gdpr/ | primary text (mirror) |
| GDPR Art.6(1) lawful bases | https://gdpr-info.eu/art-6-gdpr/ | primary text (mirror) |
| GDPR consolidated — Art.28(1) and 28(3) quoted verbatim | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02016R0679-20160504 | primary |
| ePrivacy Directive 2002/58 consolidated to 19/12/2009 — Art.5(3), status **In force** | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02002L0058-20091219 | primary |
| **ePrivacy Regulation withdrawal** — EP Legislative Train, procedure 2017/0003(COD) | https://www.europarl.europa.eu/legislative-train/theme-connected-digital-single-market/file-jd-e-privacy-reform | primary (EU institution) |
| OJ withdrawal notice listing COM(2017)10, C/2025/5423, 6.10.2025 | https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=CELEX:52025XC05423 | primary |
| Digital Omnibus procedure file 2025/0360(COD), status **Ongoing** | https://eur-lex.europa.eu/procedure/EN/2025_360 | primary |
| COM(2025)501 corrigendum — proposed Art.30(5) at 750 persons | https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:52025PC0501R(01) | primary |
| e-Commerce Directive 2000/31 — Art.5, Art.6 | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32000L0031 | primary |
| 2000/31 consolidated to 17/02/2024 — Arts.12–15 marked DELETED, Art.5 standing | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02000L0031-20240217 | primary |
| UCPD 2005/29 consolidated to 28/05/2022 — Arts.6, 7, Annex I pts.1, 4, 20, 23b, 23c | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02005L0029-20220528 | primary |
| Omnibus Directive 2019/2161 Art.7 — applied from 28 May 2022 | https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A32019L2161 | primary |
| Directive (EU) 2024/825 (green transition) — Art.4 dates, Annex bans | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024L0825 | primary |
| **EAA Directive (EU) 2019/882** — Arts.2(2), 3(23), 3(30), 4(5), 14, 31, 32, Annex I §IV(g), recital 43 | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882 | primary |
| Web Accessibility Directive 2016/2102 Art.1(2) — public sector only | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016L2102 | primary |
| DPF adequacy decision (EU) 2023/1795 — status **In force** | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023D1795 | primary |
| SCCs, Implementing Decision (EU) 2021/914 — status **In force** | https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj/eng | primary |
| Appeal C-703/25 P against T-553/23, brought 31 October 2025 | https://eur-lex.europa.eu/eli/C/2025/6610/oj/eng | primary |
| **Regulation (EU) 2024/3228 Art.1** — repeals ODR Regulation 524/2013 from 20 July 2025 | https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202403228 | primary |

### Regulator and court

| Source | URL | Tier |
|---|---|---|
| **EDPB Guidelines 2/2023 v2.0**, adopted 7 October 2024 — technical scope of Art.5(3) | https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf | EU regulator (extracted locally) |
| **EDPB Cookie Banner Taskforce report**, adopted 17 January 2023 | https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf | EU regulator (extracted locally) |
| EDPB Guidelines 2/2019 on Art.6(1)(b) for online services, v2.0, 8 October 2019 | https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines-art_6-1-b-adopted_after_public_consultation_en.pdf | EU regulator — **PARTIAL, see §7** |
| EDPB DPF FAQ for businesses, 16 July 2024 | https://www.edpb.europa.eu/system/files/2024-07/edpb_dpf_faq-for-businesses_en.pdf | EU regulator |
| **CNIL Sheet 16** — audience-measurement exemption criteria | https://www.cnil.fr/en/sheet-ndeg16-use-analytics-your-websites-and-applications | national DPA |
| CNIL "Que dit la loi ?" — exempt tracker list, refuse-as-easy-as-accept | https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi | national DPA |
| CNIL audience-measurement solutions, updated 4 July 2025 | https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience | national DPA |
| AEPD press release — reject at the same level, deadline 11 January 2024 | https://www.aepd.es/prensa-y-comunicacion/notas-de-prensa/aepd-actualiza-guia-cookies-para-adaptarla-a-nuevas-directrices-cepd | national DPA |
| Garante cookie guidelines, June 2021 | https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876 | national DPA |
| **CJEU General Court press release 106/25** — T-553/23 Latombe **dismissed**, 3 September 2025 | https://curia.europa.eu/jcms/upload/docs/application/pdf/2025-09/cp250106en.pdf | court |
| Germany DDG §5 — Impressum duty | https://www.gesetze-im-internet.de/ddg/__5.html | national statute |
| Germany TDDDG §25 — terminal-equipment consent (still served at the `/ttdsg/` path) | https://www.gesetze-im-internet.de/ttdsg/__25.html | national statute |
| Spain LSSI Ley 34/2002 arts.10, 22.2 | https://www.boe.es/eli/es/l/2002/07/11/34/con | national statute |
| Belgium Code de droit économique art.III.74 — enterprise number on the site | https://etaamb.openjustice.be/fr/loi-du-17-juillet-2013_n2013011345.html | national statute (official mirror) |
| **Bundesnetzagentur Mitteilung 148/2021** (Amtsblatt 07/21, 14.04.2021) — reserved "Drama Numbers" | https://www.bundesnetzagentur.de/DE/Fachthemen/Telekommunikation/Nummerierung/_DL/mittlg148_2021.pdf | national regulator (extracted locally) |

### Commentary, vendor and tertiary — used only where labelled, never load-bearing

Included so the disagreement is visible, not because it decides anything: Kinsta and Level Access
(EAA scope, both sell accessibility compliance); IAPP (EDPB Opinion 08/2024 scope); Osborne Clarke
(Digital Omnibus and cookie fatigue); Dr. Bahr and shopbetreiber-blog (German Google Fonts
follow-on rulings); Wikipedia (member-state drama-number ranges, superseded for Germany by the
Bundesnetzagentur PDF above).

---

## 3. Currency — what changed, and what a 2024-vintage template still gets wrong

This is the section the UK profile's header demanded. Three live decay traps were found, and all
three are things a competent developer would have written into a legal page from memory.

### 3.1 The ePrivacy Regulation is DEAD, not "coming"

Every "prepare for the ePrivacy Regulation" line written between 2017 and 2024 is now false.

- The Commission's 2025 Work Programme (COM(2025)45 of 11 February 2025) listed it in Annex IV,
  withdrawals.
- The **Commission approved the withdrawal at its 2533rd meeting on 16 July 2025** and announced it
  in the Official Journal on **6 October 2025** (OJ C/2025/5423). The EP Legislative Train file for
  2017/0003(COD) reads "Proposal withdrawn"; the EUR-Lex procedure file and the Parliament's
  Legislative Observatory both show "Procedure lapsed or withdrawn" dated 06/10/2025.
- Consequence for this profile, and it is the important one: **Directive 2002/58 is not a
  transitional instrument. It is the law, indefinitely, and it is a DIRECTIVE** — which is why
  `provenance.caveats` and the `eu/derive-member-state-profile` extra say that the EU floor is not
  where any real site stands. There is no forthcoming harmonisation to wait for.

### 3.2 The 2025 GDPR "simplification" is a PROPOSAL and changes nothing today

- **Digital Omnibus, COM(2025)837 of 19 November 2025**, procedure 2025/0360(COD). It would insert
  a new **GDPR Art.88a** carrying the consent requirement for storing or accessing information on
  terminal equipment — i.e. move the cookie rule out of ePrivacy and into the GDPR — plus an
  **Art.88b** on automated, machine-readable consent signals, and would repeal Art.4 of the
  ePrivacy Directive. The EUR-Lex procedure file status on 2026-08-18 is **"Ongoing"**. Nothing is
  in force. The consolidated GDPR still shows current consolidated version 04/05/2016 with no
  omnibus amendment.
- **COM(2025)501 of 21 May 2025** would raise the Art.30(5) record-keeping derogation from under
  250 to under 750 persons, gated on high-risk processing. Also unadopted.
- Design consequence: **do not build to either.** If the Omnibus passes, cookie consent moves
  statute but the substance a brochure site cares about — prior consent before non-essential
  storage — is not abolished by it. The one change worth watching is Art.88b, because a
  browser-level signal would eventually make banners the wrong shape rather than merely
  overused.

### 3.3 The ODR platform is switched off, and the link is still in every template

**Regulation (EU) 2024/3228 Art.1: "Regulation (EU) No 524/2013 is repealed with effect from 20
July 2025."** New complaints stopped 20 March 2025; the platform closed and its data was deleted on
20 July 2025. Art.3 of the repealing regulation also deleted the corresponding entry from the CPC
Regulation annex.

An enormous number of EU legal-page templates hardcode
`https://ec.europa.eu/consumers/odr`. Shipping it now publishes a link to a dead service on the
page about being trustworthy. This is exactly the class of error that produced the UK profile's
three revoked citations, caught before it entered the file rather than after — and it is why
`legal.extras` contains **`eu/no-odr-link`** as a *removal* instruction, the only extra in the file
that tells the builder to take something out.

Directive 2013/11 on consumer ADR was **not** repealed alongside it, so a trader committed to a
particular ADR body still names that body. Only the EU-level routing platform is gone.

---

## 4. ⚠ CONTRADICTION ANGLE — what it actually found

The brief required at least two credible sources arguing mainstream EU cookie advice is wrong or
overstated. It found more than that, and it inverted one assumption the profile started with.

### 4.1 "Every site needs a banner" is false, and the regulators say so — quietly

CNIL publishes an explicit list of trackers exempt from consent under Art.82 LIL: the tracker
storing the user's own cookie choice, authentication, shopping basket, interface personalisation,
load balancing, paywall metering, and certain audience measurement. Nothing in that list needs a
banner. And the underlying logic is simpler than the guidance makes it look: **Art.5(3) bites on
storage and access. A site that stores nothing has nothing to consent to.**

So the profile's `consentModel` is `prior-opt-in` and its `consentModelWhy` opens by saying a
banner is usually **not** required — because getting that backwards is the single most common error
in this area, and it is an error that costs every visitor a click while publishing a false claim
about the site.

**Nothing was found that contradicts this.** No regulator, vendor or practitioner source argued
that a site with no non-essential storage needs a banner. The mainstream advice is not wrong on the
law; it is wrong by omission, because it is written for sites that do load trackers and is then
applied to sites that do not.

### 4.2 The most surprising find: CNIL's exemption is HARSHER than the vendors selling it claim

This is the inversion, and it went the opposite way to expectation.

The expected find was "regulators have blessed cookieless first-party analytics, so the mainstream
consent advice is overstated." What CNIL's own primary text says, on Sheet 16 (fetched directly):

> "Not to cross-check the data processed with other processing"; "To limit the scope of the tracer
> to a single site or application editor"; "To truncate the last byte of the IP address"; "To limit
> the lifetime of the trackers to 13 months" — and, decisively:
> **"Most large audience measurement offerings do not fall within the scope of the exemption,
> regardless of their configuration."**

That last sentence is not how the exemption is marketed. Compliance vendors present it as
validating "consent-free analytics" as a category. CNIL presents it as a narrow door most products
cannot fit through *at any configuration setting*, and points at self-configured open source
(Matomo) as the way to meet it. Google Analytics is outside it in France.

Two further precision points that the vendor framing drops entirely, and that are now in the
profile as **`eu/cookieless-is-not-exempt`**:

1. **"Cookieless" is not a magic word.** EDPB Guidelines 2/2023 v2.0 (adopted **7 October 2024**)
   hold that Art.5(3) *"does not exclusively apply to cookies, but also to 'similar technologies'"*
   and work through pixels, tracked URLs, local processing and IP-only tracking. On pixels and
   tracked links, para.50: distribution to the terminal *"does constitute storage, at the very
   least through the caching mechanism of the client-side software. As such, Article 5(3) ePD is
   applicable, even if this storage is not permanent."* On IP-only tracking, para.55: unless the
   entity *"can ensure that the IP address does not originate from the terminal equipment of a user
   or subscriber, it has to take all the steps pursuant to the Article 5(3) ePD."*
2. **An ePrivacy consent exemption is not a GDPR exemption.** CNIL frames Sheet 16 purely as an
   Art.82 consent exemption and says nothing about lawful basis, Art.13 notice or retention, all of
   which remain owed.

### 4.3 The EDPB explicitly refuses to answer the question everyone asks it

Guidelines 2/2023 para.4, verbatim: the guidelines *"do not address the circumstances under which a
processing operation may fall within the exemptions from the consent requirement provided for by
the ePD, as these circumstances should be analysed on a case-by-case basis accounting for the
relevant member state transposition(s), and guidance issued by national Competent Authorities."*

And the Cookie Banner Taskforce report's own disclaimer says its positions *"reflect a minimum
threshold"* which *"have to be combined with the application of additional national requirements
stemming from the national laws transposing the ePrivacy Directive."*

**This is the load-bearing finding for the profile's architecture, not merely a caveat.** The
EU-wide body, twice, in writing, declines to state the exemption line and hands it to member
states. That is why `eu/derive-member-state-profile` is rated `blocker` and why the profile refuses
to encode a France-shaped analytics exemption as an EU rule.

### 4.4 Where the Taskforce report IS firm

Worth recording because it is stricter than commonly implemented, and because it comes from primary
text this pass extracted itself:

- **Para.24:** *"the legal basis for the placement/reading of cookies pursuant to Article 5 (3)
  cannot be the legitimate interests of the controller."* There is no legitimate-interest route
  around a banner.
- **Para.8:** a *"vast majority"* of authorities consider the absence of a refuse option on **any**
  layer to be an infringement — while *"[f]ew authorities considered that they cannot retain an
  infringement in this case as article 5(3) of the ePrivacy Directive does not explicitly mention a
  'reject option'."* Note what this does and does not say: the EDPB common denominator is
  reject-on-some-layer. **CNIL and AEPD both go further and require first-layer parity.** That gap
  is member-state variance, not EDPB doctrine, and §6 records it as such.
- **Para.34:** three cumulative conditions — withdrawal must be possible, at any time, and *"as
  easy as to give consent"* — but para.35 declines to mandate any specific mechanism.
- **Para.10:** pre-ticked boxes never produce valid consent.

### 4.5 "Consent or pay" does not reach a small site

EDPB **Opinion 08/2024** is scoped to **large online platforms** (VLOPs / gatekeepers). Citing it at
a plumber's brochure site is a category error. Follow-up guidance for smaller platforms was flagged
as pending when the opinion issued; whether it has since published could not be established (§7).

### 4.6 Cookie fatigue is conceded by the Commission — but as a mechanism problem

The Digital Omnibus explanatory material treats *"consent fatigue and proliferation of cookies
banners"* as a problem needing a long-overdue fix. But the fix proposed is procedural — browser-
level signals, symmetric one-click accept/reject, a six-month non-repeat window — **not** a
retraction of "non-essential tracking needs consent." So the fatigue critique is regulator-endorsed
and does **not** support "banners were never necessary." It supports "banners are the wrong
interface for a rule that stands."

### 4.7 Google Fonts: the ruling stands, the industry built on it was held abusive

The strongest form of the contradiction — "LG München I was wrong on the law" — was **not** found.
No credible named source disputes the holding that unconsented third-party font loading transmits
the visitor IP without a basis.

What *was* found is narrower and more interesting: **LG München I itself**, in 4 O 13063/22 (30
March 2023), and **AG Ludwigsburg** in 8 C 1361/22, held the mass warning-letter campaign built on
the 2022 ruling to be an **abuse of rights** under BGB §242, because the claimant crawled sites to
provoke the transfer and then monetised it. Both things are true at once, and vendor marketing
conflates them.

**Followed:** self-host the fonts, on a rationale that does not depend on the litigation — it
removes the question entirely and is faster. That framing is now in `eu/self-host-fonts-and-embeds`
precisely so the fix survives someone discovering the abuse-of-rights cases and concluding the
whole issue was hype.

### 4.8 Art.13 on a site that collects nothing but server logs

Tested as asked. The result is honest and unglamorous: **the contradiction case is weaker than the
mainstream case.**

- For "not required": a German legal-press piece (LTO) makes the narrow, real point that German law
  contains no *cookie-specific* information duty and that Art.13 GDPR itself carries no
  cookie-specific disclosure. Art.13(4) also disapplies the duty *"where and insofar as the data
  subject already has the information."* But neither argument gets you to "no notice at all."
- For "required": an IP address is personal data where the operator can reasonably obtain the means
  to identify the person (CJEU C-582/14 *Breyer*), and Art.13(1) triggers on collection from the
  data subject.

**Followed the mainstream:** `pages.privacy.required = 'always'`. Two reasons. Legally, the
argument against is narrow and contested. Practically, this profile's assumed site **has a contact
form**, which puts it squarely inside Art.13(1) regardless of how the server-log question resolves,
so the debate does not change the output for any site in scope.

---

## 5. The EAA verdict, and why it is `recommended` and not `always`

**A microenterprise brochure site with a contact form is outside the European Accessibility Act, on
two independent grounds, either of which is probably sufficient alone.** The obligation *is* live —
Art.31(2), applying from **28 June 2025** — so the question is scope, not timing.

**Ground 1 — Art.2(2) is a closed list.** Electronic communications services; services providing
access to audiovisual media services; certain air, bus, rail and waterborne passenger-transport
elements; consumer banking services; e-books and dedicated software; and e-commerce services. A
brochure site is none of the first five. It can only enter via "e-commerce services", which
**Art.3(30)** defines as services provided at a distance by electronic means at the individual
request of a consumer *"with a view to concluding a consumer contract"* — and **recital 43** anchors
this to *"the online sale of any product or service."* A form producing an enquiry that a human
answers, after which the contract is agreed by phone or in person, is marketing, not the
transaction. **Annex I §IV(g)** corroborates the target: its requirements are about identification,
electronic signature and **payment** functionality. A site with no payment has nothing for that
provision to bite on.

**Ground 2 — Art.4(5), quoted verbatim:** *"Microenterprises providing services shall be exempt
from complying with the accessibility requirements referred to in paragraph 3 of this Article and
any obligations relating to the compliance with those requirements."* A blanket carve-out for
services. Contrast **Art.14(4)**, which for microenterprises dealing with **products** only waives
the *documentation* of the disproportionate-burden assessment. **Art.3(23):** fewer than 10 persons
AND turnover or balance sheet not above EUR 2 million — which a solo brochure-site owner meets
without argument.

**Directive 2016/2102 helps neither side:** Art.1(2) scopes it to public sector bodies.

### Does the UK profile's argument transfer? Partly — and the parts differ

The UK profile argues the EAA does not reach a UK microbusiness informational site on two grounds:
the microenterprise exemption, and "more decisively" the Annex I closed list of service categories.
Tested for the EU rather than inherited, the result is:

- **The closed-list ground transfers, but the citation was loose.** The closed list is in **Art.2(2)**,
  not Annex I; Annex I contains the *requirements*, and Annex I §IV(g) is where the e-commerce ones
  live. The EU profile cites Art.2(2) and Art.3(30) as the scope gate and uses Annex I §IV(g) only
  as corroboration. Same conclusion, correct provision.
- **The microenterprise ground transfers and is stronger than the UK file implies**, because
  Art.4(5) is total for services rather than partial.
- **The framing does not transfer.** For a UK site the EAA is a foreign instrument that might reach
  a trader selling into the EU; for an EU site it is domestic law and the analysis is load-bearing.
  So the EU profile carries the counter-argument explicitly (`eu/eaa-rescope-if-transactional`)
  where the UK file could afford not to.

### The honest counter-argument

If the "contact form" is really a **booking or order** that concludes something on submission — an
auto-confirmed reservation, a fixed-price service accepted on the page — ground 1 weakens
considerably, and only the microenterprise exemption is left. **No case law, Commission Q&A or
guidance was found addressing the enquiry-form-versus-online-sale line.** The verdict is a reading
of Art.3(30) plus recital 43, and it is contestable.

Two commercially interested sources were fetched and are recorded so the disagreement is visible:
**Kinsta** ("Microenterprises don't need to comply in 2025 with the EAA" — consistent on the micro
point, but listing "provision of professional services (e.g. doctors, lawyers, real estate agents)"
as covered, which Art.2(2) does not say) and **Level Access** ("applies to any business… that sells
covered products or services to EU consumers"). Neither claims in terms that a pure brochure site
is covered. Both sell EAA compliance tooling. A boundary two vendors push on is a boundary, not a
wall — which is why the profile ships the accessibility statement anyway, as honest good practice,
and simply refuses to claim the EAA compelled it.

---

## 6. Member-state variance table

The profile is an **EU floor**. Every row below is a place where the real rule is above it. A
member-state profile should be derived from `eu.mjs` before any real build.

| State | Deviation above the EU floor | Source |
|---|---|---|
| **Germany** | Impressum duty at **DDG §5** (the DDG replaced the TMG; §5 lists name, address, legal form, contact permitting *"schnelle elektronische Kontaktaufnahme und unmittelbare Kommunikation"*, register + number, VAT/economic ID, and audiovisual regulator where relevant). Cookie/terminal-equipment consent at **TDDDG §25** — the statute formerly abbreviated TTDSG, still served from the `/ttdsg/` path on gesetze-im-internet.de. **MStV §18** adds a named responsible person for journalistic-editorial telemedia, who must be resident in Germany. Sole traders must give a real first and last name. | gesetze-im-internet.de (primary) |
| **Spain** | **LSSI Ley 34/2002 art.10** information duties (permanent, easy, direct, free electronic access) and **art.22.2** cookie consent. **AEPD** guidance requires reject at the **same level** as accept — *"ambas acciones deben estar al mismo nivel, sin que sea más complicado rechazarlas que aceptarlas"* — with a compliance deadline of **11 January 2024**. That is visual-parity, which the EU floor does not mandate. | boe.es, aepd.es |
| **France** | **LIL art.82.** CNIL: *"L'utilisateur doit pouvoir accepter ou refuser le dépôt et/ou la lecture des cookies avec le même degré de simplicité."* CNIL also publishes the **audience-measurement exemption criteria** (§4.2) and an exempt-tracker list, and has run enforcement campaigns on refuse-parity. | cnil.fr |
| **Italy** | **Garante** cookie guidelines (June 2021): consent *"espresso mediante un atto positivo inequivocabile"*; analytics are treated as technical only where direct identification of the individual is precluded (e.g. IP truncation). | garanteprivacy.it |
| **Belgium** | **Code de droit économique art.III.74** requires the enterprise's contact details **and its enterprise (KBO/BCE) number** on the site. A mandatory national business-registry number is a genuine gap in the EU floor, which requires the trade register only *where the provider is registered in one*. | etaamb.openjustice.be (official mirror) |
| **Ireland / Sweden / France (numbering)** | National reserved fictitious-number ranges exist (ComReg 020 91x xxxx; PTS ranges; ARCEP +33 1 99 00 xx xx and siblings). **UNCONFIRMED** — tertiary source only. Germany's is confirmed primary and is what the profile uses. | see §7 |
| **All** | No EU-wide postcode shape, no EU-wide reserved phone range, and **not all EU states use the euro** (BG, CZ, DK, HU, PL, RO, SE). `locale` in `eu.mjs` is a placeholder in three fields and says so. | — |

**Language is the quiet one.** Every `mustMention` pattern in `eu.mjs` is English. A German-language
site will fail all nine privacy checks for reasons unrelated to its legality, and a German-language
profile must also null the em-dash thresholds, since the Gedankenstrich is ordinary German
punctuation and the English density figures would block honest native copy. Both are in
`provenance.caveats`.

---

## 7. Where sources disagreed, and which was followed

| # | Disagreement | Followed | Why |
|---|---|---|---|
| 1 | **Contact-form lawful basis.** Art.6(1)(b) pre-contractual steps vs Art.6(1)(f) legitimate interests vs Art.6(1)(a) consent. Practitioner sources split; EDPB Guidelines 2/2019 read 6(1)(b) strictly. | **Neither — the disagreement is reported, not resolved.** | The profile requires the page to *name* a basis and to match what the form does (`eu/contact-form-lawful-basis`). It records that consent is usually the worst of the three, because a form the visitor cannot submit without ticking a box is not freely given. Picking one and asserting it EU-wide would manufacture certainty the sources do not have. |
| 2 | **Analytics and "strictly necessary."** CNIL, the German DSK, Belgium's APD and Italy's Garante allow properly-configured first-party analytics into an exemption; the UK ICO does not. | **Consent-requiring by default, with the national exemption named as an escape hatch.** | The EDPB expressly refuses to draw the line EU-wide (§4.3). Encoding France's answer as the EU rule would be the exact error this profile's architecture exists to prevent. |
| 3 | **What CNIL's exemption proves.** Vendors read it as validating cookieless analytics broadly; CNIL's own text is far narrower. | **CNIL's own text.** | Primary regulator source outranks vendor marketing on the evidence ladder, and the two are not close: *"Most large audience measurement offerings do not fall within the scope of the exemption, regardless of their configuration."* |
| 4 | **EAA scope.** Directive text (narrow) vs accessibility vendors (broad). | **The directive text, with the vendor position recorded.** | Art.2(2) and Art.3(30) are quoted verbatim; the vendors are labelled commercially interested. But the profile ships the accessibility page anyway, so the disagreement costs the client nothing either way. |
| 5 | **Google Fonts.** Ruling valid vs warning-wave abusive. | **Both, stated as both.** | They are not actually in conflict; the sources that appear to conflict are describing different things (§4.7). |
| 6 | **Art.13 for a logs-only site.** | **Mainstream (notice always).** | The counter-case is narrow and contested, and the assumed site has a form, so the debate does not change the output (§4.8). |
| 7 | **DSA Arts.11–12.** Widely recommended for "all websites" vs Art.3(g) reading them out of scope for a self-published site. | **Out of scope, flagged `minor` with the uncertainty stated.** | The definitions all turn on information provided *by a recipient*. Rated `minor` rather than asserted, because no authority was found saying so in terms for brochure sites and the DSA articles could not be fetched from EUR-Lex directly. |
| 8 | **COM(2025)501 subject matter.** One search-engine AI summary reported it as an F-gas measure. | **The primary EUR-Lex document.** | Angle A fetched the proposal itself, found the Art.30(5) amendment, and overrode its own earlier search result. Recorded because it is a live example of why search snippets are not evidence. |

---

## 8. What could NOT be established

Twelve items. Each is a real gap, and each is either reflected in `provenance.caveats` or is a
limitation of this note rather than of the profile.

1. **EDPB Guidelines 2/2019 (Art.6(1)(b)) — full verbatim text.** The PDF defeated local extraction
   (`pypdf` raised `unknown encoding: /SymbolSetEncoding` on every page). The fetch tool's own
   summary of it carried a self-warning that it could not access the PDF content. The profile
   therefore cites the guideline's *existence and thrust* in `eu/contact-form-lawful-basis` without
   quoting it, and the source row is marked PARTIAL. **This is the weakest citation in the file.**
2. **GDPR Art.44 verbatim.** Repeated fetches of the consolidated GDPR truncated before Chapter V.
   Art.28(1) and 28(3) were obtained; Art.44 was not, so no transfer-principle text is quoted.
3. **DSA Arts.2, 3(g), 11, 12, 13, 19 and 89 from EUR-Lex directly.** The consolidated regulation
   is long enough that every direct fetch returned preamble or recitals. Article text came from an
   unofficial article-by-article mirror. The **one claim that matters** — that the DSA deleted
   Arts.12–15 of Directive 2000/31 and left Art.5 standing — **is** confirmed from EUR-Lex, via the
   `DELETED — 32022R2065` markers visible in the consolidated 2000/31 text.
4. **No authority on the enquiry-form/online-sale line under EAA Art.3(30).** No case law, no
   Commission Q&A, no guidance. §5's verdict is a reading.
5. **Whether any member state transposed the EAA more broadly** than the directive — e.g. removing
   the microenterprise exemption. Nothing verifiable found either way.
6. **BGH referral to the CJEU on Google Fonts** (reported as VI ZR 258/24, 28 August 2025, on the
   scope of the abuse-of-rights doctrine). Search snippet only; no page fetched. **UNCONFIRMED**,
   and named as such in the profile.
7. **LG Hannover, 1 July 2024**, reportedly awarding damages where the claimant had *not* provoked
   the transfer. Snippet only. UNCONFIRMED.
8. **PCLOB composition as of 2026-08-18** and the downstream effect of the January 2025 removals on
   the DPF. pclob.gov's board page 404'd. A reported *Trump v. Slaughter* Supreme Court ruling
   (~29 June 2026) could not be fetched at all. This is a real open risk on the transfer position
   and is why `eu/us-transfer-check` says the DPF position is not settled.
9. **Whether the Commission has adopted the additional SCC module** for controller-to-processor
   transfers where both are already subject to the GDPR extraterritorially. The Commission's own
   Q&A page, as fetched, still says it is "in the process of developing" it. Status UNCONFIRMED.
10. **CNIL's named exempted-solutions list.** Matomo is confirmed from CNIL's own Sheet 16 text.
    AT Internet / Piano Analytics and Wysistat appear only in secondary aggregators and are **not**
    relied on. The `cookies-solutions-pour-les-outils-de-mesure-daudience` page as fetched named no
    solutions at all.
11. **EDPB follow-up guidance on "consent or pay" for smaller platforms**, flagged as pending when
    Opinion 08/2024 issued. Whether it has since published is unknown.
12. **Per-country UCPD penalty maxima.** Not established, and deliberately not stated. The commonly
    quoted "at least 4% of turnover" figure comes from the Omnibus Directive's amendments and
    applies to particular coordinated cross-border enforcement actions, not to a local
    trading-standards action against a sole trader. Rather than repeat a number this pass could not
    verify per country, `claimCitations` names the exposure and no figure. Recorded in
    `provenance.caveats`.

### Also not established, about the repo rather than the law

- `checks/lib/profile.mjs` points readers at **`profiles/README.md`** in two error strings. That
  file does not exist. A profile author following the instruction hits nothing.
- `node checks/selftest.mjs` fails 3 assertions (`legal/jurisdiction` declared but never reported;
  `legal/local-rule` and the `assets/*` family lacking negative controls; 13 gates missing from
  MANUAL.md). **Verified to pre-date this profile** — the same 3 failures occur with `eu.mjs`
  removed from the folder. Not fixed here, since this task was the profile.

---

## 9. Verification performed on the profile itself

Not a claim, a run. On 2026-08-18:

- `node checks/lib/profile.mjs` `loadProfile('eu')` → **0 problems**, 1 notice (the `researched`
  provenance banner). 33 source rows, 12 caveats, 14 extras, 8 regulated-claim triples stitched
  from the base patterns, 11 non-essential script patterns and 5 pre-consent embed patterns
  inherited from `_base.mjs`, `postcodePattern` compiled to a live RegExp.
- `node checks/run.mjs examples/clean-control --profile eu --only legal` → 15 gates ran. All 14
  extras surfaced as `legal/local-rule` findings. **Correction made as a result:** a caveat drafted
  earlier claimed the checker did not yet consume `legal.extras`. Running it proved that false, and
  the caveat now records what the run actually showed — including that the checker **downgrades
  every extra to MINOR** and appends "the profile rates this &lt;severity&gt;", so the two
  blocker-rated extras will not stop a ship on their own.
- **Disclosure regexes tested against 16 real address shapes and 7 innocent-prose decoys.** All 6
  should-not-match cases passed; a genuine miss on the Czech/Slovak/Swedish `110 00 Praha` shape and
  on Irish Eircodes was found and fixed by adding two branches. Note the failure direction is
  *inverted* for these gates — they fire when they do NOT match, so a false negative is a false
  accusation, and they are tuned permissive on purpose.
- **A real regex bug was caught and fixed:** the legal-form pattern ended `)\b`, and a trailing
  `\b` after a literal `.` can never match at end of string, so `Rossi S.r.l.`, `Bianchi S.p.A.`
  and `Garcia S.L.` all silently failed. Replaced with `)(?![A-Za-z])`. All eight legal-form
  fixtures now pass.
- **Privacy `mustMention` discrimination tested:** a realistic Art.13-complete notice passes 9/9;
  a typical thin "we respect your privacy" template passes 1/9. The gate separates the two cases it
  exists to separate.

---

## 10. Review checklist for 2027-02-18

Ordered by how likely each is to have moved.

1. **Digital Omnibus, 2025/0360(COD)** — if adopted, cookie consent moves to GDPR Art.88a/88b and
   `consentModel`, `consentModelWhy` and `eu/cookieless-is-not-exempt` all need rewriting.
2. **Case C-703/25 P** (appeal against T-553/23) — if the DPF adequacy decision falls, every
   US-hosted contact form in scope needs SCCs, and `eu/us-transfer-check` becomes a blocker in
   substance.
3. **Directive (EU) 2024/825** — applicable from **27 September 2026**, i.e. *before* this review
   date. `claimCitations.environmental` must be rewritten from "coming" to "in force", and the
   member-state transposition checked.
4. **COM(2025)501** — Art.30(5) at 750 persons; adopted or not.
5. **EAA** — first enforcement decisions or Commission guidance touching the e-commerce/enquiry-form
   line; any member state narrowing Art.4(5).
6. The five **UNCONFIRMED** items in §8 (BGH referral, LG Hannover, PCLOB, new SCC module, EDPB
   consent-or-pay follow-up).
7. Whether **`profiles/README.md`** now exists, so this file can point at the house protocol
   instead of restating it.
