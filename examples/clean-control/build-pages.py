#!/usr/bin/env python3
"""
Stamp the clean-control fixture's pages from one shared chrome.

This is a FIXTURE GENERATOR, not part of the product. It exists so the eight
pages cannot drift apart by hand-editing, which is exactly how a real site ends
up with the legal links on six pages out of nine. Run it, commit the output,
and the HTML in this folder stays plain static files with no build step.

    python examples/clean-control/build-pages.py
"""
import io
import os

HERE = os.path.dirname(os.path.abspath(__file__))

SITE = "https://hartlandfarriery.example"   # reserved .example TLD: never resolves,
                                            # never belongs to anyone, safe in a fixture
BIZ = "Hartland Farriery"
PHONE_DISPLAY = "01271 860 442"
PHONE_TEL = "01271860442"
EMAIL = "will@hartlandfarriery.example"
AREA = "North Devon"

NAV = [
    ("index.html", "Home"),
    ("services.html", "Shoeing"),
    ("about.html", "The forge"),
    ("contact.html", "Booking"),
]

LEGAL = [
    ("privacy.html", "Privacy"),
    ("cookies.html", "Cookies"),
    ("terms.html", "Terms"),
    ("accessibility.html", "Accessibility"),
]

JSONLD = """{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "%(site)s/#business",
  "name": "%(biz)s",
  "description": "Mobile farrier covering %(area)s. Hot and cold shoeing, remedial work and trims.",
  "url": "%(site)s/",
  "telephone": "+441271860442",
  "email": "%(email)s",
  "priceRange": "\\u00a3\\u00a3",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Barn 3, Kenwith Lane",
    "addressLocality": "Bideford",
    "addressRegion": "Devon",
    "postalCode": "EX39 3PH",
    "addressCountry": "GB"
  },
  "areaServed": [
    { "@type": "AdministrativeArea", "name": "North Devon" },
    { "@type": "AdministrativeArea", "name": "Torridge" }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "07:00",
      "closes": "17:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "13:00"
    }
  ]
}""" % {"site": SITE, "biz": BIZ, "area": AREA, "email": EMAIL}


def head(title, desc, path, jsonld=False):
    canon = SITE + "/" + ("" if path == "index.html" else path)
    parts = [
        '<!DOCTYPE html>',
        '<html lang="en-GB">',
        '<head>',
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title>%s</title>' % title,
        '<meta name="description" content="%s">' % desc,
        '<link rel="canonical" href="%s">' % canon,
        '<meta name="theme-color" content="#f4f1ea">',
        '<link rel="icon" href="favicon.svg" type="image/svg+xml">',
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="%s">' % BIZ,
        '<meta property="og:title" content="%s">' % title,
        '<meta property="og:description" content="%s">' % desc,
        '<meta property="og:url" content="%s">' % canon,
        '<meta property="og:image" content="%s/social-card.png">' % SITE,
        '<meta property="og:locale" content="en_GB">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<meta name="twitter:title" content="%s">' % title,
        '<meta name="twitter:description" content="%s">' % desc,
        '<meta name="twitter:image" content="%s/social-card.png">' % SITE,
        '<link rel="stylesheet" href="styles.css">',
    ]
    if jsonld:
        parts.append('<script type="application/ld+json">\n%s\n</script>' % JSONLD)
    parts.append('</head>')
    return "\n".join(parts)


def masthead(current):
    links = []
    for href, label in NAV:
        cur = ' aria-current="page"' if href == current else ''
        links.append('      <a href="%s"%s>%s</a>' % (href, cur, label))
    return """<body>
<a class="skip" href="#main">Skip to the main content</a>

<header class="masthead">
  <div class="shell masthead-inner">
    <a class="wordmark" href="index.html">Hartland <b>Farriery</b></a>
    <nav class="nav" aria-label="Main">
%s
    </nav>
  </div>
</header>

<main id="main">""" % "\n".join(links)


