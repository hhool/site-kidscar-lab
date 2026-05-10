import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Content Admin API optimistic concurrency", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.CONTENT_ADMIN_TOKEN = "test-admin-token";
    process.env.CONTENT_ROLLBACK_REVIEWERS = "ops,qa-reviewer";
    delete process.env.DATABASE_URL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("PUT should save successfully when If-Unmodified-Since matches current version", async () => {
    const updatedAt = "2026-05-10T08:00:00.000Z";
    const writeContentSnapshotIfUnmodified = vi.fn().mockResolvedValue({ ok: true, updatedAt });

    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: vi.fn(),
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified,
    }));

    const { PUT } = await import("@/app/api/content/site/route");

    const snapshotPayload = {
      products: [],
      reviews: [],
      rankings: [],
      news: [],
      guides: [],
      brands: [],
      deals: [],
      community: { qaPosts: [], polls: [], feedback: [] },
    };

    const request = new Request("http://localhost/api/content/site", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-content-admin-token": "test-admin-token",
        "if-unmodified-since": "2026-05-10T07:59:00.000Z",
      },
      body: JSON.stringify(snapshotPayload),
    });

    const response = await PUT(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.updatedAt).toBe(updatedAt);
    expect(body.snapshot).toEqual(snapshotPayload);
    expect(body.requestId).toEqual(expect.any(String));
    expect(writeContentSnapshotIfUnmodified).toHaveBeenCalledWith(
      snapshotPayload,
      "2026-05-10T07:59:00.000Z",
      expect.objectContaining({
        operation: "update",
        requestId: expect.any(String),
      }),
    );
  });

  it("PUT should save successfully without If-Unmodified-Since and persist metadata", async () => {
    const writeContentSnapshot = vi.fn().mockResolvedValue(undefined);
    const readStoredSnapshotRecord = vi.fn().mockResolvedValue({
      snapshot: {
        products: [],
        reviews: [],
        rankings: [],
        news: [],
        guides: [],
        brands: [],
        deals: [],
        community: { qaPosts: [], polls: [], feedback: [] },
      },
      updatedAt: "2026-05-10T08:05:00.000Z",
    });

    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: vi.fn(),
      readStoredSnapshotRecord,
      writeContentSnapshot,
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { PUT } = await import("@/app/api/content/site/route");

    const snapshotPayload = {
      products: [],
      reviews: [],
      rankings: [],
      news: [],
      guides: [],
      brands: [],
      deals: [],
      community: { qaPosts: [], polls: [], feedback: [] },
    };

    const request = new Request("http://localhost/api/content/site", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-content-admin-token": "test-admin-token",
        "x-content-editor": "yan",
        "x-content-change-summary": "Guides copy refresh",
        "x-content-change-sections": JSON.stringify(["guides", "news"]),
      },
      body: JSON.stringify(snapshotPayload),
    });

    const response = await PUT(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.snapshot).toEqual(snapshotPayload);
    expect(body.updatedAt).toBe("2026-05-10T08:05:00.000Z");
    expect(body.requestId).toEqual(expect.any(String));
    expect(writeContentSnapshot).toHaveBeenCalledWith(
      snapshotPayload,
      expect.objectContaining({
        operation: "update",
        requestId: expect.any(String),
        editor: "yan",
        changedSections: ["guides", "news"],
        changeSummary: "Guides copy refresh",
      }),
    );
    expect(readStoredSnapshotRecord).toHaveBeenCalledTimes(1);
  });

  it("PUT should return 409 when If-Unmodified-Since is stale", async () => {
    const conflictUpdatedAt = "2026-05-10T08:10:00.000Z";

    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: vi.fn(),
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn().mockResolvedValue({
        ok: false,
        conflictUpdatedAt,
      }),
    }));

    const { PUT } = await import("@/app/api/content/site/route");

    const snapshotPayload = {
      products: [],
      reviews: [],
      rankings: [],
      news: [],
      guides: [],
      brands: [],
      deals: [],
      community: { qaPosts: [], polls: [], feedback: [] },
    };

    const request = new Request("http://localhost/api/content/site", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        "x-content-admin-token": "test-admin-token",
        "if-unmodified-since": "2026-05-10T07:59:00.000Z",
      },
      body: JSON.stringify(snapshotPayload),
    });

    const response = await PUT(request);
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.ok).toBe(false);
    expect(body.errorCode).toBe("VERSION_CONFLICT");
    expect(body.currentUpdatedAt).toBe(conflictUpdatedAt);
  });

  it("PUT should return 401 when admin token is missing", async () => {
    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: vi.fn(),
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { PUT } = await import("@/app/api/content/site/route");

    const snapshotPayload = {
      products: [],
      reviews: [],
      rankings: [],
      news: [],
      guides: [],
      brands: [],
      deals: [],
      community: { qaPosts: [], polls: [], feedback: [] },
    };

    const request = new Request("http://localhost/api/content/site", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(snapshotPayload),
    });

    const response = await PUT(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.errorCode).toBe("UNAUTHORIZED");
  });

  it("GET should return 401 when admin token is missing", async () => {
    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: vi.fn(),
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { GET } = await import("@/app/api/content/site/route");

    const request = new Request("http://localhost/api/content/site", {
      method: "GET",
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.ok).toBe(false);
    expect(body.errorCode).toBe("UNAUTHORIZED");
  });

  it("GET should return snapshot and updatedAt when authorized", async () => {
    const record = {
      snapshot: {
        products: [],
        reviews: [],
        rankings: [],
        news: [],
        guides: [],
        brands: [],
        deals: [],
        community: { qaPosts: [], polls: [], feedback: [] },
      },
      updatedAt: "2026-05-10T08:30:00.000Z",
    };

    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn().mockResolvedValue(record),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: vi.fn(),
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { GET } = await import("@/app/api/content/site/route");

    const request = new Request("http://localhost/api/content/site", {
      method: "GET",
      headers: {
        "x-content-admin-token": "test-admin-token",
      },
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.snapshot).toEqual(record.snapshot);
    expect(body.updatedAt).toBe(record.updatedAt);
  });

  it("GET should return filtered audit history with pagination", async () => {
    const listAudit = vi.fn().mockResolvedValue({
      items: [
        {
          id: 101,
          snapshotKey: "site-content",
          operation: "rollback",
          sourceAuditId: 88,
          requestId: "req-101",
          editor: "yan",
          reviewer: "ops",
          reason: "bad deploy",
          changedSections: ["guides", "news"],
          changeSummary: "Rollback verification",
          canRollback: true,
          createdAt: "2026-05-10T08:50:00.000Z",
        },
      ],
      pagination: {
        page: 2,
        pageSize: 5,
        total: 11,
        totalPages: 3,
      },
    });

    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: listAudit,
      rollbackContentSnapshotToAudit: vi.fn(),
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { GET } = await import("@/app/api/content/site/route");

    const request = new Request("http://localhost/api/content/site?history=1&page=2&pageSize=5&editor=yan&section=guides&operation=rollback&requestId=req-101", {
      method: "GET",
      headers: {
        "x-content-admin-token": "test-admin-token",
      },
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.history).toHaveLength(1);
    expect(body.history[0]).toMatchObject({
      operation: "rollback",
      sourceAuditId: 88,
      requestId: "req-101",
      reviewer: "ops",
      reason: "bad deploy",
    });
    expect(body.pagination).toEqual({ page: 2, pageSize: 5, total: 11, totalPages: 3 });
    expect(listAudit).toHaveBeenCalledWith({
      page: 2,
      pageSize: 5,
      editor: "yan",
      section: "guides",
      operation: "rollback",
      requestId: "req-101",
      rollbackableOnly: false,
    });
  });

  it("GET should pass rollbackable filter to history query", async () => {
    const listAudit = vi.fn().mockResolvedValue({
      items: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 1,
      },
    });

    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: listAudit,
      rollbackContentSnapshotToAudit: vi.fn(),
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { GET } = await import("@/app/api/content/site/route");

    const request = new Request("http://localhost/api/content/site?history=1&rollbackable=1", {
      method: "GET",
      headers: {
        "x-content-admin-token": "test-admin-token",
      },
    });

    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(listAudit).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      editor: undefined,
      section: undefined,
      operation: undefined,
      requestId: undefined,
      rollbackableOnly: true,
    });
  });

  it("POST rollback should return 428 without if-unmodified-since", async () => {
    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: vi.fn(),
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { POST } = await import("@/app/api/content/site/route");

    const request = new Request("http://localhost/api/content/site?rollback=1", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-content-admin-token": "test-admin-token",
      },
      body: JSON.stringify({ auditId: 22 }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(428);
    expect(body.ok).toBe(false);
    expect(body.errorCode).toBe("PRECONDITION_REQUIRED");
  });

  it("POST rollback should restore snapshot when authorized", async () => {
    const rollback = vi.fn().mockResolvedValue({
      ok: true,
      snapshot: {
        products: [],
        reviews: [],
        rankings: [],
        news: [],
        guides: [],
        brands: [],
        deals: [],
        community: { qaPosts: [], polls: [], feedback: [] },
      },
      updatedAt: "2026-05-10T09:10:00.000Z",
    });

    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: rollback,
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { POST } = await import("@/app/api/content/site/route");

    const request = new Request("http://localhost/api/content/site?rollback=1", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-content-admin-token": "test-admin-token",
        "if-unmodified-since": "2026-05-10T09:00:00.000Z",
        "x-content-editor": "yan",
      },
      body: JSON.stringify({
        auditId: 22,
        changeSummary: "Rollback to stable copy",
        reviewer: "ops",
        reason: "bad deploy",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.updatedAt).toBe("2026-05-10T09:10:00.000Z");
    expect(body.requestId).toEqual(expect.any(String));
    expect(rollback).toHaveBeenCalledWith(22, "2026-05-10T09:00:00.000Z", {
      operation: "rollback",
      sourceAuditId: 22,
      requestId: expect.any(String),
      editor: "yan",
      reviewer: "ops",
      reason: "bad deploy",
      changeSummary: "Rollback to stable copy",
    });
  });

  it("POST rollback requestId should be queryable through GET history filters", async () => {
    let latestRollbackRequestId: string | undefined;

    const rollback = vi.fn().mockImplementation(async (_auditId: number, _expectedUpdatedAt: string, options: { requestId?: string | null }) => {
      latestRollbackRequestId = options.requestId ?? undefined;

      return {
        ok: true,
        snapshot: {
          products: [],
          reviews: [],
          rankings: [],
          news: [],
          guides: [],
          brands: [],
          deals: [],
          community: { qaPosts: [], polls: [], feedback: [] },
        },
        updatedAt: "2026-05-10T09:30:00.000Z",
      };
    });

    const listAudit = vi.fn().mockImplementation(async (options: { operation?: string; requestId?: string }) => {
      const matched = options.operation === "rollback"
        && !!options.requestId
        && options.requestId === latestRollbackRequestId;

      return {
        items: matched
          ? [
              {
                id: 301,
                snapshotKey: "site-content",
                operation: "rollback",
                sourceAuditId: 22,
                requestId: latestRollbackRequestId,
                editor: "yan",
                reviewer: "ops",
                reason: "rollback verification",
                changedSections: ["guides"],
                changeSummary: "Rollback to audit #22",
                canRollback: true,
                createdAt: "2026-05-10T09:30:00.000Z",
              },
            ]
          : [],
        pagination: {
          page: 1,
          pageSize: 20,
          total: matched ? 1 : 0,
          totalPages: 1,
        },
      };
    });

    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: listAudit,
      rollbackContentSnapshotToAudit: rollback,
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { GET, POST } = await import("@/app/api/content/site/route");

    const rollbackRequest = new Request("http://localhost/api/content/site?rollback=1", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-content-admin-token": "test-admin-token",
        "if-unmodified-since": "2026-05-10T09:00:00.000Z",
        "x-content-editor": "yan",
      },
      body: JSON.stringify({
        auditId: 22,
        reviewer: "ops",
        reason: "rollback verification",
      }),
    });

    const rollbackResponse = await POST(rollbackRequest);
    const rollbackBody = await rollbackResponse.json();

    expect(rollbackResponse.status).toBe(200);
    expect(rollbackBody.ok).toBe(true);
    expect(rollbackBody.requestId).toEqual(expect.any(String));
    expect(rollbackBody.requestId).toBe(latestRollbackRequestId);

    const historyRequest = new Request(
      `http://localhost/api/content/site?history=1&operation=rollback&requestId=${rollbackBody.requestId}`,
      {
        method: "GET",
        headers: {
          "x-content-admin-token": "test-admin-token",
        },
      },
    );

    const historyResponse = await GET(historyRequest);
    const historyBody = await historyResponse.json();

    expect(historyResponse.status).toBe(200);
    expect(historyBody.ok).toBe(true);
    expect(historyBody.history).toHaveLength(1);
    expect(historyBody.history[0]).toMatchObject({
      operation: "rollback",
      sourceAuditId: 22,
      requestId: rollbackBody.requestId,
      reviewer: "ops",
      reason: "rollback verification",
    });

    expect(listAudit).toHaveBeenLastCalledWith(
      expect.objectContaining({
        operation: "rollback",
        requestId: rollbackBody.requestId,
      }),
    );
  });

  it("POST rollback should return 400 when reviewer is missing", async () => {
    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: vi.fn(),
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { POST } = await import("@/app/api/content/site/route");

    const request = new Request("http://localhost/api/content/site?rollback=1", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-content-admin-token": "test-admin-token",
        "if-unmodified-since": "2026-05-10T09:00:00.000Z",
      },
      body: JSON.stringify({
        auditId: 22,
        reason: "missing reviewer",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
    expect(body.errorCode).toBe("VALIDATION_ERROR");
  });

  it("POST rollback should return 403 when reviewer is not in allowlist", async () => {
    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: vi.fn(),
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { POST } = await import("@/app/api/content/site/route");

    const request = new Request("http://localhost/api/content/site?rollback=1", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-content-admin-token": "test-admin-token",
        "if-unmodified-since": "2026-05-10T09:00:00.000Z",
      },
      body: JSON.stringify({
        auditId: 22,
        reviewer: "external-user",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.ok).toBe(false);
    expect(body.errorCode).toBe("REVIEWER_NOT_ALLOWED");
  });

  it("POST rollback should return 409 when audit payload is missing", async () => {
    process.env.CONTENT_ROLLBACK_REVIEWERS = "ops";

    const rollback = vi.fn().mockResolvedValue({
      ok: false,
      errorCode: "AUDIT_PAYLOAD_MISSING",
    });

    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: rollback,
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { POST } = await import("@/app/api/content/site/route");

    const request = new Request("http://localhost/api/content/site?rollback=1", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-content-admin-token": "test-admin-token",
        "if-unmodified-since": "2026-05-10T09:00:00.000Z",
      },
      body: JSON.stringify({
        auditId: 22,
        reviewer: "ops",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.ok).toBe(false);
    expect(body.errorCode).toBe("AUDIT_PAYLOAD_MISSING");
  });

  it("POST rollback should use DB allowlist with higher priority than env", async () => {
    process.env.DATABASE_URL = "postgresql://example";
    process.env.CONTENT_ROLLBACK_REVIEWERS = "ops";

    const dbQuery = vi.fn().mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({
      rows: [{ reviewer: "db-approver" }],
    });

    const rollback = vi.fn().mockResolvedValue({
      ok: true,
      snapshot: {
        products: [],
        reviews: [],
        rankings: [],
        news: [],
        guides: [],
        brands: [],
        deals: [],
        community: { qaPosts: [], polls: [], feedback: [] },
      },
      updatedAt: "2026-05-10T09:10:00.000Z",
    });

    vi.doMock("@/lib/db", () => ({
      query: dbQuery,
    }));

    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: rollback,
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { POST } = await import("@/app/api/content/site/route");

    const request = new Request("http://localhost/api/content/site?rollback=1", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-content-admin-token": "test-admin-token",
        "if-unmodified-since": "2026-05-10T09:00:00.000Z",
      },
      body: JSON.stringify({
        auditId: 22,
        reviewer: "db-approver",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(rollback).toHaveBeenCalledTimes(1);
  });

  it("POST rollback should fallback to env allowlist when DB table has no active reviewer", async () => {
    process.env.DATABASE_URL = "postgresql://example";
    process.env.CONTENT_ROLLBACK_REVIEWERS = "ops";

    const dbQuery = vi.fn().mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [] });

    const rollback = vi.fn().mockResolvedValue({
      ok: true,
      snapshot: {
        products: [],
        reviews: [],
        rankings: [],
        news: [],
        guides: [],
        brands: [],
        deals: [],
        community: { qaPosts: [], polls: [], feedback: [] },
      },
      updatedAt: "2026-05-10T09:20:00.000Z",
    });

    vi.doMock("@/lib/db", () => ({
      query: dbQuery,
    }));

    vi.doMock("@/lib/phase3-content-service", () => ({
      getPhase3ContentSnapshotRecord: vi.fn(),
      listContentSnapshotAudit: vi.fn(),
      rollbackContentSnapshotToAudit: rollback,
      readStoredSnapshotRecord: vi.fn(),
      writeContentSnapshot: vi.fn(),
      isPhase3ContentSnapshot: vi.fn().mockReturnValue(true),
      writeContentSnapshotIfUnmodified: vi.fn(),
    }));

    const { POST } = await import("@/app/api/content/site/route");

    const request = new Request("http://localhost/api/content/site?rollback=1", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-content-admin-token": "test-admin-token",
        "if-unmodified-since": "2026-05-10T09:00:00.000Z",
      },
      body: JSON.stringify({
        auditId: 22,
        reviewer: "ops",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(rollback).toHaveBeenCalledTimes(1);
  });
});
