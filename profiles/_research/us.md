# US legal profile -- working research notes

Companion to `profiles/us.mjs`. Everything the profile asserts should be traceable to a row
here, and everything this file could NOT establish is listed at the bottom rather than quietly
rounded up into confidence.

- **Research run:** 2026-08-18
- **Jurisdiction:** United States (federal + state patchwork)
- **Scope:** a 5-10 page static brochure site for a small business or sole proprietor. No
  accounts, no payments, no database. May have: a contact form posting to a third-party form
  service, `tel:`/`mailto:` links, optional analytics, optional embedded map or video,
  optionally a newsletter signup, optionally an invitation to text the business.
- **Out of scope, deliberately not researched:** e-commerce, HIPAA-covered portals, enterprise
  SaaS, COPPA/child-directed services, financial services (GLBA), employment law.

**Not legal advice.** This is machine-assembled from primary sources. No lawyer has reviewed it.

---

## Method

Ran per `tools/research-policy.md` section 5a: fan out by ANGLE, contradiction angle mandatory.
Five angles, each able to return a find no other angle could:

| # | Angle | What only it could return |
|---|---|---|
| 1 | Primary / official federal (FTC, CAN-SPAM, TCPA) | The authoritative instrument text and its effective date |
| 2 | State comprehensive privacy laws, enumerated and dated | Which laws are actually operative today vs merely enacted |
| 3 | ADA Title III, WCAG, the circuit split, state analogues | Case-law posture, which no statute states |
| 4 | Business identity disclosure, CalOPPA, licence display | The NEGATIVE finding -- what the US does *not* require |
| 5 | **CONTRADICTION** -- sources saying the standard advice is wrong | Stops the sweep returning a brief for the conclusion already held |

Angles 1-5 ran as sub-agents; the load-bearing claims (the ones that decide the profile's
SHAPE, not just its wording) were then re-fetched independently by the synthesising session.
That independent pass is what caught the effective-date error recorded below.

### Source-access limitation, stated out loud

**`ftc.gov` returned HTTP 403 to automated fetching on every attempt**, across roughly ten
distinct URLs including PDFs, and `federalregister.gov` redirected every request to a
bot-challenge page. This is an access limitation, not evidence about the documents.

