// Diagnostic captures only. Approved PNGs and the strict suite are never modified.
const {chromium,expect}=require('../Frontend/ece-website/node_modules/@playwright/test');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const {spawn}=require('node:child_process');
const {gunzipSync}=require('node:zlib');
const root=path.join(__dirname,'..'),front=path.join(root,'Frontend/ece-website');
const label=process.argv[2];if(!['original','tailwind'].includes(label))throw Error('Use original/tailwind');
const dir=path.join(__dirname,'projects-baseline/signoff',label);fs.mkdirSync(dir,{recursive:true});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const harness=fs.readFileSync(path.join(__dirname,'projects-check.cjs'),'utf8');
const expression=harness.match(/const records=(.*);\r?\nconst server=/)?.[1];if(!expression)throw Error('Fixture extraction failed');
const records=vm.runInNewContext(expression);expect(records.length).toBe(6);
const reference=JSON.parse(gunzipSync(fs.readFileSync(path.join(__dirname,'projects-baseline/before/manifest.json.gz'))));
if(process.argv.includes('--staging-assets-only')){
 (async()=>{const p=JSON.parse(fs.readFileSync(path.join(dir,'probe.json'))),review=[];for(const url of Object.keys(p.assets)){
  const local=fs.readFileSync(path.join(front,'out',decodeURIComponent(url)));
  const response=await fetch('https://preview.ekebitola.org'+url,{signal:AbortSignal.timeout(45000)}),body=Buffer.from(await response.arrayBuffer());
  const normalize=b=>url.endsWith('.svg')?Buffer.from(b.toString().replace(/\r\n/g,'\n')):b;
  review.push({url,status:response.status,localSha256:hash(local),stagingSha256:hash(body),bytesIdentical:local.equals(body),identicalIgnoringCRLF:normalize(local).equals(normalize(body))});
 }fs.writeFileSync(path.join(dir,'staging-assets.json'),JSON.stringify(review,null,2));console.log({assets:review.length,differences:review.filter(r=>r.status!==200||!r.identicalIgnoringCRLF)});})().catch(e=>{console.error(e);process.exitCode=1;});
}else{
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:front,env:{...process.env,PORT:'3213',API_PROXY_TARGET:''},stdio:'pipe'});
(async()=>{let browser;try{
 await new Promise((ok,no)=>{server.stdout.once('data',ok);server.once('error',no)});
 browser=await chromium.launch({channel:'msedge',args:['--force_low_power_gpu']});
 const session=await browser.newBrowserCDPSession(),info=await session.send('SystemInfo.getInfo');await session.detach();
 const rendering={browser:browser.version(),renderer:info.gpu.auxAttributes.glRenderer,backend:info.gpu.auxAttributes.skiaBackendType};expect(rendering).toEqual(reference.rendering);
 const result={label,rendering,fixturesSha256:hash(Buffer.from(JSON.stringify(records))),assets:{},requests:[],errors:[],cases:[]};
 for(const width of [768,769,770,1098,1099,1100,1101]){
  const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:'reduce',locale:'en-GB',timezoneId:'Europe/Skopje',colorScheme:'light'});
  let mode='empty';page.on('pageerror',e=>result.errors.push(e.message));
  page.on('response',async response=>{const url=new URL(response.url());if(url.pathname.startsWith('/assets/')||url.pathname.startsWith('/_next/static/media/')){try{const body=await response.body();result.assets[url.pathname]={status:response.status(),sha256:hash(body),...(url.pathname.endsWith('.svg')?{lfSha256:hash(Buffer.from(body.toString().replace(/\r\n/g,'\n')))}:{})};}catch(e){result.errors.push(e.message);}}});
  await page.route('**/api/**',async route=>{const req=route.request(),url=new URL(req.url());expect(req.method()).toBe('GET');result.requests.push({width,path:url.pathname});if(url.pathname==='/api/uploads/images/fixture.png')return route.fulfill({contentType:'image/png',body:fs.readFileSync(path.join(front,'public/assets/news-accessible-chess.png'))});expect(url.pathname).toBe('/api/projects/public');return route.fulfill({json:mode==='empty'?[]:records});});
  const ready=async()=>{await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});};
  const details=async()=>page.evaluate(()=>{
   const box=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return {tag:e.tagName,text:e.tagName==='IMG'?e.getAttribute('src'):e.textContent.slice(0,60),x:r.x,y:r.y,width:r.width,height:r.height,display:s.display,position:s.position,font:s.font,grid:s.gridTemplateColumns,transform:s.transform};};
   return {viewport:{innerWidth,innerHeight,outerWidth,outerHeight,dpr:devicePixelRatio,clientWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,visualWidth:visualViewport.width,visualScale:visualViewport.scale},media:Object.fromEntries(['(max-width:700px)','(max-width:1100px)','(min-width:1101px)','(prefers-reduced-motion: reduce)'].map(q=>[q,matchMedia(q).matches])),fonts:{status:document.fonts.status,faces:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight}))},images:[...document.images].map(i=>({...box(i),complete:i.complete,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,currentSrc:i.currentSrc})),layout:[...document.querySelectorAll('main > section,main > div, #project-results, #project-results article, [aria-label="Filter projects by status"], footer')].map(box)};
  });
  const capture=async(name)=>{await ready();await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));const started=Date.now();const png=await page.screenshot({fullPage:true,caret:'hide'});fs.writeFileSync(path.join(dir,width+'-'+name+'.png'),png);result.cases.push({width,name,sha256:hash(png),referenceKey:width+'-'+mode,matchesReference:hash(png)===reference.captures[width+'-'+mode],captureDurationMs:Date.now()-started,details:await details()});};
  await page.goto('http://127.0.0.1:3213/projects/',{waitUntil:'networkidle'});await expect(page.getByText('No projects match this filter.')).toBeVisible();
  await capture('empty');mode='ongoing';await page.reload({waitUntil:'networkidle'});await expect(page.locator('#project-results article')).toHaveCount(3);await capture('ongoing');
  if([769,1099].includes(width)){
   mode=width===769?'ongoing':'empty';if(width===1099)await page.reload({waitUntil:'networkidle'});
   for(let n=0;n<4;n++){await page.waitForTimeout(n===3?3000:100);await capture('repeat-'+n);}
   // Compare a cold reload, scrolling raster tiles into view, and a viewport invalidation.
   await page.reload({waitUntil:'networkidle'});await capture('reload');
   await page.evaluate(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=800){scrollTo(0,y);await new Promise(requestAnimationFrame);}scrollTo(0,0);await new Promise(requestAnimationFrame);});await capture('scroll-warm');
   await page.setViewportSize({width:width+1,height:1000});await page.setViewportSize({width,height:1000});await capture('resize-reset');
  }
  await page.close();console.log(label,width);
 }
 fs.writeFileSync(path.join(dir,'probe.json'),JSON.stringify(result,null,2));
 const release=await fetch('https://preview.ekebitola.org/release-id.txt',{signal:AbortSignal.timeout(45000)});result.stagingRelease={status:release.status,body:await release.text()};
 if(label==='tailwind'){
  result.staging=[];
  for(const width of [769,1099]){
   const page=await browser.newPage({viewport:{width,height:1000},deviceScaleFactor:1,reducedMotion:'reduce',locale:'en-GB',timezoneId:'Europe/Skopje',colorScheme:'light'});
   await page.route('**/*',route=>{if(route.request().method()!=='GET')return route.abort();return route.continue();});
   await page.goto('https://preview.ekebitola.org/projects/',{waitUntil:'networkidle'});
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});
   const png=await page.screenshot({fullPage:true,caret:'hide'});fs.writeFileSync(path.join(dir,width+'-staging.png'),png);
   result.staging.push({width,sha256:hash(png),details:await page.evaluate(()=>({title:document.querySelector('h1').innerText,fonts:document.fonts.status,dpr:devicePixelRatio,images:[...document.images].map(i=>({src:i.getAttribute('src'),complete:i.complete,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,rect:i.getBoundingClientRect().toJSON()}))}))});
   await page.close();
  }
  result.stagingAssets={};
  for(const [url,local]of Object.entries(result.assets))if(url.startsWith('/assets/')){const response=await fetch('https://preview.ekebitola.org'+url,{signal:AbortSignal.timeout(45000)});const body=Buffer.from(await response.arrayBuffer()),sha256=hash(body);result.stagingAssets[url]={status:response.status,sha256,matchesLocal:sha256===local.sha256,...(url.endsWith('.svg')?{matchesLocalIgnoringCRLF:hash(Buffer.from(body.toString().replace(/\r\n/g,'\n')))===local.lfSha256}:{})};}
 }
 fs.writeFileSync(path.join(dir,'probe.json'),JSON.stringify(result,null,2));
 console.log('Saved',result.cases.length,'diagnostic captures',rendering);
 if(result.errors.length)throw Error(JSON.stringify(result.errors));
}finally{await browser?.close();server.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
}
