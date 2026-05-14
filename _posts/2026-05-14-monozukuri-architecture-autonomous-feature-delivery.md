---
layout: post
title: "Monozukuri: architecture of an autonomous feature delivery system"
date: 2026-05-14
categories: [ios, automation, architecture, ai]
tags:
  [
    monozukuri,
    bash,
    automation,
    architecture,
    agents,
    ai,
    claude,
    feature-delivery,
    orchestration,
    worktree,
  ]
---

This post is for anyone who wants to understand what's running under the hood — not just what Monozukuri does, but how it does it and where there's still room to grow.

AI agents for code have existed for a while now. What's still missing in most implementations is **orchestration**. An agent called once, in interactive mode, that you supervise line by line — that's very different from a system that picks up an entire backlog, isolates each item, runs a complete pipeline per feature, validates every artifact against a schema, handles failures in a stratified way, and opens real PRs.

Monozukuri is that orchestration layer. It's not an agent. It calls agents.

Let's do it.

## Stack and structure

```
Bash 4+        orchestration, adapters, validators, gates
Node 18+ / Ink interactive TUI + JS adapters
Bats           tests (unit, integration, conformance, properties)
```

The directory structure mirrors well-defined responsibilities:

```
lib/
  agent/      adapter contract + per-agent implementations
  core/       loop, worktree, exit-codes, cost, router
  run/        pipeline, validators, retry, shutdown
  schema/     validate.sh — the reprompt loop
  prompt/     phase templates + render.sh
  memory/     3-layer learning store
  ingest/     backlog adapters (markdown, GitHub, Linear)
```

Each subsystem has clear boundaries. The pipeline calls the adapter. The adapter calls the agent. The schema validator calls back into the pipeline if the artifact is invalid. None of these layers knows about the others beyond the interface it consumes.

## The 6-phase loop

For each feature in the backlog, Monozukuri creates an **isolated Git worktree** (`.worktrees/<feature_id>/`) and runs:

```
PRD → TechSpec → Tasks → Code → Tests → PR
```

Each phase produces an artifact. Each artifact is validated against a schema before moving forward. A schema failure doesn't abort — it triggers a **reprompt loop**:

```bash
# lib/schema/validate.sh (simplified)
for attempt in $(seq 1 "$MONOZUKURI_SCHEMA_MAX_REPROMPTS"); do
  agent_run_phase "$phase" "$prompt"
  if schema_validate "$artifact"; then
    break
  fi
  prompt="$(build_fix_prompt "$validation_errors" "$artifact")"
done
```

The agent receives the malformed output back along with the exact validator error messages. Up to 3 attempts by default, configurable. If it exhausts all attempts, it pauses and escalates to the operator.

Schemas live in `lib/schema/` and cover heading structure, required fields, and data types. The validator accepts **heading aliases** to be tolerant without being permissive — `## Problem`, `## Problem Statement`, and `## Background` are all accepted for the PRD's problem section. Rejecting valid content over capitalization would be a validator bug, not an agent error.

## The adapter contract

Every agent implements 6 functions (ADR-012):

```bash
agent_capabilities        # reports what the adapter supports
agent_run_phase           # runs a phase
agent_auth_check          # verifies authentication
agent_estimate_tokens     # estimates cost before running
agent_format_prompt       # formats the prompt for the specific agent
agent_parse_output        # extracts the artifact from raw output
```

The reference implementation is `lib/agent/adapter-claude-code.sh`. The other adapters (codex, gemini, kiro, aider) follow the same contract — the difference is that Claude Code uses native `mz-*` skills (bundled `SKILL.md` files with instructions), while others receive rendered prompts via `lib/prompt/render.sh`.

This has real implications: skills are more consistent because the agent receives structured, predetermined context. Rendered prompts work, but artifact quality is less stable in complex projects.

The adapter also declares its capabilities:

```json
{
  "supports": {
    "session_continuity": true,
    "streaming": true,
    "token_counting": true
  }
}
```

`session_continuity: true` is what enables multi-turn mode — described below.

## Isolation per worktree

Each feature runs on a separate Git branch and worktree:

```bash
git worktree add ".worktrees/$feat_id" -b "${BRANCH_PREFIX}/$feat_id"
```

The agent operates exclusively inside that worktree. It has no access to the main project directory during execution. This guarantees that failures in one feature don't contaminate the state of others running in parallel.

Per-feature state lives at:

```
.monozukuri/runs/<run_id>/<feat_id>/
  state.json           # current phase, status, attempts
  results.json         # validated artifacts
  cost.json            # estimated tokens per phase
  memory/              # feature-specific learning
  logs/                # raw agent output per phase
```

## 3-layer memory system

```
Feature-level    .monozukuri/runs/<run_id>/<feat_id>/memory/
Project-level    .monozukuri/learned/
Global-level     ~/.claude/monozukuri/learned/
```

After each completed feature, the system extracts patterns — recurring schema errors, solutions that worked, conventions the agent discovered in the code — and promotes them to the appropriate level. A convention that appears in 3 features of the same project moves up to project-level. Something generic enough moves up to global.

On the next run, this context is injected into the prompt via `workflow_memory_prepare`, which builds a compact context package for each phase. The agent doesn't start from scratch — it starts with what's already been learned.

## Multi-turn session (ADR-017)

This was the most significant improvement in v1.49.

The problem: each phase was a cold `claude --print` process. Six phases × ~7K re-bootstrap tokens per phase = ~42K tokens wasted per feature. In a typical 120K token context, that's 30–40% pure overhead.

