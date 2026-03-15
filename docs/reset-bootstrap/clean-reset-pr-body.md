## Summary
This PR proposes the first clean-reset LumaClaw mainline as a new candidate branch.

It carries the smallest real LumaClaw core that can already stand on its own:
- SoulBond core carry
- reset-local cron type decoupling
- minimal CLI entrypoint
- passing install / typecheck / test path
- top-level identity and project-truth document promotion
- acceptance log entries for the clean reset state

## What changed
- carried `src/soulbond/**`
- carried `scripts/soulbond-*.ts`
- carried `src/auto-reply/reply/strip-inbound-meta.ts`
- added `src/soulbond/cron-types.ts` to avoid re-pulling the broader old cron surface
- promoted a minimal top-level technical mainline (`package.json`, `lumaclaw.mjs`, `tsconfig.json`, `vitest.config.ts`)
- promoted top-level identity/docs (`README.md`, `CURRENT_STATE.md`, `ROADMAP.md`, `VISION.md`)
- recorded clean-reset acceptance state in `docs/acceptance-log.md`

## Validation
- `npm install --no-package-lock`
- `npm run typecheck`
- `npm test`
- `node .\\lumaclaw.mjs`

## Notes
- the old heavy repo remains frozen separately as archive/reference
- UI carry is still intentionally deferred
- this PR is for the SoulBond-first clean-reset candidate mainline, not the full old-surface replacement
