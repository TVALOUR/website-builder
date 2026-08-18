// website-builder — locale-shaped patterns, read from the profile.
//
// The profile has always CARRIED `locale.postcodePattern`, and the loader has
// always compiled it. Nothing read it. Meanwhile three gates hardcoded UK
// shapes:
//
//   facts/unsourced-phone     /(?:\+44|\b0)[\d\s()-]{8,16}\d/
//   facts/unsourced-address   /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/
//   integrity/tel-link        the same, plus .replace(/^\+?44/, '0')
//
// Outside the UK the first two silently never fired — so the repo's flagship
// promise, that no unsourced phone number ships, was OFF for the US, Canada,
// Australia and most of the EU. And `integrity/contact-route` went further than
// silence: it asserted "no phone number anywhere on the site" on a page whose
// first line was the number, because the number was not British.
//
// A gate that quietly stops checking is bad. A gate that states something false
// about the site is worse, and both came from the same three literals.

/** A permissive international fallback: E.164-ish, or a national grouping. */
const ANY_PHONE = /(?:\+\d{1,3}[\s.\-]?)?(?:\(\d{2,5}\)|\d{2,5})[\s.\-]?\d{3,4}[\s.\-]?\d{2,4}\b/g;

const compile = (v, flags) => {
  if (!v) return null;
  if (v instanceof RegExp) return flags && !v.flags.includes(flags) ? new RegExp(v.source, v.flags + flags) : v;
  const m = /^\/(.*)\/([gimsuy]*)$/s.exec(String(v).trim());
  try {
    return m ? new RegExp(m[1], flags ? [...new Set(m[2] + flags)].join('') : m[2]) : new RegExp(String(v), flags || '');
  } catch { return null; }
};

/**
 * Phone handling for the loaded jurisdiction.
 *
 * @returns {{re: RegExp, normalise(s): string, valid(s): boolean, describe: string}}
 */
export function phoneOf(profile) {
  const L = profile?.locale || {};
  const re = compile(L.phonePattern, 'g') || ANY_PHONE;
  const cc = String(L.phoneCountryCode || '').replace(/\D/g, '');
  const trunk = L.phoneNationalPrefix == null ? '' : String(L.phoneNationalPrefix);
  const nationalRe = compile(L.phoneNationalPattern);

  const normalise = (s) => {
    let d = String(s).replace(/[^\d+]/g, '');
    if (cc) {
      // +441271… and 001271… both mean the same national number as 01271….
      d = d.replace(new RegExp(`^(?:\\+|00)${cc}`), trunk);
      d = d.replace(new RegExp(`^\\+${cc}`), trunk);
      return d.replace(/^\+/, '');
    }
    // NO COUNTRY CODE STATED — the jurisdiction-neutral case.
    //
    // `+44 1271 860442` on the page and `01271 860 442` in the ledger are the
    // same number, and without knowing the country there is no way to say so by
    // rewriting the prefix. Comparing the last nine significant digits is how
    // you match a number written internationally against the same number
    // written nationally, in any country, without knowing which.
    //
    // Without this, `intl-baseline` reported a correctly-sourced phone number as
    // unsourced — a false BLOCKER produced purely by not knowing the dialling
    // plan, on the profile whose entire purpose is to be usable when you do not.
    d = d.replace(/^\+/, '').replace(/^00/, '');
    return d.length > 9 ? d.slice(-9) : d;
  };

  return {
    re,
    normalise,
    // Without a stated national shape, anything with enough digits counts. That
    // is deliberately loose: the alternative was a UK shape applied worldwide.
    valid: (s) => {
      const d = normalise(s);
      return nationalRe ? nationalRe.test(d) : /^\d{7,15}$/.test(d);
    },
    describe: L.phoneExample ? `like ${L.phoneExample}` : 'in the local format',
  };
}

/** The postcode / ZIP shape for the loaded jurisdiction, or null if unstated. */
export function postcodeOf(profile) {
  return compile(profile?.locale?.postcodePattern, 'g');
}

export { ANY_PHONE };
