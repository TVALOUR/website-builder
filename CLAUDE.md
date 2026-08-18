# Website-Builder — Claude Code entry

@AGENTS.md

## Claude Code notes (capability answers, pre-probed)

- **Sub-agents:** if the Agent tool is available in your session (it normally
  is), default to **conductor mode** (`shared/conductor.md`), spawning
  `general-purpose` sub-agents with the `model` parameter set per
  `_config/model-routing.md`; without it, run solo mode.
- **Rendered-page review:** Claude-in-Chrome — or any browser/screenshot tool
  actually present in your session — is the stage-06 default reviewer per
  `shared/design/visual-review.md`. Probe, don't assume: never report a review
  rung that didn't run.
- **Optional skills:** if `hallmark` / `frontend-design` are installed they add
  depth at stages 04 and 06 — the vendored contract in `shared/design/` stands
  alone and is the binding floor either way; never fake a skill's output.
