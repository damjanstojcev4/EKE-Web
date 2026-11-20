import { test, expect, type Page } from "@playwright/test";
import { publicationState, publicationFields, publicationInstant, localPublicationTime, type NewsRecord } from "../src/lib/news-publication";

test("publication states include the exact time boundary and hide missing metadata", () => {
  const time = "2026-11-20T12:00:00Z";
  const now = Date.parse(time);
  expect(publicationState({ published: null, publishedAt: null }, now)).toBe("legacy");
  expect(publicationState({ published: false, publishedAt: time }, now)).toBe("draft");
  expect(publicationState({ published: true, publishedAt: null }, now)).toBe("draft");
  expect(publicationState({ published: true, publishedAt: time }, now)).toBe("published");
  expect(publicationState({ published: true, publishedAt: time }, now - 1)).toBe("scheduled");
});

test("scheduling rejects missing, invalid and past times; draft needs no timestamp", () => {
  expect(publicationFields("draft", "")).toEqual({ published: "false" });
  expect(() => publicationFields("scheduled", "")).toThrow("valid publication");
  expect(() => publicationFields("scheduled", "invalid")).toThrow("valid publication");
  expect(() => publicationFields("scheduled", "2020-01-01T12:00")).toThrow("future");
  expect(() => publicationFields("published", "2100-01-01T12:00")).toThrow("Schedule");
});

test("local date conversion round-trips UTC instants with seconds", () => {
  const instant = "2026-11-20T12:34:56.000Z";
  expect(publicationInstant(localPublicationTime(instant))).toBe(instant);
  const precise = "2026-11-20T12:34:56.123456Z";
  expect(publicationFields("published", localPublicationTime(precise), precise, Date.parse("2026-11-21T00:00:00Z")).publishedAt).toBe(precise);
});

async function mockApi(page: Page, initial: NewsRecord[] = []) {
  let records = initial;
  const writes: Record<string, string>[] = [];
  await page.route("**/api/**", async route => {
    const path = new URL(route.request().url()).pathname;
    if (path === "/api/auth/me") return route.fulfill({ json: { username: "editor", role: "ADMIN" } });
    if (path === "/api/auth/csrf") return route.fulfill({ json: { token: "test-csrf", headerName: "X-XSRF-TOKEN" } });
    if (route.request().method() === "GET") return route.fulfill({ json: records });
    const request = route.request();
    expect(request.headers()["x-xsrf-token"]).toBe("test-csrf");
    const body = request.postData() || "";
    const fields: Record<string, string> = {};
    for (const match of body.matchAll(/name="([^"]+)"\r\n\r\n([^\r]*)/g)) fields[match[1]] = match[2];
    writes.push(fields);
    const previous = records.find(n => path === `/api/news/${n.id}`);
    const saved: NewsRecord = {
      id: previous?.id || 10, title: fields.title, shortDescription: fields.shortDescription,
      instagramUrl: fields.instagramUrl, category: fields.category as NewsRecord["category"],
      imageUrl: previous?.imageUrl || null, imageAlt: fields.imageAlt,
      published: fields.published === "true", publishedAt: fields.publishedAt || previous?.publishedAt || null,
    };
    records = [...records.filter(n => n.id !== saved.id), saved];
    return route.fulfill({ json: saved });
  });
  return writes;
}