Where blocked, the fallback ladder was: `govinfo.gov` (the government's own Federal Register
and CFR text packages) -> `law.cornell.edu` (LII's US Code / CFR mirror) -> the state's own
legislature site -> a named law firm's alert, explicitly labelled secondary. Several FTC
enforcement actions below rest on secondary summaries for that reason, and are marked.

---

## Angle 1 -- Federal: FTC, CAN-SPAM, TCPA

| Claim | Instrument | URL fetched | Fetched | Status 2026-08-18 |
|---|---|---|---|---|
| Deception = representation/omission likely to mislead a reasonable consumer, and material | FTC Deception Policy Statement (1983), enforced via 15 U.S.C. 45 | https://www.fdic.gov/consumer-compliance-examination-manual/vii-1-federal-trade-commission-act-section-5-and-dodd-frank | 2026-08-18 | In force. Reproduced verbatim by FDIC because ftc.gov was unreachable |
| Unfairness = substantial injury, not reasonably avoidable, not outweighed by benefits | 15 U.S.C. 45(n) | same | 2026-08-18 | In force |
| Endorsement Guides are administrative interpretations, NOT independently enforceable rules | 16 CFR Part 255 | https://www.law.cornell.edu/cfr/text/16/part-255 | 2026-08-18 | In force. Source note: **88 FR 48102, July 26, 2023** |
| 2023 revision effective on publication, 26 July 2023; adds fabricated/AI endorsers, defines "clear and conspicuous" as unavoidable, addresses review gating and suppression | 88 FR 48102 | https://www.govinfo.gov/content/pkg/FR-2023-07-26/html/2023-14795.htm | 2026-08-18 | In force |
| **FTC Rule on Consumer Reviews and Testimonials, 16 CFR Part 465** -- published 89 FR 68034, 22 Aug 2024; **"This rule is effective October 21, 2024"** | 16 CFR Part 465 | https://www.govinfo.gov/content/pkg/FR-2024-08-22/html/2024-18519.htm and page 1 of https://www.govinfo.gov/content/pkg/FR-2024-08-22/pdf/2024-18519.pdf | 2026-08-18 | **In force** |
| Sections: 465.2 fake/false reviews (incl. AI-generated), 465.3 **[Reserved]**, 465.4 buying reviews, 465.5 insider reviews, 465.6 company-controlled review sites, 465.7 review suppression, 465.8 fake social-media indicators | 16 CFR 465.1-465.9 | https://www.law.cornell.edu/cfr/text/16/part-465 | 2026-08-18 | In force. 465.3 (review hijacking) was dropped from the final rule |
| **Part 465 was NOT among the FTC rules removed in the Feb 2026 conforming notice** that withdrew the CARS Rule, revised the Negative Option Rule and removed the Non-Compete Rule | FR doc 2026-02866 | https://www.govinfo.gov/content/pkg/FR-2026-02-12/html/2026-02866.htm | 2026-08-18 | Strong negative evidence that Part 465 survives |
| Part 465 actively enforced: FTC warning letters to 10 companies Dec 2025; *FTC v. TruHeight* settlement Apr 2026 (USD 4m judgment, suspended to USD 750k on inability to pay); *FTC and Illinois AG v. Premium Home Service* May 2026 | -- | https://www.dlapiper.com/en-us/insights/publications/2026/07/ftcs-2026-enforcement-approach-to-fake-reviews-takes-shape-takeaways-for-companies | 2026-08-18 | **Secondary** (law firm). Corroborates in-force status |
| Civil penalty for a knowing violation of a section 18 trade regulation rule: **USD 53,088 per violation** | 16 CFR 1.98; 90 FR 5581 | https://www.law.cornell.edu/cfr/text/16/1.98 | 2026-08-18 | In force |
| **No 2026 inflation adjustment was made** -- BLS could not produce Oct 2025 CPI-U due to the shutdown, so agencies "will continue using the 2025 civil monetary penalty levels" | OMB Memorandum **M-26-11, 17 April 2026** | https://www.whitehouse.gov/wp-content/uploads/2026/04/M-26-11-Cancellation-of-Penalty-Inflation-Adjustments-for-2026-Regarding-the-Federal-Civil-Penalties-Inflation-Adjustment-Act-Improvements-Act-of-2015.pdf (read as PDF, pp.1-3) | 2026-08-18 | **Primary.** Exactly the kind of fact a memory-based citation gets wrong |
| CAN-SPAM: physical postal address, working unsubscribe honoured within 10 business days, no deceptive headers or subject lines | 15 U.S.C. 7704 | https://www.law.cornell.edu/uscode/text/15/7704 | 2026-08-18 | In force |
| **CAN-SPAM has NO opt-in requirement** -- it is an opt-OUT regime. Prior affirmative consent appears only as an *exception*, confirming the general rule | 15 U.S.C. 7704 | same | 2026-08-18 | In force. The sharpest US/EU contrast in this profile |
| The postal address requirement attaches to the **email message**, not the website | 15 U.S.C. 7704(a)(5)(A)(iii) | same | 2026-08-18 | In force. Precision matters: this does not force an address onto the site |
| CAN-SPAM enforced by the FTC as if a section 18 rule violation, which pulls in the USD 53,088 figure | 15 U.S.C. 7706(a) | https://www.law.cornell.edu/uscode/text/15/7706 | 2026-08-18 | In force |
| State AGs may separately sue: USD 250 per violation, capped USD 2,000,000, trebled for wilful | 15 U.S.C. 7706(f) | same | 2026-08-18 | In force |
| TCPA marketing texts need **prior express written consent** identifying the specific number and disclosing that consent is not a condition of purchase | 47 U.S.C. 227(b); 47 CFR 64.1200(a)(2), (f)(9) | https://www.law.cornell.edu/uscode/text/47/227 and https://www.law.cornell.edu/cfr/text/47/64.1200 | 2026-08-18 | In force |
| TCPA damages: **USD 500 per violation**, treble to **USD 1,500** for wilful or knowing. Private right of action, no proof of monetary loss needed | 47 U.S.C. 227(b)(3) | https://www.law.cornell.edu/uscode/text/47/227 | 2026-08-18 | In force |
| The FCC's "one-to-one consent" rule was **VACATED** by the Eleventh Circuit, *Insurance Marketing Coalition v. FCC*, decided 24 Jan 2025 | -- | https://www.consumerfinancialserviceslawmonitor.com/2025/01/eleventh-circuit-vacates-fccs-one-to-one-consent-rule-fcc-issues-stay/ | 2026-08-18 | **Secondary.** Reporter citation UNCONFIRMED (courtlistener and justia both 403'd). Practical effect: do NOT build for a rule that never took effect |
| FCC revocation-of-consent rules: general provisions effective 11 Apr 2025; the "revoke-all" cross-channel provision waived to **11 Apr 2026** | 47 CFR 64.1200(a)(10); FCC Order DA 25-312 | https://docs.fcc.gov/public/attachments/DA-25-312A1.pdf | 2026-08-18 | **Both dates have now passed** -- the full rule is live today. (A collector reported this as "not binding until next spring", reading from a pre-2026 frame; corrected here.) |
| Florida mini-TCPA: prior express written consent, STOP honoured within 15 days, USD 500 / USD 1,500 private right of action plus fees | Fla. Stat. 501.059 | http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0500-0599/0501/Sections/0501.059.html | 2026-08-18 | In force |

---

## Angle 2 -- State comprehensive privacy laws

**The question that matters: does a tiny brochure site fall under any of them? No. Not one.**

### In effect on 2026-08-18 (20 laws)

