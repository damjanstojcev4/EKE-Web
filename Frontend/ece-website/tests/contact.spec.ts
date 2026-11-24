import { test, expect, type Page } from "@playwright/test";

async function openContact(page: Page) {
  const forbidden: string[] = [];
  await page.route("**/*", (route) => {
    const request = route.request();
    if (
      !["GET", "HEAD"].includes(request.method()) ||
      new URL(request.url()).pathname.startsWith("/api/")
    ) {
      forbidden.push(`${request.method()} ${request.url()}`);
      return route.abort();
    }
    return route.continue();
  });
  await page.goto("/contact/");
  return forbidden;
}

async function fillRequired(page: Page) {
  await page.locator("#firstName").fill("Audit");
  await page.locator("#lastName").fill("Test");
  await page.locator("#email").fill("audit@example.invalid");
  await page.locator("#subject").fill("Local verification only");
}

test("Contact validates, focuses errors and preserves local preview behavior", async ({
  page,
}) => {
  const forbidden = await openContact(page);
  const submit = page.getByRole("button", { name: "Submit", exact: true });
  await submit.click();
  await expect(page.locator("#firstName")).toBeFocused();
  await expect(page.locator("#firstName-error")).toHaveText(
    "First Name is required.",
  );
  await fillRequired(page);
  await expect(page.locator("#firstName-error")).toHaveCount(0);
  await page.locator("#email").fill("invalid");
  await submit.click();
  await expect(page.locator("#email")).toBeFocused();
  await expect(page.locator("#email-error")).toHaveText(
    "Enter a valid email address.",
  );
  await page.locator("#email").fill("audit@example.invalid");
  await page.locator('input[value="opportunities"]').check();
  await expect(page.locator('input[value="partner"]')).not.toBeChecked();
  await page
    .getByRole("button", { name: "Fill in partner information form" })
    .click();
  await expect(page.locator("#partner-form-notice")).toHaveText(
    "The partner information form is not available in this preview.",
  );
  await submit.click();
  const status = page.locator('form p[role="status"]');
  await expect(status).toBeFocused();
  await expect(status).toHaveText(
    "Preview only: submission is unavailable until integration is complete. Nothing has been sent.",
  );
  expect(forbidden).toEqual([]);
});

test("Contact keeps multiple-file, extension and exact 5 MiB restrictions without uploading", async ({
  page,
}) => {
  const forbidden = await openContact(page);
  await fillRequired(page);
  const files = page.locator("#attachments");
  const submit = page.getByRole("button", { name: "Submit", exact: true });
  await files.setInputFiles([
    {
      name: "first.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("local test"),
    },
    {
      name: "second.DOCX",
      mimeType: "application/octet-stream",
      buffer: Buffer.from("local test"),
    },
  ]);
  await expect(
    page.getByText("first.pdf, second.DOCX", { exact: true }),
  ).toBeVisible();
  await submit.click();
  await expect(page.locator("#attachments-error")).toHaveCount(0);
  for (const file of [
    { name: "blocked.exe", buffer: Buffer.from("local test") },
    { name: "oversize.pdf", buffer: Buffer.alloc(5 * 1024 * 1024 + 1) },
  ]) {
    await files.setInputFiles({
      ...file,
      mimeType: "application/octet-stream",
    });
    await submit.click();
    await expect(files).toBeFocused();
    await expect(page.locator("#attachments-error")).toHaveText(
      "Choose PDF, DOC or DOCX files, up to 5 MB each.",
    );
  }
  await files.setInputFiles({
    name: "limit.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.alloc(5 * 1024 * 1024),
  });
  await submit.click();
  await expect(page.locator("#attachments-error")).toHaveCount(0);
  await expect(page.locator('form p[role="status"]')).toBeFocused();
  expect(forbidden).toEqual([]);
});
