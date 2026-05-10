# Content Admin Staging Checklist

Use this checklist before enabling the content admin workflow in a shared staging or pre-production environment.

## 1. Environment Readiness

- [ ] `DATABASE_URL` points to the intended staging Postgres instance.
- [ ] `CONTENT_ADMIN_TOKEN` is set to a long random secret and shared only with admins.
- [ ] `CONTENT_ROLLBACK_REVIEWERS` is populated as a fallback allowlist.
- [ ] `NEXT_PUBLIC_SITE_URL` matches the staging domain.
- [ ] The app builds successfully with the staging environment variables.

Recommended `.env.local` shape:

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
CONTENT_ADMIN_TOKEN=replace-with-long-random-admin-token
CONTENT_ROLLBACK_REVIEWERS=ops,qa-reviewer
NEXT_PUBLIC_SITE_URL=https://staging.example.com
```

## 2. Initial Data Preparation

- [ ] Confirm whether staging should start from the in-repo default snapshot or an imported content file.
- [ ] Export a backup snapshot before the first admin write if staging already contains content.
- [ ] Seed or update the snapshot intentionally.

Reference commands:

```bash
npm run content:snapshot:export -- data/staging-backup.json
npm run content:snapshot:seed
npm run content:snapshot:update -- data/site-content-snapshot.json
```

## 3. Reviewer Allowlist Readiness

- [ ] Verify at least one active reviewer exists in `content_reviewer_allowlist`.
- [ ] If the DB allowlist is empty, confirm the fallback env allowlist is acceptable.
- [ ] Decide who is allowed to approve rollback operations in staging.

Suggested verification:

1. Open `/admin/content?lang=en`.
2. Load the snapshot.
3. Open the reviewer allowlist panel.
4. Confirm active reviewers are visible and selectable.

## 4. Save Flow Validation

- [ ] Load the latest snapshot.
- [ ] Make a small reversible edit, ideally in one section only.
- [ ] Enter `Editor` and `Change Summary`.
- [ ] Save successfully.
- [ ] Confirm the top status area shows a `requestId`.
- [ ] Copy the `requestId` and record it for the next checks.

Expected outcome:

- snapshot save succeeds
- `updatedAt` changes
- a new audit row exists
- returned `requestId` is visible immediately in the UI

## 5. History Validation

- [ ] Open `History` after the save.
- [ ] Confirm the newest row shows operation, source audit, requestId, reviewer, and reason as expected.
- [ ] Filter by the saved `requestId`.
- [ ] Confirm the filtered result matches the recent save.
- [ ] Confirm changed sections and summary are correct.

## 6. Rollback Validation

- [ ] Select an active rollback reviewer.
- [ ] Enter a rollback reason.
- [ ] Roll back to the previous audit entry.
- [ ] Confirm the top status area shows a new rollback `requestId`.
- [ ] Confirm the restored content matches the earlier snapshot state.
- [ ] Confirm a new audit entry is written with `operation=rollback` and `sourceAuditId` populated.

Expected outcome:

- rollback succeeds only with an allowed active reviewer
- rollback creates a new audit row rather than mutating history
- rollback requestId can be copied and traced

## 7. Sitemap and Frontend Verification

- [ ] Reload one or more content pages affected by the staging edit.
- [ ] Confirm the site renders the updated content.
- [ ] If guide slugs changed, verify `/sitemap.xml` reflects the current guide routes.
- [ ] Confirm no page crashes when the snapshot changes.

## 8. Failure Path Checks

- [ ] Verify invalid token returns `UNAUTHORIZED`.
- [ ] Verify stale editor state returns `VERSION_CONFLICT`.
- [ ] Verify rollback without an allowed reviewer is blocked.
- [ ] Verify audit rows without rollback payload are not treated as rollbackable.

## 9. Exit Criteria

Staging validation is complete when all of the following are true:

- [ ] save flow works end-to-end
- [ ] history filtering by `requestId` works
- [ ] rollback works end-to-end
- [ ] reviewer allowlist behavior is understood and confirmed
- [ ] updated frontend content renders correctly
- [ ] sitemap remains valid after content changes
- [ ] one exported backup snapshot is stored for recovery

## 10. Recommended Evidence To Capture

- [ ] saved `requestId`
- [ ] rollback `requestId`
- [ ] screenshot of top status area after save
- [ ] screenshot of filtered history by `requestId`
- [ ] exported backup file path used before validation