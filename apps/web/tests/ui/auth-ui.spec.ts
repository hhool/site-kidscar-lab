import { expect, test } from "@playwright/test";

test.describe("auth UI regression", () => {
  test("login page shows the missing-session notice and guest nav", async ({ page }) => {
    await page.goto("/auth/login?reason=missing");

    await expect(page.getByText(/Please sign in before accessing your account\.|请先登录后访问用户中心。?/)).toBeVisible();
    await expect(page.locator("header")).toContainText(/Register|注册/);
    await expect(page.locator("header")).toContainText(/Login|登录/);
  });

  test("login and logout toggle the account nav state", async ({ page }) => {
    await page.goto("/auth/login?reason=missing");

    await page.locator('input[type="email"]').fill("demo@kidscarlab.com");
    await page.locator('input[type="password"]').fill("demo1234");
    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/Login succeeded\. Auth API is connected \(MVP mock session\)\.|登录成功，认证 API 已连通（MVP 模拟会话）。/))
      .toBeVisible();
    await expect(page.locator("header")).toContainText(/Account|用户中心/);
    await expect(page.locator("header")).toContainText(/Logout|退出/);

    await page.locator("header").getByRole("link", { name: /Account|用户中心/ }).click();
    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByText("demo@kidscarlab.com")).toBeVisible();
    await expect(page.getByText(/ID:/)).toBeVisible();

    await page.locator("header").getByRole("button", { name: /Logout|退出/ }).click();
    await expect(page.locator("header")).toContainText(/Register|注册/);
    await expect(page.locator("header")).toContainText(/Login|登录/);

    await page.goto("/account");
    await expect(page).toHaveURL(/\/auth\/login\?reason=missing/);
    await expect(page.getByText(/Please sign in before accessing your account\.|请先登录后访问用户中心。?/)).toBeVisible();
  });

  test("language toggle syncs nav and login form text", async ({ page }) => {
    // Start in English (lang=en via query param)
    await page.goto("/auth/login?lang=en&reason=missing");

    const header = page.locator("header");

    // English: nav shows EN labels; toggle button shows "中" (meaning: click to switch to ZH)
    await expect(header).toContainText("Login");
    await expect(header).toContainText("Register");
    await expect(page.getByText("Welcome back")).toBeVisible();
    await expect(header.getByRole("button", { name: "中" })).toBeVisible();

    // Switch to Chinese
    await header.getByRole("button", { name: "中" }).click();

    // Chinese: nav shows ZH labels; toggle button shows "EN"
    await expect(header).toContainText("登录");
    await expect(header).toContainText("注册");
    await expect(page.getByText("欢迎回来")).toBeVisible();
    await expect(header.getByRole("button", { name: "EN" })).toBeVisible();

    // Switch back to English
    await header.getByRole("button", { name: "EN" }).click();

    await expect(header).toContainText("Login");
    await expect(header).toContainText("Register");
    await expect(page.getByText("Welcome back")).toBeVisible();
  });
});
