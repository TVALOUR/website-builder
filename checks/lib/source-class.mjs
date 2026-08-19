// website-builder — what KIND of source a citation is, decided by its publisher.
//
// WHY THIS FILE EXISTS.
//
// A profile that says `status: 'researched'` is making a claim about how it was
// made. The claim was unfalsifiable: two shipped profiles were roughly 60%
// law-firm marketing under the same label as one that was 90% legislation, and
// the report said the same sentence about both.
//
// Adding a `class` field to each citation only moves the problem if the author
// picks the label. So the label is NOT self-certified: it is a function of the
// host, and `checks/citations.mjs` re-derives it and fails when a row disagrees
// with its own URL. Calling a law-firm bulletin `primary` is then a check
// failure, not a judgement call.
//
// A host nobody has classified is a BLOCKER, not a shrug. Add it here, in the
// same commit as the citation, with the reason in the review.
//
// THE LADDER, most authoritative first:
//
//   primary        the body that ENACTS or PUBLISHES the instrument, publishing
//                  its own text. legislation.gov.uk for a UK SI; eur-lex for a
//                  Regulation; laws-lois.justice.gc.ca for a federal Act.
//                  Also the standards body for its own standard (W3C/WCAG).
//   primary-mirror the instrument's verbatim text, hosted by an authoritative
//                  repository that did not enact it — Cornell LII, CanLII,
//                  AustLII, Justia, FindLaw, public.law. The words are the
//                  law's; the publisher is not the legislature. Good enough to
//                  quote, one rung below the official consolidation, and it can
//                  lag an amendment — which is exactly how a repealed phrase
//                  survived in this repo's Canadian profile.
//   regulator      the enforcing authority's own guidance or decision: ICO,
//                  OPC, OAIC, ACCC, FTC, EDPB, CNIL, Competition Bureau. Not
//                  the law, but the reading the body that enforces it publishes.
//   court          a judgment.
//   secondary      everyone else: law-firm client alerts, trade press, vendor
//                  blogs, encyclopaedias. Frequently correct, frequently a
//                  year stale, and written to sell something often enough that
//                  it must be visible in the count.
//
// `secondary` is not banned. Some things — commencement timetables, "has the
// Bill been introduced yet" — genuinely have no primary source, and pretending
// otherwise would be worse. What is banned is a BLOCKER-severity legal claim
// resting on `secondary` alone, and a count nobody can reproduce.

/** The classes a citation may declare, in descending authority. */
export const CLASSES = ['primary', 'primary-mirror', 'regulator', 'court', 'secondary'];

/**
 * Classes that count as "the law's own words, or the enforcer's own reading".
 * The report's primary-source rate is measured against this set, and a
 * BLOCKER-severity legal claim needs at least one citation inside it.
 */
export const LOAD_BEARING = new Set(['primary', 'primary-mirror', 'regulator', 'court']);

// ---------------------------------------------------------------- host map
//
// Keyed on hostname with the leading `www.`/`wwwN.` stripped. A `*.` prefix
// matches any subdomain. Order does not matter; the longest match wins.