The solution: phases are **turns in a single session** per feature.

```bash
# Turn 1 (PRD)
claude --session-id "$SESSION_UUID" --print "$prd_prompt"

# Turns 2–6
claude --resume "$SESSION_UUID" --print "$continuation_prompt"
```

The UUID is stored at `<run_dir>/<feat>/session.json`. The agent accumulates context naturally — artifacts from prior phases don't need to be re-injected via Read tool because they're already in the session history.

Schema reprompts are also continuation messages in the same session, not cold new processes.

Still opt-in (`MONOZUKURI_MULTI_TURN=1`) while I accumulate evidence of 25%+ token reduction. Once validated across 3 real features, the default flips to on in v1.50.0.

There's a documented trade-off: skills (`mz-*`) are bypassed in multi-turn mode because each `--agent <skill>` restarts the bootstrap. Opting into multi-turn trades skill encapsulation for token savings. `monozukuri doctor` warns about this explicitly.

## Quality gates

The release gate has 7 layers (`.qa/release-gate.sh`):

| Layer | What it checks                                         | CI?           |
| ----- | ------------------------------------------------------ | ------------- |
| 1     | Linting and shellcheck                                 | ✅            |
| 2     | Adapter contract tests                                 | ✅            |
| 3     | Property tests (artifacts per schema)                  | ✅            |
| 4     | Backwards compatibility                                | ✅            |
| 5     | Live canary (real claude call)                         | ❌ local only |
| 6     | Scale soak (SLO: 3 projects × 5 features × ≤30% pause) | ❌ local only |
| 7     | Conformance (replay vs live drift)                     | ❌ local only |

CI runs layers 1–4 at zero cost using the **record-replay** pattern: fixtures at `.qa/fixtures/recordings/<agent>/<phase>.{md,json,stream-json}` are replayed by the mock binary `replay-claude` instead of calling the real API. CI stays at $0 per run.

Layers 5, 6, and 7 run locally before a release. The Layer 6 live evidence for v1.0 was FitToday-cms overnight — ~10 real features, PRs opened, within budget.

## Where there's still room to grow

### 1. Real cost vs estimated cost

`lib/core/cost.sh` today operates on **estimates** — it calculates tokens by character count and a pricing table in `config/pricing.yaml`. The Claude API's `stream-json` artifact has the `usage` field with real billing values, but parsing it was deferred to ADR-018.

The implication: the `$50/night` SLO gate is an estimated gate, not a real measurement. It works because the estimates are conservative, but precision will improve when ADR-018 is implemented.

### 2. Conformance recordings for Codex and Gemini

The recordings at `.qa/fixtures/recordings/codex/` and `/gemini/` are today **seeded from Claude Code recordings** — they're not real responses from those agents. This means Layer 7 (drift check) doesn't detect actual divergences in Codex or Gemini output.

To fix this, just run `make rerecord-fixtures` with the specific agent CLI installed and authenticated. The recordings capture the real format, and the conformance suite starts detecting true regressions.

### 3. Skill parity for tier-2 adapters

`mz-*` skills are Claude Code only. Codex and Gemini receive rendered prompts, which are less stable in complex projects. The solution would be a portable skill format — essentially a `SKILL.md` that any adapter can interpret before making the call.

This is planned for v1.2, but the architecture already supports it: `agent_format_prompt` can prefix any prompt with `SKILL.md` content if the adapter declares `"skill_injection": true` in `agent_capabilities`.

### 4. Multi-turn for other adapters

ADR-017 implements session continuity only for Claude Code because `--session-id`/`--resume` is specific to the Claude CLI. Codex has a similar mechanism (`--conversation-id`), but it hasn't been mapped into the adapter yet.

The contract is already ready — `agent_capabilities` returns `session_continuity: false` for tier-2, and the pipeline degrades gracefully. The next step is implementing the equivalent in `adapter-codex.sh`.

### 5. Implicit dependency detection

Today the system detects **declared** dependencies between features (via `deps` in the backlog). Implicit dependencies — two features touching the same file that will create a merge conflict — are detected via static analysis (ADR-015, Gap 7), but the automatic resolver is still limited.

The improvement would be a conflict predictor that analyzes TechSpecs before running any code and orders features to minimize collisions, or pauses automatically when a collision is inevitable.

### 6. Opt-in telemetry with real data

The system emits events via `monozukuri_emit` (`lib/cli/emit.sh`) but those events only exist locally — there's no aggregation. Implementing a simple opt-in telemetry backend would give access to real usage metrics: which phases pause the most, which stacks have the highest success rate, where the token budget blows up.

That would feed the roadmap with data instead of intuition.

## The honest take on the current state

Monozukuri works. It worked overnight on a real project. But it's a v1.0 — it has rough edges.

The reference adapter is Claude Code because it's the only one fully validated end-to-end. The other adapters work, but with fewer guarantees. Cost is estimated, not measured. The 3-project SLO was validated on 1. The multi-turn system is opt-in because it still needs more evidence.

None of these limitations are hidden. Each one has an ADR, a gap number, or a note in the README. Part of what I care about in this project is that honesty about what's ready and what's still work in progress.

## Installation

```bash
brew tap viniciuscarvalho/tap
brew install monozukuri

cd your-project
monozukuri init
monozukuri run --dry-run
monozukuri run
```

Repository: [github.com/Viniciuscarvalho/monozukuri](https://github.com/Viniciuscarvalho/monozukuri)

If you run it on any project and want to compare notes on pause rate, token spend, or schema failures — reach out.

---

_ものづくり — the art of making things, with rigor._
