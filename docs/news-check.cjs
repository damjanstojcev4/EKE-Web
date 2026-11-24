// News references are captured only from the pre-migration Git checkpoint.
const { chromium, expect } = require('../Frontend/ece-website/node_modules/@playwright/test');
const { spawn, execSync } = require('node:child_process');
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const { gzipSync, gunzipSync } = require('node:zlib');
const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw Error('Use before/after');
const root = path.join(__dirname, '..'), frontend = path.join(root, 'Frontend/ece-website');
const base = path.join(__dirname, 'news-baseline'), dir = path.join(base, phase);
if (phase === 'before' && fs.existsSync(path.join(dir, 'manifest.json.gz'))) throw Error('References already exist');
if (phase === 'before' && execSync('git rev-parse HEAD', { cwd: root }).toString().trim() !== '120bd52dff3e298c56863d6c2d486d17ad342aaa') throw Error('Baseline requires approved checkpoint');
if (phase === 'before') execSync('git diff --exit-code 120bd52d -- Frontend/ece-website/src/app/news Frontend/ece-website/src/components/news', { cwd: root, stdio: 'pipe' });
fs.mkdirSync(dir, { recursive: true });
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const reference = phase === 'after' ? JSON.parse(gunzipSync(fs.readFileSync(path.join(base, 'before/manifest.json.gz')))) : null;
const server = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: frontend, env: { ...process.env, PORT: '3208', API_PROXY_TARGET: '' }, stdio: 'pipe' });
const fixture = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1, published: true, instagramUrl: '', slug: i === 0 ? 'unavailable' : `fixture-${i}`, title: ['Community learning across borders', 'Open call for young community leaders', 'Shared ideas become local action', 'The big story: building together', 'Listen to community voices', 'Watch our learning journey'][i],
  shortDescription: 'Discover how non-formal learning connects people and creates opportunities for sustainable change.', emphasis: i % 2 ? 'Join the conversation.' : null,
  category: i % 2 ? 'OPEN_CALL' : 'LATEST_NEWS', placement: [null, null, 'FEATURED', 'BIG_STORY', 'MEDIA', 'MEDIA'][i],
  mediaKind: i === 4 ? 'AUDIO' : i === 5 ? 'VIDEO' : null, mediaUrl: i >= 4 ? 'https://example.invalid/news-media' : null,
  imageUrl: i === 5 ? null : '/api/uploads/news/fixture.png', imageAlt: 'Community news fixture', publishedAt: '2026-11-20T10:00:00Z',
  introduction: null, contentJson: null, heroUrl: null, heroAlt: null, relatedIds: null,
}));
(async () => { let browser; try {
  await new Promise((ok, no) => { server.stdout.once('data', ok); server.once('error', no); });
  browser = await chromium.launch({ channel: 'msedge', args: ['--force_low_power_gpu'] });
  const session = await browser.newBrowserCDPSession(), { gpu } = await session.send('SystemInfo.getInfo'); await session.detach();
  const rendering = { browser: browser.version(), renderer: gpu.auxAttributes.glRenderer, backend: gpu.auxAttributes.skiaBackendType };
  expect(rendering).toEqual({ browser: '158.0.4370.33', renderer: 'ANGLE (Intel, Intel(R) UHD Graphics (0x00009BC4) Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9664)', backend: 'GaneshGL' });
  // Read-only CMS evidence; fixture responses never enter application source.
  const live = await fetch('https://preview.ekebitola.org/api/news/public?page=0&size=12');
  expect(live.status).toBe(200); const liveBody = await live.json(); expect(liveBody.content).toEqual([]);
  const result = { rendering, source: '120bd52dff3e298c56863d6c2d486d17ad342aaa', live: liveBody, captures: {}, computed: {}, behavior: {}, requests: [], errors: [] };
  for (const width of [1440, 820, 390, 700, 701, 768, 769, 1100, 1101]) {
    const page = await browser.newPage({ viewport: { width, height: width === 820 ? 1180 : width === 390 ? 844 : 1000 }, deviceScaleFactor: 1, reducedMotion: 'reduce', locale: 'en-GB', timezoneId: 'Europe/Skopje', colorScheme: 'light' });
    page.on('pageerror', e => result.errors.push(e.message));
    let mode = 'empty', release;
    await page.route('**/api/**', async route => {
      const req = route.request(), url = new URL(req.url()); expect(req.method()).toBe('GET');
      if (url.pathname === '/api/uploads/news/fixture.png') return route.fulfill({ contentType: 'image/png', body: fs.readFileSync(path.join(frontend, 'public/assets/news-accessible-chess.png')) });
      expect(url.pathname).toBe('/api/news/public'); expect(url.searchParams.get('size')).toBe('12');
      result.requests.push(url.pathname + url.search);
      if (mode === 'loading') await new Promise(ok => { release = ok; });
      if (mode === 'error') return route.fulfill({ status: 503, json: { message: 'News temporarily unavailable' } });
      const selected = url.searchParams.get('category'), number = Number(url.searchParams.get('page'));
      const content = selected ? fixture.filter(a => a.category === selected) : fixture;
      return route.fulfill({ json: mode === 'empty' ? liveBody : { content: number ? content.slice(1, 3) : content, totalElements: content.length + 2, totalPages: 2, number } });
    });
    const save = async state => {
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); window.scrollTo(0, 0); });
      const key = `${width}-${state}`, png = await page.screenshot({ fullPage: true, caret: 'hide' });
      fs.writeFileSync(path.join(dir, key + '.png'), png); result.captures[key] = sha(png);
      result.computed[key] = await page.locator('main, main *').evaluateAll(nodes => {
        const props = ['display','position','top','left','right','width','height','min-height','max-width','margin-top','margin-right','margin-bottom','margin-left','padding-top','padding-right','padding-bottom','padding-left','gap','grid-template-columns','font-size','font-family','font-weight','line-height','letter-spacing','color','background-color','border-top','border-right','border-bottom','border-left','border-radius','backdrop-filter','outline','outline-offset','transform','text-align','text-transform','overflow','content'];
        const read = (e, pseudo) => Object.fromEntries(props.map(p => [p, getComputedStyle(e, pseudo).getPropertyValue(p)]));
        return nodes.map(e => ({ tag: e.tagName, normal: read(e), before: read(e, '::before') }));
      });
      result.behavior[key] = await page.evaluate(() => ({ text: document.querySelector('main').innerText, links: [...document.querySelectorAll('main a')].map(a => a.getAttribute('href')), buttons: [...document.querySelectorAll('main button')].map(b => ({ text: b.textContent, disabled: b.disabled })), category: document.querySelector('select').value, focus: document.activeElement === document.body ? 'BODY' : document.activeElement.outerHTML.replace(/ class="[^"]*"/g, '') }));
    };
    await page.goto('http://127.0.0.1:3208/news/', { waitUntil: 'networkidle' }); await expect(page.getByText('No published news yet.')).toBeVisible(); await save('empty');
    mode = 'populated'; await page.reload({ waitUntil: 'networkidle' }); await expect(page.locator('main article')).toHaveCount(6); await save('populated');
    if ([1440,820,390].includes(width)) {
      const select = page.getByLabel('Category'); await select.focus(); await save('category-focus');
      await select.selectOption('OPEN_CALL'); await expect(page.locator('main article')).toHaveCount(3); await save('category-selected');
      await page.getByRole('button', { name: 'Next', exact: true }).click(); await expect(page.locator('main article')).toHaveCount(2); await save('page-2');
      expect(await page.getByRole('button', { name: 'Next', exact: true }).isDisabled()).toBe(true);
      await select.selectOption('LATEST_NEWS'); await expect(page.locator('main article')).toHaveCount(3); expect(await page.getByRole('button', { name: 'Previous', exact: true }).isDisabled()).toBe(true); await save('category-reset');
      await select.selectOption(''); await expect(page.locator('main article')).toHaveCount(6);
      const link = page.getByRole('link', { name: 'Read more', exact: true }); await link.hover(); await save('link-hover'); await select.focus(); await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: fixture[0].title })).toBeFocused(); await save('link-keyboard');
      mode = 'error'; await page.reload({ waitUntil: 'networkidle' }); await expect(page.locator('main [role=alert]')).toBeVisible(); await save('error');
      mode = 'loading'; await page.reload({ waitUntil: 'domcontentloaded' }); await expect(page.getByRole('status')).toHaveText('Loading news…'); await save('loading'); mode = 'populated'; release(); await expect(page.locator('main article')).toHaveCount(6);
    }
    await page.close(); console.log(phase, width);
  }
  fs.writeFileSync(path.join(dir, 'manifest.json.gz'), gzipSync(JSON.stringify(result)));
  const comparison = { captures: Object.keys(result.captures).length, changed: [], computedDifferences: [], behaviorDifferences: [], errors: result.errors, rendering, apiUnchanged: !reference || JSON.stringify(reference.live) === JSON.stringify(result.live), requestsUnchanged: !reference || JSON.stringify(reference.requests) === JSON.stringify(result.requests) };
  if (reference) for (const key of Object.keys(reference.captures)) {
    if (result.captures[key] !== reference.captures[key]) comparison.changed.push(key);
    if (JSON.stringify(result.computed[key]) !== JSON.stringify(reference.computed[key])) comparison.computedDifferences.push(key);
    if (JSON.stringify(result.behavior[key]) !== JSON.stringify(reference.behavior[key])) comparison.behaviorDifferences.push(key);
  }
  fs.writeFileSync(path.join(dir, 'comparison.json'), JSON.stringify(comparison, null, 2)); console.log(comparison);
  if (comparison.changed.length || comparison.computedDifferences.length || comparison.behaviorDifferences.length || result.errors.length || !comparison.apiUnchanged || !comparison.requestsUnchanged) process.exitCode = 1;
} finally { await browser?.close(); server.kill(); } })().catch(e => { console.error(e); process.exitCode = 1; });
