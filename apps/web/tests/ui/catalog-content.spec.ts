import { expect, test } from "@playwright/test";

test.describe("catalog content regression", () => {
  test("products page filters category results", async ({ page }) => {
    await page.goto("/products?lang=en");

    await expect(page.getByRole("heading", { name: "Products" }).first()).toBeVisible();
    await page.getByRole("button", { name: "Tricycle" }).first().click();

    await expect(page.getByText("GHI-600 Tricycle")).toBeVisible();
    await expect(page.getByText("XYZ-2000 Super Balance Bike")).toHaveCount(0);
  });

  test("reviews page filters to tricycle reviews", async ({ page }) => {
    await page.goto("/reviews?lang=en");

    await expect(page.getByRole("heading", { name: "Reviews" }).first()).toBeVisible();
    await page.getByRole("button", { name: "Tricycle" }).first().click();

    await expect(page.getByText("GHI-600 Tricycle Durability Test")).toBeVisible();
    await expect(page.getByText("XYZ-2000 Super Balance Bike Review")).toHaveCount(0);
  });

  test("rankings page switches ranking type via url state", async ({ page }) => {
    await page.goto("/rankings?lang=en");

    await expect(page.getByRole("heading", { name: "Rankings" }).first()).toBeVisible();
    await page.getByRole("button", { name: "Safety" }).click();

    await expect(page).toHaveURL(/type=safety/);
    await expect(page.getByText("Safety Rankings")).toBeVisible();
    await expect(page.getByText("XYZ-2000 Super Balance Bike")).toBeVisible();
  });
});