| State | Law | Effective | Threshold | Catches our site? |
|---|---|---|---|---|
| California | CCPA/CPRA, Cal. Civ. Code 1798.140(d) | 2020-01-01 / 2023-01-01 | >USD 25m revenue (**CPI-adjusted to USD 26,625,000** from 2025-01-01) OR buys/sells/shares PI of **100,000+** consumers or households OR 50%+ revenue from selling/sharing PI | No |
| Virginia | VCDPA, Va. Code 59.1-576 | 2023-01-01 | 100,000+ consumers, or 25,000+ and 50%+ revenue from sale | No |
| Colorado | CPA, C.R.S. 6-1-1304 | 2023-07-01 | 100,000+ consumers, or 25,000+ and any revenue from sale | No |
| Connecticut | CTDPA, Conn. Gen. Stat. 42-515 et seq. | 2023-07-01 | **Lowered by a 2026 amendment effective 2026-07-01 to 35,000+ consumers**, or 25,000+ with any sale revenue | No |
| Utah | UCPA, Utah Code 13-61-102 | 2023-12-31 | USD 25m+ revenue **AND** a volume prong | No |
| Texas | TDPSA, Tex. Bus. & Com. Code 541.002 | 2024-07-01 | **No numeric threshold.** Exempt if an SBA "small business" | No -- affirmatively exempt |
| Oregon | OCPA, ORS 646A.570 | 2024-07-01 | 100,000+ consumers, or 25,000+ and any sale revenue | No |
| Montana | MCDPA, MCA 30-14-2803 | 2024-10-01 | **Amended by SB 297, effective 2025-10-01, LOWERED to 25,000+** consumers, or 15,000+ and >25% sale revenue | No |
| Florida | FDBR, Fla. Stat. 501.702 | 2024-07-01 | **>USD 1 billion** global revenue AND one of three tech-specific prongs | No, by three orders of magnitude |
| Delaware | DPDPA, 6 Del. C. ch. 12D | 2025-01-01 | 35,000+ consumers, or 10,000+ and >20% sale revenue | No |
| Iowa | ICDPA, Iowa Code ch. 715D | 2025-01-01 | 100,000+, or 25,000+ and >50% | No |
| Nebraska | NDPA, Neb. Rev. Stat. 87-1103 | 2025-01-01 | **No numeric threshold.** Exempt if an SBA small business | No -- affirmatively exempt |
| New Hampshire | NHPA, RSA 507-H | 2025-01-01 | 35,000+, or 10,000+ and >25% | No |
| New Jersey | NJDPA, N.J.S.A. 56:8-166.4 | 2025-01-15 | 100,000+, or 25,000+ and any sale revenue | No |
| Tennessee | TIPA, Tenn. Code 47-18-3201 | 2025-07-01 | USD 25m+ revenue AND 175,000+ consumers | No |
| Minnesota | MCDPA, Minn. Stat. 325O | 2025-07-31 | 100,000+, or 25,000+ and >25% | No |
| Maryland | MODPA, Md. Com. Law 14-4601 | 2025-10-01 (processing rules enforced 2026-04-01) | 35,000+, or 10,000+ and >20%. **No revenue floor -- the most reachable threshold in the country** | No, still 175x our volume |
| Indiana | INCDPA, Ind. Code 24-15 | 2026-01-01 | 100,000+, or 25,000+ and >50% | No |
| Kentucky | KCDPA, KRS 367.3611 | 2026-01-01 | 100,000+, or 25,000+ and >50% | No |
| Rhode Island | RIDTPPA | 2026-01-01 | 35,000+, or 10,000+ and >20% | No |

### Enacted but NOT yet effective on 2026-08-18 (4 laws)

| State | Law | Effective |
|---|---|---|
| Oklahoma | OCDPA, SB 546 (2026) | 2027-01-01 |
| Louisiana | LDPA, SB 386 (2026) | 2027-01-01 |
| Alabama | APDPA, HB 351 (2026) | 2027-05-01 |
| Vermont | VDPOSA, S.71 (2026) | 2028-01-01 |

### A false secondary claim, caught

A law-firm-style summary surfaced by search asserted that **Arkansas** had enacted a
comprehensive privacy law effective 2026-07-01. Checked directly against the Arkansas
legislature's own bill-status record: **SB 258 died on the Senate calendar at sine die
adjournment, 2025-05-05**, after failing two floor votes. Arkansas has no comprehensive
consumer privacy law. Source: `arkleg.state.ar.us` bill-status page, fetched 2026-08-18.

This is the best argument in this file for the "cite a URL or mark UNCONFIRMED" rule. The
false claim was fluent, plausible, correctly formatted, and wrong.

### What binds regardless of size

- **Breach-notification statutes have no size threshold.** Cal. Civ. Code 1798.82,
  Tex. Bus. & Com. Code 521.053, the NY SHIELD Act. If contact-form data leaks, duties attach
  to a sole proprietor exactly as to a corporation. This is the one privacy obligation a tiny
  site genuinely carries -- and it is an *incident* duty, nothing a static checker can verify.
- **Nevada NRS 603A** opt-out-of-sale applies to all "operators" with no threshold, but only
  bites if the site actually sells covered information for money. A brochure site does not.
- **Washington My Health My Data** has no numeric threshold, but is out by subject matter: a
  contact form's name, email and message is not consumer health data. Re-examine if the client
  is health or wellness adjacent.

### GPC / universal opt-out

Twelve in-effect laws require honouring an opt-out preference signal (CA, CO, CT, DE, MD, MN,
MT, NE, NH, NJ, OR, TX). **The duty sits inside each comprehensive law and does not attach to
a business below that law's applicability threshold.** No independent, threshold-free GPC
mandate was found. Secondary-tracker sourced; not checked state by state.

---

## Angle 3 -- ADA Title III, WCAG, state analogues

