// Establish the new Detail baseline before migration, correcting only accidental
// history-scroll captures. Existing earlier-phase approved references are untouched.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{gzipSync,gunzipSync}=require('node:zlib'),{execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..'),base=path.join(__dirname,'project-detail-baseline'),read=dir=>JSON.parse(gunzipSync(fs.readFileSync(path.join(base,dir,'manifest.json.gz'))));
execFileSync('git',['diff','--exit-code','81ae68bd','--','Frontend/ece-website/src'],{cwd:root});
const before=read('before'),control=read('control'),keys=['390-live','390-loading','820-live'];
assert.deepEqual(Object.keys(before.captures).filter(k=>before.captures[k]!==control.captures[k]).sort(),keys);
assert.deepEqual(before.computed,control.computed);for(const prop of ['requests','fixtures','live','liveList','mediaHashes','routing','rendering','errors'])assert.deepEqual(before[prop],control[prop]);
const review=[];
for(const key of Object.keys(before.captures)){
 if(!keys.includes(key)){assert.deepEqual(before.behavior[key],control.behavior[key]);continue;}
 const original=before.behavior[key],actual=control.behavior[key],normalized=structuredClone(original);assert(original.scrollY>0);assert.equal(actual.scrollY,0);
 const rects=[];
 normalized.images.forEach((image,index)=>{const box=image.box,updated=actual.images[index].box;for(const prop of ['x','left','right','width'])assert.equal(box[prop],updated[prop]);for(const prop of ['y','top'])assert.equal(box[prop]+original.scrollY,updated[prop]);rects.push({old:box,corrected:updated});delete image.box;});
 // DOMRect height/bottom may lose float precision when subtracting a large
 // scroll offset. Exact computed width/height/transform equality is asserted
 // above; future captures still compare every corrected DOMRect field exactly.
 const actualWithoutRects=structuredClone(actual);actualWithoutRects.images.forEach(image=>delete image.box);
 normalized.scrollY=0;assert.deepEqual(normalized,actualWithoutRects);
 review.push({key,oldScrollY:original.scrollY,newScrollY:actual.scrollY,oldSha256:before.captures[key],newSha256:control.captures[key],stylesIncludingDimensionsAndTransformsIdentical:true,documentPositionAndOtherBehaviorIdentical:true,viewportRects:rects});
}
const audit=path.join(base,'initial-capture/scroll-review.json');assert(!fs.existsSync(audit),'Scroll review already applied');
for(const key of keys){fs.copyFileSync(path.join(base,'before',key+'.png'),path.join(base,'initial-capture',key+'.png'));fs.copyFileSync(path.join(base,'control',key+'.png'),path.join(base,'before',key+'.png'));before.captures[key]=control.captures[key];before.behavior[key]=control.behavior[key];}
fs.writeFileSync(path.join(base,'before/manifest.json.gz'),gzipSync(JSON.stringify(before)));
fs.writeFileSync(audit,JSON.stringify({reason:'History scroll restoration raced the full-page capture. New Detail normal-state captures are explicitly at scrollY=0; hover/focus/keyboard retain real scroll.',sourceCheckpoint:'81ae68bd',applicationStylingChanged:false,thresholdsChanged:false,earlierPhaseReferencesChanged:false,review},null,2));console.log(review);
