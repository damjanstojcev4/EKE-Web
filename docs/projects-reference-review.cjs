// Explicit two-reference review/update authorized for Phase 4C.1 finalization.
// Pixel ownership below is diagnostic evidence, never a comparison mask.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {createHash}=require('node:crypto'),{gzipSync,gunzipSync}=require('node:zlib');
const {PNG}=require('../Frontend/ece-website/node_modules/playwright-core/lib/utilsBundle.js');
const base=path.join(__dirname,'projects-baseline'),out=path.join(base,'finalization');
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(gunzipSync(fs.readFileSync(p)));
const targets={
 '769-ongoing':{old:'6240ec2f5e75fbf4b9b177c6d6681e8aa0fa17e8321524bf7d195c46537e9082',replacement:'27881d1a2e69460bac0e4e77afb22f898e8a5874fd1dee2fa1454b6f3eb7a98e',pixels:5,max:1},
 '1099-empty':{old:'11e1cbaf5ec68100707e47c63c95da33fd0fd2a9d1ed2d130c3bbb1b055e5029',replacement:'3916b8e11a92db6d2755b30d3212b9ac6d8ebcdcfa00c5023b4e01f95517d119',pixels:4279,max:6}
};
const manifestPath=path.join(base,'before/manifest.json.gz'),originalBytes=fs.readFileSync(manifestPath),reference=read(manifestPath),control=read(path.join(base,'control/manifest.json.gz'));
const source=JSON.parse(fs.readFileSync(path.join(base,'control-summary.json')));
assert.equal(source.sourceHashesVerified,true);assert.equal(source.checkpoint,'53f718e7');
assert.deepEqual(control.rendering,reference.rendering);assert.deepEqual(control.computed,reference.computed);assert.deepEqual(control.behavior,reference.behavior);
assert.deepEqual(control.requests,reference.requests);assert.deepEqual(control.live,reference.live);assert.deepEqual(control.liveMedia,reference.liveMedia);assert.deepEqual(control.errors,[]);
assert.equal(Object.keys(reference.captures).length,81);
assert.deepEqual(Object.keys(reference.captures).filter(key=>reference.captures[key]!==control.captures[key]).sort(),Object.keys(targets).sort());
const probe=read(path.join(base,'signoff/original/probe.json.gz'));
const summary=JSON.parse(fs.readFileSync(path.join(base,'signoff/summary.json')));
assert(summary.cases.every(c=>c.detailsIdentical));
const allowed=new Set(['/assets/projects-page/Rectangle 66.png','/assets/projects-page/Group 648.png','/assets/projects-page/Group 674.png','/assets/group2.svg','/assets/group3.svg','/assets/group4.svg','/assets/group5.svg']);
const review=[];
for(const [key,target]of Object.entries(targets)){
 const oldBytes=fs.readFileSync(path.join(base,'before',key+'.png')),newBytes=fs.readFileSync(path.join(base,'control',key+'.png'));
 assert.equal(hash(oldBytes),target.old);assert.equal(reference.captures[key],target.old);assert.equal(hash(newBytes),target.replacement);assert.equal(control.captures[key],target.replacement);
 const a=PNG.sync.read(oldBytes),b=PNG.sync.read(newBytes);assert.equal(a.width,b.width);assert.equal(a.height,b.height);
 const [width,state]=key.split('-'),geometry=probe.cases.find(c=>c.width===Number(width)&&c.name===state);
 assert(geometry);const artwork=geometry.details.images.filter(i=>allowed.has(i.text));
 let pixels=0,maxChannelDifference=0;const owners={},unowned=[];
 for(let i=0;i<a.data.length;i+=4){const delta=Math.max(...[0,1,2,3].map(c=>Math.abs(a.data[i+c]-b.data[i+c])));if(!delta)continue;
  pixels++;maxChannelDifference=Math.max(maxChannelDifference,delta);const x=i/4%a.width,y=Math.floor(i/4/a.width);
  // Use device-pixel centers: fractional SVG box edges legitimately rasterize
  // into the first/last pixel. Geometry and CSS borders are checked separately.
  const owner=artwork.findLast(e=>x+0.5>=e.x&&x+0.5<e.x+e.width&&y+0.5>=e.y&&y+0.5<e.y+e.height);
  if(!owner)unowned.push({x,y,delta});else owners[owner.text]=(owners[owner.text]||0)+1;
 }
 assert.deepEqual(unowned,[],'A changed pixel is outside the reviewed artwork');assert.equal(pixels,target.pixels);assert.equal(maxChannelDifference,target.max);
 review.push({capture:key,oldSha256:target.old,newSha256:target.replacement,dimensions:{width:a.width,height:a.height},pixels,maxChannelDifference,owners,unownedPixels:unowned,computedAndBehaviorIdentical:true,geometryIdenticalAcrossAll28Probes:true});
}
fs.mkdirSync(out,{recursive:true});
const decision={decision:'APPROVED for the two named raster-only references',authorization:'User finalization request following investigation checkpoint 5cb647c7',sourceCheckpoint:'53f718e7308ddb3e4bc59f45a6ec7ce12e7e02fd',renderer:control.rendering,sourceVerification:source,review,applicationChanged:false,thresholdsChanged:false,other79ReferencesChanged:false};
fs.writeFileSync(path.join(out,'reference-review.json'),JSON.stringify(decision,null,2));
if(process.argv.includes('--apply')){
 const archive=path.join(out,'previous-references');fs.mkdirSync(archive,{recursive:true});
 const backup=path.join(archive,'manifest.json.gz');assert(!fs.existsSync(backup),'Refusing to replace the preserved initial manifest');fs.writeFileSync(backup,originalBytes);
 const updated=structuredClone(reference);
 for(const [key,target]of Object.entries(targets)){fs.copyFileSync(path.join(base,'before',key+'.png'),path.join(archive,key+'.png'));fs.copyFileSync(path.join(base,'control',key+'.png'),path.join(base,'before',key+'.png'));updated.captures[key]=target.replacement;}
 const changed=Object.keys(reference.captures).filter(key=>reference.captures[key]!==updated.captures[key]);assert.deepEqual(changed.sort(),Object.keys(targets).sort());
 const onlyCaptures=structuredClone(updated);onlyCaptures.captures=reference.captures;assert.deepEqual(onlyCaptures,reference);
 fs.writeFileSync(manifestPath,gzipSync(JSON.stringify(updated)));
 assert.deepEqual(read(manifestPath),updated);
 for(const [key,sha]of Object.entries(updated.captures))assert.equal(hash(fs.readFileSync(path.join(base,'before',key+'.png'))),sha);
 decision.applied=true;decision.manifestChangesOnly=changed;decision.all81PngHashesVerified=true;
 fs.writeFileSync(path.join(out,'reference-review.json'),JSON.stringify(decision,null,2));
}
console.log(JSON.stringify(decision,null,2));
