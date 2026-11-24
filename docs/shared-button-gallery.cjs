// Test-only SSR gallery of the actual component; no application route or API fixture.
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto');
const {spawn}=require('node:child_process');
const root=path.join(__dirname,'../Frontend/ece-website');
const ts=require(path.join(root,'node_modules/typescript'));
const React=require(path.join(root,'node_modules/react'));
const {renderToStaticMarkup}=require(path.join(root,'node_modules/react-dom/server'));
const {chromium}=require(path.join(root,'node_modules/@playwright/test'));
const filename=path.join(root,'src/components/ui.tsx');
const mod=new Module(filename);mod.filename=filename;mod.paths=Module._nodeModulePaths(path.dirname(filename));
mod._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,filename);
const phase=process.argv[2];if(!['before','after'].includes(phase))throw Error('Use before/after');
const native=process.argv.includes('--native'),prefix=native?'native-buttons-':'gallery-';
const dir=path.join(__dirname,'shared-ui/'+prefix+phase);fs.mkdirSync(dir,{recursive:true});
const variants=[];for(const light of [false,true])for(const outline of [false,true])for(const download of [false,true])variants.push({light,outline,download});
const html=variants.map((props,i)=>`<section style="padding:24px;background:${props.light?'#212c5d':'#fff'}">${renderToStaticMarkup(React.createElement(mod.exports.Button,{...props,href:'/contact'},'Variant '+i))}</section>`).join('');
const server=spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:'3204',API_PROXY_TARGET:''},stdio:'pipe'});
(async()=>{let browser;try{
await new Promise((ok,no)=>{server.stdout.once('data',ok);server.once('error',no)});
// These approved Phase 3 images use the Intel adapter, not automatic hybrid-GPU selection.
browser=await chromium.launch({channel:'msedge',args:['--force_low_power_gpu']});const result={browser:browser.version(),variants,captures:{},computed:{}};
for(const [label,width,height]of [['desktop',1440,1000],['tablet',820,1180],['mobile',390,844]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce',deviceScaleFactor:1,locale:'en-GB',timezoneId:'Europe/Skopje'});
 await page.goto('http://127.0.0.1:3204/'+(native?'about/':'privacy-policy/'),{waitUntil:'networkidle'});
 await page.evaluate(async ({html,native})=>{await document.fonts.ready;if(!native)document.body.innerHTML=html;else{const total=document.body.scrollHeight;for(let y=0;y<total;y+=600){scrollTo(0,y);await new Promise(r=>requestAnimationFrame(r))}}await Promise.race([Promise.all([...document.images].map(i=>i.decode().catch(()=>{}))),new Promise(r=>setTimeout(r,3000))]);scrollTo(0,0)},{html,native});
 const buttons=page.locator(native?'button.button':'a.button');
 for(let i=0;i<await buttons.count();i++)for(const state of ['normal','hover','focus','active']){
  const el=buttons.nth(i);await page.mouse.move(0,0);await el.evaluate(e=>e.blur());await el.scrollIntoViewIfNeeded();
  if(state==='hover'||state==='active')await el.hover();if(state==='focus'){await page.keyboard.press('Tab');await el.focus()}if(state==='active')await page.mouse.down();
  const key=`${label}-${i}-${state}`,buffer=await el.screenshot();fs.writeFileSync(path.join(dir,key+'.png'),buffer);result.captures[key]=crypto.createHash('sha256').update(buffer).digest('hex');
  result.computed[key]=await el.evaluate(e=>({tag:e.tagName,href:e.getAttribute('href'),download:e.hasAttribute('download'),focus:e.matches(':focus-visible'),active:e.matches(':active'),css:['display','height','width','background-color','color','border-top-color','font-size','line-height','outline','outline-offset'].map(p=>[p,getComputedStyle(e).getPropertyValue(p)]),arrow:e.querySelector('img').getAttribute('src'),filter:getComputedStyle(e.querySelector('img')).filter}));
  if(native){
   const tooltip=el.locator('..').getByRole('tooltip');
   result.computed[key].ariaDisabled=await el.getAttribute('aria-disabled');
   result.computed[key].tooltipVisible=await tooltip.isVisible();
   if(result.computed[key].tooltipVisible){const image=await tooltip.screenshot();fs.writeFileSync(path.join(dir,key+'-tooltip.png'),image);result.captures[key+'-tooltip']=crypto.createHash('sha256').update(image).digest('hex');}
  }
  if(state==='active'){await page.mouse.move(0,0);await page.mouse.up()}
 }
 if(phase==='after'){
  await buttons.first().focus();await page.keyboard.press('Enter');
  await page.waitForURL(url=>url.pathname===(native?'/about/':'/contact'));
 }
 await page.close();
}
fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(result,null,2));
if(phase==='after'){const before=JSON.parse(fs.readFileSync(path.join(__dirname,'shared-ui/'+prefix+'before/manifest.json')));const changed=Object.keys(before.captures).filter(k=>before.captures[k]!==result.captures[k]),computed=Object.keys(before.computed).filter(k=>JSON.stringify(before.computed[k])!==JSON.stringify(result.computed[k]));const summary={captures:Object.keys(result.captures).length,changed,computedDifferences:computed,keyboardActivation:true};fs.writeFileSync(path.join(dir,'comparison.json'),JSON.stringify(summary,null,2));console.log(summary);if(changed.length||computed.length)process.exitCode=1}else console.log(Object.keys(result.captures).length+' baseline gallery captures');
}finally{await browser?.close();server.kill()}})().catch(e=>{console.error(e);process.exitCode=1});
