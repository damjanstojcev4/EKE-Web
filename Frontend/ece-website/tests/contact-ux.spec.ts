import { test, expect, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const endpoint = "**/api/enquiries";
const success = { success: true, message: "Contact submitted successfully" };
const submit = (page: Page) =>
  page.getByRole("button", { name: "Submit", exact: true });
const feedback = (page: Page) => page.locator("#submission-feedback");
async function fill(page: Page) {
  await page.getByLabel("First Name").fill("Audit");
  await page.getByLabel("Last Name").fill("Test");
  await page.locator("#email").fill("audit@example.invalid");
  await page.getByLabel("Subject").fill("Mocked enquiry only");
  await page.getByLabel("Partner", { exact: true }).check();
}

test("all required errors appear together, highlight, focus and clear only when valid", async ({
  page,
}) => {
  let requests = 0;
  await page.route(endpoint, (route) => {
    requests++;
    return route.fulfill({ json: success });
  });
  await page.goto("/contact/");
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  await expect(
    page.getByText("Fields marked with an asterisk (*) are required."),
  ).toBeVisible();
  await submit(page).click();
  for (const key of [
    "first_name",
    "last_name",
    "email",
    "subject",
    "partner_opportunity",
  ]) {
    await expect(page.locator(`#${key}-error`)).toBeVisible();
  }
  await expect(page.locator("#first_name")).toBeFocused();
  await expect(page.locator("#first_name").locator("..")).toHaveCSS(
    "border-bottom-color",
    "rgb(255, 189, 189)",
  );
  await page.locator("#first_name").fill("   ");
  await expect(page.locator("#first_name")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  await page.locator("#last_name").fill("   ");
  await page.locator("#subject").fill("   ");
  await submit(page).click();
  await expect(page.locator("#subject-error")).toBeVisible();
  await page.locator("#first_name").fill("Valid");
  await expect(page.locator("#first_name")).toHaveAttribute(
    "aria-invalid",
    "false",
  );
  await expect(page.locator("#first_name-error")).toHaveCount(0);
  await page.locator("#email").fill("broken");
  await expect(page.locator("#email-error")).toHaveText(
    "Enter a valid email address.",
  );
  await fill(page);
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  expect(requests).toBe(0);
});

test("enquiry type is required and keyboard accessible", async ({ page }) => {
  await page.route(endpoint, (route) => route.fulfill({ json: success }));
  await page.goto("/contact/");
  await fill(page);
  await page
    .locator('input[name="partner_opportunity"]')
    .evaluateAll((inputs) =>
      inputs.forEach((input) => ((input as HTMLInputElement).checked = false)),
    );
  await submit(page).click();
  const partner = page.getByLabel("Partner", { exact: true });
  await expect(partner).toBeFocused();
  await partner.press("Space");
  await expect(page.locator("#partner_opportunity-error")).toHaveCount(0);
  await partner.press("ArrowRight");
  await expect(page.getByLabel("Opportunities", { exact: true })).toBeChecked();
  await page.getByLabel("Subject").focus();
  await page.getByLabel("Subject").press("Enter");
  await expect(feedback(page)).toContainText("Enquiry submitted successfully!");
});

test("attachment removal restores focus and omits the binary field", async ({
  page,
}) => {
  let body = "";
  await page.route(endpoint, (route) => {
    body = route.request().postDataBuffer()!.toString();
    return route.fulfill({ json: success });
  });
  await page.goto("/contact/");
  await fill(page);
  await page.getByLabel("Upload file").setInputFiles({
    name: "remove.docx",
    mimeType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    buffer: Buffer.from("mock document"),
  });
  await page
    .getByRole("button", { name: "Remove attachment remove.docx" })
    .click();
  await expect(page.getByLabel("Upload file")).toBeFocused();
  await expect(page.getByLabel("Upload file")).toHaveValue("");
  await submit(page).click();
  await expect(feedback(page)).toContainText("submitted successfully");
  expect(body).not.toContain('name="documentation"');
});

for (const extension of ["pdf", "doc", "docx"]) {
  test(`accepts ${extension} and resets attachment only on success`, async ({
    page,
  }) => {
    await page.route(endpoint, (route) => route.fulfill({ json: success }));
    await page.goto("/contact/");
    await fill(page);
    await page.getByLabel("Upload file").setInputFiles({
      name: `document.${extension}`,
      mimeType: "application/octet-stream",
      buffer: Buffer.from("mock bytes"),
    });
    await expect(
      page.getByText(`document.${extension}`, { exact: true }),
    ).toBeVisible();
    await submit(page).click();
    await expect(feedback(page)).toContainText("within 3 working days");
    await expect(feedback(page)).toBeFocused();
    await expect(page.locator("#email")).toHaveValue("");
    await expect(
      page.getByRole("button", { name: /Remove attachment/ }),
    ).toHaveCount(0);
    await expect(
      page.locator('input[name="partner_opportunity"]:checked'),
    ).toHaveCount(0);
  });
}

for (const status of [400, 500, 502]) {
  test(`HTTP ${status} preserves all values and attachments for manual retry`, async ({
    page,
  }) => {
    let requests = 0;
    await page.route(endpoint, (route) => {
      requests++;
      return route.fulfill({ status, body: "Private upstream diagnostic" });
    });
    await page.goto("/contact/");
    await fill(page);
    await page.getByLabel("Your Message").fill("Keep this message");
    await page.getByLabel("Upload file").setInputFiles({
      name: "keep.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-mock"),
    });
    await submit(page).click();
    await expect(feedback(page)).toHaveAttribute("role", "alert");
    await expect(feedback(page)).toContainText(
      "We couldn't send your enquiry.",
    );
    await expect(feedback(page)).not.toContainText(
      "Private upstream diagnostic",
    );
    if (status === 400)
      await expect(feedback(page)).toContainText("check your enquiry details");
    await expect(page.locator("#first_name")).toHaveValue("Audit");
    await expect(page.getByLabel("Your Message")).toHaveValue(
      "Keep this message",
    );
    await expect(
      page.getByRole("button", { name: "Remove attachment keep.pdf" }),
    ).toBeVisible();
    await expect(page.getByLabel("Partner", { exact: true })).toBeChecked();
    expect(requests).toBe(1);
    await expect(submit(page)).toBeEnabled();
  });
}

for (const payload of [
  { success: false, message: "Unable to send email" },
  {},
  { success: "true" },
]) {
  test(`HTTP 200 requires explicit boolean success: ${JSON.stringify(payload)}`, async ({
    page,
  }) => {
    await page.route(endpoint, (route) => route.fulfill({ json: payload }));
    await page.goto("/contact/");
    await fill(page);
    await submit(page).click();
    await expect(feedback(page)).toHaveAttribute("role", "alert");
    await expect(page.locator("#first_name")).toHaveValue("Audit");
    await expect(feedback(page)).not.toContainText("submitted successfully");
  });
}

test("network failure supports manual retry without duplicate requests", async ({
  page,
}) => {
  let requests = 0;
  await page.route(endpoint, (route) =>
    ++requests === 1 ? route.abort("failed") : route.fulfill({ json: success }),
  );
  await page.goto("/contact/");
  await fill(page);
  await submit(page).click();
  await expect(feedback(page)).toContainText("connection problem");
  expect(requests).toBe(1);
  await submit(page).click();
  await expect(feedback(page)).toContainText("submitted successfully");
  expect(requests).toBe(2);
});

test("timeout reports uncertain delivery, retains input and never automatically retries", async ({
  page,
}) => {
  let requests = 0;
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(endpoint, async (route) => {
    requests++;
    await pending;
    await route.fulfill({ json: success }).catch(() => {});
  });
  await page.goto("/contact/");
  await fill(page);
  await page.clock.install();
  await submit(page).click();
  await expect.poll(() => requests).toBe(1);
  await page.clock.fastForward(30001);
  await expect(feedback(page)).toContainText("request timed out");
  await expect(page.locator("#first_name")).toHaveValue("Audit");
  await expect(submit(page)).toBeEnabled();
  expect(requests).toBe(1);
  release();
});

for (const [width, device] of [
  [1440, "desktop"],
  [390, "mobile"],
] as const) {
  for (const state of ["invalid", "loading", "success", "error"] as const) {
    test(`${device} ${state} feedback capture and layout`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      let release!: () => void;
      const pending = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route(endpoint, async (route) => {
        if (state === "loading") await pending;
        await route
          .fulfill({ status: state === "error" ? 502 : 200, json: success })
          .catch(() => {});
      });
      await page.goto("/contact/");
      if (state !== "invalid") await fill(page);
      const before = await submit(page).boundingBox();
      await submit(page).click();
      if (state === "loading") {
        const sending = page.getByRole("button", {
          name: "Sending...",
          exact: true,
        });
        await expect(sending).toBeDisabled();
        await expect(page.getByRole("status")).toContainText(
          "Sending your enquiry",
        );
        await expect(sending.locator("span")).toHaveCSS(
          "animation-name",
          "none",
        );
        expect((await sending.boundingBox())!.width).toBe(before!.width);
      } else if (state !== "invalid")
        await expect(feedback(page)).toBeVisible();
      else await expect(page.locator("#first_name")).toBeFocused();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const directory = path.resolve("../../docs/contact-ux/screenshots");
      await mkdir(directory, { recursive: true });
      // Fit the entire form to avoid stitching the fixed header into long captures.
      const formHeight = await page.locator("form").evaluate(element => element.getBoundingClientRect().height);
      await page.setViewportSize({ width, height: Math.ceil(formHeight + 300) });
      await page.locator("form").scrollIntoViewIfNeeded();
      await page.locator("form").screenshot({
        path: path.join(directory, `${device}-${state}.png`),
        animations: "disabled",
      });
      release();
      if (state === "loading") await expect(feedback(page)).toBeVisible();
    });
  }
}

for (const width of [320, 768, 820]) {
  test(`form stays usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.route(endpoint, route => route.fulfill({ json: success }));
    await page.goto("/contact/");
    await fill(page);
    await submit(page).click();
    await expect(feedback(page)).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(feedback(page).getByRole("heading")).toBeVisible();
  });
}
