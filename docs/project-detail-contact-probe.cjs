// Instrument the existing Contact sequence without editing its harness or UI.
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.join(__dirname,'..'),file=path.join(__dirname,'project-detail-contact-probe.generated.cjs');if(fs.existsSync(file))throw Error('Unexpected generated probe already exists');
let code=fs.readFileSync(path.join(__dirname,'contact-check.cjs'),'utf8').replace(/\r\n/g,'\n');
code=code.replace("dir=path.join(base,phase+(real?'-real':'-software')+(edges?'-edges':''))","dir=path.join(__dirname,'project-detail-baseline/contact-raster-probe')");
const injection=`
   if(state==='download-focus'){
    const frames=[];const metrics=()=>page.evaluate(()=>({scrollX,scrollY,width:innerWidth,height:innerHeight,dpr:devicePixelRatio,focus:document.activeElement.outerHTML,elements:[...document.querySelectorAll('.header,.header *,main img,a[download]')].map(e=>({tag:e.tagName,rect:e.getBoundingClientRect().toJSON(),styles:Object.fromEntries([...getComputedStyle(e)].map(k=>[k,getComputedStyle(e).getPropertyValue(k)]))}))}));
    const take=async(name,options={})=>{const bytes=await page.screenshot({fullPage:true,caret:'hide',...options});fs.writeFileSync(path.join(dir,name+'.png'),bytes);frames.push({name,sha256:hash(bytes),matchesReference:hash(bytes)===reference.captures[key],metrics:await metrics()});};
    await take('initial');await page.waitForTimeout(1000);await take('wait');await take('animations-disabled',{animations:'disabled'});await page.bringToFront();await take('foreground');
    const geometry=await metrics(),viewport=page.viewportSize();const restore=async()=>page.evaluate(async g=>{scrollTo({left:g.scrollX,top:g.scrollY,behavior:'instant'});await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame)},geometry);
    await restore();await take('scroll-reset');
    await page.setViewportSize({...viewport,width:viewport.width+1});await page.screenshot({fullPage:true});await page.setViewportSize(viewport);await restore();await take('width-reset');
    await page.setViewportSize({...viewport,height:viewport.height+1});await page.screenshot({fullPage:true});await page.setViewportSize(viewport);await restore();await take('height-reset');
    const data={reference:reference.captures[key],frames};fs.writeFileSync(path.join(dir,'probe.json.gz'),gzipSync(JSON.stringify(data)));fs.writeFileSync(path.join(dir,'summary.json'),JSON.stringify(frames.map(({metrics,...f})=>({...f,scrollY:metrics.scrollY,width:metrics.width,height:metrics.height})),null,2));console.log(frames.map(({metrics,...f})=>f));throw Error('Probe complete');
   }
`;
code=code.replace('  };\n  const check=',injection+'  };\n  const check=');
code=code.replace('.catch(e=>{console.error(e);process.exitCode=1});','.catch(e=>{if(e.message!=="Probe complete"){console.error(e);process.exitCode=1}});');
if(!code.includes("throw Error('Probe complete')"))throw Error('Probe injection failed');
try{fs.writeFileSync(file,code);const r=spawnSync(process.execPath,[path.join(__dirname,'project-detail-edge.cjs'),file,'after','--real'],{cwd:root,stdio:'inherit',timeout:180000});if(r.error)throw r.error;process.exitCode=r.status??1;}finally{fs.unlinkSync(file);}
