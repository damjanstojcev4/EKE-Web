const { chromium }=require('../../Frontend/ece-website/node_modules/@playwright/test');
const fs=require('node:fs'),path=require('node:path');
(async()=>{const b=await chromium.launch({channel:'msedge'});const findings={release:null,routes:[],breakpoints:[]};try{
 const p=await b.newPage({reducedMotion:'reduce'});
 findings.release=(await(await p.request.get('https://preview.ekebitola.org/release-id.txt')).text()).trim();
 for(const route of ['/projects/','/news/','/projects/cre-active/','/news/european-solidarity-corps-hungary/']){
  const errors=[];const listener=r=>{if(r.status()>=400)errors.push({url:r.url(),status:r.status()})};p.on('response',listener);
  const r=await p.goto('https://preview.ekebitola.org'+route,{waitUntil:'networkidle'});
  findings.routes.push({route,status:r.status(),text:(await p.locator('body').innerText()).slice(0,2200),selects:await p.locator('select').evaluateAll(es=>es.map(e=>({label:e.getAttribute('aria-label'),options:[...e.options].map(o=>({label:o.text,value:o.value}))}))),errors});p.off('response',listener);
  if(route==='/news/')for(const [name,width,height]of [['desktop',1440,1000],['tablet',820,1180],['mobile',390,844]]){
   await p.setViewportSize({width,height});await p.locator('select').first().focus();await p.screenshot({path:path.join(__dirname,`${name}-news-category-focus.png`),fullPage:true});
   const options=await p.locator('select option').allTextContents();if(options.length>1){await p.locator('select').selectOption({index:1});await p.waitForTimeout(300);await p.screenshot({path:path.join(__dirname,`${name}-news-category-selected.png`),fullPage:true});}
  }
 }
 findings.releaseAfter=(await(await p.request.get('https://preview.ekebitola.org/release-id.txt')).text()).trim();
 await p.goto('https://preview.ekebitola.org/',{waitUntil:'networkidle'});
 for(const width of [480,481,700,701,768,769,1000,1001,1100,1101,1500,1501]){
  await p.setViewportSize({width,height:1000});findings.breakpoints.push({width,...await p.evaluate(()=>({unit:getComputedStyle(document.documentElement).getPropertyValue('--u'),nav:getComputedStyle(document.querySelector('header nav')).display,scrollWidth:document.documentElement.scrollWidth}))});
 }
}finally{fs.writeFileSync(path.join(__dirname,'staging-findings.json'),JSON.stringify(findings,null,2));await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
