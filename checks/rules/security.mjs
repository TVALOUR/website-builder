// website-builder — security and privacy gates for a static front end.
//
// "It's just a static site, there's nothing to hack" is mostly true and
// entirely beside the point. The realistic harms here are: a secret committed
// into client-side JS, a third-party script that can change under you, a form
// service quietly processing customer data with no agreement in place, and a
// domain whose email can be spoofed because nobody set up SPF. None of those
// need a database to hurt someone.
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
import { tags, attr, hasAttr } from '../lib/html.mjs';
import { BLOCKER, MAJOR, MINOR } from '../lib/report.mjs';
import { join } from 'node:path';

export const gates = [
  { id: 'security/secret-in-client', severity: 'blocker', what: 'an API key, token or password in shipped client-side code' },
  { id: 'security/env-file-shipped', severity: 'blocker', what: '.env, .git, source maps or backup files in the build output' },
  { id: 'security/no-headers', severity: 'major', what: 'no security-headers file for the host' },
  { id: 'security/csp', severity: 'minor', what: 'no Content-Security-Policy' },
  { id: 'security/sri', severity: 'major', what: 'a third-party script with no integrity hash' },
  { id: 'security/form-destination', severity: 'major', what: 'where form data physically goes, and whether that is documented' },
  { id: 'security/http-link', severity: 'minor', what: 'plain-http links to external sites' },
  { id: 'security/inline-event-handlers', severity: 'minor', what: 'onclick= attributes, which make a real CSP impossible' },
];