| Claim | Source | Fetched | Type |
|---|---|---|---|
| 42 U.S.C. 12181(7) lists 12 categories of public accommodation. **The words "website" and "internet" appear nowhere in it.** This textual silence is the entire root of the split | https://www.law.cornell.edu/uscode/text/42/12181 | 2026-08-18 | Primary |
| DOJ's April 2024 web rule (89 FR 31320, 28 CFR Part 35) is a **Title II** rule -- state and local government only. **It does not reach private businesses at all** | https://www.ada.gov/resources/2024-03-08-web-rule/ | 2026-08-18 | Primary |
| DOJ issued an **Interim Final Rule on 20 April 2026** extending the Title II deadlines by one year: population 50,000+ to 2027-04-26; under 50,000 and special districts to 2028-04-26 | https://www.ada.gov/resources/2024-03-08-web-rule/ | 2026-08-18 | Primary. Still irrelevant to a private business |
| DOJ withdrew its Title III web ANPRM in Dec 2017 and **has never issued a technical standard for private-sector websites**. In Oct 2025 DOJ said it would "re-examine" Title II and III regulations; nothing re-proposed as of Aug 2026 | https://www.pivotalaccessibility.com/2025/11/doj-to-revisit-ada-title-ii-and-iii-and-what-it-means-for-digital-accessibility/ | 2026-08-18 | Secondary |
| **WCAG 2.2 is the current W3C Recommendation** (5 Oct 2023, updated 12 Dec 2024). **WCAG 3.0 is NOT a Recommendation** -- still an early working draft | https://www.w3.org/WAI/standards-guidelines/wcag/ | 2026-08-18 | Primary |
| DOJ settlements and consent decrees consistently specify WCAG 2.0 or 2.1 **Level AA** (H&R Block, CVS, Kroger, Rite Aid, Edward D. Jones) | https://natlawreview.com/article/department-justice-doj-strikes-landmark-consent-decree-web-mobile-access-case | 2026-08-18 | Secondary |
| Unruh Act: "A violation of the right of any individual under the [ADA] shall also constitute a violation of this section" | Cal. Civ. Code 51(f), https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=51 | 2026-08-18 | **Primary** |
| Unruh statutory damages: up to 3x actual, "**in no case less than four thousand dollars (USD 4,000)**" per violation | Cal. Civ. Code 52(a), https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=52. | 2026-08-18 | **Primary.** The single largest financial exposure in this profile |
| Colorado HB21-1110 reaches **state and local government entities only**, not ordinary private businesses | https://www.accessibility.works/blog/how-to-comply-colorado-hb21-11110-accessibility-law/ | 2026-08-18 | Secondary. Confirms the negative |
| Seyfarth: 2,452 federal website-accessibility suits in 2024; **3,117 in 2025, up 27%** (36% of all Title III filings) | https://www.adatitleiii.com | 2026-08-18 | Secondary (law firm). Trend is UP |
| Overlay widgets act as a litigation beacon; roughly 25% of 2024 digital accessibility suits targeted sites running one | https://www.accessibility.works/blog/accessibility-overlay-widgets-attract-lawsuits/ | 2026-08-18 | Secondary, and an **interested party** (competes with overlays). Directional only |
| **FTC ordered accessiBe to pay USD 1,000,000** (proposed Jan 2025, final Apr 2025) for falsely claiming its AI overlay made sites WCAG-compliant, and for undisclosed paid reviews | https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million (URL located; ftc.gov 403'd, corroborated via https://www.lflegal.com/2025/01/ftc-accessibe-million-dollar-fine/) | 2026-08-18 | Secondary for the text; the action itself is corroborated across many independent sources |

### The circuit split, stated honestly

The mainstream summary -- "3rd, 6th, 9th and 11th require a nexus; 1st, 2nd and 7th do not" --
is **repeated everywhere and is not accurate**. What the research actually supports:

- **9th Cir.** -- nexus required (*Weyer v. Twentieth Century Fox*, 198 F.3d 1104 (9th Cir.
  2000)), but easily satisfied for any business with premises (*Robles v. Domino's Pizza*,
  913 F.3d 898 (9th Cir. 2019); cert denied Oct 2019).
- **11th Cir.** -- **has NO live appellate holding.** *Gil v. Winn-Dixie*, 993 F.3d 1266 (11th
  Cir. 2021) held websites are not public accommodations; that opinion was **VACATED as moot**
  on rehearing, 21 F.4th 775 (11th Cir., 28 Dec 2021), because the three-year injunction had
  expired. Citing Gil as current Eleventh Circuit law is simply wrong, and a great deal of
  published compliance advice does exactly that. Verified via CourtListener (two opinions,
  same docket 17-13467, dated 2021-04-07 and 2021-12-28) and
  https://www.hklaw.com/en/insights/publications/2022/01/11th-circuit-vacates-opinion-holding-that-websites-are-not-ada-public
- **6th Cir.** -- nexus doctrine rests on *Parker v. Metropolitan Life*, 121 F.3d 1006 (6th
  Cir. 1997) (en banc), **an insurance-benefits case, not a website case**.
- **5th Cir.** -- *Magee v. Coca-Cola*, 833 F.3d 530 (5th Cir. 2016), a vending-machine case,
  extended by district courts to websites.
- **1st Cir.** -- the broad-coverage reputation rests on *Carparts*, 37 F.3d 12 (1st Cir.
  1994), **a 1994 insurance case**, not a website holding.
- **7th Cir.** -- rests on **dictum** in *Doe v. Mutual of Omaha*, 179 F.3d 557 (7th Cir. 1999).
- **2nd Cir.** -- **no appellate holding at all**, and the district courts inside it are now
  split: *Mejia v. High Brew Coffee*, No. 1:22-cv-03667-LTS, 2024 WL 4350912 (S.D.N.Y. 30 Sept
  2024) (Chief Judge Swain) held an online-only business's website is **not** a place of public
  accommodation, against the SDNY's own prior *Andrews v. Blick Art Materials* line.
- **3rd Cir.** -- no named appellate case located; district-court consensus only.
- **SCOTUS** -- has not resolved it. *Acheson Hotels v. Laufer* (2023) was decided on
  **mootness**, not the merits, and says nothing about whether websites are covered.

The honest summary is therefore: **most of the "circuit split" is built out of pre-internet
insurance cases and dicta, one of the headline holdings has been vacated, and the Second
Circuit's district courts are now arguing with each other.** For a small business with premises
the nexus question is usually academic anyway -- their site connects to a physical place under
any test.

---

## Angle 4 -- Business identity, CalOPPA, licence display

### The big negative finding: there is no US equivalent of Companies Act 2006 s.82

**Hypothesis confirmed.** No general federal or state law requires a US LLC or corporation to
publish its entity number, EIN, or registered-agent/registered-office address on its own
website. What was searched and NOT found:

- Any federal statute or FTC/SEC rule of general application requiring website display of an
  EIN, state entity number, or registered agent. SEC disclosure is public-reporting-company
  only, and out of scope.
- Any Delaware, California, New York, Texas or Florida corporate-code "trading disclosure" or
  letterhead/website-disclosure requirement. California's own corporate and fictitious-name
  statutes were read in primary text and contain no such clause.
- Any provision of California's Fictitious Business Name chapter (Cal. Bus. & Prof. Code 17900
  et seq., fetched from leginfo 2026-08-18) pushing true-owner disclosure onto the business's
  website or advertising. The statute's mechanism is **filing with the county clerk**, full
  stop: "filing ... is designed to make available to the public the identities of persons doing
  business under the fictitious name."
