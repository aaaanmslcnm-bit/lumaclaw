# LumaClaw — Next 7 Days Plan

This is the near-term execution plan for the current LumaClaw stage.

Current stage assumption:
- the public project identity is now **LumaClaw**, not SoulClaw
- the repository is in a baseline-hardening and alignment phase
- the immediate goal is to make the public repo trustworthy, internally consistent, and easier to explain
- product-surface work should continue only when it does not outrun baseline stabilization

This plan is intentionally practical.
It is not a dream roadmap.
It is the next 7 days of focused work.

---

## Day 1 — Close the current PR stabilization loop

### Goal
Leave the main branch/PR path in a state where the remaining failures are explicit, reproducible, and no longer mixed with migration-noise confusion.

### Main work
- review the latest PR/CI run after the current workflow fixes
- classify any remaining failures into:
  - real code/runtime failures
  - workflow/infrastructure drift
  - flaky/non-actionable noise
- record the exact remaining blocker list in normal acceptance form

### Done means
- the current PR state is no longer hand-wavy
- remaining failures are named precisely
- no one has to guess whether the repo is failing because of history drift or because of a fresh real defect

---

## Day 2 — Finish public-repo naming and state-document alignment

### Goal
Make the main project-facing documents tell the same story.

### Main work
- finish reconciling `README.md`, `CURRENT_STATE.md`, `ROADMAP.md`, and near-term planning docs
- remove obvious `SoulClaw` naming where it is no longer the intended public/project truth
- keep historical context where it helps, but stop letting historical residue act like current identity

### Done means
- the main docs agree on what LumaClaw is
- the migration story is clear without sounding defensive
- public identity and internal state docs no longer point in different directions

---

## Day 3 — Audit workflow assumptions that no longer match current infrastructure

### Goal
Reduce CI noise caused by stale execution assumptions.

### Main work
- inspect runner assumptions, Docker builder assumptions, lockfile assumptions, and validation-path assumptions
- remove or rewrite the workflow pieces that still depend on no-longer-reliable infrastructure conventions
- keep changes bounded and evidence-driven

### Done means
- workflow failures reflect real project problems more often than infrastructure residue
- the repo becomes easier to trust as a signal source

---

## Day 4 — Tighten install/build reproducibility

### Goal
Make install/build paths feel like project contracts instead of optimistic best-effort habits.

### Main work
- verify dependency/install expectations across scripts, CI, and Docker paths
- keep lockfile behavior explicit and consistent
- document any intentional temporary compatibility surface instead of leaving it implicit

### Done means
- install/build expectations are easier to explain and harder to accidentally break
- contributors can tell which paths are canonical and which are transitional

---

## Day 5 — Review SoulBond/UI work against current repo truth

### Goal
Make sure the product layer is being described honestly after the baseline/documentation cleanup.

### Main work
- re-check current SoulBond and first UI-slice claims against actual code reality
- downgrade stale language if the docs are ahead of code
- promote already-landed work if docs are behind code

### Done means
- product claims are neither timid nor inflated
- current LumaClaw differentiation is described at the right strength

---

## Day 6 — Prepare the next bounded product-facing slice

### Goal
Choose the next product-facing move only after the current baseline is stable enough.

### Main work
- decide whether the next bounded move should be:
  - explanation-panel follow-up
  - additional behavior mapping visibility
  - state hardening
  - demo/readability improvements
- write the next task as a bounded, reviewable slice

### Done means
- the next product move is chosen intentionally
- the team is not using product work to escape cleanup work

---

## Day 7 — End the week with one explicit project judgment

### Goal
Finish the week with project truth, not momentum blur.

### Main work
- review what actually changed during the week
- write the resulting truth into the appropriate state/acceptance docs
- decide what the next phase boundary is:
  - baseline still unstable
  - baseline stable enough for product push
  - partial stability with one remaining blocker class

### Done means
- the project exits the week with an explicit judgment
- next-step ordering is based on evidence, not mood

---

## What not to let this week become

This 7-day window should **not** turn into:
- decorative product polish used to dodge baseline cleanup
- broad rename churn without priority
- speculative rewrites for uniqueness theater
- workflow thrash without written judgment
- vague storytelling that outruns repo reality

The point of this week is:

> **turn LumaClaw from a migration-heavy public repo into a trustworthy baseline for the next product push.**

---

## Success condition for the next 7 days

At the end of this plan, LumaClaw should have:
- a clearer and more trustworthy public repo baseline
- a tighter explanation of project identity and current phase
- fewer workflow failures caused by stale migration assumptions
- a more explicit boundary between baseline-hardening work and product-facing next work
- one clearly chosen next bounded slice after stabilization

If that is achieved, LumaClaw stops looking like a project still apologizing for its own transition and starts looking like a project that understands its current stage and is steering it deliberately.
