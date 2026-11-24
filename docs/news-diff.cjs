const fs=require('node:fs'),z=require('node:zlib'),p=require('node:path');
const read=phase=>JSON.parse(z.gunzipSync(fs.readFileSync(p.join(__dirname,'news-baseline',phase,'manifest.json.gz'))));
const a=read('before'),b=read('after');
for(const key of process.argv.slice(2).length?process.argv.slice(2):['1440-empty','1440-populated','820-populated','390-populated']){
console.log(key);let count=0;
a.computed[key].forEach((el,i)=>{const other=b.computed[key][i];for(const pseudo of ['normal','before'])for(const prop of Object.keys(el[pseudo]))if(el[pseudo][prop]!==other[pseudo][prop]){if(count++<75)console.log(i,el.tag,pseudo,prop,JSON.stringify(el[pseudo][prop]),'=>',JSON.stringify(other[pseudo][prop]));}});
}
