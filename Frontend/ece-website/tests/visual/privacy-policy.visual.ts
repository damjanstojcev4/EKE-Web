import { test, expect } from "@playwright/test";

test.beforeEach(async ({ browser }, testInfo) => {
  const session = await browser.newBrowserCDPSession();
  const { gpu } = await session.send("SystemInfo.getInfo");
  await session.detach();
  const rendering = {
    browser: browser.version(),
    renderer: gpu.auxAttributes?.glRenderer,
    backend: gpu.auxAttributes?.skiaBackendType,
  };
  await testInfo.attach("rendering-profile", {
    body: JSON.stringify(rendering, null, 2), contentType: "application/json",
  });
  // Fail explicitly on environment drift instead of accepting new references.
  expect(rendering).toEqual({
    browser: "158.0.4370.33",
    renderer: "ANGLE (Intel, Intel(R) UHD Graphics (0x00009BC4) Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9664)",
    backend: "GaneshGL",
  });
});

test("Privacy Policy approved layout", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  // This page has no CMS reads. Unexpected requests must not reach a real API.
  await page.route("**/api/**", route => {
    errors.push(`Unexpected API request: ${route.request().url()}`);
    return route.abort();
  });
  const response = await page.goto("/privacy-policy/", { waitUntil: "networkidle" });
  expect(response?.status()).toBe(200);
  await expect(page.locator("main h1")).toBeVisible();
  await page.evaluate(async () => {
    await document.fonts.ready;
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    await Promise.all(Array.from(document.images).map(image => image.decode().catch(() => {})));
    window.scrollTo(0, 0);
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator("img").evaluateAll(images => images.every(image => image instanceof HTMLImageElement && image.naturalWidth > 0))).toBe(true);
  await expect(page).toHaveScreenshot("privacy-policy.png", { fullPage: true });
  const link = page.locator("article a").first();
  await link.hover();
  await expect(link).toHaveCSS("text-decoration-line", "underline");
  await link.focus();
  await expect(link).toHaveCSS("outline", "rgb(33, 44, 93) solid 2px");
  await expect(link).toHaveCSS("outline-offset", "4px");
  expect(errors).toEqual([]);
});
