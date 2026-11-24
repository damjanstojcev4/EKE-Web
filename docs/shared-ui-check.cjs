// Read-only real API forwarding. No fixtures or CMS mutations.
const {chromium}=require('../Frontend/ece-website/node_modules/@playwright/test');
const http=require('node:http');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const phase=process.argv[2];
if(!['before','control','divider','stripe','button'].includes(phase))throw Error('Use before/control/divider/stripe/button');
const recheck=process.argv.includes('--recheck');
const software=process.argv.includes('--software');
const base=path.join(__dirname,'shared-ui'),dir=path.join(base,phase+(software?'-software':'')+(recheck?'-recheck':''));
fs.mkdirSync(dir,{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
let result;
const exportRoot=path.join(__dirname,'../Frontend/ece-website/out');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf','.woff2':'font/woff2','.json':'application/json'};
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://127.0.0.1:3203');
 if(url.pathname.startsWith('/api/')){
  if(req.method!=='GET'){res.writeHead(405).end();return;}
  const key=url.pathname+url.search,response=await fetch('https://preview.ekebitola.org'+key,{signal:AbortSignal.timeout(45000)}),body=Buffer.from(await response.arrayBuffer());
  const value={status:response.status,sha256:sha(body)};
  if(result.api[key]&&JSON.stringify(result.api[key])!==JSON.stringify(value))result.errors.push('API drift '+key);
  result.api[key]=value;
  res.writeHead(response.status,{'Content-Type':response.headers.get('content-type')||'application/octet-stream','Cache-Control':'no-store'}).end(body);return;
 }
 let file=path.resolve(exportRoot,'.'+decodeURIComponent(url.pathname));
 if(!file.startsWith(exportRoot+path.sep)&&file!==exportRoot){res.writeHead(403).end();return;}
 if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'}).end(fs.readFileSync(file));
}catch(error){if(req.url.startsWith('/api/')){result.errors.push(error.message);res.writeHead(502).end();}else res.writeHead(404,{'Content-Type':'text/html'}).end(fs.readFileSync(path.join(exportRoot,'404.html')))}});
(async()=>{let browser;try{
 await new Promise((ok,no)=>{server.listen(3203,'127.0.0.1',ok);server.once('error',no)});
 browser=await chromium.launch({channel:'msedge',args:software?['--disable-gpu']:[]});
 result={browser:browser.version(),software,release:null,api:{},captures:{},computed:{},paintRetries:{},errors:[]};
 const reference=phase==='before'?null:JSON.parse(fs.readFileSync(path.join(base,'before'+(software?'-software':'')+'/manifest.json')));
 const context=await browser.newContext({deviceScaleFactor:1,reducedMotion:'reduce',locale:'en-GB',timezoneId:'Europe/Skopje',colorScheme:'light'});
 result.release=(await(await context.request.get('https://preview.ekebitola.org/release-id.txt')).text()).trim();
 const props=['display','position','height','width','min-height','max-width','left','right','top','bottom','margin-top','margin-left','padding-top','padding-bottom','padding-left','padding-right','gap','font-family','font-size','font-weight','line-height','text-transform','white-space','text-align','background-color','color','border-top-width','border-top-style','border-top-color','border-radius','opacity','transform','pointer-events','z-index','flex','outline','outline-offset','filter'];
 for(const [label,width,height]of [['desktop',1440,1000],['tablet',820,1180],['mobile',390,844]]){
  let page;
  const save=async(key,locator)=>{
   let buffer=locator?await locator.screenshot():await page.screenshot({fullPage:true});
   // Like a screenshot assertion, allow a bounded paint-settling period; still
   // require the exact original bytes. Never mask pixels or alter references.
   const deadline=Date.now()+5000;let attempts=0;
   while(!locator&&reference&&sha(buffer)!==reference.captures[key]&&Date.now()<deadline){await page.waitForTimeout(100);buffer=await page.screenshot({fullPage:true});attempts++;}
   result.paintRetries[key]=attempts;fs.writeFileSync(path.join(dir,key+'.png'),buffer);result.captures[key]=sha(buffer);
  };
  for(const route of ['/','/homepage-preview/','/about/','/projects/','/projects/unavailable/','/news/','/news/unavailable/','/training/','/opportunities/','/contact/','/privacy-policy/']){
   const name=label+'-'+(route.split('/').filter(Boolean).join('-')||'home');
   if(recheck&&!['desktop-homepage-preview','desktop-opportunities','tablet-home','tablet-homepage-preview'].includes(name))continue;
   if(page)await page.close();
   page=await context.newPage();await page.setViewportSize({width,height});
   page.on('pageerror',e=>result.errors.push(e.message));
   console.log(phase,name);
   const expected=route==='/'||route==='/homepage-preview/'?'/api/news/homepage':route==='/projects/'?'/api/projects/public':route==='/projects/unavailable/'?'/api/projects/slug/unavailable':route==='/news/'?'/api/news/public?':route==='/news/unavailable/'?'/api/news/slug/unavailable':route==='/training/'?'/api/training/sessions':route==='/opportunities/'?'/api/opportunities/public':null;
   const ready=expected?page.waitForResponse(r=>r.url().includes(expected),{timeout:60000}):null;
   await page.goto('http://127.0.0.1:3203'+route,{waitUntil:'domcontentloaded',timeout:30000});
   console.log('loaded',name);
   if(ready){await ready;console.log('api',name);await page.waitForFunction(()=>![...document.querySelectorAll('main [role=status]')].some(e=>e.checkVisibility()&&e.textContent.startsWith('Loading')),{},{timeout:10000});}
   await page.evaluate(async()=>{await document.fonts.ready;const total=document.body.scrollHeight;for(let y=0;y<total;y+=600){scrollTo(0,y);await new Promise(r=>requestAnimationFrame(r))}await Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);scrollTo(0,0)});
   console.log('ready',name);
   await page.waitForTimeout(300);
   await page.mouse.move(0,0);await save(name);
   const elements=page.locator('.original-divider, .stripe, .stripe > span, a.button, a.button .original-arrow img');
   result.computed[name]=await elements.evaluateAll((els,props)=>els.map(e=>({tag:e.tagName,src:e.getAttribute('src'),href:e.getAttribute('href'),styles:Object.fromEntries(props.map(p=>[p,getComputedStyle(e).getPropertyValue(p)]))})),props);
   const buttons=page.locator(recheck?'a.__skip_states':'a.button');
   for(let i=0;i<await buttons.count();i++){
    const el=buttons.nth(i),key=name+'-button'+i;
    for(const state of ['normal','hover','focus','active']){
     await page.mouse.move(0,0);await el.evaluate(e=>e.blur());await el.scrollIntoViewIfNeeded();
     if(state==='hover'||state==='active')await el.hover();
     if(state==='focus'){await page.keyboard.press('Tab');await el.focus();}
     if(state==='active')await page.mouse.down();
     await save(key+'-'+state,el);
     result.computed[key+'-'+state]=await el.evaluate((e,props)=>({focusVisible:e.matches(':focus-visible'),active:e.matches(':active'),styles:Object.fromEntries(props.map(p=>[p,getComputedStyle(e).getPropertyValue(p)])),arrowFilter:getComputedStyle(e.querySelector('img')).filter,tag:e.tagName,href:e.getAttribute('href')}),props);
     if(state==='active'){await page.mouse.move(0,0);await page.mouse.up();}
    }
   }
   // Actual persisted project cards: check Past too, without altering records.
   if(route==='/projects/'){
    await page.getByRole('button',{name:'Past',exact:true}).click();
    await page.evaluate(async()=>{const total=document.body.scrollHeight;for(let y=0;y<total;y+=600){scrollTo(0,y);await new Promise(r=>requestAnimationFrame(r))}await Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);scrollTo(0,0)});
    await save(name+'-past');
   }
  }
  await page?.close();
 }
 result.releaseAfter=(await(await context.request.get('https://preview.ekebitola.org/release-id.txt')).text()).trim();
 if(result.release!==result.releaseAfter)throw Error('Release changed');
 fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(result,null,2));
 if(phase!=='before'){
  const original=reference;
  if(original.browser!==result.browser||original.software!==result.software)result.errors.push('Browser configuration drift');
  if(original.release!==result.release)result.errors.push('Staging release drift');
  const keys=recheck?Object.keys(result.captures):[...new Set([...Object.keys(original.captures),...Object.keys(result.captures)])];
  const changed=keys.filter(k=>original.captures[k]!==result.captures[k]);
  const computedKeys=recheck?Object.keys(result.computed):[...new Set([...Object.keys(original.computed),...Object.keys(result.computed)])];
  const computed=computedKeys.filter(k=>JSON.stringify(original.computed[k])!==JSON.stringify(result.computed[k]));
  const api=recheck?Object.entries(result.api).every(([k,v])=>JSON.stringify(original.api[k])===JSON.stringify(v)):JSON.stringify(Object.entries(original.api).sort())===JSON.stringify(Object.entries(result.api).sort());
  const summary={phase,browser:result.browser,release:result.release,captures:Object.keys(result.captures).length,changed,computedDifferences:computed,apiUnchanged:api,errors:result.errors};
  fs.writeFileSync(path.join(dir,'comparison.json'),JSON.stringify(summary,null,2));console.log(summary);
  if(changed.length||computed.length||!api||result.errors.length)process.exitCode=1;
 }else console.log({phase,captures:Object.keys(result.captures).length,release:result.release,errors:result.errors});
}finally{await browser?.close();server.closeAllConnections();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
