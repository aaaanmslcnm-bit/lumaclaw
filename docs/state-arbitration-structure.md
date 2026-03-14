# LumaClaw — State Arbitration Structure

_Last updated: 2026-03-13_

This file defines how LumaClaw settles project-truth disputes when docs, plans, and code drift out of sync.

The goal is simple:

> stop stale tactical documents from overruling current code reality.

---

## Authority Order

When sources disagree, use this order:

1. **Code + adjacent tests**
   - runtime behavior
   - data paths
   - nearby tests that prove/contradict behavior
2. **`CURRENT_STATE.md`**
   - reality-layer summary
3. **Acceptance ledger + accepted decision docs**
   - `docs/acceptance-log.md`
   - for example `docs/first-functional-ui-slice.md`
4. **`README.md`**
   - public-summary truth, not tactical detail
5. **Tactical docs**
   - `docs/resume-checklist.md`
   - `docs/next-7-days-plan.md`
6. **Chat memory / prior assumptions**
   - useful context, never final truth

If tactical docs disagree with code reality, the tactical docs are stale and must be updated before more phase-sensitive dispatch.

---

## Required Status Labels

Use only these labels when judging current state:

- `landed`
- `landed-with-small-fix`
- `partial`
- `planned`
- `stale`
- `superseded`

Avoid vague wording like:
- “probably done”
- “almost there”
- “maybe should”

---

## Current Arbitration Questions

For the current LumaClaw review round, answer these exact questions:

1. Is the first real `affectTone` reply-boundary path already `landed`, `landed-with-small-fix`, or still only `partial`?
2. Which current project docs are now `stale` or lagging behind repo reality?
3. What is the correct first functional UI slice for the current stage?
4. What should the next bounded implementation move be?

---

## Required Repo-Local Evidence Set

Read these first unless a truly necessary adjacent file is required:

### Reality / planning docs
- `CURRENT_STATE.md`
- `README.md`
- `docs/resume-checklist.md`
- `docs/next-7-days-plan.md`
- `docs/first-functional-ui-slice.md`

### SoulBond / reply-boundary code
- `src/soulbond/tone.ts`
- `src/soulbond/store.ts`
- `src/auto-reply/reply/get-reply-run.ts`
- `src/auto-reply/reply/get-reply-run.media-only.test.ts`
- `src/auto-reply/reply/agent-runner-execution.ts`
- `src/auto-reply/reply/followup-runner.ts`

### UI slice evidence
- `ui/src/ui/components/soulbond-status-card.ts`
- `ui/src/ui/views/overview.ts`
- `ui/src/ui/views/overview.soulbond.test.ts`

---

## Constraints

- **Read-only** arbitration
- **Repo-local only**
- No workspace-wide trawling
- No AGENTS / MEMORY / personal workspace files
- No new feature design outside the current questions
- No broad roadmap rewriting
- No roleplay-heavy "meeting theater"

---

## Required Output Format

Return exactly these sections:

### REPO TRUTH
- 3-6 bullets of what is actually landed

### STALE OR LAGGING DOCS
- bullets with file path + why it is stale/lagging

### CURRENT VERDICTS
- `affectTone reply boundary: <status>`
- `first functional UI slice: <decision>`
- `current project stage: <one-line summary>`

### NEXT BOUNDED MOVE
- one recommended next implementation move
- why this move is correct now
- what should explicitly wait

### CONFIDENCE
- `high | medium | low`
- short reason

---

## Ledger Writeback Rule

A state-arbitration result is not complete until the judgment is written into `docs/acceptance-log.md`.

If the arbitration changes current project truth or next-step ordering, also sync the relevant state docs:
- `CURRENT_STATE.md`
- `docs/resume-checklist.md`
- `docs/next-7-days-plan.md` (when still directionally useful)

## Default Arbitration Rule

If the review finds that code reality has already moved ahead of a tactical plan, do **not** recommend reopening the old task by default.

Instead:
1. mark the tactical doc as stale
2. write the judgment into the acceptance ledger
3. close the state drift
4. move to the next bounded implementation step
