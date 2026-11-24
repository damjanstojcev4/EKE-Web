// Read-only A/B evidence. References are never written. Run browser jobs serially.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {spawn} = require('node:child_process');
const {chromium} = require('../Frontend/ece-website/node_modules/@playwright/test');
const {PNG} = require('../Frontend/ece-website/node_modules/playwright-core/lib/utilsBundle.js');
const root = path.resolve(__dirname, '../Frontend/ece-website');
const intel = process.argv.includes('--intel');
const staging = process.argv.includes('--staging');
const label = process.env.PRIVACY_CONTROL_LABEL || 'current';
if (!/^[a-z0-9-]+$/.test(label)) throw Error('Invalid evidence label');
const name = `${label}-${staging?'staging':'local'}-${intel?'intel':'nvidia'}`;
const dir = path.join(__dirname, 'privacy-regression', 'captures', name);
fs.mkdirSync(dir, {recursive:true});
const sha = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
const compare = (reference, buffer) => {
  const a=PNG.sync.read(reference), b=PNG.sync.read(buffer);
  if(a.width!==b.width || a.height!==b.height) throw Error('Image dimensions changed');
  let changedPixels=0, maxChannelDifference=0;
  for(let i=0;i<a.data.length;i+=4){
    let difference=0;
    for(let c=0;c<4;c++) difference=Math.max(difference,Math.abs(a.data[i+c]-b.data[i+c]));
    if(difference) changedPixels++;
    maxChannelDifference=Math.max(maxChannelDifference,difference);
  }
  return {width:b.width,height:b.height,changedPixels,maxChannelDifference};
};
const server = spawn(process.execPath,['scripts/serve.mjs'],{cwd:root,env:{...process.env,PORT:'3207',API_PROXY_TARGET:''},stdio:'pipe'});
(async()=>{let browser;try{
  await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);});
  const args=[intel?'--force_low_power_gpu':'--force_high_performance_gpu'];
  browser=await chromium.launch({channel:'msedge',headless:true,args});
  const session=await browser.newBrowserCDPSession();
  const {gpu}=await session.send('SystemInfo.getInfo');
  await session.detach();
  const result={name,args,browser:browser.version(),renderer:gpu.auxAttributes.glRenderer,backend:gpu.auxAttributes.skiaBackendType,release:null,screens:[]};
  const context=await browser.newContext({deviceScaleFactor:1,reducedMotion:'reduce',locale:'en-GB',timezoneId:'Europe/Skopje',colorScheme:'light'});
  if(staging) result.release=(await(await context.request.get('https://preview.ekebitola.org/release-id.txt')).text()).trim();
  for(const [project,width,height] of [['desktop',1440,1000],['tablet',820,1180],['mobile',390,844]]){
    const page=await context.newPage();await page.setViewportSize({width,height});
    const fonts={};
    page.on('response',async response=>{if(/\.(woff2?|ttf)(\?|$)/.test(response.url()))fonts[new URL(response.url()).pathname]=sha(await response.body());});
    const origin=staging?'https://preview.ekebitola.org':'http://127.0.0.1:3207';
    await page.goto(origin+'/privacy-policy/',{waitUntil:'networkidle'});
    await page.evaluate(async()=>{
      await document.fonts.ready;
      for(let y=0;y<document.body.scrollHeight;y+=600){scrollTo({top:y,behavior:'instant'});await new Promise(r=>requestAnimationFrame(r));}
      await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
      scrollTo({top:0,behavior:'instant'});
    });
    const metadata=await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,scrollY,scrollBehavior:getComputedStyle(document.documentElement).scrollBehavior,font:getComputedStyle(document.body).fontFamily,fonts:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight})),article:{width:document.querySelector('article').getBoundingClientRect().width,height:document.querySelector('article').getBoundingClientRect().height},background:getComputedStyle(document.querySelector('body>div')).backgroundColor}));
    const actual=await page.screenshot({path:path.join(dir,project+'.png'),fullPage:true,animations:'disabled'});
    const reference=fs.readFileSync(path.join(root,'tests/visual/snapshots/win32',project,'privacy-policy.png'));
    const archived=fs.readFileSync(path.join(__dirname,'tailwind-baseline',project+'-privacy-policy.png'));
    if(!reference.equals(archived)) throw Error('Approved and archived reference differ');
    const comparison={project,referenceSha256:sha(reference),actualSha256:sha(actual),...compare(reference,actual),metadata,fontFiles:fonts};
    result.screens.push(comparison);console.log(project,comparison.changedPixels);
    await page.close();
  }
  fs.writeFileSync(path.join(__dirname,'privacy-regression',name+'.json'),JSON.stringify(result,null,2));
  if(result.screens.some(s=>s.changedPixels))process.exitCode=1;
}finally{await browser?.close();server.kill();}})().catch(error=>{console.error(error);process.exitCode=1;});
