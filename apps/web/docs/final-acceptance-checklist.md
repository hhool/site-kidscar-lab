# Final Acceptance Checklist

Use this checklist as the final go/no-go gate for the Phase 3 content admin delivery.

## 1. Environment

- [ ] `DATABASE_URL` is configured for the target environment.
- [ ] `CONTENT_ADMIN_TOKEN` is configured and shared only with approved operators.
- [ ] `CONTENT_ROLLBACK_REVIEWERS` is configured as fallback allowlist.
- [ ] `NEXT_PUBLIC_SITE_URL` points to the target domain.

## 2. Data and Snapshot

- [ ] Current snapshot backup is exported before change window.
- [ ] Snapshot seed/update path is confirmed.
- [ ] Core sections render with expected data:
  - products
  - reviews
  - rankings
  - news
  - guides
  - brands
  - deals
  - community

## 3. Admin Operations

- [ ] Admin page opens and loads snapshot successfully.
- [ ] Save succeeds and returns visible `requestId`.
- [ ] History filter by `requestId` returns the expected entry.
- [ ] Rollback succeeds with active allowed reviewer.
- [ ] Rollback produces a new audit entry with `operation=rollback` and `sourceAuditId`.
- [ ] Request ID can be copied from:
  - top status area
  - history inline requestId control
  - history `Copy requestId` button

## 4. Reviewer Allowlist

- [ ] Reviewer allowlist API is reachable.
- [ ] At least one active reviewer is available.
- [ ] Add / disable / delete reviewer operations are verified in admin UI.
- [ ] DB allowlist priority over env fallback is confirmed.

## 5. API Contracts

- [ ] `PUT /api/content/site` works with optimistic concurrency.
- [ ] `PUT /api/content/site` works without `If-Unmodified-Since` and persists metadata.
- [ ] `POST /api/content/site?rollback=1` returns `requestId`.
- [ ] `GET /api/content/site?history=1` supports operation + requestId filtering.

## 6. Frontend and SEO

- [ ] Content-driven pages show updated snapshot data.
- [ ] Guide detail routes resolve correctly after snapshot updates.
- [ ] `/sitemap.xml` includes current guide slug routes.
- [ ] No regression on `/products`, `/reviews`, `/rankings`, `/news`, `/guides`, `/brands`, `/deals`, `/community`.

## 7. Automated Validation

- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npx playwright test tests/ui/admin-content.spec.ts tests/ui/phase3-content.spec.ts tests/ui/catalog-content.spec.ts`

## 8. Local Dev Workflow

- [ ] Dev server launched from `apps/web` (not workspace root).
- [ ] Port 3010 conflict check and recovery path is documented and understood.
- [ ] Team can reliably run `npm run dev:local`.

## 9. Evidence to Keep

- [ ] Save requestId record
- [ ] Rollback requestId record
- [ ] Screenshot or log of requestId-filtered history
- [ ] Snapshot backup file path and timestamp
- [ ] Command output summary for lint/test/build/UI regressions

## 10. Release Decision

Mark delivery ready only when all sections above are checked and no blocking risk remains.
