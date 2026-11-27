import { test, expect } from "@playwright/test";

const webhook = "**/api/enquiries";

test("enquiry validates fields and documentation before sending", async ({ page }) => {
  let requests = 0;
  await page.route(webhook, (route) => {
    requests++;
    return route.fulfill({ status: 200, json: { message: "Workflow was started" } });
  });
  await page.goto("/contact/");
  const submit = page.getByRole("button", { name: "Submit", exact: true });
  await submit.click();
  await expect(page.locator("#first_name")).toBeFocused();
  await page.getByLabel("First Name").fill("Audit");
  await page.getByLabel("Last Name").fill("Test");
  await page.getByLabel("Subject").fill("Local verification only");
  await page.locator("#email").fill("invalid");
  await submit.click();
  await expect(page.locator("#email")).toBeFocused();
  await expect(page.locator("#email-error")).toHaveText("Enter a valid email address.");
  await page.locator("#email").fill("audit@example.invalid");
  const upload = page.getByLabel("Upload file");
  for (const file of [
    { name: "blocked.exe", buffer: Buffer.from("local test") },
    { name: "oversize.pdf", buffer: Buffer.alloc(5 * 1024 * 1024 + 1) },
  ]) {
    await upload.setInputFiles({ ...file, mimeType: "application/octet-stream" });
    await submit.click();
    await expect(upload).toBeFocused();
    await expect(page.locator("#documentation-error")).toHaveText(
      "Choose PDF, DOC or DOCX files, up to 5 MB each.",
    );
  }
  expect(requests).toBe(0);
  await upload.setInputFiles({ name: "limit.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(5 * 1024 * 1024) });
  await submit.click();
  await expect(page.getByRole("status")).toContainText("sent successfully");
  await expect(page.getByRole("status")).toBeFocused();
  expect(requests).toBe(1);
});

test("enquiry preserves opportunity selection and prevents duplicate submissions", async ({ page }) => {
  let requests = 0;
  let payload = "";
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route(webhook, async (route) => {
    requests++;
    payload = route.request().postDataBuffer()!.toString();
    await pending;
    await route.fulfill({ status: 200, json: { message: "Workflow was started" } });
  });
  await page.goto("/contact/");
  await page.getByLabel("First Name").fill("Audit");
  await page.getByLabel("Last Name").fill("Test");
  await page.locator("#email").fill("audit@example.invalid");
  await page.getByLabel("Subject").fill("Local verification only");
  await page.locator('input[value="opportunities"]').check();
  await expect(page.locator('input[value="partner"]')).not.toBeChecked();
  const form = page.locator("form");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("button", { name: "Sending…", exact: true })).toBeDisabled();
  await expect(form).toHaveAttribute("aria-busy", "true");
  await form.evaluate((element) => (element as HTMLFormElement).requestSubmit());
  await expect.poll(() => requests).toBe(1);
  release();
  await expect(page.getByRole("status")).toContainText("sent successfully");
  await expect(form).toHaveAttribute("aria-busy", "false");
  expect(requests).toBe(1);
  expect(payload).toContain('name="partner_opportunity"\r\n\r\nopportunities');
  expect(payload).not.toContain('name="documentation"');
});

test("admin navigation no longer exposes contact messages", async ({ page }) => {
  await page.route("**/api/**", (route) => {
    const path = new URL(route.request().url()).pathname;
    return route.fulfill({ json: path === "/api/auth/me" ? { username: "editor", role: "ADMIN" } : [] });
  });
  await page.goto("/admin/");
  const navigation = page.getByRole("navigation", { name: "Admin navigation" });
  await expect(navigation.getByRole("button", { name: /News/ })).toBeVisible();
  await expect(navigation.getByRole("button", { name: /Messages|Contact/i })).toHaveCount(0);
});

test("enquiry sends multipart fields and documentation to production n8n", async ({ page }) => {
  let payload = "";
  let contentType = "";
  await page.route(webhook, async (route) => {
    payload = route.request().postDataBuffer()!.toString();
    contentType = route.request().headers()["content-type"];
    await route.fulfill({ status: 200, body: '{"message":"Workflow was started"}', contentType: "application/json" });
  });
  await page.goto("/contact/");
  await page.getByLabel("First Name").fill("Damian");
  await page.getByLabel("Last Name").fill("Stojchev");
  await page.getByLabel("Email", { exact: false }).fill("damian@example.com");
  await page.getByLabel("Phone", { exact: true }).fill("076 242 992");
  await page.getByLabel("Country", { exact: true }).fill("Macedonia");
  await page.getByLabel("Subject").fill("Test enquiry");
  await page.getByLabel("Your Message").fill("Hello World");
  await page.getByLabel("Upload file").setInputFiles({ name: "document.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4 test") });
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("sent successfully");
  expect(contentType).toContain("multipart/form-data; boundary=");
  for (const [key, value] of Object.entries({ first_name: "Damian", last_name: "Stojchev", email: "damian@example.com", phone: "076 242 992", country: "Macedonia", subject: "Test enquiry", partner_opportunity: "partner", message: "Hello World" })) {
    expect(payload).toContain(`name="${key}"\r\n\r\n${value}`);
  }
  expect(payload).toContain('name="documentation"; filename="document.pdf"');
  expect(payload).toContain("%PDF-1.4 test");
  await expect(page.getByLabel("First Name")).toHaveValue("");
});

test("failed submission keeps the enquiry available for retry", async ({ page }) => {
  await page.route(webhook, (route) => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("/contact/");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByText("First Name is required.", { exact: true })).toBeVisible();
  await page.getByLabel("First Name").fill("Damian");
  await page.getByLabel("Last Name").fill("Stojchev");
  await page.getByLabel("Email", { exact: false }).fill("damian@example.com");
  await page.getByLabel("Subject").fill("Please reply");
  await page.getByRole("button", { name: "Submit", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("could not be sent");
  await expect(page.getByLabel("Subject")).toHaveValue("Please reply");
  await expect(page.getByRole("button", { name: "Submit", exact: true })).toBeEnabled();
});
