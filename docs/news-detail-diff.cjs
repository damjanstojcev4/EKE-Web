const fs=require('node:fs'),z=require('node:zlib'),path=require('node:path');
const read=phase=>JSON.parse(z.gunzipSync(fs.readFileSync(path.join(__dirname,'news-detail-baseline',phase,'manifest.json.gz'))));
const a=read('before'),b=read('after');
for(const key of process.argv.slice(2).length?process.argv.slice(2):['1440-article','390-article','820-fallback']){console.log(key);let count=0;a.computed[key].forEach((el,i)=>{const other=b.computed[key][i];for(const pseudo of ['normal','before','after'])for(const prop of Object.keys(el[pseudo]))if(el[pseudo][prop]!==other[pseudo][prop])if(count++<60)console.log(i,el.tag,pseudo,prop,JSON.stringify(el[pseudo][prop]),'=>',JSON.stringify(other[pseudo][prop]));});}
