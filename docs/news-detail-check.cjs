const {chromium,expect}=require('../Frontend/ece-website/node_modules/@playwright/test');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawn,execFileSync}=require('node:child_process'),{gzipSync,gunzipSync}=require('node:zlib');
const phase=process.argv[2];if(!['before','after'].includes(phase))throw Error('Use before/after');
const production=process.argv.includes('--production');if(production&&phase!=='after')throw Error('Production mode is comparison-only');
const root=path.join(__dirname,'..'),frontend=path.join(root,'Frontend/ece-website'),base=path.join(__dirname,'news-detail-baseline'),dir=path.join(base,production?'production':phase);
const checkpoint='8ddb6b4ba8cb205d59c2e2f1fddd24f191c496e2';
if(phase==='before'){
 if(fs.existsSync(path.join(dir,'manifest.json.gz')))throw Error('Refusing to overwrite original references');
 expect(execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim()).toBe(checkpoint);
 execFileSync('git',['diff','--exit-code',checkpoint,'--','Frontend/ece-website/src'],{cwd:root,stdio:'pipe'});
}
fs.mkdirSync(dir,{recursive:true});const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const reference=phase==='after'?JSON.parse(gunzipSync(fs.readFileSync(path.join(base,'before/manifest.json.gz')))):null;
const blocks=[{type:'heading',text:'Learning together'},{type:'paragraph',text:[{text:'Ideas become action through '},{text:'shared knowledge',strong:true},{text:'. Explore '},{text:'the project details',strong:true,pendingLink:true},{text:' or '},{text:'our resource',href:'https://example.invalid/resource'},{text:'.'}]},{type:'list',items:[{title:'Community voices',text:'Stories and experiences help new ideas grow.'},{title:'International perspectives',text:'Learning across borders builds lasting connections.'}]},{type:'heading',text:'From ideas to local change'},{type:'paragraph',text:[{text:'A second section preserves body rhythm, wrapping and the final-child spacing rule. '.repeat(4)}]}];
const article={id:1,slug:'unavailable',title:'Community learning across borders',shortDescription:'Shared ideas and new opportunities for our community.',introduction:'People, ideas and communities move forward through non-formal learning and international perspectives.',emphasis:null,category:'LATEST_NEWS',published:true,publishedAt:'2026-11-20T10:00:00Z',instagramUrl:'',placement:'FEATURED',imageUrl:'/api/uploads/news/fixture.png',imageAlt:'Community chess',heroUrl:'/api/uploads/news/fixture.png',heroAlt:'Community chess hero',mediaKind:'AUDIO',mediaUrl:'https://example.invalid/audio',relatedIds:'2,3,4,5',contentJson:JSON.stringify(blocks)};
const project={uuid:'fixture',slug:'unavailable',title:'Community project fixture',description:'A representative project for shared article content.',quickSummary:null,budget:0,status:'ON_GOING',startDate:null,endDate:null,image:null,imageAlt:null,pdfUrl:null,partners:[],programme:null,grantValue:null,currency:null,countries:null,keyAction:null,actionType:null,website:null,topics:null,contentJson:JSON.stringify(blocks),logoFilePath:null,downloadDescription:null,resourcesJson:null,partnerMediaJson:null};
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:frontend,env:{...process.env,PORT:'3210',API_PROXY_TARGET:''},stdio:'pipe'});
(async()=>{let browser;try{
 await new Promise((ok,no)=>{server.stdout.once('data',ok);server.once('error',no)});
 browser=await chromium.launch({channel:'msedge',args:['--force_low_power_gpu']});
 const session=await browser.newBrowserCDPSession(),{gpu}=await session.send('SystemInfo.getInfo');await session.detach();
 const rendering={browser:browser.version(),renderer:gpu.auxAttributes.glRenderer,backend:gpu.auxAttributes.skiaBackendType};
 expect(rendering).toEqual({browser:'158.0.4370.33',renderer:'ANGLE (Intel, Intel(R) UHD Graphics (0x00009BC4) Direct3D11 vs_5_0 ps_5_0, D3D11-27.20.100.9664)',backend:'GaneshGL'});
 const live=await fetch('https://preview.ekebitola.org/api/news/slug/unavailable',{signal:AbortSignal.timeout(45000)});const liveBody=await live.text();expect(live.status).toBe(404);
 const result={checkpoint,rendering,live:{status:live.status,body:liveBody},captures:{},computed:{},behavior:{},requests:[],errors:[]};
 for(const width of [1440,820,390,700,701,768,769,1100,1101]){
  const page=await browser.newPage({viewport:{width,height:width===820?1180:width===390?844:1000},deviceScaleFactor:1,reducedMotion:'reduce',locale:'en-GB',timezoneId:'Europe/Skopje',colorScheme:'light'});
  page.on('pageerror',e=>result.errors.push(e.message));let mode='populated',release;
  await page.route('**/api/**',async route=>{
   const req=route.request(),url=new URL(req.url());expect(req.method()).toBe('GET');
   if(url.pathname==='/api/uploads/news/fixture.png')return route.fulfill({contentType:'image/png',body:fs.readFileSync(path.join(frontend,'public/assets/news-accessible-chess.png'))});
   result.requests.push(url.pathname+url.search);
   if(url.pathname==='/api/projects/slug/unavailable')return route.fulfill({json:project});
   if(/^\/api\/news\/public\/[2-5]$/.test(url.pathname)){const id=Number(url.pathname.split('/').pop());return route.fulfill({json:{...article,id,title:'Related learning story '+id,heroUrl:null,relatedIds:'',shortDescription:'A long related article summary to preserve its expanded presentation. '.repeat(5)}});}
   expect(url.pathname).toBe('/api/news/slug/unavailable');
   if(mode==='loading')await new Promise(ok=>{release=ok});
   if(mode==='unavailable')return route.fulfill({status:live.status,contentType:'application/json',body:liveBody});
   if(mode==='error')return route.fulfill({status:503,json:{message:'Service unavailable'}});
   return route.fulfill({json:mode==='fallback'?{...article,heroUrl:null,imageUrl:null,introduction:null,relatedIds:'',contentJson:'invalid JSON',mediaKind:'VIDEO'}:article});
  });
  const save=async state=>{
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));scrollTo({top:0,behavior:'instant'})});
   const key=width+'-'+state,png=await page.screenshot({fullPage:true,caret:'hide'});fs.writeFileSync(path.join(dir,key+'.png'),png);result.captures[key]=hash(png);
   result.computed[key]=await page.locator('main,main *,footer').evaluateAll(els=>{const props=['display','position','top','left','bottom','right','width','height','min-width','min-height','max-width','max-height','margin-top','margin-right','margin-bottom','margin-left','padding-top','padding-right','padding-bottom','padding-left','gap','grid-template-columns','flex-direction','flex-wrap','align-items','justify-content','font-family','font-size','font-weight','line-height','letter-spacing','text-align','color','background-color','background-image','border-top','border-right','border-bottom','border-left','border-radius','backdrop-filter','mask-image','outline','outline-offset','overflow','object-fit','content','transform','box-shadow','list-style-type','-webkit-line-clamp','-webkit-box-orient'];const read=(e,p)=>Object.fromEntries(props.map(k=>[k,getComputedStyle(e,p).getPropertyValue(k)]));return els.map(e=>({tag:e.tagName,normal:read(e),before:read(e,'::before'),after:read(e,'::after')}));});
   result.behavior[key]=await page.evaluate(()=>({text:document.querySelector('main').innerText,links:[...document.querySelectorAll('main a')].map(a=>({href:a.getAttribute('href'),target:a.getAttribute('target'),rel:a.getAttribute('rel'),label:a.getAttribute('aria-label')})),buttons:[...document.querySelectorAll('main button')].map(b=>({text:b.textContent,expanded:b.getAttribute('aria-expanded'),disabled:b.getAttribute('aria-disabled')})),focus:document.activeElement===document.body?'BODY':document.activeElement.outerHTML.replace(/ class="[^"]*"/g,'')}));
  };
  const go=async url=>{await page.goto('http://127.0.0.1:3210'+url,{waitUntil:'networkidle'})};
  const pending=()=>page.getByRole('button',{name:'Project details (destination unavailable)',exact:true});
  await go('/news/unavailable/');await expect(page.locator('main aside article')).toHaveCount(4);await save('article');
  if([1440,820,390].includes(width)){
   await pending().hover();await expect(page.locator('main [role=status]')).toBeVisible();await save('pending-hover');
   await page.mouse.move(0,0);await pending().focus();await save('pending-focus');await page.keyboard.press('Enter');await page.mouse.move(0,0);await save('pending-open');await page.keyboard.press('Tab');await expect(page.locator('main [role=status]')).not.toBeVisible();await save('pending-blur');
   const share=page.getByRole('navigation',{name:'Share this article'});await expect(share.getByRole('link')).toHaveCount(6);await share.getByRole('link').first().hover();await save('share-hover');await share.getByRole('link').first().focus();await save('share-focus');await page.keyboard.press('Tab');await expect(share.getByRole('link').nth(1)).toBeFocused();
   await page.evaluate(()=>{location.hash='learning'});await expect(share.getByRole('link').first()).toHaveAttribute('href',/learning/);await save('share-hash');
   mode='fallback';await page.reload({waitUntil:'networkidle'});await expect(page.getByText('Further article content has not been supplied.')).toBeVisible();await save('fallback');
   mode='error';await page.reload({waitUntil:'networkidle'});await expect(page.locator('main [role=alert]')).toBeVisible();await save('error');
   mode='unavailable';await page.reload({waitUntil:'networkidle'});await save('unavailable');
   mode='loading';await page.reload({waitUntil:'domcontentloaded'});await expect(page.getByRole('status')).toHaveText('Loading article…');await save('loading');mode='populated';release();await expect(page.locator('main aside article')).toHaveCount(4);
  }
  await go('/projects/unavailable/');await expect(pending()).toBeVisible();await save('project');
  if([1440,820,390].includes(width)){await pending().hover();await save('project-hover');await page.mouse.move(0,0);await pending().focus();await save('project-focus');await page.keyboard.press('Enter');await save('project-open');await page.keyboard.press('Tab');await save('project-blur');}
  if(!production){await go('/phase4b2-component-test/');const toggle=page.getByRole('button',{name:'Show full news summaries',exact:true});await expect(toggle).toHaveAttribute('aria-expanded','false');await save('sidebar');
  if([1440,820,390].includes(width)){await toggle.hover();await save('sidebar-hover');await toggle.focus();await save('sidebar-focus');await page.keyboard.press('Enter');await expect(page.getByRole('button',{name:'Collapse news summaries'})).toHaveAttribute('aria-expanded','true');await save('sidebar-expanded');await page.keyboard.press('Space');await expect(toggle).toHaveAttribute('aria-expanded','false');await save('sidebar-collapsed');}}
  await page.close();console.log(phase,width);
 }
 fs.writeFileSync(path.join(dir,'manifest.json.gz'),gzipSync(JSON.stringify(result)));
 const comparison={captures:Object.keys(result.captures).length,rendering,changed:[],computedDifferences:[],behaviorDifferences:[],requestsUnchanged:!reference||JSON.stringify(reference.requests)===JSON.stringify(result.requests),liveStatusUnchanged:!reference||reference.live.status===result.live.status,errors:result.errors};
 expect(comparison.captures).toBe(production?63:84);
 if(reference)for(const key of Object.keys(result.captures)){if(reference.captures[key]!==result.captures[key])comparison.changed.push(key);if(JSON.stringify(reference.computed[key])!==JSON.stringify(result.computed[key]))comparison.computedDifferences.push(key);if(JSON.stringify(reference.behavior[key])!==JSON.stringify(result.behavior[key]))comparison.behaviorDifferences.push(key);}
 fs.writeFileSync(path.join(dir,'comparison.json'),JSON.stringify(comparison,null,2));console.log(comparison);
 if(comparison.changed.length||comparison.computedDifferences.length||comparison.behaviorDifferences.length||!comparison.requestsUnchanged||!comparison.liveStatusUnchanged||result.errors.length)process.exitCode=1;
}finally{await browser?.close();server.kill()}})().catch(e=>{console.error(e);process.exitCode=1});