// Deliberately high-signal. A generic /[A-Za-z0-9]{32}/ would fire on every
// hash, cache-buster and minified identifier on the site.
const SECRETS = [
  [/\bsk_live_[A-Za-z0-9]{10,}/, 'Stripe live secret key'],
  [/\bsk_test_[A-Za-z0-9]{10,}/, 'Stripe test secret key'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Google API key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key id'],
  [/\bghp_[A-Za-z0-9]{36}\b/, 'GitHub personal access token'],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/\bre_[A-Za-z0-9]{16,}/, 'Resend API key'],
  [/\bSG\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/, 'SendGrid API key'],
  [/-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'a private key'],
  [/["'](?:api[_-]?key|apikey|secret|password|passwd|auth[_-]?token)["']\s*[:=]\s*["'][^"'\s]{12,}["']/i,
    'a hardcoded credential'],
];

const FORM_SERVICES = [
  [/formspree\.io/i, 'Formspree'],
  [/api\.web3forms\.com/i, 'Web3Forms'],
  [/usebasin\.com/i, 'Basin'],
  [/formsubmit\.co/i, 'FormSubmit'],
  [/getform\.io/i, 'Getform'],
  [/staticforms\.xyz/i, 'StaticForms'],
  [/netlify/i, 'Netlify Forms'],
  [/formcarry\.com/i, 'Formcarry'],
];

const LEAKY_FILES = /(^|[\\/])(\.env(\..*)?|\.git[\\/]|\.DS_Store|Thumbs\.db|.*\.bak|.*\.old|.*\.orig|.*~|.*\.map|npm-debug\.log|\.htpasswd|.*\.sql|.*\.zip)$/i;

export async function run(ctx, report) {
  const { siteDir, htmlFiles, jsFiles, cssFiles, everyFile } = ctx;
  for (const id of gates.map((g) => g.id)) report.ranGate(id);

  // ----------------------------------------------------------- secrets
  for (const file of [...htmlFiles, ...jsFiles]) {
    const raw = read(file);
    for (const [re, label] of SECRETS) {
      const m = re.exec(raw);
      if (m) {
        report.add('security/secret-in-client', BLOCKER,
          `${label} in shipped client-side code`,
          { file: displayPath(file, siteDir) },
          'Anything in the browser bundle is public — "minified" is not "hidden". Rotate this key NOW, then move the call behind a serverless function or a service that issues publishable keys.');
        break;
      }
    }
  }

  // ----------------------------------------------------------- leaky files
  for (const f of everyFile) {
    if (LEAKY_FILES.test(f)) {
      const rel = displayPath(f, siteDir);
      const sev = /\.map$/i.test(rel) ? MINOR : BLOCKER;
      report.add('security/env-file-shipped', sev, `${rel} is in the deploy directory`,
        { file: rel },
        sev === BLOCKER
          ? 'Static hosts serve whatever is in the folder. Delete it and add it to .gitignore — then assume anything it contained is compromised.'
          : 'Source maps expose your original source. Harmless for a brochure site, untidy for a client deliverable.');
    }
  }

  // ----------------------------------------------------------- headers
  const headerFiles = ['_headers', 'netlify.toml', 'vercel.json', 'staticwebapp.config.json', '.htaccess', 'public/_headers'];
  const hasHeaders = headerFiles.some((h) => exists(join(siteDir, h)));
  if (!hasHeaders) {
    report.add('security/no-headers', MAJOR, 'no security-headers file for the host', {},
      'Add a `_headers` file (Cloudflare Pages / Netlify) with X-Content-Type-Options: nosniff, Referrer-Policy: strict-origin-when-cross-origin, X-Frame-Options: SAMEORIGIN and Strict-Transport-Security. Template in templates/site/_headers. It is four lines and it is the whole of what a static site can do here.');
  } else {
    const headerText = headerFiles.map((h) => read(join(siteDir, h))).join('\n');
    if (!/content-security-policy/i.test(headerText)) {
      report.add('security/csp', MINOR, 'no Content-Security-Policy', {},
        'Worth adding once the inline scripts are gone. A CSP on a site full of inline handlers needs unsafe-inline, which defeats the point — fix the handlers first.');
    }
  }

  // ----------------------------------------------------------- SRI + inline
  const seen = new Set();
  let inlineHandlers = 0;
  for (const file of htmlFiles) {
    const raw = read(file);
    for (const t of tags(raw, 'script')) {
      const src = attr(t.raw, 'src') || '';
      if (!/^https?:\/\//i.test(src) || seen.has(src)) continue;
      seen.add(src);
      if (!hasAttr(t.raw, 'integrity')) {
        report.add('security/sri', MAJOR, `third-party script with no integrity hash: ${src.slice(0, 60)}`,
          { file: displayPath(file, siteDir), line: t.line },
          'Whoever controls that URL controls this page. Add an SRI hash, or self-host the file. In June 2024 polyfill.io — a script trusted on ~100,000 sites — was bought and turned into a malware delivery network overnight.');
      }
    }
    inlineHandlers += (raw.match(/\son(click|load|error|submit|change|mouseover)\s*=/gi) || []).length;
  }
  if (inlineHandlers > 4) {
    report.add('security/inline-event-handlers', MINOR,
      `${inlineHandlers} inline event handler attributes`,
      { count: inlineHandlers },
      'Move them into the JS file with addEventListener. Inline handlers force any CSP to allow unsafe-inline, which is most of a CSP\'s value gone.');
  }

  // ----------------------------------------------------------- forms
  const allText = [...htmlFiles, ...jsFiles].map(read).join('\n');
  for (const [re, name] of FORM_SERVICES) {
    if (!re.test(allText)) continue;
    report.add('security/form-destination', MAJOR,
      `enquiries are processed by ${name}`,
      {},
      `${name} is a data processor handling your client's customers' personal data. In most privacy regimes that makes them a processor and needs a written data-processing agreement (UK/EU GDPR Art.28 is the strictest version; check what your jurisdiction calls it), and the privacy policy must say the data goes there and roughly where it is stored. Check they publish a DPA, and name them in the policy. Also: send one real test submission and confirm it lands in the owner's inbox — silent failure is the norm when a key is wrong.`);
    break;
  }

  // ----------------------------------------------------------- http links
  for (const file of htmlFiles) {
    const raw = read(file);
    const httpLinks = [...raw.matchAll(/href\s*=\s*["'](http:\/\/[^"']+)["']/gi)]
      .filter((m) => !/localhost|127\.0\.0\.1|w3\.org|schema\.org|purl\.org/i.test(m[1]));
    if (httpLinks.length) {
      report.add('security/http-link', MINOR,
        `${httpLinks.length} plain-http external link${httpLinks.length === 1 ? '' : 's'} (e.g. ${httpLinks[0][1].slice(0, 45)})`,
        { file: displayPath(file, siteDir), count: httpLinks.length },
        'Use https. Most of these sites already redirect, and the ones that do not are worth linking to less.');
      break;
    }
  }
}

export default { gates, run };
