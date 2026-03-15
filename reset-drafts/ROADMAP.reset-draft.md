# LumaClaw Reset Draft Roadmap

This roadmap is for the reset scaffold review only.

## Phase 1

Create a minimal reviewable skeleton without disturbing the clean upstream base.

Definition of done:

- draft identity files exist under `reset-drafts/`
- a minimal bootstrap note exists under `docs/reset-bootstrap/`
- protected top-level files remain untouched

## Phase 2

After Yukino review, decide whether to carry the minimum identity layer into live top-level files.

Decision points:

- approve or reject the draft package shape
- approve or reject the draft `lumaclaw` entrypoint shape
- decide whether the minimum UI slice remains in scope for the next pass

## Phase 3

If approved, begin a tightly scoped carry of the next whitelist items only:

- `src/soulbond/**`
- `scripts/soulbond-*.ts`
- minimum governance docs
- minimum UI slice only if explicitly accepted

## Guardrails

- no broad repo pruning
- no compatibility entrypoint restoration
- no migration of apps, extensions, skills, workflows, or UI breadth in this draft step
