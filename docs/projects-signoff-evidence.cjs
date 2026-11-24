// Read-only reference analysis; never changes approved captures or comparison thresholds.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {gunzipSync} = require('node:zlib');
const {PNG} = require('../Frontend/ece-website/node_modules/playwright-core/lib/utilsBundle.js');
const base = path.join(__dirname, 'projects-baseline');
const out = path.join(base, 'signoff');
fs.mkdirSync(out, {recursive:true});
const evidence=path.join(out,'evidence');fs.mkdirSync(evidence,{recursive:true});
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const manifest = dir => JSON.parse(gunzipSync(fs.readFileSync(path.join(base, dir, 'manifest.json.gz'))));
const sets = Object.fromEntries(['before','control','after'].map(dir => [dir,manifest(dir)]));
const findings = [];
for (const key of ['769-ongoing','1099-empty']) {
  const images = Object.fromEntries(Object.keys(sets).map(dir => [dir,PNG.sync.read(fs.readFileSync(path.join(base,dir,key+'.png')))]));
  const a = images.before;
  const comparisons = {};
  let bounds = {left:a.width,top:a.height,right:0,bottom:0};
  const bands = {};
  for (const dir of ['control','after']) {
    const b = images[dir];
    if(a.width!==b.width || a.height!==b.height) throw Error('Dimensions differ');
    const diff = new PNG({width:a.width,height:a.height});
    let pixels = 0, maxChannelDifference = 0;
    for(let i=0;i<a.data.length;i+=4) {
      const delta = Math.max(...[0,1,2,3].map(c=>Math.abs(a.data[i+c]-b.data[i+c])));
      const x=i/4%a.width,y=Math.floor(i/4/a.width);
      if(delta) { pixels++; maxChannelDifference=Math.max(maxChannelDifference,delta); bounds.left=Math.min(bounds.left,x);bounds.right=Math.max(bounds.right,x);bounds.top=Math.min(bounds.top,y);bounds.bottom=Math.max(bounds.bottom,y); if(dir==='after')bands[Math.floor(y/100)*100]=(bands[Math.floor(y/100)*100]||0)+1; }
      diff.data.set(delta?[255,0,128,255]:[245,245,245,255],i);
    }
    fs.writeFileSync(path.join(out,key+'-'+dir+'-diff.png'),PNG.sync.write(diff));
    const changes=[];
    sets.before.computed[key].forEach((el,i)=>{for(const pseudo of ['normal','before','after'])for(const prop of Object.keys(el[pseudo]))if(el[pseudo][prop]!==sets[dir].computed[key][i]?.[pseudo]?.[prop])changes.push({element:i,tag:el.tag,pseudo,prop,reference:el[pseudo][prop],actual:sets[dir].computed[key][i]?.[pseudo]?.[prop]});});
    comparisons[dir]={pixels,maxChannelDifference,computedDifferences:changes,behaviorIdentical:JSON.stringify(sets.before.behavior[key])===JSON.stringify(sets[dir].behavior[key])};
  }
  const pad=12,left=Math.max(0,bounds.left-pad),top=Math.max(0,bounds.top-pad),width=Math.min(a.width,bounds.right+pad+1)-left,height=Math.min(a.height,bounds.bottom+pad+1)-top;
  const sheet=new PNG({width:width*3,height});
  ['before','control','after'].forEach((dir,col)=>{PNG.bitblt(images[dir],sheet,left,top,width,height,col*width,0);});
  fs.writeFileSync(path.join(out,key+'-reference-original-tailwind.png'),PNG.sync.write(sheet));
  const regions=key==='1099-empty'?[{name:'hero',x:0,y:490,width:a.width,height:260},{name:'outputs',x:680,y:3800,width:419,height:240},{name:'partner',x:840,y:6100,width:220,height:130}]:[{name:'partner',x:left,y:top,width,height}];
  for(const r of regions){const detail=new PNG({width:r.width*3,height:r.height});['before','control','after'].forEach((dir,col)=>PNG.bitblt(images[dir],detail,r.x,r.y,r.width,r.height,col*r.width,0));fs.writeFileSync(path.join(evidence,key+'-'+r.name+'-three-way.png'),PNG.sync.write(detail));
   const crop=new PNG({width:r.width,height:r.height}),diff=PNG.sync.read(fs.readFileSync(path.join(out,key+'-after-diff.png')));PNG.bitblt(diff,crop,r.x,r.y,r.width,r.height,0,0);fs.writeFileSync(path.join(evidence,key+'-'+r.name+'-diff.png'),PNG.sync.write(crop));
  }
  const sameHero = {};
  if(key==='1099-empty')for(const dir of ['before','control','after'])for(const state of ['ongoing','past']){const other=PNG.sync.read(fs.readFileSync(path.join(base,dir,'1099-'+state+'.png')));let count=0;for(let y=490;y<750;y++)for(let x=0;x<a.width;x++){const i=(y*a.width+x)*4;if(!images[dir].data.subarray(i,i+4).equals(other.data.subarray(i,i+4)))count++;}sameHero[dir+'-empty-vs-'+state]=count;}
  findings.push({key,dimensions:{width:a.width,height:a.height},bounds,bands,sameHero,comparisons,originalEqualsTailwind:images.control.data.equals(images.after.data),hashes:Object.fromEntries(Object.keys(sets).map(dir=>[dir,hash(fs.readFileSync(path.join(base,dir,key+'.png')))]))});
}
const result={order:['approved reference','unchanged original','Tailwind migration'],renderers:Object.fromEntries(Object.entries(sets).map(([k,v])=>[k,v.rendering])),findings};
fs.writeFileSync(path.join(out,'three-way.json'),JSON.stringify(result,null,2));
const candidates=path.join(out,'review-candidates');fs.mkdirSync(candidates,{recursive:true});
const proposal={status:'REVIEW ONLY — NOT APPLIED',approvedReferencesModified:false,thresholdsModified:false,entries:findings.map(f=>{
 if(!f.originalEqualsTailwind)throw Error('Candidate requires original/migrated byte equality');
 fs.copyFileSync(path.join(base,'after',f.key+'.png'),path.join(candidates,f.key+'.png'));
 return {capture:f.key,approvedSha256:f.hashes.before,proposedSha256:f.hashes.after,localCandidate:'review-candidates/'+f.key+'.png',changedPixels:f.comparisons.after.pixels,maxChannelDifference:f.comparisons.after.maxChannelDifference};
})};
fs.writeFileSync(path.join(out,'reference-update-proposal.json'),JSON.stringify(proposal,null,2));
console.log(JSON.stringify(result,null,2));
