import { query } from "@/lib/db";
import { defaultPhase3ContentSnapshot, type Phase3ContentSnapshot } from "@/lib/phase3-content-defaults";

export const CONTENT_SNAPSHOT_KEY = "site-content";

export type ContentSnapshotRecord = {
  snapshot: Phase3ContentSnapshot;
  updatedAt: string;
};

export type ContentSnapshotAuditOperation = "update" | "rollback";

export type ContentSnapshotAuditEntry = {
  id: number;
  snapshotKey: string;
  operation: ContentSnapshotAuditOperation;
  sourceAuditId: number | null;
  requestId: string | null;
  editor: string | null;
  reviewer: string | null;
  reason: string | null;
  changedSections: string[];
  changeSummary: string | null;
  canRollback: boolean;
  createdAt: string;
};

export type ContentSnapshotAuditListOptions = {
  page?: number;
  pageSize?: number;
  editor?: string;
  section?: string;
  operation?: ContentSnapshotAuditOperation;
  requestId?: string;
  rollbackableOnly?: boolean;
};

export type ContentSnapshotAuditListResult = {
  items: ContentSnapshotAuditEntry[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type ContentSnapshotWriteResult =
  | { ok: true; updatedAt: string }
  | { ok: false; conflictUpdatedAt: string | null };

let contentTableReady = false;
let snapshotSeeded = false;

type WriteSnapshotOptions = {
  operation?: ContentSnapshotAuditOperation;
  sourceAuditId?: number | null;
  requestId?: string | null;
  editor?: string | null;
  reviewer?: string | null;
  reason?: string | null;
  changedSections?: string[];
  changeSummary?: string | null;
};

export type ContentSnapshotRollbackResult =
  | {
      ok: true;
      updatedAt: string;
      snapshot: Phase3ContentSnapshot;
    }
  | {
      ok: false;
      errorCode: "AUDIT_NOT_FOUND" | "AUDIT_PAYLOAD_MISSING" | "VERSION_CONFLICT";
      conflictUpdatedAt?: string | null;
    };

function cloneDefaultSnapshot(): Phase3ContentSnapshot {
  return JSON.parse(JSON.stringify(defaultPhase3ContentSnapshot)) as Phase3ContentSnapshot;
}

function shouldUseMemoryContentStore() {
  return process.env.CONTENT_DATA_MODE === "memory" || !process.env.DATABASE_URL;
}

export function isPhase3ContentSnapshot(value: unknown): value is Phase3ContentSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Phase3ContentSnapshot>;
  return Array.isArray(candidate.products)
    && Array.isArray(candidate.reviews)
    && Array.isArray(candidate.rankings)
    && Array.isArray(candidate.news)
    && Array.isArray(candidate.guides)
    && Array.isArray(candidate.brands)
    && Array.isArray(candidate.deals)
    && !!candidate.community
    && Array.isArray(candidate.community.qaPosts)
    && Array.isArray(candidate.community.polls)
    && Array.isArray(candidate.community.feedback);
}

export async function ensureContentTable() {
  if (contentTableReady) {
    return;
  }

  await query(`
    CREATE TABLE IF NOT EXISTS content_snapshots (
      snapshot_key TEXT PRIMARY KEY,
      payload JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS content_snapshot_audit (
      id BIGSERIAL PRIMARY KEY,
      snapshot_key TEXT NOT NULL,
      editor TEXT,
      changed_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
      change_summary TEXT,
      snapshot_payload JSONB,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await query(`
    ALTER TABLE content_snapshot_audit
    ADD COLUMN IF NOT EXISTS change_summary TEXT;
  `);

  await query(`
    ALTER TABLE content_snapshot_audit
    ADD COLUMN IF NOT EXISTS snapshot_payload JSONB;
  `);

  await query(`
    ALTER TABLE content_snapshot_audit
    ADD COLUMN IF NOT EXISTS operation TEXT NOT NULL DEFAULT 'update';
  `);

  await query(`
    ALTER TABLE content_snapshot_audit
    ADD COLUMN IF NOT EXISTS source_audit_id BIGINT;
  `);

  await query(`
    ALTER TABLE content_snapshot_audit
    ADD COLUMN IF NOT EXISTS request_id TEXT;
  `);

  await query(`
    ALTER TABLE content_snapshot_audit
    ADD COLUMN IF NOT EXISTS reviewer TEXT;
  `);

  await query(`
    ALTER TABLE content_snapshot_audit
    ADD COLUMN IF NOT EXISTS reason TEXT;
  `);

  contentTableReady = true;
}

export async function writeContentSnapshot(snapshot: Phase3ContentSnapshot, options: WriteSnapshotOptions = {}) {
  await ensureContentTable();

  await query(
    `
      INSERT INTO content_snapshots (snapshot_key, payload, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (snapshot_key)
      DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
    `,
    [CONTENT_SNAPSHOT_KEY, JSON.stringify(snapshot)],
  );

  await insertAuditEntry({
    snapshotKey: CONTENT_SNAPSHOT_KEY,
    operation: options.operation ?? "update",
    sourceAuditId: options.sourceAuditId ?? null,
    requestId: options.requestId ?? null,
    editor: options.editor ?? null,
    reviewer: options.reviewer ?? null,
    reason: options.reason ?? null,
    changedSections: options.changedSections ?? [],
    changeSummary: options.changeSummary ?? null,
    snapshot,
  });

  snapshotSeeded = true;
}

export async function writeContentSnapshotIfUnmodified(
  snapshot: Phase3ContentSnapshot,
  expectedUpdatedAt: string,
  options: WriteSnapshotOptions = {},
): Promise<ContentSnapshotWriteResult> {
  await ensureContentTable();

  const result = await query<{ updated_at: string }>(
    `
      INSERT INTO content_snapshots (snapshot_key, payload, updated_at)
      VALUES ($1, $2::jsonb, NOW())
      ON CONFLICT (snapshot_key)
      DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()
      WHERE content_snapshots.updated_at = $3::timestamptz
      RETURNING updated_at
    `,
    [CONTENT_SNAPSHOT_KEY, JSON.stringify(snapshot), expectedUpdatedAt],
  );

  const updatedAt = result.rows[0]?.updated_at;
  if (updatedAt) {
    await insertAuditEntry({
      snapshotKey: CONTENT_SNAPSHOT_KEY,
      operation: options.operation ?? "update",
      sourceAuditId: options.sourceAuditId ?? null,
      requestId: options.requestId ?? null,
      editor: options.editor ?? null,
      reviewer: options.reviewer ?? null,
      reason: options.reason ?? null,
      changedSections: options.changedSections ?? [],
      changeSummary: options.changeSummary ?? null,
      snapshot,
    });

    snapshotSeeded = true;
    return { ok: true, updatedAt: new Date(updatedAt).toISOString() };
  }

  const latest = await readStoredSnapshotRecord();
  return { ok: false, conflictUpdatedAt: latest?.updatedAt ?? null };
}

export async function seedContentSnapshot() {
  await ensureContentTable();

  if (snapshotSeeded) {
    return;
  }

  await query(
    `
      INSERT INTO content_snapshots (snapshot_key, payload)
      VALUES ($1, $2::jsonb)
      ON CONFLICT (snapshot_key) DO NOTHING
    `,
    [CONTENT_SNAPSHOT_KEY, JSON.stringify(defaultPhase3ContentSnapshot)],
  );

  snapshotSeeded = true;
}

export async function readStoredSnapshot(): Promise<Phase3ContentSnapshot | null> {
  const record = await readStoredSnapshotRecord();
  return record?.snapshot ?? null;
}

export async function readStoredSnapshotRecord(): Promise<ContentSnapshotRecord | null> {
  const result = await query<{ payload: unknown }>(
    `
      SELECT payload, updated_at
      FROM content_snapshots
      WHERE snapshot_key = $1
      LIMIT 1
    `,
    [CONTENT_SNAPSHOT_KEY],
  );

  const row = result.rows[0] as { payload: unknown; updated_at?: string } | undefined;
  const payload = row?.payload;

  if (!isPhase3ContentSnapshot(payload) || !row?.updated_at) {
    return null;
  }

  return {
    snapshot: payload,
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export async function getPhase3ContentSnapshot(): Promise<Phase3ContentSnapshot> {
  if (shouldUseMemoryContentStore()) {
    return cloneDefaultSnapshot();
  }

  await ensureContentTable();

  const existing = await readStoredSnapshotRecord();
  if (existing) {
    return existing.snapshot;
  }

  await seedContentSnapshot();

  return (await readStoredSnapshotRecord())?.snapshot ?? cloneDefaultSnapshot();
}

export async function getPhase3ContentSnapshotRecord(): Promise<ContentSnapshotRecord> {
  if (shouldUseMemoryContentStore()) {
    return {
      snapshot: cloneDefaultSnapshot(),
      updatedAt: new Date().toISOString(),
    };
  }

  await ensureContentTable();

  const existing = await readStoredSnapshotRecord();
  if (existing) {
    return existing;
  }

  await seedContentSnapshot();

  return (await readStoredSnapshotRecord()) ?? {
    snapshot: cloneDefaultSnapshot(),
    updatedAt: new Date().toISOString(),
  };
}

async function insertAuditEntry(input: {
  snapshotKey: string;
  operation: ContentSnapshotAuditOperation;
  sourceAuditId: number | null;
  requestId: string | null;
  editor: string | null;
  reviewer: string | null;
  reason: string | null;
  changedSections: string[];
  changeSummary: string | null;
  snapshot: Phase3ContentSnapshot;
}) {
  await query(
    `
      INSERT INTO content_snapshot_audit (
        snapshot_key,
        operation,
        source_audit_id,
        request_id,
        editor,
        reviewer,
        reason,
        changed_sections,
        change_summary,
        snapshot_payload
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, $10::jsonb)
    `,
    [
      input.snapshotKey,
      input.operation,
      input.sourceAuditId,
      input.requestId,
      input.editor,
      input.reviewer,
      input.reason,
      JSON.stringify(input.changedSections),
      input.changeSummary,
      JSON.stringify(input.snapshot),
    ],
  );
}

export async function listContentSnapshotAudit(
  options: ContentSnapshotAuditListOptions = {},
): Promise<ContentSnapshotAuditListResult> {
  const safePage = Number.isFinite(options.page) ? Math.max(1, Math.floor(options.page ?? 1)) : 1;
  const safePageSize = Number.isFinite(options.pageSize) ? Math.max(1, Math.min(100, Math.floor(options.pageSize ?? 20))) : 20;

  if (shouldUseMemoryContentStore()) {
    return {
      items: [],
      pagination: {
        page: safePage,
        pageSize: safePageSize,
        total: 0,
        totalPages: 1,
      },
    };
  }

  await ensureContentTable();

  const whereClauses = ["snapshot_key = $1"];
  const params: unknown[] = [CONTENT_SNAPSHOT_KEY];

  if (options.editor?.trim()) {
    params.push(`%${options.editor.trim()}%`);
    whereClauses.push(`editor ILIKE $${params.length}`);
  }

  if (options.section?.trim()) {
    params.push(options.section.trim());
    whereClauses.push(`changed_sections ? $${params.length}`);
  }

  if (options.operation === "update" || options.operation === "rollback") {
    params.push(options.operation);
    whereClauses.push(`operation = $${params.length}`);
  }

  if (options.requestId?.trim()) {
    params.push(`%${options.requestId.trim()}%`);
    whereClauses.push(`request_id ILIKE $${params.length}`);
  }

  if (options.rollbackableOnly) {
    whereClauses.push("snapshot_payload IS NOT NULL");
  }

  const whereSql = whereClauses.join(" AND ");

  const countResult = await query<{ total: number }>(
    `
      SELECT COUNT(*)::int AS total
      FROM content_snapshot_audit
      WHERE ${whereSql}
    `,
    params,
  );

  const total = Number(countResult.rows[0]?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safeCurrentPage = Math.min(safePage, totalPages);
  const offset = (safeCurrentPage - 1) * safePageSize;

  const result = await query<{
    id: number;
    snapshot_key: string;
    operation: string;
    source_audit_id: number | null;
    request_id: string | null;
    editor: string | null;
    reviewer: string | null;
    reason: string | null;
    changed_sections: unknown;
    change_summary: string | null;
    has_snapshot: boolean;
    created_at: string;
  }>(
    `
      SELECT
        id,
        snapshot_key,
        operation,
        source_audit_id,
        request_id,
        editor,
        reviewer,
        reason,
        changed_sections,
        change_summary,
        (snapshot_payload IS NOT NULL) AS has_snapshot,
        created_at
      FROM content_snapshot_audit
      WHERE ${whereSql}
      ORDER BY id DESC
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `,
    [...params, safePageSize, offset],
  );

  return {
    items: result.rows.map((row) => ({
      id: row.id,
      snapshotKey: row.snapshot_key,
      operation: row.operation === "rollback" ? "rollback" : "update",
      sourceAuditId: row.source_audit_id,
      requestId: row.request_id,
      editor: row.editor,
      reviewer: row.reviewer,
      reason: row.reason,
      changedSections: Array.isArray(row.changed_sections)
        ? row.changed_sections.filter((value): value is string => typeof value === "string")
        : [],
      changeSummary: row.change_summary,
      canRollback: row.has_snapshot,
      createdAt: new Date(row.created_at).toISOString(),
    })),
    pagination: {
      page: safeCurrentPage,
      pageSize: safePageSize,
      total,
      totalPages,
    },
  };
}

export async function rollbackContentSnapshotToAudit(
  auditId: number,
  expectedUpdatedAt: string,
  options: WriteSnapshotOptions = {},
): Promise<ContentSnapshotRollbackResult> {
  if (shouldUseMemoryContentStore()) {
    return { ok: false, errorCode: "AUDIT_NOT_FOUND" };
  }

  await ensureContentTable();

  const auditResult = await query<{
    snapshot_payload: unknown;
    changed_sections: unknown;
  }>(
    `
      SELECT snapshot_payload, changed_sections
      FROM content_snapshot_audit
      WHERE snapshot_key = $1 AND id = $2
      LIMIT 1
    `,
    [CONTENT_SNAPSHOT_KEY, auditId],
  );

  const row = auditResult.rows[0];
  if (!row) {
    return { ok: false, errorCode: "AUDIT_NOT_FOUND" };
  }

  if (!row.snapshot_payload || !isPhase3ContentSnapshot(row.snapshot_payload)) {
    return { ok: false, errorCode: "AUDIT_PAYLOAD_MISSING" };
  }

  const rollbackSections = Array.isArray(row.changed_sections)
    ? row.changed_sections.filter((value): value is string => typeof value === "string")
    : [];

  const writeResult = await writeContentSnapshotIfUnmodified(row.snapshot_payload, expectedUpdatedAt, {
    operation: options.operation ?? "rollback",
    sourceAuditId: options.sourceAuditId ?? auditId,
    requestId: options.requestId ?? null,
    editor: options.editor ?? null,
    reviewer: options.reviewer ?? null,
    reason: options.reason ?? null,
    changedSections: options.changedSections ?? rollbackSections,
    changeSummary: options.changeSummary ?? `Rollback to audit #${auditId}`,
  });

  if (!writeResult.ok) {
    return {
      ok: false,
      errorCode: "VERSION_CONFLICT",
      conflictUpdatedAt: writeResult.conflictUpdatedAt,
    };
  }

  return {
    ok: true,
    updatedAt: writeResult.updatedAt,
    snapshot: row.snapshot_payload,
  };
}