- CAN-SPAM's postal-address duty attaches to the **email message**, not the site
  (15 U.S.C. 7704(a)(5)(A)(iii), fetched from LII 2026-08-18).

**Consequence for the profile:** `disclosure.corporation` and `disclosure.soleTrader` are
**empty**. This is the largest structural difference between `us.mjs` and `uk.mjs`, and it is a
finding, not a gap. Inventing US identity requirements to make the profile look symmetrical
with the UK one would have been the exact failure this repo exists to prevent.

### CalOPPA -- the finding that decides the profile's shape

| Claim | Source | Fetched |
|---|---|---|
| CalOPPA, Cal. Bus. & Prof. Code 22575-22579, **still in force**, operative since 2004-07-01. Not repealed or superseded by CCPA/CPRA | https://leginfo.legislature.ca.gov/faces/codes_displayText.xhtml?lawCode=BPC&division=8.&chapter=22. | 2026-08-18 (fetched twice, independently) |
| Trigger: "An operator of a commercial Web site or online service that **collects personally identifiable information** through the Internet about individual consumers **residing in California** who use or visit its commercial Web site ... shall conspicuously post its privacy policy" | 22575(a), same | 2026-08-18 |
| **There is no revenue, volume or size threshold anywhere in the chapter** | same | 2026-08-18 |
| Required contents: (1) categories of PII collected and categories of third parties shared with; (2) any review/change process; (3) how consumers are notified of material changes; (4) the effective date; (5) **how the operator responds to "do not track" signals**; (6) whether third parties may collect PII across different sites | 22575(b)(1)-(6) | 2026-08-18 |
| "Conspicuously post" = the policy on the homepage, or an icon, or **a text link containing the word "privacy"** in contrasting type on the homepage | 22577(b) | 2026-08-18 |
| 30-day cure after notice; liability only for knowing-and-wilful or negligent-and-material failure | 22575(a), 22576 | 2026-08-18 |
| **Delaware DOPPA, 6 Del. C. 1205C** -- near-identical no-threshold duty, same six required disclosures, same 30-day cure | https://delcode.delaware.gov/title6/c012c/index.html | 2026-08-18 (fetched independently, to confirm it is not a California quirk) |
| Nevada NRS 603A.340 -- no-threshold duty, **but with a real carve-out**: operator physically in Nevada, revenue not primarily from online sales, and under 20,000 unique visitors a year | https://nevada.public.law/statutes/nrs_603a.340 | 2026-08-18 |
| Connecticut Gen. Stat. 42-471 -- privacy policy required only of those collecting **Social Security numbers**; "publicly displayed" expressly includes a web page; up to USD 5,000 per violation | https://codes.findlaw.com/ct/title-42-business-selling-trading-and-collection-practices/ct-gen-st-sect-42-471/ | 2026-08-18 |

**This is the profile's load-bearing conclusion.** The interesting US result is not "small sites
are exempt from privacy law". It is that the *comprehensive* laws (CCPA and its 19 siblings)
miss a tiny site by orders of magnitude, while two **threshold-free** statutes -- CalOPPA and
DOPPA -- catch it the moment a contact form collects a name and an email. So
`pages.privacy.required` is `'always'`, and it is required for a completely different reason
than in the UK, with a completely different required content list.

### Professional licence display -- real, and common

| State | Instrument | Requirement | Source | Fetched |
|---|---|---|---|---|
| California | Cal. Bus. & Prof. Code 7030.5 | Licence number in "all construction contracts; subcontracts and calls for bid; and all forms of advertising" | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=7030.5 | 2026-08-18 |
| California | 16 CCR 861 + CSLB guidance | "Advertising" includes websites and online postings; the number must be **in the ad itself**, not on a page it links to | https://www.cslb.ca.gov/About_Us/Library/Laws/CCR832.45_Approved_Final_Text.aspx (located via search; the CSLB advertising-guidelines page 404'd) | 2026-08-18. **Partly secondary** |
| Nevada | NRS 624.720 | All advertising must show company name and licence number; **"advertising" is expressly defined to include the Internet** -- the clearest-drafted statute of the group | https://nevada.public.law/statutes/nrs_624.720 | 2026-08-18 |
| Florida | Fla. Stat. 489.119(5)(b) | Number required "in each offer of services, business proposal, bid, contract, or advertisement, **regardless of medium**". NOTE the subsection is **(5)(b)**, not (6)(b) as commonly cited -- it was renumbered | https://www.flsenate.gov/laws/statutes/2024/489.119 | 2026-08-18 |
| Washington | RCW 18.27.100 | Advertising showing the contractor's name or address must show the current registration number; up to USD 10,000 penalty | https://law.justia.com/codes/washington/2022/title-18/chapter-18-27/section-18-27-100/ | 2026-08-18 |
| California (real estate) | Cal. Bus. & Prof. Code 10140.6 | Name and licence ID on "solicitation materials" including electronic media. **"Website" is not an enumerated term** -- weaker than the contractor rules | https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=BPC&sectionNum=10140.6 | 2026-08-18 |

