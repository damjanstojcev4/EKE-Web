// Disposable local integration test. Never accepts a remote API or persistent database.
import { chromium, expect, request } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import net from 'node:net';

async function freePort() {
  const server = net.createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
}

const frontend = process.cwd();
const jar = path.resolve(frontend, '../../Backend/ece-website/target/ece-website-0.0.1-SNAPSHOT.jar');
const scratch = await mkdtemp(path.join(tmpdir(), 'eke-news-qa-'));
const backendPort = await freePort();
const frontendPort = await freePort();
const username = 'local-editor';
const password = randomBytes(24).toString('hex');
const origin = `http://127.0.0.1:${frontendPort}`;
const backend = spawn('java', ['-jar', jar], {
  cwd: scratch, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  env: {
    ...process.env, SERVER_ADDRESS: '127.0.0.1', SERVER_PORT: String(backendPort),
    SPRING_DATASOURCE_URL: 'jdbc:h2:mem:news_qa;DB_CLOSE_DELAY=-1',
    SPRING_DATASOURCE_USERNAME: 'sa', SPRING_DATASOURCE_PASSWORD: '',
    SPRING_JPA_HIBERNATE_DDL_AUTO: 'create-drop', SPRING_H2_CONSOLE_ENABLED: 'false',
    SPRING_MAIL_HOST: '127.0.0.1', SPRING_MAIL_PORT: '9', MAIL_PASSWORD: 'local-only',
    APP_JWT_SECRET: randomBytes(48).toString('base64'), APP_AUTH_COOKIE_SECURE: 'false',
    APP_BOOTSTRAP_ADMIN_USERNAME: username, APP_BOOTSTRAP_ADMIN_PASSWORD: password,
  },
});
// Drain without printing configuration, tokens or credentials.
backend.stdout.resume(); backend.stderr.resume();
const server = spawn(process.execPath, ['scripts/serve.mjs'], {
  cwd: frontend, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORT: String(frontendPort), API_PROXY_TARGET: `http://127.0.0.1:${backendPort}` },
});
server.stdout.resume(); server.stderr.resume();
let browser;
let anonymous;
try {
  for (let attempt = 0; ; attempt++) {
    if (backend.exitCode !== null || server.exitCode !== null) throw new Error('Local QA service exited before readiness.');
    if (await fetch(`${origin}/api/news/homepage`).then(r => r.ok).catch(() => false)) break;
    if (attempt >= 90) throw new Error('Local QA services did not become ready.');
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  browser = await chromium.launch({ ...(process.platform === 'win32' ? { channel: 'msedge' } : {}), headless: true });
  const context = await browser.newContext({ timezoneId: 'Europe/Skopje' });
  const page = await context.newPage();
  anonymous = await request.newContext({ baseURL: origin });
  const publicNews = async () => (await anonymous.get('/api/news/homepage')).json();
  await page.goto(`${origin}/admin/`);
  await expect(page).toHaveURL(/\/login\//);
  await page.getByLabel('Username', { exact: true }).fill(username);
  await page.getByLabel('Password', { exact: true }).fill(password);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\//);
  await page.getByRole('button', { name: 'Add news', exact: true }).click();
  await page.getByLabel('Title *', { exact: true }).fill('Local integration article');
  await page.getByLabel('Summary / excerpt').fill('Disposable local article summary');
  await page.getByLabel(/Cover image/).setInputFiles({ name: 'qa.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64') });
  await page.getByLabel('Image alternative text').fill('Test cover image');
  const save = async () => {
    const response = page.waitForResponse(r => /\/api\/news(?:\/\d+)?$/.test(r.url()) && ['POST', 'PUT'].includes(r.request().method()));
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    expect((await response).status()).toBe(200);
    await expect(page.getByRole('heading', { name: 'Local integration article', exact: true })).toBeVisible();
  };
  const edit = () => page.getByRole('button', { name: 'Edit Local integration article', exact: true }).click();
  await save();
  expect(await publicNews()).toEqual([]);
  const all = await (await context.request.get(`${origin}/api/news`)).json();
  expect(all).toHaveLength(1);
  expect((await anonymous.get(all[0].imageUrl)).status()).toBe(404);
  await edit();
  await page.getByLabel('Publication status').selectOption('scheduled');
  await page.getByLabel('Publication date and time').fill('2100-01-01T13:00');
  await save();
  expect(await publicNews()).toEqual([]);
  await edit();
  await page.getByRole('button', { name: 'Publish now', exact: true }).click();
  await save();
  expect(await publicNews()).toHaveLength(1);
  expect((await anonymous.get(all[0].imageUrl)).status()).toBe(200);
  await edit();
  await page.getByLabel('Publication status').selectOption('draft');
  await save();
  expect(await publicNews()).toEqual([]);
  expect((await anonymous.get(all[0].imageUrl)).status()).toBe(404);
  const cookies = await context.cookies();
  expect(cookies.find(c => c.name === 'cookie-auth')?.httpOnly).toBe(true);
  expect(cookies.find(c => c.name === 'cookie-auth')?.sameSite).toBe('Strict');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/login\//);
  console.log('PASS: real cookie login, CSRF, draft with image, schedule, immediate publication, unpublish, private images and logout (isolated H2).');
} finally {
  await browser?.close();
  await anonymous?.dispose();
  const stop = async child => {
    if (child.exitCode !== null) return;
    const exited = new Promise(resolve => child.once('exit', resolve));
    child.kill();
    await exited;
  };
  await Promise.all([stop(server), stop(backend)]);
  if (path.dirname(scratch) !== path.resolve(tmpdir()) || !path.basename(scratch).startsWith('eke-news-qa-')) {
    throw new Error('Refusing to remove an unexpected QA directory.');
  }
  await rm(scratch, { recursive: true, force: true });
}
