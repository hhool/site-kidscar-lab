import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Auth API integration paths", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("register success should return 201 and set cookie", async () => {
    vi.doMock("@/lib/mock-auth", () => ({
      registerUser: vi.fn().mockResolvedValue({
        ok: true,
        user: { id: "u-1", name: "Alice", email: "alice@example.com", createdAt: new Date().toISOString() },
      }),
    }));

    vi.doMock("@/lib/auth-session", () => ({
      AUTH_COOKIE_NAME: "kcl_session",
      createSessionToken: vi.fn().mockReturnValue("token-1"),
      getSessionMaxAge: vi.fn().mockReturnValue(3600),
    }));

    const { POST } = await import("@/app/api/auth/register/route");

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "Alice", email: "alice@example.com", password: "password123" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.ok).toBe(true);
    expect(response.headers.get("set-cookie") || "").toContain("kcl_session=");
  });

  it("login invalid credentials should return 401", async () => {
    vi.doMock("@/lib/mock-auth", () => ({
      loginUser: vi.fn().mockResolvedValue({ ok: false, errorCode: "INVALID_CREDENTIALS" }),
    }));

    vi.doMock("@/lib/auth-session", () => ({
      AUTH_COOKIE_NAME: "kcl_session",
      createSessionToken: vi.fn().mockReturnValue("token-1"),
      getSessionMaxAge: vi.fn().mockReturnValue(3600),
    }));

    const { POST } = await import("@/app/api/auth/login/route");

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "alice@example.com", password: "password123" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.errorCode).toBe("INVALID_CREDENTIALS");
  });

  it("login success should return 200 and set cookie", async () => {
    vi.doMock("@/lib/mock-auth", () => ({
      loginUser: vi.fn().mockResolvedValue({
        ok: true,
        user: { id: "u-1", name: "Alice", email: "alice@example.com", createdAt: new Date().toISOString() },
      }),
    }));

    vi.doMock("@/lib/auth-session", () => ({
      AUTH_COOKIE_NAME: "kcl_session",
      createSessionToken: vi.fn().mockReturnValue("token-2"),
      getSessionMaxAge: vi.fn().mockReturnValue(3600),
    }));

    const { POST } = await import("@/app/api/auth/login/route");

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "alice@example.com", password: "password123" }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(response.headers.get("set-cookie") || "").toContain("kcl_session=");
  });

  it("logout should clear cookie", async () => {
    const { POST } = await import("@/app/api/auth/logout/route");

    const request = new Request("http://localhost/api/auth/logout", {
      method: "POST",
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie") || "";
    expect(setCookie).toContain("kcl_session=");
    expect(setCookie.toLowerCase()).toContain("max-age=0");
  });
});
