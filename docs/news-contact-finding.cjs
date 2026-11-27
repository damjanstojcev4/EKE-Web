// Preserve and quantify a prior-suite failure before any subsequent run.
const fs=require('node:fs'),path=require('node:path');
const {PNG}=require('../Frontend/ece-website/node_modules/playwright-core/lib/utilsBundle.js');
const dir=path.join(__dirname,'news-baseline/initial-contact-real');fs.mkdirSync(dir,{recursive:true});
const source=path.join(__dirname,'contact-baseline');
const file='1440-download-focus.png';
const a=PNG.sync.read(fs.readFileSync(path.join(source,'before-real',file)));
const actual=fs.readFileSync(path.join(source,'after-real',file)),b=PNG.sync.read(actual);
if(a.width!==b.width||a.height!==b.height)throw Error('Dimension mismatch');
const pixels=[];let maxChannelDifference=0;
for(let i=0;i<a.data.length;i+=4){const delta=Math.max(...[0,1,2,3].map(c=>Math.abs(a.data[i+c]-b.data[i+c])));if(delta){pixels.push({x:(i/4)%a.width,y:Math.floor(i/4/a.width),before:[...a.data.slice(i,i+4)],after:[...b.data.slice(i,i+4)]});maxChannelDifference=Math.max(maxChannelDifference,delta);}}
const comparison=JSON.parse(fs.readFileSync(path.join(source,'after-real/comparison.json')));
const result={...comparison,changedPixels:pixels.length,maxChannelDifference,pixels};
fs.writeFileSync(path.join(dir,file),actual);fs.writeFileSync(path.join(__dirname,'news-baseline/initial-contact-finding.json'),JSON.stringify(result,null,2));console.log(result);
