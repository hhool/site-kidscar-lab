# KidsCarLab Web

Next.js application scaffold for KidsCarLab prototype migration.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run check
npm run test
```

`npm run check` is the Day 4 quality gate and must pass before commit.

Current check flow:

```bash
npm run lint && npm run test && npm run build
```

## Local Preview

```bash
npm run dev:local
```

Equivalent explicit command:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3010
```

Open http://127.0.0.1:3010 in browser.

Important:

- run the command from `apps/web`, not from the workspace root
- if port `3010` is already in use, Next will report the existing dev server PID
- to inspect the listener on macOS:

```bash
lsof -nP -iTCP:3010 -sTCP:LISTEN
```

- if the process is an existing `next dev` for the same app, reuse it or stop that PID before starting a new one

Recommended local restart flow on macOS:

```bash
cd /path/to/apps/web
lsof -nP -iTCP:3010 -sTCP:LISTEN
kill <PID>
npm run dev:local
```

If you want to verify the process before killing it:

```bash
ps -p <PID> -o pid=,ppid=,command=
```

## Content Admin Setup

Add the following to `.env.local` when using the content admin workflow:

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
CONTENT_ADMIN_TOKEN=replace-with-long-random-admin-token
CONTENT_ROLLBACK_REVIEWERS=ops,qa-reviewer
```

- `CONTENT_ADMIN_TOKEN`: required for [src/app/admin/content/page.tsx](src/app/admin/content/page.tsx) and protected content admin APIs
- `CONTENT_ROLLBACK_REVIEWERS`: fallback rollback reviewer allowlist when the `content_reviewer_allowlist` table is empty or unavailable
- DB allowlist has higher priority than `CONTENT_ROLLBACK_REVIEWERS` when `DATABASE_URL` is configured

Open `/admin/content?lang=en` or `/admin/content?lang=zh` after setting the token.

Current admin features:

- load and save the `content_snapshots` source of truth
- optimistic concurrency via `If-Unmodified-Since`
- structured audit metadata: operation, source audit id, requestId, reviewer, reason
- history filters for editor, section, operation, rollbackable, and requestId
- rollback with reviewer allowlist enforcement
- immediate requestId visibility and copy actions after save/rollback

Detailed operations guide: [docs/content-admin.md](docs/content-admin.md)
- Staging validation checklist: [docs/content-admin-staging-checklist.md](docs/content-admin-staging-checklist.md)
- Final acceptance checklist: [docs/final-acceptance-checklist.md](docs/final-acceptance-checklist.md)
- Final acceptance report (2026-05-10): [docs/final-acceptance-report-2026-05-10.md](docs/final-acceptance-report-2026-05-10.md)
- Phase 3 release handoff: [docs/phase3-release-handoff.md](docs/phase3-release-handoff.md)
- Phase 3 release-day runbook: [docs/phase3-release-day-runbook.md](docs/phase3-release-day-runbook.md)
- Phase 3 release chat templates: [docs/phase3-release-chat-templates.md](docs/phase3-release-chat-templates.md)
- Phase 3 release chat templates (prefilled): [docs/phase3-release-chat-templates-prefilled.md](docs/phase3-release-chat-templates-prefilled.md)
- Phase 3 release monitoring checklist: [docs/phase3-release-monitoring-checklist.md](docs/phase3-release-monitoring-checklist.md)
- Phase 3 release monitoring sheet (one-page): [docs/phase3-release-monitoring-sheet.md](docs/phase3-release-monitoring-sheet.md)
- Phase 3 PR ready pack: [docs/phase3-pr-ready-pack.md](docs/phase3-pr-ready-pack.md)
- Phase 3 release 10-min brief: [docs/phase3-release-10min-brief.md](docs/phase3-release-10min-brief.md)
- Phase 3 push/PR commands: [docs/phase3-push-pr-commands.md](docs/phase3-push-pr-commands.md)

## Content Snapshot Scripts

Use the snapshot helper scripts to seed, overwrite, or export Phase 3 content:

```bash
npm run content:snapshot:seed
npm run content:snapshot:update
npm run content:snapshot:export
```

Optional file path override:

```bash
npm run content:snapshot:update -- data/site-content-snapshot.json
```

- `seed`: writes initial content only when the DB snapshot does not exist yet
- `update`: overwrites the DB snapshot from a file or the in-repo default snapshot
- `export`: exports the DB snapshot to disk, or falls back to the in-repo default snapshot when DB data is unavailable

Optional SEO base URL override:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

## Auth Persistence (Neon Free Postgres)

Set `DATABASE_URL` in `.env.local` to enable persistent login/register storage.

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
```

See [docs/neon-auth-setup.md](docs/neon-auth-setup.md) for the full setup flow.

## Test Notes

- `npm run test` runs Vitest integration/unit coverage
- `npx playwright test` uses `next start` on port `3108`, so run `npm run build` first after source edits
- validated broad regression command:

```bash
npm run test -- src/app/api/content/content-api.integration.test.ts src/app/api/content/reviewer-allowlist.integration.test.ts && \
npx playwright test tests/ui/admin-content.spec.ts tests/ui/phase3-content.spec.ts tests/ui/catalog-content.spec.ts && \
npm run build
```

## Project Structure

- `src/app`: routes, layout, metadata routes
- `src/components`: app shell and reusable components
- `src/lib/constants`: routes, locales, module constants
- `docs`: coding, naming, and commit conventions

## SEO Baseline (Day 4)

- root metadata configured in `src/app/layout.tsx`
- robots route in `src/app/robots.ts`
- sitemap route in `src/app/sitemap.ts`

## Current Scope

- unified shell: top navigation, page shell, footer
- no-refresh language switch (`lang` query + local storage)
- persisted auth with Neon Postgres + httpOnly cookie session
- protected account route with redirect reason notice
- bilingual placeholders for all primary routes

## Phase 0 Snapshot

- See `docs/phase0-snapshot.md` for closure summary and Phase 1 entry checklist.

## Phase Snapshots

- Phase 1 freeze summary: `docs/phase1-snapshot.md`
- Phase 3 content/admin summary: `docs/phase3-snapshot.md`
