import { test, expect } from "@playwright/test";

test("arbitrary project slugs use the static shell, refresh, and recover from API outages", async ({ page }) => {
  let unavailable = true;
  await page.route("**/api/projects/slug/created-after-build", route => route.fulfill(
    unavailable ? { status: 503, json: {} } : { json: { slug: "created-after-build", title: "New persisted project", status: "ON_GOING", description: "Saved content" } },
  ));
  await page.goto("/projects/created-after-build/");
  await expect(page.getByRole("heading", { name: "Project unavailable" })).toBeVisible();
  unavailable = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("heading", { name: "New persisted project", exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Saved content", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Back to Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/$/);
});

test("missing, invalid, and deleted projects never render stale content", async ({ page }) => {
  await page.route("**/api/projects/slug/deleted-project", route => route.fulfill({ status: 404, json: {} }));
  for (const path of ["/projects/deleted-project/", "/projects/invalid_identifier/", "/projects/details/?slug="]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { name: "Project not found" })).toBeVisible();
  }
});
