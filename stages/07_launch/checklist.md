# Launch checklist

Every line here is a thing that has gone wrong on a real launch. Work down it
against the **live domain**, not a local file path — several of these cannot fail
locally and cannot pass in production.

## Before you touch DNS

- [ ] The gate passes against the built output, with `--facts`, unscoped.
- [ ] A redirect map exists if an existing site is being replaced (`redirects.md`).
- [ ] Every `[NEEDS:]` in `facts.md` is closed, or the client has signed off on
      the page shipping without it.
- [ ] The real domain replaces every placeholder in canonicals, OG tags, the
      sitemap and robots.txt.
- [ ] `dns-before.txt` records every existing DNS record.
- [ ] MX, SPF, DKIM and DMARC records are identified and are **not** changing.
- [ ] TTL lowered on the records that will change, ideally 24h ahead.

## The two that actually matter

- [ ] **Submit the contact form for real and see it arrive in the owner's inbox.**
      Not "the endpoint is configured". Actually submit, actually look, actually
      check spam. Most hosted form services fail silently on a wrong key.
- [ ] **Ring the number on the site, out loud, from a different phone.**
      A transposed digit is invisible to the owner, who never rings themselves.

## After the switch

- [ ] `https://` loads with no certificate warning, on both `www` and the bare domain.
- [ ] One redirects to the other; they do not both serve.
- [ ] Email still flows: send one in and one out.
- [ ] A deliberately wrong URL returns a real 404 page with a 404 status.
- [ ] At least five old URLs 301 to the right new page — click them.
- [ ] `robots.txt` and `sitemap.xml` resolve on the live domain.
- [ ] `_headers` is actually applied (check response headers, not the file).
- [ ] No `noindex` survives anywhere it should not.
- [ ] The gate passes against the LIVE page set, not the local folder.

## Ownership, before you invoice

- [ ] The domain is registered **to the client**.
- [ ] `handoff.md` records registrar, DNS, hosting, repo, form service and
      analytics: who owns each, who has the login, renewal date, cost.
- [ ] Credentials handed over through a password manager, not email.
- [ ] The client has been told, in plain words, how to get a change made and
      roughly what it costs.
- [ ] The client knows what they can change themselves. For a static site the
      honest answer is usually "nothing" — say so rather than letting them find out.

## The week after

- [ ] Sitemap submitted in Search Console.
- [ ] Google Business Profile points at the new site, and its name, address and
      phone match the site footer **exactly**.
- [ ] Diary a check for day 7: did a real enquiry arrive, and does search still
      find them.
