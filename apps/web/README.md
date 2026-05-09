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

## Local Preview

```bash
npm run dev -- --hostname 127.0.0.1 --port 3010
```

Open http://127.0.0.1:3010 in browser.

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
- mock auth state switch in navigation
- bilingual placeholders for all primary routes

## Phase 0 Snapshot

- See `docs/phase0-snapshot.md` for closure summary and Phase 1 entry checklist.
