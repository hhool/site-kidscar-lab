import { expect, test } from "@playwright/test";

test.describe("admin rollback reviewer guard", () => {
  test("save, history filter, and rollback complete a traceable admin workflow", async ({ page }) => {
    let currentUpdatedAt = "2026-05-10T11:50:00.000Z";
    let currentSnapshot = {
      products: [],
      reviews: [],
      rankings: [],
      news: [],
      guides: [],
      brands: [],
      deals: [],
      community: { qaPosts: [], polls: [], feedback: [] },
    };

    const initialSnapshot = JSON.parse(JSON.stringify(currentSnapshot)) as typeof currentSnapshot;
    const saveRequestId = "req-save-flow-401";
    const rollbackRequestId = "req-rollback-flow-402";
    const saveRequests: string[] = [];
    const rollbackRequests: Array<{ auditId: number; reviewer: string | null; reason: string | null }> = [];

    const historyEntries: Array<{
      id: number;
      snapshotKey: string;
      operation: "update" | "rollback";
      sourceAuditId: number | null;
      requestId: string;
      editor: string | null;
      reviewer: string | null;
      reason: string | null;
      changedSections: string[];
      changeSummary: string | null;
      canRollback: boolean;
      createdAt: string;
      snapshotPayload: typeof currentSnapshot;
    }> = [];

    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => undefined,
        },
      });
    });

    await page.route("**/api/content/**", async (route) => {
      const request = route.request();
      const url = new URL(request.url());

      if (url.pathname === "/api/content/site" && request.method() === "PUT") {
        const payload = (await request.postDataJSON()) as typeof currentSnapshot;
        currentSnapshot = payload;
        currentUpdatedAt = "2026-05-10T12:05:00.000Z";
        saveRequests.push(request.headers()["if-unmodified-since"] ?? "");

        historyEntries.unshift({
          id: 401,
          snapshotKey: "site-content",
          operation: "update",
          sourceAuditId: null,
          requestId: saveRequestId,
          editor: request.headers()["x-content-editor"] ?? null,
          reviewer: null,
          reason: null,
          changedSections: ["guides"],
          changeSummary: request.headers()["x-content-change-summary"] ?? null,
          canRollback: true,
          createdAt: "2026-05-10T12:05:00.000Z",
          snapshotPayload: JSON.parse(JSON.stringify(payload)) as typeof currentSnapshot,
        });

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            snapshot: currentSnapshot,
            updatedAt: currentUpdatedAt,
            requestId: saveRequestId,
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/site" && request.method() === "POST" && url.searchParams.get("rollback") === "1") {
        const body = (await request.postDataJSON()) as {
          auditId: number;
          reviewer?: string | null;
          reason?: string | null;
        };
        rollbackRequests.push({
          auditId: body.auditId,
          reviewer: body.reviewer ?? null,
          reason: body.reason ?? null,
        });

        const sourceEntry = historyEntries.find((entry) => entry.id === body.auditId);
        currentSnapshot = JSON.parse(JSON.stringify(sourceEntry?.snapshotPayload ?? initialSnapshot)) as typeof currentSnapshot;
        currentUpdatedAt = "2026-05-10T12:10:00.000Z";

        historyEntries.unshift({
          id: 402,
          snapshotKey: "site-content",
          operation: "rollback",
          sourceAuditId: body.auditId,
          requestId: rollbackRequestId,
          editor: request.headers()["x-content-editor"] ?? null,
          reviewer: body.reviewer ?? null,
          reason: body.reason ?? null,
          changedSections: ["guides"],
          changeSummary: `Rollback to audit #${body.auditId}`,
          canRollback: true,
          createdAt: "2026-05-10T12:10:00.000Z",
          snapshotPayload: JSON.parse(JSON.stringify(currentSnapshot)) as typeof currentSnapshot,
        });

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            snapshot: currentSnapshot,
            updatedAt: currentUpdatedAt,
            requestId: rollbackRequestId,
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/site" && request.method() === "GET" && url.searchParams.get("history") === "1") {
        const operation = url.searchParams.get("operation");
        const requestId = url.searchParams.get("requestId");

        const filtered = historyEntries.filter((entry) => {
          if (operation && entry.operation !== operation) {
            return false;
          }

          if (requestId && !entry.requestId.includes(requestId)) {
            return false;
          }

          return true;
        }).map((entry) => ({
          id: entry.id,
          snapshotKey: entry.snapshotKey,
          operation: entry.operation,
          sourceAuditId: entry.sourceAuditId,
          requestId: entry.requestId,
          editor: entry.editor,
          reviewer: entry.reviewer,
          reason: entry.reason,
          changedSections: entry.changedSections,
          changeSummary: entry.changeSummary,
          canRollback: entry.canRollback,
          createdAt: entry.createdAt,
        }));

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            history: filtered,
            pagination: {
              page: 1,
              pageSize: 10,
              total: filtered.length,
              totalPages: 1,
            },
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/site" && request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            snapshot: currentSnapshot,
            updatedAt: currentUpdatedAt,
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/reviewer-allowlist" && request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            reviewers: [{ reviewer: "ops", isActive: true, updatedAt: "2026-05-10T10:00:00.000Z" }],
            pagination: {
              page: 1,
              pageSize: 10,
              total: 1,
              totalPages: 1,
            },
          }),
        });
        return;
      }

      await route.continue();
    });

    await page.goto("/admin/content?lang=en");

    await page.getByPlaceholder("Enter CONTENT_ADMIN_TOKEN").fill("test-admin-token");
    await page.getByPlaceholder("e.g. yan").fill("yan");
    await page.getByPlaceholder("e.g. Update guides and news copy").fill("Save then rollback validation");
    await page.getByRole("button", { name: "Load" }).click();
    await expect(page.getByText("Latest snapshot loaded.")).toBeVisible();

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Content snapshot updated.")).toBeVisible();
    await expect(page.getByRole("button", { name: `copy-latest-request-id-${saveRequestId}` })).toBeVisible();

    await page.getByRole("button", { name: "History" }).click();
    await expect(page.getByText("#401")).toBeVisible();

    const operationSelect = page.locator("select").filter({ has: page.locator("option[value='update']") }).first();
    await operationSelect.selectOption("update");
    await page.getByPlaceholder("Filter by requestId").fill("req-save-flow");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(page.getByText("History refreshed.")).toBeVisible();
    await expect(page.getByText("#401")).toBeVisible();
    await expect(page.getByRole("button", { name: `copy-request-id-value-${saveRequestId}` })).toBeVisible();

    await page.getByPlaceholder("Filter by requestId").fill("");
    const rollbackSelect = page.locator("select").filter({ has: page.locator("option[value='rollback']") }).first();
    await rollbackSelect.selectOption("");
    await page.getByPlaceholder("Rollback reason (optional note)").fill("staging rollback check");

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await page.getByRole("button", { name: "Rollback to this" }).click();
    await expect(page.getByText("Rolled back to entry #401.")).toBeVisible();
    await expect(page.getByRole("button", { name: `copy-latest-request-id-${rollbackRequestId}` })).toBeVisible();

    await rollbackSelect.selectOption("rollback");
    await page.getByPlaceholder("Filter by requestId").fill("req-rollback-flow");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(page.getByText("#402")).toBeVisible();
  await expect(page.getByRole("button", { name: `copy-request-id-value-${rollbackRequestId}` })).toBeVisible();
    expect(saveRequests).toEqual(["2026-05-10T11:50:00.000Z"]);
    expect(rollbackRequests).toEqual([
      { auditId: 401, reviewer: "ops", reason: "staging rollback check" },
    ]);
  });

  test("save success shows latest requestId in top status and copies it", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => undefined,
        },
      });
    });

    await page.route("**/api/content/**", async (route) => {
      const request = route.request();
      const url = new URL(request.url());

      if (url.pathname === "/api/content/site" && request.method() === "PUT") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
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
            updatedAt: "2026-05-10T12:05:00.000Z",
            requestId: "req-save-success-301",
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/site" && request.method() === "GET" && url.searchParams.get("history") === "1") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            history: [],
            pagination: {
              page: 1,
              pageSize: 10,
              total: 0,
              totalPages: 1,
            },
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/site" && request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
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
            updatedAt: "2026-05-10T11:50:00.000Z",
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/reviewer-allowlist" && request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            reviewers: [{ reviewer: "ops", isActive: true, updatedAt: "2026-05-10T10:00:00.000Z" }],
            pagination: {
              page: 1,
              pageSize: 10,
              total: 1,
              totalPages: 1,
            },
          }),
        });
        return;
      }

      await route.continue();
    });

    await page.goto("/admin/content?lang=en");

    await page.getByPlaceholder("Enter CONTENT_ADMIN_TOKEN").fill("test-admin-token");
    await page.getByRole("button", { name: "Load" }).click();
    await expect(page.getByText("Latest snapshot loaded.")).toBeVisible();

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Content snapshot updated.")).toBeVisible();
    await expect(page.getByText("req-save-success-301")).toBeVisible();

    await page.getByRole("button", { name: "copy-latest-request-id-req-save-success-301" }).click();
    await expect(page.getByText(/Request ID copied\.|requestId 已复制。/)).toBeVisible();
  });

  test("blocks rollback when selected reviewer becomes inactive before submit", async ({ page }) => {
    let rollbackPostCalled = false;
    let activeReviewerSourceCalls = 0;

    await page.route("**/api/content/**", async (route) => {
      const request = route.request();
      const url = new URL(request.url());

      if (url.pathname === "/api/content/site" && request.method() === "GET" && url.searchParams.get("history") === "1") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            history: [
              {
                id: 101,
                snapshotKey: "site-content",
                editor: "yan",
                changedSections: ["guides"],
                changeSummary: "initial save",
                canRollback: true,
                createdAt: "2026-05-10T10:00:00.000Z",
              },
            ],
            pagination: {
              page: 1,
              pageSize: 10,
              total: 1,
              totalPages: 1,
            },
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/site" && request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
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
            updatedAt: "2026-05-10T09:50:00.000Z",
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/site" && request.method() === "POST" && url.searchParams.get("rollback") === "1") {
        rollbackPostCalled = true;
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ ok: true }),
        });
        return;
      }

      if (url.pathname === "/api/content/reviewer-allowlist" && request.method() === "GET" && url.searchParams.get("all") === "1") {
        activeReviewerSourceCalls += 1;

        const reviewers = activeReviewerSourceCalls === 1
          ? [{ reviewer: "ops", isActive: true, updatedAt: "2026-05-10T10:00:00.000Z" }]
          : [];

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            reviewers,
            pagination: {
              page: 1,
              pageSize: reviewers.length || 1,
              total: reviewers.length,
              totalPages: 1,
            },
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/reviewer-allowlist" && request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            reviewers: [{ reviewer: "ops", isActive: true, updatedAt: "2026-05-10T10:00:00.000Z" }],
            pagination: {
              page: 1,
              pageSize: 10,
              total: 1,
              totalPages: 1,
            },
          }),
        });
        return;
      }

      await route.continue();
    });

    await page.goto("/admin/content?lang=en");

    await page.getByPlaceholder("Enter CONTENT_ADMIN_TOKEN").fill("test-admin-token");
    await page.getByRole("button", { name: "Load" }).click();
    await expect(page.getByText("Latest snapshot loaded.")).toBeVisible();

    await page.getByRole("button", { name: "History" }).click();
    await expect(page.getByText("#101")).toBeVisible();

    const reviewerSelect = page.locator("select").filter({ has: page.locator("option[value='ops']") }).first();
    await expect(reviewerSelect).toHaveValue("ops");

    page.once("dialog", async (dialog) => {
      await dialog.accept();
    });

    await page.getByRole("button", { name: "Rollback to this" }).click();

    await expect(page.getByText("Selected reviewer is no longer active. Please reselect before rollback.")).toBeVisible();
    expect(rollbackPostCalled).toBe(false);
    expect(activeReviewerSourceCalls).toBeGreaterThanOrEqual(2);
  });

  test("history filters include operation and requestId query parameters", async ({ page }) => {
    const historyRequests: Array<{ operation: string | null; requestId: string | null }> = [];

    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async () => undefined,
        },
      });
    });

    await page.route("**/api/content/**", async (route) => {
      const request = route.request();
      const url = new URL(request.url());

      if (url.pathname === "/api/content/site" && request.method() === "GET" && url.searchParams.get("history") === "1") {
        historyRequests.push({
          operation: url.searchParams.get("operation"),
          requestId: url.searchParams.get("requestId"),
        });

        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            history: [
              {
                id: 201,
                snapshotKey: "site-content",
                operation: "rollback",
                sourceAuditId: 122,
                requestId: "req-filter-check-201",
                editor: "yan",
                reviewer: "ops",
                reason: "qa rollback",
                changedSections: ["guides"],
                changeSummary: "filter check",
                canRollback: true,
                createdAt: "2026-05-10T11:00:00.000Z",
              },
            ],
            pagination: {
              page: 1,
              pageSize: 10,
              total: 1,
              totalPages: 1,
            },
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/site" && request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
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
            updatedAt: "2026-05-10T10:50:00.000Z",
          }),
        });
        return;
      }

      if (url.pathname === "/api/content/reviewer-allowlist" && request.method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            reviewers: [{ reviewer: "ops", isActive: true, updatedAt: "2026-05-10T10:00:00.000Z" }],
            pagination: {
              page: 1,
              pageSize: 10,
              total: 1,
              totalPages: 1,
            },
          }),
        });
        return;
      }

      await route.continue();
    });

    await page.goto("/admin/content?lang=en");

    await page.getByPlaceholder("Enter CONTENT_ADMIN_TOKEN").fill("test-admin-token");
    await page.getByRole("button", { name: "Load" }).click();
    await expect(page.getByText("Latest snapshot loaded.")).toBeVisible();

    await page.getByRole("button", { name: "History" }).click();
    await expect(page.getByText("#201")).toBeVisible();

    const operationSelect = page.locator("select").filter({ has: page.locator("option[value='rollback']") }).first();
    await operationSelect.selectOption("rollback");
    await page.getByPlaceholder("Filter by requestId").fill("req-filter-check");
    await page.getByRole("button", { name: "Apply Filters" }).click();

    await expect(page.getByText("History refreshed.")).toBeVisible();
    const requestIdValueButton = page.getByRole("button", {
      name: "copy-request-id-value-req-filter-check-201",
    });
    await expect(requestIdValueButton).toBeVisible();
    await requestIdValueButton.click();
    await expect(page.getByText(/Request ID copied\.|requestId 已复制。/)).toBeVisible();

    await page.getByRole("button", { name: "Copy requestId" }).click();
    await expect(page.getByText(/Request ID copied\.|requestId 已复制。/)).toBeVisible();
    expect(historyRequests.length).toBeGreaterThanOrEqual(2);

    const latest = historyRequests[historyRequests.length - 1];
    expect(latest.operation).toBe("rollback");
    expect(latest.requestId).toBe("req-filter-check");
  });
});
