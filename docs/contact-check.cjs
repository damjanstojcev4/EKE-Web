const {chromium}=require('../Frontend/ece-website/node_modules/@playwright/test');
const {spawn}=require('node:child_process');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {gzipSync,gunzipSync}=require('node:zlib');
const phase=process.argv[2],real=process.argv.includes('--real'),edges=process.argv.includes('--edges');
if(!['before','after'].includes(phase))throw Error('Use before/after [--real]');
const base=path.join(__dirname,'contact-baseline'),dir=path.join(base,phase+(real?'-real':'-software')+(edges?'-edges':''));
if(phase==='before'&&(fs.existsSync(path.join(dir,'manifest.json'))||fs.existsSync(path.join(dir,'manifest.json.gz'))))throw Error('Refusing to overwrite the pre-migration reference');
fs.mkdirSync(dir,{recursive:true});
const referenceDir=path.join(base,'before'+(real?'-real':'-software'));
const readManifest=dir=>JSON.parse(fs.existsSync(path.join(dir,'manifest.json'))?fs.readFileSync(path.join(dir,'manifest.json'),'utf8'):gunzipSync(fs.readFileSync(path.join(dir,'manifest.json.gz'))).toString());
const reference=phase==='after'?readManifest(referenceDir):null;
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:path.join(__dirname,'../Frontend/ece-website'),env:{...process.env,PORT:'3206',API_PROXY_TARGET:''},stdio:'pipe'});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{let browser;try{
 await new Promise((ok,no)=>{server.stdout.once('data',ok);server.once('error',no)});
 browser=await chromium.launch({channel:'msedge',args:real?[]:['--disable-gpu']});
 const result={browser:browser.version(),real,captures:{},computed:{},behavior:{},errors:[],blocked:[]};
 for(const [width,height]of [[1440,1000],[820,1180],[390,844],[480,1000],[481,1000],[768,1000],[769,1000],[700,1000],[701,1000],[1100,1000],[1101,1000]]){
  if(edges&&![480,481,768,700,701].includes(width))continue;
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce',locale:'en-GB',timezoneId:'Europe/Skopje',colorScheme:'light'});
  page.on('pageerror',e=>result.errors.push(e.message));
  await page.route('**/*',r=>{if(!['GET','HEAD'].includes(r.request().method())||new URL(r.request().url()).pathname.startsWith('/api/')){result.blocked.push({url:r.request().url(),method:r.request().method()});return r.abort()}return r.continue()});
  await page.goto('http://127.0.0.1:3206/contact/',{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;const total=document.body.scrollHeight;for(let y=0;y<total;y+=600){scrollTo({top:y,behavior:'instant'});await new Promise(r=>requestAnimationFrame(r))}await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));scrollTo({top:0,behavior:'instant'})});
  const save=async(state)=>{
   const key=width+'-'+state;await page.waitForTimeout(100);
   let png=await page.screenshot({fullPage:true,caret:'hide'});
   const end=Date.now()+3000;while(reference&&hash(png)!==reference.captures[key]&&Date.now()<end){await page.waitForTimeout(100);png=await page.screenshot({fullPage:true,caret:'hide'})}
   fs.writeFileSync(path.join(dir,key+'.png'),png);result.captures[key]=hash(png);
   result.computed[key]=await page.evaluate(()=>{
    const props=['display','position','width','height','min-width','min-height','max-width','margin-top','margin-bottom','margin-left','margin-right','padding-top','padding-right','padding-bottom','padding-left','grid-template-columns','grid-template-rows','grid-auto-flow','gap','align-items','justify-content','font-family','font-size','font-weight','font-style','line-height','letter-spacing','color','background-color','background-image','border-top','border-right','border-bottom','border-left','border-radius','outline','outline-offset','appearance','opacity','resize','overflow-wrap','text-decoration-line','white-space','list-style','clip-path','content','transform','flex-shrink'];
    const read=(e,pseudo)=>Object.fromEntries(props.map(p=>[p,getComputedStyle(e,pseudo).getPropertyValue(p)]));
    return [...document.querySelectorAll('main,main *, .footer')].map(e=>({tag:e.tagName,id:e.id,normal:read(e),before:read(e,'::before'),placeholder:e.matches('input,textarea')?read(e,'::placeholder'):null}));
   });
   result.behavior[key]=await page.evaluate(()=>({text:document.querySelector('main').innerText,active:document.activeElement.id||document.activeElement.textContent.trim(),fields:[...document.querySelectorAll('form input,form textarea')].map(e=>({id:e.id,name:e.name,type:e.type,value:e.type==='file'?[...e.files].map(f=>({name:f.name,size:f.size})):e.value,checked:e.checked,invalid:e.getAttribute('aria-invalid'),describedBy:e.getAttribute('aria-describedby')}))}));
  };
  const check=async(ok,label)=>{if(!await ok)throw Error(width+': '+label)};
  await check(page.evaluate(()=>document.activeElement===document.body),'initial focus remains on body');
  await save('normal');
  if([1440,820,390].includes(width)){
   const first=page.locator('#firstName'),submit=page.getByRole('button',{name:'Submit',exact:true});
   await first.focus();await save('input-focus');
   const download=page.locator('a[download]');await download.hover();await save('download-hover');
   await page.mouse.move(0,0);await page.keyboard.press('Tab');await download.focus();await save('download-focus');
   await download.hover();await page.mouse.down();await save('download-active');await page.mouse.move(0,0);await page.mouse.up();
   await page.getByRole('button',{name:'Fill in partner information form'}).click();await save('partner-notice');
   await submit.click();await check(page.locator('#firstName-error').isVisible(),'required validation');await check(first.evaluate(e=>e===document.activeElement),'first error focus');await save('required-errors');
   for(const [id,value]of [['firstName','Audit'],['lastName','Test'],['subject','Visual validation']])await page.locator('#'+id).fill(value);
   await page.locator('#email').fill('invalid');await submit.click();await check(page.locator('#email-error').textContent().then(s=>s==='Enter a valid email address.'),'email error');await save('email-error');
   await page.locator('#email').fill('audit@example.invalid');await check(page.locator('#email-error').count().then(n=>n===0),'input clears error');
   await page.locator('input[value=opportunities]').check();await save('radio-selected');
   const files=page.locator('#attachments');await files.focus();await save('upload-focus');
   await files.setInputFiles([{name:'first.pdf',mimeType:'application/pdf',buffer:Buffer.from('test only')},{name:'second.DOCX',mimeType:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',buffer:Buffer.from('test only')}]);await save('file-names');
   await page.locator('#message').fill('Local visual verification only.');await page.locator('#message').focus();await save('message-focus');
   await submit.hover();await save('submit-hover');await submit.click();await check(page.locator('p[role=status][tabindex="-1"]').textContent().then(s=>s==='Preview only: submission is unavailable until integration is complete. Nothing has been sent.'),'preview notice');await save('valid-preview');
   await files.setInputFiles({name:'blocked.exe',mimeType:'application/octet-stream',buffer:Buffer.from('test only')});await submit.click();await check(page.locator('#attachments-error').isVisible(),'file extension rule');await save('invalid-file');
   await files.setInputFiles({name:'oversize.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(5*1024*1024+1)});await submit.click();await check(page.locator('#attachments-error').isVisible(),'file size rule');await save('oversize-file');
   await files.setInputFiles({name:'limit.pdf',mimeType:'application/pdf',buffer:Buffer.alloc(5*1024*1024)});await submit.click();await check(page.locator('#attachments-error').count().then(n=>n===0),'exact 5 MiB accepted');await save('size-limit');
  }
  console.log(phase,real?'real':'software',width);await page.close();
 }
 const serialized=JSON.stringify(result,null,2);
 fs.writeFileSync(path.join(dir,'manifest.json'),serialized);
 fs.writeFileSync(path.join(dir,'manifest.json.gz'),gzipSync(serialized));
 fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify({browser:result.browser,real:result.real,captures:result.captures,computedHashes:Object.fromEntries(Object.entries(result.computed).map(([k,v])=>[k,hash(JSON.stringify(v))]))},null,2));
 // BODY.textContent includes Next's serialized scripts, whose class strings
 // change during styling. Initial body focus is asserted separately above.
 if(reference){const normalized=(value,key)=>key.endsWith('-normal')?{...value,active:'BODY'}:value;const keys=edges?Object.keys(result.captures):Object.keys(reference.captures);const changed=keys.filter(k=>reference.captures[k]!==result.captures[k]);const computed=keys.filter(k=>JSON.stringify(reference.computed[k])!==JSON.stringify(result.computed[k]));const behavior=keys.filter(k=>JSON.stringify(normalized(reference.behavior[k],k))!==JSON.stringify(normalized(result.behavior[k],k)));const summary={browser:result.browser,real,captures:Object.keys(result.captures).length,changed,computedDifferences:computed,behaviorDifferences:behavior,errors:result.errors,blocked:result.blocked};fs.writeFileSync(path.join(dir,'comparison.json'),JSON.stringify(summary,null,2));console.log(summary);if(changed.length||computed.length||behavior.length||result.errors.length||result.blocked.length||reference.browser!==result.browser)process.exitCode=1}else console.log('Baseline captures',Object.keys(result.captures).length);
}finally{await browser?.close();server.kill()}})().catch(e=>{console.error(e);process.exitCode=1});
