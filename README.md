# Website-Builder

An **agent workspace** that turns a description of a website into a finished,
distinctively designed static site — and refuses to ship AI slop while doing it.

It is not a prompt, and it is not tied to one AI vendor. It is a six-stage
pipeline with a design contract, human review gates, and a memory of what it has
already built, so the tenth site doesn't look like the first. One folder, one
contract (`AGENTS.md`), and it runs the same under **Claude Code, Codex CLI,
Gemini CLI, Grok CLI, Cursor — or any coding agent that can read and write
files**. Agents with more capabilities use them; agents with fewer degrade
gracefully; the quality bar never moves.

```
01_brief ──► 02_sitemap ──► 03_content ──► 04_design ──► 05_build ──► 06_qa
◆checkpoint   →auto          →auto          ◆checkpoint   →auto       ◆checkpoint
purpose       structure      copy           direction     code        ship
```

`◆ checkpoint` = the agent stops and discusses it with you. `→ auto` = it runs
the stage, sanity-checks the result and continues, pausing only if something
looks wrong. Never a one-prompt black box; never babysat step by step.

---

## Quickstart

1. **Clone it and open the folder in your agent.**

   ```
   git clone <this repo> website-builder
   cd website-builder
   ```

   | Your agent | Start it with | It reads |
   |---|---|---|
   | Claude Code | `claude` | `CLAUDE.md` → imports `AGENTS.md` |
   | Codex CLI | `codex` | `AGENTS.md` directly |
   | Gemini CLI | `gemini` | `GEMINI.md` → points at `AGENTS.md` |
   | Grok CLI | `grok` | `GROK.md` → points at `AGENTS.md` |
   | Cursor / other | open the folder | `AGENTS.md` (tell it to read it first if it doesn't automatically) |

   `AGENTS.md` is the whole contract; the other files are thin pointers into it.
   You can even switch agents mid-build — state lives in `SESSION.md` and the
   stage outputs, not in any one agent's memory.

2. **Fill in `setup/questionnaire.md`** once — your name, default stack, deploy
   preference. The agent writes the answers into
   `_config/website-builder-config.md`.

3. **Say what you want**, in plain language:

   > Build a website for **Harbourline Coffee**, a specialty roastery in
   > Falmouth. The audience is cafés and restaurants buying wholesale beans. The
   > main goal is to get them to request a sample box. It should feel precise
   > and unfussy — not cosy-artisan.

4. **Talk to it at the checkpoints** (brief, design, QA). Say "go" to move on,
   or "show me the sitemap", "gate everything", or "run to QA" to change the
   rhythm.

5. The finished site lands in `sites/<name>/`. It is plain static files — open
   `index.html`, or host it anywhere.

### What you need

| | |
|---|---|
| **A coding agent** | Any harness whose agent can read/write files in a folder. That's the only hard requirement. |
| **Node 18+** | Only for `check-slop-gates.mjs`, the mechanical gate in stage 06. Without it, stage 06 still runs — you check those items by hand and lose the automatic catch. |
| **A way to look at the built site** | Stage 06 reviews the *rendered* page, not the source. If your agent has a browser/screenshot tool (Claude-in-Chrome, a Playwright MCP), it drives the review; if not, the agent serves the site and directs **your** eyes precisely. Both paths are first-class — see `shared/design/visual-review.md`. |

The agent probes its own capabilities at build start (`AGENTS.md` § Run modes):
sub-agent spawning, browser access, web fetch, image generation. Each capability
unlocks a richer path; none is required.

---

## What makes it not-slop

Design quality is enforced at the **contract** level, not left to the model's
mood. `shared/design/` binds every build:

- **Banned by default:** Inter/Roboto as display type, purple-to-blue gradients
  on white, the hero → three feature cards → CTA rhythm, stock-photo-shaped
  filler, emoji as iconography, and copy that says nothing at length.
- **`shared/design/anti-slop-rules.md`** — the non-negotiables, with the
  reasoning.
- **`shared/design/pre-ship-gates.md`** — the gates stage 06 runs before
  anything ships.
- **`shared/design/check-slop-gates.mjs`** — a script that mechanically checks a
  built site for the catchable violations (banned fonts, gradient tells,
  contrast).
  ```
  node shared/design/check-slop-gates.mjs sites/your-site
  ```
- **`sites/variety-ledger.md`** — cross-build memory. Stage 04 reads every past
  build's type genre, colour temperament and macrostructure, and has to move a
  real distance from the last two. This is the part that stops build #4 looking
  like build #1.
- **`shared/content/copywriting.md`** — the copy method. The pipeline **never
  invents facts about a real business**; anything it doesn't know comes back as
  an explicit `[NEEDS: …]` marker for you to fill.
- **`shared/legal/`** — privacy / cookies / terms / accessibility pages ship by
  default, with a working consent script. Templates, not legal advice.

---

## The example

One sample site, a fictional company, lives in **`examples/fabric-first/`** —
four pages for a Devon retrofit / low-carbon-heating firm. Cabinet Grotesk, deep
signal green, a drawn building cross-section as the signature device. Every
placeholder is declared in the colophon; the phone number is an Ofcom drama
number reserved for fiction.

> **Be clear about what it is.** It demonstrates the *design bar* — what
> clearing the anti-slop gates looks like — not a recorded end-to-end pipeline
> run. The first site you build yourself is that evidence, and if it doesn't
> hold up, that's a bug worth an issue.

```
cd examples/fabric-first && python -m http.server 8731
```

---

## How it's laid out

| Path | What it is |
|------|-----------|
| `AGENTS.md` | The contract: identity, rhythm, run modes, routing, hard rules |
| `CLAUDE.md` / `GEMINI.md` / `GROK.md` | Per-harness pointers into `AGENTS.md` |
| `SESSION.md` | Live build state — how a fresh session (any agent) resumes mid-build |
| `setup/` | The one-time questionnaire |
| `_config/` | Your answers, the model-tier matrix, deploy policy |
| `_intake/` | Drop a client's brief, assets, or design references here before stage 01 |
| `_clients/` | Queued briefs, one folder per client (git-ignored, never committed) |
| `shared/` | The conductor recipe, design contract, copy method, QA gates, legal templates |
| `stages/01…06/` | The pipeline. Each stage has a `CONTEXT.md` (its job) and an `output/` |
| `sites/` | Finished sites, the registry, and the variety ledger |

**The one rule that makes it work:** each stage reads only what its `CONTEXT.md`
lists, does only its own job, and writes only to its own `output/`. The folder
structure *is* the orchestration — and it's what keeps context (and cost) small.

---

## Cost

If your agent can spawn sub-agents (**conductor mode**), each stage runs on the
cheapest model tier that can do it — cheap for the sitemap, standard for
brief/copy/build/QA, strongest for exactly one stage (design direction) on a
standard build. The matrix is `_config/model-routing.md`, written in tiers so it
maps to any model family — and you can flatten it to one model if you'd rather
not think about it. Single-model harnesses skip all of this and still get the
full pipeline.

---

## Licence

MIT — see [`LICENSE`](LICENSE). The example site is fictional; the design
references and font names in `shared/design/` are pointers to third-party work,
not redistributions of it.
