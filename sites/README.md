# Sites — Registry of Finished Websites

Each subfolder here is a completed website, promoted from `stages/06_qa/` after it
cleared the pre-ship gates. This file is the registry. Add a row when a site ships.

## Registry

*(Empty — nothing has been promoted yet.)*

| Site | Folder | Stack | Status | Repo / Remote | Promoted |
|------|--------|-------|--------|---------------|----------|
| — | — | — | — | — | — |

## How a site lands here

1. Stage 06 QA passes every gate in `../shared/design/pre-ship-gates.md`.
2. Copy the build from `../stages/05_build/output/site/` to
   `sites/<kebab-name>/`.
3. Per `../_config/website-builder-config.md`, the site gets its own local Git repo
   (push only on request).
4. Add a row above: name, folder, stack, status (`live` / `staged` / `archived`),
   any remote, and the promotion date.
5. Append the design row to [`variety-ledger.md`](variety-ledger.md) so the next
   build knows what to avoid.

## Notes

- Site folders are **products**, independent of the pipeline — editing one here
  does not re-run the stages. To revise a shipped site, re-enter at the relevant
  stage and re-promote.
- Record deploy facts honestly: a GitHub remote is storage, not a deployment,
  unless a host is explicitly wired to it. See `../_config/deploy.md`.
