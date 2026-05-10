# Phase 3 Deployment Execution

This document focuses only on the deployment stage and immediate validation.

## 1) Deployment Preconditions (Must Pass)

- [ ] PR merged to `main`
- [ ] `main` synced to remote
- [ ] Environment variables confirmed in target environment:
  - `CONTENT_ADMIN_TOKEN`
  - `CONTENT_ROLLBACK_REVIEWERS`
  - `DATABASE_URL`
  - `NEXT_PUBLIC_SITE_URL`
- [ ] Snapshot backup path recorded
- [ ] Release roles confirmed (Owner / Operator / QA / Observer)

## 2) Deployment Window Plan

Recommended window:
- low traffic period
- 30-minute post-release observation

Recommended timeline:
- T-10: final env and backup verification
- T+0: deploy starts
- T+5: admin save + requestId validation
- T+10/T+15: smoke checks
- T+30: release conclusion

## 3) Deployment Commands (Platform-Agnostic)

Use your platform's deployment command for `main`, then validate with app-level checks below.

If local precheck is required before deployment:

```bash
cd apps/web
npm run lint
npm run test
npm run build
```

Key UI regression check (optional but recommended):

```bash
cd apps/web
npx playwright test tests/ui/admin-content.spec.ts tests/ui/phase3-content.spec.ts tests/ui/catalog-content.spec.ts tests/ui/auth-ui.spec.ts
```

## 4) Immediate Post-Deploy Checks

Operator:
- Open `/admin/content?lang=en`
- Perform a small reversible save
- Record `save requestId`
- Filter history by that requestId and confirm hit

QA:
- Smoke-check:
  - `/products`
  - `/reviews`
  - `/rankings`
  - `/news`
  - `/guides`
  - `/brands`
  - `/deals`
  - `/community`
- Check `/sitemap.xml`

Observer:
- Watch 5xx trend and key API latency
- Watch anomalies for `/api/content/site` and reviewer allowlist APIs

## 5) Go/No-Go Criteria

Go when all are true:
- save succeeds and requestId is traceable
- history requestId filter works
- smoke routes render expected content
- no sustained error spike in observation window

No-Go / rollback trigger (any true):
- save repeatedly fails and no recovery within 10 minutes
- rollback reviewer validation/path is broken
- core pages unavailable or with severe content errors
- requestId chain cannot be traced

## 6) Rollback Action

- Execute rollback from admin with valid reviewer
- Record rollback requestId
- Verify rollback requestId in history
- Re-check critical routes and sitemap
- Announce rollback result in channel

## 7) Deployment Stage Output Template

- Deployment start time:
- Deployment end time:
- Save requestId:
- Rollback requestId (if any):
- Smoke check conclusion:
- Observation conclusion:
- Final decision: Go / Rollback

## 8) Related Docs

- docs/phase3-final-handoff-index.md
- docs/phase3-merge-to-release-timeline-script.md
- docs/phase3-release-day-runbook.md
- docs/phase3-release-monitoring-sheet.md
- docs/phase3-channel-announcement-filled.md
- docs/phase3-deployment-callouts.md
