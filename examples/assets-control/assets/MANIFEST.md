# Assets — assets-control (a fixture that must FAIL)

**Imagery policy:** client-assets-only

THIS MANIFEST IS DELIBERATELY WRONG. Do not fix it. It is the negative control for the assets
family: each row below is broken in one specific way so `checks/selftest.mjs` can prove the
corresponding gate fires. The correct, filled-in version of this table is the one
`node assets.mjs <slug> scan` writes into a real build.

Faults, row by row:

- `photos/team.png` — declared generated on a `client-assets-only` build (**generated-not-permitted**)
  and it depicts the team (**generated-forbidden-subject**).
- `logo/logo.svg` — no answer in Rights (**rights-unrecorded**), no alt (**alt-unrecorded**).
- `photos/hero-texture.png` — Source names a generator, Generated says no (**generated-undeclared**).
- `photos/gone.jpg` — a row for a file that does not exist (**file-missing**).
- `photos/yard.png` — no Source (**source-unrecorded**), and the page's alt disagrees with the
  manifest's (**alt-mismatch**).
- `img/shopfront.jpg` is on the page and has no row here at all (**unmanifested**).
- `_intake/leaflet-scan.png` was handed over and is used nowhere (**intake-unused**).

| File                     | Kind      | What it shows                          | Source                        | Rights | Generated | Used         | Alt                        |
|--------------------------|-----------|----------------------------------------|-------------------------------|--------|-----------|--------------|----------------------------|
| photos/team.png          | photo     | the team outside the workshop          | generated for this build      |        | yes       | about page   | The team outside the workshop |
| logo/logo.svg            | logo      | the company wordmark                   | client email 2026-08-14       | ?      | no        | header       |                            |
| photos/hero-texture.png  | photo     | slate paper texture                    | midjourney, brand-cool grey   | ours   | no        | home hero    | Slate paper texture        |
| photos/gone.jpg          | photo     | the yard                               | client email 2026-08-14       | client owns | no   | services     | The yard at first light    |
| photos/yard.png          | photo     | the yard at first light                |                               | client owns | no   | services     | The yard at first light    |

## Still to ask the client

- [ ] `logo/logo.svg` — is it theirs to publish?

## Deliberately absent

Nothing. This fixture is broken on purpose.
