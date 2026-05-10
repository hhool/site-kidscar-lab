# Phase 3 Snapshot

Date: 2026-05-10
Project: KidsCarLab (apps/web)
Status: Completed and Verified

## Stage Explanation

Phase 3 establishes a DB-backed content system and admin workflow so the site is no longer limited to baked-in mock page data.

This stage adds two connected capabilities:

1. Runtime content delivery
- products, reviews, rankings, news, guides, brands, deals, and community content now read from a unified Phase 3 content snapshot model
- the app can serve DB-backed content through `/api/content/phase3`
- sitemap generation includes dynamic guide detail routes from the current snapshot

2. Admin content operations
- protected content admin page at `/admin/content`
- snapshot load, edit, diff preview, save, history, and rollback workflow
- structured audit metadata for traceability and safer rollback operations
- reviewer allowlist management for rollback control

## Scope Completed

- Unified Phase 3 snapshot type and default snapshot source added.
- DB-backed snapshot service implemented with fallback behavior when DB is unavailable.
- Content consumer pages migrated to `usePhase3Content`.
- Dynamic content API implemented at `/api/content/phase3`.
- Admin content API implemented at `/api/content/site`.
- Structured audit fields implemented:
  - operation
  - source audit id
  - requestId
  - reviewer
  - reason
- History filters implemented:
  - editor
  - section
  - operation
  - requestId
  - rollbackable only
- Reviewer allowlist CRUD API implemented.
- Admin page added for snapshot operations and reviewer management.
- Save and rollback now return requestId and expose it in the UI for copy.
- Snapshot helper scripts added:
  - `npm run content:snapshot:seed`
  - `npm run content:snapshot:update`
  - `npm run content:snapshot:export`
- Content admin guide added in `docs/content-admin.md`.

## Verification Results

Validated successfully:

- `npm run lint`
- `npm run test`
- `npm run build`
- `npx playwright test tests/ui/admin-content.spec.ts tests/ui/phase3-content.spec.ts tests/ui/catalog-content.spec.ts`

Additional verified coverage includes:

- content API integration tests
- reviewer allowlist API integration tests
- admin UI requestId copy workflow
- phase 3 content rendering regressions
- catalog filters and rankings regressions

## Risks and Limitations

- Production rollout still depends on a valid `DATABASE_URL` and admin token configuration.
- Rollback behavior for very old audit rows may be unavailable if those rows were created before snapshot payload storage existed.
- Current Playwright setup runs against `next start`, so UI checks require a fresh build after source edits.
- Admin workflows are validated in mocked integration/UI coverage; real shared-environment operational testing is still recommended.

## Current Deliverables

- DB-backed content snapshot model
- Admin content management UI
- Structured audit trail and rollback workflow
- Reviewer allowlist management
- Snapshot CLI scripts
- Updated README and content admin documentation
- Passing lint, test, build, and key UI regression suite

## Next Tasks

1. Run real-environment admin validation against a configured Postgres instance.
2. Seed or import production-ready content snapshot data instead of relying on defaults.
3. Add a dedicated E2E path for save -> history filter -> rollback in a more production-like environment.
4. Add role/auth hardening around admin route access if broader deployment is planned.
5. Decide whether to expose admin requestId search and rollback diagnostics in a separate ops view.

## Recommended Immediate Next Step

Use a real `DATABASE_URL` in a staging environment and execute one full manual admin cycle:

1. load snapshot
2. save a small content change
3. verify requestId appears in status and history
4. filter history by requestId
5. rollback the change with an allowed reviewer
6. confirm the audit trail and sitemap output are correct
