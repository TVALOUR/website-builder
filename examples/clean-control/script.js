// Hartland Farriery — the whole of the site's JavaScript.
//
// One job: keep the copyright year honest. A hardcoded year is a small thing
// that quietly tells every visitor in January that nobody has looked at the
// site since last year.
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('year');
  if (el) el.textContent = String(new Date().getFullYear());
});
