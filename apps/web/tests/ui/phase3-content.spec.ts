import { expect, test } from "@playwright/test";

test.describe("phase 3 content regression", () => {
  test("news page keeps filter results and language toggle in sync", async ({ page }) => {
    await page.goto("/news?lang=en");

    await expect(page.getByRole("heading", { name: "News & Updates" })).toBeVisible();
    await expect(page.getByText("China Kids Mobility Market Exceeds ¥15B in Q1 2026")).toBeVisible();

    await page.getByRole("button", { name: "Transparency" }).click();
    await expect(page.getByText("Methodology v2.1 Update: Durability Test Duration Raised to 500h")).toBeVisible();
    await expect(page.getByText("China Kids Mobility Market Exceeds ¥15B in Q1 2026")).toHaveCount(0);

    await page.locator("header").getByRole("button", { name: "中" }).click();
    await expect(page.getByRole("heading", { name: "资讯" })).toBeVisible();
    await expect(page.getByRole("button", { name: "透明度更新" })).toBeVisible();
    await expect(page.getByText("测试方法 v2.1 更新：耐久性测试时长提升至 500 小时")).toBeVisible();
  });

  test("guides page filters and opens detail content", async ({ page }) => {
    await page.goto("/guides?lang=en");

    await expect(page.getByRole("heading", { name: "Guides & Articles" })).toBeVisible();
    await page.getByRole("button", { name: "Safety" }).click();
    await expect(page.getByText("Kids Bike Safety Checklist: 6 Steps Before Every Ride")).toBeVisible();
    await expect(page.getByText("How to Choose a Balance Bike: 3 Key Metrics to Avoid Mistakes")).toHaveCount(0);

    await page.getByRole("link", { name: /Kids Bike Safety Checklist: 6 Steps Before Every Ride/ }).click();
    await expect(page).toHaveURL(/\/guides\/kids-bike-safety-checklist/);
    await expect(page.getByRole("article").getByRole("heading", { name: /Kids Bike Safety Checklist: 6 Steps Before Every Ride|童车安全检查清单：每次骑行前必做的 6 步/ })).toBeVisible();
    await expect(page.getByText(/Contents|目录/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Helmet Fit|头盔适配/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Back to Guides|返回指南列表/ })).toBeVisible();
  });

  test("brands and deals filters narrow content correctly", async ({ page }) => {
    await page.goto("/brands?lang=en");

    await expect(page.getByRole("heading", { name: "Brands & Models" })).toBeVisible();
    await page.getByRole("button", { name: "Germany" }).click();
    await expect(page.getByRole("heading", { name: "TotRide" })).toBeVisible();
    await expect(page.getByText("XYZ")).toHaveCount(0);

    await page.goto("/deals?lang=en");
    await expect(page.getByRole("heading", { name: "Deals & Prices" })).toBeVisible();
    await page.getByRole("button", { name: "Coming Soon" }).click();
    await expect(page.getByText("MiniGo Lightweight Scooter")).toBeVisible();
    await expect(page.getByText("XYZ-2000 Super Balance Bike")).toHaveCount(0);
  });

  test("community tabs switch between q&a, polls, and feedback", async ({ page }) => {
    await page.goto("/community?lang=en");

    await expect(page.getByRole("heading", { name: "Community & Feedback" })).toBeVisible();
    await expect(page.getByText("First bike for a 3-year-old: balance bike or tricycle?")).toBeVisible();

    await page.getByRole("button", { name: "Polls" }).click();
    await expect(page.getByText("Which aspect of a kids bike matters most to you?")).toBeVisible();
    await expect(page.getByText("Safety")).toBeVisible();

    await page.getByRole("button", { name: "Feedback" }).click();
    await expect(page.getByText("The XYZ-2000's safety score is fully deserved.")).toBeVisible();
    await expect(page.getByText("Verified Purchase").first()).toBeVisible();
  });
});
