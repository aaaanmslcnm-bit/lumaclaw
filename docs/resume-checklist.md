# SoulClaw Resume Checklist

_Last updated: 2026-03-10 18:18 (Asia/Shanghai)_

This file is the short restart checklist for the current work session.
Use it when resuming after server/provider instability.

---

## Current project state

### Already accepted
- `STATE_EVOLUTION.md` draft: **accepted**
- `affectTone` MVP (`soulbond-tone-mapping-mvp-retry`): **accepted**
- `soulbond-demo-flow-polish`: **accepted**
- Tone-boundary scouting result: **accepted**
  - preferred first real reply boundary: `src/auto-reply/reply/get-reply-run.ts`
- Codex prompt-delivery chain (`prompt-file` / stdin path): **fixed locally and dispatch-smoke-tested**

### Important verified infrastructure state
- `codex_run.py` supports `--prompt-file`
- `dispatch_codex_code.py` supports `--prompt-file`
- dispatch smoke test returned `DISPATCH_OK`
- long multiline task prompts should now be sent file-backed from the first shell hop

### Telegram Yukino status
- Do **not** spend more time on Telegram Yukino right now
- Near-term plan: reduce/pause long conversations there
- Later plan: give Telegram Yukino a lighter model/runtime path before resuming deep long-form chats

---

## Highest-priority next actions when server is stable

### 1. Re-dispatch the real reply-boundary task
Task to send:
- `soulbond-tone-reply-boundary-mvp`

Goal:
- integrate `getSoulBondToneFromState()` into the first real reply boundary
- preferred boundary: `src/auto-reply/reply/get-reply-run.ts`

Notes:
- a previous attempt failed because the outer dispatcher was still launched with inline `-p`, so the prompt was split before `task-prompt.txt` was written
- the dispatcher now supports `--prompt-file`, and the dispatch-level smoke test passed
- keep scope tight
- no global system prompt rewrite
- no avatar/voice/UI
- no migration work

### 2. Review the result with the normal acceptance format
When Codex returns, review with:
- task title
- files changed
- implementation strategy
- tests/re-review
- remaining risks
- acceptance conclusion
- score
- next-step suggestion

### 3. Re-run the functional UI scout only if needed
Current status:
- the previous UI scout failed / not accepted
- failure mode: it drifted into workspace-wide/context-heavy search instead of staying repo-local and UI-focused

If re-running, harden it further:
- repo-local only
- no workspace-wide search
- no AGENTS / MEMORY / workspace file trawling
- read-only
- must answer only: best first functional UI slice for current stage
- if that still looks noisy, Yukino should make the first-slice decision directly instead of delegating it

---

## Planned sequence after the next successful Codex task

### A. If `soulbond-tone-reply-boundary-mvp` is accepted
Then move to:
- first functional UI slice decision
- first functional UI slice implementation

### B. If the boundary task fails due to server/provider instability only
Then:
- do not redesign the task immediately
- retry once the upstream route is stable

### C. If the boundary task drifts in scope
Then:
- tighten the spec further
- add changed-file gate
- re-dispatch only after narrowing the allowed files again

---

## Working assumptions to preserve

- Yukino leads
- Codex implements bounded tasks
- Yukino reviews before user delivery
- automatic Codex callback is **not** final delivery
- medium delegated tasks should use the light spec template:
  - `docs/light-spec-template.md`

---

## Do not get distracted by these right now

- avatar / illustration
- voice integration
- desktop shell / standing character work
- broad repo cleanup
- Telegram Yukino deep repair
- speculative multi-agent org redesign

These can wait until the current Phase 2 foothold is stable.

---

## One-line restart summary

Next real move after server stability:

> Re-dispatch `soulbond-tone-reply-boundary-mvp`, review it, then choose/build the first functional UI slice.
