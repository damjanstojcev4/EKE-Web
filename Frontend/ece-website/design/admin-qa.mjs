import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';

// Writes test records: run against a disposable local backend/database only.
const base = new URL(process.env.ADMIN_QA_BASE_URL || 'http://127.0.0.1:3103');
const username = process.env.ADMIN_QA_USERNAME;
const password = process.env.ADMIN_QA_PASSWORD;
if (!['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname)) throw new Error('Admin QA requires a disposable local backend, not a deployed environment.');
if (!username || !password) throw new Error('Set ADMIN_QA_USERNAME and ADMIN_QA_PASSWORD for the isolated backend.');
const origin = base.origin;
const marker = `QA-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const projectTitle = `${marker} community project`;
const updatedTitle = `${marker} updated project`;
const newsDescription = `${marker} community news`;
const imageFile = { name: 'admin-qa.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') };
const pdfFile = { name: 'admin-qa.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.1\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Count 0 /Kids [] >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF\n') };
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
const results = [];
let projectId;
let newsId;
page.on('pageerror', error => errors.push(error.message));
const url = path => origin + path;
const isMutation = (method, path) => response => response.request().method() === method && new URL(response.url()).pathname === path;
const adminNav = name => page.getByRole('navigation', { name: 'Admin navigation' }).getByRole('button', { name: new RegExp(name) });

async function mutate(path, method, data) {
  const csrfResponse = await context.request.get(url('/api/auth/csrf'));
  expect(csrfResponse.ok()).toBe(true);
  const csrf = await csrfResponse.json();
  return context.request.fetch(url('/api' + path), { method, headers: { [csrf.headerName]: csrf.token }, ...(data === undefined ? {} : { data }) });
}
async function assertNoStoredToken() {
  const values = await page.evaluate(() => ({ local: Object.entries(localStorage), session: Object.entries(sessionStorage), cookies: document.cookie }));
  expect(JSON.stringify(values)).not.toMatch(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
  expect(values.cookies).not.toContain('cookie-auth=');
}
async function saveWithResponse(method, path) {
  const responsePromise = page.waitForResponse(isMutation(method, path));
  await page.getByRole('button', { name: 'Save changes' }).click();
  const response = await responsePromise;
  expect(response.ok()).toBe(true);
  return response.json();
}
async function deleteRow(label, path) {
  await page.getByRole('button', { name: `Delete ${label}`, exact: true }).click();
  const responsePromise = page.waitForResponse(isMutation('DELETE', path));
  await page.getByRole('button', { name: 'Delete item', exact: true }).click();
  expect((await responsePromise).ok()).toBe(true);
  await expect(page.getByRole('button', { name: `Delete ${label}`, exact: true })).toHaveCount(0);
}

try {
  await page.goto(url('/admin/'));
  await expect(page).toHaveURL(/\/login\//);
  const passwordInput = page.getByLabel('Password', { exact: true });
  await expect(passwordInput).toHaveAttribute('type', 'password');
  await page.getByRole('button', { name: 'Show password', exact: true }).click();
  await expect(passwordInput).toHaveAttribute('type', 'text');
  await page.getByRole('button', { name: 'Hide password', exact: true }).click();
  await expect(passwordInput).toHaveAttribute('type', 'password');
  await page.getByLabel('Username', { exact: true }).fill(username);
  await passwordInput.fill('incorrect-' + marker);
  const rejectedLogin = page.waitForResponse(isMutation('POST', '/api/auth/authenticate'));
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  expect((await rejectedLogin).status()).toBe(401);
  await expect(page.getByRole('alert').filter({ hasText: 'username or password is incorrect' })).toBeVisible();
  await expect(page).toHaveURL(/\/login\//);
  await passwordInput.fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\//);
  await expect(page.getByRole('button', { name: 'Add project', exact: true })).toBeEnabled();
  const authCookie = (await context.cookies()).find(cookie => cookie.name === 'cookie-auth');
  expect(authCookie?.httpOnly).toBe(true);
  expect(authCookie?.sameSite).toBe('Strict');
  await assertNoStoredToken();
  await fs.mkdir('design/screenshots', { recursive: true });

  await page.getByRole('button', { name: 'Add project', exact: true }).click();
  await page.getByLabel('Title *', { exact: true }).fill(projectTitle);
  await page.getByLabel('Quick summary').fill(`${marker} local integration check.`);
  await page.getByLabel('Description *', { exact: true }).fill('Testing authenticated project management against the isolated database.');
  await page.getByLabel('Budget').fill('1000');
  await page.getByLabel('Start date').fill('2026-11-17');
  await page.getByLabel('End date').fill('2026-12-17');
  await page.getByLabel('Partners').fill('QA partner one, QA partner two');
  await page.getByLabel(/Cover image/).setInputFiles(imageFile);
  await page.getByLabel(/Project document/).setInputFiles(pdfFile);
  const created = await saveWithResponse('POST', '/api/projects');
  projectId = created.uuid;
  expect(typeof projectId).toBe('string');
  expect(created.pdfUrl).toContain('/api/uploads/pdf/');
  expect((await context.request.get(url(created.pdfUrl))).ok()).toBe(true);
  await expect(page.getByRole('heading', { name: projectTitle, exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: projectTitle, exact: true })).toBeVisible();
  await page.getByRole('button', { name: `Edit ${projectTitle}`, exact: true }).click();
  await expect(page.getByLabel('Budget')).toHaveValue('1000');
  await expect(page.getByLabel('Start date')).toHaveValue('2026-11-17');
  await page.getByLabel('Title *', { exact: true }).fill(updatedTitle);
  await page.getByLabel('Start date').fill('');
  await page.getByLabel('End date').fill('');
  await page.getByLabel('Partners').fill('');
  await page.getByRole('combobox').selectOption('completed');
  const updated = await saveWithResponse('PUT', `/api/projects/${projectId}`);
  expect(updated.startDate).toBeNull();
  expect(updated.endDate).toBeNull();
  expect(updated.partners).toEqual([]);
  expect(updated.status).toBe('PAST');
  await page.getByRole('searchbox', { name: 'Search projects' }).fill(marker);
  await page.getByRole('button', { name: 'Ongoing', exact: true }).click();
  await expect(page.getByText('No matching content.')).toBeVisible();
  await page.getByRole('button', { name: 'Past', exact: true }).click();
  await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toBeVisible();
  await page.getByRole('button', { name: `Delete ${updatedTitle}`, exact: true }).click();
  await page.getByRole('button', { name: 'Keep it', exact: true }).click();
  await expect(page.getByRole('heading', { name: updatedTitle, exact: true })).toBeVisible();
  await deleteRow(updatedTitle, `/api/projects/${projectId}`);
  projectId = undefined;

  await adminNav('News').click();
  await page.getByRole('button', { name: 'Add news', exact: true }).click();
  await expect(page.getByLabel('Title *', { exact: true })).toHaveCount(0);
  await page.getByLabel('Short description').fill(newsDescription);
  await page.getByLabel('Instagram URL').fill('https://www.instagram.com/p/admin-qa/');
  await page.getByLabel(/Cover image/).setInputFiles(imageFile);
  const createdNews = await saveWithResponse('POST', '/api/news');
  newsId = createdNews.id;
  await expect(page.getByRole('heading', { name: newsDescription, exact: true })).toBeVisible();
  await page.reload();
  await adminNav('News').click();
  await expect(page.getByRole('heading', { name: newsDescription, exact: true })).toBeVisible();
  await page.getByRole('button', { name: `Edit ${newsDescription}`, exact: true }).click();
  await page.getByLabel('Short description').fill(newsDescription + ' updated');
  await saveWithResponse('PUT', `/api/news/${newsId}`);
  await deleteRow(newsDescription + ' updated', `/api/news/${newsId}`);
  newsId = undefined;
  await page.getByRole('searchbox').fill(marker + '-not-found');
  await expect(page.getByText('No matching content.')).toBeVisible();
  await adminNav('Messages').click();
  await expect(page.getByRole('region', { name: 'Messages' })).toBeVisible();
  expect((await context.request.get(url('/api/messages/'))).status()).toBe(200);

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await adminNav('Projects').click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    expect(overflow).toBe(false);
    await page.screenshot({ path: `design/screenshots/admin-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Add project', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.screenshot({ path: `design/screenshots/admin-form-${width}.png`, fullPage: true });
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    results.push({ width, overflow });
  }
  await assertNoStoredToken();
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/login\//);
  expect((await context.request.get(url('/api/auth/me'))).status()).toBe(401);
  expect((await context.request.get(url('/api/messages/'))).status()).toBe(401);
  await page.goto(url('/admin/'));
  await expect(page).toHaveURL(/\/login\//);
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.screenshot({ path: `design/screenshots/login-${width}.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
  console.log(JSON.stringify({ passed: true, flows: ['unauthenticated redirect', 'password toggle', 'invalid credentials', 'cookie login', 'project create/upload', 'reload persistence', 'edit/date clearing', 'filters/search', 'cancel/confirm deletion', 'news CRUD', 'protected inbox', 'logout', 'no JS token storage'], results, errors }, null, 2));
} finally {
  // Cleanup only records created by this test run, including after failed assertions.
  if (projectId || newsId) {
    try {
      if ((await context.request.get(url('/api/auth/me'))).status() !== 200) {
        const authenticated = await mutate('/auth/authenticate', 'POST', { username, password });
        if (!authenticated.ok()) throw new Error('QA cleanup could not authenticate.');
      }
      for (const [kind, id] of [['projects', projectId], ['news', newsId]]) {
        if (id === undefined) continue;
        const response = await mutate(`/${kind}/${id}`, 'DELETE');
        if (!response.ok() && response.status() !== 404) throw new Error(`QA cleanup failed for its own ${kind} record.`);
      }
    } catch (error) { console.error('Test record cleanup failed:', error.message); }
  }
  await browser.close();
}
