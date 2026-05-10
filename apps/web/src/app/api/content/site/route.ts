import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  getPhase3ContentSnapshotRecord,
  isPhase3ContentSnapshot,
  listContentSnapshotAudit,
  readStoredSnapshotRecord,
  rollbackContentSnapshotToAudit,
  writeContentSnapshotIfUnmodified,
  writeContentSnapshot,
} from "@/lib/phase3-content-service";

const ADMIN_TOKEN_ENV = "CONTENT_ADMIN_TOKEN";
const ROLLBACK_REVIEWERS_ENV = "CONTENT_ROLLBACK_REVIEWERS";

function getEnvRollbackReviewerAllowlist(): Set<string> {
  const raw = process.env[ROLLBACK_REVIEWERS_ENV] ?? "";
  return new Set(
    raw
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item.length > 0),
  );
}

async function getRollbackReviewerAllowlist(): Promise<Set<string>> {
  if (!process.env.DATABASE_URL) {
    return getEnvRollbackReviewerAllowlist();
  }

  try {
    await query(`
      CREATE TABLE IF NOT EXISTS content_reviewer_allowlist (
        reviewer TEXT PRIMARY KEY,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    const result = await query<{ reviewer: string }>(
      `
        SELECT reviewer
        FROM content_reviewer_allowlist
        WHERE is_active = TRUE
      `,
    );

    const dbSet = new Set(
      result.rows
        .map((row) => row.reviewer?.trim().toLowerCase())
        .filter((item): item is string => typeof item === "string" && item.length > 0),
    );

    return dbSet.size > 0 ? dbSet : getEnvRollbackReviewerAllowlist();
  } catch {
    return getEnvRollbackReviewerAllowlist();
  }
}

function getBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) {
    return null;
  }

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

function isAuthorized(request: Request): boolean {
  const expected = process.env[ADMIN_TOKEN_ENV];
  if (!expected) {
    return false;
  }

  const bearer = getBearerToken(request);
  const headerToken = request.headers.get("x-content-admin-token");

  return bearer === expected || headerToken === expected;
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      ok: false,
      errorCode: "UNAUTHORIZED",
      message: `Missing or invalid admin token. Configure ${ADMIN_TOKEN_ENV}.`,
    },
    { status: 401 },
  );
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    const url = new URL(request.url);
    if (url.searchParams.get("history") === "1") {
      const pageValue = url.searchParams.get("page");
      const pageSizeValue = url.searchParams.get("pageSize");
      const editor = url.searchParams.get("editor") ?? undefined;
      const section = url.searchParams.get("section") ?? undefined;
      const operation = url.searchParams.get("operation");
      const requestId = url.searchParams.get("requestId") ?? undefined;
      const rollbackableOnly = url.searchParams.get("rollbackable") === "1";

      const page = pageValue ? Number.parseInt(pageValue, 10) : 1;
      const pageSize = pageSizeValue ? Number.parseInt(pageSizeValue, 10) : 20;

      const history = await listContentSnapshotAudit({
        page,
        pageSize,
        editor,
        section,
        operation: operation === "update" || operation === "rollback" ? operation : undefined,
        requestId,
        rollbackableOnly,
      });
      return NextResponse.json({ ok: true, history: history.items, pagination: history.pagination });
    }

    const record = await getPhase3ContentSnapshotRecord();
    return NextResponse.json({ ok: true, snapshot: record.snapshot, updatedAt: record.updatedAt });
  } catch {
    return NextResponse.json({ ok: false, errorCode: "SERVER_ERROR", snapshot: null }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errorCode: "INVALID_PAYLOAD", message: "Invalid JSON payload." }, { status: 400 });
  }

  if (!isPhase3ContentSnapshot(body)) {
    return NextResponse.json(
      { ok: false, errorCode: "VALIDATION_ERROR", message: "Payload does not match content snapshot schema." },
      { status: 400 },
    );
  }

  try {
    const requestId = crypto.randomUUID();

    const editorHeader = request.headers.get("x-content-editor");
    const editor = editorHeader?.trim() ? editorHeader.trim() : null;

    const changeSummaryHeader = request.headers.get("x-content-change-summary");
    const changeSummary = changeSummaryHeader?.trim() ? changeSummaryHeader.trim() : null;

    const changedSectionsHeader = request.headers.get("x-content-change-sections");
    let changedSections: string[] = [];
    if (changedSectionsHeader) {
      try {
        const parsed = JSON.parse(changedSectionsHeader) as unknown;
        if (Array.isArray(parsed)) {
          changedSections = parsed.filter((value): value is string => typeof value === "string");
        }
      } catch {
        // Ignore invalid change summary headers and continue without section metadata.
      }
    }

    const expectedUpdatedAt = request.headers.get("if-unmodified-since");
    if (expectedUpdatedAt) {
      const result = await writeContentSnapshotIfUnmodified(body, expectedUpdatedAt, {
        operation: "update",
        requestId,
        editor,
        changedSections,
        changeSummary,
      });
      if (!result.ok) {
        return NextResponse.json(
          {
            ok: false,
            errorCode: "VERSION_CONFLICT",
            message: "Snapshot was updated by another editor. Please reload before saving.",
            currentUpdatedAt: result.conflictUpdatedAt,
          },
          { status: 409 },
        );
      }

      return NextResponse.json({
        ok: true,
        snapshot: body,
        updatedAt: result.updatedAt,
        requestId,
      });
    }

    await writeContentSnapshot(body, {
      operation: "update",
      requestId,
      editor,
      changedSections,
      changeSummary,
    });

    const record = await readStoredSnapshotRecord();

    return NextResponse.json({
      ok: true,
      snapshot: body,
      updatedAt: record?.updatedAt ?? new Date().toISOString(),
      requestId,
    });
  } catch {
    return NextResponse.json({ ok: false, errorCode: "SERVER_ERROR", snapshot: null }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  const url = new URL(request.url);
  if (url.searchParams.get("rollback") !== "1") {
    return NextResponse.json({ ok: false, errorCode: "INVALID_ACTION", message: "Unsupported POST action." }, { status: 400 });
  }

  const expectedUpdatedAt = request.headers.get("if-unmodified-since");
  if (!expectedUpdatedAt) {
    return NextResponse.json(
      { ok: false, errorCode: "PRECONDITION_REQUIRED", message: "Missing if-unmodified-since header." },
      { status: 428 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errorCode: "INVALID_PAYLOAD", message: "Invalid JSON payload." }, { status: 400 });
  }

  const input = body as {
    auditId?: unknown;
    changeSummary?: unknown;
    reviewer?: unknown;
    reason?: unknown;
  };
  const auditId = typeof input.auditId === "number" ? input.auditId : Number(input.auditId);
  if (!Number.isInteger(auditId) || auditId <= 0) {
    return NextResponse.json(
      { ok: false, errorCode: "VALIDATION_ERROR", message: "auditId must be a positive integer." },
      { status: 400 },
    );
  }

  const editorHeader = request.headers.get("x-content-editor");
  const editor = editorHeader?.trim() ? editorHeader.trim() : null;

  const changeSummary = typeof input.changeSummary === "string" && input.changeSummary.trim()
    ? input.changeSummary.trim()
    : null;

  const reviewer = typeof input.reviewer === "string" && input.reviewer.trim()
    ? input.reviewer.trim()
    : null;

  const reason = typeof input.reason === "string" && input.reason.trim()
    ? input.reason.trim()
    : null;

  if (!reviewer) {
    return NextResponse.json(
      {
        ok: false,
        errorCode: "VALIDATION_ERROR",
        message: "Rollback requires reviewer.",
      },
      { status: 400 },
    );
  }

  const reviewerAllowlist = await getRollbackReviewerAllowlist();
  if (reviewerAllowlist.size === 0) {
    return NextResponse.json(
      {
        ok: false,
        errorCode: "SERVER_MISCONFIG",
        message: `Rollback reviewer allowlist is empty. Configure ${ROLLBACK_REVIEWERS_ENV}.`,
      },
      { status: 500 },
    );
  }

  if (!reviewerAllowlist.has(reviewer.toLowerCase())) {
    return NextResponse.json(
      {
        ok: false,
        errorCode: "REVIEWER_NOT_ALLOWED",
        message: "Reviewer is not in rollback allowlist.",
      },
      { status: 403 },
    );
  }

  try {
    const requestId = crypto.randomUUID();

    const result = await rollbackContentSnapshotToAudit(auditId, expectedUpdatedAt, {
      operation: "rollback",
      sourceAuditId: auditId,
      requestId,
      editor,
      reviewer,
      reason,
      changeSummary,
    });

    if (!result.ok && result.errorCode === "AUDIT_NOT_FOUND") {
      return NextResponse.json(
        { ok: false, errorCode: "AUDIT_NOT_FOUND", message: "Audit record not found or unavailable for rollback." },
        { status: 404 },
      );
    }

    if (!result.ok && result.errorCode === "AUDIT_PAYLOAD_MISSING") {
      return NextResponse.json(
        { ok: false, errorCode: "AUDIT_PAYLOAD_MISSING", message: "Audit record exists but has no rollback snapshot payload." },
        { status: 409 },
      );
    }

    if (!result.ok && result.errorCode === "VERSION_CONFLICT") {
      return NextResponse.json(
        {
          ok: false,
          errorCode: "VERSION_CONFLICT",
          message: "Snapshot was updated by another editor. Please reload before rollback.",
          currentUpdatedAt: result.conflictUpdatedAt,
        },
        { status: 409 },
      );
    }

    if (!result.ok) {
      return NextResponse.json({ ok: false, errorCode: "SERVER_ERROR", snapshot: null }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      snapshot: result.snapshot,
      updatedAt: result.updatedAt,
      requestId,
    });
  } catch {
    return NextResponse.json({ ok: false, errorCode: "SERVER_ERROR", snapshot: null }, { status: 500 });
  }
}
