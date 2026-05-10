"use client";

import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { useAppLang } from "@/components/useAppLang";
import { type Phase3ContentSnapshot } from "@/lib/phase3-content-defaults";

type ApiSuccess = {
  ok: true;
  snapshot: Phase3ContentSnapshot;
  updatedAt?: string;
  requestId?: string;
};

type ApiFailure = {
  ok: false;
  errorCode?: string;
  message?: string;
  currentUpdatedAt?: string;
};

type ApiResponse = ApiSuccess | ApiFailure;

type HistoryEntry = {
  id: number;
  snapshotKey: string;
  operation?: "update" | "rollback";
  sourceAuditId?: number | null;
  requestId?: string | null;
  editor: string | null;
  reviewer?: string | null;
  reason?: string | null;
  changedSections: string[];
  changeSummary: string | null;
  canRollback: boolean;
  createdAt: string;
};

type HistoryPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type HistoryResponse =
  | {
      ok: true;
      history: HistoryEntry[];
      pagination: HistoryPagination;
    }
  | ApiFailure;

type ReviewerAllowlistItem = {
  reviewer: string;
  isActive: boolean;
  updatedAt: string;
};

type ReviewerAllowlistResponse =
  | {
      ok: true;
      reviewers: ReviewerAllowlistItem[];
      pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
      };
    }
  | ApiFailure;

type DiffItem = {
  key: string;
  changed: boolean;
  beforeCount: number;
  afterCount: number;
};

function countSectionItems(snapshot: Phase3ContentSnapshot, key: string): number {
  if (key === "community") {
    return snapshot.community.qaPosts.length + snapshot.community.polls.length + snapshot.community.feedback.length;
  }

  const value = snapshot[key as keyof Phase3ContentSnapshot];
  return Array.isArray(value) ? value.length : 0;
}

function buildDiffSummary(before: Phase3ContentSnapshot, after: Phase3ContentSnapshot): DiffItem[] {
  const keys = [
    "products",
    "reviews",
    "rankings",
    "news",
    "guides",
    "brands",
    "deals",
    "community",
  ] as const;

  return keys.map((key) => {
    const beforeCount = countSectionItems(before, key);
    const afterCount = countSectionItems(after, key);

    return {
      key,
      changed: JSON.stringify(before[key]) !== JSON.stringify(after[key]),
      beforeCount,
      afterCount,
    };
  });
}

