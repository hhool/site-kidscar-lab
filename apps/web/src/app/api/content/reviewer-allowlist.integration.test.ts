import { beforeEach, describe, expect, it, vi } from "vitest";

describe("Content Reviewer Allowlist API", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.CONTENT_ADMIN_TOKEN = "test-admin-token";
  });

  it("GET should return 401 when token is missing", async () => {
    vi.doMock("@/lib/db", () => ({ query: vi.fn() }));
    const { GET } = await import("@/app/api/content/reviewer-allowlist/route");

    const response = await GET(new Request("http://localhost/api/content/reviewer-allowlist", { method: "GET" }));
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.errorCode).toBe("UNAUTHORIZED");
  });

  it("GET should list reviewers when authorized", async () => {
    const dbQuery = vi
      .fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ total: 2 }] })
      .mockResolvedValueOnce({
        rows: [
          { reviewer: "ops", is_active: true, updated_at: "2026-05-10T10:00:00.000Z" },
          { reviewer: "qa-reviewer", is_active: false, updated_at: "2026-05-10T10:10:00.000Z" },
        ],
      });

    vi.doMock("@/lib/db", () => ({ query: dbQuery }));
    const { GET } = await import("@/app/api/content/reviewer-allowlist/route");

    const response = await GET(
      new Request("http://localhost/api/content/reviewer-allowlist?includeInactive=1", {
        method: "GET",
        headers: { "x-content-admin-token": "test-admin-token" },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.reviewers).toHaveLength(2);
    expect(body.pagination).toEqual({ page: 1, pageSize: 20, total: 2, totalPages: 1 });
    expect(body.reviewers[0]).toEqual({
      reviewer: "ops",
      isActive: true,
      updatedAt: "2026-05-10T10:00:00.000Z",
    });
  });

  it("GET should support search and pagination", async () => {
    const dbQuery = vi
      .fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ total: 3 }] })
      .mockResolvedValueOnce({
        rows: [
          { reviewer: "ops", is_active: true, updated_at: "2026-05-10T10:00:00.000Z" },
        ],
      });

    vi.doMock("@/lib/db", () => ({ query: dbQuery }));
    const { GET } = await import("@/app/api/content/reviewer-allowlist/route");

    const response = await GET(
      new Request("http://localhost/api/content/reviewer-allowlist?q=op&page=2&pageSize=1", {
        method: "GET",
        headers: { "x-content-admin-token": "test-admin-token" },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.reviewers).toHaveLength(1);
    expect(body.pagination).toEqual({ page: 2, pageSize: 1, total: 3, totalPages: 3 });
  });

  it("GET should return full active list when all=1", async () => {
    const dbQuery = vi
      .fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ total: 2 }] })
      .mockResolvedValueOnce({
        rows: [
          { reviewer: "ops", is_active: true, updated_at: "2026-05-10T10:00:00.000Z" },
          { reviewer: "qa-reviewer", is_active: true, updated_at: "2026-05-10T10:10:00.000Z" },
        ],
      });

    vi.doMock("@/lib/db", () => ({ query: dbQuery }));
    const { GET } = await import("@/app/api/content/reviewer-allowlist/route");

    const response = await GET(
      new Request("http://localhost/api/content/reviewer-allowlist?all=1", {
        method: "GET",
        headers: { "x-content-admin-token": "test-admin-token" },
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.reviewers).toHaveLength(2);
    expect(body.pagination).toEqual({ page: 1, pageSize: 2, total: 2, totalPages: 1 });
  });

  it("POST should upsert reviewer", async () => {
    const dbQuery = vi
      .fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [], rowCount: 1 });
    vi.doMock("@/lib/db", () => ({ query: dbQuery }));

    const { POST } = await import("@/app/api/content/reviewer-allowlist/route");
    const response = await POST(
      new Request("http://localhost/api/content/reviewer-allowlist", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-content-admin-token": "test-admin-token",
        },
        body: JSON.stringify({ reviewer: "OPS", isActive: false }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.reviewer).toBe("ops");
    expect(body.isActive).toBe(false);
  });

  it("PATCH should toggle reviewer status", async () => {
    const dbQuery = vi
      .fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ reviewer: "ops" }], rowCount: 1 });
    vi.doMock("@/lib/db", () => ({ query: dbQuery }));

    const { PATCH } = await import("@/app/api/content/reviewer-allowlist/route");
    const response = await PATCH(
      new Request("http://localhost/api/content/reviewer-allowlist", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-content-admin-token": "test-admin-token",
        },
        body: JSON.stringify({ reviewer: "ops", isActive: false }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.reviewer).toBe("ops");
    expect(body.isActive).toBe(false);
  });

  it("DELETE should remove reviewer", async () => {
    const dbQuery = vi
      .fn()
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [{ reviewer: "ops" }], rowCount: 1 });
    vi.doMock("@/lib/db", () => ({ query: dbQuery }));

    const { DELETE } = await import("@/app/api/content/reviewer-allowlist/route");
    const response = await DELETE(
      new Request("http://localhost/api/content/reviewer-allowlist", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "x-content-admin-token": "test-admin-token",
        },
        body: JSON.stringify({ reviewer: "ops" }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.reviewer).toBe("ops");
  });
});