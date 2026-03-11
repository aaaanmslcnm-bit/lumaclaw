# SoulClaw — Next 7 Days Plan

This is the near-term execution plan for the current SoulClaw stage.

Current stage assumption:
- Phase 1 is being closed out
- Phase 2 has started through the first visible behavior-mapping work (`affectTone`)
- the immediate goal is to turn the internal SoulBond loop into a clean, demoable, user-visible behavior story

This plan is intentionally practical.
It is not a dream roadmap.
It is the next 7 days of focused work.

---

## Day 1 — Close open review loops and stabilize the current branch

### Goal
Leave the project with a clean understanding of what has landed and what still needs direct Yukino work.

### Main work
- Review the `STATE_EVOLUTION.md` draft and either accept it as-is or tighten wording directly
- Finalize the acceptance state of Priority 1 work
- Review the `affectTone` MVP implementation and decide whether it fully lands or needs one direct follow-up edit
- Record the exact current project state in the normal acceptance format

### Done means
- Priority 1 is explicitly closed
- the current tone-mapping MVP has a clear review outcome
- no ambiguity remains about what is "done enough" vs still pending

---

## Day 2 — Connect `affectTone` to one real reply boundary

### Goal
Move `affectTone` from status/demo visibility into one real assistant-behavior path.

### Main work
- Choose one bounded reply-generation or persona boundary
- Apply `getSoulBondToneFromState()` there in the smallest possible way
- Keep scope limited to tone only
- Add focused tests for the chosen integration point

### Done means
- SoulBond tone is not only visible in status output
- at least one real user-facing reply path can behave differently based on `affectTone`

---

## Day 3 — Make the demo flow obvious and repeatable

### Goal
Turn the current internal logic into a demo flow that can be shown without long explanation.

### Main work
- tighten the `soulbond-demo` path
- make the order of outputs easier to follow
- ensure the demo clearly shows:
  - transcript/input
  - score/result
  - state change
  - tone/behavior consequence
- remove avoidable rough edges in presentation

### Done means
- there is a clear step-by-step SoulClaw demo flow
- the demo tells a coherent story without needing heavy narration

---

## Day 4 — Define the minimum product-facing UI slice

### Goal
Decide what the first functional UI should actually show.

### Main work
- write the smallest UI scope that is worth building now
- likely choose from:
  - SoulBond state card
  - stage/tone panel
  - recent change explanation panel
  - demo comparison surface
- explicitly reject premature illustration/avatar scope for this slice

### Done means
- the first UI slice is defined by purpose, not by aesthetics
- the team knows what to build next without guessing

---

## Day 5 — Build the first functional UI slice

### Goal
Create the first product-facing surface that makes SoulClaw's internal state legible.

### Main work
- implement the agreed Day 4 UI slice
- keep it functional and explanatory
- do not drift into decorative work
- ensure it reflects real data, not mocked product fantasy

### Done means
- there is a first UI surface that makes SoulBond easier to understand at a glance
- it supports demo use, not just internal engineering satisfaction

---

## Day 6 — Demo polish + cloud test preparation

### Goal
Prepare for a serious private cloud trial and external demo capture.

### Main work
- improve the demo path where it still feels clumsy
- identify what must be true for a private cloud deployment test
- prepare a minimal cloud checklist:
  - what service runs where
  - what config is needed
  - what should be kept local vs remote
- confirm the product story is strong enough to record/show

### Done means
- a private cloud dry run is ready or nearly ready
- demo capture can happen without improvising the whole explanation live

---

## Day 7 — Review week output and decide the next branch

### Goal
Avoid blind momentum. End the week with a real project judgment.

### Main work
- review what actually landed during the week
- score the result against the current roadmap stage
- decide whether the next step should be:
  - deeper behavior mapping
  - more product-facing UI
  - private cloud validation
  - early illustration/visual design prep
- document the answer clearly

### Done means
- SoulClaw has a stable handoff into the next week
- the project does not drift just because there is momentum

---

## What not to let this week become

This 7-day window should **not** turn into:
- broad avatar work
- visual polish without behavior progress
- random fork-wide cleanup detours
- infrastructure wandering for its own sake
- endless process tweaking while product movement stalls

The point of this week is:

> **turn SoulClaw from "internally interesting" into "externally understandable."**

---

## Success condition for the next 7 days

At the end of this plan, SoulClaw should have:
- a closed-out SoulBond state foundation
- one real tone-based behavior mapping path
- one functional product-facing UI slice
- one clean demo flow
- a credible path to private cloud testing

If that is achieved, SoulClaw stops looking like a strong internal prototype and starts looking like a product that is preparing to be shown seriously.