export default function AdminContentPage() {
  const { isZh } = useAppLang();
  const [token, setToken] = useState("");
  const [editorName, setEditorName] = useState("");
  const [changeSummary, setChangeSummary] = useState("");
  const [rollbackReviewer, setRollbackReviewer] = useState("");
  const [rollbackReason, setRollbackReason] = useState("");
  const [editorValue, setEditorValue] = useState("");
  const [loadedSnapshot, setLoadedSnapshot] = useState<Phase3ContentSnapshot | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [diffSummary, setDiffSummary] = useState<DiffItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize] = useState(10);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyTotalPages, setHistoryTotalPages] = useState(1);
  const [historyEditorFilter, setHistoryEditorFilter] = useState("");
  const [historySectionFilter, setHistorySectionFilter] = useState("");
  const [historyOperationFilter, setHistoryOperationFilter] = useState<"" | "update" | "rollback">("");
  const [historyRequestIdFilter, setHistoryRequestIdFilter] = useState("");
  const [historyRollbackableOnly, setHistoryRollbackableOnly] = useState(false);
  const [rollbackingId, setRollbackingId] = useState<number | null>(null);
  const [allowlistLoading, setAllowlistLoading] = useState(false);
  const [allowlistMutating, setAllowlistMutating] = useState(false);
  const [allowlistIncludeInactive, setAllowlistIncludeInactive] = useState(true);
  const [allowlistNewReviewer, setAllowlistNewReviewer] = useState("");
  const [allowlistNewActive, setAllowlistNewActive] = useState(true);
  const [allowlistReviewers, setAllowlistReviewers] = useState<ReviewerAllowlistItem[]>([]);
  const [activeReviewerOptions, setActiveReviewerOptions] = useState<ReviewerAllowlistItem[]>([]);
  const [activeReviewersLoading, setActiveReviewersLoading] = useState(false);
  const [allowlistQuery, setAllowlistQuery] = useState("");
  const [allowlistPage, setAllowlistPage] = useState(1);
  const [allowlistPageSize] = useState(10);
  const [allowlistTotal, setAllowlistTotal] = useState(0);
  const [allowlistTotalPages, setAllowlistTotalPages] = useState(1);
  const [copiedRequestId, setCopiedRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "ok" | "error"; message: string; requestId?: string | null }>({
    type: "idle",
    message: "",
  });

  const label = (zh: string, en: string) => (isZh ? zh : en);

  const setError = (message: string) => {
    setStatus({ type: "error", message, requestId: null });
  };

  const setSuccess = (message: string, requestId?: string | null) => {
    setStatus({ type: "ok", message, requestId: requestId ?? null });
  };

  const parseEditorJson = (): Phase3ContentSnapshot | null => {
    try {
      const parsed = JSON.parse(editorValue) as unknown;
      if (!parsed || typeof parsed !== "object") {
        setError(label("JSON 结构无效。", "Invalid JSON structure."));
        return null;
      }
      return parsed as Phase3ContentSnapshot;
    } catch {
      setError(label("JSON 解析失败，请检查格式。", "Failed to parse JSON. Please check syntax."));
      return null;
    }
  };

  const fetchSnapshot = async () => {
    if (!token.trim()) {
      setError(label("请先输入管理 Token。", "Please enter admin token first."));
      return;
    }

    setLoading(true);
    setStatus({ type: "idle", message: "", requestId: null });

    try {
      const response = await fetch("/api/content/site", {
        method: "GET",
        headers: {
          "x-content-admin-token": token.trim(),
        },
        cache: "no-store",
      });

      const data = (await response.json()) as ApiResponse;
      if (!response.ok || !data.ok) {
        const message = !data.ok ? data.message : undefined;
        setError(message || label("读取内容快照失败。", "Failed to load content snapshot."));
        return;
      }

      setEditorValue(`${JSON.stringify(data.snapshot, null, 2)}\n`);
      setLoadedSnapshot(data.snapshot);
      setUpdatedAt(data.updatedAt ?? null);
      setDiffSummary(null);
      setHistoryEntries([]);
      setHistoryPage(1);
      setHistoryTotal(0);
      setHistoryTotalPages(1);
      setSuccess(label("已加载最新快照。", "Latest snapshot loaded."));
      await loadActiveReviewerOptions();
      await loadReviewerAllowlist(1, undefined, false);
    } catch {
      setError(label("读取请求失败，请检查网络或服务状态。", "Request failed. Check network or server status."));
    } finally {
      setLoading(false);
    }
  };

  const saveSnapshot = async () => {
    if (!token.trim()) {
      setError(label("请先输入管理 Token。", "Please enter admin token first."));
      return;
    }

    const parsed = parseEditorJson();
    if (!parsed) {
      return;
    }

    setSaving(true);
    setStatus({ type: "idle", message: "" });

    try {
      const changedSections = diffSummary
        ? diffSummary.filter((item) => item.changed).map((item) => item.key)
        : [];

      const response = await fetch("/api/content/site", {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          "x-content-admin-token": token.trim(),
          ...(editorName.trim() ? { "x-content-editor": editorName.trim() } : {}),
          ...(changedSections.length > 0 ? { "x-content-change-sections": JSON.stringify(changedSections) } : {}),
          ...(changeSummary.trim() ? { "x-content-change-summary": changeSummary.trim() } : {}),
          ...(updatedAt ? { "if-unmodified-since": updatedAt } : {}),
        },
        body: JSON.stringify(parsed),
      });

      const data = (await response.json()) as ApiResponse;
      if (!response.ok || !data.ok) {
        const message = !data.ok ? data.message : undefined;

        if (!data.ok && data.errorCode === "VERSION_CONFLICT") {
          const currentTime = data.currentUpdatedAt
            ? new Date(data.currentUpdatedAt).toLocaleString(isZh ? "zh-CN" : "en-US")
            : label("未知时间", "unknown time");
          setError(
            label(
              `版本冲突：内容已在 ${currentTime} 被更新，请先点击“读取”刷新后再保存。`,
              `Version conflict: snapshot was updated at ${currentTime}. Please load latest snapshot before saving.`,
            ),
          );
          return;
        }

        setError(message || label("写入内容快照失败。", "Failed to save content snapshot."));
        return;
      }

      setEditorValue(`${JSON.stringify(data.snapshot, null, 2)}\n`);
      setLoadedSnapshot(data.snapshot);
      setUpdatedAt(data.updatedAt ?? null);
      setDiffSummary(null);
      await loadHistory(1, false);
      setSuccess(label("内容快照已更新。", "Content snapshot updated."), data.requestId);
    } catch {
      setError(label("写入请求失败，请检查网络或服务状态。", "Save request failed. Check network or server status."));
    } finally {
      setSaving(false);
    }
  };

  const formatJson = () => {
    const parsed = parseEditorJson();
    if (!parsed) {
      return;
    }

    setEditorValue(`${JSON.stringify(parsed, null, 2)}\n`);
    setSuccess(label("JSON 已格式化。", "JSON formatted."));
  };

  const previewDiff = () => {
    if (!loadedSnapshot) {
      setError(label("请先读取快照后再预览差异。", "Load snapshot first before previewing changes."));
      return;
    }

    const parsed = parseEditorJson();
    if (!parsed) {
      return;
    }

    const summary = buildDiffSummary(loadedSnapshot, parsed);
    setDiffSummary(summary);

    const changedCount = summary.filter((item) => item.changed).length;
    if (changedCount === 0) {
      setSuccess(label("未检测到改动。", "No changes detected."));
      return;
    }

    setSuccess(label(`检测到 ${changedCount} 个模块有改动。`, `${changedCount} section(s) changed.`));
  };

  const loadHistory = async (pageOverride?: number, showSuccessMessage = true) => {
    if (!token.trim()) {
      setError(label("请先输入管理 Token。", "Please enter admin token first."));
      return;
    }

    setHistoryLoading(true);

    try {
      const targetPage = pageOverride ?? historyPage;
      const params = new URLSearchParams({
        history: "1",
        page: String(targetPage),
        pageSize: String(historyPageSize),
      });

      if (historyEditorFilter.trim()) {
        params.set("editor", historyEditorFilter.trim());
      }

      if (historySectionFilter.trim()) {
        params.set("section", historySectionFilter.trim());
      }

      if (historyOperationFilter) {
        params.set("operation", historyOperationFilter);
      }

      if (historyRequestIdFilter.trim()) {
        params.set("requestId", historyRequestIdFilter.trim());
      }

      if (historyRollbackableOnly) {
        params.set("rollbackable", "1");
      }

      const response = await fetch(`/api/content/site?${params.toString()}`, {
        method: "GET",
        headers: {
          "x-content-admin-token": token.trim(),
        },
        cache: "no-store",
      });

      const data = (await response.json()) as HistoryResponse;
      if (!response.ok || !data.ok) {
        const message = !data.ok ? data.message : undefined;
        setError(message || label("读取历史记录失败。", "Failed to load history."));
        return;
      }

      setHistoryEntries(data.history);
      setHistoryPage(data.pagination.page);
      setHistoryTotal(data.pagination.total);
      setHistoryTotalPages(data.pagination.totalPages);
      if (showSuccessMessage) {
        setSuccess(label("历史记录已刷新。", "History refreshed."));
      }
    } catch {
      setError(label("读取历史记录请求失败。", "History request failed."));
    } finally {
      setHistoryLoading(false);
    }
  };

  const applyHistoryFilters = async () => {
    await loadHistory(1);
  };

  const copyRequestId = async (requestId: string | null | undefined) => {
    if (!requestId) {
      setError(label("当前记录没有 requestId。", "This record has no requestId."));
      return;
    }

    try {
      let copied = false;

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(requestId);
          copied = true;
        } catch {
          copied = false;
        }
      }

      if (!copied && typeof document !== "undefined") {
        const temp = document.createElement("textarea");
        temp.value = requestId;
        temp.setAttribute("readonly", "readonly");
        temp.style.position = "absolute";
        temp.style.left = "-9999px";
        document.body.appendChild(temp);
        temp.select();
        document.execCommand("copy");
        document.body.removeChild(temp);
        copied = true;
      }

      if (!copied) {
        throw new Error("Clipboard API unavailable");
      }

      setCopiedRequestId(requestId);
      setTimeout(() => {
        setCopiedRequestId((current) => (current === requestId ? null : current));
      }, 1500);
      setSuccess(label("requestId 已复制。", "Request ID copied."));
    } catch {
      setError(label("复制 requestId 失败。", "Failed to copy requestId."));
    }
  };

  const loadActiveReviewerOptions = async (): Promise<ReviewerAllowlistItem[] | null> => {
    if (!token.trim()) {
      return null;
    }

    setActiveReviewersLoading(true);
    try {
      const response = await fetch("/api/content/reviewer-allowlist?all=1", {
        method: "GET",
        headers: {
          "x-content-admin-token": token.trim(),
        },
        cache: "no-store",
      });

      const data = (await response.json()) as ReviewerAllowlistResponse;
      if (!response.ok || !data.ok) {
        const message = !data.ok ? data.message : undefined;
        setError(message || label("读取审批 reviewer 列表失败。", "Failed to load active reviewers."));
        return null;
      }

      const active = data.reviewers.filter((item) => item.isActive);
      setActiveReviewerOptions(active);

      if (!rollbackReviewer && active.length > 0) {
        setRollbackReviewer(active[0].reviewer);
      }

      if (rollbackReviewer && !active.some((item) => item.reviewer === rollbackReviewer)) {
        setRollbackReviewer(active[0]?.reviewer ?? "");
      }

      return active;
    } catch {
      setError(label("读取审批 reviewer 列表请求失败。", "Active reviewer request failed."));
      return null;
    } finally {
      setActiveReviewersLoading(false);
    }
  };

  const loadReviewerAllowlist = async (pageOverride?: number, includeInactiveOverride?: boolean, showSuccessMessage = true) => {
    if (!token.trim()) {
      setError(label("请先输入管理 Token。", "Please enter admin token first."));
      return;
    }

    const includeInactive = includeInactiveOverride ?? allowlistIncludeInactive;
    const page = pageOverride ?? allowlistPage;
    setAllowlistLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(allowlistPageSize),
      });
      if (includeInactive) {
        params.set("includeInactive", "1");
      }
      if (allowlistQuery.trim()) {
        params.set("q", allowlistQuery.trim());
      }

      const response = await fetch(`/api/content/reviewer-allowlist?${params.toString()}`, {
        method: "GET",
        headers: {
          "x-content-admin-token": token.trim(),
        },
        cache: "no-store",
      });

      const data = (await response.json()) as ReviewerAllowlistResponse;
      if (!response.ok || !data.ok) {
        const message = !data.ok ? data.message : undefined;
        setError(message || label("读取 reviewer 白名单失败。", "Failed to load reviewer allowlist."));
        return;
      }

      setAllowlistReviewers(data.reviewers);
      setAllowlistPage(data.pagination.page);
      setAllowlistTotal(data.pagination.total);
      setAllowlistTotalPages(data.pagination.totalPages);
      if (showSuccessMessage) {
        setSuccess(label("reviewer 白名单已刷新。", "Reviewer allowlist refreshed."));
      }
    } catch {
      setError(label("读取 reviewer 白名单请求失败。", "Reviewer allowlist request failed."));
    } finally {
      setAllowlistLoading(false);
    }
  };

  const addReviewerAllowlist = async () => {
    if (!token.trim()) {
      setError(label("请先输入管理 Token。", "Please enter admin token first."));
      return;
    }

    const reviewer = allowlistNewReviewer.trim().toLowerCase();
    if (!reviewer) {
      setError(label("请先输入 reviewer。", "Please input reviewer first."));
      return;
    }

    setAllowlistMutating(true);
    try {
      const response = await fetch("/api/content/reviewer-allowlist", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-content-admin-token": token.trim(),
        },
        body: JSON.stringify({ reviewer, isActive: allowlistNewActive }),
      });

      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.message || label("新增 reviewer 失败。", "Failed to add reviewer."));
        return;
      }

      setAllowlistNewReviewer("");
      setSuccess(label("reviewer 已添加。", "Reviewer added."));
      await loadActiveReviewerOptions();
      await loadReviewerAllowlist(1);
    } catch {
      setError(label("新增 reviewer 请求失败。", "Add reviewer request failed."));
    } finally {
      setAllowlistMutating(false);
    }
  };

  const toggleReviewerActive = async (reviewer: string, nextActive: boolean) => {
    if (!token.trim()) {
      setError(label("请先输入管理 Token。", "Please enter admin token first."));
      return;
    }

    setAllowlistMutating(true);
    try {
      const response = await fetch("/api/content/reviewer-allowlist", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "x-content-admin-token": token.trim(),
        },
        body: JSON.stringify({ reviewer, isActive: nextActive }),
      });

      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.message || label("更新 reviewer 状态失败。", "Failed to update reviewer status."));
        return;
      }

      setSuccess(label("reviewer 状态已更新。", "Reviewer status updated."));
      await loadActiveReviewerOptions();
      await loadReviewerAllowlist(allowlistPage);
    } catch {
      setError(label("更新 reviewer 状态请求失败。", "Update reviewer status request failed."));
    } finally {
      setAllowlistMutating(false);
    }
  };

  const deleteReviewerAllowlist = async (reviewer: string) => {
    if (!token.trim()) {
      setError(label("请先输入管理 Token。", "Please enter admin token first."));
      return;
    }

    if (rollbackReviewer.trim().toLowerCase() === reviewer.trim().toLowerCase()) {
      setError(label("不能删除当前回滚审批人，请先选择其他 reviewer。", "Cannot delete the currently selected rollback reviewer."));
      return;
    }

    const confirmInput = window.prompt(
      label(`请输入 reviewer 名称 ${reviewer} 以确认删除。`, `Type reviewer name ${reviewer} to confirm deletion.`),
    );
    if ((confirmInput ?? "").trim().toLowerCase() !== reviewer.trim().toLowerCase()) {
      setError(label("删除已取消：确认名称不匹配。", "Deletion canceled: reviewer name mismatch."));
      return;
    }

    setAllowlistMutating(true);
    try {
      const response = await fetch("/api/content/reviewer-allowlist", {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "x-content-admin-token": token.trim(),
        },
        body: JSON.stringify({ reviewer }),
      });

      const data = (await response.json()) as { ok: boolean; message?: string };
      if (!response.ok || !data.ok) {
        setError(data.message || label("删除 reviewer 失败。", "Failed to delete reviewer."));
        return;
      }

      setSuccess(label("reviewer 已删除。", "Reviewer deleted."));
      await loadActiveReviewerOptions();
      await loadReviewerAllowlist(1);
    } catch {
      setError(label("删除 reviewer 请求失败。", "Delete reviewer request failed."));
    } finally {
      setAllowlistMutating(false);
    }
  };

  const rollbackToHistoryEntry = async (entry: HistoryEntry) => {
    if (!token.trim()) {
      setError(label("请先输入管理 Token。", "Please enter admin token first."));
      return;
    }

    if (!updatedAt) {
      setError(label("请先读取快照后再执行回滚。", "Load latest snapshot before rollback."));
      return;
    }

    if (!entry.canRollback) {
      setError(label("该记录缺少快照数据，无法回滚。", "This entry has no snapshot payload and cannot be rolled back."));
      return;
    }

    if (!rollbackReviewer.trim()) {
      setError(label("请填写回滚审批人（必填）。", "Please provide rollback reviewer (required)."));
      return;
    }

    const latestActiveReviewers = await loadActiveReviewerOptions();
    if (!latestActiveReviewers) {
      return;
    }

    if (!latestActiveReviewers.some((item) => item.reviewer === rollbackReviewer.trim())) {
      setError(label("当前审批人已失效，请重新选择 active reviewer 后再回滚。", "Selected reviewer is no longer active. Please reselect before rollback."));
      return;
    }

    const confirmed = window.confirm(
      label(
        `确认回滚到历史记录 #${entry.id} 吗？此操作会覆盖当前草稿。`,
        `Rollback to history entry #${entry.id}? This will overwrite current draft.`,
      ),
    );
    if (!confirmed) {
      return;
    }

    setRollbackingId(entry.id);
    setStatus({ type: "idle", message: "", requestId: null });

    try {
      const response = await fetch("/api/content/site?rollback=1", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-content-admin-token": token.trim(),
          "if-unmodified-since": updatedAt,
          ...(editorName.trim() ? { "x-content-editor": editorName.trim() } : {}),
        },
        body: JSON.stringify({
          auditId: entry.id,
          changeSummary: changeSummary.trim() || `Rollback to audit #${entry.id}`,
          reviewer: rollbackReviewer.trim() || null,
          reason: rollbackReason.trim() || null,
        }),
      });

      const data = (await response.json()) as ApiResponse;
      if (!response.ok || !data.ok) {
        const message = !data.ok ? data.message : undefined;

        if (!data.ok && data.errorCode === "VERSION_CONFLICT") {
          const currentTime = data.currentUpdatedAt
            ? new Date(data.currentUpdatedAt).toLocaleString(isZh ? "zh-CN" : "en-US")
            : label("未知时间", "unknown time");
          setError(
            label(
              `版本冲突：内容已在 ${currentTime} 被更新，请先点击“读取”刷新后再回滚。`,
              `Version conflict: snapshot was updated at ${currentTime}. Please load latest snapshot before rollback.`,
            ),
          );
          return;
        }

        setError(message || label("回滚失败。", "Rollback failed."));
        return;
      }

      setEditorValue(`${JSON.stringify(data.snapshot, null, 2)}\n`);
      setLoadedSnapshot(data.snapshot);
      setUpdatedAt(data.updatedAt ?? null);
      setDiffSummary(null);
      await loadHistory(1, false);
      setSuccess(label(`已回滚到记录 #${entry.id}。`, `Rolled back to entry #${entry.id}.`), data.requestId);
    } catch {
      setError(label("回滚请求失败，请检查网络或服务状态。", "Rollback request failed. Check network or server status."));
    } finally {
      setRollbackingId(null);
    }
  };

  const displayUpdatedAt = updatedAt
    ? new Date(updatedAt).toLocaleString(isZh ? "zh-CN" : "en-US")
    : label("未加载", "Not loaded");

  return (
    <PageShell
      title={{ zh: "内容管理", en: "Content Admin" }}
      description={{
        zh: "使用管理 Token 拉取和更新 content_snapshots。",
        en: "Load and update content_snapshots with an admin token.",
      }}
    >
      <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto_auto_auto_auto] md:items-end">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">
              {label("管理 Token", "Admin Token")}
            </span>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              type="password"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500"
              placeholder={label("输入 CONTENT_ADMIN_TOKEN", "Enter CONTENT_ADMIN_TOKEN")}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-zinc-700">
              {label("编辑人", "Editor")}
            </span>
            <input
              value={editorName}
              onChange={(event) => setEditorName(event.target.value)}
              type="text"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500"
              placeholder={label("例如：yan", "e.g. yan")}
            />
          </label>

          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-zinc-700">
              {label("变更说明", "Change Summary")}
            </span>
            <input
              value={changeSummary}
              onChange={(event) => setChangeSummary(event.target.value)}
              type="text"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none transition focus:border-zinc-500"
              placeholder={label("例如：更新 guides 与 news 文案", "e.g. Update guides and news copy")}
            />
          </label>

          <button
            type="button"
            onClick={fetchSnapshot}
            disabled={loading}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
          >
            {loading ? label("读取中...", "Loading...") : label("读取", "Load")}
          </button>

          <button
            type="button"
            onClick={formatJson}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-500"
          >
            {label("格式化", "Format")}
          </button>

          <button
            type="button"
            onClick={previewDiff}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-500"
          >
            {label("预览差异", "Preview Diff")}
          </button>

          <button
            type="button"
            onClick={() => void loadHistory()}
            disabled={historyLoading}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
          >
            {historyLoading ? label("加载中...", "Loading...") : label("历史", "History")}
          </button>

          <button
            type="button"
            onClick={saveSnapshot}
            disabled={saving}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {saving ? label("保存中...", "Saving...") : label("保存", "Save")}
          </button>
        </div>

        {status.type !== "idle" && (
          <div
            className={`mt-4 rounded-lg px-3 py-2 text-sm ${
              status.type === "ok"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <p>{status.message}</p>
            {status.requestId && (
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-current/80">requestId:</span>
                <button
                  type="button"
                  onClick={() => void copyRequestId(status.requestId)}
                  aria-label={`copy-latest-request-id-${status.requestId}`}
                  className="font-mono underline decoration-dotted underline-offset-2 hover:text-current"
                >
                  {status.requestId}
                </button>
                <button
                  type="button"
                  onClick={() => void copyRequestId(status.requestId)}
                  className="rounded border border-current/20 px-2 py-1 font-medium text-current hover:border-current/40"
                >
                  {copiedRequestId === status.requestId
                    ? label("已复制", "Copied")
                    : label("复制 requestId", "Copy requestId")}
                </button>
              </div>
            )}
          </div>
        )}

        <p className="mt-3 text-xs text-zinc-500">
          {label("数据库更新时间", "DB updated at")}: {displayUpdatedAt}
        </p>

        {diffSummary && (
          <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <p className="mb-2 text-sm font-medium text-zinc-700">{label("差异预览", "Diff Preview")}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {diffSummary.map((item) => (
                <div key={item.key} className="rounded border border-zinc-200 bg-white px-2 py-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-700">{item.key}</span>
                    <span className={item.changed ? "text-amber-700" : "text-zinc-500"}>
                      {item.changed ? label("已变更", "changed") : label("无变更", "no change")}
                    </span>
                  </div>
                  <p className="mt-1 text-zinc-500">{item.beforeCount} → {item.afterCount}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <p className="mb-2 text-sm font-medium text-zinc-700">{label("历史筛选", "History Filters")}</p>
          <div className="grid gap-2 md:grid-cols-2">
            <input
              value={historyEditorFilter}
              onChange={(event) => setHistoryEditorFilter(event.target.value)}
              type="text"
              className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-zinc-500"
              placeholder={label("按编辑人筛选", "Filter by editor")}
            />
            <input
              value={historySectionFilter}
              onChange={(event) => setHistorySectionFilter(event.target.value)}
              type="text"
              className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-zinc-500"
              placeholder={label("按模块筛选，如 guides", "Filter by section, e.g. guides")}
            />
            <select
              value={historyOperationFilter}
              onChange={(event) => setHistoryOperationFilter(event.target.value as "" | "update" | "rollback")}
              className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-zinc-500"
            >
              <option value="">{label("全部操作", "All operations")}</option>
              <option value="update">{label("更新", "Update")}</option>
              <option value="rollback">{label("回滚", "Rollback")}</option>
            </select>
            <input
              value={historyRequestIdFilter}
              onChange={(event) => setHistoryRequestIdFilter(event.target.value)}
              type="text"
              className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-zinc-500"
              placeholder={label("按 requestId 筛选", "Filter by requestId")}
            />
          </div>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={applyHistoryFilters}
              disabled={historyLoading}
              className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
            >
              {label("应用筛选", "Apply Filters")}
            </button>
          </div>
          <label className="mt-2 inline-flex items-center gap-2 text-xs text-zinc-700">
            <input
              checked={historyRollbackableOnly}
              onChange={(event) => setHistoryRollbackableOnly(event.target.checked)}
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-zinc-300"
            />
            <span>{label("仅显示可回滚记录", "Show rollbackable records only")}</span>
          </label>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div className="grid gap-2 md:grid-cols-[1fr_auto]">
              <select
                value={rollbackReviewer}
                onChange={(event) => setRollbackReviewer(event.target.value)}
                className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-zinc-500"
              >
                <option value="">{label("选择回滚审批人（必填）", "Select rollback reviewer (required)")}</option>
                {activeReviewerOptions.map((item) => (
                  <option key={item.reviewer} value={item.reviewer}>
                    {item.reviewer}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => void loadActiveReviewerOptions()}
                disabled={activeReviewersLoading || allowlistMutating}
                className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
              >
                {activeReviewersLoading ? label("刷新中...", "Refreshing...") : label("刷新审批人", "Refresh")}
              </button>
            </div>
            <input
              value={rollbackReason}
              onChange={(event) => setRollbackReason(event.target.value)}
              type="text"
              className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-zinc-500"
              placeholder={label("回滚原因（可选补充）", "Rollback reason (optional note)")}
            />
          </div>
        </div>

        {historyEntries.length > 0 && (
          <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-zinc-700">{label("最近变更", "Recent Changes")}</p>
              <p className="text-xs text-zinc-500">
                {label("总计", "Total")}: {historyTotal} | {label("第", "Page ")}{historyPage}/{historyTotalPages}
              </p>
            </div>
            <div className="space-y-2">
              {historyEntries.map((entry) => (
                <div key={entry.id} className="rounded border border-zinc-200 bg-white px-2 py-1.5 text-xs text-zinc-600">
                  <div className="flex items-center justify-between gap-2">
                    <span>#{entry.id}</span>
                    <span>{new Date(entry.createdAt).toLocaleString(isZh ? "zh-CN" : "en-US")}</span>
                  </div>
                  <p className="mt-1">
                    {label("编辑人", "Editor")}: {entry.editor || label("未知", "unknown")}
                  </p>
                  <p className="mt-1">
                    {label("操作", "Operation")}: {entry.operation ?? "update"}
                  </p>
                  <p className="mt-1">
                    {label("来源记录", "Source Audit")}: {entry.sourceAuditId ?? label("无", "none")}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    <span>requestId:</span>
                    {entry.requestId ? (
                      <button
                        type="button"
                        onClick={() => void copyRequestId(entry.requestId)}
                        aria-label={`copy-request-id-value-${entry.requestId}`}
                        data-testid={`request-id-value-btn-${entry.id}`}
                        className="font-mono text-[11px] text-zinc-700 underline decoration-dotted underline-offset-2 hover:text-zinc-900"
                      >
                        {entry.requestId}
                      </button>
                    ) : (
                      <span>{label("未提供", "not provided")}</span>
                    )}
                  </div>
                  <div className="mt-1">
                    <button
                      type="button"
                      onClick={() => void copyRequestId(entry.requestId)}
                      disabled={!entry.requestId}
                      className="rounded border border-zinc-300 px-2 py-1 text-[11px] font-medium text-zinc-700 hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {copiedRequestId && entry.requestId === copiedRequestId
                        ? label("已复制", "Copied")
                        : label("复制 requestId", "Copy requestId")}
                    </button>
                  </div>
                  <p className="mt-1">
                    {label("审批人", "Reviewer")}: {entry.reviewer || label("未提供", "not provided")}
                  </p>
                  <p className="mt-1">
                    {label("原因", "Reason")}: {entry.reason || label("未提供", "not provided")}
                  </p>
                  <p className="mt-1">
                    {label("模块", "Sections")}: {entry.changedSections.length > 0 ? entry.changedSections.join(", ") : label("未提供", "not provided")}
                  </p>
                  <p className="mt-1">
                    {label("说明", "Summary")}: {entry.changeSummary || label("未提供", "not provided")}
                  </p>
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => void rollbackToHistoryEntry(entry)}
                      disabled={rollbackingId === entry.id || !entry.canRollback}
                      className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
                    >
                      {rollbackingId === entry.id ? label("回滚中...", "Rolling back...") : label("回滚到此版本", "Rollback to this")}
                    </button>
                    {!entry.canRollback && (
                      <p className="mt-1 text-[11px] text-amber-700">
                        {label("该历史记录不可回滚（缺少快照）。", "This history record cannot be rolled back (missing snapshot).")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => void loadHistory(Math.max(1, historyPage - 1))}
                disabled={historyLoading || historyPage <= 1}
                className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
              >
                {label("上一页", "Prev")}
              </button>
              <button
                type="button"
                onClick={() => void loadHistory(Math.min(historyTotalPages, historyPage + 1))}
                disabled={historyLoading || historyPage >= historyTotalPages}
                className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
              >
                {label("下一页", "Next")}
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-zinc-700">{label("Reviewer 白名单", "Reviewer Allowlist")}</p>
            <button
              type="button"
              onClick={() => void loadReviewerAllowlist(allowlistPage)}
              disabled={allowlistLoading || allowlistMutating}
              className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
            >
              {allowlistLoading ? label("加载中...", "Loading...") : label("刷新", "Refresh")}
            </button>
          </div>

          <label className="mb-3 inline-flex items-center gap-2 text-xs text-zinc-700">
            <input
              checked={allowlistIncludeInactive}
              onChange={(event) => {
                const checked = event.target.checked;
                setAllowlistIncludeInactive(checked);
                void loadReviewerAllowlist(1, checked);
              }}
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-zinc-300"
            />
            <span>{label("包含停用 reviewer", "Include inactive reviewers")}</span>
          </label>

          <div className="mb-3 grid gap-2 md:grid-cols-[1fr_auto]">
            <input
              value={allowlistQuery}
              onChange={(event) => setAllowlistQuery(event.target.value)}
              type="text"
              className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-zinc-500"
              placeholder={label("搜索 reviewer", "Search reviewer")}
            />
            <button
              type="button"
              onClick={() => void loadReviewerAllowlist(1)}
              disabled={allowlistLoading || allowlistMutating}
              className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
            >
              {label("搜索", "Search")}
            </button>
          </div>

          <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
            <input
              value={allowlistNewReviewer}
              onChange={(event) => setAllowlistNewReviewer(event.target.value)}
              type="text"
              className="w-full rounded border border-zinc-300 bg-white px-2 py-1.5 text-xs outline-none transition focus:border-zinc-500"
              placeholder={label("新增 reviewer，例如 ops", "Add reviewer, e.g. ops")}
            />
            <label className="inline-flex items-center gap-1 rounded border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-700">
              <input
                checked={allowlistNewActive}
                onChange={(event) => setAllowlistNewActive(event.target.checked)}
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-zinc-300"
              />
              <span>{label("启用", "Active")}</span>
            </label>
            <button
              type="button"
              onClick={() => void addReviewerAllowlist()}
              disabled={allowlistMutating}
              className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
            >
              {label("新增", "Add")}
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {allowlistReviewers.length === 0 ? (
              <p className="text-xs text-zinc-500">{label("暂无 reviewer，请先刷新或新增。", "No reviewers yet. Refresh or add one.")}</p>
            ) : (
              allowlistReviewers.map((item) => (
                <div key={item.reviewer} className="rounded border border-zinc-200 bg-white px-2 py-1.5 text-xs text-zinc-600">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-zinc-700">{item.reviewer}</p>
                      <p className="text-zinc-500">{label("更新时间", "Updated")}: {new Date(item.updatedAt).toLocaleString(isZh ? "zh-CN" : "en-US")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-2 py-0.5 ${item.isActive ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-600"}`}>
                        {item.isActive ? label("启用", "active") : label("停用", "inactive")}
                      </span>
                      <button
                        type="button"
                        onClick={() => void toggleReviewerActive(item.reviewer, !item.isActive)}
                        disabled={allowlistMutating}
                        className="rounded border border-zinc-300 px-2 py-1 text-xs font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
                      >
                        {item.isActive ? label("停用", "Disable") : label("启用", "Enable")}
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteReviewerAllowlist(item.reviewer)}
                        disabled={allowlistMutating}
                        className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:border-red-400 disabled:opacity-50"
                      >
                        {label("删除", "Delete")}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 text-xs text-zinc-500">
            <span>{label("总计", "Total")}: {allowlistTotal} | {label("第", "Page ")}{allowlistPage}/{allowlistTotalPages}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void loadReviewerAllowlist(Math.max(1, allowlistPage - 1))}
                disabled={allowlistLoading || allowlistMutating || allowlistPage <= 1}
                className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
              >
                {label("上一页", "Prev")}
              </button>
              <button
                type="button"
                onClick={() => void loadReviewerAllowlist(Math.min(allowlistTotalPages, allowlistPage + 1))}
                disabled={allowlistLoading || allowlistMutating || allowlistPage >= allowlistTotalPages}
                className="rounded border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-zinc-500 disabled:opacity-50"
              >
                {label("下一页", "Next")}
              </button>
            </div>
          </div>
        </div>

        <label className="mt-5 block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">JSON</span>
          <textarea
            value={editorValue}
            onChange={(event) => setEditorValue(event.target.value)}
            className="h-140 w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-xs leading-5 text-zinc-800 outline-none transition focus:border-zinc-500"
            placeholder={label("先点击“读取”加载快照后再编辑。", "Load snapshot first, then edit here.")}
            spellCheck={false}
          />
        </label>
      </section>
    </PageShell>
  );
}
