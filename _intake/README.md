# `_intake/` — Client Requirements Drop Zone

Drop the client's brief and materials here, then run **stage 01**. It reads
everything in this folder, distills it into `stages/01_brief/output/brief.md`, and
that distilled brief — never the raw files — is what flows to the later stages. This
is the file-attach path into the pipeline.

## What to drop here

- **Requirements / brief documents** — `.pdf`, `.txt`, `.md`, `.docx`, `.rtf`. A
  client email, an RFP, a one-pager, a filled questionnaire, scattered notes — all fine.
- **Brand materials** — existing brand guidelines (PDF), a colour/font list, a tone-of-voice doc.
- **Real assets** → put in `_intake/assets/`: logos, real photographs (team, premises,
  product, work), icon files, custom fonts. These are the *legitimate* source of real
  imagery and proof — the honesty floor bans **inventing** people/logos/credentials,
  not using ones the client actually gave you.
- **Reference / inspiration** → put in `_intake/references/`: screenshots or URLs of
  sites the client likes or wants to avoid (feeds stage 04's `study` step).
  **The owner's own taste references** live here too, as dissected cards in
  `_intake/references/moodboard.md` — captured any time per the moodboard protocol
  (`../shared/design/moodboard.md`). Cards are per-build: archived to
  `sites/<name>/_source/` and cleared at promote, so the next project starts fresh.

You don't have to use any of this — an empty `_intake/` just means stage 01 falls back
to interviewing you, exactly as before. Mixed is fine too: drop a partial brief and
answer the gaps in chat.

## How stage 01 processes it

1. **Reads every file.** Text PDFs, `.txt`, `.md` are read directly. Scanned/image-only
   PDFs are rendered to PNG first (any PDF-to-image route your shell offers), then
   read as images. Images are viewed.
2. **Distills, with a source map.** Every captured fact in `brief.md` is tagged with
   which file it came from, so the brief is auditable back to the client's words.
3. **Flags gaps & conflicts.** Anything the documents don't cover, or contradict, is
   listed as an open question / assumption to confirm — not silently guessed.
4. **Catalogues real assets.** Files in `assets/` are inventoried in the brief (what
   each is, where it should be used) and marked **client-supplied / real**, so stage 04
   prefers them over generated imagery (`shared/design/imagery.md` §1) and stage 06
   copies them into the shipped site.

## Lifecycle (one client at a time)

This is a **staging area for the current build**, like the `stages/*/output/` folders.
Drop → run stage 01 → the durable artifact is `brief.md`. On promotion (stage 06) the
intake may be archived to `sites/<name>/_source/` for provenance, then this folder
cleared for the next client. Keep one client's materials here at a time to avoid
cross-contaminating briefs.

### Queuing briefs from multiple clients

Use `_clients/` (sibling of this folder) as a holding area for briefs you've received
but haven't started yet. Give each client their own subfolder:

```
_clients/
  acme-co/
    brief.pdf
    assets/
  another-client/
    brief.md
```

When you're ready to start a build:
1. **Copy** (don't move) the relevant subfolder's contents into `_intake/` (and `_intake/assets/` etc.)
2. Confirm `_intake/` has only that client's files
3. Say so — stage 01 runs next

`_clients/<name>/` stays as the permanent record for that client. If they come back with
changes or revisions, add the new materials there first, then copy to `_intake/` again
and re-run from whichever stage makes sense.

Stage 01 never reads `_clients/`, so queued briefs cost zero tokens.

## What does **not** happen here

- Raw files are **never** handed to the build stage — it only ever receives the
  distilled markdown (`brief.md` / `content.md` / `design-spec.md`).
- No file here is executed. Documents are read; assets are catalogued and (later) copied.
