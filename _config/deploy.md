# Deployment Reference (Layer 3)

How finished sites are hosted and how their deploy setups are **preserved**. The
config table lists the *default*; this file is the detail. Read at **stage 06** when
promoting a site, and at **stage 01** when capturing the brief's deploy target.

Guiding rule: **a site's existing deployment setup is sacred.** If a site already
has a remote, a host, or a pipeline, preserve it exactly — never replace, rewire, or
"upgrade" it without the owner asking.

---

## Default posture

- **Deploy target is decided per site**, not globally. Most brochure sites here are
  static and host anywhere; the brief (stage 01) records the chosen target.
- **Git policy:** each promoted site gets its **own local repo**; **push only on
  request** (per `website-builder-config.md`). The ICM `sites/` folder is a shelf,
  not a deploy pipeline — copying a site there does not deploy it.
- **Preserve, don't invent:** if a brief or an existing site names a host/remote, use
  exactly that. If none is named, leave it un-deployed and note the open question —
  don't pick a host on the owner's behalf.

---

## GitHub (storage / source)

- A site's GitHub remote is **storage and version history**, and is **not** the same
  as deployment. Pushing to GitHub does **not** make a site live unless a host is
  explicitly wired to that repo.
- Keep remotes **private** unless the owner says otherwise.
- Standard loop for a git-backed site: `git pull --rebase` → work → `git add -A` /
  `commit` / `push`. Push is sync/backup; it is not a deploy.
- **Example — a clinic site:** remote `github.com/your-github-user/example-clinic-site`
  (private). Its own repo docs state plainly: *pushing is storage only,
  it does not deploy the live site.* Honour that — do not assume a push publishes.

---

## Cloudflare Pages (a host option)

When a site is to be **served**, Cloudflare Pages is the preferred static host:

- **Static sites** need no build command — point Pages at the repo (or the output
  dir) and it serves the files. Set the build output directory to the site root (or
  `public/` if the site uses a generated deploy copy).
- **Framework stacks** (Astro/Next) set the framework's build command and output dir
  in the Pages project; keep dependencies minimal.
- If a site **already** has a Pages project, preserve its project name, production
  branch, build command, and output directory. Don't recreate it.
- Custom domains, environment variables, and redirects configured in Pages are part
  of the deploy setup — **never** delete or rewrite them; surface them to the owner.

---

## When promoting (stage 06)

1. Copy the cleared build to `sites/<kebab-name>/`, give it its own local repo if
   policy says so, and add a row to `sites/README.md`.
2. **Record the deploy facts honestly** in that registry row: stack, status
   (`live` / `staged` / `archived`), the remote (if any), and whether the remote
   deploys or is storage-only. If a site is remote-only and not on disk here, say so.
3. **Push only if the owner asked.** Deploy (or trigger a Pages build) only if the
   owner asked and the host is already set up.
4. Do not change access controls, sharing, domains, or pipeline settings — those are
   owner actions. Flag anything that needs them.
