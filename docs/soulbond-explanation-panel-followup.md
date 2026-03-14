# LumaClaw — SoulBond Explanation Panel Follow-up

_Last updated: 2026-03-13_

This is the next bounded implementation move after the first landed SoulBond overview-card pass.

Current assumption:
- the first functional UI slice is already landed as the SoulBond overview/status-card path
- the next product problem is not "what is the current state?"
- the next product problem is: **why did the state end up like this?**

---

## Task title

**Add a narrow explanation-panel follow-up for SoulBond state legibility**

---

## Goal

Make the current SoulBond state easier to understand by adding a small explanatory follow-up surface that answers:

> **Why is the current state / tone / latest daily result what it is?**

This should improve demo clarity and product legibility without expanding into a full dashboard or history browser.

---

## Desired user-facing outcome

A viewer should be able to see, in a compact way:
- what the current SoulBond state is
- what the latest daily result was
- what short explanation connects recent signals/state to the current tone/relationship status

The panel should feel like a product explanation aid, not like a debug dump.

---

## In scope

- a small explanation panel or explanation block adjacent to the existing SoulBond overview/status-card path
- use already-available or honestly derivable state information only
- focus on legibility, not decoration
- keep the explanation concise and demo-friendly
- preserve the current first-slice design instead of replacing it

---

## Out of scope

- no avatar / voice work
- no full history timeline
- no complete transcript browser
- no broad Control UI redesign
- no reopening basic slice selection
- no speculative product theater disconnected from current runtime data

---

## Design direction

Prefer explanation language shaped like:
- latest daily result
- stage/tone interpretation
- what the current source state means

Avoid:
- long paragraphs
- raw internal dumps
- unexplained jargon
- fake certainty when runtime data is actually preview/fallback

---

## Likely evidence files

- `ui/src/ui/components/soulbond-status-card.ts`
- `ui/src/ui/views/overview.ts`
- `ui/src/ui/views/overview.soulbond.test.ts`
- `src/soulbond/summary.ts`
- `src/soulbond/status.ts`
- `docs/first-functional-ui-slice.md`
- `docs/acceptance-log.md`

---

## Acceptance criteria

The pass is acceptable when:

1. the explanation layer makes the SoulBond card easier to interpret
2. it stays narrow and product-facing
3. it does not pretend to expose richer runtime truth than the system currently has
4. it improves demo readability
5. it does not sprawl into a full second UI system

---

## Review focus

Yukino should pay extra attention to:
- whether the explanation is actually helpful or just more text
- whether preview/runtime honesty is preserved
- whether the added UI still feels like one coherent slice
- whether the pass remains bounded
