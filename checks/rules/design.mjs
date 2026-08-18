// website-builder — design gates: does it look made, or generated?
//
// PROVENANCE: the mechanically-checkable subset here descends from the
// anti-slop gate script in an earlier private system by Tom MacKellar, which in
// turn distils the `hallmark` skill's slop test and Anthropic's frontend-design
// guidance. Ported, deduplicated against the a11y and responsive families, and
// extended.
//
// WHAT THIS FAMILY HONESTLY CANNOT DO. Most of what makes a page look
// generated is composition, and composition is not statically checkable. A site
// can pass every gate below and still be obviously machine-made, because the
// remaining tells are about whether a decision was taken at all — whether the
// empty half of a hero is holding something or is just left over, whether the
// sections have real rhythm or one padding value repeated. Those live in
// stages/04_design and stages/06_verify as a human judgment, and they are
// labelled there as such rather than faked here.
//
// A NOTE ON WHAT IS DELIBERATELY *NOT* BANNED. Common layouts are common partly
// because they work: people know how to read a centred hero and a three-card
// row. This family flags the DEFAULTS a generator reaches for without deciding
// (Inter as display, purple-to-blue gradients, four typefaces, transition: all)
// — not conventional structure. Forbidding convention outright trades a
// recognisable site for a confusing one, which is a worse outcome, not a
// braver one.
//
// RULE PROVENANCE
//   source:  TAXONOMY.md (18-angle research wave, 2026-08-18, adversarially verified)
//   dated:   2026-08-18
//   review:  2027-02-18 — six months. Signals decay: a tell that identified a
//            generator in 2023 can be a mainstream choice by 2026. At review,
//            ask of every rule here "is this still true?" and RETIRE the ones
//            that are not. Removing a rule is a normal outcome, not a failure;
//            TAXONOMY.md has a section for it.

import { read, displayPath } from '../lib/fs.mjs';
import { loadStylesheets, collectTokens, resolveVar, parseColor, relLuminance } from '../lib/css.mjs';
import { tags, attr } from '../lib/html.mjs';
import { BLOCKER, MAJOR, MINOR } from '../lib/report.mjs';

export const gates = [
  { id: 'design/default-display-font', severity: 'major', what: 'Inter/Roboto/Open Sans/Poppins/Lato as the display face' },
  { id: 'design/font-count', severity: 'major', what: 'more than two typeface families' },
  { id: 'design/italic-heading', severity: 'minor', what: 'italic headings' },
  { id: 'design/token-discipline', severity: 'minor', what: 'colour and font literals declared outside :root' },
  { id: 'design/gradient-text', severity: 'major', what: 'background-clip:text gradient headlines' },
  { id: 'design/default-gradient', severity: 'major', what: 'the purple-to-blue / cyan-to-magenta generator gradient' },
  { id: 'design/pure-black-white', severity: 'minor', what: '#000 or #fff as the page base' },
  { id: 'design/transition-all', severity: 'minor', what: 'transition: all' },
  { id: 'design/animate-layout', severity: 'major', what: 'animating width/height/top/left/margin/padding' },
  { id: 'design/uniform-hover', severity: 'minor', what: 'the same scale transform on every hover' },
  { id: 'design/spacing-scale', severity: 'minor', what: 'arbitrary spacing values outside a named scale' },
  { id: 'design/motif-stamped', severity: 'minor', what: 'a signature device on most sections, which recreates the tell' },
  { id: 'design/uniform-rhythm', severity: 'minor', what: 'every section sharing one padding value' },
  { id: 'design/emoji-icons', severity: 'minor', what: 'emoji used as feature/step icons' },
  { id: 'design/fake-chrome', severity: 'minor', what: 'hand-drawn browser bars, phone frames and fake dashboards' },
  { id: 'design/emoji-ui', severity: 'major', what: 'emoji inside headings, buttons or navigation' },
  { id: 'design/radius-zoo', severity: 'minor', what: 'five or more unrelated border-radius values' },
  { id: 'design/shadow-zoo', severity: 'minor', what: 'five or more unrelated box-shadow styles' },
  { id: 'design/hover-hide', severity: 'major', what: 'a hover state that fades or hides the element being hovered' },
  { id: 'design/hover-only-reveal', severity: 'major', what: 'content that exists only behind a hover, unreachable on touch' },
  { id: 'design/hero-100vh', severity: 'minor', what: 'a hero locked to exactly one viewport with nothing peeking below the fold' },
];

