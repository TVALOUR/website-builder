# Stage 07 — Launch and handoff

**The build is not the deliverable.**

Almost every AI website pipeline stops when the files exist. That is where the failures that
actually cost a small business money begin: the old site's URLs 404 and the rankings go with
them, the DNS change takes the email down for a day, nobody ever sent a test enquiry so the
form has been silently discarding them for a month, and the domain is registered in the
developer's name.

None of that is visible in the code. All of it is preventable with a list.

◆ **This is a stop.** The human launches. You prepare, verify and hand over.

---

**A brand-new domain with no existing site** collapses most of this stage: no redirect
map, no DNS records to preserve beyond what the registrar created. The pre-flight list,
the ownership table and the two tests that matter (the form, the phone) still apply in
full — they fail on new sites exactly as often.

## Inputs

- `builds/<slug>/site/` — the verified build.
- `builds/<slug>/facts.md`, `brief.md` — for ownership and domain answers (questions 31–35).
- `builds/<slug>/verify.md` — stage 06 must have passed before you are here.

## Process

### 1. The redirect map — do this before anything else changes

**Only if an existing site is being replaced.** Skip for a brand-new domain, and say you
skipped it.

Every URL on the old site needs a destination on the new one. Without it the business loses
its search rankings, and every link on every printed card, van, directory listing and Facebook
post breaks at once.

1. List the old URLs. In order of preference: their existing `sitemap.xml`, Google Search
   Console's Pages report, an analytics export, or `site:theirdomain.co.uk` in a search engine.
2. Map each one to its closest new page. Write it into `redirects.md` as a table.
3. Anything with no equivalent goes to the most relevant *section*, never to the homepage in
   bulk. A mass redirect to `/` is treated as a soft 404 and helps nobody.
4. Emit the map in the host's format: `_redirects` for Cloudflare Pages and Netlify,
   `vercel.json` for Vercel, `.htaccess` for Apache. Use **301** for a permanent move.
5. Preserve URL case and trailing-slash behaviour, or add redirects for both variants.

### 2. The pre-flight list

Work through `checklist.md`. It is short and every line is a thing that has gone wrong on a
real launch. Two of them are the ones that matter most:

- **Send a real enquiry through the form and confirm it arrives in the owner's inbox.**
  Not "the endpoint is configured". Actually submit it, actually look in the inbox, actually
  check the spam folder. Most hosted form services fail silently when a key is wrong, and the
  business will not find out for weeks.
- **Ring the phone number on the site.** Out loud, from a different phone. A transposed digit
  is invisible to the owner, who never rings themselves.

### 3. DNS, in this order, and not in any other

The email is the thing you can break. Treat it as the priority.

1. **Record what exists now.** Every DNS record, before touching anything.
   `dig theirdomain.co.uk ANY` or the registrar's export. Save it to `dns-before.txt`.
   If this goes wrong, this file is how you undo it.
2. **Identify the MX records and anything email-related** (MX, SPF `TXT`, DKIM `CNAME`/`TXT`,
   DMARC `_dmarc`). These carry the business's email. They are not being changed. Say so out
   loud so nobody helpfully "tidies" them.
3. **Lower the TTL** on the records you will change, 24 hours ahead if you can.
4. **Change only the A / AAAA / CNAME** for the site itself.
5. **Wait for the certificate.** Most hosts provision TLS automatically and it takes minutes
   to hours. The site is not live until `https://` works without a warning.
6. **Check the email still flows** after the change. Send one in and one out.

If the owner controls their own DNS, write them the exact records to add rather than asking
for their password.

### 4. Ownership — write it down, in their name

The single most common way a small business gets trapped is that nobody wrote down who owns
what. Fill in `handoff.md`:

| Thing | Registered to | Who has the login | Renews | Cost |
|---|---|---|---|---|
| Domain | **the client, always** | | | |
| Hosting | | | | |
| Form service | | | | |
| Email | | | | |
| Analytics, if any | | | | |

**The domain is registered to the client.** Not to you, not to your agency, not "for now". If
it is currently in your name, transfer it or write down the date you will.

### 5. Tell them what they have, in plain language

`handoff.md` finishes with a section a non-technical person can act on:

- How to get a change made, and roughly what it costs.
- What they can change themselves. For a static site, honestly: nothing, unless you set
  something up. Say so.
- Where the enquiries arrive and what to do if they stop.
- What happens if they stop paying for hosting.
- The known gaps from `facts.md` that they still owe you, if any.

### 6. After it is live

- Submit the sitemap in Google Search Console.
- Check the Google Business Profile points at the new site and the NAP details match the
  footer exactly. Mismatched name, address and phone across the two is a real ranking problem
  and a five-minute fix.
- Re-run the gate against the **live** URL set, not the local folder, so anything the deploy
  changed shows up.
- Diary a check for 7 days later: did a real enquiry arrive, and does search still find them.

### 7. Close Round 0, and say how the next change happens

- In `builds/<slug>/CHANGELOG.md`, flip `Round 0` from `OPEN` to `SHIPPED` and put the
  stage-06 verdict in its `**Gate:**` line. Tag it in the build's own repo:
  `git tag round-0`.
- Tell the client, in the handover, **how to ask for a change**: they say what they want in
  their own words, and it becomes a numbered round with a record of what was changed, what
  was not, and why. It is one sentence and it is the difference between a site that was
  delivered and a site that is looked after.
- From here on the build is in **stage 08** (`stages/08_revise/CONTEXT.md`). `LAUNCHED` no
  longer means the pipeline has finished with it — it means every further edit happens
  inside a round, and the hook enforces that.

## The legal handover — say what the pages are, in writing

The gate tells YOU that a profile is researched-not-verified, on every run. The client never sees
that, and the client is the one who will be asked about it. `handoff.md` carries a section, and
these are its required lines:

- **Jurisdiction:** the profile id, its `provenance.status`, and its `lawLastVerified` date.
- **What the legal pages are:** built to a competent default from published sources, and **not
  reviewed by a lawyer**. Say it in that many words.
- **The profile's own caveats**, verbatim from `provenance.caveats` — the gate prints them at the
  end of every run under KNOWN LIMITS OF THIS PROFILE. Paste them.
- **The open `legal/local-rule` items**, with the ones the profile rates blocker or major named
  individually. These are the obligations no static file can decide, and this is the read-back the
  checker's own finding text promises happens here.
- **One plain sentence:** "These pages are a competent starting point, not legal advice. If you are
  in a regulated trade, or you are unsure, have somebody local read them before you rely on them."

`facts.md` gets read back the same way, and for the same reason: the gate proves every claim traces
to a row, and only a human can confirm the row is true.

## Outputs

- `builds/<slug>/redirects.md` and the host-format redirect file in `site/`
- `builds/<slug>/handoff.md`
- `builds/<slug>/dns-before.txt` if DNS was touched
- `builds/<slug>/CHANGELOG.md` — Round 0 SHIPPED, with the gate verdict
- a `round-0` tag in the build's git repo
- `STATE.md` set to `LAUNCHED`

## Verify before you stop

- [ ] A real test enquiry was submitted and **seen** in the owner's inbox.
- [ ] The phone number was dialled and rang the right person.
- [ ] Old URLs 301 to real destinations, and you clicked at least five.
- [ ] MX and SPF/DKIM/DMARC records are unchanged, and email was tested after the switch.
- [ ] `https://` loads with no certificate warning, on `www` and bare domain.
- [ ] The domain is registered to the client.
- [ ] `handoff.md` exists and a non-technical person could act on it.
- [ ] Nothing was pushed, deployed or transferred that the human did not explicitly approve.
