# LumaClaw Resume Checklist

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

### 1. Continue the first functional UI slice with a narrow explanation-panel follow-up
Goal:
- make the SoulBond card easier to interpret
- help the UI answer why the current state / tone / latest daily result look the way they do
- improve demo legibility without expanding into a dashboard

Current finding:
- the first SoulBond overview-card implementation pass is already landed
- the next product-facing gap is explanation, not state visibility from scratch
- the follow-up should stay narrow and preserve runtime vs preview honesty

### 2. Use the normal acceptance format only for true gaps and bounded follow-ups
When the explanation-panel pass lands (or if it fails for a real product/code reason), review with:
- task title
- files changed
- implementation strategy
- tests/re-review
- remaining risks
- acceptance conclusion
- score
- next-step suggestion

### 3. Keep richer runtime data exposure as a later follow-up, not tonight's main move
Current status:
- explanation is the next cleaner step than broadening runtime surface immediately
- richer runtime data exposure may still matter later, but it is not the current narrow follow-up

Decision rule:
- prefer explanation-panel polish first
- keep scope functional and explanatory
- do not drift into avatar / voice / decorative work yet

---

## Planned sequence from the current reality state

### A. The first functional UI slice is now landed
- the overview/status-card path is accepted as the first product-facing SoulBond slice
- do not reopen slice selection unless reality changes

### B. Next, add the narrow explanation-panel follow-up
- improve interpretability of current SoulBond state
- keep runtime vs preview honesty
- keep the pass bounded

### C. Only then consider richer runtime data exposure or the next explanatory layer
- do not jump straight to broad dashboard work
- do not reopen old boundary tasks unless a real defect is found

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

> Keep the first SoulBond UI slice as landed, then implement the narrow explanation-panel follow-up so the overview helps explain why the current state and tone look the way they do.