Four states verified for contractors (CA, NV, FL, WA). Encoded as a **trade-and-state
conditional**, not a blanket default -- because exemptions exist and the wording differs.

---

## Angle 5 -- CONTRADICTION: what the standard advice gets wrong

Most "website legal requirements" content is published by companies selling cookie-consent
SaaS, policy generators, or accessibility overlays. Three propositions were tested to
destruction.

### (A) "A small brochure site falls under CCPA/CPRA." -- FALSE as stated

The CPPA's own FAQ and the California AG's own CCPA page both state the three thresholds; a
sole proprietor at USD 80k revenue with 300 form submissions a year meets none of them, and
misses the nearest by roughly two orders of magnitude. Sources: `cppa.ca.gov/faq.html`,
`oag.ca.gov/privacy/ccpa`, both fetched 2026-08-18, plus the statute itself.

**The one real trap, honestly stated:** the 100,000 prong counts consumers whose PI is bought,
sold or **SHARED**, and "sharing" is defined as disclosure for cross-context behavioural
advertising (Cal. Civ. Code 1798.140(ah)). A retargeting pixel is sharing, and the count is of
*visitors*, not customers. So a site that later adds a Meta retargeting pixel AND draws
100,000+ Californian visitors a year is caught without ever selling anything. That is a real
mechanism and a real trap for a site that grows -- it is not a live risk for the five-page site
this repo builds. **Verdict: the standard "you might be covered" warning is compliance-tool
marketing at this scale. It becomes true at a scale this repo does not build for.**

### (B) "A cookie banner is legally required in the US." -- FALSE, and the most cargo-culted claim in the set

No federal law requires consent before setting a cookie. Every state comprehensive law uses an
**opt-out** model -- a "Do Not Sell or Share My Personal Information" link -- not an EU-style
prior-blocking gate, and even that duty only attaches to a business over the threshold. Source:
https://recordinglaw.com/us-laws/data-privacy-laws/cookie-banner-requirements/ (fetched
2026-08-18), corroborated by the statutory definitions and -- notably -- by cookie-consent SaaS
vendors conceding the point against their own sales interest.

**But the contradiction has a contradiction, and this is the important part.** There is a real
and growing US tracker-litigation risk that has nothing to do with "cookie banners" as marketed:

- **CIPA.** California Penal Code 631, a 1967 wiretap statute, is being used against ordinary
  web trackers -- session replay, chatbots, pixels. Statute fetched from leginfo 2026-08-18;
  characterisation corroborated by the California Lawyers Association (`calawyers.org`,
  fetched) and Norton Rose Fulbright, which calls it the next wave of website class actions.
- **The legislative fix is NOT law.** SB 690 was still pending as of July 2026 -- a two-year
  bill re-referred to Assembly Appropriations, facing a 31 Aug 2026 deadline -- and even as
  drafted it strips the private right of action only for the narrow pen-register theory
  (Penal Code 638.50-.51), **not** the section 631 wiretap theory most suits actually plead.
  Source: https://www.troutman.com/insights/sb-690-amended-california-moves-to-strip-private-right-of-action-for-pen-register-claims/
  (fetched 2026-08-18). Anyone treating CIPA as solved is reading a bill, not a law.
- **VPPA.** Embedded third-party video plus a pixel draws Video Privacy Protection Act claims,
  USD 2,500 statutory damages per violation. SCOTUS granted cert in *Salazar v. Paramount*
  (Jan 2026) on who counts as a "consumer". Only relevant if the site embeds video AND runs a
  pixel. Secondary: WilmerHale, ABA Business Law Today.

**Verdict, and what the profile encodes:** a prior-consent banner is **not required**, and
`consentModel` is `notice-and-opt-out`. But the honest developer advice is not "ship trackers
freely" -- it is *ship fewer trackers*. Plain first-party-configured analytics is low risk;
session replay, chat widgets that record, embedded third-party video and ad pixels are what
actually draw CIPA and VPPA demand letters. The best answer in the US, as in the UK, is to have
nothing to consent to.

### (C) "ADA Title III requires a small business's informational site to be WCAG-conformant." -- OVERSTATED

There is **no regulation** setting a technical standard for private-sector websites; DOJ's 2024
rule is Title II only; and whether Title III even reaches the site is circuit-dependent -- with
the circuit map itself widely misreported, as shown above.

There is also named judicial pushback on the litigation. Source:
https://www.adatitleiii.com/2025/05/ (fetched 2026-08-18), quoting:

- *Fernandez v. Buffalo Jackson Trading Co.* (S.D.N.Y., Cronan J.): "Article III does not
  permit plaintiffs to roam the country in search of ... wrongdoing", criticising
  "cookie-cutter, fill-in-the-blanks" complaints from a plaintiff who claimed to have tried to
  buy from 40 sites in a single week.
- *Black v. 3 Times 90, Inc.* (E.D.N.Y., Merle J.): dismissed for lack of genuine intent to
  return; the plaintiff had filed 27 suits in the previous year.

**Verdict:** the legal mandate is overstated; the *litigation* risk is real and rising (3,117
federal website suits in 2025, up 27%), and in California every ADA violation is automatically
an Unruh violation carrying a **USD 4,000 statutory minimum**. So: build accessibly because the
exposure is real, never write "ADA compliant" on the site, and never bolt on an overlay.

