// Independent diagnosis, not a replacement/waiver for the original reference gate.
const fs=require('node:fs'),path=require('node:path'),{gunzipSync}=require('node:zlib');
const base=path.join(__dirname,'projects-baseline'),read=name=>JSON.parse(gunzipSync(fs.readFileSync(path.join(base,name,'manifest.json.gz')))),control=read('control'),after=read('after');
const result={captures:Object.keys(control.captures).length,changed:[],computedDifferences:[],behaviorDifferences:[],requestsUnchanged:JSON.stringify(control.requests)===JSON.stringify(after.requests)};
for(const key of Object.keys(control.captures)){if(control.captures[key]!==after.captures[key])result.changed.push(key);if(JSON.stringify(control.computed[key])!==JSON.stringify(after.computed[key]))result.computedDifferences.push(key);if(JSON.stringify(control.behavior[key])!==JSON.stringify(after.behavior[key]))result.behaviorDifferences.push(key);}
fs.writeFileSync(path.join(base,'control-parity.json'),JSON.stringify(result,null,2));console.log(result);if(result.changed.length||result.computedDifferences.length||result.behaviorDifferences.length||!result.requestsUnchanged)process.exitCode=1;
