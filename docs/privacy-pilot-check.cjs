// Capture the built local export before/after migration, including breakpoint edges.
const { chromium } = require('../Frontend/ece-website/node_modules/@playwright/test');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const stage = process.argv[2];
if (!['before', 'after'].includes(stage)) throw Error('Use before or after');
const root = path.resolve(__dirname, '../Frontend/ece-website');
const dir = path.join(__dirname, 'privacy-pilot', stage);
fs.mkdirSync(dir, { recursive: true });
const server = spawn(process.execPath, ['scripts/serve.mjs'], { cwd: root, env: { ...process.env, PORT: '3202', API_PROXY_TARGET: '' }, stdio: 'pipe' });
(async () => {
 let browser;
 try {
  await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); });
  browser = await chromium.launch({ channel: 'msedge' });
  const results = { browser: browser.version(), widths: [] };
  for (const [width, height] of [[1440,1000],[820,1180],[390,844],[700,1000],[701,1000],[1100,1000],[1101,1000]]) {
   const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce', locale: 'en-GB', timezoneId: 'Europe/Skopje', colorScheme: 'light' });
   await page.goto('http://127.0.0.1:3202/privacy-policy/', { waitUntil: 'networkidle' });
   await page.evaluate(async () => { await document.fonts.ready; for (let y=0;y<document.body.scrollHeight;y+=600) { scrollTo(0,y); await new Promise(r=>requestAnimationFrame(r)); } await Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))); scrollTo(0,0); });
   const computed = await page.evaluate(() => {
    const props = ['position','isolation','overflow','z-index','pointer-events','width','height','left','top','padding-top','padding-left','margin-top','margin-right','margin-bottom','margin-left','font-family','font-size','font-weight','line-height','color','background-color','background-image','overflow-wrap','text-indent','list-style-type','transform','clip-path','content'];
    const read = (el,pseudo) => Object.fromEntries(props.map(p=>[p,getComputedStyle(el,pseudo).getPropertyValue(p)]));
    return [...document.querySelectorAll('body > div, main, main *, .footer')].map(el=>({tag:el.tagName,normal:read(el),before:read(el,'::before')}));
   });
   const shot = await page.screenshot({path:path.join(dir,`${width}.png`),fullPage:true});
   const link=page.locator('article a').first(); await link.hover();
   const hover=await link.evaluate(el=>getComputedStyle(el).textDecorationLine);
   await link.focus(); const focus=await link.evaluate(el=>({outline:getComputedStyle(el).outline,offset:getComputedStyle(el).outlineOffset}));
   results.widths.push({width,height,sha256:crypto.createHash('sha256').update(shot).digest('hex'),computed,hover,focus});
   await page.close();
  }
  fs.writeFileSync(path.join(dir,'measurements.json'),JSON.stringify(results,null,2));
  if (stage === 'after') {
   const before = JSON.parse(fs.readFileSync(path.join(__dirname,'privacy-pilot/before/measurements.json'),'utf8'));
   const comparisons = results.widths.map((result,index) => {
    const original=before.widths[index];
    return {width:result.width,height:result.height,identicalPng:original.sha256===result.sha256,identicalComputed:JSON.stringify(original.computed)===JSON.stringify(result.computed),identicalHover:original.hover===result.hover,identicalFocus:JSON.stringify(original.focus)===JSON.stringify(result.focus),sha256:result.sha256,elements:result.computed.length};
   });
   fs.writeFileSync(path.join(__dirname,'privacy-pilot/comparison.json'),JSON.stringify({browser:results.browser,results:comparisons},null,2));
   if(comparisons.some(r=>!r.identicalPng||!r.identicalComputed||!r.identicalHover||!r.identicalFocus))process.exitCode=1;
  }
  console.log(stage,results.browser,results.widths.map(x=>({width:x.width,sha256:x.sha256})));
 } finally { await browser?.close();server.kill(); }
})().catch(e=>{console.error(e);process.exitCode=1});
