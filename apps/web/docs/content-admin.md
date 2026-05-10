# Content Admin Guide

This guide covers the content snapshot workflow behind the admin page and supporting scripts.

Staging rollout checklist:

- `docs/content-admin-staging-checklist.md`

## Access

Admin UI route:

- `/admin/content?lang=en`
- `/admin/content?lang=zh`

Protected APIs:

- `GET /api/content/site`
- `PUT /api/content/site`
- `GET /api/content/site?history=1`
- `POST /api/content/site?rollback=1`
- `GET|POST|PATCH|DELETE /api/content/reviewer-allowlist`

All admin routes require `CONTENT_ADMIN_TOKEN` through `x-content-admin-token` or `Authorization: Bearer ...`.

## Required Environment

Add the following to `.env.local`:

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
CONTENT_ADMIN_TOKEN=replace-with-long-random-admin-token
CONTENT_ROLLBACK_REVIEWERS=ops,qa-reviewer
```

Notes:

- `DATABASE_URL` enables persistent content storage and reviewer allowlist persistence.
- `CONTENT_ADMIN_TOKEN` protects the admin page APIs.
- `CONTENT_ROLLBACK_REVIEWERS` is a fallback allowlist only.
- When the DB table `content_reviewer_allowlist` contains active reviewers, that DB list takes priority over `CONTENT_ROLLBACK_REVIEWERS`.

## Data Model

Primary snapshot table:

- `content_snapshots`

Audit table:

- `content_snapshot_audit`

Structured audit fields currently tracked:

- `operation`
- `source_audit_id`
- `request_id`
- `editor`
- `reviewer`
- `reason`
- `changed_sections`
- `change_summary`
- `snapshot_payload`

Reviewer allowlist table:

- `content_reviewer_allowlist`

## Admin UI Workflow

### Load latest snapshot

1. Open the admin route.
2. Enter `CONTENT_ADMIN_TOKEN`.
3. Click `Load`.
4. Confirm the latest JSON payload is loaded into the editor.

### Preview changes

1. Edit the JSON payload.
2. Click `Format` if needed.
3. Click `Preview Diff`.
4. Review which sections changed before saving.

### Save snapshot

1. Optionally set `Editor` and `Change Summary`.
2. Click `Save`.
3. The UI sends `If-Unmodified-Since` using the currently loaded snapshot timestamp.
4. On success, the top status area shows the success message and the returned `requestId`.
5. Copy the `requestId` immediately from the status area if needed for traceability.

### Review history

History supports these filters:

- editor
- section
- operation
- requestId
- rollbackable only

The history list shows structured metadata for each audit row, including requestId, source audit id, reviewer, and reason.

### Rollback snapshot

1. Load the latest snapshot first.
2. Open `History`.
3. Select an active rollback reviewer.
4. Optionally enter a rollback reason.
5. Click `Rollback to this` for a rollbackable audit row.
6. Confirm the dialog.
7. On success, the top status area shows the rollback success message and returned `requestId`.

Rollback guards:

- requires `If-Unmodified-Since`
- requires an allowed reviewer
- rejects stale editor state with `VERSION_CONFLICT`
- rejects audit rows with missing rollback payload

## Snapshot Scripts

Available commands:

```bash
npm run content:snapshot:seed
npm run content:snapshot:update
npm run content:snapshot:export
```

Optional file override:

```bash
npm run content:snapshot:update -- data/site-content-snapshot.json
```

Behavior:

- `seed`: inserts the first snapshot only when no DB snapshot exists yet
- `update`: overwrites the DB snapshot from a file or in-repo default snapshot
- `export`: writes the current snapshot to disk; if DB data is unavailable, it exports the in-repo default snapshot

Default snapshot file:

- `data/site-content-snapshot.json`

## Request IDs

`requestId` is generated server-side for save and rollback operations.

Use it to:

- trace a specific admin write operation
- filter history results
- reference a rollback source during support or audit review

Copy entry points:

- top status area after save or rollback
- inline requestId value in history
- `Copy requestId` button in history

## Recommended Validation Flow

For backend and admin regressions:

```bash
npm run test -- src/app/api/content/content-api.integration.test.ts src/app/api/content/reviewer-allowlist.integration.test.ts && \
npm run build && \
npx playwright test tests/ui/admin-content.spec.ts tests/ui/phase3-content.spec.ts tests/ui/catalog-content.spec.ts
```

Notes:

- Playwright runs against `next start` on port `3108`.
- Build first after source edits so UI tests do not run against stale production output.

## Common Failures

### Unauthorized

Cause:

- missing or invalid `CONTENT_ADMIN_TOKEN`

### Version conflict

Cause:

- snapshot changed after the admin page was loaded

Fix:

1. Click `Load`.
2. Review the latest content.
3. Reapply the edit or rollback.

### Reviewer not allowed

Cause:

- selected reviewer is inactive or missing from the DB allowlist/fallback env allowlist

Fix:

1. Refresh reviewer options.
2. Select an active reviewer.
3. Retry the rollback.

### Missing rollback payload

Cause:

- an older audit record exists without `snapshot_payload`

Fix:

- choose a rollbackable record that contains stored snapshot data
