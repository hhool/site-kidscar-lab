type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
};

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

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

function seedDemoUser() {
  const email = "demo@kidscarlab.com";
  if (usersByEmail.has(email)) {
    return;
  }

  usersByEmail.set(email, {
    id: crypto.randomUUID(),
    name: "Demo User",
    email,
    password: "demo1234",
    createdAt: new Date().toISOString(),
  });
}

seedDemoUser();

export function registerUser(input: { name: string; email: string; password: string }) {
  const email = normalizeEmail(input.email);
  if (usersByEmail.has(email)) {
    return {
      ok: false as const,
      errorCode: "EMAIL_EXISTS" as const,
    };
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    password: input.password,
    createdAt: new Date().toISOString(),
  };

  usersByEmail.set(email, user);

  return {
    ok: true as const,
    user: toPublicUser(user),
  };
}

export function loginUser(input: { email: string; password: string }) {
  const email = normalizeEmail(input.email);
  const user = usersByEmail.get(email);

  if (!user || user.password !== input.password) {
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
