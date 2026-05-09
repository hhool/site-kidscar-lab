import { compare, hash } from "bcryptjs";
import { query } from "@/lib/db";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

let usersTableReady = false;
let demoUserSeeded = false;

type MemoryAuthModule = typeof import("./mock-auth-memory");

async function loadMemoryAuth(): Promise<MemoryAuthModule> {
  return import("./mock-auth-memory");
}

function shouldUseMemoryAuthStore() {
  return process.env.AUTH_DATA_MODE === "memory" || !process.env.DATABASE_URL;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

async function ensureUsersTable() {
  if (usersTableReady) {
    return;
  }

  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  usersTableReady = true;
}

async function seedDemoUser() {
  if (demoUserSeeded) {
    return;
  }

  const email = "demo@kidscarlab.com";
  const passwordHash = await hash("demo1234", 10);

  await query(
    `
      INSERT INTO users (id, name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `,
    [crypto.randomUUID(), "Demo User", email, passwordHash],
  );

  demoUserSeeded = true;
}

async function seedMemoryDemoUser() {
  const memoryAuth = await loadMemoryAuth();
  await memoryAuth.ensureMemoryDemoUser();
}

async function getUserByEmail(email: string): Promise<StoredUser | null> {
  if (shouldUseMemoryAuthStore()) {
    const memoryAuth = await loadMemoryAuth();
    return memoryAuth.getMemoryUserByEmail(email);
  }

  const result = await query<{
    id: string;
    name: string;
    email: string;
    password_hash: string;
    created_at: string;
  }>(
    `
      SELECT id, name, email, password_hash, created_at
      FROM users
      WHERE email = $1
      LIMIT 1
    `,
    [email],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function getUserById(userId: string): Promise<PublicUser | null> {
  if (shouldUseMemoryAuthStore()) {
    const memoryAuth = await loadMemoryAuth();
    return memoryAuth.getMemoryUserById(userId);
  }

  await ensureReady();

  const result = await query<{
    id: string;
    name: string;
    email: string;
    created_at: string;
  }>(
    `
      SELECT id, name, email, created_at
      FROM users
      WHERE id = $1
      LIMIT 1
    `,
    [userId],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

async function ensureReady() {
  if (shouldUseMemoryAuthStore()) {
    await seedMemoryDemoUser();
    return;
  }

  await ensureUsersTable();
  await seedDemoUser();
}

export async function registerUser(input: { name: string; email: string; password: string }) {
  await ensureReady();

  const email = normalizeEmail(input.email);
  const existing = await getUserByEmail(email);

  if (existing) {
    return {
      ok: false as const,
      errorCode: "EMAIL_EXISTS" as const,
    };
  }

  const passwordHash = await hash(input.password, 10);
  if (shouldUseMemoryAuthStore()) {
    const memoryAuth = await loadMemoryAuth();
    return memoryAuth.registerMemoryUser(input);
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  await query(
    `
      INSERT INTO users (id, name, email, password_hash, created_at)
      VALUES ($1, $2, $3, $4, $5)
    `,
    [user.id, user.name, user.email, user.passwordHash, user.createdAt],
  );

  return {
    ok: true as const,
    user: toPublicUser(user),
  };
}

export async function loginUser(input: { email: string; password: string }) {
  await ensureReady();

  const email = normalizeEmail(input.email);

  if (shouldUseMemoryAuthStore()) {
    const memoryAuth = await loadMemoryAuth();
    return memoryAuth.loginMemoryUser(input);
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return {
      ok: false as const,
      errorCode: "INVALID_CREDENTIALS" as const,
    };
  }

  const matched = await compare(input.password, user.passwordHash);
  if (!matched) {
    return {
      ok: false as const,
      errorCode: "INVALID_CREDENTIALS" as const,
    };
  }

  return {
    ok: true as const,
    user: toPublicUser(user),
  };
}
