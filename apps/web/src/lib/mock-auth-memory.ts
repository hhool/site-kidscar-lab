import { compare, hash } from "bcryptjs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

export type StoredUser = {
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

const memoryStorePath = process.env.AUTH_MEMORY_FILE || join(process.cwd(), "data", "auth-memory-store.json");

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

type MemoryStore = {
  users: StoredUser[];
};

async function readMemoryStore(): Promise<MemoryStore> {
  try {
    const raw = await readFile(memoryStorePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<MemoryStore>;
    return {
      users: Array.isArray(parsed.users) ? (parsed.users as StoredUser[]) : [],
    };
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return { users: [] };
    }

    throw error;
  }
}

async function writeMemoryStore(store: MemoryStore) {
  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(memoryStorePath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

export async function ensureMemoryDemoUser() {
  const store = await readMemoryStore();
  const email = normalizeEmail("demo@kidscarlab.com");

  if (store.users.some((user) => user.email === email)) {
    return;
  }

  const passwordHash = await hash("demo1234", 10);
  store.users.push({
    id: crypto.randomUUID(),
    name: "Demo User",
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  });

  await writeMemoryStore(store);
}

export async function getMemoryUserByEmail(email: string): Promise<StoredUser | null> {
  const store = await readMemoryStore();
  return store.users.find((user) => user.email === normalizeEmail(email)) || null;
}

export async function getMemoryUserById(userId: string): Promise<PublicUser | null> {
  const store = await readMemoryStore();
  const user = store.users.find((entry) => entry.id === userId);
  return user ? toPublicUser(user) : null;
}

export async function registerMemoryUser(input: { name: string; email: string; password: string }) {
  const store = await readMemoryStore();
  const email = normalizeEmail(input.email);

  if (store.users.some((user) => user.email === email)) {
    return {
      ok: false as const,
      errorCode: "EMAIL_EXISTS" as const,
    };
  }

  const passwordHash = await hash(input.password, 10);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  await writeMemoryStore(store);

  return {
    ok: true as const,
    user: toPublicUser(user),
  };
}

export async function loginMemoryUser(input: { email: string; password: string }) {
  const user = await getMemoryUserByEmail(input.email);

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
