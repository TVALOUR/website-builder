# Conductor mode — one sub-agent per stage

The run mode for harnesses that can spawn sub-agents (`AGENTS.md` § Run modes). No spawn
tool → this file does not apply; run solo mode and ignore everything below.

In conductor mode you — the session the human started — do not run the stages yourself.
You **spawn one sub-agent per stage**, hold the checkpoint conversations yourself, and
stay lean. The rhythm (which stages stop, which auto-proceed) is defined once in
`AGENTS.md` and is identical in both modes; conductor mode changes only *who executes a
stage*, never *where the human is consulted*.

## Flat hierarchy

```
conductor (you)
 ├─ 01 discover sub-agent   (does stage 01, returns; spawns nothing)
 ├─ 02 architect sub-agent
 ├─ …
 └─ 07 launch sub-agent
```

Only the conductor spawns. Stage sub-agents are leaves: they read, do their one job,
write their stage's outputs into `builds/<slug>/`, return a short summary, and exit.

## Model tiers per stage

Speak in tiers so it maps to any model family: **cheap** (your fastest small model),
**standard** (the everyday default), **strongest** (your best reasoning model). Run the
conductor itself on a strong model — it holds the gates.

| Stage | Tier | Why |
|---|---|---|
| 01 discover | standard | The interview needs judgment about what to push on. |
| 02 architect | cheap | Mechanical structure; standard only for a genuinely complex IA. |
| 03 write | standard | Copy quality is the product — never below the workhorse tier. |
| 04 design | **strongest** | The highest-judgment stage. The one place the top model earns its cost. |
| 05 build | standard | Execution — design is locked upstream. Strongest for framework or animation-heavy builds. |
| 06 verify | standard | The gate is mechanical; the eyes-on half needs a competent reviewer. |
| 07 launch | standard | Checklists plus real-world care (DNS, redirects). |
| 08 revise | **never spawned** | The conductor holds this one directly — see step 7 below. A sub-agent handed a paraphrase of the request is how the record stops being evidence. If it is somehow delegated anyway: standard, never cheap. |

If the harness cannot set a model per spawn, spawn anyway: the context isolation alone —
each stage's heavy reading staying out of the conductor — is worth it. If it exposes a
reasoning-effort knob instead, run 04 high and 02 low.

## The spawn recipe

One sub-agent call per stage. Your harness's general-purpose worker (file read/write,
search, shell). The prompt must stand alone — a sub-agent has no memory of this
conversation — and it points at files rather than pasting their contents:

```
You are the stage <NN> sub-agent for the website-builder repo at:
  <absolute path to the repo root>
The active build is builds/<slug>/.

Do ONLY stage <NN>. Steps:
1. Read AGENTS.md — it binds every stage.
2. Read stages/<NN>_<name>/CONTEXT.md — your full contract (Inputs / Process / Outputs).
3. Read ONLY the inputs that contract lists (prior stages' outputs are in builds/<slug>/).
4. Do the stage's one job. Write ONLY your stage's outputs into builds/<slug>/.
5. Do NOT start another stage, spawn agents, promote, push or deploy.

Reply with a summary under 200 words: what you produced and the exact paths, the key
decisions a human must check at the gate, and anything unresolved or [NEEDS: …].
```

For **stage 01** add: the interview happens in the *conductor's* conversation, not the
sub-agent's — either run 01 inline (common), or have the sub-agent draft the question
batches for you to relay. For **stage 04** name `builds/<slug>/references.md`,
`shared/references.md`, `shared/directions.md` and `shared/design.md` in the prompt so a
cold agent cannot miss them. For **stage 06** name `shared/review.md` and require the
gate's verbatim output in the summary.

## The conductor's loop

1. **01 discover — stop.** Vision and facts, with the human. Lock `brief.md` + `facts.md`.
2. Auto-proceed **02 architect → 03 write**. Spawn each on its tier, sanity-check the
   summary, post a one-line note, continue. Pause only if a summary looks wrong.
3. **04 design — stop.** Spawn on the strongest tier. It returns the direction, the
   rejected alternatives, and rendered samples; you hold the design conversation and
   re-spawn or adjust until the human locks `design.md`.
4. Auto-proceed **05 build**. Check the build notes and that the sub-agent ran the gate
   on its own output.
5. **06 verify — stop.** Gate plus the eyes-on half per `shared/review.md`; present the
   verdict; the human approves.
6. **07 launch — stop.** Redirects, DNS order, ownership, the test enquiry. The human
   launches; nothing is pushed or deployed without their explicit word.
7. **08 revise — stop, every time, for the rest of the site's life.** One round per
   request. Do not spawn a sub-agent to "just fix" something on a live site: the round is
   opened with the client's own words in front of you, and a sub-agent handed a paraphrase
   is exactly how the record stops being evidence.

At every gate, update `builds/<slug>/STATE.md` — that file, not your memory, is what
lets a fresh session (or a different harness) resume mid-build.

## When to skip the sub-agents

A **simple one/two-page build**: six cold starts cost more than they save — run the
stages inline on one standard-tier session instead. The stops at 01, 04, 06 and 07 are
still mandatory. Inline or spawned, the contract is the same.
