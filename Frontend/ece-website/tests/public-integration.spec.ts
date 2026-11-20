import { test, expect } from "@playwright/test";
import { sessionLifecycle, type SessionRecord } from "../src/lib/api/sessions";
test("session lifecycle crosses opening and deadline boundaries without a reload", () => {
  const session = { published: true, availability: "OPEN", opensAt: "2026-11-20T12:00:00Z", applicationDeadline: "2026-11-21T12:00:00Z" } as SessionRecord;
  expect(sessionLifecycle(session, Date.parse("2026-11-20T11:59:59Z"))).toBe("UPCOMING");
  expect(sessionLifecycle(session, Date.parse("2026-11-20T12:00:00Z"))).toBe("OPEN");
  expect(sessionLifecycle(session, Date.parse("2026-11-21T12:00:00Z"))).toBe("CLOSED");
});
const article = {
  id: 1,
  slug: "unavailable",
  title: "Verified API article",
  shortDescription: "Summary from the backend",
  category: "LATEST_NEWS",
  published: true,
  publishedAt: "2026-01-01T12:00:00Z",
  imageUrl: null,
  contentJson: '[{"type":"heading","text":"Article details"}]',
};
test("public news uses real pagination contracts, generated routes and unavailable states", async ({
  page,
}) => {
  await page.route("**/api/news/public?**", (route) =>
    route.fulfill({
      json: { content: [article], totalPages: 2, totalElements: 13, number: 0 },
    }),
  );
  await page.route("**/api/news/slug/unavailable", (route) =>
    route.fulfill({ json: article }),
  );
  await page.goto("/news/");
  await expect(
    page.getByRole("heading", { name: article.title }),
  ).toBeVisible();
  const next = page.waitForRequest((r) => r.url().includes("page=1"));
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await next;
  await page.getByRole("link", { name: "Read more", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Article details" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: article.title }),
  ).toBeVisible();
  await page.route("**/api/news/slug/unavailable", (route) =>
    route.fulfill({ status: 404, json: {} }),
  );
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Article unavailable" }),
  ).toBeVisible();
});
test("projects map status and selected detail data without hardcoded project content", async ({
  page,
}) => {
  const project = {
    uuid: "one",
    slug: "unavailable",
    title: "Selected project",
    quickSummary: "Database summary",
    description: "Database details",
    status: "ON_GOING",
    partners: ["Verified test partner"],
    grantValue: null,
  };
  await page.route("**/api/projects/public", (r) =>
    r.fulfill({ json: [project] }),
  );
  await page.route("**/api/projects/slug/unavailable", (r) =>
    r.fulfill({ json: project }),
  );
  await page.goto("/projects/");
  await expect(
    page.getByRole("heading", { name: "Selected project" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Past", exact: true }).click();
  await expect(page.getByText("No projects match this filter.")).toBeVisible();
  await page.getByRole("button", { name: "Ongoing", exact: true }).click();
  await page
    .getByRole("link", { name: "Project Details", exact: true })
    .click();
  await expect(
    page.getByText("Database details", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Verified test partner", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("DISERA", { exact: true })).toHaveCount(0);
});
test("expired opportunities have no application action and training uses supplied registration URL", async ({
  page,
}) => {
  await page.route("**/api/opportunities/public", (r) =>
    r.fulfill({
      json: [
        {
          id: 1,
          title: "Expired test call",
          lifecycle: "CLOSED",
          applicationDeadline: "2025-01-01T00:00:00Z",
          applicationUrl: "https://example.org/local-test",
        },
      ],
    }),
  );
  await page.goto("/opportunities/");
  await expect(
    page.getByRole("heading", { name: "Expired test call" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Apply", exact: true }),
  ).toHaveCount(0);
  await page.route("**/api/training/sessions", (r) =>
    r.fulfill({
      json: [
        {
          id: 1,
          title: "API training",
          lifecycle: "OPEN",
          registrationDeadline: "2100-01-01T00:00:00Z",
          registrationUrl: "https://example.org/local-test",
        },
      ],
    }),
  );
  await page.goto("/training/");
  await expect(
    page.getByRole("link", { name: "Register", exact: true }),
  ).toHaveAttribute("href", "https://example.org/local-test");
});
test("API failures are visible and never replaced by mock content", async ({
  page,
}) => {
  await page.route("**/api/news/public?**", (r) =>
    r.fulfill({ status: 500, json: {} }),
  );
  await page.goto("/news/");
  await expect(page.locator("main [role=alert]")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Read more", exact: true }),
  ).toHaveCount(0);
});