// The second alternation is the 2024-26 generation of the same defect: the
// faces a generator now reaches for when nothing was chosen (source: the
// vibe-coded-website field survey + YC design review, 2026-08-18; review
// 2027-02-18 — this list decays faster than any other line in the file).
const DEFAULT_FACES = /\b(inter|roboto|open\s?sans|poppins|lato|montserrat|nunito|raleway|source\s?sans|work\s?sans|space\s?grotesk|manrope|sora|dm\s?sans|plus\s?jakarta\s?sans|outfit)\b/i;

// Generic families, system-stack members, and the classic WEB-SAFE FALLBACKS.
// Georgia and Times New Roman appearing here is the point: they are almost
// never a design decision, they are the third entry in someone's fallback
// stack, and counting them made a two-font site read as five.
const GENERIC = /^(sans-serif|serif|monospace|system-ui|-apple-system|blinkmacsystemfont|segoe\s?ui|ui-sans-serif|ui-serif|ui-monospace|ui-rounded|helvetica(\s?neue)?|arial|verdana|tahoma|georgia|times(\s?new\s?roman)?|courier(\s?new)?|palatino|garamond|book\s?antiqua|trebuchet\s?ms|impact|apple\s?color\s?emoji|segoe\s?ui\s?(emoji|symbol)|noto\s?color\s?emoji|cursive|fantasy|math|emoji|liberation\s?\w+|dejavu\s?\w+|cantarell)$/i;

// CSS-wide keywords are not typefaces.
const CSS_KEYWORDS = /^(inherit|initial|unset|revert|revert-layer|none|auto)$/i;

// Match the animated property as a TOKEN. An earlier \b-delimited version
// matched `top` inside `border-top-color`, reporting a colour fade as a layout
// animation — a confident MAJOR about work that was correct.
const LAYOUT_PROPS = /^(width|height|min-width|min-height|max-width|max-height|top|left|right|bottom|margin|margin-\w+|padding|padding-\w+|inset|inset-\w+|flex-basis|block-size|inline-size)$/;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F02F}]/u;

