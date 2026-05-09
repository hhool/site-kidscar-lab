# KidsCarLab Web

Next.js application scaffold for KidsCarLab prototype migration.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run check
```

`npm run check` is the Day 4 quality gate and must pass before commit.

## Local Preview

```bash
npm run dev -- --hostname 127.0.0.1 --port 3010
```

Open http://127.0.0.1:3010 in browser.

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
