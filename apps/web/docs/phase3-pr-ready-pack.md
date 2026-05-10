# Phase 3 PR Ready Pack

Date: 2026-05-10
Scope: apps/web

## 1. Recommended PR Titles

Primary:
- feat(web): complete phase3 content admin workflow with release runbooks

Alternatives:
- feat(web): ship phase3 content snapshot admin, rollback tracing, and ops docs
- feat(web): finalize phase3 content admin + requestId traceability + release checklist

## 2. PR Description (CN Main)

### Summary
This PR completes the end-to-end Phase 3 content admin workflow, including snapshot-driven content delivery, save/history/rollback operations, reviewer allowlist control, requestId traceability, and release-operation documentation.

### Key Changes
- Added/finished content admin workflow at /admin/content:
  - snapshot load/edit/save
  - history filters (operation/requestId)
  - rollback with reviewer validation
- Added requestId visibility and copy actions in key UI states.
- Added and expanded API/UI regression tests for:
  - save -> history filter -> rollback stateful path
  - unauthorized save negative path
  - requestId linkage across endpoints
- Added operational docs/checklists/runbooks for staging, acceptance, release-day execution, communication, and monitoring.
- Hardened top navigation auth pills to avoid empty-looking dark button states (fallback labels + min width + centered layout).

### Validation Evidence
Executed command block:

```bash
npm run lint && npm run test && npm run build && npx playwright test tests/ui/admin-content.spec.ts tests/ui/phase3-content.spec.ts tests/ui/catalog-content.spec.ts
```

Result:
- lint: pass
- vitest: 32/32 passed
- next build: pass
- playwright key suites: 11/11 passed

Additional UI test run:

```bash
npx playwright test tests/ui/admin-content.spec.ts
```

Result:
- 5/5 passed

### Risks and Rollback
- Main risks:
  - environment mismatch for CONTENT_ADMIN_TOKEN / allowlist source / DATABASE_URL
  - operational misuse in rollback approval flow
- Controls:
  - token + reviewer validation in APIs
  - DB-first reviewer allowlist, env fallback
  - requestId traceability in status/history
- Rollback strategy:
  - perform admin rollback with valid reviewer
  - verify rollback requestId in history
  - keep snapshot export as emergency restore path

### Docs
- docs/content-admin.md
- docs/content-admin-staging-checklist.md
- docs/final-acceptance-checklist.md
- docs/final-acceptance-report-2026-05-10.md
- docs/phase3-release-handoff.md
- docs/phase3-release-day-runbook.md
- docs/phase3-release-chat-templates.md
- docs/phase3-release-chat-templates-prefilled.md
- docs/phase3-release-monitoring-checklist.md
- docs/phase3-release-monitoring-sheet.md
- docs/phase3-snapshot.md

## 3. PR Description (EN Short)

### Summary
This PR delivers the full Phase 3 content admin workflow with requestId-based traceability and release-operation readiness.

### Highlights
- Admin save/history/rollback with reviewer allowlist checks.
- RequestId surfaced and copy-enabled in UI for operational tracing.
- Expanded integration/UI regressions, including unauthorized save negative path.
- Added release docs: runbook, communication templates, monitoring checklist/sheet.
- Hardened auth pill button visibility in top nav.

### Validation
- lint: pass
- vitest: 32/32 pass
- build: pass
- playwright (admin/phase3/catalog): 11/11 pass
- playwright (admin spec): 5/5 pass

## 4. Pre-Merge 5-Point Check

- [ ] Re-run full acceptance command block once in target branch.
- [ ] Confirm env vars in target environment: CONTENT_ADMIN_TOKEN, CONTENT_ROLLBACK_REVIEWERS, DATABASE_URL, NEXT_PUBLIC_SITE_URL.
- [ ] Confirm release-day owner/operator/qa/observer names in runbook and chat templates.
- [ ] Confirm snapshot backup export path is recorded.
- [ ] Confirm rollback trigger and notification path are understood by on-call members.

## 5. Push and PR Commands (No Remote Yet)

Current repository has no configured remote.

1. Add remote:

```bash
git remote add origin <repo-url>
```

2. Verify branch and push:

```bash
git branch -M main
git push -u origin main
```

3. Optional: push explicit commits only:

```bash
git push origin 53151b2
git push origin 5a4487a
git push origin d4d6f1a
```

## 6. Commit Reference

- d4d6f1a feat(web): finalize phase3 content admin delivery and release runbooks
- 5a4487a test(web): add unauthorized save negative-path ui coverage
- 53151b2 fix(web): ensure auth pill buttons always show visible labels
