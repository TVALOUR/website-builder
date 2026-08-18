// website-builder — legal and compliance gates.
//
// Measured motivation: the system this repo replaces had a written rule saying
// four legal pages ship on EVERY build. Across four shipped sites it delivered
// nine of sixteen, and one site shipped none at all. The rule was fine. Nothing
// checked it.
//
// NOT LEGAL ADVICE. A clean run here means the site is not obviously exposed on
// the things a static file can prove. It does not mean "compliant", and the
// report says so out loud rather than letting a green tick imply it.
//
// RULE PROVENANCE
//   source:  TAXONOMY.md (18-angle research wave, 2026-08-18, adversarially verified)
//   dated:   2026-08-18
//   review:  2027-02-18 — six months. Signals decay: a tell that identified a
//            generator in 2023 can be a mainstream choice by 2026. At review,
//            ask of every rule here "is this still true?" and RETIRE the ones
//            that are not. Removing a rule is a normal outcome, not a failure;
//            TAXONOMY.md has a section for it.

import { read, displayPath, exists } from '../lib/fs.mjs';
import { visibleText, tags, attr, references, body } from '../lib/html.mjs';
import { BLOCKER, MAJOR, MINOR } from '../lib/report.mjs';
import { norm } from '../lib/ledger.mjs';
import { basename, join } from 'node:path';

export const gates = [
  { id: 'legal/jurisdiction', severity: 'blocker', what: 'a jurisdiction profile was chosen and loaded' },
  { id: 'legal/local-rule', severity: 'minor', what: 'jurisdiction-specific rules the profile says a human must confirm' },
  { id: 'legal/privacy-policy', severity: 'blocker', what: 'a privacy policy exists, is linked, and covers the required ground' },
  { id: 'legal/cookie-policy', severity: 'blocker', what: 'a cookie policy exists when anything non-essential is loaded' },
  { id: 'legal/terms', severity: 'minor', what: 'terms of use ship by default' },
  { id: 'legal/accessibility-statement', severity: 'minor', what: 'an accessibility statement ships by default' },
  { id: 'legal/footer-links', severity: 'major', what: 'every page links to the legal pages' },
  { id: 'legal/consent-required', severity: 'blocker', what: 'non-essential scripts do not fire before consent' },
  { id: 'legal/consent-banner', severity: 'blocker', what: 'a consent mechanism exists when one is needed' },
  { id: 'legal/consent-reject-parity', severity: 'major', what: 'rejecting is as easy as accepting' },
  { id: 'legal/third-party-preconsent', severity: 'major', what: 'third-party embeds that leak the visitor before any choice' },
  { id: 'legal/business-identity', severity: 'major', what: 'the trading disclosures the law requires on the site' },
  { id: 'legal/regulated-claim', severity: 'blocker', what: 'ratings, awards, accreditations and guarantees with no sourced row' },
  { id: 'legal/stale-date', severity: 'minor', what: 'legal pages carry a last-updated date' },
  { id: 'legal/copyright-year', severity: 'minor', what: 'a hardcoded copyright year that will go stale' },
];

function findPage(everyFile, patterns, siteDir) {
  for (const f of everyFile) {
    const name = basename(f).toLowerCase();
    const rel = displayPath(f, siteDir).toLowerCase();
    if (!/\.html?$/.test(name) && !/\/index\.html?$/.test(rel)) continue;
    // match against the route, so /privacy/index.html counts as "privacy"
    const route = rel.replace(/\/index\.html?$/, '').replace(/\.html?$/, '');
    if (patterns.some((p) => p.test(route) || p.test(name))) return f;
  }
  return null;
}

