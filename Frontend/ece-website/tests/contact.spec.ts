import { test, expect } from "@playwright/test";

const webhook = "**/api/enquiries";

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
