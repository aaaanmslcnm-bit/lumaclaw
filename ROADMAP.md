# LumaClaw Roadmap

This roadmap tracks the LumaClaw public product line as it actually exists today: a serious fork of OpenClaw with a real SoulBond MVP, a strong inherited agent/runtime base, and a product layer that still needs integration work.

The development order remains deliberate:

1. make the core loop real
2. make it inspectable and demoable
3. map it into visible behavior
4. only then expand voice / avatar / desktop presence

If that order gets reversed, SoulClaw turns into costume design with no spine.

---

## Current stage

Best current summary:

> **Early-to-mid productization: the core SoulBond loop exists, but the project is still stronger on architecture than on user-visible integration.**

What is already true:

- SoulBond transcript extraction is real
- explainable audit / evidence output is real
- daily evaluation is real
- state persistence and status inspection are real
- cron integration exists
- the repo already has a SoulClaw-facing direction and naming layer

What is not yet true:

- SoulBond does not yet consistently alter visible assistant behavior across the product
- voice / avatar / desktop presence are not yet integrated headline features
- the runtime/public surface is not fully separated from inherited OpenClaw naming
- product/UI presentation still lags behind the underlying logic

The project is no longer at "idea stage," but it is not yet at "finished product shell" either.

### Default execution workflow

For the current phase, SoulClaw development follows this model:

- Yukino leads scope, architecture, and acceptance criteria
- Codex handles bounded implementation work
- Yukino reviews the result before it is treated as project truth
- final user-facing delivery should include both implementation result and Yukino's acceptance judgment / next-step recommendation

---

## Phase 0 — Fork legibility and transition cleanup

### Goal
Make SoulClaw understandable as **its own project** without pretending it no longer depends on OpenClaw.

### Why this phase still matters
The fork direction is already visible, but the user-facing surface is still mixed:

- some CLI / runtime surfaces still carry `openclaw`
- some docs still describe transition state rather than a clean project identity
- small credibility cuts (for example README presentation issues) still matter too much

### Priority work
- finish repo-facing naming cleanup where it is user-visible
- keep attribution honest and upstream links explicit
- remove obvious presentation damage (README glitches, stale wording, unclear transition language)
- define a cleaner split between inherited runtime surface and SoulClaw-specific product layer

### Status
**In progress, not done.**

The repo is clearly no longer a blank fork, but it is also not yet clean enough to stop explaining the transition.

---

## Phase 1 — SoulBond core stabilization

### Goal
Turn SoulBond from a believable MVP into a stable subsystem that can survive long-term evolution.

### Why this phase is first
The current SoulBond loop is the strongest differentiator SoulClaw has. It already proves the project is more than a rename. That also means it is the first place where hidden technical debt will hurt.

### Priority work
- add state validation / migration for versioned SoulBond state
- harden persistence assumptions before the state model evolves further
- keep transcript heuristics explainable and testable
- maintain demoable CLI paths while reducing "MVP-only" fragility

### Current reality
Already working:

- transcript -> summary extraction
- explainable audit output
- daily scoring
- state updates
- status command / demo command / cron adapter

Still weak:

- migration / compatibility story for persisted state
- confidence that future schema growth will not break existing users

### Status
**Active and important.**

This is the most urgent engineering layer because it protects the part of SoulClaw that is already real.

---

## Phase 2 — Behavior mapping

### Goal
Make SoulBond affect the assistant in ways users can actually feel.

### Why this phase matters
Right now SoulClaw's strongest differentiator is mostly structural:

- transcript
- score
- state
- cron

That is valuable, but it is still too invisible. If SoulBond does not start changing the assistant's tone, continuity, or presence in a controlled way, it risks becoming "a number that exists" instead of a relationship-aware system.

### Priority work
- connect SoulBond settings to real behavior, not just type definitions
- map state into tone changes carefully and explainably
- define what should change at each stage and what should stay stable
- keep the behavior layer inspectable instead of magical

### Examples
- tone shifts that follow bond/stage
- slightly different initiative/continuity patterns
- clearer stage-aware response texture
- explicit, optional mapping rather than hidden emotional manipulation

### Status
**Next major differentiator.**

This is where SoulClaw starts becoming more than a strong fork with a nice internal model.

---

## Phase 3 — Product surface integration

### Goal
Expose SoulBond as a real product capability rather than a demo-only internal subsystem.

### Why this phase matters
Codex's strongest external criticism was essentially: "the core exists, but the product layer has not caught up."

That criticism is fair.

### Priority work
- add clearer first-class product entry points for SoulBond
- improve CLI/status surfaces so they read like product features, not just dev helpers
- add UI/panel visibility where it helps explain the system
- align docs with what is already real versus what is still planned

### Status
**Needed soon.**

Until this phase advances, SoulClaw will keep feeling stronger in architecture than in visible user experience.

---

## Phase 4 — Voice and avatar integration

### Goal
Let the companion layer become perceptible through voice and presentation.

### Important constraint
These should amplify a real behavior core, not compensate for a missing one.

### Priority work
- hook SoulBond-aware tone into future TTS choices
- define how avatar / expression changes should work without turning the system into shallow theater
- keep presentation user-owned and configurable

### Status
**Planned, not headline-ready.**

The settings/interface shape may exist before the full behavior exists. That is acceptable as long as docs stay honest.

---

## Phase 5 — Desktop presence

### Goal
Make SoulClaw feel present on the desktop rather than only accessible through commands and chats.

### Examples
- floating assistant window
- richer visual shell
- desktop-presence reactions/reminders
- future embodied presence experiments

### Constraint
Do not rush into this while behavior mapping is still weak.
A desktop shell without convincing continuity is just decoration.

### Status
**Later.**

This is part of the long-term identity, not the next emergency.

---

## What is intentionally not first

SoulClaw should **not** prioritize these before the middle layers are real:

- heavy visual polish without behavior integration
- overdramatic "relationship" framing without explainable logic
- giant speculative rewrites for the sake of uniqueness
- pretending the upstream base no longer matters
- presentation-first features that outrun the product core

The right order is still:

- capability
- continuity
- explainability
- behavior mapping
- product integration
- presentation

---

## Immediate next priorities

These are the three highest-leverage roadmap items right now:

### 1. SoulBond state validation and migration
Because versioned state already exists, and long-term continuity will become fragile without it.

### 2. Make SoulBond settings actually affect runtime behavior
Because `affectTone`, `affectAvatar`, `affectVoice`, `notifyDaily`, and related settings should not remain mostly aspirational interface surface.

### 3. Finish the public/runtime transition cleanup
Because SoulClaw will keep underselling itself if the docs, names, and visible product entry points still feel half-transitioned.

---

## One-sentence roadmap summary

SoulClaw is moving from **real but mostly internal MVP** toward **relationship-aware behavior and product-level companion presence** — in that order, because any flashier order would be stupid.
