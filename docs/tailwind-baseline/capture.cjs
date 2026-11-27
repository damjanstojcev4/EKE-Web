// Audit-only capture helper. Run from repository root with Node; no application edits.
const { chromium } = require('../../Frontend/ece-website/node_modules/@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.BASELINE_URL || 'https://preview.ekebitola.org';
const dir = __dirname;
(async () => {
 const browser = await chromium.launch({channel:'msedge',headless:true});
 const manifest={base,capturedAt:new Date().toISOString(),browser:browser.version(),motion:'reduce',screens:[],errors:[]};
 try {
  for(const [name,width,height] of [['desktop',1440,1000],['tablet',820,1180],['mobile',390,844]]) {
   const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
   page.on('pageerror',e=>manifest.errors.push({name,error:e.message}));
   const save=async(label,fullPage=true)=>{const file=`${name}-${label}.png`;await page.screenshot({path:path.join(dir,file),fullPage});manifest.screens.push({file,url:page.url(),width,height,...await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,unit:getComputedStyle(document.documentElement).getPropertyValue('--u'),headerNav:getComputedStyle(document.querySelector('header nav')).display}))});};
   for(const route of ['/','/projects/','/news/','/contact/','/training/','/about/','/opportunities/','/privacy-policy/']) {
    const response=await page.goto(base+route,{waitUntil:'networkidle',timeout:45000});
    if(response.status()!==200)throw Error(`${route}: HTTP ${response.status()}`);
    await page.evaluate(()=>document.fonts.ready);
    await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,30));}scrollTo(0,0)});
    await save(route==='/'?'home':route.split('/')[1]);
    if(route==='/') {
     await page.locator('.button').first().hover();await save('button-hover',false);
     await page.getByRole('button',{name:'Open navigation menu'}).click();await save('menu',false);
     await page.keyboard.press('Escape');
    }
    if(route==='/projects/') {
     await page.getByRole('button',{name:'Past',exact:true}).click();await save('projects-past');
     const link=page.locator('#project-results a[href^="/projects/"]').first();
     if(await link.count()){await link.click();await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);await save('project-detail');}
    }
    if(route==='/news/') {
     const pending=page.locator('[aria-disabled="true"]').first();if(await pending.count()){await pending.hover();await save('news-pending-hover',false);}
     const link=page.locator('main a[href^="/news/"]').first();if(await link.count()){await link.click();await page.waitForLoadState('networkidle');await page.evaluate(()=>document.fonts.ready);await save('news-detail');}
    }
    if(route==='/contact/') {await page.getByRole('button',{name:'Submit',exact:true}).click();await save('contact-errors');}
   }
   await page.close();
  }
 } finally {fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify(manifest,null,2));await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