test("editor creates draft, schedules, reschedules, publishes now, edits and unpublishes", async ({ page }) => {
  const writes = await mockApi(page);
  await page.goto("/admin/");
  await page.getByRole("button", { name: "Add news", exact: true }).click();
  await page.getByLabel("Title *", { exact: true }).fill("Community story");
  await page.getByLabel("Summary / excerpt").fill("Community summary");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Community story", exact: true })).toBeVisible();
  expect(writes[0].published).toBe("false");
  const edit = () => page.getByRole("button", { name: "Edit Community story", exact: true }).click();
  const save = () => page.getByRole("button", { name: "Save changes", exact: true }).click();
  await edit();
  await page.getByLabel("Publication status").selectOption("scheduled");
  await page.getByLabel("Publication date and time").fill("2100-01-01T13:00");
  await save();
  await expect(page.getByRole("heading", { name: "Community story", exact: true })).toBeVisible();
  expect(writes[1].publishedAt).toBe("2100-01-01T12:00:00.000Z");
  await edit();
  await page.getByLabel("Publication date and time").fill("2100-02-01T13:00");
  await save();
  await expect(page.getByRole("heading", { name: "Community story", exact: true })).toBeVisible();
  expect(writes[2].publishedAt).toBe("2100-02-01T12:00:00.000Z");
  await edit();
  await page.getByRole("button", { name: "Publish now", exact: true }).click();
  await save();
  await expect(page.getByRole("heading", { name: "Community story", exact: true })).toBeVisible();
  expect(Date.parse(writes[3].publishedAt)).toBeLessThanOrEqual(Date.now());
  await edit();
  await page.getByLabel("Summary / excerpt").fill("Updated summary");
  await save();
  await expect(page.getByRole("heading", { name: "Community story", exact: true })).toBeVisible();
  expect(writes[4].publishedAt).toBe(writes[3].publishedAt);
  await edit();
  await page.getByLabel("Publication status").selectOption("draft");
  await save();
  await expect(page.getByRole("heading", { name: "Community story", exact: true })).toBeVisible();
  expect(writes[5].published).toBe("false");
});

test("legacy editor preserves old content and image, validates alt text, and explicitly publishes", async ({ page }) => {
  const writes = await mockApi(page, [{ id: 1, title: null, shortDescription: "Legacy summary", instagramUrl: "https://www.instagram.com/p/legacy/", imageUrl: "/assets/news-accessible-chess.png", imageAlt: null, category: null, published: null, publishedAt: null }]);
  await page.goto("/admin/");
  await expect(page.getByText("Legacy · hidden")).toBeVisible();
  await page.getByRole("button", { name: "Edit Legacy summary", exact: true }).click();
  await expect(page.getByLabel("Summary / excerpt")).toHaveValue("Legacy summary");
  await expect(page.getByLabel("Instagram URL")).toHaveValue("https://www.instagram.com/p/legacy/");
  await page.getByLabel("Title *", { exact: true }).fill("Prepared legacy");
  await page.getByRole("button", { name: "Publish now", exact: true }).click();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  expect(writes).toHaveLength(0);
  await page.getByLabel("Image alternative text").fill("Young people playing chess");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Prepared legacy", exact: true })).toBeVisible();
  expect(writes[0].published).toBe("true");
  expect(writes[0].shortDescription).toBe("Legacy summary");
});

test("browser timezone handles winter, summer, missing DST hour and repeated hour", async ({ page }) => {
  const writes = await mockApi(page);
  await page.goto("/admin/");
  await page.getByRole("button", { name: "Add news", exact: true }).click();
  await expect(page.getByText(/Browser timezone: Europe\/Skopje/)).toBeVisible();
  // Actual conversion functions are bundled into the form and exercised via its submitted payload.
  await page.getByLabel("Title *", { exact: true }).fill("Timezone story");
  await page.getByLabel("Summary / excerpt").fill("Summary");
  await page.getByLabel("Publication status").selectOption("scheduled");
  await page.getByLabel("Publication date and time").fill("2100-03-28T02:30");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("alert").filter({ hasText: "does not exist" })).toBeVisible();
  expect(writes).toHaveLength(0);
  await page.getByLabel("Publication date and time").fill("2100-07-01T13:00");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Timezone story", exact: true })).toBeVisible();
  expect(writes[0].publishedAt).toBe("2100-07-01T11:00:00.000Z");
  await page.getByRole("button", { name: "Edit Timezone story", exact: true }).click();
  await page.getByLabel("Publication date and time").fill("2100-10-31T02:30");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Timezone story", exact: true })).toBeVisible();
  expect(writes[1].publishedAt).toBe("2100-10-31T00:30:00.000Z");
});
