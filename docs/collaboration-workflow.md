# LumaClaw Collaboration Workflow

_Last updated: 2026-03-12_

## Purpose

This document is the public-facing summary of how LumaClaw work is currently coordinated.

It exists to prevent role confusion, fake-running agent tasks, and old workflow documents from continuing to drive current decisions.

## Current role model

### Jie
- sets direction
- chooses priorities
- approves major project moves

### Yukino
- project lead / total control
- defines task boundaries
- defines acceptance criteria
- performs final review
- takes over failed tasks when needed

### Akane
- Yukino's deputy in project work
- risk scanning / read-only review
- bounded execution support
- external organizer / 外挂整理员 for pitfalls, principles, case studies, and drift-watch materials
- may call external expert agents only after Yukino approval

### Codex
- bounded implementation worker
- handles small to medium scoped execution tasks
- does not own project direction or final acceptance

### Subagents
- read-only scouting
- risk maps
- search/classification support
- not primary execution owners

### The Agency
- optional external expert library
- used as a controlled plugin layer, not as the main control system
- may be called through Akane after Yukino approval

## Core rules

### 1. Yukino remains the single final reviewer
No task is considered project truth until Yukino reviews it.

Accepted / rejected / stale / superseded judgments should not live only in chat.
For bounded project truth, Yukino should write the result into `docs/acceptance-log.md`.

### 2. Tasks must be split before they are delegated
Codex and Akane should receive bounded tasks, not broad "fix the whole project" prompts.

### 3. Fake running is treated as failure
If an agent/task still says `running` but has:
- no active process
- no real output
- empty callback files
- only a stop event

then it is treated as failed, not "still working."

### 4. Public docs and public naming are cleaned separately from compatibility layers
LumaClaw is the public project name.
Legacy `soulclaw` / `openclaw` command and compatibility surfaces may still remain during transition.

### 5. The Agency is an expert library, not a second project owner
It can contribute specialist advice, but it does not replace Yukino's control, task cutting, or acceptance judgment.

## Task categories

### Read-only scouting
Use subagents or Akane for:
- risk scans
- leftover match classification
- file discovery
- migration blast-radius analysis

### Safe bounded implementation
Use Codex or Yukino directly for:
- focused documentation cleanup
- isolated UI slices
- clearly bounded naming/help updates
- explicit implementation passes with acceptance criteria

### High-risk compatibility migration
Keep under Yukino control:
- CLI primary-name migration
- launcher/filename changes
- env variable migration
- docker/podman/deployment compatibility changes
- publish/auth/security-sensitive tasks

## Current practical workflow

1. Yukino defines the task
2. If needed, scouting runs first
3. A bounded task is delegated
4. Output must come back in structured form
5. Yukino reviews and decides whether it is accepted
6. The judgment is written into `docs/acceptance-log.md`
7. If that judgment changes current project reality or next-step ordering, the relevant state docs are synced

## Why this matters

LumaClaw is currently split across:
- a heavier fork-stage development repo
- a cleaner public GitHub surface
- a minimal npm placeholder package preserving the public package name

That makes workflow discipline more important, not less.

## One-line summary

> Jie sets direction, Yukino controls scope and acceptance, Akane coordinates under constraint, Codex executes bounded work, subagents scout, and The Agency stays a controlled expert add-on.
