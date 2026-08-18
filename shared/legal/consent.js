/* Website-builder baseline consent manager (PECR reg.6 / UK GDPR consent standard).
 * Copied verbatim into every build's output/site/js/consent.js by stage 05 —
 * see ../legal/legal-pages.md. Rename the KEY constant per-site if two builds
 * could ever share a browser profile/origin; otherwise leave as-is.
 *
 * Hard-block contract: any non-essential script must ship inert as
 *   <script type="text/plain" data-consent="analytics|marketing" data-src="…">…</script>
 * and is only activated here after an explicit opt-in. No stored choice → nothing
 * runs and the banner shows. "Accept all" and "Reject non-essential" are equal-weight
 * buttons, nothing is pre-selected, and the footer's "Cookie preferences" button
 * reopens the banner so withdrawing consent is as easy as giving it.
 *
 * With JS off the banner stays hidden and gated scripts stay inert — the site is
 * compliant by construction, not by script.
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
