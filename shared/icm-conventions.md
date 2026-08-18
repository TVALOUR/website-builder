# ICM Conventions (Layer 3 — shared reference)

The rules every ICM workspace follows — Interpretable Context Methodology (ICM),
distilled into the one page you apply directly. This is the canonical document; there
is no separate source paper. The builder reads this before scaffolding; every workspace
it produces obeys it.

---

## The five design principles

1. **One stage, one job.** Each stage does a single step and writes to its own
   folder. A stage that fetches data does not also format the output.
2. **Plain text is the interface.** Stages talk to each other through markdown
   (and JSON) files. No databases, no binary formats. Anything that reads text
   can participate; anyone with a text editor can inspect or edit.
3. **Layered context loading.** An agent loads only what the current stage needs.
   Less irrelevant context = better output. Prevention, not compression.
4. **Every output is an edit surface.** Each stage's output is a file a human can
   open, read, edit, and save before the next stage runs.
5. **Configure the factory, not the product.** Set the workspace up once
   (preferences, voice, conventions). Each run then produces a new deliverable
   using that configuration.

---

## The five context layers

An agent navigating a workspace reads down through these as needed. Most stages
never read everything.

| Layer | What it is | Lives in | Answers |
|-------|-----------|----------|---------|
| **0** | Global identity | `AGENTS.md` | "Where am I?" |
| **1** | Task routing | `AGENTS.md` § Routing | "Where do I go?" |
| **2** | Stage contract | `stages/NN_*/CONTEXT.md` | "What do I do here?" |
| **3** | Reference material | `references/`, `_config/`, `shared/` | "What rules apply?" |
| **4** | Working artifacts | `output/` | "What am I working with?" |

**Layer 3 vs Layer 4 — keep them separate.** This is the distinction that most
improves output quality, so enforce it:

| | Layer 3: Reference | Layer 4: Working |
|---|---|---|
| Changes between runs? | No | Yes |
| Examples | `voice.md`, `design-system.md`, `conventions.md` | `research-output.md`, `script-draft.md` |
| The model should | Internalise as **constraints** | Process as **input** |
| Configured | At setup (once) | During each run |
| Folder | `references/`, `_config/`, `shared/` | `output/` |
| Analogy | The recipe | The ingredients |

A stage's context budget should land roughly in **2,000–8,000 tokens** total
(Layers 0–2 ≈ 1,300–1,600; Layer 3 ≈ 500–2,000; Layer 4 = the run material). If
a stage needs far more, it's probably doing more than one job — split it.

---

## Standard folder layout

```
<workspace>/
├── AGENTS.md                 # Layer 0+1: identity, folder map, routing
├── setup/
│   └── questionnaire.md      # one-time setup questions
├── _config/                  # Layer 3: answers to setup, stable config
├── shared/                   # Layer 3: reference reused by many stages
├── stages/
│   ├── 01_<verb>/
│   │   ├── CONTEXT.md        # Layer 2: this stage's contract
│   │   ├── references/       # Layer 3: reference for this stage only
│   │   └── output/           # Layer 4: this stage's product
│   ├── 02_<verb>/
│   └── ...
└── output/                   # (optional) final assembled deliverable
```

Rules for the layout:

- **Numbering encodes execution order.** `01_`, `02_`, `03_`… Reordering stages =
  renaming folders.
- **Name stages by their verb/job**, lower_snake_case: `01_research`,
  `02_script`, `03_production`. Not `01_first`, not `stage_one`.
- **`output/` folders are the handoff points.** Stage 02 reads
  `../01_<name>/output/`. Keep an empty `.gitkeep` in fresh `output/` folders so
  the structure survives copying.
- Adding a stage = adding a numbered folder. Removing one = deleting a folder.

---

## The stage contract (Layer 2)

Every `stages/NN_*/CONTEXT.md` has exactly these sections. This is the control
point of the whole system — the Inputs list is what stops the agent from loading
the entire workspace.

```markdown
# Stage NN — <Name>

## Inputs
- Layer 4 (working):   ../NN-1_<prev>/output/<file>     # what the last stage made
- Layer 3 (reference): ../../_config/<file>             # stable config
- Layer 3 (reference): references/<file>                # this stage's reference

## Process
Plain-language instructions for the single job this stage does. Reference the
input files by name. Be specific about the shape of the output.

## Outputs
- <file> -> output/                                      # what to write, where
```

Optional sections you may add when useful:

- **`## Verify`** — earlier-stage outputs to re-check for consistency, and the
  criteria. Use this for alignment-sensitive late stages (a proto-debugger).
- **`## Review`** — what the human should look at before continuing, and the
  kinds of edits that signal a *source* fix rather than a one-off patch.

---

## What goes in a script vs. the agent

Local scripts handle mechanical work that needs no judgement: moving files,
formatting, fetching data, stamping templates. The agent handles everything that
needs reading, deciding, or writing prose. If a step is deterministic and
boring, prefer a script and call it from the stage's Process.

---

## Quality checklist (use in stage 05)

A workspace is well-formed when:

- [ ] `AGENTS.md` names the workspace, maps the folders, and routes every
      plausible user request to a stage.
- [ ] Stages are numbered, verb-named, and each does exactly one job.
- [ ] Every stage `CONTEXT.md` has Inputs / Process / Outputs.
- [ ] Every Inputs entry tags each file as Layer 3 or Layer 4 and the path
      resolves to a real file or folder.
- [ ] Reference (Layer 3) and working artifacts (Layer 4) are not mixed in one
      folder.
- [ ] Each stage's declared output is the next stage's declared input — the chain
      has no gaps.
- [ ] Fresh `output/` folders exist (with `.gitkeep`) and start empty.
- [ ] `setup/questionnaire.md` collects everything `_config/` references.
- [ ] A new person could read the `CONTEXT.md` files top to bottom and understand
      the pipeline without running it.
