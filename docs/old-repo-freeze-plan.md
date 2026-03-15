# LumaClaw Clean Reset — Old Repo Freeze Plan

_Last updated: 2026-03-15_

This document defines how to freeze the current repo safely before the clean reset begins.

The purpose of freezing is:
- preserve the old repo as archive/reference
- keep rollback and evidence paths intact
- stop the old repo from remaining the active mental/project battlefield
- avoid destructive panic cleanup

---

## 1. Freeze goals

A successful freeze means:
- the old repo is still fully recoverable
- the old repo has a stable archive identity
- the current state is recorded before reset work starts
- the clean reset can proceed without constantly drifting back into the old repo

---

## 2. Current repo identity to freeze

### Current local repo path
- `C:\Users\Administrator\Desktop\LumaClaw`

### Current public repo
- `git@github.com:Yukino-Akane/lumaclaw.git`

### Current active branch at freeze-planning time
- `align/origin-main-20260314-093246`

### Key recent reset-prep commits
- `34e6c649d` — CI reset-prep / lockfile / workflow cleanup
- `ec85d25e1` — detect-secrets baseline refresh
- `c4638cc5b` — docs narrative/state alignment

---

## 3. Recommended freeze outputs

## A. Git archive marker

Create at least one of the following:

### Option A1 — archive tag
Suggested tag:
- `archive/pre-clean-reset-20260315`

### Option A2 — archive branch
Suggested branch:
- `archive/pre-clean-reset-20260315`

Preferred rule:
- create **both** if convenient

---

## B. Local archive directory identity

Recommended local rename after the old repo is recorded:
- `C:\Users\Administrator\Desktop\LumaClaw-archive-20260315`

Why:
- makes it psychologically and operationally obvious that this is no longer the active mainline
- reduces accidental edits in the old repo during reset work

---

## C. Freeze-state note

Record the old repo state in a short freeze note.

Suggested file:
- `docs/freeze-state-20260315.md`

Should include:
- current HEAD
- current branch
- current PR number / head SHA
- current known CI state
- known unresolved failure classes
- note that the repo is now archive/reference for reset work

---

## 4. Freeze procedure

### Step 1 — Verify clean/local state
Before freezing:
- confirm current HEAD
- confirm working tree status
- confirm which commits have been pushed
- confirm the current PR head

### Step 2 — Mark archive in git
- create archive tag and/or archive branch
- do **not** rewrite or squash old history as part of freeze

### Step 3 — Record freeze note
- write `docs/freeze-state-20260315.md`
- make the old repo's final known state explicit

### Step 4 — Rename local directory
After archive state is safely recorded:
- rename local repo directory to the archive path

### Step 5 — Stop treating the old repo as mainline
- no new feature work in the old repo
- only reference, cherry-pick, or evidence lookup after freeze

---

## 5. Freeze non-goals

Do **not** do these during freeze:
- delete the old repo
- force-push rewrite old repo history
- clean up every old file before reset starts
- finish unresolved CI work in the old repo unless explicitly chosen
- use freeze as a disguised mass-delete pass

---

## 6. Acceptance criteria for freeze

The old repo is considered frozen only if:
- archive marker exists (tag and/or branch)
- freeze-state note exists
- local archive directory identity is established or explicitly queued as the next action
- the reset workspace is treated as the new active battlefield

---

## 7. Working conclusion

The old repo should become:
- archive
- reference
- fallback evidence source
- cherry-pick pool

It should **not** remain the default place where new LumaClaw 2.0 decisions are made.

---

## One-line rule

> Freeze the old repo as evidence and fallback. Do not keep negotiating with it as the future mainline.