### Other standard advice, tested

| Claim | Verdict |
|---|---|
| "You must have a Terms of Service" | **Overstated.** No US law mandates one for a purely informational brochure site. Contractual prudence only |
| "You need a DMCA agent" | **False for this site.** 17 U.S.C. 512 agent registration matters only to service providers hosting user-submitted material. No UGC, nothing to shelter |
| "You need SSL by law" | **False.** No statute. Browser warnings and search ranking are private-platform pressure. Ship HTTPS anyway -- it is free -- but not because a law says so |
| "You must have an accessibility statement" | **False.** Not mandated anywhere for a private business. It is a voluntary good-faith signal. Distinct from whether the *site* must be accessible |
| "A policy generator's output is fine" | **False, and this is the sharp one.** The FTC has repeatedly acted under section 5 against companies whose real practices diverged from their published policy (Twitter USD 150m 2022; Avast 2024; 1Health.io 2023; X-Mode 2024; historically In re GeoCities 1998). A generated policy asserting "we never share your data" on a site running GA4 is a published false statement about the business, on the page specifically about being trustworthy with information. All FTC actions here are **secondary-sourced** -- ftc.gov 403'd throughout |

---

## Where sources disagreed, and which I followed

1. **FTC Reviews Rule effective date. Resolved in favour of 21 October 2024.**
   A collector reported 1 January 2025, reading the `govinfo` CFR XML. That XML's "2025-01-01"
   is the **CFR annual-edition revision date**, not the rule's effective date. The Federal
   Register document itself states, in its DATES line, "This rule is effective October 21,
   2024" -- confirmed twice, once from the HTML text package and once by reading page 1 of the
   FR PDF directly (89 FR 68034, 22 Aug 2024). Primary text beats a derived artefact's metadata.

2. **FCC "revoke-all" TCPA provision.** A collector described it as "not binding until next
   spring", correct against a pre-April-2026 frame. The waiver ran to 11 April 2026; **that
   date has passed**, so the provision is live today. Corrected against FCC Order DA 25-312.

3. **Eleventh Circuit and Gil v. Winn-Dixie.** Many secondary sources -- including law-firm
   alerts written after the vacatur -- still list the Eleventh Circuit as a nexus-required
   circuit on the authority of a **vacated** opinion. Followed CourtListener's docket (two
   opinions, 2021-04-07 and 2021-12-28) and the vacatur analysis. The profile says the Eleventh
   Circuit has no live holding.

4. **Arkansas.** A secondary source said enacted and effective 2026-07-01; the legislature's own
   bill-status page says it died at sine die. Followed the legislature.

5. **CCPA revenue threshold.** The statute says USD 25,000,000; Cal. Civ. Code 1798.199.95(d)
   requires biennial CPI adjustment, and the CPPA's own page gives **USD 26,625,000** effective
   2025-01-01, next adjustment 2027-01-01. Followed the regulator's published figure and
   recorded both. Same page: administrative fines adjusted to USD 2,663 and USD 7,988.

6. **Overlay litigation statistics.** The "1,416 businesses with widgets sued in 2025 / 22.64%
   of suits" figure comes only from vendors who compete with overlays. Recorded as directional,
   not verified. The **FTC's USD 1m accessiBe order** is the solid fact in this area, and is
   what the profile cites.

---

## What could NOT be established

Every one of these is a real gap. None is rounded up into a confident claim in `us.mjs`, and
several are named in `provenance.caveats` so that a reader of the profile alone still sees them.

1. **Direct primary-source confirmation of any `ftc.gov`-hosted document.** `ftc.gov` returned
   HTTP 403 to every automated request across the whole run. The FTC Act, the Endorsement
   Guides and Part 465 were all confirmed through `govinfo.gov` and `law.cornell.edu` instead,
   which is adequate. But the FTC's **1983 Advertising Substantiation Policy Statement** could
   not be confirmed from any source, and the accessiBe, Twitter, Avast, 1Health.io and X-Mode
   enforcement actions rest on secondary summaries of the Commission's own text.
2. **Whether 16 CFR Part 465 has faced any court challenge.** Searched specifically; none
   found; the Feb 2026 conforming FR notice does not touch it and the FTC was still enforcing
   it in 2026. But "no reported challenge" is absence of evidence, not a government statement
   that no case exists. Given that the FTC lost the CARS Rule (*NADA v. FTC*, 127 F.4th 549
   (5th Cir. 2025)), the Non-Compete Rule (*Ryan LLC v. FTC*, 746 F. Supp. 3d 369 (N.D. Tex.
   2024)) and the 2024 Negative Option amendments (*Custom Communications v. FTC*, 142 F.4th
   1060 (8th Cir. 2025)) in the same period, this is a live risk, not a formality.
3. **Reporter citation and docket for *Insurance Marketing Coalition v. FCC***. CourtListener
   and Justia both 403'd. Case name, court and the 24 Jan 2025 decision date are corroborated
   by multiple independent secondary sources only.
4. **Primary statutory text for 12 of the 20 in-effect state privacy laws** -- Oregon, Iowa,
   New Hampshire, New Jersey, Tennessee, Minnesota, Indiana, Kentucky, Rhode Island, Delaware,
   Maryland, and partly Colorado, Connecticut and Nebraska, were taken from codified mirrors or
   converging law-firm trackers, not the state's own site. The *conclusion* is insensitive to
   this -- our site misses every threshold by orders of magnitude, so even a materially wrong
   threshold would not change the answer -- but the individual numbers are not primary-verified.
