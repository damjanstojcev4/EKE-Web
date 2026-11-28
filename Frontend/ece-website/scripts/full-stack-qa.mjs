// Opt-in local-only end-to-end check. Fresh file H2, random credentials, no remote targets.
import { chromium, expect, request } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdtemp, rm, mkdir, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomBytes } from "node:crypto";
import path from "node:path";
import net from "node:net";
async function freePort() {
  const s = net.createServer();
  await new Promise((r) => s.listen(0, "127.0.0.1", r));
  const p = s.address().port;
  await new Promise((r) => s.close(r));
  return p;
}
const frontend = process.cwd();
const jar = path.resolve(
  frontend,
  "../../Backend/ece-website/target/ece-website-0.0.1-SNAPSHOT.jar",
);
const scratch = await mkdtemp(path.join(tmpdir(), "eke-full-qa-"));
const backendPort = await freePort(),
  frontendPort = await freePort();
const origin = `http://127.0.0.1:${frontendPort}`;
const username = "local-qa-admin",
  password = randomBytes(24).toString("hex");
const env = {
  ...process.env,
  SERVER_ADDRESS: "127.0.0.1",
  SERVER_PORT: String(backendPort),
  SPRING_DATASOURCE_URL: `jdbc:h2:file:${path.join(scratch, "data", "local").replaceAll("\\", "/")}`,
  SPRING_DATASOURCE_USERNAME: "sa",
  SPRING_DATASOURCE_PASSWORD: "",
  SPRING_H2_CONSOLE_ENABLED: "false",
  SPRING_MAIL_HOST: "127.0.0.1",
  SPRING_MAIL_PORT: "9",
  MAIL_PASSWORD: "local-only",
  APP_JWT_SECRET: randomBytes(48).toString("base64"),
  APP_AUTH_COOKIE_SECURE: "false",
  APP_BOOTSTRAP_ADMIN_USERNAME: username,
  APP_BOOTSTRAP_ADMIN_PASSWORD: password,
};
function startBackend(mode) {
  const p = spawn("java", ["-jar", jar], {
    cwd: scratch,
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...env, SPRING_JPA_HIBERNATE_DDL_AUTO: mode },
  });
  p.stdout.resume();
  p.stderr.resume();
  return p;
}
let backend = startBackend("create");
const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  cwd: frontend,
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
  env: {
    ...process.env,
    PORT: String(frontendPort),
    API_PROXY_TARGET: `http://127.0.0.1:${backendPort}`,
  },
});
server.stdout.resume();
server.stderr.resume();
async function ready() {
  for (let i = 0; i < 120; i++) {
    if (backend.exitCode !== null) throw Error("Local backend exited");
    if (
      await fetch(`${origin}/api/news/homepage`)
        .then((r) => r.ok)
        .catch(() => false)
    )
      return;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw Error("Local backend readiness timeout");
}
async function stop(p) {
  if (p.exitCode !== null) return;
  const exited = new Promise((r) => p.once("exit", r));
  p.kill();
  await exited;
}
let browser, anon, context;
try {
  await ready();
  browser = await chromium.launch({
    headless: true,
    ...(process.platform === "win32" ? { channel: "msedge" } : {}),
  });
  context = await browser.newContext({ timezoneId: "Europe/Skopje" });
  anon = await request.newContext({ baseURL: origin });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${origin}/login/`);
  await page.getByLabel("Username", { exact: true }).fill(username);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\//);
  async function write(url, options = {}) {
    const csrf = await (
      await context.request.get(`${origin}/api/auth/csrf`)
    ).json();
    const r = await context.request.fetch(`${origin}/api${url}`, {
      ...options,
      headers: { "X-XSRF-TOKEN": csrf.token, ...options.headers },
    });
    if (!r.ok())
      throw Error(`${url} returned ${r.status()}: ${await r.text()}`);
    return r.status() === 204 ? null : r.json();
  }
  const image = {
    name: "local.png",
    mimeType: "image/png",
    buffer: await readFile("public/assets/projects-page/Rectangle 66.png"),
  };
  // Actual editor -> database -> private media/publication -> public pages.
  await page.getByRole("button", { name: "Add news", exact: true }).click();
  await page.getByLabel("Title *", { exact: true }).fill("Local QA article");
  await page.getByLabel(/^Slug/).fill("unavailable");
  await page.getByLabel("Summary / excerpt").fill("Local QA persisted summary");
  await page
    .getByLabel("Article content (JSON blocks)")
    .fill('[{"type":"paragraph","text":[{"text":"Local QA full article"}]}]');
  await page.getByLabel(/Cover image/).setInputFiles(image);
  await page
    .getByLabel("Image alternative text", { exact: true })
    .fill("Local QA image");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Local QA article", exact: true }),
  ).toBeVisible();
  let news = (
    await (await context.request.get(`${origin}/api/news`)).json()
  )[0];
  expect((await anon.get("/api/news/slug/unavailable")).status()).toBe(404);
  expect((await anon.get(news.imageUrl)).status()).toBe(404);
  news = await write(`/news/${news.id}`, {
    method: "PUT",
    multipart: {
      published: "true",
      publishedAt: new Date(Date.now() - 1000).toISOString(),
    },
  });
  expect((await (await anon.get("/api/news/homepage")).json())[0].id).toBe(
    news.id,
  );
  await page.goto(`${origin}/news/`);
  await expect(
    page.getByRole("heading", { name: "Local QA article" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Read more", exact: true }).click();
  await expect(
    page.getByText("Local QA full article", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Local QA full article", { exact: true }),
  ).toBeVisible();
  // Generated after the static build: no manifest entry or frontend rebuild.
  const projectSlug = "fresh-cms-project-" + randomBytes(5).toString("hex");
  const projectsTab = () => page.getByRole("navigation", { name: "Admin navigation" }).getByRole("button", { name: /^Projects/ });
  await page.goto(origin + "/admin/");
  await projectsTab().click();
  await page.getByRole("button", { name: "Add project", exact: true }).click();
  await page.getByLabel("Title *", { exact: true }).fill("Local QA project");
  await page.getByLabel(/^Slug/).fill(projectSlug);
  await page.getByLabel("Quick summary").fill("Local QA project summary");
  await page.getByLabel(/^Description \*/).fill("Local QA project details");
  await page.getByLabel("Budget (€) *", { exact: true }).fill("0");
  for (const [label, value] of Object.entries({ programme: "Erasmus+", "grant Value": "12000", currency: "EUR", countries: "North Macedonia", "key Action": "KA2", "action Type": "Cooperation", website: "https://example.org/project", topics: "Education, Inclusion", "download Description": "Local downloadable document" })) {
    await page.getByLabel(label, { exact: true }).fill(value);
  }
  await page.getByLabel("Start date", { exact: true }).fill("2026-01-01");
  await page.getByLabel("End date", { exact: true }).fill("2027-01-01");
  await page.getByLabel("Partners", { exact: true }).fill("Local partner");
  await page.getByLabel("Project content (JSON blocks)").fill('[{"type":"paragraph","text":[{"text":"Persisted detailed content"}]}]');
  await page.getByLabel(/Cover image/).setInputFiles(image);
  await page.getByLabel("Project logo", { exact: true }).setInputFiles({ ...image, buffer: await readFile("public/assets/project-details/logo 1.png") });
  await page.getByLabel("Image alternative text", { exact: true }).fill("Local project image");
  const pdf = { name: "local.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n%%EOF") };
  await page.getByLabel(/Project document/).setInputFiles(pdf);
  const supporting = await write("/projects/media", { method: "POST", multipart: { file: pdf } });
  const partnerImage = await write("/projects/media", { method: "POST", multipart: { file: image } });
  await page.getByLabel("Additional resources (JSON)").fill(JSON.stringify([{ title: "Extra resource", url: supporting.url, description: "Additional persisted resource" }]));
  await page.getByLabel("Partner media (JSON)").fill(JSON.stringify([{ name: "Local partner logo", url: partnerImage.url, alt: "Partner logo" }]));
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Local QA project", exact: true })).toBeVisible();
  await mkdir("test-results/full-stack", { recursive: true });
  await page.screenshot({ path: "test-results/full-stack/project-admin.png", fullPage: true });
  const project = await (await anon.get("/api/projects/slug/" + projectSlug)).json();
  expect(project.programme).toBe("Erasmus+");
  expect(project.grantValue).toBe(12000);
  for (const method of ["POST", "PUT", "DELETE"]) {
    expect((await anon.fetch("/api/projects" + (method === "POST" ? "" : "/" + project.uuid), { method })).status()).toBe(401);
  }
  expect((await context.request.delete(origin + "/api/projects/" + project.uuid)).status()).toBe(403);
  expect((await anon.get(project.image)).status()).toBe(200);
  expect((await anon.get(project.pdfUrl)).headers()["content-type"]).toContain(
    "application/pdf",
  );
  await page.goto(`${origin}/projects/`);
  await page
    .getByRole("link", { name: "Project Details", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Local QA project" }),
  ).toBeVisible();
  await expect(
    page.getByText("Local QA project details", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Persisted detailed content", { exact: true })).toBeVisible();
  await expect(page.getByText("Erasmus+", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Download Extra resource" })).toHaveAttribute("href", supporting.url);
  await expect(page.getByAltText("Partner logo")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Local QA project", exact: true })).toBeVisible();
  await page.goto(origin + "/projects/details/?slug=" + projectSlug);
  await expect(page.getByRole("heading", { name: "Local QA project", exact: true })).toBeVisible();
  for (const slug of ["not-a-real-project", "invalid_identifier"]) {
    await page.goto(origin + "/projects/" + slug + "/");
    await expect(page.getByRole("heading", { name: "Project not found" })).toBeVisible();
  }
  const minimal = await write("/projects", { method: "POST", multipart: { title: "Minimal project", slug: "minimal-project", budget: "0", description: "", quickSummary: "" } });
  await page.goto(origin + "/projects/minimal-project/");
  await expect(page.getByRole("heading", { name: "Minimal project", exact: true })).toBeVisible();
  await write("/projects/" + minimal.uuid, { method: "DELETE" });
  await page.reload();
  await expect(page.getByRole("heading", { name: "Project not found" })).toBeVisible();
  // New module editor is exercised in the existing dashboard.
  await page.goto(`${origin}/admin/`);
  await page
    .getByRole("navigation", { name: "Admin navigation" })
    .getByRole("button", { name: /Opportunities/ })
    .click();
  await page
    .getByRole("button", { name: "Add opportunity", exact: true })
    .click();
  await page
    .getByLabel("Title *", { exact: true })
    .fill("Local QA opportunity");
  await page.getByLabel("Slug *", { exact: true }).fill("local-qa-opportunity");
  await page
    .getByLabel("Application Deadline", { exact: true })
    .fill("2099-01-01T12:00");
  await page
    .getByLabel("Application Url", { exact: true })
    .fill("https://example.org/local-qa-only");
  await page
    .getByRole("combobox", { name: /^Publication/ })
    .selectOption("true");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Local QA opportunity" }),
  ).toBeVisible();
  const training = await write("/training/admin", {
    method: "POST",
    data: {
      title: "Local QA training",
      slug: "local-qa-training",
      published: true,
      availability: "OPEN",
      registrationDeadline: "2099-01-01T00:00:00Z",
      registrationUrl: "https://example.org/local-qa-only",
      learningObjectives: "Local QA learning",
    },
  });
  await page.goto(`${origin}/opportunities/`);
  await expect(
    page.getByRole("link", { name: "Apply", exact: true }),
  ).toHaveAttribute("href", "https://example.org/local-qa-only");
  await page.goto(`${origin}/training/`);
  await expect(
    page.getByRole("heading", { name: "Local QA training" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Register", exact: true }),
  ).toHaveAttribute("href", "https://example.org/local-qa-only");
  expect((await anon.post("/api/training/admin", { data: {} })).status()).toBe(
    401,
  );
  expect(
    (
      await context.request.post(`${origin}/api/training/admin`, { data: {} })
    ).status(),
  ).toBe(403);
  await mkdir("test-results/full-stack", { recursive: true });
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/news/", "/news/unavailable/", "/projects/", `/projects/${projectSlug}/`, "/opportunities/", "/training/"]) {
      await page.goto(`${origin}${route}`);
      await page.locator("main").waitFor();
      await page.waitForLoadState("networkidle");
      if (route === "/projects/" || route === `/projects/${projectSlug}/`) {
        // Trigger the existing scroll-reveal animations before full-page capture.
        for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 600) {
          await page.evaluate(y => window.scrollTo(0, y), y);
          await page.waitForTimeout(150);
        }
        await page.waitForTimeout(600);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: `test-results/full-stack/${route === "/projects/" ? "projects-list" : "project-details"}-${width}.png`, fullPage: true });
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${route} overflows at ${width}px`).toBe(true);
    }
    const trainingHeading = page.getByRole("heading", {name:"Local QA training"});
    await trainingHeading.scrollIntoViewIfNeeded();
    await expect(trainingHeading).toHaveCSS("opacity", "1");
    await trainingHeading.locator("xpath=ancestor::article").screenshot({path:`test-results/full-stack/training-session-${width}.png`, animations:"disabled"});
    await page.goto(`${origin}/opportunities/`);
    const opportunityHeading = page.getByRole("heading", {name:"Local QA opportunity"});
    await opportunityHeading.scrollIntoViewIfNeeded();
    await expect(opportunityHeading).toHaveCSS("opacity", "1");
    await opportunityHeading.locator("xpath=ancestor::article").screenshot({path:`test-results/full-stack/opportunity-${width}.png`, animations:"disabled"});
  }
  // Restart against the same file with schema validation, no automatic modification.
  await stop(backend);
  backend = startBackend("validate");
  await ready();
  expect((await (await anon.get("/api/news/slug/unavailable")).json()).id).toBe(
    news.id,
  );
  expect(
    (await (await anon.get(`/api/projects/slug/${projectSlug}`)).json()).uuid,
  ).toBe(project.uuid);
  expect(
    (await (await anon.get("/api/opportunities/public")).json())[0].title,
  ).toBe("Local QA opportunity");
  expect((await (await anon.get("/api/training/sessions")).json())[0].id).toBe(
    training.id,
  );
  expect((await anon.get(project.pdfUrl)).status()).toBe(200);
  await write(`/news/${news.id}`, {
    method: "PUT",
    multipart: { published: "false" },
  });
  expect((await anon.get(news.imageUrl)).status()).toBe(404);
  await page.goto(`${origin}/news/unavailable/`);
  await expect(
    page.getByRole("heading", { name: "Article unavailable" }),
  ).toBeVisible();
  await page.goto(origin + "/admin/");
  await projectsTab().click();
  await page.getByRole("button", { name: "Edit Local QA project", exact: true }).click();
  await expect(page.getByLabel("programme", { exact: true })).toHaveValue("Erasmus+");
  await page.getByLabel(/^Description \*/).fill("Updated persisted project description");
  await page.getByLabel("Start date", { exact: true }).fill("");
  await page.getByLabel("End date", { exact: true }).fill("");
  await page.getByLabel("grant Value", { exact: true }).fill("");
  for (const label of ["cover image", "logo", "PDF document"]) await page.getByLabel("Remove current " + label, { exact: true }).check();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Local QA project", exact: true })).toBeVisible();
  const edited = await (await anon.get("/api/projects/slug/" + projectSlug)).json();
  for (const field of ["startDate", "endDate", "grantValue", "image", "pdfUrl", "logoFilePath"]) expect(edited[field]).toBeNull();
  await page.goto(origin + "/projects/" + projectSlug + "/");
  await expect(page.getByText("Updated persisted project description", { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Updated persisted project description", { exact: true })).toBeVisible();
  await page.goto(origin + "/admin/");
  await projectsTab().click();
  await page.getByRole("button", { name: "Delete Local QA project", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByRole("button", { name: /Delete/ }).click();
  await expect(page.getByRole("heading", { name: "Local QA project", exact: true })).toHaveCount(0);
  expect((await anon.get("/api/projects/slug/" + projectSlug)).status()).toBe(404);
  expect((await (await anon.get("/api/projects/public")).json()).some(item => item.uuid === project.uuid)).toBe(false);
  await page.goto(origin + "/projects/" + projectSlug + "/");
  await expect(page.getByRole("heading", { name: "Project not found" })).toBeVisible();
  expect(errors).toEqual([]);
  console.log(
    "PASS: real editor/API/browser, all four modules, CSRF, publication/media privacy, generated deep links, responsive widths, file H2 restart persistence.",
  );
} finally {
  await anon?.dispose();
  await context?.close();
  await browser?.close();
  await stop(server);
  await stop(backend);
  await rm(scratch, { recursive: true, force: true });
}