def footer():
    legal_links = " &middot; ".join(
        '<a href="%s">%s</a>' % (h, l) for h, l in LEGAL)
    return """</main>

<footer class="foot">
  <div class="shell">
    <div class="foot-grid">
      <div>
        <h2>Get hold of Will</h2>
        <ul>
          <li><a href="tel:%(tel)s">%(phone)s</a></li>
          <li><a href="mailto:%(email)s">%(email)s</a></li>
        </ul>
        <p>Phone is quicker. Most days it goes to voicemail until about five,
          and every message gets a call back the same evening.</p>
      </div>
      <div>
        <h2>Where he goes</h2>
        <ul>
          <li>Bideford, Torrington and Holsworthy</li>
          <li>Barnstaple and Braunton</li>
          <li>Hartland and Clovelly</li>
        </ul>
        <p>Anywhere in %(area)s. Further out is possible on a full day.</p>
      </div>
      <div>
        <h2>When</h2>
        <ul>
          <li>Monday to Friday, 7am to 5pm</li>
          <li>Saturday, 8am to 1pm</li>
          <li>Sunday, emergencies only</li>
        </ul>
        <p class="folio">Est. 2011 &middot; Reg. Farrier FRC 08812</p>
      </div>
    </div>
    <p class="legal-row">
      %(biz)s, Barn 3, Kenwith Lane, Bideford, Devon EX39 3PH.
      Registered with the Farriers Registration Council, number FRC 08812.
      &middot; %(legal)s
      &middot; <span id="year-holder">&copy; <span id="year">2026</span></span>
    </p>
  </div>
</footer>

<script src="script.js" defer></script>
</body>
</html>
""" % {"tel": PHONE_TEL, "phone": PHONE_DISPLAY, "email": EMAIL,
       "area": AREA, "biz": BIZ, "legal": legal_links}