const HOSTS = {
  // ---- primary: the enacting or publishing body, publishing its own text
  'legislation.gov.uk': 'primary',
  'legislation.gov.au': 'primary',
  'laws-lois.justice.gc.ca': 'primary',
  'legisquebec.gouv.qc.ca': 'primary',
  'ontario.ca': 'primary',                    // e-Laws, Ontario's official consolidation
  'eur-lex.europa.eu': 'primary',
  'europarl.europa.eu': 'primary',            // the Parliament's own legislative record
  'govinfo.gov': 'primary',                   // the Federal Register / US Code, official
  'leginfo.legislature.ca.gov': 'primary',
  'delcode.delaware.gov': 'primary',
  'leg.state.fl.us': 'primary',
  'flsenate.gov': 'primary',
  'gesetze-im-internet.de': 'primary',        // the German federal justice ministry
  'boe.es': 'primary',                        // Boletín Oficial del Estado
  'w3.org': 'primary',                        // the standards body, for its own standard
  'nanpa.com': 'primary',                     // the numbering plan administrator, for the plan
  'docs.fcc.gov': 'primary',                  // an FCC order, published by the FCC
  'whitehouse.gov': 'primary',                // an OMB memorandum, published by OMB

  // ---- primary-mirror: the instrument's words, hosted by a repository
  'law.cornell.edu': 'primary-mirror',
  'canlii.org': 'primary-mirror',
  'austlii.edu.au': 'primary-mirror',
  '*.austlii.edu.au': 'primary-mirror',
  'law.justia.com': 'primary-mirror',
  'codes.findlaw.com': 'primary-mirror',
  'public.law': 'primary-mirror',
  '*.public.law': 'primary-mirror',
  'gdpr-info.eu': 'primary-mirror',

  // ---- regulator: the enforcing authority's own guidance or decisions
  'ico.org.uk': 'regulator',
  'ofcom.org.uk': 'regulator',                // the numbering authority, for the plan
  'priv.gc.ca': 'regulator',
  'competition-bureau.canada.ca': 'regulator',
  'ised-isde.canada.ca': 'regulator',
  'oaic.gov.au': 'regulator',
  'accc.gov.au': 'regulator',
  'acma.gov.au': 'regulator',                 // the numbering-plan authority, for the plan
  'donotcall.gov.au': 'regulator',
  'asic.gov.au': 'regulator',
  'ftc.gov': 'regulator',
  'ada.gov': 'regulator',
  'cppa.ca.gov': 'regulator',
  'fdic.gov': 'regulator',
  'edpb.europa.eu': 'regulator',
  'cnil.fr': 'regulator',
  'aepd.es': 'regulator',
  'garanteprivacy.it': 'regulator',
  'bundesnetzagentur.de': 'regulator',

  // ---- court
  'curia.europa.eu': 'court',

  // ---- secondary: law firms, trade press, vendors, encyclopaedias.
  // Listed explicitly rather than defaulted, so that an UNKNOWN host is a
  // finding instead of quietly becoming "secondary" and looking considered.
  'ashurst.com': 'secondary',
  'corrs.com.au': 'secondary',
  'jws.com.au': 'secondary',
  'sprintlaw.com.au': 'secondary',
  'lawpath.com.au': 'secondary',
  'biztechlawyers.com': 'secondary',
  'iconagency.com.au': 'secondary',
  'ecawa.org.au': 'secondary',
  'blg.com': 'secondary',
  'bclplaw.com': 'secondary',
  'mccarthy.ca': 'secondary',
  'gowlingwlg.com': 'secondary',
  'osler.com': 'secondary',
  'mannlawyers.com': 'secondary',
  'ehlaw.ca': 'secondary',
  'allyant.com': 'secondary',
  'ipvancouverblog.com': 'secondary',
  'weglot.com': 'secondary',
  'help.klaviyo.com': 'secondary',
  'iapp.org': 'secondary',
  'dlapiper.com': 'secondary',
  'hklaw.com': 'secondary',
  'troutman.com': 'secondary',
  'lflegal.com': 'secondary',
  'accessibility.works': 'secondary',
  'recordinglaw.com': 'secondary',
  'consumerfinancialserviceslawmonitor.com': 'secondary',
  'en.wikipedia.org': 'secondary',
};

/**
 * The class a URL's publisher earns, or null if nobody has classified the host.
 * @param {string} url
 * @returns {string|null}
 */
export function classForUrl(url) {
  let host;
  try { host = new URL(url).hostname.toLowerCase(); } catch { return null; }
  // `\d*`, not `\d?`. The one-digit version handled www2. and left www123.
  // unclassified — which is a BLOCKER, so it fails safe, but it fails on a host
  // that is plainly the same publisher. Found by a cross-model pass.
  host = host.replace(/^www\d*\./, '');
  if (HOSTS[host]) return HOSTS[host];
  // `*.example.com` matches any subdomain of example.com.
  const parts = host.split('.');
  for (let i = 1; i < parts.length - 1; i += 1) {
    const wild = `*.${parts.slice(i).join('.')}`;
    if (HOSTS[wild]) return HOSTS[wild];
  }
  return null;
}

/** Every host this file knows, for the selftest and for `citations.mjs --hosts`. */
export function knownHosts() {
  return Object.keys(HOSTS).sort();
}
