import { compare, hash } from "bcryptjs";

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

const DEMO_USER_ID = "memory-demo-user";
const DEMO_EMAIL = "demo@kidscarlab.com";
const DEMO_PASSWORD = "demo1234";

const usersById = new Map<string, StoredUser>();
const usersByEmail = new Map<string, StoredUser>();

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

async function ensureDemoUser() {
  if (usersByEmail.has(normalizeEmail(DEMO_EMAIL))) {
    return;
  }

  const passwordHash = await hash(DEMO_PASSWORD, 10);
  const user: StoredUser = {
    id: DEMO_USER_ID,
    name: "Demo User",
    email: normalizeEmail(DEMO_EMAIL),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  usersById.set(user.id, user);
  usersByEmail.set(user.email, user);
}

export async function ensureMemoryDemoUser() {
  await ensureDemoUser();
}

export async function getMemoryUserByEmail(email: string): Promise<StoredUser | null> {
  await ensureDemoUser();
  return usersByEmail.get(normalizeEmail(email)) || null;
}

export async function getMemoryUserById(userId: string): Promise<PublicUser | null> {
  await ensureDemoUser();
  const user = usersById.get(userId);
  return user ? toPublicUser(user) : null;
}

export async function registerMemoryUser(input: { name: string; email: string; password: string }) {
  await ensureDemoUser();

  const email = normalizeEmail(input.email);
  if (usersByEmail.has(email)) {
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

  usersById.set(user.id, user);
  usersByEmail.set(user.email, user);

  return {
    ok: true as const,
    user: toPublicUser(user),
  };
}

export async function loginMemoryUser(input: { email: string; password: string }) {
  await ensureDemoUser();

  const user = usersByEmail.get(normalizeEmail(input.email));
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