def page(path, title, desc, main, jsonld=False):
    html = "\n".join([
        head(title, desc, path, jsonld),
        masthead(path),
        main.rstrip(),
        footer(),
    ])
    with io.open(os.path.join(HERE, path), "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    return path


# --------------------------------------------------------------------- pages

INDEX = """
<section class="hero">
  <div class="shell hero-grid">
    <div>
      <p class="folio">Mobile farrier &middot; North Devon &middot; since 2011</p>
      <h1>Shod properly, on the yard, on the day he said.</h1>
      <p class="lede">Will Prosser has shod horses across Torridge and North Devon
        for fourteen years. Hot shoeing, cold shoeing, remedial work and trims.
        One man, one van, no apprentice learning on your horse.</p>
      <div class="actions">
        <a class="btn" href="tel:%(tel)s">Call %(phone)s</a>
        <a class="btn-quiet" href="services.html">What it costs</a>
      </div>
    </div>
    <div class="rail">
      <dl>
        <div><dt>Full set, hot shod</dt><dd>&pound;95</dd></div>
        <div><dt>Front two</dt><dd>&pound;65</dd></div>
        <div><dt>Trim only</dt><dd>&pound;35</dd></div>
        <div><dt>Typical wait</dt><dd>8 to 10 days</dd></div>
        <div><dt>Covers</dt><dd>North Devon</dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="band">
  <div class="shell">
    <h2>What he does</h2>
    <ul class="entries">
      <li>
        <h3>Hot shoeing</h3>
        <p>Shoe shaped at the forge and fitted hot, so it sits to the foot rather
          than the foot being rasped to the shoe. Takes longer and it is worth it.</p>
        <span class="price">&pound;95 full set</span>
      </li>
      <li>
        <h3>Cold shoeing</h3>
        <p>Where hot work is not practical, on a yard with no safe space to set up.
          Same shoes, fitted cold.</p>
        <span class="price">&pound;85 full set</span>
      </li>
      <li>
        <h3>Trims</h3>
        <p>Barefoot maintenance on a six to eight week cycle. Field companions,
          retired horses, ponies out of work.</p>
        <span class="price">&pound;35</span>
      </li>
      <li>
        <h3>Remedial work</h3>
        <p>Bar shoes, heart bars, wedges and glue-ons, worked out with your vet.
          He will want to see the x-rays before he quotes.</p>
        <span class="price">Priced per case</span>
      </li>
    </ul>
  </div>
</section>

<section class="plate">
  <div class="shell">
    <h2>He turns up when he says he will.</h2>
    <p>That should not be the selling point for a trade, and on most yards in
      Devon it is. If Will is running late you get a text before he is late,
      not an hour after.</p>
    <p><a href="contact.html">How booking works</a></p>
  </div>
</section>

<section class="split">
  <div class="shell split-grid">
    <div>
      <h2>Fourteen years, one round.</h2>
    </div>
    <div>
      <p>Will trained at Hereford and Ludlow and has held his own round since 2011.
        Registered with the Farriers Registration Council under number FRC 08812,
        which you can check on their public register before you let anyone near
        your horse.</p>
      <p>He works alone. That means he is slower to fit in a new yard than a
        two-man outfit, and it means the person who shoes your horse in March is
        the person who shod it in January.</p>
      <p><a href="about.html">More about the forge</a></p>
    </div>
  </div>
</section>
"""

SERVICES = """
<section class="prose">
  <div class="shell">
    <h1>Shoeing and what it costs</h1>
    <p class="lede">Prices are for a straightforward horse on an accessible yard
      in North Devon. Nothing below is a quote for a difficult one, and Will
      would rather tell you that on the phone than surprise you on the day.</p>

    <div class="table-scroll">
      <table>
        <caption class="folio">Standard rates, reviewed January 2026</caption>
        <thead>
          <tr><th scope="col">Work</th><th scope="col">Price</th><th scope="col">Roughly how long</th></tr>
        </thead>
        <tbody>
          <tr><td>Full set, hot shod</td><td>&pound;95</td><td>75 to 90 minutes</td></tr>
          <tr><td>Full set, cold shod</td><td>&pound;85</td><td>60 minutes</td></tr>
          <tr><td>Front two</td><td>&pound;65</td><td>45 minutes</td></tr>
          <tr><td>Trim only</td><td>&pound;35</td><td>25 minutes</td></tr>
          <tr><td>Remedial and surgical</td><td>Priced per case</td><td>Varies</td></tr>
        </tbody>
      </table>
    </div>

    <h2>What is not in the price</h2>
    <ul>
      <li>A call-out on its own, without shoeing, is &pound;40.</li>
      <li>Studs, road nails and pads are charged at what they cost him.</li>
      <li>Yards more than 25 miles from Bideford carry a mileage charge, agreed
        before he sets off, never after.</li>
    </ul>

    <h2>How often</h2>
    <p>Most horses in regular work want doing every six to eight weeks. Leave it
      longer and the foot grows forward, the shoe moves back, and you spend the
      next two cycles getting it right again. Will will tell you when he thinks
      you are stretching it.</p>

    <h2>The awkward ones</h2>
    <p>Young horses, horses that have had a bad time with a farrier before, and
      horses that will not stand: he will take them, and the first visit may be
      nothing but picking up feet and putting them down again. That visit is
      charged at the trim rate whether or not a shoe goes on.</p>

    <h2>Vets</h2>
    <p>For remedial work he wants to talk to your vet directly and see any
      radiographs before quoting. Shoeing to a diagnosis he has not seen is how
      horses get hurt.</p>

    <div class="actions">
      <a class="btn" href="tel:%(tel)s">Call %(phone)s</a>
      <a class="btn-quiet" href="contact.html">Booking and cancellations</a>
    </div>
  </div>
</section>
"""

ABOUT = """
<section class="prose">
  <div class="shell">
    <h1>The forge</h1>
    <p class="lede">A barn at Kenwith, a gas forge, an anvil that came off a farm
      sale in 2009, and a van that spends most of its week between Hartland and
      Holsworthy.</p>

    <h2>Will Prosser</h2>
    <p>Trained at Hereford and Ludlow College, qualified in 2011, registered with
      the Farriers Registration Council as FRC 08812. In the United Kingdom it is
      a criminal offence to shoe a horse without that registration, so it is
      worth checking the number of anyone who quotes you, including this one.</p>
    <p>Before farriery he spent six years on a dairy unit at Alverdiscott, which
      is where he learned that the animal decides how the day goes and you fit
      around it.</p>

    <h2>How he works</h2>
    <p>One man. No apprentice, no second van, no subcontracting your horse to
      somebody you have not met. It caps how many yards he can hold, which is why
      new clients usually wait a week or two for the first visit and then settle
      into a slot.</p>
    <p>He shoes hot wherever the yard allows it. Hot fitting lets the shoe be
      shaped to the foot in front of you rather than the foot being taken back to
      meet a shoe that came out of a box. On a yard with no safe space for a
      forge he shoes cold and says so.</p>

    <h2>What he will not do</h2>
    <ul>
      <li>Shoe a horse he thinks is unsafe to shoe that day.</li>
      <li>Work to a remedial prescription he has not discussed with the vet.</li>
      <li>Quote for a horse over the phone that he has not seen.</li>
    </ul>

    <h2>Insurance</h2>
    <p>Public liability cover is held through the Worshipful Company of Farriers
      scheme. A certificate is available on request and yards that need one for
      their own policy usually ask at the first visit.</p>
  </div>
</section>
"""

CONTACT = """
<section class="prose">
  <div class="shell">
    <h1>Booking</h1>
    <p class="lede">Phone is the fastest way. Will is under a horse for most of
      the day, so expect voicemail and a call back that evening rather than an
      instant answer.</p>

    <div class="actions">
      <a class="btn" href="tel:%(tel)s">Call %(phone)s</a>
      <a class="btn-quiet" href="mailto:%(email)s">Email instead</a>
    </div>

    <h2>What to have ready</h2>
    <ul>
      <li>Where the yard is, and whether there is hard standing under cover.</li>
      <li>How many horses and what each one needs.</li>
      <li>When they were last done, and by whom if you know.</li>
      <li>Anything he should know before he picks up a foot.</li>
    </ul>

    <h2>Getting into the round</h2>
    <p>New yards usually wait eight to ten days for a first visit. After that
      Will books the next appointment before he leaves, on the cycle that suits
      the horse, so you are not chasing him every six weeks.</p>

    <h2>Cancellations</h2>
    <p>Twenty four hours notice and there is no charge. Less than that, or a
      horse that is not caught and ready when he arrives, and he charges the
      call-out rate of &pound;40. He does not enjoy this rule either. A wasted
      slot is an hour he cannot give to anyone else that week.</p>

    <h2>Emergencies</h2>
    <p>A lost shoe on a Sunday is not an emergency and will keep until Monday.
      A horse that is lame, has a shoe twisted under the foot, or has stood on a
      nail, is. Call the same number and keep calling.</p>

    <h2>Where he covers</h2>
    <p>Bideford, Torrington, Holsworthy, Barnstaple, Braunton, Hartland and
      Clovelly, and the yards between them. Beyond 25 miles from Bideford there
      is a mileage charge, quoted before he agrees the visit.</p>

    <h2>The forge</h2>
    <p>Barn 3, Kenwith Lane, Bideford, Devon EX39 3PH. It is a working forge and
      not a shop. Please ring before coming down.</p>
  </div>
</section>
"""

# --------------------------------------------------------------------- legal

LEGAL_INTRO = """
<section class="prose">
  <div class="shell">
    <p class="folio">Last reviewed 14 January 2026</p>
    <h1>%s</h1>
"""

PRIVACY = LEGAL_INTRO % "Privacy notice" + """
    <p class="lede">This is a five page website with no shop, no accounts and no
      tracking. It collects nothing about you automatically. This notice explains
      the little it does collect when you get in touch.</p>

    <h2>Who we are</h2>
    <p>Hartland Farriery, Barn 3, Kenwith Lane, Bideford, Devon EX39 3PH. The
      data controller is Will Prosser. Contact him at
      <a href="mailto:%(email)s">%(email)s</a> or on
      <a href="tel:%(tel)s">%(phone)s</a>.</p>

    <h2>What data we collect and why</h2>
    <p>If you telephone, we keep your number, your name, your yard address and
      notes about your horses, because we cannot run a shoeing round without
      them. If you email, we keep the email.</p>
    <p>This website has no contact form, no analytics, no advertising pixels and
      no third party embeds. Visiting it puts nothing on your device beyond what
      your own browser caches.</p>

    <h2>Legal basis</h2>
    <p>Contract, for the details needed to carry out shoeing you have asked for.
      Legitimate interest, for keeping a client and horse record between visits
      so we are not starting from nothing each time.</p>

    <h2>How long we keep it</h2>
    <p>Client and horse records are kept for seven years after the last visit,
      which matches how long we must keep the accounts they relate to. After that
      they are deleted.</p>

    <h2>Who we share it with</h2>
    <p>No third parties, other than our accountant for invoices, and your vet
      where you have asked us to work with them on a remedial case.</p>

    <h2>Your rights</h2>
    <p>You can ask for a copy of what we hold, ask us to correct it, ask us to
      delete it, or object to us holding it. Email
      <a href="mailto:%(email)s">%(email)s</a> and you will get an answer within
      thirty days.</p>
    <p>If you are not happy with how we have handled it you can complain to the
      Information Commissioner's Office at ico.org.uk or on
      <a href="tel:03031231113">0303 123 1113</a>.</p>

    <h2>Cookies</h2>
    <p>See the <a href="cookies.html">cookie notice</a>. The short version is
      that this site sets none.</p>

    <h2>Changes</h2>
    <p>If this notice changes, the date at the top changes with it.</p>
  </div>
</section>
"""

COOKIES = LEGAL_INTRO % "Cookies" + """
    <p class="lede">This website sets no cookies at all. There is no banner
      because there is nothing to consent to.</p>

    <h2>What a cookie is</h2>
    <p>A small file a website asks your browser to keep, so it can recognise you
      on the next page or the next visit. Some are necessary to make a site work.
      Most are for measuring visitors or for advertising.</p>

    <h2>Essential cookies</h2>
    <p>None. This site has no login, no basket and no consent state to remember,
      so it needs none.</p>

    <h2>Non-essential cookies</h2>
    <p>None. There is no analytics, no advertising pixel, no embedded video, no
      embedded map and no web font loaded from someone else's server. Nothing on
      these pages reports your visit to anyone.</p>

    <h2>How to withdraw consent</h2>
    <p>There is no consent to withdraw. If that ever changes, a banner will
      appear before anything non-essential runs, refusing will be exactly as easy
      as accepting, and this page will list what has been added.</p>

    <h2>Your browser</h2>
    <p>Your browser may still cache the stylesheet and images so the site loads
      faster next time. That is your browser's own storage, not a cookie, and
      clearing your history clears it.</p>
  </div>
</section>
"""

TERMS = LEGAL_INTRO % "Terms of use" + """
    <p class="lede">The terms for using this website. Terms for the shoeing
      itself are agreed with you directly, not here.</p>

    <h2>Who this site belongs to</h2>
    <p>Hartland Farriery, Barn 3, Kenwith Lane, Bideford, Devon EX39 3PH,
      registered with the Farriers Registration Council under FRC 08812.</p>

    <h2>Using the site</h2>
    <p>You are welcome to read it, print it and link to it. Please do not scrape
      it, copy the text onto another farrier's website, or use the contact
      details for marketing.</p>

    <h2>The information here</h2>
    <p>Prices and waiting times are current as at the date at the top of the page
      and are for a straightforward horse on an accessible yard. They are not a
      quote. Nothing on this website is veterinary advice, and nothing here
      replaces your vet.</p>

    <h2>Liability</h2>
    <p>The site is provided as it is. We do not accept liability for loss arising
      from relying on general information published here rather than asking. This
      does not limit liability for death or personal injury caused by negligence,
      or anything else that cannot lawfully be limited.</p>

    <h2>Governing law</h2>
    <p>These terms are governed by the law of England and Wales.</p>

    <h2>Complaints</h2>
    <p>Email <a href="mailto:%(email)s">%(email)s</a>. Complaints about the
      farriery itself can also go to the Farriers Registration Council.</p>
  </div>
</section>
"""

ACCESS = LEGAL_INTRO % "Accessibility" + """
    <p class="lede">This site should work for everyone, including people using a
      screen reader, a keyboard on its own, or a phone in bright sunlight in a
      field. Here is where it stands, honestly.</p>

    <h2>The standard we aim at</h2>
    <p>WCAG 2.2 level AA.</p>

    <h2>What has been done</h2>
    <ul>
      <li>Every page has one h1 and headings that step down in order.</li>
      <li>Body text is at least 4.5 to 1 against its background, and large text
        at least 3 to 1. The palette was checked, not eyeballed.</li>
      <li>Everything works from the keyboard, and the focus outline is visible
        rather than removed for tidiness.</li>
      <li>A skip link is the first thing you reach.</li>
      <li>Landmarks are real: header, nav, main and footer.</li>
      <li>Text reflows to a phone at 320 pixels wide with no sideways scrolling,
        and to 400 percent zoom.</li>
      <li>Nothing moves, flashes or plays on its own.</li>
      <li>There is a print stylesheet, because people pin the price list up.</li>
    </ul>

    <h2>Known limitations</h2>
    <ul>
      <li>The site has not yet been tested end to end with NVDA or VoiceOver by
        somebody who uses one daily. Automated checks are not the same thing, and
        we are not going to claim they are.</li>
      <li>The price table scrolls sideways inside its own box on a narrow phone.
        It is reachable and readable, but it is not the nicest way to read a
        table.</li>
    </ul>

    <h2>Telling us about a problem</h2>
    <p>Email <a href="mailto:%(email)s">%(email)s</a> or ring
      <a href="tel:%(tel)s">%(phone)s</a> and say what would not work and what
      you were using. It gets fixed and this page gets updated.</p>
  </div>
</section>
"""

NOTFOUND = """
<section class="prose">
  <div class="shell">
    <p class="folio">Error 404</p>
    <h1>That page is not here.</h1>
    <p class="lede">It may have been renamed, or the link that sent you here may
      have a typo in it. Nothing is broken at your end.</p>
    <ul>
      <li><a href="index.html">Back to the front page</a></li>
      <li><a href="services.html">Shoeing and prices</a></li>
      <li><a href="contact.html">Booking</a></li>
    </ul>
    <p>If you were looking for something specific, ring
      <a href="tel:%(tel)s">%(phone)s</a> and Will will tell you where it went.</p>
  </div>
</section>
"""

SUB = {"tel": PHONE_TEL, "phone": PHONE_DISPLAY, "email": EMAIL}

written = [
    page("index.html", "Hartland Farriery | Mobile farrier, North Devon",
         "Mobile farrier covering North Devon since 2011. Hot and cold shoeing, "
         "remedial work and trims. Full set from 95 pounds. Call 01271 860 442.",
         INDEX % SUB, jsonld=True),
    page("services.html", "Shoeing and prices | Hartland Farriery",
         "Hot shoeing 95 pounds, cold shoeing 85 pounds, front two 65 pounds, "
         "trims 35 pounds. What is included, what is not, and how often a horse needs doing.",
         SERVICES % SUB),
    page("about.html", "The forge | Hartland Farriery",
         "Will Prosser, registered farrier FRC 08812, working out of Kenwith Lane "
         "near Bideford since 2011. One man, one van, hot shod where the yard allows it.",
         ABOUT),
    page("contact.html", "Booking | Hartland Farriery",
         "How to book a farrier in North Devon: what to have ready, how long the "
         "wait is, the cancellation rule, and what counts as an emergency.",
         CONTACT % SUB),
    page("privacy.html", "Privacy notice | Hartland Farriery",
         "What Hartland Farriery collects when you get in touch, why, how long it "
         "is kept and how to ask for it. No analytics, no tracking, no third parties.",
         PRIVACY % SUB),
    page("cookies.html", "Cookies | Hartland Farriery",
         "This website sets no cookies. No analytics, no advertising pixels, no "
         "embedded fonts or maps. There is no banner because there is nothing to consent to.",
         COOKIES),
    page("terms.html", "Terms of use | Hartland Farriery",
         "Terms for using the Hartland Farriery website: what the prices mean, "
         "what the information is and is not, and the governing law.",
         TERMS % SUB),
    page("accessibility.html", "Accessibility | Hartland Farriery",
         "Where this site stands against WCAG 2.2 AA, what has been done, the two "
         "known limitations we have not fixed, and how to report a problem.",
         ACCESS % SUB),
    page("404.html", "Page not found | Hartland Farriery",
         "That page is not here. Links back to the front page, the price list and booking.",
         NOTFOUND % SUB),
]

print("wrote %d pages: %s" % (len(written), ", ".join(written)))
