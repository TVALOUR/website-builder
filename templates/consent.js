/* sitewright — front-end-only consent manager (PECR reg.6 / UK GDPR consent standard).
 *
 * PROVENANCE: ported from the website-builder workspace this repo descends from,
 * where it ran on real client sites. Behaviour unchanged.
 *
 * SHIP THIS ONLY IF SOMETHING ACTUALLY NEEDS CONSENT. A banner on a site that
 * sets no non-essential cookies is a dark pattern: it costs every visitor a
 * click and buys nothing. If the site loads no analytics, no pixels, no embedded
 * video and no third-party fonts, say so in the cookie policy and ship no banner.
 * The gate agrees: it only requires a consent mechanism when it finds something
 * that needs one.
 *
 * THE HARD-BLOCK CONTRACT. Every non-essential script ships inert:
 *   <script type="text/plain" data-consent="analytics|marketing" data-src="..."></script>
 * and is activated here only after an explicit opt-in. No stored choice means
 * nothing runs and the banner shows. A banner that appears while the tag has
 * already fired is decoration, and it is the most common way this is got wrong.
 *
 * "Accept all" and "Reject non-essential" are equal-weight buttons, nothing is
 * pre-selected, and the footer's "Cookie preferences" control reopens the banner
 * so withdrawing consent is exactly as easy as giving it. That parity is what
 * the ICO actually writes to people about.
 *
 * With JavaScript off, the banner stays hidden and the gated scripts stay inert.
 * The site is compliant by construction rather than by script.
 *
 * Rename KEY per site if two builds could share an origin. Bump VERSION whenever
 * the site's storage use changes, so visitors are asked again.
 */
(function () {
  "use strict";

  var KEY = "site-consent";
  var VERSION = 1; // bump whenever the site's cookie/storage use changes → visitors are re-asked
  var CATEGORIES = ["analytics", "marketing"];

  function readConsent() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== VERSION) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(granted) {
    var record = { version: VERSION, date: new Date().toISOString() };
    CATEGORIES.forEach(function (cat) { record[cat] = !!granted; });
    try {
      localStorage.setItem(KEY, JSON.stringify(record));
    } catch (e) { /* storage unavailable — the banner simply re-shows next visit */ }
    return record;
  }

  function activateScripts(record) {
    CATEGORIES.forEach(function (cat) {
      if (!record[cat]) return;
      var stubs = document.querySelectorAll('script[type="text/plain"][data-consent="' + cat + '"]');
      Array.prototype.forEach.call(stubs, function (stub) {
        if (stub.hasAttribute("data-consent-activated")) return;
        stub.setAttribute("data-consent-activated", "true");
        var live = document.createElement("script");
        var src = stub.getAttribute("data-src");
        if (src) {
          live.src = src;
          live.async = true;
        } else {
          live.text = stub.text;
        }
        stub.parentNode.insertBefore(live, stub.nextSibling);
      });
    });
  }

  var banner = document.querySelector("[data-consent-banner]");
  if (!banner) return;

  var acceptBtn = banner.querySelector("[data-consent-accept]");
  var rejectBtn = banner.querySelector("[data-consent-reject]");

  function anyGranted(record) {
    return CATEGORIES.some(function (cat) { return record && record[cat]; });
  }

  function choose(granted) {
    var previous = readConsent();
    var record = saveConsent(granted);
    banner.hidden = true;
    if (!granted && anyGranted(previous)) {
      // withdrawal: already-activated scripts can't be un-run — reload to a clean state
      window.location.reload();
      return;
    }
    activateScripts(record);
  }

  if (acceptBtn) acceptBtn.addEventListener("click", function () { choose(true); });
  if (rejectBtn) rejectBtn.addEventListener("click", function () { choose(false); });

  // footer "Cookie preferences" — hidden without JS (it couldn't do anything), revealed here
  Array.prototype.forEach.call(document.querySelectorAll("[data-consent-open]"), function (btn) {
    btn.hidden = false;
    btn.addEventListener("click", function () {
      banner.hidden = false;
      if (acceptBtn) acceptBtn.focus();
    });
  });

  var existing = readConsent();
  if (existing) {
    activateScripts(existing);
  } else {
    banner.hidden = false;
  }
})();