5. **Vermont VDPOSA thresholds.** Enactment and the 2028-01-01 date are corroborated; the
   thresholds are not.
6. **Whether Cal. Bus. & Prof. Code 7030.5's "all forms of advertising" has been extended to
   websites by a fetchable regulation or case.** The statute is medium-neutral and was last
   amended in 1973. CSLB's own guidance page 404'd. The website extension is supported by
   16 CCR 861 and CSLB secondary material only.
7. **California handyman / minor-work exemption threshold** (Cal. Bus. & Prof. Code 7048 and
   7027.2), reportedly raised from USD 500 to USD 1,000 on 2025-01-01. Secondary only. The
   profile states no figure.
8. **Whether Cal. Bus. & Prof. Code 10140.6 reaches real-estate websites specifically.**
   Ambiguous on the face of the statute; no interpreting authority located.
9. **UCL (Cal. Bus. & Prof. Code 17200) penalty figure for CalOPPA enforcement.** Not fetched.
   The profile describes the mechanism and states no number.
10. **Arizona, Utah and Oregon contractor-advertising rules.** Named as candidates, not reached.
    Four states were verified instead.
11. **NY State and NYC Human Rights Law text on websites.** Secondary summaries only; the
    NYCHRL damages figures (up to USD 125,000, USD 250,000 wilful) are not primary-verified.
12. **Whether SB 1186's heightened-pleading and cure provisions extend from construction-related
    Unruh claims to website claims.** The construction reform is real; the extension is not
    established. The profile does not rely on it.
13. **CIPA litigation volume.** "800+ claims in 2025" and "3,500+ privacy filings projected
    2026" come from a bar-association blog via search snippet, not a litigation-tracking primary
    source.
14. **2026 partial-year web-accessibility litigation figures.** Only full-year 2024 and 2025
    data exists.
15. **A named Third Circuit appellate case** on the website/nexus question, and any
    **website-specific** appellate holding in the Sixth or Second Circuits. None found -- which
    is itself the finding, but it means the "circuit split" cannot be stated as cleanly as
    published advice states it.
16. **A formal citable negative authority** proving no Delaware General Corporation Law
    website-disclosure clause exists. Searched; nothing found; but a negative of this shape
    cannot be closed by search alone.

---

## Known mismatch between this profile and `checks/rules/legal.mjs`

Not a research finding, but discovered while writing the profile, and it must not be lost.

`checks/rules/legal.mjs` **hardcodes UK law in two finding strings**, so a US run emits correct
verdicts with wrong citations:

- around line 232, `legal/consent-banner`: "PECR reg.6 requires consent BEFORE a non-essential
  cookie is set ... Note the DUAA 2025 exceptions".
- around line 278, `legal/consent-reject-parity`: "Accept-only banners are what the **ICO**
  writes to people about."

Neither sentence is true in the United States. The **verdicts** those gates produce are still
defensible for a US site -- a site loading a Meta Pixel and a session recorder with no consent
control is exactly the configuration drawing CIPA demand letters -- but the citations attached
to them are for the wrong country, and this repo's entire premise is that a confident wrong
citation is worse than a gap.

**Recommended fix, not made here** (out of scope for these two files, and it would change UK
behaviour): move both strings into the profile, e.g. `legal.consentFindings.banner` and
`legal.consentFindings.rejectParity`, and have `legal.mjs` read them with the current UK text
as the fallback. Until then, `provenance.caveats` in `us.mjs` names this so nobody quotes a US
run's consent finding to a client.

## Two bugs in `profiles/_base.mjs`, found by testing rather than by reading

The shared base profile and `checks/lib/profile.mjs` were both present as uncommitted work
when this profile was written, so `us.mjs` conforms to the sibling shape (`claimCitations`,
no restated tracker list). Two things were found by running the patterns against innocent
prose, and both affect **every** profile, not only this one:

1. **`claimPatterns.count` fires on "We do more than clients expect".** The pattern permits
   zero digits between "more than" and the noun, so an ordinary sentence is reported as an
   unsubstantiated customer-count claim. Fix: require at least one digit.
2. **`claimPatterns.guarantee` fires on "We cannot guarantee that the part is in stock".** It
   matches `guarantee` followed by any word, so a **disclaimer** is flagged as a guarantee --
   close to the worst possible false positive, because it penalises the honest sentence.
   Fix: require "we guarantee" adjacently, or one of the named guarantee forms.

`us.mjs` currently works around both by supplying `regulatedClaims` by hand, because the
loader's build is all-or-nothing and there is no way to correct two classes without owning the
list. **That workaround is in the wrong place and is marked in the file as such.** Fixing the
two base patterns and deleting the override is the correct end state, and would let `us.mjs`
drop to `claimCitations` plus a `localRegisters` list like its siblings.

Verified false-positive set now clean for the US profile, tested directly: "the best way to
reach us", "We do more than clients expect", "We cannot guarantee that the part is in stock",
"Suite #1 Main Street, Austin", "our registered office is in Devon", "top rated in the
industry", "3 years ago we moved premises", "Please read the text below". Verified
true-positive set: star ratings, customer counts, "the best plumber in Austin", "#1 roofer in
Dallas", "Licensed by the State of California", "Licensed and insured", "We guarantee
same-day service", "10-year warranty", "Fully insured", "25 years of experience".

One further note on the base profile, and it is a removal rather than an addition: base's
`consentBeforeLoad` flags hotlinked Google Fonts on the authority of a German court decision.
That has no US analogue, so `us.mjs` overrides the list to drop it. Shipping it would have
been a confident citation from the wrong jurisdiction.
