import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const ADMIN_TOKEN_ENV = "CONTENT_ADMIN_TOKEN";

type ReviewerAllowlistRow = {
  reviewer: string;
  is_active: boolean;
  updated_at: string;
};

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

function toNormalizedReviewer(input: unknown): string | null {
  if (typeof input !== "string") {
    return null;
  }

  const normalized = input.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

async function ensureReviewerAllowlistTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS content_reviewer_allowlist (
      reviewer TEXT PRIMARY KEY,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  try {
    await ensureReviewerAllowlistTable();

    const url = new URL(request.url);
    const includeInactive = url.searchParams.get("includeInactive") === "1";
    const all = url.searchParams.get("all") === "1";
    const pageValue = url.searchParams.get("page");
    const pageSizeValue = url.searchParams.get("pageSize");
    const q = url.searchParams.get("q")?.trim() ?? "";

    const page = pageValue ? Number.parseInt(pageValue, 10) : 1;
    const pageSize = pageSizeValue ? Number.parseInt(pageSizeValue, 10) : 20;
    const safePage = Number.isFinite(page) ? Math.max(1, page) : 1;
    const safePageSize = Number.isFinite(pageSize) ? Math.max(1, Math.min(100, pageSize)) : 20;

    const whereClauses: string[] = [];
    const params: unknown[] = [];

    if (!includeInactive) {
      whereClauses.push("is_active = TRUE");
    }

    if (q.length > 0) {
      params.push(`%${q.toLowerCase()}%`);
      whereClauses.push(`LOWER(reviewer) LIKE $${params.length}`);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const countResult = await query<{ total: number }>(
      `
        SELECT COUNT(*)::int AS total
        FROM content_reviewer_allowlist
        ${whereSql}
      `,
      params,
    );

    const total = Number(countResult.rows[0]?.total ?? 0);
    const effectivePageSize = all ? Math.max(1, total || 1) : safePageSize;
    const totalPages = all ? 1 : Math.max(1, Math.ceil(total / effectivePageSize));
    const safeCurrentPage = all ? 1 : Math.min(safePage, totalPages);
    const offset = all ? 0 : (safeCurrentPage - 1) * effectivePageSize;

    const result = await query<ReviewerAllowlistRow>(
      `
        SELECT reviewer, is_active, updated_at
        FROM content_reviewer_allowlist
        ${whereSql}
        ORDER BY reviewer ASC
        LIMIT $${params.length + 1}
        OFFSET $${params.length + 2}
      `,
      [...params, effectivePageSize, offset],
    );

    return NextResponse.json({
      ok: true,
      reviewers: result.rows.map((row) => ({
        reviewer: row.reviewer,
        isActive: row.is_active,
        updatedAt: new Date(row.updated_at).toISOString(),
      })),
      pagination: {
        page: safeCurrentPage,
        pageSize: effectivePageSize,
        total,
        totalPages,
      },
    });
  } catch {
    return NextResponse.json({ ok: false, errorCode: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errorCode: "INVALID_PAYLOAD", message: "Invalid JSON payload." }, { status: 400 });
  }

  const input = body as {
    reviewer?: unknown;
    isActive?: unknown;
  };

  const reviewer = toNormalizedReviewer(input.reviewer);
  if (!reviewer) {
    return NextResponse.json(
      { ok: false, errorCode: "VALIDATION_ERROR", message: "reviewer is required." },
      { status: 400 },
    );
  }

  const isActive = typeof input.isActive === "boolean" ? input.isActive : true;

  try {
    await ensureReviewerAllowlistTable();
    await query(
      `
        INSERT INTO content_reviewer_allowlist (reviewer, is_active, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (reviewer)
        DO UPDATE SET is_active = EXCLUDED.is_active, updated_at = NOW()
      `,
      [reviewer, isActive],
    );

    return NextResponse.json({ ok: true, reviewer, isActive });
  } catch {
    return NextResponse.json({ ok: false, errorCode: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errorCode: "INVALID_PAYLOAD", message: "Invalid JSON payload." }, { status: 400 });
  }

  const input = body as {
    reviewer?: unknown;
    isActive?: unknown;
  };

  const reviewer = toNormalizedReviewer(input.reviewer);
  if (!reviewer || typeof input.isActive !== "boolean") {
    return NextResponse.json(
      { ok: false, errorCode: "VALIDATION_ERROR", message: "reviewer and isActive are required." },
      { status: 400 },
    );
  }

  try {
    await ensureReviewerAllowlistTable();
    const result = await query<{ reviewer: string }>(
      `
        UPDATE content_reviewer_allowlist
        SET is_active = $2, updated_at = NOW()
        WHERE reviewer = $1
        RETURNING reviewer
      `,
      [reviewer, input.isActive],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { ok: false, errorCode: "NOT_FOUND", message: "reviewer not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, reviewer, isActive: input.isActive });
  } catch {
    return NextResponse.json({ ok: false, errorCode: "SERVER_ERROR" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) {
    return unauthorizedResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, errorCode: "INVALID_PAYLOAD", message: "Invalid JSON payload." }, { status: 400 });
  }

  const reviewer = toNormalizedReviewer((body as { reviewer?: unknown }).reviewer);
  if (!reviewer) {
    return NextResponse.json(
      { ok: false, errorCode: "VALIDATION_ERROR", message: "reviewer is required." },
      { status: 400 },
    );
  }

  try {
    await ensureReviewerAllowlistTable();
    const result = await query<{ reviewer: string }>(
      `
        DELETE FROM content_reviewer_allowlist
        WHERE reviewer = $1
        RETURNING reviewer
      `,
      [reviewer],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { ok: false, errorCode: "NOT_FOUND", message: "reviewer not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, reviewer });
  } catch {
    return NextResponse.json({ ok: false, errorCode: "SERVER_ERROR" }, { status: 500 });
  }
}