export async function run(ctx, report) {
  const { siteDir, htmlFiles, cssFiles, styleSources } = ctx;
  for (const id of gates.map((g) => g.id)) report.ranGate(id);
  if (!styleSources.length) {
    report.skip('design', 'no stylesheets and no <style> blocks found');
    return;
  }

  const { rules, text: cssText } = loadStylesheets(styleSources);
  const tokens = collectTokens(rules);
  // r.file is already a display path (run.mjs builds styleSources that way).
  const at = (r) => ({ file: r.file || null, line: r.startLine });

  // ------------------------------------------------------------- typography
  // Only the FIRST family in each stack counts. Everything after it is a
  // fallback the designer never chose — counting the whole stack turned a
  // deliberate two-font site into a five-font violation.
  const families = new Set();
  const fontDecls = [];
  const firstFamilyOf = (raw) => {
    const first = resolveVar(raw, tokens).split(',')[0].trim().replace(/^["']|["']$/g, '');
    if (!first || first.startsWith('var(') || CSS_KEYWORDS.test(first) || GENERIC.test(first)) return null;
    return first.toLowerCase();
  };
  for (const r of rules) {
    for (const d of r.declarations) {
      if (d.prop !== 'font-family' && !d.prop.startsWith('--font')) continue;
      fontDecls.push({ r, d });
      const fam = firstFamilyOf(d.value);
      if (fam) families.add(fam);
    }
  }
  // Read the token block directly too — a family declared only as a token and
  // never referenced in a rule still ships a font download.
  for (const [name, val] of Object.entries(tokens)) {
    if (!name.startsWith('--font')) continue;
    const fam = firstFamilyOf(val);
    if (fam) families.add(fam);
  }

  if (families.size > 2) {
    report.add('design/font-count', MAJOR,
      `${families.size} typeface families: ${[...families].join(', ')}`,
      { count: families.size },
      'Two at most, and only when the pairing is deliberate and harmonious. Build hierarchy from weight, size, case and colour instead. Fonts scattered by role — a serif heading, a sans body, a mono label — is the single most reliable visual signature of a generated page.');
  }

  // The banned faces are fine for body text; the objection is to using one as
  // the DISPLAY face, i.e. the choice the page's character comes from.
  for (const { r, d } of fontDecls) {
    const isDisplay = /--font-(display|heading|title)/.test(d.prop)
      || /(^|[\s,>+~.])(h1|h2|h3)([\s,{.:[]|$)|hero|display|title|wordmark/i.test(r.selector);
    if (!isDisplay) continue;
    const resolved = resolveVar(d.value, tokens);
    const first = resolved.split(',')[0].trim().replace(/^["']|["']$/g, '');
    if (DEFAULT_FACES.test(first) || GENERIC.test(first)) {
      report.add('design/default-display-font', MAJOR,
        `display face is "${first}"`,
        at(r),
        'This is the font a generator picks when it has not made a decision. Choose one with intent and name it as a token — the display face is where a page gets its character, and this one has none.');
      break;
    }
  }

  for (const r of rules) {
    if (r.isKeyframesOrFont) continue;
    const isHeading = /(^|[\s,>+~.])(h[1-6])([\s,{.:[]|$)|hero-title|section-title|wordmark|display/i.test(r.selector);
    if (isHeading && r.declarations.some((d) => d.prop === 'font-style' && /italic|oblique/i.test(d.value))) {
      report.add('design/italic-heading', MINOR,
        `${r.selector.split(',')[0].trim()} sets an italic heading`,
        at(r),
        'Headings are roman. Emphasis comes from weight, case, colour or a drawn rule. An italic serif heading over a plain sans body is a specific, recognisable generator look.');
      break;
    }
  }

  // ------------------------------------------------------------- colour
  if (/background-clip\s*:\s*text|(-webkit-)?text-fill-color\s*:\s*transparent/i.test(cssText)
      && /linear-gradient/i.test(cssText)) {
    report.add('design/gradient-text', MAJOR, 'gradient-filled text', {},
      'Never. It is the most-copied AI landing-page device there is, it breaks in forced-colors mode, and it usually fails contrast because the ratio changes across the glyph.');
  }

  // The specific hue pair, not gradients in general: a warm sunset gradient is
  // a decision, violet-to-blue is a default.
  for (const m of cssText.matchAll(/linear-gradient\(([^)]*)\)/gi)) {
    const stops = [...m[1].matchAll(/#[0-9a-f]{3,8}|rgba?\([^)]*\)|hsla?\([^)]*\)|oklch\([^)]*\)/gi)]
      .map((s) => parseColor(resolveVar(s[0], tokens))).filter(Boolean);
    if (stops.length < 2) continue;
    const hues = stops.map(([r, g, b]) => {
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (max === min) return -1;
      let h;
      if (max === r) h = ((g - b) / (max - min)) % 6;
      else if (max === g) h = (b - r) / (max - min) + 2;
      else h = (r - g) / (max - min) + 4;
      return ((h * 60) + 360) % 360;
    }).filter((h) => h >= 0);
    // The window runs from true blue (~215) to violet (~305). An earlier 230-300
    // range excluded #2563eb at 221 and therefore missed the single most common
    // generator gradient there is.
    const violetBlue = hues.filter((h) => h >= 212 && h <= 305).length;
    const cyanMagenta = hues.filter((h) => (h >= 160 && h <= 200) || (h >= 290 && h <= 330)).length;
    if (violetBlue >= 2 || cyanMagenta >= 2) {
      report.add('design/default-gradient', MAJOR,
        'violet-to-blue / cyan-to-magenta gradient',
        {},
        'This exact hue pair is the house style of every AI site builder. If a gradient is genuinely wanted, pick hues from the brand rather than from the default.');
      break;
    }
  }

  // Skip anything inside @media print: black on white is CORRECT on paper, and
  // flagging it taught nothing except that the checker had not read the rule it
  // was quoting.
  const baseRules = rules.filter((r) =>
    /(^|,)\s*(html|body|:root)\b/i.test(r.selector) && !/print/i.test(r.atRule || ''));
  for (const r of baseRules) {
    for (const d of r.declarations) {
      if (!/^background(-color)?$/.test(d.prop)) continue;
      const v = resolveVar(d.value, tokens).trim().toLowerCase();
      if (/^(#fff|#ffffff|white|#000|#000000|black)$/.test(v)) {
        report.add('design/pure-black-white', MINOR,
          `page base is pure ${v}`,
          at(r),
          'Tint it a degree or two toward the brand hue. Pure #fff and #000 are what you get when nobody chose — and on an OLED phone pure black also makes text edges shimmer.');
        break;
      }
    }
  }

  // Colour/font literals outside the token block: the mechanism by which a
  // design system quietly stops being one.
  let literals = 0;
  let firstLiteral = null;
  for (const r of rules) {
    if (r.isKeyframesOrFont) continue;
    if (/(^|,)\s*(:root|\[data-theme|html\b)/i.test(r.selector)) continue;
    for (const d of r.declarations) {
      if (d.prop.startsWith('--')) continue;
      const isColourProp = /^(color|background|background-color|border-color|fill|stroke|outline-color|box-shadow|text-decoration-color)$/.test(d.prop);
      if (!isColourProp) continue;
      if (/^(#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\()/i.test(d.value.trim())) {
        literals++;
        if (!firstLiteral) firstLiteral = { r, d };
      }
    }
  }
  if (literals > 6) {
    report.add('design/token-discipline', MINOR,
      `${literals} colour literals declared outside the token block`,
      firstLiteral ? at(firstLiteral.r) : {},
      'Move them into :root as named tokens. Improvised hexes mid-stylesheet are how a palette drifts from six colours to twenty-six, and why a later theme change breaks in places nobody predicted.');
  }

  // ------------------------------------------------------------- motion
  const transitionAll = rules.filter((r) => r.declarations.some(
    (d) => d.prop === 'transition' && /^all\b/i.test(d.value.trim())));
  if (transitionAll.length) {
    report.add('design/transition-all', MINOR,
      `transition: all in ${transitionAll.length} rule${transitionAll.length === 1 ? '' : 's'}`,
      { ...at(transitionAll[0]), count: transitionAll.length },
      'Name the properties. transition: all animates things you did not intend — including layout properties — and costs frames on every state change.');
  }

  for (const r of rules) {
    const t = r.declarations.find((d) => d.prop === 'transition' || d.prop === 'transition-property');
    if (!t || /^all\b/i.test(t.value.trim())) continue;
    // Each comma-separated entry is "<property> <duration> <easing>"; only the
    // first token is the property, and it must match a layout property exactly.
    const animated = t.value.split(',')
      .map((part) => part.trim().split(/\s+/)[0].toLowerCase())
      .filter((p) => LAYOUT_PROPS.test(p));
    if (animated.length) {
      report.add('design/animate-layout', MAJOR,
        `${r.selector.split(',')[0].trim()} transitions ${animated.join(', ')}`,
        at(r),
        'Animate transform and opacity instead. Layout properties force a re-layout of the page on every frame, which is where janky scrolling on a mid-range Android comes from.');
      break;
    }
  }

  const scaleHovers = rules.filter((r) => /:hover\b/.test(r.selector)
    && r.declarations.some((d) => d.prop === 'transform' && /scale\(/i.test(d.value)));
  if (scaleHovers.length >= 4) {
    const values = new Set(scaleHovers.map((r) =>
      (r.declarations.find((d) => d.prop === 'transform')?.value || '').match(/scale\([^)]*\)/i)?.[0]));
    if (values.size === 1) {
      report.add('design/uniform-hover', MINOR,
        `the same ${[...values][0]} on ${scaleHovers.length} unrelated hover states`,
        { count: scaleHovers.length },
        'One reflex applied everywhere is not an interaction design. Different elements should respond differently, or not at all.');
    }
  }

  // ------------------------------------------------------------- spacing
  const spacings = new Map();
  for (const r of rules) {
    for (const d of r.declarations) {
      if (!/^(padding|margin|gap|row-gap|column-gap)(-block|-inline)?(-start|-end|-top|-bottom|-left|-right)?$/.test(d.prop)) continue;
      for (const m of resolveVar(d.value, tokens).matchAll(/\b(\d+(?:\.\d+)?)px\b/g)) {
        const px = parseFloat(m[1]);
        if (px === 0 || px === 1 || px % 4 === 0) continue;
        spacings.set(px, (spacings.get(px) || 0) + 1);
      }
    }
  }
  if (spacings.size >= 5) {
    const list = [...spacings.keys()].sort((a, b) => a - b).slice(0, 6).map((p) => `${p}px`);
    report.add('design/spacing-scale', MINOR,
      `${spacings.size} off-scale spacing values (${list.join(', ')}…)`,
      { count: spacings.size },
      'Pick a 4px scale and hold it. Arbitrary values are individually invisible and collectively the reason a page feels slightly wrong without anyone being able to say why.');
  }

  // ------------------------------------------------------------- HTML tells
  for (const file of htmlFiles) {
    const raw = read(file);
    const shown = displayPath(file, siteDir);

    const sections = (raw.match(/<section\b/gi) || []).length;
    const motifs = (raw.match(/class=["'][^"']*\b(eyebrow|kicker|overline|section-label|section-eyebrow|section-kicker)\b/gi) || []).length;
    if (sections >= 4 && motifs / sections > 0.7) {
      report.add('design/motif-stamped', MINOR,
        `a kicker/eyebrow on ${motifs} of ${sections} sections`,
        { file: shown },
        'A signature is punctuation, not a section template. Once it prefixes most headings it has become the eyebrow-above-every-heading pattern it was meant to escape, just in costume. Keep it to the entry, statement and exit beats.');
    }

    // Emoji as UI iconography — distinct from emoji in prose, which is fine.
    const emojiIcons = [...raw.matchAll(/<(span|div|i|p)\b[^>]*class=["'][^"']*\b(icon|feature-icon|step-icon|bullet)\b[^"']*["'][^>]*>\s*([^\s<]{1,4})\s*</gi)]
      .filter((m) => EMOJI.test(m[3]));
    if (emojiIcons.length >= 2) {
      report.add('design/emoji-icons', MINOR,
        `${emojiIcons.length} emoji used as icons`,
        { file: shown, count: emojiIcons.length },
        'Emoji render differently on every platform and are announced verbatim by screen readers ("rocket"). Use one icon set, or lead with typography.');
    }

    if (/class=["'][^"']*\b(browser-(bar|chrome|mockup)|fake-(browser|window|terminal)|window-controls|traffic-lights|phone-frame|device-mockup|dashboard-mockup)\b/i.test(raw)) {
      report.add('design/fake-chrome', MINOR,
        'hand-drawn browser/device/dashboard chrome',
        { file: shown },
        'Use a real screenshot in a <figure>, or omit it. Drawn chrome is a stand-in for a product that has nothing to show.');
    }

    // Emoji inside UI chrome — headings, buttons, nav. Distinct from
    // design/emoji-icons (class-named icon elements) and from emoji in prose,
    // which is fine. Source: the vibe-coded-website survey's strongest single
    // tell (2026-08-18; review 2027-02-18).
    const uiEmoji = [];
    for (const m of raw.matchAll(/<(h[1-6]|button)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi)) {
      if (EMOJI.test(m[2].replace(/<[^>]*>/g, ' '))) uiEmoji.push(m[1].toLowerCase());
    }
    for (const m of raw.matchAll(/<nav\b[^>]*>([\s\S]*?)<\/nav\s*>/gi)) {
      if (EMOJI.test(m[1].replace(/<[^>]*>/g, ' '))) uiEmoji.push('nav');
    }
    if (uiEmoji.length) {
      report.add('design/emoji-ui', MAJOR,
        `emoji inside <${uiEmoji[0]}>${uiEmoji.length > 1 ? ` and ${uiEmoji.length - 1} more element${uiEmoji.length > 2 ? 's' : ''}` : ''}`,
        { file: shown, count: uiEmoji.length },
        'Emoji in a heading, button or nav renders differently on every platform, is read out verbatim by screen readers ("sparkles"), and is the single most recognisable mark of a generated page. Set type instead.');
    }
  }

  // ------------------------------------------------------------- rhythm
  const sectionRules = rules.filter((r) =>
    !r.isKeyframesOrFont && !r.atRule &&
    /^\.(section|band|hero|cta|panel|feature|block)\b|(^|[\s,])section\b/i.test(r.selector));
  const padValues = new Map();
  for (const r of sectionRules) {
    const p = r.declarations.find((d) => /^padding(-block)?$/.test(d.prop));
    if (!p) continue;
    const v = resolveVar(p.value, tokens).trim();
    if (!padValues.has(v)) padValues.set(v, []);
    padValues.get(v).push(r.selector.split(',')[0].trim());
  }
  if (padValues.size === 1 && sectionRules.length >= 4) {
    const [[value, sels]] = [...padValues];
    if (sels.length >= 4) {
      report.add('design/uniform-rhythm', MINOR,
        `every section uses the same padding (${value}) across ${sels.length} rules`,
        { count: sels.length },
        'A page needs at least two genuinely distinct section shapes — a full-bleed statement band against an asymmetric split, say. One padding value on every band reads as a stack, not a composition.');
    }
  }

  // ------------------------------------------- consistency + interaction tells
  // Added 2026-08-18 from three sources read together: the Aftermark 500-site
  // vibe-coded-website survey, its r/VibeCodeDevs thread, and YC's design
  // review of AI-built startup sites. review: 2027-02-18. The consistency
  // pair encodes the survey's core finding — the tell is never one radius or
  // one shadow, it is the ZOO, because inconsistency is what "nobody decided"
  // looks like. The interaction pair encodes the YC review's two hard
  // anti-patterns: hover that hides, and content that exists only behind
  // hover (touch has no hover).

  const radii = new Set();
  for (const r of rules) {
    if (r.isKeyframesOrFont) continue;
    for (const d of r.declarations) {
      if (!/^border(-\w+)*-radius$/.test(d.prop)) continue;
      const v = resolveVar(d.value, tokens).trim().toLowerCase().replace(/\s+/g, ' ');
      if (!v || v.includes('var(')) continue;
      if (/^(0|0px|50%|100%|999px|9999px|99rem|100vmax|inherit|initial|unset)$/.test(v)) continue;
      radii.add(v);
    }
  }
  if (radii.size >= 5) {
    report.add('design/radius-zoo', MINOR,
      `${radii.size} different border-radius values: ${[...radii].slice(0, 6).join(', ')}`,
      { count: radii.size },
      'Pick one radius (plus 50% for circles and a pill value if needed) and hold it. Mismatched corner rounding across components is one of the survey-measured tells that a page was assembled, not designed.');
  }

  const shadows = new Set();
  for (const r of rules) {
    if (r.isKeyframesOrFont) continue;
    for (const d of r.declarations) {
      if (d.prop !== 'box-shadow') continue;
      const v = resolveVar(d.value, tokens).trim().toLowerCase().replace(/\s+/g, ' ');
      if (!v || v === 'none' || v.includes('var(')) continue;
      shadows.add(v);
    }
  }
  if (shadows.size >= 5) {
    report.add('design/shadow-zoo', MINOR,
      `${shadows.size} different box-shadow styles`,
      { count: shadows.size },
      'Create one elevation style (two at most: rest and raised) and reuse it. Five different shadows is five different opinions about where the light is.');
  }

  for (const r of rules) {
    if (r.isKeyframesOrFont) continue;
    if (!/:hover\s*$/.test(r.selector.split(',')[0].trim())) continue;
    const hides = r.declarations.find((d) =>
      (d.prop === 'opacity' && parseFloat(resolveVar(d.value, tokens)) === 0)
      || (d.prop === 'visibility' && /hidden/i.test(d.value))
      || (d.prop === 'display' && /^none$/i.test(d.value.trim())));
    if (hides) {
      report.add('design/hover-hide', MAJOR,
        `${r.selector.split(',')[0].trim()} ${hides.prop === 'opacity' ? 'fades out' : 'disappears'} on hover`,
        at(r),
        'Hover is an affordance: it says "you can act on this". An element that fades or vanishes under the cursor says the opposite, and it is one of the two interaction tells the YC design review called out on every AI-built site it examined.');
      break;
    }
  }

  if (!/:focus-within\b/.test(cssText)) {
    for (const r of rules) {
      if (r.isKeyframesOrFont) continue;
      const sel = r.selector.split(',')[0].trim();
      const m = sel.match(/^(.+?):hover\s*[ >+~]\s*(\S.*)$/);
      if (!m) continue;
      if (/nav|menu|dropdown|submenu/i.test(sel)) continue; // responsive/hover-only owns menus
      const reveals = r.declarations.find((d) =>
        (d.prop === 'display' && !/^none$/i.test(d.value.trim()))
        || (d.prop === 'visibility' && /visible/i.test(d.value)));
      if (reveals) {
        report.add('design/hover-only-reveal', MAJOR,
          `${m[2].trim()} exists only while ${m[1].trim()} is hovered`,
          at(r),
          'There is no hover on a phone, so this content is unreachable for most visitors — and a keyboard user never sees it either. Show it, or reveal it on click/focus (:focus-within) as well.');
        break;
      }
    }
  }

  for (const r of rules) {
    if (r.isKeyframesOrFont || /print/i.test(r.atRule || '')) continue;
    if (!/hero|masthead|banner|splash|landing/i.test(r.selector)) continue;
    const d = r.declarations.find((d) => /^(min-)?height$/.test(d.prop)
      && /^100(vh|dvh|svh)$/i.test(resolveVar(d.value, tokens).trim()));
    if (d) {
      report.add('design/hero-100vh', MINOR,
        `${r.selector.split(',')[0].trim()} is locked to ${d.value.trim()}`,
        at(r),
        'Let a few pixels of the next section peek above the fold. A hero that fills the viewport exactly reads as a dead end — visitors scroll when they can see there is somewhere to scroll to.');
      break;
    }
  }

  report.stats.typefaces = [...families];
}

export default { gates, run };
