import { chromium } from '@playwright/test';
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
const root=path.resolve('out');
async function walk(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const files=await walk(root), routes=files.filter(f=>f.endsWith('index.html')).map(f=>'/' + path.relative(root,path.dirname(f)).split(path.sep).filter(Boolean).join('/') + (path.dirname(f)===root?'':'/'));
const errors=[], refs=new Set();
for(const f of files.filter(f=>/\.(html|css)$/.test(f))) for(const m of (await readFile(f,'utf8')).matchAll(/(?:href|src)="(\/[^"#?]*)|url\(["']?(\/[^)'"?#]*)/g)){const ref=m[1]||m[2];if(!ref.startsWith('//'))refs.add(decodeURIComponent(ref));}
for(const ref of refs){const p=path.join(root,ref);try{await access(p);}catch{try{await access(path.join(p,'index.html'));}catch{errors.push('Missing local reference: '+ref);}}}
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:'3197'},stdio:'pipe'});
let browser;
try{
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',c=>reject(new Error('Server exit '+c)));});
 for(const channel of ['msedge','chrome']){try{browser=await chromium.launch({channel,headless:true});break;}catch{}}
 if(!browser)throw new Error('No installed Edge/Chrome available');
 let checks=0;
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});
  page.on('pageerror',e=>errors.push('Browser: '+e.message));
  page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:3197')&&r.status()>=400)errors.push('HTTP '+r.status()+': '+r.url());});
  for(const route of routes){
   await page.goto('http://127.0.0.1:3197'+route,{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   const result=await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,20));}await new Promise(r=>setTimeout(r,150));return {overflow:document.documentElement.scrollWidth>innerWidth+1,broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src'))};});
   if(result.overflow)errors.push('Overflow '+width+': '+route);
   for(const img of result.broken)errors.push('Broken image '+route+': '+img);
   checks++;
  }
  await page.close();
 }
 if((await fetch('http://127.0.0.1:3197/projects/unknown-migration-test/')).status!==404)errors.push('Unknown slug did not return 404');
 console.log(JSON.stringify({routes:routes.length,viewportChecks:checks,localReferences:refs.size,errors:[...new Set(errors)]},null,2));
 if(errors.length)process.exitCode=1;
}finally{await browser?.close();server.kill();}
