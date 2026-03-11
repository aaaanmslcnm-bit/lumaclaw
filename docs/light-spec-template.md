# SoulClaw Light Spec Template v1

This is the default lightweight spec format for **medium-sized SoulClaw tasks**.

Use it when a task is too large for a one-line fix, but not large enough to need a giant planning ritual.

The goal is simple:

> turn a fuzzy discussion into a bounded implementation task that Codex can execute and Yukino can review cleanly.

---

## When to use this template

Use a light spec when the task is any of the following:

- multi-file
- has real design tradeoffs
- needs clear non-goals
- needs acceptance criteria beyond "it runs"
- is delegated to Codex for implementation
- could easily drift if the scope is not written down

Do **not** use a full spec for:

- tiny one-file fixes
- obvious typo/docs corrections
- simple rename-only cleanup
- tasks Yukino can finish faster by direct edit than by delegation

---

## Workflow

1. Yukino writes the light spec
2. Codex implements within the written boundaries
3. Yukino reviews against the same light spec
4. Final delivery to Jie uses the acceptance-report format

This keeps project judgment with Yukino instead of letting implementation workers redefine the task.

---

## Template

Copy this block when starting a bounded implementation task.

```md
# Task

## Goal
What should exist after this task is done?

## Why now
Why is this the right thing to do at this stage of the roadmap?

## Scope
What is explicitly included?

## Non-goals
What is explicitly out of scope for this task?

## Files likely involved
List the main files or directories expected to change.

## Design notes
Important architectural choices, constraints, or tradeoffs.

## Acceptance
How will Yukino decide this task is acceptable?

## Validation
What tests/checks should be run?

## Review focus
What should Yukino pay extra attention to during review?
```

---

## Meaning of each section

### Goal
State the outcome, not the activity.

Bad:
- "look into migration stuff"

Better:
- "add a version-safe SoulBond state migration path for legacy state files"

### Why now
Tie the task to the roadmap.
This prevents random side quests.

### Scope
List the things the implementation worker is actually allowed to touch.

### Non-goals
This is the anti-drift section.
If a task is likely to grow teeth and wander off, write the forbidden territory here.

### Files likely involved
This is not a prison, but it is a strong hint.
If Codex changes files far outside this list, Yukino should ask why.

### Design notes
Capture the parts that should not be reinvented during implementation.
Example:
- canonical state version must be written on save
- load may normalize legacy state, but future versions must fail fast

### Acceptance
Write this like a review checklist, not like a dream.

### Validation
Prefer specific test files or checks over vague commands.

### Review focus
This section exists because some tasks fail through subtle drift rather than obvious breakage.
Examples:
- check whether the task solved the right problem, not just adjacent cleanup
- check whether migration logic stayed explicit rather than magical

---

## Example

```md
# Task

## Goal
Add a canonical SoulBond state migration path for legacy state files and reject unsupported future versions.

## Why now
This is Priority 1 in the roadmap: SoulBond state must become safe to evolve before behavior mapping expands.

## Scope
- `src/soulbond/store.ts`
- `src/soulbond/types.ts`
- `src/soulbond/*.test.ts`
- one new helper file if needed

## Non-goals
- no tone mapping
- no avatar/voice integration
- no README/ROADMAP changes
- no unrelated CLI cleanup

## Files likely involved
- `src/soulbond/store.ts`
- `src/soulbond/types.ts`
- `src/soulbond/store.test.ts`

## Design notes
- save must write the current canonical version
- missing version should be treated as legacy state
- future version must fail fast
- invalid top-level types must not be silently reset

## Acceptance
- legacy state can load and normalize into current shape
- future version is rejected clearly
- missing file still returns default state
- save validates before writing

## Validation
- run targeted SoulBond tests
- rerun any touched migration/store tests

## Review focus
- did implementation stay inside SoulBond state work?
- did migration remain explicit instead of over-magical?
```

---

## Default review rule

If Codex returns something that does not match the written Goal + Scope + Non-goals, Yukino should treat that as drift even if the code looks individually useful.

That is not being harsh.
That is project management.

---

## Future evolution

If SoulClaw later grows a more formal spec workflow, this light template can become:

- a reduced version of a larger spec system
- or the default path for medium tasks while larger tasks get a fuller artifact flow

For now, this template exists to make delegation cleaner without turning the project into process theater.
