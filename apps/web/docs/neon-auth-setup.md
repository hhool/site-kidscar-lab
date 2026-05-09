# Neon Auth Persistence Setup

This project supports persistent auth storage using Neon Postgres (free tier).

## 1. Create Neon Database (Free)

1. Sign in to Neon.
2. Create a new project on the free plan.
3. Copy the connection string (Postgres URL).

## 2. Configure Environment Variable

Create a local `.env.local` file in `apps/web` and set:

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
AUTH_SESSION_SECRET=replace-with-a-long-random-secret
```

You can start from `.env.example`.

## 3. Start the App

```bash
npm run dev -- --hostname 127.0.0.1 --port 3010
```

When first calling auth APIs, the app will:

- create `users` table automatically (if missing)
- seed demo account automatically (if missing)

## 4. Demo Account

- Email: `demo@kidscarlab.com`
- Password: `demo1234`

## 5. API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`


## Notes

- `npm run e2e:auth` after `npm run build` for the minimal login/account/logout smoke test.
- The smoke test runs with `AUTH_DATA_MODE=memory` by default so it does not need Neon credentials.

## Local smoke mode

- Set `AUTH_DATA_MODE=memory` to run the auth flow without Neon Postgres.
- This mode is intended for local smoke tests and CI only.
- The default remains Neon Postgres whenever `DATABASE_URL` is available.
