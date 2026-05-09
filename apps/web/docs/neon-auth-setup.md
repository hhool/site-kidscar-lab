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

## Notes

- Passwords are stored as bcrypt hashes.
- Current implementation uses a mock token response and does not yet persist sessions/cookies.
- For production, add secure session handling (httpOnly cookies + token/session table).
