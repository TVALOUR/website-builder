# Website-Builder — Claude Code entry

@AGENTS.md

## Claude Code notes (capability answers, pre-probed)

- **Sub-agents:** you have the Agent tool → default to **conductor mode**
  (`shared/conductor.md`), spawning `general-purpose` sub-agents with the `model`
  parameter set per `_config/model-routing.md`.
- **Rendered-page review:** Claude-in-Chrome (or any browser/screenshot tool you
  have) is the stage-06 default reviewer per `shared/design/visual-review.md`.
- **Optional skills:** if `hallmark` / `frontend-design` are installed they add
  depth at stages 04 and 06 — the vendored contract in `shared/design/` stands
  alone and is the binding floor either way; never fake a skill's output.
