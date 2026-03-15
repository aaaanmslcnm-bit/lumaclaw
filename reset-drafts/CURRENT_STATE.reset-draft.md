# LumaClaw Reset Draft Current State

_Drafted: 2026-03-15_

This file describes the reset scaffold state only.

## Current reality

- the clean repo remains an upstream OpenClaw base
- the reset proposal is isolated under `reset-drafts/` and `docs/reset-bootstrap/`
- no protected top-level product files were replaced during this draft step
- `src/soulbond` has not been migrated yet
- UI files have not been migrated yet

## What is real in this draft

- a concrete minimal package direction exists for review
- a draft `lumaclaw` entrypoint shape exists for review
- a small project-truth document set exists for review without changing the live top-level docs

## What is still pending

- final approval on the phase-one dependency keep list
- final approval on whether the minimum UI slice stays Lit-based in phase one
- any actual carry of `src/soulbond/**`
- any actual carry of scripts or UI files
- any decision to replace the top-level LumaClaw identity files

## Constraint status

This draft intentionally stays below the line where it would begin modifying the real top-level product surface.