export async function run(ctx, report) {
  const { siteDir, htmlFiles, jsFiles, everyFile, profile, factsPath, profileProblems } = ctx;
  const L = profile?.legal;
  for (const id of gates.map((g) => g.id)) report.ranGate(id);

  // The jurisdiction itself is the first gate. A profile that is missing, or
  // that claims to be verified with nobody's name on it, is a BLOCKER — never
  // the silent skip it used to be, which turned this entire family off and
  // still printed PASS.
  for (const why of profileProblems || []) {
    report.add('legal/jurisdiction', BLOCKER, why, {},
      'Run stage 00 (stages/00_setup/CONTEXT.md) to record the country in config.md, or pass --profile <id>. '
      + 'profiles/README.md has the protocol for researching a country that has no file yet — one pass, primary '
      + 'sources, every citation carrying the URL it came from. Do not substitute the nearest country.');
  }

  if (!L) {
    report.skip('legal', 'no profile loaded — every legal gate below is OFF. run.mjs has already raised '
      + 'legal/jurisdiction as a blocker; this line is here so nobody reads the gate count as coverage.');
    return;
  }

  // Entity type decides which disclosures the law requires, and the two lists
  // barely overlap: a limited company must publish its company number and
  // registered office, a sole trader must publish a geographic address.
  //
  // Read it from an explicit `Entity type` row first. Sniffing the whole file
  // for the word "limited" got this exactly backwards on a ledger that said
  // "sole trader (not a limited company)" — the checker then demanded a company
  // number from a business that does not have one, which is worse than silence
  // because it sends someone looking for a fact that cannot exist.
  // Same ledger discovery as the facts family: an explicit --facts path wins,
  // else a colocated facts.md. Without this the README's documented plain run
  // (`node checks/run.mjs <site>`) judged the same site differently from the
  // full command, which is the kind of inconsistency that teaches people to
  // distrust the tool.
  let factsFile = factsPath && exists(factsPath) ? factsPath : null;
  if (!factsFile) {
    for (const name of ['facts.md', 'FACTS.md', '../facts.md', '../01_discover/facts.md']) {
      const p = join(siteDir, name);
      if (exists(p)) { factsFile = p; break; }
    }
  }
  const factsText = factsFile ? read(factsFile) : '';
  const ledgerText = factsText;

  // Question 0, threaded through: an Entity type row declaring a personal,
  // demo, fictional or online-product project switches OFF the local-trader
  // disclosure gates - they are the law for UK traders with a shopfront, and
  // demanding a geographic address from a SaaS landing page pressures people
  // toward inventing one, the exact dishonesty this tool exists to stop.
  const entityDecl = /\|\s*Entity\s*type\s*\|([^|]*)\|/i.exec(factsText);
  const declaredForm = entityDecl
    && /\b(limited|ltd\.?|plc|llp|sole\s*trader|partnership)\b/i.test(entityDecl[1]);
  const demoish = entityDecl && !declaredForm
    && /(personal|portfolio|demo|fiction)/i.test(entityDecl[1]);
  const nonTrader = entityDecl && !declaredForm
    && (demoish
      || /(product|saas|online[\s-]?only|no\s+premises|not\s+a\s+(local\s+)?(business|trader))/i
        .test(entityDecl[1]));

  let isLimited = null;
  const entityRow = /\|\s*Entity\s*type\s*\|([^|]*)\|/i.exec(factsText);
  if (entityRow) {
    const declared = entityRow[1].toLowerCase();
    if (/\bsole\s*trader\b|\bpartnership\b|\bunincorporated\b/.test(declared)) isLimited = false;
    else if (/\b(limited|ltd|plc|llp)\b/.test(declared)) isLimited = true;
  }
  if (isLimited === null) {
    // No declared entity type: fall back to what the site itself says.
    isLimited = htmlFiles.some((f) =>
      /\b(company\s+(number|no\.?)|registered\s+in\s+england|companies\s+house)\b/i.test(read(f)));
  }

  // The consent findings below must speak the profile's law, not the author's.
  // Naming PECR and the ICO unconditionally meant a US run produced a confident
  // verdict citing the wrong country — the exact failure this profile system
  // exists to prevent, inside the file that implements it.
  const consentLaw = L.consentModelWhy
    || (L.consentModel === 'prior-opt-in'
      ? 'This jurisdiction requires consent BEFORE non-essential storage is set.'
      : L.consentModel === 'notice-and-opt-out'
        ? 'This jurisdiction requires disclosure and a working opt-out rather than prior consent.'
        : 'This profile does not state whether prior consent is required here — check locally before deciding a banner is enough.');
  const regulatorNote = L.consentModel === 'prior-opt-in'
    ? 'Accept-only banners are the most-enforced consent failing there is.'
    : 'Even where prior consent is not required, an opt-out that is harder to find than the opt-in is the pattern regulators single out.';

  // ------------------------------------------------ detect what the site loads
  const allSource = [...htmlFiles, ...jsFiles].map(read).join('\n');
  const nonEssential = [];
  for (const [re, label] of L.nonEssentialScripts) {
    if (re.test(allSource)) nonEssential.push(label);
  }

  // ------------------------------------------------ baseline pages
  const found = {};
  for (const [key, spec] of Object.entries(L.pages)) {
    const page = findPage(everyFile, spec.patterns, siteDir);
    found[key] = page;

    // 'if-collects-personal-data' is the portable trigger: a contact form, a
    // mailto, a tel: link the site asks you to use, or anything non-essential
    // loading. It exists for profiles that decline to say "always" because the
    // local law has a threshold — the international baseline is the main user.
    const collectsPersonalData = nonEssential.length > 0
      || htmlFiles.some((f) => /<form\b|mailto:|formspree|web3forms|basin|netlify\s*-?\s*forms/i.test(read(f)));

    const needed = spec.required === 'always'
      || (spec.required === 'if-non-essential-scripts' && nonEssential.length > 0)
      || (spec.required === 'if-collects-personal-data' && collectsPersonalData);

    const gateId = key === 'privacy' ? 'legal/privacy-policy'
      : key === 'cookies' ? 'legal/cookie-policy'
      : key === 'terms' ? 'legal/terms' : 'legal/accessibility-statement';

    if (!page) {
      report.add(
        gateId,
        needed ? BLOCKER : MINOR,
        `no ${key} page found`,
        {},
        `${spec.why} Ship one — a template is in templates/legal/.`
      );
      continue;
    }

    const text = visibleText(read(page));
    const shown = displayPath(page, siteDir);

    for (const [re, whatFor] of spec.mustMention || []) {
      if (!re.test(text)) {
        // A privacy notice missing a statutory section is a legal exposure, not
        // a craft defect. The others stay MAJOR: a terms page without a
        // governing-law line is untidy, not unlawful.
        const sev = key === 'privacy' ? BLOCKER : MAJOR;
        report.add(gateId, sev, `${key} page does not cover ${whatFor}`,
          { file: shown },
          'A policy that omits a required section is worse than none: it looks like diligence and is not.');
      }
    }

    if (!/\b(last\s+(updated|reviewed)|effective\s+(from|date)|version)\b/i.test(text)) {
      report.add('legal/stale-date', MINOR, `${key} page has no last-updated date`,
        { file: shown }, 'Add one. An undated policy cannot be shown to have been current at any point.');
    }

    // A policy that describes machinery the site does not have is a false
    // statement about the business, which is the exact failure this repo exists
    // to stop — just wearing a suit.
    if (key === 'cookies' && nonEssential.length === 0
        && /\b(analytics|marketing|advertising)\s+cookies?\s+(are|we\s+use)\b/i.test(text)) {
      report.add('legal/cookie-policy', MAJOR,
        'cookie policy describes analytics/marketing cookies the site does not actually load',
        { file: shown },
        'Delete the rows that are not real. A policy listing vendors that are not present is a false statement, not a safe default.');
    }
  }

  // ------------------------------------------------ footer links
  const legalRoutes = Object.values(found).filter(Boolean)
    .map((f) => displayPath(f, siteDir).replace(/index\.html?$/, ''));

  if (legalRoutes.length) {
    for (const file of htmlFiles) {
      const shown = displayPath(file, siteDir);
      if (Object.values(found).some((f) => f && displayPath(f, siteDir) === shown)) continue;
      const raw = read(file);
      const hrefs = references(raw).filter((r) => r.attrName === 'href').map((r) => r.value.toLowerCase());
      const missing = [];
      for (const [key, page] of Object.entries(found)) {
        if (!page) continue;
        if (key === 'terms' || key === 'accessibility') continue; // linked is good, required is privacy/cookies
        const route = displayPath(page, siteDir).toLowerCase().replace(/index\.html?$/, '');
        const stem = route.replace(/\.html?$/, '');
        if (!hrefs.some((h) => h.includes(stem) || h.includes(basename(route)))) missing.push(key);
      }
      if (missing.length) {
        report.add('legal/footer-links', MAJOR,
          `does not link to: ${missing.join(', ')}`,
          { file: shown },
          'Every page needs the legal links in its footer. A policy nobody can reach from the page collecting the data is not published.');
      }
    }
  }

  // ------------------------------------------------ consent
  //
  // PER-TRACKER, and that is the fix. The old check was one boolean over every
  // HTML and JS file concatenated: if the string `data-consent=` appeared
  // ANYWHERE, the blocker was disarmed site-wide. Since stage 05 instructs the
  // agent to copy templates/consent.js in, the repo's own template satisfied
  // its own gate — a user following the build instruction exactly could ship a
  // live GTM snippet with a green tick. Verified by the critique with a control.
  //
  // Also scans inline script BODIES, not just src= attributes: the canonical
  // Google-provided GTM snippet injects itself from inline JS, so a src-only
  // scan is structurally unable to see the most common tracker on the web.
  if (nonEssential.length) {
    // Legal pages are excluded from the prose scan so a cookie policy EXPLAINING
    // how to withdraw consent cannot be mistaken for a consent mechanism.
    const nonLegal = htmlFiles.filter((f) => !/privacy|cookie|terms|accessib/i.test(displayPath(f, siteDir)));
    const nonLegalSource = [...nonLegal.map(read), ...jsFiles.map(read)].join("\n");

    const bannerish = /cookie[-\s]?(banner|consent|notice)|consent[-\s]?(banner|manager)|__consent|cookieConsent|data-consent-banner/i
      .test(nonLegalSource);

    // THE CONSENT MODEL DECIDES WHAT IS OWED. This branch is the whole reason
    // `consentModel` exists, and until it was written the field changed nothing:
    // every jurisdiction was gated as prior-opt-in, so a US or Australian site
    // was BLOCKED from shipping until it deployed the EU banner its own profile
    // spends thirty lines explaining is not required there.
    //
    // A finding whose own explanation says the requirement does not exist, that
    // then refuses to let the site ship, teaches the reader to distrust the gate
    // — and if they comply, they ship a dark pattern that satisfies no
    // obligation the site has. Both outcomes are worse than silence.
    const priorConsent = L.consentModel === 'prior-opt-in';
    const optOut = L.consentModel === 'notice-and-opt-out';

    if (!bannerish) {
      if (priorConsent) {
        report.add('legal/consent-banner', BLOCKER,
          `${nonEssential.join(', ')} loaded with no consent mechanism anywhere on the site`,
          { count: nonEssential.length },
          `${consentLaw} Copy templates/consent.js in, or remove the tracking. Removing the tracker is the better answer in every jurisdiction: it deletes the obligation instead of managing it, and it is faster.`);
      } else if (optOut) {
        // Not a banner. What is owed here is disclosure plus a working opt-out,
        // and the checkable half is whether the tracker is named on a page the
        // visitor can find.
        const legalText = htmlFiles
          .filter((f) => /privacy|cookie/i.test(displayPath(f, siteDir)))
          .map((f) => visibleText(read(f))).join('\n');
        const undisclosed = nonEssential.filter((label) => {
          const word = label.split(/[\s/]+/)[0];
          return word && !new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(legalText);
        });
        if (undisclosed.length) {
          report.add('legal/consent-banner', MAJOR,
            `${undisclosed.join(', ')} loaded and never named on the privacy or cookie page`,
            { count: undisclosed.length },
            `${consentLaw} No banner is required here — what is owed is that a visitor can find out what is set and turn it off. `
            + `Name each tracker on the cookie page and give a working opt-out. `
            + `Loading nothing that needs consent removes the question in every country, and is still the better answer.`);
        }
      } else {
        report.add('legal/consent-banner', MINOR,
          `${nonEssential.join(', ')} loaded, and this profile does not state whether prior consent is required here`,
          { count: nonEssential.length },
          `${consentLaw} The gate is reporting what the files do and declining to rule on what the law wants, which is the `
          + `honest output for an unresearched jurisdiction. Get a local answer before launch, or drop the tracker.`);
      }
    }

    // Each tracker must be individually gated. Presence of the consent library
    // proves nothing about whether THIS tracker is behind it.
    for (const [re, label] of L.nonEssentialScripts) {
      let gated = false;
      let live = false;
      for (const file of [...htmlFiles, ...jsFiles]) {
        const raw = read(file);
        if (!re.test(raw)) continue;
        // Is this tracker inside an inert stub?
        for (const t of tags(raw, 'script')) {
          const isStub = /text\/plain/i.test(attr(t.raw, 'type') || '')
            && /data-consent/i.test(t.raw);
          const dataSrc = attr(t.raw, 'data-src') || '';
          if (isStub && (re.test(dataSrc) || re.test(t.raw))) gated = true;
        }
        // Is it live? A src= on a real script tag, or a match inside an inline
        // script body that is not itself an inert stub.
        for (const t of tags(raw, 'script')) {
          const type = (attr(t.raw, 'type') || '').toLowerCase();
          if (type === 'text/plain') continue;
          const src = attr(t.raw, 'src') || '';
          if (src && re.test(src)) { live = true; continue; }
        }
        const inlineBodies = [...raw.matchAll(/<script\b(?![^>]*\btype\s*=\s*["']text\/plain)[^>]*>([\s\S]*?)<\/script>/gi)]
          .map((m) => m[1]).join("\n");
        if (re.test(inlineBodies)) live = true;
        if (jsFiles.some((jf) => re.test(read(jf)))) live = true;
      }
      if (live && !gated) {
        // Firing before a decision is only a violation where a decision is owed
        // BEFORE it fires. Under notice-and-opt-out the tag may run; what is
        // owed is that the visitor can find it and switch it off.
        if (priorConsent) {
          report.add('legal/consent-required', BLOCKER,
            `${label} runs before any consent decision`,
            {},
            'Ship it inert: <script type="text/plain" data-consent="analytics" data-src="…"></script>. A banner that appears while the tag has already fired is decoration, and this is the most common way it is got wrong.');
        } else if (optOut) {
          report.add('legal/consent-required', MINOR,
            `${label} fires on load — permitted here, but only with disclosure and a working opt-out`,
            {},
            `${consentLaw} Nothing needs to be blocked before it runs in this jurisdiction. Check the visitor can find out it is `
            + 'there and turn it off, and remember that a visitor from a prior-consent country reaches the same page.');
        }
      }
    }

    if (bannerish) {
      const hasAccept = /\b(accept|allow|agree|got\s?it|ok)\b/i.test(nonLegalSource);
      const hasReject = /\b(reject|decline|refuse|necessary\s+only|essential\s+only|deny)\b/i.test(nonLegalSource);
      if (hasAccept && !hasReject) {
        report.add('legal/consent-reject-parity', MAJOR,
          'consent banner offers accept but no equally prominent reject',
          {},
          `Add a "Reject non-essential" control at the same level as accept, with nothing pre-selected. ${regulatorNote}`);
      }
    }
  }

  // ------------------------------------------------ third-party pre-consent
  // Aggregated site-wide on purpose. The old shape emitted one finding per page
  // and a nine-page site produced nine identical lines for one <link> in one
  // shared template — noise that trains people to scroll past the report.
  for (const [re, label, fix] of L.consentBeforeLoad) {
    const hitFiles = htmlFiles.filter((f) => re.test(read(f)));
    if (!hitFiles.length) continue;
    const scope = hitFiles.length === htmlFiles.length
      ? 'every page (so it lives in the shared header)'
      : `${hitFiles.length} of ${htmlFiles.length} pages`;
    report.add('legal/third-party-preconsent', MAJOR, `${label} — on ${scope}`,
      { file: displayPath(hitFiles[0], siteDir), count: hitFiles.length }, fix);
  }

  // ------------------------------------------------ business identity
  const siteText = htmlFiles.map((f) => visibleText(read(f))).join('\n');
  if (nonTrader) {
    report.skip('legal/business-identity',
      `facts.md declares entity type "${entityDecl[1].trim()}" - trader identity disclosures ${demoish ? 'not applied' : 'reduced to contact details'}`);
  }
  // A declared legal form always owes its statutory list. A real online
  // product business still owes reachable contact details. Only a declared
  // personal/demo/fictional project owes neither.
  const disclosureChecks = nonTrader
    ? (demoish ? [] : [...L.disclosure.all])
    : [
      ...(isLimited ? L.disclosure.limited : L.disclosure.soleTrader),
      ...L.disclosure.all,
    ];
  for (const [re, what, why] of disclosureChecks) {
    if (!re.test(siteText)) {
      report.add('legal/business-identity', MAJOR,
        `the site never shows ${what}`, {},
        `${why}${isLimited ? ' This site reads as a limited company.' : ' This site reads as a sole trader — if it is a limited company, put the entity type in facts.md and re-run, because the disclosure list changes.'}`);
    }
  }

  // ------------------------------------------------ regulated claims
  // Also aggregated: one line per claim TYPE, listing where it appears. A claim
  // repeated in a shared footer is one decision to make, not eight.
  for (const [re, what, why] of L.regulatedClaims) {
    const hits = [];
    for (const file of htmlFiles) {
      const text = visibleText(read(file));
      const m = text.match(re);
      if (m && m.length) {
        const at = text.indexOf(m[0]);
        hits.push({
          file: displayPath(file, siteDir),
          sample: String(m[0]).trim(),
          // 90 chars of surrounding sentence, so the register name and the
          // membership number are both available to the backing check.
          context: at >= 0 ? text.slice(Math.max(0, at - 20), at + 90) : String(m[0]),
          n: m.length,
        });
      }
    }
    if (!hits.length) continue;
    const total = hits.reduce((a, b) => a + b.n, 0);
    const where = hits.length === htmlFiles.length ? 'every page' : hits.map((h) => h.file).slice(0, 3).join(', ')
      + (hits.length > 3 ? ` +${hits.length - 3} more` : '');
    // BLOCKER unless the ledger backs it. The finding text always said "confirm
    // it traces to a sourced row in facts.md" and then never checked — so a
    // false accreditation, an invented star rating and a guarantee nobody
    // agreed to were all handed to a prose triage step, which is the mechanism
    // this repo declares bankrupt. The machinery was already next door.
    // Match on the claim's SUBSTANCE, not on the regex fragment. "Registered
    // with the Farriers Registration Council, number FRC 08812" reduces to the
    // tokens FRC and 08812; a ledger row naming either backs it. Comparing the
    // matched fragment ("Registered with t") instead blocked a fixture whose
    // claim was correctly sourced two lines away — the cry-wolf failure this
    // file warns about, produced by the check meant to prevent it.
    // THE TOKEN THAT BACKS THE CLAIM MUST BE THE CLAIM'S DISCRIMINATOR.
    //
    // "Any capitalised word within 90 characters also appears in facts.md" is
    // far too weak a test for "this specific claim is sourced", because the
    // business's OWN NAME is within 90 characters of everything and is in
    // facts.md by definition. Instrumented on a real fixture: "Licensed by the
    // State of Ohio" downgraded from BLOCKER to MAJOR on the strength of the
    // token "Colwell" — the trading name — appearing in the ledger. Every
    // regulated claim written anywhere near the business name was auto-excused,
    // and the business name is on every page.
    //
    // A registration number, a register acronym or the claimed figure is what
    // distinguishes THIS claim. A place name or a first name is not. Where no
    // discriminator can be extracted, the claim stays a BLOCKER and says why —
    // "could not verify" is the honest output, not a downgrade.
    const context = hits[0].context || hits[0].sample;
    const identityRows = (ledgerText.match(/^\|[^|\n]*(?:trading\s*name|business\s*name|owner|proprietor|town|city|area)[^|\n]*\|([^|\n]*)\|/gim) || [])
      .join(' ');
    const identityTokens = new Set((identityRows.match(/\b[A-Z][a-z]{2,}\b|\b[A-Z]{2,}\b/g) || []).map((t) => norm.text(t)));
    const discriminators = (context.match(/\b[A-Z]{2,}\b|\b\d{3,}\b/g) || [])
      .filter((t) => !/^(The|This|We|Our|Registered|Number|With|And)$/i.test(t))
      // The business's own identity cannot vouch for a claim about a register.
      .filter((t) => !identityTokens.has(norm.text(t)));
    const lt = norm.text(ledgerText || '');
    const backed = discriminators.length > 0 && discriminators.some((t) => lt.includes(norm.text(t)));
    const tokens = discriminators;
    report.add('legal/regulated-claim', backed ? MAJOR : BLOCKER,
      `${what} — "${hits[0].sample.slice(0, 45)}" on ${where}${backed ? ' (a ledger row mentions it)' : ', with no matching row in facts.md'}`,
      { file: hits[0].file, count: total },
      backed
        ? `${why} A ledger row carries this claim's own identifier (${discriminators.find((t) => lt.includes(norm.text(t)))}); confirm the row's source is real before this ships.`
        : `${why} Nothing in facts.md backs this${discriminators.length ? '' : ', and no registration number, register name or figure could be extracted from it to check against — which is itself worth fixing on the page'}. Add a sourced row, or take the claim off the site.`);
  }

  // ------------------------------------------------ copyright year
  const thisYearish = /©|&copy;|copyright/i;
  for (const file of htmlFiles) {
    const raw = read(file);
    const b = body(raw);
    if (!thisYearish.test(b)) continue;
    const m = /(?:©|&copy;|copyright)\s*(\d{4})/i.exec(b);
    if (m && !/getFullYear|\{\{\s*year/i.test(read(file))) {
      report.add('legal/copyright-year', MINOR,
        `copyright year "${m[1]}" is hardcoded`,
        { file: displayPath(file, siteDir) },
        'Render it from the date in one line of JS, or accept that the site announces its own neglect every January.');
      break;
    }
  }

  // ------------------------------------------------ local rules from the profile
  //
  // `legal.extras` is where a profile puts an obligation that has no slot in the
  // schema — Quebec's French-language requirements, Germany's Impressum, a state
  // contractor-licence display rule. Two kinds:
  //
  //   * with a `pattern` — a real probe. It fires only when the pattern matches
  //     (or, with `absent: true`, only when it does NOT), at the declared severity.
  //   * without one    — not machine-checkable. It is emitted as a MINOR naming
  //     the rule and the fact that a human has to confirm it, because the
  //     alternative is a rule nobody ever sees.
  //
  // The severity of an unprobeable extra is deliberately NOT the declared one. A
  // blocker that fires on every single run is not a gate, it is a banner, and
  // people learn to skip banners.
  const allText = htmlFiles.map((f) => visibleText(read(f))).join('\n');
  const byHand = [];
  for (const extra of L.extras || []) {
    if (!extra || !extra.id) continue;
    const sev = extra.severity === 'blocker' ? BLOCKER : extra.severity === 'major' ? MAJOR : MINOR;
    let re = null;
    if (extra.pattern) {
      try {
        const m = /^\/(.*)\/([gimsuy]*)$/s.exec(String(extra.pattern).trim());
        re = m ? new RegExp(m[1], m[2]) : new RegExp(String(extra.pattern));
      } catch {
        report.add('legal/local-rule', MINOR, `${extra.id}: the profile's pattern is not a usable regex, so this rule did not run`,
          {}, 'Fix the pattern in the profile. A rule that cannot run is worse than an absent one, because the report implies it ran.');
        continue;
      }
    }
    if (re) {
      const hit = re.test(allText) || re.test(allSource);
      const fires = extra.absent ? !hit : hit;
      if (fires) {
        report.add('legal/local-rule', sev, `${extra.what} (${extra.id})`, {}, extra.why || '');
      }
      continue;
    }
    byHand.push(extra);
  }

  // Unprobeable extras arrive as ONE finding, not one each. The EU profile
  // carries fourteen; fourteen separate minors saying "confirm this by hand" is
  // a wall of text people scroll past, and the gate that cries wolf is the gate
  // people learn to skip. One finding with the list inside it gets read.
  if (byHand.length) {
    const rated = byHand.filter((e) => e.severity === 'blocker' || e.severity === 'major');
    report.add('legal/local-rule', MINOR,
      `${byHand.length} local rule${byHand.length === 1 ? '' : 's'} in the ${profile?.id || 'current'} profile `
      + `${byHand.length === 1 ? 'has' : 'have'} no static check and must be confirmed by hand`
      + (rated.length ? ` — ${rated.length} of them the profile rates blocker or major` : ''),
      {},
      byHand.map((e) => `\n      · [${e.severity || 'minor'}] ${e.id} — ${e.what}`
        + (e.detect ? `\n        look for: ${e.detect}` : '')
        + (e.why ? `\n        why: ${e.why}` : '')).join('')
      + '\n\n      No static file can decide these. Stage 07 reads them back to the client, and a '
      + 'blocker-rated one that nobody has checked is the reason a launch waits.');
  }

  report.stats.nonEssentialScripts = nonEssential;
  report.stats.entityType = isLimited ? 'limited' : 'sole-trader-or-unknown';
  report.stats.jurisdiction = profile?.id || null;
  report.stats.jurisdictionProvenance = profile?.provenance?.status || null;
}

export default { gates, run };
