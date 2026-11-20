import { test, expect } from "@playwright/test";
import { mediaUrl } from "../src/lib/api/client";

test("managed media encodes legacy filenames and rejects traversal and external URLs", () => {
  for (const name of [
    "EKE 2.png",
    "be the change (1).png",
    "“Digital Youth Work – Past, Present, Future”.png",
    "Битола #1?.jpg",
  ]) {
    const result = mediaUrl(`/api/uploads/images/${name}`)!;
    expect(new URL(result, "https://preview.ekebitola.org").pathname).toBe(
      result,
    );
    expect(decodeURIComponent(result)).toBe(`/api/uploads/images/${name}`);
    expect(mediaUrl(result)).toBe(result);
  }
  for (const path of [
    "https://evil.test/x",
    "//evil.test/x",
    "javascript:alert(1)",
    "/api/uploads/images/..",
    "/api/uploads/images/%2e%2e",
    "/api/uploads/images/%252e%252e",
    "/api/uploads/images/a%2fb.jpg",
    "/api/uploads/images/a%5cb.jpg",
    "/api/uploads/images/a\u0000.jpg",
    "/api/uploads/images/../secret",
    "/api/uploads/other/a.jpg",
  ]) {
    expect(mediaUrl(path)).toBeUndefined();
  }
});

const titles = [
  "The Missing Peace: Youth, Peace, and Reconciliation - Capacity-building of Youth Workers & Youth Organisations to Engage in Peacebuilding",
  "Erasmus+ Pathways for Change: Recognising Erasmus+ as a Tool for Resocialisation in European Correctional Institutions",
  "Digi-YOUTH-alization: Build digital competencies using social and digital media tools in 21st century youth work",
];
const projects = Array.from({ length: 17 }, (_, i) => ({
  uuid: `demo-${i}`,
  slug: "unavailable",
  title: titles[i % titles.length],
  status: i % 2 ? "PAST" : "ON_GOING",
  startDate: "2024-01-01",
  endDate: "2027-01-01",
  image:
    i === 16
      ? null
      : `/api/uploads/images/${["EKE 2.png", "be the change (1).png", "“Digital Youth Work – Past, Present, Future”.png"][i % 3]}`,
  quickSummary:
    "Young people and youth workers collaborate across European communities on education, inclusion and sustainable development. ".repeat(
      3 + (i % 3),
    ),
}));

for (const width of [390, 768, 1440, 1920]) {
  test(`projects and homepage adapt to long content at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 1000 });
    await page.route("**/api/projects/public", (r) =>
      r.fulfill({ json: projects }),
    );
    await page.route("**/api/uploads/images/**", (r) =>
      r.fulfill({
        contentType: "image/svg+xml",
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="420" height="287"><rect width="420" height="287" fill="#4da6ff"/></svg>',
      }),
    );
    await page.goto("/projects/");
    const cards = page.locator("#project-results article");
    await expect(cards).toHaveCount(17);
    await expect(page.locator("#project-results img")).toHaveCount(16);
    await expect
      .poll(() =>
        page
          .locator("#project-results img")
          .evaluateAll((images) =>
            images.every((img) => (img as HTMLImageElement).naturalWidth > 0),
          ),
      )
      .toBe(true);
    const geometry = await cards.evaluateAll((items) =>
      items.map((item) => {
        const r = item.getBoundingClientRect();
        return {
          top: r.top,
          bottom: r.bottom,
          right: r.right,
          overflow: item.scrollWidth > item.clientWidth + 1,
          outside: [...item.querySelectorAll("h2, p, a")].some(
            (el) => el.getBoundingClientRect().bottom > r.bottom + 1,
          ),
        };
      }),
    );
    geometry.forEach((r, i) => {
      expect(r.overflow).toBe(false);
      expect(r.outside).toBe(false);
      expect(r.right).toBeLessThanOrEqual(width);
      if (i) expect(r.top).toBeGreaterThanOrEqual(geometry[i - 1].bottom);
    });
    await page.screenshot({
      path: testInfo.outputPath(`projects-${width}.png`),
      fullPage: true,
    });
    await page.getByRole("button", { name: "Ongoing", exact: true }).click();
    await expect(cards).toHaveCount(9);
    await page.route("**/api/news/homepage", (r) =>
      r.fulfill({
        json: [1, 2, 3].map((id) => ({
          id,
          slug: "unavailable",
          title: titles[id - 1],
          shortDescription: projects[id].quickSummary,
          publishedAt: "2026-01-01T00:00:00Z",
          category: "LATEST_NEWS",
        })),
      }),
    );
    await page.goto("/");
    await expect(page.locator(".news-item")).toHaveCount(3);
    await page.locator(".service > p").evaluateAll((items) =>
      items.forEach((item) => {
        item.textContent = (item.textContent || "").repeat(3);
      }),
    );
    const sections = await page
      .locator(".service, .partnerships, .news, .news-item")
      .evaluateAll((items) =>
        items.map((item) => {
          const r = item.getBoundingClientRect();
          return {
            cls: item.className,
            top: r.top,
            bottom: r.bottom,
            overflow: item.scrollWidth > item.clientWidth + 1,
            outside: [...item.querySelectorAll("h3, p")].some(
              (el) => el.getBoundingClientRect().bottom > r.bottom + 1,
            ),
          };
        }),
      );
    for (const r of sections) {
      expect(r.outside, r.cls).toBe(false);
      expect(r.overflow, r.cls).toBe(false);
    }
    const partnership = sections.find((r) => r.cls === "partnerships")!;
    expect(sections.find((r) => r.cls === "news")!.top).toBeGreaterThanOrEqual(
      partnership.bottom,
    );
    await page
      .locator(".partnerships")
      .screenshot({ path: testInfo.outputPath(`partnerships-${width}.png`) });
    await page
      .locator(".news")
      .screenshot({ path: testInfo.outputPath(`news-${width}.png`) });
  });
}
